import { NextResponse } from "next/server";
import { proModel, generateJSON } from "@/lib/gemini";
import { worldGenPrompt } from "@/lib/prompts/worldGenPrompt";
import { TrackData } from "@/types/track.types";

export async function POST(req: Request) {
  try {
    const { seed } = await req.json();
    const prompt = worldGenPrompt(seed ?? Math.floor(Math.random() * 9999));

    console.log("🌍 Generating world with seed:", seed);
    console.log("📤 Prompt:", prompt);

    const data = await generateJSON<TrackData>(proModel, prompt);

    console.log("📥 Gemini response:", JSON.stringify(data, null, 2));

    if (!data) {
      return NextResponse.json(
        { error: "Failed to generate world" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ World gen error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    );
  }
}
