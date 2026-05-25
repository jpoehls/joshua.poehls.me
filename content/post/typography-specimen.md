---
draft: true
title: "Typography specimen — draft"
slug: typography-specimen
date: 2026-04-05T12:00:00-06:00
tags:
- typography
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Short line.

Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, [quis nostrud exercitation](https://example.com) ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit, John 3:16, esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.[^long]

Nullam non ligula non metus posuere efficitur.[^note1] Quisque aliquam libero ac euismod pulvinar. Nunc luctus tincidunt nunc id ultrices. Ut gravida tincidunt urna, at placerat augue ullamcorper ac. Phasellus et arcu feugiat, gravida lorem et, dictum erat. Cras nec massa dolor. Sed quam metus, [vehicula auctor](https://example.com) porttitor non,[^note2] dictum a metus. Aenean luctus sodales felis, at blandit quam facilisis eu. Etiam varius vel arcu sed volutpat. Phasellus sagittis vitae diam at sagittis. Nulla et blandit elit. Nunc sed ipsum lectus. Maecenas iaculis vehicula rutrum. Praesent ornare, augue id gravida ultricies, mauris massa commodo enim, eget mollis magna libero vel quam. Phasellus rhoncus odio sem. Duis nulla mi, malesuada ut eros nec, sodales consectetur diam. 

[^long]: A footnote with **bold** and `inline code` to check footnote typography.

[^note1]: A compact callout: *italic*, **bold**, and the title’s em dash—if footnotes inherit Spectral 300, this line shows it.

[^note2]: This block is intentionally **dense**. Compare *roman* and *italic* side by side, curly quotes (“double” and ‘single’), the en dash in ranges (pp. 12–14), and the em dash—often typed as two hyphens in plain ASCII.

    Second paragraph: primes for minutes and seconds (12′ 30″), an ellipsis when meaning drifts… and the paragraph indent your stylesheet applies to `.footnotes li` (or equivalent).

    - List inside a footnote: `letter-spacing` on headings vs body
    - Nested emphasis: ***bold italic*** beside `fn main()` in IBM Plex Mono
        - Deeper nest: § 2.3 style *section* markers and *Guillemets* «when you need continental flavor»

    Small caps rarely activate in browser fonts without OpenType features—here you just get whatever **Hugo + CSS** deliver. One more line with a hair space before punctuation: like ? (U+2009 before ?) to stress kerning gaps.

# Level one heading with `codeSpan()` inside

Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Curabitur blandit tempus porttitor. **Strong emphasis** and *italic* and ***both***. A `variable_name` in the flow of text.

## Level two heading with `codeSpan()` inside

Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Curabitur blandit tempus porttitor. **Strong emphasis** and *italic* and ***both***. A `variable_name` in the flow of text.

### Level three — configuring `hugo server --buildDrafts`

Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum.[^nested]

[^nested]: Footnote defining a term: *fermentum* means the usual lorem machinery. See also note [^long].

#### Level four heading

Vestibulum id ligula porta felis euismod semper.

##### Level five

Cras mattis consectetur purus sit amet fermentum.

###### Level six

Quisque aliquam libero ac euismod pulvinar.

---

## Lists

Unordered:

- First item with `code` in the label
- Second item
  - Nested alpha
  - Nested beta with **bold**
- Third item

Ordered:

1. Open the file `config.toml`
2. Adjust `baseURL`
3. Deploy
   1. Nested step one
   2. Nested step two — verify `hugo --minify`

Pretend checklist (plain bullets — same rhythm as a real todo list):

- Draft posts are omitted unless you run `hugo server -D` (or `hugo -D` for a static build)
- Compare spacing before and after figures
- Skim footnotes for weight and size at `.footnotes`

## Blockquotes

Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

> Single-paragraph blockquote. Lorem ipsum dolor sit amet, adipiscing elit. Nulla vitae elit libero, a pharetra augue.

> Blockquote **with a list inside** (pull-quote style):
>
> - First quoted point with `snippets`
> - Second point spanning more words so wrapping and indent interact with the bar
> - Nested detail:
>   - Inner bullet one
>   - Inner bullet two
>
> Closing line after the list still inside the quote.

Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

> Numbered reasoning inside a quote:
>
> 1. Premise with `evidence`
> 2. Lemma
> 3. Conclusion
>
> —Example citation line (KJV-style label) with [a link](https://example.com)

Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Figures (images from existing posts)

{{< img src="/2017/vincent-van-gogh-letters/vgletter.jpg" caption="Facsimile borrowed from the van Gogh letters post — tests caption size and Georama figcaption." >}}

{{< img src="/2014/10/worlds-loudest-sound/krakatoa.jpg" caption="Krakatoa illustration from another archive post — second image to compare vertical rhythm." link="https://example.com" >}}

## Table (markdown)

| Key        | Role                          |
| ---------- | ----------------------------- |
| `body`     | Spectral 300, main reading    |
| `h1`–`h6`  | Georama headings              |
| `pre`/`code` | IBM Plex Mono             |

## Code

Inline: use `const x = 1` sparingly in prose.

Fenced block without language (plain):

```
Lorem ipsum
  indented sample
```

Fenced with a language tag:

```go
package main

import "fmt"

func main() {
	// comment — check IBM Plex Mono against Spectral body
	fmt.Println("hello, typography")
}
```

```powershell
function Get-Specimen {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Path
    )
    Get-Content -LiteralPath $Path
}
```

## Long closing paragraph

Aenean lacinia bibendum nulla sed consectetur. Maecenas faucibus mollis interdum. Donec id elit non mi porta gravida at eget metus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Vestibulum id ligula porta felis euismod semper.[^final]

[^final]: Last footnote: [link inside note](https://example.com) and *italic closure*.
