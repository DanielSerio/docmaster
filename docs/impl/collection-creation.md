# Collection Creation Feature - Implementation Notes

## Overview

This feature implements a collection creation form following the same pattern as document creation. The form is significantly simpler, containing only a single text field for the collection name, making it a streamlined user experience.

## Reference Implementation

The Document creation form serves as the reference implementation for this feature. The Collection creation form should mirror its structure and patterns exactly, with entity-specific differences.

**Reference Files**:
- Form Component: `client/src/modules/Document/components/DocumentForm/DocumentForm.tsx`
- Form Hook: `client/src/modules/Document/hooks/document-form/useDocumentForm.tsx`
- Mutation Hook: `client/src/modules/Document/hooks/mutations/useCreateDocument.tsx`

## Architecture Pattern

### Form Component Pattern

1. **Form Hook** - Manages form state with React Hook Form and Zod validation
2. **Mutation Hook** - Wraps tRPC mutation with success/error callbacks
3. **Form Component** - Renders UI and connects hooks
4. **Page Component** - Minimal wrapper that initializes form and renders component

## Server-Side Implementation

### Schema

The server-side schema already exists in `server/src/lib/schemas/documentCollection.schema.ts`:

```typescript
export const createDocumentCollectionInputSchema = z.object({
  name: nameSchema
});

export type CreateDocumentCollectionInput = z.infer<typeof createDocumentCollectionInputSchema>;
```

Where `nameSchema` is:
```typescript
const nameSchema = z.string().min(1, getMessage("name", "stringMin")).max(255, getMessage("name", "stringMax"));
```

### Service

The service already exists in `server/src/services/documentCollection.service.ts`:

```typescript
const createDocumentCollectionImpl = async (data: CreateDocumentCollectionInput) => {
  return await prisma.documentCollection.create({
    data,
  });
};

export const createDocumentCollection = withErrorHandling(createDocumentCollectionImpl, "Document collection");
```

### tRPC Router

The collection router should already have a create endpoint. Verify it exists and follows this pattern:

```typescript
create: publicProcedure
  .input(createDocumentCollectionInputSchema)
  .output(documentCollectionSchema)
  .mutation(async ({ input }) => {
    return await createDocumentCollection(input);
  })
```

## Client-Side Implementation

### Form Hook

**Location**: `client/src/modules/Collection/hooks/collection-form/useCollectionForm.tsx`

**Implementation**:
```typescript
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';

const collectionFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name cannot exceed 255 characters')
});

export function useCollectionForm() {
  return useForm({
    resolver: standardSchemaResolver(collectionFormSchema),
    defaultValues: {
      name: ''
    }
  });
}
```

**Key Points**:
- Uses `standardSchemaResolver` from `@hookform/resolvers/standard-schema`
- Validation rules match server-side schema
- Single field: `name` (string, required, max 255 chars)
- Default value is empty string

### Mutation Hook

**Location**: `client/src/modules/Collection/hooks/mutations/useCreateCollectionMutation.tsx`

**Implementation**:
```typescript
import { trpc } from '@/lib/trpc/react';
import type { UseMutationParams } from '@/types';

export function useCreateCollectionMutation({ onSuccess, onError }: UseMutationParams) {
  return trpc.collection.create.useMutation({
    onSuccess,
    onError: (error) => onError(error)
  });
}
```

**Key Points**:
- Wraps `trpc.collection.create.useMutation`
- Accepts `UseMutationParams` with onSuccess and onError callbacks
- Passes callbacks directly to mutation

### Form Component

**Location**: `client/src/modules/Collection/components/CollectionForm/CollectionForm.tsx`

**Implementation**:
```typescript
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from '@/components/ui/field';
import type { useCollectionForm } from '../../hooks/collection-form';
import { useCreateCollectionMutation } from '../../hooks/mutations';
import { Input } from '@/components/ui/input';
import { AsyncButton } from '@/components/ui/async-button';
import { Plus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useError, type ErrorState } from '@/contexts/error';

export function CollectionForm({ form }: { form: ReturnType<typeof useCollectionForm> }) {
  const {
    register,
    handleSubmit,
    formState: { isValid }
  } = form;
  const { setError } = useError();
  const navigate = useNavigate();
  const mutation = useCreateCollectionMutation({
    onSuccess: () => navigate({ to: '/collections' }),
    onError: (error) => {
      setError(error as ErrorState);
    }
  });

  const onSubmit = (data: Parameters<typeof mutation.mutate>[0]) => {
    mutation.mutate(data);
  };

  return (
    <form
      className="max-w-md mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FieldSet>
        <FieldLegend>Create Collection</FieldLegend>
        <FieldDescription>Fill out the form below to create a new collection.</FieldDescription>
        <FieldGroup className="gap-y-4">
          <Field>
            <FieldLabel>
              <span>Name</span>
              <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              type="text"
              {...register('name')}
            />
          </Field>
        </FieldGroup>
      </FieldSet>
      <footer className="flex justify-end mt-4">
        <AsyncButton
          type="submit"
          disabled={!isValid}
          isBusy={mutation.isPending}
          icon={<Plus />}
        >
          Create
        </AsyncButton>
      </footer>
    </form>
  );
}
```

**Key Components**:
- **FieldSet**: Wraps entire form
- **FieldLegend**: "Create Collection" title
- **FieldDescription**: Instructional text
- **FieldGroup**: Container for form fields
- **Field**: Single name input field
- **FieldLabel**: Label with required asterisk
- **Input**: Text input registered with react-hook-form
- **AsyncButton**: Submit button with loading state

**Behavior**:
- Form is centered with `max-w-md mx-auto`
- Submit button disabled until form is valid (`!isValid`)
- Loading indicator shows during submission (`mutation.isPending`)
- Success navigates to `/collections`
- Error displays via error context

### Page Component

**Location**: `client/src/modules/Collection/pages/CollectionCreatePage.tsx`

**Implementation**:
```typescript
import { Page } from '@/components/layout';
import { CollectionForm } from '../components/CollectionForm';
import { useCollectionForm } from '../hooks/collection-form';

export function CollectionCreatePage() {
  const form = useCollectionForm();

  return (
    <Page>
      <CollectionForm form={form} />
    </Page>
  );
}
```

**Key Points**:
- Minimal wrapper component
- Initializes form hook
- Passes form to CollectionForm component
- Uses Page layout wrapper

## Key Differences from Document Creation

The only differences between Document and Collection creation forms:

1. **Number of Fields**:
   - Document: 2 fields (documentType select, filename text)
   - Collection: 1 field (name text)

2. **Field Names**:
   - Document: `documentType`, `filename`
   - Collection: `name`

3. **Validation**:
   - Document filename: regex pattern `/^[a-zA-Z0-9._-]+$/`
   - Collection name: standard string validation (no regex)

4. **Form Schema**:
   - Document: enum + string
   - Collection: single string

5. **Entity Name**: document → collection
6. **Route**: `/documents/new` → `/collections/new`
7. **Success Navigation**: `/documents` → `/collections`
8. **Form Title**: "Create Document" → "Create Collection"
9. **Field Label**: "Filename" → "Name"

## Module Structure

```
client/src/modules/Collection/
├── components/
│   └── CollectionForm/
│       ├── index.ts
│       └── CollectionForm.tsx
├── hooks/
│   ├── collection-form/
│   │   ├── index.ts
│   │   └── useCollectionForm.tsx
│   └── mutations/
│       ├── index.ts
│       └── useCreateCollectionMutation.tsx
└── pages/
    └── CollectionCreatePage.tsx
```

## Routing Configuration

The route should be configured in TanStack Router:

**Path**: `/collections/new`
**Component**: `CollectionCreatePage`

Ensure the route is properly configured in the router setup. The "Create Collection" button on the collections list page should link to this route.

## Validation

### Client-Side

Zod schema in `useCollectionForm`:
- `name`: Required, min 1 character, max 255 characters
- Real-time validation as user types
- Submit button disabled until valid

### Server-Side

Zod schema in `createDocumentCollectionInputSchema`:
- `name`: Required, min 1 character, max 255 characters
- Additional database constraint: unique name

## Error Handling

### Validation Errors

Client-side validation prevents submission of invalid data. Errors are displayed inline (if implemented in Field components).

### Server Errors

**Duplicate Name (Unique Constraint)**:
```typescript
// Prisma will throw error with code P2002
// withErrorHandling wraps this as TRPCError
```

Error is caught by mutation's `onError` callback and displayed via error context.

**Other Errors**:
- Network errors
- Database connection errors
- Unknown server errors

All handled through error context for consistent UX.

## User Flow

1. User clicks "Create Collection" button on collections list page
2. Navigates to `/collections/new`
3. Form displays with empty name field
4. User types collection name
5. Submit button enables when name is valid
6. User clicks "Create" button
7. Button shows loading indicator
8. Request sent to server via tRPC
9. Server validates input
10. Server creates collection in database
11. Server returns created collection with id and timestamps
12. Client receives success response
13. Navigation to `/collections`
14. New collection appears in list

## Edge Cases

### Empty Name

Handled by client-side validation. Submit button remains disabled.

### Whitespace-Only Name

Zod `.min(1)` on string allows whitespace. Consider adding `.trim()` if this should be prevented.

### Very Long Name

Limited to 255 characters by schema validation on both client and server.

### Duplicate Name

Server returns unique constraint error. Displayed via error context. User can modify name and retry.

### Network Error During Submission

Mutation enters error state. Error context displays message. Form data preserved. User can retry.

### Navigation During Submission

Mutation continues in background. Navigation interrupts user flow. Consider preventing navigation or warning user (future enhancement).

## Testing Strategy

### Manual Testing

1. **Basic Flow**:
   - Navigate to form
   - Enter name
   - Submit
   - Verify creation
   - Verify navigation
   - Verify list displays new collection

2. **Validation**:
   - Empty field (button disabled)
   - Single character (button enabled)
   - 255 characters (accepted)
   - 256 characters (should validate on server)

3. **Error Handling**:
   - Duplicate name
   - Server error (simulate)
   - Network error (simulate)

4. **Loading States**:
   - Button shows loading indicator
   - Button disabled during submission

5. **Accessibility**:
   - Keyboard navigation
   - Tab through fields
   - Submit with Enter key
   - Screen reader labels

### E2E Tests (Future)

When Playwright tests are implemented:

```gherkin
Scenario: Create collection successfully
  Given I am on the collection creation page
  When I fill in "name" with "My Test Collection"
  And I click "Create"
  Then I should be on the collections list page
  And I should see "My Test Collection" in the list
```

## Performance Considerations

### Form Performance

- Single field form is lightweight
- React Hook Form optimizes re-renders
- Validation runs on change (minimal overhead)

### Mutation Performance

- Simple database insert operation
- No transaction complexity (unlike document creation with junctions)
- Prisma generates efficient SQL
- Index on name field (unique constraint) ensures fast constraint checking

## Future Enhancements

### Additional Fields

Could add optional fields:
- Description (textarea)
- Color/icon selection
- Tags/categories

### Path Field

Schema includes `path` field for file-based collections. Form could add:
- Path input with file browser
- Path validation

### Batch Creation

Could support creating multiple collections at once from CSV or JSON import.

### Templates

Could provide collection templates with pre-configured settings or documents.

## Common Pitfalls

1. **Don't forget barrel exports** - Each directory needs `index.ts`
2. **Match mutation hook signature** - Use `UseMutationParams` type
3. **Use standardSchemaResolver** - Not the default Zod resolver
4. **Type the form prop correctly** - Use `ReturnType<typeof useCollectionForm>`
5. **Navigate with proper syntax** - Use `navigate({ to: '/collections' })`
6. **Handle errors as ErrorState** - Cast error type in onError callback
7. **Don't use control for simple inputs** - Use `register` for text inputs (no need for Controller)

## References

- Document Form: `client/src/modules/Document/components/DocumentForm/DocumentForm.tsx`
- Document Form Hook: `client/src/modules/Document/hooks/document-form/useDocumentForm.tsx`
- Document Mutation Hook: `client/src/modules/Document/hooks/mutations/useCreateDocument.tsx`
- Collection Schema: `server/src/lib/schemas/documentCollection.schema.ts`
- Collection Service: `server/src/services/documentCollection.service.ts`
- Field Components: `client/src/components/ui/field/`
- AsyncButton: `client/src/components/ui/async-button/`
