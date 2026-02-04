#!/bin/sh

set -e

source .venv/bin/activate

nuitka --mode=onefile --quiet --show-progress --output-dir=out src/parse.py
# --remove-output
