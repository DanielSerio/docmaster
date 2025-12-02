# Server-Side Services Implementation Tasks

## Zod Schema Definitions

- [ ] Create `server/src/lib/schemas/` directory
- [ ] Create shared Zod schemas for all entities
  - [ ] Create `ruleCategory.schema.ts` with input and output schemas
  - [ ] Create `rule.schema.ts` with input and output schemas
  - [ ] Create `textBlock.schema.ts` with input and output schemas
  - [ ] Create `document.schema.ts` with input and output schemas
  - [ ] Create `documentRule.schema.ts` with input and output schemas
  - [ ] Create `documentTextBlock.schema.ts` with input and output schemas
  - [ ] Create `documentCollection.schema.ts` with input and output schemas
  - [ ] Create `documentCollectionDocument.schema.ts` with input and output schemas
- [ ] Create `server/src/lib/schemas/index.ts` to export all schemas

## Service Layer Structure

- [ ] Create service structure in `server/src/services/`
  - [ ] Create `ruleCategory.service.ts`
  - [ ] Create `rule.service.ts`
  - [ ] Create `textBlock.service.ts`
  - [ ] Create `document.service.ts`
  - [ ] Create `documentRule.service.ts`
  - [ ] Create `documentTextBlock.service.ts`
  - [ ] Create `documentCollection.service.ts`
  - [ ] Create `documentCollectionDocument.service.ts`

## Rule Category Service

- [ ] Implement `createRuleCategory(name: string)` function
- [ ] Implement `getAllRuleCategories()` function
- [ ] Implement `getRuleCategoryById(id: number)` function
- [ ] Implement `updateRuleCategory(id: number, name: string)` function
- [ ] Implement `deleteRuleCategory(id: number)` function
- [ ] Handle unique constraint errors for duplicate names

## Rule Service

- [ ] Implement `createRule(categoryId, rawContent, defaultPriority?)` function
  - [ ] Default defaultPriority to 50 if not provided
  - [ ] Create rule in transaction
  - [ ] Query all existing rule documents
  - [ ] Create junction records for each rule document
  - [ ] Use rule's defaultPriority for junction priority
  - [ ] Set isEnabled to true for all junctions
  - [ ] Rollback if any junction creation fails
- [ ] Implement `getAllRules()` function with category information
- [ ] Implement `getRuleById(id: number)` function
- [ ] Implement `updateRule(id, rawContent?, defaultPriority?)` function
- [ ] Implement `deleteRule(id: number)` function with cascade delete of junctions
- [ ] Handle foreign key constraint errors for invalid categoryId

## Text Block Service

- [ ] Implement `createTextBlock(rawContent, defaultPriority?)` function
  - [ ] Default defaultPriority to 50 if not provided
  - [ ] Create text block in transaction
  - [ ] Query all existing general documents
  - [ ] Create junction records for each general document
  - [ ] Use text block's defaultPriority for junction priority
  - [ ] Set isEnabled to false for all junctions
  - [ ] Rollback if any junction creation fails
- [ ] Implement `getAllTextBlocks()` function
- [ ] Implement `getTextBlockById(id: number)` function
- [ ] Implement `updateTextBlock(id, rawContent?, defaultPriority?)` function
- [ ] Implement `deleteTextBlock(id: number)` function with cascade delete of junctions

## Document Service

- [ ] Implement `createDocument(documentType, filename)` function
  - [ ] Set createdAt and updatedAt timestamps
  - [ ] Create document in transaction
  - [ ] If documentType is "rule":
    - [ ] Query all existing rules
    - [ ] Create document_rules junction for each rule
    - [ ] Use rule's defaultPriority for junction priority
    - [ ] Set isEnabled to true
  - [ ] If documentType is "general":
    - [ ] Query all existing text blocks
    - [ ] Create document_text_blocks junction for each text block
    - [ ] Use text block's defaultPriority for junction priority
    - [ ] Set isEnabled to false
  - [ ] Rollback if any junction creation fails
- [ ] Implement `getAllDocuments()` function
- [ ] Implement `getDocumentById(id: number)` function
- [ ] Implement `updateDocument(id, filename)` function
  - [ ] Update updatedAt timestamp
  - [ ] Do not modify createdAt
- [ ] Implement `deleteDocument(id: number)` function with cascade deletes

## Document-Rule Junction Service

- [ ] Implement `updateDocumentRulePriority(documentId, ruleId, priority)` function
  - [ ] Update junction record
  - [ ] Update parent document's updatedAt timestamp
- [ ] Implement `toggleDocumentRuleEnabled(documentId, ruleId, isEnabled)` function
  - [ ] Update junction record
  - [ ] Update parent document's updatedAt timestamp
- [ ] Implement `getDocumentRules(documentId)` function
  - [ ] Return rules with junction metadata (priority, isEnabled)

## Document-TextBlock Junction Service

- [ ] Implement `updateDocumentTextBlockPriority(documentId, textBlockId, priority)` function
  - [ ] Update junction record
  - [ ] Update parent document's updatedAt timestamp
- [ ] Implement `toggleDocumentTextBlockEnabled(documentId, textBlockId, isEnabled)` function
  - [ ] Update junction record
  - [ ] Update parent document's updatedAt timestamp
- [ ] Implement `getDocumentTextBlocks(documentId)` function
  - [ ] Return text blocks with junction metadata (priority, isEnabled)

## Document Collection Service

- [ ] Implement `createDocumentCollection(name)` function
  - [ ] Set createdAt and updatedAt timestamps
- [ ] Implement `getAllDocumentCollections()` function
- [ ] Implement `getDocumentCollectionById(id: number)` function
- [ ] Implement `updateDocumentCollection(id, name)` function
  - [ ] Update updatedAt timestamp
- [ ] Implement `deleteDocumentCollection(id: number)` function with cascade deletes
- [ ] Handle unique constraint errors for duplicate names

## Document Collection Document Service

- [ ] Implement `addDocumentToCollection(collectionId, documentId, path)` function
- [ ] Implement `getCollectionDocuments(collectionId)` function
- [ ] Implement `updateDocumentPath(collectionId, documentId, path)` function
- [ ] Implement `removeDocumentFromCollection(collectionId, documentId)` function

## tRPC Router Structure

- [ ] Create router structure in `server/src/routers/`
  - [ ] Create `ruleCategory.router.ts`
  - [ ] Create `rule.router.ts`
  - [ ] Create `textBlock.router.ts`
  - [ ] Create `document.router.ts`
  - [ ] Create `documentRule.router.ts`
  - [ ] Create `documentTextBlock.router.ts`
  - [ ] Create `documentCollection.router.ts`
  - [ ] Create `documentCollectionDocument.router.ts`

## Rule Category Router

- [ ] Create `create` procedure with Zod input and output validation
- [ ] Create `getAll` procedure with Zod output validation
- [ ] Create `getById` procedure with Zod input and output validation
- [ ] Create `update` procedure with Zod input and output validation
- [ ] Create `delete` procedure with Zod input and output validation

## Rule Router

- [ ] Create `create` procedure with Zod input and output validation
- [ ] Create `getAll` procedure with Zod output validation
- [ ] Create `getById` procedure with Zod input and output validation
- [ ] Create `update` procedure with Zod input and output validation
- [ ] Create `delete` procedure with Zod input and output validation

## Text Block Router

- [ ] Create `create` procedure with Zod input and output validation
- [ ] Create `getAll` procedure with Zod output validation
- [ ] Create `getById` procedure with Zod input and output validation
- [ ] Create `update` procedure with Zod input and output validation
- [ ] Create `delete` procedure with Zod input and output validation

## Document Router

- [ ] Create `create` procedure with Zod input and output validation
- [ ] Create `getAll` procedure with Zod output validation
- [ ] Create `getById` procedure with Zod input and output validation
- [ ] Create `update` procedure with Zod input and output validation
- [ ] Create `delete` procedure with Zod input and output validation

## Document-Rule Router

- [ ] Create `updatePriority` procedure with Zod input and output validation
- [ ] Create `toggleEnabled` procedure with Zod input and output validation
- [ ] Create `getDocumentRules` procedure with Zod input and output validation

## Document-TextBlock Router

- [ ] Create `updatePriority` procedure with Zod input and output validation
- [ ] Create `toggleEnabled` procedure with Zod input and output validation
- [ ] Create `getDocumentTextBlocks` procedure with Zod input and output validation

## Document Collection Router

- [ ] Create `create` procedure with Zod input and output validation
- [ ] Create `getAll` procedure with Zod output validation
- [ ] Create `getById` procedure with Zod input and output validation
- [ ] Create `update` procedure with Zod input and output validation
- [ ] Create `delete` procedure with Zod input and output validation

## Document Collection Document Router

- [ ] Create `addDocument` procedure with Zod input and output validation
- [ ] Create `getCollectionDocuments` procedure with Zod input and output validation
- [ ] Create `updatePath` procedure with Zod input and output validation
- [ ] Create `removeDocument` procedure with Zod input and output validation

## Router Integration

- [ ] Update `server/src/routers/index.ts` to export all routers
- [ ] Mount all routers to the app router

## Testing Preparation

- [ ] Ensure all procedures can be called via tRPC client
- [ ] Verify error handling for constraint violations
- [ ] Verify transaction rollbacks work correctly
