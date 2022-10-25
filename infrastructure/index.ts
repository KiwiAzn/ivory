import * as pulumi from "@pulumi/pulumi";
import * as containerregistry from "@pulumi/azure-native/containerregistry";
import * as cache from "@pulumi/azure-native/cache";
import * as resources from "@pulumi/azure-native/resources";
import * as web from "@pulumi/azure-native/web";
import * as path from "path";
import * as docker from "@pulumi/docker";

// Create an Azure Resource Group
const resourceGroup = new resources.ResourceGroup("ivory");

// Create an Azure App Service Plan
const plan = new web.AppServicePlan("plan", {
  resourceGroupName: resourceGroup.name,
  kind: "Linux",
  reserved: true,
  sku: {
    name: "B1",
    tier: "Basic",
  },
});

const registry = new containerregistry.Registry("registry", {
  resourceGroupName: resourceGroup.name,
  sku: {
    name: "Basic",
  },
  adminUserEnabled: true,
});

const credentials = containerregistry.listRegistryCredentialsOutput({
  resourceGroupName: resourceGroup.name,
  registryName: registry.name,
});

const adminUsername = credentials.apply((credentials) => credentials.username!);
const adminPassword = credentials.apply(
  (credentials) => credentials.passwords![0].value!
);

const redis = new cache.Redis("redis", {
  // enableNonSslPort: true,
  // location: "West US",
  // minimumTlsVersion: "1.2",
  // name: "cache1",
  // redisConfiguration: {
  //     maxmemoryPolicy: "allkeys-lru",
  // },
  // replicasPerMaster: 2,
  resourceGroupName: resourceGroup.name,
  // shardCount: 2,
  sku: {
    capacity: 1,
    family: "P",
    name: "Premium",
  },
  // staticIP: "192.168.0.5",
  // subnetId: "/subscriptions/subid/resourceGroups/rg2/providers/Microsoft.Network/virtualNetworks/network1/subnets/subnet1",
  // zones: ["1"],
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

const ivoryUiApp = new web.WebApp(ivoryUiName, {
  resourceGroupName: resourceGroup.name,
  serverFarmId: plan.id,
  siteConfig: {
    appSettings: [
      {
        name: "WEBSITES_ENABLE_APP_SERVICE_STORAGE",
        value: "false",
      },
      {
        name: "DOCKER_REGISTRY_SERVER_URL",
        value: pulumi.interpolate`https://${registry.loginServer}`,
      },
      {
        name: "DOCKER_REGISTRY_SERVER_USERNAME",
        value: adminUsername,
      },
      {
        name: "DOCKER_REGISTRY_SERVER_PASSWORD",
        value: adminPassword,
      },
      {
        name: "WEBSITES_PORT",
        value: "80", // Our custom image exposes port 80. Adjust for your app as needed.
      },
      {
        name: "BACKEND_HOST",
        value: ivoryServerApp.defaultHostName,
      },
      {
        name: "BACKEND_PORT",
        value: "8080",
      },
    ],
    alwaysOn: true,
    linuxFxVersion: pulumi.interpolate`DOCKER|${ivoryUiImage.imageName}`,
  },
  httpsOnly: true,
});

export const ivoryUiAppEndpoint = pulumi.interpolate`https://${ivoryUiApp.defaultHostName}`;

const ivoryServerApp = new web.WebApp(ivoryDiceRoomName, {
  resourceGroupName: resourceGroup.name,
  serverFarmId: plan.id,
  siteConfig: {
    appSettings: [
      {
        name: "WEBSITES_ENABLE_APP_SERVICE_STORAGE",
        value: "false",
      },
      {
        name: "DOCKER_REGISTRY_SERVER_URL",
        value: pulumi.interpolate`https://${registry.loginServer}`,
      },
      {
        name: "DOCKER_REGISTRY_SERVER_USERNAME",
        value: adminUsername,
      },
      {
        name: "DOCKER_REGISTRY_SERVER_PASSWORD",
        value: adminPassword,
      },
      {
        name: "WEBSITES_PORT",
        value: "80", // Our custom image exposes port 80. Adjust for your app as needed.
      },
      {
        name: "REDIS_HOST",
        value: redis.hostName,
      },
      {
        name: "REDIS_PORT",
        value: redis.port,
      },
      {
        name: "REDIS_PASSWORD",
        value: redis.accessKeys.primaryKey,
      },
    ],
    alwaysOn: true,
    linuxFxVersion: pulumi.interpolate`DOCKER|${ivoryDiceRoomImage.imageName}`,
  },
  httpsOnly: true,
});

export const ivoryServerAppEndpoint = pulumi.interpolate`https://${ivoryServerApp.defaultHostName}`;
