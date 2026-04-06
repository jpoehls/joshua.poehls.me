#Requires -Version 7.0

[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Kudos https://stackoverflow.com/a/43354245/31308
function Read-Choice {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string] $Message,

        [Parameter(Mandatory)]
        [string[]] $Choices,

        [Parameter(Mandatory)]
        [string] $DefaultChoice,

        [Parameter()]
        [AllowEmptyString()]
        [string] $Question = ''
    )

    $defaultIndex = [Array]::IndexOf($Choices, $DefaultChoice)
    if ($defaultIndex -lt 0) {
        throw "DefaultChoice '$DefaultChoice' not found in Choices: $($Choices -join ', ')"
    }

    $choiceCollection = [System.Collections.ObjectModel.Collection[System.Management.Automation.Host.ChoiceDescription]]::new()
    foreach ($c in $Choices) {
        $null = $choiceCollection.Add(
            [System.Management.Automation.Host.ChoiceDescription]::new($c, $c)
        )
    }

    $decision = $Host.UI.PromptForChoice($Message, $Question, $choiceCollection, $defaultIndex)
    return $Choices[$decision]
}

$startingLoc = Get-Location
$repoRoot = git rev-parse --show-toplevel 2>$null
if (-not $repoRoot) {
    throw 'Not inside a git repository (git rev-parse --show-toplevel failed).'
}
Set-Location -LiteralPath $repoRoot

try {
    $remoteName = 'origin'
    $branchName = 'gh-pages'
    $folderName = 'public'

    #if (& git status -s) {
    #    Write-Host "Working directory is dirty. Please commit any pending changes."
    #    exit 1
    #}

    Write-Host "Deleting old publication from $folderName"
    if (Test-Path -LiteralPath $folderName) {
        Remove-Item -LiteralPath $folderName -Recurse -Force
    }
    $null = New-Item -Path $folderName -ItemType Directory
    git worktree prune

    Write-Host "Checking out $branchName branch into $folderName"
    git worktree add $folderName $branchName

    Write-Host "Removing existing files from $folderName"
    Get-ChildItem -LiteralPath $folderName -Force |
        Where-Object { $_.Name -ne '.git' } |
        Remove-Item -Recurse -Force

    Write-Host 'Generating site'
    hugo --destination $folderName
    if ($LASTEXITCODE -ne 0) {
        Write-Host "hugo returned a non-success exit code of $LASTEXITCODE`nPublish cancelled."
        exit 1
    }

    Push-Location -LiteralPath $folderName
    try {
        Write-Host 'Removing excess RSS feeds (keep root feed.xml only)'
        $rootFeed = Join-Path -Path (Get-Location).Path -ChildPath 'feed.xml'
        Get-ChildItem -Path . -Recurse -File -Filter 'feed.xml' |
            Where-Object { $_.FullName -ne $rootFeed } |
            Remove-Item -Force
    }
    finally {
        Pop-Location
    }

    $continue = Read-Choice -Message 'Ready to commit generated site' -Question "Commit changes to $($branchName)?" -Choices @('&Yes', '&No') -DefaultChoice '&No'
    if ($continue -eq '&Yes') {
        Write-Host "Updating $branchName branch"
        Set-Location -LiteralPath $folderName
        try {
            git add --all
            if ($LASTEXITCODE -ne 0) {
                Write-Host "git add returned a non-success exit code of $LASTEXITCODE`nPublish cancelled."
                exit 1
            }

            git commit -m "Publishing to $branchName"
            if ($LASTEXITCODE -ne 0) {
                Write-Warning "git commit returned a non-success exit code of $LASTEXITCODE`nPublish cancelled."
            }

            $continue = Read-Choice -Message 'Push changes?' -Question "Push to $remoteName $($branchName)?" -Choices @('&Yes', '&No') -DefaultChoice '&No'
            if ($continue -eq '&Yes') {
                git push $remoteName $branchName
                if ($LASTEXITCODE -ne 0) {
                    Write-Warning "git push returned a non-success exit code of $LASTEXITCODE`nPublish cancelled."
                }
                Write-Host "Site published and pushed to $remoteName $($branchName)."
            }
            else {
                Write-Host "Site published. Push $branchName when ready."
                Write-Host "    git push $remoteName $branchName"
            }
        }
        finally {
            Set-Location -LiteralPath $repoRoot
        }
    }
    else {
        Write-Host "Site generated but not committed. Commit and push $branchName when ready."
        Write-Host "    cd $folderName"
        Write-Host '    git add --all'
        Write-Host '    git commit'
        Write-Host "    git push $remoteName $branchName"
    }
}
finally {
    Set-Location -LiteralPath $startingLoc.Path
}
