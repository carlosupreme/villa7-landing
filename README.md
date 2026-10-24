# villa7-landing

Landing de Villa 7 (cancha de Fútbol 7, Oaxaca). Vite + GSAP (ScrollTrigger, SplitText) + Lenis.

- `npm run dev` — desarrollo en 127.0.0.1:5173
- `npm run build` — genera `dist/` (lo sirve el servicio `deploy/villa7.service` en :8087 detrás de nginx)
- `node scripts/shoot.mjs [url]` — capturas desktop/móvil en `shots/` (Playwright)

Scroll interactivo: `public/frames/` son los fotogramas del video aéreo (`ffmpeg -vf fps=24,scale=1024:-2 -c:v libwebp`), pintados en un canvas según el scroll (`src/main.js`).

Hero: `public/video/hero-scrub.mp4` también se scrubea con el scroll (Blob URL + seeks coalescidos, técnica de la skill `scroll-world`). Se genera con Remotion: `cd video && npm run render:scrub` (gradación de color, GOP 8 para seeks rápidos). `video/` también tiene el hero en loop y el promo vertical (`npm run studio`).

Deploy en GitHub Pages: `BASE_PATH=/villa7-landing/ npm run build` y publicar `dist/` en la rama `gh-pages`.

Skill `.claude/skills/scroll-world` (MIT, [oso95/scroll-world](https://github.com/oso95/scroll-world)): pipeline para generar mundos scrolleables con IA (requiere Monid/Higgsfield con saldo).
