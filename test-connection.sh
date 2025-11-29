#!/bin/bash

echo "🔍 Testing Backend and Frontend Connection..."
echo "=============================================="
echo ""

# Test Backend
echo "1️⃣ Testing Backend (Port 3000)..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/doctors)
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "   ✅ Backend is running and responding"
    echo "   📊 Sample response:"
    curl -s http://localhost:3000/api/doctors | python3 -m json.tool | head -15
else
    echo "   ❌ Backend is not responding (HTTP $BACKEND_STATUS)"
fi
echo ""

# Test Frontend
echo "2️⃣ Testing Frontend (Port 3001)..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "   ✅ Frontend is running and responding"
else
    echo "   ❌ Frontend is not responding (HTTP $FRONTEND_STATUS)"
fi
echo ""

# Test MongoDB
echo "3️⃣ Testing MongoDB Connection..."
if pgrep -x "mongod" > /dev/null; then
    echo "   ✅ MongoDB is running"
else
    echo "   ⚠️  MongoDB process not found"
fi
echo ""

# Check API Configuration
echo "4️⃣ Checking API Configuration..."
echo "   Backend API URL in Frontend: http://localhost:3000/api"
echo "   Proxy setting in package.json:"
grep "proxy" /Users/rishicheekatla/Coding/HealthCare/Frontend/package.json
echo ""

# Test CORS
echo "5️⃣ Testing CORS Configuration..."
CORS_TEST=$(curl -s -H "Origin: http://localhost:3001" -H "Access-Control-Request-Method: GET" -X OPTIONS http://localhost:3000/api/doctors -I | grep -i "access-control")
if [ ! -z "$CORS_TEST" ]; then
    echo "   ✅ CORS is configured"
else
    echo "   ⚠️  CORS headers not detected"
fi
echo ""

echo "=============================================="
echo "✨ Connection Test Complete!"
echo ""
echo "📝 Summary:"
echo "   - Backend: http://localhost:3000"
echo "   - Frontend: http://localhost:3001"
echo "   - MongoDB: mongodb://localhost:27017/healthcare"
echo ""
echo "🌐 Open your browser to: http://localhost:3001"
