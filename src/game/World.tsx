import { Component, useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { CERTS, EXPERIENCE, formatTenure, PROFILE, PROJECTS, SKILL_LOADOUT } from "./data";
import {
  ARSENAL_Z,
  BOT_ROW_Z,
  CRATES,
  GALLERY_RAIL_Z,
  HOLOGRAM,
  ROOM,
  SPAWN,
  TERMINAL,
  TROPHY_X,
  TROPHY_Z,
} from "./layout";
import { COLORS, floorTexture, labelTexture, radialTexture, statBoardTexture, wallTexture } from "./textures";
import { getAgentTheme as T } from "./theme";
import { useCodingStats } from "./stats";
import { game, pushKill, runtime, type BotHandle } from "./store";
import { sound } from "./sound";
import { GunModel } from "./Gun";

const interact = (station: string, label: string, item?: number) => ({ interact: { station, label, item } });

export function World() {
  const ref = useRef<THREE.Group>(null);
  useEffect(() => {
    runtime.world = ref.current;
    return () => {
      runtime.world = null;
    };
  }, []);

  return (
    <group ref={ref}>
      <Room />
      <Safe>
        <Gallery />
      </Safe>
      <Arsenal />
      <Trophies />
      <Safe>
        <Hologram />
      </Safe>
      <Terminal />
      <Crates />
      <CareerBoard />
      <RankedBoard />
      {[-12, -7.2, -2.4, 2.4, 7.2, 12].map((x, i) => (
        <Bot key={i} id={i + 1} x={x} z={BOT_ROW_Z - (i % 2) * 1.6} speed={0.6 + (i % 3) * 0.35} amp={1.3 + (i % 2) * 0.6} phase={i * 1.7} />
      ))}
    </group>
  );
}

/** A missing image should cost one prop, not the whole scene. */
class Safe extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("Lobby prop failed to load", error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <hemisphereLight args={["#dfe6ee", "#2a3644", 1.2]} />
      <directionalLight position={[6, 14, 8]} intensity={1.1} />
      <pointLight position={[0, 6, -15]} color={T().accent} intensity={60} distance={22} decay={1.6} />
      <pointLight position={[HOLOGRAM.x, 3, HOLOGRAM.z]} color={T().alt} intensity={35} distance={12} decay={1.6} />
      <pointLight position={[18, 5, 0]} color={COLORS.gold} intensity={30} distance={16} decay={1.6} />
      <pointLight position={[-18, 5, 0]} color="#9fb4ff" intensity={25} distance={16} decay={1.6} />
      <pointLight position={[0, 6, 12]} color="#ffffff" intensity={25} distance={18} decay={1.6} />
    </>
  );
}

function Room() {
  const floor = useMemo(floorTexture, []);
  const walls = useMemo(() => {
    const longT = wallTexture();
    longT.repeat.set(ROOM.halfX / 4, 1);
    const shortT = wallTexture();
    shortT.repeat.set(ROOM.halfZ / 4, 1);
    return { longT, shortT };
  }, []);
  const spawnSign = useMemo(() => labelTexture({ title: "SM-HQ // Range", kicker: "Lobby", subtitle: "WASD move · Shift walk · Space jump · Click fire · R reload · E interact", width: 1600, height: 256 }), []);
  const { halfX, halfZ, height } = ROOM;
  const stripMat = useMemo(() => new THREE.MeshStandardMaterial({ color: T().accent, emissive: T().accent, emissiveIntensity: 2.2 }), []);
  const lightMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#fff", emissive: "#e9f3ff", emissiveIntensity: 1.6 }), []);

  return (
    <group>
      <Lights />
      <mesh rotation-x={-Math.PI / 2} userData={{ surface: "floor" }}>
        <planeGeometry args={[halfX * 2, halfZ * 2]} />
        <meshStandardMaterial map={floor} roughness={0.85} metalness={0.05} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position-y={height}>
        <planeGeometry args={[halfX * 2, halfZ * 2]} />
        <meshStandardMaterial color="#10171e" roughness={1} />
      </mesh>
      {/* back / front */}
      <mesh position={[0, height / 2, -halfZ]}>
        <planeGeometry args={[halfX * 2, height]} />
        <meshStandardMaterial map={walls.longT} roughness={0.9} />
      </mesh>
      <mesh position={[0, height / 2, halfZ]} rotation-y={Math.PI}>
        <planeGeometry args={[halfX * 2, height]} />
        <meshStandardMaterial map={walls.longT} roughness={0.9} />
      </mesh>
      {/* left / right */}
      <mesh position={[-halfX, height / 2, 0]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[halfZ * 2, height]} />
        <meshStandardMaterial map={walls.shortT} roughness={0.9} />
      </mesh>
      <mesh position={[halfX, height / 2, 0]} rotation-y={-Math.PI / 2}>
        <planeGeometry args={[halfZ * 2, height]} />
        <meshStandardMaterial map={walls.shortT} roughness={0.9} />
      </mesh>

      {/* glowing base strips */}
      <mesh position={[0, 0.06, -halfZ + 0.02]} material={stripMat}>
        <boxGeometry args={[halfX * 2, 0.08, 0.04]} />
      </mesh>
      <mesh position={[0, 0.06, halfZ - 0.02]} material={stripMat}>
        <boxGeometry args={[halfX * 2, 0.08, 0.04]} />
      </mesh>
      <mesh position={[-halfX + 0.02, 0.06, 0]} material={stripMat}>
        <boxGeometry args={[0.04, 0.08, halfZ * 2]} />
      </mesh>
      <mesh position={[halfX - 0.02, 0.06, 0]} material={stripMat}>
        <boxGeometry args={[0.04, 0.08, halfZ * 2]} />
      </mesh>

      {/* ceiling light bars */}
      {[-12, -4, 4, 12].map((z) =>
        [-10, 0, 10].map((x) => (
          <mesh key={`${x}${z}`} position={[x, height - 0.05, z]} material={lightMat}>
            <boxGeometry args={[5, 0.08, 0.35]} />
          </mesh>
        )),
      )}

      {/* corner pillars */}
      {[
        [-halfX + 0.6, -halfZ + 0.6],
        [halfX - 0.6, -halfZ + 0.6],
        [-halfX + 0.6, halfZ - 0.6],
        [halfX - 0.6, halfZ - 0.6],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, height / 2, z]}>
          <boxGeometry args={[1.2, height, 1.2]} />
          <meshStandardMaterial color="#1c2733" roughness={0.6} metalness={0.3} />
        </mesh>
      ))}

      {/* range floor markings */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.012, BOT_ROW_Z + 3.4]} userData={{ surface: "floor" }}>
        <planeGeometry args={[30, 0.18]} />
        <meshBasicMaterial color={T().accent} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.012, BOT_ROW_Z - 3.2]} userData={{ surface: "floor" }}>
        <planeGeometry args={[30, 0.18]} />
        <meshBasicMaterial color={T().accent} />
      </mesh>

      {/* spawn pad + sign on the front wall */}
      <mesh rotation-x={-Math.PI / 2} position={[SPAWN.x, 0.011, SPAWN.z]} userData={{ surface: "floor" }}>
        <ringGeometry args={[1.4, 1.6, 6]} />
        <meshBasicMaterial color={T().alt} />
      </mesh>
      <mesh position={[0, 4.4, halfZ - 0.03]} rotation-y={Math.PI} userData={{ noDecal: true }}>
        <planeGeometry args={[12, 1.92]} />
        <meshBasicMaterial map={spawnSign} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Gallery() {
  const textures = useLoader(THREE.TextureLoader, PROJECTS.map((p) => p.image));
  const sign = useMemo(() => labelTexture({ title: "Projects", kicker: "Gallery", subtitle: "Aim at a frame · press E", accent: T().accent }), []);
  const plaques = useMemo(
    () => PROJECTS.map((p) => labelTexture({ title: p.title, subtitle: p.category, width: 768, height: 192, accent: T().accent })),
    [],
  );
  useMemo(() => textures.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace)), [textures]);

  const z = -ROOM.halfZ + 0.12;
  return (
    <group>
      <mesh position={[0, 7.2, z]} userData={{ noDecal: true, ...interact("projects", "Projects") }}>
        <planeGeometry args={[10, 2.5]} />
        <meshBasicMaterial map={sign} toneMapped={false} />
      </mesh>
      {PROJECTS.map((p, i) => {
        const x = (i - 4) * 3.9;
        return (
          <group key={p.title} position={[x, 0, z]}>
            <mesh position={[0, 3.4, 0.02]} userData={{ noDecal: true, ...interact("projects", p.title, i) }}>
              <planeGeometry args={[3.4, 2.05]} />
              <meshBasicMaterial map={textures[i]} toneMapped={false} />
            </mesh>
            <mesh position={[0, 3.4, -0.02]}>
              <boxGeometry args={[3.6, 2.25, 0.08]} />
              <meshStandardMaterial color="#0f1923" metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[-1.8, 3.4, 0.04]}>
              <boxGeometry args={[0.05, 2.25, 0.04]} />
              <meshStandardMaterial color={T().accent} emissive={T().accent} emissiveIntensity={2} />
            </mesh>
            <mesh position={[0, 1.95, 0.03]} userData={{ noDecal: true, ...interact("projects", p.title, i) }}>
              <planeGeometry args={[2.4, 0.6]} />
              <meshBasicMaterial map={plaques[i]} toneMapped={false} />
            </mesh>
          </group>
        );
      })}
      {/* waist-high rail keeps players a step back from the art */}
      <mesh position={[0, 1.0, GALLERY_RAIL_Z]}>
        <boxGeometry args={[35, 0.08, 0.08]} />
        <meshStandardMaterial color={COLORS.bone} metalness={0.5} roughness={0.3} />
      </mesh>
      {[-17.5, -10.5, -3.5, 3.5, 10.5, 17.5].map((x) => (
        <mesh key={x} position={[x, 0.5, GALLERY_RAIL_Z]}>
          <boxGeometry args={[0.12, 1, 0.12]} />
          <meshStandardMaterial color="#2a3542" metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function Arsenal() {
  const sign = useMemo(() => labelTexture({ title: "Arsenal", kicker: "Skills loadout", subtitle: "Aim at a weapon · press E", accent: "#7f9cff" }), []);
  const plates = useMemo(
    () => SKILL_LOADOUT.map((s) => labelTexture({ title: s.weapon, kicker: s.title, subtitle: s.skills.slice(0, 4).join(" · "), width: 768, height: 256, accent: "#7f9cff" })),
    [],
  );
  const x = -ROOM.halfX + 0.1;
  return (
    <group>
      <mesh position={[x, 7, 0]} rotation-y={Math.PI / 2} userData={{ noDecal: true, ...interact("arsenal", "Arsenal") }}>
        <planeGeometry args={[10, 2.5]} />
        <meshBasicMaterial map={sign} toneMapped={false} />
      </mesh>
      {/* long weapon table */}
      <mesh position={[-ROOM.halfX + 0.55, 0.5, 0]}>
        <boxGeometry args={[1.1, 1, 22]} />
        <meshStandardMaterial color="#1b2530" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[-ROOM.halfX + 1.1, 1.0, 0]}>
        <boxGeometry args={[0.02, 0.04, 22]} />
        <meshStandardMaterial color="#7f9cff" emissive="#7f9cff" emissiveIntensity={2} />
      </mesh>
      {SKILL_LOADOUT.map((s, i) => {
        const z = ARSENAL_Z[i];
        return (
          <group key={s.title}>
            <mesh position={[x, 3.4, z]} rotation-y={Math.PI / 2} userData={{ noDecal: true, ...interact("arsenal", `${s.weapon} · ${s.title}`, i) }}>
              <planeGeometry args={[3.2, 1.07]} />
              <meshBasicMaterial map={plates[i]} toneMapped={false} />
            </mesh>
            <group position={[-ROOM.halfX + 0.55, 1.22, z]} rotation-y={Math.PI / 2} scale={2.4} userData={interact("arsenal", `${s.weapon} · ${s.title}`, i)}>
              <GunModel accent={i % 2 ? T().alt : T().accent} />
            </group>
          </group>
        );
      })}
    </group>
  );
}

function Trophies() {
  const sign = useMemo(() => labelTexture({ title: "Trophies", kicker: "Certificates", subtitle: "Aim at a trophy · press E", accent: COLORS.gold }), []);
  const plates = useMemo(
    () => CERTS.map((c) => labelTexture({ title: c.badge, kicker: c.date, subtitle: c.title, width: 1024, height: 256, accent: COLORS.gold })),
    [],
  );
  const spinners = useRef<THREE.Mesh[]>([]);
  useFrame((_, dt) => spinners.current.forEach((m, i) => m && (m.rotation.y += dt * (0.8 + i * 0.1))));

  const x = ROOM.halfX - 0.1;
  return (
    <group>
      <mesh position={[x, 7, 0]} rotation-y={-Math.PI / 2} userData={{ noDecal: true, ...interact("trophies", "Trophies") }}>
        <planeGeometry args={[10, 2.5]} />
        <meshBasicMaterial map={sign} toneMapped={false} />
      </mesh>
      {CERTS.map((c, i) => {
        const z = TROPHY_Z[i];
        const color = c.featured ? COLORS.gold : i % 2 ? T().alt : T().accent;
        return (
          <group key={c.title}>
            <mesh position={[x, 3.6, z]} rotation-y={-Math.PI / 2} userData={{ noDecal: true, ...interact("trophies", c.title, i) }}>
              <planeGeometry args={[3.4, 0.85]} />
              <meshBasicMaterial map={plates[i]} toneMapped={false} />
            </mesh>
            <mesh position={[TROPHY_X, 0.55, z]}>
              <cylinderGeometry args={[0.55, 0.7, 1.1, 6]} />
              <meshStandardMaterial color="#1b2530" metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh position={[TROPHY_X, 1.12, z]}>
              <cylinderGeometry args={[0.56, 0.56, 0.04, 6]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} />
            </mesh>
            <mesh
              ref={(m) => (spinners.current[i] = m)}
              position={[TROPHY_X, 1.85, z]}
              scale={c.featured ? 1.3 : 1}
              userData={interact("trophies", c.title, i)}
            >
              <octahedronGeometry args={[0.38, 0]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} metalness={0.8} roughness={0.2} flatShading />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Hologram() {
  const portrait = useLoader(THREE.TextureLoader, "/profile.jpeg");
  const tag = useMemo(() => labelTexture({ title: PROFILE.name, kicker: `Agent · ${PROFILE.agentClass}`, subtitle: `${PROFILE.role} · press E`, accent: T().alt, width: 1024, height: 256, align: "center" }), []);
  const glow = useMemo(() => radialTexture("rgba(60,242,196,0.6)"), []);
  const spin = useRef<THREE.Group>(null);
  const face = useRef<THREE.Group>(null);
  const { camera } = useThree();
  useMemo(() => (portrait.colorSpace = THREE.SRGBColorSpace), [portrait]);

  useFrame(({ clock }, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 0.5;
    if (face.current) {
      // Billboard on the vertical axis only, so the portrait never tilts.
      face.current.rotation.y = Math.atan2(camera.position.x - HOLOGRAM.x, camera.position.z - HOLOGRAM.z);
      face.current.position.y = 3.1 + Math.sin(clock.elapsedTime * 1.4) * 0.08;
    }
  });

  return (
    <group position={[HOLOGRAM.x, 0, HOLOGRAM.z]}>
      <mesh position-y={0.15}>
        <cylinderGeometry args={[2.4, 2.6, 0.3, 6]} />
        <meshStandardMaterial color="#141d27" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position-y={0.31} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[1.8, 2.1, 6]} />
        <meshBasicMaterial color={T().alt} />
      </mesh>
      <mesh position-y={0.32} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[2.2, 32]} />
        <meshBasicMaterial map={glow} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <group ref={spin}>
        <mesh position-y={3.1}>
          <icosahedronGeometry args={[1.7, 1]} />
          <meshBasicMaterial color={T().alt} wireframe transparent opacity={0.35} />
        </mesh>
      </group>
      <group ref={face}>
        <mesh position-y={0}>
          <planeGeometry args={[1.62, 2.0]} />
          <meshBasicMaterial map={portrait} transparent opacity={0.92} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh position-y={-1.45}>
          <planeGeometry args={[2.8, 0.7]} />
          <meshBasicMaterial map={tag} transparent toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      </group>
      {/* Invisible volume so the whole hologram is easy to target; bullets pass through it. */}
      <mesh position-y={2.2} visible={false} userData={{ passThrough: true, ...interact("profile", `Agent profile · ${PROFILE.name}`) }}>
        <cylinderGeometry args={[2.4, 2.4, 4.4, 8]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}

function Terminal() {
  const screen = useMemo(
    () => labelTexture({ title: "Comms", kicker: "Contact terminal", subtitle: "Email · Phone · Socials · Resume", accent: T().alt, width: 1024, height: 576 }),
    [],
  );
  const scr = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(({ clock }) => {
    if (scr.current) scr.current.opacity = 0.88 + Math.sin(clock.elapsedTime * 9) * 0.04;
  });
  return (
    <group position={[TERMINAL.x, 0, TERMINAL.z]} rotation-y={0.35}>
      <mesh position-y={0.5}>
        <boxGeometry args={[2.4, 1, 1.0]} />
        <meshStandardMaterial color="#1b2530" metalness={0.5} roughness={0.45} />
      </mesh>
      <mesh position={[0, 1.02, 0.5]}>
        <boxGeometry args={[2.4, 0.04, 0.04]} />
        <meshStandardMaterial color={T().alt} emissive={T().alt} emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 1.85, -0.2]} rotation-x={-0.12} userData={interact("comms", "Comms · contact & resume")}>
        <boxGeometry args={[2.1, 1.3, 0.1]} />
        <meshStandardMaterial color="#0b1118" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.85, -0.14]} rotation-x={-0.12} userData={{ noDecal: true, ...interact("comms", "Comms · contact & resume") }}>
        <planeGeometry args={[1.95, 1.1]} />
        <meshBasicMaterial ref={scr} map={screen} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

function Crates() {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#3a4651", roughness: 0.7, metalness: 0.2 }), []);
  const band = useMemo(() => new THREE.MeshStandardMaterial({ color: "#f2b632", roughness: 0.6 }), []);
  return (
    <group>
      {CRATES.map((c, i) => (
        <group key={i} position={[c.x, 0, c.z]}>
          <mesh position-y={c.h / 2} material={mat}>
            <boxGeometry args={[c.s, c.h, c.s]} />
          </mesh>
          <mesh position-y={c.h * 0.8} material={band}>
            <boxGeometry args={[c.s + 0.02, 0.1, c.s + 0.02]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Both boards hang on the front wall, behind the spawn point.
const FRONT_Z = ROOM.halfZ - 0.12;

function CareerBoard() {
  const job = EXPERIENCE[0];
  const tex = useMemo(
    () =>
      statBoardTexture({
        title: job ? `${job.role} · ${job.company}` : "Career",
        kicker: "Career · active mission",
        accent: T().accent,
        stats: job
          ? [
              { value: formatTenure(job.start, job.end).split(" · ")[1], label: "on the job" },
              { value: formatTenure(job.start, job.end).split(" – ")[0], label: "joined" },
              { value: job.end ? "Done" : "Active", label: "status" },
            ]
          : [],
        footer: "Press E to open the mission briefing",
      }),
    [job],
  );
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh position={[13, 3.4, FRONT_Z]} rotation-y={Math.PI} userData={{ noDecal: true, ...interact("career", job ? `${job.role} · ${job.company}` : "Career") }}>
      <planeGeometry args={[8, 3.5]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

function RankedBoard() {
  const s = useCodingStats();
  const tex = useMemo(
    () =>
      statBoardTexture({
        title: "Ranked",
        kicker: "Coding profiles",
        accent: T().accent,
        stats: [
          { value: String(s.leetcode.solved), label: "LeetCode" },
          { value: String(s.gfg.solved), label: "GFG" },
          { value: String(s.codechef.solved), label: "CodeChef" },
          { value: String(s.github.contributionsLastYear), label: "GitHub yr" },
        ],
        footer: "Problems solved & contributions · press E for the full board",
      }),
    [s.leetcode.solved, s.gfg.solved, s.codechef.solved, s.github.contributionsLastYear],
  );
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh position={[-13, 3.4, FRONT_Z]} rotation-y={Math.PI} userData={{ noDecal: true, ...interact("ranked", "Ranked · coding profiles") }}>
      <planeGeometry args={[8, 3.5]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

const BOT_RESPAWN_S = 2.2;

function Bot({ id, x, z, speed, amp, phase }: { id: number; x: number; z: number; speed: number; amp: number; phase: number }) {
  const root = useRef<THREE.Group>(null);
  const pivot = useRef<THREE.Group>(null);
  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: COLORS.bone, emissive: T().accent, emissiveIntensity: 0, roughness: 0.5 }), []);
  const st = useRef({ hp: 100, deadAt: 0, fall: 0, flash: 0 }).current;

  const handle = useMemo<BotHandle>(() => {
    const h: BotHandle = {
      name: `BOT_${String(id).padStart(2, "0")}`,
      alive: true,
      x,
      z,
      damage(amount, head) {
        if (!h.alive) return;
        st.hp -= amount;
        st.flash = 1;
        const killed = st.hp <= 0;
        game.set({ hitmarker: { at: performance.now(), kill: killed, head } });
        if (head) sound.headshot();
        else if (!killed) sound.hit();
        if (killed) {
          h.alive = false;
          st.deadAt = performance.now() / 1000;
          if (!head) sound.kill();
          pushKill(h.name, head);
        }
      },
    };
    return h;
  }, [id, x, z, st]);

  useEffect(() => {
    runtime.bots.set(id, handle);
    return () => {
      runtime.bots.delete(id);
    };
  }, [id, handle]);

  useFrame(({ clock }, dt) => {
    const now = performance.now() / 1000;
    if (handle.alive) {
      const cx = x + Math.sin(clock.elapsedTime * speed + phase) * amp;
      handle.x = cx;
      if (root.current) root.current.position.x = cx;
      st.fall = Math.max(0, st.fall - dt * 4);
    } else {
      st.fall = Math.min(1, st.fall + dt * 5);
      if (now - st.deadAt > BOT_RESPAWN_S) {
        st.hp = 100;
        handle.alive = true;
      }
    }
    st.flash = Math.max(0, st.flash - dt * 8);
    bodyMat.emissiveIntensity = st.flash * 1.5;
    if (pivot.current) pivot.current.rotation.x = -st.fall * (Math.PI / 2) * 0.95;
  });

  const tag = { botId: id };
  return (
    <group ref={root} position={[x, 0, z]}>
      <mesh rotation-x={-Math.PI / 2} position-y={0.015}>
        <circleGeometry args={[0.55, 24]} />
        <meshBasicMaterial color={T().accent} transparent opacity={0.35} />
      </mesh>
      <group ref={pivot}>
        <mesh position-y={0.82} material={bodyMat} userData={{ ...tag, part: "body" }}>
          <capsuleGeometry args={[0.3, 0.85, 6, 12]} />
        </mesh>
        <mesh position={[0, 1.25, 0]} material={bodyMat} userData={{ ...tag, part: "body" }}>
          <boxGeometry args={[0.85, 0.18, 0.32]} />
        </mesh>
        <mesh position-y={1.6} material={bodyMat} userData={{ ...tag, part: "head" }}>
          <sphereGeometry args={[0.19, 16, 12]} />
        </mesh>
        <mesh position={[0, 1.62, 0.15]} userData={{ ...tag, part: "head" }}>
          <boxGeometry args={[0.26, 0.07, 0.08]} />
          <meshStandardMaterial color="#ff7a2f" emissive="#ff7a2f" emissiveIntensity={1.8} />
        </mesh>
      </group>
    </group>
  );
}
