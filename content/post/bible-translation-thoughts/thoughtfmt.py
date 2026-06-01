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
    """Converts date to 'D Month YYYY' format and returns as a literal string."""
    try:
        # Parse input, stripping existing leading zero if present
        dt = datetime.strptime(date_str.lstrip('0'), '%d %B %Y')
        # Return as literal string to prevent re-parsing/re-padding
        return tomlkit.string(dt.strftime('%d %B %Y').lstrip('0'), literal=True)
    except ValueError:
        return date_str

def sort_key_date(date_str):
    """Normalizes date string to a format strptime expects for sorting purposes."""
    padded_date = ' '.join([date_str.split()[0].zfill(2)] + date_str.split()[1:])
    return datetime.strptime(padded_date, '%d %B %Y')

def get_bible_sort_key(reference):
    match = re.match(r"(\d?\s?[A-Za-z]+)\s+(\d+)(?::(\d+))?([a-zA-Z]*)?", reference)
    if not match: return (999, 0, 0, "")
    book_name, chapter, verse, suffix = match.groups()
    try: book_index = BIBLE_ORDER.index(book_name)
    except ValueError: book_index = 998
    return (book_index, int(chapter), int(verse or 0), suffix or "")

# Path setup
script_dir = Path(__file__).resolve().parent
toml_file = script_dir / 'thoughts.toml'

with open(toml_file, 'r', encoding='utf-8') as f:
    data = tomlkit.parse(f.read())

# 1. Flatten
all_entries = []
for translation, entries in data.items():
    for entry in entries:
        entry['_translation_key'] = translation 
        all_entries.append(entry)

# 2. Sort
all_entries.sort(key=lambda e: (
    get_bible_sort_key(e.get('reference', '')),
    sort_key_date(e.get('date', '1 January 1900'))
))

# 3. Regroup and Reorder
new_data = tomlkit.table()
PREFERRED_ORDER = ['reference', 'date', 'emoji', 'revision', 'text']

for entry in all_entries:
    trans_key = entry.pop('_translation_key')
    if trans_key not in new_data:
        new_data[trans_key] = tomlkit.aot()
    
    ordered_entry = tomlkit.table()
    for key in PREFERRED_ORDER:
        if key in entry:
            val = entry[key]
            if key == 'date':
                val = normalize_date(val)
            ordered_entry[key] = val
    for key in entry:
        if key not in PREFERRED_ORDER:
            ordered_entry[key] = entry[key]
    new_data[trans_key].append(ordered_entry)

# 4. Save and Format
sorted_toml_content = tomlkit.dumps(new_data)
formatted_output = re.sub(r'(\n)(\[\[)', r'\1\n\2', sorted_toml_content)
formatted_output = re.sub(r'\n{3,}', '\n\n', formatted_output)
if formatted_output.startswith('\n'):
    formatted_output = formatted_output.lstrip('\n')

with open(toml_file, 'w', encoding='utf-8') as f:
    f.write(formatted_output)

print("Formatting complete.")