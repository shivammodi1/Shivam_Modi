import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Skills', path: '/skills' },
    { name: 'Certifications', path: '/certifications' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Grotesk:wght@700;800&family=JetBrains+Mono:wght@500&display=swap');

        .nav-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 50;
          transition: all 0.35s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-root.scrolled {
          background: rgba(2, 4, 8, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          box-shadow: 0 4px 30px rgba(0,0,0,0.5);
        }
        .nav-root.top {
          background: transparent;
          border-bottom: 1px solid transparent;
        }

        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 22px;
          font-weight: 800;
          background: linear-gradient(135deg, #00d4ff, #7b2ff7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-decoration: none;
          transition: transform 0.2s ease;
          letter-spacing: -0.01em;
        }
        .nav-logo:hover { transform: scale(1.05); }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .nav-link {
          position: relative;
          padding: 7px 14px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          color: rgba(255,255,255,0.45);
          transition: all 0.25s ease;
          letter-spacing: 0.01em;
        }
        .nav-link:hover {
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.05);
        }
        .nav-link.active {
          color: white;
          background: rgba(0,212,255,0.08);
        }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 2px;
          border-radius: 1px;
          background: linear-gradient(90deg, #00d4ff, #7b2ff7);
        }

        .nav-resume {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          border-radius: 11px;
          background: linear-gradient(135deg, #7b2ff7, #00d4ff);
          color: white;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.25s ease;
          letter-spacing: 0.02em;
          position: relative;
          overflow: hidden;
          margin-left: 8px;
        }
        .nav-resume::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #9b4fff, #00eeff);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .nav-resume:hover::before { opacity: 1; }
        .nav-resume:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(123,47,247,0.35); }
        .nav-resume span { position: relative; z-index: 1; }

        /* Mobile menu button */
        .hamburger {
          display: none;
          width: 40px; height: 40px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: rgba(255,255,255,0.6);
          transition: all 0.2s ease;
        }
        .hamburger:hover {
          background: rgba(0,212,255,0.08);
          border-color: rgba(0,212,255,0.2);
          color: #00d4ff;
        }

        /* Mobile drawer */
        .mobile-drawer {
          position: fixed;
          top: 0; right: 0;
          width: 280px;
          height: 100vh;
          background: rgba(8,13,20,0.98);
          backdrop-filter: blur(20px);
          border-left: 1px solid rgba(255,255,255,0.06);
          z-index: 100;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          animation: drawer-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: -20px 0 60px rgba(0,0,0,0.7);
        }
        @keyframes drawer-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .drawer-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 16px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          color: rgba(255,255,255,0.5);
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }
        .drawer-link:hover {
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.8);
          border-color: rgba(255,255,255,0.06);
        }
        .drawer-link.active {
          background: rgba(0,212,255,0.07);
          color: white;
          border-color: rgba(0,212,255,0.15);
        }

        .drawer-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00d4ff, #7b2ff7);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .drawer-link.active .drawer-dot { opacity: 1; }

        .drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 99;
          backdrop-filter: blur(4px);
          animation: fade-in 0.2s ease;
        }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

        .drawer-resume {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 13px;
          border-radius: 12px;
          background: linear-gradient(135deg, #7b2ff7, #00d4ff);
          color: white;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .drawer-resume:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(123,47,247,0.4); }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-resume { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>

      <nav className={`nav-root ${scrolled ? 'scrolled' : 'top'}`}>
        <div className="nav-inner">
          {/* Logo */}
          <Link to="/" className="nav-logo">SM.</Link>

          {/* Desktop Nav */}
          <div className="nav-links">
            {navItems.map(item => (
              <Link key={item.path} to={item.path} className={`nav-link ${isActive(item.path) ? 'active' : ''}`}>
                {item.name}
              </Link>
            ))}
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="nav-resume">
              <span>Resume</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ position: "relative", zIndex: 1 }}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button className="hamburger" onClick={() => setIsMenuOpen(true)}>
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <>
          <div className="drawer-overlay" onClick={() => setIsMenuOpen(false)} />
          <div className="mobile-drawer">
            <div className="drawer-header">
              <span className="nav-logo" style={{ fontSize: 20 }}>SM.</span>
              <button style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}
                onClick={() => setIsMenuOpen(false)}>
                <X size={16} />
              </button>
            </div>

            {navItems.map((item, i) => (
              <Link key={item.path} to={item.path} className={`drawer-link ${isActive(item.path) ? 'active' : ''}`}
                style={{ animationDelay: `${i * 0.04}s` }}>
                <span>{item.name}</span>
                <div className="drawer-dot" />
              </Link>
            ))}

            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="drawer-resume">
              Download Resume
            </a>
          </div>
        </>
      )}
    </>
  );
};

export default Navigation;