
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Rocket, 
  Activity, 
  CheckCircle2, 
  Factory, 
  Zap, 
  Cpu, 
  ShieldAlert,
  Loader2,
  X,
  ArrowUpRight
} from 'lucide-react';

const EconomicLens: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSensitivityResults, setShowSensitivityResults] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const cohortData = [
    { name: 'X1', feasibility: 88, cost: 12, market: 'Direct Air Capture', color: 'bg-cyan-400' },
    { name: 'X2', feasibility: 94, cost: 4, market: 'Industrial Flue', color: 'bg-orange-400' },
    { name: 'X3', feasibility: 72, cost: 18, market: 'H₂ Storage Hybrid', color: 'bg-lime-400' },
    { name: 'X4', feasibility: 65, cost: 24, market: 'Extreme Environments', color: 'bg-magenta-400' },
    { name: 'X5', feasibility: 91, cost: 7, market: 'Point Source Sequestration', color: 'bg-blue-400' },
  ];

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsAnalyzing(false);
            setShowSensitivityResults(true);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const SensitivityModal = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 backdrop-blur-md bg-slate-950/40">
      <div className="glass w-full max-w-4xl rounded-[3rem] border-slate-800 shadow-[0_0_100px_rgba(34,211,238,0.1)] overflow-hidden flex flex-col animate-in zoom-in duration-500">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <ShieldAlert className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">Sensitivity Heatmap (v4.0)</h3>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black">Monte Carlo Simulation: 50,000 Iterations Complete</p>
            </div>
          </div>
          <button 
            onClick={() => setShowSensitivityResults(false)}
            className="p-3 rounded-2xl hover:bg-white/10 transition-colors group"
          >
            <X className="w-6 h-6 text-slate-500 group-hover:text-white" />
          </button>
        </div>

        <div className="p-10 flex flex-col lg:flex-row gap-10 overflow-y-auto max-h-[70vh]">
          {/* Heatmap Grid */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Energy Price (USD/MWh) vs Carbon Tax</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase">High Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase">Optimal ROI</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {/* Header */}
              <div className="col-span-1"></div>
              {['$40', '$60', '$80', '$100'].map(tax => (
                <div key={tax} className="text-center text-[10px] font-black text-slate-500 uppercase pb-2">Tax: {tax}</div>
              ))}
              
              {/* Rows */}
              {['20', '40', '60', '80'].map((energy, i) => (
                <React.Fragment key={energy}>
                  <div className="flex items-center justify-end pr-3 text-[10px] font-black text-slate-500 uppercase font-mono">P: {energy}</div>
                  {[0, 1, 2, 3].map(j => {
                    const intensity = (i * j) / 9;
                    const isCyan = intensity < 0.3;
                    const isRose = intensity > 0.6;
                    return (
                      <div 
                        key={j} 
                        className={`h-16 rounded-xl border transition-all duration-500 flex items-center justify-center group relative cursor-crosshair ${
                          isCyan ? 'bg-cyan-400/20 border-cyan-400/30' : 
                          isRose ? 'bg-rose-500/20 border-rose-500/30' : 
                          'bg-slate-800/50 border-slate-700'
                        }`}
                      >
                        <span className={`text-xs font-mono font-bold ${isCyan ? 'text-cyan-400' : isRose ? 'text-rose-400' : 'text-slate-400'}`}>
                          {(12.5 - (i * 0.8) + (j * 1.2)).toFixed(1)}x
                        </span>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 rounded-xl flex items-center justify-center">
                          <ArrowUpRight className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            <p className="text-[10px] text-slate-600 font-medium italic mt-4">* Values represent projected ROI multiplier for QuantumMOF-X1 at commercial scale.</p>
          </div>

          {/* Key Insights Panel */}
          <div className="w-full lg:w-72 flex flex-col gap-6">
            <div className="bg-slate-900/50 rounded-3xl p-6 border border-slate-800">
               <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-4">Market Thresholds</h4>
               <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                     <span className="text-[8px] font-bold text-slate-500 uppercase">Break-even Point</span>
                     <span className="text-lg font-black text-white">$24.80 <span className="text-[10px] text-slate-500">/ ton CO₂</span></span>
                  </div>
                  <div className="flex flex-col gap-1 pt-2 border-t border-slate-800">
                     <span className="text-[8px] font-bold text-slate-500 uppercase">Venture IRR</span>
                     <span className="text-lg font-black text-lime-400">32.4% <span className="text-[10px] text-slate-500">Projected</span></span>
                  </div>
               </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 rounded-3xl p-6 border border-white/5 relative group">
               <Zap className="w-5 h-5 text-yellow-400 mb-3" />
               <p className="text-[11px] font-bold text-slate-300 leading-relaxed italic">
                 "Our analysis suggests X1 is resilient to energy price fluctuations up to 120% above 2024 baselines if carbon credits stay above $65/ton."
               </p>
               <div className="absolute bottom-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                  <Cpu className="w-16 h-16 text-white" />
               </div>
            </div>

            <button className="mt-auto w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-transform">
               Export ROI Data (.xlsx)
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-start py-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 bg-blue-400/10 rounded-2xl mb-2">
          <BarChart3 className="w-10 h-10 text-blue-400" />
        </div>
        <h2 className="text-5xl font-extrabold tracking-tighter neonic-text">Discovery Trend Analytics</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
          Calculating synthesis pathways and scaling feasibility for the discovered cohort.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Market Readiness Gauge */}
        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border-slate-800 relative overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-500 font-mono">Synthesis Cost vs. Feasibility Score</span>
            </div>
            <div className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-[10px] font-black text-cyan-400 uppercase tracking-tighter">
              Live Projection
            </div>
          </div>

          <div className="flex-1 relative min-h-[450px] flex items-end justify-between px-10 gap-4">
             {/* Grid background */}
             <div className="absolute inset-0 grid grid-rows-5 opacity-5 pointer-events-none">
                {[...Array(5)].map((_, i) => <div key={i} className="border-t border-white"></div>)}
             </div>

             {cohortData.map((item, i) => (
               <div key={item.name} className="flex-1 flex flex-col items-center group relative">
                  {/* Bubble for Feasibility */}
                  <div 
                    className={`absolute bottom-0 w-full rounded-2xl transition-all duration-1000 ${item.color} opacity-20 group-hover:opacity-40 shadow-[0_0_30px_rgba(255,255,255,0.1)]`}
                    style={{ height: `${item.feasibility}%`, animationDelay: `${i * 0.1}s` }}
                  ></div>
                  
                  {/* Synthesis Cost Indicator (Floating) */}
                  <div 
                    className="mb-4 bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-xl z-10 transition-transform group-hover:-translate-y-2"
                    style={{ bottom: `${item.feasibility}%` }}
                  >
                    <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Cost/kg</div>
                    <div className="text-xl font-black text-white">${item.cost}</div>
                  </div>

                  <div className="mt-4 text-2xl font-black uppercase tracking-widest text-white">{item.name}</div>
                  <div className="text-[10px] font-mono text-slate-400 font-bold text-center mt-1">{item.market}</div>
               </div>
             ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-800 flex justify-around">
             <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-600 font-black uppercase">Avg Feasibility</span>
                <span className="text-xl font-mono text-white">82%</span>
             </div>
             <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-600 font-black uppercase">Avg Scale-Up Time</span>
                <span className="text-xl font-mono text-white">14 Months</span>
             </div>
             <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-600 font-black uppercase">Cohort Readiness</span>
                <span className="text-xl font-mono text-lime-400">High</span>
             </div>
          </div>
        </div>

        {/* Pathway Optimization Log */}
        <div className="glass p-8 rounded-[2.5rem] border-slate-800 flex flex-col gap-6 relative">
          <div className="flex items-center gap-3">
             <Rocket className="w-5 h-5 text-magenta-400" />
             <h3 className="text-sm font-black uppercase tracking-widest text-white">Pathway Optimization</h3>
          </div>

          <div className="space-y-4">
             {[
               { icon: Factory, label: 'Precursor Availability', status: 'Optimal', color: 'text-emerald-400' },
               { icon: TrendingUp, label: 'Market Demand (2030)', status: 'Extreme', color: 'text-cyan-400' },
               { icon: DollarSign, label: 'Capital Intensity', status: 'Moderate', color: 'text-yellow-400' },
               { icon: CheckCircle2, label: 'Regulatory Alignment', status: 'Verified', color: 'text-lime-400' },
             ].map((item, i) => (
               <div key={i} className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                     <item.icon className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                     <span className="text-xs font-bold text-slate-400">{item.label}</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
               </div>
             ))}
          </div>

          <div className="mt-auto bg-gradient-to-br from-magenta-500/10 to-blue-500/10 p-6 rounded-[2rem] border border-magenta-500/20 relative overflow-hidden group">
             <div className="relative z-10">
                <p className="text-[11px] font-medium text-slate-400 leading-relaxed mb-4">
                   AeronicX AI has identified a 14% synthesis energy reduction by substituting organic solvents with ionic liquids in the X1 cohort.
                </p>
                <button 
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing}
                  className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all relative overflow-hidden flex items-center justify-center gap-3 border border-white/10 ${
                    isAnalyzing 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white hover:scale-[1.02] shadow-[0_0_30px_rgba(34,211,238,0.3)] active:scale-95'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Simulating Sensitivity: {analysisProgress}%
                      <div className="absolute bottom-0 left-0 h-1 bg-white transition-all duration-100" style={{ width: `${analysisProgress}%` }}></div>
                    </>
                  ) : (
                    <>
                      <Activity className="w-4 h-4" /> Run Economic Sensitivity
                    </>
                  )}
                </button>
             </div>
             <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl">
         {[
           { label: 'Total Market Size', value: '$4.2B', sub: 'Projected 2030' },
           { label: 'CO₂ Cost Target', value: '$40/ton', sub: 'Industry Benchmark' },
           { label: 'Synthesis Yield', value: '96.4%', sub: 'Optimized Batch' },
           { label: 'IP Robustness', value: 'Grade A', sub: 'Quantum Novelty' },
         ].map((stat, i) => (
           <div key={i} className="glass p-6 rounded-3xl border-slate-800 text-center hover:border-blue-500/20 transition-all group">
              <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1 group-hover:text-slate-300 transition-colors">{stat.label}</div>
              <div className="text-3xl font-black text-white tracking-tighter mb-1">{stat.value}</div>
              <div className="text-[9px] font-mono text-slate-600 uppercase font-bold">{stat.sub}</div>
           </div>
         ))}
      </div>

      {showSensitivityResults && <SensitivityModal />}
    </div>
  );
};

export default EconomicLens;
