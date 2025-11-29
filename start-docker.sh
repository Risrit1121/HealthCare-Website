#!/bin/bash

echo "🐳 Starting HealthCare Application with Docker..."
echo ""

# Stop local services
echo "Stopping local services..."
pkill -f "node.*server.js" 2>/dev/null
brew services stop mongodb-community 2>/dev/null

echo ""
echo "Building and starting Docker containers..."
docker-compose up --build -d

echo ""
echo "Waiting for services to start..."
sleep 10

echo ""
echo "✅ Application started!"
echo ""
echo "📊 Services:"
echo "  - Frontend: http://localhost:3001"
echo "  - Backend:  http://localhost:3000"
echo "  - MongoDB:  localhost:27017"
echo ""
echo "📝 View logs: docker-compose logs -f"
echo "🛑 Stop: docker-compose down"
echo ""
