/**
 * Secrets, Easter Eggs, and Interactive Barnaby Behaviors
 */

class DreamEasterEggs {
  constructor() {
    this.ghostClickCount = 0;
    this.snoozingCrittersFound = new Set();
    this.totalCritters = 5;

    // Konami code tracker
    this.konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    this.konamiIndex = 0;

    // Constellation Canvas State
    this.constellationCanvas = document.getElementById('constellation-canvas');
    this.cCtx = this.constellationCanvas ? this.constellationCanvas.getContext('2d') : null;
    this.constellationStars = [];
    this.constellationLines = [];
    this.selectedStar = null;

    this.init();
  }

  init() {
    this.setupGhostAvatarInteractions();
    this.setupGhostToolbar();
    this.setupSnoozingCritters();
    this.setupKonamiCode();
    this.setupConstellationModal();
  }

  /* ==========================================================================
     Barnaby Ghost Avatar Interactions
     ========================================================================== */
  setupGhostAvatarInteractions() {
    const barnaby = document.getElementById('barnaby-ghost-avatar');
    const bubble = document.getElementById('ghost-speech-text');

    if (!barnaby) return;

    barnaby.addEventListener('click', (e) => {
      this.ghostClickCount++;
      const rect = barnaby.getBoundingClientRect();

      if (this.ghostClickCount === 1) {
        barnaby.classList.add('blush-active');
        this.sayGhost("Eep! You found me! I'm Barnaby! ✨");
        if (window.dreamAudio) window.dreamAudio.playChime('E5');
        if (window.dreamCanvas) window.dreamCanvas.spawnBurst(e.clientX, e.clientY, 15, '#ff9aa2');
      } else if (this.ghostClickCount === 2) {
        barnaby.classList.add('giggle');
        this.sayGhost("Tee-hee! That tickles my stardust! 🤭");
        if (window.dreamAudio) window.dreamAudio.playGiggle();
        if (window.dreamCanvas) window.dreamCanvas.spawnBurst(e.clientX, e.clientY, 20, '#ffd166');
        setTimeout(() => barnaby.classList.remove('giggle'), 600);
      } else if (this.ghostClickCount === 3) {
        barnaby.classList.add('somersault');
        this.sayGhost("Look! A mid-air dream loop! 🌀");
        if (window.dreamAudio) window.dreamAudio.playMagicWeave();
        setTimeout(() => barnaby.classList.remove('somersault'), 1000);
      } else if (this.ghostClickCount === 4) {
        barnaby.classList.add('puff-up');
        this.sayGhost("*Puff!* Getting sleepy now... like warm marshmallow ☕");
        if (window.dreamAudio) window.dreamAudio.playChime('C4', 1.2);
        setTimeout(() => barnaby.classList.remove('puff-up'), 800);
      } else if (this.ghostClickCount >= 5) {
        // Barnaby Sneeze Easter Egg!
        this.ghostClickCount = 0;
        this.sayGhost("A-CHOO! 🌸 *Dandelion fluff everywhere!*");
        if (window.dreamAudio) window.dreamAudio.playSneeze();
        if (window.dreamCanvas) {
          window.dreamCanvas.spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 60, '#ffffff');
          window.dreamCanvas.spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40, '#ffd166');
        }
        this.showToast("🌸 Secret Discovered: You gave Barnaby the dandelion sneezes!");
      }
    });
  }

  sayGhost(phrase) {
    const bubble = document.getElementById('ghost-speech-text');
    if (bubble) {
      bubble.textContent = phrase;
      bubble.style.transform = 'translateX(-50%) translateY(0) scale(1.05)';
      setTimeout(() => {
        bubble.style.transform = 'translateX(-50%) translateY(-10px) scale(1)';
      }, 300);
    }
  }

  setupGhostToolbar() {
    const pokeBtn = document.getElementById('ghost-poke-btn');
    const teaBtn = document.getElementById('ghost-tea-btn');
    const capBtn = document.getElementById('ghost-cap-btn');
    const whisperBtn = document.getElementById('ghost-whisper-btn');
    const barnaby = document.getElementById('barnaby-ghost-avatar');

    if (pokeBtn) {
      pokeBtn.addEventListener('click', () => {
        barnaby.click();
      });
    }

    if (teaBtn) {
      teaBtn.addEventListener('click', () => {
        this.sayGhost("Mmm, lavender & chamomile dew... thank you kindly! 🍵");
        if (window.dreamAudio) window.dreamAudio.playChime('G4');
        const teaItem = document.getElementById('ghost-tea-cup-svg');
        if (teaItem) teaItem.style.opacity = '1';
        setTimeout(() => {
          if (teaItem) teaItem.style.opacity = '0';
        }, 4000);
      });
    }

    if (capBtn) {
      capBtn.addEventListener('click', () => {
        this.sayGhost("Ding-a-ling! My bell keeps the nightmares away 🔔");
        if (window.dreamAudio) {
          window.dreamAudio.playChime('E5', 1.2);
          setTimeout(() => window.dreamAudio.playChime('C5', 0.8), 120);
        }
      });
    }

    if (whisperBtn) {
      whisperBtn.addEventListener('click', () => {
        this.sayGhost("“Hush little vole, safe in your hole...” 🎶");
        if (window.dreamAudio) {
          window.dreamAudio.playLullaby('badger');
        }
      });
    }
  }

  /* ==========================================================================
     Hidden Snoozing Critters Scavenger Hunt (Easter Egg 2)
     ========================================================================== */
  setupSnoozingCritters() {
    const critters = document.querySelectorAll('.sleeping-critter-spot');
    critters.forEach(c => {
      c.addEventListener('click', (e) => {
        const id = c.getAttribute('data-critter-id');
        const name = c.getAttribute('data-critter-name');

        if (window.dreamAudio) {
          window.dreamAudio.playChime('G4', 0.8);
          setTimeout(() => window.dreamAudio.playChime('C5', 0.6), 150);
        }

        if (window.dreamCanvas) {
          window.dreamCanvas.spawnBurst(e.clientX, e.clientY, 15, '#ffd166');
        }

        if (!this.snoozingCrittersFound.has(id)) {
          this.snoozingCrittersFound.add(id);
          c.classList.add('found');

          // Update badge tracker if modal open
          const huntItem = document.getElementById(`hunt-item-${id}`);
          if (huntItem) huntItem.classList.add('found');

          this.showToast(`💤 Found sleeping friend: ${name}! (${this.snoozingCrittersFound.size}/${this.totalCritters})`);

          if (this.snoozingCrittersFound.size === this.totalCritters) {
            setTimeout(() => this.unlockMasterBadge(), 800);
          }
        }
      });
    });
  }

  unlockMasterBadge() {
    if (window.dreamAudio) window.dreamAudio.playSecretUnlock();
    const modal = document.getElementById('achievement-badge-modal');
    if (modal) modal.classList.add('active');

    if (window.dreamCanvas) {
      window.dreamCanvas.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 70, '#ffd166');
    }
  }

  /* ==========================================================================
     Konami Code Detection (Easter Egg 3)
     ========================================================================== */
  setupKonamiCode() {
    window.addEventListener('keydown', (e) => {
      if (e.key === this.konamiSequence[this.konamiIndex]) {
        this.konamiIndex++;
        if (this.konamiIndex === this.konamiSequence.length) {
          this.konamiIndex = 0;
          this.triggerDreamAuroraParty();
        }
      } else {
        this.konamiIndex = 0;
      }
    });
  }

  triggerDreamAuroraParty() {
    if (window.dreamAudio) window.dreamAudio.playSecretUnlock();
    document.documentElement.setAttribute('data-theme', 'dream');
    if (window.dreamCanvas) {
      window.dreamCanvas.setTheme('dream');
      window.dreamCanvas.spawnBurst(window.innerWidth / 2, window.innerHeight / 3, 100, '#00f0ff');
      window.dreamCanvas.spawnBurst(window.innerWidth / 2, window.innerHeight / 3, 80, '#df73ff');
    }

    this.showToast("🌌 UNLOCKED: Secret Lucid Dream Aurora Mode!");
  }

  /* ==========================================================================
     Secret Star Weaver Constellation Canvas (Easter Egg 4)
     ========================================================================== */
  setupConstellationModal() {
    const openBtn = document.getElementById('open-constellation-modal-btn');
    const modal = document.getElementById('constellation-modal');
    const closeBtn = document.getElementById('close-constellation-btn');
    const clearBtn = document.getElementById('clear-constellation-btn');
    const presets = document.querySelectorAll('.preset-chip');

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        modal.classList.add('active');
        this.initConstellationCanvas();
        if (window.dreamAudio) window.dreamAudio.playChime('C5');
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    // Close on overlay backdrop click
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.constellationLines = [];
        this.selectedStar = null;
        this.drawConstellation();
      });
    }

    presets.forEach(p => {
      p.addEventListener('click', () => {
        presets.forEach(x => x.classList.remove('active'));
        p.classList.add('active');
        const type = p.getAttribute('data-preset');
        this.loadConstellationPreset(type);
      });
    });
  }

  initConstellationCanvas() {
    if (!this.constellationCanvas) return;
    const box = this.constellationCanvas.parentElement;
    this.constellationCanvas.width = box.clientWidth || 580;
    this.constellationCanvas.height = 340;

    // Create 18 stars across canvas
    this.constellationStars = [];
    const w = this.constellationCanvas.width;
    const h = this.constellationCanvas.height;

    for (let i = 0; i < 18; i++) {
      this.constellationStars.push({
        id: i,
        x: 40 + Math.random() * (w - 80),
        y: 40 + Math.random() * (h - 80),
        r: Math.random() * 2.5 + 3,
        note: ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5'][i % 8]
      });
    }

    this.constellationLines = [];
    this.selectedStar = null;

    this.constellationCanvas.onclick = (e) => this.handleConstellationClick(e);
    this.drawConstellation();
  }

  handleConstellationClick(e) {
    const rect = this.constellationCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked near a star
    let clickedStar = null;
    for (let s of this.constellationStars) {
      const dist = Math.hypot(s.x - x, s.y - y);
      if (dist < 18) {
        clickedStar = s;
        break;
      }
    }

    if (clickedStar) {
      if (window.dreamAudio) window.dreamAudio.playChime(clickedStar.note);

      if (this.selectedStar && this.selectedStar !== clickedStar) {
        // Connect them!
        this.constellationLines.push({
          from: this.selectedStar,
          to: clickedStar
        });
        this.selectedStar = clickedStar;
      } else {
        this.selectedStar = clickedStar;
      }
      this.drawConstellation();
    }
  }

  drawConstellation() {
    if (!this.cCtx || !this.constellationCanvas) return;
    const w = this.constellationCanvas.width;
    const h = this.constellationCanvas.height;
    this.cCtx.clearRect(0, 0, w, h);

    // Draw background starlight gradient
    const grad = this.cCtx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 2);
    grad.addColorStop(0, '#0e1633');
    grad.addColorStop(1, '#050811');
    this.cCtx.fillStyle = grad;
    this.cCtx.fillRect(0, 0, w, h);

    // Draw lines
    this.cCtx.beginPath();
    this.cCtx.strokeStyle = 'rgba(123, 156, 255, 0.7)';
    this.cCtx.lineWidth = 2;
    this.cCtx.shadowBlur = 10;
    this.cCtx.shadowColor = '#86e3ce';

    for (let line of this.constellationLines) {
      this.cCtx.moveTo(line.from.x, line.from.y);
      this.cCtx.lineTo(line.to.x, line.to.y);
    }
    this.cCtx.stroke();

    // Draw stars
    for (let s of this.constellationStars) {
      this.cCtx.save();
      this.cCtx.beginPath();
      this.cCtx.arc(s.x, s.y, s === this.selectedStar ? s.r + 2 : s.r, 0, Math.PI * 2);
      this.cCtx.fillStyle = s === this.selectedStar ? '#ffd166' : '#ffffff';
      this.cCtx.shadowBlur = s === this.selectedStar ? 15 : 8;
      this.cCtx.shadowColor = s === this.selectedStar ? '#ffd166' : '#7b9cff';
      this.cCtx.fill();
      this.cCtx.restore();
    }
  }

  loadConstellationPreset(type) {
    if (!this.constellationStars.length) return;
    this.constellationLines = [];
    if (type === 'fox') {
      for (let i = 0; i < 5; i++) {
        this.constellationLines.push({
          from: this.constellationStars[i],
          to: this.constellationStars[(i + 1) % 6]
        });
      }
    } else if (type === 'owl') {
      for (let i = 0; i < 6; i += 2) {
        this.constellationLines.push({
          from: this.constellationStars[i],
          to: this.constellationStars[i + 1]
        });
      }
    }
    this.drawConstellation();
  }

  showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3800);
  }
}

// Global Easter Eggs
document.addEventListener('DOMContentLoaded', () => {
  window.dreamEasterEggs = new DreamEasterEggs();
});
