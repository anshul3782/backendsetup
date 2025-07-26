#!/bin/bash

echo "🚀 Starting Live Steps API with persistent tunnel..."

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down..."
    pkill -f "node server.js"
    pkill -f "localtunnel"
    pkill -f "keep-tunnel-alive.sh"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "node server.js" 2>/dev/null
pkill -f "localtunnel" 2>/dev/null
pkill -f "keep-tunnel-alive.sh" 2>/dev/null

# Start the server
echo "📡 Starting Node.js server..."
npm run dev &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Test server
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ Server is running on http://localhost:3000"
else
    echo "❌ Server failed to start"
    exit 1
fi

# Start the persistent tunnel
echo "🌐 Starting persistent tunnel..."
./keep-tunnel-alive.sh &
TUNNEL_PID=$!

# Wait for tunnel to start
echo "⏳ Waiting for tunnel to start..."
sleep 8

# Test tunnel
if curl -s https://live-steps-api.loca.lt/health > /dev/null; then
    echo "✅ Tunnel is running on https://live-steps-api.loca.lt"
    echo ""
    echo "🎉 API is ready for testing!"
    echo "📱 Test endpoints:"
    echo "   curl \"https://live-steps-api.loca.lt/api/live-steps?phone_number=3333333333\""
    echo "   curl \"https://live-steps-api.loca.lt/api/live-steps?phone_number=45462\""
    echo "   curl https://live-steps-api.loca.lt/api/live-steps/1111111111"
    echo ""
    echo "🔄 Tunnel will automatically restart if it fails"
    echo "🛑 Press Ctrl+C to stop everything"
else
    echo "❌ Tunnel failed to start"
    exit 1
fi

# Keep the script running
wait 