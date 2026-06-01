#!/usr/bin/env bash
set -e

echo "--- Running Auto-Formatters ---"

VENV_PATH="./.venv"
REQ_FILE="./requirements.txt"

# 1. Ensure venv exists
if [ ! -d "$VENV_PATH" ]; then
    echo "Creating virtual environment..."
    python3 -m venv "$VENV_PATH"
    "$VENV_PATH/bin/pip" install --upgrade pip
fi

# 2. Sync dependencies
# This installs/updates whatever is in requirements.txt
if [ -f "$REQ_FILE" ]; then
    "$VENV_PATH/bin/pip" install -r "$REQ_FILE"
fi

# 3. Run scripts
SCRIPTS=(
    "content/post/bible-translation-thoughts/thoughtfmt.py"
)

for script in "${SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        echo "Formatting: $script"
        "$VENV_PATH/bin/python3" "$script"
    fi
done

echo "--- Formatting Complete ---"