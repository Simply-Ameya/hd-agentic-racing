export function enemyAIPrompt(
  playerSpeed: number,
  playerLap: number,
  playerPosition: number,
  totalEnemies: number,
): string {
  return `
You are an AI director for enemy racers in a 3D racing game.
Current race state:
- Player speed: ${playerSpeed} km/h
- Player lap: ${playerLap}
- Player race position: ${playerPosition}
- Total enemy racers: ${totalEnemies}

Return ONLY a valid JSON array with one decision per enemy, no explanation:
[
  {
    "enemyId": "enemy_0",
    "aggression": 0.7,
    "targetWaypoint": 3,
    "attemptOvertake": true,
    "blocking": false
  }
]

Rules:
- Generate exactly ${totalEnemies} enemy decisions
- enemyId must be "enemy_0", "enemy_1", etc.
- aggression is a float between 0.0 (passive) and 1.0 (aggressive)
- targetWaypoint is an integer between 0 and 7
- If player is winning easily, increase enemy aggression
- If player is far behind, reduce aggression for fairness
- attemptOvertake and blocking cannot both be true
`;
}
