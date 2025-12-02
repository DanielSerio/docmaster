# DocMaster Client

This is the client-side code for the DocMaster application. It is a Typescript Vite/React application.

## Tech Stack

- [TypeScript](https://www.typescriptlang.org/) - The primary programming language used for the application.
- [Vite](https://vite.dev/) - The build tool used for the application.
- [React](https://react.dev/) - The primary library/framework used for the application.
- [tRPC](https://trpc.io/) - The API framework used for the application.
- [React Router](https://tanstack.com/router/v1) - The routing library used for the application.
- [React Query](https://tanstack.com/query/v5) - The data fetching library used for the application.
- [React Hook Form](https://react-hook-form.com/) - The form handling library used for the application.
- [Zod](https://zod.dev/) - The schema validation library used for the application.
- [Tailwind CSS](https://tailwindcss.com/) - The CSS framework used for the application.
- [Shadcn UI](https://ui.shadcn.com/) - The UI component library used for the application.

## Testing

Per our core development principles, we will NOT be implementing unit tests for this application.
All e2e and integration tests will be implemented using `playwright`, since we are installing `storybook` (with `storybook-playwright` support). All tests should use `data-testid` attributes to identify elements.

## Module Structure

```
client
├── src
|   ├── modules                     # Modules
|   |   ├── Rules                   # Entity Module
|   |   |   ├── components          # React components for the module
|   |   |   ├── hooks               # React hooks for the module
|   |   |   ├── pages               # React pages for the module
|   |   |   ├── types               # TypeScript types for the module
|   |   |   └── utils               # Utility functions for the module
|   |   ├── TextBlocks              # Entity Module
|   |   |   └── ...
|   |   ├── Documents               # Entity Module
|   |   |   └── ...
|   |   ├── Collections             # Entity Module
|   |   |   └── ...
│   └── services                    # Services
│   |   ├── rule                    # Service Module
|   |   |   └── ...
│   |   ├── text-block              # Service Module
|   |   |   └── ...
│   |   ├── document                # Service Module
|   |   |   └── ...
│   |   ├── collection              # Service Module
|   |   |   └── ...
│   └── ...
```

## Global Structure

```
client
├── src
|   ├── assets                       # Assets Directory
|   ├── components                   # Global Components Directory
|   ├── lib/const                    # Constants Directory
|   ├── lib/schemas                  # Schemas Directory
|   ├── lib/utils                    # Utility Directory
|   ├── routes                       # Tanstack Router Routes Directory
|   ├── stories                      # Storybook Stories Directory
|   ├── types                        # Types Directory
|   |   ├── react-table.d.ts         # React Table Custom Types
|   |   ├── ...
|   |   └── index.ts                 # exports
│   └── ...
└── tests                            # Tests Directory
    ├── e2e                          # E2E Tests Directory
    |   └── ...
    └── integration                  # Integration Tests Directory
        └── ...
```


## Routing

Proposed routing structure:

```
/
├── /documents (Document List View)
│   ├── /documents/new (Create New Document)
│   └── /documents/:id (View/Edit Document Details)
│       ├── /documents/:id/edit (Dedicated Document Editor)
│       ├── /documents/:id/rules (Manage Rules in Rule Document)
│       └── /documents/:id/blocks (Manage Text Blocks in General Document)
│
├── /rules (Rule Entity List View)
│   ├── /rules/new (Create New Rule Entity)
│   └── /rules/:ruleId (View/Edit Specific Rule Entity)
│
├── /textblocks (Text Block Entity List View)
│   ├── /textblocks/new (Create New Text Block Entity)
│   └── /textblocks/:blockId (View/Edit Specific Text Block Entity)
│
└── /collections (Collection List View)
    ├── /collections/new (Create New Collection)
    └── /collections/:collectionId (View/Edit Specific Collection)
        └── /collections/:collectionId/download (Initiate Collection Download)
```