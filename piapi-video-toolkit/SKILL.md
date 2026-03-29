---
name: piapi-video-toolkit
description: Use when the user wants to choose the right PiAPI video model, compare Seedance vs Veo vs Kling vs Wan, estimate 5-second or 10-second video costs, plan a generation pipeline, or account for watermark removal in a production workflow. Also use when the user asks for a concise client-ready video API brief or recommendation.
---

# PiAPI Video Toolkit

Use this skill when the task is about PiAPI video model choice, pricing, duration tradeoffs, or production workflow design.

## What This Skill Is

This skill is a planning and decision layer.

It does:

- compare models
- estimate pricing
- explain workflow tradeoffs
- shape production recommendations

It does not:

- create PiAPI accounts
- provide API keys
- execute PiAPI requests by itself unless the host environment already has tools for that

If the user wants actual generation or downloading, make it clear that they need their own PiAPI-connected execution layer.

## What This Skill Should Do

Give concise, practical answers about:

- which PiAPI video model to use
- cost by duration
- best model by goal
- workflow structure
- watermark-removal implications

Do not turn the answer into a long tutorial unless the user asks for depth.

## Default Response Style

- be short and decision-oriented
- prefer tables when comparing models or prices
- separate `public pricing` from `undisclosed pricing`
- always end with a recommendation, not just raw data

## Core Workflow

When answering, follow this order:

1. Identify the user's goal
2. Choose the relevant models
3. Compare quality, price, and duration
4. Include watermark-removal implications when relevant
5. Give a final recommendation

## Model Selection Rules

- For fast testing and prompt iteration: prefer `seedance-2-fast-preview`
- For better final Seedance renders: prefer `seedance-2-preview`
- For best value at high quality: prefer `wan-2.6 1080p`
- For premium realism and strongest output quality: prefer `veo-3.1`
- For commercial/ad-style output and stronger control: prefer `kling-3.0 omni`

Read [references/models.md](references/models.md) when comparing models.

## Pricing Rules

- If the user asks about `5s`, `10s`, or `15s`, compute direct cost from the published price per second
- If watermark removal pricing is not publicly disclosed, say so explicitly
- Never present an invented total if part of the pipeline is undisclosed
- If a public watermark-removal price exists for a model, show it separately

Read [references/pricing.md](references/pricing.md) when answering pricing questions.

## Workflow Rules

Treat this as the standard production pipeline:

`generate -> remove watermark -> download`

If the model or provider does not publish removal pricing clearly:

- still include removal in the workflow recommendation
- mark the USD cost as `undisclosed`

Read [references/workflows.md](references/workflows.md) when building a production recommendation.

## Setup Assumptions

Assume the user needs all of the following for real execution:

- PiAPI account
- PiAPI API key
- their own runtime, scripts, CLI, or tool layer that can call PiAPI

If they only have the skill installed, treat the skill as advisory rather than executable.

## Output Patterns

For a simple recommendation:

- give one short table
- give one final recommendation line

For a budget question:

- show price per second
- show 5s and 10s totals
- call out whether watermark removal is included, excluded, or undisclosed

For a client-facing brief:

- group into `cheap`, `balanced`, `premium`
- keep wording clean and non-technical

## Important Constraint

This skill is universal. Do not anchor it to a niche like tourism, golf, real estate, ecommerce, or social content unless the user explicitly asks for that context.
