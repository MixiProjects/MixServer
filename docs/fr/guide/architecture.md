# Architecture

## Rôles et placement
- Control planes (x3) : K3s server + etcd, OpenObserve, Falco, agents logs.
- Workers (x3+) : workloads applicatifs, Longhorn, Argo CD, Cert-Manager, Kyverno,
  Trivy, Velero, Infisical.
- Cloudflare fournit le DNS et le Load Balancer en entrée.

## Flux
Le trafic client passe par Cloudflare, puis le Load Balancer envoie vers
l’Ingress du cluster. Les control planes hébergent l’API et le quorum etcd,
les workers hébergent les services plateforme et les apps.

## Topologie
```mermaid
flowchart TB
  subgraph edgeLayer ["Edge layer"]
    cloudflareLB["Cloudflare LB + DNS"]
  end
  subgraph controlPlanes ["Control planes (x3)"]
    cp1["cp-1 (K3s + etcd)"]
    cp2["cp-2 (K3s + etcd)"]
    cp3["cp-3 (K3s + etcd)"]
  end
  subgraph workerLayer ["Workers (x3+)"]
    w1["w-1 (apps + storage)"]
    w2["w-2 (apps + storage)"]
    w3["w-3 (apps + storage)"]
  end
  ingress["Ingress (Traefik or Nginx)"]
  etcdQuorum["etcd quorum"]
  services["Platform services"]

  cloudflareLB --> ingress
  ingress --> cp1
  ingress --> cp2
  ingress --> cp3
  cp1 --- etcdQuorum
  cp2 --- etcdQuorum
  cp3 --- etcdQuorum
  ingress --> w1
  ingress --> w2
  ingress --> w3
  w1 --> services
  w2 --> services
  w3 --> services
```
