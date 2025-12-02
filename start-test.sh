#!/bin/bash

echo "Starting DocMaster in TESTING mode..."
echo "Server will be available at: http://localhost:3001"
echo "Client will be available at: http://localhost:5174"
echo ""

docker-compose -f docker-compose.test.yml up --build
