# Asset catalogue — where it lives

There is no list of assets in this file anymore, and there should not be one. A hand-typed
list here always falls behind the real one, so it has been retired to a pointer.

## The one source of truth

The single catalogue of every Coach4U asset is the **Media Library in the Internal Hub**:

https://cathcoach4u.github.io/internal-coach4u-hub/ → Hubs ▸ Media Library

It is backed by the `media_assets` table (Supabase project `uoixetfvboevjxlkfyqy`). Uploading a
file in the Media Library lists it automatically, so the catalogue is always current. To find,
add, edit, or remove any asset, work there. Andrew manages the library in the hub.

## How to add or change an asset

1. Open the Media Library in the hub.
2. Pick the category (Marketing for marketing assets) and the bucket.
3. Upload, rename, or delete there. Do not commit files to any repo.

Where the bytes actually live (the catalogue points at all of these, you never manage them by hand):

- **Images, screenshots, PDFs** → Supabase Storage. `coach4u-public` for anything that can be on
  an open URL (marketing, public pages). `coach4u-internal` for client documents, signed-in only.
- **Video** → Vimeo, catalogued in the Media Library External tab. See `video/README.md`.
- **Brand masters** → the only files kept in this repo, in `Assets/` (see below). They are also
  given a catalogue row so the hub still lists them.

## Using an asset anywhere

Public Storage files and Vimeo videos work from any project by URL, so the same file is referenced
across every repo, the WordPress site, emails, and PDFs without copying it. Public Storage URL shape:

`https://uoixetfvboevjxlkfyqy.supabase.co/storage/v1/object/public/coach4u-public/{path}`

## Brand masters — `Assets/` (this repo, the one exception)

These four stay in git because live pages load them by fixed path. Adding a new master is a manual
upload via the GitHub website (Claude Code sessions cannot push binary files correctly).

| File | What it is |
|---|---|
| `Assets/C4U.png` | Coach4U logo, transparent PNG (master of the deployed copies) |
| `Assets/COACH4U (Final).jpg` | Coach4U logo, full colour JPG |
| `Assets/Cath-Baker-Headshot.jpg` | Cath's headshot (hub Team section) |
| `Assets/Andrew-Headshot.jpeg` | Andrew's headshot (Marketing Manager, Team section) |

## Brand commentary

- Public-facing marketing standard (locked): `CLAUDE.md` in this repo.
- Coach4U master and sub-brand voice, palettes, cloned audio voice: `brand-and-voice.md`.
- Machine-readable brand values: `shared/branding/brand.json`.
