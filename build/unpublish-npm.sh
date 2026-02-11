#!/bin/bash

REGISTRY="https://npmjs-registry.ivyteam.ch/"

npm unpublish "@axonivy/persistence-editor@${1}" --registry $REGISTRY
npm unpublish "@axonivy/persistence-editor-protocol@${1}" --registry $REGISTRY