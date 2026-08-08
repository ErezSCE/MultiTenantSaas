# Product Manager Mission Report

**Agent**: product-manager  
**Generated**: 2026-08-08T15:04:57.065Z

---

## User Stories (11)

### US-001: As a new tenant admin, I want to sign up with email and password
- So that: my organization gets a dedicated tenant and I can manage users
- AC: User can register with a valid email and password; System creates a tenant record and an admin user linked to that tenant; A confirmation email is sent via SendGrid; Attempting to register with an email that already exists returns an error
### US-002: As a tenant admin, I want to invite new members by email
- So that: they can join my tenant with appropriate role
- AC: Admin can send an invitation email to a prospective user; Invitation email contains a one‑time link to accept and set a password; After acceptance, the new user is created with the Member role and linked to the tenant; Invitation token cannot be reused or exploited
### US-003: As a tenant user, I want to log in using Auth0's hosted login page
- So that: my session is secured with a JWT that includes my tenant and role
- AC: User can initiate login via Auth0 and receive a JWT on success; JWT contains tenantId and role claims; Frontend stores the JWT and includes it in subsequent API calls; Invalid credentials or expired token result in a clear error response
### US-004: As a tenant admin, I want to generate API keys for my applications
- So that: my services can authenticate event ingestion calls
- AC: Admin can create a new API key via the UI and see the raw key once; API key is stored hashed in the database; Admin can revoke an existing API key, after which it is rejected by the ingestion endpoint; An audit log entry is created for each generate or revoke action
### US-005: As a instrumented client, I want to POST events to /api/events with my API key
- So that: my product usage data is collected for analysis
- AC: POST /api/events accepts a JSON payload containing tenantId, eventName, timestamp, optional userId and properties; Request must include a valid API key header and pass per‑key rate limiting; Payload is validated against the schema and stored in the events table; Successful ingestion returns HTTP 202; invalid payload, missing/invalid key, or rate‑limit breach returns appropriate error codes
### US-006: As a new tenant admin, I want default dashboards to be created automatically
- So that: my team can start viewing key metrics without any manual setup
- AC: When a tenant is created, the system inserts a set of predefined dashboards and charts for that tenant; The dashboards appear in the UI under the Dashboards list; Each default chart renders data scoped to the tenant and matches the described metric (e.g., event volume, active users)
### US-007: As a tenant member, I want to build custom queries through a visual builder
- So that: I can explore my event data in ways that matter to my product
- AC: User can select an event name, add property filters, choose a time range and an aggregation type; The query is sent to the Query Service and results are displayed as a chart and/or table; Invalid configurations produce user‑friendly error messages
### US-008: As a tenant member, I want to save a chart to a dashboard and share it via a read‑only link
- So that: my colleagues can view the insight without editing it
- AC: User can save any chart from the query builder onto an existing dashboard; Saved charts appear correctly within the dashboard view; User can generate a shareable read‑only link that is scoped to the same tenant; Anyone accessing the link sees the chart but no edit controls, and the link respects tenant isolation
### US-009: As a system operator, I want daily aggregation jobs to compute DAU per tenant
- So that: the Query Service can serve fast pre‑computed metrics
- AC: A BullMQ job runs each night at 02:00 UTC; Job aggregates distinct userId counts per tenant for the previous day and stores results in a daily_aggregates table; Query Service can retrieve the pre‑computed DAU in under 200 ms
### US-010: As a devops engineer, I want structured JSON logging, health checks and Prometheus metrics for all services
- So that: operations can monitor system health and troubleshoot issues
- AC: All NestJS services emit logs in JSON format including requestId, tenantId (when applicable), level and message; Each service exposes a /health endpoint returning 200 with uptime and version; Each service exposes a /metrics endpoint consumable by Prometheus
### US-011: As a security auditor, I want strict tenant isolation and per‑API‑key rate limiting enforced at the data‑access layer
- So that: no tenant can read or affect another tenant's data and abuse is prevented
- AC: All data queries automatically filter by tenantId derived from the validated JWT claim; Attempting to access data belonging to a different tenant returns HTTP 403; Rate limiting is applied per API key using Redis counters and is enforced consistently across ingestion requests

## Tasks (54)

- **TASK-001** [infra/Git, Nx (optional), Yarn] Create repository and monorepo structure
- **TASK-002** [infra/Docker, Docker Compose] Add Docker Compose scaffold for development
- **TASK-003** [infra/GitHub Actions, Docker] Configure GitHub Actions CI pipeline
- **TASK-004** [backend/NestJS, TypeScript, ESLint, Prettier] Bootstrap NestJS backend project
- **TASK-005** [frontend/React, TypeScript, Vite, React Router] Bootstrap React frontend project
- **TASK-006** [backend/NestJS, class‑validator, JWT] Implement tenant sign‑up endpoint
- **TASK-007** [db/PostgreSQL, TypeORM or Prisma] Create PostgreSQL migrations for tenants and users
- **TASK-008** [backend/Node.js, SendGrid SDK] Integrate SendGrid for confirmation emails
- **TASK-009** [frontend/React, TypeScript, Axios] Build sign‑up page UI
- **TASK-010** [testing/Jest, NestJS testing utilities] Write unit tests for sign‑up service
- **TASK-011** [testing/Cypress] Create Cypress e2e test for sign‑up flow
- **TASK-012** [backend/NestJS, JWT for token, SendGrid] Implement user invitation endpoint
- **TASK-013** [db/PostgreSQL, TypeORM/Prisma] Add invitation_tokens table migration
- **TASK-014** [frontend/React, TypeScript, Axios] Create invitation UI modal
- **TASK-015** [testing/Jest] Write unit tests for invitation logic
- **TASK-016** [testing/Cypress] Create Cypress test for invitation acceptance flow
- **TASK-017** [frontend/Auth0 SPA SDK, React] Integrate Auth0 SPA SDK for login
- **TASK-018** [backend/NestJS, passport-jwt, jwks-rsa] Add JWT validation middleware in API Gateway
- **TASK-019** [testing/Jest, supertest] Write integration test for JWT validation
- **TASK-020** [backend/NestJS, bcrypt] Create API key generation endpoint
- **TASK-021** [db/PostgreSQL, TypeORM/Prisma] Add api_keys table migration
- **TASK-022** [frontend/React, TypeScript, Axios] Build API key management UI page
- **TASK-023** [testing/Jest] Write unit tests for API key generation and revocation
- **TASK-024** [backend/NestJS, class-validator, PostgreSQL] Implement event ingestion endpoint
- **TASK-025** [backend/Redis, BullMQ, ioredis] Add Redis‑based rate limiting middleware
- **TASK-026** [db/PostgreSQL, TypeORM/Prisma] Create events table migration
- **TASK-027** [testing/Jest] Write unit tests for event validation and rate limiting
- **TASK-028** [testing/Cypress, PostgreSQL test utilities] Create Cypress integration test for event ingestion flow
- **TASK-029** [backend/NestJS, TypeORM/Prisma] Implement default dashboard creation hook
- **TASK-030** [db/PostgreSQL, TypeORM/Prisma] Add dashboards and charts tables migration
- **TASK-031** [frontend/React, TypeScript, Axios] Build dashboard list UI component
- **TASK-032** [testing/Jest] Write unit tests for default dashboard creation logic
- **TASK-033** [frontend/React, TypeScript, date-fns or similar] Develop Query Builder UI component
- **TASK-034** [backend/NestJS, PostgreSQL, TypeORM/Prisma] Implement query execution endpoint
- **TASK-035** [testing/Jest] Write unit tests for query translation logic
- **TASK-036** [testing/Cypress] Create Cypress test for ad‑hoc query builder flow
- **TASK-037** [backend/NestJS, PostgreSQL] Add endpoint to save chart to a dashboard
- **TASK-038** [backend/NestJS, JWT or UUID tokens] Create shareable read‑only link endpoint
- **TASK-039** [db/PostgreSQL, TypeORM/Prisma] Add share_links table migration
- **TASK-040** [frontend/React, TypeScript, Axios] Build UI for saving chart and generating share link
- **TASK-041** [testing/Jest] Write unit tests for share link generation and validation
- **TASK-042** [backend/BullMQ, Redis] Define BullMQ job for daily DAU aggregation
- **TASK-043** [backend/NestJS, PostgreSQL] Add aggregation logic in Query Service
- **TASK-044** [db/PostgreSQL, TypeORM/Prisma] Create daily_aggregates table migration
- **TASK-045** [infra/Docker Compose, Redis, BullMQ] Configure Redis and BullMQ worker in Docker Compose
- **TASK-046** [testing/Jest] Write unit test for daily aggregation calculation
- **TASK-047** [backend/Winston, NestJS] Add Winston JSON logger middleware to all NestJS services
- **TASK-048** [backend/NestJS, prom-client] Implement /health and /metrics endpoints
- **TASK-049** [infra/Prometheus, Docker Compose] Add Prometheus exporter container configuration
- **TASK-050** [testing/Jest, supertest] Create integration test for /health endpoint
- **TASK-051** [backend/NestJS, TypeORM/Prisma] Develop global tenant isolation guard
- **TASK-052** [backend/Redis, ioredis] Extend rate limiting middleware to use API key identifier
- **TASK-053** [testing/Jest] Write unit tests for tenant isolation guard
- **TASK-054** [testing/Jest, supertest] Write integration test for cross‑tenant data access denial
