# Odd Jobs Club

A casino-inspired, **no-stakes** random career explorer with a roulette wheel, a sequential three-reel lucky-sevens slot machine, and a searchable, saveable directory of more than 65,000 occupation titles.

## Games

- **Career roulette:** choose an industry, select the complete catalogue or editorial spotlight, and spin. The outcome is chosen uniformly from the stated pool before the animation; the wheel's pointer lands on that result.
- **Lucky sevens:** three independent uniform digits between 0 and 9 are drawn, displayed one after the other, and mapped to a theme. Exact `777` is a **1-in-1,000** high-flyer draw; `000` is a tough-gig draw; other triples are dream careers; pairs are everyday careers; remaining outcomes draw from the full catalogue. These are editorial groupings, not measured salary rankings.
- **Directory:** search by title, filter by industry, browse in pages, save jobs locally, and share a result. Saved jobs stay in the browser using localStorage.

## Data and attribution

- [gpriday/job-titles](https://huggingface.co/datasets/gpriday/job-titles) — CC BY 4.0; 65,230 unique titles included in `data/additional-titles.json`.
- [ESCO occupation API](https://ec.europa.eu/esco/api/) — European Commission ESCO; a 500-title supplementary sample in `data/occupations.json`.
- Additional hand-curated unusual and adult-industry titles in `app.js`.

This is a broad *title* dataset, not an exhaustive list of all jobs, a standardised classification, verified current vacancies, pay data, or guidance about where specific roles are legal. Categories are heuristic keyword groupings; they can be imperfect. Adult-industry occupations are included only as non-graphic names.

## Run locally

Serve the root as a static website (opening the HTML as `file://` does not allow browser fetch of the JSON files):

```bash
python3 -m http.server 8080
```

Open http://localhost:8080. No dependencies or API keys required.

## Deploy

The site is ready for static hosting on Netlify with `netlify.toml` pointing to the repository root. `data/` must be included in the published files. No server-side functions or secrets are needed.

## Accessibility

Keyboard-operated controls, visible focus, semantic navigation and labels, reduced-motion support, readable result announcements, and optional muted sound effects.

© 2026 Odd Jobs Club. Data sources retain their own licences.
