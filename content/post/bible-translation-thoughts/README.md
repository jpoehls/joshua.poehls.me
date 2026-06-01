# Bible Translation Thoughts - Structure Guide

## Overview

This page displays both **thought cards** (verse-specific observations) and **resource cards** (translation-level bookmarks like PDFs, articles, videos).

## File Structure

### `thoughts.toml`
Contains verse-specific observations with this structure:
```toml
[[translation_key]]
reference = "Book Chapter:Verse"
date = '3 Apr 2026'  # D Mon YYYY format (abbreviated month)
emoji = "good"  # optional: good/disappointing/note/interesting/curious or raw emoji
revision = "ESV 2016"  # optional
text = '''
Your observation text here
'''
```

### `resources.toml`
Contains translation-level resources (PDFs, articles, videos) with this structure:
```toml
[[translation_key]]
title = "Resource Title"
author = "Author Name"  # optional
date = '3 Apr 2026'  # optional, D Mon YYYY format (abbreviated month)
type = "pdf"  # or "video", "link"
url = "https://example.com/resource.pdf"  # or local file like "my-file.pdf"
description = "Brief description shown on card"  # optional
```

**Translation keys:** `lsb`, `esv`, `csb`, `nasb`

## Resource Types

### PDF (`type = "pdf"`)
- Icon: 📄
- Can be a local file in the same directory or external URL
- Example: `url = "csb-2020-changes.pdf"`

### Video (`type = "video"`)
- Icon: 🎥
- YouTube videos automatically show thumbnail preview
- Accepts both formats:
  - `https://www.youtube.com/watch?v=VIDEO_ID`
  - `https://youtu.be/VIDEO_ID`

### Link (`type = "link"`)
- Icon: 🔗
- For articles, blog posts, web pages, or any other URL

## Formatting

Run `./fmt.sh` from the repo root to auto-format both `thoughts.toml` and `resources.toml`. The formatter:
- Normalizes dates to abbreviated month format (e.g., "3 Apr 2026")
- Sorts thoughts by Bible book order, then date
- Sorts resources by date (most recent first), then title
- Enforces consistent attribute ordering

## Adding New Resources

1. Open `resources.toml`
2. Add a new `[[translation_key]]` block with required fields
3. For YouTube videos, just paste the full URL - thumbnail auto-generates
4. For local PDFs, place the PDF in the same directory and reference by filename
5. Run `./fmt.sh` to format

## Shortcode Usage

In `index.md`, include both files:
```
{{< translation_cards src="thoughts.toml" resources="resources.toml" translation="csb" >}}
```

Omit `resources="resources.toml"` if you only want thought cards for that translation.
