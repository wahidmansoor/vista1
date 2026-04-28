# Deployment Checklist: Disease Progress CDS

## Pre-Deployment
- [ ] **Build Validation**: Verify `dist/` folder contains the updated `index.js` with the CDS Advisor.
- [ ] **Static Asset Check**: Ensure no hard-coded local file paths are present in the build.
- [ ] **Environment**: No new environment variables are required for this deterministic module.

## Deployment Execution
- [ ] **CDN Sync**: Ensure `dist/assets` are correctly uploaded to the host (Netlify/Vercel/Static).
- [ ] **PWA Cache**: Update service worker version if necessary to ensure clinicians receive the new protocol dataset.

## Post-Deployment Smoke Test
- [ ] Load the application in a production-like environment.
- [ ] Navigate to **Disease Progress** tracker.
- [ ] Enter a test case (e.g., Lung, Stage IV, EGFR+) and verify the **CDS Advisor** surfaces Osimertinib.
- [ ] Verify functionality on mobile viewports (Responsive check).
