
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
  TrendingDown
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { optimizePolicyQAOA, predictPollutionHybrid, HybridPredictionResult } from '../src/services/quantumAIService';

interface Factor {
  id: string;
  label: string;
  icon: React.ElementType;
  value: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
  color: string;
  weight: number;
}

interface CityData {
  prediction: string;
  trend: 'increase' | 'decrease' | 'stable';
  percentage: string;
  factors: Factor[];
  confidence: string;
  confidenceValue: number;
  latency: string;
  latencyValue: number;
}

const CITIES = [
  "New Delhi", "Gurgaon", "Patna", "California", "Paris", "Tokyo", "Faridabad", "Seoul", "Lucknow", "Dehradun", 
  "Indore", "Noida", "Jalandhar", "Ghaziabad", "Hisar", "Shimla", "Vijayawada", "Nagpur", "Mumbai", "Seattle", 
  "Oslo", "Chandigarh", "Zurich", "Denmark", "Stockholm", "Adelaide", "Wellington", "Malaysia", "Beijing", 
  "Hong Kong", "Bishkek", "Incheon", "Guwahati", "Siliguri", "Bangalore", "Mysore", "Ooty", "Diu", "Jammu", 
  "Rohtang", "Bhiwadi", "Jaunpur", "Auckland", "Singapore", "New York", "Amsterdam", "Dubai", "Karimnagar", 
  "Lahore", "Kathmandu", "Moscow"
];

const generateCityData = (city: string): CityData => {
  const hash = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const isIncrease = hash % 2 === 0;
  
  const windWeight = (hash % 30) + 10;
  const trafficWeight = (hash % 40) + 20;
  const tempWeight = 100 - windWeight - trafficWeight;

  return {
    prediction: isIncrease ? "increase" : "decrease",
    trend: isIncrease ? 'increase' : 'decrease',
    percentage: `${(hash % 25) + 5}%`,
    confidence: `${90 + (hash % 9)}.${hash % 10}%`,
    confidenceValue: 90 + (hash % 9) + (hash % 10) / 10,
    latency: `${10 + (hash % 15)}.${hash % 10}ms`,
    latencyValue: 10 + (hash % 15) + (hash % 10) / 10,
    factors: [
      {
        id: 'wind',
        label: 'Wind Speed',
        icon: Wind,
        value: `${(hash % 5) + 1}.${hash % 10} km/h`,
        impact: (hash % 3 === 0) ? 'high' : (hash % 3 === 1 ? 'medium' : 'low'),
        description: 'Atmospheric flow rates directly influence the dispersion of particulate matter.',
        color: '#22d3ee', // cyan-400
        weight: windWeight
      },
      {
        id: 'traffic',
        label: 'Traffic Density',
        icon: Car,
        value: `${60 + (hash % 35)}%`,
        impact: (hash % 2 === 0) ? 'high' : 'medium',
        description: 'Urban mobility patterns contribute significantly to localized NO2 concentrations.',
        color: '#a855f7', // purple-400
        weight: trafficWeight
      },
      {
        id: 'temp',
        label: 'Temp Inversion',
        icon: Thermometer,
        value: (hash % 4 === 0) ? 'Critical' : (hash % 4 === 1 ? 'Moderate' : 'Stable'),
        impact: (hash % 4 === 0) ? 'high' : 'medium',
        description: 'Thermal layering can trap pollutants near the surface, preventing vertical mixing.',
        color: '#fb923c', // orange-400
        weight: tempWeight
      }
    ]
  };
};

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm font-black uppercase tracking-widest">
        {payload.label}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#94a3b8" className="text-[10px] font-bold">
        {`Weight: ${value}%`}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill={fill} className="text-[10px] font-black">
        {`Impact: ${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  );
};

const ExplainableAIPanel: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState("New Delhi");
  const [hoveredFactor, setHoveredFactor] = useState<string | null>(null);
  const [showCityList, setShowCityList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantumPolicy, setQuantumPolicy] = useState<any>(null);
  const [hybridData, setHybridData] = useState<HybridPredictionResult | null>(null);

  const cityData = useMemo(() => generateCityData(selectedCity), [selectedCity]);

  useEffect(() => {
    // Simulate quantum policy optimization for the selected city
    const policy = optimizePolicyQAOA(selectedCity);
    setQuantumPolicy(policy);
    
    // Simulate hybrid prediction for explainability
    const hybrid = predictPollutionHybrid(selectedCity);
    setHybridData(hybrid);
  }, [selectedCity]);

  const filteredCities = CITIES.filter(city => 
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pieData = useMemo(() => {
    return [
      ...cityData.factors.map(f => ({
        name: f.id,
        label: f.label,
        value: f.weight,
        fill: f.color
      })),
      { name: 'confidence', label: 'Confidence', value: cityData.confidenceValue / 10, fill: '#10b981' }
    ];
  }, [cityData]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
    const factorId = pieData[index].name;
    if (factorId !== 'confidence') {
      setHoveredFactor(factorId);
    } else {
      setHoveredFactor(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-700">
      {/* Simulation Status Bar */}
      <div className="flex items-center justify-between glass p-3 rounded-xl border border-white/5 bg-slate-900/40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Simulation Mode</span>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Neural Explainer Active</span>
          </div>
        </div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
          Deterministic Neural Attribution Simulation
        </div>
      </div>

      <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter mb-2">Explainable AI Panel</h2>
          <p className="text-slate-500 text-lg font-medium">Decoding neural predictions for atmospheric transparency.</p>
        </div>

        {/* City Selector */}
        <div className="relative">
          <button 
            onClick={() => setShowCityList(!showCityList)}
            className="flex items-center gap-3 px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-cyan-400 transition-all group"
          >
            <MapPin className="w-5 h-5 text-cyan-400" />
            <span className="text-white font-bold">{selectedCity}</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Prediction & Factors */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            key={selectedCity}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-[40px] border border-slate-800 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <BrainCircuit size={120} className="text-cyan-400" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-400/10 rounded-xl border border-cyan-400/20">
                    <Activity className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">Prediction Engine v4.2</span>
                </div>
              </div>

              <h3 className="text-3xl font-black text-white leading-tight">
                Tomorrow’s AQI is predicted to <span className={cityData.trend === 'increase' ? 'text-rose-500' : 'text-emerald-400'}>{cityData.prediction}</span> by <span className={cityData.trend === 'increase' ? 'text-rose-500' : 'text-emerald-400'}>{cityData.percentage}</span>
              </h3>

              <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-800 space-y-4">
                <p className="text-slate-400 text-sm leading-relaxed">
                  Our Neural GNN has identified the primary environmental drivers for this {cityData.prediction} in <span className="text-white font-bold">{selectedCity}</span>.
                </p>
                <div className={`flex items-center gap-2 font-bold text-sm ${cityData.trend === 'increase' ? 'text-rose-500' : 'text-emerald-400'}`}>
                  <Zap className="w-4 h-4" />
                  {cityData.trend === 'increase' ? 'Critical Alert: High PM2.5 Exposure Risk' : 'Advisory: Improved Atmospheric Conditions'}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="space-y-4">
            {cityData.factors.map((factor) => (
              <motion.div
                key={factor.id}
                onMouseEnter={() => setHoveredFactor(factor.id)}
                onMouseLeave={() => setHoveredFactor(null)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer ${
                  hoveredFactor === factor.id 
                    ? 'bg-slate-800/50 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.1)]' 
                    : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800" style={{ color: factor.color }}>
                      <factor.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{factor.label}</h4>
                      <p className="text-xs text-slate-500 font-mono">{factor.value}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    factor.impact === 'high' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 
                    factor.impact === 'medium' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                    'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  }`}>
                    {factor.impact} Impact
                  </div>
                </div>
                
                <AnimatePresence>
                  {hoveredFactor === factor.id && (
                    <motion.p 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="text-xs text-slate-400 mt-4 leading-relaxed overflow-hidden"
                    >
                      {factor.description}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {/* Quantum Policy Optimization Card */}
            {quantumPolicy && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-6 rounded-3xl border border-purple-500/20 bg-purple-500/5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="w-5 h-5 text-purple-400" />
                  <h4 className="text-xs font-black text-purple-400 uppercase tracking-widest">Quantum Policy QAOA</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 uppercase font-black">Optimal Carbon Tax</span>
                    <span className="text-sm font-mono text-white">${quantumPolicy.optimalCarbonTax}/ton</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 uppercase font-black">Expected AQI Reduction</span>
                    <span className="text-sm font-mono text-emerald-400">-{quantumPolicy.expectedAQIReduction} pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 uppercase font-black">Solution Fidelity</span>
                    <span className="text-sm font-mono text-cyan-400">{(quantumPolicy.fidelity * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Center Column: Interactive Diagram & Simulations */}
        <div className="lg:col-span-5">
          <div className="glass h-full rounded-[40px] border border-slate-800 p-8 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-purple-500/5 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Network className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Neural Logic Flow</h3>
                </div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                  <Activity className="w-4 h-4 animate-pulse" />
                  Live Simulation
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center relative min-h-[400px]">
                {/* Center Node: Pollution Outcome */}
                <motion.div 
                  animate={{ 
                    scale: hoveredFactor ? 1.05 : 1,
                    boxShadow: hoveredFactor ? (cityData.trend === 'increase' ? '0 0 40px rgba(244, 63, 94, 0.2)' : '0 0 40px rgba(16, 185, 129, 0.2)') : '0 0 20px rgba(255, 255, 255, 0.05)'
                  }}
                  className={`w-40 h-40 rounded-full border-2 bg-slate-950 flex flex-col items-center justify-center text-center p-6 z-20 transition-colors ${
                    cityData.trend === 'increase' ? 'border-rose-500/30' : 'border-emerald-500/30'
                  }`}
                >
                  <div className={`font-black text-3xl tracking-tighter mb-1 ${cityData.trend === 'increase' ? 'text-rose-500' : 'text-emerald-400'}`}>
                    AQI {cityData.trend === 'increase' ? '↑' : '↓'}
                  </div>
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Outcome</div>
                </motion.div>

                {/* Factor Nodes */}
                {cityData.factors.map((factor, i) => {
                  const angle = (i * (360 / cityData.factors.length)) - 90;
                  const radius = 160;
                  const x = Math.cos(angle * (Math.PI / 180)) * radius;
                  const y = Math.sin(angle * (Math.PI / 180)) * radius;

                  const isActive = hoveredFactor === factor.id;

                  return (
                    <React.Fragment key={factor.id}>
                      {/* Connection Line */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10">
                        <motion.path
                          d={`M ${200 + x} ${200 + y} L ${200} ${200}`}
                          stroke={isActive ? factor.color : 'rgba(255,255,255,0.05)'}
                          strokeWidth={isActive ? 3 : 1}
                          fill="none"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                        />
                        {isActive && (
                          <motion.circle
                            r="4"
                            fill={factor.color}
                            animate={{ 
                              offsetDistance: ["0%", "100%"],
                            }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            style={{ offsetPath: `path('M ${200 + x} ${200 + y} L ${200} ${200}')` }}
                          />
                        )}
                      </svg>

                      {/* Node */}
                      <motion.div
                        style={{ 
                          x, y,
                          position: 'absolute'
                        }}
                        onMouseEnter={() => setHoveredFactor(factor.id)}
                        onMouseLeave={() => setHoveredFactor(null)}
                        animate={{ 
                          scale: isActive ? 1.2 : 1,
                          borderColor: isActive ? factor.color : 'rgba(255,255,255,0.1)',
                          boxShadow: isActive ? `0 0 20px ${factor.color}40` : 'none'
                        }}
                        className="w-16 h-16 rounded-2xl bg-slate-900 border flex items-center justify-center z-20 transition-all cursor-pointer"
                      >
                        <factor.icon className="w-6 h-6" style={{ color: isActive ? factor.color : '#64748b' }} />
                      </motion.div>
                    </React.Fragment>
                  );
                })}

                {/* Neural Particles Simulation */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ 
                        x: 200 + (Math.random() - 0.5) * 400, 
                        y: 200 + (Math.random() - 0.5) * 400,
                        opacity: 0 
                      }}
                      animate={{ 
                        x: 200, 
                        y: 200,
                        opacity: [0, 0.5, 0]
                      }}
                      transition={{ 
                        duration: 2 + Math.random() * 3, 
                        repeat: Infinity, 
                        delay: Math.random() * 5,
                        ease: "linear"
                      }}
                      className="absolute w-1 h-1 rounded-full bg-cyan-400"
                    />
                  ))}
                </div>

                {/* Background Grid */}
                <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
                  <div className="w-full h-full border border-slate-800 rounded-full scale-150" />
                  <div className="w-full h-full border border-slate-800 rounded-full scale-110" />
                  <div className="w-full h-full border border-slate-800 rounded-full scale-75" />
                </div>
              </div>

              <div className="mt-auto grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/50">
                <div className="text-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <div className="text-xl font-black text-white">{cityData.confidence}</div>
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Confidence</div>
                </div>
                <div className="text-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <div className="text-xl font-black text-white">{cityData.latency}</div>
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Latency</div>
                </div>
                <div className="text-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <div className="text-xl font-black text-white">SHAP</div>
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Method</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hybrid Model Architecture Section */}
          <div className="glass rounded-[40px] border border-slate-800 p-8 mt-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Hybrid Model Architecture</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-4 relative">
              <div className="flex flex-col items-center gap-2">
                <div className="w-full p-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Classical</span>
                  <div className="text-xs font-bold text-white mt-1">LSTM / RF</div>
                </div>
                <div className="h-8 w-0.5 bg-slate-800"></div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-full p-4 bg-cyan-400/10 rounded-2xl border border-cyan-400/30 text-center">
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Quantum</span>
                  <div className="text-xs font-bold text-white mt-1">Feature Map</div>
                </div>
                <div className="h-8 w-0.5 bg-cyan-400/30"></div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-full p-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Classical</span>
                  <div className="text-xs font-bold text-white mt-1">Dense Layer</div>
                </div>
                <div className="h-8 w-0.5 bg-slate-800"></div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Hybrid Prediction Output</span>
              <div className="text-lg font-black text-white mt-1">AQI Forecast</div>
            </div>
            
            <div className="mt-6 p-4 bg-cyan-400/5 rounded-2xl border border-cyan-400/10">
              <p className="text-[10px] text-slate-400 leading-relaxed">
                The <span className="text-cyan-400 font-bold">Quantum Feature Map</span> projects input data into a high-dimensional Hilbert space, allowing the model to resolve complex non-linear correlations that classical LSTM layers might miss.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Pie Chart & Impact Metrics */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass p-8 rounded-[40px] border border-slate-800 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <PieChartIcon className="w-5 h-5 text-purple-400" />
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Impact Distribution</h3>
            </div>

            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-2xl">
                            <p className="text-xs font-black text-white uppercase tracking-widest">{payload[0].name}</p>
                            <p className="text-lg font-black" style={{ color: payload[0].payload.fill }}>{payload[0].value}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Load</span>
                </div>
                <span className="text-sm font-black text-white">{(cityData.latencyValue * 2.5).toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Impact Factor</span>
                </div>
                <span className="text-sm font-black text-white">{(cityData.confidenceValue / 10).toFixed(2)}x</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplainableAIPanel;


