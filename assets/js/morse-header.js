(function () {
  'use strict'

  const NAME_SEGMENTS = [
    { letter: 'S', code: '...' },
    { letter: 'h', code: '....' },
    { letter: 'u', code: '..-' },
    { letter: 'b', code: '-...' },
    { letter: 'h', code: '....' },
    { letter: 'r', code: '.-.' },
    { letter: 'a', code: '.-' },
    { letter: 'n', code: '-.' },
    { letter: 's', code: '...' },
    { letter: 'h', code: '....' },
    { letter: ' ', code: '' },
    { letter: 'G', code: '--.' },
    { letter: 'u', code: '..-' },
    { letter: 'p', code: '.--.' },
    { letter: 't', code: '-' },
    { letter: 'a', code: '.-' }
  ]

  const DOT_MS = 70
  const DASH_MS = DOT_MS * 3
  const GAP_MS = DOT_MS
  const LETTER_GAP_MS = DOT_MS * 3
  const WORD_GAP_MS = DOT_MS * 7
  const PAUSE_MS = 1200

  let charIndex = 0

  function buildMorseMarkup () {
    const container = document.getElementById('morse-name')
    if (!container) return

    container.innerHTML = NAME_SEGMENTS.map(function (seg, i) {
      if (seg.letter === ' ') {
        return '<span class="morse-word-gap">/</span>'
      }
      const symbols = seg.code.split('').map(function (sym, j) {
        return '<span class="morse-sym" data-seg="' + i + '" data-sym="' + j + '">' + sym + '</span>'
      }).join('')
      return '<span class="morse-letter">' + symbols + '</span>'
    }).join('')

    const readable = document.getElementById('morse-readable')
    if (readable) {
      readable.innerHTML = NAME_SEGMENTS.map(function (seg) {
        if (seg.letter === ' ') return '<span class="morse-read-gap">&nbsp;</span>'
        return '<span class="morse-read-char">' + seg.letter + '</span>'
      }).join('')
    }
  }

  function sleep (ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms) })
  }

  function setPlaying (playing) {
    const brand = document.querySelector('.nav-brand')
    if (brand) brand.classList.toggle('is-playing', playing)
  }

  function clearActive () {
    document.querySelectorAll('.morse-sym.active').forEach(function (el) {
      el.classList.remove('active')
    })
    document.querySelectorAll('.morse-read-char').forEach(function (el) {
      el.classList.remove('revealed')
    })
    charIndex = 0
  }

  async function playMorse () {
    const wave = document.querySelector('.morse-wave')
    if (wave) wave.classList.add('is-active')
    setPlaying(true)

    const readChars = document.querySelectorAll('.morse-read-char')

    for (let i = 0; i < NAME_SEGMENTS.length; i++) {
      const seg = NAME_SEGMENTS[i]

      if (seg.letter === ' ') {
        await sleep(WORD_GAP_MS)
        continue
      }

      for (let j = 0; j < seg.code.length; j++) {
        const sym = seg.code[j]
        const el = document.querySelector('.morse-sym[data-seg="' + i + '"][data-sym="' + j + '"]')
        if (el) {
          el.classList.add('active')
          await sleep(sym === '-' ? DASH_MS : DOT_MS)
          el.classList.remove('active')
        }
        if (j < seg.code.length - 1) await sleep(GAP_MS)
      }

      if (readChars[charIndex]) readChars[charIndex].classList.add('revealed')
      charIndex++

      if (i < NAME_SEGMENTS.length - 1 && NAME_SEGMENTS[i + 1].letter !== ' ') {
        await sleep(LETTER_GAP_MS)
      }
    }

    if (wave) wave.classList.remove('is-active')
    setPlaying(false)
    await sleep(PAUSE_MS)
    clearActive()
    playMorse()
  }

  buildMorseMarkup()
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    playMorse()
  } else {
    document.querySelectorAll('.morse-read-char').forEach(function (c) { c.classList.add('revealed') })
  }
})()
