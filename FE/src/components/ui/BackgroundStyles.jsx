import React from 'react';

// 1. Grid Pattern dengan Glow (Modern SaaS)
export function GridGlowBG({ children }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#F8FAFC]">
      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0" 
           style={{ 
             backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)', 
             backgroundSize: '40px 40px',
             maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 30%, transparent 100%)',
             WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 30%, transparent 100%)'
           }}>
      </div>
      {/* Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px] z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[120px] z-0"></div>
      
      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  );
}

// 2. Aurora / Animated Mesh Gradient
export function AuroraBG({ children, className = "", ...props }) {
  return (
    <div className={`relative w-full min-h-screen overflow-hidden bg-[#F4F6FB] ${className}`} {...props}>
      <style>
        {`
          @keyframes aurora-1 {
            0% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(50px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 40px) scale(0.9); }
            100% { transform: translate(0, 0) scale(1); }
          }
          @keyframes aurora-2 {
            0% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-50px, 50px) scale(1.2); }
            66% { transform: translate(40px, -20px) scale(0.8); }
            100% { transform: translate(0, 0) scale(1); }
          }
        `}
      </style>
      {/* Animated Blobs - Fixed to viewport so they scroll with the user */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[0%] left-[10%] w-[500px] h-[500px] rounded-full bg-blue-400/30 blur-[100px] opacity-70" style={{ animation: 'aurora-1 12s infinite alternate' }}></div>
        <div className="absolute bottom-[0%] right-[10%] w-[600px] h-[600px] rounded-full bg-purple-400/30 blur-[120px] opacity-70" style={{ animation: 'aurora-2 15s infinite alternate' }}></div>
        <div className="absolute top-[30%] left-[40%] w-[400px] h-[400px] rounded-full bg-pink-400/20 blur-[100px] opacity-70" style={{ animation: 'aurora-1 10s infinite alternate-reverse' }}></div>
      </div>
      
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}

// 3. Glassmorphism Blobs (Kaca)
export function GlassBlobsBG({ children }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#E2E8F0]">
      {/* Static Bright Blobs for Glass Effect */}
      <div className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 blur-[90px] opacity-90 z-0"></div>
      <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 blur-[120px] opacity-90 z-0"></div>
      
      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  );
}

// 4. Abstract Particles (Floating Nodes Light Mode)
export function ParticlesBG({ children, className = "", ...props }) {
  return (
    <div className={`relative w-full min-h-screen bg-[#F8FAFC] ${className}`} {...props}>
      <style>
        {`
          @keyframes float-up {
            0% { transform: translateY(100vh) scale(0); opacity: 0; }
            20% { opacity: 0.8; }
            80% { opacity: 0.8; }
            100% { transform: translateY(-10vh) scale(1); opacity: 0; }
          }
          .particle {
            position: absolute;
            border-radius: 50%;
            animation: float-up linear infinite;
          }
        `}
      </style>
      {/* Grid subtle background for extra tech feel */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(57,117,230,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(57,117,230,0.03)_1px,transparent_1px)] bg-[size:30px_30px] z-0"></div>
      
      {/* Nodes / Dots fixed to viewport */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className="particle z-0"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              animationDuration: `${Math.random() * 15 + 15}s`,
              animationDelay: `-${Math.random() * 15}s`, // Negative delay so they start already on screen
              background: i % 3 === 0 ? 'rgba(158,76,198,0.5)' : 'rgba(57,117,230,0.5)',
              boxShadow: '0 0 10px rgba(57,117,230,0.3)'
            }}
          ></div>
        ))}
      </div>
      
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}

// 5. Animated Data Waves (Gelombang Arus Kas)
export function WavesBG({ children, className = "", ...props }) {
  return (
    <div className={`relative w-full min-h-screen overflow-hidden bg-[#F8FAFC] ${className}`} {...props}>
      <style>
        {`
          @keyframes wave-move {
            0% { transform: translateX(0) translateZ(0) scaleY(1); }
            50% { transform: translateX(-25%) translateZ(0) scaleY(0.7); }
            100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
          }
          .wave-layer {
            position: absolute;
            left: 0;
            width: 200%;
            height: 100%;
            background-repeat: repeat-x;
            background-position: 0 bottom;
            transform-origin: center bottom;
          }
        `}
      </style>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="wave-layer bottom-[-10%]" 
          style={{ 
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-31.8z' fill='%233975E6' opacity='0.2'/%3E%3C/svg%3E\")",
            backgroundSize: "50% 120px",
            animation: "wave-move 12s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite" 
          }}
        ></div>
        <div 
          className="wave-layer bottom-[-5%]" 
          style={{ 
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-31.8z' fill='%239E4CC6' opacity='0.15'/%3E%3C/svg%3E\")",
            backgroundSize: "50% 150px",
            animation: "wave-move 18s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite reverse"
          }}
        ></div>
        <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-[100px]"></div>
      </div>
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}

// 6. Pulsing Radar / Sonar Rings
export function SonarBG({ children, className = "", ...props }) {
  return (
    <div className={`relative w-full min-h-screen overflow-hidden bg-[#F4F6FB] ${className}`} {...props}>
      <style>
        {`
          @keyframes sonar {
            0% { transform: scale(0.2); opacity: 0.8; border-width: 4px; }
            100% { transform: scale(3.5); opacity: 0; border-width: 1px; }
          }
          .sonar-ring {
            position: absolute;
            border-radius: 50%;
            border: 2px solid rgba(57,117,230,0.5);
            top: 50%;
            left: 50%;
            margin-top: -150px;
            margin-left: -150px;
            width: 300px;
            height: 300px;
            animation: sonar 4.5s linear infinite;
          }
        `}
      </style>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
         <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[120px]"></div>
         <div className="absolute bottom-[20%] left-[20%] w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[120px]"></div>

         <div className="sonar-ring" style={{ animationDelay: '0s' }}></div>
         <div className="sonar-ring" style={{ animationDelay: '1.5s' }}></div>
         <div className="sonar-ring" style={{ animationDelay: '3.0s' }}></div>
      </div>
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
