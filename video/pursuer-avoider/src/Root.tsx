import {Composition} from 'remotion';
import {DanceVideo, TOTAL_FRAMES} from './Video';
import {AnimatedSamples, SAMPLES_TOTAL} from './animated-samples';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PursuerAvoider"
        component={DanceVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{withAudio: false}}
      />
      <Composition
        id="AnimatedSamples"
        component={AnimatedSamples}
        durationInFrames={SAMPLES_TOTAL}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
