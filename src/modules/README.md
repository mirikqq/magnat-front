# Modules Architecture

Each domain has an isolated module in `src/modules/<entity>` with:

- `router.ts` - route registration for the module
- `model/*` - business hooks, state and use-cases
- `ui/*` - presentation entry views for the module

Shared infra (http client, DTO contracts, formatters, mocks, shell) lives under `src/shared` and `src/app`.
