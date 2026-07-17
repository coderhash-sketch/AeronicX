import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Map as MapIcon, 
  Trees, 
  Wind, 
  Navigation, 
  CarFront, 
  CheckCircle2,
  Zap,
  Maximize2,
  BrainCircuit,
  ArrowUpRight,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Activity,
  ShieldCheck,
  Cpu,
  Database,
  Sliders,
  TrendingDown,
  Info
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

import { 
  CITIES_DATA_STORE, 
  CITIES_METADATA, 
  generateCityPreset, 
  Zone, 
  CityPreset 
} from './citiesData';

const GreenCityAdvisor: React.FC = () => {
  const [activeCityName, setActiveCityName] = useState<string>('Delhi');
  const [zones, setZones] = useState<Zone[]>(CITIES_DATA_STORE['Delhi'].zones);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>('delhi-1');
  
  // Grid search & filtering states for all 160 cities
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [geoFilter, setGeoFilter] = useState<'All' | 'India' | 'Global'>('All');
  const [aqiFilter, setAqiFilter] = useState<'All' | 'Critical' | 'Moderate' | 'Optimal'>('All');
  const [visibleCount, setVisibleCount] = useState<number>(16);

  // AI recommendations state
  const [aiReport, setAiReport] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [apiNotice, setApiNotice] = useState<string>('');

  // Smart Zoning states
  const [smartZoningMode, setSmartZoningMode] = useState<'off' | 'forest' | 'bikepath'>('off');

  const currentCity = useMemo(() => {
    return CITIES_DATA_STORE[activeCityName] || generateCityPreset(CITIES_METADATA[0]);
  }, [activeCityName]);

  // Sync zones when city preset changes
  useEffect(() => {
    const freshCity = CITIES_DATA_STORE[activeCityName] || generateCityPreset(CITIES_METADATA[0]);
    // Deep copy zones to prevent mutations on the static template
    setZones(freshCity.zones.map(z => ({ ...z })));
    setSelectedZoneId(freshCity.zones[0]?.id || null);
    setAiReport('');
    setApiNotice('');
  }, [activeCityName]);

  const selectedZone = useMemo(() => 
    zones.find(z => z.id === selectedZoneId), 
  [zones, selectedZoneId]);

  // Procedural Smart Zoning calculations combining traffic density and current AQI data
  const zoningMetrics = useMemo(() => {
    return zones.map(zone => {
      // 1. Calculate current traffic density (0 to 100)
      let trafficDensity = 0;
      if (zone.type === 'transit') trafficDensity = 90;
      else if (zone.type === 'commercial') trafficDensity = 75;
      else if (zone.type === 'industrial') trafficDensity = 55;
      else if (zone.type === 'residential') trafficDensity = 35;
      else if (zone.type === 'parkland') trafficDensity = 8;

      // Adjust traffic density dynamically based on active policy interventions
      if (zone.intervention === 'traffic') {
        trafficDensity = Math.max(5, trafficDensity - 25);
      } else if (zone.intervention === 'pedestrian') {
        trafficDensity = Math.max(0, trafficDensity - 35);
      } else if (zone.intervention === 'corridor') {
        trafficDensity = Math.max(5, trafficDensity - 10);
      }

      // 2. AQI (pollution load)
      const aqi = zone.pollution;

      // 3. Suitability calculations
      // - New Urban Forests: High priority in high AQI (needs mitigation) but low/medium traffic density
      const forestScore = Math.round(
        (0.65 * (aqi / 100) + 0.35 * (1 - trafficDensity / 100)) * 100
      );

      // - Bike Paths: High priority in high traffic density (lots of commuters to convert) and moderate/high AQI
      const bikePathScore = Math.round(
        (0.6 * (trafficDensity / 100) + 0.4 * (aqi / 100)) * 100
      );

      return {
        id: zone.id,
        trafficDensity,
        forestScore,
        bikePathScore,
        forestSuitability: forestScore > 75 ? 'Critical Match' : forestScore > 50 ? 'Viable Match' : 'Low Priority',
        bikePathSuitability: bikePathScore > 75 ? 'Critical Match' : bikePathScore > 50 ? 'Viable Match' : 'Low Priority',
      };
    });
  }, [zones]);

  // Stable deterministic particle offsets for wind flow (prevents tv static effect)
  const stableParticles = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      xPercent: (i * 13) % 100,
      yPercent: (i * 17) % 100,
      size: 0.3 + (i % 3) * 0.2,
      duration: 3 + (i % 3) * 1.5,
      delay: i * 0.1,
    }));
  }, []);

  // Safe toggling of interventions to avoid mathematical cumulative bugs
  const applyIntervention = (type: Zone['intervention']) => {
    if (!selectedZoneId) return;
    
    setZones(prev => prev.map(z => {
      if (z.id === selectedZoneId) {
        // Toggle off if clicking the active one
        const nextIntervention = z.intervention === type ? undefined : type;
        
        let reduction = 0;
        if (nextIntervention === 'trees') reduction = 26;
        else if (nextIntervention === 'corridor') reduction = 20;
        else if (nextIntervention === 'pedestrian') reduction = 16;
        else if (nextIntervention === 'traffic') reduction = 32;

        return { 
          ...z, 
          intervention: nextIntervention, 
          pollution: Math.max(10, z.basePollution - reduction) 
        };
      }
      return z;
    }));
    
    // Reset AI report if intervention changes so users are encouraged to query again
    setAiReport('');
  };

  const fetchAIRecommendations = async () => {
    if (!selectedZone) return;
    setLoadingAi(true);
    setAiReport('');
    setApiNotice('');
    
    try {
      const response = await fetch('/api/city-advisor-recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zoneName: selectedZone.name,
          pollution: selectedZone.pollution,
          activeIntervention: selectedZone.intervention,
          cityPreset: currentCity.name
        })
      });
      
      const data = await response.json();
      setAiReport(data.recommendations || 'Failed to generate recommendations.');
      if (data.notice) {
        setApiNotice(data.notice);
      }
    } catch (err) {
      console.error(err);
      setAiReport(`### 🌟 Smart Urban Recommendations for **${selectedZone.name}**
An error occurred while calling the Gemini API. Please ensure the dev server is active.
- **Recommended Action**: Deploy immediate local filtration modules and active green corridors.
- **Projected Impact**: -25% pollution load.`);
    } finally {
      setLoadingAi(false);
    }
  };

  const resetZones = () => {
    setZones(currentCity.zones.map(z => ({ ...z, intervention: undefined, pollution: z.basePollution })));
    setAiReport('');
    setApiNotice('');
  };

  const getPollutionColor = (level: number) => {
    if (level > 70) return '#ef4444'; // Bright Red
    if (level > 40) return '#f97316'; // Bright Orange
    return '#10b981'; // Vibrant Green
  };

  const getPollutionBgOpacity = (level: number) => {
    if (level > 70) return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (level > 40) return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  };

  // Recharts Data Projection: Do-Nothing vs Mitigated over 12 months
  const chartData = useMemo(() => {
    if (!selectedZone) return [];
    const base = selectedZone.basePollution;
    const current = selectedZone.pollution;
    const isIntervened = !!selectedZone.intervention;

    return Array.from({ length: 12 }).map((_, i) => {
      const monthLabel = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i];
      // Normal variation trend (seasonal smog in winter, clearer summers)
      const seasonalFactor = Math.sin((i / 11) * Math.PI * 2) * 8;
      
      const baselineVal = Math.round(Math.max(15, base + seasonalFactor + (i * 0.8))); // slightly rising baseline
      
      // Gradually sliding down towards current mitigated state
      const rate = i / 11;
      const activeVal = isIntervened 
        ? Math.round(Math.max(10, base - (base - current) * Math.sin(rate * Math.PI / 2) + seasonalFactor))
        : baselineVal;

      return {
        month: monthLabel,
        Baseline: baselineVal,
        Mitigated: activeVal,
      };
    });
  }, [selectedZone]);

  // Co-benefit Radar metrics based on selected zone type and intervention
  const radarData = useMemo(() => {
    if (!selectedZone) return [];
    
    // Baseline profiles based on zone type
    let profiles = { biodiversity: 20, transit: 30, publicHealth: 40, economy: 80, carbonSeq: 15 };
    if (selectedZone.type === 'parkland') {
      profiles = { biodiversity: 90, transit: 20, publicHealth: 85, economy: 40, carbonSeq: 80 };
    } else if (selectedZone.type === 'industrial') {
      profiles = { biodiversity: 10, transit: 50, publicHealth: 15, economy: 95, carbonSeq: 5 };
    } else if (selectedZone.type === 'transit') {
      profiles = { biodiversity: 15, transit: 90, publicHealth: 30, economy: 85, carbonSeq: 10 };
    } else if (selectedZone.type === 'residential') {
      profiles = { biodiversity: 45, transit: 60, publicHealth: 60, economy: 65, carbonSeq: 30 };
    } else if (selectedZone.type === 'commercial') {
      profiles = { biodiversity: 30, transit: 70, publicHealth: 50, economy: 90, carbonSeq: 20 };
    }

    // Enhance based on active intervention
    if (selectedZone.intervention === 'trees') {
      profiles.biodiversity = Math.min(100, profiles.biodiversity + 40);
      profiles.publicHealth = Math.min(100, profiles.publicHealth + 25);
      profiles.carbonSeq = Math.min(100, profiles.carbonSeq + 50);
    } else if (selectedZone.intervention === 'corridor') {
      profiles.biodiversity = Math.min(100, profiles.biodiversity + 35);
      profiles.carbonSeq = Math.min(100, profiles.carbonSeq + 30);
      profiles.transit = Math.min(100, profiles.transit + 15);
      profiles.publicHealth = Math.min(100, profiles.publicHealth + 20);
    } else if (selectedZone.intervention === 'pedestrian') {
      profiles.publicHealth = Math.min(100, profiles.publicHealth + 35);
      profiles.transit = Math.max(20, profiles.transit - 15); // pedestrian blocks vehicular transit slightly
      profiles.economy = Math.min(100, profiles.economy + 15); // foot traffic boosts local commerce
      profiles.biodiversity = Math.min(100, profiles.biodiversity + 10);
    } else if (selectedZone.intervention === 'traffic') {
      profiles.publicHealth = Math.min(100, profiles.publicHealth + 30);
      profiles.transit = Math.min(100, profiles.transit + 25); // smoother traffic
      profiles.carbonSeq = Math.min(100, profiles.carbonSeq + 15);
    }

    return [
      { subject: 'Biodiversity', A: profiles.biodiversity },
      { subject: 'Transit flow', A: profiles.transit },
      { subject: 'Public Health', A: profiles.publicHealth },
      { subject: 'Economic Force', A: profiles.economy },
      { subject: 'CO₂ Capture', A: profiles.carbonSeq },
    ];
  }, [selectedZone]);

  // Overall City average indices calculation
  const overallMetrics = useMemo(() => {
    const avgPollution = Math.round(zones.reduce((acc, z) => acc + z.pollution, 0) / zones.length);
    const avgBasePollution = Math.round(zones.reduce((acc, z) => acc + z.basePollution, 0) / zones.length);
    const totalInterventions = zones.filter(z => !!z.intervention).length;
    const carbonMitigated = totalInterventions * 3.4; // simulated tons per hour

    return {
      avgPollution,
      avgBasePollution,
      activeSensors: 1420 + totalInterventions * 150,
      carbonMitigated: carbonMitigated.toFixed(1)
    };
  }, [zones]);

  const renderMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('###')) {
        return <h4 key={idx} className="text-base font-black text-cyan-400 mt-4 mb-2 tracking-tight flex items-center gap-2 border-b border-cyan-950/40 pb-1 uppercase">{line.replace('###', '').trim()}</h4>;
      }
      if (line.startsWith('####')) {
        return <h5 key={idx} className="text-[11px] font-bold text-emerald-400 mt-3 mb-1 uppercase tracking-widest">{line.replace('####', '').trim()}</h5>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={idx} className="font-bold text-white my-1 text-xs">{line.replace(/\*\*/g, '').trim()}</p>;
      }
      if (line.startsWith('-') || line.startsWith('*')) {
        const formatted = line.substring(1).trim().replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-300 font-bold">$1</strong>');
        return (
          <div key={idx} className="flex items-start gap-1.5 my-1.5 pl-1">
            <span className="text-cyan-500 mt-1 text-[8px]">◆</span>
            <span className="text-slate-300 text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />
          </div>
        );
      }
      if (line.trim() === '') return <div key={idx} className="h-1" />;
      
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
      return <p key={idx} className="text-slate-300 text-xs leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
    });
  };

  const filteredCities = useMemo(() => {
    return CITIES_METADATA.filter(meta => {
      const matchesSearch = meta.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            meta.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGeo = geoFilter === 'All' || meta.category === geoFilter;
      
      let matchesAqi = true;
      if (aqiFilter === 'Critical') matchesAqi = meta.avgBasePollution > 70;
      else if (aqiFilter === 'Moderate') matchesAqi = meta.avgBasePollution >= 40 && meta.avgBasePollution <= 70;
      else if (aqiFilter === 'Optimal') matchesAqi = meta.avgBasePollution < 40;
      
      return matchesSearch && matchesGeo && matchesAqi;
    });
  }, [searchQuery, geoFilter, aqiFilter]);

  return (
    <div id="green-city-workspace" className="flex-1 flex flex-col gap-6 animate-in fade-in duration-500 text-slate-100">
      
      {/* Immersive Cyber-Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-slate-900 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-cyan-400 uppercase font-black">Digital Twin Environment</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter mt-1 flex items-center gap-3">
            Green City Advisor <span className="text-xs font-mono font-bold bg-slate-900 px-3 py-1 rounded-full text-slate-500 border border-slate-800">v4.2 PRO</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Simulate advanced micro-climate interventions, model physical dispersion, and sifting blueprints.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={resetZones}
            className="flex items-center gap-2 px-5 py-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Blueprint
          </button>
        </div>
      </div>

      {/* Interactive Metropolitan Atlas Grid */}
      <div className="glass rounded-[32px] border border-slate-900 p-6 bg-slate-950/20 shadow-2xl space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Metropolitan Twin Atlas <span className="text-xs font-mono font-normal text-slate-500">({filteredCities.length} Regions Match)</span>
            </h3>
          </div>
          
          {/* Grid Filter controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <input 
              type="text"
              placeholder="Search 160 cities..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(16); // Reset pagination on search
              }}
              className="px-4 py-2 bg-slate-950 border border-slate-900 focus:border-cyan-500/40 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none min-w-[200px]"
            />
            
            {/* Geography Filter tabs */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-900">
              {(['All', 'India', 'Global'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setGeoFilter(cat);
                    setVisibleCount(16); // Reset pagination
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    geoFilter === cat 
                      ? 'bg-slate-900 text-white border border-slate-850' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {cat === 'All' ? 'All' : cat === 'India' ? '🇮🇳 India' : '🌐 Global'}
                </button>
              ))}
            </div>

            {/* AQI Filter buttons */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-900">
              {(['All', 'Critical', 'Moderate', 'Optimal'] as const).map((aqi) => (
                <button
                  key={aqi}
                  onClick={() => {
                    setAqiFilter(aqi);
                    setVisibleCount(16); // Reset pagination
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    aqiFilter === aqi 
                      ? 'bg-slate-900 text-white border border-slate-850' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {aqi === 'All' ? 'AQI All' : aqi === 'Critical' ? '🔴 Critical (>70)' : aqi === 'Moderate' ? '🟠 Mod (40-70)' : '🟢 Opt (<40)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Selection Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between text-xs bg-slate-950/60 border border-slate-900 px-4 py-3 rounded-xl gap-2">
          <div className="flex items-center gap-3">
            <span className="text-slate-500">Currently Synced Twin:</span>
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentCity.accentColor }}></span>
              {currentCity.name} ({currentCity.category === 'India' ? 'India' : currentCity.country})
            </span>
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            BASE AQI: <span className="font-bold text-slate-300">{currentCity.avgBasePollution}</span> | LIVE AQI: <span className="font-bold text-cyan-400">{overallMetrics.avgPollution}</span>
          </div>
        </div>

        {/* Responsive Cities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-[195px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredCities.slice(0, visibleCount).map((cityMeta) => {
            const isActive = activeCityName === cityMeta.name;
            return (
              <div 
                key={cityMeta.name}
                onClick={() => {
                  setActiveCityName(cityMeta.name);
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between h-[85px] relative group overflow-hidden ${
                  isActive 
                    ? 'bg-slate-900 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                    : 'bg-slate-950/40 border-slate-900/60 hover:border-slate-800 hover:bg-slate-900/20'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 to-emerald-500"></div>
                )}
                
                <div className="space-y-0.5">
                  <div className="text-[11px] font-bold text-white truncate">{cityMeta.name}</div>
                  <div className="text-[9px] text-slate-500 truncate">{cityMeta.country}</div>
                </div>
                
                <div className="flex justify-between items-center mt-1 text-[9px] font-mono">
                  <span className="text-[9px] text-slate-600">
                    {cityMeta.category === 'India' ? '🇮🇳 Ind' : '🌐 Glb'}
                  </span>
                  <span className={`font-bold ${
                    cityMeta.avgBasePollution > 70 ? 'text-red-400' :
                    cityMeta.avgBasePollution > 40 ? 'text-orange-400' :
                    'text-emerald-400'
                  }`}>
                    AQI {cityMeta.avgBasePollution}
                  </span>
                </div>
              </div>
            );
          })}
          {filteredCities.length === 0 && (
            <div className="col-span-full py-8 text-center text-slate-600 text-xs font-mono">
              NO METROPOLITAN TWINS MATCH FILTER CRITERIA
            </div>
          )}
        </div>

        {/* Load More controls */}
        {filteredCities.length > visibleCount && (
          <div className="flex justify-center pt-2">
            <button 
              onClick={() => setVisibleCount(prev => prev + 24)}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all shadow-md"
            >
              Load More Regions ({filteredCities.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>

      {/* Main Structural Twin Dashboard */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Holographic Simulation Map & Sensor Streams */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Main SVG Tactical Visualizer */}
          <div className="glass rounded-[32px] border border-slate-900 p-6 relative overflow-hidden bg-slate-950/40 flex flex-col justify-between h-[580px] shadow-2xl group">
            
            {/* Architectural Grid overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none transition-opacity group-hover:opacity-[0.06]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            {/* Glowing atmosphere effect */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

            {/* HUD Header with Smart Zoning overlays */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-10 border-b border-slate-900/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-900">
                  <MapIcon className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase text-slate-500 tracking-wider">Tactical Blueprint Visualizer</div>
                  <div className="text-xs font-bold text-white tracking-tight">{currentCity.name} Geographic Grid</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Smart Zoning Control Segment */}
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-900">
                  <span className="text-[8px] font-mono font-black text-slate-500 uppercase tracking-widest px-2">Smart Zoning:</span>
                  <button
                    onClick={() => setSmartZoningMode('off')}
                    className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${
                      smartZoningMode === 'off'
                        ? 'bg-slate-900 text-white border border-slate-800 shadow-md font-extrabold'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Off
                  </button>
                  <button
                    onClick={() => setSmartZoningMode('forest')}
                    className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                      smartZoningMode === 'forest'
                        ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-extrabold'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Trees className="w-3 h-3 text-emerald-400" />
                    Forest
                  </button>
                  <button
                    onClick={() => setSmartZoningMode('bikepath')}
                    className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                      smartZoningMode === 'bikepath'
                        ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-900/50 shadow-[0_0_15px_rgba(34,211,238,0.15)] font-extrabold'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Navigation className="w-3 h-3 text-cyan-400" />
                    Bike Path
                  </button>
                </div>

                <div className="flex items-center gap-2 font-mono text-[9px] text-slate-500 bg-slate-950/80 px-3 py-1.5 rounded-full border border-slate-900">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  SIMULATOR ENGAGED
                </div>
              </div>
            </div>

            {/* Actual Interactive SVG Twin */}
            <div className="flex-1 w-full flex items-center justify-center py-4 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full max-h-[420px] drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                
                {/* 1. Cyber River (Sumida, Hudson, Yamuna) */}
                <g className="opacity-40">
                  <path 
                    d={currentCity.riverPath} 
                    stroke="url(#riverGrad)" 
                    strokeWidth="4" 
                    fill="none" 
                    strokeLinecap="round"
                  />
                  {/* Flowing particles in the river */}
                  <path 
                    d={currentCity.riverPath} 
                    stroke="#22d3ee" 
                    strokeWidth="4" 
                    fill="none" 
                    strokeLinecap="round"
                    strokeDasharray="2 12"
                    className="animate-river-flow"
                    style={{
                      animation: 'river-flow 25s linear infinite',
                      strokeOpacity: 0.8
                    }}
                  />
                </g>

                {/* 2. Arterial Highways (glowing lines with traffic movement) */}
                <g className="opacity-20 pointer-events-none">
                  {/* Diagonal arterial 1 */}
                  <line x1="5" y1="5" x2="95" y2="95" stroke="#475569" strokeWidth="0.8" />
                  <line x1="5" y1="5" x2="95" y2="95" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 30" style={{ animation: 'river-flow 10s linear infinite' }} />
                  {/* Cross arterial 2 */}
                  <line x1="5" y1="95" x2="95" y2="5" stroke="#475569" strokeWidth="0.8" />
                  <line x1="5" y1="95" x2="95" y2="5" stroke="#a855f7" strokeWidth="0.8" strokeDasharray="4 40" style={{ animation: 'river-flow 14s linear reverse infinite' }} />
                </g>

                {/* 3. Interactive Zone Districts */}
                {zones.map((zone) => {
                  const isSelected = selectedZoneId === zone.id;
                  const borderCol = getPollutionColor(zone.pollution);
                  
                  // Get smart zoning metrics for this zone
                  const metric = zoningMetrics.find(m => m.id === zone.id);
                  const isSmartZoningActive = smartZoningMode !== 'off';
                  const suitabilityScore = smartZoningMode === 'forest' ? (metric?.forestScore || 0) : (metric?.bikePathScore || 0);
                  
                  return (
                    <g 
                      key={zone.id}
                      onClick={() => setSelectedZoneId(zone.id)}
                      className="cursor-pointer group/zone"
                    >
                      {/* Base colored solid zone block */}
                      <rect
                        x={zone.x}
                        y={zone.y}
                        width={zone.width}
                        height={zone.height}
                        rx="6"
                        fill={borderCol}
                        opacity={isSelected ? 0.28 : 0.08}
                        className="transition-all duration-700 hover:opacity-20"
                      />

                      {/* Heatmap overlay if active */}
                      {isSmartZoningActive && (
                        <rect
                          x={zone.x}
                          y={zone.y}
                          width={zone.width}
                          height={zone.height}
                          rx="6"
                          fill={smartZoningMode === 'forest' ? 'url(#forestHeatGrad)' : 'url(#bikeHeatGrad)'}
                          opacity={0.15 + (suitabilityScore / 100) * 0.6}
                          className="transition-all duration-500 hover:opacity-95"
                        />
                      )}

                      {/* Pulsing highlight for highly optimal suitability areas */}
                      {isSmartZoningActive && suitabilityScore > 75 && (
                        <rect
                          x={zone.x - 0.5}
                          y={zone.y - 0.5}
                          width={zone.width + 1}
                          height={zone.height + 1}
                          rx="7"
                          fill="none"
                          stroke={smartZoningMode === 'forest' ? '#a3e635' : '#06b6d4'}
                          strokeWidth="0.5"
                          className="animate-pulse"
                          opacity="0.8"
                        />
                      )}
                      
                      {/* Stylized inner structural grid blocks inside zones */}
                      <rect
                        x={zone.x + 1}
                        y={zone.y + 1}
                        width={zone.width - 2}
                        height={zone.height - 2}
                        rx="5"
                        fill="none"
                        stroke={isSmartZoningActive ? (smartZoningMode === 'forest' ? '#10b981' : '#06b6d4') : borderCol}
                        strokeWidth="0.3"
                        strokeDasharray="1 3"
                        opacity="0.3"
                      />

                      {/* Outer boundary lines */}
                      <rect
                        x={zone.x}
                        y={zone.y}
                        width={zone.width}
                        height={zone.height}
                        rx="6"
                        fill="none"
                        stroke={isSmartZoningActive ? (smartZoningMode === 'forest' ? '#a3e635' : '#06b6d4') : borderCol}
                        strokeWidth={isSelected ? 1.5 : 0.5}
                        className="transition-all duration-700"
                        style={{
                          filter: isSelected ? `drop-shadow(0 0 6px ${isSmartZoningActive ? (smartZoningMode === 'forest' ? '#10b981' : '#06b6d4') : borderCol}80)` : 'none'
                        }}
                      />

                      {/* Micro district text marker */}
                      <text
                        x={zone.x + 3}
                        y={zone.y + 6}
                        fill={isSmartZoningActive ? '#f1f5f9' : '#94a3b8'}
                        fontSize="2.2"
                        fontWeight="bold"
                        className="font-mono select-none pointer-events-none opacity-80"
                      >
                        {zone.name.split(' ')[0].toUpperCase()}
                      </text>

                      {isSmartZoningActive ? (
                        <g>
                          <text
                            x={zone.x + 3}
                            y={zone.y + zone.height - 3}
                            fill={smartZoningMode === 'forest' ? '#a3e635' : '#22d3ee'}
                            fontSize="3"
                            fontWeight="black"
                            className="font-mono select-none pointer-events-none uppercase tracking-tight"
                          >
                            {suitabilityScore}% Match
                          </text>
                          <text
                            x={zone.x + 3}
                            y={zone.y + zone.height - 6.5}
                            fill="#94a3b8"
                            fontSize="2"
                            fontWeight="bold"
                            className="font-mono select-none pointer-events-none uppercase tracking-wider opacity-80"
                          >
                            TRF: {metric?.trafficDensity}%
                          </text>
                        </g>
                      ) : (
                        <text
                          x={zone.x + 3}
                          y={zone.y + zone.height - 3}
                          fill={borderCol}
                          fontSize="3"
                          fontWeight="black"
                          className="font-mono select-none pointer-events-none"
                        >
                          AQI {zone.pollution}
                        </text>
                      )}

                      {/* Dynamic Visual Indicator Overlays based on active intervention */}
                      {zone.intervention === 'trees' && (
                        <g transform={`translate(${zone.x + zone.width - 6}, ${zone.y + 4})`} className="pointer-events-none">
                          <rect width="4" height="4" rx="1" fill="#10b981" opacity="0.2" className="animate-pulse" />
                          <path d="M2,0.8 L3.5,3 L0.5,3 Z" fill="#10b981" />
                        </g>
                      )}
                      
                      {zone.intervention === 'corridor' && (
                        <g transform={`translate(${zone.x + zone.width - 6}, ${zone.y + 4})`} className="pointer-events-none">
                          <rect width="4" height="4" rx="1" fill="#06b6d4" opacity="0.2" />
                          <circle cx="2" cy="2" r="1.2" stroke="#06b6d4" strokeWidth="0.4" fill="none" className="animate-ping" />
                        </g>
                      )}

                      {zone.intervention === 'pedestrian' && (
                        <g transform={`translate(${zone.x + zone.width - 6}, ${zone.y + 4})`} className="pointer-events-none">
                          <rect width="4" height="4" rx="1" fill="#f43f5e" opacity="0.2" />
                          <path d="M1,3 L2,1 L3,3" stroke="#f43f5e" strokeWidth="0.5" fill="none" />
                        </g>
                      )}

                      {zone.intervention === 'traffic' && (
                        <g transform={`translate(${zone.x + zone.width - 6}, ${zone.y + 4})`} className="pointer-events-none">
                          <rect width="4" height="4" rx="1" fill="#3b82f6" opacity="0.2" />
                          <circle cx="2" cy="1.5" r="0.8" fill="#3b82f6" />
                          <line x1="2" y1="2" x2="2" y2="3.5" stroke="#3b82f6" strokeWidth="0.5" />
                        </g>
                      )}

                      {/* Selected District Reticle Target */}
                      {isSelected && (
                        <g className="pointer-events-none animate-pulse">
                          {/* Top-left corner */}
                          <path d={`M${zone.x - 1.5} ${zone.y + 2.5} L${zone.x - 1.5} ${zone.y - 1.5} L${zone.x + 2.5} ${zone.y - 1.5}`} stroke="#22d3ee" strokeWidth="0.6" fill="none" />
                          {/* Top-right corner */}
                          <path d={`M${zone.x + zone.width + 1.5} ${zone.y + 2.5} L${zone.x + zone.width + 1.5} ${zone.y - 1.5} L${zone.x + zone.width - 2.5} ${zone.y - 1.5}`} stroke="#22d3ee" strokeWidth="0.6" fill="none" />
                          {/* Bottom-left corner */}
                          <path d={`M${zone.x - 1.5} ${zone.y + zone.height - 2.5} L${zone.x - 1.5} ${zone.y + zone.height + 1.5} L${zone.x + 2.5} ${zone.y + zone.height + 1.5}`} stroke="#22d3ee" strokeWidth="0.6" fill="none" />
                          {/* Bottom-right corner */}
                          <path d={`M${zone.x + zone.width + 1.5} ${zone.y + zone.height - 2.5} L${zone.x + zone.width + 1.5} ${zone.y + zone.height + 1.5} L${zone.x + zone.width - 2.5} ${zone.y + zone.height + 1.5}`} stroke="#22d3ee" strokeWidth="0.6" fill="none" />
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* 4. Smooth Wind-like Floating Air Quality Particles */}
                <g className="pointer-events-none opacity-25">
                  {stableParticles.map((pt) => {
                    // Match a zone coordinate to pick up zone pollution status dynamically
                    const matchedZone = zones.find(z => 
                      pt.xPercent >= z.x && 
                      pt.xPercent <= z.x + z.width && 
                      pt.yPercent >= z.y && 
                      pt.yPercent <= z.y + z.height
                    ) || zones[4];

                    const color = getPollutionColor(matchedZone.pollution);
                    return (
                      <motion.circle
                        key={pt.id}
                        cx={pt.xPercent}
                        cy={pt.yPercent}
                        r={pt.size}
                        fill={color}
                        animate={{
                          x: [0, 8, 0],
                          y: [0, -6, 0],
                          opacity: [0.15, 0.6, 0.15]
                        }}
                        transition={{
                          duration: pt.duration,
                          repeat: Infinity,
                          delay: pt.delay,
                          ease: "easeInOut"
                        }}
                      />
                    );
                  })}
                </g>

                {/* Definitions for Gradients */}
                <defs>
                  <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#083344" />
                    <stop offset="50%" stopColor="#0e7490" />
                    <stop offset="100%" stopColor="#155e75" />
                  </linearGradient>
                  {/* Heatmap overlay gradients for Smart Zoning */}
                  <linearGradient id="forestHeatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#a3e635" />
                  </linearGradient>
                  <linearGradient id="bikeHeatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Map Legend & Diagnostics HUD */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-t border-slate-900 z-10">
              {smartZoningMode === 'off' ? (
                <div className="flex flex-wrap items-center gap-4 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-900">
                  <span className="text-[9px] font-mono uppercase text-slate-500 font-bold">ZONAL AQI:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    <span className="text-[10px] font-bold text-slate-400">Critical (&gt;70)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                    <span className="text-[10px] font-bold text-slate-400">Moderate (40-70)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-bold text-slate-400">Optimal (&lt;40)</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-4 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-900">
                  <span className="text-[9px] font-mono uppercase text-slate-500 font-bold">SUITABILITY HEATMAP:</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${smartZoningMode === 'forest' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]'}`} />
                    <span className="text-[10px] font-bold text-slate-400">High Match (&gt;75%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${smartZoningMode === 'forest' ? 'bg-lime-400 shadow-[0_0_8px_rgba(163,230,71,0.5)]' : 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]'}`} />
                    <span className="text-[10px] font-bold text-slate-400">Moderate Match (50-75%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                    <span className="text-[10px] font-bold text-slate-500">Low Priority (&lt;50%)</span>
                  </div>
                </div>
              )}

              <div className="text-[10px] font-mono text-slate-500">
                {smartZoningMode === 'off' ? (
                  <>💡 <span className="text-slate-400">Pro-Tip:</span> Click on different zones to manage targeted policies.</>
                ) : smartZoningMode === 'forest' ? (
                  <>🌲 <span className="text-emerald-400">Urban Forest:</span> Recommends high AQI (high pollution) + lower traffic areas for bio-sink buffers.</>
                ) : (
                  <>🚲 <span className="text-cyan-400">Bike Paths:</span> Recommends high traffic corridors + moderate-to-high AQI areas to divert vehicle trips.</>
                )}
              </div>
            </div>
          </div>

          {/* Micro-Sensors Real-Time Stream Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass p-5 rounded-3xl border border-slate-900 bg-slate-950/20">
              <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Metropolitan Health AQI</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{overallMetrics.avgPollution}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getPollutionBgOpacity(overallMetrics.avgPollution)}`}>
                  {overallMetrics.avgPollution > 70 ? 'CRITICAL' : overallMetrics.avgPollution > 40 ? 'MODERATE' : 'OPTIMAL'}
                </span>
              </div>
              <div className="text-[10px] font-medium text-slate-500 mt-2 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                Baseline avg: {overallMetrics.avgBasePollution}
              </div>
            </div>

            <div className="glass p-5 rounded-3xl border border-slate-900 bg-slate-950/20">
              <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Sensor Grid State</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{overallMetrics.activeSensors}</span>
                <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-400/5 border border-emerald-400/10 px-2 py-0.5 rounded-full">ACTIVE</span>
              </div>
              <div className="text-[10px] font-medium text-slate-500 mt-2">
                Spectroscopic air sensors live
              </div>
            </div>

            <div className="glass p-5 rounded-3xl border border-slate-900 bg-slate-950/20">
              <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Mitigated Carbon</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-400">{overallMetrics.carbonMitigated}</span>
                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">Tons/Hr</span>
              </div>
              <div className="text-[10px] font-medium text-slate-500 mt-2">
                From biological & traffic bans
              </div>
            </div>

            <div className="glass p-5 rounded-3xl border border-slate-900 bg-slate-950/20">
              <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Compliance Index</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-cyan-400">92.4%</span>
                <span className="text-[9px] font-mono text-cyan-400 bg-cyan-400/5 border border-cyan-400/10 px-2 py-0.5 rounded-full">OPTIMAL</span>
              </div>
              <div className="text-[10px] font-medium text-slate-500 mt-2">
                SDG-13 target compliance
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Selection HUD Controls & Interactive Timelines & AI Planner */}
        <div className="xl:col-span-4 space-y-6">
          <AnimatePresence mode="wait">
            {selectedZone ? (
              <motion.div 
                key={selectedZone.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="glass p-6 rounded-[32px] border border-slate-900 bg-slate-950/10 space-y-6"
              >
                {/* Zone General Info Header */}
                <div className="space-y-2 pb-5 border-b border-slate-900">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-[9px] font-mono font-black uppercase px-2.5 py-1 rounded-full bg-slate-950 border border-slate-900 text-slate-400 tracking-wider`}>
                        {selectedZone.type}
                      </span>
                      <h3 className="text-2xl font-black text-white tracking-tighter mt-2">{selectedZone.name}</h3>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      selectedZone.pollution > 70 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                      selectedZone.pollution > 40 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {selectedZone.pollution > 70 ? 'CRITICAL' : selectedZone.pollution > 40 ? 'MODERATE' : 'OPTIMAL'}
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{selectedZone.description}</p>
                </div>

                {/* Pollution Bar Indicator */}
                <div className="space-y-3 pb-4 border-b border-slate-900">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    <span>Air Pollution Index</span>
                    <span className="font-bold text-white">{selectedZone.pollution}% Loading</span>
                  </div>
                  <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900 p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedZone.pollution}%` }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: getPollutionColor(selectedZone.pollution) }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>

                {/* Smart Zoning Intelligence Diagnostics */}
                <div className="space-y-3 pb-5 border-b border-slate-900 bg-slate-950/20 p-3.5 rounded-2xl border border-slate-900/60">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold">Smart Zoning Diagnostics</span>
                    <span className="text-[8px] bg-cyan-950 text-cyan-400 border border-cyan-900/30 px-1.5 py-0.5 rounded uppercase font-mono">Live Overlay</span>
                  </div>
                  
                  {(() => {
                    const metric = zoningMetrics.find(m => m.id === selectedZone.id);
                    if (!metric) return null;
                    return (
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="space-y-1">
                          <div className="text-[9px] text-slate-500 uppercase font-bold">Traffic Density</div>
                          <div className="text-sm font-black text-white flex items-center gap-1">
                            <CarFront className="w-3.5 h-3.5 text-slate-400" />
                            {metric.trafficDensity}%
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[9px] text-slate-500 uppercase font-bold">Current AQI</div>
                          <div className="text-sm font-black text-white flex items-center gap-1" style={{ color: getPollutionColor(selectedZone.pollution) }}>
                            <Wind className="w-3.5 h-3.5" />
                            {selectedZone.pollution}
                          </div>
                        </div>
                        <div className="space-y-1 pt-1.5 border-t border-slate-900">
                          <div className="text-[9px] text-slate-500 uppercase font-bold">🌲 Forest Suitability</div>
                          <div className="text-xs font-black text-emerald-400 flex items-center gap-1">
                            {metric.forestScore}%
                            <span className="text-[8px] font-bold text-slate-500">({metric.forestSuitability})</span>
                          </div>
                        </div>
                        <div className="space-y-1 pt-1.5 border-t border-slate-900">
                          <div className="text-[9px] text-slate-500 uppercase font-bold">🚲 Bike Suitability</div>
                          <div className="text-xs font-black text-cyan-400 flex items-center gap-1">
                            {metric.bikePathScore}%
                            <span className="text-[8px] font-bold text-slate-500">({metric.bikePathSuitability})</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Dual Tabs Panel: Interventions vs Co-benefits */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">Environmental Policy Planner</h4>
                  
                  <div className="grid grid-cols-2 gap-2.5">
                    <button 
                      onClick={() => applyIntervention('trees')}
                      className={`flex flex-col items-start p-3.5 rounded-2xl border transition-all ${
                        selectedZone.intervention === 'trees' 
                          ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400' 
                          : 'border-slate-900 bg-slate-950/40 text-slate-300 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Trees className="w-4 h-4" />
                        <span className="text-xs font-black uppercase">Trees (Bio-Sink)</span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">Reduces PM2.5 by 26%</span>
                    </button>

                    <button 
                      onClick={() => applyIntervention('corridor')}
                      className={`flex flex-col items-start p-3.5 rounded-2xl border transition-all ${
                        selectedZone.intervention === 'corridor' 
                          ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400' 
                          : 'border-slate-900 bg-slate-950/40 text-slate-300 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Wind className="w-4 h-4" />
                        <span className="text-xs font-black uppercase">Green Corridor</span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">Wind corridor -20%</span>
                    </button>

                    <button 
                      onClick={() => applyIntervention('pedestrian')}
                      className={`flex flex-col items-start p-3.5 rounded-2xl border transition-all ${
                        selectedZone.intervention === 'pedestrian' 
                          ? 'border-rose-400 bg-rose-400/10 text-rose-400' 
                          : 'border-slate-900 bg-slate-950/40 text-slate-300 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4" />
                        <span className="text-xs font-black uppercase">Pedestrian Zone</span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">Car-free grid -16%</span>
                    </button>

                    <button 
                      onClick={() => applyIntervention('traffic')}
                      className={`flex flex-col items-start p-3.5 rounded-2xl border transition-all ${
                        selectedZone.intervention === 'traffic' 
                          ? 'border-blue-400 bg-blue-400/10 text-blue-400' 
                          : 'border-slate-900 bg-slate-950/40 text-slate-300 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CarFront className="w-4 h-4" />
                        <span className="text-xs font-black uppercase">Smart Traffic</span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">Autonomous bans -32%</span>
                    </button>
                  </div>
                </div>

                {/* 12-Month Recharts Projection AreaChart */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      12M AQI Forecast Scenario
                    </span>
                    <span className="text-slate-500">Jan - Dec Range</span>
                  </div>
                  <div className="h-40 w-full bg-slate-950 p-3 rounded-2xl border border-slate-900">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="baselineColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="mitigatedColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', fontSize: 10 }} />
                        <Area type="monotone" dataKey="Baseline" stroke="#ef4444" strokeWidth={1.5} fillOpacity={1} fill="url(#baselineColor)" />
                        <Area type="monotone" dataKey="Mitigated" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#mitigatedColor)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Gemini AI Urban Advisor Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      Gemini AI Urban Planner
                    </div>
                    {apiNotice && (
                      <span className="text-[8px] bg-slate-900 border border-slate-800 text-slate-500 px-2 py-0.5 rounded-full uppercase font-mono">
                        Simulated
                      </span>
                    )}
                  </div>

                  {!aiReport && !loadingAi && (
                    <button
                      onClick={fetchAIRecommendations}
                      className="w-full py-4 bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 hover:from-cyan-950 hover:to-slate-900 text-cyan-400 hover:text-cyan-300 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-cyan-500/20 transition-all duration-300"
                    >
                      <BrainCircuit className="w-4 h-4" />
                      Synthesize AI Advisory Plan
                    </button>
                  )}

                  {loadingAi && (
                    <div className="p-5 bg-slate-950 rounded-2xl border border-cyan-500/10 flex flex-col items-center justify-center space-y-3 text-center h-48">
                      <div className="relative">
                        <div className="w-10 h-10 border-4 border-cyan-500/10 border-t-cyan-400 rounded-full animate-spin"></div>
                        <BrainCircuit className="w-5 h-5 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest">Quantum Sifting converging...</div>
                        <p className="text-[9px] text-slate-500 max-w-[180px]">Querying LLM and projecting environmental metrics.</p>
                      </div>
                    </div>
                  )}

                  {aiReport && !loadingAi && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 bg-slate-950 rounded-2xl border border-cyan-950 flex flex-col max-h-[300px] overflow-y-auto font-sans shadow-inner relative"
                    >
                      {/* Copy/Feedback Notice */}
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button 
                          onClick={() => setAiReport('')} 
                          className="text-[9px] font-mono uppercase bg-slate-900/80 px-2 py-1 border border-slate-800 hover:border-slate-700 text-slate-500 hover:text-white rounded-lg transition-all"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="space-y-3 pr-2 scrollbar-thin">
                        {renderMarkdown(aiReport)}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* active status notification banner */}
                {selectedZone.intervention && (
                  <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-emerald-400 font-black uppercase tracking-wider">Active Policy: {selectedZone.intervention.toUpperCase()}</p>
                      <p className="text-[9px] text-slate-500 mt-0.5">Pollution reduced relative to regional meteorological stagnation coefficient.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="glass p-8 rounded-[32px] border border-slate-900 bg-slate-950/20 h-[500px] flex flex-col items-center justify-center text-center space-y-6">
                <div className="p-6 bg-slate-950 rounded-[2rem] border border-slate-900 shadow-xl">
                  <Maximize2 className="w-12 h-12 text-slate-700" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-300 uppercase tracking-widest">Select a Grid Sector</h3>
                  <p className="text-slate-500 text-xs max-w-[220px] mx-auto leading-relaxed">Click on any district in the tactical digital twin view on the left to analyze air metrics and trigger advanced policies.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Cyber-footer: Bridge to Quantum strategy hub */}
      <div className="w-full">
        <div className="glass p-6 md:p-8 rounded-[2.5rem] border border-slate-900 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-[1.5rem] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_25px_rgba(52,211,153,0.15)]">
              <BrainCircuit className="w-7 h-7 text-emerald-500 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                Quantum Strategy Hub Integration
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">CONNECTED</span>
              </h3>
              <p className="text-slate-400 text-xs max-w-lg mt-1">Bridge physical urban blueprints with quantum-optimized policy formulations to establish globally aligned SDG objectives.</p>
            </div>
          </div>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('set-workflow', { detail: 'decision-engine' }))}
            className="px-6 py-4 bg-emerald-500 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-102 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all shrink-0"
          >
            Launch Decision Engine
            <ArrowUpRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default GreenCityAdvisor;
