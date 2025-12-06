# Category Type-Ahead Component - Implementation Plan

## ✅ IMPLEMENTATION COMPLETE

All phases have been successfully implemented. The category field now uses a type-ahead combobox that allows free-text input and suggests existing categories.

## Overview
Replace the current Select dropdown for category selection with a type-ahead/combobox component that:
1. Allows free-text input for creating new categories
2. Provides suggestions from existing categories as the user types
3. Works seamlessly within the EditSheet table navigation
4. Maintains the same validation and onChange behavior

## Current State Analysis

### Database Schema
- `rule_categories` table with `id` (pk) and `name` (unique text)
- `rules` table has `categoryId` foreign key to `rule_categories.id`
- Category names are unique at database level

### Current Implementation
- Located in: `client/src/modules/Rule/hooks/rules-edit-sheet/useRulesEditSheetColumns.tsx`
- Uses Shadcn `Select` component
- Fetches categories via `trpc.ruleCategory.getAll.useQuery()`
- Stores category ID (number) in the rule record
- Displays category name in view mode

### Required Changes
1. Store category **name** (string) instead of category **ID** (number)
2. Create/update category on the server when saving
3. Build type-ahead UI component
4. Update column definition to use type-ahead

## Implementation Plan

### Phase 1: Create CategoryTypeAhead Component

**File**: `client/src/components/ui/category-typeahead.tsx`

**Component Structure**:
```typescript
interface CategoryTypeAheadProps {
  value: string;                    // Category name (not ID)
  onChange: (value: string) => void;
  onFocus?: () => void;
  disabled?: boolean;
  suggestions: string[];            // List of existing category names
}
```

**Features**:
- Built on Shadcn `Popover` + `Command` components
- Input field triggers popover on focus
- Filter suggestions as user types
- Show "Create new: {inputValue}" option when no exact match
- Close popover on selection
- Support keyboard navigation (Arrow Up/Down, Enter, Escape)
- Auto-select text on focus (for EditSheet navigation)

**Dependencies**:
- `@/components/ui/popover`
- `@/components/ui/command`
- `@/components/ui/input`
- `lucide-react` icons

**Keyboard Behavior**:
- Arrow Up/Down: Navigate suggestions
- Enter: Select highlighted suggestion
- Escape: Close popover without selecting
- Tab: Close popover and move to next field
- Typing: Filter suggestions and show "Create new" option

### Phase 2: Update Server-Side Schema & Services

#### 2.1 Update Rule Schema
**File**: `server/src/lib/schemas/rule.schema.ts`

Change `createRuleInputSchema`:
- Replace `categoryId: z.number()` with `categoryName: z.string().min(1)`

Update `batchUpdateRulesInputSchema`:
- Ensure newRules and updatedRules accept `categoryName` instead of `categoryId`

#### 2.2 Update Rule Service
**File**: `server/src/services/rule.service.ts`

Modify `batchUpdateRulesImpl`:
1. Extract unique category names from input
2. Use `upsert` to create categories if they don't exist:
   ```typescript
   const category = await tx.ruleCategory.upsert({
     where: { name: categoryName },
     create: { name: categoryName },
     update: {},
   });
   ```
3. Map category names to IDs before creating/updating rules
4. Return rules with populated category relations

#### 2.3 Add Category Name to Output Schema
**File**: `server/src/lib/schemas/rule.schema.ts`

Update `ruleWithCategorySchema` to ensure category name is included in response.

### Phase 3: Update Client-Side Type Definitions

**File**: `client/src/modules/Rule/hooks/rules-edit-sheet/useRulesQuery.tsx`

Update `RuleRecord` type:
- Change `categoryId: number` to `categoryName: string`
- Keep `category` relation for display purposes

### Phase 4: Update Rules Column Definition

**File**: `client/src/modules/Rule/hooks/rules-edit-sheet/useRulesEditSheetColumns.tsx`

#### 4.1 Replace categoryId column with categoryName
```typescript
{
  id: "categoryName",
  accessorKey: "categoryName" as keyof RuleRecord,
  header: "Category",
  viewCell: ({ value }) => <span>{String(value || "")}</span>,
  editCell: ({ value, onChange, onFocus, disabled }) => (
    <CategoryTypeAhead
      value={String(value || "")}
      onChange={onChange}
      onFocus={onFocus}
      disabled={disabled}
      suggestions={categories?.map(c => c.name) || []}
    />
  ),
  validation: (value) => {
    if (!value || String(value).trim() === "") {
      return "Category is required";
    }
  },
}
```

#### 4.2 Update dependencies
- Import `CategoryTypeAhead` component
- Keep `trpc.ruleCategory.getAll.useQuery()` for suggestions
- Map categories to names array

### Phase 5: Update Batch Mutation

**File**: `client/src/modules/Rule/hooks/rules-edit-sheet/useBatchUpdateRulesMutation.tsx`

No changes needed - mutation will automatically send `categoryName` instead of `categoryId`.

### Phase 6: Testing Checklist

#### Manual Testing
- [ ] Type partial category name - see filtered suggestions
- [ ] Type new category name - see "Create new: X" option
- [ ] Select existing category from suggestions
- [ ] Create new category via "Create new" option
- [ ] Navigate with keyboard (arrows, enter, escape)
- [ ] Tab to next field - popover closes
- [ ] Arrow key navigation still works in EditSheet
- [ ] Save with new category - verify created in database
- [ ] Save with existing category - verify no duplicates
- [ ] Validation shows error for empty category
- [ ] Escape key cancels edit mode
- [ ] Delete button disabled on last row

#### Edge Cases
- [ ] Empty input shows all suggestions
- [ ] Case-insensitive matching
- [ ] Whitespace trimming
- [ ] Long category names don't break layout
- [ ] Category name with special characters
- [ ] Rapid typing doesn't break filtering

## Implementation Order

1. **Create CategoryTypeAhead component** - Build and test in isolation
2. **Update server schema** - Change categoryId to categoryName in schemas
3. **Update server service** - Add category upsert logic
4. **Update client types** - Change RuleRecord type definition
5. **Update column definition** - Replace Select with CategoryTypeAhead
6. **Test end-to-end** - Full create/update/delete flow

## Migration Notes

### Data Migration
**Not needed** - The relationship between rules and categories remains the same:
- Database still stores `categoryId` foreign key
- Server now accepts `categoryName` and resolves to ID internally
- Client works with category names for simpler UX

### Backwards Compatibility
- Existing rules continue to work
- Server handles both categoryId (internal) and categoryName (API)
- No breaking changes to database schema

## Benefits

1. **Better UX**: Type to filter instead of scrolling through dropdown
2. **Flexibility**: Create new categories inline without separate form
3. **Faster data entry**: Keyboard-driven workflow
4. **Simpler client code**: No ID mapping needed on client
5. **Type-safety**: Category names are strings (easier to work with)

## Risks & Mitigations

**Risk**: User creates duplicate categories with slight variations
**Mitigation**: Show all existing categories as suggestions, case-insensitive matching

**Risk**: Category name conflicts (typos)
**Mitigation**: Database unique constraint prevents exact duplicates

**Risk**: Arrow key navigation conflicts with table navigation
**Mitigation**: Popover captures arrow keys when open, table navigation when closed

**Risk**: Performance with many categories
**Mitigation**: Command component handles filtering efficiently (uses cmdk library)
