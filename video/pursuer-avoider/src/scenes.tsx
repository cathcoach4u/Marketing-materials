import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily} from './font';

// Portal chrome (Your Relationship Coach v2.2) + Couples accent + the existing
// pursuer/avoider colours from resources/relationships/pursuer-avoider-dynamics.html,
// so the video and the explainer page read as one piece.
const NAVY = '#003366';
const PINK = '#be185d';
const PINK_SOFT = '#fce7f3';
const MUTE = '#64748b';
const PURSUER = '#CC8833';
const PURSUER_DK = '#996633';
const PURSUER_BG = '#FFF5EB';
const AVOIDER = '#3377AA';
const AVOIDER_DK = '#336699';
const AVOIDER_BG = '#EBF3FF';

// Entrance: a gentle slide that stays fully visible (opacity never hits 0), so pausing on a
// scene's first frame never shows a blank page.
const useEnter = (delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 16, mass: 0.7}});
  return {opacity: 1, transform: `translateY(${(1 - s) * 22}px)`};
};

const CathBadge: React.FC<{light?: boolean}> = ({light}) => (
  <div style={{position: 'absolute', right: 46, bottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
    <div
      style={{
        width: 150,
        height: 150,
        borderRadius: '50%',
        overflow: 'hidden',
        border: `5px solid ${PINK}`,
        boxShadow: '0 10px 26px rgba(2,32,71,.22)',
        background: '#fff',
      }}
    >
      <Img src={staticFile('cath.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 22%'}} />
    </div>
    <div style={{color: light ? '#fff' : NAVY, fontSize: 22, fontWeight: 800}}>Cath</div>
  </div>
);

const BrandBar: React.FC = () => (
  <>
    <div style={{height: 8, background: `linear-gradient(90deg,${NAVY},${PINK})`}} />
    <div style={{background: NAVY, padding: '20px 0 18px', textAlign: 'center'}}>
      <div style={{color: '#fff', fontSize: 38, fontWeight: 800, letterSpacing: '-1px'}}>
        Your Relationship <span style={{color: '#f9a8d4'}}>Coach</span>
      </div>
      <div style={{color: 'rgba(255,255,255,.78)', fontSize: 21, fontWeight: 600, marginTop: 3}}>
        The Dance &mdash; Pursuer and Avoider
      </div>
    </div>
  </>
);

const LightFrame: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{backgroundColor: '#f6f1f4', fontFamily}}>
    <BrandBar />
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px 56px 190px', gap: 30}}>
      {children}
    </div>
    <CathBadge />
  </AbsoluteFill>
);

const Chip: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{background: PINK_SOFT, color: PINK, fontSize: 26, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '11px 26px', borderRadius: 99}}>
    {children}
  </div>
);

// ── Icons (line art — colour emoji don't render in headless Chrome) ──

const ReachIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" width="84" height="84">
    <circle cx="22" cy="16" r="8" fill="none" stroke={PURSUER} strokeWidth="4" />
    <path d="M22 26v16M22 30l16-8M22 42l-8 12M22 42l10 12" fill="none" stroke={PURSUER} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M44 18h12M50 12l8 6-8 6" fill="none" stroke={PURSUER} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AwayIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" width="84" height="84">
    <circle cx="40" cy="16" r="8" fill="none" stroke={AVOIDER} strokeWidth="4" />
    <path d="M40 26v16M40 30l-14 6M40 42l-10 12M40 42l10 12" fill="none" stroke={AVOIDER} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 18H6M12 12l-8 6 8 6" fill="none" stroke={AVOIDER} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HailIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" width="96" height="96">
    <path d="M18 30a10 10 0 0 1 1-20 14 14 0 0 1 27 3 9 9 0 0 1-1 17H18z" fill="none" stroke={PURSUER} strokeWidth="4" strokeLinejoin="round" />
    <circle cx="20" cy="42" r="3" fill={PURSUER} />
    <circle cx="32" cy="48" r="3" fill={PURSUER} />
    <circle cx="44" cy="42" r="3" fill={PURSUER} />
    <circle cx="26" cy="56" r="3" fill={PURSUER} />
    <circle cx="40" cy="58" r="3" fill={PURSUER} />
  </svg>
);

const TurtleIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" width="96" height="96">
    <path d="M14 40a18 12 0 0 1 36 0z" fill="none" stroke={AVOIDER} strokeWidth="4" strokeLinejoin="round" />
    <path d="M22 34l6 6M32 30v10M42 34l-6 6" stroke={AVOIDER} strokeWidth="3" strokeLinecap="round" />
    <path d="M50 40c6 0 8-4 6-7-2 2-4 2-6 2" fill="none" stroke={AVOIDER} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 40h44M18 40l-3 8M46 40l3 8" fill="none" stroke={AVOIDER} strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const SpeakerIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="34" height="34" style={{flexShrink: 0}}>
    <path d="M4 9v6h4l5 5V4L8 9H4z" fill="#f9a8d4" />
    <path d="M16 8.5c1.4 1.6 1.4 5.4 0 7" stroke="#f9a8d4" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M18.7 6c2.6 2.8 2.6 9.2 0 12" stroke="#f9a8d4" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

const SoundBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + 0.05 * Math.sin(frame / 6);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: NAVY,
        color: '#fff',
        fontSize: 32,
        fontWeight: 800,
        padding: '16px 32px',
        borderRadius: 99,
        boxShadow: `0 0 0 ${6 + 6 * (pulse - 1) * 20}px rgba(190,24,93,.16), 0 10px 28px rgba(2,32,71,.25)`,
        transform: `scale(${pulse})`,
      }}
    >
      <SpeakerIcon />
      Best with sound
    </div>
  );
};

// ── Scenes ──

export const HookScene: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#f6f1f4', fontFamily}}>
    <div style={{height: 8, background: `linear-gradient(90deg,${NAVY},${PINK})`}} />
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 56px 190px', gap: 36}}>
      <div style={{color: PINK, fontSize: 30, fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase'}}>Your Relationship Coach</div>
      <div style={{color: NAVY, fontSize: 104, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-2px', textAlign: 'center'}}>
        The <span style={{color: PINK}}>Dance</span>
      </div>
      <div style={{color: MUTE, fontSize: 42, fontWeight: 700, lineHeight: 1.3, textAlign: 'center', maxWidth: '20ch'}}>
        Why one of you reaches, and one of you retreats.
      </div>
      <SoundBadge />
    </div>
    <CathBadge />
  </AbsoluteFill>
);

const RoleCard: React.FC<{
  title: string;
  sub: string;
  bg: string;
  color: string;
  dark: string;
  icon: React.ReactNode;
  points: string[];
}> = ({title, sub, bg, color, dark, icon, points}) => {
  const card = useEnter(4);
  return (
    <div style={{...card, width: '100%', background: '#fff', borderRadius: 28, borderTop: `12px solid ${color}`, boxShadow: '0 18px 50px rgba(2,32,71,.16)', padding: '40px 50px 44px', textAlign: 'center'}}>
      <div style={{width: 150, height: 150, borderRadius: '50%', background: bg, border: `4px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px'}}>
        {icon}
      </div>
      <div style={{color: NAVY, fontSize: 64, fontWeight: 800, letterSpacing: '-1px'}}>{title}</div>
      <div style={{color: dark, fontSize: 34, fontWeight: 700, marginTop: 6}}>{sub}</div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24}}>
        {points.map((p, i) => (
          <div key={i} style={{color: MUTE, fontSize: 33, fontWeight: 600}}>{p}</div>
        ))}
      </div>
    </div>
  );
};

export const PursuerScene: React.FC = () => (
  <LightFrame>
    <div style={useEnter(0)}><Chip>One of you</Chip></div>
    <RoleCard
      title="The Pursuer"
      sub="moves towards"
      bg={PURSUER_BG}
      color={PURSUER}
      dark={PURSUER_DK}
      icon={<ReachIcon />}
      points={['Wants to talk about it now', 'Asks, follows, seeks reassurance', 'Reaching out is their repair attempt']}
    />
  </LightFrame>
);

export const AvoiderScene: React.FC = () => (
  <LightFrame>
    <div style={useEnter(0)}><Chip>The other</Chip></div>
    <RoleCard
      title="The Avoider"
      sub="moves away"
      bg={AVOIDER_BG}
      color={AVOIDER}
      dark={AVOIDER_DK}
      icon={<AwayIcon />}
      points={['Goes quiet, needs space', 'Waits for things to settle', 'Withdrawing is how they keep the peace']}
    />
  </LightFrame>
);

export const ImagoScene: React.FC = () => {
  const a = useEnter(4);
  const b = useEnter(12);
  return (
    <LightFrame>
      <div style={useEnter(0)}><Chip>Imago &middot; Harville Hendrix</Chip></div>
      <div style={{display: 'flex', gap: 24, width: '100%'}}>
        <div style={{...a, flex: 1, background: PURSUER_BG, border: `3px solid ${PURSUER}`, borderRadius: 24, padding: '36px 20px 32px', textAlign: 'center'}}>
          <HailIcon />
          <div style={{color: PURSUER_DK, fontSize: 46, fontWeight: 800, marginTop: 12}}>The Hailstorm</div>
          <div style={{color: MUTE, fontSize: 30, fontWeight: 600, marginTop: 8}}>gets louder and bigger</div>
        </div>
        <div style={{...b, flex: 1, background: AVOIDER_BG, border: `3px solid ${AVOIDER}`, borderRadius: 24, padding: '36px 20px 32px', textAlign: 'center'}}>
          <TurtleIcon />
          <div style={{color: AVOIDER_DK, fontSize: 46, fontWeight: 800, marginTop: 12}}>The Turtle</div>
          <div style={{color: MUTE, fontSize: 30, fontWeight: 600, marginTop: 8}}>pulls deeper into the shell</div>
        </div>
      </div>
      <div style={{...useEnter(20), color: NAVY, fontSize: 36, fontWeight: 700, textAlign: 'center'}}>
        Different researchers, same dance.
      </div>
    </LightFrame>
  );
};

export const CycleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const rot = frame / 3;
  const a = useEnter(4);
  return (
    <LightFrame>
      <div style={useEnter(0)}><Chip>The trap</Chip></div>
      <div style={{...a, position: 'relative', width: 560, height: 560, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'absolute', inset: 60, borderRadius: '50%', border: '4px dashed #cbd5e1', transform: `rotate(${rot}deg)`}} />
        <div style={{position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', background: PURSUER_BG, border: `3px solid ${PURSUER}`, color: PURSUER_DK, fontSize: 31, fontWeight: 800, padding: '14px 28px', borderRadius: 99}}>
          pursue harder
        </div>
        <div style={{position: 'absolute', right: -14, top: '50%', transform: 'translateY(-50%)', background: '#fff', border: '3px solid #e2e8f0', color: MUTE, fontSize: 27, fontWeight: 700, padding: '12px 22px', borderRadius: 99}}>
          feels like a storm
        </div>
        <div style={{position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', background: AVOIDER_BG, border: `3px solid ${AVOIDER}`, color: AVOIDER_DK, fontSize: 31, fontWeight: 800, padding: '14px 28px', borderRadius: 99}}>
          withdraw further
        </div>
        <div style={{position: 'absolute', left: -14, top: '50%', transform: 'translateY(-50%)', background: '#fff', border: '3px solid #e2e8f0', color: MUTE, fontSize: 27, fontWeight: 700, padding: '12px 22px', borderRadius: 99}}>
          feels like abandonment
        </div>
        <div style={{color: NAVY, fontSize: 38, fontWeight: 800, textAlign: 'center', maxWidth: '11ch', lineHeight: 1.25}}>
          each move sets off the other
        </div>
      </div>
    </LightFrame>
  );
};

export const FearsScene: React.FC = () => {
  const a = useEnter(4);
  const b = useEnter(14);
  const c = useEnter(26);
  return (
    <LightFrame>
      <div style={useEnter(0)}><Chip>Underneath</Chip></div>
      <div style={{...a, width: '100%', background: PURSUER_BG, borderLeft: `12px solid ${PURSUER}`, borderRadius: 20, padding: '30px 38px', boxShadow: '0 10px 30px rgba(2,32,71,.10)'}}>
        <div style={{color: PURSUER_DK, fontSize: 28, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px'}}>The pursuer fears</div>
        <div style={{color: NAVY, fontSize: 42, fontWeight: 800, lineHeight: 1.2, marginTop: 8}}>&ldquo;If I stop reaching, we will drift apart.&rdquo;</div>
      </div>
      <div style={{...b, width: '100%', background: AVOIDER_BG, borderLeft: `12px solid ${AVOIDER}`, borderRadius: 20, padding: '30px 38px', boxShadow: '0 10px 30px rgba(2,32,71,.10)'}}>
        <div style={{color: AVOIDER_DK, fontSize: 28, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px'}}>The avoider fears</div>
        <div style={{color: NAVY, fontSize: 42, fontWeight: 800, lineHeight: 1.2, marginTop: 8}}>&ldquo;If I engage, I will make it worse.&rdquo;</div>
      </div>
      <div style={{...c, color: PINK, fontSize: 38, fontWeight: 800, textAlign: 'center'}}>
        Both fears make sense. Neither of you is the villain.
      </div>
    </LightFrame>
  );
};

export const ReframeScene: React.FC = () => {
  const a = useEnter(2);
  const b = useEnter(12);
  return (
    <AbsoluteFill style={{background: `linear-gradient(150deg,${NAVY} 0%,#5b2a59 70%,${PINK} 140%)`, fontFamily, justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 9%'}}>
      <div style={{...a, color: '#f9a8d4', fontSize: 38, fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase'}}>Hold onto this</div>
      <div style={{...b, color: '#fff', fontSize: 88, fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.12, marginTop: 18, maxWidth: '14ch'}}>
        It is not your characters. It is a <span style={{color: '#f9a8d4'}}>cycle</span>.
      </div>
      <div style={{...useEnter(26), color: 'rgba(255,255,255,.85)', fontSize: 40, fontWeight: 700, marginTop: 26}}>And a cycle can be changed.</div>
      <CathBadge light />
    </AbsoluteFill>
  );
};

const StepRow: React.FC<{num: number; title: string; sub: string; delay: number}> = ({num, title, sub, delay}) => {
  const a = useEnter(delay);
  return (
    <div style={{...a, display: 'flex', alignItems: 'center', gap: 22, background: '#fff', borderRadius: 18, borderLeft: `10px solid ${PINK}`, boxShadow: '0 8px 24px rgba(2,32,71,.10)', padding: '24px 30px', width: '100%', textAlign: 'left'}}>
      <div style={{width: 56, height: 56, borderRadius: '50%', background: NAVY, color: '#fff', fontSize: 30, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{num}</div>
      <div>
        <div style={{color: NAVY, fontSize: 40, fontWeight: 800}}>{title}</div>
        <div style={{color: MUTE, fontSize: 29, fontWeight: 600, marginTop: 4}}>{sub}</div>
      </div>
    </div>
  );
};

export const StepsScene: React.FC = () => (
  <LightFrame>
    <div style={useEnter(0)}><Chip>Stepping out</Chip></div>
    <div style={{display: 'flex', flexDirection: 'column', gap: 16, width: '100%'}}>
      <StepRow num={1} title="Name it" sub="&ldquo;I think we are in our dance right now.&rdquo;" delay={6} />
      <StepRow num={2} title="The turtle says when" sub="Out of the shell enough to say when they will be back." delay={18} />
      <StepRow num={3} title="The storm softens" sub="Eases off enough to let them." delay={30} />
    </div>
  </LightFrame>
);

export const NoticeScene: React.FC = () => {
  const card = useEnter(4);
  return (
    <LightFrame>
      <div style={useEnter(0)}><Chip>This week</Chip></div>
      <div style={{...card, width: '100%', background: '#fff', borderRadius: 28, borderTop: `12px solid ${PINK}`, boxShadow: '0 18px 50px rgba(2,32,71,.16)', padding: '52px 50px 56px', textAlign: 'center'}}>
        <div style={{color: NAVY, fontSize: 72, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-1px'}}>Just notice the dance</div>
        <div style={{color: MUTE, fontSize: 37, fontWeight: 500, lineHeight: 1.35, marginTop: 20}}>
          You do not have to fix it yet. Noticing is the first step out.
        </div>
      </div>
    </LightFrame>
  );
};

const TagWord: React.FC<{children: React.ReactNode; delay: number; color: string}> = ({children, delay, color}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 13, mass: 0.6}});
  return (
    <span style={{display: 'inline-block', color, opacity: s, transform: `translateY(${(1 - s) * 24}px) scale(${0.7 + 0.3 * s})`, marginRight: '0.28em'}}>
      {children}
    </span>
  );
};

export const SignoffScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const mark = spring({frame, fps, config: {damping: 11, mass: 0.8}});
  const glow = interpolate(frame % 90, [0, 45, 90], [0.9, 1, 0.9]);
  const breathe = 1 + 0.012 * Math.sin(frame / 14);
  const words = ['You', 'are', 'not', 'opponents.', 'You', 'are', 'partners', 'learning', 'the', 'same', 'dance.'];
  const cta = spring({frame: frame - 70, fps, config: {damping: 16}});
  return (
    <AbsoluteFill style={{background: `linear-gradient(150deg,${NAVY} 0%,#5b2a59 70%,${PINK} 140%)`, fontFamily, justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 8%'}}>
      <div style={{color: '#fff', fontSize: 76, fontWeight: 800, letterSpacing: '-2px', opacity: glow, transform: `scale(${0.6 + 0.4 * mark})`}}>
        Your Relationship <span style={{color: '#f9a8d4'}}>Coach</span>
      </div>
      <div style={{fontSize: 46, fontWeight: 800, marginTop: 26, maxWidth: '18ch', lineHeight: 1.3, transform: `scale(${breathe})`}}>
        {words.map((w, i) => (
          <TagWord key={i} delay={14 + i * 4} color={w === 'dance.' || w === 'partners' ? '#f9a8d4' : '#fff'}>
            {w}
          </TagWord>
        ))}
      </div>
      <div style={{color: 'rgba(255,255,255,.85)', fontSize: 26, fontWeight: 600, marginTop: 30, opacity: cta}}>www.coach4u.com.au</div>
      <CathBadge light />
    </AbsoluteFill>
  );
};
