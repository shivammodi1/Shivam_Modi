import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "#020408" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&display=swap');

        .arc-reactor {
          position: relative;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .arc-core {
          position: absolute;
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, #00d4ff 0%, #0099cc 50%, transparent 70%);
          border-radius: 50%;
          box-shadow: 
            0 0 40px rgba(0, 212, 255, 0.8),
            0 0 80px rgba(0, 212, 255, 0.5),
            inset 0 0 30px rgba(0, 212, 255, 0.6);
          animation: pulse-core 2s ease-in-out infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
        }

        .arc-initials {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: white;
          text-shadow: 
            0 0 10px rgba(0, 212, 255, 0.8),
            0 0 20px rgba(0, 212, 255, 0.6);
          letter-spacing: 2px;
        }

        .arc-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid;
          animation: spin linear infinite;
        }

        .ring-1 {
          width: 120px;
          height: 120px;
          border-color: rgba(0, 212, 255, 0.4);
          border-style: solid;
          border-top-color: transparent;
          border-left-color: transparent;
          animation-duration: 3s;
        }

        .ring-2 {
          width: 160px;
          height: 160px;
          border-color: rgba(123, 47, 247, 0.3);
          border-style: dashed;
          border-bottom-color: transparent;
          border-right-color: transparent;
          animation-duration: 4s;
          animation-direction: reverse;
        }

        .ring-3 {
          width: 200px;
          height: 200px;
          border-color: rgba(0, 212, 255, 0.2);
          border-style: solid;
          border-top-color: transparent;
          animation-duration: 5s;
        }

        .arc-node {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #00d4ff;
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(0, 212, 255, 0.9);
          animation: node-pulse 1.5s ease-in-out infinite;
        }

        .node-1 { top: 0; left: 50%; transform: translateX(-50%); animation-delay: 0s; }
        .node-2 { top: 50%; right: 0; transform: translateY(-50%); animation-delay: 0.375s; }
        .node-3 { bottom: 0; left: 50%; transform: translateX(-50%); animation-delay: 0.75s; }
        .node-4 { top: 50%; left: 0; transform: translateY(-50%); animation-delay: 1.125s; }
        .node-5 { top: 15%; right: 15%; animation-delay: 0.2s; }
        .node-6 { bottom: 15%; right: 15%; animation-delay: 0.5s; }
        .node-7 { bottom: 15%; left: 15%; animation-delay: 0.9s; }
        .node-8 { top: 15%; left: 15%; animation-delay: 1.3s; }

        .energy-beam {
          position: absolute;
          width: 2px;
          height: 40px;
          background: linear-gradient(to bottom, rgba(0, 212, 255, 0.8), transparent);
          animation: beam-flicker 2s ease-in-out infinite;
        }

        .beam-1 { top: -45px; left: 50%; transform: translateX(-50%); animation-delay: 0s; }
        .beam-2 { bottom: -45px; left: 50%; transform: translateX(-50%) rotate(180deg); animation-delay: 0.5s; }
        .beam-3 { left: -45px; top: 50%; transform: translateY(-50%) rotate(90deg); animation-delay: 1s; }
        .beam-4 { right: -45px; top: 50%; transform: translateY(-50%) rotate(-90deg); animation-delay: 1.5s; }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-core {
          0%, 100% {
            transform: scale(1);
            box-shadow: 
              0 0 40px rgba(0, 212, 255, 0.8),
              0 0 80px rgba(0, 212, 255, 0.5),
              inset 0 0 30px rgba(0, 212, 255, 0.6);
          }
          50% {
            transform: scale(1.1);
            box-shadow: 
              0 0 60px rgba(0, 212, 255, 1),
              0 0 100px rgba(0, 212, 255, 0.7),
              inset 0 0 40px rgba(0, 212, 255, 0.8);
          }
        }

        @keyframes node-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
          }
        }

        @keyframes beam-flicker {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }

        .loading-text {
          margin-top: 60px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          animation: text-fade 2s ease-in-out infinite;
        }

        @keyframes text-fade {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
          animation: orb-float 4s ease-in-out infinite;
        }

        .orb-1 {
          width: 150px;
          height: 150px;
          background: rgba(0, 212, 255, 0.15);
          top: -50px;
          left: -50px;
        }

        .orb-2 {
          width: 120px;
          height: 120px;
          background: rgba(123, 47, 247, 0.12);
          bottom: -40px;
          right: -40px;
          animation-delay: 2s;
        }

        @keyframes orb-float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
      `}</style>

      {/* Ambient orbs */}
      <div className="glow-orb orb-1" />
      <div className="glow-orb orb-2" />

      <div className="flex flex-col items-center">
        <div className="arc-reactor">
          {/* Energy beams */}
          <div className="energy-beam beam-1" />
          <div className="energy-beam beam-2" />
          <div className="energy-beam beam-3" />
          <div className="energy-beam beam-4" />

          {/* Rotating rings */}
          <div className="arc-ring ring-3" />
          <div className="arc-ring ring-2" />
          <div className="arc-ring ring-1" />

          {/* Energy nodes */}
          <div className="arc-node node-1" />
          <div className="arc-node node-2" />
          <div className="arc-node node-3" />
          <div className="arc-node node-4" />
          <div className="arc-node node-5" />
          <div className="arc-node node-6" />
          <div className="arc-node node-7" />
          <div className="arc-node node-8" />

          {/* Core with initials */}
          <div className="arc-core">
            <div className="arc-initials">SM</div>
          </div>
        </div>

        <div className="loading-text">Initializing</div>
      </div>
    </div>
  );
};

export default Loader;