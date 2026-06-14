import {AbsoluteFill, Series, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {fontFamily} from './font';

// Style reel 2 — four properly dynamic styles. Everything moves all the time: squash and
// stretch characters with faces, self-drawing whiteboard lines, kinetic typography, and a
// continuous camera world built on Cath's islands-and-bridge imagery.

const NAVY = '#003366';
const PINK = '#be185d';
const PURSUER = '#CC8833';
const PURSUER_DK = '#996633';
const AVOIDER = '#3377AA';
const AVOIDER_DK = '#336699';

const Tag: React.FC<{n: number; name: string}> = ({n, name}) => (
  <div style={{position: 'absolute', top: 44, left: 0, right: 0, textAlign: 'center', zIndex: 50}}>
    <span style={{background: 'rgba(255,255,255,.92)', border: `2px solid ${PINK}`, color: PINK, fontSize: 26, fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', padding: '10px 26px', borderRadius: 99}}>
      Style {n} &middot; {name}
    </span>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// STYLE A — LIVING CHARACTERS: squash-and-stretch blobs with faces and feelings
// ════════════════════════════════════════════════════════════════════════════

const Blob: React.FC<{
  color: string;
  dark: string;
  squash: number;      // 1 = normal, <1 shorter+wider
  browSad?: number;    // 0..1
  browUp?: number;     // 0..1 raised (eager)
  eyeDir?: number;     // -1..1 pupils look left/right
  mouth?: 'smile' | 'flat' | 'o' | 'frown';
  blink: boolean;
  tremble?: number;
}> = ({color, dark, squash, browSad = 0, browUp = 0, eyeDir = 0, mouth = 'flat', blink, tremble = 0}) => {
  const w = 240 / squash ** 0.5;
  const h = 280 * squash;
  const shake = tremble ? Math.sin(Date.now() / 1) * 0 : 0; // deterministic below instead
  return (
    <svg viewBox="0 0 240 300" width={w} height={h} style={{display: 'block', transform: `translateX(${shake}px)`}}>
      {/* body */}
      <path d="M120 18 C 195 18 218 90 215 170 C 213 250 180 288 120 288 C 60 288 27 250 25 170 C 22 90 45 18 120 18 Z" fill={color} />
      <ellipse cx="120" cy="292" rx="92" ry="10" fill="rgba(2,32,71,.12)" />
      {/* eyes */}
      {blink ? (
        <>
          <path d="M76 110 q14 8 28 0" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M136 110 q14 8 28 0" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="90" cy="110" r="20" fill="#fff" />
          <circle cx="150" cy="110" r="20" fill="#fff" />
          <circle cx={90 + 8 * eyeDir} cy="112" r="9" fill={NAVY} />
          <circle cx={150 + 8 * eyeDir} cy="112" r="9" fill={NAVY} />
        </>
      )}
      {/* brows */}
      <path d={`M68 ${86 + 10 * browSad} L 108 ${86 - 6 * browSad + 8 * browUp ? 86 - 8 * browUp : 86}`} stroke={dark} strokeWidth="8" strokeLinecap="round"
        transform={`rotate(${-14 * browSad + 6 * browUp} 88 86)`} />
      <path d={`M132 86 L 172 ${86 + 10 * browSad}`} stroke={dark} strokeWidth="8" strokeLinecap="round"
        transform={`rotate(${14 * browSad - 6 * browUp} 152 86)`} />
      {/* mouth */}
      {mouth === 'smile' && <path d="M96 156 q24 22 48 0" stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" />}
      {mouth === 'flat' && <path d="M100 162 h40" stroke="#fff" strokeWidth="8" strokeLinecap="round" />}
      {mouth === 'frown' && <path d="M96 172 q24 -18 48 0" stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" />}
      {mouth === 'o' && <ellipse cx="120" cy="164" rx="13" ry="17" fill="#fff" />}
    </svg>
  );
};

export const CharactersSample: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Phase 1 (0-90): pursuer bounds over, eager. Phase 2 (90-180): avoider shrinks + trembles,
  // backs to the wall. Phase 3 (180-270): pursuer deflates sad, avoider peeks back.
  const hop = Math.abs(Math.sin(frame / 8));
  const approach = interpolate(frame, [10, 90], [0, 330], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const retreat = interpolate(frame, [60, 150], [0, 105], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
  const shrink = interpolate(frame, [80, 150], [1, 0.74], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const deflate = interpolate(frame, [180, 230], [1, 0.86], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const moving = frame > 10 && frame < 90;
  const pSquash = moving ? 1 + 0.12 * Math.sin(frame / 4) : deflate;
  const tremX = frame > 90 && frame < 175 ? 5 * Math.sin(frame * 1.7) : 0;
  const peek = interpolate(frame, [200, 250], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const blink = frame % 70 > 64 || (frame > 95 && frame < 130);
  const sad = interpolate(frame, [170, 210], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const bubble = spring({frame: frame - 28, fps, config: {damping: 12}});
  const bubble2 = spring({frame: frame - 110, fps, config: {damping: 12}});
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#fdf5f9 0%,#f3e3ec 100%)', fontFamily}}>
      <Tag n={1} name="Living characters" />
      <div style={{position: 'absolute', bottom: 200, left: 70, right: 70, height: 8, background: '#e3cdd9', borderRadius: 4}} />
      {/* pursuer blob hops toward */}
      <div style={{position: 'absolute', bottom: 208 + (moving ? 46 * hop : 0), left: 120 + approach}}>
        <Blob color={PURSUER} dark={PURSUER_DK} squash={pSquash} browUp={moving ? 1 : 0} browSad={sad} eyeDir={1} mouth={frame < 170 ? (moving ? 'smile' : 'o') : 'frown'} blink={blink && !moving} />
        <div style={{textAlign: 'center', color: PURSUER_DK, fontWeight: 800, fontSize: 30, marginTop: 8}}>pursuer</div>
      </div>
      {/* avoider blob shrinks away */}
      <div style={{position: 'absolute', bottom: 208, right: 110 - tremX, transform: `translateX(${retreat}px)`}}>
        <div style={{transform: `translateX(${-retreat * 0}px)`}}>
          <Blob color={AVOIDER} dark={AVOIDER_DK} squash={shrink + 0.04 * Math.sin(frame / 9)} browSad={1 - peek * 0.6} eyeDir={peek > 0.5 ? -1 : 0.4} mouth={peek > 0.5 ? 'flat' : 'frown'} blink={blink} />
        </div>
        <div style={{textAlign: 'center', color: AVOIDER_DK, fontWeight: 800, fontSize: 30, marginTop: 8}}>avoider</div>
      </div>
      {/* speech bubbles */}
      <div style={{position: 'absolute', bottom: 660, left: 150 + approach, transform: `scale(${bubble})`, transformOrigin: 'bottom left', background: '#fff', border: `3px solid ${PURSUER}`, color: PURSUER_DK, borderRadius: 22, padding: '14px 24px', fontSize: 30, fontWeight: 700, boxShadow: '0 8px 22px rgba(2,32,71,.12)'}}>
        can we talk? now?
      </div>
      <div style={{position: 'absolute', bottom: 640, right: 130, transform: `scale(${bubble2})`, transformOrigin: 'bottom right', background: '#fff', border: `3px solid ${AVOIDER}`, color: AVOIDER_DK, borderRadius: 22, padding: '14px 24px', fontSize: 30, fontWeight: 700, boxShadow: '0 8px 22px rgba(2,32,71,.12)'}}>
        ...
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════
// STYLE B — WHITEBOARD: the diagram draws itself, a pen leads the line
// ════════════════════════════════════════════════════════════════════

export const WhiteboardSample: React.FC = () => {
  const frame = useCurrentFrame();
  const R = 290;
  const CIRC = 2 * Math.PI * R;
  const drawn = interpolate(frame, [15, 150], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const angle = -90 + 360 * drawn;
  const a = (angle * Math.PI) / 180;
  // figures sketch in after the circle
  const fig1 = interpolate(frame, [150, 185], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fig2 = interpolate(frame, [180, 215], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const wordsIn = interpolate(frame, [210, 245], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const FIGLEN = 700;
  return (
    <AbsoluteFill style={{background: '#fffdf8', fontFamily}}>
      <Tag n={2} name="Whiteboard, drawing itself" />
      {/* faint grid for the whiteboard feel */}
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(#00336608 1px, transparent 1px), linear-gradient(90deg,#00336608 1px, transparent 1px)', backgroundSize: '54px 54px'}} />
      <svg viewBox="0 0 1080 1080" width="1080" height="1080" style={{position: 'absolute', inset: 0}}>
        {/* the cycle circle draws on */}
        <circle cx="540" cy="590" r={R} fill="none" stroke={NAVY} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - drawn)} transform="rotate(-90 540 590)" />
        {/* arrowheads appear as the line passes */}
        {drawn > 0.45 && <path d="M850 600 l-16 -30 m16 30 l-32 6" stroke={NAVY} strokeWidth="7" fill="none" strokeLinecap="round" />}
        {drawn > 0.95 && <path d="M230 580 l16 30 m-16 -30 l32 -6" stroke={NAVY} strokeWidth="7" fill="none" strokeLinecap="round" />}
        {/* sketched pursuer figure (left) */}
        <g stroke={PURSUER} strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={FIGLEN} strokeDashoffset={FIGLEN * (1 - fig1)}>
          <circle cx="250" cy="430" r="36" />
          <path d="M250 466 v110 M250 500 l66 -28 M250 500 l-50 40 M250 576 l44 70 M250 576 l-40 72" />
        </g>
        {/* sketched avoider figure (right) */}
        <g stroke={AVOIDER} strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={FIGLEN} strokeDashoffset={FIGLEN * (1 - fig2)}>
          <circle cx="832" cy="436" r="36" />
          <path d="M832 472 v110 M832 506 l-60 24 M832 506 l52 38 M832 582 l40 72 M832 582 l-46 70" />
        </g>
        {/* the pen that leads the circle line */}
        {drawn < 1 && (
          <g transform={`translate(${540 + R * Math.cos(a)}, ${590 + R * Math.sin(a)}) rotate(${angle + 135})`}>
            <path d="M0 0 L14 -44 L30 -44 L16 0 Z" fill={NAVY} />
            <rect x="12" y="-86" width="20" height="44" rx="5" fill={PINK} />
          </g>
        )}
      </svg>
      {/* handwritten-style labels fade in with a wobble */}
      <div style={{position: 'absolute', top: 330, left: 0, right: 0, textAlign: 'center', opacity: wordsIn, transform: `rotate(${-2 + wordsIn * 2}deg)`}}>
        <span style={{color: NAVY, fontSize: 56, fontWeight: 800, letterSpacing: '-1px'}}>the cycle has two engines</span>
      </div>
      <div style={{position: 'absolute', bottom: 240, left: 130, opacity: fig1, color: PURSUER_DK, fontSize: 34, fontWeight: 800, transform: 'rotate(-3deg)'}}>reaches</div>
      <div style={{position: 'absolute', bottom: 240, right: 130, opacity: fig2, color: AVOIDER_DK, fontSize: 34, fontWeight: 800, transform: 'rotate(2deg)'}}>retreats</div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// STYLE C — KINETIC TYPE: the words themselves dance the pattern
// ═══════════════════════════════════════════════════════════════

export const KineticSample: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // CLOSER slams in from the left, AWAY flees right; they orbit; then THE DANCE drops.
  const slam = spring({frame: frame - 8, fps, config: {damping: 9, mass: 0.9}});
  const flee = interpolate(frame, [30, 75], [0, 360], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const orbitOn = interpolate(frame, [95, 115], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const orbit = (frame - 95) * 3.2;
  const oa = (orbit * Math.PI) / 180;
  const drop = spring({frame: frame - 185, fps, config: {damping: 10, mass: 1.1}});
  const beat = 1 + 0.05 * Math.sin(frame / 4.5);
  const shake = frame > 8 && frame < 22 ? Math.sin(frame * 3) * 8 : 0;
  return (
    <AbsoluteFill style={{background: NAVY, fontFamily, overflow: 'hidden'}}>
      <Tag n={3} name="Kinetic type" />
      {/* phase 1+2: chase across the screen */}
      {frame < 95 && (
        <>
          <div style={{position: 'absolute', top: 380, left: interpolate(slam, [0, 1], [-700, 120]) + shake, color: PURSUER, fontSize: 130, fontWeight: 800, letterSpacing: '-4px'}}>
            CLOSER
          </div>
          <div style={{position: 'absolute', top: 560, left: 480 + flee, color: '#7fb3d8', fontSize: 110, fontWeight: 800, letterSpacing: '-3px', opacity: interpolate(flee, [0, 320], [1, 0.25])}}>
            away
          </div>
        </>
      )}
      {/* phase 3: the two words orbit each other, never meeting */}
      {frame >= 95 && frame < 185 && (
        <div style={{position: 'absolute', inset: 0, opacity: orbitOn}}>
          <div style={{position: 'absolute', left: 540 + 250 * Math.cos(oa) - 160, top: 520 + 160 * Math.sin(oa) - 50, color: PURSUER, fontSize: 84, fontWeight: 800}}>
            CLOSER
          </div>
          <div style={{position: 'absolute', left: 540 + 250 * Math.cos(oa + Math.PI) - 110, top: 520 + 160 * Math.sin(oa + Math.PI) - 50, color: '#7fb3d8', fontSize: 84, fontWeight: 800}}>
            away
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 490, textAlign: 'center', color: 'rgba(255,255,255,.65)', fontSize: 38, fontWeight: 700}}>
            same speed, same distance
          </div>
        </div>
      )}
      {/* phase 4: THE DANCE drops in with a heartbeat */}
      {frame >= 185 && (
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18}}>
          <div style={{color: '#fff', fontSize: 44, fontWeight: 700, opacity: drop}}>this is</div>
          <div style={{color: '#f9a8d4', fontSize: 170, fontWeight: 800, letterSpacing: '-5px', transform: `translateY(${(1 - drop) * -500}px) scale(${beat})`}}>
            THE DANCE
          </div>
          <div style={{color: 'rgba(255,255,255,.7)', fontSize: 36, fontWeight: 700, opacity: interpolate(frame, [215, 240], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
            and it can be changed
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STYLE D — CAMERA WORLD: one continuous scene, the camera does the storytelling
// (Cath's islands-and-bridge imagery: two islands, the camera travels, a bridge draws in)
// ═══════════════════════════════════════════════════════════════════════════

const Island: React.FC<{color: string; flip?: boolean}> = ({color, flip}) => (
  <svg viewBox="0 0 360 200" width="460" height="256" style={{transform: flip ? 'scaleX(-1)' : undefined}}>
    <path d="M20 120 Q 60 70 180 76 Q 300 70 340 120 L 330 150 Q 180 186 30 150 Z" fill={color} />
    <path d="M80 86 q8 -34 22 -40 M80 86 q-16 -26 -10 -42 M80 86 q24 -18 36 -16" stroke="#2f7d5f" strokeWidth="9" fill="none" strokeLinecap="round" />
    <circle cx="104" cy="38" r="20" fill="#3da37c" />
    <circle cx="74" cy="34" r="16" fill="#3da37c" />
  </svg>
);

const Stick: React.FC<{color: string; wave?: number; flip?: boolean}> = ({color, wave = 0, flip}) => (
  <svg viewBox="0 0 120 170" width="120" height="170" style={{transform: flip ? 'scaleX(-1)' : undefined}}>
    <circle cx="60" cy="30" r="20" fill="none" stroke={color} strokeWidth="8" />
    <path d="M60 50 v62" stroke={color} strokeWidth="9" strokeLinecap="round" />
    <path d={`M60 70 Q 90 ${66 - 26 * wave} 100 ${50 - 34 * wave}`} stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" />
    <path d="M60 70 Q 36 86 28 100" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" />
    <path d="M60 112 l24 46 M60 112 l-22 48" stroke={color} strokeWidth="9" strokeLinecap="round" />
  </svg>
);

export const WorldSample: React.FC = () => {
  const frame = useCurrentFrame();
  // Camera: start tight on island 1, pull back, pan to island 2, pull wide as the bridge draws.
  const cam = (() => {
    if (frame < 70) {
      const z = interpolate(frame, [0, 70], [2.1, 1.6], {easing: Easing.inOut(Easing.quad)});
      const x = interpolate(frame, [0, 70], [340, 300]);
      return {z, x, y: 180};
    }
    if (frame < 150) {
      const x = interpolate(frame, [70, 150], [300, -320], {easing: Easing.inOut(Easing.cubic)});
      return {z: 1.6, x, y: 180};
    }
    const z = interpolate(frame, [150, 215], [1.6, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
    const x = interpolate(frame, [150, 215], [-320, 0], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
    const y = interpolate(frame, [150, 215], [180, 0], {extrapolateRight: 'clamp'});
    return {z, x, y};
  })();
  const bob = Math.sin(frame / 14) * 8;
  const bob2 = Math.sin(frame / 14 + 2) * 8;
  const wavePhase = Math.sin(frame / 10);
  const BRIDGE = 560;
  const bridge = interpolate(frame, [195, 255], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const wave = interpolate(frame, [20, 55], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#dceefb 0%,#bcd9f0 55%,#8ec3e6 100%)', fontFamily, overflow: 'hidden'}}>
      <Tag n={4} name="One world, moving camera" />
      {/* sun */}
      <div style={{position: 'absolute', top: 130, right: 170, width: 110, height: 110, borderRadius: '50%', background: '#ffe9a8', boxShadow: `0 0 ${60 + 18 * wavePhase}px #ffe9a8`}} />
      {/* the whole world moves under the camera */}
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam.z}) translate(${cam.x}px, ${cam.y}px)`, transformOrigin: '50% 62%'}}>
        {/* sea with drifting waves */}
        <div style={{position: 'absolute', left: -200, right: -200, top: 660, bottom: -200, background: '#5ba3d0'}} />
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{position: 'absolute', top: 700 + i * 64, left: -200 + ((frame * (1.4 + i * 0.3) + i * 140) % 360) - 180, width: 240, height: 10, borderRadius: 6, background: 'rgba(255,255,255,.4)'}} />
        ))}
        {/* island 1 + pursuer waving across the water */}
        <div style={{position: 'absolute', left: 30, top: 520}}>
          <Island color="#e8c98f" />
          <div style={{position: 'absolute', left: 170, top: -76 + bob}}>
            <Stick color={PURSUER} wave={wave * (0.5 + 0.5 * Math.sin(frame / 6))} />
          </div>
        </div>
        {/* island 2 + avoider facing away */}
        <div style={{position: 'absolute', right: 30, top: 520}}>
          <Island color="#cfe0b8" flip />
          <div style={{position: 'absolute', right: 170, top: -76 + bob2}}>
            <Stick color={AVOIDER} flip />
          </div>
        </div>
        {/* the bridge draws across when it's time to talk */}
        <svg viewBox="0 0 1080 1080" width="1080" height="1080" style={{position: 'absolute', inset: 0}}>
          <path d="M270 640 Q 540 560 810 640" fill="none" stroke="#8a5a36" strokeWidth="14" strokeLinecap="round"
            strokeDasharray={BRIDGE} strokeDashoffset={BRIDGE * (1 - bridge)} />
          {[0.15, 0.32, 0.5, 0.68, 0.85].map((t, i) => {
            const px = 270 + (810 - 270) * t;
            const py = 640 - 80 * 4 * t * (1 - t) * 0.78;
            return bridge > t ? <path key={i} d={`M${px} ${py} v36`} stroke="#8a5a36" strokeWidth="10" strokeLinecap="round" /> : null;
          })}
        </svg>
      </div>
      {/* narration captions ride the camera moves */}
      <div style={{position: 'absolute', bottom: 110, left: 0, right: 0, textAlign: 'center'}}>
        <span style={{background: 'rgba(255,255,255,.92)', color: NAVY, fontSize: 36, fontWeight: 800, padding: '14px 30px', borderRadius: 99, boxShadow: '0 8px 24px rgba(2,32,71,.14)'}}>
          {frame < 70 ? 'one of you calls across the water' : frame < 150 ? 'the other drifts to their own island' : bridge < 1 ? 'naming the dance builds the bridge' : 'you meet in the middle'}
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const StyleReel2: React.FC = () => (
  <AbsoluteFill style={{background: '#fff'}}>
    <Series>
      <Series.Sequence durationInFrames={270}><CharactersSample /></Series.Sequence>
      <Series.Sequence durationInFrames={270}><WhiteboardSample /></Series.Sequence>
      <Series.Sequence durationInFrames={270}><KineticSample /></Series.Sequence>
      <Series.Sequence durationInFrames={285}><WorldSample /></Series.Sequence>
    </Series>
  </AbsoluteFill>
);

export const REEL2_TOTAL = 1095;
