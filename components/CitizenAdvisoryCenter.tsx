import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CITIES } from '../constants';
import { 
  School, 
  Building2, 
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
  Volume1,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Pre-configured vulnerability metadata for the 5 target Indian cities
const VULNERABLE_ASSETS: Record<string, {
  schools: Array<{ id: string; name: string; students: number; proximity: string; baseRisk: 'Critical' | 'High' | 'Moderate' | 'Satisfactory'; action: string }>;
  hospitals: Array<{ id: string; name: string; patients: number; occupancy: number; respiratoryRisk: 'Critical' | 'High' | 'Moderate'; action: string }>;
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
  }
];

export const CitizenAdvisoryCenter: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('New Delhi');
  const [activeOverlay, setActiveOverlay] = useState<'plumes' | 'alerts' | 'protocols' | 'none'>('alerts');
  
  // Live AQI State and effect
  const [liveAqi, setLiveAqi] = useState<number | null>(null);
  const [isLiveAqiLoading, setIsLiveAqiLoading] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    setIsLiveAqiLoading(true);
    fetch(`/api/live-aqi?city=${encodeURIComponent(selectedCity)}`)
      .then(res => res.json())
      .then(data => {
        if (active && data && typeof data.aqi === 'number') {
          setLiveAqi(data.aqi);
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
  const [targetLanguage, setTargetLanguage] = useState<string>('hi');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationNotice, setTranslationNotice] = useState<string>('');
  
  // Voice broadcast simulation state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [voiceProfile, setVoiceProfile] = useState<string>('Alpha (Bass Warning)');
  const [broadcastLogs, setBroadcastLogs] = useState<Array<{ time: string; msg: string; type: string }>>([
    { time: '10:00:00', msg: 'System diagnostic OK. Megaphone relays on standby.', type: 'info' }
  ]);
  const [volume, setVolume] = useState<number>(80);
  
  const waveBarsCount = 18;
  const [waveHeights, setWaveHeights] = useState<number[]>(Array(waveBarsCount).fill(15));
  const animationRef = useRef<number | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Generate real-time oscillating wave heights when playing
  useEffect(() => {
    if (isPlaying) {
      const animateWave = () => {
        setWaveHeights(prev => 
          prev.map(() => Math.floor(Math.random() * 45) + 8)
        );
        animationRef.current = requestAnimationFrame(animateWave);
      };
      animationRef.current = requestAnimationFrame(animateWave);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setWaveHeights(Array(waveBarsCount).fill(12));
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  // Play a beautiful siren chime prior to speaking when 'Municipal Siren Overlay' is active
  const playSirenChime = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc1.type = 'sine';
      osc2.type = 'triangle';
      
      gainNode.gain.setValueAtTime((volume / 100) * 0.18, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      
      // Rising/falling pitch siren modulation
      osc1.frequency.setValueAtTime(580, ctx.currentTime);
      osc1.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.4);
      osc1.frequency.linearRampToValueAtTime(580, ctx.currentTime + 0.8);
      osc1.frequency.linearRampToValueAtTime(880, ctx.currentTime + 1.2);
      
      osc2.frequency.setValueAtTime(585, ctx.currentTime);
      osc2.frequency.linearRampToValueAtTime(885, ctx.currentTime + 0.4);
      osc2.frequency.linearRampToValueAtTime(585, ctx.currentTime + 0.8);
      osc2.frequency.linearRampToValueAtTime(885, ctx.currentTime + 1.2);
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.2);
      osc2.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.error('Failed to play siren chime:', e);
    }
  };

  // Synchronize actual Audio Speech Synthesis with UI state
  useEffect(() => {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    if (!synth) return;

    let timeoutId: any = null;

    if (isPlaying) {
      // Cancel any active speech synthesis
      synth.cancel();

      const textToSpeak = translatedText || advisoryText;
      if (!textToSpeak) {
        setIsPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utteranceRef.current = utterance;

      // Map parameters from state
      utterance.volume = volume / 100;
      utterance.rate = playbackSpeed;

      // Alter pitch based on selected acoustic profile
      if (voiceProfile.includes('Bass')) {
        utterance.pitch = 0.75; // Deeper warning tone
      } else if (voiceProfile.includes('Siren')) {
        utterance.pitch = 1.35; // Sharper alert tone
      } else {
        utterance.pitch = 1.0;  // Standard clarity
      }

      // Choose matching localized voice if speaking translation
      const voices = synth.getVoices();
      let matchedVoice = null;

      if (translatedText) {
        const langMap: Record<string, string> = {
          'hi': 'hi-IN',
          'kn': 'kn-IN',
          'ta': 'ta-IN',
          'te': 'te-IN',
          'mr': 'mr-IN',
          'bn': 'bn-IN'
        };
        const targetLocale = langMap[targetLanguage] || 'en-US';
        
        matchedVoice = voices.find(v => v.lang.toLowerCase().includes(targetLocale.toLowerCase()));
        if (!matchedVoice) {
          matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(targetLanguage));
        }
      }

      if (!matchedVoice) {
        // Fallback to any Indian English or general English voice if translated is missing or standard
        matchedVoice = voices.find(v => v.lang.includes('IN')) || 
                       voices.find(v => v.lang.startsWith('en')) || 
                       voices[0];
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => {
        setIsPlaying(false);
        addBroadcastLog('Acoustic voice alert broadcast finished successfully.', 'success');
      };

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted') {
          console.error('SpeechSynthesis Error:', e);
          setIsPlaying(false);
          addBroadcastLog(`Speech stream alert: ${e.error}`, 'warning');
        }
      };

      // Play Siren beep first if configured, else start speaking immediately
      let delay = 0;
      if (voiceProfile.includes('Siren')) {
        playSirenChime();
        delay = 1200; // Delay speaking until siren chime completes
      }

      timeoutId = setTimeout(() => {
        synth.speak(utterance);
      }, delay);
    } else {
      synth.cancel();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      synth.cancel();
    };
  }, [isPlaying, volume, playbackSpeed, voiceProfile, translatedText, advisoryText, targetLanguage]);

  // Log broadcast events
  const addBroadcastLog = (msg: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const time = new Date().toLocaleTimeString();
    setBroadcastLogs(prev => [{ time, msg, type }, ...prev].slice(0, 8));
  };

  // Run the translation calling the server API
  const handleTranslate = async () => {
    if (!advisoryText.trim()) return;
    setIsTranslating(true);
    setTranslatedText('');
    setTranslationNotice('');
    
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: advisoryText, targetLanguage })
      });
      
      const data = await response.json();
      if (response.ok) {
        setTranslatedText(data.translatedText);
        if (data.isSimulated) {
          setTranslationNotice('Utilizing highly polished local simulation fallback (Add GEMINI_API_KEY to activate live API).');
        } else {
          setTranslationNotice('Neural Translation successfully compiled via Gemini-3.5-Flash!');
        }
      } else {
        throw new Error(data.error || 'Failed to retrieve translation.');
      }
    } catch (err: any) {
      console.error(err);
      // Failover safely to standard simulation block
      const simulatedFallbacks: Record<string, string> = {
        'hi': 'स्वास्थ्य चेतावनी: अत्यधिक वायु प्रदूषण दर्ज। अस्पताल अलर्ट पर हैं। बच्चों और बुजुर्गों को बाहर जाने से बचना चाहिए।',
        'kn': 'ಆರೋಗ್ಯ ಎಚ್ಚರಿಕೆ: ತೀವ್ರ ಮಾಲಿನ್ಯ ಪತ್ತೆಯಾಗಿದೆ. ಮಕ್ಕಳು ಮತ್ತು ಹಿರಿಯರು ಹೊರಗೆ ಹೋಗುವುದನ್ನು ತಪ್ಪಿಸಿ.',
        'ta': 'சுகாதார எச்சரிக்கை: அதிகப்படியான மாசு கண்டறியப்பட்டுள்ளது. குழந்தைகள், முதியவர்கள் வெளியே செல்வதை தவிர்க்கவும்.',
        'te': 'ఆరోగ्य హెచ్చరిక: అత్యంత తీవ్రమైన కాలుష్యం నమోదైంది. పిల్లలు మరియు వృద్ధులు బయట తిరగడం నివారించాలి.',
        'mr': 'आरोग्य इशारा: अत्यंत उच्च प्रदूषण पातळी आढळली आहे. मुले आणि वृद्धांनी बाहेर जाणे टाळावे.',
        'bn': 'স্বাস্থ্য সতর্কতা: অত্যন্ত উচ্চ বায়ু দূষণ সনাক্ত করা হয়েছে। শিশু ও বয়স্কদের বাইরে যাওয়া এড়িয়ে চলতে হবে।'
      };
      setTranslatedText(simulatedFallbacks[targetLanguage] || `[Simulated Translation to ${targetLanguage}]: ${advisoryText}`);
      setTranslationNotice('Fallback simulation active due to network connectivity restrictions.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Audio Playback Simulation Action
  const togglePlayback = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      addBroadcastLog(`Megaphone acoustic dispersion initiated for ${selectedCity} at ${playbackSpeed}x speed`, 'success');
      addBroadcastLog(`Acoustic Profile: ${voiceProfile} dispersion locks active.`, 'info');
    } else {
      addBroadcastLog('Voice alert broadcast paused manually.', 'warning');
    }
  };

  const applyTemplate = (text: string) => {
    setAdvisoryText(text);
    addBroadcastLog('Loaded alert template preset.', 'info');
  };

  // Get assets of selected city
  const assets = useMemo(() => {
    if (VULNERABLE_ASSETS[selectedCity]) {
      return VULNERABLE_ASSETS[selectedCity];
    }
    // Generate simulated assets dynamically for newly requested cities so they feel fully integrated
    const code = selectedCity.substring(0, 3).toUpperCase();
    return {
      schools: [
        { 
          id: `S-${code}-01`, 
          name: `${selectedCity} Public School`, 
          students: 1200, 
          proximity: '250m from Town Center', 
          baseRisk: 'Moderate' as const, 
          action: 'Switch HVAC to Recirculation / Mask Distribution' 
        },
        { 
          id: `S-${code}-02`, 
          name: `St. Xavier's Academy, ${selectedCity}`, 
          students: 850, 
          proximity: '500m from Transit Zone', 
          baseRisk: 'Satisfactory' as const, 
          action: 'Monitor outdoor particulate dispersion' 
        }
      ],
      hospitals: [
        { 
          id: `H-${code}-01`, 
          name: `${selectedCity} General Hospital`, 
          patients: 620, 
          occupancy: 85, 
          respiratoryRisk: 'High' as const, 
          action: 'Deploy positive pressure barrier at intake locks' 
        }
      ]
    };
  }, [selectedCity]);

  // Overall city alert level helper based on actual pollution metric
  const getCityAlertLevel = () => {
    const aqi = liveAqi !== null ? liveAqi : (CITIES.find(c => c.name.toLowerCase() === selectedCity.toLowerCase())?.pollution || 50) * 3;

    if (aqi >= 200) {
      return { label: `CRITICAL WARNING (AQI ${aqi})`, color: 'text-rose-400 border-rose-500/30 bg-rose-500/10' };
    } else if (aqi >= 150) {
      return { label: `HIGH ALERT (AQI ${aqi})`, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' };
    } else if (aqi >= 100) {
      return { label: `MODERATE EXPOSURE (AQI ${aqi})`, color: 'text-blue-400 border-blue-500/20 bg-blue-500/5' };
    } else {
      return { label: `SATISFACTORY STATUS (AQI ${aqi})`, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' };
    }
  };

  const cityAlert = getCityAlertLevel();

  return (
    <div className="flex-1 flex flex-col gap-10 max-w-7xl mx-auto w-full pb-16 animate-in slide-in-from-bottom-12 duration-1000">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`px-3 py-1 text-[10px] font-mono font-black border rounded-full uppercase tracking-widest ${cityAlert.color}`}>
              {cityAlert.label}
            </div>
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter">
            Citizen Advisory Center
          </h2>
          <p className="text-slate-400 font-medium text-lg mt-1">
            Vulnerability maps, real-time Gemini AI translation alerts, and high-clarity acoustic broadcast simulator.
          </p>
        </div>

        {/* CITY SELECTOR */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-900/60 p-2 rounded-2xl border border-slate-800 self-stretch md:self-auto">
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {['New Delhi', 'Mumbai', 'Kolkata', 'Bengaluru', 'Chennai'].map((city) => (
              <button
                key={city}
                onClick={() => {
                  setSelectedCity(city);
                  addBroadcastLog(`Map overlay focus shifted to ${city}`, 'info');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedCity === city
                    ? 'bg-gradient-to-r from-magenta-500 to-purple-600 text-white shadow-lg'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
          <div className="hidden sm:block h-6 w-px bg-slate-800" />
          <select
            value={['New Delhi', 'Mumbai', 'Kolkata', 'Bengaluru', 'Chennai'].includes(selectedCity) ? selectedCity : selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              addBroadcastLog(`Map overlay focus shifted to ${e.target.value}`, 'info');
            }}
            className="bg-slate-950 text-slate-300 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-magenta-500 transition-colors cursor-pointer min-w-[200px]"
          >
            <option value="" disabled className="text-slate-600">Select Global / Local Grid...</option>
            {CITIES.slice().sort((a, b) => a.name.localeCompare(b.name)).map((city) => (
              <option key={city.id} value={city.name}>
                {city.name} ({city.country})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* BENTO GRID MAIN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* PANEL 1: VULNERABLE SCHOOLS & HOSPITALS MAP OVERLAY (8-COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col gap-6 relative overflow-hidden">
            
            {/* Header / Selector */}
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-magenta-400" />
                <div>
                  <h3 className="text-xl font-black tracking-tight text-white">Vulnerability Grid Overlay</h3>
                  <p className="text-xs text-slate-500 font-mono">Micro-targeting active school and hospital exposures</p>
                </div>
              </div>

              {/* Toggle Controls */}
              <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveOverlay('alerts')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider uppercase transition-all ${
                    activeOverlay === 'alerts' ? 'bg-rose-500/20 text-rose-400 font-black border border-rose-500/30' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Alerts
                </button>
                <button
                  onClick={() => setActiveOverlay('plumes')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider uppercase transition-all ${
                    activeOverlay === 'plumes' ? 'bg-orange-500/20 text-orange-400 font-black border border-orange-500/30' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Plumes
                </button>
                <button
                  onClick={() => setActiveOverlay('protocols')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider uppercase transition-all ${
                    activeOverlay === 'protocols' ? 'bg-cyan-500/20 text-cyan-400 font-black border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Protocols
                </button>
              </div>
            </div>

            {/* Plume Atmospheric Effect Overlay */}
            <AnimatePresence>
              {activeOverlay === 'plumes' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.35 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none z-0 bg-radial-smog animate-pulse"
                  style={{
                    background: 'radial-gradient(circle at 40% 30%, rgba(249, 115, 22, 0.25) 0%, transparent 65%)'
                  }}
                />
              )}
            </AnimatePresence>

            {/* Simulated Live Visual Grid */}
            <div className="relative border border-slate-800 rounded-2xl h-60 bg-slate-950/80 overflow-hidden flex items-center justify-center">
              {/* Grid Background */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 border border-slate-900 pointer-events-none opacity-20">
                {[...Array(48)].map((_, i) => (
                  <div key={i} className="border border-slate-800"></div>
                ))}
              </div>

              {/* Geographic Contour Lines */}
              <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 400 300" fill="none" stroke="currentColor">
                <path d="M50,150 Q100,50 200,150 T350,150" stroke="#f43f5e" strokeWidth="1.5" />
                <path d="M30,120 Q120,80 180,180 T370,100" stroke="#f59e0b" strokeWidth="1" />
                <path d="M80,200 Q150,120 250,220 T330,160" stroke="#06b6d4" strokeWidth="1" />
              </svg>

              {/* Plot Pins dynamically inside grid based on active city */}
              <div className="relative w-full h-full flex items-center justify-center">
                {assets.schools.map((sch, idx) => (
                  <div 
                    key={sch.id} 
                    className="absolute group/pin"
                    style={{
                      left: `${15 + idx * 30}%`,
                      top: `${30 + idx * 20}%`
                    }}
                  >
                    <div className="relative cursor-pointer">
                      <div className={`absolute -inset-2 rounded-full animate-ping opacity-60 ${
                        activeOverlay === 'alerts' && (sch.baseRisk === 'Critical' || sch.baseRisk === 'High') ? 'bg-rose-500' : 'bg-cyan-500'
                      }`}></div>
                      <div className={`relative p-2.5 rounded-full border border-slate-700 bg-slate-900 shadow-xl ${
                        activeOverlay === 'alerts' && (sch.baseRisk === 'Critical' || sch.baseRisk === 'High') ? 'border-rose-500' : 'border-cyan-400'
                      }`}>
                        <School className={`w-5 h-5 ${
                          activeOverlay === 'alerts' && (sch.baseRisk === 'Critical' || sch.baseRisk === 'High') ? 'text-rose-500' : 'text-cyan-400'
                        }`} />
                      </div>

                      {/* Tooltip on hover */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-12 hidden group-hover/pin:flex flex-col bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl z-50 w-64 pointer-events-none text-left">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">SCHOOL INFRASTRUCTURE</span>
                        <p className="text-xs font-black text-white mt-1">{sch.name}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Student Exposure: {sch.students}</p>
                        <p className="text-[10px] text-orange-400 font-mono mt-1 font-bold">Proximity: {sch.proximity}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {assets.hospitals.map((hosp, idx) => (
                  <div 
                    key={hosp.id} 
                    className="absolute group/pin"
                    style={{
                      left: `${45 + idx * 25}%`,
                      top: `${15 + idx * 35}%`
                    }}
                  >
                    <div className="relative cursor-pointer">
                      <div className={`absolute -inset-2 rounded-full animate-ping opacity-60 ${
                        activeOverlay === 'alerts' && hosp.respiratoryRisk === 'Critical' ? 'bg-red-500' : 'bg-rose-500'
                      }`}></div>
                      <div className={`relative p-2.5 rounded-full border border-slate-700 bg-slate-900 shadow-xl ${
                        activeOverlay === 'alerts' && hosp.respiratoryRisk === 'Critical' ? 'border-red-500' : 'border-rose-400'
                      }`}>
                        <HeartPulse className={`w-5 h-5 ${
                          activeOverlay === 'alerts' && hosp.respiratoryRisk === 'Critical' ? 'text-red-500' : 'text-rose-400'
                        }`} />
                      </div>

                      {/* Tooltip on hover */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-12 hidden group-hover/pin:flex flex-col bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl z-50 w-64 pointer-events-none text-left">
                        <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider">HOSPITAL HUB</span>
                        <p className="text-xs font-black text-white mt-1">{hosp.name}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Respiratory Occupancy: {hosp.occupancy}%</p>
                        <p className="text-[10px] text-red-400 font-mono mt-1 font-bold">Risk Matrix: {hosp.respiratoryRisk}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Indicator Legend Overlay */}
              <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl flex items-center gap-4 text-[10px] font-mono text-slate-400 backdrop-blur-md">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <span>Schools</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span>Hospitals</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                  <span>Critical Exceedance</span>
                </div>
              </div>
            </div>

            {/* List of Schools and Hospitals Detail Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Schools List */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                  <School className="w-4 h-4" /> Sensitive Schools ({assets.schools.length})
                </h4>
                <div className="flex flex-col gap-2.5">
                  {assets.schools.map((sch) => (
                    <div 
                      key={sch.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        activeOverlay === 'alerts' && (sch.baseRisk === 'Critical' || sch.baseRisk === 'High')
                          ? 'border-rose-500/20 bg-rose-500/5'
                          : 'border-slate-800 bg-slate-900/40'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] font-mono text-slate-500 font-bold">{sch.id}</span>
                        <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                          sch.baseRisk === 'Critical' ? 'bg-rose-500/20 text-rose-400' :
                          sch.baseRisk === 'High' ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {sch.baseRisk}
                        </span>
                      </div>
                      <p className="text-xs font-black text-white mt-1">{sch.name}</p>
                      <div className="flex gap-4 text-[10px] font-mono text-slate-400 mt-1.5">
                        <span>Enrolled: <b className="text-slate-300">{sch.students}</b></span>
                        <span>{sch.proximity}</span>
                      </div>

                      {/* Protocol Action Panel Toggle */}
                      {activeOverlay === 'protocols' && (
                        <div className="mt-2.5 p-2 bg-cyan-950/40 border border-cyan-800/30 rounded-xl flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <p className="text-[10px] text-cyan-300 font-mono leading-relaxed">
                            <b>Advisory Action:</b> {sch.action}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hospitals List */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-black uppercase text-rose-400 tracking-wider flex items-center gap-2">
                  <HeartPulse className="w-4 h-4" /> Hospital Overload Targets ({assets.hospitals.length})
                </h4>
                <div className="flex flex-col gap-2.5">
                  {assets.hospitals.map((hosp) => (
                    <div 
                      key={hosp.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        activeOverlay === 'alerts' && hosp.respiratoryRisk === 'Critical'
                          ? 'border-red-500/20 bg-red-500/5'
                          : 'border-slate-800 bg-slate-900/40'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] font-mono text-slate-500 font-bold">{hosp.id}</span>
                        <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                          hosp.respiratoryRisk === 'Critical' ? 'bg-red-600/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {hosp.respiratoryRisk}
                        </span>
                      </div>
                      <p className="text-xs font-black text-white mt-1">{hosp.name}</p>
                      <div className="flex gap-4 text-[10px] font-mono text-slate-400 mt-1.5">
                        <span>Patients: <b className="text-slate-300">{hosp.patients}</b></span>
                        <span>Capacity: <b className="text-slate-300">{hosp.occupancy}%</b></span>
                      </div>

                      {/* Protocol Action Panel Toggle */}
                      {activeOverlay === 'protocols' && (
                        <div className="mt-2.5 p-2 bg-rose-950/40 border border-rose-800/30 rounded-xl flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <p className="text-[10px] text-rose-300 font-mono leading-relaxed">
                            <b>Advisory Action:</b> {hosp.action}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* PANEL 2: MULTILINGUAL BROADCAST & VOICE SIMULATOR (5-COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* MULTILINGUAL ALERT TRANSLATION */}
          <div className="glass border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col gap-5 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <Languages className="w-6 h-6 text-purple-400" />
              <div>
                <h3 className="text-xl font-black tracking-tight text-white">Gemini Multi-lingual Translator</h3>
                <p className="text-xs text-slate-500 font-mono">Simulates real-time neural translation loops</p>
              </div>
            </div>

            {/* Template Presets */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-black tracking-wider">Alert Presets</span>
              <div className="flex flex-col gap-1.5">
                {BROADCAST_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyTemplate(tmpl.text)}
                    className="text-left p-2 border border-slate-800 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900/60 rounded-xl text-xs text-slate-300 transition-colors flex items-center justify-between"
                  >
                    <span>{tmpl.title}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      tmpl.urgency === 'Critical' ? 'bg-rose-500/15 text-rose-400' : 'bg-orange-500/15 text-orange-400'
                    }`}>{tmpl.urgency}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Alert */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-black tracking-wider">Advisory (English)</span>
              <textarea
                value={advisoryText}
                onChange={(e) => setAdvisoryText(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-100 outline-none focus:border-magenta-500/50 resize-none font-mono"
                placeholder="Type public health warning message here..."
              />
            </div>

            {/* Target Language Select */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-black tracking-wider">Target Language</span>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-300 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-magenta-500/50"
                >
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="kn">Kannada (ಕನ್ನಡ)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                  <option value="te">Telugu (తెలుగు)</option>
                  <option value="mr">Marathi (मराठी)</option>
                  <option value="bn">Bengali (বাংলা)</option>
                </select>
              </div>

              <button
                onClick={handleTranslate}
                disabled={isTranslating}
                className="group relative flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-magenta-500 to-purple-600 hover:opacity-90 rounded-2xl text-xs font-black uppercase text-white transition-all shadow-[0_0_15px_rgba(217,70,239,0.3)] disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isTranslating ? 'animate-spin' : ''}`} />
                {isTranslating ? 'Translating...' : 'Translate Alert'}
              </button>
            </div>

            {/* Translation Output */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-black tracking-wider">Translated Output Alert</span>
              <div className="min-h-[70px] bg-slate-950 border border-slate-900 rounded-2xl p-4 relative flex items-center">
                {translatedText ? (
                  <p className="text-sm font-semibold text-magenta-300 leading-relaxed font-sans select-all">
                    {translatedText}
                  </p>
                ) : (
                  <span className="text-xs text-slate-600 italic">No translated text. Use translated alert triggers above to sifting.</span>
                )}
              </div>
              
              {/* Notice Banner */}
              {translationNotice && (
                <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center gap-2 text-[10px] font-mono text-purple-400">
                  <Activity className="w-4 h-4 shrink-0" />
                  <span>{translationNotice}</span>
                </div>
              )}
            </div>

          </div>

          {/* SIMULATED HIGH-POWER VOICE PUBLIC MEGAPHONE */}
          <div className="glass border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col gap-5 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <Volume2 className="w-6 h-6 text-magenta-500" />
              <div>
                <h3 className="text-xl font-black tracking-tight text-white">Simulated Loudspeaker Broadcast</h3>
                <p className="text-xs text-slate-500 font-mono">Simulates high-acoustic output megaphone announcements</p>
              </div>
            </div>

            {/* Visualizer Waveform Block */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="flex items-end justify-center gap-1.5 h-16 w-full px-4">
                {waveHeights.map((ht, idx) => (
                  <motion.div
                    key={idx}
                    animate={{ height: ht }}
                    transition={{ type: 'spring', damping: 20 }}
                    className={`w-1.5 rounded-full ${
                      isPlaying ? 'bg-gradient-to-t from-magenta-500 to-purple-500 shadow-[0_0_10px_rgba(217,70,239,0.5)]' : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
              
              {/* Voice Node Profile Banner */}
              <div className="mt-3 text-[10px] font-mono flex items-center gap-2 text-slate-500">
                <Wifi className={`w-3.5 h-3.5 ${isPlaying ? 'text-magenta-500 animate-pulse' : 'text-slate-600'}`} />
                <span>BROADCAST FREQUENCY LOCK: <b className="text-slate-400">420.5 MHz</b></span>
              </div>
            </div>

            {/* Broadcast Controls */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Voice Profile selection */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Voice Selector</span>
                  <select
                    value={voiceProfile}
                    onChange={(e) => {
                      setVoiceProfile(e.target.value);
                      addBroadcastLog(`Announcer profile adjusted to: ${e.target.value}`, 'info');
                    }}
                    className="bg-slate-950 border border-slate-800 text-slate-300 text-xs px-3 py-2.5 rounded-xl outline-none"
                  >
                    <option value="Alpha (Bass Warning)">Alpha (Bass Warning)</option>
                    <option value="Beta (Standard Clarity)">Beta (Standard Clarity)</option>
                    <option value="Municipal Siren Overlay">Municipal Siren Overlay</option>
                  </select>
                </div>

                {/* Speed rate modifier */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Voice Speed Mod</span>
                  <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    {[0.8, 1.0, 1.2].map((sp) => (
                      <button
                        key={sp}
                        onClick={() => {
                          setPlaybackSpeed(sp);
                          addBroadcastLog(`Vocal speed multiplier configured to ${sp}x`, 'info');
                        }}
                        className={`flex-1 py-1 rounded text-xs font-black font-mono transition-all ${
                          playbackSpeed === sp ? 'bg-magenta-500/20 text-magenta-400 border border-magenta-500/30' : 'text-slate-500 hover:text-slate-300'
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
                <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0">Output Gain</span>
                <Volume1 className="w-4 h-4 text-slate-500" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1 accent-magenta-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg outline-none"
                />
                <span className="text-[10px] font-mono text-slate-400 w-8 text-right font-black">{volume}%</span>
              </div>

              {/* Main Playback trigger */}
              <button
                onClick={togglePlayback}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-all ${
                  isPlaying 
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)] hover:bg-rose-500/30' 
                    : 'bg-magenta-500 text-white hover:opacity-90 shadow-[0_0_15px_rgba(217,70,239,0.3)]'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                {isPlaying ? 'Deactivate Public Broadcast' : 'Deploy Voice Broadcast Alert'}
              </button>
            </div>

            {/* Broadcast Terminal logs */}
            <div className="flex flex-col gap-2 border-t border-slate-900 pt-4">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-black tracking-wider">Acoustic Logs & Telemetry</span>
              <div className="h-28 overflow-y-auto bg-slate-950 rounded-xl p-3 border border-slate-900 font-mono text-[9px] flex flex-col gap-1.5">
                {broadcastLogs.map((log, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start leading-normal">
                    <span className="text-slate-600 whitespace-nowrap">[{log.time}]</span>
                    <span className={`${
                      log.type === 'success' ? 'text-emerald-400 font-black' :
                      log.type === 'warning' ? 'text-orange-400' : 'text-slate-400'
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
