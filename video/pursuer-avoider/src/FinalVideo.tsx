import {AbsoluteFill, Audio, Series, staticFile} from 'remotion';
import timing from './timing-final.json';
import {
  TitleScene,
  StoryScene,
  ResearchScene,
  InstinctsScene,
  PursuerScene,
  AvoiderScene,
  ImagoScene,
  Trap3D,
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
    <TitleScene />,
    <StoryScene />,
    <ResearchScene />,
    <InstinctsScene />,
    <PursuerScene />,
    <AvoiderScene />,
    <ImagoScene />,
    <Trap3D />,
    <TurnScene />,
    <StopScene />,
    <ReframeScene />,
    <StepScene num={1} title="Name the dance, not the partner" quote={'“I think we are in our dance right now. Can we slow down?”'} />,
    <StepScene num={2} title="The turtle says when" sub="A pause with a return time feels safe." quote={'“I need half an hour. I am not going anywhere, and I will come back at eight.”'} />,
    <StepScene num={3} title="The storm softens" sub="Easing off is what makes the conversation possible." quote={'“Okay. Eight works. Thank you for telling me.”'} />,
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
