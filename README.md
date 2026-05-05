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
VITE_API_URL=http://localhost:3000
```

## Prototype

`prototype/` is a standalone copy of the current web codebase for PM vibe coding.

Run it from the repo root:

```sh
pnpm --dir prototype install
pnpm prototype:dev
```

Or run it directly:

```sh
cd prototype
pnpm install
pnpm dev
```
