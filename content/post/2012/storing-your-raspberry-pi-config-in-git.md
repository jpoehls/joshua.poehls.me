---
date: 2012-06-08
title: Storing your Raspberry Pi configuration in Git
tags:
- raspberry-pi
---

Storing your Raspberry Pi's configuration files in Git is a great way to protect yourself from really bad accidents. You get a backup of all your configs and revision control to rollback those nasty changes. Best of all, you don't have to manually create backup copies of each individual file. (`cp rc.conf rc.conf.bak` anyone?)

I should note that I'm running [Arch Linux ARM](http://archlinuxarm.org), but this should apply fairly equally to Debian and other distros.

First, install [Git](http://git-scm.com) (if you haven't already).

```
> pacman -Sy git
```

Arch has a convention of storing all configuration files in `/etc`. So we will initialize our Git repo there.

```
> cd /etc
> git init
```

We only want to store the configuration files that we've actually changed in Git. We'll use a `.gitignore` file for that.

```
> vim .gitignore
```

Here is what mine looks like right now.

```
# Blacklist everything.
*

# Whitelist the files we care about.
!rc.conf
!rc.local
!ntp.conf
!resolv.conf

!ddclient/
!ddclient/ddclient.conf

!nginx/
!nginx/conf/
!nginx/conf/nginx.conf
```

The **!** prefix negates the pattern, basically creating a whitelist. Cool, huh?

Now we can do our initial commit.

```
> git add -A
> git commit -m "Added initial configs."
```

Remember to add any new config files to your `.gitignore` file and always commit your changes!

For added security you should push your repository to [a remote](http://git-scm.com/book/en/Git-Basics-Working-with-Remotes). [BitBucket](http://bitbucket.org) offers free private repositories, if you don't have a paid [Github](http://github.com) account.