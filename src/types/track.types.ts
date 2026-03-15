export interface Waypoint {
  x: number;
  z: number;
}

export interface TrackObstacle {
  type: "barrier" | "oil" | "debris" | "ramp";
  position: { x: number; y: number; z: number };
}

export interface TrackData {
  name: string;
  biome: "city" | "desert" | "forest" | "snow" | "volcano";
  weather: "clear" | "rain" | "storm" | "fog" | "snow";
  laps: number;
  waypoints: Waypoint[];
  obstacles: TrackObstacle[];
  trackWidth: number;
}
