import {AbsoluteFill, Series, interpolate, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {useMemo} from 'react';
import {fontFamily} from './font';

// Style reel 3D — real three.js scenes rendered inside Remotion (software GL in the sandbox).
// Scene 1: the dance in true 3D — two glossy spheres orbiting on a reflective floor.
// Scene 2: an extruded glass-pink heart turning under studio lights with a particle field.
// Scene 3: CSS 3D — the cycle as a ring of cards the camera flies around.

const NAVY = '#003366';
const PINK = '#be185d';

const Tag: React.FC<{n: number; name: string}> = ({n, name}) => (
  <div style={{position: 'absolute', top: 44, left: 0, right: 0, textAlign: 'center', zIndex: 60, fontFamily}}>
    <span style={{background: 'rgba(8,16,34,.6)', border: '2px solid #f9a8d4', color: '#f9a8d4', fontSize: 26, fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', padding: '10px 26px', borderRadius: 99}}>
      3D {n} &middot; {name}
    </span>
  </div>
);

const Caption: React.FC<{text: string}> = ({text}) => (
  <div style={{position: 'absolute', bottom: 100, left: 0, right: 0, textAlign: 'center', zIndex: 60, fontFamily}}>
    <span style={{color: '#fff', fontSize: 38, fontWeight: 800, textShadow: '0 4px 18px rgba(0,0,0,.6)'}}>{text}</span>
  </div>
);

// ═════════════════════════════════════════════════════════════
// 3D SCENE 1 — the dance: two spheres orbit, chase and retreat
// ═════════════════════════════════════════════════════════════

export const Dance3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const t = frame / 30;
  // The pursuer's orbit slowly tightens toward centre; the avoider's widens — same dance, 3D.
  const chase = 0.55 + 0.45 * Math.sin(t * 0.7);
  const a = t * 1.1;
  const r1 = 1.6 - 0.7 * chase;
  const r2 = 1.6 + 0.7 * chase;
  const camA = t * 0.25;
  const bob1 = 0.9 + 0.18 * Math.sin(t * 2.4);
  const bob2 = 0.9 + 0.18 * Math.sin(t * 2.4 + 2);
  return (
    <AbsoluteFill style={{background: '#070e1e'}}>
      <ThreeCanvas
        width={width}
        height={height}
        gl={{antialias: true}}
        camera={{position: [Math.sin(camA) * 7.5, 2.6 + 0.4 * Math.sin(t * 0.5), Math.cos(camA) * 7.5], fov: 42}}
        onCreated={({camera}) => camera.lookAt(0, 0.7, 0)}
      >
        <color attach="background" args={['#070e1e']} />
        <fog attach="fog" args={['#070e1e', 8, 18]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[6, 9, 4]} intensity={1.6} color="#fff1de" />
        <pointLight position={[0, 4, 0]} intensity={26} color="#f9a8d4" />
        <pointLight position={[-5, 1.5, -3]} intensity={10} color="#5684C4" />
        {/* pursuer sphere */}
        <mesh position={[Math.cos(a) * r1, bob1, Math.sin(a) * r1]} castShadow>
          <sphereGeometry args={[0.72, 64, 64]} />
          <meshPhysicalMaterial color="#CC8833" roughness={0.18} metalness={0.15} clearcoat={0.8} emissive="#5a3208" emissiveIntensity={0.35} />
        </mesh>
        {/* avoider sphere */}
        <mesh position={[Math.cos(a + Math.PI) * r2, bob2, Math.sin(a + Math.PI) * r2]} castShadow>
          <sphereGeometry args={[0.72, 64, 64]} />
          <meshPhysicalMaterial color="#3377AA" roughness={0.18} metalness={0.15} clearcoat={0.8} emissive="#0c2b44" emissiveIntensity={0.35} />
        </mesh>
        {/* the line of tension between them */}
        <group position={[((r1 - r2) / 2) * Math.cos(a), (bob1 + bob2) / 2, ((r1 - r2) / 2) * Math.sin(a)]} rotation={[0, -a, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.012, 0.012, r1 + r2, 8]} />
            <meshStandardMaterial color="#f9a8d4" emissive="#be185d" emissiveIntensity={1.4} transparent opacity={0.65} />
          </mesh>
        </group>
        {/* glossy dark floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial color="#0d1830" roughness={0.35} metalness={0.65} />
        </mesh>
        {/* orbit guide ring on the floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
          <ringGeometry args={[1.55, 1.62, 96]} />
          <meshBasicMaterial color="#2a4470" transparent opacity={0.8} />
        </mesh>
      </ThreeCanvas>
      <Tag n={1} name="Real 3D — the dance" />
      <Caption text="the closer one chases, the wider the other circles" />
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════
// 3D SCENE 2 — extruded glass heart under studio lights
// ═════════════════════════════════════════════════════════════

const useHeartGeometry = () => {
  return useMemo(() => {
    const x = 0, y = 0;
    const s = new THREE.Shape();
    s.moveTo(x + 0.5, y + 0.5);
    s.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
    s.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
    s.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
    s.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
    s.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1, y);
    s.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);
    const g = new THREE.ExtrudeGeometry(s, {depth: 0.5, bevelEnabled: true, bevelSegments: 6, bevelSize: 0.12, bevelThickness: 0.12, curveSegments: 32});
    g.center();
    return g;
  }, []);
};

const useStarField = () => {
  return useMemo(() => {
    const n = 500;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 6 + Math.random() * 10;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.cos(ph) * 0.6;
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
};

export const Heart3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const t = frame / 30;
  const geo = useHeartGeometry();
  const stars = useStarField();
  const beat = 1.6 * (1 + 0.05 * Math.pow(Math.max(0, Math.sin(t * 3.6)), 6));
  return (
    <AbsoluteFill style={{background: '#120a1c'}}>
      <ThreeCanvas
        width={width}
        height={height}
        gl={{antialias: true}}
        camera={{position: [0, 0.4, 6.4], fov: 40}}
        onCreated={({camera}) => camera.lookAt(0, 0, 0)}
      >
        <color attach="background" args={['#120a1c']} />
        <fog attach="fog" args={['#120a1c', 9, 18]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 6, 5]} intensity={1.8} color="#ffe9f3" />
        <pointLight position={[-5, -2, 4]} intensity={18} color="#5684C4" />
        <pointLight position={[4, 3, -3]} intensity={16} color="#f9a8d4" />
        <group rotation={[0.12 * Math.sin(t * 0.8), t * 0.7, Math.PI]} scale={[beat, beat, beat]} position={[0, 0.1, 0]}>
          <mesh geometry={geo} castShadow>
            <meshPhysicalMaterial color="#be185d" roughness={0.1} metalness={0.1} clearcoat={1} clearcoatRoughness={0.1} sheen={1} sheenColor="#f9a8d4" emissive="#5b0c30" emissiveIntensity={0.5} />
          </mesh>
        </group>
        <points geometry={stars} rotation={[0, t * 0.06, 0]}>
          <pointsMaterial color="#f3c4dd" size={0.045} sizeAttenuation transparent opacity={0.85} />
        </points>
      </ThreeCanvas>
      <Tag n={2} name="Sculpted glass heart" />
      <Caption text="a real 3D object, lit like a studio shot" />
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════
// 3D SCENE 3 — CSS 3D: the cycle as a ring of cards in deep space
// ═════════════════════════════════════════════════════════════

const CARDS = [
  {text: 'pursue harder', bg: '#FFF5EB', bd: '#CC8833', fg: '#996633'},
  {text: 'feels like a storm', bg: '#ffffff', bd: '#cbd5e1', fg: '#64748b'},
  {text: 'withdraw further', bg: '#EBF3FF', bd: '#3377AA', fg: '#336699'},
  {text: 'feels like abandonment', bg: '#ffffff', bd: '#cbd5e1', fg: '#64748b'},
  {text: 'pursue harder', bg: '#FFF5EB', bd: '#CC8833', fg: '#996633'},
  {text: 'feels like a storm', bg: '#ffffff', bd: '#cbd5e1', fg: '#64748b'},
  {text: 'withdraw further', bg: '#EBF3FF', bd: '#3377AA', fg: '#336699'},
  {text: 'feels like abandonment', bg: '#ffffff', bd: '#cbd5e1', fg: '#64748b'},
];

export const Carousel3D: React.FC = () => {
  const frame = useCurrentFrame();
  const spin = frame * 0.55;
  const dive = interpolate(frame, [0, 90], [1750, 950], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const RADIUS = 620;
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, #15264a 0%, #070e1e 75%)`, fontFamily, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, perspective: dive, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'relative', width: 0, height: 0, transformStyle: 'preserve-3d', transform: `rotateX(-14deg) rotateY(${spin}deg)`}}>
          {CARDS.map((c, i) => {
            const ang = (i / CARDS.length) * 360;
            // depth cue: cards facing away dim down
            const rel = ((ang + spin) % 360 + 360) % 360;
            const facing = Math.cos((rel * Math.PI) / 180);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: -190,
                  top: -80,
                  width: 380,
                  height: 160,
                  borderRadius: 20,
                  background: c.bg,
                  border: `4px solid ${c.bd}`,
                  color: c.fg,
                  fontSize: 38,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '0 22px',
                  transform: `rotateY(${ang}deg) translateZ(${RADIUS}px)`,
                  opacity: 0.35 + 0.65 * Math.max(0, -facing),
                  boxShadow: '0 18px 50px rgba(0,0,0,.4)',
                  backfaceVisibility: 'hidden',
                }}
              >
                {c.text}
              </div>
            );
          })}
          {/* centre core */}
          <div style={{position: 'absolute', left: -150, top: -52, width: 300, height: 104, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f9a8d4', fontSize: 40, fontWeight: 800, textAlign: 'center', transform: `rotateY(${-spin}deg)`}}>
            the cycle
          </div>
        </div>
      </div>
      <Tag n={3} name="Card carousel in depth" />
      <Caption text="the loop you can fly a camera around" />
    </AbsoluteFill>
  );
};

export const StyleReel3D: React.FC = () => (
  <AbsoluteFill style={{background: '#070e1e'}}>
    <Series>
      <Series.Sequence durationInFrames={240}><Dance3D /></Series.Sequence>
      <Series.Sequence durationInFrames={240}><Heart3D /></Series.Sequence>
      <Series.Sequence durationInFrames={210}><Carousel3D /></Series.Sequence>
    </Series>
  </AbsoluteFill>
);

export const REEL3D_TOTAL = 690;
