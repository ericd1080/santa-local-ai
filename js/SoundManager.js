/**
 * SoundManager - Audio system for Santa Tracker
 * Handles sound effects, music, and audio notifications
 */

class SoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = new Map();
        this.enabled = true;
        this.volume = 0.7;
        this.loadingSounds = new Set();
        this.soundConfig = {
            sleighBells: {
                url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsF',
                volume: 0.6,
                loop: false
            },
            hoHoHo: {
                url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsF',
                volume: 0.8,
                loop: false
            },
            jingleBells: {
                url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsF',
                volume: 0.5,
                loop: true
            },
            giftDrop: {
                url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmEZBjqQ2O/NeSsF',
                volume: 0.4,
                loop: false
            },
            notification: {
                // High-pitched pleasant chime
                frequency: 800,
                type: 'sine',
                duration: 0.3,
                volume: 0.3
            }
        };

        this.initializeAudioContext();
        this.loadSounds();
    }

    async initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Resume context if suspended (required by modern browsers)
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            console.log('✅ SoundManager: Audio context initialized');
        } catch (error) {
            console.warn('⚠️ SoundManager: Audio context not available', error);
            this.enabled = false;
        }
    }

    async loadSounds() {
        if (!this.enabled || !this.audioContext) return;

        for (const [name, config] of Object.entries(this.soundConfig)) {
            try {
                if (config.url && config.url.startsWith('data:')) {
                    // For data URLs, we'll use HTML5 Audio for simplicity
                    const audio = new Audio();
                    audio.volume = config.volume || 0.5;
                    audio.loop = config.loop || false;
                    audio.preload = 'auto';

                    // Generate simple audio data for demo
                    audio.src = this.generateDemoSound(name);

                    this.sounds.set(name, audio);
                    console.log(`✅ SoundManager: Loaded ${name}`);
                } else if (config.frequency) {
                    // For frequency-based sounds (like notification), generate audio
                    const audio = new Audio();
                    audio.volume = config.volume || 0.5;
                    audio.loop = config.loop || false;
                    audio.preload = 'auto';

                    // Generate audio based on frequency configuration
                    audio.src = this.createToneDataURL([config.frequency], config.volume, config.duration);

                    this.sounds.set(name, audio);
                    console.log(`✅ SoundManager: Loaded ${name}`);
                }
            } catch (error) {
                console.warn(`⚠️ SoundManager: Failed to load ${name}:`, error);
            }
        }
    }

    generateDemoSound(type) {
        // Generate demo audio data URLs for different sound types
        const demoSounds = {
            sleighBells: this.createToneDataURL([800, 1000, 1200], 0.5, 0.3),
            hoHoHo: this.createToneDataURL([200, 300, 200], 0.8, 0.8),
            jingleBells: this.createToneDataURL([600, 800, 1000, 800], 0.4, 1.2),
            giftDrop: this.createToneDataURL([400, 200], 0.3, 0.2),
            notification: this.createToneDataURL([800], 0.3, 0.3)
        };

        return demoSounds[type] || demoSounds.notification;
    }

    createToneDataURL(frequencies, volume = 0.5, duration = 0.5) {
        if (!this.audioContext) {
            return 'data:audio/wav;base64,'; // Empty audio
        }

        const sampleRate = 44100;
        const numSamples = Math.floor(sampleRate * duration);
        const buffer = new Float32Array(numSamples);

        for (let i = 0; i < numSamples; i++) {
            let sample = 0;
            for (const freq of frequencies) {
                sample += Math.sin(2 * Math.PI * freq * i / sampleRate);
            }
            // Apply envelope (fade in/out)
            const envelope = Math.sin(Math.PI * i / numSamples);
            buffer[i] = (sample / frequencies.length) * volume * envelope;
        }

        return this.floatArrayToDataURL(buffer, sampleRate);
    }

    floatArrayToDataURL(floatArray, sampleRate) {
        // Convert float array to WAV data URL
        const length = floatArray.length;
        const buffer = new ArrayBuffer(44 + length * 2);
        const view = new DataView(buffer);

        // WAV header
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        writeString(0, 'RIFF');
        view.setUint32(4, 36 + length * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, length * 2, true);

        // Convert float samples to 16-bit PCM
        let offset = 44;
        for (let i = 0; i < length; i++) {
            const sample = Math.max(-1, Math.min(1, floatArray[i]));
            view.setInt16(offset, sample * 0x7FFF, true);
            offset += 2;
        }

        const blob = new Blob([buffer], { type: 'audio/wav' });
        return URL.createObjectURL(blob);
    }

    async play(soundName, options = {}) {
        if (!this.enabled || !this.sounds.has(soundName)) {
            console.warn(`⚠️ SoundManager: Sound '${soundName}' not available`);
            return;
        }

        try {
            const audio = this.sounds.get(soundName);
            const actualVolume = (options.volume || 1) * this.volume;

            // Clone audio for multiple simultaneous plays
            const audioClone = audio.cloneNode();
            audioClone.volume = actualVolume;

            if (options.loop !== undefined) {
                audioClone.loop = options.loop;
            }

            await audioClone.play();

            // Clean up after playback
            audioClone.addEventListener('ended', () => {
                URL.revokeObjectURL(audioClone.src);
            });

            console.log(`🔊 SoundManager: Playing ${soundName}`);
            return audioClone;
        } catch (error) {
            console.warn(`⚠️ SoundManager: Failed to play ${soundName}:`, error);
        }
    }

    async playSequence(sounds, delay = 500) {
        for (let i = 0; i < sounds.length; i++) {
            await this.play(sounds[i]);
            if (i < sounds.length - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) {
            this.stopAll();
        }
        console.log(`🔊 SoundManager: ${enabled ? 'Enabled' : 'Disabled'}`);
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        console.log(`🔊 SoundManager: Volume set to ${Math.round(this.volume * 100)}%`);
    }

    stopAll() {
        this.sounds.forEach((audio, name) => {
            if (!audio.paused) {
                audio.pause();
                audio.currentTime = 0;
            }
        });
    }

    // Convenience methods for specific Santa Tracker sounds
    playSleighBells() {
        return this.play('sleighBells');
    }

    playHoHoHo() {
        return this.play('hoHoHo');
    }

    playJingleBells(loop = false) {
        return this.play('jingleBells', { loop });
    }

    playGiftDrop() {
        return this.play('giftDrop');
    }

    playNotification() {
        return this.play('notification');
    }

    // Santa-specific sound sequences
    async playSantaArrival() {
        await this.playSequence(['sleighBells', 'hoHoHo', 'jingleBells'], 800);
    }

    async playSantaDeparture() {
        await this.playSequence(['hoHoHo', 'sleighBells'], 600);
    }

    // Initialize sound on user interaction (required by browsers)
    async enableOnUserInteraction() {
        const enableAudio = async () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            // Test play a quiet sound to enable audio
            await this.play('notification', { volume: 0.01 });

            document.removeEventListener('click', enableAudio);
            document.removeEventListener('touchstart', enableAudio);
            document.removeEventListener('keydown', enableAudio);

            console.log('✅ SoundManager: Audio enabled by user interaction');
        };

        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('touchstart', enableAudio, { once: true });
        document.addEventListener('keydown', enableAudio, { once: true });
    }

    // Get sound configuration for settings
    getSoundSettings() {
        return {
            enabled: this.enabled,
            volume: this.volume,
            availableSounds: Array.from(this.sounds.keys())
        };
    }
}

// Create and export singleton instance
const soundManager = new SoundManager();

// Enable audio on user interaction
soundManager.enableOnUserInteraction();

// Make available globally
window.soundManager = soundManager;