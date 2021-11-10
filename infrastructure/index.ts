import * as path from "path";
import * as pulumi from "@pulumi/pulumi";
import * as random from "@pulumi/random";
import * as k8s from "@pulumi/kubernetes";
import * as docker from "@pulumi/docker";
import * as cloudflare from "@pulumi/cloudflare";

const branchName = process.env.BRANCH_NAME ?? "main";

// Create a password
const pass = new random.RandomPassword("pass", { length: 10 });

new k8s.Provider("kubernetes-provider", {
  cluster: "ivory_aks",
});

const namespace = new k8s.core.v1.Namespace(branchName);

const redis = new k8s.helm.v3.Release("redis", {
  chart: "redis",
  repositoryOpts: {
    repo: "https://charts.bitnami.com/bitnami",
  },
  namespace: namespace.metadata.name,
  values: {
    global: {
      redis: {
        password: pass.result,
      },
    },
    rbac: {
      create: true,
    },
  },
});

const srv = k8s.core.v1.Service.get(
  "redis-master-service",
  pulumi.interpolate`${redis.status.namespace}/${redis.status.name}-redis-master`
);

export const redisMasterClusterIP = srv.spec.clusterIP;

const containerRegistryAuth: docker.ImageRegistry = {
  server: "ivory.azurecr.io",
  username: "ivory",
  password: "C37dFUdxLF98Xv3If/q=90ajnHN6BMKW",
};

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
      metadata: {
        labels: ivoryDiceRoomAppLabels,
        namespace: namespace.metadata.namespace,
      },
      spec: {
        hostname: ivoryDiceRoomName,
        containers: [
          {
            name: ivoryDiceRoomName,
            image: ivoryDiceRoomImage.imageName,
            ports: [{ containerPort: 8080 }],
            env: [
              {
                name: "REDIS_HOST",
                value: redisMasterClusterIP,
              },
              {
                name: "REDIS_PORT",
                value: "6379",
              },
              {
                name: "REDIS_PASSWORD",
                value: pass.result,
              },
            ],
          },
        ],
      },
    },
  },
});

const ivoryDiceRoomService = new k8s.core.v1.Service(ivoryDiceRoomName, {
  metadata: {
    labels: ivoryDiceRoomDeployment.spec.template.metadata.labels,
    namespace: namespace.metadata.namespace,
  },
  spec: {
    type: "ClusterIP",
    ports: [{ port: 8080, targetPort: 8080, protocol: "TCP" }],
    selector: ivoryDiceRoomAppLabels,
  },
});

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
      metadata: {
        labels: ivoryAppLabels,
        namespace: namespace.metadata.namespace,
      },
      spec: {
        hostname: ivoryUiName,
        containers: [
          {
            name: ivoryUiName,
            image: ivoryUiImage.imageName,
            ports: [{ containerPort: 3000 }],
            env: [
              {
                name: "BACKEND_HOST",
                value: ivoryDiceRoomService.spec.clusterIP,
              },
              {
                name: "BACKEND_PORT",
                value: "8080",
              },
            ],
          },
        ],
      },
    },
  },
});

const ivoryUiServer = new k8s.core.v1.Service(ivoryUiName, {
  metadata: {
    labels: ivoryUiDeployment.spec.template.metadata.labels,
    namespace: namespace.metadata.namespace,
  },
  spec: {
    type: "ClusterIP",
    ports: [{ port: 3000, targetPort: 3000, protocol: "TCP" }],
    selector: ivoryAppLabels,
  },
});

const ruleHost =
  branchName !== "main" ? `${branchName}.ivorydice.app` : "ivorydice.app";

const ingressName = "ingress";
const ingress = new k8s.networking.v1.Ingress(ingressName, {
  metadata: {
    annotations: {
      "kubernetes.io/ingress.class": "nginx",
      "nginx.ingress.kubernetes.io/use-regex": "true",
      "nginx.ingress.kubernetes.io/rewrite-target": "/$1",
      "nginx.ingress.kubernetes.io/enable-rewrite-log": "true",
    },
    namespace: namespace.metadata.namespace,
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
        host: ruleHost,
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
        host: ruleHost,
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

const nginx = new k8s.helm.v3.Release("nginx-ingress", {
  chart: "nginx-ingress",
  repositoryOpts: {
    repo: "https://charts.helm.sh/stable/",
  },
  namespace: namespace.metadata.name,
});

const nginxService = k8s.core.v1.Service.get(
  "nginx-ingress-controller",
  pulumi.interpolate`${nginx.status.namespace}/${nginx.status.name}-nginx-ingress-controller`
);

export const publicIp = nginxService.status.loadBalancer.ingress[0].ip;

let record;

if (branchName !== "main") {
  const ivoryDiceAppZone = pulumi.output(
    cloudflare.getZones({
      filter: {
        name: "ivorydice.app",
      },
    })
  );

  record = new cloudflare.Record("record", {
    name: branchName,
    zoneId: ivoryDiceAppZone.zones[0].id as pulumi.Input<string>,
    type: "A",
    value: publicIp,
    proxied: true,
  });
}

export const hostname = record?.hostname ?? "https://ivorydice.app";
