import React, { useState } from 'react';
import { 
  Wifi, 
  Cpu, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  Server, 
  Radio, 
  Cable, 
  Sparkles,
  Database,
  Trash2,
  Lock,
  Download,
  Search
} from 'lucide-react';
import { VehicleData, ConnectionStatus, FSCStatusItem, DiagnosticDTC } from '../types';
import { SAMPLE_VEHICLES } from '../data/sampleVehicles';

interface ENETConnectPanelProps {
  vehicle: VehicleData;
  setVehicle: React.Dispatch<React.SetStateAction<VehicleData>>;
  connectionStatus: ConnectionStatus;
  setConnectionStatus: React.Dispatch<React.SetStateAction<ConnectionStatus>>;
  onConnectScan: () => void;
  fscStoreList: FSCStatusItem[];
  dtcList: DiagnosticDTC[];
  onClearDTCs: () => void;
  onOpenAIAssistant: () => void;
}

export const ENETConnectPanel: React.FC<ENETConnectPanelProps> = ({
  vehicle,
  setVehicle,
  connectionStatus,
  setConnectionStatus,
  onConnectScan,
  fscStoreList,
  dtcList,
  onClearDTCs,
  onOpenAIAssistant,
}) => {
  const [ipInput, setIpInput] = useState(vehicle.ipAddress);
  const [interfaceType, setInterfaceType] = useState<VehicleData['interfaceType']>(vehicle.interfaceType);
  const [pingLatency, setPingLatency] = useState<number | null>(4);
  const [isPinging, setIsPinging] = useState(false);

  const handlePingTest = () => {
    setIsPinging(true);
    setTimeout(() => {
      setPingLatency(Math.floor(Math.random() * 8) + 3);
      setIsPinging(false);
    }, 600);
  };

  const handleSubnetDiscovery = async () => {
    setIsPinging(true);
    try {
      const res = await fetch('/api/enet/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subnet: ipInput.split('.').slice(0, 3).join('.'), adapterIp: '169.254.199.1' }),
      });
      const data = await res.json();
      if (data.success && data.discoveredDevices.length > 0) {
        const found = data.discoveredDevices[0];
        setVehicle((prev) => ({
          ...prev,
          ipAddress: found.ip,
          vin: found.vin,
          headunitName: found.headunit,
          iStepCurrent: found.iStep,
        }));
        setIpInput(found.ip);
        setPingLatency(found.latencyMs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPinging(false);
    }
  };

  const handlePresetSelect = (v: VehicleData) => {
    setVehicle(v);
    setIpInput(v.ipAddress);
    setInterfaceType(v.interfaceType);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome / Guidance Alert */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-800/40 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Cable className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold text-slate-100">BMW OBD-II ENET Interface & DoIP Communication</h2>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl">
              Connect via an OBD-II Ethernet (ENET) cable or WiFi ENET adapter to establish a direct DoIP (ISO 13400) diagnostic link on Port 13400. Reads VIN, headunit hardware SWFL, and FSC certificate store status.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onConnectScan}
              disabled={connectionStatus === 'connecting'}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs transition shadow-lg shadow-blue-900/40 flex items-center space-x-2 border border-blue-400/30"
            >
              <RefreshCw className={`w-4 h-4 ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`} />
              <span>{connectionStatus === 'connecting' ? 'Scanning DoIP...' : 'Connect & Scan Headunit'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: ENET Configuration & Presets */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Adapter Config Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Server className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm text-slate-200">Interface Settings</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-slate-400 rounded">
                DoIP Port 13400
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Interface Type Selector */}
              <div>
                <label className="block text-slate-400 font-medium mb-1">Hardware Interface</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'enet_cable', label: 'ENET Cable', icon: Cable },
                    { id: 'enet_wifi', label: 'ENET WiFi', icon: Wifi },
                    { id: 'enet_modem', label: 'USB-C DoIP', icon: Radio },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSel = interfaceType === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setInterfaceType(item.id as any);
                          setVehicle((prev) => ({ ...prev, interfaceType: item.id as any }));
                        }}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition ${
                          isSel
                            ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[11px]">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* IP Input */}
              <div>
                <label className="block text-slate-400 font-medium mb-1">Headunit DoIP IP Address</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={ipInput}
                    onChange={(e) => {
                      setIpInput(e.target.value);
                      setVehicle((prev) => ({ ...prev, ipAddress: e.target.value }));
                    }}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="169.254.199.100"
                  />
                  <button
                    onClick={handlePingTest}
                    disabled={isPinging}
                    className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs transition flex items-center space-x-1 font-mono"
                    title="Ping single IP address"
                  >
                    <Activity className={`w-3.5 h-3.5 text-emerald-400 ${isPinging ? 'animate-spin' : ''}`} />
                    <span>Ping</span>
                  </button>
                  <button
                    onClick={handleSubnetDiscovery}
                    disabled={isPinging}
                    className="px-2.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs transition flex items-center space-x-1 font-mono font-bold"
                    title="Scan subnet for active ENET DoIP adapter"
                  >
                    <Search className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
                    <span>Scan Subnet</span>
                  </button>
                </div>
                {pingLatency !== null && (
                  <p className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Response: {pingLatency} ms (DoIP ACK 0x02FD)</span>
                  </p>
                )}
              </div>

              {/* ECU Address */}
              <div>
                <label className="block text-slate-400 font-medium mb-1">Target ECU Address</label>
                <select
                  value={vehicle.ecuAddress}
                  onChange={(e) => setVehicle((prev) => ({ ...prev, ecuAddress: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs outline-none"
                >
                  <option value="0x63 (HU_NBT2)">0x63 - HU_NBT / HU_NBT2 / HU_MGU (Head Unit)</option>
                  <option value="0x63 (HU_ENTRYNAV2)">0x63 - HU_ENTRYNAV2 (EntryNav2 Way / Route)</option>
                  <option value="0x60 (KOMBI)">0x60 - KOMBI (Instrument Cluster)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Vehicle Profile Presets */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="font-bold text-sm text-slate-200">Vehicle Profile Presets</h3>
            <p className="text-xs text-slate-400">
              Select a pre-configured BMW profile for instant offline testing or simulation.
            </p>

            <div className="space-y-2">
              {SAMPLE_VEHICLES.map((v) => {
                const isCurrent = vehicle.vin === v.vin;
                return (
                  <button
                    key={v.vin}
                    onClick={() => handlePresetSelect(v)}
                    className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                      isCurrent
                        ? 'bg-blue-900/30 border-blue-500/60 text-blue-200'
                        : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs text-slate-100">{v.model}</p>
                      <p className="text-[11px] font-mono text-slate-400">{v.vin} • {v.headunitName}</p>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded-full">
                        ACTIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (2 cols): ECU Live Information & FSC Store Status */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* ECU Live Status Dashboard Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-slate-200">ECU Hardware & iStep Diagnostics</h3>
              </div>
              <div className="flex items-center space-x-2 font-mono text-xs text-slate-400">
                <span>Power:</span>
                <span className="text-emerald-400 font-bold">{vehicle.voltage.toFixed(1)}V</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">Vehicle VIN</span>
                <span className="font-bold text-amber-300 text-xs">{vehicle.vin}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">Headunit Hardware</span>
                <span className="font-bold text-blue-300 text-xs">{vehicle.headunitName}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">Current iStep Shipment</span>
                <span className="font-bold text-emerald-300 text-xs">{vehicle.iStepCurrent}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase block">Target iStep Version</span>
                <span className="font-bold text-purple-300 text-xs">{vehicle.iStepTarget}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs pt-1">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">ECU Target Address:</span>
                <span className="text-slate-200">{vehicle.ecuAddress}</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Wi-Fi Antenna MAC:</span>
                <span className="text-slate-200">{vehicle.wifiMac}</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">DoIP Socket:</span>
                <span className="text-emerald-400">Connected</span>
              </div>
            </div>
          </div>

          {/* FSC Certificate Store Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm text-slate-200">FSC Certificate Store Status</h3>
              </div>
              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                  {fscStoreList.filter((f) => f.status.includes('Approved')).length} Approved
                </span>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                  {fscStoreList.filter((f) => f.status.includes('Loaded')).length} Loaded
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="py-2 px-3">App ID</th>
                    <th className="py-2 px-3">Feature Name</th>
                    <th className="py-2 px-3">Store Status</th>
                    <th className="py-2 px-3">Validation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {fscStoreList.map((item, index) => {
                    const isApproved = item.status.includes('Approved');
                    const isLoaded = item.status.includes('Loaded');
                    const isCancelled = item.status.includes('Cancelled');

                    return (
                      <tr key={index} className="hover:bg-slate-800/40 transition">
                        <td className="py-2.5 px-3 font-bold text-blue-300">{item.appId}</td>
                        <td className="py-2.5 px-3 text-slate-200">{item.name}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                              isApproved
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                : isLoaded
                                ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                : isCancelled
                                ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            <span>{item.status}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          {item.valid ? (
                            <span className="text-emerald-400 flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Valid RSA-2048</span>
                            </span>
                          ) : (
                            <span className="text-rose-400 flex items-center space-x-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Missing Cert</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stored Diagnostic Faults (DTCs) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-slate-200">Headunit Stored Diagnostic Fault Codes (DTCs)</h3>
              </div>
              <button
                onClick={onClearDTCs}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs transition flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Clear DTC Faults</span>
              </button>
            </div>

            {dtcList.length === 0 ? (
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No stored diagnostic fault codes found on ECU HU_NBT2. System healthy.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {dtcList.map((dtc) => (
                  <div key={dtc.code} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between font-mono text-xs">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-amber-400">{dtc.code}</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded">{dtc.ecu}</span>
                      </div>
                      <p className="text-slate-300 text-xs mt-0.5">{dtc.description}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {dtc.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
