"use client";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Sky, Environment, Grid, KeyboardControls } from "@react-three/drei";
import { Suspense } from "react";
import PostProcessing from "@/components/effects/PostProcessing";
import { useGameStore } from "@/store/gameStore";
import Track from "../environment/Track";
import PlayerCar from "../entities/PlayerCar";
import { CarControls } from "@/types/car.types";

const keyMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "brake", keys: ["Space"] },
];

interface GameCanvasProps {
  externalControls: CarControls;
}

export default function GameCanvas({ externalControls }: GameCanvasProps) {
  const { trackData } = useGameStore();

  // Pick sky/fog based on AI weather
  const weather = trackData?.weather ?? "clear";
  const fogColor =
    weather === "fog"
      ? "#aaaaaa"
      : weather === "storm"
        ? "#334455"
        : weather === "snow"
          ? "#ddeeff"
          : "#87ceeb";

  return (
    <KeyboardControls map={keyMap}>
      <Canvas
        shadows
        dpr={[1, 2]} // responsive resolution — 1x mobile, 2x desktop
        camera={{ fov: 75, position: [0, 3, 8], near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        {/* Fog — reacts to AI weather */}
        <fog attach="fog" args={[fogColor, 30, 300]} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          castShadow
          position={[50, 100, 50]}
          intensity={1.5}
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={500}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
        />
        <hemisphereLight args={["#87ceeb", "#444444", 0.3]} />

        {/* Sky */}
        <Sky
          sunPosition={[100, 20, 100]}
          turbidity={weather === "storm" ? 10 : 2}
          rayleigh={weather === "storm" ? 4 : 1}
        />

        {/* Environment — PBR reflections */}
        <Environment preset="sunset" />

        {/* Physics world */}
        <Physics gravity={[0, -20, 0]}>
          <Suspense fallback={null}>
            <Track />
            <PlayerCar externalControls={externalControls} />
          </Suspense>
        </Physics>

        {/* HD Post Processing */}
        <PostProcessing />
      </Canvas>
    </KeyboardControls>
  );
}
