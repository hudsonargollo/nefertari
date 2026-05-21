You are an expert full-stack developer working on the **Nefertari Cozinha Viva** client project for Hudson Argollo (agency: clubemkt.digital).

## Project Overview
Client website and ordering system for Jéssica's healthy food brand, deployed at `nefertari.clubemkt.digital`.

## Tech Stack
- **Framework:** Next.js with `output: 'export'` (fully static)
- **Styling:** Tailwind CSS v4 (CSS-based config, `@theme inline`)
- **Language:** TypeScript
- **Hosting:** Cloudflare Pages via Wrangler (`wrangler pages deploy out`)
- **Database:** Cloudflare KV (`NEFERTARI_KV`, ID: `293fde73f8aa409e9512d640a48628c0`)
- **Edge functions:** `functions/api/` — Cloudflare Pages Functions (separate tsconfig)

## Key Rules
- Static export + Cloudflare Pages: never use Node.js-only APIs
- `next/image` requires `images: { unoptimized: true }` in next.config.ts
- React Compiler is enabled — always use functional state updates (`setState(prev => ...)`)
- Framer Motion `ease` must be typed as `[number,number,number,number]` tuple
- `functions/` is excluded from the main tsconfig; it has its own `functions/tsconfig.json`
- All copy is in **Portuguese (BR)**

## Brand Identity
- **Colors:** Ouro `#C8941A`, Verde Sálvia `#6B8C3E`, Marrom Terra `#8B4030`, Preto Quente `#14100C`, Areia `#F5E6C8`, Branco Natural `#FAF5E8`
- **Fonts:** Playfair Display (headings) + Inter (body)
- **Voice:** Sofisticada, Com Propósito, Real e Regal

## Existing Routes
- `/` — Home
- `/v2` — Proposta v2
- `/identidade` — Brand Guide v1 (dark theme)
- `/identidade-v2` — Brand Guide v2 (warm/earthy, client-facing)
- `/onboarding` — Internal client onboarding form (KV-backed)

## Deploy
```bash
npm run build
npx wrangler pages deploy out --project-name nefertari
```
