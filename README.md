# k3s-n8n
Production ready kubernetes n8n backend for authentication

### K3S Env Setup Command
export KUBECONFIG=$HOME/.kube/config

### Mongodb Connection: 
mongodb-service.default.svc.cluster.local

### Port forward Command (testing)
kubectl port-forward --address 0.0.0.0 svc/mongodb-service 27017:27017
