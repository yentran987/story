<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1ihdlfUuUnPyftvB8vRju-qW39nhOKZKU

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

### Windows PowerShell users — npm "ps1" execution blocked ⚠️

On some Windows machines PowerShell blocks the npm helper script (npm.ps1) and you'll see an error like:

```
File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.
```

Workarounds:

- Use the npm.cmd binary instead (no policy change required):

```powershell
npm.cmd install
npm.cmd run dev
```

- Or allow locally-signed scripts for your current user (safer than changing system-wide settings):

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

After that, rerun `npm install` and `npm run dev`.

## AI features & language auto-detection ✅

The app's AI helper now supports automatic language detection and preserves the input language for all AI features. Key points:

- The Editor's AI panel now defaults to AUTO (auto-detect) — you can switch to VI or EN manually.
- The AI features that are language-aware:
   1) Plot Twist (Editor → Plot Twist)
   2) Rewrite (Editor → Rewrite)
   3) Check Content (Editor → Check Content) — moderation returns structured result and detected language
   4) Auto-Tag (Editor → Auto-Tag)
   5) Fast Recap (Reader → Summarize Chapter)

How to test locally:
1. Start the dev server: `npm.cmd run dev` (or `npm run dev` if your PowerShell allows it)
2. Open the app (http://localhost:3000) and create or open a story.
3. In the Editor: pick a chapter and try `Plot Twist`, `Rewrite`, `Auto-Tag` and `Check Content` — the service will detect Vietnamese or English text and respond in the same language when possible.
4. In the Reader: open a chapter and click `Summarize Chapter` — the summary will be produced in the chapter's language.

Notes:
- If you don't set a GEMINI_API_KEY (see above), the app will use canned mock responses during development for quick testing.
- Moderation includes a short profanity heuristic that will flag obvious profanity locally before calling the AI.

Running the local AI server (optional)
1. Install server deps if you haven't already: `npm install` (this also installs express and helpers).
2. Start the lightweight local AI API (separate from the Vite dev server):
   `npm run start-api`
   This will start an Express server on port 4001 exposing endpoints:
   - POST /api/ai/story
   - POST /api/ai/tags
   - POST /api/ai/moderate
   - POST /api/ai/summary

These endpoints implement the same language-aware behavior as the app's aiService and are useful for local testing (the Vite frontend can call them directly if you proxy or call http://localhost:4001/api/ai/...).
