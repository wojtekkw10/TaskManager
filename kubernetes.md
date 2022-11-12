https://www.youtube.com/watch?v=JeAHlTYB1Qk

# Prerequisites
`kubectl` - command line tool for kubernetes\
`kind` - run local Kubernetes clusters using Docker container “nodes”

# Create cluster
`kind create cluster --image kindest/node:v1.23.5`

# Get nodes
`kubectl get nodes`

# Get nodes as docker images
`docker ps`

# Namespaces
Kubernetes allows to control permissions at a namespace and cluster level \
`kubectl create namespace tms` //task management system \
`kubectl get ns` - to get all namespaces

# ConfigMaps
ConfigMaps are used to store non-confidential data in key-value pairs for dev, qa, and prod.
One ConfigMap per application. \
`kubectl -n tms get cm` - list all config maps for tms namespace \
`kubectl -n tms get cm {configName} -o yaml` - output config map as yaml

# Secrets
Just like ConfigMaps but encrypted.

# Deployments
Used to run apps. YAML files.
`kind load docker-image tms/orchestrator:0.0.1`
`kubectl -n tms apply -f orchestrator/orchestrator-deployment.yaml`
`kubectl -n tms get pods`

# Service
Helps define how traffic flows to pods.
Kind doesn't have support for LoadBalancers. So we need to forward IPs.
`kubectl -n ingress-nginx --address 0.0.0.0 port-forward svc/ingress-nginx-controller 8080`
`kubectl -n tms --address 0.0.0.0 port-forward svc/orchestrator 80 `

# Ingress
`kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.3/deploy/static/provider/cloud/deploy.yaml`



