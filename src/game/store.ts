import { useSyncExternalStore } from "react";
import type { Object3D, Vector3 } from "three";
import type { StationId } from "./data";
import { sound } from "./sound";

export const MAG_SIZE = 25;
export const RESERVE_START = 75;

export interface Prompt {
  station: StationId;
  item?: number;
  label: string;
}

export interface FeedItem {
  id: number;
  victim: string;
  headshot: boolean;
}

export interface GameState {
  locked: boolean;
  panel: { station: StationId; item?: number } | null;
  prompt: Prompt | null;
  ammo: number;
  reserve: number;
  reloading: boolean;
  shots: number;
  hits: number;
  kills: number;
  headshots: number;
  feed: FeedItem[];
  hitmarker: { at: number; kill: boolean; head: boolean } | null;
  muted: boolean;
  chatOpen: boolean;
}

let state: GameState = initialState();
const listeners = new Set<() => void>();

function initialState(): GameState {
  return {
    locked: false,
    panel: null,
    prompt: null,
    ammo: MAG_SIZE,
    reserve: RESERVE_START,
    reloading: false,
    shots: 0,
    hits: 0,
    kills: 0,
    headshots: 0,
    feed: [],
    hitmarker: null,
    muted: sound.muted,
    chatOpen: false,
  };
}

export const game = {
  get: () => state,
  set(patch: Partial<GameState> | ((s: GameState) => Partial<GameState>)) {
    const next = typeof patch === "function" ? patch(state) : patch;
    state = { ...state, ...next };
    listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  reset() {
    state = initialState();
    listeners.forEach((l) => l());
  },
};

/** Select a primitive or a stable reference; a fresh object each call would re-render forever. */
export function useGame<T>(selector: (s: GameState) => T): T {
  return useSyncExternalStore(game.subscribe, () => selector(state));
}

export interface BotHandle {
  name: string;
  alive: boolean;
  x: number;
  z: number;
  damage: (amount: number, head: boolean) => void;
}

/** Per-frame mutable data shared between the 3D scene, the HUD minimap and effects. Not reactive. */
export const runtime = {
  canvas: null as HTMLCanvasElement | null,
  world: null as Object3D | null,
  muzzle: null as Object3D | null,
  player: { x: 0, z: 0, yaw: 0 },
  bots: new Map<number, BotHandle>(),
  gun: { kick: 0, reload: -1, flash: 0, bob: 0, moving: 0, swayX: 0, swayY: 0 },
  spawnImpact: null as null | ((point: Vector3, normal: Vector3) => void),
  spawnTracer: null as null | ((from: Vector3, to: Vector3) => void),
};

export function requestLock() {
  const canvas = runtime.canvas;
  if (!canvas) return;
  sound.unlock();
  try {
    const result = canvas.requestPointerLock() as unknown as Promise<void> | undefined;
    // Chrome rejects a re-lock within ~1s of pressing Esc; the player just clicks again.
    result?.catch?.(() => {});
  } catch {
    // Same as above for browsers that throw instead of rejecting.
  }
}

export function openPanel(station: StationId, item?: number) {
  sound.uiOpen();
  game.set({ panel: { station, item }, prompt: null });
  if (document.pointerLockElement) document.exitPointerLock();
}

export function closePanel(relock = true) {
  sound.uiClose();
  game.set({ panel: null });
  if (relock) requestLock();
}

export function toggleMute() {
  const muted = !game.get().muted;
  sound.setMuted(muted);
  game.set({ muted });
}

let feedId = 0;
export function pushKill(victim: string, headshot: boolean) {
  const item = { id: ++feedId, victim, headshot };
  game.set((s) => ({
    kills: s.kills + 1,
    headshots: s.headshots + (headshot ? 1 : 0),
    feed: [item, ...s.feed].slice(0, 5),
  }));
  setTimeout(() => game.set((s) => ({ feed: s.feed.filter((f) => f.id !== item.id) })), 5000);
}
