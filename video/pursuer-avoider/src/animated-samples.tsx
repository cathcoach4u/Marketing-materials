import {AbsoluteFill, Series, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily} from './font';

// Three short style samples of TRUE character/motion animation (not slide cards), so Cath can
// pick the style for the full explainer. Each is self-contained and loops its motion.

const NAVY = '#003366';
const PINK = '#be185d';
const MUTE = '#64748b';
const PURSUER = '#CC8833';
const PURSUER_DK = '#996633';
const AVOIDER = '#3377AA';
const AVOIDER_DK = '#336699';

const Caption: React.FC<{label: string; sub: string}> = ({label, sub}) => (
  <div style={{position: 'absolute', top: 50, left: 0, right: 0, textAlign: 'center'}}>
    <div style={{color: PINK, fontSize: 28, fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase'}}>{label}</div>
    <div style={{color: NAVY, fontSize: 54, fontWeight: 800, marginTop: 8, letterSpacing: '-1px'}}>{sub}</div>
  </div>
);

// A simple expressive person: circle head, capsule body, two legs that can step.
const Person: React.FC<{
  color: string;
  lean?: number;      // degrees, + leans right
  headDrop?: number;  // px, head drooping (sadness/retreat)
  armReach?: number;  // 0..1 arm reaching forward
  step?: number;      // -1..1 legs mid-step
  flip?: boolean;     // face left
}> = ({color, lean = 0, headDrop = 0, armReach = 0, step = 0, flip}) => (
  <svg viewBox="0 0 200 260" width="260" height="338" style={{transform: `${flip ? 'scaleX(-1)' : ''} rotate(${lean}deg)`, transformOrigin: '50% 90%'}}>
    {/* head */}
    <circle cx="100" cy={46 + headDrop} r="30" fill="none" stroke={color} strokeWidth="9" />
    {/* body */}
    <path d={`M100 ${78 + headDrop} L100 170`} stroke={color} strokeWidth="10" strokeLinecap="round" />
    {/* reaching arm */}
    <path d={`M100 105 Q ${130 + 40 * armReach} ${100 - 18 * armReach} ${150 + 38 * armReach} ${96 - 26 * armReach}`} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" />
    {/* back arm */}
    <path d="M100 105 Q 76 130 64 150" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" />
    {/* legs (step swings them apart) */}
    <path d={`M100 170 L${130 + 22 * step} 240`} stroke={color} strokeWidth="10" strokeLinecap="round" />
    <path d={`M100 170 L${72 - 22 * step} 240`} stroke={color} strokeWidth="10" strokeLinecap="round" />
  </svg>
);

// ── Sample 1: the dance — pursuer steps forward, avoider steps back, gap never closes ──
export const DanceSample: React.FC = () => {
  const frame = useCurrentFrame();
  // A 90-frame walk cycle: pursuer advances, avoider retreats the same amount, then both reset
  // via a slow drift (the treadmill effect — the gap is the constant).
  const t = (frame % 90) / 90;
  const stride = Math.sin(t * Math.PI * 2);
  const drift = interpolate(frame % 270, [0, 270], [0, -160]);
  const pursue = 60 * Math.sin((frame / 90) * Math.PI);
  const heartbeat = 1 + 0.08 * Math.sin(frame / 5);
  return (
    <AbsoluteFill style={{background: '#f6f1f4', fontFamily}}>
      <Caption label="Style sample 1" sub="Characters in motion" />
      {/* floor */}
      <div style={{position: 'absolute', bottom: 250, left: 60, right: 60, height: 6, background: '#e2d6dd', borderRadius: 3}} />
      {/* pursuer chases */}
      <div style={{position: 'absolute', bottom: 240, left: 130 + drift + pursue}}>
        <Person color={PURSUER} lean={8} armReach={0.5 + 0.5 * Math.max(0, stride)} step={stride} />
        <div style={{textAlign: 'center', color: PURSUER_DK, fontWeight: 800, fontSize: 30, marginTop: 6}}>the pursuer</div>
      </div>
      {/* avoider retreats, head drooping */}
      <div style={{position: 'absolute', bottom: 240, right: 130 - drift - pursue}}>
        <Person color={AVOIDER} lean={-6} headDrop={8} step={-stride} flip />
        <div style={{textAlign: 'center', color: AVOIDER_DK, fontWeight: 800, fontSize: 30, marginTop: 6}}>the avoider</div>
      </div>
      {/* the gap, pulsing — the thing that never closes */}
      <div style={{position: 'absolute', bottom: 640, left: 0, right: 0, textAlign: 'center'}}>
        <span style={{display: 'inline-block', color: PINK, fontSize: 34, fontWeight: 800, transform: `scale(${heartbeat})`}}>
          the gap stays the same
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ── Sample 2: hailstorm and turtle — falling hail, head retracting into the shell ──
const Hailstone: React.FC<{x: number; delay: number; frame: number}> = ({x, delay, frame}) => {
  const f = (frame + delay) % 60;
  const y = interpolate(f, [0, 60], [330, 760]);
  const o = interpolate(f, [0, 8, 50, 60], [0, 1, 1, 0]);
  return <div style={{position: 'absolute', left: x, top: y, width: 16, height: 16, borderRadius: '50%', background: PURSUER, opacity: o}} />;
};

export const StormTurtleSample: React.FC = () => {
  const frame = useCurrentFrame();
  const rumble = Math.sin(frame / 3) * 4;
  const grow = 1 + 0.1 * Math.sin(frame / 20);
  // The head retracts as the storm peaks, peeks back out as it eases (40-frame phase offset).
  const headOut = interpolate(Math.sin((frame - 40) / 30), [-1, 1], [6, 46]);
  return (
    <AbsoluteFill style={{background: '#f6f1f4', fontFamily}}>
      <Caption label="Style sample 2" sub="The hailstorm and the turtle" />
      {/* storm cloud, rumbling and swelling */}
      <div style={{position: 'absolute', top: 240, left: 140 + rumble, transform: `scale(${grow})`}}>
        <svg viewBox="0 0 64 40" width="340" height="212">
          <path d="M14 34a10 10 0 0 1 1-20 14 14 0 0 1 27 3 9 9 0 0 1-1 17H14z" fill={PURSUER} opacity="0.9" />
        </svg>
        <div style={{textAlign: 'center', color: PURSUER_DK, fontWeight: 800, fontSize: 30}}>the hailstorm</div>
      </div>
      {Array.from({length: 9}).map((_, i) => (
        <Hailstone key={i} x={170 + i * 38 + (i % 3) * 14} delay={i * 9} frame={frame} />
      ))}
      {/* turtle, head retracting and peeking */}
      <div style={{position: 'absolute', bottom: 250, right: 130}}>
        <svg viewBox="0 0 140 90" width="420" height="270">
          {/* shell */}
          <path d="M20 70a50 36 0 0 1 100 0z" fill={AVOIDER} opacity="0.92" />
          <path d="M40 56l14 14M70 46v24M100 56l-14 14" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          {/* head — slides out and back under the shell edge */}
          <g style={{transform: `translateX(${headOut}px)`}}>
            <circle cx="116" cy="62" r="13" fill={AVOIDER_DK} />
            <circle cx="121" cy="59" r="2.5" fill="#fff" />
          </g>
          {/* legs + base line */}
          <path d="M10 70h120M34 70l-5 14M106 70l5 14" stroke={AVOIDER_DK} strokeWidth="6" strokeLinecap="round" />
        </svg>
        <div style={{textAlign: 'center', color: AVOIDER_DK, fontWeight: 800, fontSize: 30}}>the turtle</div>
      </div>
    </AbsoluteFill>
  );
};

// ── Sample 3: the cycle — a spark travels the loop, lighting each stage as it passes ──
const STAGES = [
  {angle: -90, label: 'pursue harder', color: PURSUER_DK, bg: '#FFF5EB', border: PURSUER},
  {angle: 0, label: 'feels like a storm', color: MUTE, bg: '#fff', border: '#e2e8f0'},
  {angle: 90, label: 'withdraw further', color: AVOIDER_DK, bg: '#EBF3FF', border: AVOIDER},
  {angle: 180, label: 'feels like abandonment', color: MUTE, bg: '#fff', border: '#e2e8f0'},
];

export const CycleSample: React.FC = () => {
  const frame = useCurrentFrame();
  const sparkAngle = (frame * 2) % 360 - 90; // degrees, starts at the top
  const R = 300;
  return (
    <AbsoluteFill style={{background: '#f6f1f4', fontFamily, justifyContent: 'center', alignItems: 'center'}}>
      <Caption label="Style sample 3" sub="The cycle, alive" />
      <div style={{position: 'relative', width: 2 * R + 200, height: 2 * R + 160, marginTop: 60}}>
        {/* ring */}
        <div style={{position: 'absolute', left: 100, top: 80, width: 2 * R, height: 2 * R, borderRadius: '50%', border: '5px dashed #d8c5d0'}} />
        {/* travelling spark with a soft tail */}
        {[0, 6, 12].map((lag, i) => {
          const a = ((sparkAngle - lag) * Math.PI) / 180;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 100 + R + R * Math.cos(a) - 14,
                top: 80 + R + R * Math.sin(a) - 14,
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: PINK,
                opacity: 1 - i * 0.35,
                boxShadow: i === 0 ? '0 0 26px rgba(190,24,93,.65)' : 'none',
              }}
            />
          );
        })}
        {/* stage labels light up as the spark passes */}
        {STAGES.map((s, i) => {
          const a = (s.angle * Math.PI) / 180;
          let diff = Math.abs(((sparkAngle - s.angle) % 360 + 360) % 360);
          diff = Math.min(diff, 360 - diff);
          const lit = interpolate(diff, [0, 50, 120], [1, 0.45, 0.3]);
          const pop = interpolate(diff, [0, 40], [1.12, 1], {extrapolateRight: 'clamp'});
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 100 + R + (R + 18) * Math.cos(a),
                top: 80 + R + (R + 18) * Math.sin(a),
                transform: `translate(-50%, -50%) scale(${pop})`,
                background: s.bg,
                border: `3px solid ${s.border}`,
                color: s.color,
                opacity: 0.35 + 0.65 * lit,
                fontSize: 30,
                fontWeight: 800,
                padding: '14px 26px',
                borderRadius: 99,
                whiteSpace: 'nowrap',
              }}
            >
              {s.label}
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 100 + R, top: 80 + R, transform: 'translate(-50%, -50%)', color: NAVY, fontSize: 36, fontWeight: 800, textAlign: 'center', width: 320, lineHeight: 1.25}}>
          each move sets off the other
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AnimatedSamples: React.FC = () => (
  <AbsoluteFill style={{background: '#f6f1f4'}}>
    <Series>
      <Series.Sequence durationInFrames={240}><DanceSample /></Series.Sequence>
      <Series.Sequence durationInFrames={240}><StormTurtleSample /></Series.Sequence>
      <Series.Sequence durationInFrames={240}><CycleSample /></Series.Sequence>
    </Series>
  </AbsoluteFill>
);

export const SAMPLES_TOTAL = 720;
