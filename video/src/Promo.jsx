import { AbsoluteFill, Img, OffthreadVideo, Sequence, Easing, interpolate, staticFile, useCurrentFrame } from 'remotion'
import { loadFont } from '@remotion/fonts'
import { Look, gradeFilter } from './Look'

// Self-hosted: the render browser can't reach Google Fonts through the sandbox proxy
const display = 'Jost'
const body = 'Inter'
loadFont({ family: display, url: staticFile('fonts/jost-500.woff2'), weight: '500' })
loadFont({ family: body, url: staticFile('fonts/inter.woff2'), weight: '100 900' })

const cover = { width: '100%', height: '100%', objectFit: 'cover', filter: gradeFilter }
const ease = Easing.out(Easing.cubic)

// Masked line-by-line rise, same entrance as the landing's hero headline
const Lines = ({ lines, delay = 0, size = 128, style }) => {
  const frame = useCurrentFrame()
  return (
    <div style={{ fontFamily: display, fontWeight: 500, fontSize: size, lineHeight: 0.98, textTransform: 'uppercase', color: '#fff', ...style }}>
      {lines.map((l, i) => (
        <div key={i} style={{ overflow: 'hidden' }}>
          <div style={{ transform: `translateY(${interpolate(frame - delay - i * 4, [0, 18], [110, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease })}%)` }}>{l}</div>
        </div>
      ))}
    </div>
  )
}

const Sub = ({ children, delay = 0, style }) => {
  const frame = useCurrentFrame()
  const p = interpolate(frame - delay, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease })
  return <div style={{ fontFamily: body, fontWeight: 500, fontSize: 44, color: '#fff', opacity: p, transform: `translateY(${(1 - p) * 16}px)`, ...style }}>{children}</div>
}

// Real drone footage of the court, played from the landing's frame sequence
const Aerial = ({ from, to, frames }) => {
  const frame = useCurrentFrame()
  const i = Math.round(interpolate(frame, [0, frames], [from, to], { extrapolateRight: 'clamp' }))
  return <Img src={staticFile(`frames/f_${String(i).padStart(4, '0')}.webp`)} style={cover} />
}

const Shade = () => <AbsoluteFill style={{ background: 'linear-gradient(to top, rgba(17,17,17,.85), rgba(17,17,17,0) 55%)' }} />

const Push = ({ children, frames, to = 1.1 }) => {
  const frame = useCurrentFrame()
  return <AbsoluteFill style={{ transform: `scale(${interpolate(frame, [0, frames], [1, to])})` }}>{children}</AbsoluteFill>
}

const Copy = ({ children }) => (
  <AbsoluteFill style={{ justifyContent: 'flex-end', padding: '0 72px 220px' }}>{children}</AbsoluteFill>
)

const LEAGUES = [
  ['Sub-19', 'sub19'],
  ['Sub-18', 'sub18'],
  ['Libre', 'libre'],
  ['Empresarial', 'empresa'],
]

export const Promo = () => (
  <AbsoluteFill style={{ background: '#111' }}>
    {/* 1. Hook */}
    <Sequence durationInFrames={72}>
      <Push frames={72}>
        <OffthreadVideo src={staticFile('video/hero.mp4')} trimBefore={48} playbackRate={0.7} muted style={{ ...cover, objectPosition: '38% 50%' }} />
      </Push>
      <Shade />
      <Copy><Lines lines={['Siete', 'contra', 'siete.']} delay={6} size={150} /></Copy>
    </Sequence>

    {/* 2. The real court */}
    <Sequence from={72} durationInFrames={96}>
      <Push frames={96} to={1.06}><Aerial from={1} to={70} frames={96} /></Push>
      <Shade />
      <Copy>
        <Lines lines={['La cancha', 'de Fútbol 7', 'de Oaxaca.']} delay={4} size={112} />
        <Sub delay={22} style={{ marginTop: 28 }}>Pasto sintético · Cercada · Con gradas</Sub>
      </Copy>
    </Sequence>

    {/* 3. Leagues, quick cuts */}
    {LEAGUES.map(([name, img], i) => (
      <Sequence key={name} from={168 + i * 24} durationInFrames={24}>
        <Push frames={24} to={1.05}><Img src={staticFile(`img/${img}.webp`)} style={cover} /></Push>
        <Shade />
        <Copy>
          <Sub style={{ fontSize: 36, color: 'rgba(255,255,255,.7)', marginBottom: 12 }}>Ligas {i + 1}/4</Sub>
          <Lines lines={[name]} size={140} />
        </Copy>
      </Sequence>
    ))}

    {/* 4. Call to action */}
    <Sequence from={264}>
      <Push frames={96} to={1.04}><Aerial from={90} to={135} frames={96} /></Push>
      <AbsoluteFill style={{ background: 'rgba(17,17,17,.62)' }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <Lines lines={['Villa 7']} size={190} style={{ letterSpacing: '.02em' }} />
        <Sub delay={10} style={{ marginTop: 24 }}>Inscripciones abiertas · Temporada 2026</Sub>
        <Sub delay={20} style={{ marginTop: 64, background: '#fff', color: '#111', padding: '22px 56px', borderRadius: 60 }}>Escríbenos por WhatsApp</Sub>
      </AbsoluteFill>
    </Sequence>

    <Look grain={0.08} />
  </AbsoluteFill>
)
