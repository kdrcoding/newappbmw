import React from 'react';
import { 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  Zap, 
  Cpu, 
  RefreshCw, 
  Bot, 
  Terminal, 
  Car, 
  Download,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { VehicleData, ConnectionStatus } from '../types';

interface HeaderProps {
  vehicle: VehicleData;
  connectionStatus: ConnectionStatus;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAutoScan: () => void;
  onOpenAIAssistant: () => void;
  onToggleTerminal: () => void;
  showTerminal: boolean;
  unlockedCount: number;
  totalFeaturesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  vehicle,
  connectionStatus,
  activeTab,
  setActiveTab,
  onAutoScan,
  onOpenAIAssistant,
  onToggleTerminal,
  showTerminal,
  unlockedCount,
  totalFeaturesCount,
}) => {
  const isConnected = connectionStatus === 'connected' || connectionStatus === 'flashing';

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-xl">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-red-600 p-0.5 shadow-lg shadow-blue-900/30">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Car className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-red-500 bg-clip-text text-transparent">
                  BimmerUnlock
                </span>
                <span className="text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">
                  PRO ENET v3.8
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                BMW OBD-II ENET FSC Injector & Headunit Feature Installer
              </p>
            </div>
          </div>

          {/* Vehicle & OBD Connection Status Badge */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Status Indicator */}
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border font-mono ${
              isConnected 
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
                : connectionStatus === 'connecting'
                ? 'bg-amber-950/60 border-amber-500/40 text-amber-300 animate-pulse'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
            }`}>
              {isConnected ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold">ENET ONLINE ({vehicle.ipAddress}:13400)</span>
                </>
              ) : connectionStatus === 'connecting' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span>DOIP SCANNING...</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                  <span>DISCONNECTED</span>
                </>
              )}
            </div>

            {/* Vehicle Card summary */}
            {isConnected && (
              <div className="hidden lg:flex items-center space-x-3 px-3 py-1.5 bg-slate-800/80 rounded-lg border border-slate-700/60 font-mono text-slate-300">
                <div className="flex items-center space-x-1">
                  <span className="text-slate-400">VIN:</span>
                  <span className="font-bold text-amber-300">{vehicle.vin}</span>
                </div>
                <div className="h-3 w-px bg-slate-700" />
                <div className="flex items-center space-x-1">
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-blue-300">{vehicle.headunitName}</span>
                </div>
                <div className="h-3 w-px bg-slate-700" />
                <div className="flex items-center space-x-1 text-emerald-400">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>{vehicle.voltage.toFixed(1)}V</span>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center space-x-1.5 ml-auto">
              <button
                onClick={onAutoScan}
                className="flex items-center space-x-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition font-medium text-xs shadow-md shadow-blue-900/30"
                title="Scan OBD-II ENET ECU"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">ECU Scan</span>
              </button>

              <button
                onClick={onOpenAIAssistant}
                className="flex items-center space-x-1 px-2.5 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-indigo-100 border border-indigo-500/40 rounded-lg transition text-xs font-medium"
                title="AI BMW Diagnostics Advisor"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-300" />
                <span className="hidden sm:inline">AI Advisor</span>
              </button>

              <button
                onClick={onToggleTerminal}
                className={`p-1.5 rounded-lg border text-xs transition ${
                  showTerminal
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title="Toggle DoIP ISO 13400 Packet Terminal"
              >
                <Terminal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="flex items-center justify-between border-t border-slate-800/80 mt-3 pt-2 overflow-x-auto scrollbar-none">
          <nav className="flex space-x-1 sm:space-x-2 min-w-max">
            {[
              { id: 'features', label: 'FSC & Feature Activator', badge: `${unlockedCount}/${totalFeaturesCount}` },
              { id: 'connection', label: 'ENET Connection & ECU' },
              { id: 'simulator', label: 'iDrive Screen Simulator' },
              { id: 'fsc_manager', label: 'FSC Package Generator' },
              { id: 'fdl_editor', label: 'FDL Parameters' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center space-x-2 text-[11px] font-mono text-slate-400">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>NBTevo ID6</span>
            </span>
            <span>/</span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>CarPlay 00E5</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
