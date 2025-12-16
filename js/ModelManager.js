/**
 * ModelManager - Model discovery, validation, and management for Santa Tracker
 * Handles Ollama model operations and runtime model switching
 */

import configManager from './ConfigManager.js';

class ModelManager {
  constructor() {
    this.cachedModels = [];
    this.lastDiscovery = null;
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Discover all available models from Ollama
   */
  async discoverModels() {
    try {
      console.log('🔍 Discovering available Ollama models...');

      const ollamaUrl = configManager.get('aiProvider.url');
      const response = await fetch(`${ollamaUrl}/api/tags`);

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      const discoveredModels = data.models || [];

      // Transform Ollama model format to our configuration format
      const formattedModels = discoveredModels.map(model => ({
        name: model.name.split(':')[0], // Remove tag if present
        displayName: this.formatDisplayName(model.name),
        description: `Ollama model (${this.formatSize(model.size)})`,
        size: model.size,
        modifiedAt: model.modified_at,
        parameters: {
          temperature: 0.8,
          num_predict: 150,
          top_p: 0.9,
          top_k: 40
        },
        discovered: true,
        available: true
      }));

      // Cache results
      this.cachedModels = formattedModels;
      this.lastDiscovery = new Date();

      console.log(`✅ Discovered ${formattedModels.length} Ollama models`);
      return formattedModels;

    } catch (error) {
      console.error('❌ Failed to discover models:', error);
      return [];
    }
  }

  /**
   * Get all available models (from config + discovered)
   */
  async getAllModels() {
    const configModels = configManager.getAvailableModels();
    let discoveredModels = [];

    // Auto-discover if enabled and cache is stale
    if (configManager.get('features.autoDiscoverModels')) {
      const needsDiscovery = !this.lastDiscovery ||
        (Date.now() - this.lastDiscovery.getTime()) > this.cacheTimeout;

      if (needsDiscovery) {
        discoveredModels = await this.discoverModels();
      } else {
        discoveredModels = this.cachedModels;
      }
    }

    // Merge config models with discovered models
    const mergedModels = this.mergeModels(configModels, discoveredModels);
    return mergedModels;
  }

  /**
   * Merge configured models with discovered models
   */
  mergeModels(configModels, discoveredModels) {
    const merged = [...configModels];

    // Add discovered models that aren't in config
    for (const discoveredModel of discoveredModels) {
      const existsInConfig = configModels.some(
        configModel => configModel.name === discoveredModel.name
      );

      if (!existsInConfig) {
        merged.push({
          ...discoveredModel,
          autoDiscovered: true
        });
      } else {
        // Update availability status for config models
        const configModel = merged.find(m => m.name === discoveredModel.name);
        if (configModel) {
          configModel.available = true;
          configModel.size = discoveredModel.size;
          configModel.modifiedAt = discoveredModel.modifiedAt;
        }
      }
    }

    // Mark unavailable models
    for (const model of merged) {
      if (!model.hasOwnProperty('available')) {
        model.available = false;
      }
    }

    return merged;
  }

  /**
   * Validate if a model is available and working
   */
  async validateModel(modelName) {
    try {
      console.log(`🔍 Validating model: ${modelName}`);

      const ollamaUrl = configManager.get('aiProvider.url');
      const testPrompt = 'Test';

      const response = await fetch(`${ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: modelName,
          prompt: testPrompt,
          stream: false,
          options: {
            num_predict: 1
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Model validation failed: ${response.status}`);
      }

      const data = await response.json();
      const isValid = data.response !== undefined;

      console.log(`✅ Model ${modelName} is ${isValid ? 'valid' : 'invalid'}`);
      return isValid;

    } catch (error) {
      console.error(`❌ Model validation failed for ${modelName}:`, error);
      return false;
    }
  }

  /**
   * Switch to a different model
   */
  async switchModel(modelName) {
    try {
      console.log(`🔄 Switching to model: ${modelName}`);

      // Validate model if validation is enabled
      if (configManager.get('features.modelValidation')) {
        const isValid = await this.validateModel(modelName);
        if (!isValid) {
          throw new Error(`Model '${modelName}' is not available or not working`);
        }
      }

      // Update configuration
      configManager.setCurrentModel(modelName);

      console.log(`✅ Successfully switched to model: ${modelName}`);
      return true;

    } catch (error) {
      console.error(`❌ Failed to switch to model ${modelName}:`, error);
      throw error;
    }
  }

  /**
   * Get the current active model
   */
  getCurrentModel() {
    return configManager.getCurrentModel();
  }

  /**
   * Update model parameters
   */
  updateModelParameters(modelName, parameters) {
    const models = configManager.getAvailableModels();
    const modelIndex = models.findIndex(model => model.name === modelName);

    if (modelIndex === -1) {
      throw new Error(`Model '${modelName}' not found`);
    }

    // Update parameters
    models[modelIndex].parameters = {
      ...models[modelIndex].parameters,
      ...parameters
    };

    configManager.set('aiProvider.availableModels', models);
    console.log(`✅ Updated parameters for model: ${modelName}`);
  }

  /**
   * Pull a model from Ollama registry
   */
  async pullModel(modelName) {
    try {
      console.log(`📥 Pulling model: ${modelName}`);

      const ollamaUrl = configManager.get('aiProvider.url');
      const response = await fetch(`${ollamaUrl}/api/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: modelName
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to pull model: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body.getReader();
      let pullStatus = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.status) {
              pullStatus = data.status;
              console.log(`📥 Pull status: ${data.status}`);
            }
          } catch (e) {
            // Ignore non-JSON lines
          }
        }
      }

      // Add model to configuration after successful pull
      const newModel = {
        name: modelName,
        displayName: this.formatDisplayName(modelName),
        description: `Ollama model (pulled)`,
        parameters: {
          temperature: 0.8,
          num_predict: 150,
          top_p: 0.9,
          top_k: 40
        },
        pulled: true,
        available: true
      };

      configManager.addModel(newModel);

      console.log(`✅ Successfully pulled and added model: ${modelName}`);
      return true;

    } catch (error) {
      console.error(`❌ Failed to pull model ${modelName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a model from Ollama
   */
  async deleteModel(modelName) {
    try {
      console.log(`🗑️ Deleting model: ${modelName}`);

      const ollamaUrl = configManager.get('aiProvider.url');
      const response = await fetch(`${ollamaUrl}/api/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: modelName
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to delete model: ${response.status}`);
      }

      // Remove model from configuration
      configManager.removeModel(modelName);

      console.log(`✅ Successfully deleted model: ${modelName}`);
      return true;

    } catch (error) {
      console.error(`❌ Failed to delete model ${modelName}:`, error);
      throw error;
    }
  }

  /**
   * Get model health status
   */
  async getModelHealth() {
    const allModels = await this.getAllModels();
    const healthStatus = [];

    for (const model of allModels) {
      try {
        const isHealthy = await this.validateModel(model.name);
        healthStatus.push({
          name: model.name,
          displayName: model.displayName,
          available: model.available,
          healthy: isHealthy,
          size: model.size,
          lastChecked: new Date()
        });
      } catch (error) {
        healthStatus.push({
          name: model.name,
          displayName: model.displayName,
          available: false,
          healthy: false,
          error: error.message,
          lastChecked: new Date()
        });
      }
    }

    return healthStatus;
  }

  /**
   * Get Ollama service status
   */
  async getOllamaStatus() {
    try {
      const ollamaUrl = configManager.get('aiProvider.url');
      const response = await fetch(`${ollamaUrl}/api/version`);

      if (!response.ok) {
        return { status: 'error', error: `HTTP ${response.status}` };
      }

      const data = await response.json();
      return {
        status: 'running',
        version: data.version || 'unknown',
        url: ollamaUrl
      };

    } catch (error) {
      return {
        status: 'offline',
        error: error.message,
        url: configManager.get('aiProvider.url')
      };
    }
  }

  /**
   * Format model display name
   */
  formatDisplayName(modelName) {
    // Convert model names to friendly display names
    const nameMap = {
      'llama3.2': 'Llama 3.2',
      'llama3.1': 'Llama 3.1',
      'llama3': 'Llama 3',
      'mistral': 'Mistral 7B',
      'phi': 'Phi 3',
      'gemma': 'Gemma 7B',
      'codellama': 'Code Llama',
      'vicuna': 'Vicuna',
      'orca': 'Orca'
    };

    // Remove version tags and get base name
    const baseName = modelName.split(':')[0];
    return nameMap[baseName] || this.capitalize(baseName);
  }

  /**
   * Format file size
   */
  formatSize(bytes) {
    if (!bytes) return 'Unknown size';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  /**
   * Capitalize first letter
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Get model statistics
   */
  getModelStats() {
    const allModels = configManager.getAvailableModels();
    const availableCount = allModels.filter(m => m.available).length;
    const discoveredCount = allModels.filter(m => m.autoDiscovered).length;

    return {
      total: allModels.length,
      available: availableCount,
      unavailable: allModels.length - availableCount,
      autoDiscovered: discoveredCount,
      configured: allModels.length - discoveredCount,
      current: configManager.get('aiProvider.defaultModel')
    };
  }

  /**
   * Clear model cache
   */
  clearCache() {
    this.cachedModels = [];
    this.lastDiscovery = null;
    console.log('🧹 Model cache cleared');
  }
}

// Create and export singleton instance
const modelManager = new ModelManager();

export default modelManager;