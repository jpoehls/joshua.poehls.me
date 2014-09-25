<#
.SYNOPSIS
Generates the static site, commits it to git, and pushes to GitHub.
#>

$ErrorActionPreference = "Stop"

$scriptPath = Split-Path -LiteralPath $(if ($PSVersionTable.PSVersion.Major -ge 3) { $PSCommandPath } else { & { $MyInvocation.ScriptName } })

$rootDir = Split-Path $scriptPath
$publicDir = Join-Path $rootDir "public"

# Make sure we are on master
git checkout -f master

# Clean out the public directory
Remove-Item -LiteralPath "$publicDir\*" -Recurse -Force

# Generate the static site
hugo --source=`"$rootDir`"

# Switch to the gh-pages branch
git checkout -f gh-pages

# Remove everything except the .git directory
Remove-Item -LiteralPath "$rootDir\*" -Recurse -Exclude ".git"

# TODO: copy the generated site from the temp folder to here

# Commit all the changes
git add --all
git commit -m "MY COMMIT MESSAGE" # TODO: generate something useful

# Display an info message, including the last commit
Write-Output "gh-pages has been updated. See the log below."
git log -2

# Push changes to the gh-pages branch on GitHub
git push origin gh-pages

# Go back to the master branch
git checkout -f master