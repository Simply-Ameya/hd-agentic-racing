import { useEffect, useRef } from "react";
import { Howl } from "howler";
import { useGameStore } from "@/store/gameStore";

let crashHowl: Howl | null = null;

export function playCrashSound() {
  if (crashHowl) {
    crashHowl.stop();
    crashHowl.unload();
  }
  crashHowl = new Howl({
    src: ["/sounds/crash/crash.mp3"],
    volume: 0.8,
  });
  crashHowl.play();
}

export function useGameLoop() {
  const engineSound = useRef<Howl | null>(null);
  const musicSound = useRef<Howl | null>(null);
  const { phase, playerCar } = useGameStore();

  // Initialize sounds
  useEffect(() => {
    engineSound.current = new Howl({
      src: ["/sounds/engine/engine.mp3"],
      loop: true,
      volume: 0.5,
      rate: 0.8,
    });

    musicSound.current = new Howl({
      src: ["/sounds/music/music.mp3"],
      loop: true,
      volume: 0.3,
    });

    return () => {
      engineSound.current?.unload();
      musicSound.current?.unload();
    };
  }, []);

  // Start/stop sounds based on game phase
  useEffect(() => {
    if (phase === "playing") {
      engineSound.current?.play();
      musicSound.current?.play();
    } else {
      engineSound.current?.stop();
      musicSound.current?.stop();
    }
  }, [phase]);

  // Adjust engine pitch based on speed
  useEffect(() => {
    if (!engineSound.current) return;
    const rate = 0.8 + (playerCar.speed / 200) * 1.4;
    engineSound.current.rate(Math.min(rate, 2.2));
  }, [playerCar.speed]);
}
