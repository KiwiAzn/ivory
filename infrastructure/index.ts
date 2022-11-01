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

const redis = new cache.Redis(
  "redis",
  {
    enableNonSslPort: true,
    location: "Australia East",
    minimumTlsVersion: "1.2",
    name: "redis3657a468",
    publicNetworkAccess: "Enabled",
    redisConfiguration: {
      maxfragmentationmemoryReserved: "125",
      maxmemoryDelta: "125",
      maxmemoryPolicy: "allkeys-lru",
      maxmemoryReserved: "125",
    },
    resourceGroupName: "ivory70ae1963",
    sku: {
      capacity: 1,
      family: "C",
      name: "Standard",
    },
  },
  {
    protect: true,
  }
);

const ivoryDiceRoomName = "ivory-dice-room";
const ivoryDiceRoomAppLabels = { app: ivoryDiceRoomName };

const ivoryDiceRoomImage = new docker.Image(ivoryDiceRoomName, {
  imageName: pulumi.interpolate`${registry.loginServer}/${ivoryDiceRoomName}`,
  build: {
    context: path.join(__dirname, ".."),
    dockerfile: path.join(__dirname, "..", "diceRoomService.Dockerfile"),
    extraOptions: ["--platform", "linux/amd64"],
  },
  registry: {
    server: registry.loginServer,
    username: adminUsername,
    password: adminPassword,
  },
});

const ivoryUiName = "ivory-ui";
const ivoryAppLabels = { app: ivoryUiName };

const ivoryUiImage = new docker.Image(ivoryUiName, {
  imageName: pulumi.interpolate`${registry.loginServer}/${ivoryUiName}`,
  build: {
    context: path.join(__dirname, ".."),
    dockerfile: path.join(__dirname, "..", "ui.Dockerfile"),
    extraOptions: ["--platform", "linux/amd64"],
  },
  registry: {
    server: registry.loginServer,
    username: adminUsername,
    password: adminPassword,
  },
});

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
        value: "8080",
      },
      {
        name: "REDIS_HOST",
        value: redis.hostName,
      },
      {
        name: "REDIS_PORT",
        value: redis.port.toString(),
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
        value: "3000",
      },
      {
        name: "BACKEND_HOST",
        value: ivoryServerApp.defaultHostName,
      },
      {
        name: "BACKEND_PORT",
        value: "80",
      },
    ],
    alwaysOn: true,
    linuxFxVersion: pulumi.interpolate`DOCKER|${ivoryUiImage.imageName}`,
  },
  httpsOnly: true,
});

export const ivoryServerAppEndpoint = pulumi.interpolate`https://${ivoryServerApp.defaultHostName}`;
export const ivoryUiAppEndpoint = pulumi.interpolate`https://${ivoryUiApp.defaultHostName}`;

const reverseProxyName = "reverse-proxy";

const reverseProxy = new docker.Image(reverseProxyName, {
  imageName: pulumi.interpolate`${registry.loginServer}/${reverseProxyName}`,
  build: {
    context: path.join(__dirname, ".."),
    dockerfile: path.join(__dirname, "..", "reverseProxy.Dockerfile"),
    extraOptions: ["--platform", "linux/amd64"],
  },
  registry: {
    server: registry.loginServer,
    username: adminUsername,
    password: adminPassword,
  },
});

const reverseProxyApp = new web.WebApp(reverseProxyName, {
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
        value: "80",
      },
      {
        name: "UI_SERVER_HOST",
        value: ivoryUiAppEndpoint,
      },
      {
        name: "API_SERVER_HOST",
        value: ivoryServerAppEndpoint,
      },
    ],
    alwaysOn: true,
    linuxFxVersion: pulumi.interpolate`DOCKER|${reverseProxy.imageName}`,
  },
  httpsOnly: true,
});

export const reverseProxyAppEndpoint = pulumi.interpolate`https://${reverseProxyApp.defaultHostName}`;
