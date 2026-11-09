import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { netEvents, remotes, useNet, type RemotePlayer } from "./net";
import { runtime } from "./store";
import { sound } from "./sound";

const EYE = 1.65;
const EASE = 12;
const HEARING_M = 40;

/** Other visitors in the lobby. They are outside runtime.world, so bullets pass through them. */
export function RemotePlayers() {
  const ids = useNet((s) => s.playerIds);
  const rev = useNet((s) => s.profileRev);

  useEffect(() => {
    const from = new THREE.Vector3();
    const to = new THREE.Vector3();
    netEvents.onShot = (p, hit) => {
      from.set(p.x, p.y + EYE - 0.2, p.z);
      to.set(hit.x, hit.y, hit.z);
      runtime.spawnTracer?.(from, to);
      const d = Math.hypot(p.x - runtime.player.x, p.z - runtime.player.z);
      if (d < HEARING_M) sound.shoot(0.45 * (1 - d / HEARING_M));
    };
    return () => {
      netEvents.onShot = null;
    };
  }, []);

  return (
    <group>
      {ids.map((id) => {
        const p = remotes.get(id);
        return p ? <Avatar key={`${id}:${rev}`} player={p} /> : null;
      })}
    </group>
  );
}

function nameplate(name: string, color: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 112;
  const g = c.getContext("2d")!;
  g.fillStyle = "rgba(11,17,24,0.78)";
  g.fillRect(0, 16, 512, 80);
  g.fillStyle = color;
  g.fillRect(0, 16, 10, 80);
  g.fillStyle = "#ece8e1";
  g.font = '64px "Bebas Neue", Impact, sans-serif';
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(name.toUpperCase(), 261, 60);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Avatar({ player }: { player: RemotePlayer }) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const plate = useMemo(() => nameplate(player.name, player.color), [player.name, player.color]);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: player.color, roughness: 0.45, metalness: 0.2 }), [player.color]);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1b232c", roughness: 0.6 }), []);
  const glow = useMemo(() => new THREE.MeshStandardMaterial({ color: player.color, emissive: player.color, emissiveIntensity: 2 }), [player.color]);

  useEffect(
    () => () => {
      plate.dispose();
      mat.dispose();
      glow.dispose();
    },
    [plate, mat, glow],
  );

  useFrame((_, dt) => {
    const r = root.current;
    if (!r) return;
    const k = 1 - Math.exp(-EASE * dt);
    r.position.x += (player.x - r.position.x) * k;
    r.position.y += (player.y - r.position.y) * k;
    r.position.z += (player.z - r.position.z) * k;
    // Shortest way round, so turning past ±π doesn't spin the avatar.
    let dy = player.yaw - r.rotation.y;
    dy = Math.atan2(Math.sin(dy), Math.cos(dy));
    r.rotation.y += dy * k;
    if (head.current) head.current.rotation.x += (player.pitch - head.current.rotation.x) * k;
  });

  return (
    <group ref={root} position={[player.x, player.y, player.z]} rotation-y={player.yaw}>
      <mesh position-y={0.8} material={mat}>
        <capsuleGeometry args={[0.3, 0.8, 6, 12]} />
      </mesh>
      <mesh position={[0, 1.22, 0]} material={dark}>
        <boxGeometry args={[0.78, 0.16, 0.3]} />
      </mesh>
      <group ref={head} position-y={1.58}>
        <mesh material={mat}>
          <sphereGeometry args={[0.19, 16, 12]} />
        </mesh>
        <mesh position={[0, 0.02, -0.16]} material={glow}>
          <boxGeometry args={[0.26, 0.06, 0.06]} />
        </mesh>
      </group>
      {/* rifle held at the hip, pointing where they look (-z) */}
      <mesh position={[0.24, 1.1, -0.38]} material={dark}>
        <boxGeometry args={[0.07, 0.1, 0.7]} />
      </mesh>
      <sprite position-y={2.15} scale={[1.3, 0.285, 1]}>
        <spriteMaterial map={plate} transparent depthWrite={false} toneMapped={false} />
      </sprite>
    </group>
  );
}
