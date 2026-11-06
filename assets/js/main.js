/**
 * Shubhransh Gupta — Nature Heaven & Liquid UI Engine
 * Features:
 * 1. Living Nature Atmosphere Canvas (Pollen, Spores, Fireflies)
 * 2. Liquid UI Sliding Capsule for Nav & Button Clusters
 * 3. Scroll-Driven Hero Cloud Dissolve & Blur (clean header clearance)
 * 4. Bulletproof Skills Tab Switcher (event delegation)
 * 5. Expandable Projects / Big Tech OSS Drawer
 * 6. Story Carousel with Touch & Dot Sync
 * 7. 3D Card Tilt with Sunbeam Light Tracking
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initHeaderScroll();
    initMobileNav();
    initNatureAtmosphere();
    initLiquidNavigation();
    initLiquidButtonCluster();
    initSkillTabs();
    initProjectsDrawer();
    initStoryCarousel();
    initScrollReveals();
    initCardSunbeamTilt();
    initSmoothAnchors();
  });

  /* --------------------------------------------------------------------------
     1. SITE HEADER SCROLL OBSERVER
     -------------------------------------------------------------------------- */
  function initHeaderScroll() {
    var header = document.getElementById('site-header');
    if (!header) return;

    var handleScroll = function () {
      if (window.scrollY > 35) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* --------------------------------------------------------------------------
     2. MOBILE NAVIGATION DRAWER
     -------------------------------------------------------------------------- */
  function initMobileNav() {
    var toggle = document.getElementById('nav-toggle');
    var navLinks = document.getElementById('nav-links');
    if (!toggle || !navLinks) return;

    var backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    function closeNav() {
      toggle.classList.remove('active');
      navLinks.classList.remove('open');
      backdrop.classList.remove('visible');
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
    }

    function openNav() {
      toggle.classList.add('active');
      navLinks.classList.add('open');
      backdrop.classList.add('visible');
      document.body.style.overflow = 'hidden';
      toggle.setAttribute('aria-expanded', 'true');
    }

    toggle.addEventListener('click', function () {
      if (navLinks.classList.contains('open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    backdrop.addEventListener('click', closeNav);

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeNav();
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. LIVING NATURE ATMOSPHERE CANVAS (POLLEN, FIREFLIES & BREEZE)
     -------------------------------------------------------------------------- */
  function initNatureAtmosphere() {
    var canvas = document.getElementById('nature-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var width, height;
    var particles = [];
    var maxParticles = window.innerWidth < 768 ? 28 : 56;
    var mouse = { x: -1000, y: -1000, radius: 140 };

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', function () {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    function Particle() {
      this.reset(true);
    }

    Particle.prototype.reset = function (initial) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 15;
      this.type = Math.random() > 0.4 ? 'pollen' : (Math.random() > 0.5 ? 'firefly' : 'seed');

      if (this.type === 'firefly') {
        this.size = Math.random() * 2.2 + 1.8;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -(Math.random() * 0.45 + 0.2);
        this.pulse = Math.random() * Math.PI;
        this.pulseSpeed = Math.random() * 0.04 + 0.02;
        this.color = '245, 180, 40';
      } else if (this.type === 'pollen') {
        this.size = Math.random() * 1.8 + 1.2;
        this.vx = (Math.random() - 0.3) * 0.45;
        this.vy = -(Math.random() * 0.5 + 0.25);
        this.pulse = Math.random() * Math.PI;
        this.pulseSpeed = 0.02;
        this.color = '230, 200, 110';
      } else {
        this.size = Math.random() * 2.0 + 1.0;
        this.vx = (Math.random() - 0.4) * 0.3;
        this.vy = -(Math.random() * 0.3 + 0.15);
        this.pulse = 0;
        this.pulseSpeed = 0;
        this.color = '255, 255, 255';
      }
      this.baseAlpha = Math.random() * 0.45 + 0.25;
      this.alpha = this.baseAlpha;
      this.swayAngle = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.015 + 0.008;
    };

    Particle.prototype.update = function () {
      this.swayAngle += this.swaySpeed;
      this.x += this.vx + Math.sin(this.swayAngle) * 0.35;
      this.y += this.vy;

      if (this.type === 'firefly') {
        this.pulse += this.pulseSpeed;
        this.alpha = this.baseAlpha * (0.5 + 0.5 * Math.sin(this.pulse));
      }

      var dx = this.x - mouse.x;
      var dy = this.y - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius && dist > 0) {
        var force = (mouse.radius - dist) / mouse.radius;
        var angle = Math.atan2(dy, dx);
        this.x += Math.cos(angle) * force * 3.5;
        this.y += Math.sin(angle) * force * 3.5;
      }

      if (this.y < -20 || this.x < -30 || this.x > width + 30) {
        this.reset(false);
      }
    };

    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + this.color + ', ' + this.alpha + ')';
      ctx.fill();

      if (this.type === 'firefly' && this.alpha > 0.3) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + this.color + ', ' + (this.alpha * 0.2) + ')';
        ctx.fill();
      }
    };

    for (var i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (var j = 0; j < particles.length; j++) {
        particles[j].update();
        particles[j].draw();
      }
      requestAnimationFrame(animate);
    }

    animate();
  }

  /* --------------------------------------------------------------------------
     4. LIQUID UI SLIDING CAPSULE (HEADER NAVIGATION)
     -------------------------------------------------------------------------- */
  function initLiquidNavigation() {
    var navLinks = document.getElementById('nav-links');
    if (!navLinks) return;

    var links = navLinks.querySelectorAll('.nav-link');
    if (links.length === 0) return;

    var liquidPill = document.createElement('div');
    liquidPill.className = 'nav-liquid-pill';
    navLinks.appendChild(liquidPill);

    function positionPill(targetEl) {
      if (!targetEl) {
        liquidPill.style.opacity = '0';
        return;
      }
      var rect = targetEl.getBoundingClientRect();
      var parentRect = navLinks.getBoundingClientRect();

      var left = rect.left - parentRect.left;
      var width = rect.width;

      liquidPill.style.left = left + 'px';
      liquidPill.style.width = width + 'px';
      liquidPill.style.opacity = '1';
    }

    // Set initial position to active link if present
    var activeLink = navLinks.querySelector('.nav-link.active');
    if (activeLink) {
      setTimeout(function () {
        positionPill(activeLink);
      }, 100);
    }

    links.forEach(function (link) {
      link.addEventListener('mouseenter', function () {
        positionPill(link);
      });
    });

    navLinks.addEventListener('mouseleave', function () {
      var currentActive = navLinks.querySelector('.nav-link.active');
      if (currentActive) {
        positionPill(currentActive);
      } else {
        liquidPill.style.opacity = '0';
      }
    });
  }

  /* --------------------------------------------------------------------------
     5. LIQUID UI BUTTON CLUSTERS (SMOOTH FLUID FOLLOWER)
     -------------------------------------------------------------------------- */
  function initLiquidButtonCluster() {
    var clusters = document.querySelectorAll('.liquid-button-cluster');
    if (clusters.length === 0) return;

    clusters.forEach(function (cluster) {
      var follower = cluster.querySelector('.liquid-follower');
      var buttons = cluster.querySelectorAll('.liquid-btn');
      if (!follower || buttons.length === 0) return;

      function moveFollower(btn) {
        if (!btn) return;
        var rect = btn.getBoundingClientRect();
        var parentRect = cluster.getBoundingClientRect();

        var left = rect.left - parentRect.left;
        var top = rect.top - parentRect.top;
        var width = rect.width;
        var height = rect.height;

        follower.style.transform = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
        follower.style.width = width + 'px';
        follower.style.height = height + 'px';
        follower.style.opacity = '1';

        buttons.forEach(function (b) {
          b.classList.toggle('active-liquid', b === btn);
        });
      }

      var defaultBtn = buttons[0];
      if (defaultBtn) {
        setTimeout(function () {
          moveFollower(defaultBtn);
        }, 150);
      }

      buttons.forEach(function (btn) {
        btn.addEventListener('mouseenter', function () {
          moveFollower(btn);
        });
      });

      cluster.addEventListener('mouseleave', function () {
        if (defaultBtn) {
          moveFollower(defaultBtn);
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     7. SKILL CATEGORY TABS (BULLETPROOF EVENT DELEGATION)
     -------------------------------------------------------------------------- */
  function initSkillTabs() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.skill-tab-btn');
      if (!btn) return;

      var targetCategory = btn.getAttribute('data-category');
      if (!targetCategory) return;

      document.querySelectorAll('.skill-tab-btn').forEach(function (t) {
        var isTarget = t === btn;
        t.classList.toggle('active', isTarget);
        t.setAttribute('aria-selected', isTarget ? 'true' : 'false');
      });

      document.querySelectorAll('.skill-category-panel').forEach(function (panel) {
        var isMatch = panel.getAttribute('data-category') === targetCategory;
        panel.classList.toggle('active', isMatch);
        if (isMatch) {
          panel.style.display = 'grid';
          panel.style.opacity = '1';
        } else {
          panel.style.display = 'none';
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     8. EXPANDABLE PROJECTS & OSS DRAWER ("READ MORE")
     -------------------------------------------------------------------------- */
  function initProjectsDrawer() {
    var toggleBtn = document.getElementById('projects-toggle-btn');
    var drawer = document.getElementById('projects-drawer');
    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener('click', function () {
      var isOpen = drawer.classList.contains('open');

      if (isOpen) {
        drawer.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.querySelector('.btn-text').textContent = 'Read More Projects & Contributions';
        toggleBtn.querySelector('.btn-arrow').textContent = '▾';
      } else {
        drawer.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
        toggleBtn.querySelector('.btn-text').textContent = 'Show Less Projects';
        toggleBtn.querySelector('.btn-arrow').textContent = '▴';
      }
    });
  }

  /* --------------------------------------------------------------------------
     9. STORY & IMPACT CAROUSEL
     -------------------------------------------------------------------------- */
  function initStoryCarousel() {
    var carousel = document.getElementById('story-carousel');
    if (!carousel) return;

    var track = carousel.querySelector('.story-track');
    var slides = carousel.querySelectorAll('.story-slide');
    var prevBtn = document.getElementById('story-prev');
    var nextBtn = document.getElementById('story-next');
    var counter = document.getElementById('story-counter');
    var dots = document.querySelectorAll('.story-dot');

    if (!track || slides.length === 0) return;

    var currentIndex = 0;
    var totalSlides = slides.length;
    var autoPlayTimer = null;

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentIndex = index;

      track.style.transform = 'translateX(-' + (currentIndex * (100 / totalSlides)) + '%)';

      if (counter) {
        counter.textContent = (currentIndex + 1) + ' / ' + totalSlides;
      }

      if (dots.length > 0) {
        dots.forEach(function (dot, i) {
          dot.classList.toggle('active', i === currentIndex);
        });
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        stopAutoPlay();
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        stopAutoPlay();
        goToSlide(currentIndex + 1);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        stopAutoPlay();
        goToSlide(i);
      });
    });

    var touchStartX = 0;
    var touchEndX = 0;

    carousel.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    carousel.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(currentIndex - 1);
        }
      }
      startAutoPlay();
    }, { passive: true });

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(function () {
        goToSlide(currentIndex + 1);
      }, 7000);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    startAutoPlay();
  }

  /* --------------------------------------------------------------------------
     10. INTERSECTION OBSERVER REVEALS & NUMERIC COUNTER
     -------------------------------------------------------------------------- */
  function initScrollReveals() {
    var reveals = document.querySelectorAll('.reveal, .timeline-item, .project-card, .award-item, .edu-card');
    document.documentElement.classList.add('js-animating');

    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          if (entry.target.classList.contains('hero-stats') || entry.target.querySelector('.stat-number')) {
            entry.target.querySelectorAll('.stat-number').forEach(function (stat) {
              if (!stat.classList.contains('counted')) {
                stat.classList.add('counted');
                animateCounter(stat);
              }
            });
          }
        }
      });
    }, { threshold: 0.05, rootMargin: '100px 0px 100px 0px' });

    reveals.forEach(function (el, i) {
      if (el.classList.contains('project-card') || el.classList.contains('timeline-item') || el.classList.contains('award-item')) {
        el.style.transitionDelay = (i % 3) * 0.08 + 's';
      }
      revealObserver.observe(el);
    });

    setTimeout(function () {
      reveals.forEach(function (el) {
        el.classList.add('visible');
      });
    }, 800);

    function animateCounter(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var isDecimal = (el.getAttribute('data-count') || '').indexOf('.') !== -1;
      var duration = 400;
      var start = performance.now();

      function update(now) {
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = eased * target;
        el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
        }
      }

      requestAnimationFrame(update);
    }
  }

  /* --------------------------------------------------------------------------
     11. 3D CARD TILT & SUNBEAM HIGHLIGHT
     -------------------------------------------------------------------------- */
  function initCardSunbeamTilt() {
    var cards = document.querySelectorAll('.tilt-card, .project-card, .rec-card, .edu-card, .award-card, .oss-card');
    if (window.innerWidth < 992) return;

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        var rotateX = ((y - centerY) / centerY) * -6.5;
        var rotateY = ((x - centerX) / centerX) * 6.5;

        card.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-6px) scale3d(1.02, 1.02, 1.02)';
        card.style.setProperty('--sun-x', (x / rect.width * 100).toFixed(1) + '%');
        card.style.setProperty('--sun-y', (y / rect.height * 100).toFixed(1) + '%');
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)';
      });
    });
  }

  /* --------------------------------------------------------------------------
     12. SMOOTH SCROLL ANCHOR JUMPS
     -------------------------------------------------------------------------- */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          var navHeight = 84;
          var elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          var offsetPosition = elementPosition - navHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

})();
