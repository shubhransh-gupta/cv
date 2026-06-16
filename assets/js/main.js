(function () {
  'use strict'

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Custom cursor
  if (!prefersReducedMotion && window.innerWidth > 768) {
    const glow = document.getElementById('cursor-glow')
    const dot = document.getElementById('cursor-dot')
    let mouseX = 0
    let mouseY = 0
    let glowX = 0
    let glowY = 0

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX
      mouseY = e.clientY
      if (dot) {
        dot.style.left = mouseX + 'px'
        dot.style.top = mouseY + 'px'
      }
    })

    function animateGlow () {
      glowX += (mouseX - glowX) * 0.18
      glowY += (mouseY - glowY) * 0.18
      if (glow) {
        glow.style.left = glowX + 'px'
        glow.style.top = glowY + 'px'
      }
      requestAnimationFrame(animateGlow)
    }
    animateGlow()
  }

  // Nav scroll effect (subtle shadow on site header)
  const siteHeader = document.querySelector('.site-header')
  window.addEventListener('scroll', function () {
    if (siteHeader) {
      siteHeader.classList.toggle('scrolled', window.scrollY > 40)
    }
  })

  // Mobile nav toggle
  const toggle = document.getElementById('nav-toggle')
  const navLinks = document.getElementById('nav-links')
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active')
      navLinks.classList.toggle('open')
    })
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('active')
        navLinks.classList.remove('open')
      })
    })
  }

  // Intersection Observer for reveal animations
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })

  document.querySelectorAll('.reveal, .timeline-item, .skill-card, .project-card, .award-item, .repo-card').forEach(function (el, i) {
    if (el.classList.contains('skill-card') || el.classList.contains('project-card') || el.classList.contains('award-item') || el.classList.contains('repo-card')) {
      el.style.transitionDelay = (i % 4) * 0.04 + 's'
    }
    revealObserver.observe(el)
  })

  // Counter animation for stats
  function animateCounter (el) {
    const target = parseInt(el.getAttribute('data-count'), 10)
    const suffix = el.getAttribute('data-suffix') || ''
    const duration = 900
    const start = performance.now()

    function update (now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(eased * target)
      el.textContent = current + suffix
      if (progress < 1) requestAnimationFrame(update)
    }
    requestAnimationFrame(update)
  }

  const statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const el = entry.target
        if (!el.dataset.animated) {
          el.dataset.animated = 'true'
          const presetSuffix = el.getAttribute('data-suffix')
          if (presetSuffix) {
            el.setAttribute('data-suffix', presetSuffix)
          }
          animateCounter(el)
        }
      }
    })
  }, { threshold: 0.5 })

  document.querySelectorAll('[data-count]').forEach(function (el) {
    statsObserver.observe(el)
  })

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'))
      if (target) {
        e.preventDefault()
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  })

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]')
  if (sections.length) {
    window.addEventListener('scroll', function () {
      let current = ''
      sections.forEach(function (section) {
        const top = section.offsetTop - 120
        if (window.scrollY >= top) current = section.getAttribute('id')
      })
      document.querySelectorAll('.nav-link').forEach(function (link) {
        link.classList.remove('active')
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active')
        }
      })
    })
  }
})()
