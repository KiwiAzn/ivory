import * as path from "path";

import * as k8s from "@pulumi/kubernetes";
import * as docker from "@pulumi/docker";

const kubernetesProvider = new k8s.Provider("kubernetes-provider", {
  cluster: "ivory_aks",
});

const containerRegistryAuth: docker.ImageRegistry = {
  server: "ivory.azurecr.io",
  username: "ivory",
  password: "C37dFUdxLF98Xv3If/q=90ajnHN6BMKW",
};

const ivoryUiName = "ivory-ui";
const ivoryAppLabels = { app: ivoryUiName };

const ivoryUiImage = new docker.Image(ivoryUiName, {
  imageName: `${containerRegistryAuth.server}/ivory-ui`,
  build: {
    context: path.join(__dirname, ".."),
    dockerfile: path.join(__dirname, "..", "ui.Dockerfile"),
  },
  registry: containerRegistryAuth,
});

const ivoryUiDeployment = new k8s.apps.v1.Deployment(ivoryUiName, {
  spec: {
    selector: { matchLabels: ivoryAppLabels },
    replicas: 1,
    template: {
      metadata: { labels: ivoryAppLabels },
      spec: {
        containers: [
          {
            name: ivoryUiName,
            image: ivoryUiImage.imageName,
            ports: [{ containerPort: 3000 }],
          },
        ],
      },
    },
  },
});

const ivoryUiServer = new k8s.core.v1.Service(ivoryUiName, {
  metadata: { labels: ivoryUiDeployment.spec.template.metadata.labels },
  spec: {
    type: "ClusterIP",
    ports: [{ port: 3000, targetPort: 3000, protocol: "TCP" }],
    selector: ivoryAppLabels,
  },
});

const ivoryDiceRoomName = "ivory-dice-room";
const ivoryDiceRoomAppLabels = { app: ivoryDiceRoomName };

const ivoryDiceRoomImage = new docker.Image(ivoryDiceRoomName, {
  imageName: `${containerRegistryAuth.server}/ivory-dice-room`,
  build: {
    context: path.join(__dirname, ".."),
    dockerfile: path.join(__dirname, "..", "diceRoomService.Dockerfile"),
  },
  registry: containerRegistryAuth,
});

const ivoryDiceRoomDeployment = new k8s.apps.v1.Deployment(ivoryDiceRoomName, {
  spec: {
    selector: { matchLabels: ivoryDiceRoomAppLabels },
    replicas: 1,
    template: {
      metadata: { labels: ivoryDiceRoomAppLabels },
      spec: {
        containers: [
          {
            name: ivoryDiceRoomName,
            image: ivoryDiceRoomImage.imageName,
            ports: [{ containerPort: 8080 }],
          },
        ],
      },
    },
  },
});

const ivoryDiceRoomService = new k8s.core.v1.Service(ivoryDiceRoomName, {
  metadata: { labels: ivoryDiceRoomDeployment.spec.template.metadata.labels },
  spec: {
    type: "ClusterIP",
    ports: [{ port: 8080, targetPort: 8080, protocol: "TCP" }],
    selector: ivoryDiceRoomAppLabels,
  },
});

const ingressName = "ingress";
const ingress = new k8s.networking.v1.Ingress(ingressName, {
  metadata: {
    annotations: {
      "kubernetes.io/ingress.class": "nginx",
      "nginx.ingress.kubernetes.io/use-regex": "true",
      "nginx.ingress.kubernetes.io/rewrite-target": "/$1",
      "nginx.ingress.kubernetes.io/enable-rewrite-log": "true",
    },
  },
  spec: {
    defaultBackend: {
      service: {
        name: ivoryUiServer.metadata.name,
        port: {
          number: 3000,
        },
      },
    },
    rules: [
      {
        http: {
          paths: [
            {
              path: "/api/(.*)",
              pathType: "Prefix",
              backend: {
                service: {
                  name: ivoryDiceRoomService.metadata.name,
                  port: {
                    number: 8080,
                  },
                },
              },
            },
          ],
        },
      },
      {
        http: {
          paths: [
            {
              path: "/(.*)",
              pathType: "Prefix",
              backend: {
                service: {
                  name: ivoryUiServer.metadata.name,
                  port: {
                    number: 3000,
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
});

const nginxIngress = new k8s.helm.v3.Chart("nginx-ingress", {
  chart: "nginx-ingress",
  fetchOpts: {
    repo: "https://charts.helm.sh/stable/",
  },
});
