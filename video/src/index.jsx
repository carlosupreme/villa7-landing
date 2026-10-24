import { registerRoot, Composition } from 'remotion'
import { HeroLoop } from './HeroLoop'
import { Promo } from './Promo'

const Root = () => (
  <>
    {/* Background loop for the landing hero: no text, the HTML puts the headline on top */}
    <Composition id="HeroLoop" component={HeroLoop} durationInFrames={240} fps={24} width={1280} height={720} />
    {/* Vertical promo for Reels / TikTok / WhatsApp status */}
    <Composition id="Promo" component={Promo} durationInFrames={360} fps={24} width={1080} height={1920} />
  </>
)

registerRoot(Root)
