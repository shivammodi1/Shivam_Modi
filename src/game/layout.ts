import type { StationId } from "./data";
import { runtime } from "./store";

// Room is centred on the origin; the player spawns near +z looking towards -z.
export const ROOM = { halfX: 22, halfZ: 20, height: 9 };
export const SPAWN = { x: 0, z: 15 };
export const BOT_RADIUS = 0.45;

export interface Box {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface Circle {
  x: number;
  z: number;
  r: number;
}

export const GALLERY_RAIL_Z = -16.6;
export const HOLOGRAM = { x: 0, z: -1, r: 2.6 };
export const TERMINAL = { x: -9, z: 13 };
export const ARSENAL_Z = [-9, -5.4, -1.8, 1.8, 5.4, 9];
export const TROPHY_Z = [-8, -4, 0, 4, 8];
export const TROPHY_X = 19.6;
export const BOT_ROW_Z = -11;
export const CRATES: { x: number; z: number; s: number; h: number }[] = [
  { x: 9, z: 7, s: 1.6, h: 1.6 },
  { x: 10.7, z: 7, s: 1.6, h: 1.6 },
  { x: 9.85, z: 7, s: 1.2, h: 2.8 },
  { x: -14, z: 3, s: 1.4, h: 1.4 },
  { x: 13.5, z: -3.5, s: 1.4, h: 1.4 },
];

export const BOXES: Box[] = [
  { minX: -17.5, maxX: 17.5, minZ: GALLERY_RAIL_Z - 0.15, maxZ: GALLERY_RAIL_Z + 0.15 },
  { minX: TERMINAL.x - 1.3, maxX: TERMINAL.x + 1.3, minZ: TERMINAL.z - 0.6, maxZ: TERMINAL.z + 0.6 },
  { minX: -ROOM.halfX, maxX: -ROOM.halfX + 1.1, minZ: -11, maxZ: 11 },
  ...CRATES.map((c) => ({ minX: c.x - c.s / 2, maxX: c.x + c.s / 2, minZ: c.z - c.s / 2, maxZ: c.z + c.s / 2 })),
];

export const CIRCLES: Circle[] = [HOLOGRAM, ...TROPHY_Z.map((z) => ({ x: TROPHY_X, z, r: 0.75 }))];

/** Pushes a player circle out of walls, props and live bots. */
export function collide(x: number, z: number, r: number) {
  x = clamp(x, -ROOM.halfX + r, ROOM.halfX - r);
  z = clamp(z, -ROOM.halfZ + r, ROOM.halfZ - r);

  for (const b of BOXES) {
    const cx = clamp(x, b.minX, b.maxX);
    const cz = clamp(z, b.minZ, b.maxZ);
    const dx = x - cx;
    const dz = z - cz;
    const d2 = dx * dx + dz * dz;
    if (d2 >= r * r) continue;
    if (d2 > 1e-8) {
      const d = Math.sqrt(d2);
      x = cx + (dx / d) * r;
      z = cz + (dz / d) * r;
    } else {
      // Centre is inside the box: leave by the nearest face.
      const exits = [x - b.minX, b.maxX - x, z - b.minZ, b.maxZ - z];
      const i = exits.indexOf(Math.min(...exits));
      if (i === 0) x = b.minX - r;
      else if (i === 1) x = b.maxX + r;
      else if (i === 2) z = b.minZ - r;
      else z = b.maxZ + r;
    }
  }

  const circles: Circle[] = [...CIRCLES];
  runtime.bots.forEach((bot) => {
    if (bot.alive) circles.push({ x: bot.x, z: bot.z, r: BOT_RADIUS });
  });
  for (const c of circles) {
    const dx = x - c.x;
    const dz = z - c.z;
    const min = r + c.r;
    const d2 = dx * dx + dz * dz;
    if (d2 >= min * min || d2 < 1e-8) continue;
    const d = Math.sqrt(d2);
    x = c.x + (dx / d) * min;
    z = c.z + (dz / d) * min;
  }
  return { x, z };
}

export const MINIMAP_MARKS: { station: StationId; x: number; z: number; label: string }[] = [
  { station: "projects", x: 0, z: -19, label: "1" },
  { station: "arsenal", x: -21, z: 0, label: "2" },
  { station: "trophies", x: 21, z: 0, label: "3" },
  { station: "profile", x: HOLOGRAM.x, z: HOLOGRAM.z, label: "4" },
  { station: "comms", x: TERMINAL.x, z: TERMINAL.z, label: "5" },
  { station: "career", x: 13, z: 19, label: "6" },
  { station: "ranked", x: -13, z: 19, label: "7" },
];

function clamp(v: number, min: number, max: number) {
  return v < min ? min : v > max ? max : v;
}
