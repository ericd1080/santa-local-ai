/**
 * WeatherManager - Weather tracking along Santa's route
 * Provides realistic weather conditions for Santa's global journey
 */

class WeatherManager {
    constructor() {
        this.currentWeather = null;
        this.listeners = [];
        this.weatherHistory = [];
        this.maxHistoryLength = 10;

        // Weather conditions for different regions and times
        this.weatherPatterns = {
            arctic: ['clear', 'snow', 'blizzard', 'aurora'],
            temperate: ['clear', 'cloudy', 'rain', 'snow', 'fog'],
            tropical: ['clear', 'cloudy', 'rain', 'storm'],
            desert: ['clear', 'sandstorm', 'hot'],
            mountain: ['clear', 'snow', 'fog', 'windy']
        };

        this.weatherDescriptions = this.getLocalizedWeatherDescriptions();

        this.regionInfo = {
            'North Pole': { type: 'arctic', temperature: -30, timezone: 'UTC' },
            'Greenland': { type: 'arctic', temperature: -20, timezone: 'UTC-3' },
            'Iceland': { type: 'arctic', temperature: -5, timezone: 'UTC' },
            'Scandinavia': { type: 'temperate', temperature: -10, timezone: 'UTC+1' },
            'Russia': { type: 'temperate', temperature: -15, timezone: 'UTC+3' },
            'China': { type: 'temperate', temperature: 5, timezone: 'UTC+8' },
            'Japan': { type: 'temperate', temperature: 8, timezone: 'UTC+9' },
            'Australia': { type: 'temperate', temperature: 25, timezone: 'UTC+10' },
            'Pacific Islands': { type: 'tropical', temperature: 28, timezone: 'UTC+12' },
            'New Zealand': { type: 'temperate', temperature: 20, timezone: 'UTC+12' },
            'Antarctica': { type: 'arctic', temperature: -40, timezone: 'UTC+12' },
            'South America': { type: 'tropical', temperature: 30, timezone: 'UTC-3' },
            'Africa': { type: 'desert', temperature: 35, timezone: 'UTC+2' },
            'Europe': { type: 'temperate', temperature: 2, timezone: 'UTC+1' },
            'North America': { type: 'temperate', temperature: -5, timezone: 'UTC-5' },
            'Himalayas': { type: 'mountain', temperature: -25, timezone: 'UTC+5:30' }
        };

        this.updateWeather();
        this.startWeatherUpdates();

        // Listen for language changes to refresh content
        if (window.languageManager) {
            window.languageManager.addEventListener('language-changed', () => {
                this.refreshWeatherDescriptions();
            });
        }
    }

    getCurrentLanguage() {
        return window.languageManager ? window.languageManager.getCurrentLanguage() : 'en';
    }

    getLocalizedWeatherDescriptions() {
        const currentLanguage = this.getCurrentLanguage();

        const translations = {
            en: {
                clear: {
                    icon: '☀️',
                    description: 'Clear skies',
                    visibility: 'excellent',
                    difficulty: 'easy',
                    reindeerMood: 'happy'
                },
                cloudy: {
                    icon: '☁️',
                    description: 'Cloudy conditions',
                    visibility: 'good',
                    difficulty: 'easy',
                    reindeerMood: 'content'
                },
                snow: {
                    icon: '❄️',
                    description: 'Light snow',
                    visibility: 'good',
                    difficulty: 'moderate',
                    reindeerMood: 'excited'
                },
                blizzard: {
                    icon: '🌨️',
                    description: 'Heavy blizzard',
                    visibility: 'poor',
                    difficulty: 'challenging',
                    reindeerMood: 'determined'
                },
                rain: {
                    icon: '🌧️',
                    description: 'Steady rain',
                    visibility: 'moderate',
                    difficulty: 'moderate',
                    reindeerMood: 'focused'
                },
                storm: {
                    icon: '⛈️',
                    description: 'Thunderstorm',
                    visibility: 'poor',
                    difficulty: 'challenging',
                    reindeerMood: 'brave'
                },
                fog: {
                    icon: '🌫️',
                    description: 'Dense fog',
                    visibility: 'poor',
                    difficulty: 'challenging',
                    reindeerMood: 'confident'
                },
                aurora: {
                    icon: '🌌',
                    description: 'Northern Lights',
                    visibility: 'magical',
                    difficulty: 'easy',
                    reindeerMood: 'amazed'
                },
                sandstorm: {
                    icon: '🌪️',
                    description: 'Sandstorm',
                    visibility: 'poor',
                    difficulty: 'very challenging',
                    reindeerMood: 'determined'
                },
                hot: {
                    icon: '🔥',
                    description: 'Extreme heat',
                    visibility: 'hazy',
                    difficulty: 'moderate',
                    reindeerMood: 'tired'
                },
                windy: {
                    icon: '💨',
                    description: 'Strong winds',
                    visibility: 'good',
                    difficulty: 'moderate',
                    reindeerMood: 'energetic'
                }
            },
            ko: {
                clear: {
                    icon: '☀️',
                    description: '맑은 하늘',
                    visibility: '매우 좋음',
                    difficulty: '쉬움',
                    reindeerMood: '행복함'
                },
                cloudy: {
                    icon: '☁️',
                    description: '구름 낀 날씨',
                    visibility: '좋음',
                    difficulty: '쉬움',
                    reindeerMood: '만족함'
                },
                snow: {
                    icon: '❄️',
                    description: '가벼운 눈',
                    visibility: '좋음',
                    difficulty: '보통',
                    reindeerMood: '흥분함'
                },
                blizzard: {
                    icon: '🌨️',
                    description: '심한 눈보라',
                    visibility: '나쁨',
                    difficulty: '어려움',
                    reindeerMood: '단호함'
                },
                rain: {
                    icon: '🌧️',
                    description: '꾸준한 비',
                    visibility: '보통',
                    difficulty: '보통',
                    reindeerMood: '집중함'
                },
                storm: {
                    icon: '⛈️',
                    description: '뇌우',
                    visibility: '나쁨',
                    difficulty: '어려움',
                    reindeerMood: '용감함'
                },
                fog: {
                    icon: '🌫️',
                    description: '짙은 안개',
                    visibility: '나쁨',
                    difficulty: '어려움',
                    reindeerMood: '자신감'
                },
                aurora: {
                    icon: '🌌',
                    description: '오로라',
                    visibility: '마법적',
                    difficulty: '쉬움',
                    reindeerMood: '놀라움'
                },
                sandstorm: {
                    icon: '🌪️',
                    description: '모래 폭풍',
                    visibility: '나쁨',
                    difficulty: '매우 어려움',
                    reindeerMood: '단호함'
                },
                hot: {
                    icon: '🔥',
                    description: '극한 더위',
                    visibility: '흐림',
                    difficulty: '보통',
                    reindeerMood: '지침'
                },
                windy: {
                    icon: '💨',
                    description: '강한 바람',
                    visibility: '좋음',
                    difficulty: '보통',
                    reindeerMood: '활기참'
                }
            }
        };

        return translations[currentLanguage] || translations['en'];
    }

    refreshWeatherDescriptions() {
        this.weatherDescriptions = this.getLocalizedWeatherDescriptions();
        // Update current weather with new descriptions if exists
        if (this.currentWeather) {
            this.updateWeather();
        }
        this.notifyListeners('weather-updated', this.currentWeather);
        console.log('✅ WeatherManager: Refreshed weather descriptions for language change');
    }

    getLocalizedRegionName(regionKey) {
        const currentLanguage = this.getCurrentLanguage();

        const regionTranslations = {
            en: {
                'North Pole': 'North Pole',
                'Arctic Circle': 'Arctic Circle',
                'Greenland': 'Greenland',
                'Iceland': 'Iceland',
                'Scandinavia': 'Scandinavia',
                'Russia': 'Russia',
                'China': 'China',
                'Japan': 'Japan',
                'Australia': 'Australia',
                'Pacific Islands': 'Pacific Islands',
                'New Zealand': 'New Zealand',
                'Antarctica': 'Antarctica',
                'South America': 'South America',
                'Africa': 'Africa',
                'Europe': 'Europe',
                'North America': 'North America',
                'Himalayas': 'Himalayas',
                'Unknown Region': 'Unknown Region'
            },
            ko: {
                'North Pole': '북극',
                'Arctic Circle': '북극권',
                'Greenland': '그린란드',
                'Iceland': '아이슬란드',
                'Scandinavia': '스칸디나비아',
                'Russia': '러시아',
                'China': '중국',
                'Japan': '일본',
                'Australia': '호주',
                'Pacific Islands': '태평양 섬들',
                'New Zealand': '뉴질랜드',
                'Antarctica': '남극대륙',
                'South America': '남미',
                'Africa': '아프리카',
                'Europe': '유럽',
                'North America': '북미',
                'Himalayas': '히말라야',
                'Unknown Region': '알 수 없는 지역'
            }
        };

        const translations = regionTranslations[currentLanguage] || regionTranslations['en'];
        return translations[regionKey] || regionKey;
    }

    startWeatherUpdates() {
        // Update weather every 45 seconds during delivery
        this.weatherInterval = setInterval(() => {
            this.updateWeather();
        }, 45000);
    }

    updateWeather() {
        const santaLocation = this.calculateSantaLocation();
        const region = this.getNearestRegion(santaLocation);
        const weather = this.generateWeatherForRegion(region);

        // Add some randomness and seasonal effects
        weather.temperature = this.adjustTemperatureForSeason(weather.temperature, region);
        weather.windSpeed = Math.floor(Math.random() * 40) + 5; // 5-45 km/h
        weather.humidity = Math.floor(Math.random() * 50) + 30; // 30-80%

        // Special Christmas Eve weather events
        if (this.isChristmasEve()) {
            weather = this.addChristmasEveEffects(weather, region);
        }

        this.currentWeather = {
            ...weather,
            location: santaLocation,
            region: region,
            timestamp: new Date().toISOString(),
            localTime: this.getLocalTime(region)
        };

        // Add to history
        this.weatherHistory.unshift({ ...this.currentWeather });
        if (this.weatherHistory.length > this.maxHistoryLength) {
            this.weatherHistory.pop();
        }

        this.notifyListeners('weather-updated', this.currentWeather);
    }

    calculateSantaLocation() {
        const now = new Date();
        const christmasEve = new Date(now.getFullYear(), 11, 24, 18, 0, 0);
        const christmasDay = new Date(now.getFullYear(), 11, 25, 6, 0, 0);

        if (now < christmasEve) {
            return { lat: 90, lon: 0, area: this.getLocalizedRegionName('North Pole') };
        } else if (now >= christmasEve && now < christmasDay) {
            // Santa is traveling westward around the world
            const totalHours = 12; // 12 hour delivery window
            const hoursIntoDelivery = (now - christmasEve) / (1000 * 60 * 60);
            const progress = Math.min(1, hoursIntoDelivery / totalHours);

            // Calculate longitude (starts at International Date Line, moves west)
            const lon = 180 - (progress * 360);
            const lat = 45 + Math.sin(progress * Math.PI * 4) * 25; // Varies between 20°N and 70°N

            const area = this.getAreaFromCoordinates(lat, lon);
            return { lat, lon, area };
        } else {
            return { lat: 90, lon: 0, area: this.getLocalizedRegionName('North Pole') };
        }
    }

    getAreaFromCoordinates(lat, lon) {
        // Rough area determination based on coordinates
        let regionKey = 'Unknown Region';

        if (lat > 70) regionKey = 'Arctic Circle';
        else if (lon > 100 && lon < 150 && lat > 20) regionKey = 'China';
        else if (lon > 130 && lon < 150 && lat > 25 && lat < 50) regionKey = 'Japan';
        else if (lon > 110 && lon < 180 && lat < 0) regionKey = 'Australia';
        else if (lon > -180 && lon < -120 && lat < 0) regionKey = 'Pacific Islands';
        else if (lon > 170 || lon < -165) regionKey = 'New Zealand';
        else if (lon > -80 && lon < -30 && lat < 0) regionKey = 'South America';
        else if (lon > -20 && lon < 50 && lat > 0 && lat < 30) regionKey = 'Africa';
        else if (lon > -10 && lon < 40 && lat > 35) regionKey = 'Europe';
        else if (lon > -130 && lon < -60 && lat > 25) regionKey = 'North America';
        else if (lon > 70 && lon < 100 && lat > 25) regionKey = 'Himalayas';
        else if (lat > 60) regionKey = 'Scandinavia';

        return this.getLocalizedRegionName(regionKey);
    }

    getNearestRegion(location) {
        const area = location.area;
        return this.regionInfo[area] || this.regionInfo['North Pole'];
    }

    generateWeatherForRegion(region) {
        const possibleWeather = this.weatherPatterns[region.type];
        const weatherType = this.getWeightedRandomWeather(possibleWeather, region);
        const weatherInfo = this.weatherDescriptions[weatherType];

        return {
            type: weatherType,
            ...weatherInfo,
            temperature: region.temperature + (Math.random() * 10 - 5), // ±5°C variation
            pressure: 1013 + (Math.random() * 40 - 20), // 993-1033 hPa
            uvIndex: weatherType === 'clear' ? Math.floor(Math.random() * 8) : 0
        };
    }

    getWeightedRandomWeather(weatherTypes, region) {
        // Weight certain weather types based on conditions
        const weights = {};
        weatherTypes.forEach(type => weights[type] = 1);

        // Increase probability of snow near Christmas
        if (this.isNearChristmas() && weatherTypes.includes('snow')) {
            weights.snow = 2;
        }

        // Special conditions
        if (region.temperature < -10 && weatherTypes.includes('blizzard')) {
            weights.blizzard = 1.5;
        }

        if (region.type === 'arctic' && weatherTypes.includes('aurora')) {
            weights.aurora = this.isNightTime(region) ? 3 : 0.5;
        }

        // Select based on weights
        const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
        let random = Math.random() * totalWeight;

        for (const [type, weight] of Object.entries(weights)) {
            random -= weight;
            if (random <= 0) return type;
        }

        return weatherTypes[0]; // Fallback
    }

    adjustTemperatureForSeason(baseTemp, region) {
        const now = new Date();
        const isWinter = now.getMonth() === 11; // December

        if (isWinter && region.type !== 'tropical') {
            return baseTemp - 5; // Colder in winter
        }

        return baseTemp;
    }

    addChristmasEveEffects(weather, region) {
        // Magical Christmas Eve weather enhancements
        if (Math.random() < 0.3) { // 30% chance
            if (region.type === 'arctic' && weather.type === 'clear') {
                weather.type = 'aurora';
                weather.icon = '🌌';
                weather.description = 'Magical Northern Lights';
                weather.visibility = 'enchanted';
            } else if (weather.type === 'cloudy') {
                weather.type = 'snow';
                weather.icon = '❄️';
                weather.description = 'Christmas Eve snow';
                weather.difficulty = 'easy'; // Magical snow is easier
            }
        }

        // Add Christmas magic indicator
        weather.christmasMagic = Math.random() > 0.5;

        return weather;
    }

    isChristmasEve() {
        const now = new Date();
        const christmasEve = new Date(now.getFullYear(), 11, 24);
        const christmasDay = new Date(now.getFullYear(), 11, 25);
        return now >= christmasEve && now < christmasDay;
    }

    isNearChristmas() {
        const now = new Date();
        const christmas = new Date(now.getFullYear(), 11, 25);
        const daysDiff = (christmas - now) / (1000 * 60 * 60 * 24);
        return Math.abs(daysDiff) <= 7; // Within a week of Christmas
    }

    isNightTime(region) {
        const hour = new Date().getHours();
        // Rough night time check (simplified)
        return hour < 6 || hour > 18;
    }

    getLocalTime(region) {
        const now = new Date();
        // Simplified timezone calculation
        const utcOffset = this.parseTimezone(region.timezone);
        const localTime = new Date(now.getTime() + (utcOffset * 60 * 60 * 1000));
        return localTime.toLocaleTimeString();
    }

    parseTimezone(timezone) {
        if (timezone === 'UTC') return 0;
        const match = timezone.match(/UTC([+-])(\d+)(?::(\d+))?/);
        if (match) {
            const sign = match[1] === '+' ? 1 : -1;
            const hours = parseInt(match[2]);
            const minutes = match[3] ? parseInt(match[3]) : 0;
            return sign * (hours + minutes / 60);
        }
        return 0;
    }

    getCurrentWeather() {
        return this.currentWeather;
    }

    getWeatherHistory() {
        return [...this.weatherHistory];
    }

    getWeatherForecast() {
        // Generate a simple 3-location forecast ahead of Santa
        const forecast = [];
        const currentLon = this.currentWeather?.location?.lon || 180;

        for (let i = 1; i <= 3; i++) {
            const futureLon = currentLon - (i * 30); // 30° longitude steps
            const futureLat = 45 + Math.sin((180 - futureLon) * Math.PI / 180 * 4) * 25;
            const futureArea = this.getAreaFromCoordinates(futureLat, futureLon);
            const futureRegion = this.regionInfo[futureArea] || this.regionInfo['North Pole'];

            forecast.push({
                location: { lat: futureLat, lon: futureLon, area: futureArea },
                weather: this.generateWeatherForRegion(futureRegion),
                hoursAhead: i
            });
        }

        return forecast;
    }

    getSantaWeatherReport() {
        if (!this.currentWeather) return "Santa's weather information is being prepared...";

        const weather = this.currentWeather;
        const temp = Math.round(weather.temperature);

        let report = `Santa is currently flying through ${weather.region.type} conditions near ${weather.location.area}. `;
        report += `The weather is ${weather.description.toLowerCase()} ${weather.icon} `;
        report += `with ${weather.visibility} visibility at ${temp}°C. `;

        if (weather.difficulty === 'challenging' || weather.difficulty === 'very challenging') {
            report += "The reindeer are showing their excellent training in these conditions! ";
        } else if (weather.difficulty === 'easy') {
            report += "Perfect flying weather for the reindeer team! ";
        }

        if (weather.christmasMagic) {
            report += "✨ Christmas magic is making the journey extra special tonight!";
        }

        return report;
    }

    getReindeerWeatherAdvice() {
        if (!this.currentWeather) return "";

        const weather = this.currentWeather;
        const advice = {
            'clear': "Perfect conditions for maximum speed!",
            'cloudy': "Good flying weather, maintaining steady pace.",
            'snow': "The reindeer love snow - they're in their element!",
            'blizzard': "Rudolph's nose is extra bright to guide through the storm!",
            'rain': "The team is staying focused despite the wet conditions.",
            'storm': "Thunder doesn't scare these brave reindeer!",
            'fog': "Rudolph is leading confidently through the mist.",
            'aurora': "The Northern Lights are inspiring the whole team!",
            'sandstorm': "Even desert storms can't slow down Santa's team!",
            'hot': "The reindeer are taking it easier in this heat.",
            'windy': "Strong winds are actually helping with speed!"
        };

        return advice[weather.type] || "The reindeer are handling all conditions like pros!";
    }

    addEventListener(event, callback) {
        this.listeners.push({ event, callback });
    }

    removeEventListener(event, callback) {
        this.listeners = this.listeners.filter(
            listener => !(listener.event === event && listener.callback === callback)
        );
    }

    notifyListeners(event, data) {
        this.listeners
            .filter(listener => listener.event === event)
            .forEach(listener => {
                try {
                    listener.callback(data);
                } catch (error) {
                    console.error('Error in weather manager listener:', error);
                }
            });
    }

    destroy() {
        if (this.weatherInterval) {
            clearInterval(this.weatherInterval);
        }
    }
}

// Create and export singleton instance
const weatherManager = new WeatherManager();

// Make available globally
window.weatherManager = weatherManager;