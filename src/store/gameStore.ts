import { CarState } from "@/types/car.types";
import { TrackData } from "@/types/track.types";
import { create } from "zustand";

interface GameStore {
  // Phase
  phase: "menu" | "loading" | "playing" | "paused" | "gameover";
  setPhase: (phase: GameStore["phase"]) => void;

  // Player
  playerCar: CarState;
  updatePlayerCar: (state: Partial<CarState>) => void;

  // Race
  trackData: TrackData | null;
  setTrackData: (data: TrackData) => void;
  currentLap: number;
  totalLaps: number;
  racePosition: number;
  setRacePosition: (pos: number) => void;
  incrementLap: () => void;

  // Score
  score: number;
  addScore: (n: number) => void;

  // Mobile
  isMobile: boolean;
  setIsMobile: (val: boolean) => void;

  // Reset
  reset: () => void;
}

const defaultPlayerCar: CarState = {
  speed: 0,
  rpm: 0,
  gear: 1,
  position: { x: 0, y: 0, z: 0 },
  lap: 0,
  racePosition: 1,
};

export const useGameStore = create<GameStore>((set) => ({
  phase: "menu",
  setPhase: (phase) => set({ phase }),

  playerCar: defaultPlayerCar,
  updatePlayerCar: (state) =>
    set((s) => ({ playerCar: { ...s.playerCar, ...state } })),

  trackData: null,
  setTrackData: (data) => set({ trackData: data }),
  currentLap: 0,
  totalLaps: 3,
  racePosition: 1,
  setRacePosition: (pos) => set({ racePosition: pos }),
  incrementLap: () => set((s) => ({ currentLap: s.currentLap + 1 })),

  score: 0,
  addScore: (n) => set((s) => ({ score: s.score + n })),

  isMobile: false,
  setIsMobile: (val) => set({ isMobile: val }),

  reset: () =>
    set({
      phase: "menu",
      playerCar: defaultPlayerCar,
      currentLap: 0,
      racePosition: 1,
      score: 0,
    }),
}));
