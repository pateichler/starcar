# Kubernetes Deployment

Follow the instructions to deploy the application via Kubernetes in the following environments.

## Test

> [!WARNING]
> Do not use test deployment on production!

Test environment is setup without secret keys. Deploy on your Kubernetes cluster via command line by simply applying the configuration files:

```
kubectl apply -f path/to/kubernetes/test
```
> [!NOTE]
> `path/to/kubernetes/test` is location of Kubernetes test files (path is `kubernetes/test` from project root).

After deploying, initialize the deployed datbase by running the init and seed commands to the backend container:
```
kubectl exec {backend_pod_name} -- /bin/sh -c "python cli.py init && python cli.py seed"
```

## Production

Production requires a running database and secret keys for configuration. Create the following two required secret keys:

```
kubectl create secret generic database-uri -n starcar --from-literal=uri='{your_db_uri}'
kubectl create secret generic secret-key -n starcar --from-literal=key='{your_secret_key}'
```

After configuring secret keys, apply production files:
```
kubectl apply -f path/to/kubernetes/prod
```