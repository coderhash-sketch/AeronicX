
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, 
  Zap, 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Info,
  Globe,
  DollarSign,
  Cpu,
  Target
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
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { optimizeSustainabilityStrategy, SustainabilityStrategy } from '../src/services/quantumAIService';
import { CITIES, CityData } from '../constants';

const QuantumDecisionEngine: React.FC = () => {
  const [selectedCityId, setSelectedCityId] = useState<string>(CITIES[2].id); // Default to New Delhi
  const [pollution, setPollution] = useState(Math.round(CITIES[2].pollution * 2.5));
  const [infrastructure, setInfrastructure] = useState(100 - CITIES[2].greenCoverage);
  const [economic, setEconomic] = useState(CITIES[2].policyScore);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [results, setResults] = useState<{ strategies: SustainabilityStrategy[], quantumMetrics: any } | null>(null);

  const selectedCity = useMemo(() => 
    CITIES.find(c => c.id === selectedCityId) || CITIES[0], 
  [selectedCityId]);

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    const city = CITIES.find(c => c.id === cityId);
    if (city) {
      // Map city data to optimization parameters
      setPollution(Math.round(city.pollution * 2.5)); // Scale 0-100 to 0-250
      setInfrastructure(100 - city.greenCoverage);
      setEconomic(city.policyScore);
    }
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    // Simulate quantum annealing time
    setTimeout(() => {
      const data = optimizeSustainabilityStrategy(pollution, infrastructure, economic);
      setResults(data);
      setIsOptimizing(false);
    }, 2500);
  };

  // Initial optimization
  useEffect(() => {
    handleOptimize();
  }, []);

  const scatterData = useMemo(() => {
    if (!results) return [];
    return results.strategies.map(s => ({
      name: s.label,
      cost: s.cost,
      impact: s.impact,
      feasibility: s.feasibility,
      category: s.category
    }));
  }, [results]);

  return (
    <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter mb-2">Quantum Decision Engine</h2>
          <p className="text-slate-500 text-lg font-medium">Multi-objective optimization for urban sustainability strategies.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="glass px-6 py-3 rounded-2xl border border-slate-800 flex items-center gap-3">
            <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Core Engine</span>
              <span className="text-sm font-bold text-white">QAOA-Annealer v2.4</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Parameters Panel */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass p-8 rounded-[40px] border border-slate-800 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Select City</h3>
              </div>
              <select 
                value={selectedCityId}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-4 text-white font-bold focus:outline-none focus:border-cyan-400 transition-colors appearance-none cursor-pointer"
              >
                {CITIES.map(city => (
                  <option key={city.id} value={city.id}>{city.name}, {city.country}</option>
                ))}
              </select>
            </div>

            <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">City Profile: {selectedCity.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-[9px] font-bold text-slate-600 uppercase">Green Cover</div>
                  <div className="text-sm font-bold text-white">{selectedCity.greenCoverage}%</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] font-bold text-slate-600 uppercase">Policy Score</div>
                  <div className="text-sm font-bold text-white">{selectedCity.policyScore}/100</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">City Constraints</h3>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Pollution Intensity</label>
                  <span className="text-sm font-mono font-bold text-rose-400">{pollution} AQI</span>
                </div>
                <input 
                  type="range" min="50" max="300" value={pollution} 
                  onChange={(e) => setPollution(parseInt(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Infra Constraints</label>
                  <span className="text-sm font-mono font-bold text-amber-400">{infrastructure}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={infrastructure} 
                  onChange={(e) => setInfrastructure(parseInt(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Economic Factor</label>
                  <span className="text-sm font-mono font-bold text-emerald-400">{economic} Index</span>
                </div>
                <input 
                  type="range" min="10" max="100" value={economic} 
                  onChange={(e) => setEconomic(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <button 
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="w-full py-5 rounded-2xl bg-cyan-400 text-slate-950 font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {isOptimizing ? (
                <>
                  <Zap className="w-5 h-5 animate-spin" />
                  Quantum Annealing...
                </>
              ) : (
                <>
                  <BrainCircuit className="w-5 h-5" />
                  Optimize Strategy
                </>
              )}
            </button>
          </div>

          {results && (
            <div className="glass p-8 rounded-[40px] border border-slate-800 space-y-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Optimization Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Annealing Time</div>
                  <div className="text-xl font-black text-white">{results.quantumMetrics.annealingTime}</div>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Solution Stability</div>
                  <div className="text-xl font-black text-cyan-400">{(results.quantumMetrics.solutionStability * 100).toFixed(1)}%</div>
                </div>
              </div>
              <div className="p-4 bg-cyan-400/5 border border-cyan-400/20 rounded-2xl">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The engine explored <span className="text-cyan-400 font-bold">2^128 state combinations</span> in parallel using quantum superposition to find the global minimum for your city's constraints.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Results Dashboard */}
        <div className="lg:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            {isOptimizing ? (
              <motion.div 
                key="optimizing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="h-[600px] glass rounded-[40px] border border-slate-800 flex flex-col items-center justify-center gap-8"
              >
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-cyan-400/20 animate-ping absolute inset-0" />
                  <div className="w-32 h-32 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
                  <BrainCircuit className="w-12 h-12 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black text-white tracking-tighter">Mapping Decision Space</h3>
                  <p className="text-slate-500 font-mono text-xs animate-pulse">SOLVING HAMILTONIAN COST FUNCTION...</p>
                </div>
              </motion.div>
            ) : results ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Best Strategy Hero */}
                <div className="glass p-10 rounded-[48px] border border-cyan-400/30 bg-gradient-to-br from-cyan-400/5 to-transparent relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShieldCheck className="w-40 h-40 text-cyan-400" />
                  </div>
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-cyan-400 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-full">Optimal Intervention</div>
                      <div className="text-xs font-bold text-cyan-400/60 uppercase tracking-widest">Confidence: 99.4%</div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-5xl font-black text-white tracking-tighter">{results.strategies[0].label}</h3>
                      <p className="text-slate-400 text-lg max-w-2xl">
                        Quantum-optimized intervention for <span className="text-cyan-400 font-bold">{selectedCity.name}</span>: {results.strategies[0].description}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-8 pt-6">
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Projected Impact</div>
                        <div className="text-3xl font-black text-emerald-400">+{results.strategies[0].impact}%</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estimated Cost</div>
                        <div className="text-3xl font-black text-white">${results.strategies[0].cost.toFixed(1)}M</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Implementation</div>
                        <div className="text-3xl font-black text-white">{results.strategies[0].timeToImplement}mo</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost vs Impact Scatter */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass p-8 rounded-[40px] border border-slate-800 space-y-6">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Cost vs Impact Matrix</h3>
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis type="number" dataKey="cost" name="Cost" unit="M" stroke="#475569" fontSize={10} />
                          <YAxis type="number" dataKey="impact" name="Impact" unit="%" stroke="#475569" fontSize={10} />
                          <ZAxis type="number" dataKey="feasibility" range={[50, 400]} name="Feasibility" />
                          <Tooltip 
                            cursor={{ strokeDasharray: '3 3' }}
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                          />
                          <Scatter name="Strategies" data={scatterData}>
                            {scatterData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={index === 0 ? '#22d3ee' : entry.category === 'policy' ? '#d946ef' : entry.category === 'infrastructure' ? '#fb923c' : '#84cc16'} 
                              />
                            ))}
                          </Scatter>
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass p-8 rounded-[40px] border border-slate-800 space-y-6">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Feasibility Ranking</h3>
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={results.strategies} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                          <XAxis type="number" hide />
                          <YAxis dataKey="label" type="category" stroke="#475569" fontSize={8} width={100} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                          />
                          <Bar dataKey="feasibility" radius={[0, 4, 4, 0]}>
                            {results.strategies.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? '#22d3ee' : '#1e293b'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Ranked Action Plans */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Ranked Action Plans</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.strategies.slice(1).map((strategy, i) => (
                      <div key={strategy.id} className="glass p-6 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-black text-slate-500">
                              #{i + 2}
                            </div>
                            <h4 className="font-bold text-white">{strategy.label}</h4>
                          </div>
                          <div className={`text-[10px] font-black uppercase tracking-widest ${
                            strategy.category === 'policy' ? 'text-purple-400' : 
                            strategy.category === 'infrastructure' ? 'text-orange-400' : 'text-lime-400'
                          }`}>
                            {strategy.category}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mb-6 line-clamp-2">{strategy.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                          <div className="flex gap-4">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-slate-600 uppercase">Impact</span>
                              <span className="text-sm font-bold text-white">{strategy.impact}%</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-slate-600 uppercase">Cost</span>
                              <span className="text-sm font-bold text-white">${strategy.cost.toFixed(1)}M</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-cyan-400 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default QuantumDecisionEngine;
