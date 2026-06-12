import {AbsoluteFill, Audio, Series, staticFile} from 'remotion';
import timing from './timing.json';
import {
  HookScene,
  PursuerScene,
  AvoiderScene,
  ImagoScene,
  CycleScene,
  FearsScene,
  ReframeScene,
  StepsScene,
  NoticeScene,
  SignoffScene,
} from './scenes';

// 10 scenes, in order. Frame counts are timestamp-synced to the narration (gen_voice.py).
export const DanceVideo: React.FC<{withAudio?: boolean}> = ({withAudio = false}) => {
  const scenes: React.ReactNode[] = [
    <HookScene />,
    <PursuerScene />,
    <AvoiderScene />,
    <ImagoScene />,
    <CycleScene />,
    <FearsScene />,
    <ReframeScene />,
    <StepsScene />,
    <NoticeScene />,
    <SignoffScene />,
  ];
  return (
    <AbsoluteFill style={{backgroundColor: '#f6f1f4'}}>
      {withAudio ? <Audio src={staticFile('voiceover.mp3')} /> : null}
      <Series>
        {scenes.map((node, i) => (
          <Series.Sequence key={i} durationInFrames={timing.frames[i] ?? 120}>
            {node}
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};

export const TOTAL_FRAMES = timing.total as number;
