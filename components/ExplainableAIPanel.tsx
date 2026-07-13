import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, 
  Wind, 
  Car, 
  Thermometer, 
  ArrowRight, 
  Info,
  ChevronRight,
  Activity,
  Zap,
  MapPin,
  Search,
  PieChart as PieChartIcon,
  Cpu,
  Network,
  AlertTriangle,
  Scale,
  TrendingDown,
  ShieldCheck,
  Flame,
  Factory,
  CheckCircle2,
  TrendingUp,
  AlertOctagon,
  Binary
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts';
import { optimizePolicyQAOA, predictPollutionHybrid } from '../src/services/quantumAIService';

interface SourceAttribution {
  id: string;
  source: string;
  shapValue: number; // Positive increases AQI, Negative decreases AQI
  confidence: number; // percentage
  deviation: number; // +/- range
  sampleCount: number;
  category: string;
  desc: string;
  monitorCorrelation: number; // Correlation coeff with ground truth
  neuralActivation: string; // Activation level of the node
  color: string;
  icon: React.ElementType;
}

const CITIES = [
  "New Delhi", "Gurgaon", "Patna", "Faridabad", "Lucknow", "Noida", "Ghaziabad", "Mumbai", "Bangalore", "Kolkata", 
  "Paris", "Tokyo", "Seoul", "Beijing", "New York", "Singapore", "London", "Los Angeles", "Berlin", "Dubai"
];

// Helper to generate consistent, deterministic but city-specific SHAP attribution values
const generateSHAPAttribution = (city: string): {
  baseAQI: number;
  totalSHAP: number;
  sources: SourceAttribution[];
  metrics: {
    globalFidelity: number;
    trainingEpochs: number;
    gnnConfidence: number;
    shapVariance: number;
  };
} => {
  const hash = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Base parameters
  const baseAQI = 50 + (hash % 100);
  const scale = 1 + (hash % 5) * 0.3;

  // Custom city profile shapes
  const isIndustrial = hash % 3 === 0;
  const isTrafficHeavy = hash % 3 === 1;
  const isAgricultural = hash % 3 === 2;

  const vehicularSHAP = Math.round((isTrafficHeavy ? 65 : 35) * scale);
  const roadDustSHAP = Math.round((isTrafficHeavy ? 45 : 25) * scale);
  const biomassSHAP = Math.round((isAgricultural ? 85 : 15) * scale);
  const industrialSHAP = Math.round((isIndustrial ? 95 : 30) * scale);
  const constructionSHAP = Math.round((hash % 4 === 0 ? 55 : 20) * scale);
  const wasteBurningSHAP = Math.round((hash % 5 === 0 ? 40 : 12) * scale);

  // Scavenging (negative SHAP) forces
  const windScavenging = -Math.round((20 + (hash % 20)) * scale);
  const wetDeposition = -Math.round((10 + (hash % 15)) * scale);
  const greenCanopy = -Math.round((15 + (hash % 15)) * scale);

  const totalSHAP = vehicularSHAP + roadDustSHAP + biomassSHAP + industrialSHAP + constructionSHAP + wasteBurningSHAP + windScavenging + wetDeposition + greenCanopy;

  const sources: SourceAttribution[] = [
    {
      id: 'vehicular',
      source: 'Vehicular Exhaust',
      shapValue: vehicularSHAP,
      confidence: 96.4 - (hash % 4) * 0.5,
      deviation: 1.2 + (hash % 5) * 0.2,
      sampleCount: 1420 + (hash % 50) * 10,
      category: 'Anthropogenic Emissions',
      desc: 'Soot, organic aerosols, and NOx from tailpipes, dominant during traffic peaks.',
      monitorCorrelation: 0.94 - (hash % 5) * 0.01,
      neuralActivation: 'High-Level Dense Layer 4',
      color: '#f43f5e', // rose-500
      icon: Car
    },
    {
      id: 'road-dust',
      source: 'Road Silt & Resuspension',
      shapValue: roadDustSHAP,
      confidence: 92.8 - (hash % 3) * 0.4,
      deviation: 2.1 + (hash % 4) * 0.3,
      sampleCount: 980 + (hash % 30) * 10,
      category: 'Fugitive Crustal Dust',
      desc: 'Mechanical shear from vehicles resuspending soil, silt, and tire wear particulates.',
      monitorCorrelation: 0.88 - (hash % 4) * 0.01,
      neuralActivation: 'Spatial Convolution 2',
      color: '#fb923c', // orange-400
      icon: Wind
    },
    {
      id: 'biomass',
      source: 'Biomass & Crop Burning',
      shapValue: biomassSHAP,
      confidence: 94.1 - (hash % 5) * 0.3,
      deviation: 1.8 + (hash % 5) * 0.4,
      sampleCount: 1850 + (hash % 80) * 5,
      category: 'Agricultural & Organic',
      desc: 'Soot and heavy carbon loads from post-harvest crop stubble clearance.',
      monitorCorrelation: 0.95 - (hash % 3) * 0.01,
      neuralActivation: 'Temporal Gated Re-routing',
      color: '#eab308', // yellow-500
      icon: Flame
    },
    {
      id: 'industrial',
      source: 'Industrial Stack Emissions',
      shapValue: industrialSHAP,
      confidence: 97.2 - (hash % 2) * 0.2,
      deviation: 0.8 + (hash % 3) * 0.1,
      sampleCount: 2200 + (hash % 100) * 12,
      category: 'Point-Source Combustion',
      desc: 'Sulfates, black carbon, and chemical fly-ash from thermal stacks and factories.',
      monitorCorrelation: 0.97 - (hash % 2) * 0.01,
      neuralActivation: 'Dense Output Recurrence',
      color: '#c084fc', // purple-400
      icon: Factory
    },
    {
      id: 'construction',
      source: 'Construction Silt & Concrete',
      shapValue: constructionSHAP,
      confidence: 89.5 - (hash % 4) * 0.6,
      deviation: 3.2 + (hash % 6) * 0.4,
      sampleCount: 640 + (hash % 40) * 8,
      category: 'Fugitive Dust',
      desc: 'Silica, lime, and mineral PM10 from construction mixing and excavation sites.',
      monitorCorrelation: 0.85 - (hash % 6) * 0.01,
      neuralActivation: 'Spatial Edge Detector 3',
      color: '#a1a1aa', // zinc-400
      icon: Scale
    },
    {
      id: 'waste',
      source: 'Municipal Waste Burning',
      shapValue: wasteBurningSHAP,
      confidence: 87.2 - (hash % 6) * 0.5,
      deviation: 4.1 + (hash % 5) * 0.5,
      sampleCount: 420 + (hash % 20) * 6,
      category: 'Anthropogenic Emissions',
      desc: 'Uncontrolled open-air combustion of plastics and landfills, yielding highly toxic soot.',
      monitorCorrelation: 0.82 - (hash % 5) * 0.02,
      neuralActivation: 'Localized Hotspot Filter',
      color: '#ca8a04', // dark-yellow-600
      icon: Flame
    },
    {
      id: 'wind-dispersion',
      source: 'Atmospheric Advection',
      shapValue: windScavenging,
      confidence: 95.5 - (hash % 3) * 0.3,
      deviation: 1.5 + (hash % 4) * 0.2,
      sampleCount: 3100,
      category: 'Meteorological Scavenging',
      desc: 'Horizontal dispersion of pollutants due to active ventilation rates and wind shear.',
      monitorCorrelation: 0.96 - (hash % 3) * 0.01,
      neuralActivation: 'Meteorological Vector Map',
      color: '#22d3ee', // cyan-400
      icon: Wind
    },
    {
      id: 'wet-deposition',
      source: 'Wet Scavenging (Precip)',
      shapValue: wetDeposition,
      confidence: 93.2 - (hash % 4) * 0.4,
      deviation: 2.2 + (hash % 5) * 0.3,
      sampleCount: 1500,
      category: 'Meteorological Scavenging',
      desc: 'Aerosol rainout and washout which strips particulate matter from the column.',
      monitorCorrelation: 0.91 - (hash % 4) * 0.01,
      neuralActivation: 'Sinks & Deposition Array',
      color: '#3b82f6', // blue-500
      icon: Thermometer
    },
    {
      id: 'canopy-absorption',
      source: 'Green Canopy Deposition',
      shapValue: greenCanopy,
      confidence: 91.8 - (hash % 3) * 0.5,
      deviation: 2.8 + (hash % 4) * 0.4,
      sampleCount: 1200,
      category: 'Environmental Deposition',
      desc: 'Dry deposition on forest leaves and urban canopies trapping coarse and fine dust.',
      monitorCorrelation: 0.89 - (hash % 5) * 0.01,
      neuralActivation: 'Foliar Capture Layer',
      color: '#10b981', // emerald-500
      icon: CheckCircle2
    }
  ];

  return {
    baseAQI,
    totalSHAP,
    sources,
    metrics: {
      globalFidelity: 95.8 + (hash % 30) * 0.1,
      trainingEpochs: 450 + (hash % 10) * 20,
      gnnConfidence: 93.4 + (hash % 50) * 0.1,
      shapVariance: 3.4 + (hash % 20) * 0.1
    }
  };
};

const ExplainableAIPanel: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState("New Delhi");
  const [selectedSourceId, setSelectedSourceId] = useState<string>("vehicular");
  const [showCityList, setShowCityList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSimulatingGNN, setIsSimulatingGNN] = useState(false);
  const [gnnLogs, setGnnLogs] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const attributionData = useMemo(() => generateSHAPAttribution(selectedCity), [selectedCity]);

  const selectedSource = useMemo(() => {
    return attributionData.sources.find(s => s.id === selectedSourceId) || attributionData.sources[0];
  }, [attributionData, selectedSourceId]);

  const filteredCities = CITIES.filter(city => 
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const triggerGNNReconstruction = () => {
    setIsSimulatingGNN(true);
    setGnnLogs([]);
    const logs = [
      `Initializing Graph Neural Network (GNN) Backpropagation...`,
      `Mapping spatial node connections for ${selectedCity} monitoring grid...`,
      `Running SHAP kernel over ${selectedSource.sampleCount} ground-truth records...`,
      `Interpreting edge weights on Foliar & Boundary layers...`,
      `SHAP Attribution Converged! Local fidelity: ${attributionData.metrics.globalFidelity.toFixed(2)}%`
    ];

    logs.forEach((log, idx) => {
      setTimeout(() => {
        setGnnLogs(prev => [...prev, log]);
        if (idx === logs.length - 1) {
          setIsSimulatingGNN(false);
        }
      }, (idx + 1) * 700);
    });
  };

  useEffect(() => {
    triggerGNNReconstruction();
  }, [selectedCity, selectedSourceId]);

  // SHAP Chart Data formatting
  const chartData = useMemo(() => {
    return attributionData.sources.map(s => ({
      source: s.source,
      value: s.shapValue,
      color: s.color,
      displayVal: s.shapValue > 0 ? `+${s.shapValue}` : `${s.shapValue}`
    })).sort((a, b) => b.value - a.value); // Order from positive to negative forces
  }, [attributionData]);

  // Model Confidence Curve data (simulated normal distribution)
  const confidenceCurve = useMemo(() => {
    const mean = selectedSource.shapValue;
    const stdDev = selectedSource.deviation;
    const points = [];
    for (let x = mean - 4 * stdDev; x <= mean + 4 * stdDev; x += stdDev / 3) {
      const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
      points.push({
        x: Math.round(x * 10) / 10,
        density: y * 100
      });
    }
    return points;
  }, [selectedSource]);

  return (
    <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-700 pb-20">
      {/* Simulation Status Bar */}
      <div className="flex items-center justify-between glass p-4 rounded-3xl border border-white/5 bg-slate-900/40 shadow-inner">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Explainable AI Core</span>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">SHAP Model Coherence Localized</span>
          </div>
        </div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
          SHapley Additive exPlanations Framework v2.8
        </div>
      </div>

      {/* Title & Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-8">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter mb-2">Explainable Source Attribution</h2>
          <p className="text-slate-500 text-lg font-medium">Deconstructing GNN model predictions using rigorous SHAP game-theoretic force attribution.</p>
        </div>

        {/* City Dropdown Selector */}
        <div className="relative">
          <button 
            onClick={() => setShowCityList(!showCityList)}
            className="flex items-center gap-3 px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-cyan-400 transition-all group shadow-lg"
          >
            <MapPin className="w-5 h-5 text-cyan-400" />
            <span className="text-white font-black">{selectedCity}</span>
            <ChevronRight className={`w-5 h-5 text-slate-500 transition-transform ${showCityList ? 'rotate-90' : ''}`} />
          </button>

          <AnimatePresence>
            {showCityList && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-72 max-h-96 bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
              >
                <div className="p-4 border-b border-slate-800">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Search cities..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 max-h-60">
                  {filteredCities.map(city => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setShowCityList(false);
                        setSearchQuery("");
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors ${
                        selectedCity === city 
                          ? 'bg-cyan-400/10 text-cyan-400 font-bold' 
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: PRIMARY ATTRIBUTION FORCE BAR CHART */}
        <div className="xl:col-span-7 space-y-8">
          
          {/* THE SHAP FORCE PLOT */}
          <div className="glass p-8 rounded-[40px] border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PieChartIcon className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">SHAP Impact Force Plot</h3>
              </div>
              <div className="text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
                Baseline AQI Value: <span className="text-white font-bold">{attributionData.baseAQI}</span>
              </div>
            </div>

            {/* Explanatory Banner */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/60 flex items-start gap-3">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Positive SHAP values represent emissions forcing the atmospheric pollutant load higher (pushing right, in warm tones). Negative SHAP values denote scavenging and meteorological dilution (pushing left, in cool tones).
              </p>
            </div>

            {/* Horizontal Bar Chart */}
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#475569" fontSize={10} fontStyle="italic" />
                  <YAxis 
                    dataKey="source" 
                    type="category" 
                    stroke="#475569" 
                    fontSize={10} 
                    width={150}
                    tickFormatter={(value) => value.length > 22 ? `${value.substring(0, 20)}...` : value}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-2xl">
                            <p className="text-xs font-black text-white uppercase tracking-widest">{data.source}</p>
                            <p className="text-lg font-black mt-1" style={{ color: data.color }}>
                              {data.value > 0 ? `+${data.value}` : data.value} AQI Force Units
                            </p>
                            <span className="text-[9px] font-mono text-slate-500 uppercase block mt-1">SHAP Game-Theoretic Coeff</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine x={0} stroke="#475569" strokeWidth={1.5} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Total Atmospheric Result */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-900/50 rounded-3xl border border-slate-800 gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Calculated Model Forecast</div>
                <div className="text-3xl font-black text-white">
                  AQI <span className="text-cyan-400">{attributionData.baseAQI + attributionData.totalSHAP}</span>
                </div>
              </div>
              <div className="text-center sm:text-right text-xs font-mono text-slate-400 leading-relaxed max-w-sm">
                Equation: <span className="text-white">Base ({attributionData.baseAQI})</span> + <span className={attributionData.totalSHAP >= 0 ? 'text-rose-400' : 'text-emerald-400'}>Σ SHAP ({attributionData.totalSHAP >= 0 ? `+${attributionData.totalSHAP}` : attributionData.totalSHAP})</span> = Forecasted AQI.
              </div>
            </div>
          </div>

          {/* ATTRIBUTION CORE MATRIX: INTERACTIVE SELECTOR */}
          <div className="glass p-8 rounded-[40px] border border-slate-800 space-y-6">
            <div className="flex items-center gap-3">
              <Binary className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Neural Fingerprints</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {attributionData.sources.map((source) => {
                const IconComponent = source.icon;
                const isSelected = source.id === selectedSourceId;
                return (
                  <button
                    key={source.id}
                    onClick={() => setSelectedSourceId(source.id)}
                    className={`p-5 rounded-3xl border text-left transition-all flex items-start gap-4 cursor-pointer relative overflow-hidden group ${
                      isSelected 
                        ? 'bg-slate-900 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.1)]' 
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div 
                      className="p-3.5 rounded-2xl border flex items-center justify-center shrink-0" 
                      style={{ 
                        color: source.color, 
                        borderColor: isSelected ? `${source.color}40` : 'rgba(255,255,255,0.05)',
                        backgroundColor: `${source.color}05`
                      }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 relative z-10 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{source.category}</span>
                        <span className={`text-xs font-mono font-black ${source.shapValue >= 0 ? 'text-rose-400' : 'text-cyan-400'}`}>
                          {source.shapValue >= 0 ? `+${source.shapValue}` : source.shapValue}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-white">{source.source}</h4>
                      <p className="text-slate-400 text-xs line-clamp-1 group-hover:line-clamp-none transition-all leading-relaxed">
                        {source.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SOURCE ATTRIBUTION INTERACTIVE ENGINE DIAGNOSTICS */}
        <div className="xl:col-span-5 space-y-8">
          
          {/* THE SELECTED SOURCE DETAILED ATTRIBUTION CONFIDENCE INTERNALS */}
          <div className="glass p-8 rounded-[40px] border border-cyan-400/20 bg-cyan-400/5 relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <BrainCircuit size={160} className="text-cyan-400" />
            </div>
            
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400 animate-pulse" />
              <h3 className="text-xs font-black text-cyan-400 uppercase tracking-[0.4em]">Engine Diagnostics</h3>
            </div>

            <div className="space-y-3 relative z-10">
              <span className="text-[10px] font-black text-cyan-400/60 uppercase tracking-widest">{selectedSource.category}</span>
              <h4 className="text-3xl font-black text-white tracking-tight leading-none">{selectedSource.source}</h4>
              <p className="text-slate-400 text-sm leading-relaxed mt-2">{selectedSource.desc}</p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-cyan-400/10">
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">SHAP Force Weight</span>
                <span className={`text-2xl font-black font-mono ${selectedSource.shapValue >= 0 ? 'text-rose-400' : 'text-cyan-400'}`}>
                  {selectedSource.shapValue >= 0 ? `+${selectedSource.shapValue}` : selectedSource.shapValue} AQI
                </span>
              </div>
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">SHAP Confidence</span>
                <span className="text-2xl font-black text-white font-mono">
                  {selectedSource.confidence.toFixed(1)}% <span className="text-[10px] text-slate-500 font-normal">± {selectedSource.deviation.toFixed(1)}%</span>
                </span>
              </div>
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Receptive Field Sensor</span>
                <span className="text-xs font-black text-white">{selectedSource.neuralActivation}</span>
              </div>
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Telemetry Inputs</span>
                <span className="text-xs font-black text-white font-mono">{selectedSource.sampleCount.toLocaleString()} Stations</span>
              </div>
            </div>

            {/* Model Confidence Curve (Bell Curve Recharts AreaChart) */}
            <div className="space-y-4 pt-4 border-t border-cyan-400/10">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attribution Confidence Distribution</label>
                <span className="text-[10px] font-mono text-cyan-400">SHAP Probability Density</span>
              </div>
              
              <div className="h-28 w-full bg-slate-950/40 rounded-2xl p-2 border border-slate-900">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={confidenceCurve} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="confidenceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={selectedSource.color} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={selectedSource.color} stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-[9px] font-mono text-slate-400">
                              Forced Impact: <span className="text-white font-bold">{payload[0].payload.x} AQI</span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="density" 
                      stroke={selectedSource.color} 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#confidenceGrad)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[9.5px] text-slate-400 text-center italic">
                Attribution probability peak centered exactly at <span className="text-white font-bold">{selectedSource.shapValue} AQI</span> with standard deviation σ = {selectedSource.deviation.toFixed(1)}.
              </p>
            </div>
          </div>

          {/* GNN MODEL BACKPROPAGATION NETWORK WORKFLOW */}
          <div className="glass p-8 rounded-[40px] border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Network className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Neural Receptive Field</h3>
              </div>
              <button 
                onClick={triggerGNNReconstruction}
                disabled={isSimulatingGNN}
                className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 rounded-xl font-bold text-[10px] hover:bg-cyan-400 hover:text-slate-950 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSimulatingGNN ? 'Recalculating...' : 'Force Recalculation'}
              </button>
            </div>

            {/* Graph Node Network Interactive Mock */}
            <div className="relative h-44 bg-slate-950 rounded-3xl border border-slate-900/60 overflow-hidden flex items-center justify-center">
              
              {/* Outer circle connections */}
              <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                <div className="w-36 h-36 border border-dashed border-cyan-400 rounded-full animate-spin-slow"></div>
                <div className="w-24 h-24 border border-dashed border-purple-500 rounded-full animate-reverse-spin"></div>
              </div>

              {/* Simulated Nodes */}
              <div className="relative w-full h-full flex items-center justify-center">
                
                {/* Center Node */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.05, 1],
                    boxShadow: [`0 0 10px ${selectedSource.color}20`, `0 0 25px ${selectedSource.color}50`, `0 0 10px ${selectedSource.color}20`]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-16 h-16 rounded-full bg-slate-900 border flex flex-col items-center justify-center text-center z-20 cursor-pointer"
                  style={{ borderColor: selectedSource.color }}
                >
                  <Cpu className="w-6 h-6" style={{ color: selectedSource.color }} />
                  <span className="text-[7px] font-black text-slate-500 uppercase mt-1">GNN Target</span>
                </motion.div>

                {/* Satellite Nodes (GNN sensors backpropagating weights) */}
                {[...Array(5)].map((_, idx) => {
                  const angle = (idx * (360 / 5)) * (Math.PI / 180);
                  const radius = 60;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  return (
                    <motion.div
                      key={idx}
                      style={{ x, y, position: 'absolute' }}
                      animate={{
                        borderColor: isSimulatingGNN ? ['rgba(255,255,255,0.1)', selectedSource.color, 'rgba(255,255,255,0.1)'] : 'rgba(255,255,255,0.1)',
                        scale: isSimulatingGNN ? [1, 1.2, 1] : 1
                      }}
                      transition={{ delay: idx * 0.15, duration: 1 }}
                      className="w-8 h-8 rounded-xl bg-slate-900 border flex items-center justify-center z-10 cursor-pointer"
                    >
                      <span className="text-[8px] font-mono text-slate-500">S-{idx+1}</span>
                    </motion.div>
                  );
                })}

                {/* Connecting lines SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {[...Array(5)].map((_, idx) => {
                    const angle = (idx * (360 / 5)) * (Math.PI / 180);
                    const radius = 60;
                    const x1 = 150 + Math.cos(angle) * radius;
                    const y1 = 88 + Math.sin(angle) * radius;
                    return (
                      <motion.line
                        key={idx}
                        x1={150}
                        y1={88}
                        x2={x1}
                        y2={y1}
                        stroke={isSimulatingGNN ? selectedSource.color : 'rgba(255,255,255,0.06)'}
                        strokeWidth={isSimulatingGNN ? 1.5 : 0.8}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1 }}
                      />
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* GNN Log Outputs */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 text-left font-mono text-[9px] text-slate-400 space-y-2 h-32 overflow-y-auto">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2 text-slate-500 font-bold uppercase tracking-widest">
                <Binary className="w-3.5 h-3.5" /> GNN Attribution Terminal Trace
              </div>
              {gnnLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 animate-in fade-in slide-in-from-left-2">
                  <span className="text-cyan-400 font-bold">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
              {isSimulatingGNN && (
                <div className="text-cyan-400 font-bold animate-pulse">&gt; ANALYZING ADJACENCY MATRIX SPATIAL OVERLAYS...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplainableAIPanel;
