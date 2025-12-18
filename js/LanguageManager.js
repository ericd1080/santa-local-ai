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
            'stats.status': 'Status',
            'stats.distance': 'Distance from Santa',
            'stats.fromYourLocation': 'from your location',
            'stats.giftsDelivered': 'Gifts Delivered',
            'stats.timeUntilArrival': 'Time Until Arrival',
            'stats.hours': 'hour',
            'stats.hoursPlural': 'hours',

            // Santa Status Messages
            'status.preparing': 'Preparing at the North Pole',
            'status.delivering': 'Out for delivery!',
            'status.visited': 'Santa has visited your area!',
            'status.finished': 'Back at the North Pole',
            'status.hoursAway': 'Santa is {hours} {hoursText} away!',

            // Location Messages
            'location.requesting': 'Requesting your location...',
            'location.found': 'Your location: {lat}°, {lon}°',
            'location.yourLocation': 'Your location',
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
            'config.title': 'Configuration',
            'config.currentModel': 'Current Model',
            'config.availableModels': 'Available Models',
            'config.switchModel': 'Switch Model:',
            'config.close': 'Close',
            'config.status': 'Configuration Status',
            'config.loading': 'Loading configuration...',
            'config.error': 'Configuration system unavailable',
            'config.active': 'Enhanced configuration system active',
            'config.enhancedServerNote': '💡 For full configuration features, use the enhanced server (enhanced-server.py)',
            'config.modelDescription': 'Model description',
            'config.settingsNotAvailable': 'Settings not available in simple mode',
            'config.santaMagic': 'Santa\'s Magic:',
            'config.readyOperational': 'Ready & Operational',
            'config.fixed': 'FIXED!',

            // Model Descriptions
            'model.llama3.2.description': 'Fast and efficient for Santa messages',
            'model.mistral7b.description': 'Creative storytelling model',
            'model.phi3.description': 'Compact and fast model',
            'model.gemma7b.description': 'Google\'s efficient model',

            // Weather Panel
            'weather.title': 'Santa\'s Weather Report',
            'weather.panelTitle': '🌤️ Santa\'s Weather Report',
            'weather.currentConditions': '🎅 Current Conditions',
            'weather.viewDetails': 'View Details →',
            'weather.location': 'Location:',
            'weather.condition': 'Condition:',
            'weather.temperature': 'Temperature:',
            'weather.flightStatus': 'Flight Difficulty:',
            'weather.visibility': 'Visibility:',
            'weather.windSpeed': 'Wind Speed:',
            'weather.reindeerMood': 'Reindeer Mood:',
            'weather.localTime': 'Local Time:',
            'weather.forecast': '🛷 Forecast Along Santa\'s Route',
            'weather.forecastWeather': 'Weather:',
            'weather.forecastTemp': 'Temp:',
            'weather.forecastDifficulty': 'Difficulty:',
            'weather.forecastIn': 'In {hours} hour{plural}',
            'weather.recentConditions': '📍 Recent Weather Conditions',
            'weather.updatesMessage': 'Weather updates automatically as Santa travels around the world!',
            'weather.christmasMagicActive': 'Christmas Magic Active',

            // Safety Panel
            'safety.title': 'Santa\'s Safety Tip',
            'safety.panelTitle': '🎅 Santa\'s Chimney & Safety Tips',
            'safety.viewAllTips': 'View All Tips →',
            'safety.tabSafetyTips': '📋 Safety Tips',
            'safety.tabCategories': '📂 Categories',
            'safety.categoriesTitle': '🏠 Safety Categories',
            'safety.allTips': 'All Tips ({count})',
            'safety.featuredTip': '⭐ Featured Safety Tip',
            'safety.allTipsHeader': '📋 All Safety Tips',
            'safety.severity.critical': 'critical',
            'safety.severity.important': 'important',
            'safety.severity.helpful': 'helpful',
            'safety.tipRotationMessage': 'Safety tips rotate every 2 minutes • Follow Santa\'s advice for a magical Christmas!',
            'safety.updateMessage': '🎄 Safety tips update periodically to help keep your Christmas magical and safe! 🛡️',

            // Santa Message Section
            'santaMessage.title': 'Message from Santa',
            'santaMessage.subtitle': 'Santa\'s magical AI assistant is ready to send you a personalized message!',

            // Footer
            'footer.currentTime': 'Current Time',
            'footer.journeyMessage': 'Santa starts his journey on Christmas Eve at 6 PM and travels westward around the world!',
            'footer.systemsOperational': 'All Christmas magic systems are operational! Click ⚙️ for settings',

            // Time/Date
            'time.christmasEve': 'Christmas Eve',
            'time.christmasDay': 'Christmas Day',
            'time.beforeChristmas': 'Before Christmas',
            'time.afterChristmas': 'After Christmas',

            // Favorites
            'favorites.addToFavorites': 'Add to favorites',
            'favorites.removeFromFavorites': 'Remove from favorites',
            'favorites.title': 'Favorite Messages',
            'favorites.panelTitle': 'Favorite Santa Messages',
            'favorites.noMessages': 'No favorite messages yet!',
            'favorites.instructions': 'Click the ⭐ button next to Santa messages to save your favorites.',
            'favorites.maxMessages': 'Maximum 20 messages stored',
            'favorites.messageCount': '{count} favorite message{plural}',

            // General
            'general.loading': 'Loading...',

            // Reindeer Panel
            'reindeer.panelTitle': 'Santa\'s Reindeer Team',
            'reindeer.teamLeader': 'Team Leader',
            'reindeer.leadingFormation': 'Leading the formation',
            'reindeer.teamMorale': 'Team Morale',
            'reindeer.excellentSpirits': 'Excellent spirits!',
            'reindeer.formation': 'Formation',
            'reindeer.optimalEfficiency': 'Optimal efficiency',
            'reindeer.currentStatus': 'Current Status',
            'reindeer.flightFormation': 'Flight Formation',
            'reindeer.personality': 'PERSONALITY:',
            'reindeer.specialty': 'SPECIALTY:',
            'reindeer.currentTask': 'CURRENT TASK:',
            'reindeer.speed': 'SPEED:',
            'reindeer.updateMessage': 'The reindeer team updates every 30 seconds during Christmas Eve!',
            'reindeer.teamStatusReady': 'The reindeer team is ready for action!',
            'reindeer.teamStatusPreparing': 'The team is preparing for the biggest night of the year!',
            'reindeer.teamStatusDelivering': 'All reindeer are working together to deliver Christmas magic!',
            'reindeer.teamStatusCelebrating': 'The reindeer are celebrating another successful Christmas!',

            // Individual Reindeer Data
            'reindeer.dasher.personality': 'Fast and energetic',
            'reindeer.dasher.specialty': 'Navigation and speed',
            'reindeer.dancer.personality': 'Graceful and elegant',
            'reindeer.dancer.specialty': 'Aerial maneuvers',
            'reindeer.prancer.personality': 'Proud and strong',
            'reindeer.prancer.specialty': 'Heavy lifting',
            'reindeer.vixen.personality': 'Clever and mischievous',
            'reindeer.vixen.specialty': 'Weather navigation',
            'reindeer.comet.personality': 'Swift and bright',
            'reindeer.comet.specialty': 'Night vision',
            'reindeer.cupid.personality': 'Loving and caring',
            'reindeer.cupid.specialty': 'Gift delivery precision',
            'reindeer.donner.personality': 'Powerful and reliable',
            'reindeer.donner.specialty': 'Storm flying',
            'reindeer.blitzen.personality': 'Lightning fast',
            'reindeer.blitzen.specialty': 'Emergency speed',
            'reindeer.rudolph.personality': 'Brave and bright',
            'reindeer.rudolph.specialty': 'Fog navigation with glowing nose',

            // Reindeer Tasks
            'reindeer.task.leadingFormation': 'Leading the formation',
            'reindeer.task.maintainingStability': 'Maintaining flight stability',
            'reindeer.task.pullingSleigh': 'Pulling the sleigh',
            'reindeer.task.readingWindPatterns': 'Reading wind patterns',
            'reindeer.task.spottingChimneys': 'Spotting chimneys',
            'reindeer.task.organizingPresents': 'Organizing presents',
            'reindeer.task.weatherManagement': 'Weather management',
            'reindeer.task.timeManagement': 'Time management',
            'reindeer.task.leadingThroughFog': 'Leading through fog',
            'reindeer.task.checkingFlightRoutes': 'Checking flight routes',
            'reindeer.task.practicingManeuvers': 'Practicing aerial maneuvers',
            'reindeer.task.strengtheningHarnesses': 'Strengthening harnesses',
            'reindeer.task.studyingWeatherPatterns': 'Studying weather patterns',
            'reindeer.task.testingNightVision': 'Testing night vision',
            'reindeer.task.organizingGiftLists': 'Organizing gift lists',
            'reindeer.task.preparingForStorms': 'Preparing for storms',
            'reindeer.task.speedTraining': 'Speed training',
            'reindeer.task.polishingNose': 'Polishing his nose',

            // Speed levels
            'reindeer.speed.moderate': 'moderate',
            'reindeer.speed.fast': 'fast',
            'reindeer.speed.veryFast': 'very fast',
            'reindeer.speed.extremelyFast': 'extremely fast',

            // Tooltips
            'tooltip.disableSound': 'Disable Sound Effects',
            'tooltip.enableSound': 'Enable Sound Effects',
            'tooltip.dropGifts': 'Drop Some Gifts! (Enhanced with special effects)',
            'tooltip.checkNiceList': 'Check Santa\'s Nice List',
            'tooltip.language': 'Language: {language}',
            'tooltip.reindeerStatus': 'Reindeer Team Status',
            'tooltip.weatherReport': 'Santa\'s Weather: {description}',
            'tooltip.safetyTips': 'Safety Tips: {title}',
            'tooltip.openConfig': 'Open Configuration',
            'tooltip.manageNaughtyList': 'Manage Naughty List'
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
            'stats.status': '상태',
            'stats.distance': '산타와의 거리',
            'stats.fromYourLocation': '당신의 위치에서',
            'stats.giftsDelivered': '배달된 선물',
            'stats.timeUntilArrival': '도착까지 남은 시간',
            'stats.hours': '시간',
            'stats.hoursPlural': '시간',

            // Santa Status Messages
            'status.preparing': '북극에서 준비 중',
            'status.delivering': '배달 중입니다!',
            'status.visited': '산타가 당신의 지역을 방문했습니다!',
            'status.finished': '북극으로 돌아왔습니다',
            'status.hoursAway': '산타가 {hours}{hoursText} 후에 도착합니다!',

            // Location Messages
            'location.requesting': '위치를 요청하고 있습니다...',
            'location.found': '당신의 위치: {lat}°, {lon}°',
            'location.yourLocation': '당신의 위치',
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
            'config.title': '설정',
            'config.currentModel': '현재 모델',
            'config.availableModels': '사용 가능한 모델',
            'config.switchModel': '모델 변경:',
            'config.close': '닫기',
            'config.status': '설정 상태',
            'config.loading': '설정을 불러오는 중...',
            'config.error': '설정 시스템을 사용할 수 없습니다',
            'config.active': '향상된 설정 시스템 활성화됨',
            'config.enhancedServerNote': '💡 전체 설정 기능을 사용하려면 향상된 서버(enhanced-server.py)를 사용하세요',
            'config.modelDescription': '모델 설명',
            'config.settingsNotAvailable': '간단 모드에서는 설정을 사용할 수 없습니다',
            'config.santaMagic': '산타의 마법:',
            'config.readyOperational': '준비 완료 & 작동 중',
            'config.fixed': '수정됨!',

            // Model Descriptions
            'model.llama3.2.description': '산타 메시지를 위한 빠르고 효율적인 모델',
            'model.mistral7b.description': '창의적인 스토리텔링 모델',
            'model.phi3.description': '컴팩트하고 빠른 모델',
            'model.gemma7b.description': 'Google의 효율적인 모델',

            // Weather Panel
            'weather.title': '산타의 날씨 보고서',
            'weather.panelTitle': '🌤️ 산타의 날씨 보고서',
            'weather.currentConditions': '🎅 현재 상황',
            'weather.viewDetails': '자세히 보기 →',
            'weather.location': '위치:',
            'weather.condition': '날씨 상태:',
            'weather.temperature': '온도:',
            'weather.flightStatus': '비행 난이도:',
            'weather.visibility': '가시성:',
            'weather.windSpeed': '풍속:',
            'weather.reindeerMood': '순록 기분:',
            'weather.localTime': '현지 시간:',
            'weather.forecast': '🛷 산타 루트를 따른 일기 예보',
            'weather.forecastWeather': '날씨:',
            'weather.forecastTemp': '온도:',
            'weather.forecastDifficulty': '난이도:',
            'weather.forecastIn': '{hours}시간 후',
            'weather.recentConditions': '📍 최근 날씨 상황',
            'weather.updatesMessage': '날씨는 산타가 전 세계를 여행하면서 자동으로 업데이트됩니다!',
            'weather.christmasMagicActive': '크리스마스 마법 활성화',

            // Safety Panel
            'safety.title': '산타의 안전 팁',
            'safety.panelTitle': '🎅 산타의 굴뚝 및 안전 팁',
            'safety.viewAllTips': '모든 팁 보기 →',
            'safety.tabSafetyTips': '📋 안전 팁',
            'safety.tabCategories': '📂 카테고리',
            'safety.categoriesTitle': '🏠 안전 카테고리',
            'safety.allTips': '모든 팁 ({count})',
            'safety.featuredTip': '⭐ 주요 안전 팁',
            'safety.allTipsHeader': '📋 모든 안전 팁',
            'safety.severity.critical': '중요',
            'safety.severity.important': '주의',
            'safety.severity.helpful': '도움',
            'safety.tipRotationMessage': '안전 팁은 2분마다 순환됩니다 • 마법같은 크리스마스를 위해 산타의 조언을 따르세요!',
            'safety.updateMessage': '🎄 안전 팁은 주기적으로 업데이트되어 마법같고 안전한 크리스마스를 유지하도록 도와줍니다! 🛡️',

            // Santa Message Section
            'santaMessage.title': '산타의 메시지',
            'santaMessage.subtitle': '산타의 마법 AI 도우미가 개인 맞춤 메시지를 보낼 준비가 되었습니다!',

            // Footer
            'footer.currentTime': '현재 시간',
            'footer.journeyMessage': '산타는 크리스마스 이브 오후 6시에 여행을 시작하여 서쪽으로 전 세계를 돌아다닙니다!',
            'footer.systemsOperational': '모든 크리스마스 마법 시스템이 작동 중입니다! 설정을 보려면 ⚙️를 클릭하세요',

            // Time/Date
            'time.christmasEve': '크리스마스 이브',
            'time.christmasDay': '크리스마스',
            'time.beforeChristmas': '크리스마스 전',
            'time.afterChristmas': '크리스마스 후',

            // Favorites
            'favorites.addToFavorites': '즐겨찾기에 추가',
            'favorites.removeFromFavorites': '즐겨찾기에서 제거',
            'favorites.title': '즐겨찾는 메시지',
            'favorites.panelTitle': '즐겨찾는 산타 메시지',
            'favorites.noMessages': '즐겨찾는 메시지가 없습니다!',
            'favorites.instructions': '산타 메시지 옆의 ⭐ 버튼을 클릭하여 즐겨찾기에 저장하세요.',
            'favorites.maxMessages': '최대 20개 메시지 저장됨',
            'favorites.messageCount': '{count}개의 즐겨찾는 메시지',

            // General
            'general.loading': '로딩 중...',

            // Reindeer Panel
            'reindeer.panelTitle': '산타의 순록 팀',
            'reindeer.teamLeader': '팀 리더',
            'reindeer.leadingFormation': '대형을 이끄는 중',
            'reindeer.teamMorale': '팀 사기',
            'reindeer.excellentSpirits': '매우 높은 사기!',
            'reindeer.formation': '대형',
            'reindeer.optimalEfficiency': '최적의 효율성',
            'reindeer.currentStatus': '현재 상태',
            'reindeer.flightFormation': '비행 대형',
            'reindeer.personality': '성격:',
            'reindeer.specialty': '특기:',
            'reindeer.currentTask': '현재 임무:',
            'reindeer.speed': '속도:',
            'reindeer.updateMessage': '순록 팀은 크리스마스 이브 동안 30초마다 업데이트됩니다!',
            'reindeer.teamStatusReady': '순록 팀이 행동할 준비가 되었습니다!',
            'reindeer.teamStatusPreparing': '팀이 올해 가장 큰 밤을 위해 준비하고 있습니다!',
            'reindeer.teamStatusDelivering': '모든 순록이 함께 크리스마스 마법을 배달하고 있습니다!',
            'reindeer.teamStatusCelebrating': '순록들이 또 다른 성공적인 크리스마스를 축하하고 있습니다!',

            // Individual Reindeer Data
            'reindeer.dasher.personality': '빠르고 활기찬',
            'reindeer.dasher.specialty': '항해와 속도',
            'reindeer.dancer.personality': '우아하고 엘레간트한',
            'reindeer.dancer.specialty': '공중 기동',
            'reindeer.prancer.personality': '자랑스럽고 강한',
            'reindeer.prancer.specialty': '무거운 것 끌기',
            'reindeer.vixen.personality': '영리하고 장난스러운',
            'reindeer.vixen.specialty': '날씨 항법',
            'reindeer.comet.personality': '빠르고 밝은',
            'reindeer.comet.specialty': '야간 시야',
            'reindeer.cupid.personality': '사랑스럽고 다정한',
            'reindeer.cupid.specialty': '선물 배달 정확성',
            'reindeer.donner.personality': '강력하고 신뢰할 수 있는',
            'reindeer.donner.specialty': '폭풍 비행',
            'reindeer.blitzen.personality': '번개처럼 빠른',
            'reindeer.blitzen.specialty': '응급 속도',
            'reindeer.rudolph.personality': '용감하고 밝은',
            'reindeer.rudolph.specialty': '빛나는 코로 안개 항법',

            // Reindeer Tasks
            'reindeer.task.leadingFormation': '대형 이끌기',
            'reindeer.task.maintainingStability': '비행 안정성 유지',
            'reindeer.task.pullingSleigh': '썰매 끌기',
            'reindeer.task.readingWindPatterns': '바람 패턴 읽기',
            'reindeer.task.spottingChimneys': '굴뚝 찾기',
            'reindeer.task.organizingPresents': '선물 정리하기',
            'reindeer.task.weatherManagement': '날씨 관리',
            'reindeer.task.timeManagement': '시간 관리',
            'reindeer.task.leadingThroughFog': '안개 속 길 안내',
            'reindeer.task.checkingFlightRoutes': '비행 경로 확인',
            'reindeer.task.practicingManeuvers': '공중 기동 연습',
            'reindeer.task.strengtheningHarnesses': '하네스 강화',
            'reindeer.task.studyingWeatherPatterns': '날씨 패턴 연구',
            'reindeer.task.testingNightVision': '야간 시야 테스트',
            'reindeer.task.organizingGiftLists': '선물 목록 정리',
            'reindeer.task.preparingForStorms': '폭풍 준비',
            'reindeer.task.speedTraining': '속도 훈련',
            'reindeer.task.polishingNose': '코 닦기',

            // Speed levels
            'reindeer.speed.moderate': '보통',
            'reindeer.speed.fast': '빠름',
            'reindeer.speed.veryFast': '매우 빠름',
            'reindeer.speed.extremelyFast': '극도로 빠름',

            // Tooltips
            'tooltip.disableSound': '음향 효과 비활성화',
            'tooltip.enableSound': '음향 효과 활성화',
            'tooltip.dropGifts': '선물 떨어뜨리기! (특수 효과 포함)',
            'tooltip.checkNiceList': '산타의 착한 아이 목록 확인',
            'tooltip.language': '언어: {language}',
            'tooltip.reindeerStatus': '순록 팀 상태',
            'tooltip.weatherReport': '산타의 날씨: {description}',
            'tooltip.safetyTips': '안전 팁: {title}',
            'tooltip.openConfig': '설정 열기',
            'tooltip.manageNaughtyList': '말썽꾸러기 목록 관리'
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

// Make available globally
window.languageManager = languageManager;