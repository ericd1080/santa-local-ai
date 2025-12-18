/**
 * ChimneySafetyManager - Safety tips and guidelines from Santa
 * Provides chimney safety information and Christmas preparation tips
 */

class ChimneySafetyManager {
    constructor() {
        this.listeners = [];
        this.safetyTips = [];
        this.currentTipIndex = 0;
        this.tipHistory = [];

        this.loadSafetyTips();
        this.startTipRotation();
    }

    getCurrentLanguage() {
        return window.languageManager ? window.languageManager.getCurrentLanguage() : 'en';
    }

    loadSafetyTips() {
        const baseData = [
            { id: 1, category: 'chimney', icon: '🏠', severity: 'important', season: 'all' },
            { id: 2, category: 'fire', icon: '🔥', severity: 'critical', season: 'christmas' },
            { id: 3, category: 'cookies', icon: '🍪', severity: 'helpful', season: 'christmas' },
            { id: 4, category: 'chimney', icon: '🛡️', severity: 'important', season: 'all' },
            { id: 5, category: 'maintenance', icon: '🔍', severity: 'important', season: 'all' },
            { id: 6, category: 'carbon_monoxide', icon: '⚠️', severity: 'critical', season: 'all' },
            { id: 7, category: 'decorations', icon: '🎄', severity: 'important', season: 'christmas' },
            { id: 8, category: 'preparation', icon: '🧹', severity: 'important', season: 'all' },
            { id: 9, category: 'pets', icon: '🐕', severity: 'helpful', season: 'christmas' },
            { id: 10, category: 'stockings', icon: '🧦', severity: 'important', season: 'christmas' },
            { id: 11, category: 'emergency', icon: '🚨', severity: 'critical', season: 'all' },
            { id: 12, category: 'winter', icon: '🧊', severity: 'important', season: 'winter' }
        ];

        this.safetyTips = baseData.map(baseTip => ({
            ...baseTip,
            ...this.getLocalizedTipContent(baseTip.id)
        }));

        console.log('✅ ChimneySafetyManager: Loaded safety tips');
    }

    getSafetyTipTranslations() {
        return {
            en: {
                1: {
                    title: 'Keep Your Chimney Clear',
                    tip: 'Make sure your chimney is clear of debris and the damper is open. Santa needs a safe passage!',
                    santaQuote: 'Ho ho ho! A clear chimney helps me deliver your presents safely and quickly!'
                },
                2: {
                    title: 'Extinguish All Fires',
                    tip: 'Put out all fires in your fireplace before bedtime on Christmas Eve. Safety first!',
                    santaQuote: 'Please make sure there are no fires burning when I visit. My suit is flame-resistant, but I prefer to be extra careful!'
                },
                3: {
                    title: 'Leave Cookies Safely',
                    tip: 'Place milk and cookies away from the fireplace area to keep them safe and Santa happy!',
                    santaQuote: 'I love cookies, but please keep them away from the fireplace so they stay fresh and safe!'
                },
                4: {
                    title: 'Install a Chimney Screen',
                    tip: 'A chimney screen prevents animals and debris from entering. Don\'t worry, Santa has a special key!',
                    santaQuote: 'Chimney screens are great for safety! I have magical access, so they won\'t stop me from delivering presents.'
                },
                5: {
                    title: 'Annual Chimney Inspection',
                    tip: 'Have your chimney inspected annually by a professional. A safe chimney is a happy chimney!',
                    santaQuote: 'The elves and I always check chimneys before Christmas. An annual inspection keeps everyone safe!'
                },
                6: {
                    title: 'Check Carbon Monoxide Detectors',
                    tip: 'Test your carbon monoxide detectors regularly. Fresh batteries save lives!',
                    santaQuote: 'Safety is my top priority! Make sure your detectors are working - the elves remind me to check mine too.'
                },
                7: {
                    title: 'Secure Christmas Decorations',
                    tip: 'Keep decorations away from the fireplace and chimney area. Tinsel can be a fire hazard!',
                    santaQuote: 'I love seeing beautiful decorations, but please keep them safe from heat sources!'
                },
                8: {
                    title: 'Clear the Hearth Area',
                    tip: 'Keep the area around your fireplace clear of paper, fabric, and other flammable materials.',
                    santaQuote: 'A tidy hearth makes my job easier and keeps your home safe. Thank you for being thoughtful!'
                },
                9: {
                    title: 'Secure Pets on Christmas Eve',
                    tip: 'Keep pets in a safe room on Christmas Eve. They might get excited when I arrive!',
                    santaQuote: 'I love meeting pets, but they sometimes get too excited! Please keep them safe in another room.'
                },
                10: {
                    title: 'Hang Stockings Safely',
                    tip: 'Hang stockings on a mantle that\'s cool to the touch and away from any heat sources.',
                    santaQuote: 'Stockings hung with care and safety in mind make Christmas morning extra special!'
                },
                11: {
                    title: 'Know Your Emergency Plan',
                    tip: 'Have a fire escape plan and make sure everyone in your family knows it.',
                    santaQuote: 'Being prepared is the best gift you can give your family. Safety planning shows real Christmas spirit!'
                },
                12: {
                    title: 'Prevent Ice Dams',
                    tip: 'Keep your gutters clean and ensure proper attic insulation to prevent ice dams on your roof.',
                    santaQuote: 'Ice dams can damage roofs and chimneys. The reindeer and I prefer safe, well-maintained rooftops!'
                }
            },
            ko: {
                1: {
                    title: '굴뚝을 깨끗하게 유지하세요',
                    tip: '굴뚝에 이물질이 없는지 확인하고 댐퍼를 열어두세요. 산타가 안전하게 지나갈 수 있어야 해요!',
                    santaQuote: '호호호! 깨끗한 굴뚝은 제가 선물을 안전하고 빠르게 배달하는 데 도움이 됩니다!'
                },
                2: {
                    title: '모든 불을 끄세요',
                    tip: '크리스마스 이브에 잠들기 전에 벽난로의 모든 불을 끄세요. 안전이 최우선입니다!',
                    santaQuote: '제가 방문할 때 불이 타고 있지 않은지 확인해 주세요. 제 옷은 내화성이지만, 더욱 조심하고 싶어요!'
                },
                3: {
                    title: '쿠키를 안전하게 놓으세요',
                    tip: '우유와 쿠키를 벽난로 근처에서 떨어진 곳에 두어 안전하게 보관하고 산타를 기쁘게 해주세요!',
                    santaQuote: '저는 쿠키를 좋아하지만, 벽난로에서 떨어진 곳에 두어 신선하고 안전하게 보관해 주세요!'
                },
                4: {
                    title: '굴뚝 스크린을 설치하세요',
                    tip: '굴뚝 스크린은 동물과 이물질이 들어오는 것을 방지합니다. 걱정 마세요, 산타는 특별한 열쇠가 있어요!',
                    santaQuote: '굴뚝 스크린은 안전에 좋습니다! 저는 마법의 접근 권한이 있어서 선물 배달을 막지 못해요.'
                },
                5: {
                    title: '연간 굴뚝 점검',
                    tip: '전문가에게 매년 굴뚝 점검을 받으세요. 안전한 굴뚝이 행복한 굴뚝입니다!',
                    santaQuote: '엘프들과 저는 크리스마스 전에 항상 굴뚝을 점검합니다. 연간 점검은 모두를 안전하게 지켜줍니다!'
                },
                6: {
                    title: '일산화탄소 감지기를 확인하세요',
                    tip: '일산화탄소 감지기를 정기적으로 테스트하세요. 새 배터리가 생명을 구합니다!',
                    santaQuote: '안전이 제 최우선 사항입니다! 감지기가 작동하는지 확인하세요 - 엘프들도 제게 점검하라고 상기시켜줍니다.'
                },
                7: {
                    title: '크리스마스 장식을 안전하게 고정하세요',
                    tip: '장식품을 벽난로와 굴뚝 근처에서 떨어뜨려 두세요. 틴셀은 화재 위험이 될 수 있습니다!',
                    santaQuote: '아름다운 장식을 보는 것을 좋아하지만, 열원에서 멀리 안전하게 두어 주세요!'
                },
                8: {
                    title: '벽난로 주변을 깨끗하게 하세요',
                    tip: '벽난로 주변에 종이, 천, 기타 가연성 물질을 두지 마세요.',
                    santaQuote: '깔끔한 벽난로는 제 일을 쉽게 만들고 여러분의 집을 안전하게 지켜줍니다. 세심한 배려에 감사합니다!'
                },
                9: {
                    title: '크리스마스 이브에 반려동물을 안전하게 하세요',
                    tip: '크리스마스 이브에 반려동물을 안전한 방에 두세요. 제가 도착하면 흥분할 수 있어요!',
                    santaQuote: '저는 반려동물을 만나는 것을 좋아하지만, 때때로 너무 흥분합니다! 다른 방에서 안전하게 지켜주세요.'
                },
                10: {
                    title: '양말을 안전하게 걸어두세요',
                    tip: '만져봐서 시원한 맨틀피스에 양말을 걸고 열원에서 멀리 두세요.',
                    santaQuote: '조심스럽고 안전하게 걸린 양말은 크리스마스 아침을 더욱 특별하게 만듭니다!'
                },
                11: {
                    title: '응급 계획을 숙지하세요',
                    tip: '화재 대피 계획을 세우고 가족 모두가 알고 있는지 확인하세요.',
                    santaQuote: '준비된다는 것은 가족에게 줄 수 있는 최고의 선물입니다. 안전 계획은 진정한 크리스마스 정신을 보여줍니다!'
                },
                12: {
                    title: '얼음 댐을 방지하세요',
                    tip: '배수로를 깨끗하게 유지하고 적절한 다락방 단열재를 설치하여 지붕의 얼음 댐을 방지하세요.',
                    santaQuote: '얼음 댐은 지붕과 굴뚝을 손상시킬 수 있습니다. 순록들과 저는 안전하고 잘 관리된 지붕을 선호합니다!'
                }
            }
        };
    }

    getLocalizedTipContent(tipId) {
        const currentLanguage = this.getCurrentLanguage();
        const translations = this.getSafetyTipTranslations();
        const content = translations[currentLanguage] && translations[currentLanguage][tipId]
            ? translations[currentLanguage][tipId]
            : translations['en'][tipId];

        return content;
    }

    startTipRotation() {
        // Rotate tips every 2 minutes during active use
        this.rotationInterval = setInterval(() => {
            this.rotateTip();
        }, 120000);

        // Listen for language changes to refresh content
        if (window.languageManager) {
            window.languageManager.addEventListener('language-changed', () => {
                this.refreshSafetyTips();
            });
        }
    }

    refreshSafetyTips() {
        this.loadSafetyTips();
        // Notify listeners of the updated current tip
        const currentTip = this.getCurrentTip();
        if (currentTip) {
            this.notifyListeners('tip-changed', currentTip);
        }
        console.log('✅ ChimneySafetyManager: Refreshed safety tips for language change');
    }

    rotateTip() {
        this.currentTipIndex = (this.currentTipIndex + 1) % this.safetyTips.length;
        const currentTip = this.safetyTips[this.currentTipIndex];

        this.notifyListeners('tip-changed', currentTip);
    }

    getCurrentTip() {
        return this.safetyTips[this.currentTipIndex] || this.safetyTips[0];
    }

    getTipsByCategory(category) {
        return this.safetyTips.filter(tip => tip.category === category);
    }

    getTipsBySeverity(severity) {
        return this.safetyTips.filter(tip => tip.severity === severity);
    }

    getTipsForSeason(season) {
        return this.safetyTips.filter(tip => tip.season === season || tip.season === 'all');
    }

    getCriticalTips() {
        return this.safetyTips.filter(tip => tip.severity === 'critical');
    }

    getChristmasEveTips() {
        return this.safetyTips.filter(tip =>
            tip.season === 'christmas' ||
            (tip.season === 'all' && tip.severity === 'critical')
        );
    }

    getAllTips() {
        return [...this.safetyTips];
    }

    getRandomTip() {
        const randomIndex = Math.floor(Math.random() * this.safetyTips.length);
        return this.safetyTips[randomIndex];
    }

    getTipById(id) {
        return this.safetyTips.find(tip => tip.id === id);
    }

    getSafetyCategories() {
        const categories = [...new Set(this.safetyTips.map(tip => tip.category))];
        return categories.map(category => ({
            name: category,
            displayName: this.getCategoryDisplayName(category),
            icon: this.getCategoryIcon(category),
            tipCount: this.getTipsByCategory(category).length
        }));
    }

    getCategoryDisplayName(category) {
        const currentLanguage = this.getCurrentLanguage();

        const names = {
            en: {
                'chimney': 'Chimney Safety',
                'fire': 'Fire Safety',
                'cookies': 'Cookie & Treat Safety',
                'maintenance': 'Home Maintenance',
                'carbon_monoxide': 'Carbon Monoxide Safety',
                'decorations': 'Holiday Decorations',
                'preparation': 'Christmas Preparation',
                'pets': 'Pet Safety',
                'stockings': 'Stocking Safety',
                'emergency': 'Emergency Preparedness',
                'winter': 'Winter Safety'
            },
            ko: {
                'chimney': '굴뚝 안전',
                'fire': '화재 안전',
                'cookies': '쿠키 및 간식 안전',
                'maintenance': '주택 관리',
                'carbon_monoxide': '일산화탄소 안전',
                'decorations': '휴일 장식',
                'preparation': '크리스마스 준비',
                'pets': '반려동물 안전',
                'stockings': '양말 안전',
                'emergency': '응급 상황 대비',
                'winter': '겨울 안전'
            }
        };

        const categoryNames = names[currentLanguage] || names['en'];
        return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
    }

    getCategoryIcon(category) {
        const icons = {
            'chimney': '🏠',
            'fire': '🔥',
            'cookies': '🍪',
            'maintenance': '🔧',
            'carbon_monoxide': '⚠️',
            'decorations': '🎄',
            'preparation': '🎁',
            'pets': '🐕',
            'stockings': '🧦',
            'emergency': '🚨',
            'winter': '❄️'
        };
        return icons[category] || '💡';
    }

    getSeverityColor(severity) {
        const colors = {
            'critical': 'bg-red-100 text-red-800 border-red-300',
            'important': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'helpful': 'bg-blue-100 text-blue-800 border-blue-300'
        };
        return colors[severity] || colors.helpful;
    }

    getSeverityIcon(severity) {
        const icons = {
            'critical': '🚨',
            'important': '⚠️',
            'helpful': '💡'
        };
        return icons[severity] || '💡';
    }

    generateSafetyReport() {
        const currentDate = new Date();
        const isChristmasEve = currentDate.getMonth() === 11 && currentDate.getDate() === 24;
        const isChristmasTime = currentDate.getMonth() === 11 && currentDate.getDate() >= 20 && currentDate.getDate() <= 26;

        let report = "🎅 Santa's Safety Report:\n\n";

        if (isChristmasEve) {
            report += "🔥 CHRISTMAS EVE SPECIAL REMINDERS:\n";
            const christmasEveTips = this.getChristmasEveTips();
            christmasEveTips.slice(0, 3).forEach((tip, index) => {
                report += `${index + 1}. ${tip.tip}\n`;
            });
            report += "\n";
        }

        if (isChristmasTime) {
            report += "🎄 HOLIDAY SEASON SAFETY:\n";
            const holidayTips = this.getTipsForSeason('christmas');
            holidayTips.slice(0, 2).forEach((tip, index) => {
                report += `• ${tip.tip}\n`;
            });
            report += "\n";
        }

        report += "⚠️ YEAR-ROUND CRITICAL SAFETY:\n";
        const criticalTips = this.getCriticalTips();
        criticalTips.slice(0, 2).forEach((tip, index) => {
            report += `• ${tip.tip}\n`;
        });

        report += "\n🎁 Remember: A safe home is a happy home! Ho ho ho!";

        return report;
    }

    getSantaPersonalizedMessage() {
        const currentDate = new Date();
        const isChristmasEve = currentDate.getMonth() === 11 && currentDate.getDate() === 24;
        const randomTip = this.getRandomTip();

        let message = "Ho ho ho! ";

        if (isChristmasEve) {
            message += "It's Christmas Eve and I'm getting ready for my big journey! ";
        } else {
            message += "Even when it's not Christmas, I like to make sure everyone stays safe! ";
        }

        message += randomTip.santaQuote;

        if (isChristmasEve) {
            message += " I'll be checking on everyone tonight, so please follow my safety tips!";
        } else {
            message += " Keep these tips in mind all year round!";
        }

        message += " 🎅❤️";

        return {
            message,
            relatedTip: randomTip
        };
    }

    checkSafetyCompliance(userAnswers = {}) {
        // Simulate safety compliance check based on user input
        // This would typically integrate with smart home systems

        const checks = [
            { name: 'Chimney Clear', status: userAnswers.chimneyClear || 'unknown', critical: true },
            { name: 'Fire Extinguished', status: userAnswers.fireOut || 'unknown', critical: true },
            { name: 'Smoke Detectors', status: userAnswers.smokeDetectors || 'unknown', critical: true },
            { name: 'CO Detectors', status: userAnswers.coDetectors || 'unknown', critical: true },
            { name: 'Decorations Secure', status: userAnswers.decorationsSecure || 'unknown', critical: false },
            { name: 'Pets Secured', status: userAnswers.petsSecured || 'unknown', critical: false }
        ];

        const passed = checks.filter(check => check.status === 'good').length;
        const failed = checks.filter(check => check.status === 'bad').length;
        const unknown = checks.filter(check => check.status === 'unknown').length;
        const criticalFailed = checks.filter(check => check.critical && check.status === 'bad').length;

        return {
            overall: criticalFailed === 0 ? (failed === 0 ? 'excellent' : 'good') : 'needs_attention',
            score: Math.round((passed / checks.length) * 100),
            checks,
            criticalIssues: criticalFailed,
            recommendations: this.getRecommendationsForFailures(checks.filter(check => check.status === 'bad'))
        };
    }

    getRecommendationsForFailures(failedChecks) {
        const recommendations = [];

        failedChecks.forEach(check => {
            const relatedTips = this.safetyTips.filter(tip => {
                switch (check.name) {
                    case 'Chimney Clear': return tip.category === 'chimney';
                    case 'Fire Extinguished': return tip.category === 'fire';
                    case 'Smoke Detectors': return tip.category === 'emergency';
                    case 'CO Detectors': return tip.category === 'carbon_monoxide';
                    case 'Decorations Secure': return tip.category === 'decorations';
                    case 'Pets Secured': return tip.category === 'pets';
                    default: return false;
                }
            });

            if (relatedTips.length > 0) {
                recommendations.push(relatedTips[0]);
            }
        });

        return recommendations;
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
                    console.error('Error in chimney safety manager listener:', error);
                }
            });
    }

    destroy() {
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
        }
    }
}

// Create and export singleton instance
const chimneySafetyManager = new ChimneySafetyManager();

// Make available globally
window.chimneySafetyManager = chimneySafetyManager;