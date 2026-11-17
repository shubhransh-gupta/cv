/**
 * Sagar-Inspired High Performance Portfolio Engine
 * Zero external dependencies | 60 FPS Locked on Budget Devices
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. LIVE INDIAN LOCAL TIME CLOCK (GMT +5:30)
  // --------------------------------------------------------------------------
  function initLiveClock() {
    const clockElements = document.querySelectorAll('[data-live-clock]');
    if (!clockElements.length) return;

    function updateClock() {
      const now = new Date();
      // Calculate IST (UTC + 5 hours 30 mins)
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      const istTime = new Date(utcTime + (3600000 * 5.5));

      const hours = String(istTime.getHours()).padStart(2, '0');
      const minutes = String(istTime.getMinutes()).padStart(2, '0');
      const seconds = String(istTime.getSeconds()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}:${seconds} in India · GMT +5:30`;

      clockElements.forEach(el => {
        el.textContent = timeStr;
      });
    }

    updateClock();
    setInterval(updateClock, 1000);
  }

  // --------------------------------------------------------------------------
  // 2. HERO RUNWAY SCROLL TRANSLATION & MOUSE TILT ENGINE
  // Exact shubhransh.is-a.dev scroll-driven character & workspace diorama
  // --------------------------------------------------------------------------
  function initHeroScrollEngine() {
    const runway = document.getElementById('hero-runway');
    const deskComposite = document.getElementById('hero-desk-composite');
    const headline = document.getElementById('hero-headline-wrap');
    const pointer = document.getElementById('hero-character-pointer');
    const bottomGrid = document.getElementById('hero-bottom-grid');
    const skyClouds = document.querySelector('.hero-sky-clouds');

    let mouseRotX = 0;
    let mouseRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let scrollProgress = 0;

    function onMouseMove(e) {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mouseRotY = x * 8;
      mouseRotX = -y * 6;
    }

    function onMouseLeave() {
      mouseRotX = 0;
      mouseRotY = 0;
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });

    function calculateScrollProgress() {
      if (!runway) {
        scrollProgress = 0;
        return;
      }
      const rect = runway.getBoundingClientRect();
      const scrollDistance = runway.offsetHeight - window.innerHeight;
      if (scrollDistance <= 0) {
        scrollProgress = 0;
        return;
      }
      scrollProgress = Math.min(1, Math.max(0, -rect.top / scrollDistance));
    }

    window.addEventListener('scroll', calculateScrollProgress, { passive: true });
    window.addEventListener('resize', calculateScrollProgress, { passive: true });
    calculateScrollProgress();

    function renderLoop() {
      currentRotX += (mouseRotX - currentRotX) * 0.1;
      currentRotY += (mouseRotY - currentRotY) * 0.1;

      const p = scrollProgress;

      // Character & Hands: Gently tilts with mouse, scales with perspective
      if (deskComposite) {
        deskComposite.style.transform = `perspective(1200px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
      }

      // Headline scrolls up and fades
      if (headline) {
        headline.style.transform = `translate3d(0, ${(-p * 70).toFixed(1)}px, 0)`;
        headline.style.opacity = Math.max(0, 1 - p * 2.2).toFixed(2);
      }

      // Pointer and bottom controls fade out early
      if (pointer) {
        pointer.style.opacity = Math.max(0, 1 - p * 3).toFixed(2);
      }
      if (bottomGrid) {
        bottomGrid.style.opacity = Math.max(0, 1 - p * 2.5).toFixed(2);
      }

      // Sky clouds slight parallax drift
      if (skyClouds) {
        skyClouds.style.transform = `translate3d(0, ${(p * 40).toFixed(1)}px, 0)`;
      }

      requestAnimationFrame(renderLoop);
    }

    renderLoop();
  }

  // --------------------------------------------------------------------------
  // 3. PERSISTENT HOPPING MASCOT ACROSS SECTIONS
  // Character travels across containers, speaks contextually, sits at table on back-to-top
  // --------------------------------------------------------------------------
  function initHoppingMascot() {
    const mascot = document.getElementById('jumping-mascot-container');
    const bubble = document.getElementById('mascot-speech-bubble');
    const mascotImg = document.getElementById('jumping-mascot-img');
    if (!mascot) return;

    const quotes = [
      "Leading 50M+ users @ Coupang ⚡",
      "99.98% crash-free stability 🛡️",
      "Zero memory leaks in Instruments 🎯",
      "Swift 6 strict concurrency active 🍏",
      "120Hz ProMotion locked! 🚀"
    ];
    let quoteIdx = 0;

    const sections = [
      { id: 'journey', text: '04. Coupang (Current) → 50M+ scale 🚀' },
      { id: 'projects', text: 'Tap the YouTube demo to play! ▶' },
      { id: 'workflow', text: 'Listen → Architect → Build → Ship ⚡' },
      { id: 'open-source', text: 'Apple & Google upstream PRs ⭐' },
      { id: 'faq', text: 'Got questions? Search the FAQ sheet 💡' },
      { id: 'contact', text: "Let's build something epic! ✉" }
    ];

    function updateMascot() {
      const scrollY = window.scrollY;

      // When at the top (Hero stage), mascot is resting on the hero desk table!
      if (scrollY < 280) {
        mascot.classList.remove('visible');
        return;
      }

      mascot.classList.add('visible');

      // Detect active section
      let activeText = quotes[quoteIdx];
      const scrollMiddle = scrollY + window.innerHeight * 0.5;

      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          const bottom = top + el.offsetHeight;
          if (scrollMiddle >= top && scrollMiddle < bottom) {
            activeText = sec.text;
            break;
          }
        }
      }

      if (bubble && bubble.textContent !== activeText) {
        bubble.textContent = activeText;
      }
    }

    window.addEventListener('scroll', updateMascot, { passive: true });
    updateMascot();

    // Click on mascot triggers fun hop jump animation & cycles quote
    if (mascotImg) {
      mascotImg.addEventListener('click', () => {
        quoteIdx = (quoteIdx + 1) % quotes.length;
        if (bubble) bubble.textContent = quotes[quoteIdx];

        mascotImg.animate([
          { transform: 'scale(1) translateY(0)' },
          { transform: 'scale(1.2, 0.8) translateY(-28px)' },
          { transform: 'scale(0.9, 1.1) translateY(4px)' },
          { transform: 'scale(1) translateY(0)' }
        ], { duration: 450, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });
      });
    }
  }

  // --------------------------------------------------------------------------
  // 4. MACBOOK INTERACTIVE TABS & SIMULATED YOUTUBE PLAYER
  // --------------------------------------------------------------------------
  function initMacbookTabs() {
    const tabBtns = document.querySelectorAll('[data-mac-tab]');
    const panels = {
      demo: document.getElementById('mac-panel-demo'),
      code: document.getElementById('mac-panel-code'),
      telemetry: document.getElementById('mac-panel-telemetry')
    };
    const ytTrigger = document.getElementById('yt-play-trigger');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tabKey = btn.getAttribute('data-mac-tab');
        Object.keys(panels).forEach(key => {
          if (panels[key]) {
            panels[key].classList.toggle('active', key === tabKey);
          }
        });
      });
    });

    if (ytTrigger) {
      let isPlaying = false;
      ytTrigger.addEventListener('click', () => {
        isPlaying = !isPlaying;
        const playBtn = ytTrigger.querySelector('.yt-play-btn');
        const eqBars = document.querySelector('.yt-eq-bars');
        const scrubFill = document.querySelector('.yt-scrub-fill');

        if (isPlaying) {
          playBtn.style.background = '#10b981';
          playBtn.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.5)';
          if (scrubFill) scrubFill.style.width = '88%';
        } else {
          playBtn.style.background = '#ff0000';
          playBtn.style.boxShadow = '0 10px 25px rgba(255, 0, 0, 0.4)';
          if (scrubFill) scrubFill.style.width = '72%';
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 3. FAQ ACCORDION ENGINE
  // --------------------------------------------------------------------------
  function initFaqAccordion() {
    const faqCards = document.querySelectorAll('.faq-card');
    if (!faqCards.length) return;

    faqCards.forEach(card => {
      const btn = card.querySelector('.faq-question');
      if (!btn) return;

      btn.addEventListener('click', () => {
        const isOpen = card.classList.contains('open');

        // Close other open cards for clean single-focus accordion
        faqCards.forEach(c => c.classList.remove('open'));

        if (!isOpen) {
          card.classList.add('open');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. FULLSCREEN SWISS MENU DRAWER
  // --------------------------------------------------------------------------
  function initDrawer() {
    const menuBtn = document.getElementById('menu-toggle-btn');
    const drawer = document.getElementById('shubhransh-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-sublink');
    if (!menuBtn || !drawer) return;

    let isOpen = false;

    function toggleMenu() {
      isOpen = !isOpen;
      if (isOpen) {
        drawer.classList.add('open');
        menuBtn.textContent = 'CLOSE';
        document.body.style.overflow = 'hidden';
      } else {
        drawer.classList.remove('open');
        menuBtn.textContent = 'MENU';
        document.body.style.overflow = '';
      }
    }

    menuBtn.addEventListener('click', toggleMenu);

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (isOpen) toggleMenu();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) toggleMenu();
    });
  }

  // --------------------------------------------------------------------------
  // 4. INTERACTIVE 3D MACBOOK DEVICE STAGE
  // Hardware-accelerated CSS 3D transforms with IntersectionObserver pausing
  // --------------------------------------------------------------------------
  function initMacbookStage() {
    const stage = document.getElementById('macbook-stage');
    const wrapper = document.getElementById('macbook-wrapper');
    if (!stage || !wrapper) return;

    let isVisible = true;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;

    // Observe stage visibility to halt RAF when offscreen
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible) {
        startLoop();
      } else if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }, { threshold: 0.05 });

    observer.observe(stage);

    function onMouseMove(e) {
      if (!isVisible) return;
      const rect = stage.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Subtle tilt angles (max +/- 8 deg)
      targetY = (x / (rect.width / 2)) * 8;
      targetX = -(y / (rect.height / 2)) * 6;
    }

    function onMouseLeave() {
      targetX = 0;
      targetY = 0;
    }

    stage.addEventListener('mousemove', onMouseMove, { passive: true });
    stage.addEventListener('mouseleave', onMouseLeave, { passive: true });

    function startLoop() {
      if (rafId) return;

      function tick() {
        if (!isVisible) {
          rafId = null;
          return;
        }

        // Smooth lerp (linear interpolation)
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;

        wrapper.style.transform = `perspective(1000px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg)`;
        rafId = requestAnimationFrame(tick);
      }

      rafId = requestAnimationFrame(tick);
    }

    startLoop();
  }

  // --------------------------------------------------------------------------
  // 5. INTERACTIVE 4-STEP WORKFLOW TABS
  // --------------------------------------------------------------------------
  function initWorkflowTabs() {
    const tabButtons = document.querySelectorAll('[data-step-tab]');
    const tabPanels = document.querySelectorAll('[data-step-panel]');
    if (!tabButtons.length || !tabPanels.length) return;

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const step = btn.getAttribute('data-step-tab');

        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const activePanel = document.querySelector(`[data-step-panel="${step}"]`);
        if (activePanel) activePanel.classList.add('active');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. PROCEDURAL AMBIENT AUDIO SYNTHESIZER
  // Zero MP3 download size! Pure Web Audio API pentatonic chord synthesizer
  // --------------------------------------------------------------------------
  function initAudioSynthesizer() {
    const audioBtn = document.getElementById('audio-toggle-btn');
    const audioLabel = document.getElementById('audio-toggle-label');
    if (!audioBtn) return;

    let audioCtx = null;
    let isPlaying = false;
    let intervalId = null;

    // Ambient Pentatonic Chords (C Major Pentatonic frequencies in Hz)
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];

    function playChime() {
      if (!audioCtx || !isPlaying) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        const note = notes[Math.floor(Math.random() * notes.length)];
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, audioCtx.currentTime);

        // Soft attack & long decay
        gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.05, audioCtx.currentTime + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 3.4);
      } catch (err) {
        console.warn('Audio play chime error:', err);
      }
    }

    function toggleAudio() {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        audioCtx = new AudioContextClass();
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      isPlaying = !isPlaying;

      if (isPlaying) {
        audioBtn.classList.add('playing');
        if (audioLabel) audioLabel.textContent = 'Sound on';
        playChime();
        intervalId = setInterval(playChime, 2400);
      } else {
        audioBtn.classList.remove('playing');
        if (audioLabel) audioLabel.textContent = 'Sound off';
        if (intervalId) clearInterval(intervalId);
      }
    }

    audioBtn.addEventListener('click', toggleAudio);
  }

  // --------------------------------------------------------------------------
  // 7. HIGH-PERFORMANCE TRAILING CURSOR
  // Pure translate3d with zero paint invalidation, disabled on touch
  // --------------------------------------------------------------------------
  function initCustomCursor() {
    if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) return;

    const cursor = document.getElementById('shubhransh-cursor');
    if (!cursor) return;

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMoving) {
        cursor.classList.add('active');
        isMoving = true;
      }
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
    });

    // Expand cursor over interactive elements
    const interactiveSelectors = 'a, button, input, .project-editorial-card, .step-tab-btn, .theme-pill-btn';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursor.classList.add('hovering');
      }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursor.classList.remove('hovering');
      }
    }, { passive: true });

    function renderCursor() {
      cursorX += (mouseX - cursorX) * 0.22;
      cursorY += (mouseY - cursorY) * 0.22;

      cursor.style.transform = `translate3d(${cursorX - 9}px, ${cursorY - 9}px, 0)`;
      requestAnimationFrame(renderCursor);
    }

    requestAnimationFrame(renderCursor);
  }

  // --------------------------------------------------------------------------
  // 8. BACK TO TOP SMOOTH SCROLL
  // --------------------------------------------------------------------------
  function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // INITIALIZE ENGINE ON DOM READY
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initLiveClock();
    initHeroScrollEngine();
    initDrawer();
    initWorkflowTabs();
    initFaqAccordion();
    initAudioSynthesizer();
    initCustomCursor();
    initBackToTop();
  });
})();
