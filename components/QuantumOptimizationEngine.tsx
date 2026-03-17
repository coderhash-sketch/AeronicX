
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Zap, 
  TrendingDown, 
  Scale, 
  Car, 
  Factory, 
  Leaf, 
  BarChart3, 
  Activity, 
  ChevronRight, 
  AlertTriangle,
  Info,
  Terminal,
  CheckCircle2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { optimizePollutionQAOA } from '../src/services/quantumAIService';

const QuantumOptimizationEngine: React.FC = () => {
  const [inputs, setInputs] = useState({
    traffic: 45,
    industry: 60,
    green: 30
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showTechSpec, setShowTechSpec] = useState(false);

  const handleOptimize = () => {
    setIsOptimizing(true);
    // Simulate quantum computation delay
    setTimeout(() => {
      const optimized = optimizePollutionQAOA(inputs);
      setResults(optimized);
      setIsOptimizing(false);
    }, 2000);
  };

  const comparisonData = useMemo(() => {
    if (!results) return [];
    return [
      { name: 'Classical Baseline', aqi: results.classicalBaseline, fill: '#64748b' },
      { name: 'Quantum Optimized', aqi: results.optimizedAQI, fill: '#22d3ee' }
    ];
  }, [results]);

  return (
    <div className="flex-1 flex flex-col gap-8 p-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-slate-800 pb-8">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter mb-2">Quantum Optimization Engine</h2>
          <p className="text-slate-500 text-lg font-medium">Solving complex pollution reduction landscapes using QAOA.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Simulation Mode</span>
          </div>
          <button 
            onClick={() => setShowTechSpec(!showTechSpec)}
            className="flex items-center gap-2 text-[10px] font-black text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest"
          >
            <Info className="w-3 h-3" />
            {showTechSpec ? 'Hide Spec' : 'View Spec'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showTechSpec && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass p-6 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest">Algorithm: QAOA</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    The <span className="text-white font-bold">Quantum Approximate Optimization Algorithm</span> is used to find the global minimum of the pollution cost function. It maps the constraints to a Hamiltonian and optimizes parameters $\beta$ and $\gamma$.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest">Cost Function</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    $C(x) = \sum w_i x_i + \text{'{'}Penalty{'}'}(\text{'{'}Economic Impact{'}'})$. The engine balances AQI reduction against the socio-economic cost of interventions.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest">Hardware Target</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Optimized for <span className="text-white font-bold">IBM Quantum Heron</span> processors. Simulation uses <span className="italic">Aer</span> simulator with noise models.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-8 rounded-[40px] border border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Scale size={120} className="text-cyan-400" />
            </div>
            
            <div className="relative z-10 space-y-8">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Scenario Parameters</h3>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                      <Car className="w-4 h-4 text-cyan-400" /> Traffic Reduction
                    </label>
                    <span className="text-sm font-mono text-white">{inputs.traffic}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={inputs.traffic}
                    onChange={(e) => setInputs({...inputs, traffic: parseInt(e.target.value)})}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                      <Factory className="w-4 h-4 text-magenta-400" /> Industrial Emissions
                    </label>
                    <span className="text-sm font-mono text-white">{inputs.industry}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={inputs.industry}
                    onChange={(e) => setInputs({...inputs, industry: parseInt(e.target.value)})}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-magenta-400"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                      <Leaf className="w-4 h-4 text-lime-400" /> Green Coverage
                    </label>
                    <span className="text-sm font-mono text-white">{inputs.green}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={inputs.green}
                    onChange={(e) => setInputs({...inputs, green: parseInt(e.target.value)})}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-lime-400"
                  />
                </div>
              </div>

              <button 
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="w-full py-4 bg-cyan-400 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-cyan-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Executing QAOA Circuit...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 group-hover:animate-pulse" />
                    <span>Run Quantum Optimization</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {results && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-[40px] border border-slate-800 space-y-6"
            >
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Policy Recommendations</h3>
              <div className="space-y-4">
                {results.recommendations.map((rec: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800 group hover:border-cyan-400/30 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{rec.label}</span>
                      <span className="text-sm font-bold text-white">{rec.desc}</span>
                    </div>
                    <span className="text-xl font-mono font-black text-cyan-400">{rec.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">
          {!results && !isOptimizing ? (
            <div className="h-full glass rounded-[40px] border border-slate-800 border-dashed flex flex-col items-center justify-center p-12 text-center">
              <div className="p-6 bg-slate-900 rounded-full mb-6">
                <Activity className="w-12 h-12 text-slate-700" />
              </div>
              <h3 className="text-2xl font-black text-slate-600 uppercase tracking-tighter">Awaiting Optimization</h3>
              <p className="text-slate-500 max-w-xs mt-2">Adjust parameters and run the quantum circuit to generate optimized pollution reduction strategies.</p>
            </div>
          ) : isOptimizing ? (
            <div className="h-full glass rounded-[40px] border border-slate-800 flex flex-col items-center justify-center p-12 relative overflow-hidden">
               <div className="absolute inset-0 bg-cyan-400/5 animate-pulse" />
               <div className="relative z-10 flex flex-col items-center">
                  <div className="w-32 h-32 relative mb-8">
                    <div className="absolute inset-0 border-4 border-cyan-400/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <Cpu className="absolute inset-0 m-auto w-12 h-12 text-cyan-400 animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tighter mb-2">Quantum Processing</h3>
                  <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Mapping Hamiltonian to 127-Qubit Lattice...</p>
                  
                  <div className="mt-12 w-full max-w-sm space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <span>Circuit Depth: 42</span>
                      <span>Fidelity: 0.982</span>
                    </div>
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, ease: "linear" }}
                        className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                      />
                    </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-1000">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-8 rounded-[40px] border-slate-800 bg-gradient-to-br from-slate-900/50 to-slate-950/50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <TrendingDown className="w-12 h-12 text-emerald-400" />
                  </div>
                  <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">AQI Reduction</div>
                  <div className="text-5xl font-black text-emerald-400 tracking-tighter">-{results.reductionPercentage}%</div>
                  <div className="text-[10px] font-bold text-slate-600 mt-2 italic">Optimized Target AQI: {results.optimizedAQI.toFixed(1)}</div>
                </div>

                <div className="glass p-8 rounded-[40px] border-slate-800 bg-gradient-to-br from-slate-900/50 to-slate-950/50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap className="w-12 h-12 text-cyan-400" />
                  </div>
                  <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Quantum Advantage</div>
                  <div className="text-5xl font-black text-cyan-400 tracking-tighter">+{results.quantumAdvantage}</div>
                  <div className="text-[10px] font-bold text-slate-600 mt-2 italic">Pts better than classical</div>
                </div>

                <div className="glass p-8 rounded-[40px] border-slate-800 bg-gradient-to-br from-slate-900/50 to-slate-950/50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CheckCircle2 className="w-12 h-12 text-lime-400" />
                  </div>
                  <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Solution Fidelity</div>
                  <div className="text-5xl font-black text-lime-400 tracking-tighter">{(results.fidelity * 100).toFixed(1)}%</div>
                  <div className="text-[10px] font-bold text-slate-600 mt-2 italic">Confidence in global minimum</div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-[40px] border border-slate-800">
                  <div className="flex items-center gap-3 mb-8">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Convergence Path</h3>
                  </div>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={results.convergencePath}>
                        <defs>
                          <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="iter" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                          itemStyle={{ color: '#22d3ee', fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="aqi" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorAqi)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass p-8 rounded-[40px] border border-slate-800">
                  <div className="flex items-center gap-3 mb-8">
                    <BarChart3 className="w-5 h-5 text-magenta-400" />
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Quantum vs Classical</h3>
                  </div>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                        />
                        <Bar dataKey="aqi" radius={[10, 10, 0, 0]}>
                          {comparisonData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Execution Logs */}
              <div className="glass p-6 rounded-3xl border border-slate-800 bg-black/40 font-mono text-[10px] space-y-2">
                <div className="flex items-center gap-2 text-slate-500 mb-2 border-b border-white/5 pb-1">
                  <Terminal className="w-3 h-3" />
                  <span className="uppercase tracking-widest font-black">Qiskit Execution Trace</span>
                </div>
                <div className="text-cyan-400/80"><span className="text-slate-600 mr-2">{">>>"}</span> qiskit.algorithms.QAOA(optimizer=SPSA, reps=3)</div>
                <div className="text-cyan-400/80"><span className="text-slate-600 mr-2">{">>>"}</span> Mapping cost_hamiltonian to 127-qubit topology...</div>
                <div className="text-cyan-400/80"><span className="text-slate-600 mr-2">{">>>"}</span> Optimization converged in 142 iterations.</div>
                <div className="text-lime-400/80"><span className="text-slate-600 mr-2">{">>>"}</span> Global minimum found with fidelity 0.982.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

export default QuantumOptimizationEngine;
