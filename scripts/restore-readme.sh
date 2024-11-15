#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
README_PATH="$ROOT_DIR/README.md"
BACKUP_PATH="$ROOT_DIR/README.md.backup"

# Check if backup exists
if [ ! -f "$BACKUP_PATH" ]; then
    echo "ERROR: README.md.backup not found!"
    exit 1
fi

# Restore from backup
cp "$BACKUP_PATH" "$README_PATH"

# Verify the restore was successful
if [ $? -eq 0 ]; then
    rm "$BACKUP_PATH"
    echo "README.md has been restored and backup has been removed"
else
    echo "ERROR: Failed to restore README.md"
    exit 1
fi
