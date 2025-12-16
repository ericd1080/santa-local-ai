#!/usr/bin/env python3
"""
Enhanced HTTP server for Santa Tracker with configuration management
Supports Ollama proxy, configuration endpoints, and model management
"""

import http.server
import socketserver
import os
import json
import urllib.request
import urllib.error
import urllib.parse
from pathlib import Path
import threading
import time

PORT = 8000
OLLAMA_URL = "http://localhost:11434"
CONFIG_DIR = Path(__file__).parent / "config"
CONFIG_FILE = CONFIG_DIR / "santa-config.json"

class EnhancedRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        """Handle GET requests"""
        if self.path.startswith('/api/config'):
            self.handle_config_get()
        elif self.path.startswith('/api/models'):
            self.handle_models_get()
        elif self.path.startswith('/api/ollama'):
            self.handle_ollama_get()
        else:
            # Serve static files
            super().do_GET()

    def do_POST(self):
        """Handle POST requests"""
        if self.path.startswith('/api/config'):
            self.handle_config_post()
        elif self.path.startswith('/api/models'):
            self.handle_models_post()
        elif self.path.startswith('/api/'):
            # Proxy Ollama requests
            self.proxy_ollama_request()
        else:
            self.send_error(404)

    def do_PUT(self):
        """Handle PUT requests"""
        if self.path.startswith('/api/config'):
            self.handle_config_put()
        else:
            self.send_error(404)

    def do_DELETE(self):
        """Handle DELETE requests"""
        if self.path.startswith('/api/models'):
            self.handle_models_delete()
        else:
            self.send_error(404)

    def handle_config_get(self):
        """Handle configuration GET requests"""
        try:
            if self.path == '/api/config':
                # Return full configuration
                config = self.load_config()
                self.send_json_response(config)
            elif self.path.startswith('/api/config/'):
                # Return specific config section
                section = self.path.split('/')[-1]
                config = self.load_config()

                if section in config:
                    self.send_json_response(config[section])
                else:
                    self.send_error(404, f"Config section '{section}' not found")
            else:
                self.send_error(400, "Invalid config path")

        except Exception as e:
            self.send_error(500, f"Config error: {str(e)}")

    def handle_config_post(self):
        """Handle configuration POST requests"""
        try:
            if self.path == '/api/config/save':
                # Save entire configuration
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                new_config = json.loads(post_data.decode('utf-8'))

                self.save_config(new_config)
                self.send_json_response({"status": "success", "message": "Configuration saved"})

            elif self.path == '/api/config/validate':
                # Validate configuration
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                config = json.loads(post_data.decode('utf-8'))

                validation_result = self.validate_config(config)
                self.send_json_response(validation_result)

            else:
                self.send_error(400, "Invalid config endpoint")

        except json.JSONDecodeError:
            self.send_error(400, "Invalid JSON")
        except Exception as e:
            self.send_error(500, f"Config error: {str(e)}")

    def handle_config_put(self):
        """Handle configuration PUT requests"""
        try:
            # Update specific config section
            path_parts = self.path.split('/')
            if len(path_parts) < 4:
                self.send_error(400, "Invalid config path")
                return

            section = path_parts[3]
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            new_data = json.loads(post_data.decode('utf-8'))

            config = self.load_config()
            config[section] = new_data
            self.save_config(config)

            self.send_json_response({"status": "success", "message": f"Updated {section}"})

        except json.JSONDecodeError:
            self.send_error(400, "Invalid JSON")
        except Exception as e:
            self.send_error(500, f"Config error: {str(e)}")

    def handle_models_get(self):
        """Handle model management GET requests"""
        try:
            if self.path == '/api/models':
                # Return available models from Ollama
                models = self.get_ollama_models()
                self.send_json_response(models)

            elif self.path == '/api/models/health':
                # Check model health
                health_status = self.check_model_health()
                self.send_json_response(health_status)

            elif self.path == '/api/models/current':
                # Get current model from config
                config = self.load_config()
                current_model = config.get('aiProvider', {}).get('defaultModel', '')
                self.send_json_response({"current_model": current_model})

            else:
                self.send_error(400, "Invalid models endpoint")

        except Exception as e:
            self.send_error(500, f"Models error: {str(e)}")

    def handle_models_post(self):
        """Handle model management POST requests"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            if self.path == '/api/models/switch':
                # Switch current model
                model_name = data.get('model')
                if not model_name:
                    self.send_error(400, "Model name required")
                    return

                # Validate model exists
                if not self.validate_model_exists(model_name):
                    self.send_error(404, f"Model '{model_name}' not found")
                    return

                # Update configuration
                config = self.load_config()
                config['aiProvider']['defaultModel'] = model_name
                self.save_config(config)

                self.send_json_response({
                    "status": "success",
                    "message": f"Switched to model '{model_name}'"
                })

            elif self.path == '/api/models/pull':
                # Pull new model
                model_name = data.get('model')
                if not model_name:
                    self.send_error(400, "Model name required")
                    return

                # Start model pull in background
                threading.Thread(
                    target=self.pull_model_async,
                    args=(model_name,)
                ).start()

                self.send_json_response({
                    "status": "started",
                    "message": f"Started pulling model '{model_name}'"
                })

            else:
                self.send_error(400, "Invalid models endpoint")

        except json.JSONDecodeError:
            self.send_error(400, "Invalid JSON")
        except Exception as e:
            self.send_error(500, f"Models error: {str(e)}")

    def handle_models_delete(self):
        """Handle model deletion requests"""
        try:
            # Extract model name from path
            path_parts = self.path.split('/')
            if len(path_parts) < 4:
                self.send_error(400, "Model name required in path")
                return

            model_name = urllib.parse.unquote(path_parts[3])

            # Delete model from Ollama
            success = self.delete_ollama_model(model_name)

            if success:
                self.send_json_response({
                    "status": "success",
                    "message": f"Deleted model '{model_name}'"
                })
            else:
                self.send_error(500, f"Failed to delete model '{model_name}'")

        except Exception as e:
            self.send_error(500, f"Delete error: {str(e)}")

    def handle_ollama_get(self):
        """Handle Ollama status requests"""
        try:
            if self.path == '/api/ollama/status':
                status = self.get_ollama_status()
                self.send_json_response(status)
            else:
                self.send_error(400, "Invalid Ollama endpoint")

        except Exception as e:
            self.send_error(500, f"Ollama error: {str(e)}")

    def proxy_ollama_request(self):
        """Proxy requests to Ollama API"""
        try:
            # Read the request body
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length) if content_length > 0 else b''

            # Forward to Ollama
            req = urllib.request.Request(
                f"{OLLAMA_URL}{self.path}",
                data=post_data,
                headers={'Content-Type': 'application/json'}
            )

            with urllib.request.urlopen(req, timeout=120) as response:
                response_data = response.read()

                # Send response back with CORS headers
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(response_data)

        except urllib.error.HTTPError as e:
            # Send a more helpful error message
            error_msg = json.dumps({
                "error": f"Ollama HTTP error: {e.reason}",
                "suggestion": "Make sure Ollama is properly installed and the model is available"
            })
            self.send_response(502)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(error_msg.encode())
        except urllib.error.URLError as e:
            # Send a more helpful error message
            error_msg = json.dumps({
                "error": f"Ollama not available: {str(e)}",
                "suggestion": "Make sure Ollama is running with 'ollama serve'"
            })
            self.send_response(502)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(error_msg.encode())
        except Exception as e:
            self.send_error(500, f"Proxy error: {str(e)}")

    def load_config(self):
        """Load configuration from file"""
        try:
            if CONFIG_FILE.exists():
                with open(CONFIG_FILE, 'r') as f:
                    return json.load(f)
            else:
                # Return default configuration
                return self.get_default_config()
        except Exception as e:
            print(f"Failed to load config: {e}")
            return self.get_default_config()

    def save_config(self, config):
        """Save configuration to file"""
        # Ensure config directory exists
        CONFIG_DIR.mkdir(exist_ok=True)

        # Validate configuration before saving
        validation = self.validate_config(config)
        if not validation['valid']:
            raise ValueError(f"Invalid configuration: {validation['errors']}")

        # Save to file
        with open(CONFIG_FILE, 'w') as f:
            json.dump(config, f, indent=2)

    def validate_config(self, config):
        """Validate configuration structure"""
        errors = []

        # Check required sections
        required_sections = ['aiProvider', 'prompts', 'server']
        for section in required_sections:
            if section not in config:
                errors.append(f"Missing required section: {section}")

        # Validate aiProvider section
        if 'aiProvider' in config:
            provider = config['aiProvider']
            if 'url' not in provider:
                errors.append("Missing aiProvider.url")
            if 'defaultModel' not in provider:
                errors.append("Missing aiProvider.defaultModel")
            if 'availableModels' not in provider or not isinstance(provider['availableModels'], list):
                errors.append("aiProvider.availableModels must be a list")

        # Validate prompts section
        if 'prompts' in config:
            required_prompts = ['preparing', 'delivering', 'finished']
            for prompt_type in required_prompts:
                if prompt_type not in config['prompts']:
                    errors.append(f"Missing prompt: {prompt_type}")

        return {
            'valid': len(errors) == 0,
            'errors': errors
        }

    def get_default_config(self):
        """Return default configuration"""
        return {
            "aiProvider": {
                "type": "ollama",
                "url": "http://localhost:11434",
                "defaultModel": "llama3.2",
                "availableModels": [
                    {
                        "name": "llama3.2",
                        "displayName": "Llama 3.2",
                        "description": "Default model",
                        "parameters": {
                            "temperature": 0.8,
                            "num_predict": 150
                        }
                    }
                ]
            },
            "prompts": {
                "preparing": "You are Santa Claus! Write a cheerful message about preparing for Christmas.",
                "delivering": "You are Santa Claus! Write a cheerful message about delivering presents.",
                "finished": "You are Santa Claus! Write a cheerful message about finishing deliveries."
            },
            "server": {
                "port": 8000,
                "corsEnabled": True
            }
        }

    def get_ollama_models(self):
        """Get available models from Ollama"""
        try:
            req = urllib.request.Request(f"{OLLAMA_URL}/api/tags")
            with urllib.request.urlopen(req, timeout=10) as response:
                data = json.loads(response.read().decode('utf-8'))
                return data.get('models', [])
        except Exception as e:
            print(f"Failed to get Ollama models: {e}")
            return []

    def get_ollama_status(self):
        """Get Ollama service status"""
        try:
            req = urllib.request.Request(f"{OLLAMA_URL}/api/version")
            with urllib.request.urlopen(req, timeout=5) as response:
                data = json.loads(response.read().decode('utf-8'))
                return {
                    "status": "running",
                    "version": data.get("version", "unknown"),
                    "url": OLLAMA_URL
                }
        except Exception as e:
            return {
                "status": "offline",
                "error": str(e),
                "url": OLLAMA_URL
            }

    def validate_model_exists(self, model_name):
        """Check if model exists in Ollama"""
        models = self.get_ollama_models()
        return any(model['name'].split(':')[0] == model_name for model in models)

    def pull_model_async(self, model_name):
        """Pull model from Ollama registry (async)"""
        try:
            print(f"Starting pull for model: {model_name}")

            req_data = json.dumps({"name": model_name}).encode('utf-8')
            req = urllib.request.Request(
                f"{OLLAMA_URL}/api/pull",
                data=req_data,
                headers={'Content-Type': 'application/json'}
            )

            with urllib.request.urlopen(req, timeout=1800) as response:  # 30 minute timeout
                # Handle streaming response
                while True:
                    chunk = response.read(1024)
                    if not chunk:
                        break
                    # Parse progress updates
                    try:
                        lines = chunk.decode('utf-8').strip().split('\n')
                        for line in lines:
                            if line:
                                data = json.loads(line)
                                if 'status' in data:
                                    print(f"Pull progress: {data['status']}")
                    except:
                        pass

            print(f"Successfully pulled model: {model_name}")

        except Exception as e:
            print(f"Failed to pull model {model_name}: {e}")

    def delete_ollama_model(self, model_name):
        """Delete model from Ollama"""
        try:
            req_data = json.dumps({"name": model_name}).encode('utf-8')
            req = urllib.request.Request(
                f"{OLLAMA_URL}/api/delete",
                data=req_data,
                headers={'Content-Type': 'application/json'}
            )
            req.get_method = lambda: 'DELETE'

            with urllib.request.urlopen(req, timeout=120) as response:
                return response.status == 200

        except Exception as e:
            print(f"Failed to delete model {model_name}: {e}")
            return False

    def check_model_health(self):
        """Check health of all models"""
        models = self.get_ollama_models()
        health_status = []

        for model in models:
            model_name = model['name'].split(':')[0]
            try:
                # Test model with simple prompt
                test_data = {
                    "model": model_name,
                    "prompt": "Test",
                    "stream": False,
                    "options": {"num_predict": 1}
                }

                req = urllib.request.Request(
                    f"{OLLAMA_URL}/api/generate",
                    data=json.dumps(test_data).encode('utf-8'),
                    headers={'Content-Type': 'application/json'}
                )

                with urllib.request.urlopen(req, timeout=10) as response:
                    data = json.loads(response.read().decode('utf-8'))
                    healthy = 'response' in data

                health_status.append({
                    "name": model_name,
                    "healthy": healthy,
                    "size": model.get('size', 0),
                    "modified_at": model.get('modified_at', ''),
                    "last_checked": time.time()
                })

            except Exception as e:
                health_status.append({
                    "name": model_name,
                    "healthy": False,
                    "error": str(e),
                    "last_checked": time.time()
                })

        return health_status

    def send_json_response(self, data):
        """Send JSON response with proper headers"""
        response_data = json.dumps(data).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(response_data)))
        self.end_headers()
        self.wfile.write(response_data)

    def log_message(self, format, *args):
        """Override to customize logging"""
        # Only log non-API requests to reduce noise
        if not self.path.startswith('/api/'):
            super().log_message(format, *args)

if __name__ == "__main__":
    # Change to the directory containing this script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    # Load configuration to get port
    try:
        if CONFIG_FILE.exists():
            with open(CONFIG_FILE, 'r') as f:
                config = json.load(f)
        else:
            config = {}
        port = config.get('server', {}).get('port', PORT)
    except Exception as e:
        print(f"Failed to load config for port: {e}")
        port = PORT

    with socketserver.TCPServer(("", port), EnhancedRequestHandler) as httpd:
        print(f"""
╔════════════════════════════════════════════════════════════════╗
║              🎅 Enhanced Santa Tracker Server! 🎄             ║
╚════════════════════════════════════════════════════════════════╝

  ✨ Server running at: http://localhost:{port}

  📂 Main app: http://localhost:{port}/santa-tracker.html
  ⚙️  Configuration API: http://localhost:{port}/api/config
  🤖 Model management: http://localhost:{port}/api/models

  🛑 Press Ctrl+C to stop the server

  📝 Features:
     • Ollama API proxy with CORS support
     • Runtime configuration management
     • Model discovery and switching
     • Configuration validation
     • Health monitoring

""")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🎅 Ho ho ho! Enhanced server stopped. Merry Christmas! 🎄\n")