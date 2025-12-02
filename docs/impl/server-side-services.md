# Server-Side Services Implementation Notes

## Architecture Overview

The server-side services follow a layered architecture:

1. **tRPC Routers** (`src/routers/`) - Handle HTTP endpoints with Zod input/output validation
2. **Service Layer** (`src/services/`) - Contain business logic and orchestration
3. **Prisma Client** (`src/lib/prisma.ts`) - Database access layer
4. **Database** (PostgreSQL via Prisma) - Data persistence
5. **Zod Schemas** (`src/lib/schemas/`) - Shared validation schemas for type safety

## Key Implementation Patterns

### Service Layer Pattern

Each service module exports functions that encapsulate business logic:

- Services use the Prisma Client singleton from `src/lib/prisma.ts`
- Services handle transactions for complex operations
- Services implement business rules (junction auto-population, timestamp updates)
- Services throw errors that are caught by tRPC error handling

### Transaction Management

Critical operations that involve multiple database writes must use Prisma transactions:

- Creating documents (with junction record creation)
- Creating rules/text blocks (with junction record creation)
- Deleting entities (with cascade deletes)

Prisma provides `prisma.$transaction()` for this purpose.

### Timestamp Management

The Prisma schema uses `@updatedAt` decorator which automatically updates timestamps. However, for cascade updates (when junction records change), we need to manually update the parent document's `updatedAt` field.

### Error Handling

Common database errors to handle:
- Unique constraint violations (duplicate names)
- Foreign key constraint violations (invalid references)
- Not found errors (entity doesn't exist)

tRPC automatically converts thrown errors to appropriate HTTP status codes.

## Junction Table Auto-Population

### Creating Documents

When creating a document, the service must:
1. Create the document record
2. Query all relevant content (rules or text blocks)
3. Create junction records for each piece of content
4. Use appropriate default values based on document type

This should be wrapped in a transaction to ensure atomicity.

### Creating Content (Rules/Text Blocks)

When creating a rule or text block, the service must:
1. Create the content record
2. Query all relevant documents (rule documents or general documents)
3. Create junction records for each document
4. Use the content's defaultPriority for junction priority
5. Use appropriate isEnabled default (true for rules, false for text blocks)

This should be wrapped in a transaction to ensure atomicity.

## Cascade Updates for Timestamps

When updating a junction record (priority or isEnabled), the service must:
1. Update the junction record
2. Update the parent document's `updatedAt` timestamp

This can be done in a transaction or as separate operations since they're dependent.

## Zod Schema Definitions and Validation

### Schema Location and Structure

All Zod schemas are located in `server/src/lib/schemas/` and can be imported via the index file:

```typescript
import { ruleCategorySchema, createRuleCategoryInputSchema } from '../lib/schemas/index.js';
```

**Available Schema Files**:
- `ruleCategory.schema.ts` - Rule category schemas
- `rule.schema.ts` - Rule schemas with `ruleWithCategorySchema` for nested category data
- `textBlock.schema.ts` - Text block schemas
- `document.schema.ts` - Document schemas with timestamps and DocumentType enum
- `documentRule.schema.ts` - Document-rule junction schemas with `documentRuleWithRuleSchema`
- `documentTextBlock.schema.ts` - Document-text block junction schemas with `documentTextBlockWithTextBlockSchema`
- `documentCollection.schema.ts` - Collection schemas with timestamps
- `documentCollectionDocument.schema.ts` - Collection-document junction schemas with `documentCollectionDocumentWithDocumentSchema`
- `index.ts` - Central export file

### Schema Organization

Each schema file exports the following pattern:

1. **Input Schemas**: Validate data coming from the client
   - Create input schemas (e.g., `createRuleCategoryInput`)
   - Update input schemas (e.g., `updateRuleCategoryInput`)
   - Query parameter schemas (e.g., `getRuleCategoryByIdInput`)

2. **Output Schemas**: Validate data being returned to the client
   - Single entity schemas (e.g., `ruleCategoryOutput`)
   - List schemas (e.g., `ruleCategoryListOutput`)
   - Related entity schemas with nested data

### Input Validation

tRPC procedures use `.input()` to validate incoming data:
- Validates request parameters before reaching service layer
- Automatically returns 400 Bad Request with error details on validation failure
- Provides TypeScript types inferred from Zod schemas

### Output Validation

tRPC procedures use `.output()` to validate outgoing data:
- Validates service layer responses before sending to client
- Ensures response structure always matches documented schema
- Catches bugs where service returns unexpected data shape
- Provides end-to-end type safety from database to client

### Schema Reusability

Define base schemas and compose them for complex types:
- Create base entity schemas (e.g., `baseRuleCategory`)
- Extend with relations for nested data (e.g., `ruleCategoryWithRules`)
- Reuse schemas across input/output where appropriate
- Use Zod's `.pick()`, `.omit()`, `.partial()` for variations

### Type Inference

Export TypeScript types from Zod schemas for use in services:
- Use `z.infer<typeof schema>` to generate types
- Share types between routers and services
- Ensures service layer returns correctly typed data

### Validation Error Handling

Input validation errors are handled automatically by tRPC:
- Returns structured error messages with field-level details
- Client receives validation errors in predictable format
- No need for manual validation error handling in services

Output validation failures indicate implementation bugs:
- Should not occur in production if services are correctly implemented
- Helpful during development to catch data shape mismatches
- Consider logging output validation failures for monitoring

## Prisma Queries

### Including Related Data

Use Prisma's `include` option to fetch related data:
- Rules with categories
- Documents with their junction data
- Collections with their documents

### Cascade Deletes

Prisma handles cascade deletes automatically when relations are properly defined in the schema. Ensure the Prisma schema has proper `onDelete` behavior.

## Performance Considerations

### Bulk Operations

When creating multiple junction records, use `createMany` for better performance:
- Creating junctions when creating documents
- Creating junctions when creating content

### Query Optimization

- Use `select` to limit returned fields when full objects aren't needed
- Use `include` judiciously to avoid over-fetching
- Consider pagination for list endpoints

## Benefits of Input and Output Validation

### Type Safety Guarantees

With both input and output validation:
- Client-to-server contract is enforced by input schemas
- Server-to-client contract is enforced by output schemas
- No runtime type mismatches can occur
- TypeScript types are guaranteed to match runtime values

### API Documentation

Zod schemas serve as executable documentation:
- Input schemas document what clients can send
- Output schemas document what clients will receive
- Schemas are the source of truth for API contracts
- Auto-generated API docs can be derived from schemas

### Refactoring Safety

Output validation catches breaking changes:
- If service layer changes break the API contract, output validation fails
- Prevents accidentally shipping incompatible responses
- Safe to refactor service layer knowing validation catches mistakes
- Confidence when modifying database queries or business logic

### Client Code Generation

Output schemas enable type-safe client code:
- tRPC client uses output schemas for response types
- Client gets full TypeScript autocomplete
- Client code breaks at compile time if API changes
- No need for manual type definitions on client

## Testing Strategy

Since we don't use unit tests, ensure:
- All endpoints are exercised via Playwright integration tests
- Error cases are tested (constraint violations, not found errors)
- Transaction rollbacks are verified
- Business rules are validated
- Input validation is tested with invalid data
- Output validation is implicitly tested by integration tests

## Future Considerations

### Caching

Consider implementing caching for:
- Frequently accessed categories
- Document lists
- Collection lists

### Batch Operations

Consider adding batch endpoints for:
- Updating multiple junction records at once
- Bulk enabling/disabling content

### Soft Deletes

Consider implementing soft deletes instead of hard deletes for:
- Documents (preserve history)
- Content (prevent accidental data loss)

### Audit Logging

Consider adding audit logs for:
- Document modifications
- Content creation/deletion
- Junction record changes
