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
  ArrowRight,
  Plus,
  Trash2,
  Sliders,
  Sparkles,
  Info,
  Layers,
  CalendarDays,
  MapPin,
  CheckCircle2,
  X,
  AlertTriangle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts';
import { CITIES, getSectorNamesForCity, getRealisticAqi } from '../constants';

// Data models
interface SectorData {
  name: string;
  baseAqi: number;
  type: 'industrial' | 'commercial' | 'residential' | 'coastal' | 'green';
  sources: string[];
  densityOffset: number; // emission density weight
  vulnerabilityScore: number; // elderly / school density out of 100
}

interface CityGrid {
  cityName: string;
  baseAqi: number;
  sectors: SectorData[];
}

interface ScheduledIntervention {
  id: string;
  actionId: string;
  actionLabel: string;
  sectorIndex: number;
  timeSlotIndex: number;
  aqiBenefit: number;
}

const METRO_GRIDS: Record<string, CityGrid> = {
  'New Delhi': {
    cityName: 'New Delhi',
    baseAqi: 218,
    sectors: [
      { name: 'Anand Vihar', baseAqi: 284, type: 'industrial', sources: ['Industrial Boiler', 'Inter-state Bus Terminal', 'Road Dust'], densityOffset: 88, vulnerabilityScore: 78 },
      { name: 'Okhla Phase 3', baseAqi: 262, type: 'industrial', sources: ['Metal Casting', 'Heavy Cargo Vehicles', 'Waste Incinerator'], densityOffset: 92, vulnerabilityScore: 65 },
      { name: 'Punjabi Bagh', baseAqi: 238, type: 'residential', sources: ['Domestic Biomass', 'Vehicular Exhaust', 'Waste Burning'], densityOffset: 72, vulnerabilityScore: 84 },
      { name: 'Dwarka Sector 8', baseAqi: 184, type: 'residential', sources: ['Construction Dust', 'Diesel Generator Backups'], densityOffset: 58, vulnerabilityScore: 89 },
      { name: 'Wazirpur Cluster', baseAqi: 278, type: 'industrial', sources: ['Steel Pickling', 'Coal Boiler stacks', 'Solid Fuel Combustion'], densityOffset: 95, vulnerabilityScore: 71 },
      { name: 'Connaught Place', baseAqi: 198, type: 'commercial', sources: ['Restaurant kitchen charcoal', 'Gridlocked Traffic'], densityOffset: 65, vulnerabilityScore: 60 },
      { name: 'RK Puram', baseAqi: 190, type: 'residential', sources: ['Municipal Leaf Burning', 'Local Commuter gridlock'], densityOffset: 48, vulnerabilityScore: 92 },
      { name: 'Mandir Marg', baseAqi: 178, type: 'residential', sources: ['Roadside dust kickup', 'Transit Exhaust'], densityOffset: 42, vulnerabilityScore: 95 },
      { name: 'Shadipur', baseAqi: 224, type: 'industrial', sources: ['Rail siding dust', 'Heavy logistics delivery'], densityOffset: 76, vulnerabilityScore: 68 },
      { name: 'Narela Industrial', baseAqi: 254, type: 'industrial', sources: ['Plastic Recycling furnace', 'Agricultural residue plume'], densityOffset: 89, vulnerabilityScore: 54 },
      { name: 'Siri Fort', baseAqi: 158, type: 'green', sources: ['Suburban background drift', 'Minor traffic leak'], densityOffset: 34, vulnerabilityScore: 80 },
      { name: 'IGI Airport T3', baseAqi: 188, type: 'commercial', sources: ['Aviation turbine fuel exhaust', 'Ground support fleets'], densityOffset: 62, vulnerabilityScore: 42 },
      { name: 'Lodhi Road', baseAqi: 148, type: 'green', sources: ['Central gardens background', 'Low localized emissions'], densityOffset: 25, vulnerabilityScore: 76 },
      { name: 'Jahangirpuri', baseAqi: 268, type: 'industrial', sources: ['Landfill fires', 'Automobile scrap smelting'], densityOffset: 94, vulnerabilityScore: 82 },
      { name: 'Bawana Sector 4', baseAqi: 272, type: 'industrial', sources: ['Unregistered battery smelting', 'Plastic combustion'], densityOffset: 96, vulnerabilityScore: 59 },
      { name: 'ITO Intersection', baseAqi: 245, type: 'commercial', sources: ['Severe peak hour stagnation', 'High diesel bus ratio'], densityOffset: 84, vulnerabilityScore: 50 }
    ]
  },
  'Mumbai': {
    cityName: 'Mumbai',
    baseAqi: 148,
    sectors: [
      { name: 'Dharavi Recyclers', baseAqi: 192, type: 'industrial', sources: ['Plastic recycling pots', 'Leather tanning units'], densityOffset: 84, vulnerabilityScore: 86 },
      { name: 'BKC Sector 4', baseAqi: 144, type: 'commercial', sources: ['Major construction towers', 'Executive transport gridlock'], densityOffset: 68, vulnerabilityScore: 72 },
      { name: 'Colaba Port Line', baseAqi: 132, type: 'coastal', sources: ['Cargo vessel diesel auxiliary', 'Maritime salt pan spray'], densityOffset: 52, vulnerabilityScore: 64 },
      { name: 'Wadala Terminal', baseAqi: 168, type: 'industrial', sources: ['Petroleum tankers logistics', 'Chemical storage venting'], densityOffset: 78, vulnerabilityScore: 58 },
      { name: 'Chembur Refinery', baseAqi: 186, type: 'industrial', sources: ['Fossil oil cracker emissions', 'Fertilizer stack plume'], densityOffset: 89, vulnerabilityScore: 70 },
      { name: 'Andheri East Hub', baseAqi: 154, type: 'commercial', sources: ['Metro line builders dust', 'High Density traffic corridor'], densityOffset: 74, vulnerabilityScore: 76 },
      { name: 'Borivali National', baseAqi: 92, type: 'green', sources: ['Forest preserve baseline', 'Outer highway tailpipe drift'], densityOffset: 22, vulnerabilityScore: 68 },
      { name: 'Worli Sea-Face', baseAqi: 110, type: 'coastal', sources: ['Marine aerosol scrubbing', 'High speed vehicular transit'], densityOffset: 45, vulnerabilityScore: 80 },
      { name: 'Bandra West Kurla', baseAqi: 138, type: 'residential', sources: ['Urban restaurant emissions', 'Dense arterial congestion'], densityOffset: 60, vulnerabilityScore: 85 },
      { name: 'Kurla Junction', baseAqi: 172, type: 'commercial', sources: ['Scrapyards dust kicking', 'Unregulated small foundries'], densityOffset: 80, vulnerabilityScore: 74 },
      { name: 'Juhu Residential', baseAqi: 118, type: 'coastal', sources: ['Coastal air dilution', 'Private backup generators'], densityOffset: 38, vulnerabilityScore: 88 },
      { name: 'Powai Lake Grid', baseAqi: 122, type: 'residential', sources: ['IT park thermal hotspots', 'Construction dust'], densityOffset: 46, vulnerabilityScore: 79 },
      { name: 'Mulund West Gate', baseAqi: 148, type: 'residential', sources: ['Quarry dust drift', 'Interstate logistics highway'], densityOffset: 62, vulnerabilityScore: 71 },
      { name: 'Ghatkopar Belt', baseAqi: 156, type: 'residential', sources: ['Infrastructure drilling', 'Dense auto-rickshaw fleets'], densityOffset: 69, vulnerabilityScore: 83 },
      { name: 'Vashi Creek', baseAqi: 128, type: 'coastal', sources: ['Chemical industrial corridor drift', 'Creek silt dust'], densityOffset: 54, vulnerabilityScore: 60 },
      { name: 'Thane Highway Grid', baseAqi: 164, type: 'industrial', sources: ['Expressway logistics stacking', 'Heavy engineering foundries'], densityOffset: 76, vulnerabilityScore: 65 }
    ]
  },
  'Bengaluru': {
    cityName: 'Bengaluru',
    baseAqi: 84,
    sectors: [
      { name: 'Whitefield Corridor', baseAqi: 112, type: 'industrial', sources: ['IT backup diesel generators', 'Transit road expansion'], densityOffset: 68, vulnerabilityScore: 70 },
      { name: 'Peenya Smelters', baseAqi: 138, type: 'industrial', sources: ['Small metal electroplaters', 'Lead casting pots'], densityOffset: 82, vulnerabilityScore: 56 },
      { name: 'Electronic City', baseAqi: 98, type: 'commercial', sources: ['Tollway elevated construction', 'Software campus shuttle fleets'], densityOffset: 52, vulnerabilityScore: 62 },
      { name: 'Koramangala Ring', baseAqi: 94, type: 'residential', sources: ['Restaurant commercial kitchens', 'High-density commuter vehicles'], densityOffset: 55, vulnerabilityScore: 78 },
      { name: 'Indiranagar 100ft', baseAqi: 90, type: 'commercial', sources: ['Bar/Café wood fire ovens', 'Bumper-to-bumper car lines'], densityOffset: 58, vulnerabilityScore: 74 },
      { name: 'Outer Ring Road', baseAqi: 124, type: 'commercial', sources: ['Severe stagnation flyover gridlock', 'Heavy earth-movers'], densityOffset: 76, vulnerabilityScore: 66 },
      { name: 'Silk Board Cross', baseAqi: 130, type: 'commercial', sources: ['Unprecedented fleet idle times', 'Metro pillar works'], densityOffset: 80, vulnerabilityScore: 58 },
      { name: 'Hebbal Flyover', baseAqi: 104, type: 'commercial', sources: ['Northward logistic truck exit', 'Airport transit highway'], densityOffset: 60, vulnerabilityScore: 72 },
      { name: 'Majestic Terminal', baseAqi: 118, type: 'commercial', sources: ['Hundreds of idling state buses', 'Unpaved platform dust'], densityOffset: 72, vulnerabilityScore: 64 },
      { name: 'Jayanagar Park Grid', baseAqi: 62, type: 'green', sources: ['Dense tree canopy absorption', 'Restricted transit roads'], densityOffset: 18, vulnerabilityScore: 89 },
      { name: 'Yelahanka Satellite', baseAqi: 76, type: 'residential', sources: ['Minor residential brick kilns', 'Farming background drift'], densityOffset: 32, vulnerabilityScore: 82 },
      { name: 'HSR Layout Sector 1', baseAqi: 82, type: 'residential', sources: ['Solid waste compost yards', 'Local light commuter grid'], densityOffset: 36, vulnerabilityScore: 86 },
      { name: 'Banashankari Grid', baseAqi: 78, type: 'residential', sources: ['Temple complex incense smoke', 'Pothole asphalt repairs'], densityOffset: 30, vulnerabilityScore: 85 },
      { name: 'Yeshwanthpur Yards', baseAqi: 110, type: 'industrial', sources: ['Rail siding chemical loaders', 'Grain market truck logistics'], densityOffset: 66, vulnerabilityScore: 60 },
      { name: 'Marathahalli Spine', baseAqi: 108, type: 'commercial', sources: ['Major tech-park transit exhaust', 'Pavement excavation'], densityOffset: 64, vulnerabilityScore: 71 },
      { name: 'Bellandur Silt', baseAqi: 115, type: 'residential', sources: ['Lake foam dry particulates', 'High rise apartment block building'], densityOffset: 70, vulnerabilityScore: 75 }
    ]
  },
  'Kolkata': {
    cityName: 'Kolkata',
    baseAqi: 165,
    sectors: [
      { name: 'Howrah Foundry Zone', baseAqi: 242, type: 'industrial', sources: ['Coke oven furnaces', 'Heavy railway terminal shunting', 'Coal logistics'], densityOffset: 94, vulnerabilityScore: 79 },
      { name: 'Topsia Tannery Grid', baseAqi: 212, type: 'industrial', sources: ['Leather scrap incineration', 'Local generator exhaust'], densityOffset: 88, vulnerabilityScore: 81 },
      { name: 'Rajarhat Builders', baseAqi: 182, type: 'residential', sources: ['Mega real estate concrete mixing', 'Truck transport dust'], densityOffset: 74, vulnerabilityScore: 68 },
      { name: 'Salt Lake Sector V', baseAqi: 142, type: 'commercial', sources: ['Tech park boiler lines', 'Commuter bus soot'], densityOffset: 62, vulnerabilityScore: 73 },
      { name: 'New Town Sector 1', baseAqi: 148, type: 'residential', sources: ['Pavement pulverizing', 'Diesel generator standby load'], densityOffset: 58, vulnerabilityScore: 80 },
      { name: 'Park Street Dining', baseAqi: 162, type: 'commercial', sources: ['Restaurant kitchen stack plumes', 'Double-decker bus emissions'], densityOffset: 69, vulnerabilityScore: 76 },
      { name: 'Ballygunge Estate', baseAqi: 135, type: 'residential', sources: ['Residential street combustion', 'Arterial vehicle backups'], densityOffset: 48, vulnerabilityScore: 92 },
      { name: 'Victoria Monument', baseAqi: 118, type: 'green', sources: ['Maidan park tree absorption', 'Controlled vehicle zone'], densityOffset: 28, vulnerabilityScore: 84 },
      { name: 'Shyambazar Market', baseAqi: 188, type: 'commercial', sources: ['Tightly packed diesel commercial trikes', 'Road dust'], densityOffset: 79, vulnerabilityScore: 86 },
      { name: 'Behala Air strip', baseAqi: 174, type: 'residential', sources: ['Auto repair spray painting', 'Stagnant local traffic'], densityOffset: 70, vulnerabilityScore: 88 },
      { name: 'Jadavpur Science Grid', baseAqi: 145, type: 'residential', sources: ['University laboratory vents', 'Bazaar garbage composting'], densityOffset: 52, vulnerabilityScore: 82 },
      { name: 'Alipore Estates', baseAqi: 124, type: 'green', sources: ['Zoo park foliage absorption', 'VVIP convoy exclusions'], densityOffset: 32, vulnerabilityScore: 90 },
      { name: 'Garia Southern Grid', baseAqi: 154, type: 'residential', sources: ['Metro extension drilling', 'Suburban train coal engines'], densityOffset: 60, vulnerabilityScore: 85 },
      { name: 'Cossipore Gun shells', baseAqi: 220, type: 'industrial', sources: ['Ordnance foundry furnaces', 'River barge diesel generators'], densityOffset: 86, vulnerabilityScore: 63 },
      { name: 'Dum Dum Airport', baseAqi: 158, type: 'commercial', sources: ['Jet fueling vapor drift', 'Airport bus shuttle fleets'], densityOffset: 65, vulnerabilityScore: 54 },
      { name: 'Bagbazaar Ghats', baseAqi: 194, type: 'industrial', sources: ['Traditional clay firing furnaces', 'River steamer engines'], densityOffset: 82, vulnerabilityScore: 77 }
    ]
  },
  'Chennai': {
    cityName: 'Chennai',
    baseAqi: 92,
    sectors: [
      { name: 'Ennore Power Stack C', baseAqi: 154, type: 'industrial', sources: ['Coal-fired stack flyash', 'Chemical carrier logistics'], densityOffset: 92, vulnerabilityScore: 66 },
      { name: 'Ambattur Casting', baseAqi: 134, type: 'industrial', sources: ['Aluminium die casters', 'Automobile stamping boilers'], densityOffset: 84, vulnerabilityScore: 62 },
      { name: 'Manali Pipe 8', baseAqi: 148, type: 'industrial', sources: ['Petroleum oil refining flue', 'Aromatics storage tanks'], densityOffset: 89, vulnerabilityScore: 58 },
      { name: 'T-Nagar Bazaar', baseAqi: 110, type: 'commercial', sources: ['High volume shopper bus lines', 'Vendor diesel dynamos'], densityOffset: 72, vulnerabilityScore: 80 },
      { name: 'Adyar Canopy Grid', baseAqi: 64, type: 'green', sources: ['Theosophical garden foliage', 'Adyar estuary air draft'], densityOffset: 20, vulnerabilityScore: 92 },
      { name: 'Mylapore Temple Ring', baseAqi: 82, type: 'residential', sources: ['Festival chariot dust', 'Local commercial fryers'], densityOffset: 42, vulnerabilityScore: 89 },
      { name: 'Velachery Silt basin', baseAqi: 98, type: 'residential', sources: ['Swampland landfill venting', 'High density real estate construction'], densityOffset: 56, vulnerabilityScore: 78 },
      { name: 'Guindy Industrial', baseAqi: 112, type: 'industrial', sources: ['Automotive tier-1 parts foundry', 'Siddha labs vent stack'], densityOffset: 68, vulnerabilityScore: 74 },
      { name: 'Royapettah Spine', baseAqi: 92, type: 'commercial', sources: ['Arterial auto rickshaw diesel exhaust', 'Shopping mall HVAC'], densityOffset: 54, vulnerabilityScore: 85 },
      { name: 'Anna Nagar West', baseAqi: 86, type: 'residential', sources: ['Sewer excavation dust', 'Heavy localized passenger traffic'], densityOffset: 48, vulnerabilityScore: 87 },
      { name: 'Sholinganallur IT', baseAqi: 90, type: 'commercial', sources: ['Server farm backup dynamos', 'Transit bus lane paving'], densityOffset: 50, vulnerabilityScore: 71 },
      { name: 'Tambaram Junction', baseAqi: 118, type: 'commercial', sources: ['Southern interstate transit buses', 'Rail track aggregate dust'], densityOffset: 76, vulnerabilityScore: 69 },
      { name: 'Egmore Train Grid', baseAqi: 102, type: 'commercial', sources: ['Railway station logistics loaders', 'Hotel kitchen stacks'], densityOffset: 62, vulnerabilityScore: 76 },
      { name: 'Perambur Loco Works', baseAqi: 124, type: 'industrial', sources: ['Railway manufacturing steel mills', 'Industrial paints spray'], densityOffset: 78, vulnerabilityScore: 64 },
      { name: 'Chromepet Tanneries', baseAqi: 128, type: 'industrial', sources: ['Skins drying processing venting', 'Logistics arterial exhaust'], densityOffset: 80, vulnerabilityScore: 70 },
      { name: 'Saidapet River bank', baseAqi: 88, type: 'residential', sources: ['Adyar river sand kicking', 'Local vehicle maintenance exhaust'], densityOffset: 38, vulnerabilityScore: 82 }
    ]
  }
};

const AVAILABLE_ACTIONS = [
  { id: 'water_jets', label: 'Road Sprinklers', benefit: 16, cost: 8, color: 'text-blue-400 border-blue-500/20 bg-blue-500/10' },
  { id: 'diesel_ban', label: 'Diesel Restriction', benefit: 26, cost: 18, color: 'text-rose-400 border-rose-500/20 bg-rose-500/10' },
  { id: 'const_halt', label: 'Construction Halt', benefit: 18, cost: 12, color: 'text-amber-400 border-amber-500/20 bg-amber-500/10' },
  { id: 'scrub_max', label: 'Max Power Scrubbing', benefit: 22, cost: 24, color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10' },
  { id: 'smog_tower', label: 'AI Smog Towers', benefit: 12, cost: 10, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' }
];

const TIME_SLOTS = [
  '12 AM - 3 AM',
  '3 AM - 6 AM',
  '6 AM - 9 AM',
  '9 AM - 12 PM',
  '12 PM - 3 PM',
  '3 PM - 6 PM',
  '6 PM - 9 PM',
  '9 PM - 12 AM'
];

type MapOverlayMode = 'aqi' | 'density' | 'gnn' | 'vulnerability';

const PredictionDashboard: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('New Delhi');
  const [selectedSectorIndex, setSelectedSectorIndex] = useState<number>(0);
  const [overlayMode, setOverlayMode] = useState<MapOverlayMode>('aqi');

  // Live AQI State and effect
  const [liveAqi, setLiveAqi] = useState<number | null>(null);
  const [isLiveAqiLoading, setIsLiveAqiLoading] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    setIsLiveAqiLoading(true);
    setLiveAqi(null); // Clear previous city's AQI
    fetch(`/api/live-aqi?city=${encodeURIComponent(selectedCity)}`)
      .then(res => res.json())
      .then(data => {
        if (active && data && typeof data.aqi === 'number') {
          setLiveAqi(data.aqi);
        }
      })
      .catch(err => console.error("Error fetching AQI in PredictionDashboard", err))
      .finally(() => {
        if (active) setIsLiveAqiLoading(false);
      });
    return () => { active = false; };
  }, [selectedCity]);
  
  // Scheduled interventions state
  const [interventions, setInterventions] = useState<ScheduledIntervention[]>([
    {
      id: 'init-1',
      actionId: 'diesel_ban',
      actionLabel: 'Diesel Restriction',
      sectorIndex: 0,
      timeSlotIndex: 2, // 6 AM - 9 AM
      aqiBenefit: 26
    },
    {
      id: 'init-2',
      actionId: 'water_jets',
      actionLabel: 'Road Sprinklers',
      sectorIndex: 0,
      timeSlotIndex: 3, // 9 AM - 12 PM
      aqiBenefit: 16
    }
  ]);

  // Modal selector for adding a new intervention
  const [schedulingSlot, setSchedulingSlot] = useState<{ sectorIndex: number; slotIndex: number } | null>(null);
  const [isQuantumAutoScheduling, setIsQuantumAutoScheduling] = useState<boolean>(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([
    'System initialized. Hyperlocal neural network listening on 1km² grids.',
    'Atmospheric LSTM kernel optimized on CPCB historic datasets.'
  ]);

  const addSimLog = (msg: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSimulationLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 8));
  };

  // Active City Data derived from selections, dynamically generating high-fidelity 16-zone grids for newly added cities
  const activeCityData = useMemo((): CityGrid => {
    let baseGrid: CityGrid;

    // Resolve common spelling variants to handcrafted METRO_GRIDS key
    const normalizedCity = selectedCity.trim().toLowerCase();
    let targetKey = "";
    if (normalizedCity === 'delhi' || normalizedCity === 'new delhi') {
      targetKey = 'New Delhi';
    } else if (normalizedCity === 'bangalore' || normalizedCity === 'banglore' || normalizedCity === 'bengaluru') {
      targetKey = 'Bengaluru';
    } else if (normalizedCity === 'chennai' || normalizedCity === 'madras') {
      targetKey = 'Chennai';
    } else if (normalizedCity === 'mumbai') {
      targetKey = 'Mumbai';
    } else if (normalizedCity === 'kolkata') {
      targetKey = 'Kolkata';
    }

    if (targetKey && METRO_GRIDS[targetKey]) {
      // Create a copy so we don't mutate the global constant
      const original = METRO_GRIDS[targetKey];
      baseGrid = {
        ...original,
        cityName: selectedCity, // Keep the selected spelling in display
        sectors: original.sectors.map(s => ({ ...s }))
      };
    } else {
      const globalCity = CITIES.find(c => c.name.toLowerCase() === selectedCity.toLowerCase()) || CITIES[0];
      const baseAqi = getRealisticAqi(globalCity.name);
      
      // Generate 16 simulated sectors dynamically for this city so that it feels fully alive
      const sectorNames = getSectorNamesForCity(globalCity.name);
      
      // Determine if city is coastal to prevent generating maritime emissions in landlocked cities
      const coastalCities = [
        'singapore', 'new york', 'mumbai', 'chennai', 'madras', 'goa', 'pondicherry', 'udupi', 
        'surathkal', 'sydney', 'melbourne', 'wellington', 'auckland', 'adelaide', 'vishakhapatnam', 'brazil', 'italy'
      ];
      const isCoastalCity = coastalCities.includes(globalCity.name.toLowerCase());

      const sectors: SectorData[] = sectorNames.map((name, i) => {
        // If coastal city, use 5 types. If landlocked, use 4 types (avoid coastal)
        let type: SectorData['type'];
        if (isCoastalCity) {
          const types: SectorData['type'][] = ['industrial', 'commercial', 'residential', 'coastal', 'green'];
          type = types[i % 5];
        } else {
          const types: SectorData['type'][] = ['industrial', 'commercial', 'residential', 'green'];
          type = types[i % 4];
        }
                
        let baseFactor = 1.0;
        let densityOffset = 50;
        let vulnerabilityScore = 50;
        let sources: string[] = [];

        if (type === 'industrial') {
          baseFactor = 1.25 + (i % 3) * 0.05; // 1.25, 1.30, 1.35
          densityOffset = 80 + (i % 4) * 4;   // 80, 84, 88, 92
          vulnerabilityScore = 50 + (i % 5) * 5; // 50, 55, 60, 65, 70
          sources = ['Heavy Industrial Furnaces', 'Smelter Stack Discharge', 'Fugitive Particulate Matter'];
        } else if (type === 'commercial') {
          baseFactor = 1.05 + (i % 3) * 0.05; // 1.05, 1.10, 1.15
          densityOffset = 65 + (i % 4) * 4;   // 65, 69, 73, 77
          vulnerabilityScore = 60 + (i % 5) * 5; // 60, 65, 70, 75, 80
          sources = ['High Speed Transit Gridlock', 'Street Vendor Coal Grills', 'Commercial Building Exhausts'];
        } else if (type === 'residential') {
          baseFactor = 0.9 + (i % 3) * 0.05;  // 0.9, 0.95, 1.0
          densityOffset = 45 + (i % 4) * 4;   // 45, 49, 53, 57
          vulnerabilityScore = 75 + (i % 5) * 4; // 75, 79, 83, 87, 91 (high vulnerability due to residential population/schools)
          sources = ['Domestic Fuel Cookers', 'Localized Bio-waste Burning', 'Backup Diesel Generators'];
        } else if (type === 'coastal') {
          baseFactor = 0.85 + (i % 3) * 0.05; // 0.85, 0.90, 0.95
          densityOffset = 55 + (i % 4) * 4;   // 55, 59, 63, 67
          vulnerabilityScore = 55 + (i % 5) * 5; // 55, 60, 65, 70, 75
          sources = ['Harbor Cargo Loading Exhaust', 'Seaside Aggregate Silt', 'Marine Vessel Auxiliary Engines'];
        } else { // green
          baseFactor = 0.7 + (i % 3) * 0.05;  // 0.7, 0.75, 0.8
          densityOffset = 20 + (i % 4) * 3;   // 20, 23, 26, 29
          vulnerabilityScore = 65 + (i % 5) * 5; // 65, 70, 75, 80, 85
          sources = ['Minor Background Transport Drift', 'Aerosol Secondary Drift', 'Urban Forest Clean Boundary'];
        }
        
        const sectorBaseAqi = Math.max(12, Math.round(baseAqi * baseFactor));
                
        return {
          name,
          baseAqi: sectorBaseAqi,
          type,
          sources,
          densityOffset,
          vulnerabilityScore
        };
      });
      
      baseGrid = {
        cityName: globalCity.name,
        baseAqi,
        sectors
      };
    }

    // Overwrite base AQIs with live API metrics if loaded
    if (liveAqi !== null) {
      baseGrid.baseAqi = liveAqi;
      baseGrid.sectors = baseGrid.sectors.map(sector => {
        const type = sector.type;
        const baseFactor = type === 'industrial' ? 1.3 : type === 'commercial' ? 1.1 : type === 'green' ? 0.75 : 1.0;
        return {
          ...sector,
          baseAqi: Math.max(12, Math.round(liveAqi * baseFactor))
        };
      });
    }

    return baseGrid;
  }, [selectedCity, liveAqi]);
  const activeSector = activeCityData.sectors[selectedSectorIndex] || activeCityData.sectors[0];

  // Auto focus first sector on city change
  useEffect(() => {
    setSelectedSectorIndex(0);
    // Keep initial scheduled interventions within bounds of new city
    setInterventions([
      {
        id: `auto-${Math.random()}`,
        actionId: 'diesel_ban',
        actionLabel: 'Diesel Restriction',
        sectorIndex: 0,
        timeSlotIndex: 2,
        aqiBenefit: 26
      },
      {
        id: `auto-${Math.random()}`,
        actionId: 'water_jets',
        actionLabel: 'Road Sprinklers',
        sectorIndex: 0,
        timeSlotIndex: 3,
        aqiBenefit: 16
      }
    ]);
    addSimLog(`Telemetry pipeline established for ${selectedCity} 16-zone Ward Grid.`);
  }, [selectedCity]);

  // Calculate sector live AQI based on scheduled interventions for that exact sector!
  const getSectorLiveAqi = (sectorIdx: number, slotIdx?: number) => {
    const sector = activeCityData.sectors[sectorIdx];
    let aqi = sector.baseAqi;

    // Apply interventions that target this specific sector
    const sectorInterventions = interventions.filter(item => item.sectorIndex === sectorIdx);
    
    if (slotIdx !== undefined) {
      // Calculate specifically for this time slot
      const slotInterventions = sectorInterventions.filter(item => item.timeSlotIndex === slotIdx);
      const totalBenefit = slotInterventions.reduce((sum, item) => sum + item.aqiBenefit, 0);
      aqi -= totalBenefit;
    } else {
      // Average across all active interventions for this sector to get baseline live representation
      const totalBenefit = sectorInterventions.reduce((sum, item) => sum + item.aqiBenefit, 0);
      // Give a proportionate reduction
      aqi -= Math.min(60, totalBenefit * 0.4);
    }

    return Math.max(12, Math.round(aqi));
  };

  const currentLiveAqi = getSectorLiveAqi(selectedSectorIndex);

  const getAqiColorInfo = (aqi: number) => {
    if (aqi < 50) return { text: 'Good', textClass: 'text-emerald-400', bgClass: 'bg-emerald-500/10 border-emerald-500/20', badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' };
    if (aqi < 100) return { text: 'Satisfactory', textClass: 'text-cyan-400', bgClass: 'bg-cyan-500/10 border-cyan-500/20', badge: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' };
    if (aqi < 150) return { text: 'Moderate', textClass: 'text-amber-400', bgClass: 'bg-amber-500/10 border-amber-500/20', badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' };
    if (aqi < 200) return { text: 'Poor', textClass: 'text-orange-400', bgClass: 'bg-orange-500/10 border-orange-500/20', badge: 'bg-orange-500/10 text-orange-400 border border-orange-500/20' };
    return { text: 'Very Poor', textClass: 'text-rose-400', bgClass: 'bg-rose-500/10 border-rose-500/20', badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/20' };
  };

  // Generate 24h predictions based on active sector & scheduled interventions
  const chartData = useMemo(() => {
    return TIME_SLOTS.map((slot, idx) => {
      // Simulated natural diurnal AQI curve peaking in morning/evening
      const peakFactors = [1.0, 0.9, 1.25, 1.1, 0.85, 1.05, 1.3, 1.15];
      const peakFactor = peakFactors[idx];
      
      const unmitigatedBase = activeSector.baseAqi * peakFactor;
      
      // Classical baseline prediction (incorporating some noise and offset)
      const classical = Math.round(unmitigatedBase + (Math.sin(idx) * 8) + 12);
      
      // Unmitigated Hybrid Quantum-AI Forecast (more coherent representation)
      const hybridUnmitigated = Math.round(unmitigatedBase + (Math.sin(idx) * 3));

      // Calculate localized mitigation benefits for this sector and time slot
      const localizedInterventions = interventions.filter(
        item => item.sectorIndex === selectedSectorIndex && item.timeSlotIndex === idx
      );
      const totalAqiBenefit = localizedInterventions.reduce((sum, item) => sum + item.aqiBenefit, 0);
      
      const hybridMitigated = Math.max(12, Math.round(hybridUnmitigated - totalAqiBenefit));

      return {
        time: slot.split(' - ')[0], // Show starting hour
        classical,
        hybrid: hybridUnmitigated,
        mitigated: hybridMitigated
      };
    });
  }, [activeSector, interventions, selectedSectorIndex]);

  // Compute overall statistics
  const overallReduction = useMemo(() => {
    const origSum = chartData.reduce((sum, d) => sum + d.hybrid, 0);
    const mitSum = chartData.reduce((sum, d) => sum + d.mitigated, 0);
    if (origSum === 0) return 0;
    return Math.round(((origSum - mitSum) / origSum) * 100);
  }, [chartData]);

  // Remove Scheduled Intervention
  const handleRemoveIntervention = (id: string) => {
    const removed = interventions.find(item => item.id === id);
    setInterventions(prev => prev.filter(item => item.id !== id));
    if (removed) {
      const action = AVAILABLE_ACTIONS.find(a => a.id === removed.actionId);
      addSimLog(`Removed schedule: ${action?.label || 'Action'} from ${TIME_SLOTS[removed.timeSlotIndex]}`);
    }
  };

  // Add Scheduled Intervention
  const handleAddIntervention = (actionId: string) => {
    if (!schedulingSlot) return;
    const action = AVAILABLE_ACTIONS.find(a => a.id === actionId);
    if (!action) return;

    // Check if duplicate action already scheduled for this slot & sector
    const isDuplicate = interventions.some(
      item => item.sectorIndex === schedulingSlot.sectorIndex && 
              item.timeSlotIndex === schedulingSlot.slotIndex && 
              item.actionId === actionId
    );

    if (isDuplicate) {
      addSimLog(`Conflict: ${action.label} is already scheduled at this slot.`);
      setSchedulingSlot(null);
      return;
    }

    const newItem: ScheduledIntervention = {
      id: `manual-${Math.random()}`,
      actionId,
      actionLabel: action.label,
      sectorIndex: schedulingSlot.sectorIndex,
      timeSlotIndex: schedulingSlot.slotIndex,
      aqiBenefit: action.benefit
    };

    setInterventions(prev => [...prev, newItem]);
    addSimLog(`Scheduled ${action.label} for ${activeCityData.sectors[schedulingSlot.sectorIndex].name} during ${TIME_SLOTS[schedulingSlot.slotIndex]}`);
    setSchedulingSlot(null);
  };

  // Run Quantum Scheduling Optimizer
  const triggerQuantumScheduling = () => {
    setIsQuantumAutoScheduling(true);
    addSimLog(`Running Quantum Approximate Optimization Algorithm (QAOA) for multi-sector calendar...`);
    
    setTimeout(() => {
      // Find the top 3 highest base AQI sectors in this city
      const sortedSectors = [...activeCityData.sectors]
        .map((s, idx) => ({ s, idx }))
        .sort((a, b) => b.s.baseAqi - a.s.baseAqi);

      const optimalInterventions: ScheduledIntervention[] = [];
      
      // Auto-schedule maximum benefit interventions on highest priority slots for top 3 hot spots
      sortedSectors.slice(0, 3).forEach((item, pIdx) => {
        // High traffic hours (6AM - 9AM is index 2, 6PM - 9PM is index 6)
        optimalInterventions.push({
          id: `opt-${Math.random()}`,
          actionId: 'diesel_ban',
          actionLabel: 'Diesel Restriction',
          sectorIndex: item.idx,
          timeSlotIndex: 2,
          aqiBenefit: 26
        });
        
        // Mid-day construction hours (9AM - 12PM is index 3)
        optimalInterventions.push({
          id: `opt-${Math.random()}`,
          actionId: 'const_halt',
          actionLabel: 'Construction Halt',
          sectorIndex: item.idx,
          timeSlotIndex: 3,
          aqiBenefit: 18
        });

        // Evening stagnation hours (6PM - 9PM is index 6)
        optimalInterventions.push({
          id: `opt-${Math.random()}`,
          actionId: 'water_jets',
          actionLabel: 'Road Sprinklers',
          sectorIndex: item.idx,
          timeSlotIndex: 6,
          aqiBenefit: 16
        });
      });

      setInterventions(optimalInterventions);
      setIsQuantumAutoScheduling(false);
      addSimLog(`QAOA solved scheduling puzzle in 8.4ms. Plotted 9 optimal mitigation vectors.`);
    }, 1800);
  };

  // Render styled grid cell based on current overlay mode
  const renderCellContent = (idx: number) => {
    const sector = activeCityData.sectors[idx];
    const liveAqi = getSectorLiveAqi(idx);
    
    if (overlayMode === 'aqi') {
      let colorBg = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      if (liveAqi >= 100 && liveAqi < 150) colorBg = 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      else if (liveAqi >= 150 && liveAqi < 200) colorBg = 'bg-orange-500/10 border-orange-500/20 text-orange-400';
      else if (liveAqi >= 200) colorBg = 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <span className="text-[10px] font-black text-slate-400 tracking-tight truncate max-w-full px-1">{sector.name}</span>
          <span className={`text-lg font-mono font-black mt-1 ${colorBg.split(' ')[2]}`}>{liveAqi}</span>
        </div>
      );
    }
    
    if (overlayMode === 'density') {
      const density = sector.densityOffset;
      let densityColor = 'text-slate-400';
      if (density > 80) densityColor = 'text-rose-400';
      else if (density > 50) densityColor = 'text-amber-400';
      else densityColor = 'text-emerald-400';

      return (
        <div className="flex flex-col items-center justify-center h-full">
          <span className="text-[10px] font-black text-slate-400 tracking-tight truncate max-w-full px-1">{sector.name}</span>
          <span className={`text-base font-mono font-bold mt-1 ${densityColor}`}>{density}%</span>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Emission</span>
        </div>
      );
    }

    if (overlayMode === 'gnn') {
      // GNN confidence metric simulated
      const confidence = 94.2 + (idx * 0.3) % 4.8;
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <span className="text-[10px] font-black text-slate-400 tracking-tight truncate max-w-full px-1">{sector.name}</span>
          <span className="text-base font-mono font-black text-cyan-400 mt-1">{confidence.toFixed(1)}%</span>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Confidence</span>
        </div>
      );
    }

    // Vulnerability Score overlay
    const vuln = sector.vulnerabilityScore;
    let vulnColor = 'text-emerald-400';
    if (vuln > 85) vulnColor = 'text-rose-400';
    else if (vuln > 70) vulnColor = 'text-orange-400';

    return (
      <div className="flex flex-col items-center justify-center h-full">
        <span className="text-[10px] font-black text-slate-400 tracking-tight truncate max-w-full px-1">{sector.name}</span>
        <span className={`text-base font-mono font-black mt-1 ${vulnColor}`}>{vuln}/100</span>
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Vulnerable</span>
      </div>
    );
  };

  const currentAqiInfo = getAqiColorInfo(currentLiveAqi);

  return (
    <div id="prediction-core-view" className="flex-1 flex flex-col gap-6 animate-in fade-in duration-700">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-1 text-[9px] font-black tracking-widest text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-full uppercase">
              1km² Hyperlocal Neural Prediction Core
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-1 leading-none">
            Hyperlocal Predictive Grid Map & Scheduler
          </h2>
          <p className="text-slate-500 font-medium text-sm lg:text-base">
            Grid-based neural forecasting mapping 16 real-world neighborhoods. Adjust municipal calendars to verify direct feedback.
          </p>
        </div>

        {/* METRO SELECTOR */}
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Connect Urban Telemetry Grid</span>
          <div className="flex flex-wrap bg-slate-900 border border-slate-800 rounded-2xl p-1 gap-1 items-center">
            {Object.keys(METRO_GRIDS).map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 text-xs font-black tracking-tighter rounded-xl transition-all cursor-pointer ${
                  selectedCity === city
                    ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                    : 'text-slate-500 hover:text-slate-300 border border-transparent'
                }`}
              >
                {city}
              </button>
            ))}
            <div className="h-4 w-[1px] bg-slate-800 mx-1 hidden sm:block" />
            <select
              value={Object.keys(METRO_GRIDS).includes(selectedCity) ? "" : selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-black focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer min-w-[150px]"
            >
              <option value="" disabled className="text-slate-600">Select Other Cities...</option>
              {CITIES.slice().sort((a, b) => a.name.localeCompare(b.name)).map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name} ({city.country})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID MAIN INTERFACES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ================= LEFT COLUMN: 1km² GRID MAP & SECTOR META ================= */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* THE 1km² MAP GRID INTERACTIVE CANVAS */}
          <div className="glass p-6 rounded-[32px] border border-slate-800 flex flex-col gap-4 bg-slate-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">1km² Sector Grid Analysis Map</span>
              </div>
              
              {/* Overlay mode badges */}
              <div className="flex gap-1 bg-slate-900/60 p-0.5 border border-slate-800 rounded-lg">
                {(['aqi', 'density', 'gnn', 'vulnerability'] as MapOverlayMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setOverlayMode(mode);
                      addSimLog(`Switched map overlay to ${mode.toUpperCase()}`);
                    }}
                    className={`text-[8px] font-black uppercase px-1.5 py-1 rounded transition-all cursor-pointer ${
                      overlayMode === mode 
                        ? 'bg-cyan-500/20 text-cyan-400' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {mode === 'aqi' ? 'AQI' : mode === 'density' ? 'EMISS' : mode === 'gnn' ? 'GNN' : 'VULN'}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-tight">
              Select any cell to focus deep GNN prediction capabilities and schedule targeted municipal mitigation vectors.
            </p>

            {/* THE Actual 4x4 Grid representation */}
            <div className="grid grid-cols-4 gap-2 bg-slate-950/40 p-2 rounded-2xl border border-slate-900/80 aspect-square">
              {activeCityData.sectors.map((sector, idx) => {
                const isActive = selectedSectorIndex === idx;
                const liveAqi = getSectorLiveAqi(idx);
                
                // Color mapping for border glow on active or standard
                let borderState = 'border-slate-800 hover:border-slate-700 bg-slate-900/30';
                if (isActive) {
                  borderState = 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] bg-cyan-500/5';
                }

                return (
                  <button
                    key={sector.name}
                    id={`grid-cell-${idx}`}
                    onClick={() => {
                      setSelectedSectorIndex(idx);
                      addSimLog(`Connected focus channel to ${sector.name} (Grid Coordinate X${idx % 4} Y${Math.floor(idx / 4)})`);
                    }}
                    className={`relative p-2 rounded-xl border text-center transition-all cursor-pointer overflow-hidden ${borderState}`}
                  >
                    {/* Tiny micro icon in corners */}
                    <div className="absolute top-1 left-1 text-[7px] font-mono font-black text-slate-600">
                      G{idx + 1}
                    </div>

                    {renderCellContent(idx)}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-900 pt-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span> Satisfactory (&lt;100)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span> Moderate (&lt;150)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400 inline-block"></span> Poor/Very Poor (&gt;150)
              </span>
            </div>
          </div>

          {/* DYNAMIC SELECTED SECTOR META */}
          <div className="glass p-6 rounded-[32px] border border-slate-800 flex flex-col justify-between bg-slate-950/20">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Focused Cell Metadata</span>
                </div>
                <span className="text-[10px] font-mono font-black text-cyan-400 uppercase bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
                  Zone {selectedSectorIndex + 1}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h4 className="text-xl font-black text-white leading-none tracking-tight">{activeSector.name}</h4>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 mt-1.5 inline-block">
                    {activeSector.type} Sector Profile
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-slate-500 uppercase">Live localized AQI</span>
                  <span className={`text-2xl font-mono font-black tracking-tighter ${currentAqiInfo.textClass}`}>
                    {currentLiveAqi}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Dominant Local Emission Sources</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeSector.sources.map((src) => (
                      <span key={src} className="px-2 py-0.5 text-[10px] font-bold text-slate-300 bg-slate-800 rounded border border-slate-700/60">
                        {src}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex flex-col">
                    <span className="text-[8px] font-black text-slate-500 uppercase">GNN Vulnerability</span>
                    <span className="text-base font-mono font-black text-rose-400 mt-1">{activeSector.vulnerabilityScore}/100</span>
                    <span className="text-[8px] text-slate-500 leading-none mt-1">High dense pediatric/elderly sectors</span>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex flex-col">
                    <span className="text-[8px] font-black text-slate-500 uppercase">Relative Density</span>
                    <span className="text-base font-mono font-black text-amber-400 mt-1">{activeSector.densityOffset}%</span>
                    <span className="text-[8px] text-slate-500 leading-none mt-1">Satellite thermal anomaly weight</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE FORECAST & CALENDAR ================= */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* 24-HOUR HYBRID PREDICTIVE FORECAST CHART */}
          <div className="glass p-6 rounded-[32px] border border-slate-800 bg-slate-950/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Diurnal Predictive Simulation</span>
                </div>
                <h3 className="text-xs font-mono font-black text-slate-400 mt-1 uppercase">
                  Focused Cell: <span className="text-white normal-case font-sans">{activeSector.name}</span>
                </h3>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-500 uppercase">Classical Forecast</span>
                  <span className="text-xs font-mono font-bold text-slate-400">RMSE 14.8</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-cyan-400 uppercase">Mitigated Forecast</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-black text-emerald-400">-{overallReduction}% AQI</span>
                    <span className="text-[8px] font-bold text-cyan-400 uppercase">Active</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="unmitigatedGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#475569" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#475569" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="mitigatedGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px', fontSize: '10px' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  
                  {/* Classical Baseline */}
                  <Area type="monotone" dataKey="classical" stroke="#64748b" strokeWidth={1} strokeDasharray="4 4" fill="transparent" name="Classical LSTM unmitigated" />
                  
                  {/* Unmitigated Hybrid Forecast */}
                  <Area type="monotone" dataKey="hybrid" stroke="#22d3ee" strokeWidth={1.5} strokeDasharray="3 3" fill="url(#unmitigatedGlow)" name="Hybrid unmitigated forecast" />
                  
                  {/* MITIGATED Forecast Curve */}
                  <Area type="monotone" dataKey="mitigated" stroke="#10b981" strokeWidth={3} fill="url(#mitigatedGlow)" name="MITIGATED hybrid forecast" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* INTERVENTION SCHEDULING CALENDAR */}
          <div className="glass p-6 rounded-[32px] border border-slate-800 bg-slate-950/20 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-cyan-400" />
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block leading-none">Intervention Scheduling Calendar</span>
                  <span className="text-[11px] font-bold text-slate-400 mt-1 inline-block">Today's Municipal Timeblocks</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={triggerQuantumScheduling}
                  disabled={isQuantumAutoScheduling}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 hover:from-cyan-500/30 hover:to-emerald-500/30 border border-cyan-500/30 text-cyan-300 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all flex items-center gap-2"
                >
                  {isQuantumAutoScheduling ? (
                    <>
                      <Zap className="w-3.5 h-3.5 animate-spin" />
                      Fusing Matrix...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      QAOA Solve Optimal Calendar
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Calendar grid listing the 8 timeslots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TIME_SLOTS.map((slot, idx) => {
                // Find any scheduled interventions for this active sector and time slot
                const activeInterventions = interventions.filter(
                  item => item.sectorIndex === selectedSectorIndex && item.timeSlotIndex === idx
                );

                const projectedAqi = getSectorLiveAqi(selectedSectorIndex, idx);
                const projectedAqiInfo = getAqiColorInfo(projectedAqi);

                return (
                  <div 
                    key={slot}
                    className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl flex flex-col justify-between gap-3 relative hover:border-slate-800 hover:bg-slate-900/60 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-xs font-black text-slate-300">{slot}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-black text-slate-500 uppercase">Sim AQI:</span>
                        <span className={`text-xs font-mono font-black ${projectedAqiInfo.textClass}`}>
                          {projectedAqi}
                        </span>
                      </div>
                    </div>

                    {/* Active schedule blocks */}
                    <div className="space-y-1.5">
                      {activeInterventions.length > 0 ? (
                        activeInterventions.map((item) => {
                          const actionConfig = AVAILABLE_ACTIONS.find(a => a.id === item.actionId);
                          return (
                            <div 
                              key={item.id}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-[10px] font-bold ${actionConfig?.color || 'text-slate-400 border-slate-800'}`}
                            >
                              <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                                {item.actionLabel} (-{item.aqiBenefit} pts)
                              </span>
                              <button 
                                onClick={() => handleRemoveIntervention(item.id)}
                                className="text-slate-500 hover:text-rose-400 cursor-pointer p-0.5"
                                title="Cancel schedule"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-[10px] text-slate-500 font-mono italic">
                          No mitigation vectors scheduled
                        </div>
                      )}
                    </div>

                    {/* Add Schedule Button */}
                    <button
                      onClick={() => setSchedulingSlot({ sectorIndex: selectedSectorIndex, slotIndex: idx })}
                      className="mt-1 flex items-center justify-center gap-1.5 py-1 w-full border border-dashed border-slate-800 hover:border-slate-700 hover:bg-slate-900 rounded-lg text-[10px] font-bold text-slate-500 hover:text-white cursor-pointer transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Add Intervention
                    </button>
                  </div>
                );
              })}
            </div>

            {/* REAL-TIME SYSTEM LOGS IN CARD FOOTER */}
            <div className="border-t border-slate-900 pt-4 mt-2">
              <div className="flex items-center gap-1.5 mb-2">
                <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Hybrid Execution Logs</span>
              </div>
              <div className="bg-black/40 rounded-xl p-3 border border-slate-900 font-mono text-[9px] text-slate-400 leading-normal space-y-1 max-h-[85px] overflow-y-auto">
                {simulationLogs.map((log, lIdx) => (
                  <div key={lIdx} className="truncate">{log}</div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* POPUP SELECTION DIALOG FOR SCHEDULING ACTION */}
      {schedulingSlot !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-md rounded-[32px] p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button 
                onClick={() => setSchedulingSlot(null)}
                className="text-slate-500 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-black text-white tracking-tight">Schedule Mitigation Vector</h3>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Deploy a strategic environmental action at <span className="text-white font-bold">{activeCityData.sectors[schedulingSlot.sectorIndex].name}</span> during <span className="text-white font-bold">{TIME_SLOTS[schedulingSlot.slotIndex]}</span>.
            </p>

            <div className="space-y-3">
              {AVAILABLE_ACTIONS.map((action) => {
                return (
                  <button
                    key={action.id}
                    onClick={() => handleAddIntervention(action.id)}
                    className="w-full flex items-center justify-between p-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800/80 rounded-2xl cursor-pointer text-left transition-colors"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-black text-white">{action.label}</span>
                      <span className="text-[10px] text-slate-500">Resource impact weight: ₹{action.cost} Lakhs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded">
                        -{action.benefit} AQI
                      </span>
                      <Plus className="w-4 h-4 text-slate-500" />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSchedulingSlot(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-black text-white rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PredictionDashboard;
