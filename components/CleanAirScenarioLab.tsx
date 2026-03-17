
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wind, 
  Car, 
  Factory, 
  TreeDeciduous, 
  Zap, 
  Activity,
  ArrowDown,
  ArrowUp,
  Info,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { CITIES, CityData } from '../constants';
import { WorkflowState } from '../types';

interface CleanAirScenarioLabProps {
  setWorkflow?: (state: WorkflowState) => void;
}

const CleanAirScenarioLab: React.FC<CleanAirScenarioLabProps> = ({ setWorkflow }) => {
  const [selectedCity, setSelectedCity] = useState<CityData>(CITIES[2]); // Default to New Delhi
  const [traffic, setTraffic] = useState(50);
  const [greenInfra, setGreenInfra] = useState(20);
  const [electric, setElectric] = useState(10);
  const [industrial, setIndustrial] = useState(60);
  const [showCitySelector, setShowCitySelector] = useState(false);

  // Update sliders when city changes
  useEffect(() => {
    // Map city metrics to slider values (approximate)
    setTraffic(Math.round(selectedCity.pollution * 0.8));
    setGreenInfra(selectedCity.greenCoverage);
    setElectric(selectedCity.renewableEnergy);
    setIndustrial(Math.round(selectedCity.pollution * 0.7));
  }, [selectedCity]);

  // Derived metrics
  const aqi = useMemo(() => {
    const base = 50 + selectedCity.pollution;
    const reduction = (100 - traffic) * 0.5 + greenInfra * 0.8 + electric * 0.4 + (100 - industrial) * 0.6;
    return Math.max(15, Math.round(base + (selectedCity.pollution > 50 ? 100 : 20) - reduction));
  }, [traffic, greenInfra, electric, industrial, selectedCity]);

  const co2 = useMemo(() => {
    const base = 380 + (selectedCity.pollution / 2);
    const reduction = (100 - traffic) * 0.2 + electric * 0.3 + (100 - industrial) * 0.4;
    return Math.max(380, Math.round(base + 40 - reduction));
  }, [traffic, electric, industrial, selectedCity]);

  const pm25 = useMemo(() => {
    const base = 20 + (selectedCity.pollution / 1.5);
    const reduction = (100 - traffic) * 0.3 + greenInfra * 0.4 + (100 - industrial) * 0.5;
    return Math.max(5, Math.round(base + 30 - reduction));
  }, [traffic, greenInfra, industrial, selectedCity]);

  // Chart data
  const chartData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => ({
      name: `Day ${i + 1}`,
      aqi: Math.max(10, aqi + Math.sin(i) * 10),
      pm25: Math.max(5, pm25 + Math.cos(i) * 5),
    }));
  }, [aqi, pm25]);

  // Particle count based on AQI
  const particleCount = Math.floor(aqi / 2);

  return (
    <div className="flex h-full gap-6 p-6 overflow-hidden">
      {/* Controls Panel */}
      <div className="w-72 flex flex-col gap-6">
        <div className="glass p-6 rounded-[40px] border border-white/5 flex flex-col gap-6">
          {/* City Selector */}
          <div className="relative">
            <button 
              onClick={() => setShowCitySelector(!showCitySelector)}
              className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-cyan-400 transition-all group"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <div className="text-left">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active City</p>
                  <p className="text-sm font-bold text-white">{selectedCity.name}</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showCitySelector ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showCitySelector && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto p-2"
                >
                  {CITIES.map(city => (
                    <button
                      key={city.id}
                      onClick={() => {
                        setSelectedCity(city);
                        setShowCitySelector(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs transition-colors ${
                        selectedCity.id === city.id 
                          ? 'bg-cyan-500/20 text-cyan-400 font-bold' 
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {city.name}, {city.country}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-xl text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-widest text-white">Scenario Lab</h3>
              <p className="text-[10px] font-mono text-slate-500 uppercase">Intervention Controls</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <ControlSlider 
              label="Traffic Emissions" 
              icon={<Car className="w-4 h-4" />} 
              value={traffic} 
              setValue={setTraffic} 
              color="rose"
            />
            <ControlSlider 
              label="Green Infrastructure" 
              icon={<TreeDeciduous className="w-4 h-4" />} 
              value={greenInfra} 
              setValue={setGreenInfra} 
              color="emerald"
            />
            <ControlSlider 
              label="Electric Transport" 
              icon={<Zap className="w-4 h-4" />} 
              value={electric} 
              setValue={setElectric} 
              color="cyan"
            />
            <ControlSlider 
              label="Industrial Output" 
              icon={<Factory className="w-4 h-4" />} 
              value={industrial} 
              setValue={setIndustrial} 
              color="amber"
            />
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-400">
              <Info className="w-3 h-3" />
              <span className="text-[9px] font-mono uppercase tracking-widest">Simulation Logic</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Adjust sliders to simulate urban interventions. The engine calculates real-time atmospheric response based on local dispersion models.
            </p>
          </div>

          {setWorkflow && (
            <button 
              onClick={() => setWorkflow(WorkflowState.QUANTUM_OPTIMIZATION)}
              className="w-full py-4 bg-gradient-to-r from-cyan-500/20 to-lime-500/20 border border-cyan-500/30 rounded-2xl flex items-center justify-center gap-3 group hover:from-cyan-500/30 hover:to-lime-500/30 transition-all shadow-[0_0_20px_rgba(34,211,238,0.1)]"
            >
              <Zap className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Quantum Engine</p>
                <p className="text-[8px] font-mono text-slate-500 uppercase">Optimize Strategy</p>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Visualization Panel */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        <div className="grid grid-cols-3 gap-4">
          <MetricCard 
            label="AQI Level" 
            value={aqi} 
            unit="Index" 
            status={aqi < 50 ? 'Good' : aqi < 100 ? 'Moderate' : 'Unhealthy'}
            color={aqi < 50 ? 'emerald' : aqi < 100 ? 'amber' : 'rose'}
          />
          <MetricCard 
            label="CO2 Concentration" 
            value={co2} 
            unit="ppm" 
            status={co2 < 400 ? 'Target' : 'Elevated'}
            color={co2 < 400 ? 'cyan' : 'blue'}
          />
          <MetricCard 
            label="PM2.5 Density" 
            value={pm25} 
            unit="µg/m³" 
            status={pm25 < 15 ? 'Clean' : 'Hazy'}
            color={pm25 < 15 ? 'lime' : 'orange'}
          />
        </div>

        <div className="flex-1 glass rounded-[40px] border border-white/5 relative overflow-hidden flex flex-col">
          {/* Atmospheric Particle Environment */}
          <div className="absolute inset-0 pointer-events-none">
             <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-transparent opacity-40"></div>
             {/* Particles */}
             {Array.from({ length: particleCount }).map((_, i) => (
               <motion.div
                 key={i}
                 initial={{ 
                   x: Math.random() * 100 + '%', 
                   y: Math.random() * 100 + '%',
                   opacity: Math.random() * 0.5 + 0.2
                 }}
                 animate={{ 
                   x: [null, (Math.random() * 100) + '%'],
                   y: [null, (Math.random() * 100) + '%'],
                 }}
                 transition={{ 
                   duration: Math.random() * 10 + 10, 
                   repeat: Infinity, 
                   ease: "linear" 
                 }}
                 className={`absolute w-1 h-1 rounded-full blur-[1px] ${
                   aqi < 50 ? 'bg-emerald-400' : aqi < 100 ? 'bg-amber-400' : 'bg-rose-400'
                 }`}
               />
             ))}
          </div>

          <div className="p-8 flex justify-between items-end relative z-10">
            <div>
              <h3 className="text-2xl font-black tracking-tighter text-white">Atmospheric Projection</h3>
              <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">7-Day Forecast Model</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">AQI Index</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-lime-400"></div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">PM2.5</span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a3e635" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a3e635" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="aqi" 
                  stroke="#22d3ee" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAqi)" 
                  animationDuration={2000}
                />
                <Area 
                  type="monotone" 
                  dataKey="pm25" 
                  stroke="#a3e635" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorPm)" 
                  animationDuration={2500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ControlSliderProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  setValue: (v: number) => void;
  color: 'rose' | 'emerald' | 'cyan' | 'amber';
}

const ControlSlider: React.FC<ControlSliderProps> = ({ label, icon, value, setValue, color }) => {
  const colorMap = {
    rose: 'text-rose-400 bg-rose-400',
    emerald: 'text-emerald-400 bg-emerald-400',
    cyan: 'text-cyan-400 bg-cyan-400',
    amber: 'text-amber-400 bg-amber-400'
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-slate-300">
          <span className={colorMap[color].split(' ')[0]}>{icon}</span>
          <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">{value}%</span>
      </div>
      <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden group">
        <motion.div 
          initial={false}
          animate={{ width: `${value}%` }}
          className={`absolute inset-y-0 left-0 rounded-full ${colorMap[color].split(' ')[1]}`}
        />
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={value} 
          onChange={(e) => setValue(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
      </div>
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  status: string;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, status, color }) => {
  const colorClasses: Record<string, string> = {
    emerald: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
    amber: 'text-amber-400 border-amber-400/20 bg-amber-400/5',
    rose: 'text-rose-400 border-rose-400/20 bg-rose-400/5',
    cyan: 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5',
    blue: 'text-blue-400 border-blue-400/20 bg-blue-400/5',
    lime: 'text-lime-400 border-lime-400/20 bg-lime-400/5',
    orange: 'text-orange-400 border-orange-400/20 bg-orange-400/5',
  };

  return (
    <div className={`glass p-6 rounded-full border flex flex-col justify-center gap-1 relative overflow-visible group min-h-[120px] ${colorClasses[color]}`}>
      <div className="flex justify-between items-center gap-3 px-2">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-70 leading-none truncate">{label}</span>
        <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[8px] font-black uppercase tracking-widest shrink-0 shadow-lg">
          {status}
        </div>
      </div>
      <div className="flex items-baseline justify-center gap-2 mt-1">
        <span className="text-4xl font-black tracking-tighter text-white drop-shadow-2xl">{value}</span>
        <span className="text-xs font-mono opacity-50 uppercase tracking-wider">{unit}</span>
      </div>
      {/* Background Glow */}
      <div className={`absolute inset-0 rounded-full blur-3xl opacity-5 pointer-events-none ${colorClasses[color].split(' ')[2]}`}></div>
    </div>
  );
};

export default CleanAirScenarioLab;
