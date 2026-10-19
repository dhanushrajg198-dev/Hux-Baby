/**
 * Invention 3: Moonlit Bedtime Storybook & Custom Tale Weaver
 * Handles the interactive page-turn storybook and dynamic bedtime story generator.
 */

class MoonlitStorybook {
  constructor() {
    this.currentPage = 0;
    this.pages = [
      {
        chapter: 'Chapter I • The Silent Canopy',
        title: 'The Night the Moon Forgot to Sing',
        text: 'High in the knot of the Grand Willow, Barnaby felt an unusual quiet settled over Mosswood Grove. The stars were awake, but the Moon was hidden behind a dense cloak of velvet mist. Without moonlight, the forest animals tossed and turned, startled by restless shadows.',
        art: '🌙🌲🦉',
        artBg: 'radial-gradient(circle, #2d3867 0%, #111425 70%)'
      },
      {
        chapter: 'Chapter II • The Shiver in the Snow',
        title: 'A Whimper in the Hollow',
        text: 'Barnaby floated down through frosted fern branches and discovered a little fawn shivering beneath an elderberry bush. “I cannot find the warm clover meadow in the dark,” whispered the fawn. Barnaby gently touched her ear and unclipped his silver pine needle from his starry nightcap.',
        art: '🦌❄️✨',
        artBg: 'radial-gradient(circle, #3d2d58 0%, #111425 70%)'
      },
      {
        chapter: 'Chapter III • Moonbeam Stitching',
        title: 'Spun from Stardust & Mint',
        text: 'Looping his needle through a wandering spark of stardust, Barnaby spun a thread scented with lavender and wild peppermint. Stitch by gentle stitch, he wove a glowing dream quilt over the fawn’s forehead. The little fawn breathed a contented sigh, dreaming of sunny clover hills.',
        art: '🪡🌟🌿',
        artBg: 'radial-gradient(circle, #224d45 0%, #111425 70%)'
      },
      {
        chapter: 'Chapter IV • The Slumber Sanctuaries',
        title: 'All Asleep in Mosswood',
        text: 'Before the dawn could break, Barnaby tucked dream lanterns beside every burrow, river hollow, and tree hollow. The restless mist drifted away into soft morning dew. As Barnaby nestled into his own thimble hammock, the grove sighed with peace.',
        art: '🏮🦊💤',
        artBg: 'radial-gradient(circle, #48332a 0%, #111425 70%)'
      }
    ];

    this.init();
  }

  init() {
    this.setupSubnav();
    this.setupStorybookReader();
    this.setupTaleWeaver();
  }

  setupSubnav() {
    const readerBtn = document.getElementById('story-mode-reader');
    const weaverBtn = document.getElementById('story-mode-weaver');
    const readerPanel = document.getElementById('storybook-reader-view');
    const weaverPanel = document.getElementById('storybook-weaver-view');

    if (readerBtn && weaverBtn) {
      readerBtn.addEventListener('click', () => {
        readerBtn.classList.add('active');
        weaverBtn.classList.remove('active');
        readerPanel.style.display = 'grid';
        weaverPanel.style.display = 'none';
        if (window.dreamAudio) window.dreamAudio.playClick();
      });

      weaverBtn.addEventListener('click', () => {
        weaverBtn.classList.add('active');
        readerBtn.classList.remove('active');
        weaverPanel.style.display = 'grid';
        readerPanel.style.display = 'none';
        if (window.dreamAudio) window.dreamAudio.playClick();
      });
    }
  }

  setupStorybookReader() {
    const prevBtn = document.getElementById('book-prev-page');
    const nextBtn = document.getElementById('book-next-page');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentPage > 0) {
          this.currentPage--;
          this.renderPage();
          if (window.dreamAudio) window.dreamAudio.playClick();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentPage < this.pages.length - 1) {
          this.currentPage++;
          this.renderPage();
          if (window.dreamAudio) window.dreamAudio.playClick();
        }
      });
    }

    this.renderPage();
  }

  renderPage() {
    const page = this.pages[this.currentPage];
    if (!page) return;

    const chapterEl = document.getElementById('book-chapter-num');
    const titleEl = document.getElementById('book-story-title');
    const textEl = document.getElementById('book-story-text');
    const artEl = document.getElementById('book-page-art');
    const artBox = document.querySelector('.book-page-left');
    const pageCounter = document.getElementById('book-page-counter');
    const prevBtn = document.getElementById('book-prev-page');
    const nextBtn = document.getElementById('book-next-page');

    if (chapterEl) chapterEl.textContent = page.chapter;
    if (titleEl) titleEl.textContent = page.title;
    if (textEl) textEl.textContent = page.text;
    if (artEl) artEl.textContent = page.art;
    if (artBox) artBox.style.background = page.artBg;
    if (pageCounter) pageCounter.textContent = `Page ${this.currentPage + 1} of ${this.pages.length}`;

    if (prevBtn) prevBtn.disabled = this.currentPage === 0;
    if (nextBtn) nextBtn.disabled = this.currentPage === this.pages.length - 1;
  }

  setupTaleWeaver() {
    const weaveBtn = document.getElementById('weave-custom-story-btn');
    const whisperBtn = document.getElementById('whisper-story-btn');
    const copyBtn = document.getElementById('copy-custom-story-btn');

    if (weaveBtn) {
      weaveBtn.addEventListener('click', () => this.generateCustomStory());
    }

    if (whisperBtn) {
      whisperBtn.addEventListener('click', () => {
        if (window.dreamAudio) {
          window.dreamAudio.playLullaby('stardust');
          this.showToast('🎶 Barnaby is humming a gentle bedtime accompaniment...');
        }
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const body = document.getElementById('custom-story-body')?.textContent;
        if (body) {
          navigator.clipboard.writeText(body).then(() => {
            this.showToast('📜 Story copied to clipboard! Ready for bedtime reading.');
          }).catch(() => {
            this.showToast('📜 Bedtime story saved!');
          });
        }
      });
    }
  }

  generateCustomStory() {
    const hero = document.getElementById('story-hero-select')?.value || 'Little Red Fox';
    const place = document.getElementById('story-place-select')?.value || 'The Old Willow Hollow';
    const adventure = document.getElementById('story-adventure-select')?.value || 'floating inside a warm marshmallow cloud';
    const blessing = document.getElementById('story-blessing-select')?.value || 'gentle chamomile dew rain';

    const titleEl = document.getElementById('custom-story-title');
    const bodyEl = document.getElementById('custom-story-body');

    if (window.dreamAudio) {
      window.dreamAudio.playMagicWeave();
    }

    if (window.dreamCanvas) {
      const rect = document.querySelector('.parchment-scroll')?.getBoundingClientRect();
      if (rect) {
        window.dreamCanvas.spawnBurst(rect.left + rect.width / 2, rect.top + 60, 25, '#ffd166');
      }
    }

    const storyText = `Once upon a twilight deep within Mosswood, ${hero} nestled into ${place}. Outside, the dark night settled softly like blue velvet, and tired little eyes began to grow heavy.\n\nBarnaby floated quietly through the reeds, his star-bell chiming at the edge of hearing. With a flick of his silver pine needle, he spun a luminous ribbon around ${hero}'s sleepy thoughts.\n\nSoon, ${hero} began ${adventure}. High above the tree canopy, where star-petals tumbled like warm snow, there was no fear, no cold, and no loneliness—only the soothing gift of ${blessing}.\n\n“Sleep warmly, little wanderer,” whispered Barnaby into the evening air. “The grove is watching over you until the sun wakes.”`;

    if (titleEl) {
      titleEl.textContent = `The Slumber of ${hero}`;
    }
    if (bodyEl) {
      bodyEl.textContent = storyText;
    }

    this.showToast(`✨ A unique bedtime tale has been woven for ${hero}!`);
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

// Global Storybook
document.addEventListener('DOMContentLoaded', () => {
  window.moonlitStorybook = new MoonlitStorybook();
});
