
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  Loader2, 
  Upload, 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  ChevronRight, 
  Trophy, 
  Download, 
  Cpu, 
  CheckCircle2, 
  Zap,
  Leaf,
  BarChart3,
  Search,
  Activity
} from 'lucide-react';
import { ProcessStep, MaterialCandidate } from '../types';

const AIFilteringEngine: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<'upload' | 'processing' | 'dashboard'>('upload');
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [analysisMetrics, setAnalysisMetrics] = useState({ analyzed: 0, accuracy: 0 });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: ProcessStep[] = [
    { id: 'upload', label: 'Dataset Ingestion', status: 'pending', progress: 0 },
    { id: 'filtering', label: 'Neural GNN Screening', status: 'pending', progress: 0 },
    { id: 'quantum', label: 'Quantum Verification', status: 'pending', progress: 0 },
    { id: 'ranking', label: 'Hybrid Optimization', status: 'pending', progress: 0 },
    { id: 'validation', label: 'Scientific Validation', status: 'pending', progress: 0 },
  ];

  const [activeSteps, setActiveSteps] = useState(steps);

  const mockLeaderboard: MaterialCandidate[] = useMemo(() => [
    { 
      id: 'AQ-X1', name: 'QuantumMOF-X1', metal: 'Zr', metalColor: '#22d3ee', adsorption: '18.4 mmol/g', surfaceArea: '4520', synthesisTime: '4.2', cost: '12', highlightMetric: '', highlightLabel: '', formula: 'Zr₆O₄(OH)₄', 
      efficiencyScore: 98.4, durabilityScore: 95.2, feasibilityScore: 88.1, compositeScore: 93.9,
      entryX: -200, entryY: -200, entryRotation: -45, velocity: 32.5 
    },
    { 
      id: 'AQ-X4', name: 'QuantumMOF-X4', metal: 'Cr', metalColor: '#f472b6', adsorption: '16.2 mmol/g', surfaceArea: '3800', synthesisTime: '12.0', cost: '24', highlightMetric: '', highlightLabel: '', formula: 'Cr₃O(OH)', 
      efficiencyScore: 91.2, durabilityScore: 98.8, feasibilityScore: 72.4, compositeScore: 87.5,
      entryX: 0, entryY: -250, entryRotation: 90, velocity: 21.9
    },
    { 
      id: 'AQ-X3', name: 'QuantumMOF-X3', metal: 'Zn', metalColor: '#a3e635', adsorption: '14.5 mmol/g', surfaceArea: '6200', synthesisTime: '6.5', cost: '18', highlightMetric: '', highlightLabel: '', formula: 'Zn₄O(BDC)', 
      efficiencyScore: 86.5, durabilityScore: 82.1, feasibilityScore: 92.3, compositeScore: 87.0,
      entryX: 200, entryY: -200, entryRotation: 45, velocity: 44.1
    },
    { 
      id: 'AQ-X5', name: 'QuantumMOF-X5', metal: 'Fe', metalColor: '#60a5fa', adsorption: '11.8 mmol/g', surfaceArea: '2900', synthesisTime: '3.5', cost: '7', highlightMetric: '', highlightLabel: '', formula: 'Fe₃O(F)', 
      efficiencyScore: 78.9, durabilityScore: 89.4, feasibilityScore: 94.2, compositeScore: 86.8,
      entryX: 250, entryY: 0, entryRotation: 180, velocity: 39.4
    },
  ], []);

  const handleStartProcessing = () => {
    setCurrentStage('processing');
    let currentIdx = 0;
    
    const interval = setInterval(() => {
      setActiveSteps(prev => {
        const next = [...prev];
        if (next[currentIdx].progress < 100) {
          next[currentIdx].progress += 5;
          next[currentIdx].status = 'processing';
          setPipelineProgress(prevP => prevP + (5 / steps.length));
        } else {
          next[currentIdx].status = 'completed';
          if (currentIdx < steps.length - 1) {
            currentIdx++;
            setCurrentStepIndex(currentIdx);
          } else {
            clearInterval(interval);
            setTimeout(() => {
              setCurrentStage('dashboard');
              setAnalysisMetrics({ analyzed: 1245892, accuracy: 99.42 });
            }, 800);
          }
        }
        return next;
      });
    }, 120);
  };

  const renderUpload = () => (
    <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4 max-w-2xl">
        <div className="inline-flex items-center justify-center p-4 bg-magenta-400/10 rounded-full mb-4">
          <Database className="w-12 h-12 text-magenta-400" />
        </div>
        <h2 className="text-5xl font-black tracking-tighter neonic-text">Neural Sieve GNN Screening</h2>
        <p className="text-slate-400 text-lg">
          Upload your candidate MOF dataset to initiate the high-throughput AI screening and Quantum validation pipeline.
        </p>
      </div>

      <div className="w-full max-w-xl">
        <div 
          onClick={handleStartProcessing}
          className="group relative border-2 border-dashed border-slate-800 bg-slate-900/40 rounded-[2.5rem] p-16 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-magenta-500/50 hover:bg-magenta-500/5"
        >
          <Upload className="w-16 h-16 text-slate-600 mb-6 group-hover:text-magenta-400 group-hover:scale-110 transition-all" />
          <span className="text-xl font-bold text-white mb-2">Drag & Drop Materials Dataset</span>
          <span className="text-slate-500 font-mono text-xs uppercase tracking-widest">Supported: .CSV, .JSON, .CIF (Crystal Structure)</span>
          <div className="mt-8 px-6 py-2 bg-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-400">Sample Dataset: 1.2M Entries ready</div>
        </div>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="flex-1 flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-500">
      <div className="w-full max-w-3xl space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-3xl font-black text-white tracking-tighter mb-1">Discovery Pipeline Active</h3>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
              <Activity className="w-3 h-3 text-magenta-400 animate-pulse" />
              Phase: {activeSteps[currentStepIndex].label}
            </p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-mono font-black neonic-text">{Math.floor(pipelineProgress)}%</span>
          </div>
        </div>

        <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-1">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 via-magenta-500 to-lime-400 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
            style={{ width: `${pipelineProgress}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {activeSteps.map((step, i) => (
            <div key={step.id} className="flex flex-col gap-3">
              <div className={`h-1.5 rounded-full transition-all duration-500 ${
                step.status === 'completed' ? 'bg-lime-400 shadow-[0_0_10px_rgba(163,230,71,0.5)]' :
                step.status === 'processing' ? 'bg-cyan-400 animate-pulse' : 'bg-slate-800'
              }`}></div>
              <span className={`text-[8px] font-black uppercase tracking-widest text-center transition-colors ${
                step.status === 'completed' ? 'text-lime-400' :
                step.status === 'processing' ? 'text-cyan-400' : 'text-slate-600'
              }`}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
        <div className="glass p-8 rounded-3xl border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-magenta-500/5 blur-[40px] group-hover:bg-magenta-500/10 transition-colors"></div>
           <Loader2 className="w-10 h-10 text-magenta-400 animate-spin mb-4" />
           <span className="text-3xl font-mono font-black text-white mb-1">
             {Math.floor(Math.random() * 999999).toLocaleString()}
           </span>
           <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">GNN Descriptors Screened</span>
        </div>
        <div className="glass p-8 rounded-3xl border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-cyan-500/5 blur-[40px] group-hover:bg-cyan-500/10 transition-colors"></div>
           <Zap className="w-10 h-10 text-cyan-400 animate-pulse mb-4" />
           <span className="text-3xl font-mono font-black text-white mb-1">
             {(Math.random() * -15).toFixed(2)} eV
           </span>
           <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Avg. Predicted Affinity</span>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="flex-1 flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Search, value: analysisMetrics.analyzed.toLocaleString(), label: 'Materials Analyzed', color: 'text-cyan-400' },
          { icon: CheckCircle2, value: `${analysisMetrics.accuracy}%`, label: 'Validation Match', color: 'text-lime-400' },
          { icon: Leaf, value: '$14/t', label: 'Capture Alpha', color: 'text-emerald-400' },
          { icon: Cpu, value: '-14.2 H', label: 'Avg VQE Energy', color: 'text-magenta-400' }
        ].map((m, i) => (
          <div key={i} className="glass p-6 rounded-[2rem] border-slate-800 bg-gradient-to-br from-slate-900/50 to-slate-950/50 relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <m.icon className="w-10 h-10 text-white" />
            </div>
            <div className="relative z-10">
              <div className={`text-3xl font-black ${m.color} tracking-tighter mb-2 drop-shadow-[0_0_15px_currentColor]`}>
                {m.value}
              </div>
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] leading-tight">{m.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Trophy className="w-6 h-6 text-yellow-500" />
               <h3 className="text-xl font-bold uppercase tracking-widest text-white">Hybrid Leaderboard</h3>
            </div>
            <button className="text-[10px] font-black text-slate-500 hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest">
              <Download className="w-3 h-3" /> Export JSON
            </button>
          </div>

          <div className="space-y-4">
            {mockLeaderboard.map((item, i) => (
              <div key={item.id} className="glass p-6 rounded-[2rem] border-slate-800 hover:border-slate-700 transition-all group cursor-pointer flex items-center justify-between relative overflow-hidden">
                {i === 0 && <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>}
                
                <div className="flex items-center gap-6 relative z-10">
                   <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center font-black transition-transform group-hover:scale-110">
                      <span className="text-xl" style={{ color: item.metalColor }}>{item.metal}</span>
                      <span className="text-[8px] text-slate-600">{item.id}</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{item.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">{item.formula}</span>
                   </div>
                </div>

                <div className="flex gap-10 relative z-10">
                   <div className="flex flex-col items-center">
                      <span className="text-[8px] font-black text-slate-600 uppercase mb-1">Efficiency</span>
                      <span className="text-sm font-black text-white">{item.efficiencyScore}%</span>
                   </div>
                   <div className="flex flex-col items-center">
                      <span className="text-[8px] font-black text-slate-600 uppercase mb-1">Rank Score</span>
                      <span className="text-xl font-black neonic-text">{item.compositeScore}</span>
                   </div>
                   <div className="flex items-center pl-4">
                      <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-10">
          <div className="glass p-8 rounded-[2.5rem] border-slate-800 h-[400px] flex flex-col relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-white">Atomic Topology View</h3>
               </div>
               <div className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-[8px] font-black text-cyan-400 uppercase">Live Probe</div>
            </div>

            <div className="flex-1 flex items-center justify-center">
               <svg width="240" height="200" viewBox="0 0 240 200" className="drop-shadow-[0_0_20px_rgba(34,211,238,0.2)] group-hover:scale-110 transition-transform duration-700">
                  {[0, 60, 120, 180, 240, 300].map(angle => {
                    const rad = (angle * Math.PI) / 180;
                    const x = 120 + 60 * Math.cos(rad);
                    const y = 100 + 60 * Math.sin(rad);
                    return (
                      <g key={angle}>
                        <line x1="120" y1="100" x2={x} y2={y} stroke="rgba(34, 211, 238, 0.3)" strokeWidth="2" strokeDasharray="4 2" />
                        <circle cx={x} cy={y} r="12" fill="#22d3ee" className="animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                        <text x={x} y={y+4} textAnchor="middle" fontSize="10" fill="white" fontWeight="900">Zr</text>
                      </g>
                    );
                  })}
                  <circle cx="120" cy="100" r="15" fill="#1e293b" stroke="#22d3ee" strokeWidth="2" />
                  <text x="120" y="104" textAnchor="middle" fontSize="8" fill="#22d3ee" fontWeight="900" className="animate-pulse">CO₂</text>
               </svg>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-4">
               <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
                  <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Precision</div>
                  <div className="text-sm font-black text-white">±0.002 eV</div>
               </div>
               <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
                  <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Confidence</div>
                  <div className="text-sm font-black text-lime-400">Validated</div>
               </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600/20 to-teal-900/20 p-8 rounded-[2.5rem] border border-emerald-500/20 relative overflow-hidden group">
             <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Leaf className="w-32 h-32 text-white" />
             </div>
             <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2 uppercase tracking-tighter">
                <Leaf className="w-5 h-5 text-emerald-400" /> SDG-13 Impact
             </h3>
             <p className="text-xs text-slate-300 leading-relaxed font-medium italic">
               Discovery lifecycle reduced by 15x. Potential reduction of 4.2 Gigatons of CO₂ by 2040 using Quantum-GNN validated MOF architectures.
             </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col p-2 h-full">
      {currentStage === 'upload' && renderUpload()}
      {currentStage === 'processing' && renderProcessing()}
      {currentStage === 'dashboard' && renderDashboard()}
    </div>
  );
};

export default AIFilteringEngine;
