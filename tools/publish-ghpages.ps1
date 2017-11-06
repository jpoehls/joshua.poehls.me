#Requires -Version 3
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Kudos https://stackoverflow.com/a/43354245/31308
function Read-Choice(
    [Parameter(Mandatory)][string]$Message,
    [Parameter(Mandatory)][string[]]$Choices,
    [Parameter(Mandatory)][string]$DefaultChoice,
    [Parameter()][string]$Question
 ) {
     $defaultIndex = $Choices.IndexOf($DefaultChoice)
     if ($defaultIndex -lt 0) {
         throw "$DefaultChoice not found in choices"
     }
 
     $choiceObj = New-Object Collections.ObjectModel.Collection[Management.Automation.Host.ChoiceDescription]
 
     foreach($c in $Choices) {
         $choiceObj.Add((New-Object Management.Automation.Host.ChoiceDescription -ArgumentList $c))
     }
 
     $decision = $Host.UI.PromptForChoice($Message, $Question, $choiceObj, $defaultIndex)
     return $Choices[$decision]
 }

$scriptDir = Split-Path -LiteralPath $PSCommandPath
$startingLoc = Get-Location
Set-Location (Join-Path $scriptDir "../") # set to repo root

try
{
    if (& git status -s) {
        $continue = Read-Choice -Message "Working directory has pending changes" -Question "Continue?" -Choices @("&Yes", "&No") -DefaultChoice "&No"
        if ($continue -eq "&No") {
            Write-Host "Working directory is dirty. Please commit any pending changes."
            exit 1
        }
        else {
            Write-Warning "Working directory pending changes may be committed along with the generated site."
        }
    }

    $remoteName = "origin"
    $branchName = "gh-pages"
    $folderName = "public"

    Write-Host "Deleting old publication from ./$folderName"
    if (Test-Path $folderName) {
        Remove-Item -LiteralPath $folderName -Recurse -Force
    }
    New-Item $folderName -ItemType Directory | Out-Null
    & git worktree prune
    $gitWorktreeDir = Join-Path $scriptDir ".git/worktrees/$folderName"
    if (Test-Path $gitWorktreeDir) {
        Remove-Item -LiteralPath $gitWorktreeDir -Recurse -Force
    }

    Write-Host "Checking out $branchName branch into ./$folderName"
    & git worktree add -B $branchName $folderName "$remoteName/$branchName"

    Write-Host "Removing existing files"
    Remove-Item (Join-Path $folderName "/*") -Force -Recurse
    
    Write-Host "Generating site"
    & hugo
    if ($LASTEXITCODE -ne 0) {
        Write-Host "hugo returned a non-success exit code of $LASTEXITCODE`nPublish cancelled."
        exit 1
    }

    Set-Location $folderName
    Write-Host "Removing excess RSS feeds"
    Remove-Item @("*/feed.xml", "*/*/feed.xml")
    
    $continue = Read-Choice -Message "Ready to commit generated site" -Question "Commit changes to $($branchName)?" -Choices @("&Yes", "&No") -DefaultChoice "&No"
    if ($continue -eq "&Yes") {
        Write-Host "Updating $branchName branch"
        & git add --all
        if ($LASTEXITCODE -ne 0) {
            Write-Host "git add returned a non-success exit code of $LASTEXITCODE`nPublish cancelled."
            exit 1
        }

        & git commit -m "Publishing to $branchName"
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "git commit returned a non-success exit code of $LASTEXITCODE`nPublish cancelled."
        }
        
        Write-Host "Site published. Push $branchName when ready."
        Write-Host "    git push $remoteName $branchName"
    }
    else {
        Write-Host "Site generated but not committed. Commit and push $branchName when ready."
        Write-Host "    cd $folderName"
        Write-Host "    git add --all"
        Write-Host "    git commit"
        Write-Host "    git push $remoteName $branchName"
    }
}
finally
{
    Set-Location $startingLoc
}