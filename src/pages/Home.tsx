import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Download, Github, Linkedin, Mail, Code2, Layers, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Chatbot from "@/components/Chatbot";
import Loader from "@/components/Loader"; // Loader import karo

const Home: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showLoader, setShowLoader] = useState(true); // Loader state
  const roles = ["Full-Stack Developer", "Problem Solver", "UI Architect", "Open Source Contributor"];
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  
  useEffect(() => {
    if (showLoader) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string;
    }> = [];

    const colors = ["#00d4ff", "#7b2ff7", "#ff006e", "#00ff88"];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });

      animFrame = requestAnimationFrame(animate);
    };
    animate();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animFrame); window.removeEventListener("resize", resize); };
  }, [showLoader]); // showLoader par dependency

  // Mouse parallax
  useEffect(() => {
    if (showLoader) return; // Loader visible hai to parallax mat chalao
    
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [showLoader]);

  // Entry animation
  useEffect(() => {
    if (!showLoader) {
      setTimeout(() => setIsLoaded(true), 100);
    }
  }, [showLoader]);

  // Typewriter (tabhi chalega jab loader hide ho)
  useEffect(() => {
    if (showLoader) return;
    
    const currentRole = roles[roleIndex];
    const speed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentRole.length) {
        setTypedText(currentRole.slice(0, charIndex + 1));
        setCharIndex(c => c + 1);
      } else if (isDeleting && charIndex > 0) {
        setTypedText(currentRole.slice(0, charIndex - 1));
        setCharIndex(c => c - 1);
      } else if (!isDeleting && charIndex === currentRole.length) {
        setTimeout(() => setIsDeleting(true), 1800);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setRoleIndex(i => (i + 1) % roles.length);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, roleIndex, showLoader]);

  const stats = [
    { icon: <Layers className="w-5 h-5" />, value: "10+", label: "Projects Built" },
    { icon: <Code2 className="w-5 h-5" />, value: "3rd Yr", label: "B.Tech CSE" },
    { icon: <Zap className="w-5 h-5" />, value: "2+", label: "Certifications" },
  ];

  // Agar loader show ho raha hai to sirf loader render karo
  if (showLoader) {
    return <Loader />;
  }


  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "#020408", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --cyan: #00d4ff;
          --purple: #7b2ff7;
          --pink: #ff006e;
          --green: #00ff88;
          --dark: #020408;
          --dark2: #080d14;
          --border: rgba(0,212,255,0.12);
        }

        * { box-sizing: border-box; }

        .hero-text-enter { 
          opacity: 0; transform: translateY(40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .hero-text-enter.loaded { opacity: 1; transform: translateY(0); }

        .glow-text {
          background: linear-gradient(135deg, #00d4ff 0%, #7b2ff7 50%, #ff006e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-card {
          background: rgba(8, 13, 20, 0.8);
          border: 1px solid var(--border);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          transition: all 0.4s ease;
        }
        .hero-card:hover {
          border-color: rgba(0, 212, 255, 0.35);
          box-shadow: 0 0 40px rgba(0, 212, 255, 0.08);
          transform: translateY(-4px);
        }

        .btn-primary {
          position: relative;
          background: linear-gradient(135deg, #7b2ff7, #00d4ff);
          border: none;
          border-radius: 14px;
          padding: 14px 32px;
          font-weight: 600;
          font-size: 15px;
          color: white;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          letter-spacing: 0.01em;
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #9b4fff, #00eeff);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .btn-primary:hover::before { opacity: 1; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(123,47,247,0.4); }
        .btn-primary span, .btn-primary svg { position: relative; z-index: 1; }

        .btn-outline {
          background: transparent;
          border: 1px solid rgba(0,212,255,0.3);
          border-radius: 14px;
          padding: 13px 30px;
          font-weight: 500;
          font-size: 15px;
          color: rgba(255,255,255,0.8);
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          letter-spacing: 0.01em;
        }
        .btn-outline:hover {
          border-color: var(--cyan);
          color: var(--cyan);
          background: rgba(0,212,255,0.06);
          transform: translateY(-2px);
        }

        .social-btn {
          width: 46px; height: 46px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .social-btn:hover {
          border-color: var(--cyan);
          color: var(--cyan);
          background: rgba(0,212,255,0.08);
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,212,255,0.15);
        }

        .stat-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 20px;
          display: flex; flex-direction: column; align-items: center;
          gap: 6px;
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          border-color: rgba(0,212,255,0.2);
          background: rgba(0,212,255,0.04);
          transform: translateY(-3px);
        }

        .floating-badge {
          position: absolute;
          background: rgba(8,13,20,0.9);
          border: 1px solid rgba(0,212,255,0.2);
          border-radius: 12px;
          padding: 8px 14px;
          font-size: 12px;
          color: var(--cyan);
          backdrop-filter: blur(10px);
          white-space: nowrap;
          animation: float-badge 4s ease-in-out infinite;
          font-family: 'JetBrains Mono', monospace;
        }
        @keyframes float-badge {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .cursor-blink {
          display: inline-block;
          width: 2px;
          height: 1.1em;
          background: var(--cyan);
          margin-left: 2px;
          vertical-align: middle;
          animation: blink 0.8s step-end infinite;
        }
        @keyframes blink { 50% { opacity: 0; } }

        .scroll-indicator {
          animation: scroll-bounce 2s ease-in-out infinite;
        }
        @keyframes scroll-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(8px); opacity: 1; }
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        .tech-pill {
          background: rgba(123,47,247,0.1);
          border: 1px solid rgba(123,47,247,0.2);
          border-radius: 8px;
          padding: 4px 10px;
          font-size: 11px;
          color: rgba(255,255,255,0.6);
          font-family: 'JetBrains Mono', monospace;
        }

        .grid-bg {
          background-image: 
            linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .delay-1 { animation: fadeInUp 0.8s ease 0.2s both; }
        .delay-2 { animation: fadeInUp 0.8s ease 0.4s both; }
        .delay-3 { animation: fadeInUp 0.8s ease 0.6s both; }
        .delay-4 { animation: fadeInUp 0.8s ease 0.8s both; }
        .delay-5 { animation: fadeInUp 0.8s ease 1.0s both; }

        .profile-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid;
          animation: spin-ring linear infinite;
        }
        @keyframes spin-ring { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Grid Background */}
      <div className="fixed inset-0 grid-bg opacity-40 z-0 pointer-events-none" />

      {/* Ambient orbs */}
      <div className="orb" style={{ width: 500, height: 500, top: -100, left: -100, background: "rgba(123,47,247,0.12)", animationDuration: "8s" }} />
      <div className="orb" style={{ width: 400, height: 400, bottom: -50, right: -50, background: "rgba(0,212,255,0.08)" }} />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center z-10 pt-24" ref={heroRef}
        style={{ transform: `translate(${mousePos.x * -8}px, ${mousePos.y * -4}px)`, transition: "transform 0.3s ease" }}>
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <div>
              {/* Badge */}
              <div className="delay-1 inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full" style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", fontSize: 12, color: "var(--cyan)", fontFamily: "'JetBrains Mono', monospace" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", display: "inline-block", animation: "blink 1.5s ease infinite" }} />
                Available for opportunities
              </div>

              {/* Name */}
              <h1 className="delay-2" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 800, lineHeight: 1.05, marginBottom: 16 }}>
                <span style={{ color: "white" }}>Shivam</span>{" "}
                <span className="glow-text">Modi</span>
              </h1>

              {/* Typewriter */}
              <div className="delay-3" style={{ height: 36, marginBottom: 20, display: "flex", alignItems: "center" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, color: "rgba(255,255,255,0.55)", fontWeight: 400 }}>
                  &gt; {typedText}<span className="cursor-blink" />
                </span>
              </div>

              {/* Description */}
              <p className="delay-3" style={{ color: "rgba(255,255,255,0.45)", fontSize: 16, lineHeight: 1.75, maxWidth: 480, marginBottom: 36 }}>
                Building full-stack experiences that merge performance with beautiful design. From backend architecture to pixel-perfect UIs — I craft it all.
              </p>

              {/* Tech pills */}
              <div className="delay-3 flex flex-wrap gap-2 mb-10">
                {["React", "Node.js", "MongoDB", "Express", "Python", "TypeScript"].map(t => (
                  <span key={t} className="tech-pill">{t}</span>
                ))}
              </div>

              {/* CTA */}
              <div className="delay-4 flex flex-wrap gap-4 mb-10">
                <Link to="/projects" className="btn-primary">
                  <span>View Projects</span>
                  <ArrowRight size={16} />
                </Link>
                <a href="/resume.pdf" target="_blank" className="btn-outline">
                  <Download size={15} />
                  Download CV
                </a>
              </div>

              {/* Socials */}
              <div className="delay-5 flex gap-3">
                {[
                  { href: "https://github.com/shivammodi1", icon: <Github size={18} /> },
                  { href: "https://www.linkedin.com/in/shivammodi1/", icon: <Linkedin size={18} /> },
                  { href: "mailto:smodi9846@gmail.com", icon: <Mail size={18} /> },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="social-btn">{s.icon}</a>
                ))}
              </div>
            </div>

            {/* RIGHT - Visual */}
            <div className="relative hidden lg:flex items-center justify-center">
              {/* Rotating rings */}
              <div style={{ position: "relative", width: 380, height: 380 }}>
                <div className="profile-ring" style={{ inset: -30, borderColor: "rgba(0,212,255,0.1)", animationDuration: "20s" }} />
                <div className="profile-ring" style={{ inset: -60, borderColor: "rgba(123,47,247,0.07)", animationDuration: "30s", animationDirection: "reverse" }} />
                <div className="profile-ring" style={{ inset: -90, borderColor: "rgba(0,212,255,0.04)", borderStyle: "dashed", animationDuration: "40s" }} />

                {/* Center card */}
                <div className="hero-card" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                  <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg, #7b2ff7, #00d4ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "white", fontFamily: "'Space Grotesk', sans-serif", boxShadow: "0 0 40px rgba(123,47,247,0.4)" }}>SM</div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: "white", fontWeight: 600, fontSize: 18, marginBottom: 4 }}>Shivam Modi</div>
                    <div style={{ color: "var(--cyan)", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>Full-Stack Developer</div>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-center" style={{ padding: "0 20px" }}>
                    {["MERN", "Python", "SQL"].map(t => (
                      <span key={t} className="tech-pill">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Floating badges */}
                <div className="floating-badge" style={{ top: -10, right: -60, animationDelay: "0s" }}>⚡ MERN Stack</div>
                <div className="floating-badge" style={{ bottom: 40, left: -80, animationDelay: "1.5s" }}>🏆 Hackathon Winner</div>
                <div className="floating-badge" style={{ top: 100, left: -90, animationDelay: "0.8s" }}>🔐 CEH Certified</div>
                <div className="floating-badge" style={{ bottom: -10, right: -40, animationDelay: "2.2s" }}>🤖 GenAI Oracle</div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-4 mt-20 max-w-lg delay-5">
            {stats.map((s, i) => (
              <div key={i} className="stat-card">
                <div style={{ color: "var(--cyan)" }}>{s.icon}</div>
                <div style={{ color: "white", fontWeight: 700, fontSize: 22, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(0,212,255,0.5), transparent)" }} />
        </div>
      </section>

      <Chatbot />
    </div>
  );
};

export default Home;