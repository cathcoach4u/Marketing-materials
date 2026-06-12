import {AbsoluteFill, Series, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {fontFamily} from './font';

// Style reel 3 — the ceiling of the pipeline. Cinematic weather + lighting, a hand-drawn
// "boiling line" look, shape morphing, and a 300-particle system. All code, no stock assets.

const NAVY = '#003366';
const PINK = '#be185d';
const PURSUER = '#CC8833';
const AVOIDER = '#3377AA';

// Deterministic pseudo-random (stable across frames and renders).
const rnd = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const Tag: React.FC<{n: number; name: string; light?: boolean}> = ({n, name, light}) => (
  <div style={{position: 'absolute', top: 44, left: 0, right: 0, textAlign: 'center', zIndex: 60}}>
    <span style={{background: light ? 'rgba(255,255,255,.92)' : 'rgba(0,20,46,.65)', border: `2px solid ${light ? PINK : '#f9a8d4'}`, color: light ? PINK : '#f9a8d4', fontSize: 26, fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', padding: '10px 26px', borderRadius: 99}}>
      Push {n} &middot; {name}
    </span>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// PUSH 1 — CINEMA: night storm, rain, lightning, then the weather breaks to dawn
// ═══════════════════════════════════════════════════════════════════════════

export const StormToDawn: React.FC = () => {
  const frame = useCurrentFrame();
  const dawn = interpolate(frame, [110, 230], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const rainOn = interpolate(frame, [100, 170], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const bolt = (frame >= 28 && frame <= 33) || (frame >= 76 && frame <= 80);
  const flash = bolt ? 0.55 : 0;
  const sunY = interpolate(dawn, [0, 1], [1180, 700]);
  const turn = interpolate(frame, [170, 220], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const drift = Math.sin(frame / 30) * 14;
  const seaShift = (frame * 1.2) % 160;
  return (
    <AbsoluteFill style={{fontFamily, overflow: 'hidden', background: '#0a1830'}}>
      <Tag n={1} name="Cinematic light &amp; weather" />
      {/* sky: night crossfades to dawn */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#0a1830 0%,#13294a 60%,#1d3a5f 100%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#2b2a55 0%,#b65c7e 55%,#f2a35c 100%)', opacity: dawn}} />
      {/* rising sun with bloom */}
      <div style={{position: 'absolute', left: 490, top: sunY, width: 130, height: 130, borderRadius: '50%', background: '#ffd9a0', opacity: dawn, boxShadow: `0 0 ${90 + 40 * Math.sin(frame / 12)}px 30px rgba(255,200,130,${0.55 * dawn})`}} />
      {/* storm clouds slide out as dawn comes */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', top: 150 + i * 90 + drift * (i % 2 ? 1 : -1), left: 80 + i * 300 - dawn * (500 + i * 240) * (i % 2 ? 1 : -1), width: 420, height: 120, borderRadius: 80, background: `rgba(16,28,52,${0.85 - 0.2 * i})`, filter: 'blur(2px)'}} />
      ))}
      {/* lightning bolt + screen flash */}
      {bolt && (
        <svg viewBox="0 0 1080 1080" width="1080" height="1080" style={{position: 'absolute', inset: 0}}>
          <path d="M560 120 L470 400 L560 390 L430 700 L640 360 L545 372 L660 120 Z" fill="#eaf2ff" opacity="0.95" />
        </svg>
      )}
      <AbsoluteFill style={{background: '#dbe9ff', opacity: flash, mixBlendMode: 'screen'}} />
      {/* layered parallax sea */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: -300, right: -300, top: 760 + i * 70, bottom: -50, background: dawn > 0.5 ? ['#6d4a66', '#84506b', '#9c5a6e'][i] : ['#0e2240', '#122b50', '#16345e'][i], borderRadius: '50% 50% 0 0 / 30px'}}>
          {[...Array(7)].map((_, w) => (
            <div key={w} style={{position: 'absolute', top: 14, left: ((w * 220 + seaShift * (1 + i * 0.5)) % 1700) - 300, width: 130, height: 7, borderRadius: 4, background: 'rgba(255,255,255,.18)'}} />
          ))}
        </div>
      ))}
      {/* two cliffs + silhouettes who finally turn toward each other */}
      <svg viewBox="0 0 1080 1080" width="1080" height="1080" style={{position: 'absolute', inset: 0}}>
        <path d="M0 1080 L0 780 Q 120 740 240 790 L 300 1080 Z" fill={dawn > 0.5 ? '#3a2238' : '#060f20'} />
        <path d="M1080 1080 L1080 780 Q 960 740 840 790 L 780 1080 Z" fill={dawn > 0.5 ? '#3a2238' : '#060f20'} />
        {/* left figure */}
        <g stroke={dawn > 0.5 ? '#ffe3c4' : '#9db4d6'} strokeWidth="9" fill="none" strokeLinecap="round" transform={`translate(150 660) scale(${1}) `}>
          <circle cx="0" cy="0" r="22" />
          <path d="M0 22 v70" />
          <path d={`M0 45 q ${26 + 30 * turn} ${-6 - 26 * turn} ${44 + 34 * turn} ${-14 - 30 * turn}`} />
          <path d="M0 45 q -26 16 -36 34" />
          <path d="M0 92 l 26 56 M0 92 l -24 58" />
        </g>
        {/* right figure */}
        <g stroke={dawn > 0.5 ? '#ffe3c4' : '#9db4d6'} strokeWidth="9" fill="none" strokeLinecap="round" transform="translate(930 660) scale(-1 1)">
          <circle cx="0" cy="0" r="22" />
          <path d="M0 22 v70" />
          <path d={`M0 45 q ${26 + 30 * turn} ${-6 - 26 * turn} ${44 + 34 * turn} ${-14 - 30 * turn}`} />
          <path d="M0 45 q -26 16 -36 34" />
          <path d="M0 92 l 26 56 M0 92 l -24 58" />
        </g>
      </svg>
      {/* rain — 160 drops, slanted, fading out as the weather breaks */}
      <div style={{position: 'absolute', inset: 0, opacity: rainOn}}>
        {[...Array(160)].map((_, i) => {
          const x = rnd(i) * 1180 - 50;
          const speed = 26 + rnd(i + 500) * 22;
          const y = ((frame * speed + rnd(i + 999) * 1080) % 1180) - 60;
          return <div key={i} style={{position: 'absolute', left: x - y * 0.18, top: y, width: 3, height: 26 + rnd(i + 77) * 18, background: 'rgba(190,210,240,.5)', transform: 'rotate(10deg)', borderRadius: 2}} />;
        })}
      </div>
      {/* grade: warm vignette as dawn lands */}
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 62%, transparent 40%, rgba(20,8,24,.5) 100%)'}} />
      <div style={{position: 'absolute', bottom: 100, left: 0, right: 0, textAlign: 'center'}}>
        <span style={{color: '#fff', fontSize: 38, fontWeight: 800, textShadow: '0 4px 18px rgba(0,0,0,.5)'}}>
          {frame < 110 ? 'the storm always passes' : 'and you are still on the same shore'}
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// PUSH 2 — HAND-DRAWN: boiling-line characters, like a pencil cartoon alive
// ═══════════════════════════════════════════════════════════════════════

export const HandDrawn: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 4); // re-jitter every 4 frames = the classic "boil"
  const reach = 0.5 + 0.5 * Math.sin(frame / 18);
  const lean = 4 * Math.sin(frame / 22);
  const heartBeat = 1 + 0.1 * Math.sin(frame / 7);
  const heartOn = interpolate(frame, [120, 160], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#fbf6ec', fontFamily}}>
      <Tag n={2} name="Hand-drawn, alive" light />
      <svg viewBox="0 0 1080 1080" width="1080" height="1080" style={{position: 'absolute', inset: 0}}>
        <defs>
          <filter id="boil" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed={seed} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="14" />
          </filter>
          <filter id="paper">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .04 0" />
          </filter>
        </defs>
        {/* paper grain */}
        <rect x="0" y="0" width="1080" height="1080" filter="url(#paper)" />
        <g filter="url(#boil)">
          {/* ground squiggle */}
          <path d="M110 840 q 120 -18 240 0 t 240 0 t 240 0 t 240 0" fill="none" stroke="#9c8e7a" strokeWidth="6" strokeLinecap="round" />
          {/* pursuer — pencil character leaning in */}
          <g transform={`translate(300 660) rotate(${lean})`} stroke={PURSUER} strokeWidth="11" fill="none" strokeLinecap="round">
            <circle cx="0" cy="-10" r="52" />
            <circle cx="-16" cy="-22" r="5" fill={PURSUER} />
            <circle cx="16" cy="-22" r="5" fill={PURSUER} />
            <path d="M-14 8 q 14 12 28 0" />
            <path d="M0 42 v 120" />
            <path d={`M0 80 q ${50 + 40 * reach} ${-20 - 24 * reach} ${86 + 50 * reach} ${-30 - 28 * reach}`} />
            <path d="M0 80 q -44 26 -56 52" />
            <path d="M0 162 l 40 96 M0 162 l -36 98" />
          </g>
          {/* avoider — arms wrapped, looking away */}
          <g transform={`translate(760 668) rotate(${-lean * 0.7})`} stroke={AVOIDER} strokeWidth="11" fill="none" strokeLinecap="round">
            <circle cx="0" cy="-10" r="52" />
            <circle cx="-20" cy="-24" r="5" fill={AVOIDER} />
            <circle cx="8" cy="-24" r="5" fill={AVOIDER} />
            <path d="M-18 12 q 12 -8 26 0" />
            <path d="M0 42 v 118" />
            <path d="M0 78 q -40 18 -8 38 M0 96 q 38 14 6 30" />
            <path d="M0 160 l 36 98 M0 160 l -32 96" />
          </g>
          {/* a wobbly heart sketches in between them */}
          <g opacity={heartOn} transform={`translate(540 470) scale(${heartBeat})`}>
            <path d="M0 34 C -44 -10 -22 -52 0 -28 C 22 -52 44 -10 0 34 Z" fill="none" stroke={PINK} strokeWidth="10" strokeLinecap="round" strokeDasharray="6 14" />
          </g>
        </g>
      </svg>
      <div style={{position: 'absolute', bottom: 110, left: 0, right: 0, textAlign: 'center', color: '#6f6354', fontSize: 36, fontWeight: 800, transform: 'rotate(-1.5deg)'}}>
        every line redrawn 8 times a second, like a pencil cartoon
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════
// PUSH 3 — MORPH: the storm cloud literally becomes the heart
// ═══════════════════════════════════════════════════════════════════

const N = 90;
const cloudPt = (i: number) => {
  const t = (i / N) * Math.PI * 2;
  const r = 200 + 46 * Math.sin(t * 3 + 1.2) + 26 * Math.sin(t * 7 + 0.4);
  return [Math.cos(t) * r * 1.18, Math.sin(t) * r * 0.74];
};
const heartPt = (i: number) => {
  const t = (i / N) * Math.PI * 2;
  const x = 16 * Math.sin(t) ** 3;
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return [x * 15.5, -y * 15.5];
};

export const MorphSample: React.FC = () => {
  const frame = useCurrentFrame();
  const m = interpolate(frame, [70, 150], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const wob = 1 + 0.02 * Math.sin(frame / 6);
  const pts = [...Array(N)].map((_, i) => {
    const c = cloudPt(i);
    const h = heartPt(i);
    return [c[0] + (h[0] - c[0]) * m, c[1] + (h[1] - c[1]) * m];
  });
  const d = 'M ' + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ') + ' Z';
  const fill = `rgb(${Math.round(60 + (244 - 60) * m)}, ${Math.round(74 + (114 - 74) * m)}, ${Math.round(110 + (182 - 110) * m)})`;
  const bgTop = m < 0.5 ? '#16223c' : '#2a1c34';
  const rain = 1 - m;
  const sparkle = m;
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg,${bgTop} 0%,#0c1426 100%)`, fontFamily, overflow: 'hidden'}}>
      <Tag n={3} name="Shape morphing" />
      {/* rain below the cloud, dies as it morphs */}
      {[...Array(60)].map((_, i) => {
        const x = 320 + rnd(i) * 440;
        const y = 600 + ((frame * (20 + rnd(i + 40) * 14) + rnd(i + 80) * 300) % 360);
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 3, height: 24, background: `rgba(150,180,220,${0.45 * rain})`, borderRadius: 2}} />;
      })}
      {/* sparkles rise once it's a heart */}
      {[...Array(40)].map((_, i) => {
        const x = 280 + rnd(i + 7) * 520;
        const y = 760 - ((frame * (6 + rnd(i + 21) * 8) + rnd(i + 63) * 400) % 460);
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame / 6 + i));
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 7, height: 7, borderRadius: '50%', background: `rgba(249,168,212,${tw * sparkle})`, boxShadow: `0 0 12px rgba(249,168,212,${tw * sparkle})`}} />;
      })}
      <svg viewBox="-540 -540 1080 1080" width="1080" height="1080" style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(0 -40) scale(${wob})`}>
          <path d={d} fill={fill} opacity="0.96" />
          <path d={d} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="3" />
        </g>
      </svg>
      <div style={{position: 'absolute', bottom: 110, left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: 38, fontWeight: 800, textShadow: '0 4px 16px rgba(0,0,0,.5)'}}>
        {m < 0.5 ? 'the same energy that storms...' : '...is the energy that loves'}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// PUSH 4 — PARTICLES: 300 sparks assemble into the heart, then orbit as two
// ═══════════════════════════════════════════════════════════════════════

const P = 300;

export const ParticleSample: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const gather = spring({frame: frame - 20, fps, config: {damping: 14, mass: 1.4}});
  const split = interpolate(frame, [150, 190], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const beat = 1 + 0.06 * Math.sin(frame / 5.5);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #1b2c50 0%, #0a1326 70%)', fontFamily, overflow: 'hidden'}}>
      <Tag n={4} name="300 particles" />
      {[...Array(P)].map((_, i) => {
        // scattered start, heart target, then two orbiting rings
        const sx = rnd(i) * 1080;
        const sy = rnd(i + 1000) * 1080;
        const h = heartPt((i % N));
        const hx = 540 + h[0] * 0.9 * beat + (rnd(i + 3) - 0.5) * 14;
        const hy = 460 + h[1] * 0.9 * beat + (rnd(i + 5) - 0.5) * 14;
        const side = i % 2;
        const oa = (frame * 2.4 + rnd(i + 9) * 360) * (Math.PI / 180);
        const orad = 120 + rnd(i + 11) * 60;
        const ox = 540 + (side ? 200 : -200) + Math.cos(oa) * orad;
        const oy = 520 + Math.sin(oa) * orad * 0.7;
        const x1 = sx + (hx - sx) * gather;
        const y1 = sy + (hy - sy) * gather;
        const x = x1 + (ox - x1) * split;
        const y = y1 + (oy - y1) * split;
        const col = split > 0.5 ? (side ? '#7fb3d8' : '#f0b069') : '#f9a8d4';
        const sz = 5 + rnd(i + 13) * 5;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: sz, height: sz, borderRadius: '50%', background: col, boxShadow: `0 0 ${10 + 6 * Math.sin(frame / 7 + i)}px ${col}`, opacity: 0.5 + 0.5 * rnd(i + 17)}} />;
      })}
      <div style={{position: 'absolute', bottom: 110, left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: 38, fontWeight: 800, textShadow: '0 4px 16px rgba(0,0,0,.6)'}}>
        {split < 0.5 ? 'one connection...' : '...made of two whole people'}
      </div>
    </AbsoluteFill>
  );
};

export const StyleReel3: React.FC = () => (
  <AbsoluteFill style={{background: '#0a1326'}}>
    <Series>
      <Series.Sequence durationInFrames={255}><StormToDawn /></Series.Sequence>
      <Series.Sequence durationInFrames={220}><HandDrawn /></Series.Sequence>
      <Series.Sequence durationInFrames={220}><MorphSample /></Series.Sequence>
      <Series.Sequence durationInFrames={230}><ParticleSample /></Series.Sequence>
    </Series>
  </AbsoluteFill>
);

export const REEL3_TOTAL = 925;
