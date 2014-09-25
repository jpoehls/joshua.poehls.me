<#
.SYNOPSIS
Generates a new content page.
#>

$content = @'
---
date: $((Get-Date).ToString('yyyy-MM-ddThh:mm:ssK'))
title: My title
slug: My slug
linkurl: http://google.com
---

My post content
'@

# TODO: Create this post at ../content/post/2014/09/slug.md (use current date)