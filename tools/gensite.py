#!/usr/bin/env python3
"""
Build the static HTML version of the generated Markdown reference
(reference/) using Zensical (modern MkDocs successor), falling back to
MkDocs + Material.

Writes mkdocs.yml (nav is auto-derived from the reference tree so new
service pages are picked up automatically), then builds into site/.
Requires the project venv:

    python3 -m venv .venv && .venv/bin/pip install zensical
"""
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "reference")
DST = os.path.join(ROOT, "site")
MKDOCS_YML = os.path.join(ROOT, "mkdocs.yml")

PAGE_ORDER = [
    ("index", "Overview"),
    ("architecture", "Architecture"),
    ("availability-matrix", "Availability matrix"),
    ("state-variables", "State variables"),
    ("events", "Events"),
    ("errors", "Errors"),
    ("uri-formats", "URI formats"),
    ("payload-formats", "Payload formats"),
    ("http-api", "HTTP / non-SOAP"),
    ("muse-api", "muse API (v1)"),
    ("firmware-differences", "Firmware differences"),
    ("subsystems", "Subsystems"),
]

_TITLE_RE = re.compile(r"^#\s+`?([A-Za-z]+)", re.M)


def _service_label(path, slug):
    try:
        with open(path) as f:
            m = _TITLE_RE.search(f.read(4096))
            if m:
                return m.group(1)
    except OSError:
        pass
    return slug


def build_nav():
    """Nav entries for section pages then the services/ directory."""
    nav = []
    for slug, label in PAGE_ORDER:
        if os.path.exists(os.path.join(SRC, slug + ".md")):
            nav.append((label, slug + ".md"))
    services = []
    sdir = os.path.join(SRC, "services")
    if os.path.isdir(sdir):
        for fn in sorted(os.listdir(sdir)):
            if fn.endswith(".md"):
                slug = fn[:-3]
                services.append(
                    (_service_label(os.path.join(sdir, fn), slug),
                     "services/" + fn))
    return nav, services


def write_config(nav, services):
    lines = [
        "site_name: anacapad SOAP/UPnP reference",
        "site_description: Reverse-engineered SOAP/UPnP surface of "
        "anacapad 86.10-80260 (model-9 / Playbar)",
        "docs_dir: reference",
        "site_dir: site",
        "theme:",
        "  name: material",
        "  features:",
        "    - navigation.sections",
        "    - navigation.top",
        "    - navigation.indexes",
        "    - search.highlight",
        "    - content.action.view",
        "plugins:",
        "  - search",
        "markdown_extensions:",
        "  - tables",
        "  - fenced_code",
        "  - md_in_html",
        "  - toc:",
        "      permalink: true",
        "nav:",
    ]
    for label, path in nav:
        lines.append("  - %s: %s" % (label, path))
    lines.append("  - Services:")
    for label, path in services:
        lines.append("      - %s: %s" % (label, path))
    with open(MKDOCS_YML, "w") as f:
        f.write("\n".join(lines) + "\n")


def _builder():
    """Prefer Zensical; fall back to mkdocs."""
    for name in ("zensical", "mkdocs"):
        venv = os.path.join(ROOT, ".venv", "bin", name)
        if os.path.exists(venv):
            return venv
    return "zensical"


def main():
    if not os.path.isdir(SRC):
        sys.exit("run tools/gendocs.py first (reference/ missing)")
    nav, services = build_nav()
    write_config(nav, services)
    builder = _builder()
    cmd = [builder, "build", "--clean"]
    if os.path.basename(builder) == "mkdocs":
        cmd.append("--strict")
    try:
        r = subprocess.run(cmd, cwd=ROOT)
    except FileNotFoundError:
        sys.exit("zensical/mkdocs not found — install with: "
                 "python3 -m venv .venv && "
                 ".venv/bin/pip install zensical")
    if r.returncode == 0:
        print("wrote %d pages under %s"
              % (len(nav) + len(services), DST))
    sys.exit(r.returncode)


if __name__ == "__main__":
    main()
