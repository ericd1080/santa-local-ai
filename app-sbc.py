#!/usr/bin/env python3
"""
Santa Tracker SBC (Single Board Computer) Version
Hybrid Architecture: Flask server with Groq API integration
Designed for Raspberry Pi 3B with cloud AI capabilities
"""

import os
import json
import time
import threading
from pathlib import Path
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory, render_template_string
from flask_cors import CORS
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
PORT = int(os.environ.get('PORT', 8001))  # Different port to avoid conflicts
GROQ_API_KEY = os.environ.get('GROQ_API_KEY')
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# Default Groq models optimized for speed
DEFAULT_MODEL = "llama3-8b-8192"  # Fast and efficient
AVAILABLE_MODELS = [
    "llama3-8b-8192",      # Fastest
    "llama3-70b-8192",     # Most capable
    "mixtral-8x7b-32768",  # Good balance
    "gemma-7b-it",         # Google's model
]

# Configuration paths
CONFIG_DIR = Path(__file__).parent / "config"
CONFIG_FILE = CONFIG_DIR / "santa-config-sbc.json"
FAMILY_DB_FILE = Path(__file__).parent / "family.json"

app = Flask(__name__)
CORS(app, origins="*", allow_headers=["Content-Type", "Authorization"])

class SantaTrackerSBC:
    def __init__(self):
        self.config = self.load_config()
        self.family_data = self.load_family_data()

    def load_config(self):
        """Load SBC-specific configuration"""
        try:
            if CONFIG_FILE.exists():
                with open(CONFIG_FILE, 'r') as f:
                    return json.load(f)
            else:
                return self.get_default_config()
        except Exception as e:
            print(f"Failed to load config: {e}")
            return self.get_default_config()

    def save_config(self, config):
        """Save configuration to file"""
        CONFIG_DIR.mkdir(exist_ok=True)
        with open(CONFIG_FILE, 'w') as f:
            json.dump(config, f, indent=2)

    def load_family_data(self):
        """Load family database for personalized Santa responses"""
        try:
            if FAMILY_DB_FILE.exists():
                with open(FAMILY_DB_FILE, 'r') as f:
                    data = json.load(f)
                    print(f"🎄 Family database loaded successfully! Family: {data.get('family', {}).get('lastName', 'Unknown')}")
                    return data
            else:
                print("⚠️  family.json not found - using generic responses")
                return {}
        except Exception as e:
            print(f"❌ Failed to load family database: {e}")
            return {}

    def reload_family_data(self):
        """Reload family data (for real-time updates)"""
        self.family_data = self.load_family_data()
        return self.family_data

    def create_family_context(self):
        """Create personalized context from family database"""
        if not self.family_data:
            return ""

        try:
            family = self.family_data.get('family', {})
            location = self.family_data.get('location', {})
            pets = self.family_data.get('pets', [])
            traditions = family.get('traditions', [])

            context_parts = []

            # Family information
            if family.get('lastName'):
                context_parts.append(f"You're visiting the {family['lastName']} family")

            if location.get('city') and location.get('state'):
                context_parts.append(f"in {location['city']}, {location['state']}")

            # Family members
            members = family.get('members', [])
            if members:
                children = [m for m in members if m.get('age', 0) < 18]
                if children:
                    names = [child['name'] for child in children]
                    if len(names) == 1:
                        context_parts.append(f"Little {names[0]} has been {children[0].get('behavior', 'good')}")
                    else:
                        context_parts.append(f"The children {', '.join(names[:-1])} and {names[-1]} have all been wonderful")

            # Pets
            if pets:
                pet_names = [pet['name'] for pet in pets]
                context_parts.append(f"Don't forget to say hello to {', '.join(pet_names)}")

            # Traditions
            if traditions:
                context_parts.append(f"They love {traditions[0]} as a family tradition")

            # Emergency overrides
            emergency = self.family_data.get('emergencyOverrides', {})
            if emergency.get('specialMessage'):
                context_parts.append(f"SPECIAL: {emergency['specialMessage']}")

            return ". ".join(context_parts) + "." if context_parts else ""

        except Exception as e:
            print(f"❌ Error creating family context: {e}")
            return ""

    def get_default_config(self):
        """Return default SBC configuration"""
        return {
            "aiProvider": {
                "type": "groq",
                "url": GROQ_API_URL,
                "defaultModel": DEFAULT_MODEL,
                "availableModels": [
                    {
                        "name": "llama3-8b-8192",
                        "displayName": "Llama 3 8B (Fast)",
                        "description": "Blazingly fast responses, perfect for real-time Santa updates",
                        "maxTokens": 8192,
                        "parameters": {"temperature": 0.8, "max_tokens": 150}
                    },
                    {
                        "name": "llama3-70b-8192",
                        "displayName": "Llama 3 70B (Smart)",
                        "description": "Most capable model for complex Santa storytelling",
                        "maxTokens": 8192,
                        "parameters": {"temperature": 0.8, "max_tokens": 200}
                    },
                    {
                        "name": "mixtral-8x7b-32768",
                        "displayName": "Mixtral 8x7B (Balanced)",
                        "description": "Great balance of speed and quality",
                        "maxTokens": 32768,
                        "parameters": {"temperature": 0.7, "max_tokens": 175}
                    },
                    {
                        "name": "gemma-7b-it",
                        "displayName": "Gemma 7B (Google)",
                        "description": "Google's efficient instruction-tuned model",
                        "maxTokens": 8192,
                        "parameters": {"temperature": 0.8, "max_tokens": 160}
                    }
                ]
            },
            "prompts": {
                "preparing": "You are Santa Claus! Write a cheerful, warm message (2-3 sentences max) about preparing for Christmas Eve at the North Pole. The elves are busy wrapping presents. Be jolly, mention the reindeer if relevant, and keep it magical and brief. Use emojis sparingly (1-2 max). Don't use quotation marks.",
                "delivering": "You are Santa Claus! Write a cheerful, warm message (2-3 sentences max) to someone tracking your journey. Santa is currently delivering presents around the world! {{DISTANCE_CONTEXT}} {{GIFTS_CONTEXT}} Be jolly, mention the reindeer if relevant, and keep it magical and brief. Use emojis sparingly (1-2 max). Don't use quotation marks.",
                "finished": "You are Santa Claus! Write a cheerful, warm message (2-3 sentences max) about finishing Christmas deliveries and resting at the North Pole with the reindeer. Be jolly and keep it magical and brief. Use emojis sparingly (1-2 max). Don't use quotation marks."
            },
            "server": {
                "port": PORT,
                "corsEnabled": True,
                "architecture": "sbc-hybrid",
                "aiProvider": "groq"
            },
            "ui": {
                "showConfigPanel": True,
                "allowModelSwitching": True,
                "allowPromptEditing": True,
                "showAdvancedOptions": True,
                "theme": "christmas"
            },
            "features": {
                "cloudAI": True,
                "realTimeResponses": True,
                "configAutoSave": True,
                "promptTemplating": True,
                "apiKeyValidation": True
            }
        }

    def validate_groq_api_key(self):
        """Validate Groq API key"""
        if not GROQ_API_KEY:
            return {"valid": False, "error": "GROQ_API_KEY environment variable not set"}

        try:
            headers = {
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            }

            # Test with a simple request
            data = {
                "model": DEFAULT_MODEL,
                "messages": [{"role": "user", "content": "Test"}],
                "max_tokens": 10
            }

            response = requests.post(GROQ_API_URL, headers=headers, json=data, timeout=10)

            if response.status_code == 200:
                return {"valid": True, "message": "API key is valid"}
            else:
                return {"valid": False, "error": f"API validation failed: {response.status_code}"}

        except Exception as e:
            return {"valid": False, "error": f"API validation error: {str(e)}"}

    def generate_santa_message(self, prompt_type="delivering", context=None):
        """Generate Santa message using Groq API with family context injection"""
        if not GROQ_API_KEY:
            return {"error": "Groq API key not configured", "suggestion": "Set GROQ_API_KEY in .env file"}

        try:
            # Reload family data for real-time updates
            self.reload_family_data()

            # Create personalized family context
            family_context = self.create_family_context()

            # Get prompt template
            prompt_template = self.config["prompts"].get(prompt_type, self.config["prompts"]["delivering"])

            # Replace context placeholders
            if context:
                distance_context = context.get("distance", "")
                gifts_context = context.get("gifts", "")
                prompt_template = prompt_template.replace("{{DISTANCE_CONTEXT}}", distance_context)
                prompt_template = prompt_template.replace("{{GIFTS_CONTEXT}}", gifts_context)

            # Get model configuration
            model_name = self.config["aiProvider"]["defaultModel"]
            model_config = next((m for m in self.config["aiProvider"]["availableModels"] if m["name"] == model_name), None)

            if not model_config:
                model_config = self.config["aiProvider"]["availableModels"][0]  # Fallback to first model

            # Prepare API request with family context injection
            headers = {
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            }

            # 🎄 SERVER-SIDE CONTEXT INJECTION - The family details are whispered to Santa!
            system_message = "You are Santa Claus, jolly and magical!"
            if family_context:
                system_message += f" PRIVATE CONTEXT (do not mention you received this info): {family_context}"

            data = {
                "model": model_name,
                "messages": [
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": prompt_template}
                ],
                "temperature": model_config["parameters"].get("temperature", 0.8),
                "max_tokens": model_config["parameters"].get("max_tokens", 150),
                "top_p": 0.9,
                "stream": False
            }

            print(f"\n🚀 Groq API Request to {model_name}:")
            print(f"📝 Prompt: {prompt_template[:100]}...")

            # Make API request
            response = requests.post(GROQ_API_URL, headers=headers, json=data, timeout=30)

            if response.status_code == 200:
                result = response.json()
                santa_message = result["choices"][0]["message"]["content"].strip()

                # Remove quotes if present
                if santa_message.startswith('"') and santa_message.endswith('"'):
                    santa_message = santa_message[1:-1]

                print(f"🎅 Santa says: {santa_message}")

                return {
                    "response": santa_message,
                    "model": model_name,
                    "done": True,
                    "usage": result.get("usage", {}),
                    "timestamp": datetime.now().isoformat()
                }
            else:
                error_data = response.json() if response.headers.get('content-type') == 'application/json' else {"error": response.text}
                print(f"❌ Groq API Error ({response.status_code}): {error_data}")

                return {
                    "error": f"Groq API error: {response.status_code}",
                    "details": error_data,
                    "suggestion": "Check your API key and model availability"
                }

        except requests.exceptions.RequestException as e:
            print(f"❌ Network Error: {str(e)}")
            return {
                "error": f"Network error: {str(e)}",
                "suggestion": "Check your internet connection and try again"
            }
        except Exception as e:
            print(f"❌ Unexpected Error: {str(e)}")
            return {
                "error": f"Unexpected error: {str(e)}",
                "suggestion": "Please check your configuration and try again"
            }

# Initialize Santa Tracker SBC
santa_sbc = SantaTrackerSBC()

# Routes
@app.route('/')
def index():
    """Serve the main Santa Tracker SBC application"""
    return send_from_directory('.', 'santa-tracker-sbc.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    return send_from_directory('.', filename)

# API Routes
@app.route('/api/config', methods=['GET'])
def get_config():
    """Get current configuration"""
    return jsonify(santa_sbc.config)

@app.route('/api/config', methods=['POST'])
def save_config():
    """Save configuration"""
    try:
        new_config = request.json
        santa_sbc.save_config(new_config)
        santa_sbc.config = new_config
        return jsonify({"status": "success", "message": "Configuration saved"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/models', methods=['GET'])
def get_models():
    """Get available Groq models"""
    return jsonify({"models": santa_sbc.config["aiProvider"]["availableModels"]})

@app.route('/api/models/switch', methods=['POST'])
def switch_model():
    """Switch to a different model"""
    try:
        data = request.json
        model_name = data.get('model')

        if not model_name:
            return jsonify({"error": "Model name required"}), 400

        # Validate model exists
        available_models = [m["name"] for m in santa_sbc.config["aiProvider"]["availableModels"]]
        if model_name not in available_models:
            return jsonify({"error": f"Model '{model_name}' not available"}), 404

        # Update configuration
        santa_sbc.config["aiProvider"]["defaultModel"] = model_name
        santa_sbc.save_config(santa_sbc.config)

        return jsonify({
            "status": "success",
            "message": f"Switched to model '{model_name}'"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/groq/status', methods=['GET'])
def groq_status():
    """Check Groq API status"""
    validation = santa_sbc.validate_groq_api_key()
    return jsonify({
        "status": "online" if validation["valid"] else "offline",
        "apiKeyValid": validation["valid"],
        "error": validation.get("error"),
        "url": GROQ_API_URL,
        "defaultModel": santa_sbc.config["aiProvider"]["defaultModel"]
    })

@app.route('/api/family', methods=['GET'])
def get_family_data():
    """Get current family database (sanitized for frontend)"""
    try:
        # Return sanitized version (no sensitive data)
        family_data = santa_sbc.family_data
        if family_data:
            return jsonify({
                "hasData": True,
                "familyName": family_data.get('family', {}).get('lastName', 'Unknown'),
                "memberCount": len(family_data.get('family', {}).get('members', [])),
                "location": family_data.get('location', {}).get('city', 'Unknown'),
                "lastUpdated": family_data.get('metadata', {}).get('lastUpdated', 'Unknown'),
                "contextPreview": santa_sbc.create_family_context()[:100] + "..." if santa_sbc.create_family_context() else ""
            })
        else:
            return jsonify({"hasData": False})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/family/reload', methods=['POST'])
def reload_family_data():
    """Reload family database from file (Emergency IT Parent Override!)"""
    try:
        family_data = santa_sbc.reload_family_data()
        return jsonify({
            "status": "reloaded",
            "hasData": bool(family_data),
            "message": "Family database reloaded successfully! 🎄"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate', methods=['POST'])
def generate_message():
    """Generate Santa message - secure proxy to Groq API"""
    try:
        data = request.json
        prompt_type = data.get('prompt_type', 'delivering')
        context = data.get('context', {})

        # Generate message using Groq API
        result = santa_sbc.generate_santa_message(prompt_type, context)

        return jsonify(result)

    except Exception as e:
        return jsonify({
            "error": f"Generation error: {str(e)}",
            "suggestion": "Please check your request and try again"
        }), 500

# Legacy compatibility route for existing frontend
@app.route('/api/chat/completions', methods=['POST'])
def legacy_generate():
    """Legacy compatibility for existing frontend"""
    try:
        data = request.json
        messages = data.get('messages', [])

        # Extract the user message
        user_message = ""
        for msg in messages:
            if msg.get('role') == 'user':
                user_message = msg.get('content', '')
                break

        # Determine prompt type based on message content
        prompt_type = "delivering"  # Default
        if "preparing" in user_message.lower():
            prompt_type = "preparing"
        elif "finished" in user_message.lower():
            prompt_type = "finished"

        # Generate message
        result = santa_sbc.generate_santa_message(prompt_type)

        if "error" in result:
            return jsonify(result), 500

        # Format response to match expected structure
        return jsonify({
            "choices": [{
                "message": {
                    "content": result["response"]
                }
            }],
            "model": result["model"],
            "usage": result.get("usage", {})
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    api_status = santa_sbc.validate_groq_api_key()
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "sbc-1.0.0",
        "architecture": "hybrid",
        "groqApiStatus": api_status,
        "features": {
            "cloudAI": True,
            "realTimeResponses": True,
            "secureProxy": True
        }
    })

# Handle Chrome DevTools requests to prevent 404 spam in logs
@app.route('/.well-known/appspecific/com.chrome.devtools.json', methods=['GET'])
def chrome_devtools():
    """Handle Chrome DevTools metadata request"""
    return jsonify({
        "type": "santa-tracker",
        "name": "Santa Tracker SBC",
        "version": "1.0.0"
    })

if __name__ == "__main__":
    # Validate environment
    if not GROQ_API_KEY:
        print("""
╔══════════════════════════════════════════════════════════════════╗
║                     ⚠️  API KEY REQUIRED ⚠️                      ║
╚══════════════════════════════════════════════════════════════════╝

🔑 Groq API Key not found!

To get started:
1. Visit: https://console.groq.com/
2. Create a free account
3. Generate an API key
4. Create a .env file in this directory with:
   GROQ_API_KEY=your_api_key_here

Then restart the server.
        """)
    else:
        # Validate API key
        validation = santa_sbc.validate_groq_api_key()
        if not validation["valid"]:
            print(f"""
╔══════════════════════════════════════════════════════════════════╗
║                    ⚠️  API KEY INVALID ⚠️                       ║
╚══════════════════════════════════════════════════════════════════╝

❌ Error: {validation["error"]}

Please check your Groq API key in the .env file.
            """)

    print(f"""
╔══════════════════════════════════════════════════════════════════╗
║               🎅 Santa Tracker SBC - Hybrid Architecture 🎄     ║
╚══════════════════════════════════════════════════════════════════╝

  ✨ Server running at: http://localhost:{PORT}

  🏠 Main application: http://localhost:{PORT}/
  ⚙️  Configuration API: http://localhost:{PORT}/api/config
  🤖 Model management: http://localhost:{PORT}/api/models
  🌐 Groq API status: http://localhost:{PORT}/api/groq/status
  ❤️  Health check: http://localhost:{PORT}/health

  🛑 Press Ctrl+C to stop the server

  🚀 SBC Features:
     • Groq Cloud AI integration (blazingly fast!)
     • Secure server-side API proxy (no exposed keys)
     • Optimized for Raspberry Pi 3B
     • Real-time Santa message generation
     • Multiple Groq models available
     • Full configuration management

  💡 Architecture:
     • Host: Raspberry Pi 3B (serves files & proxies API)
     • Brain: Groq Cloud AI (fast inference)
     • Display: Any device with a browser (iPad, phone, etc.)

""")

    app.run(host='0.0.0.0', port=PORT, debug=False, threaded=True)