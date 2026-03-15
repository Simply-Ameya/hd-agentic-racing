import { create } from "zustand";
import { EnemyDecision, GameMasterEvent } from "@/types/ai.types";

interface AIStore {
  enemyDecisions: EnemyDecision[];
  setEnemyDecisions: (decisions: EnemyDecision[]) => void;

  lastEvent: GameMasterEvent | null;
  setLastEvent: (event: GameMasterEvent) => void;

  commentary: string;
  setCommentary: (text: string) => void;

  isGeneratingWorld: boolean;
  setIsGeneratingWorld: (val: boolean) => void;
}

export const useAIStore = create<AIStore>((set) => ({
  enemyDecisions: [],
  setEnemyDecisions: (decisions) => set({ enemyDecisions: decisions }),

  lastEvent: null,
  setLastEvent: (event) => set({ lastEvent: event }),

  commentary: "",
  setCommentary: (text) => set({ commentary: text }),

  isGeneratingWorld: false,
  setIsGeneratingWorld: (val) => set({ isGeneratingWorld: val }),
}));
