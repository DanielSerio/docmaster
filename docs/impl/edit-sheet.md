# Edit Sheet Component - Implementation Notes (Rules Only)

## Overview

The EditSheet component provides an inline table editing experience for managing document rules without page navigation. Unlike DataTable which navigates to separate create/edit pages, EditSheet allows users to add, edit, and delete multiple rules in place, with all changes batched and submitted together.

**Note**: This initial implementation focuses solely on document rules. Text blocks will be added in a future iteration following the same pattern.

## Core Concept

**Key Difference from DataTable**:
- DataTable: View-only table + navigation to CRUD pages
- EditSheet: View/edit mode toggle + inline editing + batch save

**Two Modes**:
1. **View Mode**: Read-only display, similar to DataTable
2. **Edit Mode**: Inline editing with add/edit/delete capabilities

## Architecture Pattern

### Component Structure

```
<EditSheet>
  <EditSheet.Toolbar>      {/* Edit/Save/Cancel buttons */}
  <EditSheetNavigator>     {/* Keyboard navigation wrapper */}
    <EditSheet.Table>      {/* Main table with rows */}
      <EditSheet.Actions>  {/* Delete button column (edit mode only) */}
```

### State Management

```typescript
{
  mode: 'view' | 'edit',
  originalData: T[],           // Snapshot from server
  localData: T[],              // Working copy in edit mode
  changes: {
    new: T[],                  // Rows to create
    updated: Map<id, T>,       // Rows to update
    deleted: Set<id>           // IDs to delete
  }
}
```

## Server-Side Implementation

### Batch API Endpoint Pattern

Create batch update endpoints that accept three arrays in a single transaction:

```typescript
// Input schema
batchUpdateInput = {
  documentId: number,
  newItems: Array<{ rawContent, priority, isEnabled, ... }>,
  updatedItems: Array<{ id, rawContent, priority, isEnabled, ... }>,
  deletedIds: Array<number>
}

// Service implementation
async batchUpdateDocumentRules({ documentId, newItems, updatedItems, deletedIds }) {
  return await prisma.$transaction(async (tx) => {
    // 1. Delete
    if (deletedIds.length > 0) {
      await tx.documentRule.deleteMany({
        where: {
          documentId,
          ruleId: { in: deletedIds }
        }
      });
    }

    // 2. Update
    for (const item of updatedItems) {
      await tx.documentRule.update({
        where: {
          documentId_ruleId: {
            documentId,
            ruleId: item.id
          }
        },
        data: {
          priority: item.priority,
          isEnabled: item.isEnabled
        }
      });
    }

    // 3. Create
    if (newItems.length > 0) {
      await tx.documentRule.createMany({
        data: newItems.map(item => ({
          documentId,
          ruleId: item.ruleId,
          priority: item.priority,
          isEnabled: item.isEnabled
        }))
      });
    }

    // 4. Return updated full list
    return await tx.documentRule.findMany({
      where: { documentId },
      include: { rule: true }
    });
  });
}
```

**Key Points**:
- Use Prisma transaction for atomicity
- Order: delete → update → create
- Return full updated list for UI refresh
- Handle constraint violations with proper error messages

### Router Configuration

```typescript
// documentRule.router.ts
batchUpdate: publicProcedure
  .input(batchUpdateDocumentRulesInputSchema)
  .output(z.array(documentRuleWithRelationsSchema))
  .mutation(async ({ input }) => {
    return await batchUpdateDocumentRules(input);
  })
```

## Client-Side Implementation

### Core Components

#### EditSheet Root Component

**Location**: `client/src/components/edit-sheet/EditSheet.tsx`

**Responsibilities**:
- Mode state management (view/edit toggle)
- Change tracking (new, updated, deleted)
- Batch save coordination
- Compound component pattern exports

**Props**:
```typescript
interface EditSheetProps<T> {
  data: T[];
  columns: EditSheetColumnDef<T>[];
  isLoading: boolean;
  onSave: (changes: BatchChanges<T>) => Promise<void>;
  getRowId: (row: T) => string;
}
```

**State**:
```typescript
const [mode, setMode] = useState<'view' | 'edit'>('view');
const [originalData] = useState(data); // Snapshot on mount
const [localData, setLocalData] = useState(data);
const [changes, setChanges] = useState<Changes>({
  new: [],
  updated: new Map(),
  deleted: new Set()
});
```

**Key Methods**:
- `enterEditMode()`: Set mode to edit, create snapshot
- `exitEditMode()`: Set mode to view, clear changes
- `handleSave()`: Compute batch payload, call onSave, exit edit
- `handleCancel()`: Confirm if changes exist, reset to original
- `trackChange(type, data)`: Update changes tracking

#### EditSheetNavigator Wrapper

**Location**: `client/src/components/edit-sheet/EditSheetNavigator.tsx`

**Responsibilities**:
- Keyboard arrow navigation
- Focus management
- Cell position tracking

**Implementation**:
```typescript
const EditSheetNavigator = ({ children }) => {
  const [focusedCell, setFocusedCell] = useState<{row: number, col: number}>();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!focusedCell) return;

    switch(e.key) {
      case 'ArrowDown':
        moveFocus(focusedCell.row + 1, focusedCell.col);
        break;
      case 'ArrowUp':
        moveFocus(focusedCell.row - 1, focusedCell.col);
        break;
      case 'ArrowRight':
        // Move right, wrap to next row if at end
        const nextCol = focusedCell.col + 1;
        if (nextCol >= columnCount) {
          moveFocus(focusedCell.row + 1, 0);
        } else {
          moveFocus(focusedCell.row, nextCol);
        }
        break;
      case 'ArrowLeft':
        // Move left, wrap to previous row if at start
        const prevCol = focusedCell.col - 1;
        if (prevCol < 0) {
          moveFocus(focusedCell.row - 1, columnCount - 1);
        } else {
          moveFocus(focusedCell.row, prevCol);
        }
        break;
    }
  };

  const moveFocus = (row: number, col: number) => {
    // Find cell element by data attributes
    const cell = document.querySelector(
      `[data-row="${row}"][data-col="${col}"] input,
       [data-row="${row}"][data-col="${col}"] textarea,
       [data-row="${row}"][data-col="${col}"] select`
    );

    if (cell) {
      (cell as HTMLElement).focus();
      setFocusedCell({ row, col });
    }
  };

  return (
    <div onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
};
```

**Cell Attributes**:
Each editable cell must have:
```tsx
<td data-row={rowIndex} data-col={colIndex}>
  <input onFocus={() => setFocusedCell({row: rowIndex, col: colIndex})} />
</td>
```

#### EditSheetTable Component

**Location**: `client/src/components/edit-sheet/EditSheetTable.tsx`

**Responsibilities**:
- Render table structure
- Toggle view/edit cells based on mode
- Auto-add empty row on bottom row focus
- Integrate actions column

**Implementation**:
```typescript
const EditSheetTable = ({ data, columns, mode, onRowChange, onRowDelete }) => {
  const [rows, setRows] = useState(data);

  // Auto-add row when bottom row is focused
  const handleBottomRowFocus = () => {
    if (mode === 'edit') {
      setRows([...rows, createEmptyRow()]);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          {columns.map(col => <th key={col.id}>{col.header}</th>)}
          {mode === 'edit' && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => {
          const isBottomRow = rowIndex === rows.length - 1;
          const isDeleted = row.__deleted;

          return (
            <tr key={getRowId(row)} className={isDeleted ? 'opacity-50' : ''}>
              {columns.map((col, colIndex) => (
                <td
                  key={col.id}
                  data-row={rowIndex}
                  data-col={colIndex}
                  onFocus={isBottomRow ? handleBottomRowFocus : undefined}
                >
                  {mode === 'view'
                    ? col.viewCell({ row, value: row[col.accessorKey] })
                    : col.editCell({
                        row,
                        value: row[col.accessorKey],
                        onChange: (value) => onRowChange(rowIndex, col.accessorKey, value),
                        disabled: isDeleted
                      })
                  }
                </td>
              ))}
              {mode === 'edit' && (
                <td>
                  <EditSheetActions
                    onDelete={() => onRowDelete(rowIndex)}
                    disabled={isDeleted}
                  />
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
```

#### EditSheetActions Column

**Location**: `client/src/components/edit-sheet/EditSheetActions.tsx`

**Implementation**:
```typescript
const EditSheetActions = ({ onDelete, disabled }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onDelete}
      disabled={disabled}
      aria-label="Delete row"
    >
      <TrashIcon />
    </Button>
  );
};
```

**Delete Behavior**:
- Mark row with `__deleted: true` flag
- Apply visual styling (opacity, strikethrough)
- Disable all inputs in deleted row
- Disable delete button itself
- Track ID in `changes.deleted` Set

#### EditSheetToolbar Component

**Location**: `client/src/components/edit-sheet/EditSheetToolbar.tsx`

**Implementation**:
```typescript
const EditSheetToolbar = ({ mode, onEdit, onSave, onCancel, hasChanges, isSaving, isValid }) => {
  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmed) return;
    }
    onCancel();
  };

  return (
    <div className="flex justify-end gap-2">
      {mode === 'view' && (
        <Button onClick={onEdit}>
          <Edit2Icon /> Edit
        </Button>
      )}

      {mode === 'edit' && (
        <>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={!isValid || isSaving}
          >
            {isSaving ? <Spinner /> : <SaveIcon />}
            Save
          </Button>
        </>
      )}
    </div>
  );
};
```

### Custom Hooks

#### useEditSheetState

**Location**: `client/src/components/edit-sheet/hooks/useEditSheetState.tsx`

```typescript
export function useEditSheetState<T>(initialData: T[], getRowId: (row: T) => string) {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [originalData] = useState(initialData);
  const [localData, setLocalData] = useState(initialData);
  const [changes, setChanges] = useState<Changes<T>>({
    new: [],
    updated: new Map(),
    deleted: new Set()
  });

  const enterEditMode = () => {
    setMode('edit');
    setLocalData([...initialData]); // Fresh copy
  };

  const exitEditMode = () => {
    setMode('view');
    setChanges({ new: [], updated: new Map(), deleted: new Set() });
  };

  const resetChanges = () => {
    setLocalData([...originalData]);
    setChanges({ new: [], updated: new Map(), deleted: new Set() });
  };

  const trackNew = (row: T) => {
    setChanges(prev => ({
      ...prev,
      new: [...prev.new, row]
    }));
  };

  const trackUpdate = (id: string, row: T) => {
    setChanges(prev => ({
      ...prev,
      updated: new Map(prev.updated).set(id, row)
    }));
  };

  const trackDelete = (id: string) => {
    setChanges(prev => ({
      ...prev,
      deleted: new Set(prev.deleted).add(id)
    }));
  };

  const hasChanges = changes.new.length > 0 ||
                     changes.updated.size > 0 ||
                     changes.deleted.size > 0;

  return {
    mode,
    localData,
    setLocalData,
    changes,
    hasChanges,
    enterEditMode,
    exitEditMode,
    resetChanges,
    trackNew,
    trackUpdate,
    trackDelete
  };
}
```

#### useEditSheetAutoAdd

**Location**: `client/src/components/edit-sheet/hooks/useEditSheetAutoAdd.tsx`

```typescript
export function useEditSheetAutoAdd<T>(
  data: T[],
  setData: (data: T[]) => void,
  createEmptyRow: () => T,
  mode: 'view' | 'edit'
) {
  const lastRowRef = useRef<number>(data.length - 1);
  const [hasAddedRow, setHasAddedRow] = useState(false);

  const handleBottomRowFocus = useCallback(() => {
    if (mode !== 'edit') return;
    if (hasAddedRow) return; // Prevent double-add

    setHasAddedRow(true);
    setData([...data, createEmptyRow()]);

    // Reset flag after brief delay
    setTimeout(() => setHasAddedRow(false), 100);
  }, [data, mode, hasAddedRow]);

  return {
    isBottomRow: (rowIndex: number) => rowIndex === data.length - 1,
    handleBottomRowFocus
  };
}
```

#### useEditSheetValidation

**Location**: `client/src/components/edit-sheet/hooks/useEditSheetValidation.tsx`

```typescript
export function useEditSheetValidation<T>(
  data: T[],
  columns: EditSheetColumnDef<T>[]
) {
  const [errors, setErrors] = useState<Map<string, Map<string, string>>>(new Map());

  const validateRow = (rowIndex: number, row: T) => {
    const rowErrors = new Map<string, string>();

    columns.forEach(col => {
      if (col.validation) {
        const value = row[col.accessorKey];
        const error = col.validation(value, row);
        if (error) {
          rowErrors.set(col.id, error);
        }
      }
    });

    if (rowErrors.size > 0) {
      setErrors(prev => new Map(prev).set(String(rowIndex), rowErrors));
    } else {
      setErrors(prev => {
        const next = new Map(prev);
        next.delete(String(rowIndex));
        return next;
      });
    }
  };

  const isValid = errors.size === 0;

  return {
    errors,
    isValid,
    validateRow,
    getRowErrors: (rowIndex: number) => errors.get(String(rowIndex))
  };
}
```

### Column Definition Pattern

```typescript
interface EditSheetColumnDef<T> {
  id: string;
  accessorKey: keyof T;
  header: string;
  viewCell: (props: { row: T; value: any }) => React.ReactNode;
  editCell: (props: {
    row: T;
    value: any;
    onChange: (value: any) => void;
    disabled?: boolean;
  }) => React.ReactNode;
  validation?: (value: any, row: T) => string | undefined;
}
```

**Example - Rules Column Definitions**:

```typescript
export function useRulesEditSheetColumns() {
  const { data: categories } = trpc.ruleCategory.getAll.useQuery();

  return useMemo(() => [
    {
      id: 'rawContent',
      accessorKey: 'rawContent',
      header: 'Rule Content',
      viewCell: ({ value }) => <span>{value}</span>,
      editCell: ({ value, onChange, disabled }) => (
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Enter rule content..."
        />
      ),
      validation: (value) => {
        if (!value || value.trim() === '') {
          return 'Content is required';
        }
      }
    },
    {
      id: 'categoryId',
      accessorKey: 'categoryId',
      header: 'Category',
      viewCell: ({ row }) => <span>{row.category?.name}</span>,
      editCell: ({ value, onChange, disabled }) => (
        <Select
          value={value ? String(value) : ''}
          onValueChange={(val) => onChange(Number(val))}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map(cat => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    },
    {
      id: 'priority',
      accessorKey: 'priority',
      header: 'Priority',
      viewCell: ({ value }) => <span>{value}</span>,
      editCell: ({ value, onChange, disabled }) => (
        <Input
          type="number"
          value={value ?? 50}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          min={0}
          max={100}
        />
      ),
      validation: (value) => {
        if (value < 0 || value > 100) {
          return 'Priority must be between 0 and 100';
        }
      }
    },
    {
      id: 'isEnabled',
      accessorKey: 'isEnabled',
      header: 'Enabled',
      viewCell: ({ value }) => <span>{value ? '✓' : '✗'}</span>,
      editCell: ({ value, onChange, disabled }) => (
        <Checkbox
          checked={value ?? true}
          onCheckedChange={onChange}
          disabled={disabled}
        />
      )
    }
  ], [categories]);
}
```

## Page Integration Example - Rules Edit Sheet

### Rules Edit Sheet Page

**Location**: `client/src/routes/documents/$id/rules.tsx`

```typescript
import { EditSheet } from '@/components/edit-sheet';
import { useDocumentRulesQuery } from '@/modules/Document/hooks/rules-edit-sheet/useDocumentRulesQuery';
import { useRulesEditSheetColumns } from '@/modules/Document/hooks/rules-edit-sheet/useRulesEditSheetColumns';
import { useBatchUpdateRulesMutation } from '@/modules/Document/hooks/rules-edit-sheet/useBatchUpdateRulesMutation';
import { useParams } from '@tanstack/react-router';

export function DocumentRulesPage() {
  const { id } = useParams({ from: '/documents/$id/rules' });
  const documentId = Number(id);

  const rulesQuery = useDocumentRulesQuery(documentId);
  const columns = useRulesEditSheetColumns();
  const mutation = useBatchUpdateRulesMutation();

  const handleSave = async (changes) => {
    await mutation.mutateAsync({
      documentId,
      ...changes
    });
  };

  return (
    <Page>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/documents">Documents</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/documents/${id}`}>
              Document {id}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Rules</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <EditSheet
        data={rulesQuery.data || []}
        columns={columns}
        isLoading={rulesQuery.isLoading}
        onSave={handleSave}
        getRowId={(row) => String(row.id)}
      />
    </Page>
  );
}
```

### Future: Text Blocks Edit Sheet

The same pattern will be applied to text blocks (`/documents/$id/blocks`) in a future iteration, with equivalent hooks and column definitions.

## Key Implementation Challenges

### 1. Auto-Add Row Without Interruption

**Challenge**: Adding a new row when user focuses the bottom row must not interrupt typing.

**Solution**:
- Use `onFocus` instead of `onChange` to trigger add
- Add row immediately but keep focus in current cell
- Use `setTimeout` with 0ms to update state after focus event completes
- Track "hasAddedRow" flag to prevent double-adds

### 2. Arrow Key Navigation Edge Cases

**Challenge**: Wrapping navigation at table edges.

**Solution**:
- Right from last column → first column of next row
- Left from first column → last column of previous row
- Bounds checking to prevent navigating past first/last row
- Handle deleted rows by skipping or treating as regular rows

### 3. Change Tracking for Updates vs New

**Challenge**: Distinguishing between updated existing rows and newly added rows.

**Solution**:
- New rows: Track in `changes.new` array, no ID yet
- Updated rows: Track in `changes.updated` Map with existing ID as key
- Check if row has ID to determine which bucket to use

### 4. Deleted Row Visual Feedback

**Challenge**: Showing deleted rows clearly without removing them.

**Solution**:
- Add `__deleted: true` flag to row object
- Apply opacity/strikethrough CSS based on flag
- Disable all inputs when row is deleted
- Keep row in UI until save completes

### 5. Validation State Management

**Challenge**: Tracking validation errors per row and field.

**Solution**:
- Use nested Map structure: `Map<rowIndex, Map<fieldId, errorMessage>>`
- Validate on change for real-time feedback
- Compute `isValid` flag from Map size
- Display inline errors below inputs

## Keyboard Shortcuts

Implement these keyboard shortcuts for better UX:

- **Escape**: Cancel editing (with confirmation if changes exist)
- **Ctrl+S / Cmd+S**: Save changes (if validation passes)
- **Arrow Keys**: Navigate between cells
- **Tab**: Move to next editable cell
- **Shift+Tab**: Move to previous editable cell
- **Enter**: Move to cell below (or add row if on bottom)

## Styling Considerations

**View Mode**:
- Match DataTable readonly appearance
- Clean, minimal styling
- No input borders visible

**Edit Mode**:
- Clear input field borders
- Hover states on inputs
- Focus rings on active input
- Subtle background color on inputs
- Modified row indicator (subtle background change)
- Deleted row styling (opacity 50%, strikethrough text)

**Transitions**:
- Smooth fade between view/edit modes
- Animate actions column appearance
- Loading spinner during save

## Performance Optimizations

1. **Debounce validation**: Don't validate on every keystroke, debounce by 300ms
2. **Virtualization**: For large datasets (>100 rows), use virtual scrolling
3. **Memoize columns**: Wrap column definitions in useMemo to prevent re-renders
4. **Batch state updates**: Use useReducer instead of multiple useState for complex state
5. **Optimistic updates**: Update local state immediately, rollback on error

## Error Handling

**Save Errors**:
- Display error message via error context
- Keep edit mode active with all changes preserved
- Allow user to retry or cancel
- Specific error messages for constraint violations (e.g., duplicate names)

**Validation Errors**:
- Inline error messages below invalid fields
- Disable save button when any validation fails
- Highlight invalid fields with red border
- Clear errors as user corrects them

## Testing Strategy

**Unit Tests** (if added in future):
- useEditSheetState hook logic
- Change tracking calculations
- Validation rules

**E2E Tests** (with Playwright):
- Full edit flow: enter edit, add row, modify, delete, save
- Cancel with changes confirmation
- Auto-add row on bottom focus
- Arrow key navigation
- Keyboard shortcuts
- Error handling on save failure
- Empty states

## Future Enhancements

1. **Undo/Redo**: Track change history for undo/redo functionality
2. **Row Reordering**: Drag and drop to reorder rows, update priorities
3. **Bulk Actions**: Select multiple rows for bulk delete/enable/disable
4. **Inline Search**: Filter rows while in edit mode
5. **Change Highlighting**: Visual diff showing what changed since last save
6. **Auto-save**: Debounced auto-save instead of manual save button
7. **Conflict Resolution**: Handle concurrent edits from multiple users

## Common Pitfalls

1. **Losing focus during auto-add**: Always preserve focus in current cell
2. **Forgetting to track changes**: Every modification must update change tracking
3. **Not validating before save**: Always check isValid before allowing save
4. **Not handling errors**: Mutation errors must keep edit mode active
5. **Breaking arrow navigation**: Ensure all inputs have proper data attributes
6. **Missing confirmation on cancel**: Always confirm if hasChanges is true
7. **Not disabling deleted rows**: Deleted rows should not be editable
8. **Updating state directly**: Always use setter functions, never mutate state

## References

- DataTable component: `client/src/components/data-table/`
- TanStack Table: https://tanstack.com/table/latest
- React Hook Form: https://react-hook-form.com/
- Similar patterns: Spreadsheet UIs, inline table editors
