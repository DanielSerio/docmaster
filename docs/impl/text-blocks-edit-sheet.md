# Text blocks edit sheet implementation notes

## Key Differences from Rules
- **NO category field** - Text blocks are simpler than rules, containing only content and priority
- Text blocks do NOT have categories or labels (this is the primary difference from rules)

## Architecture
- Mirror the rules edit sheet structure: shared EditSheet component, keyboard nav hook, validation, and sentinel empty row behavior
- Add text-block-specific hook set under `client/src/modules/TextBlock/hooks/text-blocks-edit-sheet` (query, columns, batch mutation), analogous to rules

## Columns
1. **Content (`rawContent`)** - Required text field
   - Use **textarea** component (multi-line input)
   - Type: `text` (no length limit)
2. **Default Priority (`defaultPriority`)** - Number input
   - Range: 1-100 (same as rules)
   - Default: 50
   - Required field

## Validation Rules
- `rawContent`: Required (cannot be empty or whitespace-only)
- `defaultPriority`: Required, must be between 1-100 (inclusive)
- No length limits on content
- Save disabled when only empty new rows exist with no meaningful changes

## Special Textarea Navigation
- When textarea is focused, arrow keys work normally for text editing
- **Shift+Arrow activates table navigation** (to prevent conflict with text editing)
- This differs from other input fields which use arrow keys directly for navigation

## API Requirements
- **NEW**: Create `textBlock.batchUpdate` tRPC endpoint
- Pattern: Match rules' batch update (accepts `{ new: [], updated: [], deletedIds: [] }`)
- Endpoint must support creating, updating, and deleting text blocks in a single transaction

## Page Structure
- `TextBlockListPage` with `EditSheet` wired to text-block data
- `getRowId` using `id` or "new"
- Save handler maps batch changes to API payload
- Route: `/text-blocks`

## Tests
- Copy rules edit sheet integration cases (view/edit mode, create, update, delete, validation, keyboard shortcuts, loading)
- Adjust for text blocks page/routes
- Test textarea Shift+Arrow navigation behavior specifically
