# DocMaster Server

The DocMaster server is a Node.js server that provides a tRPC API for the DocMaster application.

## Tech Stack

- [TypeScript](https://www.typescriptlang.org/) - The primary programming language
- [tRPC](https://trpc.io/) - End-to-end typesafe API framework
- [Fastify](https://fastify.dev/) - Fast and low overhead web framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Zod](https://zod.dev/) - Schema validation (shared with client)
- [archiver](https://www.archiverjs.com/) - Library for creating zip files

## Architecture Decisions

### Why Fastify?
- Excellent performance with low overhead
- Native TypeScript support
- Built-in schema validation
- Easy tRPC integration via `@trpc/server/adapters/fastify`
- Robust plugin ecosystem

### Why Prisma?
- Type-safe database access matching TypeScript standards
- Auto-generated types sync with database schema
- Migration system aligns with schema.dbml as source of truth
- Excellent developer experience
- Native PostgreSQL support

### Why PostgreSQL?
- Robust relational database matching the DBML schema structure
- ACID compliance for data integrity
- Excellent performance for document management operations
- Wide Docker support for multi-environment setup

## Module Structure

```
server/
├── src/
│   ├── routers/           # tRPC routers by entity
│   │   ├── collection.ts
│   │   ├── document.ts
│   │   ├── rule.ts
│   │   ├── textBlock.ts
│   │   └── index.ts       # Root router
│   ├── services/          # Business logic layer
│   │   ├── collection/
│   │   ├── document/
│   │   ├── rule/
│   │   └── textBlock/
│   ├── utils/             # Utility functions
│   ├── types/             # Shared types
│   ├── prisma/            # Prisma schema and migrations
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── server.ts          # Fastify server setup
│   └── index.ts           # Entry point
├── tsconfig.json
└── package.json
```

## Development Workflow

### Commands
```bash
# Development
npm run dev              # Start development server with hot reload
npm run build            # Compile TypeScript
npm start                # Start production server

# Database
npm run db:migrate       # Run Prisma migrations
npm run db:generate      # Generate Prisma Client
npm run db:studio        # Open Prisma Studio
npm run db:push          # Push schema changes (dev only)
npm run db:seed          # Seed database

# Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler check
```

## Core Principles Alignment

- **TypeScript**: Never use `any`, prefer inference, prefer union types over enums
- **File Size**: 201 line limit (exceptions: constants, tests)
- **SOLID/YAGNI/DRY**: Simple solutions, modular design, avoid duplication
- **Schema Sync**: Prisma schema must match `docs/core/schema.dbml` at all times
