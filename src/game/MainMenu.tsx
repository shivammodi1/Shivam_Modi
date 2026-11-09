import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CERTS, CONTACT, EXPERIENCE, formatTenure, PROFILE, PROJECTS } from "./data";
import { sound } from "./sound";
import { isTouchOnly } from "./device";
import { useCodingStats } from "./stats";
import { ThemePicker } from "./ThemePicker";
import { themeVars, useAgentTheme } from "./theme";
import "./game.css";

const MATCH_FOUND_MS = 1700;
const featured = CERTS.find((c) => c.featured);
const job = EXPERIENCE[0];

export default function MainMenu() {
  const navigate = useNavigate();
  const theme = useAgentTheme();
  const stats = useCodingStats();
  const touchOnly = isTouchOnly();
  // Coming back from the lobby or a page, audio is already running: skip the start screen.
  const [started, setStarted] = useState(() => sound.unlocked);
  const [queueing, setQueueing] = useState(false);
  const [muted, setMuted] = useState(sound.muted);
  const portrait = useRef<HTMLDivElement>(null);
  const solved = stats.leetcode.solved + stats.gfg.solved + stats.codechef.solved;

  useEffect(() => {
    document.title = "Shivam Modi · Full-Stack Developer";
    return () => sound.stopAmbience();
  }, []);

  const start = () => {
    sound.unlock();
    sound.uiOpen();
    sound.startAmbience("menu");
    setStarted(true);
  };

  useEffect(() => {
    if (started) {
      sound.startAmbience("menu");
      return;
    }
    // Clicks are handled on the start screen itself, so the same click can't also hit the menu under it.
    window.addEventListener("keydown", start, { once: true });
    return () => window.removeEventListener("keydown", start);
     
  }, [started]);

  useEffect(() => {
    // Slight parallax on the agent portrait.
    const onMove = (e: MouseEvent) => {
      const el = portrait.current;
      if (!el) return;
      const dx = e.clientX / window.innerWidth - 0.5;
      const dy = e.clientY / window.innerHeight - 0.5;
      el.style.transform = `translate3d(${dx * -18}px, ${dy * -10}px, 0)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const play = () => {
    if (queueing) return;
    if (touchOnly) {
      // The lobby needs a mouse and keyboard; phones get the same content as pages.
      sound.uiClick();
      navigate("/browse/profile");
      return;
    }
    sound.matchFound();
    setQueueing(true);
    setTimeout(() => navigate("/play"), MATCH_FOUND_MS);
  };

  const hover = () => sound.uiHover();
  const click = () => sound.uiClick();

  return (
    <div className="vl-root vl-menu" style={themeVars(theme)}>
      <div className="vl-menu__bg">
        <div className="vl-menu__slab vl-menu__slab--a" />
        <div className="vl-menu__slab vl-menu__slab--b" />
        <div className="vl-menu__ghost">SHIVAM</div>
        <div className="vl-menu__grid" />
      </div>

      <div className="vl-menu__agent" ref={portrait}>
        <div className="vl-menu__agent-glow" />
        <img src="/profile.jpeg" alt={PROFILE.name} />
      </div>

      <header className="vl-menu__top">
        <div className="vl-logo">
          <span>SM</span>
        </div>
        <nav className="vl-menu__tabs">
          <span className="is-active">Home</span>
          <Link to="/browse/projects" onMouseEnter={hover} onClick={click}>
            Collection
          </Link>
          <Link to="/browse/career" onMouseEnter={hover} onClick={click}>
            Career
          </Link>
          <Link to="/browse/ranked" onMouseEnter={hover} onClick={click}>
            Ranked
          </Link>
          <Link to="/browse/comms" onMouseEnter={hover} onClick={click}>
            Comms
          </Link>
        </nav>
        <div className="vl-menu__player">
          <div className="vl-menu__currency">
            <b>{PROJECTS.length}</b>
            <small>Projects</small>
          </div>
          <div className="vl-menu__currency">
            <b>{solved.toLocaleString()}</b>
            <small>Solved</small>
          </div>
          <div className="vl-menu__card">
            <img className="vl-menu__avatar" src="/profile.jpeg" alt="" />
            <div>
              <b>Shivam Modi</b>
              <small>{job ? `${job.role} · ${job.company}` : "#DEV"}</small>
            </div>
          </div>
        </div>
      </header>

      <main className="vl-menu__main">
        <p className="vl-kicker">
          {PROFILE.role} · {PROFILE.origin}
        </p>
        <h1 className="vl-menu__name">
          Shivam
          <br />
          Modi
        </h1>

        <div className="vl-menu__nav">
          <button className="vl-play" onClick={play} onMouseEnter={hover}>
            <span>{touchOnly ? "Explore" : "Play"}</span>
            <small>{touchOnly ? "Open the portfolio" : "Enter the 3D lobby"}</small>
          </button>
          <Link className="vl-menu__item" to="/browse/profile" onMouseEnter={hover} onClick={click}>
            Agent profile
          </Link>
          <Link className="vl-menu__item" to="/browse/projects" onMouseEnter={hover} onClick={click}>
            Projects
          </Link>
          <a className="vl-menu__item" href={CONTACT.resume} target="_blank" rel="noopener noreferrer" onMouseEnter={hover} onClick={click}>
            Resume
          </a>
          <Link className="vl-menu__item" to="/browse/comms" onMouseEnter={hover} onClick={click}>
            Contact
          </Link>
        </div>
      </main>

      <div className="vl-menu__side">
        {job && (
          <Link className="vl-menu__news vl-menu__news--live" to="/browse/career" onMouseEnter={hover} onClick={click}>
            <span className="vl-tag">Now</span>
            <b>
              {job.role} at {job.company}
            </b>
            <small>{formatTenure(job.start, job.end)}</small>
          </Link>
        )}
        {featured && (
          <a className="vl-menu__news" href={featured.url} target="_blank" rel="noopener noreferrer" onMouseEnter={hover} onClick={click}>
            <span className="vl-tag vl-tag--gold">Featured</span>
            <b>{featured.title}</b>
            <small>
              {featured.issuer} · {featured.date}
            </small>
          </a>
        )}
        <ThemePicker />
      </div>

      <footer className="vl-menu__foot">
        <button
          className="vl-link"
          onClick={() => {
            const next = !muted;
            sound.setMuted(next);
            setMuted(next);
          }}
        >
          Sound: {muted ? "Off" : "On"}
        </button>
        <span>{touchOnly ? "Open on a laptop to play the 3D lobby" : "Best with mouse & keyboard"}</span>
      </footer>

      {!started && (
        <div className="vl-boot" onClick={start}>
          <div className="vl-logo vl-logo--big">
            <span>SM</span>
          </div>
          <p>{touchOnly ? "Tap to start" : "Click anywhere to start"}</p>
        </div>
      )}

      {queueing && (
        <div className="vl-matchfound">
          <div className="vl-matchfound__band">
            <small>Match found</small>
            <b>SM-HQ // The Range</b>
            <span>Lobby · Practice</span>
          </div>
        </div>
      )}
    </div>
  );
}
