// Realtime relay for the portfolio lobby. Holds no data beyond who is connected right now.
import { createServer } from "node:http";
import { Server } from "socket.io";

const PORT = Number(process.env.PORT) || 3001;
// Comma-separated list of sites allowed to connect, e.g. "https://www.shivammodi.me,http://localhost:8080".
const ORIGINS = (process.env.CLIENT_ORIGINS || "http://localhost:8080").split(",").map((o) => o.trim());

const MAX_PLAYERS = 40;
const TICK_MS = 1000 / 12;
const NAME_MAX = 16;
const CHAT_MAX = 140;
const CHAT_GAP_MS = 700;
const SHOT_GAP_MS = 70;
const ROOM = { halfX: 22, halfZ: 20 };
const COLOR_RE = /^#[0-9a-f]{6}$/i;

const http = createServer((req, res) => {
  // Health check for the host; there is nothing else to serve over plain HTTP.
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`ok ${players.size}`);
});

const io = new Server(http, {
  cors: { origin: ORIGINS },
  maxHttpBufferSize: 4096,
});

/** @type {Map<string, {id: string, name: string, color: string, x: number, y: number, z: number, yaw: number, pitch: number, lastChat: number, lastShot: number}>} */
const players = new Map();

function cleanText(value, max) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function cleanName(value) {
  return cleanText(value, NAME_MAX) || `Agent-${Math.floor(1000 + Math.random() * 9000)}`;
}

const finite = (v, fallback = 0) => (typeof v === "number" && Number.isFinite(v) ? v : fallback);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function publicPlayer(p) {
  return { id: p.id, name: p.name, color: p.color, x: p.x, y: p.y, z: p.z, yaw: p.yaw, pitch: p.pitch };
}

function system(text) {
  io.emit("chat", { id: null, name: "SYSTEM", color: null, text, at: Date.now() });
}

io.on("connection", (socket) => {
  socket.on("join", (payload) => {
    if (players.has(socket.id)) return;
    if (players.size >= MAX_PLAYERS) {
      socket.emit("full");
      socket.disconnect(true);
      return;
    }
    const player = {
      id: socket.id,
      name: cleanName(payload?.name),
      color: COLOR_RE.test(payload?.color) ? payload.color : "#ff4655",
      x: 0,
      y: 0,
      z: 15,
      yaw: 0,
      pitch: 0,
      lastChat: 0,
      lastShot: 0,
    };
    players.set(socket.id, player);
    socket.emit("welcome", { id: socket.id, players: [...players.values()].filter((p) => p.id !== socket.id).map(publicPlayer) });
    socket.broadcast.emit("joined", publicPlayer(player));
    system(`${player.name} joined the lobby`);
  });

  socket.on("profile", (payload) => {
    const p = players.get(socket.id);
    if (!p) return;
    const name = cleanName(payload?.name);
    const color = COLOR_RE.test(payload?.color) ? payload.color : p.color;
    if (name === p.name && color === p.color) return;
    const renamed = name !== p.name;
    const old = p.name;
    p.name = name;
    p.color = color;
    io.emit("profile", { id: p.id, name, color });
    if (renamed) system(`${old} is now ${name}`);
  });

  socket.on("move", (m) => {
    const p = players.get(socket.id);
    if (!p || !m) return;
    p.x = clamp(finite(m.x, p.x), -ROOM.halfX, ROOM.halfX);
    p.z = clamp(finite(m.z, p.z), -ROOM.halfZ, ROOM.halfZ);
    p.y = clamp(finite(m.y, p.y), 0, 3);
    p.yaw = finite(m.yaw, p.yaw);
    p.pitch = clamp(finite(m.pitch, p.pitch), -1.6, 1.6);
  });

  socket.on("shot", (s) => {
    const p = players.get(socket.id);
    const now = Date.now();
    if (!p || !s || now - p.lastShot < SHOT_GAP_MS) return;
    p.lastShot = now;
    const to = { x: finite(s.x), y: finite(s.y), z: finite(s.z) };
    socket.broadcast.volatile.emit("shot", { id: p.id, to });
  });

  socket.on("chat", (raw) => {
    const p = players.get(socket.id);
    const now = Date.now();
    if (!p || now - p.lastChat < CHAT_GAP_MS) return;
    const text = cleanText(raw, CHAT_MAX);
    if (!text) return;
    p.lastChat = now;
    io.emit("chat", { id: p.id, name: p.name, color: p.color, text, at: now });
  });

  socket.on("disconnect", () => {
    const p = players.get(socket.id);
    if (!p) return;
    players.delete(socket.id);
    io.emit("left", { id: socket.id });
    system(`${p.name} left`);
  });
});

// One compact snapshot for everyone, instead of relaying every move event.
setInterval(() => {
  if (players.size < 2) return;
  const snapshot = [...players.values()].map((p) => [p.id, +p.x.toFixed(2), +p.y.toFixed(2), +p.z.toFixed(2), +p.yaw.toFixed(3), +p.pitch.toFixed(3)]);
  io.volatile.emit("state", snapshot);
}, TICK_MS);

http.listen(PORT, () => {
  console.log(`lobby server on :${PORT}, allowing ${ORIGINS.join(", ")}`);
});
