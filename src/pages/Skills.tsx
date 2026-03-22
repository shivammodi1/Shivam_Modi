import React, { useEffect, useRef, useState } from "react";
import { Code2, Database, Globe, Server, Zap, Shield } from "lucide-react";

/* ─── Globe Component ─────────────────────────────────────────── */
const EarthGlobe: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.onload = () => initScene(el);
    document.head.appendChild(script);

    return () => {
      if (sceneRef.current) sceneRef.current.cleanup();
    };
  }, []);

  const initScene = (container: HTMLDivElement) => {
    const THREE = (window as any).THREE;
    const W = container.clientWidth;
    const H = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
    camera.position.set(0, 0, 4.5);

    // ── Earth base ───────────────────────────────────────────────
    const earthGeo = new THREE.SphereGeometry(1.2, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      color: 0x1565c0,
      emissive: 0x0a1a3a,
      specular: 0x4fc3f7,
      shininess: 60,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);

    // Land patches as child meshes so they rotate with the earth
    const landDefs = [
      { lat: 48,  lon: -100, latSpan: 0.50, lonSpan: 0.85 }, // N America
      { lat: 55,  lon: 15,   latSpan: 0.35, lonSpan: 0.50 }, // Europe
      { lat: 5,   lon: 22,   latSpan: 0.70, lonSpan: 0.60 }, // Africa
      { lat: 38,  lon: 90,   latSpan: 0.70, lonSpan: 1.00 }, // Asia
      { lat: -25, lon: 133,  latSpan: 0.40, lonSpan: 0.48 }, // Australia
      { lat: -10, lon: -55,  latSpan: 0.55, lonSpan: 0.42 }, // S America
      { lat: 65,  lon: -30,  latSpan: 0.20, lonSpan: 0.30 }, // Greenland
    ];
    landDefs.forEach(({ lat, lon, latSpan, lonSpan }) => {
      const geo = new THREE.SphereGeometry(
        1.202, 12, 12,
        (lon * Math.PI) / 180, lonSpan,
        Math.PI / 2 - (lat * Math.PI) / 180, latSpan
      );
      const mat = new THREE.MeshPhongMaterial({ color: 0x2e7d32, emissive: 0x0a1f0e, shininess: 5 });
      earth.add(new THREE.Mesh(geo, mat));
    });

    // Atmosphere
    const atmMat = new THREE.MeshPhongMaterial({ color: 0x4fc3f7, transparent: true, opacity: 0.07, side: THREE.BackSide });
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.27, 48, 48), atmMat));

    // Grid lines
    const gridMat = new THREE.MeshBasicMaterial({ color: 0x4fc3f7, wireframe: true, transparent: true, opacity: 0.055 });
    const grid = new THREE.Mesh(new THREE.SphereGeometry(1.21, 18, 12), gridMat);
    scene.add(grid);

    // ── Skill Orbits ─────────────────────────────────────────────
    const skillsData = [
      { label: "React",      color: 0x61dafb, radius: 2.0, speed: 0.008, tilt: 0.30,  phase: 0.0  },
      { label: "Node.js",    color: 0x68a063, radius: 2.35,speed: 0.006, tilt: 0.80,  phase: 1.05 },
      { label: "MongoDB",    color: 0x4db33d, radius: 2.65,speed: 0.005, tilt: -0.40, phase: 2.10 },
      { label: "Python",     color: 0xffdd57, radius: 2.15,speed: 0.007, tilt: -0.90, phase: 0.70 },
      { label: "TypeScript", color: 0x3178c6, radius: 2.45,speed: 0.009, tilt: 0.60,  phase: 3.50 },
      { label: "Express",    color: 0xcccccc, radius: 2.25,speed: 0.006, tilt: 1.10,  phase: 1.80 },
      { label: "MySQL",      color: 0x00758f, radius: 2.70,speed: 0.004, tilt: -0.20, phase: 4.20 },
      { label: "Tailwind",   color: 0x38bdf8, radius: 2.05,speed: 0.010, tilt: 1.50,  phase: 5.00 },
      { label: "C++",        color: 0xa855f7, radius: 2.55,speed: 0.005, tilt: -1.20, phase: 2.80 },
      { label: "Git",        color: 0xf05032, radius: 2.30,speed: 0.007, tilt: 0.40,  phase: 3.90 },
      { label: "Linux",      color: 0xfbbf24, radius: 2.60,speed: 0.006, tilt: -0.70, phase: 0.30 },
      { label: "AWS",        color: 0xff9900, radius: 2.15,speed: 0.008, tilt: 1.00,  phase: 5.60 },
    ];

    // Canvas label sprite maker
    const makeSprite = (text: string, color: number) => {
      const cv = document.createElement("canvas");
      cv.width = 220; cv.height = 56;
      const ctx = cv.getContext("2d")!;
      const hex = "#" + color.toString(16).padStart(6, "0");

      ctx.clearRect(0, 0, 220, 56);
      ctx.beginPath();
      const r = 10;
      ctx.moveTo(r, 3); ctx.lineTo(217 - r, 3);
      ctx.quadraticCurveTo(217, 3, 217, 3 + r);
      ctx.lineTo(217, 53 - r);
      ctx.quadraticCurveTo(217, 53, 217 - r, 53);
      ctx.lineTo(r, 53);
      ctx.quadraticCurveTo(3, 53, 3, 53 - r);
      ctx.lineTo(3, 3 + r);
      ctx.quadraticCurveTo(3, 3, r, 3);
      ctx.closePath();
      ctx.fillStyle = "rgba(8,13,20,0.9)";
      ctx.fill();
      ctx.strokeStyle = hex;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(22, 28, 5, 0, Math.PI * 2);
      ctx.fillStyle = hex;
      ctx.shadowColor = hex;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 19px Arial, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 36, 28);

      const tex = new THREE.CanvasTexture(cv);
      tex.needsUpdate = true;
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(0.95, 0.24, 1);
      return sprite;
    };

    const orbitNodes = skillsData.map((s) => {
      // Orbit ring
      const ringGeo = new THREE.TorusGeometry(s.radius, 0.004, 8, 128);
      const ringMat = new THREE.MeshBasicMaterial({ color: s.color, transparent: true, opacity: 0.12 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = s.tilt;
      ring.rotation.z = s.phase * 0.25;
      scene.add(ring);

      // Node sphere
      const nodeMat = new THREE.MeshPhongMaterial({ color: s.color, emissive: s.color, emissiveIntensity: 0.55, shininess: 120 });
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.058, 16, 16), nodeMat);
      scene.add(node);

      // Label
      const label = makeSprite(s.label, s.color);
      scene.add(label);

      return { ...s, ring, node, label, angle: s.phase };
    });

    // ── Lights ───────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x334466, 1.1));
    const sun = new THREE.DirectionalLight(0xfff5e0, 2.0);
    sun.position.set(5, 3, 5);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x4fc3f7, 0.45);
    rim.position.set(-4, -2, -3);
    scene.add(rim);

    // ── Drag Controls ────────────────────────────────────────────
    let dragging = false;
    let prev = { x: 0, y: 0 };
    let vel = { x: 0, y: 0 };
    let autoSpin = true;

    const down = (cx: number, cy: number) => { dragging = true; autoSpin = false; prev = { x: cx, y: cy }; vel = { x: 0, y: 0 }; };
    const move = (cx: number, cy: number) => {
      if (!dragging) return;
      vel.x = (cy - prev.y) * 0.003;
      vel.y = (cx - prev.x) * 0.003;
      prev = { x: cx, y: cy };
    };
    const up = () => { dragging = false; };

    const el2 = container;
    el2.addEventListener("mousedown",  (e) => down(e.clientX, e.clientY));
    window.addEventListener("mousemove", (e) => move(e.clientX, e.clientY));
    window.addEventListener("mouseup",  up);
    el2.addEventListener("touchstart", (e) => down(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    window.addEventListener("touchmove",  (e) => move(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    window.addEventListener("touchend",  up);

    // ── Animation ────────────────────────────────────────────────
    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);

      if (autoSpin) {
        earth.rotation.y += 0.0025;
        grid.rotation.y  += 0.0025;
      } else {
        earth.rotation.x += vel.x; earth.rotation.y += vel.y;
        grid.rotation.x  += vel.x; grid.rotation.y  += vel.y;
        vel.x *= 0.93; vel.y *= 0.93;
        if (Math.abs(vel.x) < 0.00008 && Math.abs(vel.y) < 0.00008) autoSpin = true;
      }

      const t = Date.now() * 0.001;
      orbitNodes.forEach((s) => {
        s.angle += s.speed;
        // Tilted orbit math
        const cosT = Math.cos(s.tilt), sinT = Math.sin(s.tilt);
        const x0 = Math.cos(s.angle) * s.radius;
        const z0 = Math.sin(s.angle) * s.radius;
        const x = x0;
        const y = z0 * sinT;
        const z = z0 * cosT;

        s.node.position.set(x, y, z);
        s.label.position.set(x, y + 0.20, z);
        (s.node.material as any).emissiveIntensity = 0.4 + 0.45 * Math.sin(t * 2 + s.phase);
      });

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    sceneRef.current = {
      cleanup: () => {
        cancelAnimationFrame(raf);
        try { renderer.dispose(); container.removeChild(renderer.domElement); } catch {}
        window.removeEventListener("mousemove", (e) => move(e.clientX, e.clientY));
        window.removeEventListener("mouseup", up);
        window.removeEventListener("touchmove", (e) => move(e.touches[0].clientX, e.touches[0].clientY));
        window.removeEventListener("touchend", up);
        window.removeEventListener("resize", onResize);
      },
    };
  };

  return (
    <div ref={mountRef} style={{ width: "100%", height: "100%", cursor: "grab" }} />
  );
};

/* ─── Main Page ────────────────────────────────────────────────── */
const Skills: React.FC = () => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [animatedBars, setAnimatedBars] = useState(false);
  const barsRef = useRef<HTMLDivElement>(null);

  const observeRef = (id: string) => (el: HTMLElement | null) => {
    if (!el) return;
    new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisibleSections(prev => new Set([...prev, id])); },
      { threshold: 0.1 }
    ).observe(el);
  };

  useEffect(() => {
    const el = barsRef.current;
    if (!el) return;
    new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimatedBars(true); }, { threshold: 0.2 }).observe(el);
  }, []);

  const vis = (id: string) => visibleSections.has(id);

  const skillCategories = [
    { title: "Frontend",      icon: <Globe    size={18} />, color: "#00d4ff", skills: ["HTML5","CSS3","JavaScript","TypeScript","React","Tailwind CSS"] },
    { title: "Backend",       icon: <Server   size={18} />, color: "#7b2ff7", skills: ["Node.js","Express.js","Python","REST APIs"] },
    { title: "Databases",     icon: <Database size={18} />, color: "#00ff88", skills: ["MongoDB","MySQL","Mongoose"] },
    { title: "Languages",     icon: <Code2    size={18} />, color: "#ff006e", skills: ["JavaScript","TypeScript","Python","C","C++"] },
    { title: "Tools & Cloud", icon: <Zap      size={18} />, color: "#ffc800", skills: ["Git","VS Code","AWS Basics","Render","Vercel","Netlify"] },
    { title: "Security & OS", icon: <Shield   size={18} />, color: "#ff6b6b", skills: ["Linux/Ubuntu","Cybersecurity","Kali Linux"] },
  ];

  const proficiencies = [
    { skill: "Frontend (React, JS, Tailwind)",       level: 90, color: "#00d4ff" },
    { skill: "Backend (Node, Express, Python)",      level: 80, color: "#7b2ff7" },
    { skill: "Databases (MongoDB, MySQL)",           level: 75, color: "#00ff88" },
    { skill: "Programming Languages (C, C++, Python)",level:85, color: "#ff006e" },
    { skill: "TypeScript",                           level: 70, color: "#ffc800" },
    { skill: "Cloud & DevTools (AWS, Git, Vercel)",  level: 65, color: "#9b6fff" },
    { skill: "Linux & Cybersecurity",               level: 60, color: "#ff6b6b" },
  ];

  const learning = [
    { tech: "Next.js",     desc: "Full-stack React framework for production apps 🚀", icon: "⚡" },
    { tech: "DSA",         desc: "Mastering algorithms & problem-solving 💡",          icon: "🧩" },
    { tech: "Blockchain",  desc: "Exploring Web3 & decentralized apps 🔗",             icon: "🔮" },
  ];

  const orbitLegend = [
    { label: "React",      color: "#61dafb" }, { label: "Node.js",   color: "#68a063" },
    { label: "MongoDB",    color: "#4db33d" }, { label: "Python",    color: "#ffdd57" },
    { label: "TypeScript", color: "#3178c6" }, { label: "Express",   color: "#cccccc" },
    { label: "MySQL",      color: "#00758f" }, { label: "Tailwind",  color: "#38bdf8" },
    { label: "C++",        color: "#a855f7" }, { label: "Git",       color: "#f05032" },
    { label: "Linux",      color: "#fbbf24" }, { label: "AWS",       color: "#ff9900" },
  ];

  return (
    <div style={{ background: "#020408", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", paddingTop: 80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        .s-rev { opacity:0; transform:translateY(30px); transition:opacity .7s ease,transform .7s ease; }
        .s-rev.show { opacity:1; transform:translateY(0); }

        .globe-wrap {
          position: relative;
          height: 580px;
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.05);
          overflow: hidden;
          background: radial-gradient(ellipse at 50% 60%, rgba(123,47,247,0.1) 0%, rgba(0,212,255,0.05) 40%, transparent 70%);
        }

        .star-field {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            radial-gradient(1px 1px at  8% 15%, rgba(255,255,255,.7) 0%, transparent 100%),
            radial-gradient(1px 1px at 22% 55%, rgba(255,255,255,.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 38%  8%, rgba(255,255,255,.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 51% 70%, rgba(255,255,255,.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 67% 28%, rgba(255,255,255,.7) 0%, transparent 100%),
            radial-gradient(1px 1px at 79% 82%, rgba(255,255,255,.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 91% 42%, rgba(255,255,255,.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 14% 88%, rgba(255,255,255,.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 45% 35%, rgba(255,255,255,.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 58% 92%, rgba(255,255,255,.7) 0%, transparent 100%),
            radial-gradient(1px 1px at 73%  5%, rgba(255,255,255,.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 84% 63%, rgba(255,255,255,.6) 0%, transparent 100%),
            radial-gradient(1px 1px at  3% 47%, rgba(255,255,255,.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 96% 20%, rgba(255,255,255,.7) 0%, transparent 100%),
            radial-gradient(1px 1px at 30% 75%, rgba(255,255,255,.4) 0%, transparent 100%);
        }

        .globe-canvas { position:relative; z-index:1; width:100%; height:100%; }

        .globe-vignette {
          position:absolute; inset:0; z-index:2; pointer-events:none;
          background: radial-gradient(ellipse at center, transparent 50%, rgba(2,4,8,.75) 100%);
        }

        .drag-hint {
          position:absolute; bottom:18px; left:50%; transform:translateX(-50%);
          background:rgba(0,212,255,.07); border:1px solid rgba(0,212,255,.18);
          border-radius:100px; padding:5px 16px;
          font-size:11px; color:rgba(0,212,255,.7);
          font-family:'JetBrains Mono',monospace; pointer-events:none;
          white-space:nowrap; z-index:3;
          animation: drift-out 1s ease 4s forwards;
        }
        @keyframes drift-out { to { opacity:0; } }

        .cat-card {
          background:rgba(8,13,20,.8);
          border:1px solid rgba(255,255,255,.06);
          border-radius:20px; padding:24px;
          transition:all .35s ease;
          position:relative; overflow:hidden;
        }
        .cat-card::after {
          content:''; position:absolute; top:0; left:0; right:0; height:1px;
          background:var(--cc,#00d4ff); opacity:.4;
          transform:scaleX(0); transform-origin:left; transition:transform .4s ease;
        }
        .cat-card:hover::after { transform:scaleX(1); }
        .cat-card:hover { border-color:rgba(255,255,255,.1); transform:translateY(-5px); box-shadow:0 25px 60px rgba(0,0,0,.5); }

        .s-pill {
          padding:6px 12px; border-radius:9px; font-size:12px; font-weight:500;
          font-family:'JetBrains Mono',monospace; cursor:default;
          transition:all .25s ease;
        }
        .s-pill:hover { color:white!important; transform:scale(1.06); filter:brightness(1.35); }

        .bar-track { width:100%; height:5px; background:rgba(255,255,255,.06); border-radius:100px; overflow:hidden; }
        .bar-fill   { height:100%; border-radius:100px; width:0%; transition:width 1.2s cubic-bezier(.25,.46,.45,.94); }

        .flip-card  { perspective:1000px; width:155px; height:155px; }
        .flip-inner { position:relative; width:100%; height:100%; transform-style:preserve-3d; transition:transform .7s cubic-bezier(.175,.885,.32,1.275); }
        .flip-card:hover .flip-inner { transform:rotateY(180deg); }
        .flip-f,.flip-b {
          position:absolute; inset:0; border-radius:18px; backface-visibility:hidden;
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px;
        }
        .flip-f { background:linear-gradient(135deg,rgba(123,47,247,.18),rgba(0,212,255,.12)); border:1px solid rgba(0,212,255,.12); }
        .flip-b { background:rgba(8,13,20,.95); border:1px solid rgba(0,212,255,.2); transform:rotateY(180deg); padding:16px; text-align:center; }

        .sec-lbl {
          font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.15em;
          text-transform:uppercase; color:#00d4ff; margin-bottom:12px;
          display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .sec-lbl::before,.sec-lbl::after { content:''; display:inline-block; width:20px; height:1px; background:#00d4ff; }

        .st1{transition-delay:.05s!important} .st2{transition-delay:.10s!important}
        .st3{transition-delay:.15s!important} .st4{transition-delay:.20s!important}
        .st5{transition-delay:.25s!important} .st6{transition-delay:.30s!important}
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>

        {/* Header */}
        <div ref={observeRef("h")} className={`s-rev ${vis("h") ? "show" : ""}`}
          style={{ textAlign: "center", paddingTop: 40, paddingBottom: 52 }}>
          <div className="sec-lbl">Capabilities</div>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(40px,5vw,68px)", fontWeight: 800, color: "white", marginBottom: 14, lineHeight: 1.1 }}>
            Skills &{" "}
            <span style={{ background: "linear-gradient(135deg,#00d4ff,#7b2ff7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Expertise</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,.4)", fontSize: 17, maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
            A full-stack toolkit spanning frontend to backend — orbiting my world. Drag the globe to explore.
          </p>
        </div>

        {/* ── 3D Earth Globe ── */}
        <div ref={observeRef("globe")} className={`s-rev ${vis("globe") ? "show" : ""}`} style={{ marginBottom: 68 }}>
          <div className="sec-lbl" style={{ marginBottom: 24 }}>Interactive Globe</div>

          <div className="globe-wrap">
            <div className="star-field" />
            <div className="globe-canvas"><EarthGlobe /></div>
            <div className="globe-vignette" />
          </div>

          {/* Legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center", marginTop: 18 }}>
            {orbitLegend.map(s => (
              <span key={s.label} style={{
                padding: "4px 11px", borderRadius: 100,
                background: s.color + "15", border: `1px solid ${s.color}30`,
                fontSize: 11, color: s.color, fontFamily: "'JetBrains Mono',monospace", fontWeight: 500,
              }}>{s.label}</span>
            ))}
          </div>
        </div>

        {/* Skill Category Cards */}
        <div ref={observeRef("cats")} style={{ marginBottom: 68 }}>
          <div className="sec-lbl" style={{ marginBottom: 28 }}>By Category</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {skillCategories.map((cat, i) => (
              <div key={cat.title}
                className={`cat-card st${i + 1} s-rev ${vis("cats") ? "show" : ""}`}
                style={{ "--cc": cat.color } as React.CSSProperties}>
                <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 16 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: cat.color + "18", display: "flex", alignItems: "center", justifyContent: "center", color: cat.color }}>{cat.icon}</div>
                  <h3 style={{ color: "white", fontSize: 15, fontWeight: 700 }}>{cat.title}</h3>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {cat.skills.map(skill => (
                    <div key={skill} className="s-pill" style={{ background: cat.color + "12", border: `1px solid ${cat.color}25`, color: cat.color + "bb" }}>{skill}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Proficiency Bars */}
        <div ref={barsRef} style={{ marginBottom: 68 }}>
          <div ref={observeRef("bars")} className={`s-rev ${vis("bars") ? "show" : ""}`} style={{ textAlign: "center", marginBottom: 32 }}>
            <div className="sec-lbl">Proficiency</div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 34, fontWeight: 800, color: "white" }}>Skill Levels</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 48px", maxWidth: 900, margin: "0 auto" }}>
            {proficiencies.map((item, i) => (
              <div key={item.skill} className={`s-rev ${vis("bars") ? "show" : ""}`} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "rgba(255,255,255,.65)", fontSize: 13, fontWeight: 500 }}>{item.skill}</span>
                  <span style={{ color: item.color, fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{item.level}%</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: animatedBars ? `${item.level}%` : "0%", background: `linear-gradient(90deg,${item.color}70,${item.color})`, transitionDelay: `${i * 0.1 + 0.3}s` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Currently Learning */}
        <div ref={observeRef("learn")} className={`s-rev ${vis("learn") ? "show" : ""}`} style={{ textAlign: "center", paddingBottom: 90 }}>
          <div className="sec-lbl">In Progress</div>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 34, fontWeight: 800, color: "white", marginBottom: 32 }}>Currently Learning</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            {learning.map((item, i) => (
              <div key={item.tech} className="flip-card" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="flip-inner">
                  <div className="flip-f">
                    <div style={{ fontSize: 28 }}>{item.icon}</div>
                    <div style={{ color: "white", fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk',sans-serif" }}>{item.tech}</div>
                    <div style={{ color: "rgba(255,255,255,.25)", fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }}>hover to flip</div>
                  </div>
                  <div className="flip-b">
                    <div style={{ color: "#00d4ff", fontSize: 12, lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Skills;