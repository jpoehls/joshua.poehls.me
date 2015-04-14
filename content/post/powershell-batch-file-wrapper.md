---
date: 2013-12-18T10:43:31-06:00
title: PowerShell Batch File Wrapper
url: /powershell-batch-file-wrapper
tags:
- powershell
---

Sometimes you want a `.cmd` wrapper for your PowerShell script. Usually for me this is so people who aren't familiar with the command line can double-click to execute the script.

This batch file should be saved alongside your PowerShell script, like so.

	.\
	 |- my_script.ps1
	 |- my_script.cmd

`my_script.cmd` will execute the same named `.ps1` file in the same directory, so `my_script.ps1` in this case. Any arguments passed to `my_script.cmd` will pass-through to the PowerShell script.

    @ECHO OFF

    SET SCRIPTNAME=%~d0%~p0%~n0.ps1
    SET ARGS=%*
    IF [%ARGS%] NEQ [] GOTO ESCAPE_ARGS

    :POWERSHELL
    PowerShell.exe -NoProfile -NonInteractive -NoLogo -ExecutionPolicy Unrestricted -Command "&amp; { $ErrorActionPreference = 'Stop'; &amp; '%SCRIPTNAME%' @args; EXIT $LASTEXITCODE }" %ARGS%
    EXIT /B %ERRORLEVEL%

    :ESCAPE_ARGS
    SET ARGS=%ARGS:"=\"%
    SET ARGS=%ARGS:`=``%
    SET ARGS=%ARGS:'=`'%
    SET ARGS=%ARGS:$=`$%
    SET ARGS=%ARGS:&#123;=`&#123;%
    SET ARGS=%ARGS:}=`}%
    SET ARGS=%ARGS:(=`(%
    SET ARGS=%ARGS:)=`)%
    SET ARGS=%ARGS:,=`,%
    SET ARGS=%ARGS:^%=%

    GOTO POWERSHELL

## What's going on here?

- `%SCRIPTNAME%` variable holds the name of the PowerShell script to execute. `%~d0%~p0%~n0` magic gets the full path of the
  current batch script without the file extension. By specifying the full path of the PowerShell script
  like this we can guarantee that it is always executed from the right place
  no matter what your working directory is.
- Escapes special characters in the arguments so that they are passed to PowerShell as you would expect.
- Runs `PowerShell.exe` with:
    - `-NoProfile` to improve startup performance. Scripts you are distributing
      shouldn't rely on anything in your profile anyway.
    - `-NonInteractive` because usually my scripts don't need input from the user.
    - `-ExecutionPolicy Unrestricted` to ensure that the PowerShell script can
      be executed regardless of the machine's default Execution Policy.
    - `-Command` syntax for executing the command ensures that PowerShell
      returns the correct exit code from your script.
      Using `-Command` with `$ErrorActionPreference = 'Stop'` also ensures that
      errors thrown from your script cause PowerShell.exe to return a failing
      exit code (1). [PowerShell is quite buggy when it comes to bubbling exit 
      codes.](http://zduck.com/2012/powershell-batch-files-exit-codes/)
      This is the safest method I've found.

## Batch file tips

### Special characters in arguments

Remember that certain special characters need to be escaped in arguments passed to the batch file. These characters are: `^  &  <  >  /?`. Note that `/?` is a sequence and is recognized as a help flag when passed to a batch file.

> `my_script.cmd "I ""am"" quoted"` passes a single argument `I "am" quoted` to PowerShell.

> `my_script.cmd "^&<>/?"` passes `^&<>/?`

### Environment variable expansion

Environment variables get automatically expanded in batch file arguments.

> `my_script.cmd %PROGRAMFILES%` passes `C:\Program Files`