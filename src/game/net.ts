import { useSyncExternalStore } from "react";
import { io, type Socket } from "socket.io-client";

// Unset in production means solo mode: the lobby works, just without other players.
const SERVER_URL: string | null = import.meta.env.VITE_LOBBY_SERVER_URL || (import.meta.env.DEV ? "http://localhost:3001" : null);
const SEND_HZ = 15;
const CHAT_KEEP = 40;
const NAME_KEY = "sm-callsign";

export type NetStatus = "offline" | "connecting" | "online" | "full";

export interface RemotePlayer {
  id: string;
  name: string;
  color: string;
  // Latest server position; avatars ease toward it every frame.
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
}

export interface ChatLine {
  key: number;
  id: string | null;
  name: string;
  color: string | null;
  text: string;
  at: number;
}

interface NetState {
  status: NetStatus;
  selfId: string | null;
  /** Ids only: avatars mount/unmount from this; positions live in `remotes`. */
  playerIds: string[];
  /** Bumped when anyone's name or colour changes, so nameplates redraw. */
  profileRev: number;
  chat: ChatLine[];
}

let state: NetState = { status: SERVER_URL ? "connecting" : "offline", selfId: null, playerIds: [], profileRev: 0, chat: [] };
const listeners = new Set<() => void>();
const set = (patch: Partial<NetState>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

/** Not reactive: read every frame by the avatar renderer. */
export const remotes = new Map<string, RemotePlayer>();
/** Called when another player fires, so the scene can draw their tracer. */
export const netEvents = { onShot: null as null | ((p: RemotePlayer, to: { x: number; y: number; z: number }) => void) };

let socket: Socket | null = null;
let lastSend = 0;
let lastSent = "";
let chatKey = 0;

export function useNet<T>(select: (s: NetState) => T): T {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => select(state),
  );
}

export function getCallsign() {
  try {
    const saved = localStorage.getItem(NAME_KEY);
    if (saved) return saved;
    const fresh = `Agent-${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem(NAME_KEY, fresh);
    return fresh;
  } catch {
    return "Agent";
  }
}

function syncIds() {
  set({ playerIds: [...remotes.keys()] });
}

function pushChat(line: Omit<ChatLine, "key">) {
  set({ chat: [...state.chat, { ...line, key: ++chatKey }].slice(-CHAT_KEEP) });
}

export function connect(profile: { name: string; color: string }) {
  if (!SERVER_URL || socket) return;
  set({ status: "connecting" });
  const s = io(SERVER_URL, { transports: ["websocket"], reconnectionDelayMax: 8000 });
  socket = s;

  s.on("connect", () => s.emit("join", profile));
  s.on("welcome", (data: { id: string; players: RemotePlayer[] }) => {
    remotes.clear();
    data.players.forEach((p) => remotes.set(p.id, p));
    set({ status: "online", selfId: data.id });
    syncIds();
  });
  s.on("joined", (p: RemotePlayer) => {
    remotes.set(p.id, p);
    syncIds();
  });
  s.on("left", ({ id }: { id: string }) => {
    remotes.delete(id);
    syncIds();
  });
  s.on("profile", ({ id, name, color }: { id: string; name: string; color: string }) => {
    const p = remotes.get(id);
    if (!p) return;
    p.name = name;
    p.color = color;
    set({ profileRev: state.profileRev + 1 });
  });
  s.on("state", (rows: [string, number, number, number, number, number][]) => {
    for (const [id, x, y, z, yaw, pitch] of rows) {
      const p = remotes.get(id);
      if (p) Object.assign(p, { x, y, z, yaw, pitch });
    }
  });
  s.on("shot", ({ id, to }: { id: string; to: { x: number; y: number; z: number } }) => {
    const p = remotes.get(id);
    if (p) netEvents.onShot?.(p, to);
  });
  s.on("chat", (line: Omit<ChatLine, "key">) => pushChat(line));
  s.on("full", () => set({ status: "full" }));
  s.on("disconnect", () => {
    remotes.clear();
    syncIds();
    if (state.status !== "full") set({ status: "connecting" });
  });
}

export function disconnect() {
  socket?.disconnect();
  socket = null;
  remotes.clear();
  lastSent = "";
  set({ status: SERVER_URL ? "connecting" : "offline", selfId: null, playerIds: [], chat: [] });
}

export function sendMove(x: number, y: number, z: number, yaw: number, pitch: number) {
  if (!socket || state.status !== "online") return;
  const now = performance.now();
  if (now - lastSend < 1000 / SEND_HZ) return;
  const payload = { x: +x.toFixed(2), y: +y.toFixed(2), z: +z.toFixed(2), yaw: +yaw.toFixed(3), pitch: +pitch.toFixed(3) };
  const key = `${payload.x},${payload.y},${payload.z},${payload.yaw},${payload.pitch}`;
  if (key === lastSent) return;
  lastSend = now;
  lastSent = key;
  socket.volatile.emit("move", payload);
}

export function sendShot(to: { x: number; y: number; z: number }) {
  if (state.status === "online") socket?.volatile.emit("shot", { x: +to.x.toFixed(2), y: +to.y.toFixed(2), z: +to.z.toFixed(2) });
}

export function sendChat(text: string) {
  const clean = text.trim().slice(0, 140);
  if (!clean || state.status !== "online") return false;
  socket?.emit("chat", clean);
  return true;
}

export function updateProfile(profile: { name: string; color: string }) {
  try {
    localStorage.setItem(NAME_KEY, profile.name);
  } catch {
    // Storage blocked: the name lasts for this visit only.
  }
  if (state.status === "online") socket?.emit("profile", profile);
}
