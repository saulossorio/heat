# HEAT — Heuristic Evaluation Assessment Tool

**Version:** 2.0  
**Author:** [Saul Ossorio](https://saulossorio.com)  
**License:** © 2026 Saul Ossorio. All rights reserved.

---

## What is HEAT?

HEAT is a lightweight, single-file web app for conducting UX heuristic evaluations —
including comparative studies that pit a domain-specific heuristic set (e.g. AAVIs)
against a control set (e.g. Nielsen). Evaluators log interface problems, assign severity
and specificity, and export results as Excel or a Blau-styled A4 PDF report.

It requires no server, no build step, and no dependencies to install — just open
`index.html` in a browser. Optimised for in-headset use via the VR browser layer
(`data-environment="vr"` on `<html>`).

---

## Quick Start

1. Open `index.html` directly in your browser (double-click or drag into browser).
2. Enter your name and optionally a project name.
3. Select the application and heuristic set, then tap **Iniciar Avaliação**.
4. Switch between **Exploração Livre** and **Modo Tarefa** as needed.
5. Tap **+ Registrar Erro** to open the 7-step wizard for each issue found.
6. Mark tasks as complete on the Tasks tab when finished.
7. Tap **Revisar** to see all errors, then export as `.xlsx`, generate a PDF report,
   or send directly to Google Sheets.

---

## File Structure

```
heat/
├── index.html              Entry point — full React app inlined for file:// compatibility
├── css/
│   └── styles.css          BLAU design tokens, VR layer, PDF print styles
├── js/
│   ├── config.js           ← Edit this: apps, tasks, severity/specificity levels, styles
│   └── heuristics.js       ← Edit this: heuristic sets (Nielsen, domain-specific, etc.)
├── images/                 Optional example images (see naming convention below)
├── api/
│   └── google-apps-script.js  Server-side code for Google Sheets integration
└── README.md               This file
```

> **Why is the app inlined in index.html?**  
> Browsers block module fetches on `file://` URLs, preventing Babel Standalone from
> loading external JSX files. Inlining solves this without a local server.
> `config.js` and `heuristics.js` are plain JS (no JSX) and load normally via
> `<script src="...">` even on `file://`.

---

## Configuration (`js/config.js`)

### Runtime settings (`CONFIG`)

```js
const CONFIG = {
  version:          'Heat v1.2 © 2026',
  author:           'Saul Ossorio',
  authorUrl:        'https://saulossorio.com',
  googleSheetsUrl:  '',          // Paste your Apps Script URL here; leave empty to hide the button
  showImageExamples: false,      // Set to true once images/ is populated
};
```

### Applications and tasks (`APPS` / `TASKS`)

`APPS` defines the environments being evaluated. Each entry's `id` must match a key in `TASKS`:

```js
const APPS = [
  { id: 'my-app', name: 'My App', description: 'Short description.' },
];

const TASKS = {
  'my-app': [
    { id: 't1', name: 'Task name', duration: '10 min', description: 'What to do.' },
  ],
};
```

### Severity levels (`SEVERITY_LEVELS`)

Five levels (0–4), each with a Tailwind background and text colour:

```js
{ level: 2, label: 'Menor', color: 'bg-amber-400', textColor: 'text-slate-800' }
```

### Specificity levels (`SPECIFICITY_LEVELS`)

How precisely the selected heuristic describes the observed problem (0–4).
Uses a cyan → teal → indigo → purple colour scale.

### Heuristic set types (`SET_TYPES`)

Maps each key in `HEURISTIC_SETS` to `'control'` or `'domain'`. Used to filter
which problem classifications are available during error registration:

```js
const SET_TYPES = {
  nielsen: 'control',   // control set → P* and PC only
  domain:  'domain',    // domain set  → P* and PD only
};
```

### Problem classifications (`PROBLEM_CLASSIFICATIONS`)

Labels that identify which heuristic set detected a problem, used in comparative studies:

| Code | Label           | Shown when set type is |
|------|-----------------|------------------------|
| P*   | Problema Comum  | always                 |
| PD   | Apenas Domínio  | domain                 |
| PC   | Apenas Controle | control                |

Each entry has a `scope` field (`'common'`, `'domain'`, or `'control'`) that controls
which options appear in the wizard.

### Style tokens (`S`)

All Tailwind class strings live in `S`. Edit here to restyle the entire app.
Key entries:

| Key              | Purpose                                    |
|------------------|--------------------------------------------|
| `S.page`         | Outermost wrapper                          |
| `S.card`         | White bordered card (BLAU flat aesthetic)  |
| `S.heading1/2`   | Display headings in Raleway                |
| `S.btnPrimary`   | Primary pill button (Blau blue)            |
| `S.btnSecondary` | Ghost button                               |
| `S.input`        | Text input / textarea                      |

---

## Heuristic Sets (`js/heuristics.js`)

```js
const HEURISTIC_SETS = {
  nielsen: {
    name: "Heurísticas de Controle (Nielsen)",
    heuristics: [
      {
        id: 'H1', name: 'Visibility of System Status',
        description: 'Full principle text…',
        goodExample: 'What good looks like…',
        badExample:  'What bad looks like…',
        goodImage:   'images/nielsen-h1-good.jpg',
        badImage:    'images/nielsen-h1-bad.jpg',
      },
    ]
  },
  domain: {
    name: "Heurísticas de Domínio (AAVIs)",
    heuristics: [ … ]
  },
};
```

Add a new set by adding a new key. The set appears in the dropdown automatically.
Remember to add the matching key to `SET_TYPES` in `config.js`.

---

## Error Registration Wizard

Each error is captured through a 7-step modal:

| Step | Field           | Required | Notes                                    |
|------|-----------------|----------|------------------------------------------|
| 1    | Heurística      | Yes      | Single selection (radio)                 |
| 2    | Classificação   | Yes      | P* / PD / PC — filtered by active set   |
| 3    | Severidade      | Yes      | 0 (Nenhum) → 4 (Crítico)               |
| 4    | Especificidade  | Yes      | 0 (Nenhum) → 4 (Muito Alto)            |
| 5    | Localização     | Yes      | Free text or screenshot upload           |
| 6    | Descrição       | Yes      | What happened and how it affects users   |
| 7    | Recomendação    | No       | Suggested fix                            |

---

## PDF Report

The **Visualizar relatório PDF** button on the Review screen opens a self-contained
A4 HTML document in a new tab, styled with the BLAU design system. Use the browser's
print dialog ("Save as PDF") to export.

The report is designed for external stakeholders (app owners, researchers, teachers)
and includes:

- Session metadata (evaluator, date, app, heuristic set)
- Overview statistics (total errors, critical count)
- Violation profile and severity distribution charts (Chart.js)
- Task completion table (Modo Tarefa only)
- **Problemas identificados** — compact table: heuristic ID, severity number (colour-coded), problem description
- **Recomendações** — separate table (only if recommendations exist): error #, heuristic, location, recommendation

Specificity, raw classification codes, and other methodology-internal fields are
omitted from the PDF. They are preserved in the Excel export for research use.

---

## Excel Export

The `.xlsx` file (via SheetJS) contains one row per error with all captured fields:

```
Data | Avaliador | Projeto | Aplicação | Conjunto de Heurísticas |
Erro Nº | Fase | ID da Tarefa | Nome da Tarefa | Heurísticas |
Classificação | Severidade | Especificidade |
Tipo de Localização | Localização | Descrição | Recomendação
```

---

## Google Sheets Integration

### Step-by-step setup

1. **Create the Google Sheet** with column headers matching the Excel export above.

2. **Add the Apps Script**
   - In your sheet: **Extensions → Apps Script**.
   - Replace existing code with the contents of `api/google-apps-script.js`.
   - Save the project.

3. **Deploy as a Web App**
   - **Deploy → New deployment → Web app**.
   - Execute as: **Me** · Who has access: **Anyone**.
   - Copy the Web App URL.

4. **Configure HEAT** — paste the URL into `js/config.js`:
   ```js
   googleSheetsUrl: 'https://script.google.com/macros/s/YOUR_ID/exec',
   ```

Each evaluation sends its errors as new rows appended to the sheet. Existing rows
are never overwritten.

---

## VR Browser Layer

HEAT is designed to be used inside the headset being evaluated. The `<html>` tag
carries `data-environment="vr"`, which activates a set of CSS overrides in
`css/styles.css` (mirrored from `../blau/styles/vr.css`):

- Base font size bumped to 18 px
- Minimum touch target height: 60 px
- Higher contrast text tokens
- Slower transitions (240 ms) for reduced motion sensitivity
- Thicker focus rings (3 px)

To disable VR mode, remove `data-environment="vr"` from the `<html>` tag.

---

## Adding Example Images

```
images/{set-key}-{heuristic-id-lowercase}-good.jpg
images/{set-key}-{heuristic-id-lowercase}-bad.jpg
```

Example: `images/nielsen-h1-good.jpg`. Set `showImageExamples: true` in `CONFIG`
to reveal the image expand button on heuristic cards.

---

## Technical Stack

| Layer    | Library                            |
|----------|------------------------------------|
| UI       | React 18 (UMD via unpkg)           |
| JSX      | Babel Standalone (in-browser)      |
| Styling  | Tailwind CSS v3 (CDN) + BLAU tokens|
| Charts   | Chart.js (CDN)                     |
| Export   | SheetJS xlsx-0.20.0                |
| Backend  | Google Apps Script (optional)      |

---

## Changelog

### 1.2 (May 2026)
- Applied BLAU design system (Raleway headings, Open Sans body, #0071C5 accent, pill buttons)
- VR browser layer (`data-environment="vr"`) for in-headset use
- PDF A4 report export — Blau-styled, stakeholder-friendly, opens in new tab
- Domain-specific heuristic set support ("Heurísticas de Domínio (AAVIs)")
- `SET_TYPES` + `scope` on `PROBLEM_CLASSIFICATIONS` — wizard filters P*/PD/PC by active set
- Heuristic selection changed to single-select (radio) per error
- Specificity question added (step 4, 0–4 scale)
- Task completion no longer requires a registered error
- Error context banner in the wizard redesigned for clarity
- PDF report redesigned for external stakeholders: shows problem + recommendation per error,
  heuristic name alongside ID; omits methodology-internal fields

### 2.0 (May 2026)
- PDF "Problemas identificados" table simplified: heuristic ID only, severity as number only
- PDF recommendations split into a separate "Recomendações" table (error #, heuristic, location, recommendation)
- Tasks table title no longer includes the completion count; status shows "Concluída / Incompleta"
- Version bumped to 2.0

### 1.0 (April 2026)
- Initial release
- Nielsen's 10 Usability Heuristics included out of the box
- Error logging wizard with heuristic selection, severity, location, description
- Excel (.xlsx) export via SheetJS
- Optional Google Sheets integration via Apps Script
- Responsive, mobile-first design
