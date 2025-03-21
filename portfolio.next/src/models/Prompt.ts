export interface BasePrompt {
  name: string;
  template: string;
  parameters: string[];
}

export interface Prompt extends BasePrompt {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export type PromptFormData = BasePrompt & { _id?: string };
