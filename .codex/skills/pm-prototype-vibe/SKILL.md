---
name: pm-prototype-vibe
description: Use when Codex is helping a PM run, review, demo, vibe, or lightly modify the FORO web prototype. Scope work to the repository's prototype/ folder, keep PM-facing guidance simple, and avoid touching the main web app unless explicitly requested.
---

# PM Prototype Vibe

## Overview

Help PMs use the FORO prototype as a fast product-vibe workspace. Keep the work focused on `prototype/`, explain steps in PM-friendly language, and turn feedback into clear next actions for devs.

## First Context To Read

- `codex-pm.md` for the repo-specific PM agent instruction.
- `PM_README.md` for the PM run guide.
- `prototype/package.json` for available scripts.
- Relevant files under `prototype/src/`, `prototype/server/`, or `prototype/public/` only when the PM request needs implementation details.

## Scope Rules

- Work inside `prototype/` by default.
- Run commands from `prototype/` unless the user explicitly asks for root-level work.
- Do not edit the main web app (`src/`, root `package.json`, root `vite.config.ts`, production API contracts, or auth logic) for PM vibe work.
- Do not edit `codex-dev.md`; that file is for dev-facing implementation work.
- `codex.md` is only the role router; update it only when changing agent-mode routing.
- Do not expose `.env` values or API keys in responses, screenshots, docs, or examples.
- If the PM asks for a production implementation, pause and switch to the dev instruction in `codex-dev.md`.

## PM Workflow

1. Clarify the PM goal in plain product terms when needed.
2. Open or inspect only the prototype files relevant to the request.
3. For running the app, use:

```powershell
cd prototype
pnpm install
pnpm dev
```

4. Tell the PM to open the URL printed by Vite, usually `http://127.0.0.1:5173/test/`.
5. For small vibe changes, edit prototype UI, copy, mocked data, or demo flow directly.
6. Verify with `pnpm test`, `pnpm build`, or browser checks only when useful for the change.
7. End with a short PM-readable summary: what changed, where to try it, and any dev follow-up.

## Vibe Principles

- Optimize for demo clarity, fast iteration, and product conversation.
- Prefer small, reversible prototype edits over architectural changes.
- Keep Thai copy natural when the PM is working in Thai.
- Preserve existing prototype flows unless the PM asks to explore a new direction.
- When a feature depends on real APIs or paid services, make the fallback state clear instead of hiding the limitation.

## Handoff Style

When reporting back:

- Use simple PM language first.
- Mention exact prototype files changed when code was edited.
- Separate confirmed behavior from assumptions.
- Capture dev follow-up as concrete bullets, such as missing API, unclear copy, or flow decision needed.

## Useful Commands

Run these from `prototype/`:

```powershell
pnpm dev
pnpm test
pnpm build
pnpm preview
```

If a command fails because of dependency drift, run `pnpm install` in `prototype/` and retry.
