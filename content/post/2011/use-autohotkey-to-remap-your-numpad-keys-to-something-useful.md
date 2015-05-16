---
date: 2011-12-14
title: Use AutoHotkey to remap your numpad keys to something useful
tags:
- windows
- autohotkey
iwpost: https://www.interworks.com/blogs/jpoehls/2011/12/14/how-use-autohotkey-remap-your-numpad-keys-something-useful
---

Are you tired of having to remember that `ALT+0176` is the degree symbol **&deg;** ? Maybe there are other special characters that you want to be able to type easier.

Personally it was the degree symbol that got me, and since I never use my numpad, I decided it would be much more useful if those keys actually entered stuff that I cared about.

Here is a quick tutorial in using AutoHotkey to remap one of your numpad keys to the degree symbol. Of course you can expand on this beginning easily to solve whatever woes you are having.

Start out by going to [the AutoHotkey website](http://www.autohotkey.com).

Download the **AutoHotkey_L** installer. This is the most recent version of AutoHotkey and specifically supports Unicode which is important for us.

{{% img src="/2011/12/autohotkey/Image4.png" caption="Screenshot of the AutoHotkey download page" %}}

Run the installer and leave all the defaults.

{{% img src="/2011/12/autohotkey/Image3.png" caption="Screenshot of the AutoHotkey installer" %}}

Look in your My Documents folder and open up `AutoHotkey.ahk` in a text editor that you can save as UTF-8 in.

If you don't know what this means or don't have an editor that can do this then [download Notepad2](http://www.flos-freeware.ch/notepad2.html) and open the file in that program.

{{% img src="/2011/12/autohotkey/Image5.png" caption="Screenshot of the AutoHotkey.ahk file in Windows Explorer" %}}

Now that you have `AutoHotkey.ahk` opened, delete everything in there (after reading it if you care) and paste the following in its place.

<pre><code>NumpadIns::
Send &deg;
return</code></pre>

Now save this file with **UTF-8** encoding. If you are using Notepad2 you can do this by going to `File | Encoding | UTF-8` and clicking **Yes** to the warning. Then click `File | Save` as usual.

{{% img src="/2011/12/autohotkey/Image.png" caption="Screenshot of saving the file with UTF-8 encoding" %}}

Finally, run the **AutoHotkey** program from your Start Menu.

{{% img src="/2011/12/autohotkey/Image2.png" caption="Screenshot of AutoHotkey in the Start Menu" %}}

### Now to try it out!

Put your focus in any text box. Anywhere. Go ahead. Now make sure you have NumLock turned OFF and hit the `0` key on your numpad.

See what just happened? No, that's not a superscripted zero. That's a degree symbol. Now that they are easy to type you are going to have to learn what it is! ;)

You can get a list of other special key names here: [http://www.autohotkey.com/docs/KeyList.htm](http://www.autohotkey.com/docs/KeyList.htm)

This is just scratching the surface of what you can do with AutoHotkey scripts. Be sure to [read up on the documentation](http://l.autohotkey.net/docs/) for more ideas. Knowledge is power!

Here is a teaser of just a few of the tricks you can do:

* Create global shortcuts to run programs (ex. `CTRL+Z` to open a browser and navigate to a specific website.)
* Replace acronyms or common spelling mistakes (ex. replace "restraunt" -> "restaurant" automatically.)
* Toggle hidden files in Windows Explorer with a shortcut key.