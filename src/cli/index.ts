#!/usr/bin/env node
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";

import { Command, Option } from "commander";

import { loadEnv } from "../config/env.js";
import { downloadTaskVideo, downloadVideoFromUrl } from "../downloads/service.js";
import { listSeedanceHistory } from "../history/service.js";
import { PiApiClient } from "../piapi/client.js";
import { createWatermarkRemovalTask, removeWatermarkAndWait, shouldAttemptWatermarkRemoval } from "../postprocess/watermark-removal.js";
import { buildSeedancePrompt, type PromptStyle, type PromptTheme } from "../seedance/prompt-builder.js";
import { buildGenerateSummary, createSeedanceTask, generateAndWait, normalizeTaskEnvelope } from "../seedance/service.js";
import { formatHistory, formatTask } from "./formatters.js";

type SharedPromptFlags = {
  theme?: PromptTheme;
  style?: PromptStyle;
  brief?: string;
  duration?: number;
};

type OutputFlags = {
  json?: boolean;
};

function maybeLoadDotEnv(): void {
  if (existsSync(".env")) {
    loadEnvFile(".env");
  }
}

function emit(value: unknown, asJson: boolean | undefined): void {
  if (asJson) {
    console.log(JSON.stringify(value, null, 2));
    return;
  }

  if (typeof value === "string") {
    console.log(value);
    return;
  }

  console.log(JSON.stringify(value, null, 2));
}

function resolvePrompt(flags: SharedPromptFlags & { prompt?: string }): string {
  if (flags.prompt !== undefined) {
    const prompt = flags.prompt.trim();

    if (prompt.length === 0) {
      throw new Error("Prompt must not be empty.");
    }

    return prompt;
  }

  if (flags.theme === undefined) {
    throw new Error("Provide either --prompt or --theme.");
  }

  const options: {
    theme: PromptTheme;
    style?: PromptStyle;
    durationSeconds?: number;
    brief?: string;
  } = {
    theme: flags.theme,
  };

  if (flags.style !== undefined) {
    options.style = flags.style;
  }

  if (flags.duration !== undefined) {
    options.durationSeconds = flags.duration;
  }

  if (flags.brief !== undefined) {
    options.brief = flags.brief;
  }

  return buildSeedancePrompt(options);
}

function commonPromptOptions(command: Command): Command {
  return command
    .addOption(new Option("--theme <theme>", "Prompt theme").choices(["golf", "town", "hybrid"]))
    .addOption(new Option("--style <style>", "Prompt style").choices(["luxury", "viral", "realistic"]).default("luxury"))
    .option("--brief <brief>", "Extra user direction")
    .option("--duration <seconds>", "Video duration in seconds", (value) => Number.parseInt(value, 10), 15);
}

async function main(): Promise<void> {
  maybeLoadDotEnv();

  const program = new Command();

  program
    .name("papi")
    .description("PiAPI Seedance CLI for Ballybunion prompts and video workflows")
    .option("--json", "Print JSON output");

  commonPromptOptions(
    program
      .command("prompt")
      .description("Generate a Ballybunion Seedance prompt")
      .action((flags: SharedPromptFlags, command: Command) => {
        const prompt = resolvePrompt(flags);
        emit(prompt, command.parent?.opts<OutputFlags>().json);
      }),
  );

  commonPromptOptions(
    program
      .command("generate")
      .description("Create a Seedance task")
      .option("--prompt <prompt>", "Provide an explicit prompt instead of a theme")
      .addOption(new Option("--aspect-ratio <ratio>").choices(["16:9", "9:16", "1:1"]).default("9:16"))
      .addOption(new Option("--task-type <taskType>").choices(["seedance-2-preview", "seedance-2-fast-preview"]).default("seedance-2-preview"))
      .option("--remove-watermark", "Queue watermark removal as the next processing step")
      .action(async (flags: SharedPromptFlags & { prompt?: string; aspectRatio: "16:9" | "9:16" | "1:1"; taskType: "seedance-2-preview" | "seedance-2-fast-preview" }, command: Command) => {
        const env = loadEnv();
        const client = new PiApiClient(env);
        const prompt = resolvePrompt(flags);
        const task = await createSeedanceTask(client, {
          prompt,
          aspectRatio: flags.aspectRatio,
          duration: flags.duration ?? 15,
          taskType: flags.taskType,
        });
        emit(
          command.parent?.opts<OutputFlags>().json
            ? buildGenerateSummary(task, Boolean((flags as { removeWatermark?: boolean }).removeWatermark))
            : formatTask(task),
          command.parent?.opts<OutputFlags>().json,
        );
      }),
  );

  program
    .command("status")
    .description("Fetch one task")
    .requiredOption("--task-id <taskId>", "PiAPI task ID")
    .action(async (flags: { taskId: string }, command: Command) => {
      const env = loadEnv();
      const client = new PiApiClient(env);
      const task = normalizeTaskEnvelope(await client.getTask(flags.taskId));
      emit(command.parent?.opts<OutputFlags>().json ? task : formatTask(task), command.parent?.opts<OutputFlags>().json);
    });

  program
    .command("history")
    .description("List recent Seedance tasks")
    .option("--limit <limit>", "Number of tasks to show", (value) => Number.parseInt(value, 10), 20)
    .action(async (flags: { limit: number }, command: Command) => {
      const env = loadEnv();
      const client = new PiApiClient(env);
      const tasks = await listSeedanceHistory(client, flags.limit);
      emit(command.parent?.opts<OutputFlags>().json ? tasks : formatHistory(tasks), command.parent?.opts<OutputFlags>().json);
    });

  program
    .command("remove-watermark")
    .description("Create a remove-watermark task from an existing video task or URL")
    .option("--task-id <taskId>", "PiAPI task ID")
    .option("--url <url>", "Direct video URL")
    .option("--wait", "Wait for the removal task to complete")
    .action(async (flags: { taskId?: string; url?: string; wait?: boolean }, command: Command) => {
      const env = loadEnv();
      const client = new PiApiClient(env);

      if (flags.taskId === undefined && flags.url === undefined) {
        throw new Error("Provide either --task-id or --url.");
      }

      const sourceTask = flags.taskId === undefined ? null : normalizeTaskEnvelope(await client.getTask(flags.taskId));
      const videoUrl = flags.url ?? sourceTask?.videoUrl;

      if (videoUrl === null || videoUrl === undefined) {
        throw new Error("Could not resolve a source video URL for watermark removal.");
      }

      const removeOptions = {
        model: "seedance" as const,
        videoUrl,
      };

      if (flags.wait) {
        const task = await removeWatermarkAndWait(client, removeOptions, {
          pollIntervalMs: env.pollIntervalMs,
          pollTimeoutMs: env.pollTimeoutMs,
        });
        emit(command.parent?.opts<OutputFlags>().json ? task : formatTask(task), command.parent?.opts<OutputFlags>().json);
        return;
      }

      const task = await createWatermarkRemovalTask(client, removeOptions);
      emit(command.parent?.opts<OutputFlags>().json ? task : formatTask(task), command.parent?.opts<OutputFlags>().json);
    });

  program
    .command("download")
    .description("Download a completed video by task ID or direct URL")
    .option("--task-id <taskId>", "PiAPI task ID")
    .option("--url <url>", "Direct video URL")
    .action(async (flags: { taskId?: string; url?: string }, command: Command) => {
      const env = loadEnv();

      if (flags.url === undefined && flags.taskId === undefined) {
        throw new Error("Provide either --task-id or --url.");
      }

      if (flags.url !== undefined) {
        const savedPath = await downloadVideoFromUrl(flags.url, {
          outputDir: env.downloadDir,
        });
        emit({ savedPath }, command.parent?.opts<OutputFlags>().json);
        return;
      }

      const client = new PiApiClient(env);
      const task = normalizeTaskEnvelope(await client.getTask(flags.taskId as string));
      const savedPath = await downloadTaskVideo(task, {
        outputDir: env.downloadDir,
      });
      emit({ savedPath, taskId: task.taskId }, command.parent?.opts<OutputFlags>().json);
    });

  commonPromptOptions(
    program
      .command("generate-and-download")
      .description("Create a Seedance task, wait for completion, and download the result")
      .option("--prompt <prompt>", "Provide an explicit prompt instead of a theme")
      .addOption(new Option("--aspect-ratio <ratio>").choices(["16:9", "9:16", "1:1"]).default("9:16"))
      .addOption(new Option("--task-type <taskType>").choices(["seedance-2-preview", "seedance-2-fast-preview"]).default("seedance-2-preview"))
      .option("--remove-watermark", "Attempt watermark removal before downloading the final file")
      .action(async (flags: SharedPromptFlags & { prompt?: string; aspectRatio: "16:9" | "9:16" | "1:1"; taskType: "seedance-2-preview" | "seedance-2-fast-preview"; removeWatermark?: boolean }, command: Command) => {
        const env = loadEnv();
        const client = new PiApiClient(env);
        const prompt = resolvePrompt(flags);
        const generatedTask = await generateAndWait(
          client,
          {
            prompt,
            aspectRatio: flags.aspectRatio,
            duration: flags.duration ?? 15,
            taskType: flags.taskType,
          },
          {
            pollIntervalMs: env.pollIntervalMs,
            pollTimeoutMs: env.pollTimeoutMs,
          },
        );
        const finalTask = flags.removeWatermark && shouldAttemptWatermarkRemoval(generatedTask)
          ? await removeWatermarkAndWait(
              client,
              {
                model: "seedance",
                videoUrl: generatedTask.videoUrl as string,
              },
              {
                pollIntervalMs: env.pollIntervalMs,
                pollTimeoutMs: env.pollTimeoutMs,
              },
            )
          : generatedTask;

        const savedPath = await downloadTaskVideo(finalTask, {
          outputDir: env.downloadDir,
        });
        const summary = buildGenerateSummary(generatedTask, Boolean(flags.removeWatermark));
        emit(
          {
            generatedTask,
            finalTask,
            cost: summary.cost,
            savedPath,
          },
          command.parent?.opts<OutputFlags>().json,
        );
      }),
  );

  await program.parseAsync(process.argv);
}

main();
