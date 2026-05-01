#!/bin/bash

REGISTRY="https://npmjs-registry.ivyteam.ch/"

pnpm unpublish "@axonivy/persistence-editor@${1}" --registry $REGISTRY
pnpm unpublish "@axonivy/persistence-editor-protocol@${1}" --registry $REGISTRY