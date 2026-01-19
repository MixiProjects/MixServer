#!/usr/bin/env bash
set -euo pipefail

if ! command -v apt >/dev/null; then
  echo "This script requires apt (Debian/Ubuntu)." >&2
  exit 1
fi

sudo apt update
sudo apt install -y python3 python3-pip

python3 -m pip install --user --upgrade ansible

# Ensure ~/.local/bin is in PATH (now and future shells).
bin_dir="$HOME/.local/bin"
path_line='export PATH="$PATH:$HOME/.local/bin"'

if [[ ":$PATH:" != *":$bin_dir:"* ]]; then
  export PATH="$PATH:$bin_dir"
fi

for profile_file in "$HOME/.profile" "$HOME/.bashrc"; do
  if ! grep -Fxq "$path_line" "$profile_file" 2>/dev/null; then
    printf "\n%s\n" "$path_line" >> "$profile_file"
  fi
done

# Help when the current shell didn't reload profiles yet.
hash -r || true
if ! command -v ansible >/dev/null; then
  echo "ansible not found in PATH for this shell." >&2
  echo "Run: source ~/.profile (or re-login) and try again." >&2
fi
