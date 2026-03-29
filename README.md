# PiAPI Video Toolkit Skill

Choose the right PiAPI video model, estimate `5s` and `10s` cost instantly, compare quality tiers, and plan clean production workflows with watermark removal accounted for from the start.

Built on top of PiAPI.

## Why This Exists

PiAPI gives access to strong video models, but the decision layer is still messy:

- Which model should you use?
- What is the real cost for `5s` or `10s`?
- Which option is best for testing vs final output?
- How should watermark removal affect the pipeline?

This skill turns those questions into short, decision-ready answers.

## What You Get

- model selection across `Seedance`, `Veo`, `Kling`, and `Wan`
- cost breakdowns by duration
- clean `cheap / balanced / premium` recommendations
- workflow planning for `generate -> remove watermark -> download`
- concise client-ready API briefs
- explicit handling of `public` vs `undisclosed` pricing

## Best Use Cases

- choosing a PiAPI video model fast
- pricing and budgeting before production
- comparing `Seedance` vs `Veo` vs `Wan` vs `Kling`
- preparing client recommendations
- turning raw API options into a clean internal brief

## Quick Recommendation Grid

| Goal | Model |
|---|---|
| Fast testing | `seedance-2-fast-preview` |
| Better final Seedance output | `seedance-2-preview` |
| Best value high quality | `wan-2.6 1080p` |
| Premium realism | `veo-3.1` |
| Ad/commercial style | `kling-3.0 omni` |

## What The Skill Can Answer

- "Which PiAPI model should I use for a 10-second travel reel?"
- "How much will 20 videos at 5 seconds each cost?"
- "Compare Seedance vs Veo vs Wan for premium output."
- "Which model is best for testing prompts cheaply?"
- "Build a clean pipeline with watermark removal."
- "Give me a one-page client recommendation."

## Included Skill

This repo includes a reusable Codex/OpenAI-compatible skill:

- `piapi-video-toolkit`

It is designed to trigger on requests about:

- PiAPI video model selection
- video pricing
- `5-second`, `10-second`, and `15-second` cost comparisons
- production workflow planning
- watermark-removal-aware pipelines

## Repo Structure

```text
piapi-video-toolkit/
├── SKILL.md
├── agents/
│   └── openai.yaml
└── references/
    ├── models.md
    ├── pricing.md
    └── workflows.md
```

## Installation

Copy the `piapi-video-toolkit` folder into your skills directory, or publish this repo to GitHub and install it from there through your skill workflow.

## Design Principles

- no niche lock-in
- no campaign-specific prompts
- no long tutorials by default
- no fake totals when pricing is not public
- watermark removal treated as real production logic

## Publishing Notes

Suggested repo name:

- `piapi-video-toolkit-skill`

Suggested GitHub description:

- `A reusable Codex/OpenAI skill for PiAPI video model selection, pricing, and watermark-aware workflow planning.`

Suggested topics:

- `piapi`
- `video-ai`
- `ai-video`
- `codex-skill`
- `openai-skill`
- `video-workflows`
- `api-toolkit`
- `prompt-engineering`

## Final Note

This toolkit is intentionally universal. It is designed for travel, ads, ecommerce, real estate, social, product marketing, and any other video use case without rewriting the decision layer each time.
