
import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Activity, 
  Zap, 
  BrainCircuit, 
  ShieldCheck, 
  BarChart3,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Info
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
  Legend
} from 'recharts';
import { predictPollutionHybrid, HybridPredictionResult } from '../src/services/quantumAIService';

interface PredictionDashboardProps {
  city?: string;
}

const PredictionDashboard: React.FC<PredictionDashboardProps> = ({ city = "New Delhi" }) => {
  const [predictionData, setPredictionData] = useState<HybridPredictionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const result = predictPollutionHybrid(city);
      setPredictionData(result);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [city]);

  if (loading || !predictionData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 animate-pulse">
        <div className="w-20 h-20 rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin"></div>
        <div className="text-center">
          <h3 className="text-xl font-black text-white uppercase tracking-widest">Running Hybrid Inference</h3>
          <p className="text-slate-500 font-mono text-sm mt-2">Mapping classical features to 4096-dim Hilbert space...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter mb-2">Prediction Dashboard</h2>
          <p className="text-slate-500 text-lg font-medium">Hybrid Quantum-Classical AQI Forecasting for <span className="text-cyan-400 font-bold">{city}</span>.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Model Confidence</span>
            <span className="text-xl font-mono font-black text-emerald-400">{(predictionData.metrics.confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="h-10 w-px bg-slate-800"></div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quantum Advantage</span>
            <span className="text-xl font-mono font-black text-cyan-400">{predictionData.metrics.accuracyImprovement}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass p-8 rounded-[40px] border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <TrendingUp size={120} className="text-cyan-400" />
            </div>
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">24-Hour AQI Forecast</h3>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-slate-600"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Classical LSTM</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-cyan-400"></div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase">Hybrid Quantum</span>
                </div>
              </div>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictionData.predictions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#475569" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    interval={3}
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Line 
                    type="monotone" 
                    dataKey="classical" 
                    stroke="#475569" 
                    strokeWidth={2} 
                    dot={false} 
                    strokeDasharray="5 5"
                    name="Classical Baseline"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hybrid" 
                    stroke="#22d3ee" 
                    strokeWidth={4} 
                    dot={false}
                    name="Hybrid Quantum-AI"
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-3xl border border-slate-800 flex items-center gap-6">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <BrainCircuit className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Feature Mapping</div>
                <div className="text-xl font-black text-white">Quantum Kernel</div>
                <p className="text-xs text-slate-500 mt-1">Non-linear projection into high-dim Hilbert space improves pattern recognition.</p>
              </div>
            </div>
            <div className="glass p-6 rounded-3xl border border-slate-800 flex items-center gap-6">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <Zap className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Inference Speed</div>
                <div className="text-xl font-black text-white">12.4ms Latency</div>
                <p className="text-xs text-slate-500 mt-1">Optimized hybrid circuit execution on simulator-backed hardware.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Metrics & Explainability */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-8 rounded-[40px] border border-slate-800">
            <div className="flex items-center gap-3 mb-8">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Model Comparison</h3>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Classical RMSE</span>
                  <span className="text-lg font-mono font-black text-white">{predictionData.metrics.classicalRMSE.toFixed(2)}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-600 w-[85%]"></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Hybrid RMSE</span>
                  <div className="flex items-center gap-2">
                    <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                    <span className="text-lg font-mono font-black text-cyan-400">{predictionData.metrics.hybridRMSE.toFixed(2)}</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '30%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                  ></motion.div>
                </div>
              </div>

              <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Accuracy Boost</span>
                </div>
                <div className="text-3xl font-black text-white tracking-tighter">
                  +{predictionData.metrics.accuracyImprovement}
                </div>
                <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                  Hybrid learning architecture reduces error variance by capturing complex atmospheric non-linearities.
                </p>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[40px] border border-slate-800">
            <div className="flex items-center gap-3 mb-8">
              <Clock className="w-5 h-5 text-amber-400" />
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Feature Attribution</h3>
            </div>

            <div className="space-y-6">
              {predictionData.explainability.map((item) => (
                <div key={item.feature} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">{item.feature}</span>
                    <span className="text-white">{(item.importance * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-slate-600" 
                      style={{ width: `${(item.importance - item.quantumContribution) * 100}%` }}
                    ></div>
                    <div 
                      className="h-full bg-cyan-400" 
                      style={{ width: `${item.quantumContribution * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-end">
                    <span className="text-[8px] font-bold text-cyan-400 uppercase">+{ (item.quantumContribution * 100).toFixed(0) }% Quantum Gain</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionDashboard;
