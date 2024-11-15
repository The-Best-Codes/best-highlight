#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
README_PATH="$ROOT_DIR/README.md"
BACKUP_PATH="$ROOT_DIR/read-backup"

# Check if README exists
if [ ! -f "$README_PATH" ]; then
    echo "ERROR: README.md not found!"
    exit 1
fi

# Create backup
cp "$README_PATH" "$BACKUP_PATH"

# Replace content with minimal version
echo '[See GitHub Repo for details](https://github.com/The-Best-Codes/best-highlight#readme).' > "$README_PATH"

echo "README.md has been compressed and backed up to read-backup"