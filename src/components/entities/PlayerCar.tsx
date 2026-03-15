"use client";
import { useRef } from "react";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useGameStore } from "@/store/gameStore";
import { CarControls } from "@/types/car.types";

const SPEED = 40;
const TURN_SPEED = 1.8;
const BRAKE_FORCE = 0.9;
const MAX_SPEED = 80;

interface PlayerCarProps {
  externalControls?: CarControls | null;
}

function CarModel() {
  return (
    <group>
      {/* Main body — low and wide */}
      <mesh castShadow position={[0, 0.22, 0]}>
        <boxGeometry args={[2, 0.35, 4.2]} />
        <meshPhysicalMaterial
          color="#cc0000"
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

      {/* Cabin / cockpit */}
      <mesh castShadow position={[0, 0.58, 0.2]}>
        <boxGeometry args={[1.5, 0.38, 1.8]} />
        <meshPhysicalMaterial
          color="#cc0000"
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
          metalness={0.1}
          roughness={0}
          clearcoat={1}
        />
      </mesh>

      {/* Rear windshield */}
      <mesh position={[0, 0.58, 1.12]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[1.45, 0.38, 0.05]} />
        <meshPhysicalMaterial
          color="#88ccff"
          transparent
          opacity={0.4}
          metalness={0.1}
          roughness={0}
          clearcoat={1}
        />
      </mesh>

      {/* Hood */}
      <mesh castShadow position={[0, 0.32, -1.6]} rotation={[-0.08, 0, 0]}>
        <boxGeometry args={[1.9, 0.1, 1.4]} />
        <meshPhysicalMaterial
          color="#cc0000"
          clearcoat={1}
          clearcoatRoughness={0.05}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Trunk */}
      <mesh castShadow position={[0, 0.32, 1.6]} rotation={[0.05, 0, 0]}>
        <boxGeometry args={[1.9, 0.1, 1.2]} />
        <meshPhysicalMaterial
          color="#cc0000"
          clearcoat={1}
          clearcoatRoughness={0.05}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Spoiler */}
      <mesh castShadow position={[0, 0.62, 1.9]}>
        <boxGeometry args={[1.6, 0.08, 0.35]} />
        <meshPhysicalMaterial color="#111111" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh castShadow position={[-0.7, 0.45, 1.9]}>
        <boxGeometry args={[0.06, 0.3, 0.1]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh castShadow position={[0.7, 0.45, 1.9]}>
        <boxGeometry args={[0.06, 0.3, 0.1]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* Front bumper */}
      <mesh castShadow position={[0, 0.1, -2.1]}>
        <boxGeometry args={[1.9, 0.2, 0.15]} />
        <meshStandardMaterial color="#111111" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Rear bumper */}
      <mesh castShadow position={[0, 0.1, 2.1]}>
        <boxGeometry args={[1.9, 0.2, 0.15]} />
        <meshStandardMaterial color="#111111" metalness={0.7} roughness={0.3} />
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

      {/* Wheels — front left, front right, rear left, rear right */}
      {(
        [
          [-1.1, 0, -1.3],
          [1.1, 0, -1.3],
          [-1.1, 0, 1.3],
          [1.1, 0, 1.3],
        ] as [number, number, number][]
      ).map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          {/* Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.38, 0.38, 0.28, 24]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
          </mesh>
          {/* Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.3, 12]} />
            <meshStandardMaterial
              color="#cccccc"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          {/* Rim spokes */}
          {[0, 1, 2, 3, 4].map((j) => (
            <mesh key={j} rotation={[j * (Math.PI / 5), 0, Math.PI / 2]}>
              <boxGeometry args={[0.04, 0.32, 0.04]} />
              <meshStandardMaterial color="#aaaaaa" metalness={0.9} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Headlight beams */}
      <pointLight
        position={[-0.6, 0.3, -2.2]}
        intensity={3}
        color="#ffffff"
        distance={20}
      />
      <pointLight
        position={[0.6, 0.3, -2.2]}
        intensity={3}
        color="#ffffff"
        distance={20}
      />
    </group>
  );
}

export default function PlayerCar({ externalControls }: PlayerCarProps) {
  const body = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Group>(null);
  const { updatePlayerCar, phase } = useGameStore();
  const rotation = useRef(0);
  const currentSpeed = useRef(0);

  const [, getKeys] = useKeyboardControls();

  useFrame((state, delta) => {
    if (!body.current || phase !== "playing") return;

    const keys = getKeys();
    const controls = {
      forward: keys.forward || externalControls?.forward || false,
      backward: keys.backward || externalControls?.backward || false,
      left: keys.left || externalControls?.left || false,
      right: keys.right || externalControls?.right || false,
      brake: keys.brake || externalControls?.brake || false,
    };

    const vel = body.current.linvel();
    const speed = Math.sqrt(vel.x * vel.x + vel.z * vel.z);

    // Steering
    if (controls.left) rotation.current += TURN_SPEED * delta;
    if (controls.right) rotation.current -= TURN_SPEED * delta;

    // Acceleration
    if (controls.forward) {
      currentSpeed.current = Math.min(
        currentSpeed.current + SPEED * delta,
        MAX_SPEED,
      );
    } else if (controls.backward) {
      currentSpeed.current = Math.max(
        currentSpeed.current - SPEED * delta,
        -MAX_SPEED / 2,
      );
    } else if (controls.brake) {
      currentSpeed.current *= BRAKE_FORCE;
    } else {
      currentSpeed.current *= 0.97;
    }

    // Apply velocity
    const vx = Math.sin(rotation.current) * currentSpeed.current;
    const vz = Math.cos(rotation.current) * currentSpeed.current;
    body.current.setLinvel({ x: vx, y: vel.y, z: vz }, true);

    // Rotate mesh to face direction
    if (meshRef.current) {
      meshRef.current.rotation.y = rotation.current;
    }

    // Smooth camera follow
    const pos = body.current.translation();
    const camX = pos.x - Math.sin(rotation.current) * 8;
    const camZ = pos.z - Math.cos(rotation.current) * 8;
    state.camera.position.lerp(new THREE.Vector3(camX, pos.y + 3, camZ), 0.1);
    state.camera.lookAt(pos.x, pos.y + 0.5, pos.z);

    // Update store
    updatePlayerCar({
      speed: Math.round(speed * 3.6),
      position: { x: pos.x, y: pos.y, z: pos.z },
      gear: Math.max(1, Math.min(6, Math.ceil(speed / 10))),
    });
  });

  return (
    <RigidBody
      ref={body}
      position={[0, 1, 0]}
      colliders="cuboid"
      mass={1}
      linearDamping={0.5}
      angularDamping={1}
      enabledRotations={[false, false, false]}
    >
      <group ref={meshRef}>
        <CarModel />
      </group>
    </RigidBody>
  );
}
