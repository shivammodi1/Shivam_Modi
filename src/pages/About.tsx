import React, { useEffect, useRef, useState } from "react";
import { GraduationCap, Heart, Code, Users, MapPin, Calendar } from "lucide-react";

const About: React.FC = () => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const observers = useRef<Map<string, IntersectionObserver>>(new Map());

  const observe = (id: string) => (el: HTMLElement | null) => {
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisibleSections(prev => new Set([...prev, id])); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    observers.current.set(id, obs);
  };

  useEffect(() => () => observers.current.forEach(o => o.disconnect()), []);

  const vis = (id: string) => visibleSections.has(id);

  const techStack = ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Node.js", "Express.js", "MongoDB", "MySQL", "Python", "C", "C++"];

  return (
    <div style={{ background: "#020408", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", paddingTop: 80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        .about-reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .about-reveal.show { opacity: 1; transform: translateY(0); }
        .about-reveal-left { opacity: 0; transform: translateX(-40px); transition: opacity 0.9s ease, transform 0.9s ease; }
        .about-reveal-left.show { opacity: 1; transform: translateX(0); }
        .about-reveal-right { opacity: 0; transform: translateX(40px); transition: opacity 0.9s ease, transform 0.9s ease; }
        .about-reveal-right.show { opacity: 1; transform: translateX(0); }

        .glass-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          transition: all 0.35s ease;
        }
        .glass-card:hover {
          border-color: rgba(0,212,255,0.2);
          background: rgba(0,212,255,0.03);
          transform: translateY(-4px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
        }

        .tech-tag {
          position: relative;
          background: rgba(123,47,247,0.08);
          border: 1px solid rgba(123,47,247,0.15);
          border-radius: 10px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.7);
          font-family: 'JetBrains Mono', monospace;
          cursor: default;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .tech-tag::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #7b2ff7, #00d4ff);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .tech-tag:hover::before { opacity: 1; }
        .tech-tag:hover { color: white; border-color: transparent; transform: scale(1.05); }
        .tech-tag span { position: relative; z-index: 1; }

        .edu-card {
          background: rgba(8,13,20,0.8);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 28px;
          position: relative;
          overflow: hidden;
          transition: all 0.35s ease;
        }
        .edu-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #7b2ff7, #00d4ff);
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }
        .edu-card:hover::before { transform: scaleX(1); }
        .edu-card:hover {
          border-color: rgba(0,212,255,0.15);
          transform: translateY(-5px);
          box-shadow: 0 25px 60px rgba(0,0,0,0.5);
        }

        .quick-fact {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
          transition: all 0.3s ease;
        }
        .quick-fact:hover {
          border-color: rgba(123,47,247,0.3);
          background: rgba(123,47,247,0.05);
        }

        .icon-box {
          width: 42px; height: 42px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--cyan, #00d4ff);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .section-label::before {
          content: '';
          display: inline-block;
          width: 20px; height: 1px;
          background: var(--cyan, #00d4ff);
        }

        .stagger-1 { transition-delay: 0.1s !important; }
        .stagger-2 { transition-delay: 0.2s !important; }
        .stagger-3 { transition-delay: 0.3s !important; }
        .stagger-4 { transition-delay: 0.4s !important; }
        .stagger-5 { transition-delay: 0.5s !important; }
        .stagger-6 { transition-delay: 0.6s !important; }

        .profile-glow {
          box-shadow: 0 0 0 1px rgba(0,212,255,0.2), 0 0 60px rgba(123,47,247,0.3);
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>

        {/* HERO */}
        <div ref={observe("hero")} className={`about-reveal ${vis("hero") ? "show" : ""}`} style={{ textAlign: "center", paddingTop: 60, paddingBottom: 80 }}>
          <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 28px" }}>
  
  {/* Gradient Border */}
  <div
    style={{
      width: 120,
      height: 120,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #7b2ff7, #00d4ff)",
      padding: 3
    }}
  >
    {/* Image inside */}
    <img
      src="/profile.png"   // 👉 put your image path here
      alt="Shivam Modi"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        objectFit: "cover",
        background: "#020408"
      }}
      className="profile-glow"
    />
  </div>

  {/* Online Status Dot */}
  <div
    style={{
      position: "absolute",
      bottom: 4,
      right: 4,
      width: 16,
      height: 16,
      borderRadius: "50%",
      background: "#00ff88",
      border: "2px solid #020408",
      boxShadow: "0 0 10px #00ff88"
    }}
  />
</div>

          <div className="section-label" style={{ justifyContent: "center" }}>About Me</div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 800, color: "white", marginBottom: 16, lineHeight: 1.1 }}>
            Crafting the{" "}
            <span style={{ background: "linear-gradient(135deg, #00d4ff, #7b2ff7, #ff006e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Full Stack
            </span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 18, maxWidth: 560, margin: "0 auto 24px", lineHeight: 1.7 }}>
            A curious mind building at the intersection of engineering, design, and social impact.
          </p>

          {/* Meta chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {[
              { icon: <MapPin size={12} />, text: "Lucknow, India" },
              { icon: <GraduationCap size={12} />, text: "B.Tech CSE • LPU" },
              { icon: <Calendar size={12} />, text: "3rd Year • 2023–Present" },
            ].map((item, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: "100px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
                {item.icon} {item.text}
              </span>
            ))}
          </div>
        </div>

        {/* BIO + QUICK FACTS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 60 }}>
          {/* Bio */}
          <div ref={observe("bio")} className={`about-reveal-left ${vis("bio") ? "show" : ""}`}>
            <div className="glass-card" style={{ padding: 32, height: "100%" }}>
              <div className="section-label">My Story</div>
              <h2 style={{ color: "white", fontSize: 28, fontWeight: 700, marginBottom: 20, fontFamily: "'Space Grotesk', sans-serif" }}>The Journey</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  "Currently in my 3rd year of B.Tech CSE at Lovely Professional University — driven by an obsession with building things that actually work and look great doing it.",
                  "My path started with curiosity: why does software feel the way it does? That question led me deep into full-stack development, exploring both the precision of backend systems and the craft of frontend experiences.",
                  "Beyond code, I believe technology has a responsibility to society. I'm actively involved in NGO work, using my skills to create tools for social good.",
                  "I spend my time competing in hackathons (won Paranox 2.0 🏆), contributing to open source, and diving deep into DSA, Next.js, and blockchain."
                ].map((text, i) => (
                  <p key={i} style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.75 }}>{text}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Quick facts */}
          <div ref={observe("facts")} className={`about-reveal-right ${vis("facts") ? "show" : ""}`} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { icon: <Code size={18} />, title: "Full-Stack Engineer", desc: "MERN stack, REST APIs, real-time apps, and clean architecture.", color: "#00d4ff" },
              { icon: <Heart size={18} />, title: "Social Contributor", desc: "Building NGO tools and volunteering — tech for positive impact.", color: "#ff006e" },
              { icon: <Users size={18} />, title: "Team Builder", desc: "Hackathon veteran. Leadership, collaboration, and communication.", color: "#7b2ff7" },
              { icon: <GraduationCap size={18} />, title: "Lifelong Learner", desc: "Certified in CEH, Oracle GenAI. Always leveling up.", color: "#00ff88" },
            ].map((item, i) => (
              <div key={i} className={`quick-fact stagger-${i + 1} about-reveal ${vis("facts") ? "show" : ""}`}>
                <div className="icon-box" style={{ background: item.color + "18" }}>
                  <span style={{ color: item.color }}>{item.icon}</span>
                </div>
                <div>
                  <div style={{ color: "white", fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EDUCATION */}
        <div ref={observe("edu")} className={`about-reveal ${vis("edu") ? "show" : ""}`} style={{ marginBottom: 60 }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Academic Background</div>
          <h2 style={{ textAlign: "center", color: "white", fontSize: 36, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 40 }}>Education</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 900, margin: "0 auto" }}>
            {[
              {
                degree: "B.Tech Computer Science Engineering",
                school: "Lovely Professional University",
                period: "2023 – Present • 3rd Year",
                detail: "Specializing in software development, DSA, and modern web technologies. Active in coding competitions and hackathons.",
                highlight: "CGPA Track",
                color: "#00d4ff",
              },
              {
                degree: "Class 12th — PCM + CS",
                school: "Mahatma Buddha Memorial Inter College",
                period: "Completed",
                detail: "Strong foundation in Mathematics, Physics, and Computer Science — the bedrock for engineering pursuits.",
                highlight: "85% Marks",
                color: "#7b2ff7",
              },
            ].map((edu, i) => (
              <div key={i} className={`edu-card stagger-${i + 1} about-reveal ${vis("edu") ? "show" : ""}`}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: edu.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <GraduationCap size={20} color={edu.color} />
                  </div>
                  <span style={{ background: edu.color + "20", color: edu.color, padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{edu.highlight}</span>
                </div>
                <h3 style={{ color: "white", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{edu.degree}</h3>
                <p style={{ color: edu.color, fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{edu.school}</p>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>{edu.period}</p>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.7 }}>{edu.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TECH STACK */}
        <div ref={observe("tech")} className={`about-reveal ${vis("tech") ? "show" : ""}`} style={{ marginBottom: 80, textAlign: "center" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>What I Build With</div>
          <h2 style={{ color: "white", fontSize: 36, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 12 }}>Technology Stack</h2>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 15, marginBottom: 36 }}>The tools I reach for when building full-stack applications.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", maxWidth: 700, margin: "0 auto" }}>
            {techStack.map((tech, i) => (
              <div key={tech} className={`tech-tag stagger-${(i % 6) + 1} about-reveal ${vis("tech") ? "show" : ""}`}>
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;