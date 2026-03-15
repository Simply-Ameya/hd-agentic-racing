import { useCallback } from "react";
import { useGameStore } from "@/store/gameStore";
import { useAIStore } from "@/store/aiStore";
import { TrackData } from "@/types/track.types";
import { EnemyDecision, GameMasterEvent } from "@/types/ai.types";

export function useAIAgent() {
  const { trackData, setTrackData, playerCar, currentLap, racePosition } =
    useGameStore();
  const {
    setEnemyDecisions,
    setLastEvent,
    setCommentary,
    setIsGeneratingWorld,
  } = useAIStore();

  // ---- World Generator ----
  const generateWorld = useCallback(async () => {
    setIsGeneratingWorld(true);
    try {
      const seed = Math.floor(Math.random() * 9999);
      const res = await fetch("/api/ai/world-gen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed }),
      });

      const data: TrackData = await res.json();
      setTrackData(data);
      return data;
    } catch (error) {
      console.error("World generation failed:", error);
      return null;
    } finally {
      setIsGeneratingWorld(false);
    }
  }, [setTrackData, setIsGeneratingWorld]);

  // ---- Enemy AI Director ----
  const updateEnemyAI = useCallback(async () => {
    try {
      const res = await fetch("/api/ai/enemy-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerSpeed: playerCar.speed,
          playerLap: currentLap,
          playerPosition: racePosition,
          totalEnemies: 3,
        }),
      });

      const decisions: EnemyDecision[] = await res.json();
      setEnemyDecisions(decisions);
    } catch (error) {
      console.error("Enemy AI update failed:", error);
    }
  }, [playerCar.speed, currentLap, racePosition, setEnemyDecisions]);

  // ---- Game Master ----
  const triggerGameMaster = useCallback(
    async (event: string) => {
      try {
        const res = await fetch("/api/ai/game-master", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event,
            playerLap: currentLap,
            playerPosition: racePosition,
            weather: trackData?.weather ?? "clear",
          }),
        });

        const data: GameMasterEvent = await res.json();
        setLastEvent(data);

        // Speak commentary via Web Speech API
        if (data.commentary && typeof window !== "undefined") {
          const utterance = new SpeechSynthesisUtterance(data.commentary);
          utterance.rate = 1.1;
          utterance.pitch = 1.2;
          window.speechSynthesis.speak(utterance);
          setCommentary(data.commentary);
        }

        return data;
      } catch (error) {
        console.error("Game master trigger failed:", error);
        return null;
      }
    },
    [currentLap, racePosition, trackData, setLastEvent, setCommentary],
  );

  return { generateWorld, updateEnemyAI, triggerGameMaster };
}
