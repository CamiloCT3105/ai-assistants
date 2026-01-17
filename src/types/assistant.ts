export type AssistantTone =
  | "formal"
  | "casual"
  | "professional"
  | "friendly";

export type AssistantLanguage = "es" | "en" | "pt";

export interface Assistant {
  id: string;
  name: string;
  language: AssistantLanguage;
  tone: AssistantTone;
  responseConfig: {
    short: number;
    medium: number;
    long: number;
    audioEnabled: boolean;
  };
}
