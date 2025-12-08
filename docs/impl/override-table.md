# Override table implementation notes (general documents focus)

- Use the existing EditSheet-style pattern (view/edit modes, toolbar with Save/Cancel) for the general document override table.
- Render text-block associations for general documents with priority number input and enable/disable toggle; include text-block content in the fetch so the content column is readable.
- Reuse validation: priority range (1–100) and required fields; disable Save until meaningful valid changes (new/updated/deleted overrides).
- Data flow: load associations for the current general document, map to rows with id, priority, enabled flag, and content; on save, batch update overrides via a per-document API (update existing rows, optionally create/delete as needed).
- UX: maintain keyboard navigation and sentinel row behavior consistent with other edit sheets; keep loading state and error reporting aligned with the shared components.
- Tests: integration coverage for view/edit toggle, priority edits, enable/disable toggles, save disabled when invalid, cancel confirmation, and successful save returning to view mode.
