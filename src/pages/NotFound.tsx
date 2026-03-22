import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Home as HomeIcon, ArrowLeft, Compass } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const [glitchActive, setGlitchActive] = useState(false);
  const [scanPos, setScanPos] = useState(0);
  const [particles, setParticles] = useState<Array<{id:number;x:number;y:number;size:number;color:string;vx:number;vy:number;life:number}>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  // Glitch timer
  useEffect(() => {
    const trigger = () => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 300);
    };
    trigger();
    const interval = setInterval(trigger, 3500);
    return () => clearInterval(interval);
  }, []);

  // Scan line
  useEffect(() => {
    const interval = setInterval(() => {
      setScanPos(p => (p + 1) % 100);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const pts: Array<{x:number;y:number;vx:number;vy:number;life:number;maxLife:number;size:number;color:string}> = [];
    const colors = ["#00d4ff", "#7b2ff7", "#ff006e", "#00ff88"];

    for (let i = 0; i < 60; i++) {
      pts.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        life: Math.random() * 200, maxLife: 200,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.life--;
        if (p.life <= 0) {
          pts[i] = {
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
            life: 200, maxLife: 200, size: Math.random() * 2 + 0.5,
            color: colors[Math.floor(Math.random() * colors.length)],
          };
        }
        const alpha = (p.life / p.maxLife) * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
        // Connect nearby
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[j].x - p.x, dy = pts[j].y - p.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,212,255,${0.04 * (1 - dist/100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, []);

  const navLinks = [
    { name: "About",    path: "/about",    color: "#00d4ff" },
    { name: "Projects", path: "/projects", color: "#7b2ff7" },
    { name: "Skills",   path: "/skills",   color: "#00ff88" },
    { name: "Contact",  path: "/contact",  color: "#ff006e" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "#020408",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');

        @keyframes glitch1 {
          0%,100%{clip-path:inset(0 0 98% 0);transform:translate(-4px,0)}
          20%{clip-path:inset(20% 0 60% 0);transform:translate(4px,0)}
          40%{clip-path:inset(50% 0 30% 0);transform:translate(-2px,0)}
          60%{clip-path:inset(80% 0 5% 0);transform:translate(3px,0)}
          80%{clip-path:inset(10% 0 85% 0);transform:translate(-3px,0)}
        }
        @keyframes glitch2 {
          0%,100%{clip-path:inset(60% 0 10% 0);transform:translate(4px,0)}
          20%{clip-path:inset(5% 0 80% 0);transform:translate(-4px,0)}
          40%{clip-path:inset(30% 0 50% 0);transform:translate(2px,0)}
          60%{clip-path:inset(90% 0 2% 0);transform:translate(-3px,0)}
          80%{clip-path:inset(40% 0 40% 0);transform:translate(4px,0)}
        }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseGlow { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes scanMove { 0%{top:0%} 100%{top:100%} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(110px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(110px) rotate(-360deg); }
        }
        @keyframes orbit2 {
          from { transform: rotate(180deg) translateX(140px) rotate(-180deg); }
          to   { transform: rotate(540deg) translateX(140px) rotate(-540deg); }
        }
        @keyframes orbit3 {
          from { transform: rotate(90deg) translateX(165px) rotate(-90deg); }
          to   { transform: rotate(450deg) translateX(165px) rotate(-450deg); }
        }
        @keyframes gridPulse {
          0%,100%{opacity:0.4} 50%{opacity:0.7}
        }

        .four04-base {
          font-family:'Syne',sans-serif;
          font-size:clamp(120px,18vw,200px);
          font-weight:800;
          color:#020408;
          -webkit-text-stroke:1.5px rgba(0,212,255,0.4);
          line-height:1;
          position:relative;
          display:inline-block;
          user-select:none;
        }
        .four04-glow {
          position:absolute;inset:0;
          background:linear-gradient(135deg,#00d4ff,#7b2ff7,#ff006e);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
          opacity:0.15;
        }
        .glitch-layer-1 {
          position:absolute;inset:0;
          font-family:'Syne',sans-serif;
          font-size:clamp(120px,18vw,200px);
          font-weight:800;
          color:#00d4ff;
          animation:glitch1 0.3s linear;
          pointer-events:none;
        }
        .glitch-layer-2 {
          position:absolute;inset:0;
          font-family:'Syne',sans-serif;
          font-size:clamp(120px,18vw,200px);
          font-weight:800;
          color:#ff006e;
          animation:glitch2 0.3s linear;
          pointer-events:none;
        }
        .nav-pill {
          display:inline-flex;align-items:center;gap:6px;
          padding:9px 18px;border-radius:12px;
          font-size:13px;font-weight:600;
          text-decoration:none;
          transition:all 0.25s ease;
          font-family:'DM Sans',sans-serif;
          position:relative;overflow:hidden;
        }
        .nav-pill::before {
          content:'';position:absolute;inset:0;opacity:0;
          transition:opacity 0.25s;
        }
        .nav-pill:hover::before{opacity:1;}
        .nav-pill:hover{transform:translateY(-3px);}
        .nav-pill span{position:relative;z-index:1;}

        .btn-home {
          display:inline-flex;align-items:center;gap:10px;
          padding:14px 32px;border-radius:14px;
          background:linear-gradient(135deg,#7b2ff7,#00d4ff);
          color:white;font-weight:700;font-size:15px;
          text-decoration:none;
          transition:all 0.3s ease;
          border:none;cursor:pointer;
          position:relative;overflow:hidden;
          font-family:'DM Sans',sans-serif;
        }
        .btn-home::before{
          content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,#9b4fff,#00eeff);
          opacity:0;transition:opacity 0.3s;
        }
        .btn-home:hover::before{opacity:1;}
        .btn-home:hover{transform:translateY(-3px);box-shadow:0 14px 40px rgba(123,47,247,0.45);}
        .btn-home>*{position:relative;z-index:1;}

        .btn-back {
          display:inline-flex;align-items:center;gap:10px;
          padding:13px 28px;border-radius:14px;
          background:transparent;
          border:1px solid rgba(255,255,255,0.12);
          color:rgba(255,255,255,0.7);font-weight:600;font-size:15px;
          cursor:pointer;
          transition:all 0.25s ease;
          font-family:'DM Sans',sans-serif;
        }
        .btn-back:hover{
          border-color:rgba(0,212,255,0.4);
          color:#00d4ff;
          background:rgba(0,212,255,0.06);
          transform:translateY(-2px);
        }
      `}</style>

      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }} />

      {/* Grid */}
      <div style={{
        position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
        backgroundImage:"linear-gradient(rgba(0,212,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.025) 1px,transparent 1px)",
        backgroundSize:"60px 60px",
        animation:"gridPulse 4s ease infinite",
      }} />

      {/* Ambient orbs */}
      <div style={{ position:"fixed", top:-200, left:-200, width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(123,47,247,0.1) 0%,transparent 70%)", filter:"blur(60px)", zIndex:0, pointerEvents:"none" }} />
      <div style={{ position:"fixed", bottom:-100, right:-100, width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(0,212,255,0.08) 0%,transparent 70%)", filter:"blur(60px)", zIndex:0, pointerEvents:"none" }} />

      {/* Main content */}
      <div style={{ position:"relative", zIndex:1, textAlign:"center", padding:"40px 32px", maxWidth:700, width:"100%" }}>

        {/* Error badge */}
        <div style={{
          display:"inline-flex", alignItems:"center", gap:8,
          padding:"5px 16px", borderRadius:100,
          background:"rgba(255,0,110,0.08)", border:"1px solid rgba(255,0,110,0.25)",
          fontSize:11, color:"#ff006e", letterSpacing:"0.14em",
          fontFamily:"'JetBrains Mono',monospace", marginBottom:32,
          animation:"fadeUp 0.6s ease both",
        }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:"#ff006e", display:"inline-block", animation:"blink 1s ease infinite" }} />
          SYSTEM ERROR · 404
        </div>

        {/* Giant 404 with glitch */}
        <div style={{ position:"relative", display:"inline-block", marginBottom:8, animation:"fadeUp 0.6s ease 0.1s both" }}>
          {/* Orbit rings decoration */}
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
            <div style={{ position:"relative", width:0, height:0 }}>
              {/* Ring 1 */}
              <div style={{ position:"absolute", width:220, height:220, borderRadius:"50%", border:"1px solid rgba(0,212,255,0.08)", top:-110, left:-110 }} />
              <div style={{ position:"absolute", width:280, height:280, borderRadius:"50%", border:"1px dashed rgba(123,47,247,0.06)", top:-140, left:-140 }} />
              <div style={{ position:"absolute", width:340, height:340, borderRadius:"50%", border:"1px solid rgba(0,212,255,0.04)", top:-170, left:-170 }} />
              {/* Orbiting dots */}
              <div style={{ position:"absolute", top:0, left:0, width:10, height:10, borderRadius:"50%", background:"#00d4ff", boxShadow:"0 0 12px #00d4ff", marginTop:-5, marginLeft:-5, animation:"orbit 6s linear infinite" }} />
              <div style={{ position:"absolute", top:0, left:0, width:8, height:8, borderRadius:"50%", background:"#7b2ff7", boxShadow:"0 0 10px #7b2ff7", marginTop:-4, marginLeft:-4, animation:"orbit2 9s linear infinite" }} />
              <div style={{ position:"absolute", top:0, left:0, width:6, height:6, borderRadius:"50%", background:"#ff006e", boxShadow:"0 0 8px #ff006e", marginTop:-3, marginLeft:-3, animation:"orbit3 12s linear infinite" }} />
            </div>
          </div>

          {/* 404 text */}
          <div className="four04-base">
            404
            <div className="four04-glow">404</div>
            {glitchActive && <div className="glitch-layer-1">404</div>}
            {glitchActive && <div className="glitch-layer-2">404</div>}
          </div>
        </div>

        {/* Scan line */}
        <div style={{
          position:"absolute", left:"50%", transform:"translateX(-50%)",
          width:300, height:2,
          background:"linear-gradient(90deg,transparent,rgba(0,212,255,0.5),transparent)",
          top:`${scanPos}%`, pointerEvents:"none", opacity:0.6,
          transition:"top 0.016s linear",
        }} />

        {/* Headings */}
        <h2 style={{
          fontFamily:"'Syne',sans-serif", fontSize:"clamp(24px,4vw,38px)", fontWeight:800,
          color:"white", marginBottom:12,
          animation:"fadeUp 0.6s ease 0.2s both",
        }}>
          Page Not Found
        </h2>

        <p style={{
          color:"rgba(255,255,255,0.38)", fontSize:16, maxWidth:420, margin:"0 auto 40px",
          lineHeight:1.75,
          animation:"fadeUp 0.6s ease 0.3s both",
          fontFamily:"'DM Sans',sans-serif",
        }}>
          The coordinates you entered don't exist in this universe. The page may have drifted into the void.
        </p>

        {/* Glitch path display */}
        <div style={{
          display:"inline-flex", alignItems:"center", gap:8,
          padding:"8px 18px", borderRadius:10,
          background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
          fontSize:13, color:"rgba(255,255,255,0.3)",
          fontFamily:"'JetBrains Mono',monospace", marginBottom:36,
          animation:"fadeUp 0.6s ease 0.35s both",
        }}>
          <Compass size={14} style={{ color:"#ff006e" }} />
          <span style={{ color:"#ff006e" }}>404</span>
          <span style={{ opacity:0.4 }}> · </span>
          <span>{location.pathname}</span>
          <span style={{ opacity:0.4 }}> not found</span>
        </div>

        {/* CTA buttons */}
        <div style={{
          display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginBottom:48,
          animation:"fadeUp 0.6s ease 0.4s both",
        }}>
          <Link to="/" className="btn-home">
            <HomeIcon size={17} />
            <span>Go Home</span>
          </Link>
          <button className="btn-back" onClick={() => window.history.back()}>
            <ArrowLeft size={17} />
            Go Back
          </button>
        </div>

        {/* Divider */}
        <div style={{
          display:"flex", alignItems:"center", gap:16, marginBottom:28,
          animation:"fadeUp 0.6s ease 0.5s both",
        }}>
          <div style={{ flex:1, height:1, background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.07))" }} />
          <span style={{ color:"rgba(255,255,255,0.2)", fontSize:12, fontFamily:"'JetBrains Mono',monospace", letterSpacing:"0.1em" }}>
            OR EXPLORE
          </span>
          <div style={{ flex:1, height:1, background:"linear-gradient(90deg,rgba(255,255,255,0.07),transparent)" }} />
        </div>

        {/* Nav links */}
        <div style={{
          display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center",
          animation:"fadeUp 0.6s ease 0.55s both",
        }}>
          {navLinks.map((link, i) => (
            <Link
              key={link.path}
              to={link.path}
              className="nav-pill"
              style={{
                background: link.color + "12",
                border: `1px solid ${link.color}30`,
                color: link.color,
                animationDelay: `${0.55 + i * 0.06}s`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = link.color + "22";
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${link.color}25`;
                (e.currentTarget as HTMLElement).style.borderColor = link.color + "60";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = link.color + "12";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.borderColor = link.color + "30";
              }}
            >
              <span style={{ width:6, height:6, borderRadius:"50%", background:link.color, display:"inline-block" }} />
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        {/* Footer hint */}
        <p style={{
          marginTop:48, color:"rgba(255,255,255,0.12)",
          fontSize:11, fontFamily:"'JetBrains Mono',monospace", letterSpacing:"0.08em",
          animation:"fadeUp 0.6s ease 0.7s both",
        }}>
          SHIVAM MODI · PORTFOLIO · v2.0
        </p>
      </div>
    </div>
  );
};

export default NotFound;