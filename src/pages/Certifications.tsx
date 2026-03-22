import React, { useState, useEffect, useRef, useCallback } from "react";
import { ExternalLink, Award, Calendar, CheckCircle, Trophy, Shield, Brain, Code2, Zap } from "lucide-react";

/* ── Types ─────────────────────────────────────────────────────── */
interface Cert {
  id: number;
  title: string;
  issuer: string;
  date: string;
  icon: React.ReactNode;
  color: string;
  glow: string;
  badge: string;
  robotSays: string;
  skills: string[];
  url?: string;
  featured?: boolean;
}

/* ── Data ──────────────────────────────────────────────────────── */
const CERTS: Cert[] = [
  {
    id: 1,
    title: "Certified Ethical Hacker (CEH) V12",
    issuer: "Warlock Security",
    date: "2024",
    icon: <Shield size={22} />,
    color: "#ff006e",
    glow: "rgba(255,0,110,0.35)",
    badge: "SECURITY",
    robotSays:
      "This CEH V12 cert proves Shivam can think like an attacker to defend like a pro. Covers penetration testing, network recon, vulnerability exploitation, and ethical hacking methodologies used by real-world security professionals.",
    skills: ["Ethical Hacking", "Pen Testing", "Network Security", "Vulnerability Assessment"],
    url: "https://drive.google.com/file/d/17xDK2jk36yRt_b2a2rSz3sa5o1mgdzdA/view?usp=sharing",
  },
  {
    id: 2,
    title: "Oracle Certified Professional – GenAI",
    issuer: "Oracle University",
    date: "2025",
    icon: <Brain size={22} />,
    color: "#7b2ff7",
    glow: "rgba(123,47,247,0.35)",
    badge: "AI / ML",
    robotSays:
      "Oracle's GenAI certification validates deep knowledge of generative AI concepts, prompt engineering, and AI solution architecture on Oracle Cloud. Shivam understands large language models at a professional level.",
    skills: ["Generative AI", "Oracle Cloud", "LLMs", "AI Architecture"],
    url: "https://drive.google.com/file/d/1u5FC3Vt5swKx4wPSspjn7LN56kweYjfr/view?usp=sharing",
  },
  {
    id: 3,
    title: "Winner – Paranox 2.0 National Hackathon",
    issuer: "Newton School of Technology, Sonipat",
    date: "Nov 2025",
    icon: <Trophy size={22} />,
    color: "#ffc800",
    glow: "rgba(255,200,0,0.35)",
    badge: "🏆 WINNER",
    robotSays:
      "Shivam competed against thousands of developers from colleges across India and WON! Built a full-stack innovative solution in a grand finale hackathon setting. This is elite-tier problem solving under pressure.",
    skills: ["Innovation", "Full Stack", "Team Lead", "Rapid Prototyping"],
    url: "https://www.linkedin.com/posts/shivammodi1_paranox2-winner-nationalhackathon-activity-7396210919103512576-uDhU",
    featured: true,
  },
  {
    id: 4,
    title: "Full-Stack Web Development",
    issuer: "University Coursework",
    date: "2023",
    icon: <Code2 size={22} />,
    color: "#00d4ff",
    glow: "rgba(0,212,255,0.35)",
    badge: "FULL STACK",
    robotSays:
      "Comprehensive full-stack training covering React for frontends, Node.js + Express for backend APIs, and MongoDB for database management. Shivam built real-world MERN applications as part of this program.",
    skills: ["React", "Node.js", "MongoDB", "Express"],
  },
  {
    id: 5,
    title: "Data Structures & Algorithms",
    issuer: "University Coursework",
    date: "2023",
    icon: <Zap size={22} />,
    color: "#00ff88",
    glow: "rgba(0,255,136,0.35)",
    badge: "CS CORE",
    robotSays:
      "Advanced DSA coursework covering arrays, trees, graphs, dynamic programming, sorting algorithms, and computational complexity. This is the foundation of efficient engineering and competitive programming.",
    skills: ["DSA", "Algorithms", "Problem Solving", "Optimization"],
  },
];

/* ── Robot SVG ─────────────────────────────────────────────────── */
const RobotSVG: React.FC<{ color: string; animated: boolean }> = ({ color, animated }) => (
  <svg
    width="72" height="88"
    viewBox="0 0 72 88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      filter: `drop-shadow(0 0 12px ${color}) drop-shadow(0 0 24px ${color}80)`,
      animation: animated ? "robotFloat 2.5s ease-in-out infinite" : "none",
    }}
  >
    {/* Antenna */}
    <line x1="36" y1="4" x2="36" y2="14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="36" cy="3" r="3" fill={color}>
      <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" />
    </circle>

    {/* Head */}
    <rect x="14" y="14" width="44" height="30" rx="8" fill="#0a0f1a" stroke={color} strokeWidth="1.8" />

    {/* Eyes */}
    <ellipse cx="26" cy="29" rx="6" ry="6" fill={color} opacity="0.9">
      <animate attributeName="opacity" values="0.9;0.3;0.9" dur="3s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="46" cy="29" rx="6" ry="6" fill={color} opacity="0.9">
      <animate attributeName="opacity" values="0.9;0.3;0.9" dur="3s" begin="0.5s" repeatCount="indefinite" />
    </ellipse>
    {/* Eye shine */}
    <circle cx="28" cy="27" r="2" fill="white" opacity="0.6" />
    <circle cx="48" cy="27" r="2" fill="white" opacity="0.6" />

    {/* Mouth */}
    <rect x="23" y="37" width="26" height="4" rx="2" fill={color} opacity="0.5" />
    <rect x="26" y="37" width="5" height="4" rx="1" fill={color}>
      <animate attributeName="x" values="26;31;36;31;26" dur="1.8s" repeatCount="indefinite" />
    </rect>

    {/* Neck */}
    <rect x="30" y="44" width="12" height="6" rx="2" fill="#0a0f1a" stroke={color} strokeWidth="1.2" />

    {/* Body */}
    <rect x="10" y="50" width="52" height="32" rx="10" fill="#0a0f1a" stroke={color} strokeWidth="1.8" />

    {/* Chest panel */}
    <rect x="20" y="57" width="32" height="18" rx="5" fill={color} opacity="0.08" stroke={color} strokeWidth="1" />
    {/* Chest lights */}
    <circle cx="28" cy="64" r="3" fill={color} opacity="0.7">
      <animate attributeName="opacity" values="0.7;0.2;0.7" dur="0.9s" repeatCount="indefinite" />
    </circle>
    <circle cx="36" cy="64" r="3" fill={color} opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1.1s" repeatCount="indefinite" />
    </circle>
    <circle cx="44" cy="64" r="3" fill={color} opacity="0.7">
      <animate attributeName="opacity" values="0.7;0.2;0.7" dur="0.7s" repeatCount="indefinite" />
    </circle>
    {/* Signal bars */}
    <rect x="26" y="69" width="3" height="3" rx="1" fill={color} opacity="0.5" />
    <rect x="31" y="67" width="3" height="5" rx="1" fill={color} opacity="0.6" />
    <rect x="36" y="65" width="3" height="7" rx="1" fill={color} opacity="0.8" />
    <rect x="41" y="68" width="3" height="4" rx="1" fill={color} opacity="0.5" />

    {/* Left arm */}
    <rect x="0" y="53" width="10" height="22" rx="5" fill="#0a0f1a" stroke={color} strokeWidth="1.5" />
    <circle cx="5" cy="78" r="4" fill="#0a0f1a" stroke={color} strokeWidth="1.5" />

    {/* Right arm */}
    <rect x="62" y="53" width="10" height="22" rx="5" fill="#0a0f1a" stroke={color} strokeWidth="1.5" />
    <circle cx="67" cy="78" r="4" fill="#0a0f1a" stroke={color} strokeWidth="1.5" />

    {/* Legs */}
    <rect x="19" y="82" width="13" height="6" rx="3" fill="#0a0f1a" stroke={color} strokeWidth="1.5" />
    <rect x="40" y="82" width="13" height="6" rx="3" fill="#0a0f1a" stroke={color} strokeWidth="1.5" />
  </svg>
);

/* ── Typing Effect Hook ─────────────────────────────────────────── */
const useTyping = (text: string, active: boolean, speed = 28) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idxRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!active) {
      setDisplayed("");
      setDone(false);
      idxRef.current = 0;
      clearTimeout(timerRef.current);
      return;
    }
    idxRef.current = 0;
    setDisplayed("");
    setDone(false);

    const type = () => {
      idxRef.current++;
      setDisplayed(text.slice(0, idxRef.current));
      if (idxRef.current < text.length) {
        timerRef.current = setTimeout(type, speed);
      } else {
        setDone(true);
      }
    };
    timerRef.current = setTimeout(type, 400);
    return () => clearTimeout(timerRef.current);
  }, [active, text, speed]);

  return { displayed, done };
};

/* ── Robot Bubble ──────────────────────────────────────────────── */
const RobotBubble: React.FC<{
  visible: boolean;
  text: string;
  color: string;
  glow: string;
  position: "left" | "right";
}> = ({ visible, text, color, glow, position }) => {
  const { displayed, done } = useTyping(text, visible, 22);

  return (
    <div
      style={{
        position: "absolute",
        [position === "right" ? "right" : "left"]: "calc(100% + 16px)",
        top: "50%",
        transform: `translateY(-50%) ${visible ? "scale(1) translateX(0)" : position === "right" ? "scale(0.8) translateX(20px)" : "scale(0.8) translateX(-20px)"}`,
        opacity: visible ? 1 : 0,
        transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        pointerEvents: visible ? "auto" : "none",
        zIndex: 50,
        display: "flex",
        flexDirection: position === "right" ? "row" : "row-reverse",
        alignItems: "flex-start",
        gap: 12,
        width: 280,
      }}
    >
      {/* Robot */}
      <div
        style={{
          flexShrink: 0,
          animation: visible ? "robotFloat 2.5s ease-in-out infinite" : "none",
        }}
      >
        <RobotSVG color={color} animated={visible} />
      </div>

      {/* Speech bubble */}
      <div
        style={{
          background: "rgba(8,13,24,0.96)",
          border: `1px solid ${color}60`,
          borderRadius: 14,
          padding: "12px 14px",
          fontSize: 12,
          lineHeight: 1.65,
          color: "rgba(255,255,255,0.85)",
          fontFamily: "'JetBrains Mono', monospace",
          boxShadow: `0 0 20px ${glow}, inset 0 0 20px rgba(0,0,0,0.5)`,
          backdropFilter: "blur(12px)",
          maxWidth: 190,
          marginTop: 8,
          position: "relative",
        }}
      >
        {/* Bubble arrow */}
        <div style={{
          position: "absolute",
          [position === "right" ? "left" : "right"]: -8,
          top: "50%",
          transform: "translateY(-50%)",
          width: 0,
          height: 0,
          borderTop: "6px solid transparent",
          borderBottom: "6px solid transparent",
          [position === "right" ? "borderRight" : "borderLeft"]: `8px solid ${color}60`,
        }} />
        {/* Header */}
        <div style={{ color, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block", animation: "pulse 1s ease infinite" }} />
          AI ASSISTANT
        </div>
        <div>
          {displayed}
          {!done && (
            <span style={{
              display: "inline-block",
              width: 2,
              height: "1em",
              background: color,
              marginLeft: 2,
              verticalAlign: "middle",
              animation: "blink 0.75s step-end infinite",
            }} />
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Certificate Card ───────────────────────────────────────────── */
const CertCard: React.FC<{ cert: Cert; index: number }> = ({ cert, index }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const active = hovered || clicked;
  // Alternate robot side based on column
  const side: "left" | "right" = index % 2 === 0 ? "right" : "left";

  const handleMouseEnter = () => { clearTimeout(timerRef.current); setHovered(true); };
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setHovered(false), 200);
  };
  const handleClick = () => setClicked(c => !c);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div
      ref={cardRef}
      style={{
        position: "relative",
        animation: `cardEntrance 0.6s ease ${index * 0.1}s both`,
      }}
    >
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{
          background: active
            ? `linear-gradient(135deg, rgba(8,13,24,0.98), rgba(8,13,24,0.95))`
            : "rgba(8,13,24,0.7)",
          border: `1px solid ${active ? cert.color + "80" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 20,
          padding: "24px 26px",
          cursor: "pointer",
          transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: active ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
          boxShadow: active
            ? `0 20px 60px ${cert.glow}, 0 0 0 1px ${cert.color}30, inset 0 0 30px rgba(0,0,0,0.4)`
            : "0 4px 20px rgba(0,0,0,0.4)",
          backdropFilter: "blur(12px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Corner glow */}
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: 120, height: 120,
          background: `radial-gradient(circle at top right, ${cert.color}18, transparent 70%)`,
          pointerEvents: "none",
          opacity: active ? 1 : 0,
          transition: "opacity 0.3s ease",
        }} />

        {/* Scan line animation */}
        {active && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: 20, overflow: "hidden", pointerEvents: "none",
          }}>
            <div style={{
              position: "absolute", left: 0, right: 0, height: 1,
              background: `linear-gradient(90deg, transparent, ${cert.color}60, transparent)`,
              animation: "scanLine 2s linear infinite",
            }} />
          </div>
        )}

        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Icon box */}
            <div style={{
              width: 46, height: 46, borderRadius: 13,
              background: cert.color + "18",
              border: `1px solid ${cert.color}35`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: cert.color,
              boxShadow: active ? `0 0 16px ${cert.glow}` : "none",
              transition: "box-shadow 0.3s ease",
              flexShrink: 0,
            }}>
              {cert.icon}
            </div>
            {/* Badge */}
            <div style={{
              padding: "4px 10px", borderRadius: 8,
              background: cert.color + "15",
              border: `1px solid ${cert.color}30`,
              fontSize: 10, fontWeight: 700, color: cert.color,
              letterSpacing: "0.1em",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {cert.badge}
            </div>
          </div>

          {/* Verified + date */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#00ff88", fontSize: 11 }}>
              <CheckCircle size={12} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>VERIFIED</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
              <Calendar size={11} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{cert.date}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          color: active ? "white" : "rgba(255,255,255,0.85)",
          fontSize: 16, fontWeight: 700, marginBottom: 5, lineHeight: 1.3,
          fontFamily: "'Syne', sans-serif",
          transition: "color 0.2s",
        }}>
          {cert.title}
        </h3>

        {/* Issuer */}
        <p style={{ color: cert.color, fontSize: 12, marginBottom: 14, fontWeight: 500, opacity: 0.9 }}>
          {cert.issuer}
        </p>

        {/* Skills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: cert.url ? 16 : 0 }}>
          {cert.skills.map(sk => (
            <span key={sk} style={{
              padding: "3px 10px", borderRadius: 7,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: 11, color: "rgba(255,255,255,0.5)",
              fontFamily: "'JetBrains Mono', monospace",
              transition: "all 0.2s",
            }}>
              {sk}
            </span>
          ))}
        </div>

        {/* View link */}
        {cert.url && (
          <a
            href={cert.url} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 14px", borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${cert.color}30`,
              fontSize: 12, color: cert.color,
              textDecoration: "none", fontWeight: 600,
              transition: "all 0.2s ease",
              fontFamily: "'JetBrains Mono', monospace",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = cert.color + "18";
              (e.currentTarget as HTMLElement).style.borderColor = cert.color + "60";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLElement).style.borderColor = cert.color + "30";
            }}
          >
            <ExternalLink size={12} />
            View Certificate
          </a>
        )}

        {/* Hover hint */}
        {!active && (
          <div style={{
            position: "absolute", bottom: 14, right: 14,
            fontSize: 10, color: "rgba(255,255,255,0.2)",
            fontFamily: "'JetBrains Mono', monospace",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <span style={{ animation: "pulse 2s ease infinite" }}>◉</span>
            hover for AI insight
          </div>
        )}
      </div>

      {/* Robot bubble — floats outside the card */}
      <RobotBubble
        visible={active}
        text={cert.robotSays}
        color={cert.color}
        glow={cert.glow}
        position={side}
      />
    </div>
  );
};

/* ── Coding Profiles ────────────────────────────────────────────── */
const CodingProfiles: React.FC = () => {
  const profiles = [
    { name: "LeetCode", url: "https://leetcode.com/u/shivam-modi001/", logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png", color: "#FFA116" },
    { name: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/user/smodi9kat/", logo: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_200X200.png", color: "#2F8D46" },
    { name: "CodeChef", url: "https://www.codechef.com/users/shivammodi001", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/CodeChef_Logo.svg", color: "#5b4638" },
  ];

  return (
    <div style={{ marginTop: 70, textAlign: "center" }}>
      <div style={{
        display: "inline-block",
        padding: "4px 16px", borderRadius: 100,
        background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)",
        fontSize: 11, color: "#00d4ff", letterSpacing: "0.14em",
        fontFamily: "'JetBrains Mono', monospace", marginBottom: 12,
      }}>
        ONLINE PRESENCE
      </div>
      <h2 style={{
        fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800,
        color: "white", marginBottom: 32,
      }}>
        Coding Profiles
      </h2>
      <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
        {profiles.map(p => (
          <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
              padding: "20px 28px", borderRadius: 18,
              background: "rgba(8,13,24,0.7)",
              border: "1px solid rgba(255,255,255,0.07)",
              textDecoration: "none",
              transition: "all 0.3s ease",
              minWidth: 130,
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = p.color + "60";
              el.style.transform = "translateY(-6px)";
              el.style.boxShadow = `0 16px 40px rgba(0,0,0,0.5), 0 0 20px ${p.color}30`;
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,255,255,0.07)";
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "none";
            }}
          >
            <img src={p.logo} alt={p.name} style={{ height: 36, objectFit: "contain" }} />
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600 }}>{p.name}</div>
            <div style={{ color: p.color, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", display: "flex", alignItems: "center", gap: 4 }}>
              View Profile <ExternalLink size={9} />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

/* ── Main Page ──────────────────────────────────────────────────── */
const Certifications: React.FC = () => {
  return (
    <div style={{
      background: "#020408",
      minHeight: "100vh",
      paddingTop: 80,
      fontFamily: "'DM Sans', sans-serif",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes robotFloat {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }
        @keyframes scanLine {
          0%   { top: -2px; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(30px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes headerGlow {
          0%, 100% { text-shadow: 0 0 30px rgba(0,212,255,0.3); }
          50%       { text-shadow: 0 0 60px rgba(123,47,247,0.5), 0 0 30px rgba(0,212,255,0.4); }
        }
        @keyframes gridMove {
          0%   { transform: translateY(0); }
          100% { transform: translateY(60px); }
        }

        .neon-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: gridMove 8s linear infinite;
          mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
        }

        .orb-1 {
          position: fixed; width: 500px; height: 500px;
          border-radius: 50%; pointer-events: none; z-index: 0;
          top: -150px; left: -150px;
          background: radial-gradient(circle, rgba(123,47,247,0.12) 0%, transparent 70%);
          filter: blur(40px);
        }
        .orb-2 {
          position: fixed; width: 400px; height: 400px;
          border-radius: 50%; pointer-events: none; z-index: 0;
          bottom: -100px; right: -100px;
          background: radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%);
          filter: blur(40px);
        }
      `}</style>

      {/* Background */}
      <div className="neon-grid" />
      <div className="orb-1" />
      <div className="orb-2" />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 40px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", paddingTop: 40, paddingBottom: 64 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 16px", borderRadius: 100,
            background: "rgba(0,212,255,0.07)", border: "1px solid rgba(0,212,255,0.2)",
            fontSize: 11, color: "#00d4ff", letterSpacing: "0.14em",
            fontFamily: "'JetBrains Mono', monospace", marginBottom: 20,
          }}>
            <Award size={12} />
            RECOGNITION & ACHIEVEMENTS
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(38px, 5vw, 64px)",
            fontWeight: 800, color: "white", lineHeight: 1.1, marginBottom: 16,
            animation: "headerGlow 4s ease-in-out infinite",
          }}>
            Certs &{" "}
            <span style={{
              background: "linear-gradient(135deg, #00d4ff 0%, #7b2ff7 50%, #ff006e 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Wins
            </span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 16, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            Hover any card to summon the AI assistant — it'll explain what each achievement means.
          </p>
        </div>

        {/* Cards grid — extra side padding so robots have space */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
          gap: 20,
          padding: "0 80px",
        }}>
          {CERTS.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} index={i} />
          ))}
        </div>

        {/* Coding profiles */}
        <CodingProfiles />

        {/* Bottom padding */}
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
};

export default Certifications;