# PiAPI Video Toolkit Skill

Choose the right PiAPI video model, estimate `5s` and `10s` cost, compare quality tiers, and run real PiAPI workflows with your own API key.

Built on top of PiAPI.

## What This Repo Is

This repository combines two layers:

- a reusable `skill` for model selection, pricing, and workflow planning
- a runnable `Node.js + TypeScript CLI` for real PiAPI execution

Use the skill for decision-making.
Use the CLI for generation, status checks, downloading, and watermark-removal-aware workflows.

## What You Need

To actually run video tasks, you need:

- a PiAPI account
- a PiAPI API key
- Node.js `22+`

Without a PiAPI key, the skill still works as an advisory layer, but the CLI cannot execute real requests.

## Quick Start

```bash
git clone https://github.com/Kinopoint/piapi-video-toolkit-skill.git
cd piapi-video-toolkit-skill
npm install
cp .env.example .env
```

Then add your key to `.env`:

```env
PIAPI_API_KEY=your_piapi_api_key
PIAPI_BASE_URL=https://api.piapi.ai
PAPI_DOWNLOAD_DIR=downloads
PAPI_POLL_INTERVAL_MS=10000
PAPI_POLL_TIMEOUT_MS=2700000
```

## CLI Commands

```bash
npm run dev -- prompt --theme hybrid --brief "Luxury resort, sunset, drone reveal"
npm run dev -- generate --theme golf --aspect-ratio 9:16 --duration 10
npm run dev -- status --task-id <task_id>
npm run dev -- history --limit 10
npm run dev -- download --task-id <task_id>
npm run dev -- remove-watermark --task-id <task_id> --wait
npm run dev -- generate-and-download --theme hybrid --duration 5 --remove-watermark
```

## What The CLI Does

- generates reusable Seedance-style prompts
- creates PiAPI video tasks
- polls task status
- lists recent task history
- downloads completed videos
- queues watermark removal as part of the workflow
- estimates public generation pricing and marks undisclosed removal pricing clearly

## Skill Layer

The included skill is:

- `piapi-video-toolkit`

It is designed to help with:

- PiAPI model selection
- pricing comparison
- `5s` / `10s` / `15s` budgeting
- workflow design
- watermark-aware production planning

Skill files live in:

```text
piapi-video-toolkit/
├── SKILL.md
├── agents/openai.yaml
└── references/
```

## Toolkit Layer

Runnable code lives in:

```text
src/
tests/
.env.example
package.json
```

This is the layer where users place their `PIAPI_API_KEY` and run actual commands.

## Quick Recommendation Grid

| Goal | Model |
|---|---|
| Fast testing | `seedance-2-fast-preview` |
| Better final Seedance output | `seedance-2-preview` |
| Best value high quality | `wan-2.6 1080p` |
| Premium realism | `veo-3.1` |
| Ad/commercial style | `kling-3.0 omni` |

## Quick Pricing Snapshot

| Model | 5s | 10s |
|---|---:|---:|
| `seedance-2-fast-preview` | `$0.40` | `$0.80` |
| `seedance-2-preview` | `$0.75` | `$1.50` |
| `wan-2.6 1080p` | `$0.60` | `$1.20` |
| `veo-3.1 no audio` | `$0.60` | `$1.20` |
| `kling-3.0 omni 1080p` | `$1.00` | `$2.00` |

## Workflow Default

Use this as the standard production path:

`generate -> remove watermark -> download`

If watermark-removal pricing is not publicly disclosed, the toolkit keeps it explicit and marks the final removal cost as `undisclosed` instead of inventing a fake total.

## Design Principles

- no niche lock-in
- no campaign-specific prompts required
- no fake totals when pricing is not public
- watermark removal treated as real production logic
- useful as both a knowledge layer and a runnable toolkit

## Final Note

This repository is intentionally universal. It is designed for travel, ads, ecommerce, real estate, social, product marketing, and any other video use case without rewriting the decision layer every time.
