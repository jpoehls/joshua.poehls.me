---
title: "Using Unix terminal shortcuts in the Windows command prompt"
date: 2013-02-20T21:52:29-05:00
tags:
- powershell
- windows
- autohotkey
---

Unix terminals have a few basic keyboard shortcuts.

* `CTRL+L` to clear the window
* `CTRL+D` to close the window
* `CTRL+V` to paste text

The Windows command prompt doesn't support these by default but we can fix that with [AutoHotkey](http://www.autohotkey.com).

_If you don't already have it installed, you can follow the steps in [my blog post](/2011/use-autohotkey-to-remap-your-numpad-keys-to-something-useful/)._

Add this magic to your AutoHotkey script to enable these shortcuts in the Windows command prompt and PowerShell.

<pre>#IfWinActive ahk_class ConsoleWindowClass
^L::SendInput , {Esc}cls{Enter}
^D::SendInput , {Esc}exit{Enter}
^V::SendInput , {Raw}%clipboard%
#IfWinActive</pre>

Back away from the mouse, my friends.