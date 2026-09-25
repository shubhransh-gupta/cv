(function () {
  'use strict'

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Header scroll state
  const siteHeader = document.querySelector('.site-header')
  window.addEventListener('scroll', function () {
    if (siteHeader) {
      siteHeader.classList.toggle('scrolled', window.scrollY > 24)
    }
  }, { passive: true })

  // Mobile nav
  const toggle = document.getElementById('nav-toggle')
  const navLinks = document.getElementById('nav-links')
  if (toggle && navLinks) {
    let backdrop = document.getElementById('nav-backdrop')
    if (!backdrop) {
      backdrop = document.createElement('div')
      backdrop.id = 'nav-backdrop'
      backdrop.className = 'nav-backdrop'
      backdrop.setAttribute('aria-hidden', 'true')
      document.body.appendChild(backdrop)
    }

    function closeNav () {
      toggle.classList.remove('active')
      navLinks.classList.remove('open')
      if (siteHeader) siteHeader.classList.remove('nav-open')
      document.body.classList.remove('nav-open')
      if (backdrop) backdrop.classList.remove('active')
    }

    function openNav () {
      toggle.classList.add('active')
      navLinks.classList.add('open')
      if (siteHeader) siteHeader.classList.add('nav-open')
      document.body.classList.add('nav-open')
      if (backdrop) backdrop.classList.add('active')
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation()
      if (navLinks.classList.contains('open')) {
        closeNav()
      } else {
        openNav()
      }
    })

    if (backdrop) {
      backdrop.addEventListener('click', closeNav)
    }

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeNav()
      })
    })

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeNav()
      }
    })
  }

  // Scroll reveal
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' })

  document.querySelectorAll('.reveal, .timeline-item, .skill-card, .project-card, .award-item, .repo-card').forEach(function (el, i) {
    if (el.classList.contains('skill-card') || el.classList.contains('project-card') || el.classList.contains('award-item') || el.classList.contains('repo-card')) {
      el.style.transitionDelay = (i % 4) * 0.05 + 's'
    }
    revealObserver.observe(el)
  })

  // Counter animation
  function animateCounter (el) {
    const target = parseInt(el.getAttribute('data-count'), 10)
    const suffix = el.getAttribute('data-suffix') || ''
    const duration = 1000
    const start = performance.now()

    function update (now) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      el.textContent = Math.round(eased * target) + suffix
      if (progress < 1) requestAnimationFrame(update)
    }
    requestAnimationFrame(update)
  }

  const statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true'
        animateCounter(entry.target)
      }
    })
  }, { threshold: 0.5 })

  document.querySelectorAll('[data-count]').forEach(function (el) {
    statsObserver.observe(el)
  })

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href')
      if (href.length < 2) return
      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
      }
    })
  })

  // Active nav link
  const sections = document.querySelectorAll('section[id]')
  if (sections.length) {
    window.addEventListener('scroll', function () {
      let current = ''
      sections.forEach(function (section) {
        if (window.scrollY >= section.offsetTop - 100) {
          current = section.getAttribute('id')
        }
      })
      document.querySelectorAll('.nav-link[href^="#"]').forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current)
      })
    }, { passive: true })
  }

  // Story carousel (Mercury-style 1/3)
  const storyCarousel = document.getElementById('story-carousel')
  if (storyCarousel) {
    const slides = storyCarousel.querySelectorAll('.story-slide')
    const counter = document.getElementById('story-counter')
    const prevBtn = document.getElementById('story-prev')
    const nextBtn = document.getElementById('story-next')
    let currentSlide = 0
    let autoplayTimer

    function goToSlide (index) {
      currentSlide = (index + slides.length) % slides.length
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === currentSlide)
      })
      if (counter) {
        counter.textContent = (currentSlide + 1) + ' / ' + slides.length
      }
    }

    function startAutoplay () {
      if (prefersReducedMotion) return
      clearInterval(autoplayTimer)
      autoplayTimer = setInterval(function () {
        goToSlide(currentSlide + 1)
      }, 6000)
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goToSlide(currentSlide - 1)
        startAutoplay()
      })
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goToSlide(currentSlide + 1)
        startAutoplay()
      })
    }

    goToSlide(0)
    startAutoplay()
  }

  // Feature tabs
  const featureTabs = document.getElementById('feature-tabs')
  if (featureTabs) {
    const tabBtns = featureTabs.querySelectorAll('.tab-btn')
    const tabPanels = featureTabs.querySelectorAll('.tab-panel')

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const tab = btn.getAttribute('data-tab')
        tabBtns.forEach(function (b) {
          const active = b === btn
          b.classList.toggle('is-active', active)
          b.setAttribute('aria-selected', active ? 'true' : 'false')
        })
        tabPanels.forEach(function (panel) {
          panel.classList.toggle('is-active', panel.getAttribute('data-panel') === tab)
        })
      })
    })
  }

})()
