# Development Workflow

We use Docker to develop and run our application across three separate environments.

## Quick Start

```bash
# Start development environment
./start-dev.sh

# Start testing environment
./start-test.sh

# Start production environment
./start-prod.sh

# Stop all environments
./stop-all.sh
```

## Environment Configuration

All three environments can run simultaneously on different ports:

| Environment | Server Port | Client Port | Docker Compose File |
|------------|-------------|-------------|---------------------|
| Development | 3000 | 5173 | docker-compose.dev.yml |
| Testing | 3001 | 5174 | docker-compose.test.yml |
| Production | 3002 | 8080 | docker-compose.prod.yml |

## Development Environment

The development environment is configured for active development with:
- **Hot Reload**: Both server and client use file polling (`CHOKIDAR_USEPOLLING=true`) to detect changes in Docker volumes
- **Volume Mounts**: Source code is mounted so changes are immediately reflected
- **Development Tools**: Full dev dependencies and source maps enabled

```bash
./start-dev.sh

# Access:
# - Client: http://localhost:5173
# - Server: http://localhost:3000
# - Server Health: http://localhost:3000/trpc/health.check
```

### Development Commands

```bash
# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop environment
docker-compose -f docker-compose.dev.yml down

# Rebuild containers
docker-compose -f docker-compose.dev.yml up --build
```

## Testing Environment

Isolated environment for running tests:
- **Hot Reload**: Enabled with polling for test development
- **Separate Network**: Isolated from dev and prod environments
- **Playwright Support**: Client container includes test volumes

```bash
./start-test.sh

# Access:
# - Client: http://localhost:5174
# - Server: http://localhost:3001
```

### Running Tests in Docker

```bash
# Enter client container
docker exec -it docmaster-client-test sh

# Run Playwright tests
npm test

# Run tests with UI
npm run test:ui
```

## Production Environment

Optimized for deployment with:
- **Multi-stage Builds**: Only production dependencies included
- **Optimized Images**: Client uses nginx, server uses compiled TypeScript
- **Health Checks**: Automatic container health monitoring
- **Detached Mode**: Runs in background

```bash
./start-prod.sh

# Access:
# - Client: http://localhost:8080
# - Server: http://localhost:3002
```

### Production Commands

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check health status
docker-compose -f docker-compose.prod.yml ps

# Stop environment
docker-compose -f docker-compose.prod.yml down
```

## Docker Architecture

### Server Dockerfile

Three-stage build:
1. **Development**: Full dependencies, hot reload with tsx
2. **Builder**: Compiles TypeScript to JavaScript
3. **Production**: Only runtime dependencies, runs compiled code

### Client Dockerfile

Three-stage build:
1. **Development**: Full dependencies, Vite dev server
2. **Builder**: Creates optimized production build
3. **Production**: nginx serving static files

### Volume Mounts

Development and testing environments mount:
- Source code directories (`src/`)
- Configuration files (`tsconfig.json`, `vite.config.ts`, etc.)
- Package files (for dependency changes)

Production environment has no volume mounts for security and performance.

### Environment Variables

**Server:**
- `NODE_ENV` - Set to development/test/production
- `CHOKIDAR_USEPOLLING=true` - Enables file watching in Docker (dev/test only)

**Client:**
- `NODE_ENV` - Set to development/test/production
- `VITE_API_URL` - Backend API URL
- `CHOKIDAR_USEPOLLING=true` - Enables file watching in Docker (dev/test only)

## Troubleshooting

### Hot Reload Not Working

Ensure `CHOKIDAR_USEPOLLING=true` is set in the docker-compose file. This is required for file watching to work inside Docker containers.

### Port Already in Use

Check if another environment or local process is using the port:

```bash
# Windows
netstat -ano | findstr :<port>

# Stop all DocMaster environments
./stop-all.sh
```

### Rebuild Containers

If you make changes to package.json or Dockerfile:

```bash
# Development
docker-compose -f docker-compose.dev.yml up --build

# Testing
docker-compose -f docker-compose.test.yml up --build

# Production
docker-compose -f docker-compose.prod.yml up --build
```

### Clear Docker Cache

If experiencing build issues:

```bash
# Remove all DocMaster images
docker rmi docmaster-server-dev docmaster-client-dev
docker rmi docmaster-server-test docmaster-client-test
docker rmi docmaster-server-prod docmaster-client-prod

# Rebuild from scratch
./start-dev.sh
```

## Best Practices

1. **Use Development Environment for Coding**: Hot reload and volume mounts make it ideal for active development
2. **Use Testing Environment for Integration Tests**: Isolated environment prevents interference with development
3. **Use Production Environment for Deployment Testing**: Verify builds and performance before actual deployment
4. **Run Environments Side-by-Side**: Different ports allow testing multiple environments simultaneously
5. **Stop Unused Environments**: Free up resources with `./stop-all.sh` when not needed
