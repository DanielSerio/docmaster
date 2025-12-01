# Core Principles

## Code Style

1. Always prefer simle solutions over clever solutions.
2. Always use the SOLID principles.
3. Always use the YAGNI principle.
4. Do your best to use the DRY principle.
5. Comment your code to explain it to future developers.

## Typescript

1. Never use `any` type.
2. Prefer inference over explicit typing.
3. Prefer union types over enums.
4. With exclusion of the following file types, all `.ts` and `.tsx` files should be under 201 lines of code:
   - **Constant files** - Files that contain only constants and no logic. May include very large objects/arrays. (found in `src/lib/const` in `client` directory)
   - **Test files** - Files that contain only test code. (named `*.test.ts` or `*.test.tsx`)
   - **Storybook files** - Files that contain only storybook code. (named `*.stories.tsx`)
   - **use[FeatureName]TableColumns hook files** - Files that contain only table column definitions.

## React

1. Use `use` prefix for custom hooks.
2. Allow a maximum of 1 component per file.
3. Do not use class components.
4. prefer using context/providers over props drilling.
5. Extract logic into custom hooks.
6. Always use `standardSchemaResolver` (imported from `@hookform/resolvers/standard-schema`) for `react-hook-form`/`zod` integration.
7. Always create a `useQuery` or `useMutation` hook for any data fetching/mutation logic.

## Frontend Architecture

1. Use a modular pattern for the frontend architecture. "feature directories" will reside in the roots of:
   - `src/modules`: (example path: `src/modules/[featureName]/index.ts`)
   - `src/services`: (example path: `src/services/[serviceName]/index.ts`)
   - `src/types`: (example path: `src/types/[featureName]/index.ts`)

## Document Management

1. Never put code examples or implementation details in the `specs` or `tasks` documents. This is the job of the `impl` documents.
2. Keep code examples in documentation to an absolute minimum. Code examples should be used sparingly and only when necessary.
3. Always update the [docs/core/schema.dbml](./schema.dbml) file to reflect the current state of the database schema after any changes to the database schema.
4. Refer to the [docs/core/schema.dbml](./schema.dbml) file for the current state of the database schema.
5. Abide by the workflow rules outlined in [docs/core/workflow-rules.md](./workflow-rules.md).
