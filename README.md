# FORO Web

React, TypeScript, and Vite frontend for FORO.

## Package Manager

This project uses pnpm through Corepack.

```sh
corepack enable
pnpm install
pnpm dev
```

Useful scripts:

```sh
pnpm build
pnpm lint
pnpm preview
```

## Environment

Create `.env` from the example file, then set the backend API URL:

```powershell
Copy-Item .env.example .env
```

```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_GOOGLE_AUTH_ENABLED=false
```

Keep `VITE_GOOGLE_AUTH_ENABLED=false` until the backend Google OAuth endpoints are ready.
The cross-project contract and backend implementation checklist are documented in
`docs/API_DOCUMENTATION_GOOGLE_AUTH.md`.

## Production deployment

The public URL is [foro-web-nine.vercel.app](https://foro-web-nine.vercel.app/).
Vercel builds the app with `VITE_API_URL=/api/v1` and forwards those requests to
`foro-news.onrender.com`. The browser sends session cookies to the same host
that serves the web app. Other routes continue to serve the React app.

To enable Google sign-in, register
`https://foro-web-nine.vercel.app/api/v1/auth/google/callback` as an authorized
redirect URI in Google Cloud. Set that URI as `GOOGLE_OAUTH_REDIRECT_URI` on
Render and set `FRONTEND_URL=https://foro-web-nine.vercel.app`. Use
`COOKIE_SECURE=true`, `COOKIE_SAMESITE=lax`, and leave `COOKIE_DOMAIN` unset.
After those settings are live, set the Vercel production variable
`FORO_GOOGLE_AUTH_ENABLED=true` and redeploy.

## Prototype

`prototype/` is a standalone copy of the current web codebase for PM vibe coding.

Run it from the repo root:

```sh
pnpm --dir prototype install --ignore-workspace
pnpm prototype:dev
```

Or run it directly:

```sh
cd prototype
pnpm install --ignore-workspace
pnpm dev
```

Why `--ignore-workspace`: this repository has a root `pnpm-workspace.yaml`, while
`prototype/` keeps its own standalone `package.json` and lockfile. After a fresh
clone, a plain `pnpm install` may only install the root app dependencies, which
can make Vite report missing prototype packages such as `lucide-react`,
`dompurify`, `idb`, `@ai-sdk/xai`, `ai`, or `marked`.
