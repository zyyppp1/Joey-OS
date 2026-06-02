# Legacy — Joey OS v1 (retro desktop)

The original portfolio: a draggable retro **desktop OS**. Preserved as a
self-contained, independently-extensible module — the new portfolio does **not**
import anything in here, and this module imports nothing outside it (its own
copy of blog data lives in `./data/blogs.ts`).

- **Entry point in the new site:** route `app/joey-os/page.tsx` → `JoeyOSExhibit`.
- **Permanent git marker:** tag `v1-retro-desktop` (commit c33a667).
- Safe to keep building on in the retro style without affecting the new portfolio.
