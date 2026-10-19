/**
 * Invention 1: The Slumber Lanterns Studio
 * Allows visitors to craft, customize, and release dream lamps for sleeping animals.
 */

class SlumberLanternStudio {
  constructor() {
    this.currentAnimal = 'fox';
    this.currentColor = '#ffd166';
    this.brightness = 0.8;
    this.ingredients = new Set(['stardust', 'fireflies']);

    this.animals = {
      fox: {
        name: 'Rusty the Sleepy Red Fox',
        emoji: '🦊',
        color: '#ffbe0b',
        burrow: 'The Amber Fern Burrow',
        quote: '“He runs with legs twitching in sleep, catching falling leaves that turn into starlight.”'
      },
      otter: {
        name: 'Pip the River Otter',
        emoji: '🦦',
        color: '#48cae4',
        burrow: 'The Moonlit Reed Hollow',
        quote: '“Floating belly-up on smooth warm stones, holding hands with river friends under giant lotus pads.”'
      },
      dormouse: {
        name: 'Hazel the Dormouse',
        emoji: '🐭',
        color: '#ff9aa2',
        burrow: 'The Hazelnut Hammock',
        quote: '“Wrapped snugly in woven thistle-down, nibbling on infinite wild blackberry tarts.”'
      },
      owl: {
        name: 'Hoot the Pygmy Owl',
        emoji: '🦉',
        color: '#c288f8',
        burrow: 'The Hollow Oak Roost',
        quote: '“Soaring silently across iridescent aurora ribbons without a single flap of tired wings.”'
      },
      hedgehog: {
        name: 'Quilliam the Hedgehog',
        emoji: '🦔',
        color: '#86e3ce',
        burrow: 'The Mossy Stone Den',
        quote: '“Tucked into a soft cashmere sweater that never snags, sipping chamomile dew drops.”'
      }
    };

    // Internal particles inside lantern
    this.lanternCanvas = document.getElementById('lantern-canvas');
    this.lanternCtx = this.lanternCanvas ? this.lanternCanvas.getContext('2d') : null;
    this.lanternParticles = [];

    this.init();
  }

  init() {
    this.setupListeners();
    this.setupLanternCanvas();
    this.updatePreview();
  }

  setupLanternCanvas() {
    if (!this.lanternCanvas) return;
    this.lanternCanvas.width = 150;
    this.lanternCanvas.height = 190;

    this.lanternParticles = [];
    for (let i = 0; i < 28; i++) {
      this.lanternParticles.push({
        x: Math.random() * 150,
        y: Math.random() * 190,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -Math.random() * 0.9 - 0.2,
        r: Math.random() * 2.5 + 1,
        angle: Math.random() * Math.PI * 2
      });
    }

    const loop = () => {
      this.renderLanternCanvas();
      requestAnimationFrame(loop);
    };
    loop();
  }

  renderLanternCanvas() {
    if (!this.lanternCtx || !this.lanternCanvas) return;
    const w = this.lanternCanvas.width;
    const h = this.lanternCanvas.height;
    this.lanternCtx.clearRect(0, 0, w, h);

    for (let p of this.lanternParticles) {
      p.x += p.vx;
      p.y += p.vy;
      p.angle += 0.03;

      if (p.y < 0) {
        p.y = h;
        p.x = Math.random() * w;
      }
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;

      const alpha = (0.5 + 0.5 * Math.sin(p.angle)) * this.brightness;

      this.lanternCtx.save();
      this.lanternCtx.beginPath();
      this.lanternCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.lanternCtx.fillStyle = this.currentColor;
      this.lanternCtx.globalAlpha = alpha;
      this.lanternCtx.shadowBlur = 8;
      this.lanternCtx.shadowColor = this.currentColor;
      this.lanternCtx.fill();
      this.lanternCtx.restore();
    }
  }

  setupListeners() {
    // Animal chips
    const animalChips = document.querySelectorAll('.animal-chip');
    animalChips.forEach(chip => {
      chip.addEventListener('click', () => {
        animalChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentAnimal = chip.getAttribute('data-animal');
        this.currentColor = this.animals[this.currentAnimal].color;
        this.updatePreview();
        if (window.dreamAudio) window.dreamAudio.playClick();
      });
    });

    // Essence dots
    const dots = document.querySelectorAll('.essence-dot');
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        this.currentColor = dot.getAttribute('data-color');
        this.updatePreview();
        if (window.dreamAudio) window.dreamAudio.playClick();
      });
    });

    // Ingredients toggles
    const ingredientBtns = document.querySelectorAll('.ingredient-btn');
    ingredientBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.getAttribute('data-ingredient');
        if (this.ingredients.has(item)) {
          if (this.ingredients.size > 1) { // keep at least one
            this.ingredients.delete(item);
            btn.classList.remove('active');
          }
        } else {
          this.ingredients.add(item);
          btn.classList.add('active');
        }
        if (window.dreamAudio) window.dreamAudio.playClick();
      });
    });

    // Brightness slider
    const slider = document.getElementById('lantern-brightness-slider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        this.brightness = parseFloat(e.target.value);
        this.updatePreview();
      });
    }

    // Weave Dream Button
    const weaveBtn = document.getElementById('weave-dream-btn');
    if (weaveBtn) {
      weaveBtn.addEventListener('click', () => this.weaveDream());
    }

    // Release to Burrow Button
    const releaseBtn = document.getElementById('release-lantern-btn');
    if (releaseBtn) {
      releaseBtn.addEventListener('click', () => this.releaseLantern());
    }
  }

  updatePreview() {
    const animal = this.animals[this.currentAnimal];
    const holder = document.querySelector('.lantern-holder');
    const glow = document.querySelector('.lantern-glow-bg');
    const silhouette = document.querySelector('.lantern-animal-silhouette');
    const statusText = document.getElementById('lantern-status-text');

    if (silhouette && animal) {
      silhouette.textContent = animal.emoji;
    }

    if (glow) {
      glow.style.setProperty('--lantern-curr-color', this.currentColor);
      glow.style.opacity = this.brightness;
    }

    if (statusText && animal) {
      statusText.innerHTML = `<span>Preparing dream for: <strong>${animal.name}</strong></span>`;
    }
  }

  weaveDream() {
    const animal = this.animals[this.currentAnimal];
    const inscriptionBox = document.getElementById('dream-inscription-text');

    if (window.dreamAudio) {
      window.dreamAudio.playMagicWeave();
    }

    if (window.dreamCanvas) {
      const rect = document.querySelector('.lantern-frame')?.getBoundingClientRect();
      if (rect) {
        window.dreamCanvas.spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35, this.currentColor);
      }
    }

    // Generate poetic dream inscription
    const ingredientsList = Array.from(this.ingredients).join(' & ');
    const prophecies = [
      `“Woven with ${ingredientsList}: May ${animal.name} wander through moonlit groves where every fallen acorn smells of sweet honey.”`,
      `“Infused with ${ingredientsList}: A gentle breeze sweeps through ${animal.burrow}, washing away all fright and turning shadows into warm velvet.”`,
      `“Spun from ${ingredientsList}: Tonight, ${animal.name} floats upon silver waters, guarded by Barnaby's softest starlight thread.”`
    ];

    const chosen = prophecies[Math.floor(Math.random() * prophecies.length)];
    if (inscriptionBox) {
      inscriptionBox.style.opacity = 0;
      setTimeout(() => {
        inscriptionBox.textContent = chosen;
        inscriptionBox.style.opacity = 1;
      }, 200);
    }

    this.showToast(`✨ Dream woven for ${animal.name}!`);
  }

  releaseLantern() {
    const holder = document.querySelector('.lantern-holder');
    const animal = this.animals[this.currentAnimal];
    if (!holder || holder.classList.contains('float-away')) return;

    if (window.dreamAudio) {
      window.dreamAudio.playMagicWeave();
    }

    holder.classList.add('float-away');

    this.showToast(`🏮 Releasing Slumber Lantern to ${animal.burrow}...`);

    setTimeout(() => {
      holder.classList.remove('float-away');
      this.showToast(`💤 ${animal.name} received your dream and is resting peacefully.`);
    }, 3200);
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

    setTimeout(() => {
      toast.remove();
    }, 3800);
  }
}

// Global Lantern Studio
window.slumberLanternStudio = null;
document.addEventListener('DOMContentLoaded', () => {
  window.slumberLanternStudio = new SlumberLanternStudio();
});
