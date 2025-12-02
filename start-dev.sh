#!/bin/bash

echo "Starting DocMaster in DEVELOPMENT mode..."
echo "Server will be available at: http://localhost:3000"
echo "Client will be available at: http://localhost:5173"
echo ""

docker-compose -f docker-compose.dev.yml up --build
