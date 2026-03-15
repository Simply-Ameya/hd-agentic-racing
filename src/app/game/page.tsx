"use client";

import dynamic from "next/dynamic";

// Disable SSR for the entire game page
const SceneWrapper = dynamic(() => import("@/components/canvas/SceneWrapper"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
      <div className="text-white text-2xl font-bold mb-4">🏎️ HD Racing</div>
      <div className="text-gray-400 text-sm">Starting engine...</div>
    </div>
  ),
});

export default function GamePage() {
  return (
    <main className="w-full h-screen bg-black overflow-hidden">
      <SceneWrapper />
    </main>
  );
}
