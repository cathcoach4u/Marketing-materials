# Video production — source of truth

This is the canonical guide for making, hosting and cataloguing Coach4U video and media. It
replaces the `ai-video-agent/` pipeline (now legacy) and brings across the approach proven in
the Internal Hub. New video projects live in this folder, one sub-folder per video:
`video/<project-name>/`.

## The stack (how a video gets made)

Videos are generated in code, inside the Claude Code sandbox. No GUI tools.

- **Claude Code** orchestrates the whole thing.
- **[Remotion](https://remotion.dev)** (open source, React to MP4) renders the video. It runs on
  Node plus a bundled headless Chrome and bundled ffmpeg, all of which work in the sandbox.
- **ElevenLabs** provides Cath's cloned voice (voice id `V50HFUKIgwPl4QEG3try`) via the TTS API.

This was chosen after ruling out the alternatives: NotebookLM and Adobe Express are GUI or
account tools the sandbox cannot drive; ElevenLabs has no video generation (audio only); and a
NotebookLM MCP only works in local Claude Code on your own machine, not the cloud sandbox.
Remotion is the one that runs where Claude Code runs.

## Coach4U-wide conventions (reuse these for every video)

- **Format:** square 1080 x 1080, around 90 seconds.
- **Design:** each step is a card with progress dots. The reusable template: brand bar plus
  wordmark, phase chips, numbered step cards, presenter circle bottom right, animated
  word-by-word sign-off.
- **Brand:** public-facing marketing videos follow the Brand Lock in this repo's `CLAUDE.md`
  (Inter Bold headings, Montserrat body, `#1B3664` / `#5684C4`). Sub-brand videos (ThriveHQ,
  Couples, NDIS, Strengths) swap in their own palette and tone from
  `internal-coach4u-hub/docs/brand-and-voice.md`.
- **Fonts:** inline the fonts as base64 in `src/fontface.ts`. Headless Chrome cannot reach
  Google Fonts through the sandbox proxy, and `delayRender` at module scope breaks the render,
  so embedding the font avoids both. Do not reintroduce a network or `delayRender` font loader.
- **Voice:** one ElevenLabs call per scene, padded with real silence (lead-in, a beat between
  steps, a tail) and concatenated with ffmpeg, so the pacing is not rushed. The script also
  writes a timing JSON so scene cuts are timestamp-synced to the narration. Delivery note: say
  times warmly ("six in the evening", not the sharp "6 pm").
- **What gets committed:** source only. `node_modules/`, `out/` (the MP4s) and `public/`
  binaries are not committed. They are regenerable, and the finished MP4 lives on Vimeo.

## The worked template

`internal-coach4u-hub/video/thrivehq-onboarding/` is the complete reference project (the
ThriveHQ onboarding video, live at Vimeo `1200318724`). Its `README.md` has the exact
re-render commands and a file-by-file map. Copy that project's structure as the starting
point for any new video here, then swap the scenes, palette and narration.

## Hosting: Vimeo (video) vs Supabase Storage (files)

- **Video goes to Vimeo.** Purpose-built player, transcoding and streaming bandwidth.
  Upload is manual: render the MP4, Cath uploads it via the Vimeo app or website, then files
  the link in the CRM (Hubs, Media Library, External tab). Automated upload is dormant because
  Vimeo gates the Upload scope on the free tier.
- **Watch link** (share with humans): `https://vimeo.com/{ID}` (strip any `?share=` / `?fl=`
  tracking params before saving). **Embed src** (inside an iframe):
  `https://player.vimeo.com/video/{ID}`.

## Digital uploads (images, PDFs, anything not video)

Do not commit images or other binaries to this repo. Repo commits are for code and markdown
only (the existing `Assets/` brand images stay where they are as legacy fixed-path assets).

Uploads go to **Supabase Storage** in the shared Coach4U project (`uoixetfvboevjxlkfyqy`,
the same Supabase project behind the Internal Hub CRM):

1. Open the CRM at **Hubs, Media Library** (https://cathcoach4u.github.io/internal-coach4u-hub/).
2. Upload to the `coach4u-public` bucket (public read) for anything used on marketing pages.
3. Copy the public URL and paste it into the page HTML. URL shape:
   `https://uoixetfvboevjxlkfyqy.supabase.co/storage/v1/object/public/coach4u-public/{filename}`
4. Pick descriptive kebab-case filenames (`whatsapp-call-link.jpeg`, not `IMG_1234.png`).

This matters because the GitHub tooling used in these sessions cannot write binary files
correctly, so committing images through it produces broken files. Storage avoids the problem
entirely and one URL serves every page.

## Where credentials live (the rule)

- **Claude Code uses it** (ElevenLabs for the render): a Claude Code environment variable.
  `ELEVENLABS_API_KEY` is already set in the "Default" environment, so it is available every
  session. Never in chat, never in the repo.
- **An Edge Function or the CRM uses it** (Vimeo, Graph, Stripe): a Supabase secret.
- Never put a key in the repo. Rotate any key that has been pasted into a chat once it has
  served its purpose.

## How a new session picks this up

1. Read this file, plus `CLAUDE.md` (brand lock) and, for sub-brand work,
   `internal-coach4u-hub/docs/brand-and-voice.md`.
2. Copy the structure of `internal-coach4u-hub/video/thrivehq-onboarding/` into
   `video/<new-project>/` here and adapt it.
3. The ElevenLabs key is already an env var. Regenerate voice if the wording changed; the rest
   renders from committed source.
4. Upload the rendered MP4 to Vimeo and file the link in the CRM Media Library (External tab).
