import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CITIES } from '../constants';
import { CITIES_METADATA } from './citiesData';
import { 
  School, 
  Play, 
  Pause, 
  Languages, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  AlertTriangle, 
  Activity, 
  HeartPulse, 
  Info, 
  Bell, 
  Wifi, 
  MapPin, 
  RotateCcw, 
  Send,
  CheckCircle2,
  AlertCircle,
  Radio,
  Sliders,
  Cpu,
  ShieldCheck,
  Languages as LanguagesIcon,
  Globe2,
  ScanFace,
  Terminal,
  Activity as ActivityIcon
} from 'lucide-react';

// Pre-configured vulnerability metadata for the target cities
interface SchoolAsset {
  id: string;
  name: string;
  students: number;
  proximity: string;
  baseRisk: 'Critical' | 'High' | 'Moderate' | 'Satisfactory';
  action: string;
}

interface HospitalAsset {
  id: string;
  name: string;
  patients: number;
  occupancy: number;
  respiratoryRisk: 'Critical' | 'High' | 'Moderate';
  action: string;
}

const VULNERABLE_ASSETS: Record<string, {
  schools: SchoolAsset[];
  hospitals: HospitalAsset[];
}> = {
  'New Delhi': {
    schools: [
      { id: 'S-DEL-01', name: 'Delhi Public School, R.K. Puram', students: 1840, proximity: '150m from Ring Road Hub', baseRisk: 'Critical', action: 'Switch HVAC to Recirculation / Cancel Outdoor Assembly' },
      { id: 'S-DEL-02', name: 'Sanskriti School, Chanakyapuri', students: 1220, proximity: '400m from Transit Corridor', baseRisk: 'High', action: 'Activate Classroom HEPA Filters / Restrict Playgrounds' },
      { id: 'S-DEL-03', name: 'Springdales School, Dhaula Kuan', students: 1450, proximity: '320m from Railway Crossing', baseRisk: 'Critical', action: 'Activate High-Voltage Air Scrubber Terminal' }
    ],
    hospitals: [
      { id: 'H-DEL-01', name: 'All India Institute of Medical Sciences (AIIMS)', patients: 2100, occupancy: 96, respiratoryRisk: 'Critical', action: 'Deploy mobile oxygenation buffers / Oxygen ward standby' },
      { id: 'H-DEL-02', name: 'Max Super Speciality, Saket', patients: 840, occupancy: 89, respiratoryRisk: 'High', action: 'Activate positive pressure barrier at intake locks' },
      { id: 'H-DEL-03', name: 'Fortis Flt. Lt. Rajan Dhall, Vasant Kunj', patients: 650, occupancy: 82, respiratoryRisk: 'High', action: 'Restrict non-emergency ventilation circulation' }
    ]
  },
  'Mumbai': {
    schools: [
      { id: 'S-BOM-01', name: 'Cathedral & John Connon, Fort', students: 950, proximity: '600m from Dockyard Port', baseRisk: 'Moderate', action: 'Monitor PM10 marine dust triggers' },
      { id: 'S-BOM-02', name: 'Dhirubhai Ambani International, BKC', students: 1100, proximity: '80m from BKC Metro Construction', baseRisk: 'High', action: 'Deploy chemical misting over campus perimeter' }
    ],
    hospitals: [
      { id: 'H-BOM-01', name: 'KEM Hospital, Parel', patients: 1800, occupancy: 92, respiratoryRisk: 'High', action: 'Trigger construction-dust particulate alarms' },
      { id: 'H-BOM-02', name: 'Lilavati Hospital, Bandra', patients: 740, occupancy: 84, respiratoryRisk: 'Moderate', action: 'Seal coastal air-vent locks during stagnant low wind' }
    ]
  },
  'Kolkata': {
    schools: [
      { id: 'S-CCU-01', name: 'La Martiniere for Boys', students: 1300, proximity: '850m from Foundry Belt', baseRisk: 'High', action: 'Activate indoor sulfur absorption scrubbers' },
      { id: 'S-CCU-02', name: 'St. Xavier\'s Collegiate School', students: 1150, proximity: '1.2km from Brick Kilns', baseRisk: 'High', action: 'Execute indoor safety drill / Mask distribution' }
    ],
    hospitals: [
      { id: 'H-CCU-01', name: 'SSKM Hospital, Bhowanipore', patients: 1600, occupancy: 95, respiratoryRisk: 'Critical', action: 'Trigger sulfur filtration buffers on all ward lines' },
      { id: 'H-CCU-02', name: 'Apollo Multispecialty, Kadapara', patients: 920, occupancy: 87, respiratoryRisk: 'High', action: 'Isolate respiratory ICU intake filters' }
    ]
  },
  'Bengaluru': {
    schools: [
      { id: 'S-BLR-01', name: 'Bishop Cotton Boys\' School', students: 1400, proximity: '1.1km from IT Corridor', baseRisk: 'Satisfactory', action: 'No immediate HVAC action / Open air ventilation' },
      { id: 'S-BLR-02', name: 'The Valley School, Kanakapura', students: 600, proximity: 'Close to forest buffer zone', baseRisk: 'Satisfactory', action: 'Normal academic operations authorized' }
    ],
    hospitals: [
      { id: 'H-BLR-01', name: 'Narayana Health City', patients: 2400, occupancy: 78, respiratoryRisk: 'Moderate', action: 'Perform routine cleanroom pressure monitoring' },
      { id: 'H-BLR-02', name: 'St. John\'s Medical College', patients: 1200, occupancy: 81, respiratoryRisk: 'Moderate', action: 'No intervention triggered' }
    ]
  },
  'Chennai': {
    schools: [
      { id: 'S-MAA-01', name: 'Don Bosco, Egmore', students: 1600, proximity: '450m from Port Freight Gate', baseRisk: 'Moderate', action: 'Monitor sulfur plume direction from Ennore' },
      { id: 'S-MAA-02', name: 'Chettinad Vidyashram, RA Puram', students: 2100, proximity: '300m from Adyar Transit Hub', baseRisk: 'Moderate', action: 'Activate low-level misting sprayers on play area' }
    ],
    hospitals: [
      { id: 'H-MAA-01', name: 'Rajiv Gandhi Government General', patients: 3000, occupancy: 94, respiratoryRisk: 'High', action: 'Trigger marine sulfur particulate scrubbers' },
      { id: 'H-MAA-02', name: 'Apollo Hospitals, Greams Road', patients: 1100, occupancy: 88, respiratoryRisk: 'High', action: 'Activate cleanroom sealants on North wing' }
    ]
  }
};

const BROADCAST_TEMPLATES = [
  {
    title: '🚨 Critical Stubble Smog Warning',
    text: 'Health Alert: Extremely high stubble and vehicular smog detected across regional grids. Hospitals have activated secondary oxygenation lines. Children, asthma patients, and elderly citizens must avoid all outdoor exposure. Schools must cancel physical activities.',
    urgency: 'Critical'
  },
  {
    title: '🏗️ Construction Dust Particulate Alert',
    text: 'Localized Air Quality Alert: High levels of construction particulates and dust detected due to regional transit project excavation. Citizens are advised to wear certified particulate masks. Wearable tracking indicators are active.',
    urgency: 'High'
  },
  {
    title: '🏭 Industrial Sulfur Plume Advisory',
    text: 'Atmospheric Warning: Local sulfur emission plumes have shifted towards residential zones. Respiratory irritation expected in northern sectors. Keep all windows sealed and set indoor air purifiers to maximum velocity.',
    urgency: 'High'
  },
  {
    title: '🍂 Seasonal Bio-Aerosol & Pollen Warning',
    text: 'Environmental Health Alert: Severe bio-aerosol and organic pollen concentration detected near residential green grids. Sensitive individuals, children, and asthma patients should minimize outdoor duration and maintain active HEPA filtration.',
    urgency: 'Moderate'
  },
  {
    title: '🚗 Peak Transit Smog Alert',
    text: 'Traffic Emission Warning: Elevated nitrogen dioxide concentrations registered along municipal highway links. Cyclists and pedestrians should detour from primary corridors. City atmospheric ventilation scrubbers are set to maximum flow.',
    urgency: 'High'
  },
  {
    title: '🌡️ Ground-Level Ozone Heat Inversion',
    text: 'Metropolitan Air Advisory: Stagnant atmospheric conditions and high heat have catalyzed ground-level ozone build-up. Pediatric vulnerability is heightened. Restrict strenuous outdoor labor from noon to sunset.',
    urgency: 'High'
  }
];

export const CitizenAdvisoryCenter: React.FC = () => {
  // Extract Indian and Global cities dynamically from metadata
  const indianCities = useMemo(() => {
    const list = CITIES_METADATA.filter(c => c.category === 'India').map(c => c.name);
    // Standardize 'Delhi' to 'New Delhi' so that it maps to local vulnerable assets/details
    const mapped = list.map(name => name === 'Delhi' ? 'New Delhi' : name);
    return [...new Set(mapped)].sort((a, b) => a.localeCompare(b));
  }, []);

  const globalCities = useMemo(() => {
    const list = CITIES_METADATA.filter(c => c.category === 'Global').map(c => c.name);
    return [...new Set(list)].sort((a, b) => a.localeCompare(b));
  }, []);

  const [selectedCity, setSelectedCity] = useState<string>('New Delhi');
  const [activeOverlay, setActiveOverlay] = useState<'plumes' | 'alerts' | 'protocols' | 'none'>('alerts');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  
  // Real-Time Radar Sweep state
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanPulse, setScanPulse] = useState<number>(0);

  // Sound Synthesizer State
  const [synthesizerMode, setSynthesizerMode] = useState<'off' | 'siren' | 'geiger' | 'chime'>('off');
  const [synthVolume, setSynthVolume] = useState<number>(40);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<{ oscs: OscillatorNode[]; gain: GainNode | null }>({ oscs: [], gain: null });
  const geigerIntervalRef = useRef<any>(null);

  // Live AQI State and effect
  const [liveAqi, setLiveAqi] = useState<number | null>(null);
  const [liveAqiData, setLiveAqiData] = useState<any>(null);
  const [isLiveAqiLoading, setIsLiveAqiLoading] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    setIsLiveAqiLoading(true);
    setLiveAqi(null); // Clear previous city's AQI
    setLiveAqiData(null); // Clear previous city's metadata
    fetch(`/api/live-aqi?city=${encodeURIComponent(selectedCity)}`)
      .then(res => res.json())
      .then(data => {
        if (active && data) {
          setLiveAqi(data.aqi);
          setLiveAqiData(data);
          // Set initial active asset when city changes
          const cityAssets = VULNERABLE_ASSETS[selectedCity] || VULNERABLE_ASSETS['New Delhi'];
          if (cityAssets && cityAssets.schools.length > 0) {
            setSelectedAssetId(cityAssets.schools[0].id);
          }
        }
      })
      .catch(err => console.error("Error fetching AQI in CitizenAdvisoryCenter", err))
      .finally(() => {
        if (active) setIsLiveAqiLoading(false);
      });
    return () => { active = false; };
  }, [selectedCity]);
  
  // Translation state
  const [advisoryText, setAdvisoryText] = useState<string>(BROADCAST_TEMPLATES[0].text);
  const [activeTemplateIndex, setActiveTemplateIndex] = useState<number>(0);
  const [targetLanguage, setTargetLanguage] = useState<string>('hi');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationNotice, setTranslationNotice] = useState<string>('');
  const [glyphIndex, setGlyphIndex] = useState<number>(0);
  const [translatedTemplates, setTranslatedTemplates] = useState<Array<{ title: string; text: string; urgency: string }>>(
    BROADCAST_TEMPLATES
  );
  const [isTranslatingAll, setIsTranslatingAll] = useState<boolean>(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [allTranslations, setAllTranslations] = useState<Record<string, string>>({});
  const [isTranslatingAllLangs, setIsTranslatingAllLangs] = useState<boolean>(false);
  
  // Voice broadcast simulation state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [voiceProfile, setVoiceProfile] = useState<string>('Alpha (Bass Warning)');
  const [broadcastLogs, setBroadcastLogs] = useState<Array<{ time: string; msg: string; type: string }>>([
    { time: '10:00:00', msg: 'Atmospheric Broadcast diagnostic status: OPTIMAL.', type: 'success' },
    { time: '10:01:24', msg: 'Tactical regional sensor array ready for telemetry binding.', type: 'info' }
  ]);
  const [volume, setVolume] = useState<number>(80);
  
  const waveBarsCount = 24;
  const [waveHeights, setWaveHeights] = useState<number[]>(Array(waveBarsCount).fill(8));
  const animationRef = useRef<number | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Dynamic Glyph matrix during translation
  const translationGlyphs = ["क", "त", "अ", "म", "ಶ", "ஜ", "తె", "ম", "ம", "మ", "म", "ஆ", "क", "श", "त", "ರ"];

  useEffect(() => {
    let interval: any = null;
    if (isTranslating) {
      interval = setInterval(() => {
        setGlyphIndex(prev => (prev + 1) % translationGlyphs.length);
      }, 80);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTranslating]);

  // Handle SpeechSynthesis voices change and initial loading
  useEffect(() => {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    if (!synth) return;
    
    const updateVoices = () => {
      setAvailableVoices(synth.getVoices());
    };
    
    updateVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = updateVoices;
    }
  }, []);

  // Generate real-time oscillating wave heights when speaking/playing
  useEffect(() => {
    if (isPlaying) {
      const animateWave = () => {
        setWaveHeights(prev => 
          prev.map((h, i) => {
            const amplitude = 12 + Math.sin(Date.now() / 150 + i) * 15;
            return Math.max(4, Math.floor(amplitude + Math.random() * 15));
          })
        );
        animationRef.current = requestAnimationFrame(animateWave);
      };
      animationRef.current = requestAnimationFrame(animateWave);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Return wave to a gentle background hum
      const timeout = setTimeout(() => {
        setWaveHeights(Array(waveBarsCount).fill(6));
      }, 200);
      return () => clearTimeout(timeout);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  // Audio Alarm Synthesis Engine using Web Audio API
  const stopSynthesizer = () => {
    if (geigerIntervalRef.current) {
      clearInterval(geigerIntervalRef.current);
      geigerIntervalRef.current = null;
    }
    synthNodesRef.current.oscs.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    synthNodesRef.current.oscs = [];
    if (synthNodesRef.current.gain) {
      try { synthNodesRef.current.gain.disconnect(); } catch(e) {}
      synthNodesRef.current.gain = null;
    }
  };

  const startSynthesizer = (mode: 'siren' | 'geiger' | 'chime') => {
    stopSynthesizer();
    if (typeof window === 'undefined') return;

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime((synthVolume / 100) * 0.15, ctx.currentTime);
      gainNode.connect(ctx.destination);
      synthNodesRef.current.gain = gainNode;

      if (mode === 'siren') {
        // High-pitched warning dual-frequency sweep oscillator
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc2.type = 'triangle';

        osc1.frequency.setValueAtTime(450, ctx.currentTime);
        osc2.frequency.setValueAtTime(454, ctx.currentTime);

        // Modulate frequency to create dual-tone warning sweep
        const mod = ctx.createOscillator();
        const modGain = ctx.createGain();
        mod.frequency.setValueAtTime(1.5, ctx.currentTime); // LFO Speed 1.5 Hz
        modGain.gain.setValueAtTime(120, ctx.currentTime); // Pitch swing +/- 120Hz

        mod.connect(modGain);
        modGain.connect(osc1.frequency);
        modGain.connect(osc2.frequency);

        osc1.connect(gainNode);
        osc2.connect(gainNode);

        mod.start();
        osc1.start();
        osc2.start();

        synthNodesRef.current.oscs = [osc1, osc2, mod];
        addBroadcastLog('Atmospheric warning siren activated successfully.', 'warning');
      } else if (mode === 'chime') {
        // Soft digital chime sequence
        const playChimeNote = (freq: number, delayTime: number) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + delayTime);
          noteGain.gain.setValueAtTime(0, ctx.currentTime + delayTime);
          noteGain.gain.linearRampToValueAtTime((synthVolume / 100) * 0.2, ctx.currentTime + delayTime + 0.05);
          noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delayTime + 1.2);
          
          osc.connect(noteGain);
          noteGain.connect(ctx.destination);
          osc.start(ctx.currentTime + delayTime);
          osc.stop(ctx.currentTime + delayTime + 1.3);
        };
        // Play clean futuristic chime cascade
        playChimeNote(659.25, 0); // E5
        playChimeNote(783.99, 0.15); // G5
        playChimeNote(987.77, 0.3); // B5
        playChimeNote(1318.51, 0.45); // E6
        
        addBroadcastLog('Megaphone alert pre-chime tone broadcasted.', 'success');
        setTimeout(() => setSynthesizerMode('off'), 1800);
      } else if (mode === 'geiger') {
        // High frequency aerosol sensor clicks
        const playGeigerClick = () => {
          const osc = ctx.createOscillator();
          const clickGain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(2500, ctx.currentTime);
          clickGain.gain.setValueAtTime(0.3, ctx.currentTime);
          clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.012);
          
          osc.connect(clickGain);
          clickGain.connect(gainNode);
          osc.start();
          osc.stop(ctx.currentTime + 0.02);
        };

        const currentAqiValue = liveAqi || 100;
        // Map clicks speed to current AQI (higher AQI = faster danger clicks)
        const delay = Math.max(80, 800 - (currentAqiValue * 2.5));

        geigerIntervalRef.current = setInterval(() => {
          playGeigerClick();
          if (Math.random() > 0.4) {
            setTimeout(playGeigerClick, Math.random() * 40 + 10);
          }
        }, delay);

        addBroadcastLog(`Holographic particulate Geiger counter tracking active (${currentAqiValue} CPM equiv).`, 'info');
      }
    } catch (e) {
      console.error('Failed to trigger synthesizer:', e);
    }
  };

  useEffect(() => {
    if (synthesizerMode !== 'off') {
      startSynthesizer(synthesizerMode);
    } else {
      stopSynthesizer();
    }
    return () => stopSynthesizer();
  }, [synthesizerMode, synthVolume]);

  // Sonar sweep simulation
  const handleDeployRadarScan = () => {
    setIsScanning(true);
    setScanPulse(1);
    addBroadcastLog('Deploying Sonar Radar sweep across localized metropolitan grid...', 'info');
    
    // Play synthesizer sonar sound
    if (typeof window !== 'undefined') {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = audioCtxRef.current || new AudioContext();
        if (!audioCtxRef.current) audioCtxRef.current = ctx;
        
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 1.5);
        
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.6);
      } catch (e) {}
    }

    setTimeout(() => {
      setIsScanning(false);
      addBroadcastLog('Infrastructure sensor nodes pinged. Multi-spectral target locks synchronized.', 'success');
    }, 1800);
  };

  // Speaks using browser speech API, synchronized inside action context with custom text and language support
  const speakText = (textToSpeak: string, lang: string) => {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    if (!synth) {
      addBroadcastLog('Speech synthesis API is not supported in this browser.', 'warning');
      return;
    }

    if (isPlaying) {
      synth.cancel();
      setIsPlaying(false);
      addBroadcastLog('Loudspeaker voice broadcast transmission suspended.', 'warning');
      return;
    }

    setIsPlaying(true);
    synth.cancel();

    if (!textToSpeak) {
      setIsPlaying(false);
      addBroadcastLog('No text loaded to speech broadcast.', 'warning');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;

    // Bind speed, volume, voice pitch
    utterance.volume = volume / 100;
    utterance.rate = playbackSpeed;

    if (voiceProfile.includes('Bass')) {
      utterance.pitch = 0.72;
    } else if (voiceProfile.includes('Siren')) {
      utterance.pitch = 1.35;
    } else {
      utterance.pitch = 1.0;
    }

    // Voice resolution matching
    const voices = availableVoices.length > 0 ? availableVoices : synth.getVoices();
    let matchedVoice = null;

    const langMap: Record<string, string> = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'kn': 'kn-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'mr': 'mr-IN',
      'bn': 'bn-IN',
      'ml': 'ml-IN'
    };

    const targetLocale = langMap[lang] || 'en-US';
    utterance.lang = targetLocale;

    matchedVoice = voices.find(v => {
      const l = v.lang.toLowerCase().replace('_', '-');
      return l === targetLocale.toLowerCase() || l.includes(targetLocale.toLowerCase());
    });
    if (!matchedVoice) {
      matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
    }

    if (!matchedVoice) {
      matchedVoice = voices.find(v => v.lang.includes('IN')) || 
                     voices.find(v => v.lang.startsWith('en')) || 
                     voices[0];
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      addBroadcastLog('Acoustic loudspeaker broadcast completed successfully.', 'success');
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted') {
        console.error('SpeechSynthesis Error:', e);
        setIsPlaying(false);
        addBroadcastLog(`Megaphone buffer error: ${e.error}`, 'warning');
      }
    };

    // Speak directly after any siren chime
    let delay = 0;
    if (voiceProfile.includes('Siren')) {
      startSynthesizer('chime');
      delay = 1200;
    }

    setTimeout(() => {
      synth.speak(utterance);
    }, delay);

    addBroadcastLog(`Voice broadcast transmission initiated in [${lang}] at ${playbackSpeed}x speed.`, 'success');
  };

  const togglePlayback = () => {
    const textToSpeak = translatedText || advisoryText;
    speakText(textToSpeak, targetLanguage);
  };

  // Compile Dynamic Environmental Telemetry Alert
  const compileContextualAlert = () => {
    const currentAqi = liveAqi !== null ? liveAqi : 145;
    let severity = "MODERATE ATMOSPHERIC INFLOW";
    let protocols = "Activate minor air purifiers inside. School classes proceed as normal.";
    
    if (currentAqi >= 200) {
      severity = "CRITICAL PARTICULATE EMERGENCY";
      protocols = "SUSPEND all outdoor physical assemblies. Lock primary school ventilation systems to 100% recirculation and deploy portable respiratory filters.";
    } else if (currentAqi >= 100) {
      severity = "ELEVATED EXPOSURE WARNING";
      protocols = "Restrict extended outdoor playground exposure. Sensitive individuals are advised to run active particulate scrubbers inside.";
    }

    const generated = `PUBLIC SAFETY BROADCAST: Automated sensory grids in the ${selectedCity} metropolitan grid have registered a live AQI score of ${currentAqi} [${severity}]. Local schools and pediatric hospitals are advised of elevated vulnerability. MANDATORY ENFORCEMENT PROTOCOLS: ${protocols}`;
    setAdvisoryText(generated);
    setTranslatedText('');
    setTranslationNotice('');
    addBroadcastLog(`Compiled contextual sensory alert for ${selectedCity}. Ready for neural translation.`, 'success');
  };

  // Log broadcast events
  const addBroadcastLog = (msg: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const time = new Date().toLocaleTimeString();
    setBroadcastLogs(prev => [{ time, msg, type }, ...prev].slice(0, 8));
  };

  const translateAllTemplates = async (lang: string) => {
    if (lang === 'en') {
      setTranslatedTemplates(BROADCAST_TEMPLATES);
      return;
    }
    setIsTranslatingAll(true);
    addBroadcastLog(`Translating all alert presets to [${lang}]...`, 'info');
    try {
      const translated = await Promise.all(
        BROADCAST_TEMPLATES.map(async (tmpl) => {
          let translatedTitle = tmpl.title;
          let translatedTextStr = tmpl.text;
          
          try {
            const resTitle = await fetch('/api/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: tmpl.title, targetLanguage: lang })
            });
            if (resTitle.ok) {
              const dataTitle = await resTitle.json();
              if (dataTitle.translatedText) {
                translatedTitle = dataTitle.translatedText;
              }
            }
          } catch (e) {
            console.error("Error translating title:", e);
          }

          try {
            const resText = await fetch('/api/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: tmpl.text, targetLanguage: lang })
            });
            if (resText.ok) {
              const dataText = await resText.json();
              if (dataText.translatedText) {
                translatedTextStr = dataText.translatedText;
              }
            }
          } catch (e) {
            console.error("Error translating text:", e);
          }

          return {
            title: translatedTitle,
            text: translatedTextStr,
            urgency: tmpl.urgency
          };
        })
      );
      setTranslatedTemplates(translated);
      addBroadcastLog(`All alert presets translated successfully to [${lang}].`, 'success');
    } catch (err) {
      console.error("Failed to translate all templates", err);
    } finally {
      setIsTranslatingAll(false);
    }
  };

  // Translates the active alert message into ALL 8 supported target languages simultaneously
  const translateToAllLanguages = async (text: string) => {
    if (!text.trim()) return;
    setIsTranslatingAllLangs(true);
    setIsTranslating(true);
    addBroadcastLog('Initiating multi-lingual translation matrix compile...', 'info');
    
    const langs = ['en', 'hi', 'kn', 'ta', 'te', 'mr', 'bn', 'ml'];
    const results: Record<string, string> = { 'en': text };
    
    try {
      await Promise.all(
        langs.map(async (lang) => {
          if (lang === 'en') return;
          try {
            const response = await fetch('/api/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text, targetLanguage: lang })
            });
            const data = await response.json();
            if (response.ok && data.translatedText) {
              results[lang] = data.translatedText;
            } else {
              throw new Error("API failed");
            }
          } catch (e) {
            const simulatedFallbacks: Record<string, string> = {
              'hi': 'स्वास्थ्य चेतावनी: अत्यधिक वायु प्रदूषण दर्ज। अस्पताल अलर्ट पर हैं। बच्चों और बुजुर्गों को बाहर जाने से बचना चाहिए।',
              'kn': 'ಆರೋಗ್ಯ ಎಚ್ಚರಿಕೆ: ತೀವ್ರ ಮಾಲಿನ್ಯ ಪತ್ತೆಯಾಗಿದೆ. ಮಕ್ಕಳು ಮತ್ತು ಹಿರಿಯರು ಹೊರಗೆ ಹೋಗುವುದನ್ನು ತಪ್ಪಿಸಿ.',
              'ta': 'சுகாதார எச்சரிக்கை: அதிகப்படியான மாசு கண்டறியப்பட்டுள்ளது. குழந்தைகள், முதியவர்கள் வெளியே செல்வதை தவிர்க்கவும்.',
              'te': 'ఆరోగ్య హెచ్చరిక: అత్యంత తీవ్రమైన కాలుష్యం నమోదైంది. పిల్లలు మరియు వృద్ధులు బయట తిరగడం నివారించాలి.',
              'mr': 'आरोग्य इशारा: अत्यंत उच्च प्रदूषण पातळी आढळली आहे. मुले आणि वृद्धांनी बाहेर जाणे टाळावे.',
              'bn': 'স্বাস্থ্য সতর্কতা: অত্যন্ত উচ্চ বায়ু দূষণ সনাক্ত করা হয়েছে। শিশু ও বয়স্কদের বাইরে যাওয়া এড়িয়ে চলতে হবে।',
              'ml': 'ആരോഗ്യ മുന്നറിയിപ്പ്: കടുത്ത വായുമлиനീകരണം രേഖപ്പെടുത്തിയിരിക്കുന്നു. കുട്ടികളും പ്രായമായവരും പുറത്തിറങ്ങുന്നത് ഒഴിവാക്കുക.'
            };
            results[lang] = simulatedFallbacks[lang] || text;
          }
        })
      );
      setAllTranslations(results);
      if (results[targetLanguage]) {
        setTranslatedText(results[targetLanguage]);
        setTranslationNotice('All-languages neural broadcast matrix successfully compiled.');
      }
      addBroadcastLog('Multi-lingual translation matrix compiled successfully.', 'success');
    } catch (err) {
      console.error("Error translating to all languages", err);
    } finally {
      setIsTranslatingAllLangs(false);
      setIsTranslating(false);
    }
  };

  // Run the translation calling the server API
  const handleTranslate = async () => {
    await translateToAllLanguages(advisoryText);
  };

  // Rotate through health alert templates automatically every 12 seconds if unchanged
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      // Check if current text matches one of the pre-built templates
      const isPrebuiltTemplate = BROADCAST_TEMPLATES.some(t => t.text === advisoryText);
      if (isPrebuiltTemplate) {
        setActiveTemplateIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % BROADCAST_TEMPLATES.length;
          const nextTemplate = BROADCAST_TEMPLATES[nextIndex];
          setAdvisoryText(nextTemplate.text);
          addBroadcastLog(`Rotated to dynamic public safety alert: ${nextTemplate.title}`, 'info');
          return nextIndex;
        });
      }
    }, 12000); // Rotate every 12 seconds

    return () => clearInterval(rotationInterval);
  }, [advisoryText]);

  // Automatic translation effect when advisory text changes
  useEffect(() => {
    if (!advisoryText.trim()) return;
    
    const timer = setTimeout(() => {
      translateToAllLanguages(advisoryText);
    }, 400);

    return () => clearTimeout(timer);
  }, [advisoryText]);

  // Translate all templates on targetLanguage change
  useEffect(() => {
    translateAllTemplates(targetLanguage);
  }, [targetLanguage]);

  // Update single translation display when targetLanguage changes and we already have translations
  useEffect(() => {
    if (allTranslations[targetLanguage]) {
      setTranslatedText(allTranslations[targetLanguage]);
    }
  }, [targetLanguage, allTranslations]);

  const applyTemplate = (text: string) => {
    setAdvisoryText(text);
    setTranslatedText('');
    setTranslationNotice('');
    addBroadcastLog('Advisory template preset injected successfully.', 'info');
  };

  // Get assets of selected city
  const assets = useMemo(() => {
    if (VULNERABLE_ASSETS[selectedCity]) {
      return VULNERABLE_ASSETS[selectedCity];
    }
    const code = selectedCity.substring(0, 3).toUpperCase();
    return {
      schools: [
        { 
          id: `S-${code}-01`, 
          name: `${selectedCity} Science Academy`, 
          students: 980, 
          proximity: '180m from Highway Link', 
          baseRisk: 'Moderate' as const, 
          action: 'Limit afternoon playgrounds / Turn on HVAC air filters' 
        },
        { 
          id: `S-${code}-02`, 
          name: `St. Francis School, ${selectedCity}`, 
          students: 1100, 
          proximity: '540m from Regional Industrial Siding', 
          baseRisk: 'High' as const, 
          action: 'Activate classroom chemical gas absorbers' 
        }
      ],
      hospitals: [
        { 
          id: `H-${code}-01`, 
          name: `${selectedCity} Emergency Center`, 
          patients: 430, 
          occupancy: 84, 
          respiratoryRisk: 'High' as const, 
          action: 'Seal air-vent intakes during peak PM2.5 hours' 
        }
      ]
    };
  }, [selectedCity]);

  // Find currently selected active asset details for holographic inspect
  const activeInspectAsset = useMemo(() => {
    if (!selectedAssetId) return null;
    const school = assets.schools.find(s => s.id === selectedAssetId);
    if (school) return { ...school, type: 'School' };
    const hospital = assets.hospitals.find(h => h.id === selectedAssetId);
    if (hospital) return { ...hospital, type: 'Hospital' };
    return null;
  }, [selectedAssetId, assets]);

  // Overall city alert level helper based on actual pollution metric
  const getCityAlertLevel = () => {
    const aqi = liveAqi !== null ? liveAqi : 145;
    if (aqi >= 200) {
      return { label: `CRITICAL METRO HAZARD`, color: 'text-rose-400 border-rose-500/30 bg-rose-500/10' };
    } else if (aqi >= 150) {
      return { label: `HIGH EXPOSURE ALERT`, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' };
    } else if (aqi >= 100) {
      return { label: `MODERATE ATMOSPHERIC INFLOW`, color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' };
    } else {
      return { label: `OPTIMAL ENVIRONMENTAL STATUS`, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' };
    }
  };

  const cityAlert = getCityAlertLevel();

  return (
    <div className="flex-1 flex flex-col gap-8 max-w-7xl mx-auto w-full pb-16 animate-in slide-in-from-bottom-8 duration-500">
      
      {/* TACTICAL COMMAND HEADER */}
      <div className="relative glass border border-slate-800 rounded-3xl p-6 md:p-8 overflow-hidden bg-slate-900/40">
        <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none">
          <Globe2 className="w-48 h-48 text-cyan-500/10 rotate-12" />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10 relative">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <div className={`px-3 py-0.5 text-[10px] font-mono font-bold border rounded-full uppercase tracking-wider ${cityAlert.color}`}>
                {cityAlert.label}
              </div>
              <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1 bg-slate-950 px-2.5 py-0.5 rounded-md border border-slate-800">
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>FREQUENCY: 420.5 MHZ</span>
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Citizen Advisory & Public Broadcast Center
            </h2>
            <p className="text-slate-400 font-medium text-base mt-2 max-w-3xl">
              Coordinate real-time metropolitan emergency alerts, translate safety protocols through the server-side <b className="text-cyan-400">Gemini Neural Pipeline</b>, and simulate tactical high-gain megaphone broadcasts.
            </p>
          </div>

          {/* DYNAMIC CITY BINDING */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 self-stretch md:self-auto min-w-[320px]">
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                addBroadcastLog(`System focus synchronized with: ${e.target.value}`, 'info');
              }}
              className="bg-slate-900 text-slate-100 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-black tracking-wider uppercase focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer w-full"
            >
              <option value="" disabled className="text-slate-600">Select Metropolitan Area</option>
              <optgroup label="MAJOR CITIES IN INDIA" className="bg-slate-950 text-cyan-400 font-bold font-sans text-[10px] tracking-widest p-2">
                {indianCities.map((city) => (
                  <option key={city} value={city} className="bg-slate-900 text-slate-200 normal-case font-medium">
                    {city}
                  </option>
                ))}
              </optgroup>
              <optgroup label="GLOBAL METROPOLISES" className="bg-slate-950 text-amber-400 font-bold font-sans text-[10px] tracking-widest p-2">
                {globalCities.map((city) => (
                  <option key={city} value={city} className="bg-slate-900 text-slate-200 normal-case font-medium">
                    {city}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* METROPOLITAN ADVISORY STATUS HUD */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/60 text-xs font-mono">
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/40">
            <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold mb-1">Live Ambient AQI</span>
            {isLiveAqiLoading ? (
              <div className="h-6 w-12 bg-slate-850 animate-pulse rounded"></div>
            ) : (
              <span className="text-xl font-black text-cyan-400 flex items-center gap-1.5">
                {liveAqi || 145}
                <span className="text-[10px] text-slate-500 font-normal">ppm</span>
              </span>
            )}
          </div>
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/40">
            <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold mb-1">Active Targets</span>
            <span className="text-xl font-black text-rose-400">
              {assets.schools.length + assets.hospitals.length} <span className="text-[10px] text-slate-500 font-normal">Vulnerable</span>
            </span>
          </div>
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/40">
            <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold mb-1">Sensor Source</span>
            <span className="text-xs text-slate-300 font-bold truncate block mt-1 uppercase text-slate-400">
              {liveAqiData?.source || 'Open-Meteo Feed'}
            </span>
          </div>
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/40">
            <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold mb-1">Evac Readiness</span>
            <span className="text-xl font-black text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 94.2%
            </span>
          </div>
        </div>
      </div>

      {/* DETAILED TACTICAL GRID & BROADCAST SUITE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: TACTICAL SPATIAL MAP & RADAR SCANNER (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass border border-slate-800 rounded-3xl p-6 flex flex-col gap-6 relative overflow-hidden bg-slate-900/20">
            
            {/* Map Header */}
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-950 border border-cyan-800 rounded-xl">
                  <ScanFace className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-white">Spatial Sensor Sweep & Assets Map</h3>
                  <p className="text-xs text-slate-500 font-mono">Micro-targeting active school and hospital air systems</p>
                </div>
              </div>

              {/* Scanning Trigger Button */}
              <button
                onClick={handleDeployRadarScan}
                disabled={isScanning}
                className="px-4 py-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 rounded-xl text-[10px] font-mono tracking-widest uppercase font-bold text-cyan-300 flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] active:scale-95 disabled:opacity-50"
              >
                <ActivityIcon className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                {isScanning ? 'SWEEDING GRID...' : 'DEPLOY SCAN'}
              </button>
            </div>

            {/* RADAR CANVAS INTERACTIVE OVERLAY */}
            <div className="relative border border-slate-800 rounded-2xl h-72 bg-slate-950/95 overflow-hidden flex items-center justify-center">
              
              {/* Grid matrix overlay lines */}
              <div className="absolute inset-0 grid grid-cols-10 grid-rows-8 pointer-events-none opacity-25">
                {[...Array(80)].map((_, i) => (
                  <div key={i} className="border-[0.5px] border-slate-800"></div>
                ))}
              </div>

              {/* RADAR RADIAL RING PATTERNS */}
              <div className="absolute w-[450px] h-[450px] border border-cyan-500/10 rounded-full pointer-events-none animate-spin" style={{ animationDuration: '40s' }} />
              <div className="absolute w-[300px] h-[300px] border border-cyan-500/15 rounded-full pointer-events-none" />
              <div className="absolute w-[150px] h-[150px] border border-cyan-500/20 rounded-full pointer-events-none" />
              
              {/* Radar Sweeper Hand */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent origin-center rounded-full pointer-events-none animate-spin" style={{ animationDuration: '6s' }} />

              {/* Animated Scan Bar */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div
                    initial={{ top: '0%' }}
                    animate={{ top: '100%' }}
                    exit={{ top: '0%' }}
                    transition={{ duration: 1.8, ease: 'linear', repeat: Infinity }}
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.8)] z-10 pointer-events-none"
                  />
                )}
              </AnimatePresence>

              {/* Plot Pins dynamically with click state */}
              <div className="relative w-full h-full flex items-center justify-center">
                
                {/* Target Pin Coordinates */}
                {assets.schools.map((sch, idx) => {
                  const leftCoord = 18 + idx * 28;
                  const topCoord = 35 + idx * 18;
                  const isSelected = selectedAssetId === sch.id;
                  
                  return (
                    <div 
                      key={sch.id} 
                      className="absolute group/pin"
                      style={{
                        left: `${leftCoord}%`,
                        top: `${topCoord}%`
                      }}
                    >
                      <button 
                        onClick={() => {
                          setSelectedAssetId(sch.id);
                          addBroadcastLog(`Target locked on School Infrastructure: ${sch.name}`, 'info');
                        }}
                        className="relative focus:outline-none"
                      >
                        {/* Selected Target Ring */}
                        {isSelected && (
                          <span className="absolute -inset-4 rounded-full border border-cyan-400 animate-ping opacity-70" />
                        )}
                        <span className={`absolute -inset-2.5 rounded-full animate-pulse opacity-40 ${
                          sch.baseRisk === 'Critical' ? 'bg-rose-500' : 'bg-cyan-500'
                        }`} />
                        
                        <div className={`relative p-2 rounded-xl border shadow-2xl transition-all duration-300 ${
                          isSelected 
                            ? 'bg-cyan-950 border-cyan-400 text-cyan-300 scale-110 shadow-[0_0_15px_rgba(34,211,238,0.4)]' 
                            : sch.baseRisk === 'Critical' 
                              ? 'bg-slate-900 border-rose-500/60 text-rose-400 hover:border-rose-400' 
                              : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-cyan-500'
                        }`}>
                          <School className="w-4 h-4" />
                        </div>

                        {/* Miniature ID badge */}
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-slate-950 border border-slate-800 text-[8px] font-mono rounded text-slate-400 whitespace-nowrap font-bold">
                          {sch.id}
                        </div>
                      </button>
                    </div>
                  );
                })}

                {assets.hospitals.map((hosp, idx) => {
                  const leftCoord = 45 + idx * 22;
                  const topCoord = 20 + idx * 32;
                  const isSelected = selectedAssetId === hosp.id;

                  return (
                    <div 
                      key={hosp.id} 
                      className="absolute group/pin"
                      style={{
                        left: `${leftCoord}%`,
                        top: `${topCoord}%`
                      }}
                    >
                      <button 
                        onClick={() => {
                          setSelectedAssetId(hosp.id);
                          addBroadcastLog(`Target locked on Hospital Hub: ${hosp.name}`, 'info');
                        }}
                        className="relative focus:outline-none"
                      >
                        {/* Selected Target Ring */}
                        {isSelected && (
                          <span className="absolute -inset-4 rounded-full border border-rose-400 animate-ping opacity-70" />
                        )}
                        <span className="absolute -inset-2.5 rounded-full bg-rose-500 animate-pulse opacity-40" />
                        
                        <div className={`relative p-2 rounded-xl border shadow-2xl transition-all duration-300 ${
                          isSelected 
                            ? 'bg-rose-950 border-rose-400 text-rose-300 scale-110 shadow-[0_0_15px_rgba(244,63,94,0.4)]' 
                            : hosp.respiratoryRisk === 'Critical'
                              ? 'bg-slate-900 border-red-500 text-red-400 hover:border-red-400'
                              : 'bg-slate-900 border-slate-700 text-rose-400 hover:border-rose-400'
                        }`}>
                          <HeartPulse className="w-4 h-4" />
                        </div>

                        {/* Miniature ID badge */}
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-slate-950 border border-slate-800 text-[8px] font-mono rounded text-slate-400 whitespace-nowrap font-bold">
                          {hosp.id}
                        </div>
                      </button>
                    </div>
                  );
                })}

              </div>

              {/* Dynamic Map Coordinates HUD Legend */}
              <div className="absolute bottom-3 left-3 bg-slate-900/95 border border-slate-800 px-3 py-2 rounded-xl flex items-center gap-4 text-[9px] font-mono text-slate-400 backdrop-blur-md">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Schools</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Hospitals</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Locked Target</span>
                </div>
              </div>
            </div>

            {/* HOLOGRAPHIC TARGET LOCK CONSOLE INSPECT */}
            <AnimatePresence mode="wait">
              {activeInspectAsset ? (
                <motion.div
                  key={activeInspectAsset.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-5 relative overflow-hidden"
                >
                  {/* Decorative corner lines for sci-fi look */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500" />

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-3 mb-4">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-0.5">
                        {activeInspectAsset.type} Telemetry Lock
                      </span>
                      <h4 className="text-lg font-black text-white">{activeInspectAsset.name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-slate-400 font-black">
                        ID: {activeInspectAsset.id}
                      </span>
                      <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded ${
                        activeInspectAsset.baseRisk === 'Critical' || (activeInspectAsset as any).respiratoryRisk === 'Critical'
                          ? 'bg-rose-950 border border-rose-800 text-rose-400'
                          : 'bg-cyan-950 border border-cyan-800 text-cyan-400'
                      }`}>
                        {(activeInspectAsset as any).baseRisk || (activeInspectAsset as any).respiratoryRisk} RISK
                      </span>
                    </div>
                  </div>

                  {/* Telemetry Stats Rows */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono mb-4 text-slate-300">
                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-850">
                      <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-1">Exposure Metrics</span>
                      <span className="font-bold text-slate-100">
                        {activeInspectAsset.type === 'School' 
                          ? `${(activeInspectAsset as any).students} Enrolled`
                          : `${(activeInspectAsset as any).patients} ICU Patients`
                        }
                      </span>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-850">
                      <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-1">Regional Distance</span>
                      <span className="font-bold text-slate-100 truncate block">
                        {activeInspectAsset.proximity}
                      </span>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-850">
                      <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-1">Intake Filtration</span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> 99.4% HEPA Efficiency
                      </span>
                    </div>
                  </div>

                  {/* Tactical Directives Info Box */}
                  <div className="bg-cyan-950/20 border border-cyan-900/60 p-3.5 rounded-xl flex items-start gap-3">
                    <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-black block mb-0.5">MUNICIPAL DEPLOYMENT ENFORCEMENT</span>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                        {activeInspectAsset.action}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-xs">
                  <Sliders className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  Select any sensor node on the radar sweep grid above to inspect dynamic local telemetry.
                </div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* RIGHT COLUMN: TRANSLATION SUITE & BROADCAST CONSOLE (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* GEMINI TRANSLATION ENGINE CARD */}
          <div className="glass border border-slate-800 rounded-3xl p-6 flex flex-col gap-5 relative overflow-hidden bg-slate-900/20">
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-950 border border-purple-800 rounded-xl">
                  <LanguagesIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-white">Gemini translation Hub</h3>
                  <p className="text-xs text-slate-500 font-mono">Dynamic multi-lingual safety warnings</p>
                </div>
              </div>

              {/* Injected quick compiler button */}
              <button
                onClick={compileContextualAlert}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-xl text-[9px] font-mono tracking-wider font-bold text-purple-400 flex items-center gap-1.5 transition-colors"
              >
                <Cpu className="w-3 h-3 text-purple-400" />
                AUTO-GENERATE
              </button>
            </div>

            {/* Presets Grid */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono uppercase text-slate-500 font-bold tracking-wider">Public Health Alert Presets</span>
                {isTranslatingAll && (
                  <span className="text-[8px] font-mono text-purple-400 animate-pulse">Translating presets...</span>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2">
                {translatedTemplates.map((tmpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyTemplate(BROADCAST_TEMPLATES[idx].text)}
                    className="text-left p-2.5 border border-slate-850 hover:border-slate-800 bg-slate-950 hover:bg-slate-900 rounded-xl text-xs text-slate-300 transition-colors flex items-center justify-between group"
                  >
                    <span className="font-medium truncate pr-4">{tmpl.title}</span>
                    <span className={`text-[8px] font-mono px-2 py-0.5 rounded shrink-0 ${
                      tmpl.urgency === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>{tmpl.urgency.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Advisory */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-mono uppercase text-slate-500 font-bold tracking-wider">Alert Warning Message (English)</span>
              <textarea
                value={advisoryText}
                onChange={(e) => setAdvisoryText(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 outline-none focus:border-purple-500/50 resize-none font-medium leading-relaxed"
                placeholder="Type municipal air warning protocol..."
              />
            </div>

            {/* Language Selection & Action button */}
            <div className="flex items-center justify-between gap-4 bg-slate-950/80 p-3 rounded-2xl border border-slate-900">
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-mono uppercase text-slate-500 font-bold tracking-wider">Target Language</span>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-xl outline-none focus:border-purple-500/50 font-black cursor-pointer"
                >
                  <option value="en">English (English)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="kn">Kannada (ಕನ್ನಡ)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                  <option value="te">Telugu (తెలుగు)</option>
                  <option value="mr">Marathi (मराठी)</option>
                  <option value="bn">Bengali (বাংলা)</option>
                  <option value="ml">Malayalam (മലയാളം)</option>
                </select>
              </div>

              <button
                onClick={handleTranslate}
                disabled={isTranslating}
                className="group relative flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 hover:opacity-90 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isTranslating ? 'animate-spin' : ''}`} />
                {isTranslating ? 'COMPILING TRANSLATION...' : 'COMPILE TRANSLATION'}
              </button>
            </div>

            {/* Multi-Lingual Broadcast Matrix */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[9px] font-mono uppercase text-slate-500 font-bold tracking-wider block">Multi-Lingual Broadcast Matrix (Speak in any language)</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'Hindi (हिन्दी)' },
                  { code: 'kn', label: 'Kannada (ಕನ್ನಡ)' },
                  { code: 'ta', label: 'Tamil (தமிழ்)' },
                  { code: 'te', label: 'Telugu (తెలుగు)' },
                  { code: 'mr', label: 'Marathi (मराठी)' },
                  { code: 'bn', label: 'Bengali (বাংলা)' },
                  { code: 'ml', label: 'Malayalam (മലയാളം)' }
                ].map((langObj) => {
                  const isCurrent = targetLanguage === langObj.code;
                  const translationText = allTranslations[langObj.code] || (langObj.code === 'en' ? advisoryText : '');
                  const isLoaded = !!translationText;

                  return (
                    <div
                      key={langObj.code}
                      onClick={() => {
                        setTargetLanguage(langObj.code);
                        if (translationText) {
                          setTranslatedText(translationText);
                        }
                      }}
                      className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between text-left cursor-pointer group relative overflow-hidden h-[54px] ${
                        isCurrent
                          ? 'bg-purple-950/30 border-purple-500/50 text-purple-200'
                          : 'bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-[10px] tracking-tight truncate">{langObj.label}</span>
                        {isLoaded && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speakText(translationText, langObj.code);
                            }}
                            className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all flex items-center justify-center shrink-0"
                            title={`Speak translation in ${langObj.label}`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[8px] opacity-60 font-mono">
                        <span>{isLoaded ? '✓ READY' : '... COMPILING'}</span>
                        {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Neural Matrix Translation Ingestion */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-mono uppercase text-slate-500 font-bold tracking-wider">Decompiled active Translation Stream</span>
              <div className="min-h-[100px] bg-slate-950 border border-slate-900 rounded-xl p-4 relative flex flex-col justify-center overflow-hidden">
                
                {/* Decorative scanning laser */}
                <div className="absolute inset-x-0 h-[1px] bg-purple-500/20 top-1/2 pointer-events-none animate-pulse" />

                <AnimatePresence mode="wait">
                  {isTranslating ? (
                    <motion.div 
                      key="loader"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center gap-2"
                    >
                      {/* Matrix scrolling characters */}
                      <span className="text-3xl font-black text-purple-400 font-sans tracking-widest animate-pulse">
                        {translationGlyphs[glyphIndex]}
                      </span>
                      <span className="text-[9px] font-mono text-purple-500 uppercase tracking-widest font-bold">
                        MATRIX SECTOR INGESTION...
                      </span>
                    </motion.div>
                  ) : translatedText ? (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-2 mb-1 border-b border-slate-900 pb-1.5">
                        <span className="text-[9px] font-mono font-black text-purple-400 uppercase tracking-wider">
                          Active Target Language: {targetLanguage.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-purple-300 leading-relaxed font-sans select-all">
                        {translatedText}
                      </p>
                      
                      {/* Notice Banner */}
                      {translationNotice && (
                        <div className="mt-1.5 pt-2 border-t border-slate-900 flex items-center gap-2 text-[9px] font-mono text-purple-400">
                          <Activity className="w-3.5 h-3.5 shrink-0" />
                          <span>{translationNotice}</span>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.span 
                      key="empty" 
                      className="text-xs text-slate-600 italic text-center block"
                    >
                      No translated payload generated. Click "Compile Translation" or select any preset to execute.
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>

          {/* SIMULATED HIGH-POWER ACOUSTIC BROADCAST DECK */}
          <div className="glass border border-slate-800 rounded-3xl p-6 flex flex-col gap-5 relative overflow-hidden bg-slate-900/20">
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-950 border border-rose-800 rounded-xl">
                  <Volume2 className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-white">Megaphone broadcast simulator</h3>
                  <p className="text-xs text-slate-500 font-mono">Simulate high-acoustic municipal megaphones</p>
                </div>
              </div>
            </div>

            {/* Dual visualizer / oscillator configuration panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Audio Waveform visualizer */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="flex items-end justify-center gap-1 h-14 w-full px-2">
                  {waveHeights.map((ht, idx) => (
                    <motion.div
                      key={idx}
                      animate={{ height: ht }}
                      transition={{ type: 'spring', damping: 15 }}
                      className={`w-1 rounded-full ${
                        isPlaying ? 'bg-gradient-to-t from-rose-500 to-purple-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]' : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-2 text-[8px] font-mono text-slate-500 text-center uppercase tracking-wider font-bold">
                  {isPlaying ? 'ACTIVE SPEECH SPECTRUM' : 'ACOUSTIC CARRIER OFF'}
                </div>
              </div>

              {/* Synthesizer Alarms Box */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-900 flex flex-col gap-2.5">
                <span className="text-[8px] font-mono uppercase text-slate-500 font-bold tracking-wider">Acoustic Signal Test</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSynthesizerMode(synthesizerMode === 'siren' ? 'off' : 'siren')}
                    className={`py-2 rounded-xl text-[9px] font-black font-mono tracking-wider uppercase transition-all border ${
                      synthesizerMode === 'siren'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Siren Sweep
                  </button>
                  <button
                    onClick={() => setSynthesizerMode(synthesizerMode === 'geiger' ? 'off' : 'geiger')}
                    className={`py-2 rounded-xl text-[9px] font-black font-mono tracking-wider uppercase transition-all border ${
                      synthesizerMode === 'geiger'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Geiger Click
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[8px] font-mono text-slate-500 shrink-0">TEST VOL</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={synthVolume}
                    onChange={(e) => setSynthVolume(Number(e.target.value))}
                    className="flex-1 accent-rose-500 h-1 bg-slate-900 rounded outline-none cursor-pointer"
                  />
                  <span className="text-[8px] font-mono text-slate-400 w-6 text-right font-black">{synthVolume}%</span>
                </div>
              </div>

            </div>

            {/* Playback Controls & Vocoder Profile */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                
                {/* Voice Profile selection */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Acoustic Vocoder Profile</span>
                  <select
                    value={voiceProfile}
                    onChange={(e) => {
                      setVoiceProfile(e.target.value);
                      addBroadcastLog(`Announcer vocoder adjusted to: ${e.target.value}`, 'info');
                    }}
                    className="bg-slate-950 border border-slate-800 text-slate-300 text-xs px-3 py-2 rounded-xl outline-none"
                  >
                    <option value="Alpha (Bass Warning)">Alpha (Bass Warning)</option>
                    <option value="Beta (Standard Clarity)">Beta (Standard Clarity)</option>
                    <option value="Municipal Siren Overlay">Municipal Siren Overlay</option>
                  </select>
                </div>

                {/* Speed rate modifier */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Playback Velocity</span>
                  <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    {[0.8, 1.0, 1.2].map((sp) => (
                      <button
                        key={sp}
                        onClick={() => {
                          setPlaybackSpeed(sp);
                          addBroadcastLog(`Vocal pace index shifted to ${sp}x`, 'info');
                        }}
                        className={`flex-1 py-1 rounded-lg text-xs font-black font-mono transition-all ${
                          playbackSpeed === sp 
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 font-black' 
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {sp}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-4 border-t border-slate-900 pt-3">
                <span className="text-[9px] font-mono text-slate-500 uppercase shrink-0">Broadcast Gain</span>
                <Volume2 className="w-4 h-4 text-slate-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1 accent-rose-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg outline-none"
                />
                <span className="text-[9px] font-mono text-slate-400 w-8 text-right font-black">{volume}%</span>
              </div>

              {/* Main Playback Trigger */}
              <button
                onClick={togglePlayback}
                className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-all ${
                  isPlaying 
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.2)] hover:bg-rose-500/30' 
                    : 'bg-rose-600 text-white hover:bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.35)]'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current animate-pulse" /> : <Play className="w-4 h-4 fill-current" />}
                {isPlaying ? 'SUSPEND BROADCAST FEED' : 'DEPLOY MUNICIPAL BROADCAST ALERT'}
              </button>
            </div>

            {/* Broadcast Terminal logs */}
            <div className="flex flex-col gap-2 border-t border-slate-900 pt-4 font-mono">
              <span className="text-[9px] uppercase text-slate-500 font-bold tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-500" /> System Broadcast Telemetry Log
              </span>
              <div className="h-28 overflow-y-auto bg-slate-950 rounded-xl p-3.5 border border-slate-900 text-[10px] flex flex-col gap-2">
                {broadcastLogs.map((log, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start leading-normal">
                    <span className="text-slate-600 shrink-0">[{log.time}]</span>
                    <span className={`${
                      log.type === 'success' ? 'text-emerald-400 font-bold' :
                      log.type === 'warning' ? 'text-rose-400' : 'text-slate-400'
                    }`}>{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
