
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wind, 
  Car, 
  Factory, 
  User, 
  Play, 
  RotateCcw, 
  Info,
  ChevronRight,
  MapPin,
  Activity,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TrendingUp,
  ArrowRight,
  Search,
  Leaf,
  AlertTriangle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { CITIES, CityData } from '../constants';
import QuantumDispersionEngine from './QuantumDispersionEngine';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface Stage {
  id: string;
  label: string;
  icon: React.ElementType;
  desc: string;
  contribution: number;
  color: string;
}

const PollutionJourneySimulator: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityData>(CITIES[2]); // Default to New Delhi
  const [showCityList, setShowCityList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStage, setActiveStage] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0); 
  const [particles, setParticles] = useState<Particle[]>([]);
  const requestRef = useRef<number>(null);
  const particleIdRef = useRef(0);

  const isGreenCity = useMemo(() => selectedCity.pollution < 40, [selectedCity]);

  const stages = useMemo((): Stage[] => {
    // Green cities have lower source contribution and higher dispersion/exposure mitigation
    if (isGreenCity) {
      return [
        { id: 'source', label: 'Emission Source', icon: Factory, desc: 'Minimal industrial activity and EV-dominant transport.', contribution: 15, color: '#10b981' },
        { id: 'transport', label: 'Atmospheric Transport', icon: Wind, desc: 'Clean air currents with low particulate load.', contribution: 10, color: '#34d399' },
        { id: 'dispersion', label: 'Urban Dispersion', icon: Activity, desc: 'High green cover facilitates rapid pollutant filtering.', contribution: 5, color: '#6ee7b7' },
        { id: 'exposure', label: 'Human Exposure', icon: User, desc: 'Safe breathing zones with negligible health risk.', contribution: 5, color: '#a7f3d0' }
      ];
    }
    // Critical cities have high source and transport contributions
    return [
      { id: 'source', label: 'Emission Source', icon: Factory, desc: 'Heavy industrial stacks and dense combustion traffic.', contribution: 35, color: '#a855f7' },
      { id: 'transport', label: 'Atmospheric Transport', icon: Wind, desc: 'Stagnant air trapping high-density smog layers.', contribution: 30, color: '#22d3ee' },
      { id: 'dispersion', label: 'Urban Dispersion', icon: Activity, desc: 'Complex urban heat islands preventing vertical mixing.', contribution: 20, color: '#fb923c' },
      { id: 'exposure', label: 'Human Exposure', icon: User, desc: 'Critical exposure levels in high-density urban zones.', contribution: 15, color: '#f43f5e' }
    ];
  }, [isGreenCity]);

  const chartData = useMemo(() => stages.map(s => ({
    name: s.label,
    value: s.contribution,
    fill: s.color
  })), [stages]);

  const accumulationData = useMemo(() => {
    let total = 0;
    return stages.map(s => {
      total += s.contribution;
      return {
        name: s.label,
        current: total,
        added: s.contribution,
        fill: s.color
      };
    });
  }, [stages]);

  const filteredCities = CITIES.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const spawnParticle = (stageIndex: number) => {
    particleIdRef.current++;
    const startX = stageIndex * 25;
    // Green cities spawn fewer, smaller, and lighter particles
    const sizeMult = isGreenCity ? 0.5 : 1;
    const countMult = isGreenCity ? 0.3 : 1;

    if (Math.random() > countMult) return null;

    return {
      id: particleIdRef.current,
      x: startX + Math.random() * 5,
      y: 40 + Math.random() * 20,
      vx: (isGreenCity ? 0.8 : 0.5) + Math.random() * 0.5, // Faster clearing in green cities
      vy: (Math.random() - 0.5) * 0.2,
      life: 0,
      maxLife: (isGreenCity ? 60 : 120) + Math.random() * 50, // Shorter life in green cities (clears faster)
      size: (Math.random() * 3 + 1) * sizeMult,
      color: stages[stageIndex].color
    };
  };

  const updateParticles = () => {
    if (!isSimulating) return;

    setProgress(prev => {
      const next = prev + (isGreenCity ? 0.4 : 0.2); // Simulation runs faster for green cities (less to track)
      if (next >= 100) {
        setIsSimulating(false);
        return 100;
      }
      return next;
    });

    setParticles(prev => {
      const currentStage = Math.min(Math.floor(progress / 25), 3);
      setActiveStage(currentStage);

      const next = prev
        .map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life + 1
        }))
        .filter(p => p.life < p.maxLife && p.x < 100);

      // Spawn new particles
      if (next.length < (isGreenCity ? 15 : 50)) {
        const newP = spawnParticle(currentStage);
        if (newP) next.push(newP);
      }
      
      return next;
    });

    requestRef.current = requestAnimationFrame(updateParticles);
  };

  useEffect(() => {
    if (isSimulating) {
      requestRef.current = requestAnimationFrame(updateParticles);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isSimulating, progress]);

  const startSimulation = () => {
    setParticles([]);
    setProgress(0);
    setIsSimulating(true);
    setActiveStage(0);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setParticles([]);
    setProgress(0);
    setActiveStage(0);
  };

  return (
    <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter mb-2">Pollution Journey Simulator</h2>
          <p className="text-slate-500 text-lg font-medium">Tracking the invisible path of urban contaminants.</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* City Selector */}
          <div className="relative">
            <button 
              onClick={() => setShowCityList(!showCityList)}
              className="flex items-center gap-3 px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-cyan-400 transition-all group"
            >
              <MapPin className="w-5 h-5 text-cyan-400" />
              <div className="text-left">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Selected City</div>
                <div className="text-white font-bold">{selectedCity.name}</div>
              </div>
              <ChevronRight className={`w-5 h-5 text-slate-500 transition-transform ${showCityList ? 'rotate-90' : ''}`} />
            </button>

            <AnimatePresence>
              {showCityList && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-72 max-h-96 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
                >
                  <div className="p-4 border-b border-slate-800">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="text" 
                        placeholder="Search cities..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2">
                    {filteredCities.map(city => (
                      <button
                        key={city.id}
                        onClick={() => {
                          setSelectedCity(city);
                          setShowCityList(false);
                          setSearchQuery("");
                          resetSimulation();
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors flex items-center justify-between ${
                          selectedCity.id === city.id 
                            ? 'bg-cyan-400/10 text-cyan-400 font-bold' 
                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {city.name}
                        {city.pollution < 40 ? (
                          <Leaf className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-rose-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={resetSimulation}
            className="p-4 rounded-2xl border border-slate-800 hover:bg-slate-800 transition-colors text-slate-400"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          <button 
            onClick={startSimulation}
            disabled={isSimulating}
            className={`px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 ${
              isGreenCity ? 'bg-emerald-400 text-slate-950' : 'bg-cyan-400 text-slate-950'
            }`}
          >
            <Play className="w-5 h-5 fill-current" />
            {progress === 100 ? 'Re-run Simulation' : 'Start Simulation'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Simulation Canvas */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass h-[500px] rounded-[40px] border border-slate-800 overflow-hidden relative bg-slate-950/50">
            {/* 3D Environment Mockup */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-slate-900/50 border-t border-slate-800" />
              
              <div className="absolute bottom-32 left-0 right-0 h-48 flex items-end justify-around opacity-20">
                <div className={`w-20 h-40 rounded-t-lg transition-colors ${isGreenCity ? 'bg-emerald-900/40' : 'bg-slate-800'}`} />
                <div className={`w-16 h-64 rounded-t-lg transition-colors ${isGreenCity ? 'bg-emerald-900/40' : 'bg-slate-800'}`} />
                <div className={`w-24 h-32 rounded-t-lg transition-colors ${isGreenCity ? 'bg-emerald-900/40' : 'bg-slate-800'}`} />
                <div className={`w-12 h-56 rounded-t-lg transition-colors ${isGreenCity ? 'bg-emerald-900/40' : 'bg-slate-800'}`} />
                <div className={`w-32 h-48 rounded-t-lg transition-colors ${isGreenCity ? 'bg-emerald-900/40' : 'bg-slate-800'}`} />
              </div>

              {/* Source (Left) */}
              <div className="absolute bottom-32 left-10 flex flex-col items-center">
                <div className={`w-16 h-32 border relative transition-colors ${isGreenCity ? 'bg-emerald-900/20 border-emerald-800' : 'bg-slate-800 border-slate-700'}`}>
                  <div className={`absolute -top-8 left-2 w-3 h-10 transition-colors ${isGreenCity ? 'bg-emerald-800' : 'bg-slate-700'}`} />
                  <div className={`absolute -top-8 right-2 w-3 h-10 transition-colors ${isGreenCity ? 'bg-emerald-800' : 'bg-slate-700'}`} />
                  {activeStage === 0 && isSimulating && (
                    <motion.div 
                      animate={{ y: [-10, -40], opacity: [0.5, 0], scale: [1, 2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute -top-12 left-4 w-8 h-8 rounded-full blur-xl ${isGreenCity ? 'bg-emerald-500/20' : 'bg-purple-500/20'}`}
                    />
                  )}
                </div>
                <span className={`text-[10px] font-black mt-2 uppercase ${isGreenCity ? 'text-emerald-400' : 'text-purple-400'}`}>
                  {isGreenCity ? 'Sustainable Source' : 'Emission Source'}
                </span>
              </div>

              {/* Human Target (Right) */}
              <div className="absolute bottom-32 right-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 mb-1" />
                <div className="w-14 h-24 bg-slate-800 border border-slate-700 rounded-t-2xl relative">
                  {activeStage === 3 && isSimulating && (
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute -top-10 -left-5 w-24 h-24 rounded-full blur-2xl ${isGreenCity ? 'bg-emerald-500/10' : 'bg-rose-500/20'}`}
                    />
                  )}
                </div>
                <span className={`text-[10px] font-black mt-2 uppercase ${isGreenCity ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {isGreenCity ? 'Safe Zone' : 'Exposure Zone'}
                </span>
              </div>
            </div>

            {/* Particles Canvas */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              <QuantumDispersionEngine 
                wind={{ x: isGreenCity ? 0.8 : 0.3, y: 0.1 }}
                temperature={selectedCity.pollution > 150 ? 35 : 25}
                sources={[{ 
                  x: 20, 
                  y: 60, 
                  strength: selectedCity.pollution / 100 
                }]}
                showProbabilityField={isSimulating}
                showParticles={isSimulating}
                interventionActive={isGreenCity}
              />
            </div>

            {/* Progress Bar Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 z-50">
              <motion.div 
                className={`h-full shadow-[0_0_10px_rgba(34,211,238,0.5)] ${isGreenCity ? 'bg-emerald-400' : 'bg-cyan-400'}`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* HUD Overlay */}
            <div className="absolute top-8 left-8 space-y-4 z-40">
              <div className="glass px-6 py-3 rounded-2xl border border-slate-800 flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full animate-pulse ${isSimulating ? (isGreenCity ? 'bg-emerald-400' : 'bg-cyan-400') : 'bg-slate-600'}`} />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">City Profile: {selectedCity.name}</span>
                  <span className={`text-sm font-bold uppercase ${isGreenCity ? 'text-emerald-400' : 'text-rose-500'}`}>
                    {isGreenCity ? 'Sustainable / Clean' : 'Critical / High Emission'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Accumulation Journey Feature */}
          <div className="glass p-8 rounded-[40px] border border-slate-800 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white tracking-tighter">Accumulation Journey: {selectedCity.name}</h3>
              <div className={`flex items-center gap-2 text-xs font-bold ${isGreenCity ? 'text-emerald-400' : 'text-cyan-400'}`}>
                <TrendingUp className="w-4 h-4" />
                {isGreenCity ? 'Sustainability Flow' : 'Pollution Build-up'}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 relative">
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-around pointer-events-none px-12">
                <ArrowRight className="w-6 h-6 text-slate-800" />
                <ArrowRight className="w-6 h-6 text-slate-800" />
                <ArrowRight className="w-6 h-6 text-slate-800" />
              </div>

              {accumulationData.map((data, i) => (
                <div key={i} className="relative z-10 space-y-4 text-center">
                  <div className={`mx-auto w-16 h-16 rounded-2xl border flex items-center justify-center transition-all ${
                    progress >= (i + 1) * 25 ? `bg-slate-800 border-${isGreenCity ? 'emerald' : 'cyan'}-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]` : 'bg-slate-900/50 border-slate-800 opacity-50'
                  }`}>
                    {React.createElement(stages[i].icon, { className: `w-8 h-8 ${progress >= (i + 1) * 25 ? (isGreenCity ? 'text-emerald-400' : 'text-cyan-400') : 'text-slate-600'}` })}
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stages[i].label}</div>
                    <div className={`text-2xl font-black ${progress >= (i + 1) * 25 ? 'text-white' : 'text-slate-700'}`}>
                      {data.current}%
                    </div>
                    <div className="text-[10px] font-bold text-slate-600">+{data.added}% impact</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-800">
              <p className="text-sm text-slate-400 leading-relaxed">
                {isGreenCity ? (
                  <>
                    In <span className="text-emerald-400 font-bold">{selectedCity.name}</span>, the journey starts with a low <span className="text-emerald-400 font-bold">{stages[0].contribution}% emission</span>. Efficient transport and high green cover ensure that pollution only reaches a total of <span className="text-emerald-400 font-bold">{accumulationData[3].current}%</span>, maintaining a safe and breathable environment.
                  </>
                ) : (
                  <>
                    In <span className="text-rose-500 font-bold">{selectedCity.name}</span>, the journey begins with a heavy <span className="text-purple-400 font-bold">{stages[0].contribution}% initial emission</span>. Stagnant transport and poor dispersion escalate the impact to <span className="text-rose-500 font-bold">{accumulationData[3].current}% total exposure</span>, posing significant health risks.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Charts & Breakdown */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass p-8 rounded-[40px] border border-slate-800 space-y-8">
            <div className="flex items-center gap-3">
              <PieChartIcon className={`w-5 h-5 ${isGreenCity ? 'text-emerald-400' : 'text-purple-400'}`} />
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Contribution Breakdown</h3>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <BarChartIcon className={`w-5 h-5 ${isGreenCity ? 'text-emerald-400' : 'text-cyan-400'}`} />
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Impact Analysis</h3>
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass p-8 rounded-[40px] border border-slate-800 space-y-6">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Journey Stages</h3>
            <div className="space-y-4">
              {stages.map((stage, i) => (
                <div 
                  key={stage.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    activeStage === i 
                      ? `bg-slate-800 border-${isGreenCity ? 'emerald' : 'cyan'}-400/50` 
                      : progress > (i + 1) * 25 
                        ? 'bg-slate-900/50 border-slate-800 opacity-50' 
                        : 'bg-slate-900/20 border-slate-800 opacity-30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800" style={{ color: stage.color }}>
                      <stage.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{stage.label}</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollutionJourneySimulator;


