import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { STATIONS } from "./data";
import { MINIMAP_MARKS, ROOM } from "./layout";
import { game, MAG_SIZE, openPanel, requestLock, runtime, toggleMute, useGame } from "./store";
import { getCallsign, remotes, sendChat, updateProfile, useNet } from "./net";
import { ThemePicker } from "./ThemePicker";
import { sound } from "./sound";
import { getAgentTheme, useAgentTheme } from "./theme";

export function Hud() {
  const locked = useGame((s) => s.locked);
  const panel = useGame((s) => s.panel);
  const prompt = useGame((s) => s.prompt);
  const ammo = useGame((s) => s.ammo);
  const reserve = useGame((s) => s.reserve);
  const reloading = useGame((s) => s.reloading);
  const kills = useGame((s) => s.kills);
  const shots = useGame((s) => s.shots);
  const hits = useGame((s) => s.hits);
  const headshots = useGame((s) => s.headshots);
  const feed = useGame((s) => s.feed);
  const hitmarker = useGame((s) => s.hitmarker);
  const muted = useGame((s) => s.muted);
  const lastHead = feed[0]?.headshot;

  const accuracy = shots ? Math.round((hits / shots) * 100) : 0;
  const hsRate = kills ? Math.round((headshots / kills) * 100) : 0;

  return (
    <div className={`vl-hud ${locked && !panel ? "" : "vl-hud--dim"}`}>
      <div className="vl-scorebar">
        <div className="vl-scorebar__side">
          <span>{kills}</span>
          <small>Kills</small>
        </div>
        <div className="vl-scorebar__mid">
          <small>SM-HQ</small>
          <b>The Range</b>
          <OnlineBadge />
        </div>
        <div className="vl-scorebar__side">
          <span>{accuracy}%</span>
          <small>Acc · HS {hsRate}%</small>
        </div>
      </div>

      <Minimap />

      <div className="vl-feed">
        {feed.map((f) => (
          <div key={f.id} className="vl-feed__row">
            <span className="vl-feed__you">SHIVAM</span>
            <span className="vl-feed__gun">Vandal{f.headshot ? " ◎" : ""}</span>
            <span className="vl-feed__victim">{f.victim}</span>
          </div>
        ))}
      </div>

      <div className="vl-crosshair">
        <i />
        <i />
        <i />
        <i />
        <b />
      </div>
      {hitmarker && <div key={hitmarker.at} className={`vl-hitmarker ${hitmarker.kill ? "is-kill" : ""} ${hitmarker.head ? "is-head" : ""}`} />}
      {kills > 0 && (
        <div key={kills} className="vl-killbanner">
          <span>{lastHead ? "Headshot" : "Eliminated"}</span>
          <b>{kills}</b>
        </div>
      )}

      {prompt && locked && !panel && (
        <div className="vl-prompt">
          <kbd>E</kbd>
          <span>{prompt.label}</span>
        </div>
      )}

      <div className="vl-vitals">
        <div className="vl-vitals__shield">50</div>
        <div className="vl-vitals__hp">
          <b>100</b>
          <span className="vl-vitals__bar" />
        </div>
      </div>

      <div className="vl-abilities">
        {STATIONS.map((st) => (
          <div key={st.id} className="vl-ability">
            <kbd>{st.key}</kbd>
            <span>{st.label}</span>
          </div>
        ))}
      </div>

      <div className="vl-ammo">
        <div className="vl-ammo__count">
          {reloading ? <span className="vl-ammo__reload">Reloading</span> : <b className={ammo <= 5 ? "is-low" : ""}>{ammo}</b>}
          <span>/ {reserve}</span>
        </div>
        <div className="vl-ammo__gun">
          Vandal <small>{MAG_SIZE} rnd · R reload</small>
        </div>
      </div>

      <Chat />

      {/* Status only: while playing the mouse is captured, so M is the way to toggle. */}
      <div className="vl-mute">
        Sound {muted ? "off" : "on"} <kbd>M</kbd>
      </div>
    </div>
  );
}

function Minimap() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const size = 190;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const g = canvas.getContext("2d")!;
    g.scale(dpr, dpr);
    const scale = (size - 20) / (ROOM.halfX * 2);
    const toMap = (x: number, z: number) => [size / 2 + x * scale, size / 2 + z * scale] as const;

    let raf = 0;
    const draw = () => {
      g.clearRect(0, 0, size, size);
      g.fillStyle = "rgba(15,25,35,0.72)";
      g.fillRect(0, 0, size, size);
      const [x0, y0] = toMap(-ROOM.halfX, -ROOM.halfZ);
      g.strokeStyle = "rgba(236,232,225,0.55)";
      g.lineWidth = 1.5;
      g.strokeRect(x0, y0, ROOM.halfX * 2 * scale, ROOM.halfZ * 2 * scale);

      g.font = "700 11px Rajdhani, sans-serif";
      g.textAlign = "center";
      g.textBaseline = "middle";
      for (const m of MINIMAP_MARKS) {
        const [mx, my] = toMap(m.x, m.z);
        g.fillStyle = getAgentTheme().accent;
        g.fillRect(mx - 7, my - 7, 14, 14);
        g.fillStyle = "#ece8e1";
        g.fillText(m.label, mx, my + 1);
      }
      runtime.bots.forEach((b) => {
        if (!b.alive) return;
        const [bx, by] = toMap(b.x, b.z);
        g.fillStyle = "#ff7a2f";
        g.beginPath();
        g.arc(bx, by, 3, 0, Math.PI * 2);
        g.fill();
      });

      remotes.forEach((r) => {
        const [rx, ry] = toMap(r.x, r.z);
        g.fillStyle = r.color;
        g.fillRect(rx - 3.5, ry - 3.5, 7, 7);
      });

      const p = runtime.player;
      const [px, py] = toMap(p.x, p.z);
      // Facing direction: yaw 0 looks toward -z, which is up on the map.
      const a = -p.yaw - Math.PI / 2;
      g.fillStyle = `color-mix(in srgb, ${getAgentTheme().alt} 22%, transparent)`;
      g.beginPath();
      g.moveTo(px, py);
      g.arc(px, py, 34, a - 0.55, a + 0.55);
      g.closePath();
      g.fill();
      g.fillStyle = getAgentTheme().alt;
      g.beginPath();
      g.arc(px, py, 4.5, 0, Math.PI * 2);
      g.fill();

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="vl-minimap" style={{ width: 190, height: 190 }} />;
}

export function PauseMenu() {
  const locked = useGame((s) => s.locked);
  const panel = useGame((s) => s.panel);
  const shots = useGame((s) => s.shots);
  const kills = useGame((s) => s.kills);
  const muted = useGame((s) => s.muted);
  if (locked || panel) return null;

  const play = () => {
    sound.unlock();
    sound.uiClick();
    sound.startAmbience("lobby");
    requestLock();
  };

  return (
    <div className="vl-pause">
      <div className="vl-pause__card">
        <p className="vl-kicker">{shots ? "Paused" : "Entering"} · SM-HQ</p>
        <h1 className="vl-title">The Range</h1>
        <p className="vl-pause__lead">
          Walk the lobby, shoot the bots, and aim at any station then press <kbd>E</kbd> to open that part of my portfolio.
        </p>

        <Callsign />

        <button className="vl-btn vl-btn--primary vl-btn--xl" onClick={play} onMouseEnter={() => sound.uiHover()}>
          {shots ? "Resume" : "Click to play"}
        </button>

        <div className="vl-controls">
          {[
            ["W A S D", "Move"],
            ["Shift", "Walk (silent)"],
            ["Space", "Jump"],
            ["Mouse", "Aim · click to fire"],
            ["R", "Reload"],
            ["E", "Open station"],
            ["1 – 7", "Jump to section"],
            ["Esc", "Pause"],
            ["Enter", "Chat"],
            ["M", "Sound on / off"],
          ].map(([k, v]) => (
            <div key={k}>
              <kbd>{k}</kbd>
              <span>{v}</span>
            </div>
          ))}
        </div>

        {kills > 0 && <p className="vl-pause__stat">{kills} bots down. Not bad.</p>}

        <p className="vl-kicker vl-kicker--muted">Just browsing? Open a section directly</p>
        <div className="vl-pause__quick">
          {STATIONS.map((st) => (
            <button key={st.id} className="vl-chip" onClick={() => openPanel(st.id)} onMouseEnter={() => sound.uiHover()}>
              {st.label}
            </button>
          ))}
        </div>

        <p className="vl-kicker vl-kicker--muted">Theme</p>
        <ThemePicker compact />

        <div className="vl-pause__footer">
          <Link to="/" className="vl-link" onClick={() => sound.uiClick()}>
            ← Main menu
          </Link>
          <button className="vl-link" onClick={toggleMute}>
            Sound: {muted ? "Off" : "On"} <kbd>M</kbd>
          </button>
        </div>
      </div>
    </div>
  );
}

function OnlineBadge() {
  const status = useNet((s) => s.status);
  const count = useNet((s) => s.playerIds.length) + 1;
  const label = status === "online" ? `${count} online` : status === "connecting" ? "Connecting…" : status === "full" ? "Lobby full · solo" : "Solo";
  return <i className={`vl-online vl-online--${status}`}>{label}</i>;
}

const CHAT_FADE_MS = 12000;

function Chat() {
  const open = useGame((s) => s.chatOpen);
  const status = useNet((s) => s.status);
  const lines = useNet((s) => s.chat);
  const [draft, setDraft] = useState("");
  const [, tick] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  // Re-render now and then so old lines fade out of the closed chat.
  useEffect(() => {
    const iv = setInterval(() => tick((n) => n + 1), 2000);
    return () => clearInterval(iv);
  }, []);

  const last = lines[lines.length - 1];
  useEffect(() => {
    if (last && last.id) sound.chatPing();
  }, [last]);

  if (status === "offline") return null;

  const now = Date.now();
  const visible = open ? lines.slice(-8) : lines.filter((l) => now - l.at < CHAT_FADE_MS).slice(-5);
  const close = () => {
    setDraft("");
    game.set({ chatOpen: false });
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (draft.trim()) sendChat(draft);
    close();
  };

  return (
    <div className={`vl-chat ${open ? "is-open" : ""}`}>
      <div className="vl-chat__log">
        {visible.map((l) => (
          <p key={l.key} className={l.id ? "" : "is-system"}>
            {l.id ? (
              <>
                <b style={{ color: l.color ?? undefined }}>{l.name}:</b> {l.text}
              </>
            ) : (
              l.text
            )}
          </p>
        ))}
      </div>
      {open ? (
        <form onSubmit={submit}>
          <span>All</span>
          <input
            ref={input}
            value={draft}
            maxLength={140}
            placeholder={status === "online" ? "Say something…" : "Not connected yet"}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              // Keep typing away from movement keys and hotkeys.
              e.stopPropagation();
              if (e.key === "Escape") close();
            }}
            onBlur={close}
          />
        </form>
      ) : (
        status === "online" && (
          <small className="vl-chat__hint">
            <kbd>Enter</kbd> chat
          </small>
        )
      )}
    </div>
  );
}

function Callsign() {
  const theme = useAgentTheme();
  const [name, setName] = useState(getCallsign);
  const save = () => {
    const clean = name.replace(/\s+/g, " ").trim().slice(0, 16) || getCallsign();
    setName(clean);
    updateProfile({ name: clean, color: theme.accent });
  };
  return (
    <label className="vl-callsign">
      <span>Your callsign</span>
      <input
        value={name}
        maxLength={16}
        onChange={(e) => setName(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
      />
    </label>
  );
}
