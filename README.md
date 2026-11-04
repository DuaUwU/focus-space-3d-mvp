# Focus Space 3D — MVP

A stylized isometric cozy-room focus app built with React, TypeScript, Vite, Three.js and React Three Fiber.

## Requirements
- Node.js 18.18+ (Node 20 LTS recommended)
- npm
- A browser with WebGL support

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite.

## Production build
```bash
npm run build
npm run preview
```

## Current MVP features
- Procedurally-built stylized 3D room (no paid assets or APIs)
- Isometric/orthographic camera with pan and zoom
- Clickable room objects that open functional panels
- Focus timer with 25 / 50 / 90 minute presets
- Local task list with add, complete and delete
- Journal saved to localStorage
- Simulated weather / atmosphere selection
- Low / Medium / High graphics setting
- Responsive UI and reduced-motion CSS support

## Important implementation notes
- The room is built from Three.js primitives, so no external 3D model is required.
- The music panel is currently a UI placeholder. It does not claim to play music yet. Add properly licensed audio files or user-selected local files before enabling playback.
- Rain particles in this MVP are static decorative particles. A production version should animate them with a shader or instanced particles.
- Statistics, IndexedDB migration, true audio mixer, service worker/offline caching, asset-based room variants, and automated tests are planned next steps.
- All user data is stored locally in the current browser. Clearing browser storage will remove it.

## Performance
Start with Medium quality. Use Low on integrated GPUs or mobile devices. The 3D room uses simple geometry and a limited number of meshes; for production, merge static geometry, instance repeated props, bake static lighting, and profile draw calls on target devices.

## Deployment
Build with `npm run build`. Deploy the generated `dist/` directory to Cloudflare Pages or GitHub Pages. For GitHub Pages under a repository subpath, configure Vite's `base` option accordingly.
