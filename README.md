# Definity Punchdown Reference — Local Deployment

## Option A — Docker (recommended for permanent network access)

Requires Docker and Docker Compose.

```bash
docker compose up -d
```

Access at: http://YOUR-HOST-IP:3000

To stop:
```bash
docker compose down
```

To update after changes to App.jsx:
```bash
docker compose up -d --build
```

---

## Option B — Node dev server (quick, temporary)

Requires Node.js 18+.

```bash
npm install
npm run dev:host
```

Access at the URL printed in the terminal (e.g. http://192.168.x.x:5173)
This runs a dev server — fine for local use, not recommended for permanent hosting.

---

## Option C — Build and serve as static files

```bash
npm install
npm run build
```

The `dist/` folder contains plain HTML/CSS/JS.
Copy it to any web server (nginx, Apache, IIS, etc.) or open index.html directly.

To preview the build locally before deploying:
```bash
npm run preview
```

---

## Port

Default port is **3000** (Docker) or **5173** (dev server).
Change in docker-compose.yml (left side of ports mapping) or vite.config.js.

## Notes

- The app is fully static — no backend, no database, no internet required after initial load
  (Google Fonts loads from CDN on first open — works offline after browser caches it)
- Safe to expose on a local LAN — no sensitive data, no auth required
- Source: Avaya official cross-connect diagram KLC 063097 and community-verified sources
