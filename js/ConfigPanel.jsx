/**
 * ConfigPanel - Runtime configuration UI component for Santa Tracker
 * Provides user-friendly interface for model switching and configuration
 */

import React, { useState, useEffect } from 'react';
import { Settings, ChevronDown, RefreshCw, Download, Upload, Save, X, Check, AlertTriangle } from 'lucide-react';

import configManager from './ConfigManager.js';
import modelManager from './ModelManager.js';
import promptManager from './PromptManager.js';

export default function ConfigPanel({ onClose, onConfigChange }) {
  // Panel state
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('models');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Model state
  const [availableModels, setAvailableModels] = useState([]);
  const [currentModel, setCurrentModel] = useState('');
  const [modelHealth, setModelHealth] = useState({});
  const [ollamaStatus, setOllamaStatus] = useState(null);

  // Prompt state
  const [prompts, setPrompts] = useState({});
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [promptPreview, setPromptPreview] = useState('');

  // Advanced settings state
  const [modelParameters, setModelParameters] = useState({});
  const [serverSettings, setServerSettings] = useState({});

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load models
      const models = await modelManager.getAllModels();
      setAvailableModels(models);

      // Get current model
      const current = configManager.getCurrentModel();
      setCurrentModel(current?.name || '');
      if (current) {
        setModelParameters(current.parameters || {});
      }

      // Load prompts
      const promptTypes = promptManager.getAvailablePromptTypes();
      const promptData = {};
      for (const type of promptTypes) {
        promptData[type] = promptManager.getTemplate(type);
      }
      setPrompts(promptData);

      // Load server settings
      setServerSettings({
        port: configManager.get('server.port'),
        corsEnabled: configManager.get('server.corsEnabled')
      });

      // Check Ollama status
      const status = await modelManager.getOllamaStatus();
      setOllamaStatus(status);

      setLoading(false);

    } catch (error) {
      console.error('Failed to load configuration data:', error);
      setMessage({ type: 'error', text: 'Failed to load configuration data' });
      setLoading(false);
    }
  };

  const handleModelSwitch = async (modelName) => {
    try {
      setLoading(true);
      setMessage({ type: 'info', text: `Switching to ${modelName}...` });

      await modelManager.switchModel(modelName);
      setCurrentModel(modelName);

      // Update parameters for new model
      const newModel = availableModels.find(m => m.name === modelName);
      if (newModel) {
        setModelParameters(newModel.parameters || {});
      }

      setMessage({ type: 'success', text: `Successfully switched to ${modelName}` });

      // Notify parent component
      if (onConfigChange) {
        onConfigChange({ type: 'model-changed', model: modelName });
      }

    } catch (error) {
      console.error('Failed to switch model:', error);
      setMessage({ type: 'error', text: `Failed to switch model: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleParameterChange = (param, value) => {
    const newParams = { ...modelParameters, [param]: value };
    setModelParameters(newParams);

    // Update model configuration
    if (currentModel) {
      modelManager.updateModelParameters(currentModel, { [param]: value });
    }
  };

  const handlePromptEdit = (promptType) => {
    setEditingPrompt(promptType);
    setPromptPreview(promptManager.previewPrompt(promptType));
  };

  const handlePromptSave = (promptType, newPrompt) => {
    try {
      promptManager.setTemplate(promptType, newPrompt);
      setPrompts({ ...prompts, [promptType]: newPrompt });
      setEditingPrompt(null);
      setMessage({ type: 'success', text: `Prompt '${promptType}' updated` });

      // Notify parent component
      if (onConfigChange) {
        onConfigChange({ type: 'prompt-changed', promptType, prompt: newPrompt });
      }

    } catch (error) {
      console.error('Failed to save prompt:', error);
      setMessage({ type: 'error', text: `Failed to save prompt: ${error.message}` });
    }
  };

  const handleRefreshModels = async () => {
    try {
      setLoading(true);
      setMessage({ type: 'info', text: 'Refreshing models...' });

      modelManager.clearCache();
      const models = await modelManager.discoverModels();
      setAvailableModels(models);

      setMessage({ type: 'success', text: `Found ${models.length} models` });
    } catch (error) {
      console.error('Failed to refresh models:', error);
      setMessage({ type: 'error', text: 'Failed to refresh models' });
    } finally {
      setLoading(false);
    }
  };

  const handleExportConfig = () => {
    try {
      const configData = configManager.export();
      const blob = new Blob([configData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'santa-tracker-config.json';
      a.click();
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Configuration exported' });
    } catch (error) {
      console.error('Failed to export config:', error);
      setMessage({ type: 'error', text: 'Failed to export configuration' });
    }
  };

  const handleImportConfig = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        configManager.import(e.target.result);
        loadData(); // Reload all data
        setMessage({ type: 'success', text: 'Configuration imported successfully' });
      } catch (error) {
        console.error('Failed to import config:', error);
        setMessage({ type: 'error', text: 'Failed to import configuration' });
      }
    };
    reader.readAsText(file);
  };

  const MessageBar = ({ message }) => {
    if (!message) return null;

    const bgColor = message.type === 'error' ? 'bg-red-100 border-red-400 text-red-700' :
                   message.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' :
                   'bg-blue-100 border-blue-400 text-blue-700';

    return (
      <div className={`border-l-4 p-4 mb-4 ${bgColor}`}>
        <div className="flex items-center">
          {message.type === 'error' && <AlertTriangle className="w-4 h-4 mr-2" />}
          {message.type === 'success' && <Check className="w-4 h-4 mr-2" />}
          <span className="text-sm">{message.text}</span>
        </div>
      </div>
    );
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-105"
        title="Open Configuration Panel"
      >
        <Settings className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="w-6 h-6 mr-3" />
            <h2 className="text-2xl font-bold">Santa Tracker Configuration</h2>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="hover:bg-red-700 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <MessageBar message={message} />

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['models', 'prompts', 'advanced'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              <span>Loading...</span>
            </div>
          )}

          {/* Models Tab */}
          {activeTab === 'models' && !loading && (
            <div className="space-y-6">
              {/* Ollama Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Ollama Status</h3>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    ollamaStatus?.status === 'running' ? 'bg-green-500' :
                    ollamaStatus?.status === 'error' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="capitalize">{ollamaStatus?.status || 'Unknown'}</span>
                  {ollamaStatus?.version && (
                    <span className="ml-2 text-gray-500">v{ollamaStatus.version}</span>
                  )}
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Available Models</h3>
                  <button
                    onClick={handleRefreshModels}
                    disabled={loading}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </button>
                </div>

                <div className="grid gap-3">
                  {availableModels.map((model) => (
                    <div
                      key={model.name}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        currentModel === model.name
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleModelSwitch(model.name)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{model.displayName}</h4>
                          <p className="text-sm text-gray-600">{model.description}</p>
                        </div>
                        <div className="text-right">
                          <div className={`inline-block px-2 py-1 rounded text-xs ${
                            model.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {model.available ? 'Available' : 'Not Available'}
                          </div>
                          {currentModel === model.name && (
                            <div className="text-xs text-red-600 mt-1">Current</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model Parameters */}
              {currentModel && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Model Parameters</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Temperature</label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={modelParameters.temperature || 0.8}
                        onChange={(e) => handleParameterChange('temperature', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-500">{modelParameters.temperature || 0.8}</span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Max Tokens</label>
                      <input
                        type="range"
                        min="50"
                        max="500"
                        step="10"
                        value={modelParameters.num_predict || 150}
                        onChange={(e) => handleParameterChange('num_predict', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-500">{modelParameters.num_predict || 150}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Prompts Tab */}
          {activeTab === 'prompts' && !loading && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Prompt Templates</h3>
                <button
                  onClick={() => promptManager.resetToDefaults()}
                  className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Reset to Defaults
                </button>
              </div>

              {Object.entries(prompts).map(([type, prompt]) => (
                <div key={type} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold capitalize">{type} Phase</h4>
                    <button
                      onClick={() => handlePromptEdit(type)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  </div>

                  {editingPrompt === type ? (
                    <div className="space-y-3">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompts({ ...prompts, [type]: e.target.value })}
                        className="w-full h-32 border rounded-lg p-3 font-mono text-sm"
                        placeholder="Enter prompt template..."
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePromptSave(type, prompts[type])}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          <Save className="w-4 h-4 inline mr-1" />
                          Save
                        </button>
                        <button
                          onClick={() => setEditingPrompt(null)}
                          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded p-3 text-sm font-mono">
                      {prompt}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && !loading && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Advanced Settings</h3>

              {/* Import/Export */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Configuration Management</h4>
                <div className="flex space-x-3">
                  <button
                    onClick={handleExportConfig}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Config
                  </button>
                  <label className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Config
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportConfig}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Server Settings */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Server Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Port</label>
                    <input
                      type="number"
                      value={serverSettings.port || 8000}
                      onChange={(e) => setServerSettings({ ...serverSettings, port: parseInt(e.target.value) })}
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="corsEnabled"
                      checked={serverSettings.corsEnabled || false}
                      onChange={(e) => setServerSettings({ ...serverSettings, corsEnabled: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="corsEnabled" className="text-sm font-medium">Enable CORS</label>
                  </div>
                </div>
              </div>

              {/* Configuration Summary */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Configuration Summary</h4>
                <pre className="bg-gray-50 rounded p-3 text-xs font-mono overflow-auto">
                  {JSON.stringify(configManager.getSummary(), null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
          <div className="text-sm text-gray-500">
            Configuration auto-saves when modified
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}