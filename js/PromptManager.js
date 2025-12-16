/**
 * PromptManager - Template-based prompt management for Santa Tracker
 * Handles dynamic prompt generation with context interpolation
 */

import configManager from './ConfigManager.js';

class PromptManager {
  constructor() {
    this.templateCache = {};
    this.contextProviders = new Map();
    this.defaultContext = {};
  }

  /**
   * Generate prompt for given type with context
   */
  generatePrompt(promptType, context = {}) {
    try {
      // Get base template
      const template = configManager.getPrompt(promptType);
      if (!template) {
        throw new Error(`Prompt template '${promptType}' not found`);
      }

      // Merge context with default context and providers
      const fullContext = this.buildFullContext(context);

      // Interpolate template
      const prompt = this.interpolateTemplate(template, fullContext);

      console.log(`✅ Generated prompt for '${promptType}'`);
      return prompt;

    } catch (error) {
      console.error(`❌ Failed to generate prompt '${promptType}':`, error);

      // Return fallback prompt
      return this.getFallbackPrompt(promptType, context);
    }
  }

  /**
   * Build full context from all sources
   */
  buildFullContext(userContext) {
    const context = { ...this.defaultContext, ...userContext };

    // Add context from registered providers
    for (const [key, provider] of this.contextProviders) {
      try {
        if (typeof provider === 'function') {
          context[key] = provider();
        } else {
          context[key] = provider;
        }
      } catch (error) {
        console.warn(`Context provider '${key}' failed:`, error);
      }
    }

    return context;
  }

  /**
   * Interpolate template with context variables
   */
  interpolateTemplate(template, context) {
    // Replace {{VARIABLE}} patterns with context values
    return template.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
      const trimmedVar = variable.trim();

      // Handle nested properties (e.g., {{user.location}})
      const value = this.getNestedProperty(context, trimmedVar);

      if (value !== undefined && value !== null) {
        return String(value);
      } else {
        // Keep placeholder if no value found
        console.warn(`Context variable '${trimmedVar}' not found, keeping placeholder`);
        return match;
      }
    });
  }

  /**
   * Get nested property from object (e.g., 'user.location.lat')
   */
  getNestedProperty(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * Register a context provider
   */
  registerContextProvider(key, provider) {
    this.contextProviders.set(key, provider);
    console.log(`✅ Registered context provider: ${key}`);
  }

  /**
   * Remove a context provider
   */
  removeContextProvider(key) {
    const removed = this.contextProviders.delete(key);
    if (removed) {
      console.log(`✅ Removed context provider: ${key}`);
    }
    return removed;
  }

  /**
   * Set default context values
   */
  setDefaultContext(context) {
    this.defaultContext = { ...this.defaultContext, ...context };
  }

  /**
   * Get current prompt template
   */
  getTemplate(promptType) {
    return configManager.getPrompt(promptType);
  }

  /**
   * Set prompt template
   */
  setTemplate(promptType, template) {
    configManager.setPrompt(promptType, template);

    // Clear cache for this template
    delete this.templateCache[promptType];
  }

  /**
   * Validate template syntax
   */
  validateTemplate(template) {
    const errors = [];

    // Check for unbalanced braces
    const openBraces = (template.match(/\{\{/g) || []).length;
    const closeBraces = (template.match(/\}\}/g) || []).length;

    if (openBraces !== closeBraces) {
      errors.push('Unbalanced template braces');
    }

    // Check for empty variables
    const emptyVars = template.match(/\{\{\s*\}\}/g);
    if (emptyVars) {
      errors.push(`Empty template variables found: ${emptyVars.length}`);
    }

    // Extract and validate variable names
    const variables = this.extractVariables(template);
    for (const variable of variables) {
      if (!/^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(variable)) {
        errors.push(`Invalid variable name: ${variable}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      variables
    };
  }

  /**
   * Extract all variables from template
   */
  extractVariables(template) {
    const matches = template.match(/\{\{([^}]+)\}\}/g) || [];
    return matches.map(match => match.replace(/^\{\{|\}\}$/g, '').trim());
  }

  /**
   * Get template analysis
   */
  analyzeTemplate(promptType) {
    const template = this.getTemplate(promptType);
    if (!template) {
      return { error: `Template '${promptType}' not found` };
    }

    const validation = this.validateTemplate(template);

    return {
      promptType,
      template,
      length: template.length,
      variables: validation.variables,
      isValid: validation.isValid,
      errors: validation.errors,
      wordCount: template.split(/\s+/).length
    };
  }

  /**
   * Get Santa-specific context for Christmas timing
   */
  getSantaTimeContext() {
    const now = new Date();
    const christmasEve = new Date(now.getFullYear(), 11, 24, 18, 0, 0);
    const christmasDay = new Date(now.getFullYear(), 11, 25, 6, 0, 0);

    let phase = 'preparing';
    if (now >= christmasEve && now < christmasDay) {
      phase = 'delivering';
    } else if (now >= christmasDay) {
      phase = 'finished';
    }

    return {
      phase,
      isChristmasEve: now >= christmasEve && now < christmasDay,
      isChristmasDay: now >= christmasDay,
      isPreChristmas: now < christmasEve,
      currentTime: now.toISOString(),
      timeUntilChristmas: Math.max(0, christmasEve.getTime() - now.getTime()),
      dayOfYear: Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000)
    };
  }

  /**
   * Build context for Santa messages based on current state
   */
  buildSantaContext(santaStats, userLocation) {
    const timeContext = this.getSantaTimeContext();

    let distanceContext = '';
    let giftsContext = '';

    if (santaStats) {
      if (santaStats.distance) {
        distanceContext = `He is about ${santaStats.distance.toLocaleString()} km away from the user's location.`;
      }

      if (santaStats.giftsDelivered && santaStats.giftsDelivered > 0) {
        giftsContext = `He has delivered ${santaStats.giftsDelivered.toLocaleString()} gifts so far!`;
      }
    }

    return {
      ...timeContext,
      DISTANCE_CONTEXT: distanceContext,
      GIFTS_CONTEXT: giftsContext,
      USER_LOCATION: userLocation ? `${userLocation.lat.toFixed(2)}, ${userLocation.lon.toFixed(2)}` : 'unknown',
      SANTA_STATUS: santaStats?.status || 'unknown'
    };
  }

  /**
   * Generate Santa message with current context
   */
  generateSantaMessage(santaStats, userLocation) {
    const context = this.buildSantaContext(santaStats, userLocation);
    const promptType = context.phase;

    return this.generatePrompt(promptType, context);
  }

  /**
   * Get fallback prompt when generation fails
   */
  getFallbackPrompt(promptType, context) {
    const fallbacks = {
      preparing: "Ho ho ho! I'm busy preparing for Christmas Eve at the North Pole! The elves and I are working hard to make this Christmas magical! 🎅",
      delivering: "Ho ho ho! I'm on my way around the world delivering presents! Keep being good and I might visit your area soon! 🎁",
      finished: "Ho ho ho! What a wonderful Christmas that was! All the presents have been delivered and I'm back home with the reindeer! 🎄"
    };

    return fallbacks[promptType] || "Ho ho ho! Merry Christmas from Santa! 🎅";
  }

  /**
   * Preview prompt with sample context
   */
  previewPrompt(promptType, sampleContext = {}) {
    // Use sample context for preview
    const defaultSampleContext = {
      DISTANCE_CONTEXT: "He is about 1,500 km away from the user's location.",
      GIFTS_CONTEXT: "He has delivered 1,234,567,890 gifts so far!",
      USER_LOCATION: "40.75, -73.99",
      SANTA_STATUS: "Out for delivery!"
    };

    const context = { ...defaultSampleContext, ...sampleContext };
    return this.generatePrompt(promptType, context);
  }

  /**
   * Get all available prompt types
   */
  getAvailablePromptTypes() {
    const prompts = configManager.get('prompts');
    return Object.keys(prompts || {});
  }

  /**
   * Create new prompt template
   */
  createPromptTemplate(promptType, template, description = '') {
    // Validate template first
    const validation = this.validateTemplate(template);
    if (!validation.isValid) {
      throw new Error(`Invalid template: ${validation.errors.join(', ')}`);
    }

    // Set the template
    this.setTemplate(promptType, template);

    console.log(`✅ Created new prompt template: ${promptType}`);
    return {
      promptType,
      template,
      description,
      variables: validation.variables,
      created: new Date()
    };
  }

  /**
   * Clone existing prompt template
   */
  clonePromptTemplate(sourceType, targetType, modifications = {}) {
    const sourceTemplate = this.getTemplate(sourceType);
    if (!sourceTemplate) {
      throw new Error(`Source template '${sourceType}' not found`);
    }

    let newTemplate = sourceTemplate;

    // Apply modifications
    if (modifications.replaceText) {
      for (const [find, replace] of Object.entries(modifications.replaceText)) {
        newTemplate = newTemplate.replace(new RegExp(find, 'g'), replace);
      }
    }

    this.setTemplate(targetType, newTemplate);
    console.log(`✅ Cloned prompt template: ${sourceType} → ${targetType}`);
  }

  /**
   * Get prompt usage statistics
   */
  getPromptStats() {
    const promptTypes = this.getAvailablePromptTypes();
    const stats = {};

    for (const type of promptTypes) {
      const analysis = this.analyzeTemplate(type);
      stats[type] = {
        length: analysis.length,
        wordCount: analysis.wordCount,
        variables: analysis.variables.length,
        isValid: analysis.isValid
      };
    }

    return stats;
  }

  /**
   * Reset all prompts to defaults
   */
  resetToDefaults() {
    const defaultPrompts = {
      preparing: "You are Santa Claus! Write a cheerful, warm message (2-3 sentences max) about preparing for Christmas Eve at the North Pole. The elves are busy wrapping presents. Be jolly, mention the reindeer if relevant, and keep it magical and brief. Use emojis sparingly (1-2 max). Don't use quotation marks.",
      delivering: "You are Santa Claus! Write a cheerful, warm message (2-3 sentences max) to someone tracking your journey. Santa is currently delivering presents around the world! {{DISTANCE_CONTEXT}} {{GIFTS_CONTEXT}} Be jolly, mention the reindeer if relevant, and keep it magical and brief. Use emojis sparingly (1-2 max). Don't use quotation marks.",
      finished: "You are Santa Claus! Write a cheerful, warm message (2-3 sentences max) about finishing Christmas deliveries and resting at the North Pole with the reindeer. Be jolly and keep it magical and brief. Use emojis sparingly (1-2 max). Don't use quotation marks."
    };

    for (const [type, template] of Object.entries(defaultPrompts)) {
      this.setTemplate(type, template);
    }

    console.log('✅ Reset all prompts to defaults');
  }
}

// Create and export singleton instance
const promptManager = new PromptManager();

// Register default context providers
promptManager.registerContextProvider('timestamp', () => new Date().toISOString());
promptManager.registerContextProvider('year', () => new Date().getFullYear());
promptManager.registerContextProvider('santaTime', () => promptManager.getSantaTimeContext());

export default promptManager;