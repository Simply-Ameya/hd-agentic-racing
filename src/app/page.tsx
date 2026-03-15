"use client";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { useAIAgent } from "@/hooks/useAIAgent";
import { useAIStore } from "@/store/aiStore";

export default function MenuPage() {
  const router = useRouter();
  const { setPhase, reset } = useGameStore();
  const { generateWorld } = useAIAgent();
  const { isGeneratingWorld } = useAIStore();

  const handleStartRace = async () => {
    reset();
    setPhase("loading");

    // Generate AI world before entering game
    const track = await generateWorld();

    if (track) {
      setPhase("playing");
      router.push("/game");
    } else {
      // Fallback — go to game anyway with default track
      setPhase("playing");
      router.push("/game");
    }
  };

  return (
    <main className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900" />

      {/* Animated road lines */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 bg-yellow-400 animate-pulse"
            style={{
              left: `${10 + i * 12}%`,
              top: 0,
              bottom: 0,
              animationDelay: `${i * 0.2}s`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* Title */}
        <div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight">
            HD
            <span className="text-yellow-400"> RACING</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base tracking-widest uppercase">
            Powered by Agentic AI
          </p>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "🌍 AI Generated Tracks",
            "🤖 Smart Enemy AI",
            "🎲 Dynamic Events",
            "🔊 Spatial Audio",
          ].map((feature) => (
            <span
              key={feature}
              className="bg-white/10 border border-white/20 text-white text-xs px-3 py-1 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartRace}
          disabled={isGeneratingWorld}
          className="
            mt-4 px-12 py-4 rounded-full
            bg-yellow-400 hover:bg-yellow-300
            text-black font-black text-xl
            transition-all duration-200
            hover:scale-105 active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-lg shadow-yellow-400/30
          "
        >
          {isGeneratingWorld ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⚙️</span>
              Generating World...
            </span>
          ) : (
            "🏎️ Start Race"
          )}
        </button>

        {/* Controls hint */}
        <div className="text-gray-600 text-xs mt-4">
          <p className="md:block hidden">
            ⌨️ WASD / Arrow Keys to drive · Space to brake
          </p>
          <p className="md:hidden block">🕹️ Use on-screen joystick to drive</p>
        </div>
      </div>
    </main>
  );
}
