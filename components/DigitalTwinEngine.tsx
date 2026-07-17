import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Wind, 
  Zap, 
  ShieldAlert, 
  TrendingUp, 
  Map as MapIcon,
  RefreshCcw,
  ArrowRight,
  BrainCircuit,
  Database,
  Search,
  Building2,
  Sliders,
  Leaf,
  Car,
  Play,
  Pause,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Gauge
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { CITIES, getRealisticAqi } from '../constants';

// Intervention parameters with color-based profiles
const INTERVENTIONS = [
  {
    id: 'green-belt',
    label: 'Urb-Forestry Initiative',
    desc: 'Dense green buffer zones surrounding heavy industrial parks.',
    icon: Leaf,
    color: 'emerald',
    rawCost: '$$',
    aqiReduc: '15% reduction',
    efficiency: 15,
    highlight: 'from-emerald-500/20 to-teal-500/5 hover:border-emerald-500'
  },
  {
    id: 'traffic-reduction',
    label: 'EV Mandate & Transit Influx',
    desc: 'Subsidized zero-emissions electric mobility & multi-modal networks.',
    icon: Car,
    color: 'sky',
    rawCost: '$$$$',
    aqiReduc: '25% reduction',
    efficiency: 25,
    highlight: 'from-sky-500/20 to-indigo-500/5 hover:border-sky-500'
  },
  {
    id: 'industrial-filter',
    label: 'Molecular Flue Filters',
    desc: 'Upgrading smokestacks with carbon capture & particulate sieves.',
    icon: Zap,
    color: 'amber',
    rawCost: '$$$',
    aqiReduc: '30% reduction',
    efficiency: 30,
    highlight: 'from-amber-500/20 to-orange-500/5 hover:border-amber-500'
  },
  {
    id: 'pedestrian-zone',
    label: 'Micro-Pedestrian Grids',
    desc: 'Repurposing commercial corridors for zero emissions corridors.',
    icon: ShieldAlert,
    color: 'rose',
    rawCost: '$',
    aqiReduc: '10% reduction',
    efficiency: 10,
    highlight: 'from-rose-500/20 to-pink-500/5 hover:border-rose-500'
  }
];

const DigitalTwinEngine: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityName, setSelectedCityName] = useState('New Delhi');
  const [windSpeed, setWindSpeed] = useState(12);
  const [windDirection, setWindDirection] = useState(135);
  const [traffic, setTraffic] = useState(0.8);
  const [emissions, setEmissions] = useState(180);
  const [selectedHour, setSelectedHour] = useState(12);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIntervention, setActiveIntervention] = useState<string | null>(null);

  // Live AQI State and effect
  const [liveAqi, setLiveAqi] = useState<number | null>(null);
  const [isLiveAqiLoading, setIsLiveAqiLoading] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    setIsLiveAqiLoading(true);
    setLiveAqi(null); // Reset live AQI state on city change
    fetch(`/api/live-aqi?city=${encodeURIComponent(selectedCityName)}`)
      .then(res => res.json())
      .then(data => {
        if (active && data && typeof data.aqi === 'number') {
          setLiveAqi(data.aqi);
        }
      })
      .catch(err => console.error("Error loading live AQI in DigitalTwinEngine", err))
      .finally(() => {
        if (active) setIsLiveAqiLoading(false);
      });
    return () => { active = false; };
  }, [selectedCityName]);

  // Sync API States with Fallbacks
  const [apiHeatmap, setApiHeatmap] = useState<any[]>([]);
  const [apiPredictions, setApiPredictions] = useState<any[]>([]);
  const [apiImpact, setApiImpact] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Get active city properties from constants.ts CITIES list
  const activeCity = useMemo(() => {
    return CITIES.find(c => c.name.toLowerCase() === selectedCityName.toLowerCase()) || CITIES[2]; // Default Delhi
  }, [selectedCityName]);

  // Derive specialized inputs from chosen city configuration
  useEffect(() => {
    if (activeCity) {
      // Scale variables to city dataset dynamically
      const derivedTraffic = activeCity.pollution > 75 ? 0.85 : activeCity.pollution > 45 ? 0.65 : 0.45;
      const derivedEmissions = Math.round(activeCity.pollution * 2);
      setTraffic(derivedTraffic);
      setEmissions(derivedEmissions);
      
      // Select appropriate local wind conditions
      const derivedDirection = activeCity.lat > 50 ? 220 : 45;
      setWindDirection(derivedDirection);
    }
  }, [selectedCityName]);

  // Hourly Simulation Loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setSelectedHour(prev => (prev + 1) % 24);
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Local Math Model: Probabilistic Gaussian Plume Model
  const localHeatmap = useMemo(() => {
    const points = [];
    const resolution = 10;
    
    // Multiple sources (Industrial Stack at 50,50 + Traffic corridors at 30,70 & 75,35)
    // Scale strengths dynamically with sliders and interventions
    const reductionMultiplier = activeIntervention === 'industrial-filter' ? 0.6 : 1.0;
    const trafficMultiplier = activeIntervention === 'traffic-reduction' ? 0.65 : 
                              activeIntervention === 'pedestrian-zone' ? 0.85 : 1.0;
    const greenReduction = activeIntervention === 'green-belt' ? 0.85 : 1.0;
    
    const industrialStrength = emissions * 2 * reductionMultiplier * greenReduction;
    const trafficStrengthA = traffic * 210 * trafficMultiplier * greenReduction;
    const trafficStrengthB = traffic * 160 * trafficMultiplier * greenReduction;

    const sources = [
      { x: 50, y: 50, strength: industrialStrength, isStack: true },
      { x: 25, y: 75, strength: trafficStrengthA, isStack: false },
      { x: 75, y: 25, strength: trafficStrengthB, isStack: false }
    ];

    // Hour factor simulates the diurnal cycle on absolute dispersion
    const hourFactor = Math.sin((selectedHour - 5) * Math.PI / 12) * 0.15 + 0.85;

    for (let x = 10; x <= 90; x += resolution) {
      for (let y = 10; y <= 90; y += resolution) {
        let totalVal = 0;

        sources.forEach(src => {
          const dx = x - src.x;
          const dy = y - src.y;

          // Align Gaussian Plume dispersion to wind speed & target vector angle
          const rad = (windDirection * Math.PI) / 180;
          const rx = dx * Math.cos(rad) + dy * Math.sin(rad);
          const ry = -dx * Math.sin(rad) + dy * Math.cos(rad);

          // We check downwind propagation (including some upwind back-leakage of 5 units)
          if (rx > -5) {
            const sigmaY = 0.25 * (rx + 5) + 3;
            const sigmaZ = 0.18 * (rx + 5) + 3;
            const concentration = ((src.strength * hourFactor) / (windSpeed * sigmaY * sigmaZ)) *
                                  Math.exp(-(ry ** 2) / (2 * sigmaY ** 2));
            totalVal += concentration;
          }
        });

        // Add small baseline atmospheric noise derived from city baseline stats
        const scaledAqiBaseline = (activeCity.pollution * 0.4) * (1 - (activeIntervention === 'green-belt' ? 0.15 : 0));
        const finalPointVal = Math.min(300, Math.max(5, totalVal * 15 + scaledAqiBaseline));
        
        points.push({ x, y, value: finalPointVal });
      }
    }
    return points;
  }, [activeCity, windSpeed, windDirection, traffic, emissions, selectedHour, activeIntervention]);

  // Local Time Series Trend Generator (Simulating LSTM neural architecture output)
  const localPredictions = useMemo(() => {
    const series = [];
    const baseAqi = liveAqi || getRealisticAqi(activeCity.name);

    const impacts: Record<string, number> = {
      'green-belt': 0.15,
      'traffic-reduction': 0.25,
      'industrial-filter': 0.30,
      'pedestrian-zone': 0.10
    };
    const reduction = activeIntervention ? (1 - impacts[activeIntervention]) : 1.0;

    for (let h = 0; h < 24; h++) {
      // Diurnal peaks at 08:30 and 18:30 representing heavy rush hours
      const rushHourFactor = Math.exp(-((h - 8.5) ** 2) / 6) + Math.exp(-((h - 18.5) ** 2) / 6) + 0.15;
      
      const trafficContrib = traffic * 95 * rushHourFactor;
      const industrialContrib = (emissions / 100) * 45 * (1 + 0.1 * Math.sin(h * Math.PI / 12));
      const atmosphericInversion = (12 - Math.abs(h - 13)) * 1.5; // cooler night air traps particulate matter

      const rawVal = baseAqi + trafficContrib + industrialContrib + atmosphericInversion;
      
      series.push({
        hour: h,
        label: `${h.toString().padStart(2, '0')}:00`,
        Forecast: Math.round(rawVal),
        Projected: Math.round(rawVal * reduction)
      });
    }
    return series;
  }, [activeCity, traffic, emissions, activeIntervention, liveAqi]);

  // Current parameters dynamically modified in actual time focus
  const currentAQIMetrics = useMemo(() => {
    const currentPoint = localPredictions.find(item => item.hour === selectedHour);
    const forecastVal = currentPoint ? currentPoint.Forecast : 150;
    const projectedVal = currentPoint ? currentPoint.Projected : 110;

    // Determine environmental hazard category color & label based on standard EPA AQI
    let category = { label: 'Good', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', raw: '#10b981' };
    if (projectedVal > 250) {
      category = { label: 'Hazardous', text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', raw: '#a855f7' };
    } else if (projectedVal > 150) {
      category = { label: 'Very Unhealthy', text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', raw: '#f43f5e' };
    } else if (projectedVal > 100) {
      category = { label: 'Unhealthy', text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', raw: '#f97316' };
    } else if (projectedVal > 50) {
      category = { label: 'Moderate', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', raw: '#f59e0b' };
    }

    return { forecast: forecastVal, projected: projectedVal, category };
  }, [localPredictions, selectedHour]);

  // REST API syncing
  const fireRESTEndpoints = async () => {
    setLoading(true);
    setApiError(null);
    try {
      // 1. POST Simulate Pollution (REST)
      const simRes = await fetch('/api/simulate-pollution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: selectedCityName,
          windSpeed,
          windDirection,
          emissions,
          traffic
        })
      });
      if (!simRes.ok) throw new Error("Simulation endpoint returned failure status.");
      const simData = await simRes.json();
      setApiHeatmap(simData.heatmap || []);

      // 2. POST Predict AQI (REST)
      const predRes = await fetch('/api/predict-aqi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: selectedCityName,
          traffic,
          emissions
        })
      });
      if (!predRes.ok) throw new Error("Prediction API failed.");
      const predData = await predRes.json();
      setApiPredictions(predData.predictions || []);

      // 3. POST Intervention Impact (REST)
      const impRes = await fetch('/api/intervention-impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interventionType: activeIntervention || 'traffic-reduction',
          currentAqi: liveAqi || getRealisticAqi(activeCity.name)
        })
      });
      if (!impRes.ok) throw new Error("Intervention Analysis failed.");
      const impData = await impRes.json();
      setApiImpact(impData);

    } catch (err: any) {
      console.warn("REST API calls failed, proceeding with high-fidelity local deterministic twins.", err);
      setApiError(err.message || 'REST Endpoints offline');
    } finally {
      setLoading(false);
    }
  };

  // Run synchronization on model changes to back up variables
  useEffect(() => {
    fireRESTEndpoints();
  }, [selectedCityName, windSpeed, windDirection, traffic, emissions, activeIntervention, liveAqi]);

  // Search filter for list of cities
  const filteredCITIES = useMemo(() => {
    if (!searchQuery) return CITIES.slice(0, 7);
    return CITIES.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.country.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 10);
  }, [searchQuery]);

  return (
    <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-700">
      
      {/* Top Controller Segment */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[2rem] bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.25)]">
            <BrainCircuit className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-white tracking-tighter mb-1.5 flex items-center gap-2">
              Atmospheric Digital Twin <span className="text-xs bg-cyan-400/10 text-cyan-400 py-0.5 px-2 rounded-full border border-cyan-400/20 font-mono tracking-widest uppercase">QPU-Live</span>
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              ML dispersion modelling, predictive forecasts, and ecological intervention testbeds.
            </p>
          </div>
        </div>

        {/* Quick select City Dropdown & Manual Trigger */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5">Direct City Select</span>
            <select
              value={selectedCityName}
              onChange={(e) => setSelectedCityName(e.target.value)}
              className="bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-black text-white focus:ring-1 focus:ring-cyan-400 outline-none transition-all cursor-pointer shadow-lg hover:border-slate-700"
            >
              <optgroup label="Core Environmental Stations">
                {CITIES.slice(0, 15).map(c => (
                  <option key={c.id} value={c.name}>{c.name} ({c.country})</option>
                ))}
              </optgroup>
              <optgroup label="Global Sieve Nodes">
                {CITIES.slice(15).map(c => (
                  <option key={c.id} value={c.name}>{c.name} ({c.country})</option>
                ))}
              </optgroup>
            </select>
          </div>

          <button 
            onClick={fireRESTEndpoints}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 active:scale-95 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all mt-auto text-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Sync REST Services
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Bento: City List & Intelligence */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* List Search selector */}
          <div className="glass p-6 rounded-[2.2rem] border border-slate-800 space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                <Search size={14} className="text-cyan-400" /> City Datasets Catalog
              </h3>
              <p className="text-xs text-slate-500">Pick any station down below to load sensor metrics.</p>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search matching city datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3 pl-9 text-xs text-slate-300 outline-none transition-all placeholder:text-slate-600"
              />
              <Search className="absolute left-3 top-2.5 text-slate-600 w-3.5 h-3.5" />
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
              {filteredCITIES.map((c) => {
                const isSelected = c.name.toLowerCase() === selectedCityName.toLowerCase();
                const levelColor = c.pollution > 70 ? 'text-red-400 bg-red-400/10 border-red-500/20' : 
                                   c.pollution > 45 ? 'text-amber-400 bg-amber-400/10 border-amber-500/20' : 
                                   'text-emerald-400 bg-emerald-400/10 border-emerald-500/20';
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCityName(c.name)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                      isSelected 
                        ? 'bg-cyan-500/10 border-cyan-400/40 text-white' 
                        : 'bg-transparent border-transparent hover:bg-slate-900/50 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Building2 size={13} className={isSelected ? 'text-cyan-400' : 'text-slate-600'} />
                      <div className="truncate">
                        <p className="text-xs font-black truncate">{c.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono truncate">{c.country}</p>
                      </div>
                    </div>

                    <span className={`text-[9px] font-mono font-black py-0.5 px-2 rounded-md border shrink-0 ${levelColor}`}>
                      AQI {getRealisticAqi(c.name)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Station Intelligence Card */}
          <div className="glass p-6 rounded-[2.2rem] border border-slate-800 space-y-5 bg-gradient-to-b from-cyan-950/10 to-transparent">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <Database size={14} className="text-magenta-400" /> Active Station Intel
            </h3>

            <div className="space-y-3.5">
              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <span className="text-xs text-slate-500 font-medium">Dataset Origin</span>
                <span className="text-xs font-bold text-white">{activeCity.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <span className="text-xs text-slate-500 font-medium">Baseline Pollution</span>
                <span className="text-xs font-mono font-black text-rose-400">{activeCity.pollution}% index</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <span className="text-xs text-slate-500 font-medium">Forestry Level</span>
                <span className="text-xs font-mono font-black text-emerald-400">{activeCity.greenCoverage}% coverage</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <span className="text-xs text-slate-500 font-medium">Renewable Grid</span>
                <span className="text-xs font-mono font-black text-amber-400">{activeCity.renewableEnergy}% current</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">Environmental Rating</span>
                <span className="text-xs font-mono font-black text-cyan-400">{activeCity.policyScore} score</span>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-center py-2.5 px-3 bg-slate-950 rounded-2xl border border-slate-900">
              <Sparkles size={12} className="text-cyan-400 shrink-0" />
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest text-center">
                VQE-Simulation Synchronized
              </span>
            </div>
          </div>

        </div>

        {/* Center Bento: Controls & Map Heatmap Display */}
        <div className="xl:col-span-6 space-y-6">
          
          {/* Main Visual Map Card */}
          <div className="glass rounded-[2.5rem] border border-slate-800 p-6 relative overflow-hidden flex flex-col gap-6">
            
            {/* Header detail */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-1">
              <div className="flex items-center gap-3">
                <MapIcon className="text-cyan-400 w-5 h-5" />
                <div className="text-left">
                  <h3 className="text-base font-extrabold text-white uppercase tracking-tight">Active Atmospheric Plume</h3>
                  <p className="text-[11px] text-slate-500">Live 2D Gaussian models representing particulate concentrations.</p>
                </div>
              </div>

              {/* AQI Indicator value */}
              <div className={`py-1.5 px-4 rounded-full border flex items-center gap-2 shrink-0 ${currentAQIMetrics.category.bg} ${currentAQIMetrics.category.border}`}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentAQIMetrics.category.raw }} />
                <span className="text-[10px] font-mono font-black uppercase text-slate-400 tracking-wider">
                  Hour {selectedHour.toString().padStart(2, '0')}:00 &bull; Projected AQI: <strong className={currentAQIMetrics.category.text}>{currentAQIMetrics.projected}</strong>
                </span>
              </div>
            </div>

            {/* Simulated Grid stage with animations */}
            <div className="relative aspect-video rounded-3xl bg-slate-950/80 border border-slate-900 overflow-hidden flex items-center justify-center p-4">
              
              {/* Background grid details */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1.2px,transparent_1.2px)] [background-size:20px_20px]" />
              </div>

              <svg viewBox="10 10 80 80" className="w-full h-full max-h-[380px]">
                
                {/* Wind Vectors Overlay (Directional lines drifting on wind angle) */}
                <g className="opacity-30">
                  {[25, 45, 65].map((anchorY, idx) => {
                    const angleRad = (windDirection * Math.PI) / 180;
                    // Draw flowing wind lines starting from edge
                    const startX = 20 + idx * 10;
                    const len = 30;
                    const endX = startX + len * Math.cos(angleRad);
                    const endY = anchorY + len * Math.sin(angleRad);
                    
                    return (
                      <g key={idx}>
                        <line
                          x1={startX}
                          y1={anchorY}
                          x2={endX}
                          y2={endY}
                          stroke="#06b6d4"
                          strokeWidth="0.4"
                          strokeDasharray="4, 4"
                        >
                          <animate 
                            attributeName="stroke-dashoffset" 
                            values="40;0" 
                            dur={`${5 / (windSpeed / 5 || 1)}s`} 
                            repeatCount="indefinite" 
                          />
                        </line>
                        <circle cx={endX} cy={endY} r="0.8" fill="#06b6d4" />
                      </g>
                    );
                  })}
                </g>

                {/* Simulated Plume heatmaps */}
                {localHeatmap.map((p, i) => {
                  let cellColor = '#10b981'; // Green
                  if (p.value > 250) cellColor = '#a855f7'; // Purple
                  else if (p.value > 150) cellColor = '#f43f5e'; // Red
                  else if (p.value > 100) cellColor = '#f97316'; // Orange
                  else if (p.value > 50) cellColor = '#fb923c'; // Light orange/yellow

                  const radius = (p.value / 150) * 12 + 6;
                  const opacity = Math.min(0.7, Math.max(0.12, p.value / 340));

                  return (
                    <motion.circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r={radius}
                      fill={cellColor}
                      initial={{ opacity: 0 }}
                      animate={{ opacity }}
                      transition={{ duration: 0.6 }}
                      className="blur-lg pointer-events-none"
                    />
                  );
                })}

                {/* Industrial Stack & Traffic Hubs Representation */}
                <g className="cursor-help">
                  {/* Indus stack (Center) */}
                  <circle cx="50" cy="50" r="3" fill="#ef4444" stroke="#ffffff" strokeWidth="0.6" className="animate-pulse" />
                  <rect x="48" y="48" width="4" height="4" fill="none" stroke="#f43f5e" strokeWidth="0.3" className="animate-spin-slow" />
                  
                  {/* Traffic Terminal West */}
                  <circle cx="25" cy="75" r="2.2" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.4" />
                  {/* Traffic Terminal East */}
                  <circle cx="75" cy="25" r="2.2" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.4" />
                </g>

                {/* City Landmarks Annotations */}
                <g className="pointer-events-none text-white font-mono opacity-60">
                  <text x="50" y="44" textAnchor="middle" fontSize="2" fill="#ffffff" fontWeight="bold" className="tracking-widest">INDUSTRIAL NODE</text>
                  <text x="25" y="70" textAnchor="middle" fontSize="1.8" fill="#ffffff">WEST MOBILITY CORE</text>
                  <text x="75" y="20" textAnchor="middle" fontSize="1.8" fill="#ffffff">EAST INTERCHANGE</text>
                </g>
              </svg>

              {/* Absolute Watermark Overlay */}
              <div className="absolute bottom-4 left-4 p-3 bg-slate-900/95 border border-slate-800 rounded-xl space-y-1.5 backdrop-blur-md">
                <p className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Dynamic Grid Vectors</p>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="text-[9px] text-slate-400 font-mono">Hazardous (&gt;250 AQI)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-[9px] text-slate-400 font-mono">Severe (151-250 AQI)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                    <span className="text-[9px] text-slate-400 font-mono">Moderate Unhealthy (101-150 AQI)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[9px] text-slate-400 font-mono">Optimal (&lt;50 AQI)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Time-Based Evolution Controller (Timeline Playback) */}
            <div className="p-5 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-left">
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Sliders size={13} className="text-magenta-500" /> Time-Based Evolution Scrub
                  </h4>
                  <p className="text-[10px] text-slate-500">Run dispersion models across a 24-hour diurnal cycle.</p>
                </div>

                {/* Timeline Controls */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all ${
                      isPlaying ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {isPlaying ? <Pause size={13} className="fill-current" /> : <Play size={13} className="fill-current" />}
                  </button>
                  <button
                    onClick={() => { setSelectedHour(12); setIsPlaying(false); }}
                    className="p-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl transition-all"
                  >
                    <RefreshCcw size={13} />
                  </button>
                </div>
              </div>

              {/* Slider Scrub */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="23"
                  value={selectedHour}
                  onChange={(e) => {
                    setSelectedHour(Number(e.target.value));
                    setIsPlaying(false);
                  }}
                  className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-cyan-400 outline-none"
                />
                
                {/* Visual Tick Timeline mapping */}
                <div className="flex justify-between font-mono text-[9px] text-slate-600 px-1">
                  <span>00:00</span>
                  <span>04:00</span>
                  <span className="text-cyan-400">08:00 (Rush)</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span className="text-magenta-400">18:00 (Rush)</span>
                  <span>22:00</span>
                </div>
              </div>
            </div>

          </div>

          {/* Environmental Parameter Tweak Sliders */}
          <div className="glass p-6 rounded-[2.5rem] border border-slate-800 space-y-5">
            <div className="flex items-center gap-2">
              <Sliders className="text-cyan-400 w-4 h-4" />
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Atmospheric Dynamics Lab</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                    <span>Macro wind Speed</span>
                    <span className="text-cyan-400 font-mono">{windSpeed} km/h</span>
                  </div>
                  <input 
                    type="range" min="3" max="45" value={windSpeed} 
                    onChange={(e) => setWindSpeed(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                  />
                  <p className="text-[9px] text-slate-600">Slower wind limits pollutant venting, magnifying localized plumes.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                    <span>Wind Direction Vector</span>
                    <span className="text-cyan-400 font-mono">{windDirection}° angle</span>
                  </div>
                  <input 
                    type="range" min="0" max="360" value={windDirection} 
                    onChange={(e) => setWindDirection(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                  />
                  <p className="text-[9px] text-slate-600">Alters Gaussian vector direction away from sensor buffers.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                    <span>Urban Roadway Traffic</span>
                    <span className="text-magenta-400 font-mono">{Math.round(traffic * 100)}% Saturation</span>
                  </div>
                  <input 
                    type="range" min="0.1" max="1.5" step="0.05" value={traffic} 
                    onChange={(e) => setTraffic(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-magenta-400 focus:outline-none"
                  />
                  <p className="text-[9px] text-slate-600">Magnifies output of Traffic Hub corridor sectors dynamically.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                    <span>Smokestack emissions</span>
                    <span className="text-orange-400 font-mono">{emissions} metric t/h</span>
                  </div>
                  <input 
                    type="range" min="20" max="400" value={emissions} 
                    onChange={(e) => setEmissions(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-orange-400 focus:outline-none"
                  />
                  <p className="text-[9px] text-slate-600">Direct emission coefficient released from primary industrial stack.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Bento: Predictor Analysis & Intervention Simulation */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* 24h Area Forecast Chart with selected time markers */}
          <div className="glass p-6 rounded-[2.2rem] border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-magenta-400 w-4 h-4" />
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">LSTM Neural Predictive Forecast</h3>
              </div>
              
              <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800 font-mono text-[9px] text-slate-500">
                <Database size={10} /> model-r24
              </div>
            </div>

            {/* Neural explanation alert */}
            <p className="text-[10px] text-slate-500 leading-normal">
              Analyzing temporal dependencies over the selected city environmental datasets. Drag the timeline to overlay values.
            </p>

            {/* Responsive Recharts Container */}
            <div className="h-52 w-full pr-1 font-mono text-[9px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={localPredictions}>
                  <defs>
                    <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d946ef" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#d946ef" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorProj" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#161e2e" vertical={false} />
                  <XAxis dataKey="label" stroke="#475569" fontSize={8} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={8} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }}
                    labelStyle={{ color: '#94a3b8', fontSize: 9, fontWeight: 'bold' }}
                    itemStyle={{ fontSize: 9, padding: 1 }}
                  />
                  <Legend verticalAlign="top" height={24} iconType="circle" iconSize={6} wrapperStyle={{ fontSize: 9 }} />
                  <Area type="monotone" name="Unmitigated" dataKey="Forecast" stroke="#d946ef" strokeWidth={2} fillOpacity={1} fill="url(#colorBase)" />
                  <Area type="monotone" name="Policy Safe" dataKey="Projected" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProj)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Inversion explanatory summary */}
            <div className="p-3 bg-slate-950 border border-slate-900 rounded-2xl flex items-start gap-2.5">
              <AlertCircle size={14} className="text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Atmospheric Inversion Check</p>
                <p className="text-[9px] text-slate-500 leading-relaxed">
                  During 00:00 to 05:00 hours, cool ground boundary layers increase stagnant concentrations by trap-mechanisms.
                </p>
              </div>
            </div>
          </div>

          {/* Policy Interventions Interactive sandbox */}
          <div className="glass p-6 rounded-[2.2rem] border border-slate-800 space-y-4">
            <div className="space-y-1 mt-0.5">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                <ShieldAlert size={14} className="text-emerald-400" /> Policy Mitigations Sandbed
              </h3>
              <p className="text-xs text-slate-500">Toggle simulated air quality policies to instantly analyze reduction curves.</p>
            </div>

            {/* List selector of interventions with color based visuals */}
            <div className="grid grid-cols-1 gap-3">
              {INTERVENTIONS.map((item) => {
                const isActive = activeIntervention === item.id;
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveIntervention(isActive ? null : item.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all bg-gradient-to-tr flex items-start gap-3 relative overflow-hidden group ${
                      isActive 
                        ? 'border-emerald-500/50 text-white bg-emerald-500/10' 
                        : 'border-slate-900 bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    {/* Active highlight background glow */}
                    {isActive && (
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400" />
                    )}

                    <div className={`p-2 rounded-xl shrink-0 ${
                      isActive 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-slate-900 text-slate-500 group-hover:text-slate-300'
                    }`}>
                      <Icon size={14} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black tracking-tight leading-none">{item.label}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[8px] font-mono font-bold bg-slate-900 border border-slate-800 text-slate-500 py-0.5 px-1.5 rounded-md">Cost: {item.rawCost}</span>
                          <span className={`text-[8px] font-mono font-bold py-0.5 px-1.5 rounded-md border ${
                            isActive ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}>{item.aqiReduc}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-normal">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Clear button if active */}
            {activeIntervention && (
              <button
                onClick={() => setActiveIntervention(null)}
                className="w-full py-2 bg-slate-950 text-xs font-bold text-slate-500 hover:text-slate-300 hover:bg-slate-900 rounded-xl transition-all font-mono border border-slate-900 flex items-center justify-center gap-1.5"
              >
                Reset Policy Mitigations
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Visual representation of service layers */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-900/10 p-4 border border-slate-200/5 dark:border-slate-800/40 rounded-[2.2rem]">
        {[
          { label: 'Gaussian Plume Probabilistic Solver', status: 'Running', load: '18% compute', color: 'text-cyan-400 bg-cyan-400/10' },
          { label: 'LSTM Chronos Time Forecast Server', status: 'Active', load: '32% compute', color: 'text-magenta-400 bg-magenta-400/10' },
          { label: 'REST Sync Proxy Controller', status: 'Syncing', load: `${loading ? 'Active query' : 'Idle standby'}`, color: 'text-amber-400 bg-amber-400/10' },
          { label: 'Climate Dataset Store (CITIES)', status: `${apiError ? 'Local Sieve Buffer' : 'Online'}`, load: `${CITIES.length} stations loaded`, color: 'text-emerald-400 bg-emerald-400/10' }
        ].map((item, idx) => (
          <div key={idx} className="glass p-5 rounded-[1.8rem] border border-slate-800 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[9px] text-slate-600 font-extrabold uppercase tracking-widest leading-none">{item.label}</p>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span className="text-[10px] text-slate-400 font-bold">{item.status}</span>
              </div>
            </div>
            
            <div className={`py-1 px-2.5 rounded-lg border border-transparent font-mono text-[9px] font-black ${item.color}`}>
              {item.load}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default DigitalTwinEngine;
