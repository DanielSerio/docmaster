#!/bin/bash

echo "Starting DocMaster in TESTING mode..."
echo "Server will be available at: http://localhost:3001"
echo "Client will be available at: http://localhost:5174"
echo ""
echo "Test runner will automatically execute Playwright tests."
echo "Test results will be saved to: client/playwright-report/"
echo "Test artifacts will be saved to: client/test-results/"
echo ""

docker-compose -f docker-compose.test.yml up --build
