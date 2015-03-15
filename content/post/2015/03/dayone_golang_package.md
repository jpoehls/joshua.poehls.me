---
date: 2015-03-14T10:43:31-06:00
title: Reading Day One journals in Go
slug: dayone-golang-package
tags:
- golang
---

Here's a little gift for my fellow [Day One](http://dayoneapp.com) aficionados who also happen to use [Go](http://golang.org).

**A Go package for reading Day One journal files!**

&#11089; [Source](http://github.com/jpoehls/go-dayone)
&nbsp;
&#11089; [Documentation](http://godoc.org/github.com/jpoehls/go-dayone)

It's as easy as:

```
import "github.com/jpoehls/go-dayone"

j := dayone.NewJournal("/Users/{me}/Dropbox/Apps/Day One/Journal.dayone")

err := j.Read(func(e *Entry, err error) error {
	if err != nil {
		return err
	}

	// Do something with the entry,
	// or return dayone.ErrStopRead to break.
})

if err != nil {
	panic(err)
}
```

Hopefully a trip to the future would reveal a few more features:

- Creating and editing entries
- Photo support