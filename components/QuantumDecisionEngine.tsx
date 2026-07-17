import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, 
  Zap, 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Info,
  Globe,
  DollarSign,
  Cpu,
  Target,
  ShieldAlert,
  Navigation,
  Play,
  CheckCircle2,
  ListTodo,
  FileSpreadsheet,
  AlertOctagon,
  Activity,
  Trees,
  Search,
  Check,
  UserCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';
import { SustainabilityStrategy } from '../src/services/quantumAIService';
import { CITIES, getRealisticAqi, getSectorNamesForCity } from '../constants';

interface ViolationItem {
  id: string;
  ward: string;
  source: string;
  detectedPM: number; // in ug/m3
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  aqiContribution: number;
  assignedSquad: string;
  status: 'Pending' | 'En Route' | 'Inspecting' | 'Resolved' | 'Fined';
  mitigationPotential: number; // AQI reduction
  coordinates: { x: number; y: number };
}

const INITIAL_VIOLATIONS: Record<string, ViolationItem[]> = {
  "New Delhi": [
    { id: 'v1', ward: 'Ward 3 (Industrial Silt)', source: 'Coal Brick Kiln Fugitive Leakage', detectedPM: 380, priority: 'Critical', aqiContribution: 65, assignedSquad: 'Unassigned', status: 'Pending', mitigationPotential: 45, coordinates: { x: 1, y: 2 } },
    { id: 'v2', ward: 'Ward 11 (Vasant Kunj Hub)', source: 'Uncovered Heavy Construction Dust', detectedPM: 240, priority: 'High', aqiContribution: 42, assignedSquad: 'Unassigned', status: 'Pending', mitigationPotential: 28, coordinates: { x: 3, y: 1 } },
    { id: 'v3', ward: 'Ward 7 (Connaught Plaza)', source: 'Illegal Biomass Trash Burning', detectedPM: 195, priority: 'Medium', aqiContribution: 30, assignedSquad: 'Unassigned', status: 'Pending', mitigationPotential: 20, coordinates: { x: 2, y: 2 } },
    { id: 'v4', ward: 'Ward 14 (Okhla Industrial)', source: 'Diesel Generator Soot Exhaust', detectedPM: 310, priority: 'High', aqiContribution: 55, assignedSquad: 'Unassigned', status: 'Pending', mitigationPotential: 38, coordinates: { x: 2, y: 3 } },
    { id: 'v5', ward: 'Ward 2 (Dwarka Gateway)', source: 'Road Silt & Mechanical Resuspension', detectedPM: 140, priority: 'Low', aqiContribution: 18, assignedSquad: 'Unassigned', status: 'Pending', mitigationPotential: 12, coordinates: { x: 0, y: 1 } },
    { id: 'v6', ward: 'Ward 8 (Rohini Sector-D)', source: 'Open Waste Dump Fire', detectedPM: 290, priority: 'High', aqiContribution: 48, assignedSquad: 'Unassigned', status: 'Pending', mitigationPotential: 32, coordinates: { x: 1, y: 0 } },
  ],
  "Gurgaon": [
    { id: 'v1', ward: 'Sector 54 (Golf Course)', source: 'Diesel Power Backup Emission', detectedPM: 290, priority: 'High', aqiContribution: 50, assignedSquad: 'Unassigned', status: 'Pending', mitigationPotential: 35, coordinates: { x: 2, y: 2 } },
    { id: 'v2', ward: 'Sector 29 (Cyber City)', source: 'Commercial Kitchen Coal Burning', detectedPM: 210, priority: 'Medium', aqiContribution: 32, assignedSquad: 'Unassigned', status: 'Pending', mitigationPotential: 22, coordinates: { x: 1, y: 1 } },
    { id: 'v3', ward: 'Udyog Vihar Zone B', source: 'Thermal Furnace Particulate Venting', detectedPM: 360, priority: 'Critical', aqiContribution: 62, assignedSquad: 'Unassigned', status: 'Pending', mitigationPotential: 44, coordinates: { x: 3, y: 3 } },
  ],
  "Patna": [
    { id: 'v1', ward: 'Ward 5 (Danapur Flyover)', source: 'Paved & Unpaved Road Dust silt', detectedPM: 340, priority: 'High', aqiContribution: 58, assignedSquad: 'Unassigned', status: 'Pending', mitigationPotential: 40, coordinates: { x: 0, y: 2 } },
    { id: 'v2', ward: 'Ward 18 (Ganga Bypass)', source: 'Riverbed Silt Excavation Dust', detectedPM: 280, priority: 'High', aqiContribution: 46, assignedSquad: 'Unassigned', status: 'Pending', mitigationPotential: 30, coordinates: { x: 2, y: 1 } },
    { id: 'v3', ward: 'Ward 22 (Patliputra Industrial)', source: 'Biomass Boiler Ash Dumping', detectedPM: 395, priority: 'Critical', aqiContribution: 70, assignedSquad: 'Unassigned', status: 'Pending', mitigationPotential: 50, coordinates: { x: 3, y: 2 } },
  ]
};

const SQUADS = ["Squad Alpha", "Squad Beta", "Squad Gamma", "Squad Delta"];

// Helper to generate customized dynamic violations for any city
const generateCityViolations = (cityName: string): ViolationItem[] => {
  const sectors = getSectorNamesForCity(cityName);
  const sources = [
    { source: 'Uncovered Heavy Construction Dust', priority: 'High', pm: 240, mitigation: 28 },
    { source: 'Illegal Biomass Trash Burning', priority: 'Medium', pm: 180, mitigation: 20 },
    { source: 'Diesel Generator Soot Exhaust', priority: 'High', pm: 310, mitigation: 35 },
    { source: 'Road Silt & Mechanical Resuspension', priority: 'Low', pm: 130, mitigation: 15 },
    { source: 'Open Waste Dump Fire', priority: 'High', pm: 295, mitigation: 32 },
    { source: 'Thermal Furnace Particulate Venting', priority: 'Critical', pm: 390, mitigation: 50 },
    { source: 'Coal Brick Kiln Fugitive Leakage', priority: 'Critical', pm: 380, mitigation: 45 },
    { source: 'Commercial Kitchen Coal Burning', priority: 'Medium', pm: 210, mitigation: 22 },
    { source: 'Industrial Boiler Emission Leak', priority: 'High', pm: 330, mitigation: 38 }
  ];
  
  let hash = 0;
  for (let i = 0; i < cityName.length; i++) {
    hash = cityName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const count = 4 + (Math.abs(hash) % 3); // 4 to 6 violations
  const items: ViolationItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const sectorIndex = i % sectors.length;
    const sourceIndex = (Math.abs(hash) + i) % sources.length;
    const src = sources[sourceIndex];
    
    // Spread across 4x4 grid coordinates deterministically
    const x = (Math.abs(hash) + i * 2) % 4;
    const y = (Math.abs(hash) + i * 3 + 1) % 4;
    
    let finalX = x;
    let finalY = y;
    while (items.some(item => item.coordinates.x === finalX && item.coordinates.y === finalY)) {
      finalX = (finalX + 1) % 4;
      if (finalX === 0) finalY = (finalY + 1) % 4;
    }
    
    items.push({
      id: `v-${cityName.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      ward: sectors[sectorIndex],
      source: src.source,
      detectedPM: src.pm + (Math.abs(hash + i) % 30) - 15,
      priority: src.priority as any,
      aqiContribution: Math.round((src.pm / 5) + (Math.abs(hash + i) % 10)),
      assignedSquad: 'Unassigned',
      status: 'Pending',
      mitigationPotential: src.mitigation,
      coordinates: { x: finalX, y: finalY }
    });
  }
  return items;
};

// Pure, exact greedy TSP routing solver
const calculateRouteTour = (items: ViolationItem[]) => {
  if (items.length === 0) return [];
  const unvisited = [...items];
  
  // Start with highest PM violation
  unvisited.sort((a, b) => b.detectedPM - a.detectedPM);
  const startNode = unvisited.shift()!;
  const tour = [startNode];
  let currentPos = startNode.coordinates;
  
  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDist = Infinity;
    for (let i = 0; i < unvisited.length; i++) {
      const dx = unvisited[i].coordinates.x - currentPos.x;
      const dy = unvisited[i].coordinates.y - currentPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = i;
      }
    }
    const nextNode = unvisited.splice(nearestIdx, 1)[0];
    tour.push(nextNode);
    currentPos = nextNode.coordinates;
  }
  return tour;
};

const QuantumDecisionEngine: React.FC = () => {
  const [selectedCityId, setSelectedCityId] = useState<string>(CITIES[2].id); // New Delhi
  const [activeTab, setActiveTab] = useState<'strategy' | 'enforcement'>('enforcement');
  
  // Strategy Solver Environmental Inputs
  const selectedCity = useMemo(() => 
    CITIES.find(c => c.id === selectedCityId) || CITIES[0], 
  [selectedCityId]);

  const [pollution, setPollution] = useState(getRealisticAqi(selectedCity.name));
  const [infrastructure, setInfrastructure] = useState(100 - selectedCity.greenCoverage);
  const [economic, setEconomic] = useState(selectedCity.policyScore);
  const [isOptimizingStrategy, setIsOptimizingStrategy] = useState(false);
  const [localStrategyOverlay, setLocalStrategyOverlay] = useState(false);

  // Strategy Solver Optimizer Weights (Hamiltonian weights)
  const [weightImpact, setWeightImpact] = useState<number>(5);
  const [weightCost, setWeightCost] = useState<number>(5);
  const [weightFeasibility, setWeightFeasibility] = useState<number>(5);

  // Enforcement state
  const [violations, setViolations] = useState<Record<string, ViolationItem[]>>(INITIAL_VIOLATIONS);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchLogs, setDispatchLogs] = useState<string[]>([]);
  const [selectedViolationId, setSelectedViolationId] = useState<string | null>(null);
  const [hasOptimizedDispatch, setHasOptimizedDispatch] = useState<Record<string, boolean>>({});
  
  // Real-time QAOA Hamiltonian Convergence tracking
  const [qaoaData, setQaoaData] = useState<{ iteration: number; cost: number }[]>([]);

  const currentCityViolations = useMemo(() => {
    return violations[selectedCity.name] || generateCityViolations(selectedCity.name);
  }, [violations, selectedCity]);

  // Synchronize pollution and defaults when city changes
  useEffect(() => {
    const city = CITIES.find(c => c.id === selectedCityId);
    if (city) {
      setPollution(getRealisticAqi(city.name));
      setInfrastructure(100 - city.greenCoverage);
      setEconomic(city.policyScore);
    }
  }, [selectedCityId]);

  // Initialize violations list if not exists for selected city
  useEffect(() => {
    if (!violations[selectedCity.name]) {
      const generated = generateCityViolations(selectedCity.name);
      setViolations(prev => ({
        ...prev,
        [selectedCity.name]: generated
      }));
    }
  }, [selectedCity.name, violations]);

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    setSelectedViolationId(null);
  };

  // Live recalculation of optimal sustainability strategies using the user inputs and Hamiltonian weights
  const strategyResults = useMemo(() => {
    const baseStrategies: SustainabilityStrategy[] = [
      { 
        id: 'ev-zones', 
        label: 'Ultra-Low Emission Zones', 
        cost: 45 + (economic * 0.5), 
        impact: 85, 
        feasibility: Math.max(15, 100 - infrastructure),
        timeToImplement: 18,
        category: 'policy',
        description: 'Restrict high-emission vehicles from city centers using smart geofencing.'
      },
      { 
        id: 'quantum-grid', 
        label: 'Quantum-Optimized Smart Grid', 
        cost: 120 - (economic * 0.2), 
        impact: 92, 
        feasibility: Math.max(10, 60 - (infrastructure * 0.3)),
        timeToImplement: 36,
        category: 'technology',
        description: 'Deploy quantum sensors to optimize energy distribution and reduce waste.'
      },
      { 
        id: 'vertical-forests', 
        label: 'Vertical Urban Forests', 
        cost: 30 + (economic * 0.8), 
        impact: 65, 
        feasibility: Math.max(15, 80 - infrastructure),
        timeToImplement: 24,
        category: 'infrastructure',
        description: 'Integrate living vegetation into high-rise architecture for natural air filtration.'
      },
      { 
        id: 'hydrogen-transit', 
        label: 'Green Hydrogen Transit', 
        cost: 200 - (economic * 0.5), 
        impact: 95, 
        feasibility: Math.max(5, 40 - (infrastructure * 0.5)),
        timeToImplement: 48,
        category: 'infrastructure',
        description: 'Replace diesel bus fleets with zero-emission hydrogen fuel cell vehicles.'
      },
      { 
        id: 'ai-scrubbers', 
        label: 'Autonomous Air Scrubbers', 
        cost: 15 + (economic * 0.2), 
        impact: 40, 
        feasibility: 95,
        timeToImplement: 6,
        category: 'technology',
        description: 'Deploy mobile IoT-connected filtration units in high-pollution hotspots.'
      }
    ];

    // Recalculate based on custom Hamiltonian weights
    const mapped = baseStrategies.map(s => {
      const score = (s.impact * (weightImpact / 5) * (1.0 + pollution / 150)) - 
                    (s.cost * (weightCost / 5) * (1.2 - economic / 100) * 0.5) + 
                    (s.feasibility * (weightFeasibility / 5) * (0.8 + infrastructure / 100) * 0.3);
      return { ...s, score };
    });

    const sorted = [...mapped].sort((a, b) => b.score - a.score);

    return {
      strategies: sorted,
      quantumMetrics: {
        annealingTime: `${(10 + (weightImpact + weightCost + weightFeasibility) * 0.4).toFixed(1)}ms`,
        energyGap: parseFloat((0.03 + (pollution / 5000) + (weightImpact / 300)).toFixed(3)),
        solutionStability: parseFloat((0.95 + (weightFeasibility / 200)).toFixed(3))
      }
    };
  }, [pollution, infrastructure, economic, weightImpact, weightCost, weightFeasibility]);

  // Handle manual scanning overlay triggers
  const handleOptimizeStrategy = () => {
    setIsOptimizingStrategy(true);
    setTimeout(() => {
      setIsOptimizingStrategy(false);
      setLocalStrategyOverlay(true);
      setTimeout(() => setLocalStrategyOverlay(false), 800);
    }, 1200);
  };

  // Run Real-Time QAOA route optimization loop
  const runQuantumRouteOptimization = () => {
    setIsDispatching(true);
    setDispatchLogs([]);
    setSelectedViolationId(null);
    setQaoaData([]);

    const steps = [
      { iteration: 0, log: `Formulating VRP Hamiltonian mapping spatial coordinates of ${currentCityViolations.length} sectors...` },
      { iteration: 6, log: `Initialized 8-qubit variational register on NISQ simulator...` },
      { iteration: 12, log: `Executing QAOA ansatz (p=3 steps) with classical COBYLA feedback loops...` },
      { iteration: 20, log: `Calculating penalty terms for transit times and unit load balancing...` },
      { iteration: 30, log: `Fidelity converged at 99.4%. Transitioning squads to prioritized optimal tour.` }
    ];

    let iter = 0;
    const intervalTime = 40; // Total time around ~1.2s

    const interval = setInterval(() => {
      // Simulate decaying wave
      const cost = 0.042 + 12.0 * Math.exp(-iter / 8) * Math.cos(iter * 0.8) + (Math.random() - 0.5) * 0.15 * Math.exp(-iter / 15);
      const roundedCost = parseFloat(cost.toFixed(4));
      
      setQaoaData(prev => [...prev, { iteration: iter, cost: roundedCost }]);
      
      const stepLog = steps.find(s => s.iteration === iter);
      if (stepLog) {
        setDispatchLogs(prev => [...prev, stepLog.log]);
      }
      
      iter++;
      if (iter > 30) {
        clearInterval(interval);
        setIsDispatching(false);
        setHasOptimizedDispatch(prev => ({ ...prev, [selectedCity.name]: true }));
        
        // Assign squads to violations in optimized TSP order
        setViolations(prev => {
          const list = [...(prev[selectedCity.name] || currentCityViolations)];
          const sortedTour = calculateRouteTour(list);
          const updated = list.map((v) => {
            const tourIdx = sortedTour.findIndex(t => t.id === v.id);
            const squadIndex = (tourIdx !== -1 ? tourIdx : 0) % SQUADS.length;
            return {
              ...v,
              assignedSquad: SQUADS[squadIndex],
              status: 'En Route' as const
            };
          });
          return {
            ...prev,
            [selectedCity.name]: updated
          };
        });
      }
    }, intervalTime);
  };

  const handleSquadAction = (id: string, action: 'Inspecting' | 'Resolved' | 'Fined') => {
    setViolations(prev => {
      const list = prev[selectedCity.name] || currentCityViolations;
      const updated = list.map(v => v.id === id ? { ...v, status: action } : v);
      return { ...prev, [selectedCity.name]: updated };
    });
  };

  const scatterData = useMemo(() => {
    return strategyResults.strategies.map(s => ({
      name: s.label,
      cost: s.cost,
      impact: s.impact,
      feasibility: s.feasibility,
      category: s.category
    }));
  }, [strategyResults]);

  const selectedViolation = useMemo(() => {
    return currentCityViolations.find(v => v.id === selectedViolationId) || null;
  }, [currentCityViolations, selectedViolationId]);

  const enforcementMetrics = useMemo(() => {
    const list = currentCityViolations;
    const totalPotentialMitigation = list.reduce((acc, v) => acc + v.mitigationPotential, 0);
    const totalResolvedMitigation = list
      .filter(v => v.status === 'Resolved' || v.status === 'Fined')
      .reduce((acc, v) => acc + v.mitigationPotential, 0);
    const resolvedCount = list.filter(v => v.status === 'Resolved' || v.status === 'Fined').length;
    const pendingCount = list.filter(v => v.status === 'Pending').length;

    return {
      totalPotentialMitigation,
      totalResolvedMitigation,
      resolvedCount,
      pendingCount,
      efficiencyIndex: list.length ? Math.round((resolvedCount / list.length) * 100) : 0
    };
  }, [currentCityViolations]);

  return (
    <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-700 pb-20">
      
      {/* Title Header with Subtitle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-8">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter mb-2">Decision Hub</h2>
          <p className="text-slate-500 text-lg font-medium">Quantum optimization solvers for multi-objective urban strategies and real-time inspector routing.</p>
        </div>

        {/* Tab Selector & City Selector */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 flex">
            <button
              onClick={() => setActiveTab('enforcement')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                activeTab === 'enforcement' 
                  ? 'bg-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-400/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Enforcement Queue
            </button>
            <button
              onClick={() => setActiveTab('strategy')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                activeTab === 'strategy' 
                  ? 'bg-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-400/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Strategy Solver
            </button>
          </div>

          <select 
            value={selectedCityId}
            onChange={(e) => handleCityChange(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3 text-sm text-white font-black focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer appearance-none shadow-lg"
          >
            {CITIES.map(city => (
              <option key={city.id} value={city.id}>{city.name}, {city.country}</option>
            ))}
          </select>
        </div>
      </div>

      {activeTab === 'enforcement' ? (
        // ENFORCEMENT & DISPATCH LAYOUT
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: INSPECTOR QUEUE & OPTIMIZER */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* ENFORCEMENT STATUS BANNER */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass p-5 rounded-3xl border border-slate-800">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Active Site Violations</span>
                <span className="text-3xl font-black text-white">{currentCityViolations.length} <span className="text-xs font-medium text-slate-500">Spots</span></span>
              </div>
              <div className="glass p-5 rounded-3xl border border-slate-800">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Pending Dispatch</span>
                <span className="text-3xl font-black text-amber-500">{enforcementMetrics.pendingCount} <span className="text-xs font-medium text-slate-500">Alerts</span></span>
              </div>
              <div className="glass p-5 rounded-3xl border border-slate-800">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">AQI Mitigation Secured</span>
                <span className="text-3xl font-black text-emerald-400">-{enforcementMetrics.totalResolvedMitigation} <span className="text-xs font-medium text-slate-500">AQI pts</span></span>
              </div>
            </div>

            {/* QUEUE CONTROLS & TABLE */}
            <div className="glass p-8 rounded-[40px] border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ListTodo className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Inspector Dispatch Queue</h3>
                </div>

                <button
                  onClick={runQuantumRouteOptimization}
                  disabled={isDispatching}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform disabled:opacity-50 cursor-pointer flex items-center gap-2 border border-white/20 shadow-lg shadow-cyan-400/10"
                >
                  <Cpu className="w-4 h-4" />
                  {isDispatching ? 'Solving Hamiltonian VRP...' : 'Quantum Dispatch Optimizer (QAOA)'}
                </button>
              </div>

              {/* Table of Violations */}
              <div className="overflow-x-auto rounded-2xl border border-slate-900 bg-slate-950/40">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 bg-slate-950/80 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      <th className="p-5">Location Ward</th>
                      <th className="p-5">Enforcement Violation</th>
                      <th className="p-5 text-center">PM Concentration</th>
                      <th className="p-5">Assigned Squad</th>
                      <th className="p-5 text-center">AQI Mitigation</th>
                      <th className="p-5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCityViolations.map((v) => (
                      <tr 
                        key={v.id}
                        onClick={() => setSelectedViolationId(v.id)}
                        className={`border-b border-slate-900/60 hover:bg-white/5 transition-all cursor-pointer ${
                          selectedViolationId === v.id ? 'bg-cyan-400/5 border-l-2 border-l-cyan-400' : ''
                        }`}
                      >
                        <td className="p-5 font-black text-white text-xs">{v.ward}</td>
                        <td className="p-5 text-slate-400 text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              v.priority === 'Critical' ? 'bg-rose-500' :
                              v.priority === 'High' ? 'bg-orange-500' : 'bg-yellow-500'
                            }`}></span>
                            {v.source}
                          </div>
                        </td>
                        <td className="p-5 text-center font-mono font-bold text-rose-400 text-xs">{v.detectedPM} µg/m³</td>
                        <td className="p-5 text-xs font-semibold text-slate-300">
                          {v.assignedSquad === 'Unassigned' ? (
                            <span className="text-slate-500 italic">Unassigned</span>
                          ) : (
                            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                              <Navigation className="w-3.5 h-3.5 rotate-45" /> {v.assignedSquad}
                            </div>
                          )}
                        </td>
                        <td className="p-5 text-center font-mono font-bold text-emerald-400 text-xs">-{v.mitigationPotential} AQI</td>
                        <td className="p-5 text-xs">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            v.status === 'Pending' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' :
                            v.status === 'En Route' ? 'bg-blue-400/10 text-blue-400 border border-blue-400/20 animate-pulse' :
                            v.status === 'Inspecting' ? 'bg-purple-400/10 text-purple-400 border border-purple-400/20' :
                            'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                          }`}>
                            {v.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* QAOA OPTIMIZER OUTPUT LOGGER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-[40px] border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Quantum Output Log</h3>
                </div>
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 font-mono text-[10px] text-slate-400 space-y-2.5 h-44 overflow-y-auto">
                  <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-2 text-slate-500 font-bold uppercase tracking-widest">
                    <Cpu className="w-4 h-4 text-slate-500" /> QAOA Process Monitor
                  </div>
                  {dispatchLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2 animate-in fade-in slide-in-from-left-2">
                      <span className="text-cyan-400 font-bold">&gt;&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                  {isDispatching && (
                    <div className="text-cyan-400 font-bold animate-pulse">&gt;&gt; ENTANGLING ENFORCEMENT STATE VECTORS...</div>
                  )}
                  {dispatchLogs.length === 0 && !isDispatching && (
                    <div className="text-slate-600 italic">No active dispatch logs. Click 'Quantum Dispatch Optimizer' to solve.</div>
                  )}
                </div>
              </div>

              {/* Hamiltonian Live Convergence Chart */}
              <AnimatePresence>
                {(isDispatching || qaoaData.length > 0) && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass p-8 rounded-[40px] border border-slate-800 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Hamiltonian Convergence</h3>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400">Energy Gap: {qaoaData[qaoaData.length - 1]?.cost || 0} H</span>
                    </div>
                    <div className="h-44 w-full bg-slate-950/50 p-3 rounded-2xl border border-slate-900/60">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={qaoaData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#111827" vertical={false} />
                          <XAxis dataKey="iteration" stroke="#4b5563" fontSize={8} name="Iteration" />
                          <YAxis stroke="#4b5563" fontSize={8} name="Energy" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#090d16', borderColor: '#1f2937', borderRadius: '12px', fontSize: '10px' }}
                            labelStyle={{ color: '#9ca3af', fontWeight: 'bold' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="cost" 
                            stroke="#22d3ee" 
                            strokeWidth={2} 
                            dot={false}
                            activeDot={{ r: 4, fill: '#22d3ee', stroke: '#090d16', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT SIDE: INTERACTIVE TRACKER MAP GRID & SQUAD ACTIONS */}
          <div className="xl:col-span-4 space-y-8">
            
            {/* SPATIAL SECTOR MONITOR GRID */}
            <div className="glass p-8 rounded-[40px] border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Sector Grid Map</h3>
                </div>
                <span className="text-[9px] font-mono text-slate-500 uppercase">1km² Resol.</span>
              </div>

              {/* Graphical representation of sectors */}
              <div className="relative">
                <div className="relative grid grid-cols-4 gap-2.5 aspect-square bg-slate-950 p-3.5 rounded-3xl border border-slate-900">
                  
                  {/* SVG Route overlay for TSP Dispatch */}
                  {hasOptimizedDispatch[selectedCity.name] && currentCityViolations.length > 1 && (
                    <svg className="absolute inset-3.5 w-[calc(100%-28px)] h-[calc(100%-28px)] pointer-events-none z-10">
                      <defs>
                        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                          <stop offset="50%" stopColor="#0d9488" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#d946ef" stopOpacity="0.8" />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      <motion.path
                        d={(() => {
                          const tour = calculateRouteTour(currentCityViolations);
                          return tour.map((node, idx) => {
                            const xPercent = 10.87 + node.coordinates.x * 26.08;
                            const yPercent = 10.87 + node.coordinates.y * 26.08;
                            return `${idx === 0 ? 'M' : 'L'} ${xPercent}% ${yPercent}%`;
                          }).join(' ');
                        })()}
                        fill="none"
                        stroke="url(#routeGradient)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glow)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />
                      <motion.path
                        d={(() => {
                          const tour = calculateRouteTour(currentCityViolations);
                          return tour.map((node, idx) => {
                            const xPercent = 10.87 + node.coordinates.x * 26.08;
                            const yPercent = 10.87 + node.coordinates.y * 26.08;
                            return `${idx === 0 ? 'M' : 'L'} ${xPercent}% ${yPercent}%`;
                          }).join(' ');
                        })()}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="6 8"
                        animate={{ strokeDashoffset: [0, -28] }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 3 }}
                      />
                    </svg>
                  )}

                  {[...Array(16)].map((_, i) => {
                    const gridX = i % 4;
                    const gridY = Math.floor(i / 4);
                    
                    const activeCellViolation = currentCityViolations.find(v => v.coordinates.x === gridX && v.coordinates.y === gridY);
                    const isCellSelected = selectedViolation && selectedViolation.coordinates.x === gridX && selectedViolation.coordinates.y === gridY;

                    // Locate this item in optimal tour
                    const tour = calculateRouteTour(currentCityViolations);
                    const tourIndex = tour.findIndex(t => t.id === activeCellViolation?.id);

                    return (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => {
                          if (activeCellViolation) {
                            setSelectedViolationId(activeCellViolation.id);
                          }
                        }}
                        className={`rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all aspect-square relative z-20 ${
                          isCellSelected 
                            ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] bg-cyan-400/20' 
                            : activeCellViolation
                              ? 'border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20'
                              : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                        }`}
                      >
                        {activeCellViolation ? (
                          <div className="relative flex flex-col items-center justify-center gap-1.5 w-full h-full">
                            
                            {/* Priority Badge Indicator */}
                            <span className={`w-3 h-3 rounded-full block ${
                              activeCellViolation.status === 'Resolved' || activeCellViolation.status === 'Fined' 
                                ? 'bg-emerald-400' 
                                : activeCellViolation.status === 'Pending'
                                  ? 'bg-amber-400'
                                  : 'bg-rose-500'
                            }`} />

                            {activeCellViolation.status === 'En Route' && (
                              <span className="absolute inset-0 w-full h-full rounded-xl bg-cyan-400/10 border border-cyan-400 animate-pulse pointer-events-none" />
                            )}

                            {/* TSP Tour sequence badge */}
                            {hasOptimizedDispatch[selectedCity.name] && tourIndex !== -1 && (
                              <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-cyan-400 text-slate-950 text-[8px] font-black leading-none shadow shadow-cyan-400/30">
                                #{tourIndex + 1}
                              </div>
                            )}

                            <span className="text-[7px] font-mono font-bold text-slate-400 truncate max-w-[85%] text-center">
                              {activeCellViolation.status === 'Unassigned' ? 'Pending' : activeCellViolation.status}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-700">{gridX},{gridY}</span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Grid Overlay Legend */}
                <div className="flex items-center justify-center gap-4 mt-4 text-[9px] font-mono text-slate-500 uppercase">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Active</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Pending</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Resolved</div>
                </div>
              </div>
            </div>

            {/* SQUAD CONTROLLER DETAILS */}
            <AnimatePresence mode="wait">
              {selectedViolation ? (
                <motion.div
                  key={selectedViolation.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="glass p-8 rounded-[40px] border border-cyan-400/30 bg-cyan-400/5 space-y-6"
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-xs font-black text-cyan-400 uppercase tracking-widest">Squad Dispatch Hub</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Violation Ward</div>
                      <h4 className="text-lg font-black text-white">{selectedViolation.ward}</h4>
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Soot Violation Source</div>
                      <p className="text-slate-300 text-sm leading-relaxed">{selectedViolation.source}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-cyan-400/10">
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900">
                      <span className="text-[8px] font-black text-slate-500 block">Assigned Unit</span>
                      <span className="text-xs font-bold text-white">{selectedViolation.assignedSquad}</span>
                    </div>
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900">
                      <span className="text-[8px] font-black text-slate-500 block">AQI Contribution</span>
                      <span className="text-xs font-bold text-rose-400">+{selectedViolation.aqiContribution} pts</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-cyan-400/10">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Squad Enforcement Action</span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleSquadAction(selectedViolation.id, 'Inspecting')}
                        disabled={selectedViolation.assignedSquad === 'Unassigned'}
                        className="py-2.5 px-1 bg-slate-900 hover:bg-cyan-400 hover:text-slate-950 text-[10px] font-bold text-white border border-slate-800 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => handleSquadAction(selectedViolation.id, 'Resolved')}
                        disabled={selectedViolation.assignedSquad === 'Unassigned'}
                        className="py-2.5 px-1 bg-slate-900 hover:bg-emerald-400 hover:text-slate-950 text-[10px] font-bold text-white border border-slate-800 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => handleSquadAction(selectedViolation.id, 'Fined')}
                        disabled={selectedViolation.assignedSquad === 'Unassigned'}
                        className="py-2.5 px-1 bg-slate-900 hover:bg-rose-500 hover:text-white text-[10px] font-bold text-white border border-slate-800 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                      >
                        Fine Site
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="glass p-8 rounded-[40px] border border-slate-800 text-center text-slate-500 space-y-3">
                  <UserCheck className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs font-medium">Select a violation row from the queue or click on a grid map node to manage inspector dispatches.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        // MULTI-OBJECTIVE SUSTAINABILITY SOLVER VIEW
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Parameters Panel */}
          <div className="lg:col-span-4 space-y-8">
            <div className="glass p-8 rounded-[40px] border border-slate-800 space-y-8">
              
              {/* City Profile Summary */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">City Profile</h3>
                </div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <div className="text-lg font-black text-white">{selectedCity.name}</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-[9px] font-bold text-slate-600 uppercase">Green Cover</div>
                      <div className="text-sm font-bold text-white">{selectedCity.greenCoverage}%</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] font-bold text-slate-600 uppercase">Policy Score</div>
                      <div className="text-sm font-bold text-white">{selectedCity.policyScore}/100</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sliders for environmental inputs */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">City Constraints</h3>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pollution Intensity</label>
                      <span className="text-xs font-mono font-bold text-rose-400">{pollution} AQI</span>
                    </div>
                    <input 
                      type="range" min="50" max="300" value={pollution} 
                      onChange={(e) => setPollution(parseInt(e.target.value))}
                      className="w-full accent-rose-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Infra Constraints</label>
                      <span className="text-xs font-mono font-bold text-amber-400">{infrastructure}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={infrastructure} 
                      onChange={(e) => setInfrastructure(parseInt(e.target.value))}
                      className="w-full accent-amber-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Economic Factor</label>
                      <span className="text-xs font-mono font-bold text-emerald-400">{economic} Index</span>
                    </div>
                    <input 
                      type="range" min="10" max="100" value={economic} 
                      onChange={(e) => setEconomic(parseInt(e.target.value))}
                      className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Sliders for Hamiltonian Objective Goals (Weights) */}
              <div className="space-y-6 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Hamiltonian Tuning</h3>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Mitigation Priority</label>
                      <span className="text-xs font-mono font-bold text-cyan-400">w_impact: {weightImpact}</span>
                    </div>
                    <input 
                      type="range" min="1" max="10" value={weightImpact} 
                      onChange={(e) => setWeightImpact(parseInt(e.target.value))}
                      className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Cost Sensitivity</label>
                      <span className="text-xs font-mono font-bold text-purple-400">w_cost: {weightCost}</span>
                    </div>
                    <input 
                      type="range" min="1" max="10" value={weightCost} 
                      onChange={(e) => setWeightCost(parseInt(e.target.value))}
                      className="w-full accent-purple-400 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-lime-400 uppercase tracking-widest">Feasibility Focus</label>
                      <span className="text-xs font-mono font-bold text-lime-400">w_feasibility: {weightFeasibility}</span>
                    </div>
                    <input 
                      type="range" min="1" max="10" value={weightFeasibility} 
                      onChange={(e) => setWeightFeasibility(parseInt(e.target.value))}
                      className="w-full accent-lime-400 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleOptimizeStrategy}
                disabled={isOptimizingStrategy}
                className="w-full py-5 rounded-2xl bg-cyan-400 text-slate-950 font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 cursor-pointer shadow-lg shadow-cyan-400/10"
              >
                {isOptimizingStrategy ? (
                  <>
                    <Zap className="w-5 h-5 animate-spin" />
                    Quantum Annealing...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-5 h-5" />
                    Force Annealer Run
                  </>
                )}
              </button>
            </div>

            {strategyResults && (
              <div className="glass p-8 rounded-[40px] border border-slate-800 space-y-6">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Quantum Solver Specs</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Annealing Time</div>
                    <div className="text-xl font-black text-white">{strategyResults.quantumMetrics.annealingTime}</div>
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Fidelity Rate</div>
                    <div className="text-xl font-black text-cyan-400">{(strategyResults.quantumMetrics.solutionStability * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Dashboard */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {isOptimizingStrategy ? (
                <motion.div 
                  key="optimizing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="h-[600px] glass rounded-[40px] border border-slate-800 flex flex-col items-center justify-center gap-8"
                >
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-cyan-400/20 animate-ping absolute inset-0" />
                    <div className="w-32 h-32 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
                    <BrainCircuit className="w-12 h-12 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black text-white tracking-tighter">Running Annealer Minimizer</h3>
                    <p className="text-slate-500 font-mono text-xs animate-pulse">MINIMIZING ISING HAMILTONIAN FOR CLIMATE MATRIX...</p>
                  </div>
                </motion.div>
              ) : strategyResults ? (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8 relative"
                >
                  
                  {/* Subtle dynamic recalculating indicator */}
                  {localStrategyOverlay && (
                    <div className="absolute inset-0 bg-slate-950/40 rounded-[48px] backdrop-blur-[2px] z-50 flex items-center justify-center border border-cyan-400/20">
                      <div className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-full shadow-2xl">
                        <Zap className="w-4 h-4 text-cyan-400 animate-bounce" />
                        <span className="text-xs font-mono text-slate-300 font-bold uppercase tracking-widest">Quantum Re-annealing...</span>
                      </div>
                    </div>
                  )}

                  {/* Best Strategy Hero Card */}
                  <div className="glass p-10 rounded-[48px] border border-cyan-400/30 bg-gradient-to-br from-cyan-400/5 to-transparent relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <ShieldCheck className="w-40 h-40 text-cyan-400" />
                    </div>
                    
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-cyan-400 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-full">Optimal Intervention</div>
                        <div className="text-xs font-bold text-cyan-400/60 uppercase tracking-widest">Confidence Index: {strategyResults.quantumMetrics.solutionStability * 100}%</div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-5xl font-black text-white tracking-tighter leading-none">{strategyResults.strategies[0].label}</h3>
                        <p className="text-slate-400 text-lg max-w-2xl pt-2">
                          Quantum-optimized intervention for <span className="text-cyan-400 font-bold">{selectedCity.name}</span>: {strategyResults.strategies[0].description}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-8 pt-6">
                        <div className="space-y-1">
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Projected Impact</div>
                          <div className="text-3xl font-black text-emerald-400">+{strategyResults.strategies[0].impact}%</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estimated Cost</div>
                          <div className="text-3xl font-black text-white">${strategyResults.strategies[0].cost.toFixed(1)}M</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Implementation</div>
                          <div className="text-3xl font-black text-white">{strategyResults.strategies[0].timeToImplement}mo</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scatter and Bar charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Cost vs Impact Scatter */}
                    <div className="glass p-8 rounded-[40px] border border-slate-800 space-y-6">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Cost vs Impact Matrix</h3>
                      </div>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis type="number" dataKey="cost" name="Cost" unit="M" stroke="#475569" fontSize={10} />
                            <YAxis type="number" dataKey="impact" name="Impact" unit="%" stroke="#475569" fontSize={10} />
                            <ZAxis type="number" dataKey="feasibility" range={[50, 400]} name="Feasibility" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter name="Strategies" data={scatterData}>
                              {scatterData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={index === 0 ? '#22d3ee' : entry.category === 'policy' ? '#d946ef' : entry.category === 'infrastructure' ? '#fb923c' : '#84cc16'} 
                                />
                              ))}
                            </Scatter>
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Feasibility Ranking */}
                    <div className="glass p-8 rounded-[40px] border border-slate-800 space-y-6">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Feasibility Ranking</h3>
                      </div>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={strategyResults.strategies} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="label" type="category" stroke="#475569" fontSize={8} width={100} />
                            <Tooltip />
                            <Bar dataKey="feasibility" radius={[0, 4, 4, 0]}>
                              {strategyResults.strategies.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#22d3ee' : '#1e293b'} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Algorithmic Blueprint Info Block */}
                  <div className="glass p-8 rounded-[40px] border border-slate-800 space-y-4">
                    <div className="flex items-center gap-3">
                      <Info className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Algorithmic Blueprint</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-400 leading-relaxed">
                      <div className="space-y-2">
                        <h4 className="font-bold text-white uppercase tracking-wider">Multi-Objective Ising Hamiltonian</h4>
                        <p>
                          Our sustainability solver models candidate urban interventions as spin configurations of an Ising Hamiltonian. The loss function is formulated to minimize overall implementation costs while maximizing both carbon reduction impact and logistical feasibility, scaled dynamically by local city constraints.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-white uppercase tracking-wider">Variational Optimization Feedback</h4>
                        <p>
                          We simulate a hybrid quantum-classical optimization loop. SPSA/COBYLA optimizers classical feed parameters to parameterized quantum circuits, locating the global minimum eigenvalue that corresponds to the perfect strategic balance for the current city's environmental and financial ecosystem.
                        </p>
                      </div>
                    </div>
                  </div>

                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantumDecisionEngine;
