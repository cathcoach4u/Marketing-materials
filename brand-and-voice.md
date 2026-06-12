# Brand and voice — Coach4U master + sub-brands

> The single reference for how Coach4U looks, sounds and speaks, written voice, spoken (cloned)
> voice and visual brand, across every area. Moved here from the Internal Hub
> (`internal-coach4u-hub/docs/brand-and-voice.md`) on 2026-06-12 so all brand commentary lives in
> the marketing repo. Structure: a Coach4U master that applies everywhere, then sub-brands
> (ThriveHQ, Couples, NDIS, Strengths) that inherit the master and add their own palette and tone.
> Anything client-facing, a page, a Journey Card, an email, a video, an AI draft, should pull
> from here.

## How this fits with the Brand Lock in CLAUDE.md

- **`CLAUDE.md` (this repo) holds the locked public-facing marketing standard**: Inter Bold and
  Montserrat, `#1B3664` and `#5684C4`, the locked footer. That governs the website, marketing
  pages, print, PDF and the video agent outputs aimed at a cold audience.
- **This document covers the Coach4U product master and sub-brands**: the voice, the cloned audio
  voice, and the palettes used on the client-facing app pages, Journey Cards and area videos
  (navy `#003366` and teal `#0D9488` territory).
- When in doubt: cold-audience marketing follows the Brand Lock; client-facing journey and
  membership material follows the master and sub-brand below.

## How this is structured

- **Coach4U master** = the umbrella. Applies to everything unless a sub-brand overrides it.
- **Sub-brands** = ThriveHQ / Couples / NDIS / Strengths. Each inherits the master voice and tone
  and adds its own accent palette and audience-specific tone notes.
- The detailed written-voice rules live in the Internal Hub at `docs/cath-voice-tone-v1.md`
  (canonical) and the inline `CATH_VOICE_REFERENCE` constant. The video pipeline lives in this
  repo at `video/README.md`. This doc ties voice, tone and visual brand together.

---

## Coach4U master (applies everywhere)

### Written voice and tone — `internal-coach4u-hub/docs/cath-voice-tone-v1.md` (canonical)

Australian English; no exclamation marks, no emojis, no clinical language, no filler; warm,
grounded, decisive; strengths-based (patterns, not deficits); reduces cognitive load; sign-off
`Thanks` / `Cath`. Used by Lou and every AI generation via `CATH_VOICE_REFERENCE`. Read that doc
before drafting any copy.

### Spoken voice (audio) — Cath's cloned voice

- **ElevenLabs voice id `V50HFUKIgwPl4QEG3try`**, Cath's actual cloned voice. This is a
  Coach4U-wide asset: use it for any area's video or audio, not just ThriveHQ.
- The voice id is an identifier, not a secret, so it is safe to keep here. The thing to protect
  is the API key: it lives as the `ELEVENLABS_API_KEY` env var (Claude Code), never in the repo
  or chat.
- Default TTS settings: model `eleven_multilingual_v2`, stability 0.55, similarity 0.75, speaker
  boost on.
- Delivery notes that matter (learned on the ThriveHQ video): say times warmly ("six in the
  evening", not "6 pm" which sounds sharp); leave a lead-in before the first words and a beat
  between points so it does not feel rushed; a small tail at the end so it does not cut off.

### Visual brand (master)

- **Logo masters:** `Assets/` in this repo (see `assets.md` for the full catalogue). The deployed
  copy used by the app and Journey Cards is `C4U.png` at the Internal Hub repo root, a working
  copy bound to fixed paths; do not delete it.
- **Legal footer (client-facing app pages):** `SARUBA PTY LTD t/a Coach4U · ABN 50 678 462 178`.
- **Core palette (client-facing app):** navy `#003366`, teal `#0D9488`, with mint `#5eead4` as
  the highlight. (Cold-audience marketing uses the CLAUDE.md Brand Lock palette instead.)
- **Fonts (client-facing app):** Inter / Aptos / Segoe UI (clean sans). In code-rendered video,
  Inter is inlined (see `video/README.md`).
- **Principle:** symmetry and visual consistency above all. Match spacing, sizing, radius and
  states to existing elements; do not introduce one-off styles.

### Reusable video design system

The square onboarding template (navy brand bar plus wordmark, teal phase chips, white numbered
step cards with progress dots, the presenter circle bottom right, the word-by-word animated
sign-off) is reusable across Coach4U. Swap the palette, script and presenter for the area.
Pipeline and re-render steps: `video/README.md` in this repo. The worked template project is
`internal-coach4u-hub/video/thrivehq-onboarding/`.

---

## Sub-brands

### ThriveHQ — fully specified (first sub-brand built)

- **Audience:** ADHD group-coaching members.
- **Tone:** warm, ADHD-affirming, never shaming; calm and steadying. Signature line:
  "You don't have to do ADHD on your own." Team language ("we / the team") on client-facing
  Journey Cards, except the Cath Guarantee, which uses "I" as a personal commitment.
- **Palette:** navy `#003366`, teal `#0D9488`, mint `#5eead4` (styles in the Internal Hub at
  `thrivehq/style.css`). Wordmark: "Thrive" (navy, or white on dark) plus "HQ" (teal/mint).
- **Spoken voice:** Cath's cloned voice (master settings above).
- **Live assets:** onboarding video Vimeo `1200318724` (project
  `internal-coach4u-hub/video/thrivehq-onboarding/`); public pages under the Internal Hub's
  `thrivehq/` and `thrivehq-onboarding/`.

### Couples

- **Audience:** couples coaching and counselling.
- **Accent:** pink `#be185d` (Couples Hub / journey cards). **Tone:** warm, non-judgmental,
  holds both partners; the client is the couple; team language. Frameworks: EFT, Gottman, Imago
  and so on (factual, never adjudicating).
- Palette and video assets: to be filled in when Couples materials are produced.

### NDIS

- **Accent:** teal `#0f766e` / blue `#2563eb`. **Tone:** clear, capacity-building,
  NDIS-defensible (tie support to plan goals); may use "Cath" by name for a personal touch (per
  the Journey Card rule).
- Palette and video assets: to be filled in when NDIS materials are produced.

### Strengths

- **Accent:** green `#16a34a`. **Tone:** strengths-based, CliftonStrengths/Gallup language;
  developmental, not evaluative.
- Palette and video assets: to be filled in when Strengths materials are produced.

---

## Making a branded video for any Coach4U area

1. Copy the ThriveHQ template (`internal-coach4u-hub/video/thrivehq-onboarding/`) into
   `video/<area-name>/` in this repo (see `video/README.md`).
2. Swap the palette to the sub-brand (above); keep the master visual system (cards, dots,
   presenter).
3. Write the script in Cath's master voice plus the sub-brand's tone.
4. Generate audio with the cloned voice; render; upload to Vimeo; catalogue in the CRM Media
   Library (External tab).

> When a new sub-brand (or a fuller spec for Couples/NDIS/Strengths) is locked in, fill it in
> here. This doc is the place the whole-of-Coach4U voice and brand is kept consistent.
