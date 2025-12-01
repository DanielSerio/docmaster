# DocMaster

DocMaster is a document management system that allows you to manage your AI agent documents in a centralized location.

## Problems This Tool Solves

1. Needing to rewrite documentation for the same feature multiple times.
2. Needing to manage multiple repositories with different documentation formats.

## Entity Lexicon

- `collection` - represents a collection of documents in a file-based structure. Collection allow saving a `path` to a directory for the particular document within the collection.
- `document` - represents a documentation file. There are two types of documents: `general` and `rule`.
- `text-block` - represents a block of text within a `general` document.
- `rule` - represents a block of text within a `rule` document. Rule documents allow enabling/disabling of `rules`, as well as setting a priority for the `rule`.

## Project Structure

Our project is structured into 3 main directories:

1. `docs` - Contains the documentation files for this repository.
2. `server` - Contains the server-side code for the application.
3. `client` - Contains the client-side code for the application.

### Docs Structure

The [docs](./docs) directory has two different types of directories inside:

1. `evolving` Directories - These directories are constantly changing based on the current development scope.
2. `static` Directories - These directories do not change and are used for documentation that is not subject to change.

- [docs/core](./docs/core) Contains the documentation relative to the core system.
- [docs/archive](./docs/archive) Contains summaries of completed features and functionality that is no longer necessary for the current development scope.
- [docs/specs](./docs/specs) Contains Gherkin specifications for particular features.
- [docs/tasks](./docs/tasks) Contains task lists for particular features.
- [docs/impl](./docs/impl) Contains implementation notes for particular features.

#### Docs Archive

The [docs/archive](./docs/archive) directory is an `evolving` directory that contains summaries of completed features and functionality that is no longer necessary for the current development scope. Files in this directory are named with the format `SUMMARY-{number}.md` Where {number} is a sequential iteration number. The agent should create a new summary file when the current file is near 500 lines. Each bullet item in the summary file should be no longer than a paragraph.

#### Core

The [docs/core](./docs/core) directory is a `static` directory that contains the core documentation for the system. Files in this directory are named with the format `[featureName].md` Where {featureName} is the name of the feature in kebab case.

#### Specs

The [docs/specs](./docs/specs) directory is an `evolving` directory that contains Gherkin specifications for particular features. Files in this directory are named with the format `[featureName].feature` Where {featureName} is the name of the feature in kebab case.

#### Tasks

The [docs/tasks](./docs/tasks) directory is an `evolving` directory that contains task lists for particular features. Files in this directory are named with the format `[featureName].md` Where {featureName} is the name of the feature in kebab case.

#### Impl

The [docs/impl](./docs/impl) directory is an `evolving` directory that contains implementation notes for particular features. Files in this directory are named with the format `[featureName].md` Where {featureName} is the name of the feature in kebab case. This file should contain things like api details, code examples, and other implementation notes.

### Server

The [server](./server) directory contains the server-side code for the application. See [server/README.md](./server/README.md) for more information.

### Client

The [client](./client) directory contains the client-side code for the application. See [client/README.md](./client/README.md) for more information.

## Documentation Workflow

See [docs/core/documentation-workflow.md](./docs/core/documentation-workflow.md) for more information.

## Data Schema

The [docs/core/schema.dbml](./docs/core/schema.dbml) file contains the database schema for the application. As we develop the application, we will update this file to reflect the current state of the database schema. It should be considered a living document that is always up to date and a representation of the current state of the database schema.

## Communication Protocol

For communication between the client and server, we will be using `trpc`. See [docs/core/trpc.md](./docs/core/trpc.md) for more information.

## Development Workflow

See [docs/core/development-workflow.md](./docs/core/development-workflow.md) for more information.
