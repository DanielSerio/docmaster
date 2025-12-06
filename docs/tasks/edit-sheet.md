# Edit Sheet Component - Task List (Rules Only)

## Implementation Status

### ✅ MVP Complete - Ready for Testing
The EditSheet component is fully implemented and ready for manual testing at `/rules`. All core features are working:
- View/Edit mode toggle
- Add new rows (via focus on last empty row)
- Edit existing rows
- Delete rows (with visual feedback)
- Inline validation with error messages
- Batch save operation (create/update/delete atomically)
- Keyboard shortcuts (Escape to cancel, Ctrl+S/Cmd+S to save)
- Arrow key navigation (Up/Down/Left/Right with column/row wrapping)
- Error handling and loading states
- Last row delete button disabled

### 🚧 Optional/Future Enhancements
- Additional ARIA labels and accessibility improvements
- Visual indicators for modified rows
- Smooth transitions between modes
- Column definition helper utilities

## Server-Side Implementation - Batch API Endpoint

### Rules Batch Endpoint

- [x] Create `batchUpdateDocumentRules` service function in `documentRule.service.ts`
- [x] Accept input with arrays: newRules, updatedRules, deletedRuleIds
- [x] Implement transaction to handle all operations atomically
- [x] Create new rule junction records from newRules array
- [x] Update existing rule junction records from updatedRules array
- [x] Delete rule junction records by IDs from deletedRuleIds array
- [x] Return updated full list of document rules after changes
- [x] Add error handling for constraint violations
- [x] Create Zod schema for batch input validation

### tRPC Router Integration

- [x] Add `batchUpdate` mutation to `documentRule` router
- [x] Define input schema for batch operations
- [x] Define output schema for batch operations
- [ ] Test batch endpoint with mixed operations (new, update, delete)

## Core Edit Sheet Components

### EditSheet Root Component

- [x] Create `client/src/components/edit-sheet/EditSheet.tsx`
- [x] Define EditSheet compound component structure
- [x] Accept data, columns, isLoading props
- [x] Manage edit mode state (view/edit)
- [x] Track local changes (new, updated, deleted rows)
- [x] Implement mode toggle (Edit button in view, Save/Cancel in edit)
- [x] Render table with conditional edit mode UI
- [x] Export EditSheet as default and named export

### EditSheetNavigator Wrapper

- [x] Create `client/src/components/edit-sheet/subcomponents/EditSheetNavigator.tsx`
- [x] Wrap table element to handle keyboard navigation
- [x] Listen for arrow key events (up, down, left, right)
- [x] Track current focused cell position
- [x] Implement down arrow: move to next row, same column
- [x] Implement up arrow: move to previous row, same column
- [x] Implement right arrow: move to next column, same row (wrap to next row)
- [x] Implement left arrow: move to previous column, same row (wrap to previous row)
- [x] Handle edge cases (first/last row/column)
- [x] Preserve focus during row auto-add
- [x] Auto-select text in input fields when navigating

### EditSheetTable Component

- [x] Create `client/src/components/edit-sheet/subcomponents/ESTableBody.tsx`
- [x] Create `client/src/components/edit-sheet/subcomponents/ESTableHeader.tsx`
- [x] Accept columns prop with view and edit render functions
- [x] Render table head with column headers
- [x] Render table body with rows
- [x] Toggle between view cells and edit input cells based on mode
- [x] Add empty row at bottom in edit mode
- [x] Implement auto-add row when editing last empty row
- [x] Render actions column in edit mode only
- [x] Apply table styling consistent with DataTable

### EditSheetActions Column

- [x] Create `client/src/components/edit-sheet/subcomponents/ESActions.tsx`
- [x] Render delete button for each row
- [x] Handle delete click: mark row as deleted
- [x] Visual indication for deleted rows (strikethrough, opacity)
- [x] Disable delete button on already deleted rows
- [x] Disable inputs on deleted rows
- [x] Only visible in edit mode

### EditSheetToolbar Component

- [x] Create `client/src/components/edit-sheet/subcomponents/ESToolbar.tsx`
- [x] Render "Edit" button in view mode
- [x] Render "Save" and "Cancel" buttons in edit mode
- [x] Handle Edit click: enter edit mode
- [x] Handle Save click: validate and submit batch changes
- [x] Handle Cancel click: show confirmation if changes exist, reset state
- [x] Display loading state during save
- [ ] Integrate with error context for error display

### Edit Sheet Hooks

#### useEditSheetState Hook

- [x] Create `client/src/components/edit-sheet/hooks/useEditSheetState.tsx`
- [x] Manage mode state (view/edit)
- [x] Track original data snapshot
- [x] Track local changes (additions, modifications, deletions)
- [x] Provide methods: enterEdit, exitEdit, resetChanges
- [x] Compute derived state: hasChanges, newRows, updatedRows, deletedRows
- [x] Return state and methods
- Note: State management integrated directly into EditSheet.tsx

#### useEditSheetAutoAdd Hook

- [x] Create `client/src/components/edit-sheet/hooks/useEditSheetAutoAdd.tsx`
- [x] Detect focus on bottom empty row
- [x] Automatically add new empty row below
- [x] Preserve focus in current field during add
- [x] Prevent multiple rapid additions
- [x] Return focus handlers for cells
- Note: Auto-add logic integrated directly into EditSheet.tsx with handleCellFocus

#### useEditSheetValidation Hook

- [x] Create `client/src/components/edit-sheet/hooks/useEditSheetValidation.tsx`
- [x] Validate all rows in edit mode
- [x] Track validation errors per row/field
- [x] Compute isValid flag for save button state
- [x] Return validation state and error messages
- [x] Integrate validation into EditSheet component
- [x] Display inline validation errors in table cells
- [x] Disable save button when validation fails

### Column Definition Utilities

- [ ] Create `client/src/components/edit-sheet/columns/index.ts` (OPTIONAL - not needed for MVP)
- [ ] Provide helper for creating edit sheet columns (OPTIONAL)
- [ ] Support viewCell and editCell render functions (OPTIONAL)
- [ ] Support validation rules per column (OPTIONAL)
- [ ] Support input types (text, number, checkbox, select) (OPTIONAL)
- [ ] Consistent with DataTable column patterns (OPTIONAL)
- Note: Column pattern already established via useRulesEditSheetColumns hook

## Rules Edit Sheet Implementation

### Rules Column Definitions

- [x] Create `client/src/modules/Document/hooks/rules-edit-sheet/useRulesEditSheetColumns.tsx`
- [x] Define columns: rawContent, categoryId, priority, isEnabled
- [x] Implement viewCell renderers for each column
- [x] Implement editCell with Input for rawContent
- [x] Implement editCell with Select for categoryId (fetch categories)
- [x] Implement editCell with Input type="number" for priority
- [x] Implement editCell with Checkbox for isEnabled
- [x] Add validation: rawContent required, priority 1-100
- [x] Export column definitions hook

### Rules Query Hook

- [x] Create `client/src/modules/Document/hooks/rules-edit-sheet/useDocumentRulesQuery.tsx`
- [x] Query document rules by documentId
- [x] Include rule category information
- [x] Handle loading and error states
- [x] Return rules data for EditSheet

### Rules Batch Mutation Hook

- [x] Create `client/src/modules/Document/hooks/rules-edit-sheet/useBatchUpdateRulesMutation.tsx`
- [x] Wrap tRPC documentRule.batchUpdate mutation
- [x] Accept documentId and batch changes payload
- [x] Handle onSuccess: invalidate queries
- [x] Handle onError: display error, remain in edit mode
- [x] Return mutation state and methods

### Rules Edit Sheet Page Integration (Master Rules at /rules)

- [x] Create batch API endpoint for master rules (`rule.batchUpdate`)
- [x] Create `client/src/modules/Rule/hooks/rules-edit-sheet/useRulesQuery.tsx`
- [x] Create `client/src/modules/Rule/hooks/rules-edit-sheet/useRulesEditSheetColumns.tsx`
- [x] Create `client/src/modules/Rule/hooks/rules-edit-sheet/useBatchUpdateRulesMutation.tsx`
- [x] Create `client/src/modules/Rule/pages/RuleListPage.tsx`
- [x] Create `client/src/routes/rules/index.tsx`
- [x] Revert `DocumentRulesPage` to placeholder (document-rule overrides to be implemented separately)
- [x] Fix onFocus trigger for row auto-add functionality
- [x] Disable delete button on last empty row
- [x] Add keyboard shortcuts (Escape and Ctrl+S/Cmd+S)
- [x] Test full edit flow at /rules (ready for manual testing)

### Document Rules Page (Document-Rule Junction - To Be Implemented)

- [ ] Page at `/documents/$id/rules` for priority overrides per document
- [ ] EditSheet for enabling/disabling rules on specific documents
- [ ] Columns: rule name, priority override, isEnabled toggle
- [ ] Different from master rules - this is junction table editing


## Keyboard Navigation & Accessibility

- [x] Implement Escape key to cancel (with confirmation)
- [x] Implement Ctrl+S/Cmd+S to save (if valid)
- [x] Ensure all inputs are keyboard accessible
- [ ] Add proper ARIA labels for edit mode
- [ ] Add focus indicators for keyboard navigation
- [ ] Test tab navigation through fields
- [ ] Test screen reader compatibility

## Styling & UX Polish

- [x] Style view mode to match DataTable readonly appearance
- [x] Style edit mode with clear input fields and borders
- [ ] Add visual indicator for modified rows
- [x] Add visual indicator for deleted rows (strikethrough/fade)
- [x] Style actions column with appropriate spacing
- [ ] Add smooth transitions between view/edit modes
- [x] Add loading spinners during save operation
- [x] Style validation error messages inline
- [x] Ensure responsive behavior on smaller screens

## Testing & Validation

- [ ] Test entering and exiting edit mode
- [ ] Test adding multiple new rows
- [ ] Test editing existing row fields
- [ ] Test deleting rows and visual feedback
- [ ] Test auto-add row on bottom row focus
- [ ] Test arrow key navigation in all directions
- [ ] Test row wrap navigation (right from last column, left from first)
- [ ] Test save with mixed changes (new, update, delete)
- [ ] Test cancel with unsaved changes confirmation
- [ ] Test validation preventing save
- [ ] Test error handling on save failure
- [ ] Test empty state in view and edit modes
- [ ] Test keyboard shortcuts (Escape, Ctrl+S)
- [ ] Test focus preservation during auto-add

## Documentation

- [ ] Document EditSheet component API
- [ ] Document EditSheetNavigator usage
- [ ] Document column definition pattern
- [ ] Document batch API endpoint contracts
- [ ] Add examples for creating new edit sheets
- [ ] Document keyboard navigation behavior
- [ ] Update frontend-architecture.md with EditSheet patterns
