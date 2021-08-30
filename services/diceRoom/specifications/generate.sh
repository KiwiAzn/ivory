#!/bin/bash

scriptPath=$(dirname "$0")
pushd $scriptPath/../

openApiVersion="v5.1.0"

diceRoomRestEndpointSpecs=api.yml

# Generate the golang service interfaces:
rm -rf service/generated/**
docker run --rm \
  -v $(pwd)/specifications:/specifications \
  -v $(pwd)/service/generated/:/tmp/go \
  openapitools/openapi-generator-cli generate \
  -i /specifications/$diceRoomRestEndpointSpecs \
  -g go-gin-server \
  -o /go

popd
