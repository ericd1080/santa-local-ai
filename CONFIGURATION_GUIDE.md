# Santa Tracker Enhanced Configuration System

## Overview

The Santa Tracker has been enhanced with a powerful, centralized configuration system that eliminates the need for manual code edits when switching models or customizing prompts. This system provides:

✅ **Zero-code model switching**
✅ **Runtime configuration updates**
✅ **Template-based prompts with variable interpolation**
✅ **Automatic model discovery**
✅ **Configuration validation and error handling**
✅ **User-friendly configuration UI**
✅ **RESTful API for programmatic control**
✅ **Configuration export/import**

## Architecture

The system consists of several key components:

### 1. Configuration File (`config/santa-config.json`)
Central JSON configuration file containing all settings:

```json
{
  "aiProvider": {
    "type": "ollama",
    "url": "http://localhost:11434",
    "defaultModel": "llama3.2",
    "availableModels": [...]
  },
  "prompts": {
    "preparing": "Template for pre-Christmas phase",
    "delivering": "Template for delivery phase with {{VARIABLES}}",
    "finished": "Template for post-Christmas phase"
  },
  "server": {
    "port": 8000,
    "corsEnabled": true
  },
  "ui": {
    "showConfigPanel": true,
    "allowModelSwitching": true,
    "allowPromptEditing": true
  },
  "features": {
    "modelValidation": true,
    "autoDiscoverModels": true,
    "configAutoSave": true
  }
}
```

### 2. Configuration Management Classes

#### ConfigManager (`js/ConfigManager.js`)
- **Purpose**: Central configuration management and validation
- **Key Features**:
  - Configuration loading and validation
  - Real-time configuration updates
  - Event-driven change notifications
  - Fallback configuration support
  - Configuration export/import

#### ModelManager (`js/ModelManager.js`)
- **Purpose**: Ollama model discovery and management
- **Key Features**:
  - Automatic model discovery from Ollama
  - Model availability validation
  - Runtime model switching
  - Parameter management
  - Model health monitoring

#### PromptManager (`js/PromptManager.js`)
- **Purpose**: Template-based prompt generation
- **Key Features**:
  - Dynamic prompt templating with `{{VARIABLE}}` syntax
  - Context-aware prompt generation
  - Template validation
  - Prompt editing and management
  - Context providers system

### 3. Enhanced Server (`enhanced-server.py`)
- **Purpose**: RESTful API endpoints for configuration management
- **Key Features**:
  - Configuration CRUD operations
  - Model management endpoints
  - Ollama proxy with enhanced error handling
  - Configuration validation
  - Health monitoring

### 4. Enhanced UI Components
- **Purpose**: User-friendly configuration interface
- **Key Features**:
  - Runtime model switching
  - Prompt editing interface
  - Configuration import/export
  - Real-time status indicators
  - Advanced settings panel

## Quick Start

### 1. File Structure
```
santa-local-ai/
├── config/
│   └── santa-config.json          # Central configuration file
├── js/
│   ├── ConfigManager.js          # Configuration management
│   ├── ModelManager.js           # Model management
│   ├── PromptManager.js          # Prompt templating
│   └── ConfigPanel.jsx           # UI configuration panel
├── santa-tracker-enhanced.html   # Enhanced web interface
├── santa-tracker-enhanced.jsx    # Enhanced React component
├── enhanced-server.py            # Enhanced server with APIs
└── CONFIGURATION_GUIDE.md        # This documentation
```

### 2. Starting the Enhanced Server
```bash
python3 enhanced-server.py
```

### 3. Accessing the Enhanced Interface
Open your browser to: `http://localhost:8000/santa-tracker-enhanced.html`

## Configuration Management

### Web Interface Configuration

1. **Click the ⚙️ Settings button** in the top-right corner
2. **Models Tab**: Switch between available models
3. **Prompts Tab**: Edit prompt templates
4. **Advanced Tab**: Import/export configurations

### API Configuration

#### Get Current Configuration
```bash
curl http://localhost:8000/api/config
```

#### Switch Models
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"model": "mistral"}' \
  http://localhost:8000/api/models/switch
```

#### Update Configuration Section
```bash
curl -X PUT -H "Content-Type: application/json" \
  -d '{"temperature": 0.9, "num_predict": 200}' \
  http://localhost:8000/api/config/aiProvider
```

### Model Management

#### Available Models
The system supports any Ollama-compatible model:
- `llama3.2` - Fast and efficient (default)
- `mistral` - Creative storytelling
- `phi` - Compact and fast
- `gemma` - Google's efficient model
- `codellama` - Code-focused model
- Any other Ollama model you have installed

#### Auto-Discovery
Models are automatically discovered from your Ollama installation when `autoDiscoverModels` is enabled.

#### Manual Model Addition
Add models to the `availableModels` array in the configuration:

```json
{
  "name": "your-model",
  "displayName": "Your Model Name",
  "description": "Model description",
  "parameters": {
    "temperature": 0.8,
    "num_predict": 150,
    "top_p": 0.9,
    "top_k": 40
  }
}
```

## Prompt Templating System

### Template Syntax
Prompts support variable interpolation using `{{VARIABLE}}` syntax:

```
You are Santa! {{DISTANCE_CONTEXT}} {{GIFTS_CONTEXT}} Be jolly!
```

### Available Variables
- `{{DISTANCE_CONTEXT}}` - Distance information when user shares location
- `{{GIFTS_CONTEXT}}` - Gift delivery progress information
- `{{USER_LOCATION}}` - User's latitude/longitude
- `{{SANTA_STATUS}}` - Current Santa status
- `{{timestamp}}` - Current timestamp
- `{{year}}` - Current year

### Context Phases
The system automatically selects prompts based on Christmas timing:

1. **preparing** - Before Christmas Eve (Dec 24, 6 PM)
2. **delivering** - Christmas Eve 6 PM to Christmas Day 6 AM
3. **finished** - After Christmas Day 6 AM

### Custom Prompt Creation
```javascript
// Add custom context provider
promptManager.registerContextProvider('customVar', () => 'Custom Value');

// Create new prompt template
promptManager.createPromptTemplate('myPrompt',
  'Santa says: {{customVar}} and {{GIFTS_CONTEXT}}'
);
```

## Configuration Options

### AI Provider Settings
```json
"aiProvider": {
  "type": "ollama",                    // Provider type (currently only ollama)
  "url": "http://localhost:11434",    // Ollama server URL
  "defaultModel": "llama3.2",         // Current active model
  "availableModels": [...]            // Available model definitions
}
```

### Model Parameters
Each model can have custom parameters:
```json
"parameters": {
  "temperature": 0.8,      // Randomness (0.0-2.0)
  "num_predict": 150,      // Max tokens to generate
  "top_p": 0.9,           // Nucleus sampling
  "top_k": 40,            // Top-K sampling
  "repeat_penalty": 1.1    // Repetition penalty
}
```

### Server Settings
```json
"server": {
  "port": 8000,                    // Server port
  "corsEnabled": true,             // Enable CORS
  "enableConfigEndpoints": true    // Enable config APIs
}
```

### UI Settings
```json
"ui": {
  "showConfigPanel": true,      // Show settings button
  "allowModelSwitching": true,  // Allow model changes
  "allowPromptEditing": true,   // Allow prompt editing
  "showAdvancedOptions": false  // Show advanced options
}
```

### Feature Flags
```json
"features": {
  "modelValidation": true,      // Validate models before switching
  "autoDiscoverModels": true,   // Auto-discover Ollama models
  "configAutoSave": true,       // Auto-save configuration changes
  "promptTemplating": true      // Enable template system
}
```

## API Reference

### Configuration Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/config` | Get full configuration |
| `GET` | `/api/config/{section}` | Get specific config section |
| `POST` | `/api/config/save` | Save configuration |
| `POST` | `/api/config/validate` | Validate configuration |
| `PUT` | `/api/config/{section}` | Update config section |

### Model Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/models` | List available models |
| `GET` | `/api/models/current` | Get current model |
| `GET` | `/api/models/health` | Check model health |
| `POST` | `/api/models/switch` | Switch active model |
| `POST` | `/api/models/pull` | Pull new model |
| `DELETE` | `/api/models/{name}` | Delete model |

### Status Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/ollama/status` | Check Ollama status |

## Migration Guide

### From Original Version

1. **Backup your current setup** (optional)
2. **Use the enhanced server**: `python3 enhanced-server.py`
3. **Open enhanced interface**: `santa-tracker-enhanced.html`
4. **Configure your preferred model** via the ⚙️ settings
5. **Customize prompts** if desired

### Configuration Migration

The enhanced system automatically provides fallback configuration if no config file exists. Your existing setup will continue working while gaining new capabilities.

## Troubleshooting

### Common Issues

#### Configuration Not Loading
- **Symptoms**: Yellow warning bar, "using fallback configuration"
- **Solution**: Check that `config/santa-config.json` exists and is valid JSON
- **Fix**: The system will create a default config automatically

#### Model Switching Fails
- **Symptoms**: Error when switching models in UI
- **Solution**: Ensure the model exists in Ollama: `ollama list`
- **Fix**: Pull the model: `ollama pull model-name`

#### Ollama Connection Issues
- **Symptoms**: "Ollama not available" errors
- **Solution**: Check Ollama is running: `ollama serve`
- **Fix**: Install/restart Ollama service

#### Prompt Variables Not Working
- **Symptoms**: `{{VARIABLE}}` appears in output instead of being replaced
- **Solution**: Check variable name spelling and context availability
- **Fix**: Use correct variable names from the available variables list

### Debug Information

Enable debug mode by checking the browser console for detailed logs:
- Configuration loading status
- Model switching operations
- Prompt generation process
- API request/response details

### Configuration Validation

The system validates configuration on load and provides specific error messages:
```javascript
// Check configuration status
configManager.getSummary()

// Validate specific configuration
configManager.validateConfig(config)
```

## Advanced Usage

### Custom Context Providers
```javascript
// Register custom context provider
promptManager.registerContextProvider('weather', () => {
  return 'snowy and magical';
});

// Use in prompts
"The weather at the North Pole is {{weather}}"
```

### Configuration Event Listeners
```javascript
// Listen for configuration changes
configManager.addEventListener('config-changed', (data) => {
  console.log('Configuration changed:', data.path);
});

// Listen for model changes
configManager.addEventListener('model-changed', (data) => {
  console.log('Model switched to:', data.model);
});
```

### Programmatic Configuration
```javascript
// Switch models programmatically
await modelManager.switchModel('mistral');

// Update prompts programmatically
promptManager.setTemplate('preparing', 'New template with {{GIFTS_CONTEXT}}');

// Batch configuration updates
configManager.set('aiProvider.defaultModel', 'phi');
configManager.set('features.modelValidation', false);
```

### Configuration Backup/Restore
```javascript
// Export configuration
const configBackup = configManager.export();

// Import configuration
configManager.import(configBackup);

// Reset to defaults
configManager.reset();
```

## Performance Considerations

### Model Loading
- Larger models (7B+) take longer to load initially
- Keep frequently-used models pulled locally
- Use smaller models (1B-3B) for faster responses

### Configuration Caching
- Configuration is cached in memory after first load
- File changes require page refresh unless using API
- Model discovery is cached for 5 minutes

### Network Optimization
- Local Ollama instance provides best performance
- Configuration API calls are lightweight
- Prompt generation is client-side for speed

## Security Considerations

### Local-Only Processing
- All AI processing happens locally via Ollama
- No data sent to external services
- Configuration stored locally only

### Configuration Access
- Configuration endpoints are accessible on localhost only
- No authentication required for local access
- CORS enabled for local development

### Model Security
- Only locally-installed Ollama models can be used
- Model validation prevents arbitrary model access
- Configuration validation prevents malicious configs

## Future Enhancements

Planned improvements for the configuration system:

### Short-term
- [ ] Configuration file hot-reloading
- [ ] Model parameter live-tuning sliders
- [ ] Prompt template syntax highlighting
- [ ] Configuration diff/merge tools

### Medium-term
- [ ] Multiple AI provider support (OpenAI, Anthropic, etc.)
- [ ] Advanced prompt engineering tools
- [ ] Configuration profiles and presets
- [ ] Performance metrics and monitoring

### Long-term
- [ ] Distributed configuration management
- [ ] Advanced model management (quantization, etc.)
- [ ] Plugin system for custom providers
- [ ] Enterprise configuration management

## Contributing

To contribute to the configuration system:

1. **Follow the modular architecture** - keep concerns separated
2. **Maintain backward compatibility** - ensure upgrades are seamless
3. **Add comprehensive validation** - prevent invalid configurations
4. **Include API endpoints** - support both UI and programmatic access
5. **Write thorough documentation** - update this guide with changes

## Support

For configuration system support:

1. **Check this documentation** first
2. **Review browser console** for error details
3. **Test with default configuration** to isolate issues
4. **Verify Ollama installation** and model availability
5. **File issues** with detailed error information and steps to reproduce

---

## Summary

The enhanced configuration system transforms the Santa Tracker from a hardcoded application into a flexible, configurable platform. Users can now:

🎯 **Switch AI models instantly** without code changes
🎯 **Customize prompts dynamically** with template variables
🎯 **Manage settings through intuitive UI** or powerful APIs
🎯 **Extend functionality** with custom context providers
🎯 **Deploy confidently** with validation and error handling

The system maintains full backward compatibility while adding professional-grade configuration management capabilities. Whether you're a casual user wanting to try different models or a developer building custom extensions, this enhanced configuration system provides the foundation for a truly extensible Santa tracking experience.

**Happy tracking! 🎅🎄**