import './styles.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, SplitText)

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const FRAMES = 135
const frameUrl = (i) => `${import.meta.env.BASE_URL}frames/f_${String(i + 1).padStart(4, '0')}.webp`

if (!reduce) {
  const lenis = new Lenis({ lerp: 0.1 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  document.querySelectorAll('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const el = document.querySelector(a.getAttribute('href'))
      if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: 0 }) }
    }))
}

/* Hero: the one orchestrated entrance */
function hero() {
  const h1 = document.querySelector('[data-split]')
  if (reduce) return
  const split = SplitText.create(h1, { type: 'lines', mask: 'lines', autoSplit: true })
  gsap.timeline({ defaults: { ease: 'power4.out' } })
    .from(split.lines, { yPercent: 110, duration: 1.1, stagger: 0.12 }, 0.2)
    .from('.hero-sub, .hero .pill', { opacity: 0, y: 16, duration: 0.8, stagger: 0.1 }, 0.9)
  gsap.to('.hero-video', {
    scale: 1.12, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  })
}

/* Statement: words darken as you scroll through them */
function statement() {
  const p = document.getElementById('statement')
  if (reduce) { p.style.color = 'var(--ink)'; return }
  const split = SplitText.create(p, { type: 'words' })
  gsap.fromTo(split.words, { color: '#d4d4d6' }, {
    color: '#111', stagger: 0.1, ease: 'none',
    scrollTrigger: { trigger: p, start: 'top 80%', end: 'bottom 45%', scrub: true },
  })
}

/* Court: aerial footage scrubbed frame by frame on a canvas */
function court() {
  const canvas = document.getElementById('court')
  const ctx = canvas.getContext('2d')
  const images = new Array(FRAMES)
  const state = { frame: 0 }
  let current = -1

  const size = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2)
    canvas.width = innerWidth * dpr
    canvas.height = innerHeight * dpr
    current = -1
    draw()
  }
  const nearest = (i) => {
    for (let d = 0; d < FRAMES; d++) {
      if (images[i - d]?.complete) return images[i - d]
      if (images[i + d]?.complete) return images[i + d]
    }
  }
  function draw() {
    const i = Math.round(state.frame)
    if (i === current) return
    const img = nearest(i)
    if (!img) return
    current = i
    const s = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
    const w = img.naturalWidth * s, h = img.naturalHeight * s
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h)
  }
  const load = (i) => {
    const img = new Image()
    img.onload = draw
    img.src = frameUrl(i)
    images[i] = img
  }
  load(0)
  for (let i = 1; i < FRAMES; i += 1) setTimeout(() => load(i), 0)
  addEventListener('resize', size)
  size()

  if (reduce) return
  const caps = gsap.utils.toArray('.cap')
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '#cancha', start: 'top top', end: '+=420%', pin: true, scrub: 0.6 },
  })
  tl.to(state, { frame: FRAMES - 1, ease: 'none', duration: caps.length * 2, onUpdate: draw }, 0)
  caps.forEach((c, i) => {
    tl.fromTo(c, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, i * 2 + 0.2)
    if (i < caps.length - 1) tl.to(c, { opacity: 0, y: -40, duration: 0.4, ease: 'power2.in' }, i * 2 + 1.6)
  })
  tl.to('.scroll-hint', { opacity: 0, duration: 0.3 }, 0.3)
}

/* Leagues: image reveal + inner parallax */
function leagues() {
  if (reduce) return
  gsap.utils.toArray('.tile').forEach((tile) => {
    const img = tile.querySelector('img')
    gsap.from(tile, {
      clipPath: 'inset(12% 8% 12% 8%)', duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: tile, start: 'top 85%' },
    })
    gsap.fromTo(img, { yPercent: -8, scale: 1.15 }, {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: tile, start: 'top bottom', end: 'bottom top', scrub: true },
    })
  })
}

/* Steps: lines draw in */
function steps() {
  if (reduce) return
  gsap.from('.steps li', {
    opacity: 0, y: 32, duration: 0.8, stagger: 0.15, ease: 'power3.out',
    scrollTrigger: { trigger: '.steps ol', start: 'top 80%' },
  })
}

hero(); statement(); court(); leagues(); steps()
