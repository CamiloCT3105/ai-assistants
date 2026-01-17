import { create } from "zustand";
import { Assistant } from "@/src/types/assistant";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AssistantsState {
  assistants: Assistant[];
  selectedAssistant: Assistant | null;
  formDraft: Assistant | null;

  modalOpen: boolean;
  modalMode: "create" | "edit";

  chatHistory: Record<string, ChatMessage[]>; // por id

  openCreateModal: () => void;
  openEditModal: (assistant: Assistant) => void;
  closeModal: () => void;

  setAssistants: (assistants: Assistant[]) => void;
  selectAssistant: (assistant: Assistant | null) => void;

  addMessage: (assistantId: string, msg: ChatMessage) => void;
  resetChat: (assistantId: string) => void;
}


export const useAssistantsStore = create<AssistantsState>((set) => ({
  assistants: [],
  selectedAssistant: null,
  formDraft: null,

  modalOpen: false,
  modalMode: "create",

  openCreateModal: () =>
    set({
      modalOpen: true,
      modalMode: "create",
      selectedAssistant: null,
      formDraft: null,
    }),

  openEditModal: (assistant) =>
    set({
      modalOpen: true,
      modalMode: "edit",
      selectedAssistant: assistant,
      formDraft: { ...assistant },
    }),

  closeModal: () =>
    set({
      modalOpen: false,
      selectedAssistant: null,
      formDraft: null,
    }),

  setAssistants: (assistants) => set({ assistants }),
  selectAssistant: (assistant) => set({ selectedAssistant: assistant }),

  chatHistory: {},

addMessage: (id, msg) =>
  set((state) => ({
    chatHistory: {
      ...state.chatHistory,
      [id]: [...(state.chatHistory[id] || []), msg],
    },
  })),

resetChat: (id) =>
  set((state) => ({
    chatHistory: {
      ...state.chatHistory,
      [id]: [],
    },
  })),
}));
