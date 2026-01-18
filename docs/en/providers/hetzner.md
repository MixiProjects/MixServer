# Provider Setup: Hetzner Cloud

## Goal
Create the control-plane and worker nodes that will be configured by Ansible.

## Recommended sizing (from `infrastructure-setup.md`)
- Control planes: 2 vCPU / 4 GB RAM / 40 GB SSD
- Workers: 4 vCPU / 8 GB RAM / 160+ GB SSD

## Steps
1. Create a Hetzner Cloud project and add your SSH key.
2. Provision 3 control-plane servers and N workers (use clear names: `cp-1..3`, `w-1..n`).
3. Ensure all nodes are reachable over SSH.
4. Apply basic firewall rules (SSH from admin IPs, HTTP/HTTPS to ingress nodes, and
   allow node-to-node traffic within the private network).
5. Record public IPs for `ansible/inventory.ini`.

## Mapping to Ansible inventory
Fill `ansible/inventory.ini` with each server IP and SSH user:
- `cp-1`, `cp-2`, `cp-3` under `[control_plane]`
- `w-1`, `w-2`, `w-3` under `[workers]`
