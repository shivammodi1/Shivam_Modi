import { useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { STATIONS, type StationId } from "./data";
import { collide, SPAWN } from "./layout";
import { game, MAG_SIZE, openPanel, RESERVE_START, runtime, toggleMute } from "./store";
import { sound } from "./sound";
import { sendMove, sendShot } from "./net";

const EYE = 1.65;
const RUN_SPEED = 5.6;
const WALK_SPEED = 2.8;
const JUMP_SPEED = 6.2;
const GRAVITY = 18;
const RADIUS = 0.42;
const SENSITIVITY = 0.0021;
const FIRE_INTERVAL = 1 / 9.75; // Vandal fire rate
const BURST_GAP_S = 0.25;
const RELOAD_S = 1.9;
const BODY_DAMAGE = 40;
const HEAD_DAMAGE = 160;
const INTERACT_RANGE = 6;
const STRIDE_M = 2.1;

const raycaster = new THREE.Raycaster();
const tmpDir = new THREE.Vector3();
const tmpFrom = new THREE.Vector3();
const tmpTo = new THREE.Vector3();
const tmpNormal = new THREE.Vector3();

type Hit = THREE.Intersection<THREE.Object3D>;

function findUserData<T>(obj: THREE.Object3D | null, key: string): T | undefined {
  for (let o = obj; o; o = o.parent) if (o.userData[key] !== undefined) return o.userData[key] as T;
  return undefined;
}

function isLocked() {
  return !!runtime.canvas && document.pointerLockElement === runtime.canvas;
}

export function Player() {
  const { camera } = useThree();
  const keys = useRef(new Set<string>()).current;
  const s = useRef({
    x: SPAWN.x,
    z: SPAWN.z,
    y: 0,
    vx: 0,
    vz: 0,
    vy: 0,
    yaw: 0,
    pitch: 0,
    recoil: 0,
    grounded: true,
    stride: 0,
    nextShotAt: 0,
    firing: false,
    spray: 0,
    reloadEnd: 0,
    frame: 0,
  }).current;

  useLayoutEffect(() => {
    camera.rotation.order = "YXZ";
    camera.position.set(s.x, EYE, s.z);
  }, [camera, s]);

  const startReload = () => {
    const st = game.get();
    if (st.reloading || st.ammo === MAG_SIZE) return;
    game.set({ reloading: true });
    s.reloadEnd = performance.now() / 1000 + RELOAD_S;
    runtime.gun.reload = 0;
    sound.reload();
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isLocked()) return;
      // Some browsers emit a huge spike on the first event after locking.
      if (Math.abs(e.movementX) > 400 || Math.abs(e.movementY) > 400) return;
      s.yaw -= e.movementX * SENSITIVITY;
      s.pitch = Math.max(-1.45, Math.min(1.45, s.pitch - e.movementY * SENSITIVITY));
      runtime.gun.swayX = Math.max(-0.04, Math.min(0.04, runtime.gun.swayX + e.movementX * 0.00035));
      runtime.gun.swayY = Math.max(-0.03, Math.min(0.03, runtime.gun.swayY + e.movementY * 0.00025));
    };
    const onMouseDown = (e: MouseEvent) => {
      if (isLocked() && e.button === 0 && !game.get().chatOpen) s.firing = true;
    };
    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 0) s.firing = false;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyM") {
        toggleMute();
        return;
      }
      if (!isLocked() || game.get().chatOpen) return;
      if (e.code === "Space" || e.code === "Tab") e.preventDefault();
      if ((e.code === "Enter" || e.code === "KeyT") && !e.repeat) {
        e.preventDefault();
        keys.clear();
        s.firing = false;
        game.set({ chatOpen: true });
        return;
      }
      keys.add(e.code);
      if (e.repeat) return;
      if (e.code === "KeyR") startReload();
      if (e.code === "KeyE" || e.code === "KeyF") {
        const p = game.get().prompt;
        if (p) openPanel(p.station, p.item);
      }
      const digit = /^Digit([1-7])$/.exec(e.code);
      if (digit) openPanel(STATIONS[Number(digit[1]) - 1].id);
    };
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.code);
    const onLockChange = () => {
      const locked = isLocked();
      game.set(locked ? { locked } : { locked, chatOpen: false });
      if (!locked) {
        keys.clear();
        s.firing = false;
      }
    };
    const onBlur = () => {
      keys.clear();
      s.firing = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    document.addEventListener("pointerlockchange", onLockChange);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("pointerlockchange", onLockChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys, s]);

  const fire = (speed01: number) => {
    // Scheduled in real time so the fire rate holds on slow frames; a fresh burst starts from now.
    const now = performance.now() / 1000;
    s.nextShotAt = (now - s.nextShotAt > BURST_GAP_S ? now : s.nextShotAt) + FIRE_INTERVAL;
    s.spray += 1;
    game.set((st) => ({ ammo: st.ammo - 1, shots: st.shots + 1 }));
    sound.shoot();
    runtime.gun.kick = 1;
    runtime.gun.flash = 1;

    // First bullet is accurate; spray, running and jumping all bloom, like the real thing.
    let spread = s.spray <= 1 ? 0 : Math.min(0.0045 * s.spray, 0.04);
    spread += speed01 > 0.55 ? 0.03 * speed01 : 0;
    if (!s.grounded) spread += 0.06;

    s.recoil += s.spray <= 8 ? 0.011 : 0.004;
    if (s.spray > 8) s.yaw += (Math.random() - 0.5) * 0.012;

    camera.getWorldDirection(tmpDir);
    tmpDir.x += (Math.random() - 0.5) * spread;
    tmpDir.y += (Math.random() - 0.5) * spread;
    tmpDir.z += (Math.random() - 0.5) * spread;
    tmpDir.normalize();

    if (runtime.muzzle) runtime.muzzle.getWorldPosition(tmpFrom);
    else tmpFrom.copy(camera.position);

    let hit: Hit | undefined;
    if (runtime.world) {
      raycaster.set(camera.position, tmpDir);
      raycaster.far = 200;
      hit = raycaster.intersectObject(runtime.world, true).find((h) => !findUserData(h.object, "passThrough"));
    }

    if (!hit) {
      tmpTo.copy(camera.position).addScaledVector(tmpDir, 80);
    } else {
      tmpTo.copy(hit.point);
      const botId = findUserData<number>(hit.object, "botId");
      const bot = botId !== undefined ? runtime.bots.get(botId) : undefined;
      if (bot) {
        if (bot.alive) {
          game.set((st) => ({ hits: st.hits + 1 }));
          const head = hit.object.userData.part === "head";
          bot.damage(head ? HEAD_DAMAGE : BODY_DAMAGE, head);
        }
      } else if (hit.face && !findUserData(hit.object, "noDecal")) {
        tmpNormal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
        runtime.spawnImpact?.(hit.point, tmpNormal);
        sound.impact();
      }
    }
    runtime.spawnTracer?.(tmpFrom, tmpTo);
    sendShot(tmpTo);
  };

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const now = performance.now() / 1000;
    const st = game.get();
    const active = st.locked && !st.panel && !st.chatOpen;

    // --- movement
    const fwd = active ? (keys.has("KeyW") ? 1 : 0) - (keys.has("KeyS") ? 1 : 0) : 0;
    const side = active ? (keys.has("KeyD") ? 1 : 0) - (keys.has("KeyA") ? 1 : 0) : 0;
    const walking = keys.has("ShiftLeft") || keys.has("ShiftRight");
    const speed = walking ? WALK_SPEED : RUN_SPEED;
    const sin = Math.sin(s.yaw);
    const cos = Math.cos(s.yaw);
    let wx = -sin * fwd + cos * side;
    let wz = -cos * fwd - sin * side;
    const wl = Math.hypot(wx, wz);
    if (wl > 0) {
      wx = (wx / wl) * speed;
      wz = (wz / wl) * speed;
    }
    const accel = Math.min(1, dt * (s.grounded ? 14 : 2.5));
    s.vx += (wx - s.vx) * accel;
    s.vz += (wz - s.vz) * accel;

    const next = collide(s.x + s.vx * dt, s.z + s.vz * dt, RADIUS);
    s.x = next.x;
    s.z = next.z;

    if (active && s.grounded && keys.has("Space")) {
      s.vy = JUMP_SPEED;
      s.grounded = false;
      sound.jump();
    }
    s.vy -= GRAVITY * dt;
    s.y += s.vy * dt;
    if (s.y <= 0) {
      if (!s.grounded && s.vy < -4) sound.land();
      s.y = 0;
      s.vy = 0;
      s.grounded = true;
    }

    const horiz = Math.hypot(s.vx, s.vz);
    const speed01 = horiz / RUN_SPEED;
    if (s.grounded && !walking && horiz > 2) {
      s.stride += horiz * dt;
      if (s.stride > STRIDE_M) {
        s.stride = 0;
        sound.step();
      }
    }
    runtime.gun.moving = s.grounded ? speed01 : 0.2;
    runtime.gun.bob += horiz * dt * 2.4;

    // --- reload
    if (st.reloading) {
      runtime.gun.reload = Math.min(1, 1 - (s.reloadEnd - now) / RELOAD_S);
      if (now >= s.reloadEnd) {
        const take = Math.min(MAG_SIZE - st.ammo, st.reserve);
        // The range never runs dry: an empty reserve refills.
        game.set({ ammo: st.ammo + take, reserve: st.reserve - take || RESERVE_START, reloading: false });
        runtime.gun.reload = -1;
      }
    }

    // --- firing
    // At low frame rates a single frame may owe more than one bullet.
    for (let shots = 0; shots < 3 && active && s.firing && now >= s.nextShotAt && !game.get().reloading; shots++) {
      if (game.get().ammo <= 0) {
        sound.dryFire();
        s.nextShotAt = now + 0.3;
        startReload();
        break;
      }
      fire(speed01);
    }
    if (!s.firing) {
      s.spray = Math.max(0, s.spray - dt * 10);
      s.recoil -= s.recoil * Math.min(1, dt * 7);
    }

    const bob = s.grounded ? Math.sin(runtime.gun.bob * 2) * 0.025 * speed01 : 0;
    camera.position.set(s.x, s.y + EYE + bob, s.z);
    camera.rotation.set(Math.min(1.5, s.pitch + s.recoil), s.yaw, 0);
    runtime.player.x = s.x;
    runtime.player.z = s.z;
    runtime.player.yaw = s.yaw;
    sendMove(s.x, s.y, s.z, s.yaw, s.pitch);

    // --- what is the crosshair on? (every 4th frame is plenty)
    if (++s.frame % 4 === 0 && runtime.world) {
      let prompt: { station: StationId; item?: number; label: string } | null = null;
      if (active) {
        camera.getWorldDirection(tmpDir);
        raycaster.set(camera.position, tmpDir);
        raycaster.far = INTERACT_RANGE;
        const first = raycaster.intersectObject(runtime.world, true)[0];
        prompt = first ? findUserData(first.object, "interact") ?? null : null;
      }
      const cur = st.prompt;
      if (cur?.station !== prompt?.station || cur?.item !== prompt?.item) game.set({ prompt });
    }
  });

  return null;
}
