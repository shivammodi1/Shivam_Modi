import React, { useState, useRef, useEffect } from "react";
import { Mail, Phone, MapPin, Github, Linkedin, Instagram, Send, CheckCircle, ArrowUpRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ─── Responsive Hook ─────────────────────────────────────────── */
const useBreakpoint = () => {
  const [bp, setBp] = useState<"mobile" | "tablet" | "desktop">("desktop");
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setBp(w < 600 ? "mobile" : w < 960 ? "tablet" : "desktop");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return bp;
};

const Contact: React.FC = () => {
  const bp = useBreakpoint();
  const isMobile = bp === "mobile";
  const isDesktop = bp === "desktop";

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (heroRef.current) obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("https://formspree.io/f/xandabjd", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        toast({ title: "Message Sent!", description: "I'll get back to you within 24 hours." });
        setTimeout(() => setSubmitted(false), 4000);
      } else {
        toast({ title: "Error", description: "Something went wrong. Try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network Error", description: "Check your connection.", variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const contactInfo = [
    { icon: <Mail size={17} />, label: "Email", value: "smodi9846@gmail.com", link: "mailto:smodi9846@gmail.com", color: "#00d4ff" },
    { icon: <Phone size={17} />, label: "Phone", value: "+91 7860559651", link: "tel:+917860559651", color: "#7b2ff7" },
    { icon: <MapPin size={17} />, label: "Location", value: "Lucknow, Uttar Pradesh", link: null, color: "#00ff88" },
  ];

  const socials = [
    { icon: <Github size={18} />, label: "GitHub", handle: "@shivammodi001", url: "https://github.com/shivammodi001", color: "rgba(255,255,255,0.8)" },
    { icon: <Linkedin size={18} />, label: "LinkedIn", handle: "shivammodi1", url: "https://www.linkedin.com/in/shivammodi1/", color: "#0077b5" },
    { icon: <Instagram size={18} />, label: "Instagram", handle: "@9249.shivam", url: "https://www.instagram.com/9249.shivam/", color: "#e1306c" },
  ];

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    background: focusedField === field ? "rgba(0,212,255,0.04)" : "rgba(255,255,255,0.02)",
    border: `1px solid ${focusedField === field ? "rgba(0,212,255,0.4)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: 14,
    padding: "14px 16px",
    color: "white",
    fontSize: isMobile ? 16 : 14, // 16px prevents iOS zoom on focus
    outline: "none",
    transition: "all 0.25s ease",
    fontFamily: "'DM Sans', sans-serif",
    resize: "none" as const,
    boxSizing: "border-box" as const,
  });

  return (
    <div style={{
      background: "#020408",
      minHeight: "100vh",
      fontFamily: "'DM Sans', sans-serif",
      paddingTop: isMobile ? 60 : 80,
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

        .contact-reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .contact-reveal.show { opacity: 1; transform: translateY(0); }

        .glass-panel {
          background: rgba(8,13,20,0.85);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 22px;
          backdrop-filter: blur(10px);
        }

        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        /* Prevent iOS zoom on input focus */
        @media (max-width: 599px) {
          input, textarea { font-size: 16px !important; }
        }

        .send-btn {
          width: 100%;
          padding: 15px;
          border-radius: 14px;
          background: linear-gradient(135deg, #7b2ff7, #00d4ff);
          color: white;
          font-weight: 700;
          font-size: 15px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          letter-spacing: 0.02em;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }
        .send-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #9b4fff, #00eeff);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .send-btn:hover::before { opacity: 1; }
        .send-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(123,47,247,0.4); }
        .send-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .send-btn > * { position: relative; z-index: 1; }
        @media (hover: none) { .send-btn:hover { transform: none; box-shadow: none; } }

        .contact-info-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.04);
          transition: all 0.25s ease;
        }
        .contact-info-row:hover {
          background: rgba(255,255,255,0.03);
          border-color: rgba(255,255,255,0.08);
        }

        .social-link-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          border-radius: 14px;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.04);
          transition: all 0.25s ease;
        }
        .social-link-row:hover {
          background: rgba(255,255,255,0.03);
          border-color: rgba(255,255,255,0.1);
          transform: translateX(4px);
        }
        @media (hover: none) { .social-link-row:hover { transform: none; } }

        .label-text {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.35);
          margin-bottom: 8px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
        }

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
        .section-label::before, .section-label::after {
          content: '';
          display: inline-block;
          width: 20px; height: 1px;
          background: #00d4ff;
        }

        @keyframes success-pop { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .success-state { animation: success-pop 0.4s ease; }

        .stagger-1 { transition-delay: 0.1s !important; }
        .stagger-2 { transition-delay: 0.2s !important; }
        .stagger-3 { transition-delay: 0.3s !important; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      <div ref={heroRef} style={{ maxWidth: 1200, margin: "0 auto", padding: `0 clamp(16px, 4vw, 32px)` }}>

        {/* ── Header ── */}
        <div
          className={`contact-reveal ${visible ? "show" : ""}`}
          style={{
            textAlign: "center",
            paddingTop: isMobile ? 28 : 40,
            paddingBottom: isMobile ? 36 : 60,
          }}
        >
          <div className="section-label">Get in Touch</div>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(32px, 7vw, 68px)",
            fontWeight: 800, color: "white",
            marginBottom: 14, lineHeight: 1.1,
          }}>
            Let's{" "}
            <span style={{ background: "linear-gradient(135deg, #00d4ff, #7b2ff7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Connect
            </span>
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "clamp(14px, 2vw, 17px)",
            maxWidth: 520, margin: "0 auto",
            lineHeight: 1.7, padding: "0 8px",
          }}>
            Have a project in mind, want to collaborate, or just want to say hello? I'd love to hear from you.
          </p>
        </div>

        {/* ── Main grid: form left, info right on desktop; stacked on mobile/tablet ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "1.2fr 1fr" : "1fr",
          gap: isMobile ? 16 : 20,
          marginBottom: 80,
          alignItems: "start",
        }}>

          {/* ── Contact Form ── */}
          <div className={`contact-reveal stagger-1 ${visible ? "show" : ""}`}>
            <div className="glass-panel" style={{ padding: `clamp(20px, 4vw, 36px)` }}>
              <h2 style={{ color: "white", fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 700, marginBottom: 6 }}>
                Send a Message
              </h2>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, marginBottom: 24 }}>
                I typically respond within 24 hours.
              </p>

              {submitted ? (
                <div className="success-state" style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px",
                  }}>
                    <CheckCircle size={32} color="#00ff88" />
                  </div>
                  <h3 style={{ color: "white", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Message Sent!</h3>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                    Thanks for reaching out. I'll get back to you soon!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {/* Name + Email side by side on tablet+, stacked on mobile */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: 16,
                  }}>
                    <div>
                      <label className="label-text">Full Name</label>
                      <input
                        name="name" type="text" required
                        value={formData.name} onChange={handleChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Your name"
                        style={inputStyle("name")}
                      />
                    </div>
                    <div>
                      <label className="label-text">Email Address</label>
                      <input
                        name="email" type="email" required
                        value={formData.email} onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="your@email.com"
                        style={inputStyle("email")}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label-text">Message</label>
                    <textarea
                      name="message" required
                      value={formData.message} onChange={handleChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Tell me about your project or just say hi!"
                      rows={isMobile ? 4 : 5}
                      style={inputStyle("message")}
                    />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="send-btn">
                    {isSubmitting ? (
                      <>
                        <div style={{
                          width: 16, height: 16,
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "white", borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }} />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <><Send size={16} /><span>Send Message</span></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ── Info Panel ── */}
          <div
            className={`contact-reveal stagger-2 ${visible ? "show" : ""}`}
            style={{ display: "flex", flexDirection: "column", gap: isMobile ? 12 : 16 }}
          >
            {/* Contact Details */}
            <div className="glass-panel" style={{ padding: `clamp(18px, 3vw, 28px)` }}>
              <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Contact Details</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {contactInfo.map(item => (
                  <div key={item.label} className="contact-info-row">
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: item.color + "15",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: item.color, flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", marginBottom: 2 }}>
                        {item.label}
                      </div>
                      {item.link ? (
                        <a
                          href={item.link}
                          style={{
                            color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500,
                            textDecoration: "none", transition: "color 0.2s",
                            wordBreak: "break-all",
                          }}
                          onMouseEnter={e => (e.target as HTMLElement).style.color = item.color}
                          onMouseLeave={e => (e.target as HTMLElement).style.color = "rgba(255,255,255,0.7)"}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500 }}>{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="glass-panel" style={{ padding: `clamp(18px, 3vw, 28px)` }}>
              <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Social Links</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {socials.map(s => (
                  <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="social-link-row">
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: "rgba(255,255,255,0.04)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "rgba(255,255,255,0.5)", flexShrink: 0,
                    }}>
                      {s.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{s.label}</div>
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {s.handle}
                      </div>
                    </div>
                    <ArrowUpRight size={14} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                  </a>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div style={{
              background: "linear-gradient(135deg, rgba(123,47,247,0.15), rgba(0,212,255,0.1))",
              border: "1px solid rgba(0,212,255,0.15)",
              borderRadius: 18,
              padding: `clamp(16px, 3vw, 22px)`,
              display: "flex", gap: 14, alignItems: "center",
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: "#00ff88", boxShadow: "0 0 12px #00ff88",
                flexShrink: 0, animation: "pulse 2s ease infinite",
              }} />
              <div>
                <div style={{ color: "white", fontWeight: 600, fontSize: 14, marginBottom: 3 }}>
                  Open to Opportunities
                </div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.5 }}>
                  Available for freelance, internship & full-time roles.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;