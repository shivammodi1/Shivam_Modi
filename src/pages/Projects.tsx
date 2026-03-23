import React, { useRef, useState, useEffect } from "react";
import { ExternalLink, Github, ArrowUpRight, Terminal, Cpu, Globe, Gamepad2, Wrench, Wifi } from "lucide-react";

/* ─── Types ───────────────────────────────────────────────────── */
interface Project {
  id: number;
  title: string;
  description: string;
  longDesc: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  image: string;
  category: string;
  featured?: boolean;
  size?: "wide" | "tall" | "normal";
}

/* ─── Responsive Hook ─────────────────────────────────────────── */
const useBreakpoint = () => {
  const [bp, setBp] = useState<"mobile" | "tablet" | "desktop">("desktop");
  useEffect(() => {
    const update = () => setBp(window.innerWidth < 600 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop");
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return bp;
};

/* ─── Intersection Hook ───────────────────────────────────────── */
const useVisible = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

/* ─── Category config ─────────────────────────────────────────── */
const CAT: Record<string, { color: string; glow: string; icon: React.ReactNode }> = {
  "Full Stack": { color: "#00d4ff", glow: "rgba(0,212,255,0.3)", icon: <Terminal size={13} /> },
  "Real-time":  { color: "#00ff88", glow: "rgba(0,255,136,0.3)", icon: <Wifi size={13} /> },
  "AI/ML":      { color: "#9b6fff", glow: "rgba(123,47,247,0.3)", icon: <Cpu size={13} /> },
  "Frontend":   { color: "#ff4d9e", glow: "rgba(255,0,110,0.3)", icon: <Globe size={13} /> },
  "Game":       { color: "#ffc800", glow: "rgba(255,200,0,0.3)", icon: <Gamepad2 size={13} /> },
  "Utility":    { color: "rgba(255,255,255,0.6)", glow: "rgba(255,255,255,0.15)", icon: <Wrench size={13} /> },
};

/* ─── Project Card ────────────────────────────────────────────── */
const ProjectCard: React.FC<{
  project: Project;
  delay?: number;
  visible: boolean;
  variant?: "featured" | "wide" | "tall" | "normal" | "strip";
}> = ({ project, delay = 0, visible, variant = "normal" }) => {
  const [hovered, setHovered] = useState(false);
  const cat = CAT[project.category] || { color: "#fff", glow: "rgba(255,255,255,0.1)", icon: null };
  const isFeatured = variant === "featured";
  const isStrip = variant === "strip";

  if (isStrip) {
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          flexShrink: 0,
          width: 260,
          background: hovered ? "rgba(12,18,28,0.98)" : "rgba(8,13,20,0.9)",
          border: `1px solid ${hovered ? cat.color + "40" : "rgba(255,255,255,0.06)"}`,
          borderRadius: 18,
          overflow: "hidden",
          transition: "all 0.35s ease",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          boxShadow: hovered ? `0 20px 50px ${cat.glow}` : "none",
          cursor: "pointer",
        }}
      >
        <div style={{ position: "relative", height: 140, overflow: "hidden", background: "rgba(123,47,247,0.08)" }}>
          <img src={project.image} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease", transform: hovered ? "scale(1.08)" : "scale(1)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(2,4,8,0.9) 0%, transparent 60%)", opacity: hovered ? 1 : 0.4, transition: "opacity 0.3s" }} />
          <span style={{ position: "absolute", top: 10, left: 10, display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: cat.color + "20", color: cat.color, fontFamily: "'JetBrains Mono', monospace", border: `1px solid ${cat.color}25` }}>
            {cat.icon} {project.category}
          </span>
        </div>
        <div style={{ padding: "14px 16px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <h3 style={{ color: "white", fontSize: 14, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{project.title}</h3>
            <ArrowUpRight size={13} style={{ color: cat.color, opacity: hovered ? 1 : 0.3, transition: "opacity 0.2s" }} />
          </div>
          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 11.5, lineHeight: 1.6, marginBottom: 12 }}>{project.description.slice(0, 72)}…</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {project.technologies.slice(0, 3).map(t => (
              <span key={t} style={{ padding: "2px 7px", borderRadius: 5, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.97)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        height: "100%",
        borderRadius: isFeatured ? 24 : 20,
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        border: `1px solid ${hovered ? cat.color + "50" : "rgba(255,255,255,0.06)"}`,
        background: "rgba(8,13,20,0.92)",
        transition2: "border-color 0.3s ease, box-shadow 0.3s ease",
        boxShadow: hovered ? `0 28px 80px ${cat.glow}, 0 0 0 1px ${cat.color}20` : "0 4px 24px rgba(0,0,0,0.4)",
      } as React.CSSProperties}
    >
      {/* Image section */}
      <div style={{
        position: "relative",
        height: isFeatured ? "55%" : variant === "tall" ? "50%" : "48%",
        overflow: "hidden",
        background: `radial-gradient(circle at 30% 50%, ${cat.color}12, transparent 70%)`,
      }}>
        <img
          src={project.image}
          alt={project.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", transform: hovered ? "scale(1.07)" : "scale(1)" }}
        />
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,13,20,1) 0%, rgba(8,13,20,0.3) 50%, transparent 100%)" }} />

        {/* Category badge */}
        <span style={{
          position: "absolute", top: 14, left: 14,
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "4px 11px", borderRadius: 8, fontSize: 10.5, fontWeight: 700,
          background: cat.color + "18", color: cat.color,
          fontFamily: "'JetBrains Mono', monospace",
          border: `1px solid ${cat.color}28`,
          backdropFilter: "blur(10px)",
        }}>
          {cat.icon} {project.category}
        </span>

        {/* Action buttons — appear on hover */}
        <div style={{
          position: "absolute", bottom: 14, right: 14,
          display: "flex", gap: 8,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.3s ease",
        }}>
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", textDecoration: "none", transition: "all 0.2s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = cat.color}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"}
          ><Github size={14} /></a>
          {project.liveUrl && project.liveUrl !== "#" && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ width: 34, height: 34, borderRadius: 10, background: cat.color + "25", backdropFilter: "blur(12px)", border: `1px solid ${cat.color}40`, display: "flex", alignItems: "center", justifyContent: "center", color: cat.color, textDecoration: "none", transition: "all 0.2s" }}
            ><ExternalLink size={14} /></a>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: isFeatured ? "22px 26px 26px" : "16px 20px 20px" }}>
        {/* Accent line */}
        <div style={{ width: hovered ? "100%" : "0%", height: 1, background: `linear-gradient(90deg, ${cat.color}, transparent)`, marginBottom: 14, transition: "width 0.5s ease" }} />

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8, gap: 8 }}>
          <h3 style={{
            color: "white", fontWeight: 800,
            fontSize: isFeatured ? "clamp(18px,2.5vw,22px)" : 15,
            fontFamily: "'Syne', sans-serif",
            lineHeight: 1.2,
          }}>{project.title}</h3>
          <ArrowUpRight size={14} style={{ color: cat.color, flexShrink: 0, opacity: hovered ? 1 : 0.3, transition: "opacity 0.2s", marginTop: 2 }} />
        </div>

        <p style={{
          color: "rgba(255,255,255,0.42)",
          fontSize: isFeatured ? 14 : 12.5,
          lineHeight: 1.7,
          marginBottom: 14,
          display: "-webkit-box",
          WebkitLineClamp: isFeatured ? 3 : 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {project.description}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {project.technologies.slice(0, isFeatured ? 5 : 3).map(t => (
            <span key={t} style={{
              padding: "3px 9px", borderRadius: 6,
              background: hovered ? cat.color + "12" : "rgba(255,255,255,0.04)",
              border: `1px solid ${hovered ? cat.color + "25" : "rgba(255,255,255,0.07)"}`,
              fontSize: 10.5, color: hovered ? cat.color : "rgba(255,255,255,0.38)",
              fontFamily: "'JetBrains Mono', monospace",
              transition: "all 0.3s ease",
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Subtle corner glow */}
      <div style={{
        position: "absolute", bottom: 0, right: 0,
        width: 120, height: 120,
        background: `radial-gradient(circle at bottom right, ${cat.color}10, transparent 70%)`,
        pointerEvents: "none",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.4s ease",
      }} />
    </div>
  );
};

/* ─── Main Page ───────────────────────────────────────────────── */
const Projects: React.FC = () => {
  const bp = useBreakpoint();
  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";
  const isDesktop = bp === "desktop";

  const headerVis = useVisible(0.1);
  const bentoVis = useVisible(0.05);
  const stripVis = useVisible(0.1);
  const ctaVis = useVisible(0.1);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const projects: Project[] = [
    { id: 1, title: "FoodHub", description: "Full MERN food ordering platform with authentication, order tracking, and secure payment integration.", longDesc: "", technologies: ["MongoDB", "Express", "React", "Node.js", "Tailwind"], githubUrl: "https://github.com/shivammodi001/FoodHub", liveUrl: "https://foodhub-frontend-yl92.onrender.com/", image: "/foodhub.png", category: "Full Stack", featured: true },
    { id: 2, title: "EliteCode", description: "Online competitive coding platform with problem submission, live judging, and user skill tracking.", longDesc: "", technologies: ["React", "Node.js", "MongoDB", "Express"], githubUrl: "https://github.com/shivammodi001/EliteCode", liveUrl: "#", image: "/elitecode.png", category: "Full Stack" },
    { id: 3, title: "Socket Chat", description: "Real-time chat with WebSockets, multi-user rooms, online presence indicators, and message history.", longDesc: "", technologies: ["React", "Node.js", "Socket.io", "MongoDB"], githubUrl: "https://github.com/shivammodi001/chat-app", liveUrl: "https://chat-app-epcp.onrender.com/", image: "/socket-chat.png", category: "Real-time" },
    { id: 4, title: "Virtual Assistant", description: "AI-powered assistant with voice recognition, text-to-speech, and Gemini AI command handling.", longDesc: "", technologies: ["React", "Express", "MongoDB", "Gemini AI"], githubUrl: "https://github.com/shivammodi001/Virtual-Assistance", liveUrl: "https://virtual-assistance-y2eo.onrender.com/", image: "/virtualAssistant.png", category: "AI/ML" },
    { id: 5, title: "Swiggy Clone", description: "Feature-rich food delivery app with restaurant listings, cart, and checkout — inspired by Swiggy.", longDesc: "", technologies: ["React", "Redux", "Firebase", "Tailwind"], githubUrl: "https://github.com/shivammodi001/Swiggy_Clone", liveUrl: "https://swiggy-clone-orpin.vercel.app/", image: "/swiggy-clone.png", category: "Frontend" },
    { id: 6, title: "YouTube Clone", description: "Video streaming platform replicating YouTube features: search, likes, comments, and responsive UI.", longDesc: "", technologies: ["React", "TypeScript", "YouTube API", "Tailwind"], githubUrl: "https://github.com/shivammodi001", liveUrl: "#", image: "/youtube-clone.png", category: "Frontend" },
    { id: 7, title: "Agri ChatBot", description: "AI chatbot for farmers providing crop tips, weather updates, and farming guidance in regional languages.", longDesc: "", technologies: ["Python", "Flask", "Dialogflow", "MongoDB"], githubUrl: "https://github.com/shivammodi001/Agri_Help", liveUrl: "https://shivammodi001.github.io/Agri_Help/", image: "/agri-chatbot.png", category: "AI/ML" },
    { id: 8, title: "TicTacToe", description: "Multiplayer TicTacToe with interactive animations and smart game logic implementation.", longDesc: "", technologies: ["HTML", "CSS", "JavaScript"], githubUrl: "https://github.com/shivammodi001/TicTacToe", liveUrl: "https://shivammodi001.github.io/TicTacToe/", image: "/tictactoe.png", category: "Game" },
    { id: 9, title: "Calculator", description: "Clean, modern calculator with all arithmetic operations and a polished, responsive interface.", longDesc: "", technologies: ["HTML", "CSS", "JavaScript"], githubUrl: "https://github.com/shivammodi001/Calculator", liveUrl: "https://shivammodi001.github.io/Calculator/", image: "/calculator.png", category: "Utility" },
  ];

  // Auto-scroll strip
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !autoScroll) return;
    const iv = setInterval(() => {
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth) el.scrollLeft = 0;
      else el.scrollLeft += 1;
    }, 18);
    return () => clearInterval(iv);
  }, [autoScroll]);

  const featured = projects[0];
  // Bento grid: projects 1-5 (indices 1..5)
  const bentoProjects = projects.slice(1, 6);
  // Strip: remaining
  const stripProjects = [...projects.slice(6), ...projects.slice(0, 4)];

  return (
    <div style={{ background: "#020408", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", paddingTop: isMobile ? 60 : 80, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

        .sec-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
          color: #00d4ff; margin-bottom: 12px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .sec-label::before,.sec-label::after { content:''; width:24px; height:1px; background:#00d4ff; display:inline-block; }

        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }

        .gh-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 32px; border-radius: 14px;
          background: linear-gradient(135deg, #7b2ff7, #00d4ff);
          color: white; font-weight: 700; font-size: 15px;
          text-decoration: none; transition: all 0.3s ease;
          font-family: 'DM Sans', sans-serif;
          position: relative; overflow: hidden;
        }
        .gh-btn::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,#9b4fff,#00eeff); opacity:0; transition:opacity .3s; }
        .gh-btn:hover::before { opacity:1; }
        .gh-btn:hover { transform:translateY(-2px); box-shadow:0 15px 40px rgba(123,47,247,0.4); }
        .gh-btn > * { position: relative; z-index: 1; }
        @media (hover: none) { .gh-btn:hover { transform:none; box-shadow:none; } }

        /* Animated scan line on featured card */
        @keyframes scan { 0%{top:-2px;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{top:100%;opacity:0} }
        .scan-line { position:absolute; left:0; right:0; height:1px; animation:scan 3s linear infinite; pointer-events:none; z-index:5; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        .hdr-1{animation:fadeUp .8s ease .1s both}
        .hdr-2{animation:fadeUp .8s ease .25s both}
        .hdr-3{animation:fadeUp .8s ease .4s both}

        /* Noise texture overlay */
        .noise-overlay {
          position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.018;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }
      `}</style>

      <div className="noise-overlay" />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: `0 clamp(16px, 4vw, 32px)` }}>

        {/* ── HEADER ── */}
        <div ref={headerVis.ref} style={{ textAlign: "center", paddingTop: isMobile ? 24 : 40, paddingBottom: isMobile ? 40 : 64 }}>
          <div className="sec-label hdr-1">Portfolio</div>
          <h1 className="hdr-2" style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(36px, 7vw, 72px)",
            fontWeight: 900, color: "white",
            marginBottom: 14, lineHeight: 1.0,
            letterSpacing: "-0.02em",
          }}>
            Things I've{" "}
            <span style={{ background: "linear-gradient(135deg, #00d4ff, #7b2ff7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Built
            </span>
          </h1>
          <p className="hdr-3" style={{
            color: "rgba(255,255,255,0.38)",
            fontSize: "clamp(14px, 2vw, 17px)",
            maxWidth: 520, margin: "0 auto",
            lineHeight: 1.75, padding: "0 8px",
          }}>
            Full-stack applications, AI tools, and real-time systems — each one a different problem solved.
          </p>
        </div>

        {/* ══════════════════════════════════════════
            FEATURED + BENTO GRID
        ══════════════════════════════════════════ */}
        <div ref={bentoVis.ref}>

          {/* ── DESKTOP: asymmetric bento grid ── */}
          {isDesktop && (
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gridTemplateRows: "280px 280px", gap: 16, marginBottom: 16 }}>
              {/* Featured — spans 2 rows */}
              <div style={{ gridRow: "1 / 3" }}>
                <ProjectCard project={featured} delay={0} visible={bentoVis.visible} variant="featured" />
              </div>
              {/* 4 bento cards */}
              {bentoProjects.slice(0, 4).map((p, i) => (
                <div key={p.id}>
                  <ProjectCard project={p} delay={0.1 + i * 0.07} visible={bentoVis.visible} variant="normal" />
                </div>
              ))}
            </div>
          )}

          {/* Wide bottom row on desktop */}
          {isDesktop && bentoProjects[4] && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
              {projects.slice(5, 8).map((p, i) => (
                <div key={p.id} style={{ height: 260 }}>
                  <ProjectCard project={p} delay={0.1 + i * 0.08} visible={bentoVis.visible} variant="normal" />
                </div>
              ))}
            </div>
          )}

          {/* ── TABLET: 2-column grid ── */}
          {isTablet && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              {/* Featured spans 2 columns */}
              <div style={{ gridColumn: "1 / 3", height: 320 }}>
                <ProjectCard project={featured} delay={0} visible={bentoVis.visible} variant="featured" />
              </div>
              {projects.slice(1, 7).map((p, i) => (
                <div key={p.id} style={{ height: 260 }}>
                  <ProjectCard project={p} delay={0.05 + i * 0.06} visible={bentoVis.visible} variant="normal" />
                </div>
              ))}
            </div>
          )}

          {/* ── MOBILE: single column ── */}
          {isMobile && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
              {projects.slice(0, 6).map((p, i) => (
                <div key={p.id} style={{ height: p.id === 1 ? 320 : 270 }}>
                  <ProjectCard project={p} delay={0.04 * i} visible={bentoVis.visible} variant={p.id === 1 ? "featured" : "normal"} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════
            SECTION DIVIDER
        ══════════════════════════════════════════ */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, margin: `${isMobile ? 32 : 48}px 0 ${isMobile ? 24 : 36}px` }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(0,212,255,0.15))" }} />
          <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.15em", whiteSpace: "nowrap" }}>MORE PROJECTS</span>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(0,212,255,0.15))" }} />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          HORIZONTAL SCROLL STRIP (full bleed)
      ══════════════════════════════════════════ */}
      <div ref={stripVis.ref} style={{
        opacity: stripVis.visible ? 1 : 0,
        transform: stripVis.visible ? "none" : "translateY(24px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        position: "relative", marginBottom: isMobile ? 40 : 60,
      }}>
        {/* Edge fades */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 60, background: "linear-gradient(to right, #020408, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 60, background: "linear-gradient(to left, #020408, transparent)", zIndex: 2, pointerEvents: "none" }} />

        <div
          ref={scrollRef}
          className="scrollbar-hide"
          style={{ display: "flex", gap: 14, overflowX: "auto", padding: `8px clamp(16px, 4vw, 48px) 20px` }}
          onMouseEnter={() => setAutoScroll(false)}
          onMouseLeave={() => setAutoScroll(true)}
          onTouchStart={() => setAutoScroll(false)}
          onTouchEnd={() => setAutoScroll(true)}
        >
          {[...stripProjects, ...stripProjects].map((p, i) => (
            <ProjectCard key={`${p.id}-${i}`} project={p} delay={0} visible={true} variant="strip" />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: `0 clamp(16px, 4vw, 32px) 80px` }}>
        <div
          ref={ctaVis.ref}
          style={{
            opacity: ctaVis.visible ? 1 : 0,
            transform: ctaVis.visible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
            background: "rgba(8,13,20,0.8)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 24,
            padding: `clamp(36px, 6vw, 60px) clamp(20px, 4vw, 40px)`,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background radial */}
          <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 360, height: 360, background: "radial-gradient(circle, rgba(123,47,247,0.12), transparent 70%)", pointerEvents: "none" }} />
          {/* Accent lines */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.25), transparent)" }} />

          <div className="sec-label" style={{ justifyContent: "center", marginBottom: 16 }}>Open Source</div>
          <h2 style={{
            color: "white", fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(24px, 4vw, 40px)",
            fontWeight: 800, marginBottom: 12, letterSpacing: "-0.02em",
          }}>Want to see more?</h2>
          <p style={{
            color: "rgba(255,255,255,0.38)",
            fontSize: "clamp(13px, 1.8vw, 16px)",
            marginBottom: 32, maxWidth: 440,
            margin: "0 auto 32px", lineHeight: 1.7,
          }}>
            All projects live on GitHub with full source code and documentation.
          </p>
          <a href="https://github.com/shivammodi1" target="_blank" rel="noopener noreferrer" className="gh-btn">
            <Github size={18} />
            Visit GitHub Profile
          </a>
        </div>
      </div>
    </div>
  );
};

export default Projects;