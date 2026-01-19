# Preparation and Running Scripts

## Prerequisites
- A control-plane node and worker nodes are provisioned.
- SSH access to every node (private key available locally).
- Python 3 is installed on every node.
- Ansible is installed locally.

## Install Ansible (control machine)
Run these commands on your control machine:
```
sudo apt update
sudo apt install -y python3 python3-pip
python3 -m pip install --user --upgrade ansible
export PATH=$PATH:/root/.local/bin
ansible --version
```

## Cross-project networking (WireGuard full-mesh)
When control planes and workers are in different Hetzner projects, use a
WireGuard full-mesh so every node can reach every other node. This removes a
single hub SPOF.

### 1) Choose tunnel IPs (single /24)
Example tunnel IP plan:
- `cp-1`: `10.50.0.1`
- `cp-2`: `10.50.0.2`
- `cp-3`: `10.50.0.3`
- `w-1`: `10.50.0.11`
- `w-2`: `10.50.0.12`
- `w-3`: `10.50.0.13`

### 2) Install WireGuard (each node)
```
sudo apt update
sudo apt install -y wireguard
```

### 3) Generate keys (each node)
```
wg genkey | sudo tee /etc/wireguard/privatekey | wg pubkey | sudo tee /etc/wireguard/publickey
```
Collect every node public key.

### 4) Configure one node (example for cp-1)
Create `/etc/wireguard/wg0.conf`:
```
[Interface]
Address = 10.50.0.1/24
ListenPort = 51820
PrivateKey = <CP1_PRIVATE_KEY>

[Peer]
PublicKey = <CP2_PUBLIC_KEY>
Endpoint = <CP2_PUBLIC_IP>:51820
AllowedIPs = 10.50.0.2/32
PersistentKeepalive = 25

[Peer]
PublicKey = <CP3_PUBLIC_KEY>
Endpoint = <CP3_PUBLIC_IP>:51820
AllowedIPs = 10.50.0.3/32
PersistentKeepalive = 25

[Peer]
PublicKey = <W1_PUBLIC_KEY>
Endpoint = <W1_PUBLIC_IP>:51820
AllowedIPs = 10.50.0.11/32
PersistentKeepalive = 25

[Peer]
PublicKey = <W2_PUBLIC_KEY>
Endpoint = <W2_PUBLIC_IP>:51820
AllowedIPs = 10.50.0.12/32
PersistentKeepalive = 25

[Peer]
PublicKey = <W3_PUBLIC_KEY>
Endpoint = <W3_PUBLIC_IP>:51820
AllowedIPs = 10.50.0.13/32
PersistentKeepalive = 25
```
Open UDP port `51820` on every node firewall.

### 5) Configure all other nodes
Each node gets its own `[Interface]` with its tunnel IP and private key, and
one `[Peer]` entry for every other node:
- `Endpoint = <peer_public_ip>:51820`
- `AllowedIPs = <peer_tunnel_ip>/32`
- `PersistentKeepalive = 25`

### 6) Start the tunnel (each node)
```
sudo systemctl enable --now wg-quick@wg0
```
Verify:
```
ping 10.50.0.2
```

## Prepare inventory and variables
All input parameters are defined in these files:
1. `ansible/inventory.ini`: hostnames, IPs, and group membership. Replace all
   `CHANGE_ME_*` values. Use the WireGuard tunnel IPs if you enabled the
   cross-project tunnel.
2. `ansible/group_vars/all.yml`: cluster and base settings. Set:
   - `k3s_api_endpoint`
   - `k3s_token`
   - `k3s_tls_san_arg` (optional)
   - `k3s_version` (optional, currently unused by the role)
   - `ssh_hardening`
   - `configure_ufw`

## Run the scripts
1. Base OS preparation:
```
ansible-playbook -i ansible/inventory.ini ansible/playbooks/base.yml
```
2. K3s cluster installation:
```
ansible-playbook -i ansible/inventory.ini ansible/playbooks/k3s.yml
```

## Security note
If you use WireGuard, restrict SSH and the K3s API (port `6443`) to the tunnel
IP range (`10.50.0.0/24` in the example).

## Verify
Copy kubeconfig from a control plane:
```
sudo cat /etc/rancher/k3s/k3s.yaml
```
Then run:
```
kubectl get nodes
kubectl -n kube-system get pods
```
