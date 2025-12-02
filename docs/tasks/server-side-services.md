# Server-Side Services Implementation Tasks

## Zod Schema Definitions

✅ **COMPLETED**: All schema files have been created in `server/src/lib/schemas/`

The following schemas are available and ready to use:
- ✅ `ruleCategory.schema.ts` - Rule category input/output schemas
- ✅ `rule.schema.ts` - Rule input/output schemas with category relations
- ✅ `textBlock.schema.ts` - Text block input/output schemas
- ✅ `document.schema.ts` - Document input/output schemas with timestamps
- ✅ `documentRule.schema.ts` - Document-rule junction schemas
- ✅ `documentTextBlock.schema.ts` - Document-text block junction schemas
- ✅ `documentCollection.schema.ts` - Collection input/output schemas with timestamps
- ✅ `documentCollectionDocument.schema.ts` - Collection-document junction schemas
- ✅ `index.ts` - Central export file for all schemas

**Import schemas from**: `server/src/lib/schemas/` or use the index: `import { ruleCategorySchema } from '../lib/schemas/index.js'`

## Service Layer Structure

✅ **COMPLETED**: All service files have been created in `server/src/services/`

- ✅ `ruleCategory.service.ts` - CRUD operations for rule categories
- ✅ `rule.service.ts` - CRUD with junction auto-population for rule documents
- ✅ `textBlock.service.ts` - CRUD with junction auto-population for general documents
- ✅ `document.service.ts` - CRUD with junction auto-population based on document type
- ✅ `documentRule.service.ts` - Junction management with timestamp cascade
- ✅ `documentTextBlock.service.ts` - Junction management with timestamp cascade
- ✅ `documentCollection.service.ts` - CRUD operations for collections
- ✅ `documentCollectionDocument.service.ts` - Junction management for collection-document associations

## Rule Category Service

✅ All functions implemented in `ruleCategory.service.ts`

## Rule Service

✅ All functions implemented in `rule.service.ts` with:
- ✅ Transaction-based creation with junction auto-population
- ✅ Default priority of 50
- ✅ Junction records created for all existing rule documents
- ✅ isEnabled set to true by default

## Text Block Service

✅ All functions implemented in `textBlock.service.ts` with:
- ✅ Transaction-based creation with junction auto-population
- ✅ Default priority of 50
- ✅ Junction records created for all existing general documents
- ✅ isEnabled set to false by default

## Document Service

✅ All functions implemented in `document.service.ts` with:
- ✅ Transaction-based creation with type-specific junction auto-population
- ✅ Rule documents: Create junctions for all rules (priority from rule, isEnabled=true)
- ✅ General documents: Create junctions for all text blocks (priority from block, isEnabled=false)
- ✅ Timestamps automatically managed by Prisma

## Document-Rule Junction Service

✅ All functions implemented in `documentRule.service.ts` with:
- ✅ Priority updates with parent document timestamp cascade
- ✅ Enabled status toggle with parent document timestamp cascade
- ✅ Get document rules with nested category information

## Document-TextBlock Junction Service

✅ All functions implemented in `documentTextBlock.service.ts` with:
- ✅ Priority updates with parent document timestamp cascade
- ✅ Enabled status toggle with parent document timestamp cascade
- ✅ Get document text blocks with nested text block information

## Document Collection Service

✅ All functions implemented in `documentCollection.service.ts` with:
- ✅ Timestamps automatically managed by Prisma
- ✅ CRUD operations

## Document Collection Document Service

✅ All functions implemented in `documentCollectionDocument.service.ts` with:
- ✅ Add/remove documents from collections
- ✅ Update document paths
- ✅ Get all documents in a collection

## tRPC Router Structure

✅ **COMPLETED**: All router files have been created in `server/src/routers/`

- ✅ `ruleCategory.router.ts` - Full CRUD with input/output validation
- ✅ `rule.router.ts` - Full CRUD with input/output validation, returns with category
- ✅ `textBlock.router.ts` - Full CRUD with input/output validation
- ✅ `document.router.ts` - Full CRUD with input/output validation
- ✅ `documentRule.router.ts` - Junction operations with input/output validation
- ✅ `documentTextBlock.router.ts` - Junction operations with input/output validation
- ✅ `documentCollection.router.ts` - Full CRUD with input/output validation
- ✅ `documentCollectionDocument.router.ts` - Junction operations with input/output validation

## All Routers

✅ All routers implemented with complete Zod input and output validation
✅ All CRUD operations (create, getAll, getById, update, delete) implemented where applicable
✅ Junction routers include specialized operations (updatePriority, toggleEnabled, get relations)

## Router Integration

✅ **COMPLETED**: All routers integrated in `server/src/routers/index.ts`

- ✅ All 8 routers mounted to app router
- ✅ AppRouter type exported for client type safety
- ✅ All endpoints accessible via tRPC

## Testing Preparation

⏳ **PENDING**: Ready for integration testing with Playwright

- [ ] Ensure all procedures can be called via tRPC client
- [ ] Verify error handling for constraint violations
- [ ] Verify transaction rollbacks work correctly
- [ ] Test business rules (junction auto-population, timestamp cascades)
