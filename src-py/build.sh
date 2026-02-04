#!/bin/sh

set -e

source .venv/bin/activate

nuitka --mode=onefile --show-progress --python-flag=-u \
  --output-dir=out src/parse.py
# --remove-output
