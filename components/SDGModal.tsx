
import React from 'react';
import { X, Globe, Leaf, Zap, AlertCircle } from 'lucide-react';

interface SDGModalProps {
  onClose: () => void;
}

const SDGModal: React.FC<SDGModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose}></div>
      
      {/* Modal Container - Using flex-col and max-h to prevent clipping */}
      <div className="relative glass w-full max-w-2xl max-h-[90vh] rounded-[3rem] overflow-hidden border border-gold-500/30 shadow-[0_0_80px_rgba(251,191,36,0.2)] animate-in zoom-in duration-300 flex flex-col">
        
        {/* Header - Fixed height */}
        <div className="p-6 sm:p-8 border-b border-slate-800 flex justify-between items-center bg-gold-500/5 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center border border-gold-500/20 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
              <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-gold-500 animate-pulse-slow" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none mb-1">Climate Action</h2>
              <p className="text-[9px] sm:text-[10px] font-mono text-gold-500 uppercase tracking-[0.3em] font-black">United Nations SDG 13 Framework</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 sm:p-3 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-slate-800">
            <X className="w-5 h-5 sm:w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* Content - Scrollable area */}
        <div className="p-6 sm:p-10 space-y-8 sm:space-y-10 overflow-y-auto flex-1 custom-scrollbar">
          {/* Problem Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              <h3 className="text-base sm:text-lg font-black uppercase tracking-widest">Problem : SDG-13 : Climate Action</h3>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium text-base sm:text-lg">
              It addresses the urgent challenge of climate change caused primarily by rising greenhouse gas emissions, especially carbon dioxide (CO₂), from industries, transportation, and energy production. These emissions lead to global warming, extreme weather events, melting glaciers, rising sea levels, and severe impacts on ecosystems and human livelihoods. Despite global efforts, the pace of developing effective solutions remains slow compared to the speed at which climate damage is increasing. This creates a critical gap between the growing climate threat and our ability to respond with scalable, scientifically validated technologies.
            </p>
          </section>

          {/* Divider */}
          <div className="flex items-center gap-6 py-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-gold-500/50" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
          </div>

          {/* Solution Section */}
          <section className="space-y-5 bg-lime-500/5 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-lime-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/5 blur-[50px] rounded-full"></div>
            <div className="flex items-center gap-3 text-lime-400 relative z-10">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce-slow" />
              <h3 className="text-base sm:text-lg font-black uppercase tracking-widest">Proposed Solution: AeronicX</h3>
            </div>
            <p className="text-slate-200 leading-relaxed font-medium text-base sm:text-lg relative z-10">
              AeronicX solves this by combining AI and quantum simulation: AI first filters out the most promising material candidates, and then a quantum model simulates how CO₂ binds to them at the atomic level. This hybrid approach speeds up material discovery from years to hours and helps identify better, cheaper carbon capture materials to support climate action.
            </p>
          </section>
        </div>

        {/* Footer - Fixed height */}
        <div className="p-6 sm:p-8 bg-slate-900/50 border-t border-slate-800 flex justify-center shrink-0">
          <button
            onClick={onClose}
            className="group relative px-10 sm:px-14 py-3 sm:py-4 bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] shadow-xl active:scale-95"
          >
            Acknowledge Impact
          </button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.4);
        }
      `}} />
    </div>
  );
};

export default SDGModal;
