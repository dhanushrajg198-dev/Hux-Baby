/**
 * Invention 2: The Celestial Chime Box
 * Handles interactive 8-note chime celesta keyboard, lullaby sequencing, and ambient mixer controls.
 */

class CelestialChimeBox {
  constructor() {
    this.keyMap = {
      '1': 'C4', '2': 'D4', '3': 'E4', '4': 'G4',
      '5': 'A4', '6': 'C5', '7': 'D5', '8': 'E5'
    };
    this.init();
  }

  init() {
    this.setupChimeKeys();
    this.setupLullabyPresets();
    this.setupAmbientMixer();
    this.setupKeyboardShortcuts();
  }

  setupChimeKeys() {
    const keys = document.querySelectorAll('.chime-key');
    keys.forEach(key => {
      const note = key.getAttribute('data-note');

      const triggerKey = () => {
        if (window.dreamAudio) {
          window.dreamAudio.playChime(note);
        }
        this.highlightKey(key);

        // Spawn gentle sparkle on the key
        const rect = key.getBoundingClientRect();
        if (window.dreamCanvas) {
          window.dreamCanvas.spawnBurst(rect.left + rect.width / 2, rect.top + 30, 10, '#86e3ce');
        }
      };

      key.addEventListener('mousedown', (e) => {
        e.preventDefault();
        triggerKey();
      });

      key.addEventListener('touchstart', (e) => {
        e.preventDefault();
        triggerKey();
      }, { passive: false });
    });
  }

  highlightKey(keyElement) {
    if (!keyElement) return;
    keyElement.classList.add('pressed');
    setTimeout(() => {
      keyElement.classList.remove('pressed');
    }, 280);
  }

  setupLullabyPresets() {
    const presetBtns = document.querySelectorAll('.preset-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.getAttribute('data-preset');

        if (btn.classList.contains('playing')) {
          // Stop playing
          if (window.dreamAudio) window.dreamAudio.stopLullaby();
          btn.classList.remove('playing');
          btn.innerHTML = `<span class="icon">▶</span> ${btn.getAttribute('data-title')}`;
        } else {
          // Stop any other preset
          presetBtns.forEach(b => {
            b.classList.remove('playing');
            b.innerHTML = `<span class="icon">▶</span> ${b.getAttribute('data-title')}`;
          });

          btn.classList.add('playing');
          btn.innerHTML = `<span class="icon">⏸</span> Pause ${btn.getAttribute('data-title')}`;

          if (window.dreamAudio) {
            window.dreamAudio.playLullaby(
              preset,
              (note) => {
                const activeKey = document.querySelector(`.chime-key[data-note="${note}"]`);
                this.highlightKey(activeKey);
              },
              () => {
                btn.classList.remove('playing');
                btn.innerHTML = `<span class="icon">▶</span> ${btn.getAttribute('data-title')}`;
              }
            );
          }
        }
      });
    });
  }

  setupAmbientMixer() {
    const channels = ['wind', 'rain', 'crickets', 'hum'];
    channels.forEach(ch => {
      const slider = document.getElementById(`ambient-${ch}-slider`);
      if (slider) {
        slider.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          if (window.dreamAudio) {
            window.dreamAudio.setAmbientLevel(ch, val);
          }
        });
      }
    });
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Avoid if user is focused on an input/select
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      const note = this.keyMap[e.key];
      if (note) {
        const keyEl = document.querySelector(`.chime-key[data-note="${note}"]`);
        if (keyEl) {
          if (window.dreamAudio) window.dreamAudio.playChime(note);
          this.highlightKey(keyEl);
        }
      }
    });
  }
}

// Global Celestial Chime Box
document.addEventListener('DOMContentLoaded', () => {
  window.celestialChimeBox = new CelestialChimeBox();
});
