
import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Zap, Info, Terminal, AlertTriangle, Layers, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { simulateVQEAdsorption } from '../src/services/quantumAIService';
import { MaterialCandidate } from '../types';
import MoleculeViewer from './MoleculeViewer';

interface QuantumSimulatorProps {
  selectedMaterial?: MaterialCandidate;
}

const QuantumSimulator: React.FC<QuantumSimulatorProps> = ({ selectedMaterial }) => {
  const [energyData, setEnergyData] = useState<any[]>([]);
  const [iteration, setIteration] = useState(0);
  const [vqeResult, setVqeResult] = useState<any>(null);
  const [thetas, setThetas] = useState<number[]>([0.1, 0.5, 1.2, 0.8]);
  const [showDetails, setShowDetails] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const metal = selectedMaterial?.metal || 'Zr';
    const result = simulateVQEAdsorption(metal);
    setVqeResult(result);
    setEnergyData(result.convergencePath);
    
    const interval = setInterval(() => {
      setIteration(i => {
        const nextIter = (i + 1) % result.convergencePath.length;
        
        if (nextIter % 5 === 0) {
          const operations = [
            `qiskit.nature.algorithms.VQE(ansatz='UCCSD')`,
            `pennylane.qchem.molecular_hamiltonian(symbols=['${metal}', 'O', 'C', 'O'])`,
            `vqe.compute_expectation(ansatz_params)`,
            `optimizer.step(gradient_spsa)`,
            `statevector_simulator.run(circuit)`,
            `error_mitigation.zne(extrapolation='linear')`
          ];
          setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${operations[Math.floor(Math.random() * operations.length)]}`].slice(-6));
        }

        return nextIter;
      });

      setThetas(prev => prev.map(t => t + (Math.random() - 0.5) * 0.02));
    }, 200);

    return () => clearInterval(interval);
  }, [selectedMaterial]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const qubitConfigs = [
    { label: 'q0', color: 'text-cyan-400', borderColor: 'border-cyan-400/50', bgColor: 'bg-cyan-500/10' },
    { label: 'q1', color: 'text-magenta-400', borderColor: 'border-magenta-400/50', bgColor: 'bg-magenta-500/10' },
    { label: 'q2', color: 'text-lime-400', borderColor: 'border-lime-400/50', bgColor: 'bg-lime-500/10' },
    { label: 'q3', color: 'text-blue-400', borderColor: 'border-blue-400/50', bgColor: 'bg-blue-500/10' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
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
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">VQE Optimizer Active</span>
          </div>
        </div>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 text-[10px] font-black text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest"
        >
          <Info className="w-3 h-3" />
          {showDetails ? 'Hide Technical Spec' : 'View Technical Spec'}
        </button>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass p-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest">Algorithm</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Utilizing the <span className="text-white font-bold">Variational Quantum Eigensolver (VQE)</span> to find the ground state energy of molecular Hamiltonians. This hybrid algorithm uses a classical optimizer to tune quantum circuit parameters.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest">Backend Stack</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Designed for integration with <span className="text-white font-bold">Qiskit Nature</span> and <span className="text-white font-bold">PySCF</span>. Real-world execution requires mapping fermionic operators to qubits via <span className="italic">Jordan-Wigner</span> or <span className="italic">Parity</span> transformations.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest">Disclaimer</h4>
                  <p className="text-[11px] text-amber-500/80 leading-relaxed italic">
                    This visualization is a high-fidelity simulation. Actual quantum hardware results would include decoherence noise and require error mitigation techniques like Zero-Noise Extrapolation (ZNE).
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Molecular Structure Simulation */}
        <div className="flex flex-col gap-6">
          <MoleculeViewer 
            showBinding={iteration > 20} 
            metalSymbol={vqeResult?.metal || 'Zr'} 
            metalColor={selectedMaterial?.metalColor || '#22d3ee'}
            materialName={selectedMaterial?.name || 'QuantumMOF-X1'}
          />
          
          {/* Quantum Circuit Visualization */}
          <div className="glass rounded-2xl p-6 flex flex-col neonic-border border-blue-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Cpu className="w-32 h-32 text-blue-500" />
          </div>
          
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <Cpu className="w-6 h-6 text-cyan-400" />
              <span className="neonic-text">Circuit Architecture</span>
            </h3>
            <div className="flex gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-white/5 text-cyan-400 rounded border border-cyan-400/20 uppercase tracking-widest">{vqeResult?.qubits || 6} Qubits</span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-white/5 text-magenta-400 rounded border border-magenta-400/20 uppercase tracking-widest">{vqeResult?.ansatz || 'UCCSD'} Ansätz</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-around min-h-[350px] relative">
            {qubitConfigs.map((q, i) => (
              <div key={q.label} className="relative flex items-center group">
                <span className={`w-12 font-mono text-lg font-bold ${q.color}`}>{q.label}</span>
                <div className="flex-1 h-0.5 bg-slate-800 relative">
                  <div className={`absolute inset-0 opacity-20 blur-sm ${q.color.replace('text', 'bg')}`}></div>
                  
                  {/* Gates */}
                  <div 
                    className={`absolute left-[20%] -top-5 w-16 h-10 glass border-2 ${q.borderColor} ${q.bgColor} flex flex-col items-center justify-center rounded-lg transition-all group-hover:scale-110 shadow-lg`}
                    style={{ textShadow: '0 0 5px currentColor' }}
                  >
                    <span className={`text-[10px] font-black ${q.color}`}>R<sub>y</sub></span>
                    <span className="text-[8px] font-mono text-white/70">θ={thetas[i].toFixed(3)}</span>
                  </div>

                  {/* CX (CNOT) Gates */}
                  {i < 3 && (
                    <div className="absolute left-[55%] -top-2 bottom-[-48px] w-0.5 bg-white/10 flex items-center justify-center">
                       <div className={`w-5 h-5 rounded-full border-2 bg-slate-900 z-10 transition-transform group-hover:scale-125 ${q.borderColor}`}>
                         <div className={`w-1.5 h-1.5 rounded-full m-auto mt-1 ${q.color.replace('text', 'bg')}`}></div>
                       </div>
                       <div className={`absolute bottom-0 w-8 h-8 border-2 rounded-full flex items-center justify-center text-xs font-black bg-slate-950 z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)] ${qubitConfigs[i+1].borderColor}`}>
                          <span className={qubitConfigs[i+1].color}>X</span>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <div className="absolute bottom-0 left-12 right-0 h-4 border-t border-slate-800 flex justify-between px-4">
               <span className="text-[10px] font-mono text-slate-600 mt-1 italic">Init</span>
               <span className="text-[10px] font-mono text-slate-600 mt-1 italic">Rotations</span>
               <span className="text-[10px] font-mono text-slate-600 mt-1 italic">Entanglement</span>
               <span className="text-[10px] font-mono text-slate-600 mt-1 italic">Measurement</span>
            </div>
          </div>
          
          {/* Live Execution Logs */}
          <div className="mt-6 p-3 bg-black/50 rounded-xl border border-white/5 font-mono text-[9px] h-24 overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 text-slate-500 mb-2 border-b border-white/5 pb-1">
              <Terminal className="w-3 h-3" />
              <span className="uppercase tracking-widest font-black">Qiskit Runtime Logs</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide">
              {logs.map((log, i) => (
                <div key={i} className="text-cyan-400/80">
                  <span className="text-slate-600 mr-2">{">>>"}</span>
                  {log}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* VQE Energy Convergence Graph */}
        <div className="glass rounded-2xl p-6 flex flex-col neonic-border border-lime-500/30 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <Zap className="w-6 h-6 text-lime-400" />
              <span className="neonic-text">Energy Convergence</span>
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Optimizer</span>
                <span className="text-[10px] font-black text-white">SPSA / COBYLA</span>
              </div>
              <span className="text-sm font-mono text-lime-400 font-bold px-3 py-1 bg-lime-400/10 rounded-full border border-lime-400/20">
                Iter: {iteration}
              </span>
            </div>
          </div>

          <div className="flex-1 relative">
            <svg width="100%" height="240" viewBox="0 0 400 240" className="overflow-visible">
              <line x1="0" y1="220" x2="400" y2="220" stroke="#334155" strokeWidth="1" />
              <line x1="0" y1="20" x2="0" y2="220" stroke="#334155" strokeWidth="1" />
              <line x1="0" y1="180" x2="400" y2="180" stroke="#84cc16" strokeWidth="1" strokeDasharray="4" opacity="0.3" />
              
              {energyData.length > 0 && (
                <path 
                  d={`M ${energyData.slice(0, iteration + 1).map((d, i) => `${(i / energyData.length) * 400},${100 - (d.energy + 10) * 8}`).join(' L ')}`}
                  fill="none"
                  stroke="#84cc16"
                  strokeWidth="2.5"
                  className="transition-all duration-100"
                />
              )}
            </svg>
            <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-500 font-bold">Binding Energy (Hartree)</div>
            <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">VQE Iterations</div>
          </div>

          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-inner group">
              <div className="text-[10px] uppercase text-slate-500 font-black mb-1 tracking-widest group-hover:text-lime-400 transition-colors">VQE Energy</div>
              <div className="text-2xl font-mono text-lime-400 font-black">
                {energyData.length > 0 && energyData[iteration] ? energyData[iteration].energy.toFixed(4) : '--'}
              </div>
            </div>
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-inner group">
              <div className="text-[10px] uppercase text-slate-500 font-black mb-1 tracking-widest group-hover:text-blue-400 transition-colors">Adsorption Eff.</div>
              <div className="text-2xl font-mono text-blue-400 font-black">
                {vqeResult?.efficiencyScore || '--'}%
              </div>
            </div>
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-inner group">
              <div className="text-[10px] uppercase text-slate-500 font-black mb-1 tracking-widest group-hover:text-cyan-400 transition-colors">Fidelity</div>
              <div className="text-2xl font-mono text-cyan-400 font-black">
                {vqeResult ? (vqeResult.fidelity * 100).toFixed(2) : '--'}%
              </div>
            </div>
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-inner group">
              <div className="text-[10px] uppercase text-slate-500 font-black mb-1 tracking-widest group-hover:text-magenta-400 transition-colors">Metal Node</div>
              <div className="text-2xl font-mono text-magenta-400 font-black">
                {vqeResult?.metal || '--'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumSimulator;
