# Asset catalogue — source of truth

This repo is the source of truth for Coach4U brand assets and the inventory of everything
hosted elsewhere. The repo holds the masters and this list; the bytes for everyday uploads live
in Supabase Storage and on Vimeo. Updated 2026-06-12.

## The rules

1. **Masters live in `Assets/`** (logos, headshots). Working copies deployed elsewhere (the
   Internal Hub's `C4U.png`, PWA icons, Journey Card images) stay where they are; they are bound
   to fixed paths and live pages depend on them.
2. **New uploads (images, screenshots, PDFs) go to Supabase Storage**, not the repo, via the CRM
   at Hubs, Media Library (https://cathcoach4u.github.io/internal-coach4u-hub/). Pick the
   category when uploading (Marketing for marketing assets). Supabase project
   `uoixetfvboevjxlkfyqy`, bucket `coach4u-public`.
3. **Video goes to Vimeo**, catalogued in the Media Library External tab. See `video/README.md`.
4. **Add a row here** when an asset matters enough that losing track of it would hurt. This file
   is the inventory; it never holds the bytes.
5. Claude Code sessions cannot push binary files correctly, so adding new masters to `Assets/`
   is a manual upload via the GitHub website.

## Brand masters — `Assets/` (this repo)

| File | What it is |
|---|---|
| `Assets/C4U.png` | Coach4U logo, transparent PNG (the master of the deployed copies) |
| `Assets/COACH4U (Final).jpg` | Coach4U logo, full colour JPG |
| `Assets/Cath-Baker-Headshot.jpg` | Cath's headshot (used on the hub Team section) |
| `Assets/Andrew-Headshot.jpeg` | Andrew's headshot (Marketing Manager, Team section) |

Note: the Internal Hub keeps its own `Assets/Cath Baker Image.jpg` working copy because the live ThriveHQ intro page loads it. That copy stays; the duplicate here was removed 2026-06-12.

## Supabase Storage — `coach4u-public`

URL shape: `https://uoixetfvboevjxlkfyqy.supabase.co/storage/v1/object/public/coach4u-public/{path}`

| File | Category | What it is |
|---|---|---|
| `cfc5baec-a4dc-4dfe-b3df-bb6155b3c039.jpeg` | General | WhatsApp call-link screenshot used on the ThriveHQ body-doubling page (kept under its original filename because the live page links to it) |

`coach4u-internal` (signed-in only) is currently empty.

## Hosted video — Vimeo (catalogued in Media Library, External tab)

| Title | URL | Category | Used in |
|---|---|---|---|
| Welcome to ThriveHQ - Onboarding | https://vimeo.com/1200318724 | ThriveHQ | `thrivehq-onboarding/index.html` (Internal Hub) |
| WhatsApp call link walkthrough — body doubling hosts | https://vimeo.com/1198930362 | ThriveHQ | `thrivehq/body-doubling.html` (Internal Hub) |

## Brand commentary

- Public-facing marketing standard (locked): `CLAUDE.md` in this repo.
- Coach4U master and sub-brand voice, palettes and the cloned audio voice: `brand-and-voice.md`
  in this repo.
- Machine-readable brand values: `shared/branding/brand.json`.
