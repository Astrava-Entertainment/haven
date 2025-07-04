# Haven CLI Commands

## haven checkout <version|branch>
Lists available snapshots when no argument is given. With a snapshot hash or file name, it restores the working directory to that version. Integrity of every object is checked using SHA256 before linking from `.haven/objects`.

Example:
```bash
haven checkout 2025-07-05T12-00-00
```

## haven mount
Creates a virtual view of the latest snapshot under `.haven/mount`. Files are symlinked from `.haven/objects` and downloaded on demand if missing locally.

Example:
```bash
haven mount
cd .haven/mount
```
