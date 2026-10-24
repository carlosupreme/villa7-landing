import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion'
import { Look, gradeFilter } from './Look'

const RATE = 0.75 // slow motion
const FADE = 16 // frames of crossfade that hide the loop seam
const START = 24 // source frame shown at composition frame 0

const Clip = ({ trimBefore, style }) => (
  <OffthreadVideo
    src={staticFile('video/hero.mp4')}
    trimBefore={trimBefore}
    playbackRate={RATE}
    muted
    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: gradeFilter, ...style }}
  />
)

/* The last FADE frames crossfade into a copy that lands exactly on frame 0's image,
   so the browser's <video loop> restarts without a visible jump. */
export const HeroLoop = () => {
  const frame = useCurrentFrame()
  const scale = interpolate(frame, [0, 240], [1, 1.08])
  const tail = interpolate(frame, [240 - FADE, 240], [0, 1], { extrapolateLeft: 'clamp' })
  return (
    <AbsoluteFill style={{ background: '#111' }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Clip trimBefore={START} />
      </AbsoluteFill>
      <Sequence from={240 - FADE}>
        <AbsoluteFill style={{ opacity: tail }}>
          <Clip trimBefore={START - Math.round(FADE * RATE)} />
        </AbsoluteFill>
      </Sequence>
      <Look />
    </AbsoluteFill>
  )
}

/* Scroll-scrubbed variant: every source frame at normal speed, no push or loop tail
   (scroll drives time), and no grain, which would freeze into dirt when scrolling stops. */
export const HeroScrub = () => (
  <AbsoluteFill style={{ background: '#111' }}>
    <OffthreadVideo src={staticFile('video/hero.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover', filter: gradeFilter }} />
    <Look grain={0} />
  </AbsoluteFill>
)
