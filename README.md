# Odd Jobs Club

A casino-inspired, **no-stakes** random career explorer with a roulette wheel, a sequential three-reel lucky-sevens slot machine, and a searchable, saveable directory of more than 65,000 occupation titles.

## Games

- **Career roulette:** optionally choose an industry and spin. The 20 colour-coded wheel sectors represent independent rarity badges (Common 50%, Uncommon 25%, Rare 15%, Epic 5%, Legendary 5%), not a list of jobs or job quality scores. When the wheel stops, a job is independently and uniformly sampled from the **entire catalogue** (or every job in the selected industry). A job never needs to appear on the wheel or current directory page to be drawn.
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

**Australian career profiles and earnings:** Official [Jobs and Skills Australia data](https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles) from the February 2026 ANZSCO release is distributed as a compact subset in `data/au-occupations.json`. Descriptions are directly sourced for occupation-title matches; non-matches receive a clearly labelled title-based overview. Pay figures are May 2025 ABS **median full-time non-managerial weekly earnings**, attributed to an ANZSCO 4-digit occupation group and annualised by multiplying by 52. This is not an individual salary prediction; figures for unmatched or suppressed titles are marked unavailable, never invented. Source workbook: https://www.jobsandskills.gov.au/sites/default/files/2026-07/ANZSCO%20Occupation%20data%20-%20February%202026.xlsx.

The site is ready for static hosting on Netlify with `netlify.toml` pointing to the repository root. `data/` must be included in the published files. No server-side functions or secrets are needed.

## Accessibility

Keyboard-operated controls, visible focus, semantic navigation and labels, reduced-motion support, readable result announcements, and optional muted sound effects.

© 2026 Odd Jobs Club. Data sources retain their own licences.
