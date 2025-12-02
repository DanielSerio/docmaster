#!/bin/bash

echo "Stopping all DocMaster environments..."

docker-compose -f docker-compose.dev.yml down 2>/dev/null
docker-compose -f docker-compose.test.yml down 2>/dev/null
docker-compose -f docker-compose.prod.yml down 2>/dev/null

echo "All environments stopped"
