#!/bin/sh

set -e

source .venv/bin/activate

nuitka \
  --mode=onefile \
  --show-progress \
  --show-scons \
  --nofollow-import-to=scipy.integrate._lebedev \
  --python-flag=-u \
  --output-dir=out src/parse.py
# --remove-output
