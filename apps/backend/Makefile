# Makefile for NestJS Parking API

.PHONY: install up down logs db-studio lint build help

# Default target
.DEFAULT_GOAL := help

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	pnpm install

up: ## Start services with Docker Compose
	docker-compose up -d

down: ## Stop services
	docker-compose down

logs: ## View logs
	docker-compose logs -f

db-studio: ## Open Prisma Studio
	pnpm prisma studio

lint: ## Run linter
	pnpm run lint

build: ## Build the project
	pnpm run build
