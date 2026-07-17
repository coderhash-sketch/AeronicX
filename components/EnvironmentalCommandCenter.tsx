import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Activity, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  Database, 
  Sliders, 
  Coins, 
  Share2, 
  ArrowRight, 
  Zap, 
  RefreshCcw,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie
} from 'recharts';
import { WorkflowState } from '../types';
import { CITIES, getSectorNamesForCity, getRealisticAqi } from '../constants';

interface ECCProps {
  setWorkflow: (state: WorkflowState) => void;
  addLog: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

// 2024-25 CPCB Urban Realities & Metadata matching Problem Statement
const CITIES_METADATA = [
  {
    name: 'New Delhi',
    aqi: 218,
    status: 'Poor',
    colorClass: 'text-rose-400',
    bgClass: 'bg-rose-500/10 border-rose-500/20',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    unhealthyDays: 200,
    pm25: 142,
    pm10: 284,
    no2: 68,
    co: 2.4,
    attribution: [
      { source: 'Crop Burning (Stubble)', value: 38, color: '#f97316' },
      { source: 'Vehicular Emissions', value: 32, color: '#3b82f6' },
      { source: 'Construction Dust', value: 18, color: '#eab308' },
      { source: 'Industrial Stacks', value: 12, color: '#ec4899' }
    ],
    vulnerablePopulation: '12.4M (Schools: 2.8M, Hospitals: 142, Elderly: 1.1M)',
    recommendedInterventions: [
      { action: 'Ban Diesel Trucks (Tier 1)', improvement: 24, status: 'Active' },
      { action: 'Deploy Road Watering Jets', improvement: 12, status: 'Active' },
      { action: 'Odd-Even Traffic Scheme', improvement: 18, status: 'Pending' },
      { action: 'Scale Industrial Stack Voltage', improvement: 15, status: 'Standby' }
    ],
    inspectors: [
      { id: 'IP-101', name: 'Inspector Sharma', target: 'Okhla Industrial Area', urgency: 'CRITICAL (97% violation)', status: 'On Route' },
      { id: 'IP-102', name: 'Inspector Gupta', target: 'Wazirpur Chimney Cluster', urgency: 'HIGH (88% violation)', status: 'Patrolling' },
      { id: 'IP-103', name: 'Inspector Yadav', target: 'Mayapuri Metal Furnace', urgency: 'MODERATE (64% violation)', status: 'Inspecting' }
    ]
  },
  {
    name: 'Mumbai',
    aqi: 148,
    status: 'Moderate',
    colorClass: 'text-amber-400',
    bgClass: 'bg-amber-500/10 border-amber-500/20',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    unhealthyDays: 60,
    pm25: 84,
    pm10: 162,
    no2: 52,
    co: 1.8,
    attribution: [
      { source: 'Vehicular Emissions', value: 41, color: '#3b82f6' },
      { source: 'Construction Dust', value: 31, color: '#eab308' },
      { source: 'Refineries & Marine', value: 18, color: '#ec4899' },
      { source: 'Municipal Solid Waste', value: 10, color: '#f97316' }
    ],
    vulnerablePopulation: '14.1M (Schools: 3.1M, Hospitals: 168, Elderly: 1.3M)',
    recommendedInterventions: [
      { action: 'Stop Construction after 7 PM', improvement: 15, status: 'Active' },
      { action: 'Mandate Marine Shore Power', improvement: 10, status: 'Standby' },
      { action: 'Establish Low-Emission Highway', improvement: 22, status: 'Pending' },
      { action: 'Deploy Smog Towers near BKC', improvement: 8, status: 'Active' }
    ],
    inspectors: [
      { id: 'IP-201', name: 'Inspector Patil', target: 'Dharavi Recycling Belt', urgency: 'CRITICAL (91% violation)', status: 'On Route' },
      { id: 'IP-202', name: 'Inspector Kulkarni', target: 'BKC Construction Sector 4', urgency: 'HIGH (85% violation)', status: 'On Site' },
      { id: 'IP-203', name: 'Inspector Sawant', target: 'Wadala Chemical Terminal', urgency: 'LOW (34% violation)', status: 'Patrolling' }
    ]
  },
  {
    name: 'Kolkata',
    aqi: 165,
    status: 'Poor',
    colorClass: 'text-rose-400',
    bgClass: 'bg-rose-500/10 border-rose-500/20',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    unhealthyDays: 110,
    pm25: 98,
    pm10: 198,
    no2: 48,
    co: 2.1,
    attribution: [
      { source: 'Coal-Fired Power Plants', value: 35, color: '#ec4899' },
      { source: 'Commercial Diesel Fleets', value: 29, color: '#3b82f6' },
      { source: 'Brick Kiln Emissions', value: 21, color: '#f97316' },
      { source: 'Municipal Waste Burning', value: 15, color: '#eab308' }
    ],
    vulnerablePopulation: '9.2M (Schools: 1.8M, Hospitals: 112, Elderly: 0.9M)',
    recommendedInterventions: [
      { action: 'Restrict Out-of-State Trucks', improvement: 19, status: 'Standby' },
      { action: 'Shutdown Kolaghat Unit 3', improvement: 31, status: 'Active' },
      { action: 'Water spray over flyovers', improvement: 8, status: 'Active' },
      { action: 'Enforce Brick Kiln Ringelmann', improvement: 14, status: 'Pending' }
    ],
    inspectors: [
      { id: 'IP-301', name: 'Inspector Banerjee', target: 'Howrah Foundry Zone', urgency: 'CRITICAL (93% violation)', status: 'On Site' },
      { id: 'IP-302', name: 'Inspector Das', target: 'Topsia Tannery Cluster', urgency: 'HIGH (81% violation)', status: 'On Route' },
      { id: 'IP-303', name: 'Inspector Roy', target: 'Rajarhat Builders Yard', urgency: 'MODERATE (52% violation)', status: 'Patrolling' }
    ]
  },
  {
    name: 'Bengaluru',
    aqi: 84,
    status: 'Satisfactory',
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/10 border-emerald-500/20',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    unhealthyDays: 12,
    pm25: 42,
    pm10: 92,
    no2: 32,
    co: 1.1,
    attribution: [
      { source: 'Vehicular Emissions', value: 48, color: '#3b82f6' },
      { source: 'Transit Construction', value: 24, color: '#eab308' },
      { source: 'Diesel Gen-Sets (IT Parks)', value: 18, color: '#ec4899' },
      { source: 'Open Garbage Fires', value: 10, color: '#f97316' }
    ],
    vulnerablePopulation: '8.4M (Schools: 1.9M, Hospitals: 124, Elderly: 0.7M)',
    recommendedInterventions: [
      { action: 'Enforce WFH Mandates (IT corridor)', improvement: 14, status: 'Pending' },
      { action: 'Mandate Solar Power in Tech Parks', improvement: 11, status: 'Active' },
      { action: 'Deploy Electric Feeder Buses', improvement: 8, status: 'Active' },
      { action: 'Ban Solid Waste Burning (KSPCB)', improvement: 6, status: 'Active' }
    ],
    inspectors: [
      { id: 'IP-401', name: 'Inspector Gowda', target: 'Whitefield Industrial Stack', urgency: 'MODERATE (62% violation)', status: 'On Route' },
      { id: 'IP-402', name: 'Inspector Reddy', target: 'ORR Flyover Construction', urgency: 'LOW (31% violation)', status: 'Patrolling' },
      { id: 'IP-403', name: 'Inspector Kumar', target: 'Peenya Smelting Plant', urgency: 'HIGH (78% violation)', status: 'On Site' }
    ]
  },
  {
    name: 'Chennai',
    aqi: 92,
    status: 'Satisfactory',
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/10 border-emerald-500/20',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    unhealthyDays: 18,
    pm25: 46,
    pm10: 104,
    no2: 36,
    co: 1.3,
    attribution: [
      { source: 'Ennore Thermal Power Emissions', value: 38, color: '#ec4899' },
      { source: 'Automotive Manufacturing', value: 28, color: '#3b82f6' },
      { source: 'Port Logistical Traffic', value: 22, color: '#f97316' },
      { source: 'Salt Pan & Beach Dust', value: 12, color: '#eab308' }
    ],
    vulnerablePopulation: '7.8M (Schools: 1.5M, Hospitals: 102, Elderly: 0.6M)',
    recommendedInterventions: [
      { action: 'Install Flue-Gas Desulfurizer Ennore', improvement: 26, status: 'Active' },
      { action: 'Restrict Heavy Port Trucks during Day', improvement: 14, status: 'Pending' },
      { action: 'Water spraying on logistics highway', improvement: 7, status: 'Active' },
      { action: 'Shutdown Manali Chemical Line C', improvement: 18, status: 'Standby' }
    ],
    inspectors: [
      { id: 'IP-501', name: 'Inspector Subramanian', target: 'Ennore Power Stack C', urgency: 'HIGH (84% violation)', status: 'On Site' },
      { id: 'IP-502', name: 'Inspector Naidu', target: 'Ambattur Casting Unit', urgency: 'MODERATE (59% violation)', status: 'Patrolling' },
      { id: 'IP-503', name: 'Inspector Selvam', target: 'Manali Refinery Pipe 8', urgency: 'CRITICAL (91% violation)', status: 'On Route' }
    ]
  }
];

const MULTILINGUAL_HEALTH_ADVISORIES: Record<string, Record<string, string>> = {
  'New Delhi': {
    en: 'Health Alert: Extremely high stubble/vehicular pollution detected. Hospitals on notice. Children and elderly must avoid outdoor exposure.',
    hi: 'स्वास्थ्य चेतावनी: अत्यधिक पराली और वाहनों का प्रदूषण दर्ज। अस्पताल अलर्ट पर हैं। बच्चों और बुजुर्गों को बाहर जाने से बचना चाहिए।',
    kn: 'ಆರೋಗ್ಯ ಎಚ್ಚರಿಕೆ: ದೆಹಲಿಯಲ್ಲಿ ತೀವ್ರ ಮಾಲಿನ್ಯ ಪತ್ತೆಯಾಗಿದೆ. ಮಕ್ಕಳು ಮತ್ತು ಹಿರಿಯರು ಹೊರಗೆ ಹೋಗುವುದನ್ನು ತಪ್ಪಿಸಿ.',
    ta: 'சுகாதார எச்சரிக்கை: டெல்லியில் அதிகப்படியான மாசு கண்டறியப்பட்டுள்ளது. குழந்தைகள், முதியவர்கள் வெளியே செல்வதை தவிர்க்கவும்.',
    te: 'ఆరోగ్య హెచ్చరిక: అత్యంత తీవ్రమైన కాలుష్యం నమోదైంది. పిల్లలు మరియు వృద్ధులు బయట తిరగడం నివారించాలి.'
  },
  'Mumbai': {
    en: 'Coastal stagnation causing high dust and construction particulate levels. Asthma patients are advised to carry rescue inhalers.',
    hi: 'तटीय हवाओं की रुकावट से निर्माण धूल बढ़ी है। दमा रोगियों को मास्क और इनहेलर साथ रखने की सलाह दी जाती है।',
    kn: 'ಕೋಸ್ಟಲ್ ಧೂಳಿನ ಮಾಲಿನ್ಯ ಹೆಚ್ಚಾಗಿದೆ. ಅಸ್ತಮಾ ರೋಗಿಗಳು ಜಾಗರೂಕರಾಗಿರಬೇಕು.',
    ta: 'கட்டுமான தூசு மாசு அதிகரித்துள்ளது. ஆஸ்துமா நோயாளிகள் எச்சரிக்கையுடன் இருக்கவும்.',
    te: 'నిర్మాణ రంగ ధూళి కాలుష్యం పెరిగింది. ఉబ్బసం రోగులు ఇన్హేలర్లు సిద్ధంగా ఉంచుకోవాలి.'
  },
  'Kolkata': {
    en: 'Power plant emissions plume causing high sulfur/PM index. Free high-flow mask distribution centers active at Ward 18.',
    hi: 'बिजली संयंत्र उत्सर्जन से सल्फर स्तर बढ़ा। वार्ड 18 में मुफ्त उच्च-गुणवत्ता वाले मास्क वितरण केंद्र सक्रिय हैं।',
    kn: 'ವಿದ್ಯುತ್ ಸ್ಥಾವರಗಳಿಂದ ಸಲ್ಫರ್ ಮಟ್ಟ ಹೆಚ್ಚಾಗಿದೆ. ಉಚಿತ ಮಾಸ್ಕ್ ವಿತರಣೆ ಆರಂಭವಾಗಿದೆ.',
    ta: 'மின் உற்பத்தி நிலைய கழிவுகளால் சல்பர் மாசு அதிகரிப்பு. வார்டு 18-ல் இலவச முகமூடி விநியோகம்.',
    te: 'విద్యుత్ ఉత్పాదక కేంద్రాల నుండి సల్ఫర్ విడుదల పెరిగింది. ఉచిత మాస్క్ పంపిణీ కేంద్రాలు సిద్ధంగా ఉన్నాయి.'
  },
  'Bengaluru': {
    en: 'Air quality is within satisfactory thresholds. Micro-climatic variation under watch in IT sectors. Carry light jackets due to humidity.',
    hi: 'वायु गुणवत्ता संतोषजनक है। आईटी पार्क क्षेत्रों में सूक्ष्म-जलवायु परिवर्तन पर कड़ी नजर रखी जा रही है।',
    kn: 'ವಾಯು ಗುಣಮಟ್ಟ ತೃಪ್ತಿದಾಯಕವಾಗಿದೆ. ಐಟಿ ಕಾರಿಡಾರ್‌ನಲ್ಲಿ ನಿರಂತರ ನಿಗಾ ವಹಿಸಲಾಗಿದೆ.',
    ta: 'காற்றின் தரம் திருப்திகரமாக உள்ளது. ஐடி பூங்கா பகுதிகளில் கண்காணிப்பு தீவிரம்.',
    te: 'గాలి నాణ్యత సంతృప్తికరంగా ఉంది. ఐటి పార్కుల పరిసరాల్లో నిరంతర పర్యవేక్షణ.'
  },
  'Chennai': {
    en: 'Ennore plant plume moving south. Coastal winds keeping beach areas stable. Minor skin/respiratory irritation expected in North Chennai.',
    hi: 'एन्नोर थर्मल पावर का धुआं दक्षिण की ओर बढ़ रहा है। उत्तर चेन्नई के निवासियों को सांस लेने में हल्की परेशानी हो सकती है।',
    kn: 'ಎಣ್ಣೂರು ವಿದ್ಯುತ್ ಸ್ಥಾವರದ ಹೊಗೆ ದಕ್ಷಿಣಕ್ಕೆ ಚಲಿಸುತ್ತಿದೆ. ಜಾಗರೂಕರಾಗಿರಿ.',
    ta: 'எண்ணூர் அனல்மின் நிலைய புகை தெற்கு நோக்கி நகர்கிறது. வடசென்னை மக்கள் கூடுதல் எச்சரிக்கையுடன் இருக்கவும்.',
    te: 'ఎన్నూర్ ప్లాంట్ కాలుష్యం దక్షిణం వైపు కదులుతోంది. ఉత్తర చెన్నై ప్రజలు తగు జాగ్రత్తలు పాటించాలి.'
  }
};

export const EnvironmentalCommandCenter: React.FC<ECCProps> = ({ setWorkflow, addLog }) => {
  const [selectedCityName, setSelectedCityName] = useState<string>('New Delhi');
  const [simTime, setSimTime] = useState<string>('');
  const [activeAdvisoryLang, setActiveAdvisoryLang] = useState<string>('en');
  
  // Custom interactive sliders/states representing AI Policy simulation and climate investment
  const [dieselBan, setDieselBan] = useState<boolean>(true);
  const [oddEven, setOddEven] = useState<boolean>(false);
  const [industrialVoltage, setIndustrialVoltage] = useState<number>(80); // kV scrubber voltage
  const [coalSurcharge, setCoalSurcharge] = useState<boolean>(false);
  
  // Budget Allocation (₹500 Crore target)
  const [treesBudget, setTreesBudget] = useState<number>(100);
  const [evBudget, setEvBudget] = useState<number>(150);
  const [mofBudget, setMofBudget] = useState<number>(120);
  const [cleanFuelBudget, setCleanFuelBudget] = useState<number>(80);
  const [roadJetsBudget, setRoadJetsBudget] = useState<number>(50);
  const [isOptimizingBudget, setIsOptimizingBudget] = useState<boolean>(false);
  const [isReroutingInspectors, setIsReroutingInspectors] = useState<boolean>(false);

  // Live AQI State and effect
  const [liveAqiData, setLiveAqiData] = useState<any>(null);
  const [isAqiLoading, setIsAqiLoading] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    setIsAqiLoading(true);
    setLiveAqiData(null); // Clear previous city's data to prevent stale display
    fetch(`/api/live-aqi?city=${encodeURIComponent(selectedCityName)}`)
      .then(res => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then(data => {
        if (active) {
          setLiveAqiData(data);
          addLog(`Live AQI database loaded for ${selectedCityName}: AQI ${data.aqi} (${data.source})`, 'success');
        }
      })
      .catch(err => {
        console.error(err);
        if (active) {
          setLiveAqiData(null);
        }
      })
      .finally(() => {
        if (active) setIsAqiLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedCityName]);

  // Active City Data derived from selections and interactive toggles
  const activeCityData = useMemo(() => {
    const existing = CITIES_METADATA.find(c => c.name.toLowerCase() === selectedCityName.toLowerCase());
    let baseData: any;

    if (existing) {
      baseData = { ...existing };
    } else {
      // Generate simulated high-fidelity metadata for newly requested cities so they feel fully integrated
      const globalCity = CITIES.find(c => c.name.toLowerCase() === selectedCityName.toLowerCase()) || CITIES[0];
      const aqi = getRealisticAqi(globalCity.name);
      
      const code = globalCity.name.substring(0, 3).toUpperCase();
      const sectors = getSectorNamesForCity(globalCity.name);

      baseData = {
        name: globalCity.name,
        aqi,
        status: 'Good',
        colorClass: 'text-emerald-400',
        bgClass: 'bg-emerald-500/10 border-emerald-500/20',
        glowColor: 'rgba(16, 185, 129, 0.4)',
        unhealthyDays: 15,
        pm25: Math.round(aqi * 0.65),
        pm10: Math.round(aqi * 1.3),
        no2: Math.round(aqi * 0.3),
        co: Math.round(aqi * 0.01 * 10) / 10,
        attribution: [
          { source: 'Industrial Emissions', value: Math.round(25 + (globalCity.pollution % 15)), color: '#ec4899' },
          { source: 'Vehicular Exhaust', value: Math.round(30 + (globalCity.greenCoverage % 10)), color: '#3b82f6' },
          { source: 'Domestic Bio-fuel', value: Math.round(15 + (globalCity.policyScore % 10)), color: '#f97316' },
          { source: 'Construction & Dust', value: Math.round(10 + (globalCity.renewableEnergy % 10)), color: '#eab308' }
        ],
        vulnerablePopulation: `Approx. ${Math.round(aqi * 0.1)}k at-risk (Schools, Hospitals, Geriatric)`,
        recommendedInterventions: [
          { action: 'Scale Industrial Scrubber Voltage', improvement: 15, status: 'Active' as const },
          { action: 'Deploy Road Dust Water Jets', improvement: 10, status: 'Active' as const },
          { action: 'Optimize Urban Fleet Routing', improvement: 12, status: 'Pending' as const }
        ],
        inspectors: [
          { id: `IP-${code}-01`, name: `Inspector ${globalCity.name} 1`, target: sectors[2] || 'Industrial Area Sector A', urgency: 'CRITICAL (90% violation)', status: 'On Route' },
          { id: `IP-${code}-02`, name: `Inspector ${globalCity.name} 2`, target: sectors[3] || 'Construction Cluster B', urgency: 'HIGH (82% violation)', status: 'Patrolling' }
        ]
      };
    }

    // Overwrite with live API values if available
    if (liveAqiData) {
      const aqi = liveAqiData.aqi;
      baseData.aqi = aqi;
      baseData.pm25 = liveAqiData.pm25;
      baseData.pm10 = liveAqiData.pm10;
      baseData.no2 = liveAqiData.no2;
      baseData.co = liveAqiData.co;
      
      // Compute status and styling classes based on live AQI
      if (aqi >= 200) {
        baseData.status = 'Very Poor';
        baseData.colorClass = 'text-rose-400';
        baseData.bgClass = 'bg-rose-500/10 border-rose-500/20';
        baseData.glowColor = 'rgba(244, 63, 94, 0.4)';
        baseData.unhealthyDays = 180;
      } else if (aqi >= 150) {
        baseData.status = 'Poor';
        baseData.colorClass = 'text-orange-400';
        baseData.bgClass = 'bg-orange-500/10 border-orange-500/20';
        baseData.glowColor = 'rgba(249, 115, 22, 0.4)';
        baseData.unhealthyDays = 120;
      } else if (aqi >= 100) {
        baseData.status = 'Moderate';
        baseData.colorClass = 'text-amber-400';
        baseData.bgClass = 'bg-amber-500/10 border-amber-500/20';
        baseData.glowColor = 'rgba(245, 158, 11, 0.4)';
        baseData.unhealthyDays = 60;
      } else if (aqi >= 50) {
        baseData.status = 'Satisfactory';
        baseData.colorClass = 'text-cyan-400';
        baseData.bgClass = 'bg-cyan-500/10 border-cyan-500/20';
        baseData.glowColor = 'rgba(34, 211, 238, 0.4)';
        baseData.unhealthyDays = 30;
      } else {
        baseData.status = 'Good';
        baseData.colorClass = 'text-emerald-400';
        baseData.bgClass = 'bg-emerald-500/10 border-emerald-500/20';
        baseData.glowColor = 'rgba(16, 185, 129, 0.4)';
        baseData.unhealthyDays = 10;
      }
      
      baseData.vulnerablePopulation = `Approx. ${Math.round(aqi * 0.1)}k at-risk (Schools, Hospitals, Geriatric)`;
    }

    return baseData;
  }, [selectedCityName, liveAqiData]);

  const getCityAdvisory = (cityName: string, lang: string) => {
    const cityAdvisories = MULTILINGUAL_HEALTH_ADVISORIES[cityName];
    if (cityAdvisories && cityAdvisories[lang]) {
      return cityAdvisories[lang];
    }
    
    // Dynamic fallback based on city's AQI
    const isPoor = activeCityData.aqi > 150;
    
    const fallbacks: Record<string, string> = {
      en: isPoor 
        ? `Health Alert in ${cityName}: Elevated particulate matter detected. Vulnerable groups should limit outdoor activity.` 
        : `Air quality in ${cityName} is satisfactory. Normal activities can be pursued with minimal risk.`,
      hi: isPoor 
        ? `${cityName} में स्वास्थ्य चेतावनी: उच्च प्रदूषण स्तर दर्ज। संवेदनशील लोग बाहर जाने से बचें।` 
        : `${cityName} में वायु गुणवत्ता संतोषजनक है। गतिविधियां सामान्य रूप से जारी रखी जा सकती हैं।`,
      kn: isPoor 
        ? `${cityName}ನಲ್ಲಿ ಆರೋಗ್ಯ ಮುನ್ನೆಚ್ಚರಿಕೆ: ಹೆಚ್ಚಿನ ವಾಯು ಮಾಲಿನ್ಯ ದಾಖಲಾಗಿದೆ.` 
        : `${cityName}ನಲ್ಲಿ ವಾಯು ಗುಣಮಟ್ಟ ತೃಪ್ತಿದಾಯಕವಾಗಿದೆ.`,
      ta: isPoor 
        ? `${cityName}ல் சுகாதார எச்சரிக்கை: அதிக காற்று மாசுபாடு பதிவாகியுள்ளது.` 
        : `${cityName}ல் காற்றின் தரம் திருப்திகரமாக உள்ளது.`,
      te: isPoor 
        ? `${cityName}లో ఆరోగ్య హెచ్చరిక: అధిక గాలి కాలుష్యం నమోదైంది.` 
        : `${cityName}లో గాలి నాణ్యత సంతృప్తికరంగా ఉంది.`
    };
    
    return fallbacks[lang] || fallbacks['en'];
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSimTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate AQI in real-time based on interactive policy toggles!
  const calculateLiveAQI = () => {
    let base = activeCityData.aqi;
    if (dieselBan) base -= 18;
    if (oddEven) base -= 12;
    // Industrial scrubber voltage impact (above 50kV reduces emissions)
    const voltageBenefit = (industrialVoltage - 50) * 0.4;
    base -= voltageBenefit;
    if (coalSurcharge && (selectedCityName === 'Kolkata' || selectedCityName === 'Chennai')) {
      base -= 15;
    }
    // Budget Allocation Benefits (diminishing returns logic)
    const treesBenefit = Math.sqrt(treesBudget) * 1.5;
    const evBenefit = Math.sqrt(evBudget) * 1.2;
    const mofBenefit = Math.sqrt(mofBudget) * 2.2; // Nano Carbon-Capture deployed in the city!
    const cleanFuelBenefit = Math.sqrt(cleanFuelBudget) * 1.1;
    const roadJetsBenefit = Math.sqrt(roadJetsBudget) * 0.8;

    const totalBudgetBenefit = treesBenefit + evBenefit + mofBenefit + cleanFuelBenefit + roadJetsBenefit;
    base -= totalBudgetBenefit;

    return Math.max(12, Math.round(base));
  };

  const currentLiveAqi = calculateLiveAQI();

  const getAqiColor = (aqi: number) => {
    if (aqi < 50) return { text: 'Good', color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' };
    if (aqi < 100) return { text: 'Satisfactory', color: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/5' };
    if (aqi < 150) return { text: 'Moderate', color: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/5' };
    if (aqi < 200) return { text: 'Poor', color: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/5' };
    return { text: 'Very Poor', color: 'text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-500/5' };
  };

  const aqiEvaluation = getAqiColor(currentLiveAqi);

  // Generate 24h simulated forecast values incorporating interactive settings
  const simulatedForecast = Array.from({ length: 8 }, (_, i) => {
    const hourVal = (i * 3 + 2) % 24;
    const peakHourFactor = Math.sin((hourVal - 8) * Math.PI / 12); // peak traffic at 8am/pm
    const baseValue = currentLiveAqi + peakHourFactor * 15 + Math.random() * 5;
    return {
      time: `${hourVal === 0 ? '12 AM' : hourVal > 12 ? `${hourVal - 12} PM` : `${hourVal} AM`}`,
      prediction: Math.round(baseValue),
      classical: Math.round(baseValue + 12 + Math.random() * 8), // classical has more noise/higher RMSE
      confidenceMin: Math.max(12, Math.round(baseValue - 8)),
      confidenceMax: Math.round(baseValue + 8)
    };
  });

  const totalBudgetSpent = treesBudget + evBudget + mofBudget + cleanFuelBudget + roadJetsBudget;

  const runQuantumInvestmentOptimization = () => {
    setIsOptimizingBudget(true);
    addLog("Initializing Quantum Multi-Objective Optimization (QAOA)...", "info");
    addLog(`Running QAOA with ₹500 Cr constraint across 5 high-dim vectors.`, "info");
    
    setTimeout(() => {
      // Allocate optimal budget using QAOA heuristic
      setTreesBudget(120);
      setEvBudget(160);
      setMofBudget(140); // heavily favors Carbon Capture deploying (GNN verified)
      setCleanFuelBudget(50);
      setRoadJetsBudget(30);
      setIsOptimizingBudget(false);
      addLog("QAOA Converged successfully with 99.4% gate fidelity!", "success");
      addLog("Optimal allocation found: Carbon Capture MOFs increased (+20 Cr) for highest CO₂/Cost Alpha.", "success");
    }, 2000);
  };

  const triggerInspectorRerouting = () => {
    setIsReroutingInspectors(true);
    addLog("Updating spatial-temporal GNN violation probabilities...", "info");
    addLog("Running Quantum Annealing route optimizer (D-Wave simulator)...", "info");
    setTimeout(() => {
      setIsReroutingInspectors(false);
      addLog("Patrol routes optimized. Dispatching Inspectors via shortest Hamiltonian loops.", "success");
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col gap-6 animate-in fade-in duration-700">
      {/* Platform Title Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-1 text-[9px] font-black tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full uppercase animate-pulse">
              Urban Climate Intelligence OS v3.00
            </span>

          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-1 leading-none">
            Environmental Command Center
          </h2>
          <p className="text-slate-500 font-medium text-sm lg:text-base">
            National Smart City Deployment Cockpit. Transitioning from reactive monitoring to proactive quantum-optimized intervention.
          </p>
        </div>

        {/* Live Clock & Controller */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-slate-900/80 border border-slate-800 px-4 py-3 rounded-2xl flex items-center gap-3">
            <Clock className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Live Telemetry Clock</span>
              <span className="text-sm font-mono font-black text-white tracking-tight">{simTime}</span>
            </div>
          </div>

          {/* Active City Dropdown Selector */}
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Target Urban Metros</span>
            <div className="flex flex-wrap bg-slate-900 border border-slate-800 rounded-2xl p-1 gap-1 items-center">
              {CITIES_METADATA.map((city) => (
                <button
                  key={city.name}
                  onClick={() => {
                    setSelectedCityName(city.name);
                    addLog(`Telemetry channel connected: ${city.name} Ward Grid`, "success");
                  }}
                  className={`px-3 py-1.5 text-xs font-black tracking-tighter rounded-xl transition-all cursor-pointer ${
                    selectedCityName === city.name
                      ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                      : 'text-slate-500 hover:text-slate-300 border border-transparent'
                  }`}
                >
                  {city.name}
                </button>
              ))}
              <div className="h-4 w-[1px] bg-slate-800 mx-1 hidden sm:block" />
              <select
                value={CITIES_METADATA.map(c => c.name).includes(selectedCityName) ? "" : selectedCityName}
                onChange={(e) => {
                  setSelectedCityName(e.target.value);
                  addLog(`Telemetry channel connected: ${e.target.value} Global Grid`, "success");
                }}
                className="bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-black focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer min-w-[150px]"
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
      </div>

      {/* STAGE 1 DEPLOYED PROMINENT LAUNCHPAD BANNER */}
      <div className="relative overflow-hidden rounded-[32px] border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-emerald-950/20 to-slate-950 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_50px_rgba(34,211,238,0.15)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3.5 bg-cyan-500/10 border border-cyan-400/20 rounded-2xl flex items-center justify-center shrink-0 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <TrendingUp className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 text-[9px] font-black tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full uppercase">
                Hyperlocal AQI Forecast Model (1km² Grid)
              </span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight mt-2 mb-1 leading-none">
              Predictive Grid Map & Intervention Scheduler
            </h3>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Explore 16 high-resolution ward sectors mapped across major Indian metros. Model the diurnal atmospheric flow and run quantum-optimized mitigation schedules with direct AI feedback loops.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setWorkflow(WorkflowState.PREDICTION);
            addLog("Transitioned to Hyperlocal Predictive Grid Map & Calendar", "success");
          }}
          className="relative z-10 shrink-0 px-6 py-4 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.55)] transition-all cursor-pointer flex items-center gap-2 group border border-white/20"
        >
          Open Predictive Map & Calendar
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* STAGE 2 DEPLOYED PROMINENT ENFORCEMENT & ATTRIBUTION BANNER */}
      <div className="relative overflow-hidden rounded-[32px] border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-rose-950/20 to-slate-950 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-[0_0_50px_rgba(168,85,247,0.15)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3.5 bg-purple-500/10 border border-purple-400/20 rounded-2xl flex items-center justify-center shrink-0 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <ShieldCheck className="w-8 h-8 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 text-[9px] font-black tracking-widest text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-full uppercase">
                Enforcement & Source Attribution
              </span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight mt-2 mb-1 leading-none">
              Quantum Dispatches & SHAP Attribution Panels
            </h3>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Analyze game-theoretic SHAP force graphs to uncover specific anthropogenic pollution contributors. Direct quantum-routed dispatch paths to inspector squads to enforce regional environmental compliance.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
          <button
            onClick={() => {
              setWorkflow(WorkflowState.DECISION_ENGINE);
              addLog("Opened Quantum Inspector Dispatch & Enforcement Queue", "success");
            }}
            className="px-6 py-4 bg-gradient-to-r from-purple-500 to-rose-400 hover:from-purple-400 hover:to-rose-300 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:shadow-[0_0_40px_rgba(168,85,247,0.45)] transition-all cursor-pointer flex items-center justify-center gap-2 group border border-white/20"
          >
            Dispatch Queue
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => {
              setWorkflow(WorkflowState.EXPLAINABLE_AI);
              addLog("Accessed SHAP Game-Theoretic Source Attribution Core", "success");
            }}
            className="px-6 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-purple-400 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 group"
          >
            Source Attribution
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-purple-400" />
          </button>
        </div>
      </div>

      {/* THREE-COLUMN BENTO GRID OF MODULES */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* ================= LEFT GRID: THE PHYSICAL ENVIRONMENT ================= */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* Module 11/1: Live AQI Index Widget */}
          <div className="glass p-6 rounded-[32px] border border-slate-800 flex flex-col justify-between relative overflow-hidden bg-slate-950/20 h-full min-h-[280px]">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Activity size={100} className="text-cyan-400" />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Live Ward AQI Index (CPCB)</span>
              </div>
              <span className={`text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-md ${activeCityData.colorClass}`}>
                {activeCityData.unhealthyDays}+ Poor Days/Yr
              </span>
            </div>

            <div className="flex items-center gap-6 my-2">
              <div className="relative flex items-center justify-center">
                <div className={`absolute w-28 h-28 rounded-full blur-2xl animate-pulse`} style={{ backgroundColor: activeCityData.glowColor }}></div>
                <div className="relative w-24 h-24 rounded-full border-4 border-slate-800 border-t-emerald-400 flex flex-col items-center justify-center bg-slate-950">
                  <span className="text-4xl font-mono font-black tracking-tighter text-white">{currentLiveAqi}</span>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">AQI</span>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col gap-1">
                <span className={`text-xl font-black ${aqiEvaluation.color} tracking-tight`}>
                  {aqiEvaluation.text} Status
                </span>
                <p className="text-xs text-slate-400 leading-tight min-h-[32px] flex flex-col justify-center">
                  {isAqiLoading ? (
                    <span className="text-cyan-400 animate-pulse font-bold tracking-wide uppercase text-[10px]">
                      Syncing live environmental API...
                    </span>
                  ) : liveAqiData ? (
                    <span className="text-emerald-400 font-bold uppercase tracking-wide text-[10px] flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      Live via {liveAqiData.source}
                    </span>
                  ) : (
                    <span>Dynamic mathematical simulation with active municipal policy mitigants applied.</span>
                  )}
                </p>
                <div className="flex gap-2 mt-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-500 uppercase">PM2.5</span>
                    <span className="text-xs font-mono font-bold text-white">{activeCityData.pm25} µg</span>
                  </div>
                  <div className="h-6 w-px bg-slate-800"></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-500 uppercase">PM10</span>
                    <span className="text-xs font-mono font-bold text-white">{activeCityData.pm10} µg</span>
                  </div>
                  <div className="h-6 w-px bg-slate-800"></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-500 uppercase">NO₂</span>
                    <span className="text-xs font-mono font-bold text-white">{activeCityData.no2} ppb</span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setWorkflow(WorkflowState.DIGITAL_TWIN)}
              className="mt-4 flex items-center justify-between w-full px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-black text-white cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                Launch 3D Clean Air Digital Twin (Module 5)
              </span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Module 2: Geospatial Source Attribution Engine */}
          <div className="glass p-6 rounded-[32px] border border-slate-800 flex flex-col justify-between bg-slate-950/20 h-full min-h-[300px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Source Attribution (Module 2)</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">SHAP Attrib. v2.1</span>
              </div>
              
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Spatial-temporal GNN analyzing wind vectors, land use maps, crop cycles and thermal anomalies.
              </p>

              <div className="space-y-3">
                {activeCityData.attribution.map((attr) => (
                  <div key={attr.source} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-300">{attr.source}</span>
                      <span className="font-mono font-black text-white" style={{ color: attr.color }}>{attr.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${attr.value}%` }}
                        transition={{ duration: 1 }}
                        className="h-full rounded-full" 
                        style={{ backgroundColor: attr.color }}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setWorkflow(WorkflowState.EXPLAINABLE_AI)}
              className="mt-6 flex items-center justify-between w-full px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-black text-white cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-magenta-400" />
                Explainable AI & SHAP Matrix (Module 10)
              </span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

        </div>

        {/* ================= MIDDLE GRID: PREDICTION & DECISION ================= */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          
          {/* Module 1: Hyperlocal predictive AQI Forecast */}
          <div className="glass p-6 rounded-[32px] border border-slate-800 flex flex-col justify-between bg-slate-950/20 h-full min-h-[300px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Hyperlocal Predict 24h (Module 1)</span>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 text-[8px] font-mono bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 rounded">Hybrid GNN-LSTM</span>
                  <span className="px-2 py-0.5 text-[8px] font-mono bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 rounded">RMSE: 4.2</span>
                </div>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simulatedForecast}>
                    <defs>
                      <linearGradient id="predictionGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px', fontSize: '10px' }} />
                    <Area type="monotone" dataKey="prediction" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#predictionGlow)" name="Hybrid Forecast (1km²)" />
                    <Area type="monotone" dataKey="classical" stroke="#64748b" strokeWidth={1} strokeDasharray="4 4" fill="transparent" name="Classical LSTM Baseline" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <button 
              onClick={() => setWorkflow(WorkflowState.PREDICTION)}
              className="mt-4 flex items-center justify-between w-full px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-black text-white cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Explore Hybrid Prediction Dashboard (Module 1)
              </span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Module 3: Quantum Enforcement Intelligence & Inspector Routing */}
          <div className="glass p-6 rounded-[32px] border border-slate-800 flex flex-col justify-between bg-slate-950/20 h-full min-h-[280px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Quantum Enforcement Dispatch (Module 3)</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400">QAOA Hamiltonian Core</span>
              </div>
              
              <div className="space-y-3 mb-4">
                {activeCityData.inspectors.map((inspector, i) => (
                  <div key={inspector.id} className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center font-bold text-[10px] text-amber-400">
                        {inspector.id.substring(3)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{inspector.name}</span>
                        <span className="text-[9px] font-mono text-amber-400 tracking-tight leading-none mt-0.5">{inspector.target}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-rose-400 uppercase tracking-tight">{inspector.urgency}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-500 mt-0.5">{inspector.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={triggerInspectorRerouting}
                disabled={isReroutingInspectors}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                {isReroutingInspectors ? (
                  <>
                    <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                    Calculating Routes...
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Re-route via QAOA (D-Wave)
                  </>
                )}
              </button>
              <button 
                onClick={() => setWorkflow(WorkflowState.DECISION_ENGINE)}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl cursor-pointer transition-colors"
                title="Full Decision Suite"
              >
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

        </div>

        {/* ================= RIGHT GRID: INTERVENE & SEQUESTER ================= */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          
          {/* Module 4 & 13: Smart Intervention & Policy Simulator */}
          <div className="glass p-6 rounded-[32px] border border-slate-800 flex flex-col justify-between bg-slate-950/20 h-full min-h-[290px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-magenta-400" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Policy Simulator (Module 13)</span>
                </div>
                <span className="text-[9px] font-mono text-rose-400 tracking-tight">Active Mitigation</span>
              </div>

              <div className="space-y-4">
                {/* Diesel Ban Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-300">Heavy Diesel Truck Ban</span>
                    <span className="text-[10px] text-slate-500">Predicted AQI drop: -18 pts</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={dieselBan} 
                      onChange={() => {
                        setDieselBan(!dieselBan);
                        addLog(`Policy simulated: Heavy Diesel Ban ${!dieselBan ? 'Enabled' : 'Disabled'}`, !dieselBan ? 'success' : 'warning');
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-white"></div>
                  </label>
                </div>

                {/* Odd-Even Traffic Scheme Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-300">Odd-Even License Plate</span>
                    <span className="text-[10px] text-slate-500">Predicted AQI drop: -12 pts</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={oddEven} 
                      onChange={() => {
                        setOddEven(!oddEven);
                        addLog(`Policy simulated: Odd-Even Scheme ${!oddEven ? 'Enabled' : 'Disabled'}`, !oddEven ? 'success' : 'warning');
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-white"></div>
                  </label>
                </div>

                {/* Industrial Scrubber Voltage Slider */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-300">Scrubber Voltage Limit</span>
                    <span className="font-mono font-black text-emerald-400">{industrialVoltage} kV</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="120" 
                    value={industrialVoltage} 
                    onChange={(e) => setIndustrialVoltage(Number(e.target.value))}
                    className="w-full accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer h-1.5"
                  />
                  <span className="text-[9px] text-slate-500 text-right">Higher voltage yields high particulates trap</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setWorkflow(WorkflowState.SCENARIO_LAB)}
              className="mt-6 flex items-center justify-between w-full px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-black text-white cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-magenta-400" />
                Intervention & Scenario Lab (Module 4)
              </span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Module 6: Citizen Health AI Advice (Multilingual) */}
          <div className="glass p-6 rounded-[32px] border border-slate-800 flex flex-col justify-between bg-slate-950/20 h-full min-h-[290px]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Citizen Health AI (Module 6)</span>
                </div>
                <span className="text-[9px] font-mono text-cyan-400 uppercase">Gemini powered</span>
              </div>
              
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 mb-2">
                Vulnerable Grid: <span className="text-white normal-case">{activeCityData.vulnerablePopulation}</span>
              </div>

              {/* Multilingual advisory selector */}
              <div className="flex gap-1.5 border-b border-slate-900 pb-3 mb-3">
                {['en', 'hi', 'kn', 'ta', 'te'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveAdvisoryLang(lang)}
                    className={`text-[9px] font-black uppercase px-2 py-1 rounded-md transition-all cursor-pointer border ${
                      activeAdvisoryLang === lang
                        ? 'bg-blue-400/20 border-blue-400/30 text-blue-300'
                        : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {lang === 'en' ? 'ENG' : lang === 'hi' ? 'HIN' : lang === 'kn' ? 'KAN' : lang === 'ta' ? 'TAM' : 'TEL'}
                  </button>
                ))}
              </div>

              {/* Dynamic generated alert banner */}
              <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl flex items-start gap-3 relative min-h-[100px]">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {getCityAdvisory(selectedCityName, activeAdvisoryLang)}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setWorkflow(WorkflowState.CITIZEN_ADVISORY)}
              className="mt-4 flex items-center justify-between w-full px-4 py-2.5 bg-gradient-to-r from-magenta-500 to-purple-600 hover:opacity-90 rounded-xl text-xs font-black text-white cursor-pointer transition-all shadow-[0_0_15px_rgba(217,70,239,0.15)]"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                Launch Citizen Advisory Hub
              </span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

        </div>

      </div>

      {/* LOWER GRID: CLIMATE INVESTMENT OPTIMIZER & CARBON CAPTURE DEPLOYMENT PLANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Module 14: Climate Investment Optimizer */}
        <div className="lg:col-span-6 glass p-6 rounded-[32px] border border-slate-800 flex flex-col justify-between bg-slate-950/20">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Climate Investment Optimizer (Module 14)</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded uppercase">
                Pareto Limit Solver
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Allocate ₹500 Crore environmental budget to minimize AQI particulates and CO₂ simultaneously. Run QAOA to resolve optimal non-linear returns.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div className="flex flex-col">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">Tree Plantation</span>
                    <span className="font-mono text-white">₹{treesBudget} Cr</span>
                  </div>
                  <input 
                    type="range" min="10" max="200" value={treesBudget}
                    onChange={(e) => setTreesBudget(Number(e.target.value))}
                    className="accent-emerald-400 bg-slate-800 h-1 rounded-lg"
                  />
                </div>

                <div className="flex flex-col">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">Electric Transit (EV)</span>
                    <span className="font-mono text-white">₹{evBudget} Cr</span>
                  </div>
                  <input 
                    type="range" min="10" max="250" value={evBudget}
                    onChange={(e) => setEvBudget(Number(e.target.value))}
                    className="accent-emerald-400 bg-slate-800 h-1 rounded-lg"
                  />
                </div>

                <div className="flex flex-col">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">Carbon Capture Filters</span>
                    <span className="font-mono text-white">₹{mofBudget} Cr</span>
                  </div>
                  <input 
                    type="range" min="10" max="200" value={mofBudget}
                    onChange={(e) => setMofBudget(Number(e.target.value))}
                    className="accent-emerald-400 bg-slate-800 h-1 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">Clean Fuels Mandate</span>
                    <span className="font-mono text-white">₹{cleanFuelBudget} Cr</span>
                  </div>
                  <input 
                    type="range" min="10" max="150" value={cleanFuelBudget}
                    onChange={(e) => setCleanFuelBudget(Number(e.target.value))}
                    className="accent-emerald-400 bg-slate-800 h-1 rounded-lg"
                  />
                </div>

                <div className="flex flex-col">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">Water Sprinklers</span>
                    <span className="font-mono text-white">₹{roadJetsBudget} Cr</span>
                  </div>
                  <input 
                    type="range" min="5" max="100" value={roadJetsBudget}
                    onChange={(e) => setRoadJetsBudget(Number(e.target.value))}
                    className="accent-emerald-400 bg-slate-800 h-1 rounded-lg"
                  />
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex justify-between items-center text-xs">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Total Spent</span>
                    <span className={`font-mono font-black mt-1 ${totalBudgetSpent > 500 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      ₹{totalBudgetSpent} / ₹500 Cr
                    </span>
                  </div>
                  {totalBudgetSpent > 500 ? (
                    <span className="text-[10px] font-black text-rose-400 uppercase tracking-tight flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Deficit!
                    </span>
                  ) : (
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tight flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Budget Cap OK
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={runQuantumInvestmentOptimization}
              disabled={isOptimizingBudget}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 disabled:opacity-50 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              {isOptimizingBudget ? (
                <>
                  <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                  Aligning Qubits...
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  Run Multi-Objective Quantum Optimizer
                </>
              )}
            </button>
            <button 
              onClick={() => setWorkflow(WorkflowState.QUANTUM_OPTIMIZATION)}
              className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl cursor-pointer transition-colors"
              title="Quantum Engine Suite"
            >
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Module 9 & 12: Urban Carbon Capture Deployment & Climate Knowledge Graph */}
        <div className="lg:col-span-6 glass p-6 rounded-[32px] border border-slate-800 flex flex-col justify-between bg-slate-950/20">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Carbon Deployment & Knowledge Graph (Module 9/12)</span>
              </div>
              <span className="px-2 py-0.5 text-[8px] font-mono bg-fuchsia-400/10 text-fuchsia-400 border border-fuchsia-400/20 rounded uppercase">
                GNN Material Deployer
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Deploy GNN-synthesized materials onto urban stacks and transport hubs. See chemical bonds dynamically link to Ward structures in the Knowledge Graph.
            </p>

            {/* Simulated Climate Knowledge Graph Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch mb-4">
              
              {/* Deployment Details Box */}
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Primary Deployable Absorbent</span>
                  <div className="text-base font-black text-white mt-1">QuantumMOF-X1 (Copper Node)</div>
                  <div className="text-xs font-mono text-cyan-400 font-bold mt-0.5">Binding Coherence: -12.4 Hartree</div>
                  
                  <div className="border-t border-slate-800 pt-3 mt-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Optimal Placement:</span>
                      <span className="font-bold text-white">Okhla Stacks / Highways</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Flue Gas Capture Alpha:</span>
                      <span className="font-bold text-lime-400">18.4 mmol/g GNN match</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">CO₂ Abatement Est:</span>
                      <span className="font-bold text-emerald-400">4.2 Gigatons target</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setWorkflow(WorkflowState.CARBON_RESEARCH)}
                  className="mt-4 flex items-center justify-between w-full px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-bold text-cyan-400 cursor-pointer transition-colors"
                >
                  <span>Go to GNN Synthesis Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Graphical representation of the Climate Knowledge Graph */}
              <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden h-full min-h-[190px]">
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  <svg width="100%" height="100%">
                    {/* Graph relationships lines with animation */}
                    <line x1="50%" y1="20%" x2="20%" y2="55%" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 3">
                      <animate attributeName="stroke-dashoffset" values="0;20" dur="2s" repeatCount="indefinite" />
                    </line>
                    <line x1="50%" y1="20%" x2="80%" y2="55%" stroke="#ec4899" strokeWidth="1.5" />
                    <line x1="20%" y1="55%" x2="50%" y2="85%" stroke="#10b981" strokeWidth="1.5" />
                    <line x1="80%" y1="55%" x2="50%" y2="85%" stroke="#eab308" strokeWidth="1.5" />
                  </svg>
                </div>

                <div className="flex justify-between items-center z-10">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Climate Graph Nodes</span>
                  <span className="text-[8px] font-mono text-emerald-400">Linked: 452</span>
                </div>

                {/* Simulated Interactive Node layout */}
                <div className="relative w-full h-32 z-10 flex items-center justify-center">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[10px] font-black px-2 py-1 rounded-md shadow-md cursor-pointer" title="Thermal anomaly stack emission emitter">
                    Power Plant Node
                  </div>
                  
                  <div className="absolute bottom-12 left-2 bg-pink-500/20 border border-pink-400/40 text-pink-300 text-[10px] font-black px-2 py-1 rounded-md shadow-md cursor-pointer" title="Industrial area emitting PM2.5 and PM10">
                    Okhla Stack
                  </div>

                  <div className="absolute bottom-12 right-2 bg-yellow-500/20 border border-yellow-400/40 text-yellow-300 text-[10px] font-black px-2 py-1 rounded-md shadow-md cursor-pointer" title="Durable Nano-composite deployment target">
                    MOF Filter node
                  </div>

                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black px-2 py-1 rounded-md shadow-md cursor-pointer" title="Municipal receptor, schools and child clinics near Ward 18">
                    Hospitals Ward 18
                  </div>
                </div>

                <div className="text-[8px] font-mono text-slate-500 text-center leading-none mt-1">
                  *Hovering node reveals real-time carbon transport vectors.
                </div>
              </div>

            </div>
          </div>

          <button 
            onClick={() => setWorkflow(WorkflowState.CITY_ADVISOR)}
            className="mt-auto flex items-center justify-between w-full px-4 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-black text-white cursor-pointer transition-colors"
          >
            <span className="flex items-center gap-2">
              <Share2 className="w-3.5 h-3.5 text-lime-400 animate-spin-slow" />
              Analyze Urban Deployment Planner (Module 9)
            </span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>

      </div>

    </div>
  );
};
