"use client";
import { useRef, useEffect } from "react";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAIStore } from "@/store/aiStore";
import { useGameStore } from "@/store/gameStore";

const ENEMY_COLORS = ["#0044ff", "#00aa00", "#aa00aa"];
const ENEMY_SPEED = 25;
const ENEMY_TURN_SPEED = 2.0;

interface EnemyCarProps {
  id: string;
  index: number;
  startPosition: [number, number, number];
}

function EnemyCarModel({ color }: { color: string }) {
  return (
    <group>
      {/* Main body */}
      <mesh castShadow position={[0, 0.22, 0]}>
        <boxGeometry args={[2, 0.35, 4.2]} />
        <meshPhysicalMaterial
          color={color}
          clearcoat={1}
          clearcoatRoughness={0.05}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Lower skirt */}
      <mesh castShadow position={[0, 0.08, 0]}>
        <boxGeometry args={[2.1, 0.15, 4]} />
        <meshPhysicalMaterial color="#111111" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Cabin */}
      <mesh castShadow position={[0, 0.58, 0.2]}>
        <boxGeometry args={[1.5, 0.38, 1.8]} />
        <meshPhysicalMaterial
          color={color}
          clearcoat={1}
          clearcoatRoughness={0.05}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.58, -0.72]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[1.45, 0.38, 0.05]} />
        <meshPhysicalMaterial
          color="#88ccff"
          transparent
          opacity={0.4}
          roughness={0}
          clearcoat={1}
        />
      </mesh>

      {/* Hood */}
      <mesh castShadow position={[0, 0.32, -1.6]} rotation={[-0.08, 0, 0]}>
        <boxGeometry args={[1.9, 0.1, 1.4]} />
        <meshPhysicalMaterial
          color={color}
          clearcoat={1}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Spoiler */}
      <mesh castShadow position={[0, 0.62, 1.9]}>
        <boxGeometry args={[1.6, 0.08, 0.35]} />
        <meshPhysicalMaterial color="#111111" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Headlights */}
      <mesh position={[-0.6, 0.25, -2.12]}>
        <boxGeometry args={[0.5, 0.15, 0.05]} />
        <meshStandardMaterial
          color="#ffffaa"
          emissive="#ffff44"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[0.6, 0.25, -2.12]}>
        <boxGeometry args={[0.5, 0.15, 0.05]} />
        <meshStandardMaterial
          color="#ffffaa"
          emissive="#ffff44"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Tail lights */}
      <mesh position={[-0.6, 0.25, 2.12]}>
        <boxGeometry args={[0.5, 0.15, 0.05]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[0.6, 0.25, 2.12]}>
        <boxGeometry args={[0.5, 0.15, 0.05]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Wheels */}
      {(
        [
          [-1.1, 0, -1.3],
          [1.1, 0, -1.3],
          [-1.1, 0, 1.3],
          [1.1, 0, 1.3],
        ] as [number, number, number][]
      ).map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.38, 0.38, 0.28, 24]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.3, 12]} />
            <meshStandardMaterial
              color="#cccccc"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function EnemyCar({ id, index, startPosition }: EnemyCarProps) {
  const body = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Group>(null);
  const rotation = useRef(0);
  const baseSpeed = ENEMY_SPEED * (0.8 + index * 0.1);
  const currentSpeed = useRef(baseSpeed);
  const waypointIndex = useRef(0);

  const { enemyDecisions } = useAIStore();
  const { trackData, phase } = useGameStore();
  const color = ENEMY_COLORS[index % ENEMY_COLORS.length];

  useFrame((_, delta) => {
    if (!body.current || phase !== "playing") return;

    const waypoints = trackData?.waypoints;
    if (!waypoints || waypoints.length < 2) return;

    // Get current target waypoint
    const target = waypoints[waypointIndex.current % waypoints.length];
    const pos = body.current.translation();

    // Direction to waypoint
    const dx = target.x - pos.x;
    const dz = target.z - pos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    // Advance to next waypoint when close enough
    if (dist < 8) {
      waypointIndex.current =
        (waypointIndex.current + 1) % (waypoints.length - 1);
    }

    // Steer toward waypoint
    const targetAngle = Math.atan2(dx, dz);
    let angleDiff = targetAngle - rotation.current;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    rotation.current +=
      Math.sign(angleDiff) *
      Math.min(Math.abs(angleDiff), ENEMY_TURN_SPEED * delta);

    // Apply AI decision if available
    const decision = enemyDecisions.find((d) => d.enemyId === id);
    const speedMultiplier = decision ? 0.7 + decision.aggression * 0.6 : 1.0;

    const speed = currentSpeed.current * speedMultiplier;
    const vx = Math.sin(rotation.current) * speed;
    const vz = Math.cos(rotation.current) * speed;

    const vel = body.current.linvel();
    body.current.setLinvel({ x: vx, y: vel.y, z: vz }, true);

    // Rotate mesh
    if (meshRef.current) {
      meshRef.current.rotation.y = rotation.current;
    }
  });

  return (
    <RigidBody
      ref={body}
      position={startPosition}
      colliders="cuboid"
      mass={1}
      linearDamping={0.5}
      angularDamping={1}
      enabledRotations={[false, false, false]}
    >
      <group ref={meshRef}>
        <EnemyCarModel color={color} />
      </group>
    </RigidBody>
  );
}
