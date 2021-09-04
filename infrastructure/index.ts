import * as path from 'path';

import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import * as docker from "@pulumi/docker";

// Minikube does not implement services of type `LoadBalancer`; require the user to specify if we're
// running on minikube, and if so, create only services of type ClusterIP.
const config = new pulumi.Config();
const isMinikube = config.requireBoolean("isMinikube");

const nginxAppName = "nginx";
const nginxAppLabels = { app: nginxAppName };
const deployment = new k8s.apps.v1.Deployment(nginxAppName, {
  spec: {
    selector: { matchLabels: nginxAppLabels },
    replicas: 1,
    template: {
      metadata: { labels: nginxAppLabels },
      spec: { containers: [{ name: nginxAppName, image: "nginx" }] }
    }
  }
});

// Allocate an IP to the Deployment.
const frontend = new k8s.core.v1.Service(nginxAppName, {
  metadata: { labels: deployment.spec.template.metadata.labels },
  spec: {
    type: isMinikube ? "ClusterIP" : "LoadBalancer",
    ports: [{ port: 80, targetPort: 80, protocol: "TCP" }],
    selector: nginxAppLabels
  }
});

const ivoryUiName = "ivory-ui";
const ivoryAppLabels = { app: ivoryUiName };

const ivoryUiImage = new docker.Image(ivoryUiName, {
  imageName: 'ivory-ui',
  build: {
    context: path.join(__dirname, '..'),
    dockerfile: path.join(__dirname, '..', 'ui.Dockerfile')
  },
  skipPush: true
});

const ivoryUideployment = new k8s.apps.v1.Deployment(ivoryUiName, {
  spec: {
    selector: { matchLabels: ivoryAppLabels },
    replicas: 1,
    template: {
      metadata: { labels: ivoryAppLabels },
      spec: { containers: [{ name: ivoryUiName, image: ivoryUiName, imagePullPolicy: 'Never', ports: [{ containerPort: 3000 }] }] }
    }
  }
});

// When "done", this will print the public IP.
export const ip = isMinikube
  ? frontend.spec.clusterIP
  : frontend.status.loadBalancer.apply(
    (lb) => lb.ingress[0].ip || lb.ingress[0].hostname
  );