import subprocess
import sys
from langdetect import detect_langs
import re

WHITELIST_FILE = "whitelist.txt"
THRESHOLD = 0.8

def load_whitelist():
  with open(WHITELIST_FILE, "r", encoding="utf-8") as f:
    return set(line.strip().lower() for line in f if line.strip())

def get_diff():
  result = subprocess.run(
    ["git", "diff", "--unified=0", "origin/main...HEAD"],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
  )
  print(result.stdout)
  return result.stdout

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
  whitelist = load_whitelist()
  diff = get_diff()
  added_lines = extract_added_lines(diff)
  filtered = clean_and_filter_lines(added_lines, whitelist)
  flagged = detect_spanish(filtered)

  if flagged:
    print("🚫 Spanish detected in the following lines:\n")
    for line, prob in flagged:
      print(f"[{prob:.2f}] {line}")
    sys.exit(1)
  else:
    print("✅ No Spanish detected.")

if __name__ == "__main__":
  main()
