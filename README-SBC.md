# 🎅 Santa Tracker SBC - Hybrid Cloud Architecture

> **The "IT Genius" Solution**: Turn your Raspberry Pi 3B into a Christmas magic machine!

## 🎯 The Problem Solved

Your Raspberry Pi 3B is too weak to run large AI models locally, but it's perfect for hosting a web server. This hybrid solution splits the workload:

- **🏠 The Host**: Raspberry Pi 3B (serves website, handles requests)
- **🧠 The Brain**: Groq Cloud AI (blazingly fast inference)
- **📱 The Display**: Any device with a browser (iPad, phone, laptop)

## ⚡ Why Groq?

- **FREE** with generous limits (30+ requests/minute)
- **BLAZINGLY FAST** responses (perfect for real-time Santa updates)
- **NO LOCAL HARDWARE** requirements
- **SECURE** API key handling (server-side only)

## 🚀 Quick Start

### 1. Get Your Free Groq API Key

1. Visit [console.groq.com](https://console.groq.com/)
2. Create a free account
3. Generate an API key (free tier includes 30+ requests/minute!)

### 2. Setup on Raspberry Pi 3B

```bash
# Clone the repository
git clone <your-repo-url>
cd santa-local-ai

# Install Python dependencies
pip install -r requirements-sbc.txt

# Create environment file
cp .env.example .env

# Edit .env and add your Groq API key
nano .env
# Add: GROQ_API_KEY=your_actual_key_here
```

### 3. Run the SBC Server

```bash
# Start the Flask server
python app-sbc.py
```

You'll see:
```
╔══════════════════════════════════════════════════════════════════╗
║               🎅 Santa Tracker SBC - Hybrid Architecture 🎄     ║
╚══════════════════════════════════════════════════════════════════╝

  ✨ Server running at: http://localhost:8001
```

### 4. Access from Any Device

- **From Pi itself**: Open browser to `http://localhost:8001`
- **From iPad/phone**: Open browser to `http://[PI_IP_ADDRESS]:8001`
- **Find Pi IP**: Run `hostname -I` on the Pi

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   iPad/Browser  │◄──►│ Raspberry Pi 3B │◄──►│   Groq Cloud    │
│   (Display)     │    │   (Host Server) │    │   (AI Brain)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
      React UI           Flask + Python         Lightning Fast AI
```

### Secure Flow
1. **iPad** asks Pi: "What does Santa say?"
2. **Pi** (holding secret API key) asks Groq
3. **Groq** responds with Santa message
4. **Pi** passes response to iPad
5. **iPad** never sees the API key! 🔒

## 🔧 Features

### ⚡ Performance
- **Sub-second responses** from Groq's optimized infrastructure
- **Multiple model options** (Llama 3, Mixtral, Gemma)
- **Real-time Santa tracking** with live updates
- **Optimized for low-power Pi hardware**

### 🔒 Security
- **Server-side API key storage** (never exposed to browsers)
- **CORS-enabled** for cross-device access
- **Environment-based configuration**
- **No sensitive data in frontend**

### 🎨 User Experience
- **Responsive design** works on all devices
- **Christmas-themed** with snow animations
- **Real-time status indicators**
- **Model switching** interface
- **Configuration panel** for advanced users

## 📁 File Structure

```
santa-local-ai/
├── app-sbc.py                 # Flask server (NEW)
├── santa-tracker-sbc.html     # Frontend (NEW)
├── requirements-sbc.txt       # Python deps (NEW)
├── .env.example              # Config template (NEW)
├── README-SBC.md             # This guide (NEW)
│
├── server.py                 # Original Ollama version
├── santa-tracker.html        # Original frontend
└── config/
    └── santa-config-sbc.json  # SBC configuration
```

## 🎛️ Configuration

### Available Models

The SBC version supports multiple Groq models optimized for different use cases:

| Model | Speed | Quality | Best For |
|-------|-------|---------|----------|
| `llama3-8b-8192` | 🚀🚀🚀 | ⭐⭐⭐ | Real-time responses |
| `llama3-70b-8192` | 🚀🚀 | ⭐⭐⭐⭐⭐ | Complex storytelling |
| `mixtral-8x7b-32768` | 🚀🚀⭐ | ⭐⭐⭐⭐ | Balanced performance |
| `gemma-7b-it` | 🚀🚀🚀 | ⭐⭐⭐ | Google's efficient model |

### Environment Variables

```bash
# Required
GROQ_API_KEY=your_groq_api_key_here

# Optional
PORT=8001                    # Server port
FLASK_ENV=production         # Production mode
```

## 🛠️ Production Deployment

For a robust Pi setup, use Gunicorn + Supervisor:

### 1. Install Production Server

```bash
pip install gunicorn supervisor
```

### 2. Create Gunicorn Config

```bash
# /home/pi/santa-tracker/gunicorn.conf.py
bind = "0.0.0.0:8001"
workers = 2
timeout = 120
keepalive = 2
max_requests = 1000
max_requests_jitter = 50
```

### 3. Create Supervisor Config

```bash
# /etc/supervisor/conf.d/santa-tracker.conf
[program:santa-tracker-sbc]
command=/home/pi/.local/bin/gunicorn -c gunicorn.conf.py app-sbc:app
directory=/home/pi/santa-tracker
user=pi
autostart=true
autorestart=true
stdout_logfile=/var/log/santa-tracker.log
stderr_logfile=/var/log/santa-tracker-error.log
```

### 4. Start Service

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start santa-tracker-sbc
```

## 🔍 Troubleshooting

### API Key Issues
- ❌ **Error**: "GROQ_API_KEY environment variable not set"
- ✅ **Solution**: Create `.env` file with your API key

### Network Access Issues
- ❌ **Problem**: Can't access from iPad
- ✅ **Solution**: Check Pi firewall, use Pi's IP address

### Model Switching Issues
- ❌ **Problem**: Model switch fails
- ✅ **Solution**: Check API key limits, try different model

### Performance Issues
- ❌ **Problem**: Slow responses
- ✅ **Solution**: Use faster model (`llama3-8b-8192`)

## 🆚 Comparison: Original vs SBC

| Feature | Original (Ollama) | SBC (Groq) |
|---------|-------------------|------------|
| **Hardware Requirement** | 8GB+ RAM | Any Pi model |
| **Setup Complexity** | High | Low |
| **Response Speed** | 30-60s | 1-3s |
| **Internet Required** | No | Yes |
| **API Costs** | Free | Free (with limits) |
| **Model Variety** | High | Medium |
| **Resource Usage** | High | Low |

## 📊 API Usage & Limits

Groq's free tier is generous for personal use:

- **30+ requests per minute**
- **Millions of tokens per month**
- **No credit card required**
- **Multiple model access**

Perfect for a family Santa tracker! 🎅

## 🎄 Christmas Customization

### Add Your Own Prompts

Edit `config/santa-config-sbc.json`:

```json
{
  "prompts": {
    "preparing": "Your custom North Pole message...",
    "delivering": "Your custom delivery message...",
    "finished": "Your custom completion message..."
  }
}
```

### Customize Santa's Route

Modify the `SantaLocationCalculator` in `santa-tracker-sbc.html` to add your city to Santa's route!

## 🤝 Contributing

1. Keep the original files intact
2. All SBC files are suffixed with `-sbc`
3. Test on actual Pi hardware
4. Maintain compatibility with various devices

## 📜 License

Same as the original project. Ho ho ho! 🎅

---

**🎄 Made with Christmas Magic and Raspberry Pi Power! ✨**

> *"The best way to spread Christmas cheer is coding loud for all to hear!"* - Buddy the Elf (probably)