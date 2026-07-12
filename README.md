# Research report site — starter scaffold

A static site built around two "movements," each shown three ways, top to bottom:

1. **Full-length trial video** — one video, with NI and Para participants already combined side by side inside the frame.
2. **Trimmed clip with angle overlay** — one video, also NI/Para pre-combined in-frame, with the joint-angle graph already baked into the footage (e.g. rendered in MATLAB). No JavaScript video/data syncing happens on this site at all — both video tiers are just plain `<video>` playback.
3. **3 static comparison charts, side by side** — one for hip, one for knee, one for ankle, each overlaying NI vs Para (teal vs coral) so the two groups are easy to compare at each joint.

No build tools, no backend — just HTML/CSS/JS, so it works directly on GitHub Pages.

## Swap in your own content

### Videos
Put your `.mp4` files in the `videos/` folder, then update the `<source src="...">` paths in `index.html`. There are 4 video slots, 2 per movement:

| Movement | Full-length trial | Trimmed clip w/ angle overlay |
|---|---|---|
| 1 | `#m1Full` | `#m1Step` |
| 2 | `#m2Full` | `#m2Step` |

Since NI and Para are already combined into each file, there's nothing else to configure for playback — just point the `src` at your file.

Keep files under ~50–100MB if possible for fast loading; for longer/larger video, consider hosting on YouTube/Vimeo and embedding an iframe instead (ask me and I can wire that up).

### Joint-angle comparison data
Open `js/main.js` and look at `SAMPLE_SERIES`. It's nested by movement → group → joint, and only feeds the 3 static comparison charts (not the videos):

```js
const SAMPLE_SERIES = {
  m1: {
    ni:   { hip: [...], knee: [...], ankle: [...] },   // Movement 1, NI
    para: { hip: [...], knee: [...], ankle: [...] },   // Movement 1, Para
  },
  m2: {
    ni:   { hip: [...], knee: [...], ankle: [...] },   // Movement 2, NI
    para: { hip: [...], knee: [...], ankle: [...] },   // Movement 2, Para
  },
};
```

Each joint's array is a time series shaped like `[{ t: 0, value: 42.1 }, { t: 0.5, value: 43.0 }, ...]`, where `t` is seconds and `value` is the joint angle in degrees.

If your data lives in CSVs, the easiest path is: export each of the 12 series (2 movements × 2 groups × 3 joints) to its own small `.json` file in that `{t, value}` shape, drop them in `data/`, and fetch them before the `DOMContentLoaded` handler runs — happy to help wire that up once you share a sample of your real CSV format.

### Titles & labels
- Replace "Name of movement 1" / "Name of movement 2" in `index.html` with your real movement names.
- The video labels and captions currently say "full length trial" / "trimmed, with angle overlay" — adjust wording as needed.

## Deploy to GitHub Pages

1. Create a new GitHub repo, e.g. `your-username.github.io` for a root-level site, or any name for a project site.
2. Upload this folder's contents (not the folder itself) via **Add file → Upload files** in the repo, then **Commit changes**.
3. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main / (root)**.
4. Your site will be live at the URL shown on that Pages settings screen.
