# Automatisation : Base OS (Ansible)

## Emplacement du script
- Playbook : `ansible/playbooks/base.yml`
- Variables : `ansible/group_vars/all.yml`

## Ce que le script fait
1. Met à jour le cache apt.
2. Installe les packages de base (curl, ca-certificates, open-iscsi, nfs-common, chrony).
3. Désactive le swap et le retire de `/etc/fstab` (obligatoire pour Kubernetes).
4. Applique des sysctl pour le réseau Kubernetes.
5. Durcit SSH en option (`ssh_hardening`).
6. Active UFW en option (`configure_ufw`).

## Paramètres à définir
- `ssh_hardening` (true/false)
- `configure_ufw` (true/false)

## Flux
```mermaid
flowchart TD
  start[Start] --> aptCache["Update apt cache"]
  aptCache --> basePkgs["Install base packages"]
  basePkgs --> swapOff["Disable swap"]
  swapOff --> fstab["Remove swap from fstab"]
  fstab --> sysctl["Set sysctl values"]
  sysctl --> sshHardening{"ssh_hardening?"}
  sshHardening -->|true| sshConfig["Apply SSH hardening"]
  sshHardening -->|false| ufwCheck
  sshConfig --> ufwCheck{"configure_ufw?"}
  ufwCheck -->|true| ufwRules["Allow OpenSSH + enable UFW"]
  ufwCheck -->|false| done[Done]
  ufwRules --> done
```
