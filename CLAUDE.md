# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DocMaster is a document management system for managing AI agent documentation in a centralized location. The project consists of a React/TypeScript client and a Node.js/tRPC server.

## Commands

### Running with Docker (Recommended)

Each environment runs on different ports to allow side-by-side operation:

```bash
# Development environment
./start-dev.sh
# Server: http://localhost:3000
# Client: http://localhost:5173

# Testing environment
./start-test.sh
# Server: http://localhost:3001
# Client: http://localhost:5174

# Production environment
./start-prod.sh
# Server: http://localhost:3002
# Client: http://localhost:8080

# Stop all environments
./stop-all.sh
```

### Running Locally (Without Docker)
```bash
# Prerequisites: PostgreSQL must be running locally
# Use environment-specific credentials from server/.env.{environment}

# Terminal 1 - Start the server (runs on port 3000)
cd server
npm install              # First time only
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run dev

# Terminal 2 - Start the client (runs on port 5173)
cd client
npm install              # First time only
npm run dev
```

### Client Development
```bash
cd client
npm run dev              # Start Vite dev server on port 5173
npm run build            # Type-check with tsc and build with Vite
npm run lint             # Run ESLint
npm run preview          # Preview production build

# Storybook
npm run storybook        # Start Storybook dev server on port 6006
npm run build-storybook  # Build Storybook for production
```

### Server Development
```bash
cd server
npm run dev              # Start development server on port 3000 with hot reload
npm run build            # Compile TypeScript and generate Prisma Client
npm start                # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler check

# Prisma commands
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Create and apply database migration
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:push      # Push schema changes to database without migration
```

### Testing
- Use Playwright for all e2e and integration tests
- NO unit tests are implemented per core development principles
- All test selectors should use `data-testid` attributes
- Tests will be located in `client/tests/e2e/` and `client/tests/integration/`

## Architecture

### Monorepo Structure
```
docmaster/
├── client/          # React/TypeScript frontend (port 5173)
├── server/          # Node.js/tRPC backend (port 3000)
└── docs/            # Project documentation
    ├── core/        # Static core documentation
    ├── specs/       # Gherkin feature specs (evolving)
    ├── tasks/       # Task lists (evolving)
    ├── impl/        # Implementation notes (evolving)
    └── archive/     # Completed feature summaries (evolving)
```

### Server Architecture

**Tech Stack**: TypeScript, tRPC, Fastify, Prisma, PostgreSQL, Zod

**Module Structure**:
- `src/routers/` - tRPC routers organized by entity
- `src/services/` - Business logic layer
- `src/lib/prisma.ts` - Prisma Client singleton
- `src/generated/prisma/` - Generated Prisma Client
- `src/utils/` - Utility functions
- `src/types/` - Shared TypeScript types
- `src/trpc.ts` - tRPC initialization
- `src/server.ts` - Fastify server setup
- `src/index.ts` - Application entry point
- `prisma/schema.prisma` - Prisma schema definition
- `prisma/migrations/` - Database migrations

**tRPC Setup**:
- Server exports `AppRouter` type from `src/routers/index.ts`
- Client imports this type for end-to-end type safety
- Server runs on port 3000 with endpoint `/trpc`
- CORS enabled for local development

**Database Setup**:
- PostgreSQL 16 is used for all environments
- Prisma ORM for database access and migrations
- Environment-specific databases with different credentials
- Automatic migrations run on container startup

### Client Architecture

**Tech Stack**: React 19, TypeScript, Vite, TanStack Router, TanStack Query, React Hook Form, Zod, Tailwind CSS v4, Shadcn UI

**Module Pattern**: Feature-based organization with three root directories:
- `src/modules/[EntityName]/` - Entity modules (Rules, TextBlocks, Documents, Collections)
  - Each contains: `components/`, `hooks/`, `pages/`, `types/`, `utils/`
- `src/services/[serviceName]/` - Service modules for API/business logic
- `src/types/[typeName]/` - Shared type definitions

**Global Structure**:
- `src/components/` - Global UI components (Shadcn UI components)
- `src/lib/const/` - Constants
- `src/lib/schemas/` - Zod schemas
- `src/lib/utils/` - Utility functions
- `src/routes/` - TanStack Router route definitions
- `src/stories/` - Storybook stories

**Path Alias**: `@` resolves to `src/`

### Data Model

Key entities (see `docs/core/schema.dbml` for full schema):
- **Collections**: File-based document collections with directory paths
- **Documents**: Two types - `general` (contains text-blocks) and `rule` (contains rules)
- **Text Blocks**: Content blocks within general documents
- **Rules**: Categorized rules within rule documents with enable/disable and priority settings

### Communication Protocol
- Client-server communication uses tRPC
- Create `useQuery` or `useMutation` hooks for all data fetching/mutation logic

### Frontend Patterns
**CRITICAL**: All data tables MUST follow the standardized four-step pattern:
1. Fetch data with query hook
2. Attach line numbers using `useDataTableRows`
3. Define columns using column definition hook
4. Pass to `<DataTable>`

See `docs/core/frontend-architecture.md` for complete details and examples.
Reference implementation: `client/src/modules/Document/pages/DocumentListPage.tsx`

## Development Principles

### TypeScript Standards
- NEVER use `any` type
- Prefer type inference over explicit typing
- Prefer union types over enums
- File size limit: 201 lines (exceptions: constants, tests, stories, table column hooks)

### React Standards
- One component per file
- Use `use` prefix for custom hooks
- No class components
- Prefer context/providers over prop drilling
- Extract logic into custom hooks
- Use `standardSchemaResolver` from `@hookform/resolvers/standard-schema` for React Hook Form + Zod

### Code Style
- Prefer simple solutions over clever solutions
- Follow SOLID, YAGNI, and DRY principles
- Comment code to explain to future developers

### Design System
- Modern, minimalistic, "OS-like" feel with tile-like aesthetics
- Reduced border radius for tight, tile-like appearance
- Compact spacing throughout
- Liberal use of small, legible icons

## Documentation Workflow

The repository supports three documentation commands:

1. **generate** - Generate `spec`, `task`, and `impl` docs for features
   - Specs: Gherkin format in `docs/specs/[feature-name].feature`
   - Tasks: Checkbox task lists in `docs/tasks/[feature-name].md`
   - Impl: Implementation notes in `docs/impl/[feature-name].md`

2. **archive** - Move completed work to `docs/archive/SUMMARY-{n}.md`
   - Create paragraph-length summaries of completed features
   - Start new summary file when current reaches ~500 lines
   - Delete archived specs/tasks/impl files

3. **audit** - Audit codebase against core principles
   - Save report to `docs/AUDIT.md` (overwrite each run)
   - Remove issues from report as they're resolved
   - File should be empty when no issues remain

### Documentation Rules
- NEVER put code examples or implementation details in specs/tasks (use impl docs)
- Keep code examples minimal throughout all documentation
- Always update `docs/core/schema.dbml` after schema changes
- Refer to schema.dbml as source of truth for database structure

## Docker Setup

The project uses Docker with three separate environments that can run side-by-side:

### Environment Details

| Environment | Server Port | Client Port | Purpose |
|------------|-------------|-------------|---------|
| Development | 3000 | 5173 | Hot reload, volume mounts for live code updates |
| Testing | 3001 | 5174 | Isolated testing environment |
| Production | 3002 | 8080 | Optimized builds with health checks |

### Docker Files

- **server/Dockerfile** - Multi-stage build (development, builder, production)
- **client/Dockerfile** - Multi-stage build (development with Vite, production with nginx)
- **docker-compose.dev.yml** - Development environment with volume mounts
- **docker-compose.test.yml** - Testing environment
- **docker-compose.prod.yml** - Production environment with health checks
- **start-dev.sh** - Start development environment
- **start-test.sh** - Start testing environment
- **start-prod.sh** - Start production environment (detached mode)
- **stop-all.sh** - Stop all running environments

### Key Features

- **Hot Reload**: Development containers mount source directories as volumes
- **Multi-stage Builds**: Optimized production images exclude dev dependencies
- **Health Checks**: Production environment includes health monitoring
- **Network Isolation**: Each environment has its own Docker network
- **Side-by-side Operation**: Different ports allow running all environments simultaneously
- **Database Integration**: Each environment has its own PostgreSQL instance with isolated data

### Database Configuration

Each Docker environment includes a dedicated PostgreSQL 16 container:

| Environment | Database Port | Container Name | Credentials | Database Name |
|------------|---------------|----------------|-------------|---------------|
| Development | 5432 | docmaster-db-dev | docmaster_dev / docmaster_dev | docmaster_dev |
| Testing | 5433 | docmaster-db-test | docmaster_test / docmaster_test | docmaster_test |
| Production | 5434 | docmaster-db-prod | docmaster_prod / [change_me] | docmaster_prod |

**Key Points**:
- Each environment's database runs on a different port for side-by-side operation
- Database credentials are passed via environment variables in docker-compose files
- Persistent data stored in Docker volumes (`postgres-{env}-data`)
- Automatic health checks ensure database is ready before starting server
- Prisma migrations run automatically on container startup
- For production, change the default password in `docker-compose.prod.yml`

**Local Development** (without Docker):
- Reference `server/.env.{environment}` for connection strings
- Requires local PostgreSQL installation
- Use `npm run prisma:migrate` to apply migrations
