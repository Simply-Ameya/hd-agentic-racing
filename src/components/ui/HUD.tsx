"use client";
import { useGameStore } from "@/store/gameStore";
import { useAIStore } from "@/store/aiStore";

export default function HUD() {
  const { playerCar, currentLap, totalLaps, racePosition, score } =
    useGameStore();
  const { commentary } = useAIStore();

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {/* Top bar — Position, Lap, Score */}
      <div className="flex justify-between items-start p-4">
        {/* Race Position */}
        <div className="bg-black/50 backdrop-blur rounded-xl px-4 py-2 text-white">
          <div className="text-xs text-gray-400 uppercase tracking-wider">
            Position
          </div>
          <div className="text-3xl font-bold">P{racePosition}</div>
        </div>

        {/* Lap Counter */}
        <div className="bg-black/50 backdrop-blur rounded-xl px-4 py-2 text-white text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wider">
            Lap
          </div>
          <div className="text-3xl font-bold">
            {currentLap}/{totalLaps}
          </div>
        </div>

        {/* Score */}
        <div className="bg-black/50 backdrop-blur rounded-xl px-4 py-2 text-white text-right">
          <div className="text-xs text-gray-400 uppercase tracking-wider">
            Score
          </div>
          <div className="text-3xl font-bold">{score}</div>
        </div>
      </div>

      {/* Bottom left — Speed & Gear */}
      <div className="absolute bottom-32 left-4 md:bottom-8">
        <div className="bg-black/50 backdrop-blur rounded-xl px-4 py-3 text-white">
          <div className="flex items-end gap-2">
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                Speed
              </div>
              <div className="text-4xl font-bold tabular-nums">
                {Math.round(playerCar.speed)}
              </div>
              <div className="text-xs text-gray-400">km/h</div>
            </div>
            <div className="ml-4">
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                Gear
              </div>
              <div className="text-4xl font-bold">{playerCar.gear}</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Commentary — bottom center */}
      {commentary && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 md:bottom-8">
          <div className="bg-yellow-500/80 backdrop-blur rounded-xl px-6 py-2 text-black font-bold text-center max-w-xs animate-pulse">
            🎙️ {commentary}
          </div>
        </div>
      )}
    </div>
  );
}
