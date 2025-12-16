import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Gift, Settings, AlertTriangle } from 'lucide-react';

// Import our new configuration management system
import configManager from './js/ConfigManager.js';
import modelManager from './js/ModelManager.js';
import promptManager from './js/PromptManager.js';
import ConfigPanel from './js/ConfigPanel.jsx';

export default function SantaTrackerEnhanced() {
  // Core state
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('prompt');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [santaStats, setSantaStats] = useState(null);
  const [santaMessage, setSantaMessage] = useState('');
  const [loadingMessage, setLoadingMessage] = useState(false);

  // Configuration state
  const [configLoaded, setConfigLoaded] = useState(false);
  const [configError, setConfigError] = useState(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [currentModel, setCurrentModel] = useState('');
  const [modelStatus, setModelStatus] = useState('unknown');

  // Initialize configuration system
  useEffect(() => {
    initializeConfiguration();
  }, []);

  // Time updates
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Santa progress calculations
  useEffect(() => {
    if (userLocation && configLoaded) {
      calculateSantaProgress();
    }
  }, [userLocation, currentTime, configLoaded]);

  const initializeConfiguration = async () => {
    try {
      console.log('🎄 Initializing Santa Tracker configuration system...');

      // Load configuration
      await configManager.load();

      // Get current model info
      const current = configManager.getCurrentModel();
      setCurrentModel(current?.displayName || current?.name || 'Unknown');

      // Check Ollama status
      const status = await modelManager.getOllamaStatus();
      setModelStatus(status.status);

      // Set up configuration change listeners
      configManager.addEventListener('config-changed', handleConfigChange);
      configManager.addEventListener('model-changed', handleModelChange);

      setConfigLoaded(true);
      console.log('✅ Configuration system initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize configuration:', error);
      setConfigError(error.message);
      setConfigLoaded(false);

      // Still allow the app to work with fallback values
      setCurrentModel('llama3.2 (fallback)');
      setModelStatus('unknown');
    }
  };

  const handleConfigChange = (data) => {
    console.log('Configuration changed:', data.path);

    // Reload Santa progress if relevant settings changed
    if (data.path.startsWith('prompts') || data.path.startsWith('aiProvider')) {
      calculateSantaProgress();
    }
  };

  const handleModelChange = (data) => {
    console.log('Model changed:', data.model);
    setCurrentModel(data.model);

    // Clear current message so it will be regenerated with new model
    setSantaMessage('');
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          setLocationPermission('granted');
        },
        (error) => {
          console.error('Location error:', error);
          setLocationPermission('denied');
        }
      );
    }
  };

  const calculateSantaProgress = () => {
    const now = new Date();
    const christmasEve = new Date(now.getFullYear(), 11, 24, 18, 0, 0);
    const christmasDay = new Date(now.getFullYear(), 11, 25, 6, 0, 0);

    const totalDeliveryHours = 24;
    const hoursIntoDelivery = (now - christmasEve) / (1000 * 60 * 60);

    let santaLon, santaLat;
    let status;
    let distance;
    let timeUntil;
    let giftsDelivered;

    if (now < christmasEve) {
      santaLon = -180;
      santaLat = 90;
      status = "Preparing at the North Pole";
      timeUntil = Math.floor((christmasEve - now) / (1000 * 60 * 60));
      giftsDelivered = 0;
    } else if (now >= christmasEve && now < christmasDay) {
      const progress = hoursIntoDelivery / totalDeliveryHours;
      santaLon = 180 - (progress * 360);
      santaLat = 45 + Math.sin(progress * Math.PI * 4) * 20;
      status = "Out for delivery!";
      giftsDelivered = Math.floor(progress * 2000000000);

      if (userLocation) {
        const userLon = userLocation.lon;
        if (santaLon < userLon) {
          status = "Santa has visited your area!";
        } else {
          const lonDiff = santaLon - userLon;
          const hoursAway = (lonDiff / 360) * totalDeliveryHours;
          timeUntil = Math.max(0, Math.floor(hoursAway));
          status = `Santa is ${timeUntil} hour${timeUntil !== 1 ? 's' : ''} away!`;
        }
      }
    } else {
      santaLon = -180;
      santaLat = 90;
      status = "Back at the North Pole";
      giftsDelivered = 2000000000;
    }

    if (userLocation && now >= christmasEve && now < christmasDay) {
      const R = 6371;
      const dLat = (santaLat - userLocation.lat) * Math.PI / 180;
      const dLon = (santaLon - userLocation.lon) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(santaLat * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      distance = Math.floor(R * c);
    }

    setSantaStats({
      status,
      distance,
      timeUntil,
      giftsDelivered,
      santaLon,
      santaLat
    });
  };

  const getSantaMessage = async () => {
    if (loadingMessage) return;

    setLoadingMessage(true);
    setSantaMessage('');

    try {
      let prompt = '';
      let aiConfig = {};

      if (configLoaded) {
        // Use new configuration system
        console.log('🎄 Using enhanced configuration system for Santa message');

        // Generate context-aware prompt using PromptManager
        prompt = promptManager.generateSantaMessage(santaStats, userLocation);

        // Get current model configuration
        const modelConfig = configManager.getCurrentModel();
        aiConfig = {
          model: configManager.get('aiProvider.defaultModel'),
          options: modelConfig?.parameters || {
            temperature: 0.8,
            num_predict: 150
          }
        };

      } else {
        // Fallback to old hardcoded approach
        console.log('⚠️ Using fallback configuration for Santa message');

        const now = new Date();
        const christmasEve = new Date(now.getFullYear(), 11, 24, 18, 0, 0);
        const christmasDay = new Date(now.getFullYear(), 11, 25, 6, 0, 0);

        let context = '';
        if (now < christmasEve) {
          context = 'Santa is at the North Pole preparing for Christmas Eve. The elves are busy wrapping presents.';
        } else if (now >= christmasEve && now < christmasDay) {
          context = `Santa is currently delivering presents around the world! ${
            santaStats?.distance
              ? `He is about ${santaStats.distance.toLocaleString()} km away from the user's location.`
              : 'He is making his way across the globe.'
          } ${santaStats?.giftsDelivered ? `He has delivered ${santaStats.giftsDelivered.toLocaleString()} gifts so far!` : ''}`;
        } else {
          context = 'Santa has finished his Christmas deliveries and is resting at the North Pole with the reindeer.';
        }

        prompt = `You are Santa Claus! Write a cheerful, warm message (2-3 sentences max) to someone tracking your journey. ${context} Be jolly, mention the reindeer if relevant, and keep it magical and brief. Use emojis sparingly (1-2 max). Don't use quotation marks.`;

        aiConfig = {
          model: "llama3.2",
          options: {
            temperature: 0.8,
            num_predict: 150
          }
        };
      }

      // Get Ollama URL
      const ollamaUrl = configLoaded
        ? configManager.get('aiProvider.url')
        : "http://localhost:11434";

      // Make API request
      const response = await fetch(`${ollamaUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: aiConfig.model,
          prompt: prompt,
          stream: false,
          options: aiConfig.options
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const message = data.response || '';
      setSantaMessage(message.trim());

      console.log('✅ Santa message generated successfully');

    } catch (error) {
      console.error('❌ Error getting Santa message:', error);

      // Enhanced error messages based on configuration system
      let errorMessage = 'Ho ho ho! My magic connection seems to be a bit frosty right now. ';

      if (!configLoaded) {
        errorMessage += 'There seems to be a configuration issue. ';
      }

      if (modelStatus === 'offline') {
        errorMessage += 'Make sure Ollama is running (ollama serve) ';
      }

      errorMessage += `and you have ${currentModel.toLowerCase()} installed! 🎅`;

      setSantaMessage(errorMessage);
    } finally {
      setLoadingMessage(false);
    }
  };

  // Configuration status indicator
  const ConfigStatus = () => {
    if (!configLoaded) {
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
          <div className="flex">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
            <div>
              <p className="text-sm text-yellow-700 font-medium">Configuration Issue</p>
              <p className="text-xs text-yellow-600">
                {configError || 'Using fallback configuration'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-green-50 border-l-4 border-green-400 p-3 mb-4">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          <p className="text-sm text-green-700">
            <span className="font-medium">Configuration loaded:</span> {currentModel} | {modelStatus}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Configuration Status */}
        <ConfigStatus />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-6xl font-bold text-white drop-shadow-lg mr-4">
              🎅 Santa Tracker
            </h1>
            <button
              onClick={() => setShowConfigPanel(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all transform hover:scale-105"
              title="Open Configuration"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
          <p className="text-blue-200 text-xl">Track Santa from YOUR location!</p>
          {configLoaded && (
            <p className="text-blue-300 text-sm mt-2">
              Powered by {currentModel} • Configuration system active
            </p>
          )}
        </div>

        {/* Santa's Sleigh Illustration */}
        <div className="bg-gradient-to-b from-blue-800 to-blue-900 rounded-3xl p-8 mb-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Stars */}
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: Math.random() * 3 + 1 + 'px',
                  height: Math.random() * 3 + 1 + 'px',
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  opacity: Math.random() * 0.7 + 0.3,
                  animation: `twinkle ${Math.random() * 3 + 2}s infinite`
                }}
              />
            ))}
          </div>

          {/* Moon */}
          <div className="absolute top-8 right-8 w-24 h-24 bg-yellow-100 rounded-full shadow-lg opacity-80" />

          {/* Santa and Sleigh */}
          <div className="relative z-10 text-center py-12">
            <div className="text-9xl mb-4 animate-bounce">
              🎅
            </div>
            <div className="text-6xl -mt-8 mb-4">
              🦌🦌🦌
            </div>
            <div className="text-5xl -mt-6">
              🛷
            </div>
          </div>
        </div>

        {/* Location Permission */}
        {locationPermission === 'prompt' && (
          <div className="bg-white rounded-2xl p-8 mb-6 shadow-xl text-center">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-red-600" />
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              See Santa's Distance from You!
            </h2>
            <p className="text-gray-600 mb-6">
              Share your location to see exactly how far Santa is from your home
            </p>
            <button
              onClick={requestLocation}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              📍 Share My Location
            </button>
          </div>
        )}

        {locationPermission === 'denied' && (
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-6 mb-6">
            <p className="text-yellow-800 text-center">
              Location access denied. You can still track Santa globally!
            </p>
          </div>
        )}

        {/* Santa Stats */}
        {santaStats && (
          <div className="bg-white rounded-2xl p-8 shadow-xl mb-6">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
                <div className="flex items-center mb-2">
                  <Clock className="w-6 h-6 mr-2" />
                  <h3 className="text-lg font-semibold">Status</h3>
                </div>
                <p className="text-3xl font-bold">{santaStats.status}</p>
              </div>

              {santaStats.distance !== undefined && (
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <div className="flex items-center mb-2">
                    <MapPin className="w-6 h-6 mr-2" />
                    <h3 className="text-lg font-semibold">Distance</h3>
                  </div>
                  <p className="text-3xl font-bold">
                    {santaStats.distance.toLocaleString()} km
                  </p>
                  <p className="text-sm opacity-90">from your location</p>
                </div>
              )}

              {santaStats.giftsDelivered > 0 && (
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <div className="flex items-center mb-2">
                    <Gift className="w-6 h-6 mr-2" />
                    <h3 className="text-lg font-semibold">Gifts Delivered</h3>
                  </div>
                  <p className="text-3xl font-bold">
                    {santaStats.giftsDelivered.toLocaleString()}
                  </p>
                </div>
              )}

              {santaStats.timeUntil !== undefined && santaStats.timeUntil > 0 && (
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center mb-2">
                    <Clock className="w-6 h-6 mr-2" />
                    <h3 className="text-lg font-semibold">Time Until Arrival</h3>
                  </div>
                  <p className="text-3xl font-bold">
                    {santaStats.timeUntil} hour{santaStats.timeUntil !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>

            {userLocation && (
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-gray-700">
                  📍 Your location: {userLocation.lat.toFixed(2)}°, {userLocation.lon.toFixed(2)}°
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Santa is tracking your area! Make sure you're on the nice list! 🎁
                </p>
              </div>
            )}
          </div>
        )}

        {/* Santa's Personal Message */}
        {santaStats && (
          <div className="bg-gradient-to-br from-red-50 to-green-50 rounded-2xl p-8 shadow-xl mb-6 border-2 border-red-200">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-red-700 mb-2">
                🎅 Message from Santa (via Local AI)
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                Powered by {currentModel} running locally on your machine
              </p>
              {configLoaded && (
                <p className="text-xs text-green-600 mb-3">
                  Enhanced configuration system active • Runtime model switching available
                </p>
              )}
              <button
                onClick={getSantaMessage}
                disabled={loadingMessage}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMessage ? '🎄 Santa is writing...' : '✨ Get a message from Santa'}
              </button>
            </div>

            {santaMessage && (
              <div className="bg-white rounded-xl p-6 shadow-inner mt-4 border-2 border-green-200">
                <p className="text-gray-800 text-lg leading-relaxed italic">
                  "{santaMessage}"
                </p>
                <p className="text-right text-red-600 font-bold mt-3">
                  - Santa Claus 🎅
                </p>
              </div>
            )}

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-600">
                <strong>Setup:</strong> Make sure Ollama is running with: <code className="bg-gray-100 px-2 py-1 rounded">ollama serve</code>
                <br />
                {configLoaded ? (
                  <>Model: {currentModel} (switchable via ⚙️ settings)</>
                ) : (
                  <>Install llama3.2: <code className="bg-gray-100 px-2 py-1 rounded">ollama pull llama3.2</code></>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-blue-200">
          <p className="text-sm">
            🎄 Current Time: {currentTime.toLocaleTimeString()} 🎄
          </p>
          <p className="text-xs mt-2 opacity-75">
            Santa starts his journey on Christmas Eve at 6 PM and travels westward around the world!
          </p>
          {configLoaded && (
            <p className="text-xs mt-1 text-green-300">
              Enhanced with dynamic configuration • Click ⚙️ to customize models and prompts
            </p>
          )}
        </div>
      </div>

      {/* Configuration Panel */}
      {showConfigPanel && (
        <ConfigPanel
          onClose={() => setShowConfigPanel(false)}
          onConfigChange={(change) => {
            console.log('Config panel change:', change);
            // The change will be automatically handled by our event listeners
          }}
        />
      )}

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}