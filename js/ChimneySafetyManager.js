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

    loadSafetyTips() {
        this.safetyTips = [
            {
                id: 1,
                category: 'chimney',
                title: 'Keep Your Chimney Clear',
                icon: '🏠',
                tip: 'Make sure your chimney is clear of debris and the damper is open. Santa needs a safe passage!',
                severity: 'important',
                season: 'all',
                santaQuote: 'Ho ho ho! A clear chimney helps me deliver your presents safely and quickly!'
            },
            {
                id: 2,
                category: 'fire',
                title: 'Extinguish All Fires',
                icon: '🔥',
                tip: 'Put out all fires in your fireplace before bedtime on Christmas Eve. Safety first!',
                severity: 'critical',
                season: 'christmas',
                santaQuote: 'Please make sure there are no fires burning when I visit. My suit is flame-resistant, but I prefer to be extra careful!'
            },
            {
                id: 3,
                category: 'cookies',
                title: 'Leave Cookies Safely',
                icon: '🍪',
                tip: 'Place milk and cookies away from the fireplace area to keep them safe and Santa happy!',
                severity: 'helpful',
                season: 'christmas',
                santaQuote: 'I love cookies, but please keep them away from the fireplace so they stay fresh and safe!'
            },
            {
                id: 4,
                category: 'chimney',
                title: 'Install a Chimney Screen',
                icon: '🛡️',
                tip: 'A chimney screen prevents animals and debris from entering. Don\'t worry, Santa has a special key!',
                severity: 'important',
                season: 'all',
                santaQuote: 'Chimney screens are great for safety! I have magical access, so they won\'t stop me from delivering presents.'
            },
            {
                id: 5,
                category: 'maintenance',
                title: 'Annual Chimney Inspection',
                icon: '🔍',
                tip: 'Have your chimney inspected annually by a professional. A safe chimney is a happy chimney!',
                severity: 'important',
                season: 'all',
                santaQuote: 'The elves and I always check chimneys before Christmas. An annual inspection keeps everyone safe!'
            },
            {
                id: 6,
                category: 'carbon_monoxide',
                title: 'Check Carbon Monoxide Detectors',
                icon: '⚠️',
                tip: 'Test your carbon monoxide detectors regularly. Fresh batteries save lives!',
                severity: 'critical',
                season: 'all',
                santaQuote: 'Safety is my top priority! Make sure your detectors are working - the elves remind me to check mine too.'
            },
            {
                id: 7,
                category: 'decorations',
                title: 'Secure Christmas Decorations',
                icon: '🎄',
                tip: 'Keep decorations away from the fireplace and chimney area. Tinsel can be a fire hazard!',
                severity: 'important',
                season: 'christmas',
                santaQuote: 'I love seeing beautiful decorations, but please keep them safe from heat sources!'
            },
            {
                id: 8,
                category: 'preparation',
                title: 'Clear the Hearth Area',
                icon: '🧹',
                tip: 'Keep the area around your fireplace clear of paper, fabric, and other flammable materials.',
                severity: 'important',
                season: 'all',
                santaQuote: 'A tidy hearth makes my job easier and keeps your home safe. Thank you for being thoughtful!'
            },
            {
                id: 9,
                category: 'pets',
                title: 'Secure Pets on Christmas Eve',
                icon: '🐕',
                tip: 'Keep pets in a safe room on Christmas Eve. They might get excited when I arrive!',
                severity: 'helpful',
                season: 'christmas',
                santaQuote: 'I love meeting pets, but they sometimes get too excited! Please keep them safe in another room.'
            },
            {
                id: 10,
                category: 'stockings',
                title: 'Hang Stockings Safely',
                icon: '🧦',
                tip: 'Hang stockings on a mantle that\'s cool to the touch and away from any heat sources.',
                severity: 'important',
                season: 'christmas',
                santaQuote: 'Stockings hung with care and safety in mind make Christmas morning extra special!'
            },
            {
                id: 11,
                category: 'emergency',
                title: 'Know Your Emergency Plan',
                icon: '🚨',
                tip: 'Have a fire escape plan and make sure everyone in your family knows it.',
                severity: 'critical',
                season: 'all',
                santaQuote: 'Being prepared is the best gift you can give your family. Safety planning shows real Christmas spirit!'
            },
            {
                id: 12,
                category: 'winter',
                title: 'Prevent Ice Dams',
                icon: '🧊',
                tip: 'Keep your gutters clean and ensure proper attic insulation to prevent ice dams on your roof.',
                severity: 'important',
                season: 'winter',
                santaQuote: 'Ice dams can damage roofs and chimneys. The reindeer and I prefer safe, well-maintained rooftops!'
            }
        ];

        console.log('✅ ChimneySafetyManager: Loaded safety tips');
    }

    startTipRotation() {
        // Rotate tips every 2 minutes during active use
        this.rotationInterval = setInterval(() => {
            this.rotateTip();
        }, 120000);
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
        const names = {
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
        };
        return names[category] || category.charAt(0).toUpperCase() + category.slice(1);
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