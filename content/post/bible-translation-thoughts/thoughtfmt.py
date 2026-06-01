#!/usr/bin/env python3
from pathlib import Path
import tomlkit
from datetime import datetime
import re

# Canonical order
BIBLE_ORDER = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
    "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther",
    "Job", "Psalm", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel",
    "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
    "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
    "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon",
    "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
]

def normalize_date(date_str):
    """Converts date to 'D Mon YYYY' format (abbreviated month) and returns as a literal string."""
    # Try multiple date formats
    formats = [
        '%d %B %Y',      # "3 April 2026"
        '%d %b %Y',      # "3 Apr 2026"
        '%Y-%m-%d',      # "2026-04-03"
        '%B %d, %Y',     # "April 3, 2026"
        '%b %d, %Y',     # "Apr 3, 2026"
        '%Y',            # "2026" (year only)
    ]

    for fmt in formats:
        try:
            dt = datetime.strptime(date_str.strip().lstrip('0'), fmt)
            # Return abbreviated format: "3 Apr 2026"
            return tomlkit.string(dt.strftime('%d %b %Y').lstrip('0'), literal=True)
        except ValueError:
            continue

    # If no format matches, return original
    return date_str

def sort_key_date(date_str):
    """Normalizes date string to a format strptime expects for sorting purposes."""
    formats = [
        '%d %B %Y',      # "3 April 2026"
        '%d %b %Y',      # "3 Apr 2026"
        '%Y-%m-%d',      # "2026-04-03"
        '%B %d, %Y',     # "April 3, 2026"
        '%b %d, %Y',     # "Apr 3, 2026"
        '%Y',            # "2026" (year only)
    ]

    for fmt in formats:
        try:
            # Handle dates that might not be zero-padded
            if fmt in ['%d %B %Y', '%d %b %Y']:
                padded_date = ' '.join([date_str.split()[0].zfill(2)] + date_str.split()[1:])
                return datetime.strptime(padded_date, fmt)
            else:
                return datetime.strptime(date_str.strip(), fmt)
        except (ValueError, IndexError):
            continue

    # Fallback to epoch if parsing fails
    return datetime(1900, 1, 1)

def get_bible_sort_key(reference):
    match = re.match(r"(\d?\s?[A-Za-z]+)\s+(\d+)(?::(\d+))?([a-zA-Z]*)?", reference)
    if not match: return (999, 0, 0, "")
    book_name, chapter, verse, suffix = match.groups()
    try: book_index = BIBLE_ORDER.index(book_name)
    except ValueError: book_index = 998
    return (book_index, int(chapter), int(verse or 0), suffix or "")

def process_toml_file(file_path, preferred_order, sort_fn=None):
    """Generic function to process, sort, and format a TOML file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        data = tomlkit.parse(f.read())

    # 1. Flatten
    all_entries = []
    for translation, entries in data.items():
        for entry in entries:
            entry['_translation_key'] = translation
            all_entries.append(entry)

    # 2. Sort (if sort function provided)
    if sort_fn:
        all_entries.sort(key=sort_fn)

    # 3. Regroup and Reorder
    new_data = tomlkit.table()

    for entry in all_entries:
        trans_key = entry.pop('_translation_key')
        if trans_key not in new_data:
            new_data[trans_key] = tomlkit.aot()

        ordered_entry = tomlkit.table()
        for key in preferred_order:
            if key in entry:
                val = entry[key]
                if key == 'date':
                    val = normalize_date(val)
                ordered_entry[key] = val
        for key in entry:
            if key not in preferred_order:
                ordered_entry[key] = entry[key]
        new_data[trans_key].append(ordered_entry)

    # 4. Format
    sorted_toml_content = tomlkit.dumps(new_data)
    formatted_output = re.sub(r'(\n)(\[\[)', r'\1\n\2', sorted_toml_content)
    formatted_output = re.sub(r'\n{3,}', '\n\n', formatted_output)
    if formatted_output.startswith('\n'):
        formatted_output = formatted_output.lstrip('\n')

    # 5. Save
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(formatted_output)

# Path setup
script_dir = Path(__file__).resolve().parent

# Process thoughts.toml
thoughts_file = script_dir / 'thoughts.toml'
THOUGHTS_ORDER = ['reference', 'date', 'emoji', 'revision', 'text']
process_toml_file(
    thoughts_file,
    THOUGHTS_ORDER,
    sort_fn=lambda e: (
        get_bible_sort_key(e.get('reference', '')),
        sort_key_date(e.get('date', '1 Jan 1900'))
    )
)
print(f"✓ Formatted {thoughts_file.name}")

# Process resources.toml
resources_file = script_dir / 'resources.toml'
RESOURCES_ORDER = ['title', 'author', 'date', 'type', 'url', 'description']
if resources_file.exists():
    process_toml_file(
        resources_file,
        RESOURCES_ORDER,
        sort_fn=lambda e: (
            # Sort by date (most recent first), then title
            sort_key_date(e.get('date', '1 Jan 1900')),
            e.get('title', '')
        )
    )
    print(f"✓ Formatted {resources_file.name}")

print("Formatting complete.")