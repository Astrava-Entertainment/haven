import subprocess
import sys
import re
import os
import pathspec
import fnmatch
from langdetect import detect_langs

THRESHOLD = 0.92

##/ Get path of current script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
WHITELIST_FILE = os.path.join(SCRIPT_DIR, ".language-ignore")


def load_whitelist():
    if not os.path.exists(WHITELIST_FILE):
        print(f"Whitelist file not found: {WHITELIST_FILE}. Creating empty one.")
        with open(WHITELIST_FILE, "w", encoding="utf-8") as f:
            pass
        return set(), None

    lines = []
    word_whitelist = set()

    with open(WHITELIST_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "/" in line or "*" in line or line.startswith("!"):
                lines.append(line)
            else:
                word_whitelist.add(line.lower())

    file_spec = pathspec.PathSpec.from_lines("gitwildmatch", lines)
    return word_whitelist, file_spec


def get_changed_files():
    result = subprocess.run(
        ["git", "diff", "--name-only", "origin/main...HEAD"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    return result.stdout.strip().splitlines()

def filter_files(files, pathspec):
    if pathspec is None:
        return files
    return [f for f in files if not pathspec.match_file(f)]

def extract_added_lines(diff):
  added_lines = []
  for line in diff.splitlines():
    if line.startswith("+") and not line.startswith("+++"):
      added_lines.append(line[1:])
  return added_lines

def clean_and_filter_lines(lines, whitelist):
  cleaned = []
  for line in lines:
    # Remove code symbols and numbers, keep only words
    words = re.findall(r'\b\w+\b', line)
    filtered_words = [w for w in words if w.lower() not in whitelist]
    if filtered_words:
      cleaned.append(" ".join(filtered_words))
  return cleaned

def detect_spanish(lines):
  flagged_lines = []
  for line in lines:
    try:
      langs = detect_langs(line)
      for lang in langs:
        if lang.lang == "es" and lang.prob >= THRESHOLD:
          flagged_lines.append((line, lang.prob))
    except Exception:
      continue
  return flagged_lines

def main():
    word_whitelist, file_whitelist = load_whitelist()
    all_changed_files = get_changed_files()
    filtered_files = filter_files(all_changed_files, file_whitelist)

    if not filtered_files:
        print("No files to scan.")
        return

    flagged = []

    for filepath in filtered_files:
        result = subprocess.run(
            ["git", "diff", "--unified=0", "origin/main...HEAD", "--", filepath],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        diff = result.stdout
        added_lines = extract_added_lines(diff)
        cleaned = clean_and_filter_lines(added_lines, word_whitelist)
        flagged += detect_spanish(cleaned)

    if flagged:
        print("Spanish detected in the following lines:\n")
        for line, prob in sorted(set(flagged), key=lambda x: -x[1]):
            print(f"[{prob:.2f}] {line}")
    else:
        print("No Spanish detected. Good Job!!")
