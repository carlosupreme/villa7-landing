import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'

// Filmic grade applied to every source clip
export const gradeFilter = 'contrast(1.12) saturate(0.86) brightness(0.95)'

/* Teal shadows / amber highlights, vignette, drifting light leak and per-frame grain.
   The leak uses a full sine period over the composition so it loops seamlessly. */
export const Look = ({ grain = 0.09, leak = true }) => {
  const frame = useCurrentFrame()
  const { durationInFrames, width, height } = useVideoConfig()
  const t = (frame / durationInFrames) * Math.PI * 2
  return (
    <>
      <AbsoluteFill style={{ background: 'linear-gradient(to bottom, rgba(255,150,60,.22), rgba(0,80,100,.26))', mixBlendMode: 'soft-light' }} />
      {leak && (
        <AbsoluteFill style={{
          background: `radial-gradient(circle at ${30 + Math.sin(t) * 18}% ${22 + Math.cos(t) * 10}%, rgba(255,170,90,.38), transparent 45%)`,
          mixBlendMode: 'screen',
        }} />
      )}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,.6))' }} />
      <AbsoluteFill style={{ opacity: grain, mixBlendMode: 'overlay' }}>
        <svg width={width} height={height}>
          <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 12} /></filter>
          <rect width="100%" height="100%" filter="url(#g)" />
        </svg>
      </AbsoluteFill>
    </>
  )
}
