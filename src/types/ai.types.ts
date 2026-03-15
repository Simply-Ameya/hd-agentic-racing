export interface EnemyDecision {
  enemyId: string;
  aggression: number; // 0-1
  targetWaypoint: number;
  attemptOvertake: boolean;
  blocking: boolean;
}

export interface GameMasterEvent {
  type: "weather" | "hazard" | "shortcut" | "commentary";
  value: string;
  commentary: string;
}

export interface AIState {
  trackData: import("./track.types").TrackData | null;
  enemyDecisions: EnemyDecision[];
  lastEvent: GameMasterEvent | null;
  commentary: string;
}
