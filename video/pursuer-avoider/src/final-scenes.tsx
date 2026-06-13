import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {fontFamily} from './font';

// THE DANCE — final video scenes. Visual language locked to the deck
// (journey/pursuer-avoider-slides.html): bg #eef3f8, navy/teal chrome,
// pursuer bright teal, avoider deep teal, the two stick figures as the cast.

const BG = '#eef3f8';
const NAVY = '#003366';
const TEAL = '#0D9488';
const MINT = '#5eead4';
const MUTE = '#64748b';
const PU = '#0fa28d';
const PU_DK = '#0F766E';
const AV = '#134e4a';

const useEnter = (delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 16, mass: 0.7}});
  return {opacity: 1, transform: `translateY(${(1 - s) * 22}px)`};
};

const Chip: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{background: '#ccfbf1', color: PU_DK, fontSize: 30, fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', padding: '12px 30px', borderRadius: 99, display: 'inline-block'}}>
    {children}
  </div>
);

// ── The cast: a parametric walking stick figure ──
const Walker: React.FC<{
  color: string;
  step?: number;     // -1..1 leg swing
  reach?: number;    // 0..1 front arm reaching up/forward
  lean?: number;     // degrees
  headDrop?: number; // px
  flip?: boolean;
  size?: number;
}> = ({color, step = 0, reach = 0, lean = 0, headDrop = 0, flip, size = 240}) => (
  <svg viewBox="0 0 120 170" width={size * 0.7} height={size} style={{transform: `${flip ? 'scaleX(-1) ' : ''}rotate(${lean}deg)`, transformOrigin: '50% 95%'}}>
    <circle cx="60" cy={28 + headDrop} r="19" fill="none" stroke={color} strokeWidth="8" />
    <path d={`M60 ${47 + headDrop}v${58 - headDrop}`} stroke={color} strokeWidth="8" strokeLinecap="round" fill="none" />
    {/* arms */}
    <path d={`M60 62 q ${20 + 18 * reach} ${2 - 16 * reach} ${34 + 18 * reach} ${-10 - 14 * reach}`} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />
    <path d={`M60 62 l ${-20 - 8 * step} ${22}`} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />
    {/* legs */}
    <path d={`M60 105 l ${24 + 16 * step} 50`} stroke={color} strokeWidth="8" strokeLinecap="round" fill="none" />
    <path d={`M60 105 l ${-20 - 16 * step} 52`} stroke={color} strokeWidth="8" strokeLinecap="round" fill="none" />
  </svg>
);

const Ground: React.FC<{y?: number}> = ({y = 200}) => (
  <div style={{position: 'absolute', bottom: y, left: 80, right: 80, height: 7, background: '#d6dfe9', borderRadius: 4}} />
);

const Caption: React.FC<{children: React.ReactNode; delay?: number}> = ({children, delay = 0}) => {
  const a = useEnter(delay);
  return (
    <div style={{...a, position: 'absolute', bottom: 84, left: 0, right: 0, textAlign: 'center'}}>
      <span style={{color: MUTE, fontSize: 36, fontWeight: 700, lineHeight: 1.4}}>{children}</span>
    </div>
  );
};

const SpeakerIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="34" height="34" style={{flexShrink: 0}}>
    <path d="M4 9v6h4l5 5V4L8 9H4z" fill={MINT} />
    <path d="M16 8.5c1.4 1.6 1.4 5.4 0 7" stroke={MINT} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M18.7 6c2.6 2.8 2.6 9.2 0 12" stroke={MINT} strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

const SoundBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + 0.05 * Math.sin(frame / 6);
  return (
    <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, background: NAVY, color: '#fff', fontSize: 30, fontWeight: 800, padding: '14px 30px', borderRadius: 99, transform: `scale(${pulse})`, boxShadow: '0 10px 28px rgba(2,32,71,.25)'}}>
      <SpeakerIcon />
      Best with sound
    </div>
  );
};

// 1 · TITLE — the two figures at the edges, the name, the tagline
export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 13) * 5;
  return (
    <AbsoluteFill style={{background: BG, fontFamily}}>
      <div style={{height: 10, background: `linear-gradient(90deg,${NAVY},${TEAL})`}} />
      <Ground />
      <div style={{position: 'absolute', bottom: 207 + bob, left: 90}}><Walker color={PU} reach={0.4} /></div>
      <div style={{position: 'absolute', bottom: 207 - bob, right: 90}}><Walker color={AV} flip headDrop={5} /></div>
      <div style={{position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{color: TEAL, fontSize: 30, fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: 18}}>Your Relationship Coach</div>
        <div style={{color: NAVY, fontSize: 130, fontWeight: 800, letterSpacing: '-3px', lineHeight: 1}}>The <span style={{color: TEAL}}>Dance</span></div>
        <div style={{color: MUTE, fontSize: 38, fontWeight: 700, marginTop: 22, lineHeight: 1.35}}>Why you are stuck in the same argument,<br />and the way back to each other.</div>
        <div style={{marginTop: 30}}><SoundBadge /></div>
      </div>
    </AbsoluteFill>
  );
};

// 2 · STORY — the walk-out: avoider exits right, pursuer follows, bubbles
export const StoryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = (frame % 26) / 26;
  const stride = Math.sin(t * Math.PI * 2);
  const exit = interpolate(frame, [10, 110], [0, 560], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const chase = interpolate(frame, [30, 120], [0, 180], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
  const moving = frame > 10 && frame < 110;
  const chaseMoving = frame > 30 && frame < 120;
  const think = spring({frame: frame - 26, fps, config: {damping: 12}});
  const speak = spring({frame: frame - 70, fps, config: {damping: 12}});
  return (
    <AbsoluteFill style={{background: BG, fontFamily}}>
      <div style={{position: 'absolute', top: 90, left: 0, right: 0, textAlign: 'center'}}>
        <Chip>Does this sound familiar?</Chip>
      </div>
      <Ground y={240} />
      {/* avoider walks off right */}
      <div style={{position: 'absolute', bottom: 247, left: 560 + exit}}>
        <Walker color={AV} step={moving ? stride : 0} headDrop={6} lean={-3} />
      </div>
      {/* thought cloud follows the avoider */}
      <div style={{position: 'absolute', bottom: 640, left: 520 + exit, transform: `scale(${think})`, transformOrigin: 'bottom left'}}>
        <div style={{position: 'relative', background: '#e7efee', border: `4px solid ${AV}`, color: AV, borderRadius: 60, padding: '18px 30px', fontSize: 31, fontWeight: 600, fontStyle: 'italic'}}>
          If I stay, I'll only make it worse.
          <span style={{position: 'absolute', bottom: -22, left: '46%', width: 18, height: 18, borderRadius: '50%', background: '#e7efee', border: `4px solid ${AV}`}} />
        </div>
      </div>
      {/* pursuer follows */}
      <div style={{position: 'absolute', bottom: 247, left: 120 + chase}}>
        <Walker color={PU} step={chaseMoving ? -stride : 0} reach={0.8} lean={5} />
      </div>
      <div style={{position: 'absolute', bottom: 620, left: 80 + chase, transform: `scale(${speak})`, transformOrigin: 'bottom left'}}>
        <div style={{position: 'relative', background: '#e9faf6', border: `4px solid ${PU}`, color: PU_DK, borderRadius: 24, padding: '18px 30px', fontSize: 31, fontWeight: 700}}>
          &ldquo;We're not finished. Please come back.&rdquo;
          <span style={{position: 'absolute', bottom: -19, left: 60, borderTop: `19px solid ${PU}`, borderLeft: '12px solid transparent', borderRight: '12px solid transparent'}} />
        </div>
      </div>
      <Caption delay={120}>And the more one reaches, the further the other goes.</Caption>
    </AbsoluteFill>
  );
};

// 3 · RESEARCH — the stat banner + four names
export const ResearchScene: React.FC = () => {
  const names = [
    ['Harriet Lerner', 'The Dance of Anger, 1985'],
    ['Hendrix & Hunt', 'The hailstorm and the turtle'],
    ['Dr Sue Johnson', 'Pursue and withdraw'],
    ['Prof Andrew Christensen', 'Demand and withdraw'],
  ];
  return (
    <AbsoluteFill style={{background: BG, fontFamily, alignItems: 'center', justifyContent: 'center', padding: '0 70px'}}>
      <div style={{...useEnter(0), marginBottom: 26}}><Chip>What the research shows</Chip></div>
      <div style={{...useEnter(6), background: '#fff', borderRadius: 22, borderLeft: `14px solid ${NAVY}`, boxShadow: '0 16px 40px rgba(2,32,71,.14)', padding: '34px 40px', width: '100%', textAlign: 'left'}}>
        <div style={{color: NAVY, fontWeight: 800, fontSize: 44, lineHeight: 1.25}}>74 studies. No pattern predicts unhappiness more strongly.</div>
        <div style={{color: MUTE, fontSize: 26, marginTop: 10, fontWeight: 600}}>Schrodt, Witt &amp; Shimkowski (2014), meta-analysis</div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: '100%', marginTop: 18}}>
        {names.map(([n, t], i) => (
          <div key={i} style={{...useEnter(16 + i * 7), background: '#fff', borderRadius: 16, borderLeft: `8px solid ${TEAL}`, boxShadow: '0 8px 22px rgba(2,32,71,.09)', padding: '20px 24px', textAlign: 'left'}}>
            <div style={{color: NAVY, fontWeight: 800, fontSize: 30}}>{n}</div>
            <div style={{color: PU_DK, fontWeight: 700, fontSize: 24, marginTop: 4}}>{t}</div>
          </div>
        ))}
      </div>
      <div style={{...useEnter(50), color: MUTE, fontSize: 34, fontWeight: 700, marginTop: 24}}>Four schools. One dance.</div>
    </AbsoluteFill>
  );
};

// 4 · TWO INSTINCTS — figures step apart
export const InstinctsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const apart = interpolate(frame, [20, 80], [0, 120], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const bob = Math.sin(frame / 13) * 4;
  return (
    <AbsoluteFill style={{background: BG, fontFamily}}>
      <div style={{position: 'absolute', top: 110, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{...useEnter(0), color: NAVY, fontSize: 64, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15}}>One moves towards.<br />One moves away.</div>
      </div>
      <Ground y={260} />
      <div style={{position: 'absolute', bottom: 267 + bob, left: 300 - apart}}>
        <Walker color={PU} reach={0.7} lean={4} />
        <div style={{textAlign: 'center', color: PU_DK, fontWeight: 800, fontSize: 30, marginTop: 8}}>the pursuer</div>
      </div>
      <div style={{position: 'absolute', bottom: 267 - bob, right: 300 - apart}}>
        <Walker color={AV} flip headDrop={5} lean={-3} />
        <div style={{textAlign: 'center', color: AV, fontWeight: 800, fontSize: 30, marginTop: 8}}>the avoider</div>
      </div>
      <Caption delay={60}>Neither is wrong. The roles can even swap.</Caption>
    </AbsoluteFill>
  );
};

// 5/6 · ROLE CLOSE-UPS
const RoleScene: React.FC<{
  color: string; dark: string; name: string; lines: string[]; fear: string; flip?: boolean; reach?: number; headDrop?: number;
}> = ({color, dark, name, lines, fear, flip, reach = 0, headDrop = 0}) => {
  return (
    <AbsoluteFill style={{background: BG, fontFamily, flexDirection: 'row', alignItems: 'center', padding: '0 80px', gap: 50}}>
      <div style={{flexShrink: 0, textAlign: 'center'}}>
        <Walker color={color} size={330} reach={reach} flip={flip} headDrop={headDrop} />
        <div style={{color: dark, fontWeight: 800, fontSize: 40, marginTop: 10}}>{name}</div>
      </div>
      <div style={{flex: 1}}>
        {lines.map((l, i) => (
          <div key={i} style={{...useEnter(8 + i * 9), display: 'flex', alignItems: 'center', gap: 16, background: '#fff', borderRadius: 16, boxShadow: '0 8px 22px rgba(2,32,71,.09)', padding: '20px 26px', marginBottom: 14, textAlign: 'left'}}>
            <div style={{width: 12, height: 12, borderRadius: '50%', background: color, flexShrink: 0}} />
            <div style={{color: '#444', fontSize: 32, fontWeight: 600}}>{l}</div>
          </div>
        ))}
        <div style={{...useEnter(40), background: `${color}1f`, color: dark, borderRadius: 14, padding: '20px 26px', fontWeight: 800, fontSize: 32, textAlign: 'left', lineHeight: 1.35}}>
          {fear}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const PursuerScene: React.FC = () => (
  <RoleScene color={PU} dark={PU_DK} name="The Pursuer" reach={0.8}
    lines={['Reaches out when disconnected', 'Wants to talk now', 'Asks, follows, seeks reassurance']}
    fear={'“If I stop reaching, we will drift apart.”'} />
);

export const AvoiderScene: React.FC = () => (
  <RoleScene color={AV} dark={AV} name="The Avoider" flip headDrop={6}
    lines={['Needs space when things get intense', 'Goes quiet or leaves the room', 'Calm outside, flooded inside']}
    fear={'“If I engage, I will make it worse.”'} />
);

// 7 · HAILSTORM & TURTLE — animated weather + retracting head
const Hailstone: React.FC<{x: number; delay: number; frame: number; top: number}> = ({x, delay, frame, top}) => {
  const f = (frame + delay) % 50;
  const y = interpolate(f, [0, 50], [top, top + 290]);
  const o = interpolate(f, [0, 6, 42, 50], [0, 1, 1, 0]);
  return <div style={{position: 'absolute', left: x, top: y, width: 13, height: 13, borderRadius: '50%', background: PU, opacity: o}} />;
};

export const ImagoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const rumble = Math.sin(frame / 3) * 3;
  const headOut = interpolate(Math.sin((frame - 30) / 26), [-1, 1], [4, 40]);
  return (
    <AbsoluteFill style={{background: BG, fontFamily}}>
      <div style={{position: 'absolute', top: 90, left: 0, right: 0, textAlign: 'center'}}>
        <Chip>Imago &middot; Hendrix &amp; Hunt</Chip>
      </div>
      {/* hailstorm panel */}
      <div style={{position: 'absolute', top: 230, left: 90, width: 420, height: 540, background: '#e9faf6', border: `4px solid ${PU}`, borderRadius: 26}}>
        <div style={{position: 'absolute', top: 50, left: 110 + rumble}}>
          <svg viewBox="0 0 64 40" width="200" height="125"><path d="M14 34a10 10 0 0 1 1-20 14 14 0 0 1 27 3 9 9 0 0 1-1 17H14z" fill={PU} opacity="0.92" /></svg>
        </div>
        {[...Array(7)].map((_, i) => (
          <Hailstone key={i} x={120 + i * 30} delay={i * 8} frame={frame} top={185} />
        ))}
        <div style={{position: 'absolute', bottom: 36, left: 0, right: 0, textAlign: 'center'}}>
          <div style={{color: PU_DK, fontWeight: 800, fontSize: 40}}>The Hailstorm</div>
          <div style={{color: MUTE, fontWeight: 600, fontSize: 26, marginTop: 6}}>maximises &middot; needs to be heard</div>
        </div>
      </div>
      {/* turtle panel */}
      <div style={{position: 'absolute', top: 230, right: 90, width: 420, height: 540, background: '#e7efee', border: `4px solid ${AV}`, borderRadius: 26}}>
        <div style={{position: 'absolute', top: 120, left: 55}}>
          <svg viewBox="0 0 140 90" width="310" height="200">
            <path d="M20 70a50 36 0 0 1 100 0z" fill={AV} opacity="0.92" />
            <path d="M40 56l14 14M70 46v24M100 56l-14 14" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
            <g style={{transform: `translateX(${headOut}px)`}}>
              <circle cx="116" cy="62" r="13" fill={AV} />
              <circle cx="121" cy="59" r="2.5" fill="#fff" />
            </g>
            <path d="M10 70h120M34 70l-5 14M106 70l5 14" stroke={AV} strokeWidth="6" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{position: 'absolute', bottom: 36, left: 0, right: 0, textAlign: 'center'}}>
          <div style={{color: AV, fontWeight: 800, fontSize: 40}}>The Turtle</div>
          <div style={{color: MUTE, fontWeight: 600, fontSize: 26, marginTop: 6}}>minimises &middot; needs to feel safe</div>
        </div>
      </div>
      <Caption delay={40}>The louder it hails, the deeper the turtle retreats.</Caption>
    </AbsoluteFill>
  );
};

// 8 · THE TRAP — real 3D: two teal spheres orbiting on a dark floor
export const Trap3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const t = frame / 30;
  const chase = 0.55 + 0.45 * Math.sin(t * 0.7);
  const a = t * 1.1;
  const r1 = 1.6 - 0.7 * chase;
  const r2 = 1.6 + 0.7 * chase;
  const camA = t * 0.25;
  const bob1 = 0.9 + 0.18 * Math.sin(t * 2.4);
  const bob2 = 0.9 + 0.18 * Math.sin(t * 2.4 + 2);
  return (
    <AbsoluteFill style={{background: '#081626'}}>
      <ThreeCanvas
        width={width}
        height={height}
        gl={{antialias: true}}
        camera={{position: [Math.sin(camA) * 7.5, 2.6 + 0.4 * Math.sin(t * 0.5), Math.cos(camA) * 7.5], fov: 42}}
        onCreated={({camera}) => camera.lookAt(0, 0.7, 0)}
      >
        <color attach="background" args={['#081626']} />
        <fog attach="fog" args={['#081626', 8, 18]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[6, 9, 4]} intensity={1.6} color="#eafff8" />
        <pointLight position={[0, 4, 0]} intensity={24} color="#5eead4" />
        <pointLight position={[-5, 1.5, -3]} intensity={10} color="#3b82c4" />
        <mesh position={[Math.cos(a) * r1, bob1, Math.sin(a) * r1]}>
          <sphereGeometry args={[0.72, 64, 64]} />
          <meshPhysicalMaterial color="#14b8a6" roughness={0.18} metalness={0.15} clearcoat={0.8} emissive="#053f37" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[Math.cos(a + Math.PI) * r2, bob2, Math.sin(a + Math.PI) * r2]}>
          <sphereGeometry args={[0.72, 64, 64]} />
          <meshPhysicalMaterial color="#155e57" roughness={0.18} metalness={0.15} clearcoat={0.8} emissive="#04211e" emissiveIntensity={0.4} />
        </mesh>
        <group position={[((r1 - r2) / 2) * Math.cos(a), (bob1 + bob2) / 2, ((r1 - r2) / 2) * Math.sin(a)]} rotation={[0, -a, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.012, 0.012, r1 + r2, 8]} />
            <meshStandardMaterial color="#5eead4" emissive="#0D9488" emissiveIntensity={1.4} transparent opacity={0.65} />
          </mesh>
        </group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial color="#0c1c30" roughness={0.35} metalness={0.6} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
          <ringGeometry args={[1.55, 1.62, 96]} />
          <meshBasicMaterial color="#1e3a5c" transparent opacity={0.9} />
        </mesh>
      </ThreeCanvas>
      <div style={{position: 'absolute', top: 90, left: 0, right: 0, textAlign: 'center', fontFamily}}>
        <span style={{background: 'rgba(8,22,38,.6)', border: `2px solid ${MINT}`, color: MINT, fontSize: 30, fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', padding: '12px 30px', borderRadius: 99}}>The trap</span>
      </div>
      <div style={{position: 'absolute', bottom: 84, left: 0, right: 0, textAlign: 'center', fontFamily}}>
        <span style={{color: '#fff', fontSize: 38, fontWeight: 800, textShadow: '0 4px 18px rgba(0,0,0,.55)'}}>round and round it goes</span>
      </div>
    </AbsoluteFill>
  );
};

// 9 · THE TURN — the scared child
export const TurnScene: React.FC = () => (
  <AbsoluteFill style={{background: BG, fontFamily, alignItems: 'center', justifyContent: 'center', padding: '0 90px'}}>
    <div style={{...useEnter(0), marginBottom: 30}}><Chip>The turn</Chip></div>
    <div style={{...useEnter(8), background: '#fff', borderRadius: 26, borderLeft: `16px solid ${TEAL}`, boxShadow: '0 18px 50px rgba(2,32,71,.14)', padding: '50px 54px', textAlign: 'left'}}>
      <div style={{color: NAVY, fontSize: 52, fontWeight: 700, lineHeight: 1.35}}>
        &ldquo;When you see the <span style={{color: TEAL}}>scared child</span> behind your partner's reaction, the anger begins to turn into empathy.&rdquo;
      </div>
      <div style={{color: MUTE, fontSize: 28, fontWeight: 600, marginTop: 20}}>Efrat Fridman, Imago therapist</div>
    </div>
  </AbsoluteFill>
);

// 10 · STOP — the circling arrows decelerate and halt
export const StopScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // arrows decelerate to a stop
  const angle = 260 * (1 - Math.exp(-frame / 26));
  const pop = spring({frame: frame - 48, fps, config: {damping: 11, mass: 0.9}});
  const ARROW = 110;
  const draw = interpolate(frame, [66, 96], [ARROW, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const text = useEnter(80);
  return (
    <AbsoluteFill style={{background: BG, fontFamily, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'relative', width: 560, height: 560}}>
        <svg viewBox="0 0 560 560" width="560" height="560">
          <circle cx="260" cy="280" r="170" fill="none" stroke="#9fb4ca" strokeWidth="6" strokeDasharray="16 13" />
          <g fill={TEAL} transform={`rotate(${angle} 260 280)`}>
            {[0, 90, 180, 270].map((r) => (
              <path key={r} d="M430 192 l -9 -28 28 10 z" transform={`rotate(${r} 260 280)`} />
            ))}
          </g>
          {/* exit arrow */}
          <path d="M428 280 H 530 M 530 280 l -22 -14 M 530 280 l -22 14" stroke={TEAL} strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={ARROW} strokeDashoffset={draw} />
        </svg>
        <div style={{position: 'absolute', left: 260 - 92, top: 280 - 92, width: 184, height: 184, transform: `scale(${pop})`}}>
          <svg viewBox="0 0 120 120" width="184" height="184">
            <polygon points="35,8 85,8 112,35 112,85 85,112 35,112 8,85 8,35" fill={NAVY} stroke="#fff" strokeWidth="6" />
            <text x="60" y="70" textAnchor="middle" fill="#fff" fontSize="30" fontWeight="800">STOP</text>
          </svg>
        </div>
      </div>
      <div style={{...text, textAlign: 'center', marginTop: 8, maxWidth: 860}}>
        <div style={{color: NAVY, fontSize: 56, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-1px'}}>The dance cannot continue if one of you changes your steps.</div>
        <div style={{color: MUTE, fontSize: 26, fontWeight: 600, marginTop: 14}}>After Harriet Lerner, The Dance of Anger (1985)</div>
      </div>
    </AbsoluteFill>
  );
};

// 11 · REFRAME
export const ReframeScene: React.FC = () => (
  <AbsoluteFill style={{background: BG, fontFamily, alignItems: 'center', justifyContent: 'center', padding: '0 90px', textAlign: 'center'}}>
    <div style={{...useEnter(0), marginBottom: 26}}><Chip>The part to hold onto</Chip></div>
    <div style={{...useEnter(8), color: NAVY, fontSize: 92, fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.15}}>
      It's not your characters.<br />It's a <span style={{color: TEAL}}>cycle</span>.
    </div>
    <div style={{...useEnter(22), color: MUTE, fontSize: 38, fontWeight: 700, marginTop: 26}}>The dance is the problem, not the dancers.</div>
  </AbsoluteFill>
);

// 12-14 · STEPS
export const StepScene: React.FC<{num: number; title: string; sub?: string; quote: string}> = ({num, title, sub, quote}) => (
  <AbsoluteFill style={{background: BG, fontFamily, alignItems: 'center', justifyContent: 'center', padding: '0 90px', textAlign: 'center'}}>
    <div style={{...useEnter(0), marginBottom: 22}}><Chip>Stepping out &middot; {num} of 3</Chip></div>
    <div style={{...useEnter(4), width: 92, height: 92, borderRadius: '50%', background: NAVY, color: '#fff', fontWeight: 800, fontSize: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22}}>{num}</div>
    <div style={{...useEnter(8), color: NAVY, fontSize: 74, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.12}}>{title}</div>
    {sub ? <div style={{...useEnter(16), color: MUTE, fontSize: 34, fontWeight: 700, marginTop: 16, maxWidth: '30ch'}}>{sub}</div> : null}
    <div style={{...useEnter(24), background: '#fff', borderLeft: `10px solid ${TEAL}`, borderRadius: '0 18px 18px 0', boxShadow: '0 12px 30px rgba(2,32,71,.1)', padding: '26px 34px', marginTop: 28, fontStyle: 'italic', color: '#334', fontSize: 38, maxWidth: 880}}>{quote}</div>
  </AbsoluteFill>
);

// 15 · CLOSE — the figures walk back to each other, the tagline
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

export const CloseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = (frame % 26) / 26;
  const stride = Math.sin(t * Math.PI * 2);
  const come = interpolate(frame, [6, 86], [0, 255], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const walking = frame > 6 && frame < 86;
  const sub = spring({frame: frame - 150, fps, config: {damping: 16}});
  const words = ['Back', 'to', 'each', 'other.'];
  return (
    <AbsoluteFill style={{background: BG, fontFamily}}>
      <Ground y={250} />
      <div style={{position: 'absolute', bottom: 257, left: 110 + come}}>
        <Walker color={PU} step={walking ? stride : 0} reach={walking ? 0.3 : 0.6} />
      </div>
      <div style={{position: 'absolute', bottom: 257, right: 110 + come}}>
        <Walker color={AV} flip step={walking ? -stride : 0} reach={walking ? 0.3 : 0.6} headDrop={walking ? 4 : 0} />
      </div>
      <div style={{position: 'absolute', top: 200, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{fontSize: 100, fontWeight: 800, letterSpacing: '-2px'}}>
          {words.map((w, i) => (
            <TagWord key={i} delay={90 + i * 7} color={w === 'each' || w === 'other.' ? TEAL : NAVY}>{w}</TagWord>
          ))}
        </div>
        <div style={{color: MUTE, fontSize: 42, fontWeight: 700, marginTop: 20, opacity: sub}}>Truly connected, fully present.</div>
        <div style={{color: '#94a3b8', fontSize: 26, fontWeight: 600, marginTop: 34, opacity: sub}}>www.coach4u.com.au</div>
      </div>
    </AbsoluteFill>
  );
};
