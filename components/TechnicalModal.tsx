
import React from 'react';
import { X, Cpu, Database, BrainCircuit, Info, Zap, RefreshCw, ArrowRight, BookOpen, ExternalLink, GraduationCap } from 'lucide-react';

interface TechnicalModalProps {
  onClose: () => void;
}

const TechnicalModal: React.FC<TechnicalModalProps> = ({ onClose }) => {
  const references = [
    {
      title: "Scalable Quantum Simulation of Molecular Electronic States",
      authors: "Peruzzo et al.",
      journal: "Nature Communications",
      year: "2014",
      doi: "10.1038/ncomms5213",
      tag: "VQE Core",
      color: "text-cyan-400"
    },
    {
      title: "Crystal Graph Convolutional Neural Networks for Material Prediction",
      authors: "Xie & Grossman",
      journal: "Physical Review Letters",
      year: "2018",
      doi: "10.1103/PhysRevLett.120.145301",
      tag: "GNN Architecture",
      color: "text-magenta-400"
    },
    {
      title: "The Role of Metal-Organic Frameworks in a Carbon-Neutral Economy",
      authors: "Queen et al.",
      journal: "Nature Materials",
      year: "2020",
      doi: "10.1038/s41563-020-0734-z",
      tag: "Climate Impact",
      color: "text-lime-400"
    }
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-10">
      {/* High-blur backdrop */}
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="relative glass w-full max-w-5xl max-h-[90vh] rounded-[3.5rem] overflow-hidden border border-cyan-500/20 shadow-[0_0_100px_rgba(34,211,238,0.15)] animate-in zoom-in duration-500 flex flex-col">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-cyan-500/5 shrink-0 pl-10 sm:pl-24">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <Info className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Technical Architecture</h2>
              <p className="text-[10px] font-mono text-cyan-500/70 uppercase tracking-[0.4em] font-black">AI + Quantum Digital Scientist Protocol</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-slate-800">
            <X className="w-7 h-7 text-slate-500 hover:text-white" />
          </button>
        </div>
        
        {/* Content Area */}
        <div className="p-10 pl-10 sm:pl-24 space-y-12 overflow-y-auto flex-1 custom-scrollbar scroll-smooth">
          
          {/* Professional Challenges & Vision Paragraph */}
          <div className="bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950 p-10 rounded-[2.5rem] border border-cyan-500/20 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
             <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] mb-4">Engineering Vision & Challenges</h4>
             <p className="text-xl font-bold text-white leading-relaxed italic opacity-90">
               "AeronicX masters the complex synchronization of high-throughput AI screening with sub-atomic quantum precision across a 1.2-million-material library. Our primary architectural challenge was translating abstract quantum behaviors into a high-performance, intuitive interface that maintains scientific rigor without sacrificing aesthetic clarity. By successfully bridging these domains, we’ve transformed theoretical physics into a tangible engine for scalable climate discovery."
             </p>
          </div>

          {/* Core Identity Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4 p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-cyan-500/20 transition-all">
              <div className="mt-1 shrink-0"><Zap className="w-6 h-6 text-lime-400" /></div>
              <div>
                <span className="text-white font-black uppercase text-[10px] tracking-widest block mb-2">Quantum Use Case:</span>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                  Precisely simulating the sub-atomic binding affinities of CO₂. Unlike classical computers which "guess" chemistry, Quantum calculates the **actual** electronic overlap.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-magenta-500/20 transition-all">
              <div className="mt-1 shrink-0"><Cpu className="w-6 h-6 text-magenta-400" /></div>
              <div>
                <span className="text-white font-black uppercase text-[10px] tracking-widest block mb-2">Quantum Workload:</span>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                  Executing the **Variational Quantum Eigensolver (VQE)** loop to converge on the stable ground-state energy of the CO₂-Metal cluster.
                </p>
              </div>
            </div>
          </div>

          {/* VQE Visualization */}
          <section className="space-y-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin-slow" />
              The Backend VQE Hybrid Loop
            </h3>
            
            <div className="relative p-8 bg-slate-950 border border-slate-800 rounded-[2.5rem] overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent"></div>
               
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex-1 flex flex-col items-center text-center p-4 bg-slate-900 rounded-3xl border border-slate-800">
                     <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                        <span className="text-xs font-black text-cyan-400">CPU</span>
                     </div>
                     <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">1. Classical Optimizer</h5>
                     <p className="text-[11px] text-slate-500">Initializes trial parameters <span className="text-cyan-400 font-mono">θ</span>.</p>
                  </div>

                  <ArrowRight className="hidden md:block w-6 h-6 text-slate-700" />

                  <div className="flex-1 flex flex-col items-center text-center p-4 bg-cyan-900/10 rounded-3xl border border-cyan-500/20">
                     <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center mb-3 animate-pulse">
                        <Cpu className="w-5 h-5 text-cyan-400" />
                     </div>
                     <h5 className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-2">2. QPU Ansatz</h5>
                     <p className="text-[11px] text-slate-300">Prepares the state <span className="italic font-mono">|ψ(θ)⟩</span>.</p>
                  </div>

                  <ArrowRight className="hidden md:block w-6 h-6 text-slate-700" />

                  <div className="flex-1 flex flex-col items-center text-center p-4 bg-slate-900 rounded-3xl border border-slate-800">
                     <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                        <Zap className="w-5 h-5 text-magenta-400" />
                     </div>
                     <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">3. Measurement</h5>
                     <p className="text-[11px] text-slate-500">Calculates expectation <span className="text-magenta-400 font-mono">⟨H⟩</span>.</p>
                  </div>
               </div>
            </div>
          </section>

          {/* Scientific Reference Vault */}
          <section className="space-y-6 pt-4">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-gold-500" />
              Scientific Reference Vault
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {references.map((ref, idx) => (
                <div key={idx} className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] hover:border-slate-600 transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <GraduationCap className={`w-5 h-5 ${ref.color}`} />
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-white/5 ${ref.color}`}>{ref.tag}</span>
                    </div>
                    <h5 className="text-sm font-bold text-white leading-tight mb-2 group-hover:text-cyan-400 transition-colors">{ref.title}</h5>
                    <p className="text-[10px] text-slate-500 font-medium">{ref.authors} • <span className="italic">{ref.journal}</span> ({ref.year})</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-slate-600">DOI: {ref.doi}</span>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 1 */}
          <section className="space-y-5 relative group border-t border-slate-800 pt-10">
            <div className="absolute -left-[50px] sm:-left-[60px] top-11 w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/20">
              <Database className="w-5 h-5 text-fuchsia-400" />
            </div>
            <h3 className="text-2xl font-black text-fuchsia-300 tracking-tight uppercase">01. Neural GNN Screening</h3>
            <p className="text-slate-100 leading-relaxed text-lg font-medium opacity-90">
              We employ a <strong className="text-fuchsia-400">Graph Neural Network (GNN)</strong> architecture to predict properties of over 1.2M candidates, acting as a "Classical Sieve" for high-probability discovery.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-5 relative group border-t border-slate-800 pt-10 pb-10">
            <div className="absolute -left-[50px] sm:-left-[60px] top-11 w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <BrainCircuit className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-black text-cyan-300 tracking-tight uppercase">02. Variational Quantum Eigensolver</h3>
            <p className="text-slate-100 leading-relaxed text-lg font-medium opacity-90">
              By using <strong className="text-cyan-400">VQE</strong>, we solve the Schrödinger equation for the CO₂-Metal binding site, delivering "Chemical Truth" that classical approximations cannot reach.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-900/80 border-t border-slate-800 flex justify-center shrink-0">
          <button 
            onClick={onClose}
            className="px-16 py-4 bg-gradient-to-br from-cyan-400 to-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all hover:scale-105 shadow-xl active:scale-95"
          >
            Acknowledge Protocols
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicalModal;
