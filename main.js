/**
 * Barnaby's Dream World - Main Controller & App Orchestrator
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeManager();
  initNavigation();
  initInventionTabs();
  initOriginStoryInteractions();
  initHeaderAudioButton();
  initBadgeModalCloser();
});

/* ==========================================================================
   1. Day / Twilight / Night / Dreamtime Theme Manager
   ========================================================================== */
function initThemeManager() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themes = ['night', 'twilight', 'day', 'dream'];
  const themeIcons = {
    'night': '🌙',
    'twilight': '🌅',
    'day': '☀️',
    'dream': '🌌'
  };

  let currentThemeIndex = 0;

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      const newTheme = themes[currentThemeIndex];

      document.documentElement.setAttribute('data-theme', newTheme);
      themeBtn.innerHTML = themeIcons[newTheme];
      themeBtn.setAttribute('title', `Current Theme: ${newTheme.toUpperCase()}`);

      if (window.dreamCanvas) {
        window.dreamCanvas.setTheme(newTheme);
      }

      if (window.dreamAudio) {
        window.dreamAudio.playChime('C5', 0.5);
      }

      // Show toast
      showGlobalToast(`Time of Day changed to: ${newTheme.toUpperCase()}`);
    });
  }
}

/* ==========================================================================
   2. Navigation & Sticky Scroll Spy
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navList = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    // Header shadow/blur on scroll
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy for active link
    const scrollPos = window.scrollY + 200;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && navList) {
    mobileToggle.addEventListener('click', () => {
      const isVisible = navList.style.display === 'flex';
      navList.style.display = isVisible ? 'none' : 'flex';
      navList.style.flexDirection = 'column';
      navList.style.position = 'absolute';
      navList.style.top = '72px';
      navList.style.left = '0';
      navList.style.width = '100%';
      navList.style.background = 'var(--nav-bg)';
      navList.style.padding = '1.5rem';
    });
  }
}

/* ==========================================================================
   3. Inventions Section Tabs
   ========================================================================== */
function initInventionTabs() {
  const tabs = document.querySelectorAll('.invention-tab-btn');
  const panels = document.querySelectorAll('.invention-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      const targetPanel = document.getElementById(targetId);

      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      if (window.dreamAudio) {
        window.dreamAudio.playClick();
      }
    });
  });
}

/* ==========================================================================
   4. Origin Story Interactive Moments (Scene by Scene)
   ========================================================================== */
function initOriginStoryInteractions() {
  // Chapter 1: Awaken the Moon-Spark
  const ch1Btn = document.getElementById('ch1-action-btn');
  if (ch1Btn) {
    ch1Btn.addEventListener('click', () => {
      ch1Btn.classList.add('done');
      ch1Btn.textContent = '✨ Spark Awakened!';
      ch1Btn.closest('.chapter-interactive-action').classList.add('completed');
      if (window.dreamAudio) window.dreamAudio.playChime('C5');
      if (window.dreamCanvas) {
        const rect = ch1Btn.getBoundingClientRect();
        window.dreamCanvas.spawnBurst(rect.left + rect.width / 2, rect.top, 25, '#ffd166');
      }
      showGlobalToast('✨ Chapter I: The cold winter moss glows with Barnaby’s first spectral breath.');
    });
  }

  // Chapter 2: Soothe the Little Mouse
  const ch2Btn = document.getElementById('ch2-action-btn');
  if (ch2Btn) {
    ch2Btn.addEventListener('click', () => {
      ch2Btn.classList.add('done');
      ch2Btn.textContent = '💤 Nightmare Dissolved!';
      ch2Btn.closest('.chapter-interactive-action').classList.add('completed');
      if (window.dreamAudio) window.dreamAudio.playLullaby('otter');
      if (window.dreamCanvas) {
        const rect = ch2Btn.getBoundingClientRect();
        window.dreamCanvas.spawnBurst(rect.left + rect.width / 2, rect.top, 25, '#86e3ce');
      }
      showGlobalToast('🌸 Chapter II: The field mouse nestles in safe velvet slumber.');
    });
  }

  // Chapter 3: Thread the Silver Needle
  const ch3Btn = document.getElementById('ch3-action-btn');
  if (ch3Btn) {
    ch3Btn.addEventListener('click', () => {
      ch3Btn.classList.add('done');
      ch3Btn.textContent = '🪡 Moonbeam Threaded!';
      ch3Btn.closest('.chapter-interactive-action').classList.add('completed');
      if (window.dreamAudio) window.dreamAudio.playMagicWeave();
      if (window.dreamCanvas) {
        const rect = ch3Btn.getBoundingClientRect();
        window.dreamCanvas.spawnBurst(rect.left + rect.width / 2, rect.top, 30, '#c288f8');
      }
      showGlobalToast('🌟 Chapter III: Spun starlight now flows through Barnaby’s pine needle spindle.');
    });
  }

  // Chapter 4: Light the Slumber Sanctuary
  const ch4Btn = document.getElementById('ch4-action-btn');
  if (ch4Btn) {
    ch4Btn.addEventListener('click', () => {
      ch4Btn.classList.add('done');
      ch4Btn.textContent = '🏮 Sanctuary Glowing!';
      ch4Btn.closest('.chapter-interactive-action').classList.add('completed');
      if (window.dreamAudio) window.dreamAudio.playSecretUnlock();
      if (window.dreamCanvas) {
        const rect = ch4Btn.getBoundingClientRect();
        window.dreamCanvas.spawnBurst(rect.left + rect.width / 2, rect.top, 40, '#ffd166');
      }
      showGlobalToast('🏮 Chapter IV: The Great Oak is now the safe haven for all sleeping hearts.');
    });
  }
}

/* ==========================================================================
   5. Header Master Audio Button
   ========================================================================== */
function initHeaderAudioButton() {
  const audioBtn = document.getElementById('master-audio-toggle');
  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    if (window.dreamAudio) {
      const isMuted = window.dreamAudio.toggleMute();
      if (isMuted) {
        audioBtn.classList.remove('playing');
        audioBtn.innerHTML = '🔇 <span class="audio-pulse-ring"></span>';
        audioBtn.setAttribute('title', 'Unmute sounds');
        showGlobalToast('🔇 Gentle sounds muted');
      } else {
        audioBtn.classList.add('playing');
        audioBtn.innerHTML = '🎵 <span class="audio-pulse-ring"></span>';
        audioBtn.setAttribute('title', 'Mute sounds');
        window.dreamAudio.playChime('C5');
        // Start soft background wind
        window.dreamAudio.setAmbientLevel('wind', 0.25);
        showGlobalToast('🎶 Gentle celestial sounds playing');
      }
    }
  });
}

/* ==========================================================================
   6. Badge Modal Closer
   ========================================================================== */
function initBadgeModalCloser() {
  const badgeModal = document.getElementById('achievement-badge-modal');
  const closeBtn = document.getElementById('close-badge-modal-btn');

  if (closeBtn && badgeModal) {
    closeBtn.addEventListener('click', () => {
      badgeModal.classList.remove('active');
    });
  }

  if (badgeModal) {
    badgeModal.addEventListener('click', (e) => {
      if (e.target === badgeModal) badgeModal.classList.remove('active');
    });
  }
}

/* Helper Toast Function */
function showGlobalToast(msg) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3800);
}
