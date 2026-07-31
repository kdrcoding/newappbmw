import React, { useState } from 'react';
import { 
  Sliders, 
  Search, 
  Save, 
  RefreshCw, 
  Check, 
  ChevronRight, 
  Cpu, 
  Info,
  Database
} from 'lucide-react';
import { VehicleData } from '../types';

interface FDLParametersEditorProps {
  vehicle: VehicleData;
}

interface FDLParamItem {
  id: string;
  module: string; // e.g. "3000 HMI", "3001 AUDIO", "3002 NAVI"
  name: string;
  description: string;
  currentValue: string;
  defaultValue: string;
  options: string[];
}

export const FDLParametersEditor: React.FC<FDLParametersEditorProps> = ({ vehicle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [params, setParams] = useState<FDLParamItem[]>([
    {
      id: 'p1',
      module: '3000 HMI_SPEECH',
      name: 'CARPLAY_MODE',
      description: 'Master wireless Apple CarPlay enable trigger in headunit stack',
      currentValue: 'aktiv',
      defaultValue: 'nicht_aktiv',
      options: ['nicht_aktiv', 'aktiv'],
    },
    {
      id: 'p2',
      module: '3000 HMI_SPEECH',
      name: 'CARPLAY_FULLSCREEN',
      description: 'Expands CarPlay UI to fill entire widescreen aspect ratio',
      currentValue: 'aktiv',
      defaultValue: 'nicht_aktiv',
      options: ['nicht_aktiv', 'aktiv'],
    },
    {
      id: 'p3',
      module: '3000 HMI_SPEECH',
      name: 'SPEEDLOCK_X_KMH_MIN',
      description: 'Minimum vehicle speed threshold to lock video playback',
      currentValue: 'FF_kmh',
      defaultValue: '03_kmh',
      options: ['03_kmh', '08_kmh', '10_kmh', 'FF_kmh'],
    },
    {
      id: 'p4',
      module: '3000 HMI_SPEECH',
      name: 'SPEEDLOCK_X_KMH_MAX',
      description: 'Maximum vehicle speed threshold to lock video playback',
      currentValue: 'FF_kmh',
      defaultValue: '05_kmh',
      options: ['05_kmh', '12_kmh', 'FF_kmh'],
    },
    {
      id: 'p5',
      module: '3003 WLAN_SETTINGS',
      name: 'WLAN_DIAGNOSIS',
      description: 'Enables Wi-Fi antenna frequency diagnostic channel',
      currentValue: 'aktiv',
      defaultValue: 'nicht_aktiv',
      options: ['nicht_aktiv', 'aktiv'],
    },
    {
      id: 'p6',
      module: '3000 HMI_SPEECH',
      name: 'M_LAPTIMER',
      description: 'Triggers BMW M Laptimer & Telemetry recorder app',
      currentValue: 'aktiv',
      defaultValue: 'nicht_aktiv',
      options: ['nicht_aktiv', 'aktiv'],
    },
    {
      id: 'p7',
      module: '3001 AUDIO_SYSTEM',
      name: 'HIGH_END_AUDIO_SURROUND',
      description: 'Bowers & Wilkins Diamond acoustic sound profile DSP',
      currentValue: 'bowers_wilkins',
      defaultValue: 'standard',
      options: ['standard', 'harman_kardon', 'bowers_wilkins', 'bang_olufsen'],
    },
    {
      id: 'p8',
      module: '3002 NAVI_SETTINGS',
      name: 'MAP_3D_CITY_MODELS',
      description: 'Renders 3D landmark building architecture on map view',
      currentValue: 'aktiv',
      defaultValue: 'nicht_aktiv',
      options: ['nicht_aktiv', 'aktiv'],
    },
  ]);

  const handleReadNCD = () => {
    setIsReading(true);
    setTimeout(() => {
      setIsReading(false);
    }, 800);
  };

  const handleWriteNCD = () => {
    setIsWriting(true);
    setTimeout(() => {
      setIsWriting(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }, 1000);
  };

  const filteredParams = params.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-slate-100">FDL Parameter & NCD Coding Editor</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Directly edit FDL (Function Data Local) NCD coding keys on <span className="text-blue-300 font-semibold">{vehicle.headunitName}</span> (ECU: {vehicle.ecuAddress}).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleReadNCD}
            disabled={isReading}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition flex items-center space-x-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReading ? 'animate-spin text-blue-400' : ''}`} />
            <span>Read NCD File</span>
          </button>

          <button
            onClick={handleWriteNCD}
            disabled={isWriting}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-blue-900/30 flex items-center space-x-1.5"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'NCD Written OK!' : 'Write NCD to ECU'}</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search FDL parameter name (e.g. CARPLAY_FULLSCREEN, SPEEDLOCK)..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:border-blue-500 outline-none shadow-md"
        />
      </div>

      {/* Parameters List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="space-y-3">
          {filteredParams.map((p) => (
            <div
              key={p.id}
              className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono hover:border-slate-700 transition"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded">
                    {p.module}
                  </span>
                  <span className="font-bold text-blue-300 text-xs">{p.name}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">{p.description}</p>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-[10px] text-slate-500 hidden sm:inline">Value:</span>
                <select
                  value={p.currentValue}
                  onChange={(e) => {
                    const newVal = e.target.value;
                    setParams((prev) =>
                      prev.map((item) => (item.id === p.id ? { ...item, currentValue: newVal } : item))
                    );
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-emerald-400 font-bold text-xs outline-none focus:border-blue-500"
                >
                  {p.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
