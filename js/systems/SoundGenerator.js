class SoundGenerator {
    constructor(scene) {
        this.scene = scene;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }

    init() {
        // Generate all sounds
        this.generatePunch();
        this.generateKick();
        this.generateHit();
        this.generateMusic();
    }

    generatePunch() {
        const duration = 0.1;
        const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * duration, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < buffer.length; i++) {
            // White noise with decay
            data[i] = (Math.random() * 2 - 1) * (1 - i / buffer.length);
        }

        this.addBufferToPhaser('punch', buffer);
    }

    generateKick() {
        const duration = 0.2;
        const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * duration, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.ctx.sampleRate;
            // Sine wave sweep down
            const freq = 150 * Math.exp(-10 * t);
            data[i] = Math.sin(2 * Math.PI * freq * t) * (1 - i / buffer.length);
        }

        this.addBufferToPhaser('kick', buffer);
    }

    generateHit() {
        const duration = 0.1;
        const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * duration, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.ctx.sampleRate;
            // Square wave for retro hit sound
            const freq = 400 - 2000 * t;
            data[i] = (Math.sin(2 * Math.PI * freq * t) > 0 ? 0.5 : -0.5) * (1 - i / buffer.length);
        }

        this.addBufferToPhaser('hit', buffer);
    }

    generateMusic() {
        // Simple drum beat loop
        const duration = 2.0; // 2 seconds loop
        const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * duration, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        const tempo = 4; // beats per second

        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.ctx.sampleRate;
            let sample = 0;

            // Bass drum on beat
            if (t % 0.5 < 0.1) {
                const dt = t % 0.5;
                sample += Math.sin(2 * Math.PI * 60 * dt) * Math.exp(-20 * dt);
            }

            // Hi-hat on off-beat
            if ((t + 0.25) % 0.5 < 0.05) {
                sample += (Math.random() * 2 - 1) * 0.3;
            }

            // Bassline
            const note = Math.floor(t * 4) % 2 === 0 ? 110 : 165; // A2 then E3
            sample += Math.sin(2 * Math.PI * note * t) * 0.1;

            data[i] = sample;
        }

        this.addBufferToPhaser('music', buffer);
    }

    addBufferToPhaser(key, buffer) {
        // Convert AudioBuffer to WAV format (simplified) or use Phaser's decodeAudio
        // Since Phaser 3 can play AudioBuffers directly if we add them to cache
        this.scene.cache.audio.add(key, buffer);
    }
}
