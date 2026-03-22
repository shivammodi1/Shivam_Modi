import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [hasNotif, setHasNotif] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey! 👋 I'm Shivam's AI assistant. Ask me about his projects, skills, certifications, education, or how to contact him!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  const quickReplies = ['Projects', 'Skills', 'Certifications', 'Contact'];

  const botResponses: Record<string, string> = {
    education: "🎓 Shivam is in his 3rd year of B.Tech CSE at Lovely Professional University (2023–present). He scored 85% in Class 12th. He's actively participating in coding competitions and hackathons.",
    projects: "💻 Shivam has built 10+ full-stack projects — FoodHub (MERN), EliteCode (coding platform), Socket Chat (real-time), a Virtual AI Assistant with Gemini, Swiggy Clone, Agri ChatBot, and more. Check the Projects section for live demos!",
    skills: "⚡ His stack: React, Node.js, Express, MongoDB, MySQL, Python, C, C++, TypeScript, Tailwind CSS, Socket.io, Git, Linux, AWS basics. Full-stack through and through!",
    certifications: "🏆 Shivam is CEH V12 certified (Warlock Security), Oracle GenAI certified, and won the Paranox 2.0 National Level Hackathon at Newton School of Technology!",
    ngo: "❤️ Beyond code, Shivam is actively involved in NGO work and community service — using technology to create positive social impact.",
    contact: "📬 Reach Shivam at smodi9846@gmail.com or +91 7860559651. Also on LinkedIn (shivammodi1), GitHub (shivammodi001), and Instagram (@9249.shivam).",
    hackathon: "🥇 Shivam won the Paranox 2.0 National Level Hackathon at Newton School of Technology, Sonipat — competing against thousands from colleges across India!",
    default: "I can tell you about Shivam's 🎓 education, 💻 projects, ⚡ skills, 🏆 certifications, or 📬 contact info. What would you like to know?",
  };

  const getBotResponse = (msg: string): string => {
    const m = msg.toLowerCase();
    if (m.includes('education') || m.includes('study') || m.includes('university') || m.includes('lpu') || m.includes('college')) return botResponses.education;
    if (m.includes('project') || m.includes('work') || m.includes('built') || m.includes('portfolio') || m.includes('app')) return botResponses.projects;
    if (m.includes('skill') || m.includes('tech') || m.includes('stack') || m.includes('program') || m.includes('language')) return botResponses.skills;
    if (m.includes('hackathon') || m.includes('paranox') || m.includes('winner') || m.includes('competition')) return botResponses.hackathon;
    if (m.includes('cert') || m.includes('ceh') || m.includes('oracle') || m.includes('award')) return botResponses.certifications;
    if (m.includes('ngo') || m.includes('social') || m.includes('contribution') || m.includes('volunteer')) return botResponses.ngo;
    if (m.includes('contact') || m.includes('reach') || m.includes('email') || m.includes('phone') || m.includes('linkedin')) return botResponses.contact;
    return botResponses.default;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setHasNotif(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = (text?: string) => {
    const msg = text || inputMessage;
    if (!msg.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text: msg, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botMsg: Message = { id: (Date.now() + 1).toString(), text: getBotResponse(msg), sender: 'bot', timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
    }, 1000 + Math.random() * 500);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .chat-panel {
          position: fixed;
          bottom: 90px;
          right: 24px;
          z-index: 40;
          width: 360px;
          background: #080d14;
          border: 1px solid rgba(0,212,255,0.15);
          border-radius: 24px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(0,212,255,0.05);
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
          animation: chat-in 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          transform-origin: bottom right;
        }
        @keyframes chat-in {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .chat-header {
          padding: 18px 20px;
          background: linear-gradient(135deg, rgba(123,47,247,0.2), rgba(0,212,255,0.1));
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chat-messages {
          height: 300px;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          scrollbar-width: thin;
          scrollbar-color: rgba(0,212,255,0.15) transparent;
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.15); border-radius: 2px; }

        .msg-bot {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          animation: msg-in 0.3s ease;
        }
        .msg-user {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          flex-direction: row-reverse;
          animation: msg-in 0.3s ease;
        }
        @keyframes msg-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .avatar {
          width: 30px; height: 30px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .bubble-bot {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 4px 16px 16px 16px;
          padding: 11px 14px;
          font-size: 13px;
          color: rgba(255,255,255,0.75);
          line-height: 1.6;
          max-width: 78%;
        }
        .bubble-user {
          background: linear-gradient(135deg, #7b2ff7, #00d4ff);
          border-radius: 16px 4px 16px 16px;
          padding: 11px 14px;
          font-size: 13px;
          color: white;
          line-height: 1.6;
          max-width: 78%;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 12px 14px;
        }
        .typing-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(0,212,255,0.5);
          animation: dot-bounce 1.2s ease infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-5px); opacity: 1; }
        }

        .quick-replies {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          padding: 10px 16px;
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .quick-reply-btn {
          padding: 5px 12px;
          border-radius: 100px;
          background: rgba(0,212,255,0.07);
          border: 1px solid rgba(0,212,255,0.15);
          color: rgba(0,212,255,0.8);
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .quick-reply-btn:hover {
          background: rgba(0,212,255,0.15);
          border-color: rgba(0,212,255,0.35);
          color: #00d4ff;
        }

        .chat-input-area {
          padding: 12px 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .chat-input {
          flex: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 10px 14px;
          color: white;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .chat-input::placeholder { color: rgba(255,255,255,0.2); }
        .chat-input:focus { border-color: rgba(0,212,255,0.35); background: rgba(0,212,255,0.04); }
        .send-btn {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #7b2ff7, #00d4ff);
          border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
          flex-shrink: 0;
        }
        .send-btn:hover { transform: scale(1.08); box-shadow: 0 5px 20px rgba(123,47,247,0.4); }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 50;
          width: 56px; height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7b2ff7, #00d4ff);
          border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 8px 30px rgba(123,47,247,0.4);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .fab:hover { transform: scale(1.1); box-shadow: 0 12px 40px rgba(123,47,247,0.55); }
        .fab:active { transform: scale(0.95); }

        .notif-dot {
          position: absolute;
          top: 2px; right: 2px;
          width: 12px; height: 12px;
          border-radius: 50%;
          background: #ff006e;
          border: 2px solid #020408;
          animation: notif-pulse 2s ease infinite;
        }
        @keyframes notif-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,0,110,0.4); }
          50% { box-shadow: 0 0 0 6px rgba(255,0,110,0); }
        }

        .close-btn {
          width: 30px; height: 30px;
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: rgba(255,255,255,0.5);
          transition: all 0.2s ease;
        }
        .close-btn:hover { background: rgba(255,0,110,0.1); border-color: rgba(255,0,110,0.3); color: #ff006e; }
      `}</style>

      {/* FAB */}
      <button className="fab" onClick={() => setIsOpen(o => !o)}>
        {isOpen ? <X size={22} color="white" /> : <MessageCircle size={22} color="white" />}
        {!isOpen && hasNotif && <div className="notif-dot" />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="chat-panel">
          {/* Header */}
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #7b2ff7, #00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={17} color="white" />
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>Shivam's Assistant</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', animation: 'notif-pulse 2s ease infinite' }} />
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>Online</span>
                </div>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}><X size={14} /></button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={msg.sender === 'user' ? 'msg-user' : 'msg-bot'}>
                <div className="avatar" style={{ background: msg.sender === 'user' ? 'linear-gradient(135deg, #7b2ff7, #00d4ff)' : 'rgba(0,212,255,0.1)', border: msg.sender === 'bot' ? '1px solid rgba(0,212,255,0.2)' : 'none' }}>
                  {msg.sender === 'user' ? <User size={14} color="white" /> : <Bot size={14} color="#00d4ff" />}
                </div>
                <div className={msg.sender === 'user' ? 'bubble-user' : 'bubble-bot'}>{msg.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="msg-bot">
                <div className="avatar" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                  <Bot size={14} color="#00d4ff" />
                </div>
                <div className="bubble-bot" style={{ padding: 0 }}>
                  <div className="typing-dots">
                    <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="quick-replies">
            {quickReplies.map(r => (
              <button key={r} className="quick-reply-btn" onClick={() => sendMessage(r)}>{r}</button>
            ))}
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <input
              ref={inputRef}
              className="chat-input"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about Shivam..."
            />
            <button className="send-btn" onClick={() => sendMessage()} disabled={!inputMessage.trim() || isTyping}>
              <Send size={15} color="white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;