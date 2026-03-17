
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, 
  CloudSun, 
  Moon, 
  Wind, 
  Car, 
  Factory, 
  Clock,
  Play,
  Pause,
  Info,
  CloudRain,
  Zap,
  Star,
  Activity as ActivityIcon
} from 'lucide-react';
import QuantumDispersionEngine from './QuantumDispersionEngine';

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

const TIME_CONFIG = {
  morning: {
    label: 'Morning',
    icon: Sun,
    bg: 'from-sky-400/40 via-blue-500/20 to-orange-400/40',
    particleDensity: 40,
    windSpeed: 2,
    desc: 'The sun rises over the horizon, casting a sky-blue and orange glow. Peak traffic hour begins as a surge of two-wheelers, trucks, and cars releases emissions into the waking city.',
    pollutionSources: ['traffic']
  },
  afternoon: {
    label: 'Afternoon',
    icon: CloudSun,
    bg: 'from-orange-900 via-red-900/60 to-yellow-800/40',
    particleDensity: 70,
    windSpeed: 4,
    desc: 'Industrial zones are in full operation. High thermal energy from the sun accelerates chemical reactions, while heavy trucks and commercial vehicles continue to add to the smog profile.',
    pollutionSources: ['traffic', 'industrial']
  },
  evening: {
    label: 'Evening',
    icon: CloudRain,
    bg: 'from-blue-950 via-slate-900 to-black',
    particleDensity: 100,
    windSpeed: 1.5,
    desc: 'Atmospheric cooling and rain trap industrial residuals and evening commute emissions. Burning of fuels in factories creates visible plumes against the greyish-black sky.',
    pollutionSources: ['traffic', 'industrial', 'residual']
  },
  night: {
    label: 'Night',
    icon: Moon,
    bg: 'from-slate-900 via-slate-950 to-black',
    particleDensity: 30,
    windSpeed: 1,
    desc: 'The city settles under a starlit sky. Residual pollutants linger in the cooling air, visible as a faint haze against the celestial backdrop.',
    pollutionSources: ['residual']
  }
};

const TrafficLight = ({ x, y, active = 'red' }: { x: number, y: number, active?: 'red' | 'yellow' | 'green' }) => (
  <div className="absolute z-20" style={{ left: `${x}%`, bottom: `${y}%` }}>
    <div className="w-2 h-6 bg-slate-900 border border-slate-700 rounded-sm flex flex-col items-center justify-around py-0.5 shadow-lg">
      <div className={`w-1 h-1 rounded-full ${active === 'red' ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-red-900/40'}`}></div>
      <div className={`w-1 h-1 rounded-full ${active === 'yellow' ? 'bg-yellow-500 shadow-[0_0_8px_yellow]' : 'bg-yellow-900/40'}`}></div>
      <div className={`w-1 h-1 rounded-full ${active === 'green' ? 'bg-green-500 shadow-[0_0_8px_green]' : 'bg-green-900/40'}`}></div>
    </div>
    <div className="w-0.5 h-12 bg-slate-800 mx-auto"></div>
  </div>
);

const Vehicle = ({ type, lane, direction = 1, speed, delay }: { type: '2w' | '3w' | '4w-s' | '4w-b', lane: number, direction?: 1 | -1, speed: number, delay: number }) => {
  const colors = ['#22d3ee', '#d946ef', '#84cc16', '#3b82f6', '#f43f5e'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <motion.div
      className="absolute z-10"
      style={{ bottom: `${10 + lane * 4}%` }}
      initial={{ x: direction === 1 ? '-10%' : '110%' }}
      animate={{ x: direction === 1 ? '110%' : '-10%' }}
      transition={{ duration: speed, repeat: Infinity, delay, ease: "linear" }}
    >
      <div className="relative">
        {/* Vehicle Body */}
        {type === '2w' && <div className="w-3 h-1.5 bg-slate-400 rounded-full" style={{ backgroundColor: color }} />}
        {type === '3w' && <div className="w-4 h-2.5 bg-yellow-500 rounded-t-sm" />}
        {type === '4w-s' && <div className="w-6 h-2 bg-slate-300 rounded-sm" style={{ backgroundColor: color }} />}
        {type === '4w-b' && <div className="w-10 h-4 bg-slate-600 rounded-sm" />}
        
        {/* Pollution Trail */}
        <motion.div 
          className="absolute -left-2 top-1/2 w-4 h-2 bg-slate-500/20 blur-sm rounded-full"
          animate={{ scale: [1, 2], opacity: [0.5, 0], x: direction === 1 ? -10 : 10 }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
};

const FactoryVisual = ({ x, y, smokeColor = '#64748b' }: { x: number, y: number, smokeColor?: string }) => (
  <div className="absolute z-10" style={{ left: `${x}%`, bottom: `${y}%` }}>
    <div className="relative">
      <div className="w-12 h-16 bg-slate-800 rounded-t-lg border-x border-t border-slate-700">
        <div className="absolute -top-8 left-2 w-3 h-10 bg-slate-700 rounded-t-sm" />
        <div className="absolute -top-6 left-7 w-2 h-8 bg-slate-700 rounded-t-sm" />
      </div>
      {/* Smoke Plumes */}
      <motion.div 
        className="absolute -top-12 left-2 w-6 h-6 rounded-full blur-md"
        style={{ backgroundColor: smokeColor }}
        animate={{ y: [-10, -50], x: [0, 20], opacity: [0.6, 0], scale: [1, 3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.div 
        className="absolute -top-10 left-7 w-4 h-4 rounded-full blur-md"
        style={{ backgroundColor: smokeColor }}
        animate={{ y: [-5, -40], x: [0, 15], opacity: [0.5, 0], scale: [1, 2.5] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5, ease: "easeOut" }}
      />
    </div>
  </div>
);

const AirStoryMode: React.FC = () => {
  const [time, setTime] = useState<TimeOfDay>('morning');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isQuantumView, setIsQuantumView] = useState(false);

  const config = TIME_CONFIG[time];

  const particles = useMemo(() => {
    return [...Array(config.particleDensity)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 2 + 1,
      delay: Math.random() * 5
    }));
  }, [time, config.particleDensity]);

  const stars = useMemo(() => {
    return [...Array(100)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 70,
      size: Math.random() * 2,
      opacity: Math.random() * 0.8 + 0.2
    }));
  }, []);

  return (
    <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter mb-2">Air Story Mode</h2>
          <p className="text-slate-500 text-lg font-medium">Narrative visualization of atmospheric evolution over a 24-hour cycle.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visualization Stage */}
        <div className="lg:col-span-8">
          <div className={`relative h-[600px] rounded-[40px] border border-slate-800 overflow-hidden bg-gradient-to-b transition-all duration-1000 ${config.bg}`}>
            
            {/* Night Sky Elements */}
            {time === 'night' && (
              <div className="absolute inset-0 pointer-events-none">
                {stars.map(s => (
                  <motion.div 
                    key={s.id}
                    className="absolute bg-white rounded-full"
                    style={{ 
                      left: `${s.x}%`, 
                      top: `${s.y}%`, 
                      width: s.size, 
                      height: s.size,
                      opacity: s.opacity 
                    }}
                    animate={{ opacity: [s.opacity, s.opacity * 0.5, s.opacity] }}
                    transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
                  />
                ))}
                {/* Moon */}
                <div className="absolute top-12 right-20 w-16 h-16 rounded-full bg-slate-200 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                  <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-slate-300/50" />
                  <div className="absolute bottom-4 right-6 w-3 h-3 rounded-full bg-slate-300/50" />
                </div>
                {/* Shooting Star */}
                <motion.div 
                  className="absolute h-px bg-gradient-to-r from-transparent via-white to-transparent"
                  initial={{ width: 0, x: '20%', y: '10%', rotate: -20, opacity: 0 }}
                  animate={{ width: [0, 100, 0], x: ['20%', '60%'], y: ['10%', '30%'], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 8 }}
                />
              </div>
            )}

            {/* Morning Sunrise */}
            {time === 'morning' && (
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute bottom-48 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-gradient-to-t from-orange-500 to-yellow-300 blur-2xl opacity-60 z-0"
              />
            )}

            {/* Afternoon Sun */}
            {time === 'afternoon' && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-yellow-400 blur-xl opacity-40 animate-pulse" />
            )}

            {/* Evening Rain */}
            {time === 'evening' && (
              <div className="absolute inset-0 pointer-events-none z-30">
                {[...Array(50)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="absolute w-px h-8 bg-blue-400/30"
                    style={{ left: `${Math.random() * 100}%`, top: `-10%` }}
                    animate={{ y: ['0vh', '100vh'] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: Math.random() * 2, ease: "linear" }}
                  />
                ))}
              </div>
            )}

            {/* City Skyline Silhouette */}
            <div className="absolute bottom-0 left-0 right-0 h-48 opacity-40 pointer-events-none z-20">
              <svg viewBox="0 0 1000 200" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0,200 L0,150 L50,150 L50,100 L100,100 L100,160 L150,160 L150,80 L200,80 L200,170 L250,170 L250,120 L300,120 L300,180 L350,180 L350,60 L400,60 L400,150 L450,150 L450,110 L500,110 L500,160 L550,160 L550,90 L600,90 L600,170 L650,170 L650,130 L700,130 L700,180 L750,180 L750,70 L800,70 L800,160 L850,160 L850,120 L900,120 L900,190 L950,190 L950,140 L1000,140 L1000,200 Z" fill="#020617" />
              </svg>
            </div>

            {/* Dynamic Visuals based on Time */}
            <div className="absolute inset-0">
              {time === 'morning' && (
                <>
                  <TrafficLight x={20} y={15} active="red" />
                  <TrafficLight x={70} y={15} active="red" />
                  <Vehicle type="4w-b" lane={1} speed={12} delay={0} />
                  <Vehicle type="4w-s" lane={2} speed={8} delay={1} />
                  <Vehicle type="3w" lane={3} speed={15} delay={2} />
                  <Vehicle type="2w" lane={1} speed={6} delay={3} />
                  <Vehicle type="4w-b" lane={2} speed={14} delay={4} />
                  <Vehicle type="4w-s" lane={3} speed={9} delay={5} />
                  <Vehicle type="2w" lane={2} speed={5} delay={6} />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-cyan-400/60 uppercase tracking-[0.5em] animate-pulse">
                    Heavy Traffic Flow Detected
                  </div>
                </>
              )}

              {time === 'afternoon' && (
                <>
                  <FactoryVisual x={10} y={18} smokeColor="#94a3b8" />
                  <FactoryVisual x={80} y={18} smokeColor="#64748b" />
                  <TrafficLight x={45} y={15} active="green" />
                  <Vehicle type="4w-b" lane={1} speed={14} delay={0} />
                  <Vehicle type="4w-s" lane={2} speed={10} delay={1} />
                  <Vehicle type="4w-b" lane={3} speed={16} delay={3} />
                  <Vehicle type="2w" lane={2} speed={7} delay={2} />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-orange-400/60 uppercase tracking-[0.5em]">
                    Industrial Peak Operations
                  </div>
                </>
              )}

              {time === 'evening' && (
                <>
                  <FactoryVisual x={30} y={18} smokeColor="#1e293b" />
                  <TrafficLight x={20} y={15} active="yellow" />
                  <Vehicle type="4w-s" lane={1} speed={11} delay={0} />
                  <Vehicle type="4w-b" lane={2} speed={15} delay={2} />
                  <Vehicle type="4w-s" lane={3} speed={10} delay={4} />
                  <div className="absolute bottom-20 left-30 z-30">
                    <motion.div 
                      className="w-4 h-4 bg-orange-500 blur-sm rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                    <span className="text-[8px] font-bold text-orange-400 ml-6 uppercase">Fuel Combustion Simulation</span>
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-blue-400/60 uppercase tracking-[0.5em]">
                    Residual Trapping & Precipitation
                  </div>
                </>
              )}
            </div>

            {/* Pollution Particles */}
            <div className="absolute inset-0 pointer-events-none z-40">
              {isQuantumView ? (
                <QuantumDispersionEngine 
                  wind={{ x: config.windSpeed * 0.1, y: 0.05 }}
                  temperature={time === 'afternoon' ? 35 : time === 'night' ? 15 : 25}
                  sources={
                    time === 'morning' ? [{ x: 50, y: 80, strength: 0.8 }] :
                    time === 'afternoon' ? [{ x: 10, y: 80, strength: 1.0 }, { x: 80, y: 80, strength: 0.9 }] :
                    time === 'evening' ? [{ x: 30, y: 80, strength: 1.2 }] :
                    [{ x: 50, y: 80, strength: 0.3 }]
                  }
                  showProbabilityField={true}
                />
              ) : (
                particles.map((p) => (
                  <motion.div
                    key={`${time}-${p.id}`}
                    className={`absolute rounded-full blur-[1px] ${time === 'evening' ? 'bg-slate-900/60' : 'bg-slate-400/30'}`}
                    style={{ 
                      width: p.size, 
                      height: p.size,
                      left: `${p.x}%`,
                      top: `${p.y}%`
                    }}
                    animate={{ 
                      x: [0, 100 * config.windSpeed],
                      opacity: [0, 0.4, 0]
                    }}
                    transition={{ 
                      duration: 10 / config.windSpeed, 
                      repeat: Infinity, 
                      delay: p.delay,
                      ease: "linear"
                    }}
                  />
                ))
              )}
            </div>

            {/* Time Indicator Overlay */}
            <div className="absolute top-8 left-8 flex items-center gap-4 glass px-6 py-3 rounded-2xl border border-slate-800 z-50">
              <config.icon className="w-6 h-6 text-cyan-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Atmospheric State</span>
                <span className="text-xl font-black text-white tracking-tight">{config.label}</span>
              </div>
            </div>

            {/* Wind Stream Visualization */}
            <div className="absolute top-1/2 left-0 right-0 h-1 opacity-20 z-10">
               <motion.div 
                 className="h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                 animate={{ x: ['-100%', '100%'] }}
                 transition={{ duration: 3 / config.windSpeed, repeat: Infinity, ease: "linear" }}
               />
            </div>
          </div>

          {/* Timeline Slider */}
          <div className="mt-10 glass p-8 rounded-[32px] border border-slate-800">
            <div className="flex justify-between mb-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <Clock className="w-4 h-4" /> Timeline Control
              </h3>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsQuantumView(!isQuantumView)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${
                    isQuantumView 
                      ? 'bg-cyan-400/10 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <ActivityIcon className="w-3 h-3" />
                  Quantum View
                </button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-full bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                </button>
              </div>
            </div>
            
            <div className="relative h-12 flex items-center px-4">
              <div className="absolute left-4 right-4 h-1 bg-slate-800 rounded-full" />
              <div className="flex justify-between w-full relative z-10">
                {(['morning', 'afternoon', 'evening', 'night'] as TimeOfDay[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={`group flex flex-col items-center gap-2 transition-all ${time === t ? 'scale-110' : 'opacity-40 hover:opacity-100'}`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 transition-all ${time === t ? 'bg-cyan-400 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'bg-slate-900 border-slate-700'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${time === t ? 'text-cyan-400' : 'text-slate-500'}`}>{t}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Panel */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            key={time}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-[40px] border border-slate-800 space-y-8 h-full"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-white tracking-tighter">Atmospheric Narrative</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {config.desc}
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Active Emission Sources</h4>
              <div className="space-y-3">
                {config.pollutionSources.map((source) => (
                  <div key={source} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-3">
                      {source === 'traffic' && <Car className="w-5 h-5 text-blue-400" />}
                      {source === 'industrial' && <Factory className="w-5 h-5 text-orange-400" />}
                      {source === 'residual' && <Wind className="w-5 h-5 text-purple-400" />}
                      <span className="text-sm font-bold text-slate-300 capitalize">{source}</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-cyan-400/5 border border-cyan-400/20 rounded-3xl space-y-3">
               <div className="flex items-center gap-2 text-cyan-400">
                 <Info className="w-4 h-4" />
                 <span className="text-xs font-black uppercase tracking-widest">Simulation Note</span>
               </div>
               <p className="text-[11px] text-slate-500 leading-relaxed">
                 Particles represent PM2.5 and PM10 concentrations. Wind vectors are calculated based on historical atmospheric data for urban canyons.
               </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AirStoryMode;

