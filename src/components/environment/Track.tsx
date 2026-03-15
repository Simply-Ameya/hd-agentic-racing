"use client";
import { useMemo } from "react";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";
import { useGameStore } from "@/store/gameStore";

function buildTrackShape(
  waypoints: { x: number; z: number }[],
  trackWidth: number,
): THREE.Shape {
  const left: THREE.Vector2[] = [];
  const right: THREE.Vector2[] = [];

  for (let i = 0; i < waypoints.length - 1; i++) {
    const curr = waypoints[i];
    const next = waypoints[i + 1];

    const dx = next.x - curr.x;
    const dz = next.z - curr.z;
    const len = Math.sqrt(dx * dx + dz * dz);
    const nx = (-dz / len) * (trackWidth / 2);
    const nz = (dx / len) * (trackWidth / 2);

    left.push(new THREE.Vector2(curr.x + nx, curr.z + nz));
    right.push(new THREE.Vector2(curr.x - nx, curr.z - nz));
  }

  const shape = new THREE.Shape();
  shape.moveTo(left[0].x, left[0].y);
  left.forEach((p) => shape.lineTo(p.x, p.y));
  right.reverse().forEach((p) => shape.lineTo(p.x, p.y));
  shape.closePath();
  return shape;
}

function TrackSurface() {
  const { trackData } = useGameStore();

  const geometry = useMemo(() => {
    if (!trackData?.waypoints?.length) return null;

    const shape = buildTrackShape(trackData.waypoints, trackData.trackWidth);
    const geo = new THREE.ShapeGeometry(shape);

    // Rotate flat on the ground (XZ plane)
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [trackData]);

  if (!geometry) return null;

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial color="#222222" roughness={0.8} metalness={0.1} />
      </mesh>
    </RigidBody>
  );
}

function TrackBorders() {
  const { trackData } = useGameStore();

  if (!trackData?.waypoints?.length) return null;

  return (
    <>
      {trackData.waypoints.slice(0, -1).map((wp, i) => (
        <mesh key={i} position={[wp.x, 0.5, wp.z]} castShadow>
          <boxGeometry args={[2, 1, 2]} />
          <meshStandardMaterial color="#ff4400" />
        </mesh>
      ))}
    </>
  );
}

function TrackObstacles() {
  const { trackData } = useGameStore();

  if (!trackData?.obstacles?.length) return null;

  return (
    <>
      {trackData.obstacles.map((obs, i) => {
        const color =
          obs.type === "barrier"
            ? "#ff0000"
            : obs.type === "oil"
              ? "#111111"
              : obs.type === "debris"
                ? "#888800"
                : "#00ff00";

        const size: [number, number, number] =
          obs.type === "barrier"
            ? [2, 1.5, 0.5]
            : obs.type === "ramp"
              ? [4, 0.5, 6]
              : [1, 1, 1];

        return (
          <RigidBody key={i} type="fixed" colliders="cuboid">
            <mesh
              position={[obs.position.x, obs.position.y + 0.5, obs.position.z]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={size} />
              <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
          </RigidBody>
        );
      })}
    </>
  );
}

function GroundPlane() {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#1a1a1a" roughness={1} />
      </mesh>
    </RigidBody>
  );
}

export default function Track() {
  return (
    <>
      <GroundPlane />
      <TrackSurface />
      <TrackBorders />
      <TrackObstacles />
    </>
  );
}
