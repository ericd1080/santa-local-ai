/**
 * ConfigManager - Centralized configuration management for Santa Tracker
 * Handles loading, validation, and runtime updates of configuration
 */

class ConfigManager {
  constructor() {
    this.config = null;
    this.listeners = [];
    this.configPath = './config/santa-config.json';
    this.isLoaded = false;
  }

  /**
   * Load configuration from file
   */
  async load() {
    try {
      const response = await fetch(this.configPath);
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.status}`);
      }

      this.config = await response.json();
      this.isLoaded = true;

      // Validate configuration
      this.validateConfig();

      // Notify listeners
      this.notifyListeners('config-loaded', this.config);

      console.log('✅ Configuration loaded successfully');
      return this.config;
    } catch (error) {
      console.error('❌ Failed to load configuration:', error);

      // Load default configuration as fallback
      this.loadDefaultConfig();
      throw error;
    }
  }

  /**
   * Load default configuration as fallback
   */
  loadDefaultConfig() {
    this.config = {
      aiProvider: {
        type: "ollama",
        url: "http://localhost:11434",
        defaultModel: "llama3.2",
        availableModels: [
          {
            name: "llama3.2",
            displayName: "Llama 3.2",
            description: "Default model",
            parameters: {
              temperature: 0.8,
              num_predict: 150
            }
          }
        ]
      },
      prompts: {
        preparing: "You are Santa Claus! Write a cheerful message about preparing for Christmas.",
        delivering: "You are Santa Claus! Write a cheerful message about delivering presents.",
        finished: "You are Santa Claus! Write a cheerful message about finishing deliveries."
      },
      server: {
        port: 8000,
        corsEnabled: true
      },
      ui: {
        showConfigPanel: true,
        allowModelSwitching: true,
        allowPromptEditing: true
      },
      features: {
        modelValidation: true,
        autoDiscoverModels: false,
        configAutoSave: true
      }
    };

    this.isLoaded = true;
    console.log('⚠️ Using default configuration as fallback');
  }

  /**
   * Validate configuration structure and values
   */
  validateConfig() {
    if (!this.config) {
      throw new Error('Configuration is null or undefined');
    }

    // Validate required sections
    const requiredSections = ['aiProvider', 'prompts', 'server'];
    for (const section of requiredSections) {
      if (!this.config[section]) {
        throw new Error(`Missing required configuration section: ${section}`);
      }
    }

    // Validate AI provider
    const provider = this.config.aiProvider;
    if (!provider.url || !provider.defaultModel || !provider.availableModels) {
      throw new Error('Invalid aiProvider configuration');
    }

    // Validate models
    if (!Array.isArray(provider.availableModels) || provider.availableModels.length === 0) {
      throw new Error('availableModels must be a non-empty array');
    }

    // Check if default model exists in available models
    const defaultModelExists = provider.availableModels.some(
      model => model.name === provider.defaultModel
    );
    if (!defaultModelExists) {
      throw new Error(`Default model '${provider.defaultModel}' not found in available models`);
    }

    // Validate prompts
    const prompts = this.config.prompts;
    const requiredPrompts = ['preparing', 'delivering', 'finished'];
    for (const promptType of requiredPrompts) {
      if (!prompts[promptType]) {
        throw new Error(`Missing required prompt: ${promptType}`);
      }
    }

    console.log('✅ Configuration validation passed');
  }

  /**
   * Get configuration value by path (e.g., 'aiProvider.defaultModel')
   */
  get(path) {
    if (!this.isLoaded) {
      throw new Error('Configuration not loaded. Call load() first.');
    }

    const keys = path.split('.');
    let value = this.config;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }

    return value;
  }

  /**
   * Set configuration value by path
   */
  set(path, value) {
    if (!this.isLoaded) {
      throw new Error('Configuration not loaded. Call load() first.');
    }

    const keys = path.split('.');
    const lastKey = keys.pop();
    let target = this.config;

    // Navigate to the parent object
    for (const key of keys) {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      target = target[key];
    }

    // Set the value
    target[lastKey] = value;

    // Notify listeners
    this.notifyListeners('config-changed', { path, value, config: this.config });

    // Auto-save if enabled
    if (this.get('features.configAutoSave')) {
      this.save();
    }
  }

  /**
   * Get current AI model configuration
   */
  getCurrentModel() {
    const defaultModel = this.get('aiProvider.defaultModel');
    const models = this.get('aiProvider.availableModels');
    return models.find(model => model.name === defaultModel);
  }

  /**
   * Set current AI model
   */
  setCurrentModel(modelName) {
    const models = this.get('aiProvider.availableModels');
    const modelExists = models.some(model => model.name === modelName);

    if (!modelExists) {
      throw new Error(`Model '${modelName}' not found in available models`);
    }

    this.set('aiProvider.defaultModel', modelName);
    console.log(`✅ Changed current model to: ${modelName}`);
  }

  /**
   * Get all available models
   */
  getAvailableModels() {
    return this.get('aiProvider.availableModels') || [];
  }

  /**
   * Add a new model to available models
   */
  addModel(modelConfig) {
    const models = this.getAvailableModels();

    // Check if model already exists
    const existingIndex = models.findIndex(model => model.name === modelConfig.name);

    if (existingIndex >= 0) {
      // Update existing model
      models[existingIndex] = { ...models[existingIndex], ...modelConfig };
    } else {
      // Add new model
      models.push(modelConfig);
    }

    this.set('aiProvider.availableModels', models);
    console.log(`✅ Added/updated model: ${modelConfig.name}`);
  }

  /**
   * Remove a model from available models
   */
  removeModel(modelName) {
    const models = this.getAvailableModels();
    const filteredModels = models.filter(model => model.name !== modelName);

    if (filteredModels.length === models.length) {
      throw new Error(`Model '${modelName}' not found`);
    }

    // Don't allow removing the current default model
    if (this.get('aiProvider.defaultModel') === modelName) {
      throw new Error(`Cannot remove current default model '${modelName}'. Switch to another model first.`);
    }

    this.set('aiProvider.availableModels', filteredModels);
    console.log(`✅ Removed model: ${modelName}`);
  }

  /**
   * Get prompt template by type
   */
  getPrompt(promptType) {
    return this.get(`prompts.${promptType}`);
  }

  /**
   * Set prompt template
   */
  setPrompt(promptType, promptText) {
    this.set(`prompts.${promptType}`, promptText);
    console.log(`✅ Updated prompt: ${promptType}`);
  }

  /**
   * Save configuration to file (requires server endpoint)
   */
  async save() {
    try {
      const response = await fetch('/api/config/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.config)
      });

      if (!response.ok) {
        throw new Error(`Failed to save config: ${response.status}`);
      }

      console.log('✅ Configuration saved successfully');
      this.notifyListeners('config-saved', this.config);
    } catch (error) {
      console.error('❌ Failed to save configuration:', error);
      // For now, just log to console - we'll implement server endpoints later
      console.log('💾 Configuration would be saved:', JSON.stringify(this.config, null, 2));
    }
  }

  /**
   * Export configuration as JSON string
   */
  export() {
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * Import configuration from JSON string
   */
  import(configJson) {
    try {
      const importedConfig = JSON.parse(configJson);
      const oldConfig = this.config;
      this.config = importedConfig;

      // Validate imported configuration
      this.validateConfig();

      console.log('✅ Configuration imported successfully');
      this.notifyListeners('config-imported', { oldConfig, newConfig: this.config });

      // Auto-save if enabled
      if (this.get('features.configAutoSave')) {
        this.save();
      }

    } catch (error) {
      console.error('❌ Failed to import configuration:', error);
      throw error;
    }
  }

  /**
   * Reset configuration to defaults
   */
  reset() {
    const oldConfig = this.config;
    this.loadDefaultConfig();

    console.log('✅ Configuration reset to defaults');
    this.notifyListeners('config-reset', { oldConfig, newConfig: this.config });

    // Auto-save if enabled
    if (this.get('features.configAutoSave')) {
      this.save();
    }
  }

  /**
   * Add event listener for configuration changes
   */
  addEventListener(event, callback) {
    this.listeners.push({ event, callback });
  }

  /**
   * Remove event listener
   */
  removeEventListener(event, callback) {
    this.listeners = this.listeners.filter(
      listener => !(listener.event === event && listener.callback === callback)
    );
  }

  /**
   * Notify all listeners of an event
   */
  notifyListeners(event, data) {
    this.listeners
      .filter(listener => listener.event === event)
      .forEach(listener => {
        try {
          listener.callback(data);
        } catch (error) {
          console.error('Error in config listener:', error);
        }
      });
  }

  /**
   * Get configuration summary for debugging
   */
  getSummary() {
    if (!this.isLoaded) {
      return 'Configuration not loaded';
    }

    const currentModel = this.getCurrentModel();
    const modelCount = this.getAvailableModels().length;

    return {
      isLoaded: this.isLoaded,
      currentModel: currentModel?.name || 'none',
      availableModels: modelCount,
      provider: this.get('aiProvider.type'),
      serverUrl: this.get('aiProvider.url'),
      features: this.get('features')
    };
  }
}

// Create and export singleton instance
const configManager = new ConfigManager();

// Auto-load configuration when module is imported
configManager.load().catch(error => {
  console.warn('Failed to auto-load configuration on startup:', error.message);
});

export default configManager;