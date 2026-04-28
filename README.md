# PitchCrushAI

An AI-powered pitch evaluation tool that stress-tests startup pitches from multiple perspectives — before the real audience gets to tear them apart.

## Overview

PitchCrushAI is a structured pitch analysis product, not a chatbot. Users paste any pitch — a one-liner, cold email, investor memo, or deck summary — and the app runs it through a selected stress test mode to surface weaknesses, risks, and a stronger rewrite.

The core idea is that most pitch failures are predictable. Investors ask the same hard questions, customers have the same hesitations, and competitors attack the same moat gaps. PitchCrushAI codifies those patterns into a structured evaluation engine, powered by a large language model, that returns scored and categorized output rather than a freeform response.

The app is aimed at founders preparing for fundraising, sales calls, demo days, board meetings, or cold outreach — and anyone who wants honest feedback on how their pitch will land before it actually does.

## Live Demo

**Live URL:** [add deployed Vercel URL here]

---

## Key Features

- **9 stress test modes** — each mode frames the AI's evaluation from a specific audience perspective
- **Dynamic goal chips** — per-mode goals let users focus the analysis (e.g. "Find funding weaknesses" vs "Strengthen traction narrative")
- **Random scenario generator** — picks a random mode, goal, and sample pitch to demonstrate the product
- **Structured analysis dashboard** with 9 distinct signal layers:
  - Skepticism Score (0–100 pressure rating)
  - Clarity Score
  - Biggest Weakness
  - Moat Risk (with risk bar and label)
  - Customer Doubt (tagged objection chips)
  - Weak Phrases (flagged with explanations)
  - Red Flags (categorized deal-killers)
  - Stronger Rewrite (AI-improved version with copy button)
  - Toughest Question (mode-aware hardest challenge)
- **Fallback analysis** — heuristic evaluation runs if the AI provider is unavailable, keeping the product usable
- **Responsive layout** — two-column desktop app with mobile-friendly stacked view
- **Custom SVG branding** — icon and wordmark built as inline React components, no raster dependency

---

## Stress Test Modes

| Mode | Evaluates from the perspective of |
|---|---|
| **Investor** | A VC or angel reviewing for fundability |
| **Customer** | A buyer evaluating whether to purchase |
| **Competitor** | A rival looking for weaknesses to attack |
| **Demo Day** | A batch audience judging in 90 seconds |
| **Cold Email** | A recipient deciding whether to reply or delete |
| **Board** | A board member scrutinizing strategy and execution |
| **YC / Accel** | An accelerator partner reviewing for batch admission |
| **General** | Balanced review with no specific audience lens |
| **Incumbent Kill** | A legacy player assessing your threat to their market |

---

## Tech Stack

- **[Next.js](https://nextjs.org) App Router** — server components, API routes, static + dynamic rendering
- **[TypeScript](https://www.typescriptlang.org/)** — strict mode throughout
- **[Tailwind CSS](https://tailwindcss.com)** — utility-first styling with a custom warm palette
- **[shadcn/ui](https://ui.shadcn.com)** — base component primitives
- **[Framer Motion](https://www.framer.com/motion/)** — result card animations and loading states
- **[Lucide React](https://lucide.dev)** — icon system
- **[OpenRouter](https://openrouter.ai)** — LLM API gateway (Claude 3.7 Sonnet)
- **[Vercel](https://vercel.com)** — deployment

---

## AI Integration

The AI call happens entirely server-side in `src/app/api/analyze/route.ts`. The client sends the pitch text, selected mode, and goal to this endpoint. The route builds a structured system prompt with mode-specific addenda, calls OpenRouter, and parses the response against a Zod schema.

The model returns a structured JSON object covering all 9 signal layers. The client never touches the API key or prompt — it only receives the validated result object, which the dashboard renders as scores, risk bars, tagged chips, and quoted rewrites.

If the OpenRouter call fails or times out, a local heuristic fallback (`src/lib/fallback-analysis.ts`) runs instead and returns a best-effort result. The product stays functional even without a live AI response.

No API keys or secrets are included in the client bundle.

---

## Local Development

```bash
npm install
npm run dev
```

```bash
npm run lint
npm run build
```

---

## Environment Variables

Create a `.env.local` file at the project root:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
```

---

## Project Structure

```
src/
  app/                  # Next.js App Router pages and API routes
    api/analyze/        # Server-side AI evaluation endpoint
  components/
    analyze/            # Analyze page: input panel, results dashboard, loader
    brand/              # Logo SVG components
    landing/            # Marketing page: navbar, hero, features, etc.
    ui/                 # shadcn/ui primitives
  lib/
    fallback-analysis.ts  # Heuristic fallback when AI provider is unavailable
    types/              # Shared TypeScript types
public/
  img/                  # Static assets including logo
```

---

## Notes

This project was built for a web and AI creativity challenge. The focus was on meaningful AI integration — structured output, mode-aware evaluation, and a product experience that feels purposeful rather than bolted-on. Secondary priorities were originality of concept, deployment quality, and cohesive branding.
