
import React, { useState } from 'react';
import { 
  History, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  Download, 
  X,
  Zap,
  Activity,
  Cpu,
  Database
} from 'lucide-react';

interface Experiment {
  id: string;
  material: string;
  timestamp: string;
  status: 'Success' | 'Warning' | 'Failed';
  fidelity: string;
  energy: string;
  result: string;
}

const LogHistory: React.FC = () => {
  const [selectedExp, setSelectedExp] = useState<Experiment | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const pastExperiments: Experiment[] = [
    { id: 'EXP-902', material: 'QuantumMOF-X1', timestamp: '2024-05-12 14:22', status: 'Success', fidelity: '99.8%', energy: '-12.45 H', result: '18.4 mmol/g' },
    { id: 'EXP-899', material: 'ZIF-8-Quantum', timestamp: '2024-05-11 09:15', status: 'Success', fidelity: '98.2%', energy: '-8.12 H', result: '12.1 mmol/g' },
    { id: 'EXP-895', material: 'MOF-5-Hybrid', timestamp: '2024-05-10 18:40', status: 'Warning', fidelity: '84.5%', energy: '-4.22 H', result: '6.5 mmol/g' },
    { id: 'EXP-890', material: 'Zr-Porphyrin', timestamp: '2024-05-09 22:11', status: 'Success', fidelity: '99.1%', energy: '-14.88 H', result: '16.2 mmol/g' },
    { id: 'EXP-884', material: 'Cu-BTC-Quantum', timestamp: '2024-05-08 11:05', status: 'Failed', fidelity: '22.0%', energy: 'N/A', result: 'N/A' },
    { id: 'EXP-880', material: 'UiO-66-GNN', timestamp: '2024-05-07 15:30', status: 'Success', fidelity: '97.4%', energy: '-11.05 H', result: '14.1 mmol/g' },
  ];

  const handleDownloadCSV = () => {
    setIsExporting(true);
    
    // Simulate generation time
    setTimeout(() => {
      const headers = ['Exp ID', 'Material', 'Timestamp', 'Status', 'Fidelity', 'Energy', 'Capture Result'];
      const rows = pastExperiments.map(exp => [
        exp.id,
        exp.material,
        exp.timestamp,
        exp.status,
        exp.fidelity,
        exp.energy,
        exp.result
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `AeronicX_Archive_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
    }, 800);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Success':
        return (
          <div className="flex items-center gap-2 text-lime-400 bg-lime-400/10 px-3 py-1 rounded-full border border-lime-400/20 text-[10px] font-black uppercase tracking-tighter">
            <CheckCircle2 size={12} /> Confirmed
          </div>
        );
      case 'Warning':
        return (
          <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20 text-[10px] font-black uppercase tracking-tighter">
            <AlertTriangle size={12} /> Low Fidelity
          </div>
        );
      case 'Failed':
        return (
          <div className="flex items-center gap-2 text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 text-[10px] font-black uppercase tracking-tighter">
            <AlertTriangle size={12} /> Decoherence
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start py-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 bg-magenta-400/10 rounded-2xl mb-2">
          <History className="w-10 h-10 text-magenta-400" />
        </div>
        <h2 className="text-5xl font-extrabold tracking-tighter neonic-text">Quantum Discovery Logs</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
          Accessing the vault of past simulations, VQE convergences, and high-affinity synthesis results.
        </p>
      </div>

      <div className="w-full max-w-6xl glass rounded-[2.5rem] border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 bg-white/5 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <FileText className="text-slate-500" size={24} />
              <span className="text-xs font-black uppercase tracking-widest text-slate-300 font-mono">Experiment Archive (v4.2)</span>
           </div>
           <button 
            onClick={handleDownloadCSV}
            disabled={isExporting}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
              isExporting 
                ? 'bg-slate-800 text-slate-500 cursor-wait' 
                : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800'
            }`}
           >
              {isExporting ? <Zap size={14} className="animate-pulse" /> : <Download size={14} />}
              {isExporting ? 'Generating CSV...' : 'Full CSV Export'}
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">Exp ID</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">Target Material</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">Timestamp</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">Fidelity</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">Energy (H)</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">Capture</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {pastExperiments.map((exp) => (
                <tr 
                  key={exp.id} 
                  onClick={() => setSelectedExp(exp)}
                  className="group hover:bg-magenta-500/5 transition-colors cursor-pointer"
                >
                  <td className="px-8 py-5 text-xs font-mono font-bold text-slate-500 group-hover:text-magenta-400">{exp.id}</td>
                  <td className="px-8 py-5 font-bold text-white tracking-tight">{exp.material}</td>
                  <td className="px-8 py-5 text-[10px] font-mono text-slate-600 flex items-center gap-2">
                    <Clock size={10} /> {exp.timestamp}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-white">{exp.fidelity}</span>
                      <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${parseFloat(exp.fidelity) > 90 ? 'bg-cyan-400' : parseFloat(exp.fidelity) > 50 ? 'bg-yellow-400' : 'bg-rose-500'}`} 
                          style={{ width: exp.fidelity }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs font-mono text-slate-400">{exp.energy}</td>
                  <td className="px-8 py-5 font-black text-white">{exp.result}</td>
                  <td className="px-8 py-5">{getStatusBadge(exp.status)}</td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExp(exp);
                      }}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 group-hover:text-white group-hover:border-slate-500 transition-all hover:scale-110 active:scale-95 shadow-lg"
                    >
                       <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
         <div className="glass p-8 rounded-3xl border-slate-800 hover:border-magenta-500/20 transition-all text-center">
            <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Total Experiments</div>
            <div className="text-4xl font-black text-white tracking-tighter">1,244</div>
            <div className="text-[10px] font-mono text-magenta-400 font-bold uppercase mt-1">+12 Since Last Sync</div>
         </div>
         <div className="glass p-8 rounded-3xl border-slate-800 hover:border-lime-500/20 transition-all text-center">
            <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Success Rate</div>
            <div className="text-4xl font-black text-white tracking-tighter">91.4%</div>
            <div className="text-[10px] font-mono text-lime-400 font-bold uppercase mt-1">High Accuracy (VQE)</div>
         </div>
         <div className="glass p-8 rounded-3xl border-slate-800 hover:border-cyan-500/20 transition-all text-center">
            <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Compute Time Saved</div>
            <div className="text-4xl font-black text-white tracking-tighter">8.4 Yr</div>
            <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase mt-1">GNN/VQE Optimized</div>
         </div>
      </div>

      {/* Experiment Detail Modal */}
      {selectedExp && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 backdrop-blur-2xl bg-slate-950/60">
          <div className="glass w-full max-w-3xl rounded-[3rem] border border-slate-800 shadow-[0_0_100px_rgba(244,63,94,0.1)] overflow-hidden flex flex-col animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg ${
                  selectedExp.status === 'Success' ? 'bg-lime-500/10 border-lime-500/20 text-lime-400' :
                  selectedExp.status === 'Warning' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                  'bg-rose-500/10 border-rose-500/20 text-rose-500'
                }`}>
                  <Activity size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">{selectedExp.material} Details</h3>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black">Archive Run: {selectedExp.id} • {selectedExp.timestamp}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedExp(null)}
                className="p-3 rounded-2xl hover:bg-white/10 transition-colors group"
              >
                <X className="w-6 h-6 text-slate-500 group-hover:text-white" />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Binding Energy</span>
                  <span className="text-3xl font-mono font-black text-white">{selectedExp.energy}</span>
                  <div className="mt-4 flex items-center gap-2 text-[10px] text-lime-400 font-bold uppercase">
                    <CheckCircle2 size={12} /> Quantum Converged
                  </div>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Capture Result</span>
                  <span className="text-3xl font-mono font-black text-white">{selectedExp.result}</span>
                  <div className="mt-4 flex items-center gap-2 text-[10px] text-cyan-400 font-bold uppercase">
                    <Zap size={12} /> High Efficiency
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Atomic Log Analysis</h4>
                 <div className="space-y-3">
                   {[
                     { label: 'Neural GNN Score', value: '0.9942', icon: Database, color: 'text-magenta-400' },
                     { label: 'VQE Circuit Fidelity', value: selectedExp.fidelity, icon: Cpu, color: 'text-cyan-400' },
                     { label: 'Structural Integrity', value: 'High-Lattice', icon: Activity, color: 'text-lime-400' },
                   ].map((log, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-slate-800">
                        <div className="flex items-center gap-3">
                          <log.icon size={16} className={log.color} />
                          <span className="text-sm font-bold text-slate-300">{log.label}</span>
                        </div>
                        <span className="font-mono text-sm text-white font-black">{log.value}</span>
                     </div>
                   ))}
                 </div>
              </div>

              <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-3xl">
                 <p className="text-xs text-slate-400 italic leading-relaxed">
                   "This experiment successfully validated the {selectedExp.material} lattice under industrial flue gas conditions. VQE results indicated a stable binding pocket with high selectivity for CO₂ over N₂ molecules."
                 </p>
              </div>
            </div>

            <div className="p-8 bg-slate-900/80 border-t border-slate-800 flex justify-center">
              <button 
                onClick={() => setSelectedExp(null)}
                className="px-12 py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogHistory;
