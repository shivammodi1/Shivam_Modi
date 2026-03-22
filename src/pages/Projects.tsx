import React, { useRef, useState, useEffect } from "react";
import { ExternalLink, Github, Play, Pause, ArrowUpRight } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  image: string;
  category: string;
}

const Projects: React.FC = () => {
  const [isScrolling, setIsScrolling] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const projects: Project[] = [
    { id: 1, title: "FoodHub", description: "Full MERN food ordering platform with authentication, order tracking, and secure payment integration.", technologies: ["MongoDB", "Express", "React", "Node.js", "Tailwind"], githubUrl: "https://github.com/shivammodi001/FoodHub", liveUrl: "https://foodhub-frontend-yl92.onrender.com/", image: "/foodhub.png", category: "Full Stack" },
    { id: 2, title: "EliteCode", description: "Online competitive coding platform with problem submission, live judging, and user skill tracking.", technologies: ["React", "Node.js", "MongoDB", "Express"], githubUrl: "https://github.com/shivammodi001/EliteCode", liveUrl: "#", image: "/elitecode.png", category: "Full Stack" },
    { id: 3, title: "Socket Chat", description: "Real-time chat with WebSockets, multi-user rooms, online presence indicators, and message history.", technologies: ["React", "Node.js", "Socket.io", "MongoDB"], githubUrl: "https://github.com/shivammodi001/chat-app", liveUrl: "https://chat-app-epcp.onrender.com/", image: "/socket-chat.png", category: "Real-time" },
    { id: 4, title: "Virtual Assistant", description: "AI-powered assistant with voice recognition, text-to-speech, and Gemini AI command handling.", technologies: ["React", "Express", "MongoDB", "Gemini AI"], githubUrl: "https://github.com/shivammodi001/Virtual-Assistance", liveUrl: "https://virtual-assistance-y2eo.onrender.com/", image: "/virtualAssistant.png", category: "AI/ML" },
    { id: 5, title: "Swiggy Clone", description: "Feature-rich food delivery app with restaurant listings, cart, and checkout — inspired by Swiggy.", technologies: ["React", "Redux", "Firebase", "Tailwind"], githubUrl: "https://github.com/shivammodi001/Swiggy_Clone", liveUrl: "https://swiggy-clone-orpin.vercel.app/", image: "/swiggy-clone.png", category: "Frontend" },
    { id: 6, title: "YouTube Clone", description: "Video streaming platform replicating YouTube features: search, likes, comments, and responsive UI.", technologies: ["React", "TypeScript", "YouTube API", "Tailwind"], githubUrl: "https://github.com/shivammodi001", liveUrl: "#", image: "/youtube-clone.png", category: "Frontend" },
    { id: 7, title: "Agri ChatBot", description: "AI chatbot for farmers providing crop tips, weather updates, and farming guidance in regional languages.", technologies: ["Python", "Flask", "Dialogflow", "MongoDB"], githubUrl: "https://github.com/shivammodi001/Agri_Help", liveUrl: "https://shivammodi001.github.io/Agri_Help/", image: "/agri-chatbot.png", category: "AI/ML" },
    { id: 8, title: "TicTacToe", description: "Multiplayer TicTacToe with interactive animations and smart game logic implementation.", technologies: ["HTML", "CSS", "JavaScript"], githubUrl: "https://github.com/shivammodi001/TicTacToe", liveUrl: "https://shivammodi001.github.io/TicTacToe/", image: "/tictactoe.png", category: "Game" },
    { id: 9, title: "Calculator", description: "Clean, modern calculator with all arithmetic operations and a polished, responsive interface.", technologies: ["HTML", "CSS", "JavaScript"], githubUrl: "https://github.com/shivammodi001/Calculator", liveUrl: "https://shivammodi001.github.io/Calculator/", image: "/calculator.png", category: "Utility" },
  ];

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (heroRef.current) obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !isScrolling) return;
    const interval = setInterval(() => {
      if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += 1;
      }
    }, 20);
    return () => clearInterval(interval);
  }, [isScrolling]);

  const categoryColors: Record<string, { bg: string; text: string }> = {
    "Full Stack": { bg: "rgba(0,212,255,0.12)", text: "#00d4ff" },
    "Real-time": { bg: "rgba(0,255,136,0.12)", text: "#00ff88" },
    "AI/ML": { bg: "rgba(123,47,247,0.12)", text: "#9b6fff" },
    "Frontend": { bg: "rgba(255,0,110,0.12)", text: "#ff4d9e" },
    "Game": { bg: "rgba(255,200,0,0.12)", text: "#ffc800" },
    "Utility": { bg: "rgba(255,255,255,0.08)", text: "rgba(255,255,255,0.5)" },
  };

  return (
    <div style={{ background: "#020408", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", paddingTop: 80, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        .proj-reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .proj-reveal.show { opacity: 1; transform: translateY(0); }

        .project-card {
          flex-shrink: 0;
          width: 320px;
          background: rgba(8,13,20,0.9);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }
        .project-card:hover {
          border-color: rgba(0,212,255,0.25);
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 30px 70px rgba(0,0,0,0.6), 0 0 30px rgba(0,212,255,0.06);
        }

        .img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(2,4,8,0.95) 0%, rgba(2,4,8,0.4) 60%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: flex-end;
          padding: 16px;
          gap: 8px;
        }
        .project-card:hover .img-overlay { opacity: 1; }
        .project-card:hover .img-wrap img { transform: scale(1.08); }

        .action-btn {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          color: white;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .action-btn:hover { background: rgba(0,212,255,0.25); border-color: rgba(0,212,255,0.5); }

        .tech-chip {
          padding: 3px 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 6px;
          font-size: 10px;
          color: rgba(255,255,255,0.45);
          font-family: 'JetBrains Mono', monospace;
        }

        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }

        .toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .toggle-btn:hover { background: rgba(0,212,255,0.08); border-color: rgba(0,212,255,0.2); color: var(--cyan, #00d4ff); }

        .cta-card {
          background: rgba(8,13,20,0.8);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px;
          padding: 60px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .cta-card::before {
          content: '';
          position: absolute;
          top: -100px; left: 50%;
          transform: translateX(-50%);
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(123,47,247,0.15), transparent 70%);
          pointer-events: none;
        }

        .gh-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 32px;
          border-radius: 14px;
          background: linear-gradient(135deg, #7b2ff7, #00d4ff);
          color: white;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .gh-btn:hover { transform: translateY(-2px); box-shadow: 0 15px 40px rgba(123,47,247,0.35); }

        .section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #00d4ff;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .section-label::before {
          content: '';
          display: inline-block;
          width: 20px; height: 1px;
          background: #00d4ff;
        }
        .section-label::after {
          content: '';
          display: inline-block;
          width: 20px; height: 1px;
          background: #00d4ff;
        }
      `}</style>

      <div ref={heroRef} style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        {/* Header */}
        <div className={`proj-reveal ${visible ? "show" : ""}`} style={{ textAlign: "center", paddingTop: 40, paddingBottom: 60 }}>
          <div className="section-label">Portfolio</div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(40px, 5vw, 68px)", fontWeight: 800, color: "white", marginBottom: 16, lineHeight: 1.1 }}>
            Things I've{" "}
            <span style={{ background: "linear-gradient(135deg, #00d4ff, #7b2ff7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Built</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 17, maxWidth: 540, margin: "0 auto 28px", lineHeight: 1.7 }}>
            Full-stack applications demonstrating everything from real-time systems to AI-powered tools.
          </p>
          <button className="toggle-btn" onClick={() => setIsScrolling(s => !s)}>
            {isScrolling ? <Pause size={14} /> : <Play size={14} />}
            {isScrolling ? "Pause" : "Resume"} Carousel
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div style={{ position: "relative", marginBottom: 80 }}>
        {/* Edge fades */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to right, #020408, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to left, #020408, transparent)", zIndex: 2, pointerEvents: "none" }} />

        <div ref={scrollRef} className="scrollbar-hide"
          style={{ display: "flex", gap: 20, overflowX: "auto", padding: "10px 60px 30px", scrollBehavior: "smooth" }}
          onMouseEnter={() => setIsScrolling(false)}
          onMouseLeave={() => setIsScrolling(true)}
        >
          {[...projects, ...projects].map((project, index) => {
            const cat = categoryColors[project.category] || { bg: "rgba(255,255,255,0.05)", text: "rgba(255,255,255,0.4)" };
            const key = `${project.id}-${index}`;
            return (
              <div key={key} className="project-card" onMouseEnter={() => setHoveredCard(key)} onMouseLeave={() => setHoveredCard(null)}>
                {/* Image */}
                <div className="img-wrap" style={{ position: "relative", height: 190, overflow: "hidden", background: "rgba(123,47,247,0.1)" }}>
                  <img src={project.image} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }} />
                  <div className="img-overlay">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="action-btn"><Github size={16} /></a>
                    {project.liveUrl && project.liveUrl !== "#" && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="action-btn"><ExternalLink size={16} /></a>
                    )}
                  </div>
                  {/* Category badge */}
                  <span style={{ position: "absolute", top: 12, right: 12, padding: "4px 10px", borderRadius: 8, fontSize: 10, fontWeight: 600, background: cat.bg, color: cat.text, fontFamily: "'JetBrains Mono', monospace", border: `1px solid ${cat.text}25` }}>
                    {project.category}
                  </span>
                </div>
                {/* Content */}
                <div style={{ padding: "20px 22px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <h3 style={{ color: "white", fontSize: 17, fontWeight: 700 }}>{project.title}</h3>
                    <ArrowUpRight size={15} style={{ color: "rgba(255,255,255,0.25)", transition: "color 0.2s" }} />
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.65, marginBottom: 16 }}>{project.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {project.technologies.slice(0, 4).map(t => <span key={t} className="tech-chip">{t}</span>)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 80px" }}>
        <div className="cta-card">
          <h2 style={{ color: "white", fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Want to see more?</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, marginBottom: 32, maxWidth: 460, margin: "0 auto 32px" }}>
            All projects live on GitHub with full documentation and source code.
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