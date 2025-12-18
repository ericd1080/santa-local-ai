/**
 * ReindeerManager - Individual reindeer tracking for Santa Tracker
 * Handles reindeer names, status, and individual tracking
 */

class ReindeerManager {
    constructor() {
        this.reindeer = [
            {
                name: 'Dasher',
                emoji: '🦌',
                personality: 'Fast and energetic',
                status: 'leading',
                speed: 'very fast',
                specialty: 'Navigation and speed',
                currentTask: 'Leading the formation'
            },
            {
                name: 'Dancer',
                emoji: '🦌',
                personality: 'Graceful and elegant',
                status: 'flying',
                speed: 'moderate',
                specialty: 'Aerial maneuvers',
                currentTask: 'Maintaining flight stability'
            },
            {
                name: 'Prancer',
                emoji: '🦌',
                personality: 'Proud and strong',
                status: 'pulling',
                speed: 'fast',
                specialty: 'Heavy lifting',
                currentTask: 'Pulling the sleigh'
            },
            {
                name: 'Vixen',
                emoji: '🦌',
                personality: 'Clever and mischievous',
                status: 'navigating',
                speed: 'moderate',
                specialty: 'Weather navigation',
                currentTask: 'Reading wind patterns'
            },
            {
                name: 'Comet',
                emoji: '🦌',
                personality: 'Swift and bright',
                status: 'flying',
                speed: 'very fast',
                specialty: 'Night vision',
                currentTask: 'Spotting chimneys'
            },
            {
                name: 'Cupid',
                emoji: '🦌',
                personality: 'Loving and caring',
                status: 'helping',
                speed: 'moderate',
                specialty: 'Gift delivery precision',
                currentTask: 'Organizing presents'
            },
            {
                name: 'Donner',
                emoji: '🦌',
                personality: 'Powerful and reliable',
                status: 'pulling',
                speed: 'moderate',
                specialty: 'Storm flying',
                currentTask: 'Weather management'
            },
            {
                name: 'Blitzen',
                emoji: '🦌',
                personality: 'Lightning fast',
                status: 'racing',
                speed: 'extremely fast',
                specialty: 'Emergency speed',
                currentTask: 'Time management'
            },
            {
                name: 'Rudolph',
                emoji: '🔴',
                personality: 'Brave and bright',
                status: 'guiding',
                speed: 'fast',
                specialty: 'Fog navigation with glowing nose',
                currentTask: 'Leading through fog',
                isLead: true
            }
        ];

        this.listeners = [];
        this.currentLeader = this.reindeer.find(r => r.isLead) || this.reindeer[0];
        this.formationPattern = 'V-formation';
        this.teamMorale = 95; // Percentage

        this.updateReindeerStatus();
        this.startStatusUpdates();
    }

    startStatusUpdates() {
        // Update reindeer status every 30 seconds
        this.statusInterval = setInterval(() => {
            this.updateReindeerStatus();
            this.notifyListeners('reindeer-updated', this.getTeamStatus());
        }, 30000);
    }

    updateReindeerStatus() {
        const currentTime = new Date();
        const christmasEve = new Date(currentTime.getFullYear(), 11, 24, 18, 0, 0);
        const christmasDay = new Date(currentTime.getFullYear(), 11, 25, 6, 0, 0);

        let teamStatus = 'resting';
        if (currentTime >= christmasEve && currentTime < christmasDay) {
            teamStatus = 'delivering';
        } else if (currentTime < christmasEve) {
            teamStatus = 'preparing';
        } else {
            teamStatus = 'celebrating';
        }

        this.reindeer.forEach(reindeer => {
            this.updateIndividualReindeer(reindeer, teamStatus);
        });

        // Update team morale based on time and weather
        this.updateTeamMorale(teamStatus);
    }

    updateIndividualReindeer(reindeer, teamStatus) {
        const tasks = this.getTasksForStatus(teamStatus);
        const randomTask = tasks[Math.floor(Math.random() * tasks.length)];

        // Assign appropriate tasks based on personality
        switch (teamStatus) {
            case 'preparing':
                reindeer.currentTask = this.getPreparationTask(reindeer);
                reindeer.status = 'preparing';
                break;
            case 'delivering':
                reindeer.currentTask = this.getDeliveryTask(reindeer);
                reindeer.status = this.getDeliveryStatus(reindeer);
                break;
            case 'celebrating':
                reindeer.currentTask = this.getCelebrationTask(reindeer);
                reindeer.status = 'celebrating';
                break;
            default:
                reindeer.currentTask = 'Resting at the North Pole';
                reindeer.status = 'resting';
        }
    }

    getPreparationTask(reindeer) {
        const preparationTasks = {
            'Dasher': 'Checking flight routes',
            'Dancer': 'Practicing aerial maneuvers',
            'Prancer': 'Strengthening harnesses',
            'Vixen': 'Studying weather patterns',
            'Comet': 'Testing night vision',
            'Cupid': 'Organizing gift lists',
            'Donner': 'Preparing for storms',
            'Blitzen': 'Speed training',
            'Rudolph': 'Polishing his nose'
        };
        return preparationTasks[reindeer.name] || 'Getting ready for Christmas';
    }

    getDeliveryTask(reindeer) {
        const deliveryTasks = {
            'Dasher': 'Leading navigation',
            'Dancer': 'Maintaining flight formation',
            'Prancer': 'Pulling heavy gift sacks',
            'Vixen': 'Finding optimal routes',
            'Comet': 'Spotting houses in the dark',
            'Cupid': 'Ensuring perfect gift delivery',
            'Donner': 'Flying through storms',
            'Blitzen': 'Maintaining delivery speed',
            'Rudolph': 'Guiding through fog and clouds'
        };
        return deliveryTasks[reindeer.name] || 'Delivering Christmas joy';
    }

    getCelebrationTask(reindeer) {
        const celebrationTasks = {
            'Dasher': 'Racing with the others',
            'Dancer': 'Performing victory dances',
            'Prancer': 'Showing off to the elves',
            'Vixen': 'Planning next year\'s routes',
            'Comet': 'Stargazing',
            'Cupid': 'Spreading Christmas love',
            'Donner': 'Thundering with joy',
            'Blitzen': 'Lightning-fast celebrations',
            'Rudolph': 'Sharing stories of the night'
        };
        return celebrationTasks[reindeer.name] || 'Celebrating Christmas success';
    }

    getDeliveryStatus(reindeer) {
        const statuses = ['flying', 'navigating', 'pulling', 'guiding', 'racing', 'helping'];
        if (reindeer.name === 'Rudolph') return 'guiding';
        if (reindeer.name === 'Dasher') return 'leading';
        return statuses[Math.floor(Math.random() * statuses.length)];
    }

    updateTeamMorale(teamStatus) {
        const baseMorale = {
            'preparing': 90,
            'delivering': 95,
            'celebrating': 100,
            'resting': 85
        };

        // Add some randomness and weather factors
        const weatherFactor = Math.random() * 10 - 5; // -5 to +5
        this.teamMorale = Math.max(75, Math.min(100, baseMorale[teamStatus] + weatherFactor));
    }

    getTasksForStatus(status) {
        const taskSets = {
            'preparing': [
                'Exercising and warming up',
                'Checking equipment',
                'Reviewing flight routes',
                'Eating Christmas carrots',
                'Polishing antlers'
            ],
            'delivering': [
                'Flying at maximum speed',
                'Navigating through clouds',
                'Pulling the heavy sleigh',
                'Watching for obstacles',
                'Maintaining formation'
            ],
            'celebrating': [
                'Dancing with joy',
                'Playing reindeer games',
                'Resting after success',
                'Enjoying Christmas treats',
                'Planning next year'
            ]
        };
        return taskSets[status] || ['Resting peacefully'];
    }

    getAllReindeer() {
        // Return localized reindeer data
        return this.reindeer.map(reindeer => ({
            ...reindeer,
            personality: this.getLocalizedPersonality(reindeer.name),
            specialty: this.getLocalizedSpecialty(reindeer.name),
            currentTask: this.getLocalizedCurrentTask(reindeer.name, reindeer.status),
            speed: this.getLocalizedSpeed(reindeer.speed)
        }));
    }

    getLocalizedPersonality(name) {
        const key = `reindeer.${name.toLowerCase()}.personality`;
        return window.languageManager.t(key);
    }

    getLocalizedSpecialty(name) {
        const key = `reindeer.${name.toLowerCase()}.specialty`;
        return window.languageManager.t(key);
    }

    getLocalizedSpeed(speed) {
        const speedKey = speed.replace(/\s+/g, ''); // Remove spaces
        const key = `reindeer.speed.${speedKey}`;
        return window.languageManager.t(key);
    }

    getLocalizedCurrentTask(name, status) {
        if (status === 'preparing') {
            return this.getLocalizedPreparationTask(name);
        } else if (status === 'delivering') {
            return this.getLocalizedDeliveryTask(name);
        } else if (status === 'celebrating') {
            return this.getLocalizedCelebrationTask(name);
        }
        return window.languageManager.t('reindeer.task.resting') || 'Resting at the North Pole';
    }

    getLocalizedPreparationTask(name) {
        const preparationTasks = {
            'Dasher': 'reindeer.task.checkingFlightRoutes',
            'Dancer': 'reindeer.task.practicingManeuvers',
            'Prancer': 'reindeer.task.strengtheningHarnesses',
            'Vixen': 'reindeer.task.studyingWeatherPatterns',
            'Comet': 'reindeer.task.testingNightVision',
            'Cupid': 'reindeer.task.organizingGiftLists',
            'Donner': 'reindeer.task.preparingForStorms',
            'Blitzen': 'reindeer.task.speedTraining',
            'Rudolph': 'reindeer.task.polishingNose'
        };
        const taskKey = preparationTasks[name];
        return window.languageManager.t(taskKey) || window.languageManager.t('reindeer.task.checkingFlightRoutes');
    }

    getLocalizedDeliveryTask(name) {
        const deliveryTasks = {
            'Dasher': 'reindeer.task.leadingFormation',
            'Dancer': 'reindeer.task.maintainingStability',
            'Prancer': 'reindeer.task.pullingSleigh',
            'Vixen': 'reindeer.task.readingWindPatterns',
            'Comet': 'reindeer.task.spottingChimneys',
            'Cupid': 'reindeer.task.organizingPresents',
            'Donner': 'reindeer.task.weatherManagement',
            'Blitzen': 'reindeer.task.timeManagement',
            'Rudolph': 'reindeer.task.leadingThroughFog'
        };
        const taskKey = deliveryTasks[name];
        return window.languageManager.t(taskKey) || window.languageManager.t('reindeer.task.leadingFormation');
    }

    getLocalizedCelebrationTask(name) {
        // Use a subset of tasks for celebration
        const celebrationTasks = [
            'reindeer.task.organizingPresents',
            'reindeer.task.polishingNose',
            'reindeer.task.speedTraining'
        ];
        const randomTask = celebrationTasks[Math.floor(Math.random() * celebrationTasks.length)];
        return window.languageManager.t(randomTask);
    }

    getReindeerByName(name) {
        return this.reindeer.find(r => r.name.toLowerCase() === name.toLowerCase());
    }

    getCurrentLeader() {
        return this.currentLeader;
    }

    getTeamStatus() {
        const activeReindeer = this.reindeer.filter(r => r.status !== 'resting');
        const averageSpeed = this.calculateAverageSpeed();

        return {
            totalReindeer: this.reindeer.length,
            activeReindeer: activeReindeer.length,
            leader: this.currentLeader.name,
            formation: this.formationPattern,
            morale: Math.round(this.teamMorale),
            averageSpeed: averageSpeed,
            specialStatus: this.getSpecialTeamStatus()
        };
    }

    calculateAverageSpeed() {
        const speedValues = {
            'extremely fast': 100,
            'very fast': 80,
            'fast': 60,
            'moderate': 40
        };

        const totalSpeed = this.reindeer.reduce((sum, reindeer) => {
            return sum + (speedValues[reindeer.speed] || 40);
        }, 0);

        return Math.round(totalSpeed / this.reindeer.length);
    }

    getSpecialTeamStatus() {
        const currentTime = new Date();
        const christmasEve = new Date(currentTime.getFullYear(), 11, 24, 18, 0, 0);
        const christmasDay = new Date(currentTime.getFullYear(), 11, 25, 6, 0, 0);

        if (currentTime >= christmasEve && currentTime < christmasDay) {
            return window.languageManager.t('reindeer.teamStatusDelivering') + ' 🎄✨';
        } else if (currentTime < christmasEve) {
            return window.languageManager.t('reindeer.teamStatusPreparing') + ' 🛷';
        } else {
            return window.languageManager.t('reindeer.teamStatusCelebrating') + ' 🎉';
        }
    }

    getReindeerFormation() {
        // Return reindeer in their flight formation
        const formation = [
            [this.reindeer.find(r => r.name === 'Rudolph')], // Lead
            [
                this.reindeer.find(r => r.name === 'Dasher'),
                this.reindeer.find(r => r.name === 'Dancer')
            ], // Second row
            [
                this.reindeer.find(r => r.name === 'Prancer'),
                this.reindeer.find(r => r.name === 'Vixen')
            ], // Third row
            [
                this.reindeer.find(r => r.name === 'Comet'),
                this.reindeer.find(r => r.name === 'Cupid')
            ], // Fourth row
            [
                this.reindeer.find(r => r.name === 'Donner'),
                this.reindeer.find(r => r.name === 'Blitzen')
            ] // Back row
        ];

        return formation.filter(row => row.every(reindeer => reindeer));
    }

    getRandomReindeerFact() {
        const facts = [
            `${this.currentLeader.name} is currently ${this.currentLeader.currentTask.toLowerCase()}`,
            `The reindeer team morale is at ${Math.round(this.teamMorale)}% - excellent for Christmas delivery!`,
            `Rudolph's nose is extra bright tonight, perfect for navigating through any weather`,
            `Dasher and Dancer are practicing their synchronized flying patterns`,
            `All nine reindeer are working in perfect ${this.formationPattern} for maximum efficiency`,
            `The reindeer have been training all year for this special Christmas Eve flight`,
            `Comet's night vision is helping spot houses from miles away`,
            `Cupid is making sure every present gets delivered with extra love`
        ];

        return facts[Math.floor(Math.random() * facts.length)];
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
                    console.error('Error in reindeer manager listener:', error);
                }
            });
    }

    destroy() {
        if (this.statusInterval) {
            clearInterval(this.statusInterval);
        }
    }
}

// Create and export singleton instance
const reindeerManager = new ReindeerManager();

// Make available globally
window.reindeerManager = reindeerManager;