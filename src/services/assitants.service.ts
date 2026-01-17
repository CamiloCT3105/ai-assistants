import { Assistant } from "@/src/types/assistant";
import { delay, shouldFail } from "./helpers";

type CreateAssistantInput = Omit<Assistant, "id">;

let assistantsDB: Assistant[] = [];

export async function fetchAssistants(): Promise<Assistant[]> {
  await delay(300);
  return [...assistantsDB];
}

export async function createAssistant(
  assistant: CreateAssistantInput
): Promise<Assistant> {
  await delay(400);

  const newAssistant: Assistant = {
    ...assistant,
    id: crypto.randomUUID(),
  };

  assistantsDB.push(newAssistant);

  return newAssistant;
}

export async function deleteAssistant(id: string): Promise<void> {
  await delay(300);

  if (shouldFail()) {
    throw new Error("Error al eliminar el asistente");
  }

  assistantsDB = assistantsDB.filter((a) => a.id !== id);
}

export async function updateAssistant(
  assistant: Assistant
): Promise<Assistant> {
  await delay(400);

  assistantsDB = assistantsDB.map((a) =>
    a.id === assistant.id ? assistant : a
  );

  return assistant;
}