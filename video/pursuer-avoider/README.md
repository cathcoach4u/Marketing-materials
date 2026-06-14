# The Dance — Pursuer and Avoider video (Remotion project)

Journey video 1 for Your Relationship Coach. Square 1080x1080, ~101 seconds, Couples accent
`#be185d`, pursuer amber / avoider blue matched to the portal's
`resources/relationships/pursuer-avoider-dynamics.html` so video and page read as one piece.
Script: `script.md`. Pipeline conventions: `../README.md`.

## Re-render

```bash
cd video/pursuer-avoider
npm install
cp "../../Assets/Cath-Baker-Headshot.jpg" public/cath.jpg

# Voice (only if wording changes). Voice id defaults to Cath's clone.
ELEVENLABS_API_KEY=sk_... python3 gen_voice.py
#   → public/voiceover.mp3 + src/timing.json

npx remotion render src/index.ts PursuerAvoider out/the-dance-pursuer-avoider.mp4 --props='{"withAudio":true}'
```

## Compositions

| Id | What |
|----|------|
| `PursuerAvoider` | The full video — 10 scenes (see `script.md`), `src/Video.tsx` + `src/scenes.tsx`. |
| `AnimatedSamples` | Three 8-second style samples of character/motion animation (figures dance, hailstorm + turtle, living cycle loop) — `src/animated-samples.tsx`. Made for choosing the animation style of the full explainer. |

## Not committed (regenerable / binary)

`node_modules/`, `out/` (MP4s — final video lives on Vimeo), `public/` binaries
(`voiceover.mp3`, `cath.jpg`). `src/timing.json` IS committed so the video renders silent
without the voice step. Fonts are inlined in `src/fontface.ts`.

## Where it lands

The finished MP4 is uploaded to Vimeo (manually — free tier gates the upload API), then the
numeric ID is pasted into `VIMEO_ID` in `yourrelationshipcoach/journey/pursuer-avoider.html`.
