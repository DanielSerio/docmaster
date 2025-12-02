# Business Rules

This document defines critical business rules and behaviors for the DocMaster application.

## Junction Table Auto-Population

The application automatically manages junction table records to ensure all documents have access to all available content blocks and rules.

### Document Creation Rules

#### Creating a Rule Document
When a user creates a new **rule document** (`documentType: "rule"`):
- The system automatically creates a `document_rules` junction record for **every existing rule**
- Default values for each junction record:
  - `priority: 50`
  - `isEnabled: true`

**Rationale**: Rule documents should have all rules enabled by default, allowing users to selectively disable rules they don't need.

#### Creating a General Document
When a user creates a new **general document** (`documentType: "general"`):
- The system automatically creates a `document_text_blocks` junction record for **every existing text block**
- Default values for each junction record:
  - `priority: 50`
  - `isEnabled: false`

**Rationale**: General documents should have all text blocks available but disabled by default, requiring users to explicitly enable the blocks they want to include.

### Content Creation Rules

#### Creating a New Rule
When a user creates a new **rule**:
- The system automatically creates a `document_rules` junction record for **every existing rule document**
- Default values for each junction record:
  - `priority: 50` (or the rule's `defaultPriority` if specified)
  - `isEnabled: true`

**Rationale**: New rules should be immediately available and enabled in all rule documents.

#### Creating a New Text Block
When a user creates a new **text block**:
- The system automatically creates a `document_text_blocks` junction record for **every existing general document**
- Default values for each junction record:
  - `priority: 50` (or the text block's `defaultPriority` if specified)
  - `isEnabled: false`

**Rationale**: New text blocks should be immediately available but disabled in all general documents, requiring explicit enablement.

## Summary Table

| Trigger Event | Junction Table | Target Records | Priority | isEnabled |
|---------------|----------------|----------------|----------|-----------|
| Create rule document | `document_rules` | All existing rules | 50 | true |
| Create general document | `document_text_blocks` | All existing text blocks | 50 | false |
| Create rule | `document_rules` | All existing rule documents | 50 | true |
| Create text block | `document_text_blocks` | All existing general documents | 50 | false |

## Document Timestamp Updates

### Cascading Updates to Parent Documents

Whenever a junction table record is modified, the parent document's `updatedAt` timestamp must be updated to reflect the change.

#### Update Triggers

The document's `updatedAt` field should be updated when:

**For `document_rules` junction table**:
- A rule is enabled/disabled (`isEnabled` changed)
- A rule's priority is changed (`priority` changed)
- A rule is added to the document (automatic on rule creation)
- A rule is removed from the document (if deletion is supported)

**For `document_text_blocks` junction table**:
- A text block is enabled/disabled (`isEnabled` changed)
- A text block's priority is changed (`priority` changed)
- A text block is added to the document (automatic on text block creation)
- A text block is removed from the document (if deletion is supported)

#### Implementation Approaches

**Option 1: Application Layer (Recommended)**
- Update the document's `updatedAt` timestamp in the service layer whenever a junction record is modified
- Provides explicit control and makes the behavior visible in the codebase
- Example: When updating `document_rules`, also update the corresponding `documents.updatedAt`

**Option 2: Database Triggers**
- Create database triggers that automatically update `documents.updatedAt` when junction tables change
- More automated but less visible in application code
- May complicate testing and debugging

**Rationale**: A document's configuration (which rules/text blocks are enabled and their priorities) is part of the document's state. Any change to this configuration should be reflected in the document's modification timestamp.

## Implementation Notes

These rules should be implemented as transactional operations to ensure data consistency. If junction record creation fails, the parent entity creation should also fail and roll back.
