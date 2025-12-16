/**
 * LanguageManager - Multi-language support for Santa Tracker
 * Handles internationalization, translation, and language switching
 */

class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.listeners = [];
        this.translations = new Map();
        this.fallbackLanguage = 'en';

        this.loadTranslations();
    }

    loadTranslations() {
        // English translations (default)
        this.translations.set('en', {
            // UI Elements
            'app.title': '🎅 Santa Tracker',
            'app.subtitle': 'Track Santa from YOUR location!',
            'app.enhanced': 'Enhanced configuration system active',

            // Navigation/Buttons
            'button.shareLocation': '📍 Share My Location',
            'button.getSantaMessage': '🎅 Get Message from Santa',
            'button.dropGifts': 'Drop Some Gifts!',
            'button.checkNiceList': 'Check Santa\'s Nice List',
            'button.openConfig': 'Open Configuration',
            'button.enableSound': 'Enable Sound Effects',
            'button.disableSound': 'Disable Sound Effects',

            // Santa Stats
            'stats.distance': 'Distance from Santa',
            'stats.giftsDelivered': 'Gifts Delivered',
            'stats.timeUntilArrival': 'Time Until Arrival',
            'stats.hours': 'hour',
            'stats.hoursPlural': 'hours',

            // Santa Status Messages
            'status.preparing': 'Preparing at the North Pole',
            'status.delivering': 'Delivering presents around the world!',
            'status.finished': 'Christmas deliveries complete!',
            'status.hoursAway': 'Santa is {hours} hour{plural} away!',

            // Location Messages
            'location.requesting': 'Requesting your location...',
            'location.found': 'Your location: {lat}°, {lon}°',
            'location.tracking': 'Santa is tracking your area! Make sure you\'re on the nice list! 🎁',
            'location.error': 'Unable to get location',
            'location.denied': 'Location access denied',

            // AI Messages
            'ai.messageTitle': '🎅 Message from Santa (via Local AI)',
            'ai.poweredBy': 'Powered by {model} running locally on your machine',
            'ai.generating': '🎅 Santa is writing you a message...',
            'ai.error': 'Ho ho ho! Santa\'s communication system is having issues, but he\'ll be back soon!',

            // Nice List Checker
            'niceList.title': '🎅 Santa\'s Nice List Checker',
            'niceList.description': 'Want to know if you\'re on Santa\'s Nice List this year? Enter your name and let Santa\'s AI check for you!',
            'niceList.nameLabel': 'Your Name',
            'niceList.namePlaceholder': 'Enter your name...',
            'niceList.checking': '🎅 Santa is checking...',
            'niceList.checkButton': '✨ Check Nice List',
            'niceList.onNiceList': 'On the Nice List!',
            'niceList.onNaughtyList': 'On the Naughty List',
            'niceList.disclaimer': 'Powered by Local AI • Results are for fun only! 🎄',

            // Configuration
            'config.title': '⚙️ Configuration',
            'config.currentModel': 'Current Model:',
            'config.switchModel': 'Switch Model:',
            'config.close': 'Close',
            'config.status': 'Configuration Status',
            'config.loading': 'Loading configuration...',
            'config.error': 'Configuration system unavailable',
            'config.active': 'Enhanced configuration system active',

            // Time/Date
            'time.christmasEve': 'Christmas Eve',
            'time.christmasDay': 'Christmas Day',
            'time.beforeChristmas': 'Before Christmas',
            'time.afterChristmas': 'After Christmas'
        });

        // Korean translations (한국어)
        this.translations.set('ko', {
            // UI Elements
            'app.title': '🎅 산타 추적기',
            'app.subtitle': '당신의 위치에서 산타를 추적하세요!',
            'app.enhanced': '향상된 설정 시스템 활성화됨',

            // Navigation/Buttons
            'button.shareLocation': '📍 내 위치 공유',
            'button.getSantaMessage': '🎅 산타에게서 메시지 받기',
            'button.dropGifts': '선물 떨어뜨리기!',
            'button.checkNiceList': '산타의 착한 아이 목록 확인',
            'button.openConfig': '설정 열기',
            'button.enableSound': '음향 효과 활성화',
            'button.disableSound': '음향 효과 비활성화',

            // Santa Stats
            'stats.distance': '산타와의 거리',
            'stats.giftsDelivered': '배달된 선물',
            'stats.timeUntilArrival': '도착까지 남은 시간',
            'stats.hours': '시간',
            'stats.hoursPlural': '시간',

            // Santa Status Messages
            'status.preparing': '북극에서 준비 중',
            'status.delivering': '전세계에 선물을 배달하고 있습니다!',
            'status.finished': '크리스마스 배달 완료!',
            'status.hoursAway': '산타가 {hours}시간 후에 도착합니다!',

            // Location Messages
            'location.requesting': '위치를 요청하고 있습니다...',
            'location.found': '당신의 위치: {lat}°, {lon}°',
            'location.tracking': '산타가 당신의 지역을 추적하고 있습니다! 착한 아이 목록에 있는지 확인하세요! 🎁',
            'location.error': '위치를 가져올 수 없습니다',
            'location.denied': '위치 접근이 거부되었습니다',

            // AI Messages
            'ai.messageTitle': '🎅 산타의 메시지 (로컬 AI 제공)',
            'ai.poweredBy': '{model}이 당신의 기기에서 로컬로 실행됩니다',
            'ai.generating': '🎅 산타가 당신에게 메시지를 쓰고 있습니다...',
            'ai.error': '호호호! 산타의 통신 시스템에 문제가 있지만, 곧 다시 돌아올 거예요!',

            // Nice List Checker
            'niceList.title': '🎅 산타의 착한 아이 목록 확인기',
            'niceList.description': '올해 산타의 착한 아이 목록에 있는지 알고 싶으신가요? 이름을 입력하고 산타의 AI가 확인해드릴게요!',
            'niceList.nameLabel': '당신의 이름',
            'niceList.namePlaceholder': '이름을 입력하세요...',
            'niceList.checking': '🎅 산타가 확인하고 있습니다...',
            'niceList.checkButton': '✨ 착한 아이 목록 확인',
            'niceList.onNiceList': '착한 아이 목록에 있어요!',
            'niceList.onNaughtyList': '말썽꾸러기 목록에 있어요',
            'niceList.disclaimer': '로컬 AI 제공 • 결과는 재미를 위한 것입니다! 🎄',

            // Configuration
            'config.title': '⚙️ 설정',
            'config.currentModel': '현재 모델:',
            'config.switchModel': '모델 변경:',
            'config.close': '닫기',
            'config.status': '설정 상태',
            'config.loading': '설정을 불러오는 중...',
            'config.error': '설정 시스템을 사용할 수 없습니다',
            'config.active': '향상된 설정 시스템 활성화됨',

            // Time/Date
            'time.christmasEve': '크리스마스 이브',
            'time.christmasDay': '크리스마스',
            'time.beforeChristmas': '크리스마스 전',
            'time.afterChristmas': '크리스마스 후'
        });

        // Set initial language based on browser preference
        this.detectBrowserLanguage();
    }

    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0]; // Get just the language part (e.g., 'ko' from 'ko-KR')

        if (this.translations.has(langCode)) {
            this.currentLanguage = langCode;
        } else {
            this.currentLanguage = this.fallbackLanguage;
        }

        console.log(`🌐 Language detected: ${browserLang}, using: ${this.currentLanguage}`);
    }

    setLanguage(languageCode) {
        if (this.translations.has(languageCode)) {
            const oldLanguage = this.currentLanguage;
            this.currentLanguage = languageCode;

            this.notifyListeners('language-changed', {
                from: oldLanguage,
                to: languageCode
            });

            console.log(`🌐 Language changed to: ${languageCode}`);
            return true;
        }

        console.warn(`⚠️ Language '${languageCode}' not supported`);
        return false;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getSupportedLanguages() {
        return Array.from(this.translations.keys()).map(code => ({
            code: code,
            name: this.getLanguageName(code),
            nativeName: this.getLanguageNativeName(code)
        }));
    }

    getLanguageName(code) {
        const names = {
            'en': 'English',
            'ko': 'Korean'
        };
        return names[code] || code;
    }

    getLanguageNativeName(code) {
        const nativeNames = {
            'en': 'English',
            'ko': '한국어'
        };
        return nativeNames[code] || code;
    }

    translate(key, variables = {}) {
        const translations = this.translations.get(this.currentLanguage) ||
                           this.translations.get(this.fallbackLanguage);

        let translation = translations[key];

        if (!translation) {
            console.warn(`⚠️ Translation missing for key: ${key} (language: ${this.currentLanguage})`);

            // Fallback to English
            const fallbackTranslations = this.translations.get(this.fallbackLanguage);
            translation = fallbackTranslations[key] || key;
        }

        // Replace variables in the translation
        return this.interpolateVariables(translation, variables);
    }

    interpolateVariables(text, variables) {
        return text.replace(/\{(\w+)\}/g, (match, key) => {
            return variables[key] !== undefined ? variables[key] : match;
        });
    }

    // Shorthand method for translation
    t(key, variables = {}) {
        return this.translate(key, variables);
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
                    console.error('Error in language manager listener:', error);
                }
            });
    }

    // Get direction for RTL languages (future extension)
    getTextDirection() {
        const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
        return rtlLanguages.includes(this.currentLanguage) ? 'rtl' : 'ltr';
    }

    // Format numbers according to language locale
    formatNumber(number) {
        const localeMap = {
            'en': 'en-US',
            'ko': 'ko-KR'
        };

        const locale = localeMap[this.currentLanguage] || 'en-US';
        return new Intl.NumberFormat(locale).format(number);
    }

    // Format date/time according to language locale
    formatDateTime(date, options = {}) {
        const localeMap = {
            'en': 'en-US',
            'ko': 'ko-KR'
        };

        const locale = localeMap[this.currentLanguage] || 'en-US';
        return new Intl.DateTimeFormat(locale, options).format(date);
    }

    // Get Santa prompt in the current language
    getSantaPromptPrefix() {
        if (this.currentLanguage === 'ko') {
            return "당신은 산타클로스입니다! 따뜻하고 즐거운 메시지를 한국어로 작성해주세요 (최대 2-3문장). ";
        } else {
            return "You are Santa Claus! Write a cheerful, warm message in English (2-3 sentences max). ";
        }
    }

    // Get Nice List prompt in the current language
    getNiceListPromptPrefix(name) {
        if (this.currentLanguage === 'ko') {
            return `당신은 착한 아이와 말썽꾸러기 목록을 확인하는 산타클로스입니다! "${name}"라는 사람이 올해 착한 아이 목록에 있는지 알고 싶어합니다.

이름만을 기준으로 (창의적이고 재미있게) 다음 중 하나로 판단해주세요:
1. NICE - 착한 아이 목록에 있다는 격려적인 메시지
2. NAUGHTY - 말썽꾸러기 목록에 있다는 부드러운 경고와 더 착해지라는 격려

정확히 이 형식으로 응답해주세요:
STATUS: [NICE 또는 NAUGHTY]
MESSAGE: [산타로서의 개인화된 한국어 메시지 - 1-2문장, 따뜻하고 즐거우며, 이름을 언급]

창의적이고 재미있게, 마법같은 크리스마스 분위기를 유지해주세요!`;
        } else {
            return `You are Santa Claus checking your Nice and Naughty lists! Someone named "${name}" wants to know if they're on the Nice List this year.

Based on the name alone (be creative and playful), determine if they've been:
1. NICE - Give them a cheerful, encouraging message about being on the Nice List
2. NAUGHTY - Give them a gentle, playful warning about being on the Naughty List, but with encouragement to be better

Respond with EXACTLY this format:
STATUS: [NICE or NAUGHTY]
MESSAGE: [Your personalized message as Santa - 1-2 sentences, warm and jolly, mention their name]

Be creative, fun, and maintain the magical Christmas spirit!`;
        }
    }
}

// Create and export singleton instance
const languageManager = new LanguageManager();

export default languageManager;