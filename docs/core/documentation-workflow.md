# Documentation Workflow

There are three commands that a user may request of the agent:

1. `generate`: Generate documentation for a feature.
2. `archive`: Archive all documentation that is no longer necessary for the current development scope.
3. `audit`: Audit the codebase (or a particular feature) against the core principles outlined in [docs/core/core-principles.md](./core-principles.md).

## Generate

The `generate` command will generate documentation for a feature.

### Request format

```
// examples
Generate documentation for a shopping cart feature.
Generate documentation for a checkout feature.
Generate documentation for a user management feature.
```

### Expected Output

The agent should generate a `spec`, `task`, and `impl` (if needed) document for the feature.

#### spec

The `spec` document should contain the Gherkin specifications for the feature. It should be as simple/minimal as possible. It should not contain any code examples or implementation details, and files should be named with the format `[featureName].feature` Where {featureName} is the name of the feature in kebab case.

#### task

The `task` document should contain the task list for the feature. It should be as simple/minimal as possible. It should not contain any code examples or implementation details, and files should be named with the format `[featureName].md` Where {featureName} is the name of the feature in kebab case. It should include check boxes for each phase of the task list.

#### impl

The `impl` document should contain the implementation notes for the feature. It should be as simple/minimal as possible. It should be named with the format `[featureName].md` Where {featureName} is the name of the feature in kebab case.

## Archive

The `archive` command will archive all documentation that is no longer necessary for the current development scope.

### Request format

```
// examples
Archive our documentation.
```

### Expected Output

The agent should create very simple summaries of the features/work completed. These summaries should be no longer than a paragraph. The agent should read the most current summaruy file in the `docs/archive` directory and append to it if needed. If the summary file is already around 500 lines, the agent should create a new summary file and append to it.

### Expected Action

After the summaries have been appended to the summary file, the agent should remove all documentation from the `specs`, `tasks`, and `impl` directories that are no longer necessary for the current development scope.

## Audit

The `audit` command will audit the codebase (or a particular feature) against the core principles outlined in [docs/core/core-principles.md](./core-principles.md). Once complete, the report should be saved to `docs/AUDIT.md`. This file should be overwritten each time the `audit` command is run. As the agent resolves each issue, it should be removed entirely from the report. When there are no more issues to resolve, this file should be completely empty.
