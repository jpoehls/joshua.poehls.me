---
title: "Tableau via PowerShell, Part 1: Opening Workbooks"
url: 2013/exploring-tableau-workbooks-with-powershell-part-1-opening-workbooks
date: 2013-07-25T22:36:58-05:00
tags:
- powershell
- tableau
iwpost: https://www.interworks.com/blogs/jpoehls/2013/07/25/tableau-powershell-part-1-opening-workbooks
---

In this mini-series I'm going to show you some cookbook style examples for using PowerShell to explore your Tableau workbooks. Follow along, this is going to be fun!

Tableau workbooks (TWB files) are just XML files. Packaged workbooks (TWBX files) are just ZIP files that contain a TWB and various assets, like data extracts for example.

This is wonderful because it means it is very easy to go spelunking through workbook files without a **gui**de.

## Opening Workbooks

I mentioned that TWB files are just XML files and that TWBX files are ZIP files that contain a TWB. This means we need different logic for opening a TWB vs a TWBX. Let's write a simple little PowerShell function to fix that. We'll call this function `Get-TableauWorkbookXml` and it will take a file path and return the workbook's XML. It will abstract away the different ahandling of TWB and TWBX files for us.

> If you find this helpful then check out [TableauKit](/2013/tableaukit-a-powershell-module-for-tableau/);
> a full on PowerShell module for working with Tableau files. It contains a new and improved
> version of the function below and much more.

<pre data-language="powershell">
function Get-TableauWorkbookXml {
&lt;#
.SYNOPSIS
    Gets the workbook XML from a specified TWB or TWBX file.

.PARAMETER Path
    The literal file path of the TWB or TWBX file.

.NOTES
    Author: Joshua Poehls ({{site.url}})
#&gt;
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true, ValueFromPipeline=$true)]
        [string]$Path
    )

    begin {
        $originalCurrentDirectory = [System.Environment]::CurrentDirectory

        # System.IO.Compression.FileSystem requires at least .NET 4.5
        [System.Reflection.Assembly]::LoadWithPartialName("System.IO.Compression") | Out-Null
    }

    process {
        [System.Environment]::CurrentDirectory = (Get-Location).Path
        $extension = [System.IO.Path]::GetExtension($Path)
        if ($extension -eq ".twb") {
            return [xml](Get-Content -LiteralPath $Path)
        }
        elseif ($extension -eq ".twbx") {
            $archiveStream = $null
            $archive = $null
            $reader = $null

            try {
                $archiveStream = New-Object System.IO.FileStream($Path, [System.IO.FileMode]::Open)
                $archive = New-Object System.IO.Compression.ZipArchive($archiveStream)
                $twbEntry = ($archive.Entries | Where-Object { $_.FullName -eq $_.Name -and [System.IO.Path]::GetExtension($_.Name) -eq ".twb" })[0]
                $reader = New-Object System.IO.StreamReader $twbEntry.Open()

                [xml]$xml = $reader.ReadToEnd()
                return $xml
            }
            finally {
                if ($reader -ne $null) {
                    $reader.Dispose()
                }
                if ($archive -ne $null) {
                    $archive.Dispose()
                }
                if ($archiveStream -ne $null) {
                    $archiveStream.Dispose()
                }
            }
        }
        else {
            throw "Unknown file type. Expected a TWB or TWBX file extension."
        }
    }

    end {
        [System.Environment]::CurrentDirectory = $originalCurrentDirectory
    }
}
</pre>

Let's try it out from PowerShell.

`Get-TableauWorkbookXml .\MyWorkbook.twb`

TWBX files are just as easy.

`Get-TableauWorkbookXml .\MyPackagedWorkbook.twbx`

Cool, right? How about opening a bunch of workbooks at once? This is PowerShell after all.

`Get-ChildItem *.twb* | Get-TableauWorkbookXml`

Continue the adventure with [Part 2: Saving Changes](/2013/tableau-via-powershell-part-2-saving-changes/).
