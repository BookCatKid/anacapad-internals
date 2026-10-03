#!/usr/bin/env python3
"""
Build the static HTML version of the generated Markdown reference
(reference/) using VitePress.

The site config (title, base, sidebar, search, markdown rules) lives in
reference/.vitepress/config.mts; the sidebar's service list is discovered
from reference/services/ at config-eval time so new generated pages are
picked up automatically. Output goes to site/.

Requires Node.js:

    npm install
    python3 tools/gensite.py      # or: npm run docs:build
"""
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main():
    if not os.path.isdir(os.path.join(ROOT, "node_modules", "vitepress")):
        sys.exit("vitepress not installed; run: npm install")
    r = subprocess.run(["npm", "run", "docs:build"], cwd=ROOT)
    sys.exit(r.returncode)


if __name__ == "__main__":
    main()
