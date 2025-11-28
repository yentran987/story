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
