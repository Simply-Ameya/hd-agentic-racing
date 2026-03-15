export function worldGenPrompt(seed: number): string {
  return `
You are an AI world generator for a 3D racing game.
Generate a unique race track based on seed: ${seed}.

Return ONLY a valid JSON object with this exact structure, no explanation:
{
  "name": "track name",
  "biome": "city" | "desert" | "forest" | "snow" | "volcano",
  "weather": "clear" | "rain" | "storm" | "fog" | "snow",
  "laps": 3,
  "trackWidth": 12,
  "waypoints": [
    { "x": 0, "z": 0 },
    { "x": 20, "z": -40 },
    { "x": 60, "z": -60 },
    { "x": 100, "z": -20 },
    { "x": 100, "z": 40 },
    { "x": 60, "z": 80 },
    { "x": 20, "z": 60 },
    { "x": 0, "z": 0 }
  ],
  "obstacles": [
    {
      "type": "barrier" | "oil" | "debris" | "ramp",
      "position": { "x": 50, "y": 0, "z": -50 }
    }
  ]
}

Rules:
- Generate exactly 8 to 12 waypoints forming a closed loop
- First and last waypoint must be the same (closed loop)
- Waypoints should be spread across a 200x200 unit area
- Add 3 to 6 obstacles at varied positions along the track
- Make the track name creative and match the biome
- Vary the layout each time based on the seed number
`;
}
