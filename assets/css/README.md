# CSS Architecture

This directory contains the site's stylesheet architecture, organized into component-based modules for easier maintenance.

## Structure

```
assets/
├── styles.css                  # Main entry point (imports all modules)
└── css/
    ├── core/                   # Foundation styles
    │   ├── tokens.css          # Design tokens (colors, fonts, spacing)
    │   ├── reset.css           # CSS reset and base styles
    │   ├── typography.css      # Typography utilities
    │   ├── layout.css          # Layout structure
    │   ├── links.css           # Link styles
    │   ├── code.css            # Code block and inline code
    │   ├── blockquotes.css     # Blockquote styles
    │   ├── hr.css              # Horizontal rules
    │   ├── tables.css          # Table styles (booktabs)
    │   └── print.css           # Print media queries
    └── components/             # UI components
        ├── banner.css          # Site banner/header
        ├── footer.css          # Site footer
        ├── taxonomy.css        # Taxonomy pages (tags, categories)
        ├── archives.css        # Archives page
        ├── posts.css           # Blog post styles
        ├── shortcode-parallel.css   # Parallel Bible text shortcode
        ├── shortcode-hebrew.css     # Hebrew text shortcode
        └── shortcode-gallery.css    # Gallery shortcode
```

## Adding New Components

1. Create a new file in `css/components/` for your component
2. Prefix shortcode-specific styles with `shortcode-` (e.g., `shortcode-video.css`)
3. Add an `@import` statement in `assets/styles.css`
4. Use CSS classes scoped to your component (avoid global styles)

## Shortcode Components

Each shortcode should have its own CSS file with clearly scoped class names:

- `shortcode-parallel.css` — Styles for `{{< parallel >}}`, `{{< eng >}}`, `{{< heb >}}`, `{{< grk >}}` shortcodes
- `shortcode-hebrew.css` — Styles for inline `{{< heb >}}` spans (standalone usage)
- `shortcode-gallery.css` — Styles for `{{< gallery >}}` and `{{< galleryimg >}}` shortcodes

## Build Process

Hugo's asset pipeline processes `assets/styles.css`:
1. Resolves all `@import` statements
2. Minifies the output
3. Generates content-hashed filename
4. Adds SRI integrity hash

The processed file is referenced in `layouts/partials/head.html`.

## Units Convention

- **rem** — Font sizes, layout width/padding, vertical rhythm (scales with root / user prefs)
- **em** — Only when size/spacing must track the parent's font-size
- **px** — Borders and focus rings (stay crisp)
- **unitless** — Line-height

## Design Tokens

All design tokens (colors, fonts, spacing) are defined in `css/core/tokens.css` using CSS custom properties (`--variable-name`). Use these tokens instead of hardcoded values for consistency.
