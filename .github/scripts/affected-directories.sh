#!/bin/bash
set -e

# Get list of changed directories in packages/*
changed=$(git diff --name-only origin/main...HEAD | grep '^packages/' | cut -d/ -f1-2 | sort -u)

echo "Changed package directories:"
echo "$changed"

echo "$changed" > changed_packages.txt
