"use client";
import { useEffect, useRef } from "react";
import { useAIStore } from "@/store/aiStore";
import { useGameStore } from "@/store/gameStore";
import { useAIAgent } from "@/hooks/useAIAgent";

export default function AICommentary() {
  const { commentary } = useAIStore();
  const { phase, currentLap, racePosition } = useGameStore();
  const { triggerGameMaster, updateEnemyAI } = useAIAgent();
  const lastLap = useRef(0);
  const lastPosition = useRef(racePosition);
  const enemyAITimer = useRef(0);

  // Trigger Game Master on lap change
  useEffect(() => {
    if (phase !== "playing") return;
    if (currentLap > 0 && currentLap !== lastLap.current) {
      lastLap.current = currentLap;
      triggerGameMaster("lap_complete");
    }
  }, [currentLap, phase, triggerGameMaster]);

  // Trigger Game Master on position change
  useEffect(() => {
    if (phase !== "playing") return;
    if (racePosition !== lastPosition.current) {
      lastPosition.current = racePosition;
      if (racePosition === 1) {
        triggerGameMaster("player_takes_lead");
      } else if (racePosition > 2) {
        triggerGameMaster("player_falling_behind");
      }
    }
  }, [racePosition, phase, triggerGameMaster]);

  // Trigger race start commentary
  useEffect(() => {
    if (phase === "playing") {
      setTimeout(() => {
        triggerGameMaster("race_start");
      }, 2000);
    }
  }, [phase, triggerGameMaster]);

  // Update enemy AI every 30 seconds
  useEffect(() => {
    if (phase !== "playing") return;
    const interval = setInterval(() => {
      updateEnemyAI();
      enemyAITimer.current += 30;
    }, 30000);
    return () => clearInterval(interval);
  }, [phase, updateEnemyAI]);

  if (!commentary) return null;

  return (
    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 md:bottom-12 pointer-events-none">
      <div className="bg-yellow-400/90 backdrop-blur rounded-full px-6 py-2 text-black font-bold text-sm md:text-base text-center max-w-sm animate-bounce shadow-lg">
        🎙️ {commentary}
      </div>
    </div>
  );
}
