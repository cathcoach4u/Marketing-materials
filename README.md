# Coach4U Marketing Materials

Marketing hub for Coach4U. Brand standards, marketing plans, session insights, and the AI video agent all live here.

## Map of this repo

| Location | What lives there |
|---|---|
| `CLAUDE.md` | Working instructions and the locked Coach4U brand standard. Read first. |
| `brand-and-voice.md` | Coach4U master and sub-brand voice, palettes, the cloned audio voice and the video design system. Moved here from the Internal Hub 2026-06-12. |
| `assets.md` | Asset catalogue: brand masters in `Assets/`, Supabase Storage uploads and hosted Vimeo videos. The inventory, not the bytes. |
| `Assets/` | Brand image masters: logos and headshots (source of truth; deployed copies stay in their apps). Catalogued in `assets.md`. |
| `plans/` | Marketing plans and strategy documents. Markdown is the source of truth; the HTML pages at the root are the browser views. |
| `insights/` | ThriveHQ session marketing insights, named `YYYY-MM-DD-thrivehq-insights.md` |
| `templates/` | Reusable templates (weekly insights template) |
| `video/` | Video production source of truth (`video/README.md`): the Remotion + ElevenLabs pipeline, brand conventions, Vimeo hosting, and the digital uploads workflow. New video projects go in `video/<project-name>/`. |
| `ai-video-agent/` | Legacy video pipeline (Pillow slides + ffmpeg). Superseded by `video/README.md`. Kept for reference. |
| `shared/branding/brand.json` | Brand colours, fonts and footer in machine-readable form |

## Planning pages (HTML, open in a browser)

| Page | Purpose |
|---|---|
| `index.html` | Marketing Hub home: quick actions and revenue goals |
| `plan.html` | The marketing plan: positioning, audiences, services |
| `plans.html` | Marketing planner (earlier version of plan.html) |
| `content.html` | Content ideas pipeline and client language bank |
| `ndis-program.html` | NDIS Parent Training Program plan and pricing |
| `google-strategy.html` | Google search and AI visibility strategy |

## Conventions

- Dated documents are named date-first: `2026-05-26-thrivehq-insights.md`
- New session insights go in `insights/`, made from `templates/thrivehq-weekly-marketing-insights-template.md`
- New plans go in `plans/`
- Brand rules are locked in `CLAUDE.md`. Do not restyle.
