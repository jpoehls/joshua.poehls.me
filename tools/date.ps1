<#
.SYNOPSIS
Gets the current date formatted for use in a post's front matter.
#>
(Get-Date).ToString('yyyy-MM-ddThh:mm:ssK')