# Préparation et exécution des scripts

## Prérequis
- Les nodes control-plane et workers sont provisionnés.
- Accès SSH sur tous les nodes (clé privée disponible en local).
- Python 3 installé sur chaque node.
- Ansible installé en local.

## Préparer l’inventaire et les variables
1. Éditer `ansible/inventory.ini` et remplacer tous les `CHANGE_ME_*`.
2. Éditer `ansible/group_vars/all.yml` et définir :
   - `k3s_api_endpoint`
   - `k3s_token`
   - `k3s_tls_san_arg` (optionnel)

## Exécuter les scripts
1. Préparation Base OS :
```
ansible-playbook -i ansible/inventory.ini ansible/playbooks/base.yml
```
2. Installation du cluster K3s :
```
ansible-playbook -i ansible/inventory.ini ansible/playbooks/k3s.yml
```

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
