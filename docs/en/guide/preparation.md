# Preparation and Running Scripts

## Prerequisites
- A control-plane node and worker nodes are provisioned.
- SSH access to every node (private key available locally).
- Python 3 is installed on every node.
- Ansible is installed locally.

## Prepare inventory and variables
1. Edit `ansible/inventory.ini` and replace all `CHANGE_ME_*` values.
2. Edit `ansible/group_vars/all.yml` and set:
   - `k3s_api_endpoint`
   - `k3s_token`
   - `k3s_tls_san_arg` (optional)

## Run the scripts
1. Base OS preparation:
```
ansible-playbook -i ansible/inventory.ini ansible/playbooks/base.yml
```
2. K3s cluster installation:
```
ansible-playbook -i ansible/inventory.ini ansible/playbooks/k3s.yml
```

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
