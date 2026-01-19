# Préparation et exécution des scripts

## Prérequis
- Les nodes control-plane et workers sont provisionnés.
- Accès SSH sur tous les nodes (clé privée disponible en local).
- Python 3 installé sur chaque node.
- Ansible installé en local.

## Installer Ansible (machine de contrôle)
Exécuter ces commandes sur la machine de contrôle :
```
sudo apt update
sudo apt install -y python3 python3-pip
python3 -m pip install --user --upgrade ansible
export PATH=$PATH:/root/.local/bin
ansible --version
```

## Réseau inter-projets (WireGuard full-mesh)
Si les control-planes et workers sont dans des projets Hetzner différents,
utiliser un full-mesh WireGuard pour que chaque node puisse joindre tous les
autres. Cela évite un SPOF de hub.

### 1) Choisir les IPs du tunnel (un seul /24)
Exemple de plan d’IP :
- `cp-1` : `10.50.0.1`
- `cp-2` : `10.50.0.2`
- `cp-3` : `10.50.0.3`
- `w-1` : `10.50.0.11`
- `w-2` : `10.50.0.12`
- `w-3` : `10.50.0.13`

### 2) Installer WireGuard (chaque node)
```
sudo apt update
sudo apt install -y wireguard
```

### 3) Générer les clés (chaque node)
```
wg genkey | sudo tee /etc/wireguard/privatekey | wg pubkey | sudo tee /etc/wireguard/publickey
```
Récupérer toutes les clés publiques.

### 4) Configurer un node (exemple pour cp-1)
Créer `/etc/wireguard/wg0.conf` :
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
Ouvrir le port UDP `51820` sur le pare-feu de chaque node.

### 5) Configurer tous les autres nodes
Chaque node a son propre `[Interface]` avec son IP de tunnel et sa clé privée,
et un bloc `[Peer]` pour chaque autre node :
- `Endpoint = <ip_publique_du_peer>:51820`
- `AllowedIPs = <ip_tunnel_du_peer>/32`
- `PersistentKeepalive = 25`

### 6) Démarrer le tunnel (chaque node)
```
sudo systemctl enable --now wg-quick@wg0
```
Vérifier :
```
ping 10.50.0.2
```

## Préparer l’inventaire et les variables
Tous les paramètres d’entrée sont dans ces fichiers :
1. `ansible/inventory.ini` : hôtes, IP et groupes. Remplacer tous les
   `CHANGE_ME_*`. Utiliser les IPs du tunnel WireGuard si activé.
2. `ansible/group_vars/all.yml` : paramètres cluster et base. Définir :
   - `k3s_api_endpoint`
   - `k3s_token`
   - `k3s_tls_san_arg` (optionnel)
   - `k3s_version` (optionnel, non utilisé par le rôle actuel)
   - `ssh_hardening`
   - `configure_ufw`

## Exécuter les scripts
1. Préparation Base OS :
```
ansible-playbook -i ansible/inventory.ini ansible/playbooks/base.yml
```
2. Installation du cluster K3s :
```
ansible-playbook -i ansible/inventory.ini ansible/playbooks/k3s.yml
```

## Note de sécurité
Si vous utilisez WireGuard, restreindre SSH et l’API K3s (port `6443`) au
range d’IP du tunnel (`10.50.0.0/24` dans l’exemple).

## Vérifier
Récupérer le kubeconfig depuis un control-plane :
```
sudo cat /etc/rancher/k3s/k3s.yaml
```
Puis :
```
kubectl get nodes
kubectl -n kube-system get pods
```
