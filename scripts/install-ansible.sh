#!/usr/bin/env bash
set -euo pipefail

if ! command -v apt >/dev/null; then
  echo "This script requires apt (Debian/Ubuntu)." >&2
  exit 1
fi

sudo apt update
sudo apt install -y python3 python3-pip

python3 -m pip install --user --upgrade ansible

# Make sure ansible is reachable via PATH now and in future sessions.
path_line='export PATH="$PATH:$HOME/.local/bin"'
if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
  export PATH="$PATH:$HOME/.local/bin"
fi

profile_file="$HOME/.profile"
if ! grep -Fxq "$path_line" "$profile_file" 2>/dev/null; then
  printf "\n%s\n" "$path_line" >> "$profile_file"
fi

# Also update bashrc for interactive shells (common on servers).
bashrc_file="$HOME/.bashrc"
if ! grep -Fxq "$path_line" "$bashrc_file" 2>/dev/null; then
  printf "\n%s\n" "$path_line" >> "$bashrc_file"
fi

# Refresh hash table and provide guidance if ansible is still not found.
hash -r || true
if ! command -v ansible >/dev/null; then
  echo "ansible not found in PATH for this shell." >&2
  echo "Run: source \"$profile_file\"  (or re-login) and try again." >&2
  echo "If you want it immediately: export PATH=\"\$PATH:\$HOME/.local/bin\"" >&2
fi
