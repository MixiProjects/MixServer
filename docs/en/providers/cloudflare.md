# Provider Setup: Cloudflare

## Goal
Use Cloudflare DNS and Load Balancer as the external entry point for the cluster.

## Steps
1. Add your domain to Cloudflare and update your registrar nameservers.
2. Create DNS records for your public services (recommended: use a Load Balancer
   record as the main entry point).
3. Create a Cloudflare Load Balancer:
   - Origin pool: ingress node public IPs (workers running ingress).
   - Health checks: HTTPS/HTTP endpoint you expose on the ingress.
4. Create an API token for DNS-01 challenges (Zone:DNS:Edit and Zone:Zone:Read).

## Mapping to Ansible and TLS
- `k3s_api_endpoint` is used to join nodes. Prefer a stable private endpoint.
- If you expose the K3s API via a hostname, add it to `k3s_tls_san_arg`.
