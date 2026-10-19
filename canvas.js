/**
 * Barnaby's Canvas & Visual Particle Engine
 * Handles ambient stars, floating dandelion motes, fireflies, and the audio visualizer.
 */

class DreamCanvasEngine {
  constructor() {
    this.starCanvas = document.getElementById('star-canvas');
    this.moteCanvas = document.getElementById('mote-canvas');
    this.visCanvas = document.getElementById('audio-visualizer-canvas');

    this.starCtx = this.starCanvas ? this.starCanvas.getContext('2d') : null;
    this.moteCtx = this.moteCanvas ? this.moteCanvas.getContext('2d') : null;
    this.visCtx = this.visCanvas ? this.visCanvas.getContext('2d') : null;

    this.stars = [];
    this.motes = [];
    this.bursts = [];

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouse = { x: this.width / 2, y: this.height / 2, moved: false };

    this.theme = 'night';
    this.animId = null;

    this.init();
  }

  init() {
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.moved = true;
    });

    this.createStars();
    this.createMotes();
    this.animate();
  }

  handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    if (this.starCanvas) {
      this.starCanvas.width = this.width;
      this.starCanvas.height = this.height;
    }
    if (this.moteCanvas) {
      this.moteCanvas.width = this.width;
      this.moteCanvas.height = this.height;
    }
    if (this.visCanvas) {
      this.visCanvas.width = this.visCanvas.parentElement ? this.visCanvas.parentElement.clientWidth : 600;
      this.visCanvas.height = 90;
    }
  }

  setTheme(theme) {
    this.theme = theme;
  }

  createStars() {
    this.stars = [];
    const count = Math.min(180, Math.floor((this.width * this.height) / 7000));
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleAngle: Math.random() * Math.PI * 2
      });
    }
  }

  createMotes() {
    this.motes = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      this.motes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.6 - 0.2, // Drifting upwards
        radius: Math.random() * 3 + 1.5,
        alpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        angle: Math.random() * Math.PI * 2,
        hue: Math.random() * 60 + 190 // Soft blue/violet default
      });
    }
  }

  /**
   * Spawns an explosion of twinkling star particles at (x, y)
   */
  spawnBurst(x, y, count = 25, color = '#ffd166') {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.5 + 1.5;
      this.bursts.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: Math.random() * 0.025 + 0.015,
        size: Math.random() * 3.5 + 2,
        color: color
      });
    }
  }

  animate() {
    this.renderStars();
    this.renderMotes();
    this.renderVisualizer();

    this.animId = requestAnimationFrame(() => this.animate());
  }

  renderStars() {
    if (!this.starCtx) return;
    this.starCtx.clearRect(0, 0, this.width, this.height);

    if (this.theme === 'day') {
      // Very faint stars or sun sparkles in day mode
      return;
    }

    const isDream = this.theme === 'dream';
    const isTwilight = this.theme === 'twilight';

    for (let star of this.stars) {
      star.twinkleAngle += star.twinkleSpeed;
      const currentAlpha = star.alpha * (0.6 + 0.4 * Math.sin(star.twinkleAngle));

      this.starCtx.save();
      this.starCtx.beginPath();
      this.starCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

      if (isDream) {
        this.starCtx.fillStyle = `rgba(180, 240, 255, ${currentAlpha})`;
        this.starCtx.shadowBlur = 8;
        this.starCtx.shadowColor = '#00f0ff';
      } else if (isTwilight) {
        this.starCtx.fillStyle = `rgba(255, 235, 190, ${currentAlpha * 0.8})`;
      } else {
        this.starCtx.fillStyle = `rgba(240, 244, 255, ${currentAlpha})`;
        this.starCtx.shadowBlur = 4;
        this.starCtx.shadowColor = '#ffd166';
      }

      this.starCtx.fill();
      this.starCtx.restore();
    }
  }

  renderMotes() {
    if (!this.moteCtx) return;
    this.moteCtx.clearRect(0, 0, this.width, this.height);

    // Render floating motes/fireflies
    for (let mote of this.motes) {
      mote.x += mote.vx;
      mote.y += mote.vy;
      mote.angle += mote.pulseSpeed;

      // Wrap around screen edges
      if (mote.y < -20) {
        mote.y = this.height + 20;
        mote.x = Math.random() * this.width;
      }
      if (mote.x < -20) mote.x = this.width + 20;
      if (mote.x > this.width + 20) mote.x = -20;

      const alphaPulse = mote.alpha * (0.65 + 0.35 * Math.sin(mote.angle));

      this.moteCtx.save();
      this.moteCtx.beginPath();
      this.moteCtx.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2);

      if (this.theme === 'day') {
        // Dandelion seed motes
        this.moteCtx.fillStyle = `rgba(255, 255, 240, ${alphaPulse * 0.7})`;
        this.moteCtx.shadowBlur = 3;
        this.moteCtx.shadowColor = 'rgba(255, 255, 200, 0.4)';
      } else if (this.theme === 'twilight') {
        // Warm amber fireflies
        this.moteCtx.fillStyle = `rgba(255, 200, 100, ${alphaPulse})`;
        this.moteCtx.shadowBlur = 10;
        this.moteCtx.shadowColor = '#ffbe0b';
      } else if (this.theme === 'dream') {
        // Iridescent auroral motes
        const hue = (mote.hue + performance.now() * 0.02) % 360;
        this.moteCtx.fillStyle = `hsla(${hue}, 90%, 75%, ${alphaPulse})`;
        this.moteCtx.shadowBlur = 12;
        this.moteCtx.shadowColor = `hsl(${hue}, 100%, 70%)`;
      } else {
        // Midnight celestial stardust
        this.moteCtx.fillStyle = `rgba(200, 225, 255, ${alphaPulse})`;
        this.moteCtx.shadowBlur = 8;
        this.moteCtx.shadowColor = '#7b9cff';
      }

      this.moteCtx.fill();
      this.moteCtx.restore();
    }

    // Render active bursts (Easter eggs, pokes, sneeze)
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vy += 0.04; // Gentle gravity
      b.life -= b.decay;

      if (b.life <= 0) {
        this.bursts.splice(i, 1);
        continue;
      }

      this.moteCtx.save();
      this.moteCtx.beginPath();
      this.moteCtx.arc(b.x, b.y, b.size * b.life, 0, Math.PI * 2);
      this.moteCtx.fillStyle = b.color;
      this.moteCtx.globalAlpha = b.life;
      this.moteCtx.shadowBlur = 8;
      this.moteCtx.shadowColor = b.color;
      this.moteCtx.fill();
      this.moteCtx.restore();
    }
  }

  /**
   * Renders gentle audio-reactive waves on the music box visualizer canvas
   */
  renderVisualizer() {
    if (!this.visCtx || !this.visCanvas) return;
    const w = this.visCanvas.width;
    const h = this.visCanvas.height;

    this.visCtx.clearRect(0, 0, w, h);

    const hasAudio = window.dreamAudio && window.dreamAudio.analyser;
    let dataArray = null;

    if (hasAudio) {
      dataArray = new Uint8Array(window.dreamAudio.analyser.frequencyBinCount);
      window.dreamAudio.analyser.getByteTimeDomainData(dataArray);
    }

    this.visCtx.beginPath();
    this.visCtx.lineWidth = 2.5;
    this.visCtx.strokeStyle = 'rgba(134, 227, 206, 0.75)';
    this.visCtx.shadowBlur = 12;
    this.visCtx.shadowColor = 'rgba(134, 227, 206, 0.9)';

    const sliceWidth = w / 64;
    let x = 0;

    for (let i = 0; i < 64; i++) {
      let v = 128;
      if (dataArray) {
        v = dataArray[i] || 128;
      } else {
        // Idle gentle breathing sine wave
        v = 128 + Math.sin(i * 0.15 + performance.now() * 0.003) * 8;
      }

      const y = (v / 255.0) * h;

      if (i === 0) {
        this.visCtx.moveTo(x, y);
      } else {
        this.visCtx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    this.visCtx.stroke();
  }
}

// Global Canvas Engine
window.dreamCanvas = new DreamCanvasEngine();
