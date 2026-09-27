# SwasthyaSetu

**Smart India Hackathon Prototype — PS03: Multimodal Healthcare Triage Assistant for Government and Institutional Health Facilities**

> ⚠️ **AI-Assisted Triage — Not AI Diagnosis.** This system organizes patient-reported information and highlights
> urgency signals so a qualified healthcare worker can review faster. It never diagnoses, prescribes, or replaces
> a doctor, nurse, or medical officer. Every AI-generated note requires human review and sign-off before any
> clinical action is taken. All data in this demo is synthetic — **do not enter real patient information.**

---

## 1. What this is

A human-in-the-loop web app with two portals:

- **Patient Portal** — report symptoms by voice or text in **English, Hindi, or Odia**, optionally upload a
  medical report/prescription photo (read via real on-device OCR), review an AI-organized summary, and submit
  it to a healthcare worker queue.
- **Healthcare-Worker Dashboard** — a live, urgency-sorted patient queue with extracted symptoms, AI-generated
  follow-up questions, a structured non-diagnostic triage note, an editable/approvable review flow, a full audit
  trail, a printable referral-note generator, and an analytics dashboard.

The "AI processing" layer is a **transparent, fully offline, rule-based NLP engine**
(`src/utils/triageEngine.js`) — nothing is sent to any external server, which keeps the demo private,
explainable, and reviewable line-by-line. See the file header for exactly how it could be upgraded to
call a real LLM later without changing any screen.

## 2. Feature checklist (maps to the problem statement)

| Area | Implemented |
|---|---|
| Voice → text | ✅ Browser Web Speech API, live transcript, works best in Chrome/Edge |
| Text symptom entry | ✅ Free-text box with helper tips |
| Medical-report upload + OCR | ✅ Real OCR via `tesseract.js`, runs in-browser |
| English / Hindi / Odia | ✅ Full UI translation + voice recognition locale switching |
| Automatic symptom/timeline summary | ✅ Patient timeline page with expandable history |
| Extract important information | ✅ Symptom, duration, severity extraction |
| Detect missing information | ✅ Rule-based gap detection |
| Generate questions for health worker | ✅ Targeted follow-up question bank |
| Non-diagnostic urgency category | ✅ Routine / Priority / Urgent / Emergency, fully explainable score + reasons |
| Structured triage note | ✅ Chief complaint, red flags, recommended action, generated per case |
| Patient queue | ✅ Sorted by urgency then wait time, filters + search |
| Priority indicators | ✅ Color-coded badges + pulsing indicator for Emergency |
| Extracted symptoms / report info | ✅ Shown per case with category tags |
| AI-generated summary | ✅ Structured triage note card |
| Reviewer approval / editing | ✅ Editable narrative, reviewer notes, approve action |
| Referral-note preparation | ✅ Printable / exportable referral note, marks case as referred |
| Non-diagnostic disclaimers | ✅ Shown on every screen (banner + footer + about + privacy pages) |
| Consent & privacy | ✅ Explicit consent checkbox at patient login, dedicated Privacy page |
| Audit trail | ✅ Timestamped log per case (creation, edits, review, referral) |
| Analytics dashboard | ✅ Urgency distribution, case volume over time, facility & symptom-category charts |
| India-wide facility relevance | ✅ Seed demo data spans PHCs, health camps, industrial-estate clinics, campus health centers, maternal-health cases, chronic-care check-ins |

## 3. Tech stack

- **React 19 + Vite** — fast dev server & build
- **React Router 7** — multi-page client-side routing
- **Tailwind CSS v4** — utility-first styling
- **tesseract.js** — real, in-browser OCR (no server needed)
- **Web Speech API** — native browser voice-to-text (no API key needed)
- **Recharts** — analytics charts
- **lucide-react** — icon set
- **Firebase** (Firestore + Authentication) — a real, cloud-hosted shared database and account system, so any
  patient or worker signing in from **any phone or computer** sees the same live data

## 4. Running the project in VS Code

**Requirements:** [Node.js](https://nodejs.org) v18 or newer, and a free [Firebase](https://firebase.google.com) project.

1. Unzip this project and open the folder in VS Code.
2. Open a terminal in VS Code (`Ctrl+\``) and run:
   ```bash
   npm install
   npm run dev
   ```
3. Open the printed local URL (usually `http://localhost:5173`) in **Google Chrome** (best support for the
   Web Speech API used for voice input).
4. To create an optimized production build:
   ```bash
   npm run build
   npm run preview
   ```

### Firebase setup (one-time, ~5 minutes)

This project already ships wired up to a working demo Firebase project (`src/firebase.js`), so it runs out of
the box. To point it at **your own** Firebase project instead:

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project** → name it
   → skip Google Analytics → **Create project**.
2. Click the **`</>`** (Web) icon → register a web app (nickname anything, skip Hosting).
3. Copy the `firebaseConfig` object it shows you and paste it into `src/firebase.js`, replacing the existing
   values.
4. In the left sidebar: **Databases and storage → Firestore Database → Create database → Start in test mode**
   (choose a region close to you, e.g. `asia-south1`).
5. In the left sidebar: **Security → Authentication → Get started → Email/Password → Enable → Save.**
6. Run `npm run dev` again — patient/worker sign-up and the live case queue will now use your project.

> ⚠️ **Test mode** (step 4) leaves the database open for 30 days for easy demoing. Before any real deployment,
> publish the rules in `firestore.rules` (Firestore Database → Rules tab) to lock it down to signed-in users only.

> 💡 Voice input requires microphone permission and works best in Chrome/Edge over `localhost` or `https`.
> If the browser doesn't support the Web Speech API, the app automatically falls back to text entry.
> OCR (`tesseract.js`) downloads its language/worker files from a CDN on first use, so an internet connection
> is needed the first time you process a report image.

## 5. How to demo it (suggested judge walkthrough)

1. **Home page** — explains the full workflow and the "AI-assisted, not AI-diagnosis" principle.
2. **Patient Portal → Enter details & consent** → pick a language → **New Symptom Entry**:
   - Try voice: *"I have severe chest pain and difficulty breathing since 2 hours"* → watch it get flagged
     **Emergency** with visible reasoning.
   - Try text: *"Mujhe 3 din se bukhar aur khansi hai"* (Hindi) → see Hindi keyword extraction work.
3. **Upload a report image** (any photo with visible text) → watch OCR extract text live.
4. **Review screen** — see the structured summary, extracted symptoms, missing-info questions, and submit.
5. **Healthcare-Worker Portal** (separate account — create one with any email) → see the new case appear live
   in the urgency-sorted **queue**, even if opened on a completely different device/phone.
6. Open the case → review the **AI-generated triage note**, **edit** the narrative, add **reviewer notes**,
   **approve**, then **Prepare Referral** → print/export a referral note.
7. **Analytics** page → shows caseload and urgency distribution across the seeded India-wide demo facilities.

Seed/demo data (6 synthetic cases across a PHC, a public health camp, a campus health center, an industrial-estate
clinic, and a company clinic) is generated automatically on first load — use **"Reset demo data"** on the worker
dashboard to restore it at any time.

## 6. Project structure

```
src/
  components/       Shared UI: Navbar, Footer, UrgencyBadge, VoiceInput, DisclaimerBanner, ProtectedRoute
  context/          AppContext.jsx — global state (cases, auth, language) persisted to localStorage
  i18n/             translations.js — English/Hindi/Odia dictionary
  pages/
    Home.jsx, About.jsx, Privacy.jsx, NotFound.jsx
    patient/        Login, Dashboard, NewEntry, UploadReport, ReviewSubmit, Timeline
    worker/         Login, Dashboard (queue), PatientDetail, ReferralNote, Analytics
  utils/
    triageEngine.js The rule-based "AI processing" pipeline (extraction, missing-info, urgency, note-building)
    sampleData.js    Synthetic seed cases for the demo
```

## 7. Responsible AI & privacy notes (for judges)

- The triage engine is **rule-based and fully auditable** — every urgency score comes with a human-readable
  list of `reasons`, so nothing is a black box.
- The system **never outputs a disease name, medication, or treatment plan.**
- Every case requires **explicit patient consent** before processing, and every AI-prepared note requires
  **human reviewer sign-off** before it can be marked approved or referred.
- All processing (OCR, symptom extraction, urgency scoring) happens **on-device in the browser** — no health
  data leaves the machine running this demo.
- See the in-app **Privacy & Consent** page for the full data-handling approach, and the **About** page for the
  full workflow and safety-safeguard list.

## 8. Extending this prototype

- Swap `extractEntities`/`runTriagePipeline` internals in `triageEngine.js` for a call to a real LLM API
  while keeping the same return shape — every screen consumes that shape, not the implementation.
- Replace `localStorage` persistence in `AppContext.jsx` with a real backend (e.g. Node/Express + a database)
  for multi-device, multi-user deployments.
- Add real authentication/RBAC in place of the current demo login forms.

---

*Built as a Smart India Hackathon prototype. Uses synthetic demo data only — not for real clinical use.*
