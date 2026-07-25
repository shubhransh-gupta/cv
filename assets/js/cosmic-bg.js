(function () {
  'use strict'

  var canvas = document.getElementById('cosmic-canvas')
  if (!canvas) return

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  var isCoarsePointer = window.matchMedia('(pointer: coarse)').matches
  var dpr = Math.min(window.devicePixelRatio || 1, 2)

  var mouse = { x: 0.5, y: 0.35, active: 0 }
  var smoothMouse = { x: 0.5, y: 0.35, active: 0 }
  var scrollY = 0
  var time = 0
  var rafId = 0
  var running = false

  var gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'high-performance' })
  if (!gl) {
    canvas.classList.add('cosmic-canvas--fallback')
    document.documentElement.classList.add('cosmic-ready')
    return
  }

  var vertSrc = [
    'attribute vec2 aPosition;',
    'void main(){',
    '  gl_Position = vec4(aPosition, 0.0, 1.0);',
    '}'
  ].join('\n')

  var fragSrc = [
    'precision highp float;',
    'uniform vec2 uResolution;',
    'uniform float uTime;',
    'uniform vec2 uMouse;',
    'uniform float uMouseActive;',
    'uniform float uScroll;',
    '',
    'float hash(vec2 p){',
    '  p = fract(p * vec2(123.34, 456.21));',
    '  p += dot(p, p + 45.32);',
    '  return fract(p.x * p.y);',
    '}',
    '',
    'float noise(vec2 p){',
    '  vec2 i = floor(p);',
    '  vec2 f = fract(p);',
    '  f = f * f * (3.0 - 2.0 * f);',
    '  float a = hash(i);',
    '  float b = hash(i + vec2(1.0, 0.0));',
    '  float c = hash(i + vec2(0.0, 1.0));',
    '  float d = hash(i + vec2(1.0, 1.0));',
    '  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);',
    '}',
    '',
    'float fbm(vec2 p){',
    '  float v = 0.0;',
    '  float a = 0.5;',
    '  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));',
    '  for(int i = 0; i < 5; i++){',
    '    v += a * noise(p);',
    '    p = rot * p * 2.02 + vec2(1.7, 9.2);',
    '    a *= 0.5;',
    '  }',
    '  return v;',
    '}',
    '',
    'float starLayer(vec2 uv, float density, float size, float twinkleSpeed){',
    '  vec2 gv = fract(uv) - 0.5;',
    '  vec2 id = floor(uv);',
    '  float n = hash(id);',
    '  if(n > density) return 0.0;',
    '  float d = length(gv - (vec2(hash(id + 1.3), hash(id + 7.1)) - 0.5) * 0.85);',
    '  float tw = 0.55 + 0.45 * sin(uTime * twinkleSpeed + n * 40.0);',
    '  float brightness = smoothstep(size, 0.0, d) * tw;',
    '  return brightness * (0.35 + n * 0.65);',
    '}',
    '',
    'void main(){',
    '  vec2 uv = gl_FragCoord.xy / uResolution.xy;',
    '  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);',
    '  vec2 p = (uv - 0.5) * aspect;',
    '',
    '  vec2 parallax = (uMouse - 0.5) * uMouseActive * 0.08;',
    '  p += parallax * vec2(1.0, 0.6);',
    '  p.y += uScroll * 0.00008;',
    '',
    '  vec3 base = vec3(0.078, 0.106, 0.133);',
    '',
    '  vec2 core = p - vec2(0.0, -0.18);',
    '  float coreDist = length(core * vec2(1.0, 1.35));',
    '  vec3 coreGlow = vec3(0.32, 0.38, 0.92) * exp(-coreDist * 2.8) * 0.55;',
    '  coreGlow += vec3(0.78, 0.65, 0.60) * exp(-coreDist * 5.5) * 0.22;',
    '',
    '  vec2 nebP = p * 1.6 + vec2(uTime * 0.012, uTime * 0.008);',
    '  float neb = fbm(nebP + parallax * 2.5);',
    '  float neb2 = fbm(nebP * 1.7 - vec2(uTime * 0.009));',
    '  vec3 nebula = mix(',
    '    vec3(0.18, 0.22, 0.55),',
    '    vec3(0.45, 0.30, 0.62),',
    '    neb2',
    '  ) * smoothstep(0.25, 0.95, neb) * 0.18;',
    '  nebula *= exp(-length(p - vec2(-0.35, 0.05)) * 1.4);',
    '  nebula += vec3(0.20, 0.28, 0.58) * exp(-length(p - vec2(0.42, -0.12)) * 2.2) * 0.12;',
    '',
    '  float stars = 0.0;',
    '  stars += starLayer((p + parallax * 0.15) * 38.0 + uTime * 0.003, 0.992, 0.09, 1.6);',
    '  stars += starLayer((p + parallax * 0.35) * 62.0 - uTime * 0.002, 0.996, 0.07, 2.1);',
    '  stars += starLayer((p + parallax * 0.55) * 95.0 + uTime * 0.0015, 0.9985, 0.05, 2.8);',
    '',
    '  float dust = fbm(p * 3.2 + vec2(uTime * 0.004));',
    '  vec3 dustColor = vec3(0.12, 0.14, 0.22) * dust * 0.08;',
    '',
    '  vec3 color = base + coreGlow + nebula + dustColor;',
    '  color += vec3(0.85, 0.90, 1.0) * stars * 0.95;',
    '  color += vec3(0.55, 0.62, 0.95) * stars * stars * 0.35;',
    '',
    '  float vignette = smoothstep(1.25, 0.25, length(p));',
    '  color *= mix(0.72, 1.0, vignette);',
    '',
    '  color = pow(color, vec3(0.94));',
    '  gl_FragColor = vec4(color, 1.0);',
    '}'
  ].join('\n')

  function compile (type, source) {
    var shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('Cosmic shader error:', gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }
    return shader
  }

  var vert = compile(gl.VERTEX_SHADER, vertSrc)
  var frag = compile(gl.FRAGMENT_SHADER, fragSrc)
  if (!vert || !frag) {
    canvas.classList.add('cosmic-canvas--fallback')
    document.documentElement.classList.add('cosmic-ready')
    return
  }

  var program = gl.createProgram()
  gl.attachShader(program, vert)
  gl.attachShader(program, frag)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    canvas.classList.add('cosmic-canvas--fallback')
    document.documentElement.classList.add('cosmic-ready')
    return
  }

  gl.useProgram(program)

  var buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1,
    -1, 1, 1, -1, 1, 1
  ]), gl.STATIC_DRAW)

  var aPosition = gl.getAttribLocation(program, 'aPosition')
  gl.enableVertexAttribArray(aPosition)
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

  var uResolution = gl.getUniformLocation(program, 'uResolution')
  var uTime = gl.getUniformLocation(program, 'uTime')
  var uMouse = gl.getUniformLocation(program, 'uMouse')
  var uMouseActive = gl.getUniformLocation(program, 'uMouseActive')
  var uScroll = gl.getUniformLocation(program, 'uScroll')

  function resize () {
    var w = window.innerWidth
    var h = window.innerHeight
    canvas.width = Math.floor(w * dpr)
    canvas.height = Math.floor(h * dpr)
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    gl.viewport(0, 0, canvas.width, canvas.height)
  }

  function lerp (a, b, t) {
    return a + (b - a) * t
  }

  function draw () {
    smoothMouse.x = lerp(smoothMouse.x, mouse.x, 0.06)
    smoothMouse.y = lerp(smoothMouse.y, mouse.y, 0.06)
    smoothMouse.active = lerp(smoothMouse.active, mouse.active, 0.08)

    gl.uniform2f(uResolution, canvas.width, canvas.height)
    gl.uniform1f(uTime, time)
    gl.uniform2f(uMouse, smoothMouse.x, smoothMouse.y)
    gl.uniform1f(uMouseActive, smoothMouse.active)
    gl.uniform1f(uScroll, scrollY)
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    if (prefersReducedMotion) return
    time += 0.016
    rafId = requestAnimationFrame(draw)
  }

  function start () {
    if (running) return
    running = true
    draw()
  }

  function stop () {
    running = false
    cancelAnimationFrame(rafId)
  }

  resize()
  document.documentElement.classList.add('cosmic-ready')

  if (prefersReducedMotion) {
    mouse.active = 0
    draw()
  } else {
    start()
  }

  window.addEventListener('resize', resize, { passive: true })

  window.addEventListener('scroll', function () {
    scrollY = window.scrollY
  }, { passive: true })

  if (!isCoarsePointer && !prefersReducedMotion) {
    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX / window.innerWidth
      mouse.y = 1 - e.clientY / window.innerHeight
      mouse.active = 1
    }, { passive: true })

    window.addEventListener('mouseleave', function () {
      mouse.active = 0
    })
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stop()
    } else if (!prefersReducedMotion) {
      start()
    }
  })
})()
