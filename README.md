# villa7-landing

Landing de Villa 7 (cancha de Fútbol 7, Oaxaca). Vite + GSAP (ScrollTrigger, SplitText) + Lenis.

- `npm run dev` — desarrollo en 127.0.0.1:5173
- `npm run build` — genera `dist/` (lo sirve el servicio `deploy/villa7.service` en :8087 detrás de nginx)
- `node scripts/shoot.mjs [url]` — capturas desktop/móvil en `shots/` (Playwright)

Scroll interactivo: `public/frames/` son los fotogramas del video aéreo (`ffmpeg -vf fps=24,scale=1024:-2 -c:v libwebp`), pintados en un canvas según el scroll (`src/main.js`).
