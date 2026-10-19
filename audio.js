/**
 * Barnaby's Celestial Sound Engine
 * Built entirely with Web Audio API for zero latency, zero dependencies, and 100% reliability.
 */

class DreamAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;
    this.ambientGain = null;
    this.effectsGain = null;
    this.analyser = null;

    // Ambient nodes
    this.ambientNodes = {
      wind: { gain: null, source: null, filter: null },
      crickets: { gain: null, timer: null, isRunning: false },
      rain: { gain: null, source: null, filter: null },
      hum: { gain: null, osc: null }
    };

    // Melody player state
    this.currentMelodyTimer = null;
    this.isPlayingMelody = false;
    this.activePreset = null;

    // Pentatonic scale note frequencies (Hz) for the 8 Celesta Chime keys
    this.frequencies = {
      'C4': 261.63,
      'D4': 293.66,
      'E4': 329.63,
      'G4': 392.00,
      'A4': 440.00,
      'C5': 523.25,
      'D5': 587.33,
      'E5': 659.25
    };

    // Melodies definitions [note, duration (ms), rest (ms)]
    this.melodies = {
      badger: [
        ['C4', 400, 100], ['E4', 400, 100], ['G4', 600, 150],
        ['A4', 400, 100], ['G4', 400, 100], ['E4', 800, 250],
        ['D4', 400, 100], ['E4', 400, 100], ['D4', 600, 150],
        ['C4', 1000, 400]
      ],
      otter: [
        ['G4', 350, 80], ['A4', 350, 80], ['C5', 400, 100],
        ['D5', 350, 80], ['C5', 350, 80], ['A4', 400, 100],
        ['G4', 350, 80], ['E4', 500, 150], ['D4', 400, 100],
        ['C4', 900, 400]
      ],
      stardust: [
        ['E5', 300, 80], ['D5', 300, 80], ['C5', 350, 100],
        ['A4', 300, 80], ['G4', 350, 100], ['E4', 400, 120],
        ['G4', 300, 80], ['A4', 300, 80], ['C5', 700, 250],
        ['E5', 1000, 500]
      ]
    };
  }

  /**
   * Initializes or resumes the AudioContext on first user interaction
   */
  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      console.warn('Web Audio API is not supported in this browser.');
      return;
    }

    this.ctx = new AudioContext();

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    // Sub gains
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    this.ambientGain.connect(this.masterGain);

    this.effectsGain = this.ctx.createGain();
    this.effectsGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
    this.effectsGain.connect(this.masterGain);

    // Audio Visualizer Analyser
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;
    this.analyser.smoothingTimeConstant = 0.8;
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Setup ambient generators
    this.setupAmbientWind();
    this.setupAmbientRain();
    this.setupAmbientGhostHum();
  }

  /**
   * Plays a crystal celesta chime note with gentle decay
   */
  playChime(note, volumeMultiplier = 1.0) {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const freq = typeof note === 'number' ? note : (this.frequencies[note] || 440);
    const now = this.ctx.currentTime;

    // Main Sine Oscillator for pure fundamental tone
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // Second Oscillator tuned to overtone for music-box chime sparkle
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.76, now); // Bell metallic overtone

    // Low-pass filter for warmth
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 4, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 0.8, now + 1.8);

    // Gain Envelopes
    const gain1 = this.ctx.createGain();
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.4 * volumeMultiplier, now + 0.015);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(0.001, now);
    gain2.gain.linearRampToValueAtTime(0.12 * volumeMultiplier, now + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    // Connect nodes
    osc1.connect(gain1);
    gain1.connect(filter);

    osc2.connect(gain2);
    gain2.connect(filter);

    filter.connect(this.effectsGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.5);
    osc2.stop(now + 2.5);
  }

  /**
   * Procedural Night Wind using pink noise and LFO
   */
  setupAmbientWind() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.11;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    // LFO to sway wind frequency
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime); // 0.18 Hz slow breeze
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(160, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambientGain);

    whiteNoise.start();
    lfo.start();

    this.ambientNodes.wind.gain = gain;
    this.ambientNodes.wind.filter = filter;
  }

  /**
   * Procedural Soft Forest Rain
   */
  setupAmbientRain() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.08;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambientGain);

    whiteNoise.start();
    this.ambientNodes.rain.gain = gain;
  }

  /**
   * Procedural Ghost Warm Sine Hum / Purr
   */
  setupAmbientGhostHum() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(130.81, this.ctx.currentTime); // C3 warm drone

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(3.5, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(2.2, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);

    osc.connect(gain);
    gain.connect(this.ambientGain);

    osc.start();
    lfo.start();

    this.ambientNodes.hum.gain = gain;
  }

  /**
   * Procedural Twilight Crickets chirp loop
   */
  startCrickets(volume = 0.5) {
    this.ambientNodes.crickets.isRunning = true;
    const loop = () => {
      if (!this.ambientNodes.crickets.isRunning || !this.ctx || this.isMuted) return;
      this.playCricketChirp(volume);
      const nextTime = 1200 + Math.random() * 2500;
      this.ambientNodes.crickets.timer = setTimeout(loop, nextTime);
    };
    loop();
  }

  stopCrickets() {
    this.ambientNodes.crickets.isRunning = false;
    if (this.ambientNodes.crickets.timer) {
      clearTimeout(this.ambientNodes.crickets.timer);
    }
  }

  playCricketChirp(volumeMultiplier = 0.5) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(4600 + (Math.random() * 300), now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);

    // Rapid double chirps
    for (let i = 0; i < 3; i++) {
      const t = now + (i * 0.045);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.08 * volumeMultiplier, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
    }

    osc.connect(gain);
    gain.connect(this.ambientGain);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  /**
   * Set volume for individual ambient channels (0.0 to 1.0)
   */
  setAmbientLevel(channel, value) {
    this.init();
    if (!this.ctx) return;
    const val = Math.max(0, Math.min(1, parseFloat(value)));
    const now = this.ctx.currentTime;

    if (channel === 'wind' && this.ambientNodes.wind.gain) {
      this.ambientNodes.wind.gain.gain.linearRampToValueAtTime(val * 0.35, now + 0.1);
    } else if (channel === 'rain' && this.ambientNodes.rain.gain) {
      this.ambientNodes.rain.gain.gain.linearRampToValueAtTime(val * 0.3, now + 0.1);
    } else if (channel === 'hum' && this.ambientNodes.hum.gain) {
      this.ambientNodes.hum.gain.gain.linearRampToValueAtTime(val * 0.22, now + 0.1);
    } else if (channel === 'crickets') {
      if (val > 0.05 && !this.ambientNodes.crickets.isRunning) {
        this.startCrickets(val);
      } else if (val <= 0.05) {
        this.stopCrickets();
      }
    }
  }

  /**
   * Plays a sequenced preset lullaby
   */
  playLullaby(presetName, onNoteCallback, onCompleteCallback) {
    this.init();
    this.stopLullaby();

    const notes = this.melodies[presetName];
    if (!notes) return;

    this.isPlayingMelody = true;
    this.activePreset = presetName;
    let index = 0;

    const playNext = () => {
      if (!this.isPlayingMelody) return;
      if (index >= notes.length) {
        // Loop after a 2-second gentle pause
        this.currentMelodyTimer = setTimeout(() => {
          index = 0;
          playNext();
        }, 2200);
        return;
      }

      const [note, dur, rest] = notes[index];
      this.playChime(note, 0.9);
      if (onNoteCallback) onNoteCallback(note, index);

      index++;
      this.currentMelodyTimer = setTimeout(playNext, dur + rest);
    };

    playNext();
  }

  stopLullaby() {
    this.isPlayingMelody = false;
    this.activePreset = null;
    if (this.currentMelodyTimer) {
      clearTimeout(this.currentMelodyTimer);
      this.currentMelodyTimer = null;
    }
  }

  /**
   * Whimsical Sound Effects
   */
  playClick() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.effectsGain);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  playGiggle() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const notes = [659.25, 783.99, 987.77, 880, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playChime(freq, 0.4), idx * 65);
    });
  }

  playSneeze() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    // Build up wind
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.18);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.16);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(gain);
    gain.connect(this.effectsGain);
    osc.start(now);
    osc.stop(now + 0.3);

    // Sparkle burst
    setTimeout(() => {
      [1200, 1500, 1800, 2200, 2600].forEach((freq, i) => {
        setTimeout(() => this.playChime(freq, 0.3), i * 35);
      });
    }, 200);
  }

  playMagicWeave() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const freqs = [392, 523.25, 659.25, 783.99, 1046.5];
    freqs.forEach((f, i) => {
      setTimeout(() => this.playChime(f, 0.7), i * 110);
    });
  }

  playSecretUnlock() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((n, i) => {
      setTimeout(() => this.playChime(n, 0.8), i * 120);
    });
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.7, now + 0.1);
    }
    return this.isMuted;
  }
}

// Global Audio Engine Instance
window.dreamAudio = new DreamAudioEngine();
