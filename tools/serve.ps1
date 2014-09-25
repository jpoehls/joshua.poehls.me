<#
.SYNOPSIS
Runs the Hugo server.
#>

$scriptPath = Split-Path -LiteralPath $(if ($PSVersionTable.PSVersion.Major -ge 3) { $PSCommandPath } else { & { $MyInvocation.ScriptName } })

hugo --source=`"$(Split-Path $scriptPath)`" serve --watch