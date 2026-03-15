export interface CarControls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
}

export interface CarState {
  speed: number;
  rpm: number;
  gear: number;
  position: { x: number; y: number; z: number };
  lap: number;
  racePosition: number;
}
