import {AbsoluteFill, Audio, Series, staticFile} from 'remotion';
import timing from './timing-final.json';
import {
  IntroScene,
  StoryScene,
  TitleScene,
  InstinctsScene,
  InnerFeelingsScene,
  ImagoScene,
  TrapCycle,
  UnderneathScene,
  ShiftScene,
  ReframeScene,
  StepScene,
  CloseScene,
} from './final-scenes';

// THE DANCE — re-cut to the Coach4U video framework (see ../README.md):
// Recognition, Validation, Simple Understanding, Emotional Shift, Hope, Action, Closure.
// Frame counts are timestamp-synced to the narration (gen_voice_final.py).
export const TheDanceVideo: React.FC<{withAudio?: boolean}> = ({withAudio = false}) => {
  // Scene order follows the framework: stamp, recognition, name it, validation,
  // what's underneath x2 (the pivot), one model, the trap, hope, three steps, closure.
  const scenes: React.ReactNode[] = [
    <IntroScene />,
    <StoryScene />,
    <TitleScene />,
    <InstinctsScene />,
    <InnerFeelingsScene />,
    <ImagoScene />,
    <TrapCycle />,
    <UnderneathScene />,
    <ShiftScene />,
    <ReframeScene />,
    <StepScene num={1} title="Name the pattern, not the partner" quote={'“I think we’re in that pattern again. Can we slow this down?”'} />,
    <StepScene num={2} title="Soften how you reach" sub="If you move towards." quote={'“I’m feeling disconnected, and it’s making me anxious. Can we talk when you’re ready?”'} />,
    <StepScene num={3} title="Stay connected while taking space" sub="If you move away." quote={'“I’m getting overwhelmed. I need twenty minutes. Then I’ll come back.”'} />,
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
