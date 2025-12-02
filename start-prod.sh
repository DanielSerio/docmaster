#!/bin/bash

echo "Starting DocMaster in PRODUCTION mode..."
echo "Server will be available at: http://localhost:3002"
echo "Client will be available at: http://localhost:8080"
echo ""

docker-compose -f docker-compose.prod.yml up --build -d

echo ""
echo "Production environment started in detached mode"
echo "View logs with: docker-compose -f docker-compose.prod.yml logs -f"
echo "Stop with: docker-compose -f docker-compose.prod.yml down"
