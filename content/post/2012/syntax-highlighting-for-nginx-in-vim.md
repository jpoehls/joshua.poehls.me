---
date: 2012-06-10
title: Syntax highlighting for Nginx in VIM
tags:
- vim
- nginx
description: "Adding syntax highlighting of Nginx config files to VIM is a breeze. Here's how you do it."
---

Thanks to [Evan Miller](http://www.vim.org/scripts/script.php?script_id=1886), adding VIM syntax highlighting for Nginx config files is a breeze.

First, install VIM if you haven't already. On Arch Linux, it goes like this:

```
> pacman -Sy vim
```

Create a folder for your VIM syntax files.

```
> mkdir -p ~/.vim/syntax/
```

Download the syntax highlighting plugin.

```
> curl http://www.vim.org/scripts/download_script.php?src_id=14376 -o ~/.vim/syntax/nginx.vim
```

Add it to VIM's file type definitions. Make sure to adjust the path to your Nginx installation if you need to.

```
> echo "au BufRead,BufNewFile /etc/nginx/conf/* set ft=nginx" >> ~/.vim/filetype.vim
```

Now enable syntax highlighting in your .vimrc file.

```
> echo "syntax enable" >> ~/.vimrc
```

That's it. Now you'll have nice colors when you edit your Nginx configs with VIM!

```
> vim /etc/nginx/conf/nginx.conf
```

{{% img src="/2012/06/nginx-vim-colors.png" caption="Screenshot of VIM with syntax highlighting in an Nginx config file" %}}