export function gameMasterPrompt(
  event: string,
  playerLap: number,
  playerPosition: number,
  weather: string,
): string {
  return `
You are an AI Game Master for a 3D racing game.
A key event just happened:
- Event: ${event}
- Player lap: ${playerLap}
- Player position: ${playerPosition}
- Current weather: ${weather}

Return ONLY a valid JSON object, no explanation:
{
  "type": "weather" | "hazard" | "shortcut" | "commentary",
  "value": "storm",
  "commentary": "Whoa! The weather is turning nasty out there!"
}

Rules:
- type must be one of: weather, hazard, shortcut, commentary
- For weather: value must be "clear", "rain", "storm", "fog", or "snow"
- For hazard: value must be "oil", "debris", or "barrier"
- For shortcut: value must be "open" or "closed"
- For commentary: value must be "normal"
- commentary must be short, exciting, and match the event (max 12 words)
- Make decisions that keep the race exciting and fair
`;
}
