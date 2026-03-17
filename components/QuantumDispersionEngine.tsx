
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Wind, Thermometer, Zap, Activity, Info, ShieldCheck } from 'lucide-react';
import { simulateQuantumDispersion, DispersionPoint } from '../src/services/quantumAIService';

interface QuantumDispersionEngineProps {
  wind?: { x: number, y: number };
  temperature?: number;
  sources?: { x: number, y: number, strength: number }[];
  showProbabilityField?: boolean;
  showParticles?: boolean;
  interventionActive?: boolean;
}

const QuantumDispersionEngine: React.FC<QuantumDispersionEngineProps> = ({
  wind = { x: 0.5, y: 0.1 },
  temperature = 25,
  sources = [{ x: 20, y: 50, strength: 1.0 }],
  showProbabilityField = true,
  showParticles = true,
  interventionActive = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dispersionData, setDispersionData] = useState<DispersionPoint[]>([]);
  const [particles, setParticles] = useState<{ x: number, y: number, vx: number, vy: number, life: number }[]>([]);

  // Adjust sources based on intervention
  const activeSources = useMemo(() => {
    if (!interventionActive) return sources;
    return sources.map(s => ({ ...s, strength: s.strength * 0.3 }));
  }, [sources, interventionActive]);

  useEffect(() => {
    const data = simulateQuantumDispersion(20, activeSources, wind, temperature);
    setDispersionData(data);
  }, [activeSources, wind, temperature]);

  // Particle animation loop
  useEffect(() => {
    let animationFrame: number;
    
    const updateParticles = () => {
      setParticles(prev => {
        const next = prev.map(p => ({
          ...p,
          x: (p.x + p.vx + 100) % 100,
          y: (p.y + p.vy + 100) % 100,
          life: p.life - 0.01
        })).filter(p => p.life > 0);

        // Spawn new particles based on probability field
        if (next.length < 150 && showParticles) {
          const spawnPoint = dispersionData[Math.floor(Math.random() * dispersionData.length)];
          if (spawnPoint && Math.random() < spawnPoint.probability) {
            next.push({
              x: spawnPoint.x,
              y: spawnPoint.y,
              vx: spawnPoint.velocity.x * 0.5,
              vy: spawnPoint.velocity.y * 0.5,
              life: 1.0
            });
          }
        }
        return next;
      });
      animationFrame = requestAnimationFrame(updateParticles);
    };

    animationFrame = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animationFrame);
  }, [dispersionData, showParticles]);

  // Canvas rendering for probability field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !showProbabilityField) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const cellSize = canvas.width / 20;
      
      dispersionData.forEach(point => {
        const x = (point.x / 100) * canvas.width;
        const y = (point.y / 100) * canvas.height;
        
        // Draw probability cell
        const alpha = Math.min(0.6, point.probability * 0.8);
        ctx.fillStyle = interventionActive 
          ? `rgba(34, 211, 238, ${alpha * 0.5})` // Cyan for clean
          : `rgba(168, 85, 247, ${alpha})`;      // Purple for pollution
        
        ctx.beginPath();
        ctx.arc(x, y, cellSize * 0.8, 0, Math.PI * 2);
        ctx.fill();

        // Optional: Draw "wave" interference lines
        if (point.probability > 0.5) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.2})`;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x - cellSize/2, y - cellSize/2, cellSize, cellSize);
        }
      });
    };

    render();
  }, [dispersionData, showProbabilityField, interventionActive]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-[32px] bg-slate-950 border border-slate-800 shadow-2xl">
      {/* Probability Field Canvas */}
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
      />

      {/* Particle System (SVG for crispness and motion) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {particles.map((p, i) => (
          <circle
            key={i}
            cx={`${p.x}%`}
            cy={`${p.y}%`}
            r={2 * p.life}
            fill={interventionActive ? '#22d3ee' : '#a855f7'}
            opacity={p.life * 0.6}
          />
        ))}
      </svg>

      {/* Simulation HUD */}
      <div className="absolute top-6 left-6 flex flex-col gap-3 z-20">
        <div className="glass px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-3">
          <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantum Dispersion Engine v1.0</span>
        </div>
        
        <div className="flex gap-2">
          <div className="glass px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
            <Wind className="w-3 h-3 text-blue-400" />
            <span className="text-[9px] font-mono text-slate-300">WIND: {wind.x.toFixed(1)}, {wind.y.toFixed(1)}</span>
          </div>
          <div className="glass px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
            <Thermometer className="w-3 h-3 text-orange-400" />
            <span className="text-[9px] font-mono text-slate-300">TEMP: {temperature}°C</span>
          </div>
        </div>
      </div>

      {/* Intervention Status */}
      {interventionActive && (
        <div className="absolute top-6 right-6 z-20">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl flex items-center gap-2 backdrop-blur-md"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Quantum Scrubbing Active</span>
          </motion.div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-20">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">High Probability Density</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Quantum-Filtered Zone</span>
        </div>
      </div>

      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>
    </div>
  );
};

export default QuantumDispersionEngine;
