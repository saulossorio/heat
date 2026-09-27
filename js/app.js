/**
 * js/app.js — Main React Application
 *
 * HEAT — Heuristic Evaluation Assessment Tool
 * Author: Saul Ossorio · https://saulossorio.com
 *
 * Architecture overview
 * ─────────────────────
 * This file is a single-file React application that runs via Babel standalone.
 * It depends on two globals loaded before this script:
 *   · CONFIG        — defined in js/config.js  (app settings, style tokens)
 *   · HEURISTIC_SETS — defined in js/heuristics.js (evaluation data)
 *
 * Component tree
 * ──────────────
 *   App
 *   ├─ HomeView         (evaluator form + heuristic set selector)
 *   ├─ PreviewView      (heuristic card grid)
 *   ├─ DashboardView    (error log list)
 *   ├─ ReviewView       (summary table + export)
 *   ├─ Modal            (generic full-screen overlay shell)
 *   │   ├─ HeuristicModal  (heuristic detail + good/bad examples)
 *   │   └─ RefModal        (quick-reference sidebar list)
 *   └─ ErrorModal       (3-step error logging wizard)
 *       └─ ImageExample (collapsible image viewer with placeholder)
 *
 * Overflow strategy
 * ─────────────────
 * Hover scale animations (hover:scale-[1.02]) require the scaled element
 * to have visual space beyond its layout box.  To avoid clipping:
 *   · View outer wrappers use flex-col WITHOUT overflow-hidden.
 *   · Only the scrollable mid-section uses overflow-y-auto.
 *   · Grid content is wrapped in a div with px-0.5 (2 px) — enough room for
 *     a 2 % scale on ~200 px cards.
 *   · Button containers get py-1 for vertical scale headroom.
 *   · S.page in config.js has overflow-x-hidden so the page never shows a
 *     horizontal scrollbar even if a scaled element momentarily overflows.
 *   · Modals use position:fixed relative to the viewport, so they always
 *     cover the full page regardless of container overflow rules.
 */

const { useState, useRef } = React;

// ─────────────────────────────────────────────
// MODAL — generic full-viewport overlay shell
// All modals are rendered at the root of <App>
// (outside the scrollable container) so the
// dark backdrop always covers the full page.
// ─────────────────────────────────────────────
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-5">
      {/* Backdrop — clicking closes the modal */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      {/* Panel — flex-col so children can use shrink-0 headers/footers
          with a flex-1 scrollable body in between */}
      <div className="relative w-full max-w-5xl h-[95vh] bg-white rounded-2xl shadow-2xl modal-animate overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ICONS — outlined SVG icon set
// All icons use stroke="currentColor" so colour
// is controlled purely by Tailwind text-* classes.
// ─────────────────────────────────────────────
function IconBack()        { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>; }
function IconClose()       { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>; }
function IconPlus()        { return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>; }
function IconPlusSmall()   { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>; }
function IconCheck()       { return <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>; }
function IconCheckCircle() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function IconXCircle()     { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function IconEdit()        { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>; }
function IconTrash()       { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>; }
function IconBook()        { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>; }
function IconDownload()    { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>; }
function IconSend()        { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>; }
function IconLightbulb()   { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>; }
function IconImage()       { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>; }
function IconClipboard()   { return <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>; }
function IconSpinner()     { return <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>; }
function IconUpload()      { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>; }
function IconChevronDown() { return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>; }
function IconChevronUp()   { return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>; }

// ─────────────────────────────────────────────
// IMAGE EXAMPLE
//
// Collapsible image viewer used inside heuristic
// detail cards.  Styled to match its parent card
// (green for good examples, red for bad).
//
// Props
//   src   {string} — image path from heuristics.js
//                    (e.g. 'images/nielsen-h1-good.jpg')
//   label {string} — alt text for the image
//   theme {'good'|'bad'} — controls accent colour
//
// To add images: place the file in the images/ folder
// using the path already set in heuristics.js, then
// reload the page.  The placeholder disappears automatically.
// ─────────────────────────────────────────────
function ImageExample({ src, label, theme }) {
  const [open, setOpen]     = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const isGood = theme === 'good';

  // Colour tokens per theme
  const tok = isGood
    ? { btn: 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100/70', border: 'border-emerald-200', bg: 'bg-emerald-50/40', icon: 'text-emerald-300', txt: 'text-emerald-500' }
    : { btn: 'text-red-500   hover:text-red-600   hover:bg-red-100/70',     border: 'border-red-200',     bg: 'bg-red-50/40',     icon: 'text-red-300',   txt: 'text-red-400'   };

  return (
    <div className="mt-4 pt-3 border-t border-black/5">
      {/* Toggle button — subtle, theme-coloured, no solid background */}
      <button
        onClick={() => { setOpen(!open); setImgErr(false); }}
        className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md transition-colors ${tok.btn}`}
      >
        <IconImage />
        {open ? 'Hide image' : 'View image example'}
        <span>{open ? <IconChevronUp /> : <IconChevronDown />}</span>
      </button>

      {open && (
        src && !imgErr ? (
          /* Real image */
          <div className="mt-2 rounded-xl overflow-hidden border border-black/10">
            <img
              src={src}
              alt={label}
              onError={() => setImgErr(true)}
              className="w-full object-contain max-h-56"
            />
          </div>
        ) : (
          /* Placeholder — dashed border, theme-tinted */
          <div className={`mt-2 rounded-xl border-2 border-dashed ${tok.border} ${tok.bg} flex flex-col items-center justify-center py-8 px-4 text-center`}>
            <svg className={`w-8 h-8 mb-2 ${tok.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className={`text-xs font-medium ${tok.txt}`}>No image added yet</p>
            {/* Show expected file path so the user knows where to put the image */}
            {src && <p className="text-xs text-slate-300 mt-1 font-mono break-all px-2">{src}</p>}
          </div>
        )
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ERROR MODAL — 3-step wizard for logging errors
//
// Step 1 — Heuristic selection (checkboxes)
// Step 2 — Severity + Location (merged input)
// Step 3 — Error description + recommendation
//
// The modal uses a sticky header (progress bar + title)
// and sticky footer (Back/Next/Save) with a scrollable
// body between them, so it works on any screen height.
// ─────────────────────────────────────────────
function ErrorModal({ heuristics, initial, onClose, onSave }) {
  const [step, setStep]       = useState(1);
  const [selH, setSelH]       = useState(initial?.heuristics || []);
  const [sev, setSev]         = useState(initial?.severity ?? null);
  const [locType, setLocType] = useState(initial?.locationType || 'text');
  const [loc, setLoc]         = useState(initial?.location || '');
  const [desc, setDesc]       = useState(initial?.description || '');
  const [rec, setRec]         = useState(initial?.recommendation || '');
  const [errs, setErrs]       = useState({});
  const [expanded, setExpanded] = useState(new Set());
  const fileRef = useRef(null);

  /** Toggle a heuristic in/out of the selection */
  const toggleH = (h) => {
    setSelH(selH.find(x => x.id === h.id) ? selH.filter(x => x.id !== h.id) : [...selH, h]);
    setErrs({});
  };

  /** Toggle the "Remind me" description panel on a heuristic card */
  const toggleExpand = (id) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  /** Validate the current step before advancing */
  const validate = () => {
    const e = {};
    if (step === 1 && !selH.length) e.h = true;
    if (step === 2) {
      if (sev === null) e.sev = true;
      if (!loc.trim())  e.loc = true;
    }
    if (step === 3 && !desc.trim()) e.desc = true;
    setErrs(e);
    return !Object.keys(e).length;
  };

  const next = () => validate() && setStep(step + 1);
  const save = () => validate() && onSave({ heuristics: selH, severity: sev, locationType: locType, location: loc, description: desc, recommendation: rec });

  /** Convert an uploaded file to a base64 data URL stored as the location */
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) { const r = new FileReader(); r.onload = (ev) => setLoc(ev.target.result); r.readAsDataURL(f); }
  };

  return (
    <Modal onClose={onClose}>
      {/* ── Header ── */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className={S.heading2}>{initial ? 'Edit' : 'Log'} Error</h3>
          <button onClick={onClose} className={`p-2 rounded-xl ${S.btn} hover:bg-slate-100`}><IconClose /></button>
        </div>
        {/* Step progress bar */}
        <div className="flex gap-2">
          {[1,2,3].map(n => (
            <div key={n} className={`flex-1 h-1.5 rounded-full transition-colors ${step >= n ? 'bg-blue-500' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto px-6 py-5">

        {/* Step 1 — Heuristic selection */}
        {step === 1 && (
          <div>
            <p className={`${S.label} mb-1`}>Which heuristic(s) are violated? <span className="text-red-500">*</span></p>
            <p className="text-sm text-slate-500 mb-4">Select one or more</p>
            {errs.h && <p className="text-red-500 text-sm mb-3">Select at least one heuristic</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {heuristics.map(h => (
                <div key={h.id} className={`rounded-xl border-2 overflow-hidden ${S.btn} ${selH.find(x => x.id === h.id) ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <button onClick={() => toggleH(h)} className="w-full p-3 text-left">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${selH.find(x => x.id === h.id) ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}>
                        {selH.find(x => x.id === h.id) && <IconCheck />}
                      </div>
                      <span className="text-blue-600 font-bold">{h.id}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{h.name}</p>
                  </button>
                  {/* "Remind me" expander — shows the heuristic description inline */}
                  <button
                    onClick={() => toggleExpand(h.id)}
                    className={`w-full px-3 py-2 text-left text-xs ${S.btn} hover:bg-blue-100 border-t border-slate-100 text-blue-600 font-medium flex items-center gap-1`}
                  >
                    <IconLightbulb /> Remind me
                  </button>
                  {expanded.has(h.id) && (
                    <div className="px-3 py-3 text-xs text-slate-600 bg-blue-50 leading-relaxed">{h.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Severity + Location (merged) */}
        {step === 2 && (
          <div className="space-y-6">

            {/* Severity */}
            <div>
              <p className={`${S.label} mb-1`}>Severity <span className="text-red-500">*</span></p>
              <p className="text-sm text-slate-500 mb-3">How critical is this issue?</p>
              {errs.sev && <p className="text-red-500 text-sm mb-2">Select a severity level</p>}
              <div className="grid grid-cols-5 gap-2">
                {SEVERITY_LEVELS.map(s => (
                  <button
                    key={s.level}
                    onClick={() => { setSev(s.level); setErrs({}); }}
                    className={`py-3 rounded-xl border-2 ${S.btn} ${S.btnHover} flex flex-col items-center ${sev === s.level ? `${s.color} ${s.textColor} border-transparent` : 'bg-white border-slate-200'}`}
                  >
                    <span className="text-lg font-bold">{s.level}</span>
                    <span className="text-xs">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Location — type toggle + input merged into one section */}
            <div>
              <p className={`${S.label} mb-1`}>Location <span className="text-red-500">*</span></p>
              <p className="text-sm text-slate-500 mb-3">Where does this issue occur in the interface?</p>
              {errs.loc && <p className="text-red-500 text-sm mb-3">Required</p>}

              {/* Segmented control — low-contrast tab switcher so it doesn't compete with "Next" */}
              <div className="inline-flex gap-0.5 p-1 bg-slate-100 rounded-xl mb-3">
                {[{ key: 'text', label: 'Text' }, { key: 'photo', label: 'Screenshot' }].map(t => (
                  <button
                    key={t.key}
                    onClick={() => { setLocType(t.key); setLoc(''); setErrs({}); }}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${locType === t.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Text input */}
              {locType === 'text' && (
                <textarea
                  value={loc}
                  onChange={e => { setLoc(e.target.value); setErrs({}); }}
                  placeholder="e.g., Homepage → Header → Navigation menu"
                  rows={3}
                  className={`${S.input} resize-none ${errs.loc ? S.inputError : ''}`}
                />
              )}

              {/* Screenshot upload */}
              {locType === 'photo' && (
                <>
                  <input type="file" ref={fileRef} onChange={handleFile} accept="image/*" className="hidden" />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className={`w-full py-8 rounded-xl border-2 border-dashed transition-colors flex flex-col items-center justify-center gap-2 text-sm font-medium ${
                      loc
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                        : errs.loc
                          ? 'border-red-400 text-slate-500'
                          : 'border-slate-300 text-slate-500 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {loc ? (
                      <>
                        <IconCheckCircle />
                        Screenshot attached — tap to replace
                      </>
                    ) : (
                      <>
                        <IconUpload />
                        Tap to upload a screenshot
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 3 — Description + Recommendation */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <p className={`${S.label} mb-1`}>Error Description <span className="text-red-500">*</span></p>
              <p className="text-sm text-slate-500 mb-3">Describe the usability problem in detail</p>
              {errs.desc && <p className="text-red-500 text-sm mb-2">Required</p>}
              <textarea
                value={desc}
                onChange={e => { setDesc(e.target.value); setErrs({}); }}
                placeholder="What is the issue? How does it affect the user?"
                rows={4}
                className={`${S.input} resize-none ${errs.desc ? S.inputError : ''}`}
              />
            </div>
            <div>
              <p className={`${S.label} mb-1`}>Recommendation <span className="text-slate-400 font-normal">(optional)</span></p>
              <p className="text-sm text-slate-500 mb-3">Suggest how to fix this issue</p>
              <textarea
                value={rec}
                onChange={e => setRec(e.target.value)}
                placeholder="What change would resolve the problem?"
                rows={3}
                className={`${S.input} resize-none`}
              />
            </div>
          </div>
        )}

      </div>

      {/* ── Footer — navigation buttons ── */}
      <div className="px-6 py-4 border-t border-slate-100 shrink-0 flex gap-3">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className={`flex-1 ${S.btn} ${S.btnHover} ${S.btnSecondary} ${S.btnSize} hover:bg-slate-200`}>
            Back
          </button>
        )}
        {step < 3 ? (
          <button onClick={next} className={`flex-1 ${S.btn} ${S.btnHover} ${S.btnPrimary} ${S.btnSize}`}>
            Next
          </button>
        ) : (
          <button onClick={save} className={`flex-1 ${S.btn} ${S.btnHover} ${S.btnPrimary} ${S.btnSize}`}>
            Save Error
          </button>
        )}
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────
// APP — root component
//
// State
//   view            — which screen is visible
//   selectedSet     — key into HEURISTIC_SETS
//   evaluatorInfo   — { name, project, … }
//   errors          — array of logged error objects
//   showErrorModal  — bool
//   editingError    — index of error being edited, or null
//   showRefModal    — bool (heuristic reference panel)
//   showHeuristicModal — heuristic object or null
//   fade            — bool used for cross-fade transition
//   formErrors      — validation errors for the home form
//   sendStatus      — 'idle'|'sending'|'sent'|'error'
//   evalDate        — ISO timestamp frozen at session start
// ─────────────────────────────────────────────
function App() {
  const [view, setView]                     = useState('home');
  const [selectedSet, setSelectedSet]       = useState('');
  const [evaluatorInfo, setEvaluatorInfo]   = useState({});
  const [errors, setErrors]                 = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [editingError, setEditingError]     = useState(null);
  const [showRefModal, setShowRefModal]     = useState(false);
  const [showHeuristicModal, setShowHeuristicModal] = useState(null);
  const [fade, setFade]                     = useState(false);
  const [formErrors, setFormErrors]         = useState({});
  const [sendStatus, setSendStatus]         = useState('idle');
  const [evalDate]                          = useState(new Date().toISOString());

  /** Animated view transition (200 ms opacity cross-fade) */
  const nav = (v) => { setFade(true); setTimeout(() => { setView(v); setFade(false); }, 200); };

  /** Derived heuristic list for the active set */
  const heuristics = selectedSet ? HEURISTIC_SETS[selectedSet].heuristics : [];

  /** Validate the home form before advancing to preview */
  const validateHome = () => {
    const errs = {};
    if (!selectedSet) errs.set = true;
    EVALUATOR_FIELDS.filter(f => f.required).forEach(f => {
      if (!evaluatorInfo[f.id]?.trim()) errs[f.id] = true;
    });
    setFormErrors(errs);
    return !Object.keys(errs).length;
  };

  /** Save or update an error in the errors array */
  const saveError = (err) => {
    if (editingError !== null) {
      setErrors(errors.map((e, i) => i === editingError ? { ...err, id: e.id } : e));
    } else {
      setErrors([...errors, { ...err, id: Date.now() }]);
    }
    setShowErrorModal(false);
    setEditingError(null);
  };

  const delError   = (i) => setErrors(errors.filter((_, idx) => idx !== i));
  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  /** Build the flat data array used for both Excel export and Sheets submission */
  const getExportData = () => errors.map((e, i) => ({
    'Date':          formatDate(evalDate),
    'Evaluator':     evaluatorInfo.name    || '',
    'Project':       evaluatorInfo.project || '',
    'Error #':       i + 1,
    'Heuristics':    e.heuristics.map(h => `${h.id}: ${h.name}`).join('; '),
    'Severity':      `${e.severity} - ${SEVERITY_LEVELS[e.severity].label}`,
    'Location Type': e.locationType,
    'Location':      e.locationType === 'text' ? e.location : '[Screenshot]',
    'Description':   e.description,
    'Recommendation': e.recommendation || '',
  }));

  /** Download evaluation as .xlsx using SheetJS */
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(getExportData());
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Evaluation');
    XLSX.writeFile(wb, `evaluation-${Date.now()}.xlsx`);
  };

  /** POST results to the configured Google Apps Script endpoint */
  const sendResults = async () => {
    if (sendStatus === 'sending' || sendStatus === 'sent') return;
    if (!CONFIG.googleSheetsUrl) { alert('Google Sheets URL not configured in js/config.js'); return; }
    setSendStatus('sending');
    try {
      await fetch(CONFIG.googleSheetsUrl, {
        method: 'POST',
        body: JSON.stringify({ evaluator: evaluatorInfo, date: evalDate, errors: getExportData() }),
      });
      setSendStatus('sent');
    } catch {
      setSendStatus('error');
    }
  };

  return (
    <div className={S.page}>
      {/* ════════════════════════════════════
          MAIN CONTENT AREA
          overflow-x on S.page prevents horizontal
          scrollbars when buttons scale on hover.
          Views intentionally have NO overflow-hidden
          so scaled children aren't clipped.
          ════════════════════════════════════ */}
      <div className={`${S.container} ${fade ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>

        {/* ── HOME ── */}
        {view === 'home' && (
          <div className="flex-1 flex items-center justify-center">
            <div className={`${S.card} p-6 md:p-10 w-full max-w-xl`}>
              <div className="text-center mb-8">
                <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl ${S.accent} flex items-center justify-center shadow-lg`}>
                  <IconClipboard />
                </div>
                <h1 className={S.heading1}>Heuristic Evaluation</h1>
                <p className={`${S.textMuted} mt-1`}>Assessment Tool</p>
              </div>
              <div className="space-y-5">
                {/* Dynamic evaluator fields from config.js */}
                {EVALUATOR_FIELDS.map(f => (
                  <div key={f.id}>
                    <label className={`block ${S.label} mb-2`}>
                      {f.label}
                      {/* Show "(optional)" in the label only — never in the placeholder */}
                      {!f.required && <span className="text-slate-400 font-normal"> (optional)</span>}
                      {f.required  && <span className="text-red-500"> *</span>}
                    </label>
                    <input
                      type="text"
                      value={evaluatorInfo[f.id] || ''}
                      onChange={e => {
                        setEvaluatorInfo({ ...evaluatorInfo, [f.id]: e.target.value });
                        setFormErrors({ ...formErrors, [f.id]: null });
                      }}
                      placeholder={f.placeholder}
                      className={`${S.input} ${formErrors[f.id] ? S.inputError : ''}`}
                    />
                    {formErrors[f.id] && <p className="mt-2 text-red-500 text-sm">Required</p>}
                  </div>
                ))}

                {/* Heuristic set picker */}
                <div>
                  <label className={`block ${S.label} mb-2`}>
                    Heuristic Set <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedSet}
                    onChange={e => { setSelectedSet(e.target.value); setFormErrors({ ...formErrors, set: null }); }}
                    className={`${S.input} cursor-pointer ${formErrors.set ? S.inputError : ''}`}
                  >
                    <option value="">Select a heuristic set…</option>
                    {Object.entries(HEURISTIC_SETS).map(([k, v]) => (
                      <option key={k} value={k}>{v.name}</option>
                    ))}
                  </select>
                  {formErrors.set && <p className="mt-2 text-red-500 text-sm">Required</p>}
                </div>

                <button onClick={() => validateHome() && nav('preview')} className={`w-full ${S.btn} ${S.btnHover} ${S.btnPrimary} ${S.btnSize}`}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PREVIEW — heuristic card grid ── */}
        {view === 'preview' && (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className={`${S.card} p-4 mb-4 flex items-center shrink-0`}>
              <button onClick={() => nav('home')} className={`p-3 rounded-xl ${S.btn} hover:bg-slate-100`}><IconBack /></button>
              <h2 className={`flex-1 text-center ${S.heading2} pr-12`}>{HEURISTIC_SETS[selectedSet]?.name}</h2>
            </div>
            <p className={`${S.textMuted} text-center mb-4 shrink-0`}>Tap any card to see details</p>

            {/* Grid — px-0.5 gives 2 px of room so edge cards' scale animation isn't clipped */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-0.5 pb-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {heuristics.map(h => (
                    <button
                      key={h.id}
                      onClick={() => setShowHeuristicModal(h)}
                      className={`${S.card} p-4 text-left ${S.btn} ${S.btnHover} flex flex-col`}
                    >
                      <span className="text-blue-600 font-bold text-lg mb-2">{h.id}</span>
                      <p className="text-sm text-slate-700">{h.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* py-1 gives vertical headroom for the scale animation */}
            <div className="shrink-0 mt-4 py-1">
              <button onClick={() => nav('dashboard')} className={`w-full ${S.btn} ${S.btnHover} ${S.btnPrimary} ${S.btnSize}`}>
                Start Evaluation
              </button>
            </div>
          </div>
        )}

        {/* ── DASHBOARD — error log ── */}
        {view === 'dashboard' && (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className={`${S.card} p-4 mb-4 flex items-center justify-between shrink-0`}>
              <button onClick={() => nav('preview')} className={`p-3 rounded-xl ${S.btn} hover:bg-slate-100`}><IconBack /></button>
              <div className="text-center">
                <h2 className={S.heading2}>Evaluation</h2>
                <p className={S.textMuted}>{errors.length} error{errors.length !== 1 ? 's' : ''} logged</p>
              </div>
              <button onClick={() => setShowRefModal(true)} className={`p-3 rounded-xl ${S.btn} hover:bg-blue-100 text-blue-600`}><IconBook /></button>
            </div>

            {/* Error list — scrollable mid-section */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-0.5 pb-2">
                {errors.length === 0 ? (
                  <button
                    onClick={() => { setEditingError(null); setShowErrorModal(true); }}
                    className={`w-full min-h-[250px] ${S.card} border-2 border-dashed border-blue-300 flex flex-col items-center justify-center ${S.btn} ${S.btnHover}`}
                  >
                    <div className={`w-16 h-16 mb-4 rounded-2xl ${S.accent} flex items-center justify-center`}><IconPlus /></div>
                    <p className={S.heading2}>Log Your First Error</p>
                    <p className={`${S.textMuted} mt-2`}>Tap to start</p>
                  </button>
                ) : (
                  <div className="space-y-3">
                    {errors.map((err, i) => (
                      <div key={err.id} className={`${S.card} p-4 ${S.btn} hover:shadow-md`}>
                        <div className="flex items-start gap-3">
                          <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${SEVERITY_LEVELS[err.severity].color} ${SEVERITY_LEVELS[err.severity].textColor}`}>
                            {err.severity}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap gap-1 mb-1">
                              {err.heuristics.map(h => <span key={h.id} className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs">{h.id}</span>)}
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-2">{err.description}</p>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => { setEditingError(i); setShowErrorModal(true); }} className={`p-2 rounded-lg ${S.btn} hover:bg-slate-100 text-slate-500`}><IconEdit /></button>
                            <button onClick={() => delError(i)} className={`p-2 rounded-lg ${S.btn} hover:bg-red-50 text-red-400`}><IconTrash /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom action buttons — py-1 gives scale headroom */}
            {errors.length > 0 && (
              <div className="space-y-3 mt-4 shrink-0 py-1">
                <button onClick={() => { setEditingError(null); setShowErrorModal(true); }} className={`w-full ${S.btn} ${S.btnHover} ${S.btnOutline} ${S.btnSize} flex items-center justify-center gap-2`}>
                  <IconPlusSmall /> Add Error
                </button>
                <button onClick={() => nav('review')} className={`w-full ${S.btn} ${S.btnHover} ${S.btnPrimary} ${S.btnSize}`}>
                  Finish
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── REVIEW — summary + export ── */}
        {view === 'review' && (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className={`${S.card} p-4 mb-4 flex items-center shrink-0`}>
              <button onClick={() => nav('dashboard')} className={`p-3 rounded-xl ${S.btn} hover:bg-slate-100`}><IconBack /></button>
              <h2 className={`flex-1 text-center ${S.heading2} pr-12`}>Review & Export</h2>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto space-y-4 pb-2">
              {/* Evaluator metadata */}
              <div className={`${S.card} p-5`}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><p className="text-xs text-slate-400 uppercase mb-1">Evaluator</p><p className="text-sm font-medium text-slate-700">{evaluatorInfo.name}</p></div>
                  {evaluatorInfo.project && <div><p className="text-xs text-slate-400 uppercase mb-1">Project</p><p className="text-sm font-medium text-slate-700">{evaluatorInfo.project}</p></div>}
                  <div><p className="text-xs text-slate-400 uppercase mb-1">Heuristic Set</p><p className="text-sm font-medium text-slate-700">{HEURISTIC_SETS[selectedSet]?.name}</p></div>
                  <div><p className="text-xs text-slate-400 uppercase mb-1">Date</p><p className="text-sm font-medium text-slate-700">{formatDate(evalDate)}</p></div>
                </div>
              </div>

              {/* Stats */}
              <div className={`${S.card} p-5`}>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div><p className="text-3xl font-bold text-blue-600">{errors.length}</p><p className={S.textMuted}>Total</p></div>
                  <div><p className="text-3xl font-bold text-orange-500">{errors.filter(e => e.severity >= 3).length}</p><p className={S.textMuted}>Critical</p></div>
                  <div><p className="text-3xl font-bold text-indigo-600">{[...new Set(errors.flatMap(e => e.heuristics.map(h => h.id)))].length}</p><p className={S.textMuted}>Heuristics</p></div>
                </div>
              </div>

              {/* Error table */}
              <div className={`${S.card} p-4 overflow-auto`}>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="py-2 px-2 text-slate-500">#</th>
                      <th className="py-2 px-2 text-slate-500">H</th>
                      <th className="py-2 px-2 text-slate-500">Sev</th>
                      <th className="py-2 px-2 text-slate-500">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errors.map((e, i) => (
                      <tr key={e.id} className="border-b border-slate-100">
                        <td className="py-3 px-2">{i + 1}</td>
                        <td className="py-3 px-2">
                          <div className="flex flex-wrap gap-1">
                            {e.heuristics.map(h => <span key={h.id} className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-xs">{h.id}</span>)}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${SEVERITY_LEVELS[e.severity].color} ${SEVERITY_LEVELS[e.severity].textColor}`}>{e.severity}</span>
                        </td>
                        <td className="py-3 px-2 max-w-xs truncate">{e.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Export buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4 shrink-0 py-1">
              <button onClick={exportExcel} className={`flex-1 ${S.btn} ${S.btnHover} ${S.btnSecondary} ${S.btnSize} flex items-center justify-center gap-2 hover:bg-slate-200`}>
                <IconDownload /> Download .xlsx
              </button>
              <button
                onClick={sendResults}
                disabled={sendStatus === 'sending' || sendStatus === 'sent'}
                className={`flex-1 ${S.btn} ${S.btnHover} ${S.btnSize} flex items-center justify-center gap-2 ${
                  sendStatus === 'sent'    ? 'bg-emerald-500 text-white' :
                  sendStatus === 'sending' ? 'bg-blue-400 text-white'   :
                  sendStatus === 'error'   ? 'bg-red-500 text-white'    : S.btnPrimary
                }`}
              >
                {sendStatus === 'sent'    ? <IconCheckCircle /> :
                 sendStatus === 'sending' ? <IconSpinner />     : <IconSend />}
                {sendStatus === 'sent' ? 'Sent!' : sendStatus === 'sending' ? 'Sending…' : sendStatus === 'error' ? 'Retry' : 'Send Results'}
              </button>
            </div>
          </div>
        )}

      </div>{/* end S.container */}

      {/* ── FOOTER ── */}
      <div className="text-center py-4 shrink-0">
        <p className={S.textMuted}>
          {CONFIG.version}{' '}
          <a
            href={CONFIG.authorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 transition-colors"
            style={{ textDecoration: 'none' }}
          >
            {CONFIG.author}
          </a>
        </p>
      </div>

      {/* ════════════════════════════════════
          MODALS — rendered outside the container
          so position:fixed backdrop covers the
          full viewport without clipping.
          ════════════════════════════════════ */}

      {/* Heuristic detail modal */}
      {showHeuristicModal && (
        <Modal onClose={() => setShowHeuristicModal(null)}>
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">{showHeuristicModal.id}</span>
                <h3 className={`${S.heading2} mt-0.5`}>{showHeuristicModal.name}</h3>
              </div>
              <button onClick={() => setShowHeuristicModal(null)} className={`p-2 rounded-xl shrink-0 ${S.btn} hover:bg-slate-100`}><IconClose /></button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <p className={`${S.textBase} mb-6 leading-relaxed`}>{showHeuristicModal.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Good example */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-emerald-600"><IconCheckCircle /></span>
                  <p className="font-semibold text-emerald-700">Good Example</p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{showHeuristicModal.goodExample}</p>
                <ImageExample src={showHeuristicModal.goodImage} label="Good example" theme="good" />
              </div>

              {/* Bad example */}
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-red-500"><IconXCircle /></span>
                  <p className="font-semibold text-red-600">Bad Example</p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{showHeuristicModal.badExample}</p>
                <ImageExample src={showHeuristicModal.badImage} label="Bad example" theme="bad" />
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Heuristics quick-reference modal */}
      {showRefModal && (
        <Modal onClose={() => setShowRefModal(false)}>
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center justify-between">
              <h3 className={S.heading2}>Heuristics Reference</h3>
              <button onClick={() => setShowRefModal(false)} className={`p-2 rounded-xl ${S.btn} hover:bg-slate-100`}><IconClose /></button>
            </div>
          </div>
          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="space-y-3">
              {heuristics.map(h => (
                <div key={h.id} className={`${S.card} p-4`}>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold shrink-0 mt-0.5">{h.id}</span>
                    <div>
                      <p className="font-semibold text-slate-700">{h.name}</p>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">{h.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Error log / edit modal */}
      {showErrorModal && (
        <ErrorModal
          heuristics={heuristics}
          initial={editingError !== null ? errors[editingError] : null}
          onClose={() => { setShowErrorModal(false); setEditingError(null); }}
          onSave={saveError}
        />
      )}

    </div>
  );
}

// Mount the application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
