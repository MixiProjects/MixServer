#!/usr/bin/env bash
set -euo pipefail

if ! command -v apt >/dev/null; then
  echo "This script requires apt (Debian/Ubuntu)." >&2
  exit 1
fi

sudo apt update
sudo apt install -y python3 python3-pip

python3 -m pip install --user --upgrade ansible
