import { NextResponse } from "next/server";
import { flashModel, generateJSON } from "@/lib/gemini";
import { gameMasterPrompt } from "@/lib/prompts/gameMasterPrompt";
import { GameMasterEvent } from "@/types/ai.types";

export async function POST(req: Request) {
  try {
    const { event, playerLap, playerPosition, weather } = await req.json();

    const prompt = gameMasterPrompt(
      event ?? "race_start",
      playerLap ?? 1,
      playerPosition ?? 1,
      weather ?? "clear",
    );

    const data = await generateJSON<GameMasterEvent>(flashModel, prompt);

    if (!data) {
      return NextResponse.json(
        { error: "Failed to generate game master event" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Game master error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
