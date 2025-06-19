# OncoVista
This is a web app designed for oncology professionals, providing decision support for chemotherapy, outpatient, and palliative care.

## Deployment

### Netlify Deployment
The application is configured for deployment on Netlify using a robust build process with fallbacks. The build script is located in `netlify-robust-build.js` and is automatically triggered when deploying to Netlify.

To test the Netlify build locally before deploying:

```bash
npm run build:test-robust
```

If you encounter build failures in Netlify, check the logs and try the following:

1. Make sure all critical files are present (`src/main.tsx`, `src/App.tsx`, `vite.config.ts`)
2. Verify the build command in `netlify.toml` is set to `node netlify-robust-build.js`
3. Check for TypeScript errors that might be causing the build to fail

### Build Commands

- `npm run build` - Standard production build with type checking
- `npm run build:minimal` - Minimal production build (faster)
- `npm run build:test-robust` - Test the Netlify robust build process locally
