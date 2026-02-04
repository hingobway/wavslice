#!/bin/sh

set -e

source .venv/bin/activate

nuitka --mode=onefile --show-progress --show-scons --python-flag=-u \
  --output-dir=out src/parse.py
# --remove-output
