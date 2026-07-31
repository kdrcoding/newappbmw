import React, { useState } from 'react';
import { 
  Check, 
  Lock, 
  Unlock, 
  Search, 
  Sparkles, 
  Smartphone, 
  Maximize2, 
  SmartphoneNfc, 
  Film, 
  MapPin, 
  Gauge, 
  ShieldAlert, 
  Radio, 
  Mic, 
  RadioReceiver, 
  Volume2,
  ShieldCheck,
  Download,
  RotateCcw,
  Sliders,
  ChevronRight,
  Info
} from 'lucide-react';
import { FSCFeature, VehicleData } from '../types';

interface FeatureInstallerPanelProps {
  features: FSCFeature[];
  setFeatures: React.Dispatch<React.SetStateAction<FSCFeature[]>>;
  vehicle: VehicleData;
  onStartFlashing: (selectedFeatures: FSCFeature[]) => void;
  onDownloadOEMBackup: () => void;
  onRestoreFactoryOEM: () => void;
}

const CATEGORIES = [
  'All Features',
  'CarPlay & Auto',
  'Multimedia & Video',
  'Navigation & Maps',
  'Performance & Gauges',
  'Connectivity & Voice',
];

export const FeatureInstallerPanel: React.FC<FeatureInstallerPanelProps> = ({
  features,
  setFeatures,
  vehicle,
  onStartFlashing,
  onDownloadOEMBackup,
  onRestoreFactoryOEM,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All Features');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFeatureId, setExpandedFeatureId] = useState<string | null>('carplay_wireless');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone': return Smartphone;
      case 'Maximize2': return Maximize2;
      case 'SmartphoneNfc': return SmartphoneNfc;
      case 'Film': return Film;
      case 'MapPin': return MapPin;
      case 'Gauge': return Gauge;
      case 'ShieldAlert': return ShieldAlert;
      case 'Radio': return Radio;
      case 'Mic': return Mic;
      case 'RadioReceiver': return RadioReceiver;
      case 'Volume2': return Volume2;
      default: return Sparkles;
    }
  };

  const toggleFeatureSelect = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isSelected: !f.isSelected } : f))
    );
  };

  const filteredFeatures = features.filter((f) => {
    const matchesCategory =
      selectedCategory === 'All Features' || f.category === selectedCategory;
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.featureCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.appId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedList = features.filter((f) => f.isSelected && !f.isUnlocked);
  const unlockedCount = features.filter((f) => f.isUnlocked).length;

  return (
    <div className="space-y-6">
      
      {/* Top Controls & Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-slate-100">BMW iDrive FSC & Feature Activator</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-bold">
              TARGET: ECU 0x63 (HU_NBT2 / HU_MGU)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Select the features you wish to activate on <span className="text-blue-300 font-semibold">{vehicle.headunitName}</span> (VIN: {vehicle.vin}). Cryptographic FSC certificates and FDL parameters are compiled and injected directly into headunit ECU 0x63 over DoIP Port 13400. Engine, transmission, and braking ECUs are strictly isolated and untouched.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onDownloadOEMBackup}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition flex items-center space-x-1.5"
            title="Backup OEM FSC Certificates to ZIP Archive"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export OEM Backup</span>
          </button>

          <button
            onClick={onRestoreFactoryOEM}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-medium transition flex items-center space-x-1.5"
            title="Restore Factory OEM FSC State"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Factory OEM</span>
          </button>

          <button
            onClick={() => onStartFlashing(selectedList.length > 0 ? selectedList : features.filter(f => f.isSelected))}
            disabled={selectedList.length === 0 && features.filter(f => f.isSelected).length === 0}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-lg ${
              selectedList.length > 0 || features.filter(f => f.isSelected).length > 0
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600 hover:from-blue-500 hover:to-red-500 text-white shadow-blue-900/40'
                : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
            }`}
          >
            <Unlock className="w-4 h-4 text-white" />
            <span>Inject Selected ({selectedList.length > 0 ? selectedList.length : features.filter(f => f.isSelected).length}) Features</span>
          </button>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSel = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition ${
                  isSel
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search features or FSC code (00E5)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Main Grid: Features List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFeatures.map((feat) => {
          const IconComponent = getIcon(feat.iconName);
          const isExpanded = expandedFeatureId === feat.id;

          return (
            <div
              key={feat.id}
              className={`bg-slate-900 rounded-2xl border transition shadow-lg overflow-hidden flex flex-col justify-between ${
                feat.isUnlocked
                  ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-slate-900'
                  : feat.isSelected
                  ? 'border-blue-500/60 ring-1 ring-blue-500/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl border ${
                      feat.isUnlocked
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : 'bg-slate-800 border-slate-700 text-blue-400'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-100 leading-snug">{feat.title}</h3>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="font-mono text-[10px] text-blue-300 bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/20">
                          FSC {feat.featureCode}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          AppID: {feat.appId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Unlock / Select Checkbox */}
                  <button
                    onClick={() => toggleFeatureSelect(feat.id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition ${
                      feat.isUnlocked
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : feat.isSelected
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-transparent hover:border-slate-500'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {feat.description}
                </p>
              </div>

              {/* Card Details Expander Toggle */}
              <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-slate-800/60 mt-auto">
                <div className="flex items-center space-x-1.5">
                  {feat.isUnlocked ? (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-mono text-emerald-400 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>UNLOCKED & APPROVED</span>
                    </span>
                  ) : feat.isSelected ? (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-mono text-blue-400 font-medium">
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Ready for Injection</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-mono text-slate-500">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked (OEM State)</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setExpandedFeatureId(isExpanded ? null : feat.id)}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1 font-mono"
                >
                  <Sliders className="w-3 h-3 text-blue-400" />
                  <span>{isExpanded ? 'Hide FDL' : 'View FDL'}</span>
                </button>
              </div>

              {/* Expanded FDL Parameter Box */}
              {isExpanded && (
                <div className="bg-slate-950 p-4 border-t border-slate-800 text-xs space-y-2 font-mono">
                  <span className="text-[10px] text-blue-400 uppercase font-bold block">
                    FDL Coding & Memory Parameters
                  </span>
                  {feat.fdlParameters.map((param, idx) => (
                    <div key={idx} className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex flex-col space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-300 font-bold">{param.parameter}</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-slate-500 line-through">{param.current}</span>
                          <ChevronRight className="w-3 h-3 text-blue-400" />
                          <span className="text-emerald-400 font-bold">{param.unlockValue}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-sans">{param.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
