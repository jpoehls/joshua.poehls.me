<#
.SYNOPSIS
    Gets the current local date and time formatted for post front matter (ISO-like with timezone offset).

.NOTES
    Uses 24-hour clock (HH). Requires PowerShell 7+.
#>
#Requires -Version 7.0

Get-Date -Format 'yyyy-MM-ddTHH:mm:ssK'
