#!/usr/bin/env python3
"""
Extract the firmware artifacts catalogued in docs/artifacts.json out of an
unpacked rootfs and copy them into reference/files/ so gensite publishes
them alongside the docs.

Usage:
    ANACAPAD_ROOTFS=/path/to/rootfs-86.10-80260-1-9 python3 tools/extract_artifacts.py

If the rootfs is unavailable the manifest still gets its metadata merged
and entries are marked 'unavailable' so the artifacts page still renders.
"""
import hashlib
import json
import os
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(ROOT, "docs", "artifacts.json")
OUTDIR = os.path.join(ROOT, "reference", "files")

DEFAULT_ROOTFS = os.path.join(ROOT, os.pardir, os.pardir, "artifacts",
                              "downloads", "rootfs-86.10-80260-1-9")
DEFAULT_RAW = os.path.join(ROOT, os.pardir, os.pardir, "artifacts",
                           "downloads")

TEXT_EXTS = {".xml", ".json", ".txt", ".conf", ".toml", ".sh", ".properties",
             ".xsl", ".htm", ".html", ".css", ".js", ".types", ".script",
             ".orig", ".net"}
AUDIO_EXTS = {".mp3", ".ogg", ".wav"}
IMAGE_EXTS = {".png", ".jpg", ".gif"}

# files under these paths come from the unpacked rootfs; "package/" keys
# resolve against the raw update-package directory instead.
PACKAGE_FILES = {
    "package/86.10-80260-1-9-kernel.uImage": "86.10-80260-1-9-raw/86.10-80260-1-9-kernel.uImage",
    "package/86.10-80260-1-9-device-payload.bin": "86.10-80260-1-9-raw/86.10-80260-1-9-device-payload.bin",
    "package/86.10-80260-1-9-preinstall.sh": "86.10-80260-1-9-raw/86.10-80260-1-9-preinstall.sh",
    "package/86.10-80260-1-9-rootfs.squashfs": "86.10-80260-1-9-raw/86.10-80260-1-9-rootfs.squashfs",
    "package/86.10-80260-1-9.upd": "86.10-80260-1-9.upd",
}


def kind_of(path, data):
    ext = os.path.splitext(path)[1].lower()
    if ext in AUDIO_EXTS:
        return "audio"
    if ext in IMAGE_EXTS:
        return "image"
    if ext in TEXT_EXTS:
        return "text"
    try:
        data[:8192].decode("utf-8")
        return "text"
    except (UnicodeDecodeError, AttributeError):
        return "binary"


def main():
    manifest = json.load(open(MANIFEST))
    rootfs = os.environ.get("ANACAPAD_ROOTFS", DEFAULT_ROOTFS)
    rawdir = os.environ.get("ANACAPAD_RAW", DEFAULT_RAW)

    os.makedirs(OUTDIR, exist_ok=True)
    copied = missing = absent = 0
    for rel, ent in sorted(manifest["files"].items()):
        if ent.get("status") == "absent":
            absent += 1
            continue
        src_rel = PACKAGE_FILES.get(rel, rel)
        base = rawdir if rel.startswith("package/") else rootfs
        src = os.path.join(base, src_rel)
        if not os.path.isfile(src):
            ent["status"] = "missing"
            ent.pop("size", None)
            ent.pop("sha256", None)
            missing += 1
            print("missing: %s" % src, file=sys.stderr)
            continue
        dst = os.path.join(OUTDIR, rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        data = open(src, "rb").read()
        ent["size"] = len(data)
        ent["sha256"] = hashlib.sha256(data).hexdigest()
        ent["kind"] = kind_of(rel, data)
        ent["status"] = "shipped" if not rel.startswith("package/") else "package"
        if not os.path.isfile(dst) or open(dst, "rb").read() != data:
            open(dst, "wb").write(data)
        copied += 1

    json.dump(manifest, open(MANIFEST, "w"), indent=1)
    print("extracted %d artifact(s) into %s; %d absent-from-image; %d missing"
          % (copied, os.path.relpath(OUTDIR, ROOT), absent, missing))


if __name__ == "__main__":
    main()
