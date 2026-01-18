# Fournisseur : Hetzner Cloud

## Objectif
Créer les nodes control-plane et worker qui seront configurés par Ansible.

## Sizing recommandé (depuis `infrastructure-setup.md`)
- Control planes : 2 vCPU / 4 GB RAM / 40 GB SSD
- Workers : 4 vCPU / 8 GB RAM / 160+ GB SSD

## Étapes
1. Créer un projet Hetzner Cloud et ajouter votre clé SSH.
2. Provisionner 3 control planes et N workers (noms clairs : `cp-1..3`, `w-1..n`).
3. Vérifier l’accès SSH sur tous les nodes.
4. Appliquer des règles firewall de base (SSH depuis les IP admin, HTTP/HTTPS vers
   les nodes ingress, et trafic interne entre nodes).
5. Renseigner les IPs dans `ansible/inventory.ini`.

## Mapping avec l’inventaire Ansible
Renseigner `ansible/inventory.ini` avec chaque IP et user SSH :
- `cp-1`, `cp-2`, `cp-3` dans `[control_plane]`
- `w-1`, `w-2`, `w-3` dans `[workers]`
