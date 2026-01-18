# Architecture

## Roles and placement
- Control planes (x3): K3s server + etcd, OpenObserve, Falco, log agents.
- Workers (x3+): application workloads, Longhorn, Argo CD, Cert-Manager, Kyverno,
  Trivy, Velero, Infisical.
- Cloudflare is the external DNS + Load Balancer entry point.

## Data flow
Client traffic terminates at Cloudflare, then the Load Balancer forwards to the
cluster ingress. Control planes host the API and etcd quorum; workers host
platform services and apps.

## Topology
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
