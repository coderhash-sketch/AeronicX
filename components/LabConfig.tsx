
import React, { useState, useMemo } from 'react';
import { 
  Settings, 
  Shield, 
  Cpu, 
  Zap, 
  Radio, 
  Database, 
  Server, 
  AlertCircle, 
  Activity, 
  ChevronRight,
  Target,
  Layers,
  MemoryStick as Memory,
  Microchip
} from 'lucide-react';

const LabConfig: React.FC = () => {
  const [coherence, setCoherence] = useState(85);
  const [fidelity, setFidelity] = useState(99.2);
  const [selectedGNN, setSelectedGNN] = useState<string | null>(null);

  const cryogenicStatus = useMemo(() => {
    if (coherence > 150) return { label: 'Optimal', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: Radio };
    if (coherence > 60) return { label: 'Nominal', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: Radio };
    return { label: 'Critical', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: AlertCircle };
  }, [coherence]);

  const powerStatus = useMemo(() => {
    if (fidelity > 98.5) return { label: 'Cryo-Stable', color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' };
    if (fidelity > 94.0) return { label: 'Fluctuating', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' };
    return { label: 'Power Sag', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
  }, [fidelity]);

  const gnnDetails = {
    model: {
      title: 'V2-GraphGen Alpha Architecture',
      specs: [
        { label: 'Layer Depth', value: '12-Block MPNN', icon: Layers },
        { label: 'Parameters', value: '1.4M Synapses', icon: Activity },
        { label: 'Dataset', value: 'Materials Project + COD', icon: Database }
      ],
      description: 'A deep Message Passing Graph Neural Network optimized for MOF crystal structures, predicting pore geometry in milliseconds.'
    },
    batch: {
      title: 'High-Throughput Screening Cycle',
      specs: [
        { label: 'VRAM Usage', value: '23.4 GB / 24 GB', icon: Memory },
        { label: 'Throughput', value: '450k Materials/hr', icon: Zap },
        { label: 'Latency', value: '2.4ms per Ingress', icon: Activity }
      ],
      description: 'Distributed inference across 8x A100 GPU clusters, utilizing sharded datasets for maximum parallel processing efficiency.'
    },
    precision: {
      title: 'Quantum-Integrated Validation',
      specs: [
        { label: 'Optimizer', value: 'Quantum SLSQP', icon: Target },
        { label: 'Threshold', value: '1.0 kcal/mol', icon: Microchip },
        { label: 'Circuit Depth', value: '32 Var. Gates', icon: Cpu }
      ],
      description: 'Hybrid protocol that bridges GNN predictions with VQE ground-state energy verification for chemical accuracy.'
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start py-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 bg-cyan-400/10 rounded-2xl mb-2">
          <Settings className="w-10 h-10 text-cyan-400 animate-spin-slow" />
        </div>
        <h2 className="text-5xl font-extrabold tracking-tighter neonic-text">Lab Infrastructure Config</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
          Fine-tune the quantum simulation hardware and AI screening parameters for the AeronicX discovery pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Quantum Hardware Panel */}
        <div className="glass p-8 rounded-[2.5rem] border-slate-800 space-y-8 flex flex-col">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Cpu className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Quantum Processing Unit (QPU)</h3>
          </div>

          <div className="space-y-6 flex-1">
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500 uppercase font-black">Target Coherence Time (μs)</span>
                <span className={`${cryogenicStatus.color} font-black transition-colors duration-300`}>{coherence} μs</span>
              </div>
              <input 
                type="range" 
                min="0"
                max="250"
                value={coherence} 
                onChange={(e) => setCoherence(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500 uppercase font-black">Gate Fidelity (%)</span>
                <span className={`${powerStatus.color} font-black transition-colors duration-300`}>{fidelity.toFixed(1)}%</span>
              </div>
              <input 
                type="range" 
                min="90" 
                max="100" 
                step="0.1"
                value={fidelity} 
                onChange={(e) => setFidelity(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-magenta-500"
              />
            </div>
          </div>

          <div className="pt-8 grid grid-cols-2 gap-4">
             <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-center gap-3 ${cryogenicStatus.bg} ${cryogenicStatus.border}`}>
                <cryogenicStatus.icon className={`w-4 h-4 ${cryogenicStatus.color} ${coherence < 60 ? 'animate-bounce' : 'animate-pulse'}`} />
                <span className="text-[10px] font-black uppercase text-slate-400">Cryo Status: <span className={`${cryogenicStatus.color}`}>{cryogenicStatus.label}</span></span>
             </div>
             <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-center gap-3 ${powerStatus.bg} ${powerStatus.border}`}>
                <Zap className={`w-4 h-4 transition-colors duration-300 ${powerStatus.color} ${fidelity < 94 ? 'animate-ping' : ''}`} />
                <span className="text-[10px] font-black uppercase text-slate-400">Power: <span className={`${powerStatus.color}`}>{powerStatus.label}</span></span>
             </div>
          </div>
        </div>

        {/* Neural Engine Panel */}
        <div className="glass p-8 rounded-[2.5rem] border-slate-800 space-y-6 flex flex-col">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-magenta-500/10 rounded-xl">
              <Database className="w-6 h-6 text-magenta-400" />
            </div>
            <h3 className="text-xl font-bold text-white">GNN Neural Sieve Config</h3>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => setSelectedGNN(selectedGNN === 'model' ? null : 'model')}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group ${
                selectedGNN === 'model' ? 'bg-magenta-500/20 border-magenta-500/50' : 'bg-slate-900/50 border-slate-800 hover:border-magenta-500/30'
              }`}
            >
              <div className="flex flex-col text-left">
                <span className={`text-sm font-bold ${selectedGNN === 'model' ? 'text-magenta-400' : 'text-slate-200'}`}>Model Version</span>
                <span className="text-[10px] text-slate-500 uppercase font-black">V2-GraphGen Alpha</span>
              </div>
              <Shield className={`w-4 h-4 transition-colors ${selectedGNN === 'model' ? 'text-magenta-400' : 'text-slate-600 group-hover:text-magenta-400'}`} />
            </button>

            <button 
              onClick={() => setSelectedGNN(selectedGNN === 'batch' ? null : 'batch')}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group ${
                selectedGNN === 'batch' ? 'bg-cyan-400/20 border-cyan-400/50' : 'bg-slate-900/50 border-slate-800 hover:border-cyan-400/30'
              }`}
            >
              <div className="flex flex-col text-left">
                <span className={`text-sm font-bold ${selectedGNN === 'batch' ? 'text-cyan-400' : 'text-slate-200'}`}>Screening Batch Size</span>
                <span className="text-[10px] text-slate-500 uppercase font-black">128,000 Candidates / Cycle</span>
              </div>
              <Server className={`w-4 h-4 transition-colors ${selectedGNN === 'batch' ? 'text-cyan-400' : 'text-slate-600 group-hover:text-cyan-400'}`} />
            </button>

            <button 
              onClick={() => setSelectedGNN(selectedGNN === 'precision' ? null : 'precision')}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group ${
                selectedGNN === 'precision' ? 'bg-lime-400/20 border-lime-400/50' : 'bg-slate-900/50 border-slate-800 hover:border-lime-400/30'
              }`}
            >
              <div className="flex flex-col text-left">
                <span className={`text-sm font-bold ${selectedGNN === 'precision' ? 'text-lime-400' : 'text-slate-200'}`}>Binding Precision Mode</span>
                <span className="text-[10px] text-slate-500 uppercase font-black">High Fidelity (VQE-Integrated)</span>
              </div>
              <div className={`w-3 h-3 rounded-full transition-shadow ${
                selectedGNN === 'precision' ? 'bg-lime-400 shadow-[0_0_12px_rgba(163,230,71,0.8)]' : 'bg-slate-700'
              }`}></div>
            </button>
          </div>

          {/* Dynamic Detail Panel */}
          <div className="flex-1 min-h-[160px] relative">
            {!selectedGNN ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl opacity-40">
                <Activity className="w-8 h-8 text-slate-700 mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Select a parameter to view specs</span>
              </div>
            ) : (
              <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-6 space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <ChevronRight className="w-4 h-4 text-magenta-400" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">
                    {selectedGNN === 'model' ? gnnDetails.model.title : selectedGNN === 'batch' ? gnnDetails.batch.title : gnnDetails.precision.title}
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {(selectedGNN === 'model' ? gnnDetails.model.specs : selectedGNN === 'batch' ? gnnDetails.batch.specs : gnnDetails.precision.specs).map((spec, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <spec.icon className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{spec.label}</span>
                      </div>
                      <span className="text-[11px] font-mono font-black text-slate-200">{spec.value}</span>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-slate-500 italic leading-relaxed px-1">
                  {selectedGNN === 'model' ? gnnDetails.model.description : selectedGNN === 'batch' ? gnnDetails.batch.description : gnnDetails.precision.description}
                </p>
              </div>
            )}
          </div>

          <button className="w-full py-4 bg-white/5 border border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all text-slate-400 hover:text-white mt-auto">
            Re-Synchronize Neural Clusters
          </button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}} />
    </div>
  );
};

export default LabConfig;
