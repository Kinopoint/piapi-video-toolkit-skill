export type SeedanceTaskType = "seedance-2-preview" | "seedance-2-fast-preview";
export type AspectRatio = "16:9" | "9:16" | "1:1";
export type WatermarkRemovalModel = "seedance" | "sora2";
export type TextToVideoTaskInput = {
  prompt: string;
  aspect_ratio: AspectRatio;
  duration: number;
  image_urls?: string[];
  video_urls?: string[];
};
export type WatermarkRemovalTaskInput = {
  video_url: string;
};

export type CreateTaskRequest = {
  model: string;
  task_type: string;
  input: TextToVideoTaskInput | WatermarkRemovalTaskInput;
  config?: {
    service_mode?: string;
    webhook_config?: {
      endpoint?: string;
      secret?: string;
    };
  };
};

export type TextToVideoTaskRequest = Omit<CreateTaskRequest, "input"> & {
  input: TextToVideoTaskInput;
};

export type WatermarkRemovalTaskRequest = Omit<CreateTaskRequest, "input"> & {
  input: WatermarkRemovalTaskInput;
};

export type PiApiTaskData = {
  task_id: string;
  model: string;
  task_type: string;
  status: string;
  config?: {
    service_mode?: string;
    webhook_config?: {
      endpoint?: string;
      secret?: string;
    };
  };
  input?: {
    prompt?: string;
    aspect_ratio?: string;
    duration?: number;
    image_urls?: string[];
    video_urls?: string[];
  };
  output?: {
    video?: string;
  };
  meta?: {
    created_at?: string | null;
    started_at?: string | null;
    ended_at?: string | null;
    usage?: {
      type?: string;
      frozen?: number;
      consume?: number;
    };
    is_using_private_pool?: boolean;
  };
  detail?: unknown;
  logs?: unknown[];
  error?: {
    code?: number;
    raw_message?: string;
    message?: string;
    detail?: unknown;
  };
};

export type TaskResponseEnvelope = {
  timestamp?: number;
  data: PiApiTaskData;
};

export type TaskHistoryEnvelope = {
  timestamp?: number;
  code?: number;
  message?: string;
  data:
    | {
        items?: PiApiTaskData[];
        list?: PiApiTaskData[];
        data?: HistoryListItem[];
      }
    | PiApiTaskData[]
    | HistoryListItem[];
};

export type HistoryListItem = {
  task_id: string;
  task_model?: string;
  action?: string;
  status: string;
  created_at?: string | null;
  detail?: {
    model?: string;
    output?: string | null;
    task_id?: string;
    task_type?: string;
  };
};

export type NormalizedSeedanceTask = {
  taskId: string;
  model: string;
  taskType: string;
  status: string;
  prompt: string;
  aspectRatio: string | null;
  duration: number | null;
  videoUrl: string | null;
  createdAt: string | null;
  startedAt: string | null;
  endedAt: string | null;
  errorCode: number;
  errorMessage: string;
  usageType: string | null;
  usageConsume: number | null;
};

export type CostBreakdown = {
  generationUsd: number | null;
  generationPriceDisclosure: "public" | "undisclosed";
  watermarkRemovalUsd: number | null;
  watermarkRemovalPriceDisclosure: "public" | "undisclosed" | "not_applicable";
  totalUsd: number | null;
};

export type SeedanceHistoryItem = {
  taskId: string;
  taskType: string;
  status: string;
  prompt: string;
  createdAt: string | null;
  videoUrl: string | null;
};
