# Bramble Haven Parser
## Introduction
Create a lightweight parser from scratch that reads a custom .havenfs flat text
file and returns a structured in-memory FS representation, the parser is based on line-based grammar, chunk headers, and metadata declarations.

> A lexer and parser for the Haven file format

This project implements a **lexer** and **predictive parser** to process Haven data files. This files describe a virtual file system with elements such as files, metadata, directories, references, and history.

---

## Example Input
A typical `.havenfs` input file looks like this:

```
#CHUNK files 0-999 @0
FILE f1a7e parent=92e1f name=logo.png size=20320 tags=branding,logo
META f1a7e modified=1723472381 created=1723472370 mimetype=image/png

#CHUNK files 1000-1999 @12010
FILE f1b88 parent=92e1f name=screenshot1.png size=50320
META f1b88 modified=1723472381 created=1723472370 mimetype=image/png

#CHUNK directories @25000
DIR 92e1f parent=root name=images

#CHUNK refs @27000
REF f1a7e to=3d93e type=used-by context=thumbnail

#CHUNK history f1a7e
HIST f1a7e 20250625T1230 user=ellie action=created hash=abc123
HIST f1a7e 20250626T1010 user=ellie action=edited hash=def456
```
---
## Output
Parsing the above file produces:
- A **JSON structure** describing all nodes (files, metadata, directories, etc).
- A **readable debug printout** displaying detailed per-node information.

---

### How to Run
Starts the parser locally

```bash
bun run dev
```
This will read the example file located at:
```
fixtures/example.havenfs
```

---
### Running Tests
```bash
bun test
```

## Project Structure
* lexer.ts: Tokenizes `.havenfs` files into structured chunks
* parser.ts: Implements a predictive parser and builds the file system tree
* fixtures.ts: Example `.havenfs` inputs
* test.ts: Unit tests for lexer and parser
