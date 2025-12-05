# Collection Creation Feature - Task List

## Server-Side Verification

- [x] Verify `collection.create` tRPC endpoint exists in router
- [x] Verify endpoint accepts `CreateDocumentCollectionInput` schema
- [x] Verify endpoint calls `createDocumentCollection` service function
- [x] Verify service creates collection with provided name
- [x] Verify service returns created collection with id and timestamps
- [ ] Test duplicate name constraint handling

## Client Hooks - Form Hook

- [x] Create `client/src/modules/Collection/hooks/collection-form/` directory
- [x] Create `useCollectionForm.tsx` hook
- [x] Define Zod schema with name field validation
- [x] Set name as required with minimum length 1
- [x] Configure useForm with standardSchemaResolver
- [x] Set default values (name: '')
- [x] Export hook from barrel file `index.ts`

## Client Hooks - Mutation Hook

- [x] Create `client/src/modules/Collection/hooks/mutations/` directory
- [x] Create `useCreateCollectionMutation.tsx` hook
- [x] Import trpc client
- [x] Call `trpc.collection.create.useMutation`
- [x] Accept onSuccess and onError callbacks
- [x] Pass callbacks to mutation configuration
- [x] Export hook from barrel file `index.ts`

## Form Component

- [x] Create `client/src/modules/Collection/components/CollectionForm/` directory
- [x] Create `CollectionForm.tsx` component
- [x] Import Field components from ui/field
- [x] Import Input from ui/input
- [x] Import AsyncButton from ui/async-button
- [x] Import Plus icon from lucide-react
- [x] Import useNavigate from TanStack Router
- [x] Import useError context
- [x] Accept form prop typed as ReturnType<typeof useCollectionForm>
- [x] Destructure register, handleSubmit, and formState.isValid from form
- [x] Initialize useCreateCollectionMutation with callbacks
- [x] Configure onSuccess to navigate to /collections
- [x] Configure onError to set error in error context
- [x] Create onSubmit handler that calls mutation.mutate
- [x] Render form element with onSubmit handler
- [x] Add max-w-md mx-auto className to form
- [x] Render FieldSet wrapper
- [x] Add FieldLegend with "Create Collection" text
- [x] Add FieldDescription with form instructions
- [x] Render FieldGroup with gap-y-4
- [x] Add Field for name input
- [x] Add FieldLabel with "Name" text and required asterisk
- [x] Render Input with type="text" and register('name')
- [x] Render footer with flex justify-end mt-4
- [x] Add AsyncButton with type="submit"
- [x] Set button disabled based on !isValid
- [x] Set button isBusy based on mutation.isPending
- [x] Add Plus icon to button
- [x] Add "Create" text to button
- [x] Export CollectionForm component
- [x] Create barrel export in `index.ts`

## Page Component

- [x] Create `client/src/modules/Collection/pages/` directory if not exists
- [x] Create `CollectionCreatePage.tsx` component
- [x] Import Page from layout components
- [x] Import CollectionForm component
- [x] Import useCollectionForm hook
- [x] Initialize form with useCollectionForm hook
- [x] Render Page wrapper
- [x] Render CollectionForm with form prop
- [x] Export CollectionCreatePage component

## Route Configuration

- [x] Create or update route file for /collections/new
- [x] Import CollectionCreatePage component
- [x] Configure route component to CollectionCreatePage
- [x] Verify route path matches /collections/new
- [ ] Test navigation to route from collections list
- [ ] Verify route redirects to /collections after successful creation

## Testing & Verification

- [x] Navigate to /collections/new (Ready to test at http://localhost:5173/collections/new)
- [ ] Verify form displays with correct title and description
- [ ] Verify name field is present with label and required indicator
- [ ] Verify Create button is initially disabled
- [ ] Enter text into name field
- [ ] Verify Create button becomes enabled
- [ ] Clear name field
- [ ] Verify Create button becomes disabled again
- [ ] Enter valid collection name
- [ ] Click Create button
- [ ] Verify loading state shows on button
- [ ] Verify navigation to /collections after success
- [ ] Verify new collection appears in list
- [ ] Test duplicate name handling
- [ ] Enter existing collection name
- [ ] Submit form
- [ ] Verify error displays in error context
- [ ] Test form accessibility with keyboard navigation
- [ ] Verify all fields are keyboard accessible
- [ ] Test form submission with Enter key

## Documentation & Polish

- [x] Ensure form follows Document creation pattern exactly
- [x] Verify form styling matches design system
- [x] Ensure proper TypeScript typing throughout
- [x] Verify error handling displays appropriately
- [ ] Test responsive behavior of form
- [ ] Verify form works correctly on mobile viewports
