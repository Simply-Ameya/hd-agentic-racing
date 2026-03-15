"use client";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  ChromaticAberration,
  Vignette,
  SMAA,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useGameStore } from "@/store/gameStore";

export default function PostProcessing() {
  const { playerCar } = useGameStore();

  // Scale effects based on speed
  const speedRatio = Math.min(playerCar.speed / 200, 1);
  const chromaticIntensity = speedRatio * 0.003;

  return (
    <EffectComposer multisampling={4}>
      {/* Anti aliasing */}
      <SMAA />

      {/* Bloom — headlights, neon, sun */}
      <Bloom
        intensity={0.4}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        mipmapBlur
      />

      {/* Depth of Field — cinematic focus */}
      <DepthOfField focusDistance={0.01} focalLength={0.02} bokehScale={2} />

      {/* Chromatic Aberration — increases with speed */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[chromaticIntensity, chromaticIntensity]}
        radialModulation={false}
        modulationOffset={0}
      />

      {/* Vignette — edge darkening */}
      <Vignette
        offset={0.3}
        darkness={0.6}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
