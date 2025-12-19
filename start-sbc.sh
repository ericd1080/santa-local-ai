#!/bin/bash
# Santa Tracker SBC Startup Script
# Optimized for Raspberry Pi 3B

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║               🎅 Santa Tracker SBC Startup 🎄                   ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Check if running on Pi
if [[ $(uname -m) == "armv7l" ]] || [[ $(uname -m) == "aarch64" ]]; then
    echo "✅ Detected Raspberry Pi hardware"
else
    echo "⚠️  Not running on Pi hardware, but that's okay!"
fi

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2)
echo "🐍 Python version: $PYTHON_VERSION"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📝 Creating .env from template..."
    cp .env.example .env
    echo "✏️  Please edit .env and add your Groq API key:"
    echo "   nano .env"
    echo ""
    echo "🔑 Get your free API key from: https://console.groq.com/"
    exit 1
fi

# Check if requirements are installed
echo "📦 Checking Python dependencies..."
if python3 -c "import flask, flask_cors, requests, dotenv" 2>/dev/null; then
    echo "✅ All dependencies installed"
else
    echo "📥 Installing dependencies..."
    pip3 install -r requirements-sbc.txt
fi

# Get the Pi's IP address for display
PI_IP=$(hostname -I | cut -d' ' -f1)

echo ""
echo "🌐 Network Information:"
echo "   Local access:  http://localhost:8001"
echo "   Network access: http://$PI_IP:8001"
echo ""
echo "🚀 Starting Santa Tracker SBC..."
echo "   Press Ctrl+C to stop"
echo ""

# Start the application
python3 app-sbc.py