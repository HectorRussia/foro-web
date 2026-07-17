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
