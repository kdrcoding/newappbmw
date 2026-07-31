import React, { useState } from 'react';
import { 
  Tv, 
  Smartphone, 
  MapPin, 
  Gauge, 
  Film, 
  Settings, 
  Music, 
  Radio, 
  Wifi, 
  Sliders, 
  Maximize2, 
  Play, 
  Pause, 
  ShieldCheck, 
  Volume2, 
  Zap, 
  Car,
  ChevronRight,
  Sun
} from 'lucide-react';
import { IDriveScreenState, FSCFeature } from '../types';

interface IDriveSimulatorProps {
  screenState: IDriveScreenState;
  setScreenState: React.Dispatch<React.SetStateAction<IDriveScreenState>>;
  features: FSCFeature[];
}

export const IDriveSimulator: React.FC<IDriveSimulatorProps> = ({
  screenState,
  setScreenState,
  features,
}) => {
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);

  const isCarPlayUnlocked = features.find((f) => f.id === 'carplay_wireless')?.isUnlocked;
  const isFullscreenUnlocked = features.find((f) => f.id === 'carplay_fullscreen')?.isUnlocked;
  const isVimUnlocked = features.find((f) => f.id === 'video_in_motion')?.isUnlocked;
  const isMLaptimerUnlocked = features.find((f) => f.id === 'm_laptimer_gauges')?.isUnlocked;
  const isMap3DUnlocked = features.find((f) => f.id === 'navigation_maps_2026')?.isUnlocked;
  const isAndroidAutoUnlocked = features.find((f) => f.id === 'android_auto_id6')?.isUnlocked;

  const isVideoLockedBySpeed = screenState.vehicleSpeed > 3 && !isVimUnlocked;

  return (
    <div className="space-y-6">
      
      {/* Title & Speed Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Tv className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-slate-100">BMW iDrive 6 / ID7 Interactive Headunit Simulator</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time preview of the vehicle display. Unlocking features via FSC code injection updates CarPlay fullscreen layout, Video in Motion speed thresholds, and M Sport gauges.
          </p>
        </div>

        {/* Vehicle Speed Slider for VIM Testing */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-4">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Speed Simulation</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">{screenState.vehicleSpeed} km/h</span>
          </div>

          <input
            type="range"
            min="0"
            max="160"
            value={screenState.vehicleSpeed}
            onChange={(e) =>
              setScreenState((prev) => ({ ...prev, vehicleSpeed: parseInt(e.target.value) }))
            }
            className="w-32 accent-blue-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Main iDrive Screen Enclosure */}
      <div className="bg-slate-950 p-4 sm:p-6 rounded-3xl border-4 border-slate-800 shadow-2xl space-y-4">
        
        {/* Physical iDrive Bezel Top Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1 text-slate-200 font-bold">
              <Car className="w-4 h-4 text-blue-400" />
              <span>BMW iDrive 6 EVO</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Resolution: 1920x720 10.25"</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-emerald-400">
              <Wifi className="w-3.5 h-3.5" />
              <span>5GHz Wi-Fi</span>
            </span>
            <span>12:45 PM</span>
            <span className="text-amber-400">22.5 °C</span>
          </div>
        </div>

        {/* Screen Display Frame */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-inner relative min-h-[380px] flex flex-col justify-between">
          
          {/* VIEW 1: MAIN iDRIVE HOME DASHBOARD */}
          {screenState.activeView === 'home' && (
            <div className="p-4 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* CarPlay Tile */}
                <button
                  onClick={() =>
                    isCarPlayUnlocked &&
                    setScreenState((prev) => ({ ...prev, activeView: 'carplay' }))
                  }
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between h-40 ${
                    isCarPlayUnlocked
                      ? 'bg-gradient-to-br from-blue-900/60 via-indigo-900/40 to-slate-900 border-blue-500/50 hover:border-blue-400 shadow-lg'
                      : 'bg-slate-950 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Smartphone className="w-6 h-6 text-blue-400" />
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        isCarPlayUnlocked
                          ? isFullscreenUnlocked
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-blue-500/20 text-blue-300'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isCarPlayUnlocked
                        ? isFullscreenUnlocked
                          ? 'FULLSCREEN'
                          : 'SPLITSCREEN'
                        : 'LOCKED'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-100">Apple CarPlay</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {isCarPlayUnlocked
                        ? 'Tap to open Maps & Spotify'
                        : 'Requires FSC 00E5 Enabler'}
                    </p>
                  </div>
                </button>

                {/* Video in Motion Tile */}
                <button
                  onClick={() =>
                    setScreenState((prev) => ({ ...prev, activeView: 'vim_player' }))
                  }
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between h-40 ${
                    isVimUnlocked
                      ? 'bg-gradient-to-br from-purple-900/60 to-slate-900 border-purple-500/50 hover:border-purple-400'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Film className="w-6 h-6 text-purple-400" />
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        isVimUnlocked
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {isVimUnlocked ? 'VIM UNLOCKED' : 'LOCKED (0 km/h)'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-100">Media & VIM Video</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      USB Movie Player / Screen Mirroring
                    </p>
                  </div>
                </button>

                {/* M Sport Gauges Tile */}
                <button
                  onClick={() =>
                    setScreenState((prev) => ({ ...prev, activeView: 'sport_gauges' }))
                  }
                  className="p-4 rounded-2xl border text-left transition flex flex-col justify-between h-40 bg-gradient-to-br from-red-950/40 to-slate-900 border-red-800/40 hover:border-red-500/60"
                >
                  <div className="flex items-center justify-between">
                    <Gauge className="w-6 h-6 text-red-500" />
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-red-500/20 text-red-300 rounded">
                      M SPORT
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-100">M Sport Displays</h4>
                    <p className="text-xs text-slate-400 mt-1">HP Power & Torque Telemetry</p>
                  </div>
                </button>

                {/* Navigation Tile */}
                <button
                  onClick={() =>
                    setScreenState((prev) => ({ ...prev, activeView: 'navigation' }))
                  }
                  className="p-4 rounded-2xl border text-left transition flex flex-col justify-between h-40 bg-gradient-to-br from-emerald-950/40 to-slate-900 border-emerald-800/40 hover:border-emerald-500/60"
                >
                  <div className="flex items-center justify-between">
                    <MapPin className="w-6 h-6 text-emerald-400" />
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">
                      2026 MAPS
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-100">Navigation EVO</h4>
                    <p className="text-xs text-slate-400 mt-1">3D City Models & Traffic</p>
                  </div>
                </button>

              </div>
            </div>
          )}

          {/* VIEW 2: APPLE CARPLAY SIMULATION */}
          {screenState.activeView === 'carplay' && (
            <div className="relative w-full h-full min-h-[380px] bg-slate-950 flex flex-col justify-between p-4">
              {/* CarPlay Aspect Ratio Container */}
              <div
                className={`w-full h-full rounded-2xl border border-slate-800 bg-black overflow-hidden flex transition-all duration-500 ${
                  isFullscreenUnlocked ? 'p-0' : 'max-w-3xl mx-auto border-r-4 border-r-slate-800'
                }`}
              >
                {/* Left Dock Bar */}
                <div className="w-14 bg-slate-900/90 border-r border-slate-800 flex flex-col items-center justify-between py-4">
                  <div className="space-y-4">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                      <Music className="w-4 h-4" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white">
                      <Settings className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="w-6 h-6 rounded-full border-2 border-slate-400 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                  </div>
                </div>

                {/* CarPlay Maps & Widgets Area */}
                <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/40">
                  <div className="md:col-span-2 bg-slate-900 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                      <span>Apple Maps 3D</span>
                      <span className="text-blue-400 font-mono">GPS Active</span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-lg font-bold text-slate-100">In 500 ft, Turn Right</p>
                      <p className="text-xs text-slate-400"> onto BMW Welt Allee</p>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-slate-300">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded font-mono">18 min</span>
                      <span>12.4 mi • 1:03 PM arrival</span>
                    </div>
                  </div>

                  {/* Right Music & Siri Widget */}
                  <div className="space-y-4">
                    <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                          <Music className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-100">Blinding Lights</p>
                          <p className="text-[11px] text-slate-400">The Weeknd • Spotify</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-2xl p-3 border border-blue-500/30 flex items-center space-x-2 text-xs">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-spin" />
                      <span className="text-slate-200 font-mono">Siri Eyes Free Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {!isFullscreenUnlocked && (
                <div className="absolute top-4 right-4 bg-amber-950/90 border border-amber-500/50 p-2 rounded-xl text-amber-300 text-xs font-mono">
                  Split-Screen Active (Unlock FSC 0143 for Fullscreen)
                </div>
              )}
            </div>
          )}

          {/* VIEW 3: VIDEO IN MOTION PLAYER */}
          {screenState.activeView === 'vim_player' && (
            <div className="p-6 bg-slate-950 flex flex-col justify-between min-h-[380px] relative">
              {isVideoLockedBySpeed ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-3 bg-rose-950/40 border border-rose-500/40 rounded-2xl p-6 text-center">
                  <ShieldCheck className="w-12 h-12 text-rose-500 animate-bounce" />
                  <h3 className="font-bold text-base text-rose-200">Video Locked For Driving Safety</h3>
                  <p className="text-xs text-rose-300 max-w-md">
                    Speed lock engaged ({screenState.vehicleSpeed} km/h &gt; 3 km/h). Video playback disabled by OEM factory safety parameter.
                  </p>
                  <p className="text-xs font-mono text-emerald-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                    💡 Solution: Inject "Video in Motion (VIM)" feature to unlock video at any speed!
                  </p>
                </div>
              ) : (
                <div className="flex-1 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 border border-purple-500/30 p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/40 font-bold">
                      1080p USB Movie / VIM UNLOCKED
                    </span>
                    <span className="text-emerald-400">Driving Speed: {screenState.vehicleSpeed} km/h</span>
                  </div>

                  <div className="text-center space-y-2 my-8">
                    <div className="inline-flex p-4 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/50 shadow-xl">
                      <Film className="w-10 h-10 animate-pulse" />
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-100">BMW M Power Cinematic Trailer</h3>
                    <p className="text-xs text-slate-400">Continuous playback active while driving</p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800 pt-3">
                    <span>02:14 / 04:30</span>
                    <span>1080p 60fps Surround Sound</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 4: M SPORT TELEMETRY GAUGES */}
          {screenState.activeView === 'sport_gauges' && (
            <div className="p-6 bg-slate-950 min-h-[380px] flex items-center justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
                
                {/* Horsepower Gauge */}
                <div className="bg-slate-900 p-5 rounded-2xl border border-red-900/50 text-center space-y-3 relative overflow-hidden">
                  <span className="text-xs font-mono text-slate-400 uppercase font-bold">POWER OUTPUT</span>
                  <div className="relative flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-4 border-slate-800 border-t-red-500 border-r-red-500 flex items-center justify-center">
                      <span className="text-2xl font-extrabold font-mono text-slate-100">450</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-red-400 font-bold block">HP (Horsepower)</span>
                </div>

                {/* Torque Gauge */}
                <div className="bg-slate-900 p-5 rounded-2xl border border-blue-900/50 text-center space-y-3 relative overflow-hidden">
                  <span className="text-xs font-mono text-slate-400 uppercase font-bold">TORQUE OUTPUT</span>
                  <div className="relative flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-4 border-slate-800 border-t-blue-500 border-r-blue-500 flex items-center justify-center">
                      <span className="text-2xl font-extrabold font-mono text-slate-100">550</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-blue-400 font-bold block">Nm (Newton Meters)</span>
                </div>

              </div>
            </div>
          )}

          {/* VIEW 5: NAVIGATION MAPS */}
          {screenState.activeView === 'navigation' && (
            <div className="p-6 bg-slate-950 min-h-[380px] flex flex-col justify-between">
              <div className="bg-slate-900 p-5 rounded-2xl border border-emerald-800/50 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-slate-100 text-sm">Road Map EVO North America 2026-1</h3>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/20 px-2.5 py-0.5 rounded">
                    LIFETIME FSC APPROVED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono text-slate-300">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">3D LANDMARKS</span>
                    <span className="text-emerald-400 font-bold">Active</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">RTTI TRAFFIC</span>
                    <span className="text-emerald-400 font-bold">Connected</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom View Switcher Bar */}
          <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-1 overflow-x-auto">
              {[
                { id: 'home', label: 'Main iDrive Menu' },
                { id: 'carplay', label: 'CarPlay Screen' },
                { id: 'vim_player', label: 'Video in Motion' },
                { id: 'sport_gauges', label: 'M Gauges' },
                { id: 'navigation', label: '3D Maps' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setScreenState((prev) => ({ ...prev, activeView: tab.id as any }))}
                  className={`px-3 py-1 rounded-lg transition ${
                    screenState.activeView === tab.id
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setScreenState((prev) => ({ ...prev, activeView: 'home' }))}
              className="text-slate-400 hover:text-slate-200"
            >
              Back to Main
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
