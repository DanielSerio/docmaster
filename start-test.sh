#!/bin/bash

# Check for --ui flag
UI_MODE=false
if [ "$1" == "--ui" ]; then
  UI_MODE=true
fi

echo "Starting DocMaster in TESTING mode..."
echo "Server will be available at: http://localhost:3001"
echo "Client will be available at: http://localhost:5174"
echo ""
echo "Test results will be saved to: client/playwright-report/"
echo "Test artifacts will be saved to: client/test-results/"
echo ""

# Start the infrastructure (db, server, client)
echo "Starting test infrastructure..."
docker-compose -f docker-compose.test.yml up -d --build db-test server client

echo ""
echo "Waiting for services to be ready..."
# Wait for client to be healthy (has a health check)
until docker-compose -f docker-compose.test.yml ps client | grep -q "(healthy)"; do
  echo "  Waiting for client to be ready..."
  sleep 2
done
echo "  ✓ Client is ready"

if [ "$UI_MODE" = true ]; then
  echo ""
  echo "=========================================="
  echo "Starting Playwright UI Mode..."
  echo "UI will be available at: http://127.0.0.1:9323"
  echo "Press Ctrl+C to stop the UI"
  echo "=========================================="
  echo ""

  # Run tests in UI mode with trace viewer
  docker-compose -f docker-compose.test.yml run --rm \
    -p 127.0.0.1:9323:9323 \
    test-runner \
    npx playwright test --ui-host=0.0.0.0 --ui-port=9323

  TEST_EXIT_CODE=$?
else
  # Run tests in the test-runner container
  echo ""
  echo "Running Playwright tests..."
  docker-compose -f docker-compose.test.yml run --rm test-runner

  # Capture exit code
  TEST_EXIT_CODE=$?

  echo ""
  echo "=========================================="
  if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ Tests passed!"
  else
    echo "❌ Tests failed! (exit code: $TEST_EXIT_CODE)"
  fi
  echo "=========================================="
  echo ""
  echo "View test results: cd client && npx playwright show-report"
  echo ""
  echo "To stop test environment: ./stop-all.sh"
  echo ""
fi

exit $TEST_EXIT_CODE
