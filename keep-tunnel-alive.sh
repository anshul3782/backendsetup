#!/bin/bash

echo "🚀 Starting persistent tunnel for live-steps-api..."

while true; do
    echo "📡 Starting localtunnel..."
    npx localtunnel --port 3000 --subdomain live-steps-api
    
    echo "⚠️  Tunnel stopped. Restarting in 5 seconds..."
    sleep 5
done 