# Odd Jobs

A free, browser-based career randomiser with a rarity roulette wheel, a three-reel slot machine and a searchable catalogue of over 66,000 job titles. Built as a lightweight static website with no accounts, API keys or cash wagering.

## Play

- **[Wheel](index.html)** — press the centre to start a seven-second spin. The pointer passes twenty segments (10 Common, 5 Uncommon, 3 Rare, 1 Epic, 1 Legendary). The mechanical clicks are synthesised locally in Web Audio as each segment passes. Rarity determines the job-selection pool: a Legendary slice selects exclusively from 30 curated high-paying specialist and executive careers, never from the entire catalogue. Every occupation is eligible within one of the tiers.
- **[Slots](slots.html)** — three mechanically scrolling reels, each showing an independent, uniformly sampled digit from 0–9. Reels stop sequentially with separate stop sounds. 777 (probability 1/1,000) awards a role from the Legendary pool, 000 a demanding job, other triples the Epic pool, pairs the Rare pool, and mixed digits a broader job pool. Effects and sound are original code, not sampled commercial recordings.
- **[Directory](directory.html)** — search all titles, filter by industry and rarity, save favourites in localStorage and navigate to an individual job profile.
- **[Job profile](job.html)** — bookmarked URLs contain the role name. Profiles provide responsibilities, training pathways, work settings, a source label and an Australian annualised earnings estimate or published occupation-group median.

## Career data and pay methodology

The source titles are assembled and deduplicated from:

- [gpriday/job-titles](https://huggingface.co/datasets/gpriday/job-titles), CC BY 4.0. Roughly 65,230 unique titles.
- [European Commission ESCO](https://esco.ec.europa.eu/en), including 499 individual descriptions retrieved from its occupation API.
- [Jobs and Skills Australia](https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles), February 2026 ANZSCO occupation dataset (1,236 occupations and unit groups with descriptive text, 296 occupation groups with usable weekly earnings values).
- A small curated set of unusual, entertainment and adult-industry titles; adult-industry titles are descriptive and non-graphic.

**Australia-specific earnings:** published data represent ABS May 2025 *median weekly earnings of full-time non-managerial adult-rate employees* by ANZSCO occupation group. A published group median is annualised by multiplying the weekly figure by 52 and displayed as an **official occupation-group median** (not an official individual salary). The surrounding range is a modelled indicative band, never an official percentile interval.

**When no verified median is available for a title:** the app estimates a full-time yearly amount using a comparable Australian occupation group where confidently identifiable, an explicit specialist/executive uplift when appropriate, or a broad industry benchmark inferred from published ANZSCO group medians. Seniority adjusts those estimates. Wider uncertainty bands and Low/Medium confidence labels are displayed. These are *not* verified job-specific Australian salaries, and niche/contract or part-time careers may not support meaningful full-time annualisations. No precise wage should be assumed from a modelled value.

**Descriptions:** official ANZSCO and ESCO text is used where a title match exists, some unusual occupations have manually written descriptions, and other titles receive clearly labelled occupation-family overviews with practical tasks. The data are **not** 66,000 individually researched employer job descriptions. Career labels are not standardised worldwide; the directory is deliberately extensive but cannot literally enumerate every possible occupation.

## Run

The project requires no build step. Serve the repository root rather than opening the HTML directly, because catalogue JSON files load via `fetch()`:

```bash
python3 -m http.server 8080
```

Visit http://localhost:8080. The GitHub Pages workflow automatically publishes `*.html`, `*.css`, `js/` and `data/` whenever `main` is updated.

- Live: https://andrianaqz.github.io/odd-jobs-club/
- Netlify-ready via `netlify.toml`; when linked to a Netlify site, publish the repository root.

Accessibility: semantic navigation, keyboard-operable controls, responsive screen sizes, reduced-motion accommodations and a persistent sound mute switch. Sound only begins after a user gesture, following browser autoplay policies.

## Licence and sources

Site code is made for Odd Jobs; separately sourced occupation data retain their upstream licences and attribution. Official occupation descriptions may contain national terms that do not apply to every country.
