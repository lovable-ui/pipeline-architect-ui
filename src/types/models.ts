
export interface ModelStep {
  model_id: string;
  name: string;
  step_order: number;
  query: string;
  destination_name: string;
  schema: Record<string, string>;
  write_mechanism: string;
  primary_keys: string[];
  partition_keys: string[];
  sort_keys: string[];
}

export interface Model {
  id?: string;
  name: string;
  model_type: string;
  enabled: boolean;
  schedule_interval: string;
  tags?: Record<string, string>;
  steps: ModelStep[];
}

export interface ModelStepInput {
  model_id: string;
  name: string;
  step_order: number;
  query: string;
  destination_name: string;
  schema: Record<string, string>;
  write_mechanism: string;
  primary_keys: string[];
  partition_keys: string[];
  sort_keys: string[];
}

export interface ModelInput {
  name: string;
  model_type: string;
  enabled: boolean;
  schedule_interval: string;
  tags?: Record<string, string>;
  steps: ModelStepInput[];
}
