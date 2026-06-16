(function () {
  'use strict'

  const toggle = document.getElementById('rec-toggle')
  const expanded = document.getElementById('rec-expanded')
  const previewGrid = document.getElementById('rec-preview-grid')

  if (!toggle || !expanded) return

  toggle.addEventListener('click', function () {
    const isOpen = expanded.classList.toggle('is-open')
    if (previewGrid) previewGrid.classList.toggle('is-open', isOpen)
    expanded.setAttribute('aria-hidden', isOpen ? 'false' : 'true')
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
    toggle.textContent = isOpen ? 'Show fewer recommendations' : 'Read more recommendations'

    if (isOpen) {
      window.requestAnimationFrame(function () {
        toggle.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      })
    }
  })
})()
