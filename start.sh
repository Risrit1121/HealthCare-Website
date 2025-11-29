#!/bin/bash
echo "Starting HealthCare Application..."
echo ""
echo "Starting Backend on port 3000..."
cd Backend && npm start &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
echo ""
sleep 3
echo "Starting Frontend on port 3001..."
cd ../Frontend && PORT=3001 npm start &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "✅ Application started!"
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"
wait
