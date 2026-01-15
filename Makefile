SHELL := /bin/bash
.DEFAULT_GOAL := help

# Configure the Docker commands
DOCKER_EXEC:=docker

# Use for docker image build
GIT_VERSION = $(shell git describe --abbrev=0 --tags)
BUILD_DATE=$(shell date --rfc-3339=seconds)
GIT_COMMIT=$(shell git rev-parse  HEAD)
NODE_VERSION=$(shell cat .nvmrc)
DOCKER_REGISTRY=gcr.io/lumapps-registry
DOCKER_IMAGE_CANONICAL=$(DOCKER_REGISTRY)/design-system:$(GIT_COMMIT)
DOCKER_IMAGE_HUMAN_READABLE=$(DOCKER_REGISTRY)/design-system:$(GIT_VERSION)

DOCKER_LABELS= --label="com.lumapps.image.created=$(BUILD_DATE)" \
--label=com.lumapps.image.sha1=$(GIT_SHA1) \
--label=com.lumapps.image.version=$(GIT_VERSION) \
--label=com.lumapps.image.authors=frontend@lumapps.com

docker_build:
	$(DOCKER_EXEC) build $(DOCKER_LABELS) -t $(DOCKER_IMAGE_CANONICAL) -t ${DOCKER_IMAGE_HUMAN_READABLE} --build-arg NODE_VERSION=$(NODE_VERSION) .

docker_push:
	$(DOCKER_EXEC) push $(DOCKER_IMAGE_CANONICAL)
	$(DOCKER_EXEC) push $(DOCKER_IMAGE_HUMAN_READABLE)

# autodocument makefiles
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
