
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Map as MapIcon, 
  Trees, 
  Wind, 
  Navigation, 
  CarFront, 
  ShieldAlert, 
  CheckCircle2,
  Layers,
  Zap,
  Maximize2,
  BrainCircuit,
  ArrowUpRight
} from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  pollution: number; // 0-100
  x: number;
  y: number;
  width: number;
  height: number;
  intervention?: 'trees' | 'corridor' | 'pedestrian' | 'traffic';
}

const INITIAL_ZONES: Zone[] = [
  { id: 'z1', name: 'Industrial Hub', pollution: 85, x: 10, y: 10, width: 30, height: 25 },
  { id: 'z2', name: 'Central Transit', pollution: 70, x: 45, y: 15, width: 45, height: 20 },
  { id: 'z3', name: 'Residential North', pollution: 40, x: 15, y: 40, width: 25, height: 30 },
  { id: 'z4', name: 'Commercial District', pollution: 60, x: 50, y: 45, width: 40, height: 25 },
  { id: 'z5', name: 'South Parklands', pollution: 20, x: 20, y: 75, width: 60, height: 15 },
];

const GreenCityAdvisor: React.FC = () => {
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  const selectedZone = useMemo(() => 
    zones.find(z => z.id === selectedZoneId), 
  [zones, selectedZoneId]);

  const applyIntervention = (type: Zone['intervention']) => {
    if (!selectedZoneId) return;
    
    setZones(prev => prev.map(z => {
      if (z.id === selectedZoneId) {
        const reduction = type === 'trees' ? 25 : type === 'corridor' ? 20 : type === 'pedestrian' ? 15 : 30;
        return { 
          ...z, 
          intervention: type, 
          pollution: Math.max(10, z.pollution - reduction) 
        };
      }
      return z;
    }));
  };

  const resetZones = () => setZones(INITIAL_ZONES);

  const getPollutionColor = (level: number) => {
    if (level > 70) return '#f43f5e'; // Red
    if (level > 40) return '#fb923c'; // Yellow
    return '#84cc16'; // Green
  };

  return (
    <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter mb-2">Green City Advisor</h2>
          <p className="text-slate-500 text-lg font-medium">Urban air quality simulation & intervention planning.</p>
        </div>
        <button 
          onClick={resetZones}
          className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors"
        >
          Reset Simulation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Map View */}
        <div className="lg:col-span-8">
          <div className="glass rounded-[40px] border border-slate-800 p-8 relative overflow-hidden h-[600px]">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px]"></div>
            </div>

            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
              {/* City Grid Lines */}
              <g className="opacity-10">
                {[...Array(10)].map((_, i) => (
                  <React.Fragment key={i}>
                    <line x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="#94a3b8" strokeWidth="0.1" />
                    <line x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="#94a3b8" strokeWidth="0.1" />
                  </React.Fragment>
                ))}
              </g>

              {/* Zones */}
              {zones.map((zone) => (
                <motion.g 
                  key={zone.id}
                  onClick={() => setSelectedZoneId(zone.id)}
                  className="cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.rect
                    x={zone.x}
                    y={zone.y}
                    width={zone.width}
                    height={zone.height}
                    rx="2"
                    fill={getPollutionColor(zone.pollution)}
                    initial={{ opacity: 0.1 }}
                    animate={{ 
                      opacity: selectedZoneId === zone.id ? 0.4 : 0.2,
                      fill: getPollutionColor(zone.pollution)
                    }}
                    className="transition-colors duration-1000"
                  />
                  <motion.rect
                    x={zone.x}
                    y={zone.y}
                    width={zone.width}
                    height={zone.height}
                    rx="2"
                    fill="none"
                    stroke={getPollutionColor(zone.pollution)}
                    strokeWidth="0.5"
                    animate={{ 
                      strokeOpacity: selectedZoneId === zone.id ? 1 : 0.5,
                      stroke: getPollutionColor(zone.pollution)
                    }}
                  />
                  
                  {/* Intervention Icons */}
                  {zone.intervention === 'trees' && (
                    <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transform={`translate(${zone.x + zone.width/2 - 2}, ${zone.y + zone.height/2 - 2})`}>
                      <circle r="4" fill="#84cc16" fillOpacity="0.2" className="animate-pulse" />
                      <path d="M0 -2 L1.5 1 L-1.5 1 Z" fill="#84cc16" />
                    </motion.g>
                  )}
                  {zone.intervention === 'corridor' && (
                    <motion.path 
                      d={`M${zone.x} ${zone.y + zone.height/2} Q${zone.x + zone.width/2} ${zone.y + zone.height/2 - 5} ${zone.x + zone.width} ${zone.y + zone.height/2}`}
                      stroke="#22d3ee"
                      strokeWidth="0.5"
                      fill="none"
                      strokeDasharray="2 2"
                      animate={{ strokeDashoffset: [0, -10] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    />
                  )}
                </motion.g>
              ))}

              {/* Particle Overlay (Pollution) */}
              <g className="pointer-events-none">
                {zones.map(zone => (
                  [...Array(Math.floor(zone.pollution / 5))].map((_, i) => (
                    <motion.circle
                      key={`${zone.id}-p-${i}`}
                      cx={zone.x + Math.random() * zone.width}
                      cy={zone.y + Math.random() * zone.height}
                      r="0.3"
                      fill={getPollutionColor(zone.pollution)}
                      animate={{ 
                        opacity: [0.1, 0.4, 0.1],
                        y: [0, -2, 0]
                      }}
                      transition={{ 
                        duration: 2 + Math.random() * 2, 
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                    />
                  ))
                ))}
              </g>
            </svg>

            {/* Map Legend */}
            <div className="absolute bottom-8 left-8 flex gap-6 glass p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                <span className="text-[10px] font-black uppercase text-slate-400">Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(251,146,60,0.5)]" />
                <span className="text-[10px] font-black uppercase text-slate-400">Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-lime-500 shadow-[0_0_10px_rgba(163,230,71,0.5)]" />
                <span className="text-[10px] font-black uppercase text-slate-400">Optimal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="lg:col-span-4 space-y-6">
          <AnimatePresence mode="wait">
            {selectedZone ? (
              <motion.div 
                key={selectedZone.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass p-8 rounded-[32px] border border-slate-800 space-y-8"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-3xl font-black text-white tracking-tighter">{selectedZone.name}</h3>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      selectedZone.pollution > 70 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 
                      selectedZone.pollution > 40 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 
                      'bg-lime-500/20 text-lime-400 border border-lime-500/30'
                    }`}>
                      {selectedZone.pollution > 70 ? 'Critical' : selectedZone.pollution > 40 ? 'Moderate' : 'Optimal'}
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm">Zone ID: {selectedZone.id.toUpperCase()}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                    <span>Air Quality Index</span>
                    <span>{selectedZone.pollution}% Pollution</span>
                  </div>
                  <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedZone.pollution}%` }}
                      className="h-full transition-colors duration-1000"
                      style={{ backgroundColor: getPollutionColor(selectedZone.pollution) }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recommended Interventions</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={() => applyIntervention('trees')}
                      disabled={selectedZone.intervention === 'trees'}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        selectedZone.intervention === 'trees' 
                          ? 'border-lime-400 bg-lime-400/10 text-lime-400' 
                          : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Trees className="w-5 h-5" />
                        <span className="text-sm font-bold">Tree Plantation</span>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-40" />
                    </button>

                    <button 
                      onClick={() => applyIntervention('corridor')}
                      disabled={selectedZone.intervention === 'corridor'}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        selectedZone.intervention === 'corridor' 
                          ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400' 
                          : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Wind className="w-5 h-5" />
                        <span className="text-sm font-bold">Green Corridor</span>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-40" />
                    </button>

                    <button 
                      onClick={() => applyIntervention('pedestrian')}
                      disabled={selectedZone.intervention === 'pedestrian'}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        selectedZone.intervention === 'pedestrian' 
                          ? 'border-magenta-400 bg-magenta-400/10 text-magenta-400' 
                          : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Navigation className="w-5 h-5" />
                        <span className="text-sm font-bold">Pedestrian Zone</span>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-40" />
                    </button>

                    <button 
                      onClick={() => applyIntervention('traffic')}
                      disabled={selectedZone.intervention === 'traffic'}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        selectedZone.intervention === 'traffic' 
                          ? 'border-blue-400 bg-blue-400/10 text-blue-400' 
                          : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CarFront className="w-5 h-5" />
                        <span className="text-sm font-bold">Traffic Reduction</span>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-40" />
                    </button>
                  </div>
                </div>

                {selectedZone.intervention && (
                  <div className="p-4 bg-lime-400/5 border border-lime-400/20 rounded-2xl flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-lime-400" />
                    <p className="text-xs text-lime-400 font-bold uppercase tracking-wider">Intervention Active: {selectedZone.intervention.toUpperCase()}</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="glass p-8 rounded-[32px] border border-slate-800 h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="p-6 bg-slate-900 rounded-full border border-slate-800">
                  <Maximize2 className="w-12 h-12 text-slate-700" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-300 uppercase tracking-widest">Select a Zone</h3>
                  <p className="text-slate-500 text-sm max-w-[200px]">Click on a map sector to view detailed air quality metrics and plan interventions.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quantum Strategy Hub Integration */}
      <div className="w-full">
        <div className="glass p-10 rounded-[3rem] border-emerald-400/20 bg-gradient-to-br from-emerald-400/5 to-transparent flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[2rem] bg-emerald-400/10 flex items-center justify-center border border-emerald-400/20 shadow-[0_0_30px_rgba(52,211,153,0.2)]">
              <BrainCircuit className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-white tracking-tight">Quantum Strategy Hub</h3>
              <p className="text-slate-400 max-w-md">Bridge urban planning with quantum-optimized policy decisions.</p>
            </div>
          </div>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('set-workflow', { detail: 'decision-engine' }))}
            className="px-8 py-5 bg-emerald-400 text-slate-950 rounded-2xl font-black flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_40px_rgba(52,211,153,0.3)]"
          >
            Launch Decision Engine
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

export default GreenCityAdvisor;
