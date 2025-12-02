Feature: Server-Side Services Implementation

  As a server-side API
  I want all endpoints to validate inputs and outputs using Zod schemas
  So that data integrity is guaranteed and type safety is enforced end-to-end

  Background:
    Given the server is running with Prisma and PostgreSQL configured
    And the database schema is migrated
    And all tRPC procedures use Zod for input and output validation
    And Zod schemas are defined in server/src/lib/schemas/
    And input validation errors return appropriate error messages
    And output validation ensures response structure matches schema

  # VALIDATION REQUIREMENTS

  Scenario: Input validation with Zod
    When a client sends invalid input to any endpoint
    Then the request should be rejected before reaching the service layer
    And a validation error should be returned with details about the invalid fields

  Scenario: Output validation with Zod
    When a service returns data from any endpoint
    Then the response should be validated against the output schema
    And only valid, type-safe data should be returned to the client

  # RULE CATEGORY MANAGEMENT

  Scenario: Create a new rule category
    When a client creates a rule category with name "Code Style"
    Then the category should be created with a unique ID
    And the category name should be stored as "Code Style"
    And the response should be validated against the output schema

  Scenario: List all rule categories
    Given the following rule categories exist:
      | name              |
      | Code Style        |
      | Documentation     |
      | Error Handling    |
    When a client requests all rule categories
    Then the response should contain 3 categories
    And the categories should be ordered by ID
    And the response should be validated against the output schema

  Scenario: Prevent duplicate rule category names
    Given a rule category exists with name "Code Style"
    When a client attempts to create another category with name "Code Style"
    Then the operation should fail with a uniqueness constraint error

  # RULE MANAGEMENT

  Scenario: Create a new rule
    Given a rule category exists with name "Code Style"
    When a client creates a rule with:
      | field           | value                                    |
      | categoryId      | [Code Style category ID]                 |
      | rawContent      | Always use TypeScript strict mode        |
      | defaultPriority | 75                                       |
    Then the rule should be created successfully
    And a junction record should be created for every existing rule document with priority 75 and isEnabled true

  Scenario: Create a rule without explicit defaultPriority
    Given a rule category exists with name "Code Style"
    When a client creates a rule without specifying defaultPriority
    Then the rule should be created with defaultPriority 50

  Scenario: List all rules with category information
    Given multiple rules exist in different categories
    When a client requests all rules
    Then each rule should include its category information

  Scenario: Update a rule's content
    Given a rule exists
    When a client updates the rule's rawContent
    Then the rule content should be updated
    And the rule's association with documents should remain unchanged

  Scenario: Delete a rule
    Given a rule exists with associated document junctions
    When a client deletes the rule
    Then the rule should be removed from the database
    And all associated document_rules junction records should be deleted

  # TEXT BLOCK MANAGEMENT

  Scenario: Create a new text block
    When a client creates a text block with:
      | field           | value                                |
      | rawContent      | This is a reusable text block        |
      | defaultPriority | 60                                   |
    Then the text block should be created successfully
    And a junction record should be created for every existing general document with priority 60 and isEnabled false

  Scenario: Create a text block without explicit defaultPriority
    When a client creates a text block without specifying defaultPriority
    Then the text block should be created with defaultPriority 50

  Scenario: List all text blocks
    Given multiple text blocks exist
    When a client requests all text blocks
    Then all text blocks should be returned

  Scenario: Update a text block's content
    Given a text block exists
    When a client updates the text block's rawContent
    Then the text block content should be updated
    And the text block's association with documents should remain unchanged

  Scenario: Delete a text block
    Given a text block exists with associated document junctions
    When a client deletes the text block
    Then the text block should be removed from the database
    And all associated document_text_blocks junction records should be deleted

  # DOCUMENT MANAGEMENT

  Scenario: Create a rule document
    Given the following rules exist:
      | categoryId | rawContent              | defaultPriority |
      | 1          | Use strict mode         | 50              |
      | 1          | Prefer const over let   | 60              |
      | 2          | Add JSDoc comments      | 70              |
    When a client creates a document with:
      | field        | value           |
      | documentType | rule            |
      | filename     | coding-rules.md |
    Then the document should be created successfully
    And createdAt and updatedAt timestamps should be set
    And 3 document_rules junction records should be created
    And all junction records should have isEnabled true
    And junction records should inherit priority from rule's defaultPriority

  Scenario: Create a general document
    Given the following text blocks exist:
      | rawContent            | defaultPriority |
      | Introduction text     | 50              |
      | Conclusion text       | 60              |
    When a client creates a document with:
      | field        | value              |
      | documentType | general            |
      | filename     | general-doc.md     |
    Then the document should be created successfully
    And createdAt and updatedAt timestamps should be set
    And 2 document_text_blocks junction records should be created
    And all junction records should have isEnabled false
    And junction records should inherit priority from text block's defaultPriority

  Scenario: List all documents
    Given multiple documents of different types exist
    When a client requests all documents
    Then all documents should be returned with their metadata

  Scenario: Get a document by ID
    Given a document exists
    When a client requests the document by ID
    Then the document should be returned with all its fields

  Scenario: Update a document's filename
    Given a document exists with filename "old-name.md"
    When a client updates the filename to "new-name.md"
    Then the filename should be updated
    And the updatedAt timestamp should be updated
    And the createdAt timestamp should remain unchanged

  Scenario: Delete a document
    Given a document exists with associated junction records
    When a client deletes the document
    Then the document should be removed from the database
    And all associated junction records should be deleted
    And all document collection associations should be deleted

  # DOCUMENT-RULE JUNCTION MANAGEMENT

  Scenario: Update rule priority in a document
    Given a rule document exists with a rule junction
    When a client updates the junction's priority to 80
    Then the junction priority should be updated to 80
    And the document's updatedAt timestamp should be updated

  Scenario: Toggle rule enabled status in a document
    Given a rule document exists with an enabled rule junction
    When a client sets the junction's isEnabled to false
    Then the junction should be disabled
    And the document's updatedAt timestamp should be updated

  Scenario: Get all rules for a document
    Given a rule document exists with multiple rule junctions
    When a client requests all rules for the document
    Then all rules should be returned with their junction metadata (priority, isEnabled)

  # DOCUMENT-TEXT BLOCK JUNCTION MANAGEMENT

  Scenario: Update text block priority in a document
    Given a general document exists with a text block junction
    When a client updates the junction's priority to 90
    Then the junction priority should be updated to 90
    And the document's updatedAt timestamp should be updated

  Scenario: Toggle text block enabled status in a document
    Given a general document exists with a disabled text block junction
    When a client sets the junction's isEnabled to true
    Then the junction should be enabled
    And the document's updatedAt timestamp should be updated

  Scenario: Get all text blocks for a document
    Given a general document exists with multiple text block junctions
    When a client requests all text blocks for the document
    Then all text blocks should be returned with their junction metadata (priority, isEnabled)

  # DOCUMENT COLLECTION MANAGEMENT

  Scenario: Create a document collection
    When a client creates a document collection with name "Production Rules"
    Then the collection should be created successfully
    And createdAt and updatedAt timestamps should be set

  Scenario: Prevent duplicate collection names
    Given a collection exists with name "Production Rules"
    When a client attempts to create another collection with name "Production Rules"
    Then the operation should fail with a uniqueness constraint error

  Scenario: List all document collections
    Given multiple document collections exist
    When a client requests all collections
    Then all collections should be returned

  Scenario: Update a collection's name
    Given a collection exists with name "Old Name"
    When a client updates the name to "New Name"
    Then the collection name should be updated
    And the updatedAt timestamp should be updated

  Scenario: Delete a document collection
    Given a collection exists with associated documents
    When a client deletes the collection
    Then the collection should be removed from the database
    And all document collection associations should be deleted

  # DOCUMENT COLLECTION ASSOCIATIONS

  Scenario: Add a document to a collection
    Given a collection exists
    And a document exists
    When a client adds the document to the collection with path "/rules/coding.md"
    Then the association should be created
    And the path should be stored as "/rules/coding.md"

  Scenario: List all documents in a collection
    Given a collection exists with multiple documents
    When a client requests all documents in the collection
    Then all documents should be returned with their paths

  Scenario: Update a document's path in a collection
    Given a document is associated with a collection
    When a client updates the path to "/new-path/file.md"
    Then the path should be updated

  Scenario: Remove a document from a collection
    Given a document is associated with a collection
    When a client removes the document from the collection
    Then the association should be deleted
    And the document itself should remain in the database

  # ERROR HANDLING

  Scenario: Attempt to create a rule with non-existent category
    When a client attempts to create a rule with an invalid categoryId
    Then the operation should fail with a foreign key constraint error

  Scenario: Attempt to get a non-existent document
    When a client requests a document with a non-existent ID
    Then the operation should return null or not found error

  Scenario: Transaction rollback on junction creation failure
    Given multiple rules exist
    When a client creates a document but junction creation fails partway
    Then the entire operation should be rolled back
    And no document should be created
    And no junction records should be created
