# Repository Guidelines

## Project Structure & Module Organization
- Root dirs: `client/` (Vite/React frontend), `server/` (Fastify + tRPC API), `docs/` (core, specs, tasks, impl, archive), `.vscode/` and scripts (`start-*.sh`, `docker-compose.*.yml`).
- Docs naming: `docs/archive/SUMMARY-{n}.md`, `docs/core/[feature].md`, `docs/specs/[feature].feature`, `docs/tasks/[feature].md`, `docs/impl/[feature].md`.
- Server layout: `server/src/routers` (tRPC), `server/src/services`, `server/src/utils`, `server/src/prisma` (schema + migrations), `server/src/server.ts` (Fastify setup), `server/src/index.ts` (entry).
- Client layout: `client/src/modules/*` (entity modules with components/hooks/pages/types/utils), `client/src/services/*`, `client/src/assets`, `client/src/components`, `client/src/lib/*`, `client/src/routes`, `client/src/stories`, `client/tests/{e2e,integration}`.

## Build, Test, and Development Commands
- Server: `npm run dev` (watch server), `npm run build` (prisma generate + tsc), `npm start` (prod), `npm run lint`, `npm run type-check`, `npm run prisma:migrate|push|generate|studio`.
- Client: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`, `npm run storybook`, `npm run build-storybook`, `npm run test` (Playwright headless), `npm run test:ui|test:headed`.
- Environment: copy `.env.*.example` → `.env.*` per target; compose files available for dev/test/prod.
- Shell helpers: `start-dev.sh`, `start-test.sh`, `start-prod.sh`, `stop-all.sh` orchestrate docker compose stacks.

## Coding Style & Naming Conventions
- TypeScript everywhere; avoid `any`; prefer inferred/union types; keep files under ~200 lines when practical (server principle).
- Formatting: Prettier (`tabWidth 2`, `printWidth 100`, semicolons, single quotes, LF). Run eslint before pushing.
- React: functional components, hooks for data fetching/forms; use `data-testid` for elements targeted in tests.
- Docs/files: kebab-case for feature names; keep docs concise; commit DB schema updates to `docs/core/schema.dbml` + Prisma.

## Testing Guidelines
- Client: Playwright for e2e/integration; no unit tests planned. Place specs under `client/tests/e2e` or `client/tests/integration`; prefer stable `data-testid`s.
- Server: add integration tests around routers if introduced; keep schemas in sync with fixtures/migrations.
- Run `npm run lint` and `npm run type-check` (server) or `npm run lint` (client) before PRs; add coverage notes if tests are skipped.

## Commit & Pull Request Guidelines
- Use clear, present-tense commits (e.g., `Add rules router validation`, `Fix Playwright auth flow`); group logical changes.
- PRs should state scope, testing done (`npm run test`, `npm run lint`, etc.), environment touched, and linked issues/task IDs. Include screenshots or terminal output for UI/test changes when possible.
- Keep migrations and schema DBML updates in the same PR; note breaking changes explicitly.

## Security & Configuration Tips
- Never commit secrets; use `.env.*` and keep tokens out of stories/tests. Rotate Prisma migrations with caution when shared DBs are in use.
- Validate all external input through Zod (shared schemas) and keep tRPC types aligned between client and server builds.
