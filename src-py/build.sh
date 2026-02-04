#!/bin/sh

set -e

source .venv/bin/activate

nuitka --mode=onefile --output-dir=out src/parse.py
# --remove-output
