# multitenantsaas

A modular monolith SaaS platform built with a **NestJS** backend, **React + Vite** frontend, and a full suite of supporting services (PostgreSQL, Redis, etc.).

## Monorepo Structure

The repository uses **Yarn workspaces** (and optionally **Nx**) to manage multiple packages in a single repo:

```
/ (root)
├─ apps/                # Deployable applications
│   ├─ api-gateway/     # NestJS API Gateway
│   └─ frontend/        # React + Vite SPA
├─ libs/                # Shared libraries (e.g., types, utils)
├─ package.json         # Workspace definition
├─ nx.json              # Nx configuration (optional)
├─ tsconfig.base.json   # Base TypeScript config for all packages
└─ docker-compose.yml   # Development stack (added in later assignment)
```

## Getting Started

```bash
# Install dependencies for the whole monorepo
yarn install

# Build all packages
yarn build

# Run the API gateway (once generated)
# cd apps/api-gateway && yarn start:dev
```

Further documentation will be added as the platform evolves.
