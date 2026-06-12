# Coach4U AI Video Agent

> **Legacy.** This pipeline is superseded by the Remotion + ElevenLabs approach documented in
> [`video/README.md`](../video/README.md), brought across from the Internal Hub on 2026-06-12.
> Use that for all new videos. This folder is kept for reference and still runs as described below.

Turns a topic or narration script into a fully branded Coach4U MP4 video.

**Pipeline:** topic/script → Claude script writer → ElevenLabs audio → Pillow slides → ffmpeg → output.mp4

---

## Prerequisites

- Python 3.11+
- ffmpeg installed and on your PATH (`brew install ffmpeg` on Mac, `sudo apt install ffmpeg` on Linux)
- API keys for Anthropic and ElevenLabs
- Your ElevenLabs Voice ID (from the ElevenLabs dashboard)

---

## First-time setup

```bash
cd ai-video-agent
bash setup.sh
```

The setup script:
1. Installs Python packages (`pip install -r requirements.txt`)
2. Downloads Inter Bold and Montserrat Regular into `fonts/`
3. Reminds you to copy `Coach4ULogo.png` into `assets/`
4. Creates `.env` from `.env.example`

**Then fill in `.env`:**

```
ANTHROPIC_API_KEY=...
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=...
```

**Copy the logo** from the coach4u-shared repo:

```bash
cp ../../coach4u-shared/Assets/Coach4ULogo.png assets/
```

---

## Usage

**Give it a topic — Claude writes the script:**

```bash
python agent.py --topic "How to use your CliftonStrengths results in everyday life"
```

**Give it a script you wrote yourself:**

```bash
python agent.py --script my-script.json
```

**Custom output path:**

```bash
python agent.py --topic "Setting boundaries" --output output/boundaries-video.mp4
```

---

## Script JSON format

If you write your own script, use this structure:

```json
{
  "title": "Your video title",
  "sections": [
    {
      "heading": "Section heading",
      "narration": "Spoken narration for this section. 2-4 sentences.",
      "bullets": ["Key point 1", "Key point 2", "Key point 3"]
    }
  ]
}
```

The generated `output/script.json` from a `--topic` run is valid input for `--script` if you want to edit it before generating audio.

---

## Output

```
output/
  script.json       # generated or copied script
  audio/            # one MP3 per section
  slides/           # one PNG per section (1920x1080)
  output.mp4        # final video
```

---

## Brand standards applied

| Element | Value |
|---|---|
| Slide size | 1920 x 1080 px |
| Background | White |
| Heading colour | `#1B3664` dark blue |
| Body/bullet colour | `#2D2D2D` dark grey |
| Accent bar | `#5684C4` light blue |
| Heading font | Inter Bold |
| Body font | Montserrat Regular |
| Logo | Coach4ULogo.png, top-left |
| Footer | Strengths-Based Coaching and Counselling \| www.coach4u.com.au \| cath@coach4u.com.au \| 0402 313 337 |

---

## Folder structure

```
ai-video-agent/
  agent.py              # entry point
  config.py             # loads .env
  script_writer.py      # Claude API: topic -> structured JSON script
  audio_generator.py    # ElevenLabs: narration -> MP3 per section
  slide_generator.py    # Pillow: script -> branded PNG slides
  video_assembler.py    # ffmpeg: slides + audio -> output.mp4
  assets/               # Coach4ULogo.png (not committed, copy from shared repo)
  fonts/                # Inter-Bold.ttf, Montserrat-Regular.ttf (not committed)
  output/               # generated files (not committed)
  setup.sh              # one-time setup
  requirements.txt
  .env.example
```
