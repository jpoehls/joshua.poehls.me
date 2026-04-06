This is the source for my blog, <https://joshua.poehls.me>. It is powered by [Hugo](https://gohugo.io/).

## Recipes

### New Post

```
hugo new post/2026/my-post-slug.md
```

Use `<!--more-->` in the body to explicitly insert a breakpoint between the excerpt and the full article.

Use `tags` metadata as needed.

Use `linkurl` metadata for posts which "share" an external article.

### Typography Styling

Run the local Hugo server with drafts enabled: `hugo server -D`

Load the `/2026/typography-specimen` post which has examples of all the typography used on the site.

Edit `styles.css` for layout and typography. Keep `normalize.css` as the cross-browser baseline.

## License
The content within `content/` and any logos, artwork, or icons are Copyright &copy; Joshua Poehls. You may not reuse anything therein without my permission.

All other directories and files are MIT Licensed. Feel free to use the HTML and CSS as you please.