import {AbsoluteFill, Audio, Series, staticFile} from 'remotion';
import timing from './timing-final.json';
import {
  IntroScene,
  TitleScene,
  StoryScene,
  ResearchScene,
  InstinctsScene,
  PursuerScene,
  AvoiderScene,
  ImagoScene,
  TrapCycle,
  TurnScene,
  StopScene,
  ReframeScene,
  StepScene,
  CloseScene,
} from './final-scenes';

// THE DANCE — 15 scenes, re-cut from the locked deck. Frame counts are
// timestamp-synced to the narration (gen_voice_final.py).
export const TheDanceVideo: React.FC<{withAudio?: boolean}> = ({withAudio = false}) => {
  const scenes: React.ReactNode[] = [
    <IntroScene />,
    <TitleScene />,
    <StoryScene />,
    <ResearchScene />,
    <InstinctsScene />,
    <PursuerScene />,
    <AvoiderScene />,
    <ImagoScene />,
    <TrapCycle />,
    <TurnScene />,
    <StopScene />,
    <ReframeScene />,
    <StepScene num={1} title="Name the dance, not the partner" quote={'“I think we’re in our dance right now. Can we slow down?”'} />,
    <StepScene num={2} title="The storm softens" sub="The pursuer's move: lead with the feeling and the need, not blame." quote={'“I’m feeling disconnected. Can we talk when you’re ready?”'} />,
    <StepScene num={3} title="The turtle returns" sub="The avoider's move: ask before you flood, give a time, and come back." quote={'“I need twenty minutes to settle. Then I’ll come back.”'} />,
    <CloseScene />,
  ];
  return (
    <AbsoluteFill style={{backgroundColor: '#eef3f8'}}>
      {withAudio ? <Audio src={staticFile('voiceover-final.mp3')} /> : null}
      <Series>
        {scenes.map((node, i) => (
          <Series.Sequence key={i} durationInFrames={timing.frames[i] ?? 150}>
            {node}
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};

export const FINAL_TOTAL = timing.total as number;
