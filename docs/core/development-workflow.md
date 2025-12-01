# Development Workflow

We will be using `docker` to develop and run our application.

## Environments

We should have 3 completely separate environments: `development`, `testing`, and `production`. Each environment should have its own database and configuration. There should be a simple script to run the application in each environment. We should also allow these to be num side-by-side (different ports).
