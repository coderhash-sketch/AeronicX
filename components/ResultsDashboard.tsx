
import React, { useMemo } from 'react';
import { 
  Shield, 
  Wind, 
  Zap, 
  DollarSign, 
  Download, 
  CheckCircle2, 
  Trophy, 
  Star,
  Leaf,
  Globe,
  Trees,
  TrendingDown,
  Info
} from 'lucide-react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  ReferenceLine
} from 'recharts';
import { MaterialCandidate } from '../types';

import { simulateVQEAdsorption } from '../src/services/quantumAIService';

interface ResultsDashboardProps {
  selectedMaterial: MaterialCandidate;
  materials: MaterialCandidate[];
  onSelect: (material: MaterialCandidate) => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ selectedMaterial, materials, onSelect }) => {
  const vqeData = useMemo(() => simulateVQEAdsorption(selectedMaterial.metal), [selectedMaterial.id]);

  const globalRank = useMemo(() => {
    const ranked = materials.map(m => ({
      id: m.id,
      score: parseFloat(simulateVQEAdsorption(m.metal).efficiencyScore)
    })).sort((a, b) => b.score - a.score);
    return ranked.findIndex(r => r.id === selectedMaterial.id) + 1;
  }, [materials, selectedMaterial.id]);

  const metrics = [
    { label: 'CO₂ Adsorption', value: selectedMaterial.adsorption, icon: Wind, color: 'text-cyan-400' },
    { label: 'Surface Area', value: selectedMaterial.surfaceArea, icon: Shield, color: 'text-magenta-400' },
    { label: 'VQE Binding Energy', value: `${vqeData.finalEnergy.toFixed(3)} Hartree`, icon: Zap, color: 'text-lime-400' },
    { label: 'Quantum Efficiency', value: `${vqeData.efficiencyScore}%`, icon: Trophy, color: 'text-blue-400' },
  ];

  // Helper to parse values for the chart
  const chartData = useMemo(() => {
    return materials.map(m => ({
      id: m.id,
      name: m.name,
      adsorption: parseFloat(m.adsorption.split(' ')[0]),
      cost: parseFloat(m.cost.replace('$', '').split('/')[0]),
      color: m.metalColor,
      isSelected: m.id === selectedMaterial.id
    }));
  }, [materials, selectedMaterial.id]);

  // Climate Impact Calculations (SDG 13)
  const climateImpact = useMemo(() => {
    const ads = parseFloat(selectedMaterial.adsorption.split(' ')[0]);
    const cost = parseFloat(selectedMaterial.cost.replace('$', '').split('/')[0]);
    
    // Theoretical capture potential (arbitrary formula for prototype)
    const annualCaptureTons = (ads * 1200) / 1000; // Tons per unit deployment
    const treesEquivalent = Math.floor(annualCaptureTons * 45); // 1 ton CO2 ~ 45 trees/year
    const sustainabilityScore = Math.min(100, Math.max(0, (ads * 5) - (cost * 2)));
    
    return {
      annualCaptureTons: annualCaptureTons.toFixed(1),
      treesEquivalent,
      sustainabilityScore,
      rating: sustainabilityScore > 80 ? 'Exceptional' : sustainabilityScore > 60 ? 'High' : 'Moderate'
    };
  }, [selectedMaterial]);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(selectedMaterial, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AeronicX_${selectedMaterial.name}.json`;
    link.click();
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{data.id}</p>
          <p className="text-xs font-bold text-white mb-2">{data.name}</p>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between gap-4">
              <span className="text-[10px] text-slate-400 uppercase">Adsorption:</span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">{data.adsorption} mmol/g</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[10px] text-slate-400 uppercase">Cost:</span>
              <span className="text-[10px] font-mono text-blue-400 font-bold">${data.cost}/kg</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Material Selector Ribbon */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Discovery Repository</span>
        <div className="grid grid-cols-5 gap-3">
          {materials.map((m) => (
            <button
              key={m.id}
              onClick={() => onSelect(m)}
              className={`p-4 rounded-2xl border transition-all relative group overflow-hidden flex flex-col items-center justify-center min-h-[100px] ${
                selectedMaterial.id === m.id 
                  ? 'bg-white/10 border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.1)] scale-110 z-10' 
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-4xl font-mono font-black" style={{ color: m.metalColor }}>{m.metal}</span>
                <span className={`text-[10px] font-bold uppercase tracking-tighter ${selectedMaterial.id === m.id ? 'text-white' : 'text-slate-500'}`}>
                  {m.id}
                </span>
              </div>
              {selectedMaterial.id === m.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 shadow-[0_-2px_15px_rgba(255,255,255,0.3)]" style={{ backgroundColor: m.metalColor }}></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Discovery Card */}
      <div className="glass rounded-3xl p-6 border-slate-800 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4">
          <Trophy className="w-12 h-12 opacity-5 text-white group-hover:opacity-10 transition-opacity" />
        </div>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: `${selectedMaterial.metalColor}20`, border: `1px solid ${selectedMaterial.metalColor}40` }}>
            <Star className="w-5 h-5" style={{ color: selectedMaterial.metalColor }} />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight text-white">{selectedMaterial.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-mono text-slate-100 font-bold bg-slate-900/50 px-2 py-0.5 rounded border border-slate-700/50 shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                {selectedMaterial.formula}
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 bg-lime-400 text-slate-950 rounded uppercase tracking-tighter">
                Rank #{globalRank}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-lime-400/10 border border-lime-400/20 rounded-2xl p-4 mb-6 flex items-center gap-4 animate-in fade-in slide-in-from-left-4">
          <div className="bg-lime-400 rounded-full p-1.5 shadow-[0_0_15px_rgba(132,204,22,0.4)]">
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-lime-400 tracking-widest">{selectedMaterial.highlightLabel}</span>
            <span className="text-sm font-bold text-white">{selectedMaterial.highlightMetric}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {metrics.map((m, i) => (
            <div key={i} className="bg-slate-900/40 rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-colors shadow-inner">
              <div className="flex items-center gap-2 mb-2">
                <m.icon className={`w-4 h-4 ${m.color}`} />
                <span className="text-[10px] uppercase text-slate-400 font-black tracking-widest">{m.label}</span>
              </div>
              <div className="text-3xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                {m.value.split(' ')[0]}
                <span className="text-xs font-bold text-slate-500 ml-1 uppercase">{m.value.split(' ')[1] || ''}</span>
              </div>
            </div>
          ))}
        </div>

        {/* SDG 13: Climate Action Impact Section */}
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute -top-4 -right-4 opacity-10">
            <Globe className="w-24 h-24 text-emerald-400 animate-spin-slow" />
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">SDG 13: Climate Impact Analysis</span>
          </div>

          <div className="grid grid-cols-2 gap-6 relative z-10">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <TrendingDown className="w-3 h-3" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Annual Sequestration</span>
              </div>
              <div className="text-2xl font-black text-white tracking-tighter">
                {climateImpact.annualCaptureTons}
                <span className="text-[10px] font-bold text-emerald-400 ml-1 uppercase">kt CO₂ / yr</span>
              </div>
              <p className="text-[9px] text-slate-500 font-medium leading-tight mt-1">
                Equivalent to planting <span className="text-emerald-400 font-bold">{climateImpact.treesEquivalent.toLocaleString()}</span> mature trees annually.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Trees className="w-3 h-3" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Sustainability Rating</span>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-black text-white tracking-tighter">
                  {climateImpact.sustainabilityScore}
                  <span className="text-[10px] font-bold text-slate-500 ml-1 uppercase">/100</span>
                </div>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                  climateImpact.rating === 'Exceptional' ? 'bg-emerald-500 text-white' : 'bg-lime-500 text-slate-950'
                }`}>
                  {climateImpact.rating}
                </span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-lime-500 to-emerald-500 transition-all duration-1000" 
                  style={{ width: `${climateImpact.sustainabilityScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quantum Adsorption Profile */}
        <div className="mt-6 glass p-5 rounded-3xl border border-lime-500/20 bg-lime-500/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-lime-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-lime-400">Quantum VQE Adsorption Profile</span>
            </div>
            <span className="text-[9px] font-mono text-slate-500 uppercase">Ansatz: {vqeData.ansatz}</span>
          </div>
          <div className="flex gap-6 items-center">
            <div className="flex-1 h-16 relative">
              <svg width="100%" height="100%" viewBox="0 0 200 60" preserveAspectRatio="none">
                <path 
                  d={`M ${vqeData.convergencePath.map((d: any, i: number) => `${(i / vqeData.convergencePath.length) * 200},${40 - (d.energy + 10) * 2}`).join(' L ')}`}
                  fill="none"
                  stroke="#84cc16"
                  strokeWidth="1.5"
                  strokeOpacity="0.6"
                />
              </svg>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Ground State Energy</span>
              <span className="text-sm font-mono font-black text-white">{vqeData.finalEnergy.toFixed(5)} Ha</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Efficiency Plot */}
      <div className="glass rounded-3xl p-6 border-slate-800 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Efficiency Frontier Plot</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
              <span className="text-[8px] font-bold text-slate-500 uppercase">Adsorption</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              <span className="text-[8px] font-bold text-slate-500 uppercase">Cost</span>
            </div>
          </div>
        </div>

        <div className="h-[180px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
              <XAxis 
                type="number" 
                dataKey="adsorption" 
                name="Adsorption" 
                unit=" mmol/g" 
                stroke="#475569" 
                fontSize={8}
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <YAxis 
                type="number" 
                dataKey="cost" 
                name="Cost" 
                unit="$" 
                stroke="#475569" 
                fontSize={8}
                tickLine={false}
                axisLine={false}
                domain={[0, 'dataMax + 5']}
              />
              <ZAxis type="number" range={[60, 400]} />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#334155' }} />
              
              {/* Reference lines for average performance */}
              <ReferenceLine x={15} stroke="#334155" strokeDasharray="3 3" />
              <ReferenceLine y={15} stroke="#334155" strokeDasharray="3 3" />

              <Scatter 
                name="Materials" 
                data={chartData} 
                onClick={(data) => {
                  const material = materials.find(m => m.id === data.id);
                  if (material) onSelect(material);
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke={entry.isSelected ? '#fff' : 'transparent'}
                    strokeWidth={entry.isSelected ? 2 : 0}
                    className="cursor-pointer transition-all hover:opacity-80"
                    style={{
                      filter: entry.isSelected ? `drop-shadow(0 0 8px ${entry.color})` : 'none'
                    }}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-900/50 rounded-xl border border-slate-800">
          <Info className="w-3 h-3 text-slate-500" />
          <p className="text-[9px] text-slate-500 font-medium">
            Top-right quadrant represents high-performance materials. Selected: <span className="text-white font-bold">{selectedMaterial.name}</span>
          </p>
        </div>
      </div>

      <button 
        onClick={exportData}
        className="mt-auto w-full flex items-center justify-center gap-3 py-5 bg-white text-slate-950 hover:bg-slate-100 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1 active:scale-95"
      >
        <Download className="w-4 h-4" /> Download Atomic Spec
      </button>
    </div>
  );
};

export default ResultsDashboard;
