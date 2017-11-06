---
date: 2017-11-06T01:18:00-06:00
title: PowerShell Script Boilerplate
url: /powershell-script-boilerplate
description: "A walkthrough of my boilerplate PowerShell script and batch file wrapper. Includes argument pass through and exit code bubbling."
tags:
- powershell
---

This post is as much for me as it is for you. I write a lot of PowerShell scripts and they tend to follow a certain pattern. This is my personal boilerplate for PowerShell scripts.

    #Requires -Version 3
    Set-StrictMode -Version Latest
    $ErrorActionPreference = "Stop"

    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    $scriptDir = Split-Path -LiteralPath $PSCommandPath
    $startingLoc = Get-Location
    Set-Location $scriptDir
    $startingDir = [System.Environment]::CurrentDirectory
    [System.Environment]::CurrentDirectory = $scriptDir

    try
    {
        # TODO: Insert script here.
    }
    finally
    {
        Set-Location $startingLoc
        [System.Environment]::CurrentDirectory = $startingDir
        Write-Output "Done. Elapsed time: $($stopwatch.Elapsed)"
    }

## What's going on here?

- Enables `StrictMode` to enforce some best practices. [^1]
  - Prevents use of variables that have not been initialized.
  - Cannot call non-existent properties on objects.
  - Disallows calling a function like a method, e.g., `Do-Something(1 2)` instead of `Do-Something 1 2`.
  - Prohibits creating variables without a name.
- Sets `$ErrorActionPreference` so that unhandled exceptions will halt
  the script execution. By default, PowerShell will roll on when an exceptions
  is thrown and this statement makes my scripts safe by default.
- Set `$scriptDir` to the directory path of the current script.
  This may be different than the working directory.
- Set the working directory to the `$scriptDir` so that relative paths in the script itself can be consistent.
- Most of the time I want to know how long my script takes to run so I include
  a `$stopwatch` that will output the elapsed time when the script finishes.
- The `try...finally` ensures that the elapsed time will output even if the script throws an exception.

> Need to wrap your PowerShells script with a batch file? Grab my [PowerShell batch file wrapper](/powershell-batch-file-wrapper).

[^1]: [Read more about this](http://blogs.technet.com/b/heyscriptingguy/archive/2014/12/03/enforce-better-script-practices-by-using-set-strictmode.aspx) on the "Hey, Scripting Guy!" blog.