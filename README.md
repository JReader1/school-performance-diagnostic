# Caelora Academy — School Performance & Experience Diagnostic

**Reader Analytics | Fictional private K–12 school | Synthetic case study**

This is an interactive prototype for demonstrating enrollment, parent, student and faculty surveys, institutional priorities, enrollment and academic benchmark analysis. Caelora Academy is fictional. **No real students, school records, survey participants or client results are represented.** It is not an analysis of any real institution.

## Dashboard

[Open the interactive dashboard](https://jreader1.github.io/school-performance-diagnostic/)

## Reproduce

Requires Node.js 18+ (no packages).

```sh
node scripts/generate.mjs
node scripts/validate.mjs
python -m http.server 8000
```

Visit http://localhost:8000. The fixed seed is 20261102. The HTML dashboard loads `data/synthetic.json` via fetch and must be hosted over HTTP(S).

## Structure

- `scripts/generate.mjs`: reproducible fictional records
- `data/synthetic.json`: relational data across 2023–24, 2024–25, 2025–26, including dedicated faculty rosters and anonymous faculty response cohorts
- `scripts/validate.mjs`: integrity checks
- `docs/data_dictionary.md`: tables, fields, definitions and caveats
- `docs/decision_brief.md`: sample administrator-facing interpretation
- `index.html`: responsive, filterable public dashboard
- `LICENSE`: MIT for demonstration software; branding rights excluded

## GitHub Pages

Settings → Pages → deploy from `main` / `(root)`. No external dashboard dependencies.

## Analytical cautions

The three pillars—Academic Growth, Character & Culture, and Family Partnership—are illustrative, not the mission statements of any actual school. Perception items are not validated psychometric instruments. Survey responses are anonymous and **never linked to students or families**. Academic benchmarks are generated grade-level aggregates, not individual records or real test performance. These generated patterns cannot support causal claims or claims about real school outcomes.

The purpose is to demonstrate a transparent workflow that would require a real client to agree on actual pillars, governance, survey design and the decision before analyzing actual data.

## Brand and school terminology

The site uses the Reader Analytics identity: Navy `#0A1B3A`, Deep Purple `#5B3FB6`, Steel Blue `#394C8E`, Lavender `#A78BFA`, Off White `#E6EAF6`, with Playfair Display headings and Inter body text. The horizontal logo is sourced from [the official Reader Analytics site](https://reader-analytics.com/) rather than reproduced or recolored. U.S. school-level filters read **All School; Elementary School (K–5); Middle School (6–8); High School (9–12)**. Respondent audiences are **Parents, Students, Faculty**; faculty denotes teachers, not all support or administrative staff.
