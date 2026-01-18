# MixServer

Infrastructure automation and documentation for a K3s HA cluster with
Cloudflare as the external entry point.

## What's inside
- `ansible/`: playbooks and roles to prepare nodes and install K3s.
- `docs/`: VuePress documentation (EN/FR).
- `infrastructure-setup.md`: infrastructure notes and service placement.

## Documentation
From `docs/`:
```
npm i
npm run docs:dev
```

Locales:
- English: `/en/`
- Français : `/fr/`

## Automation (summary)
From repo root:
```
ansible-playbook -i ansible/inventory.ini ansible/playbooks/base.yml
ansible-playbook -i ansible/inventory.ini ansible/playbooks/k3s.yml
```
