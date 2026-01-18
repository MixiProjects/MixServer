# Fournisseur : Cloudflare

## Objectif
Utiliser Cloudflare DNS et le Load Balancer comme point d’entrée externe.

## Étapes
1. Ajouter votre domaine dans Cloudflare et mettre à jour les nameservers.
2. Créer les enregistrements DNS pour vos services publics (recommandé : un
   Load Balancer comme entrée principale).
3. Créer un Load Balancer Cloudflare :
   - Pool d’origines : IP publiques des nodes ingress (workers).
   - Health checks : endpoint HTTPS/HTTP exposé via l’ingress.
4. Créer un token API pour les challenges DNS-01 (Zone:DNS:Edit et Zone:Zone:Read).

## Mapping avec Ansible et TLS
- `k3s_api_endpoint` sert au join des nodes. Préférer un endpoint stable privé.
- Si l’API K3s est exposée via un hostname, l’ajouter à `k3s_tls_san_arg`.
