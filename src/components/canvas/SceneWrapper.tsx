"use client";
import { Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { KeyboardControls } from "@react-three/drei";
import { useGameStore } from "@/store/gameStore";
import HUD from "@/components/ui/HUD";
import MobileControls from "@/components/ui/MobileControls";
import { useMobileControls } from "@/hooks/useMobileControls";
import { useGameLoop } from "@/hooks/useGameLoop";
import AICommentary from "../ui/AICommentary";

const keyMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "brake", keys: ["Space"] },
];

const GameCanvas = dynamic(() => import("@/components/canvas/GameCanvas"), {
  ssr: false,
  loading: () => <LoadingScreen message="Loading 3D engine..." />,
});

function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="text-white text-2xl font-bold mb-4">🏎️ HD Racing</div>
      <div className="text-gray-400 text-sm mb-8">{message}</div>
      <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-yellow-400 rounded-full animate-pulse w-2/3" />
      </div>
    </div>
  );
}

export default function SceneWrapper() {
  const { phase, isMobile, setIsMobile } = useGameStore();
  const { controls, setControl } = useMobileControls();
  useGameLoop();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setIsMobile]);

  return (
    <KeyboardControls map={keyMap}>
      <div className="relative w-full h-screen bg-black overflow-hidden">
        {/* 3D Canvas */}
        <Suspense fallback={<LoadingScreen message="Loading assets..." />}>
          <GameCanvas externalControls={controls} />
        </Suspense>

        {/* HUD */}
        {phase === "playing" && <HUD />}
        {phase === "playing" && <AICommentary />}

        {/* Mobile Controls */}
        {phase === "playing" && isMobile && (
          <MobileControls setControl={setControl} />
        )}

        {/* Mobile Controls */}
        {phase === "playing" && isMobile && (
          <MobileControls setControl={setControl} />
        )}
      </div>
    </KeyboardControls>
  );
}
