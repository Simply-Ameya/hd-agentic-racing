import { NextResponse } from "next/server";
import { flashModel, generateJSON } from "@/lib/gemini";
import { enemyAIPrompt } from "@/lib/prompts/enemyAIPrompt";
import { EnemyDecision } from "@/types/ai.types";

export async function POST(req: Request) {
  try {
    const { playerSpeed, playerLap, playerPosition, totalEnemies } =
      await req.json();

    const prompt = enemyAIPrompt(
      playerSpeed ?? 0,
      playerLap ?? 1,
      playerPosition ?? 1,
      totalEnemies ?? 3,
    );

    const data = await generateJSON<EnemyDecision[]>(flashModel, prompt);

    if (!data) {
      return NextResponse.json(
        { error: "Failed to generate enemy decisions" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Enemy AI error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
