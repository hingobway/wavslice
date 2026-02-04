#!/bin/sh

set -e

python3.13 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
