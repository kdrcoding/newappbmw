import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  Key, 
  Code2, 
  Database, 
  Sparkles,
  Lock,
  RefreshCw,
  FileCode,
  UploadCloud,
  Archive,
  FileSpreadsheet
} from 'lucide-react';
import { VehicleData, FSCPackageInfo } from '../types';

interface FSCGeneratorPanelProps {
  vehicle: VehicleData;
}

export const FSCGeneratorPanel: React.FC<FSCGeneratorPanelProps> = ({ vehicle }) => {
  const [vinInput, setVinInput] = useState(vehicle.vin);
  const [selectedFeatureCode, setSelectedFeatureCode] = useState('00E5');
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [importedFileInfo, setImportedFileInfo] = useState<any>(null);
  const [builtFiles, setBuiltFiles] = useState<any[]>([]);

  const [generatedPackage, setGeneratedPackage] = useState<FSCPackageInfo | null>({
    vin: vehicle.vin,
    featureCode: '00E5',
    featureName: 'Apple CarPlay Wireless Activation',
    appId: '0x00E5',
    upgradeIndex: '0x0001',
    creationDate: new Date().toISOString().split('T')[0],
    hexPayload: `010000E50001${Array.from(new TextEncoder().encode(vehicle.vin)).map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase()}F4A2C8900E1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF123456`,
    base64Cert: 'AQAADlA1WEEzM0FZMDIwRlA5ODIxNEY0QTJDODkwRTEyMzQ1Njc4OTBBQkNERUY=',
    signature: 'A3F80911BC42E3D80011FF998877665544332211AABBCCDDEEFF00998877665544332211',
    fileContent: `[BMW_FSC_ACTIVATION_CERTIFICATE]\nVIN=${vehicle.vin}\nAPP_ID=0x00E5\nUPGRADE_INDEX=0x0001\nFEATURE_CODE=00E5\nFEATURE_NAME=Apple CarPlay Wireless Activation\nSIGNATURE_TYPE=RSA_2048_SHA256\nSTATUS=VALIDATED`,
  });

  const handleGenerateFSC = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/fsc/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vin: vinInput,
          featureCode: selectedFeatureCode,
          appId: `0x${selectedFeatureCode}`,
          upgradeIndex: '0x0001',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedPackage(data.package);
      }
    } catch (err) {
      console.error('Failed to generate FSC:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      try {
        const res = await fetch('/api/files/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, rawText: content }),
        });
        const data = await res.json();
        if (data.success) {
          setImportedFileInfo(data.parsed);
          setVinInput(data.parsed.vin);
          if (data.parsed.featureCodes.length > 0) {
            setSelectedFeatureCode(data.parsed.featureCodes[0]);
          }
        }
      } catch (err) {
        console.error('Failed to parse uploaded file:', err);
      }
    };
    reader.readAsText(file);
  };

  const handleBuildUSBInstaller = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/installer/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vin: vinInput,
          selectedFeatures: [selectedFeatureCode, '0143'],
          targetPlatform: 'USB_FAT32',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBuiltFiles(data.files);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSingleFile = (fileName: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopyPayload = () => {
    if (generatedPackage) {
      navigator.clipboard.writeText(generatedPackage.hexPayload);
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    }
  };

  const handleDownloadFSCFile = () => {
    if (!generatedPackage) return;
    const element = document.createElement('a');
    const file = new Blob([generatedPackage.fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `FSC_${generatedPackage.vin}_${generatedPackage.featureCode}.fsc`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Cryptographic FSC Package Generator</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Build and inspect VIN-specific 256-bit and 512-bit FSC activation certificate files, AppID upgrade indices, and RSA-2048 signatures for iDrive headunit flashing.
          </p>
        </div>

        <button
          onClick={handleDownloadFSCFile}
          disabled={!generatedPackage}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-blue-900/30 flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export .FSC File</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Input Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 lg:col-span-1">
          <h3 className="font-bold text-sm text-slate-200 border-b border-slate-800 pb-3">
            Certificate Generation Parameters
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Target Vehicle VIN (17 Digits)</label>
              <input
                type="text"
                value={vinInput}
                onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                maxLength={17}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono text-xs focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">FSC Feature Code</label>
              <select
                value={selectedFeatureCode}
                onChange={(e) => setSelectedFeatureCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs outline-none"
              >
                <option value="00E5">00E5 - Apple CarPlay Wireless Enabler</option>
                <option value="0143">0143 - Apple CarPlay Fullscreen Patch</option>
                <option value="00F0">00F0 - Road Map EVO Lifetime Navigation</option>
                <option value="009C">009C - BMW Apps & ConnectedDrive Services</option>
                <option value="00A0">00A0 - Siri Eyes Free & Speech Recognition</option>
                <option value="0063">0063 - M Laptimer & Telemetry Gauges</option>
                <option value="00E1">00E1 - Speed Limit Info (SLI) KAFAS</option>
                <option value="006F">006F - SiriusXM Satellite Radio</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Upgrade Index</label>
              <input
                type="text"
                value="0x0001"
                readOnly
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 font-mono text-xs outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Root Certificate Authority</label>
              <input
                type="text"
                value="BMW_AG_FSC_CA_ROOT_2 (RSA-2048)"
                readOnly
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 font-mono text-xs outline-none cursor-not-allowed"
              />
            </div>

            {/* File Upload Parser Box */}
            <div className="pt-2 border-t border-slate-800">
              <label className="block text-slate-400 font-medium mb-1.5">Import Local FSC / NCD / BIN File</label>
              <label className="flex flex-col items-center justify-center p-4 bg-slate-950 border-2 border-dashed border-slate-800 hover:border-blue-500 rounded-xl cursor-pointer transition text-center group">
                <UploadCloud className="w-6 h-6 text-slate-500 group-hover:text-blue-400 mb-1" />
                <span className="text-xs text-slate-300 font-medium">Click or Drag & Drop File</span>
                <span className="text-[10px] text-slate-500 font-mono">Supports .fsc, .bin, .ncd, .xml</span>
                <input
                  type="file"
                  accept=".fsc,.bin,.ncd,.xml,.txt,.hex"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {importedFileInfo && (
              <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl space-y-1 font-mono text-[11px]">
                <div className="flex items-center justify-between text-blue-300 font-bold">
                  <span>Imported: {importedFileInfo.fileName}</span>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-slate-300">Extracted VIN: {importedFileInfo.vin}</p>
                <p className="text-slate-400 text-[10px]">RSA-2048 Issuer: {importedFileInfo.issuer}</p>
              </div>
            )}

            <button
              onClick={handleGenerateFSC}
              disabled={isGenerating}
              className="w-full mt-2 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg flex items-center justify-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Compiling FSC Cert...' : 'Compile FSC Package'}</span>
            </button>
          </div>
        </div>

        {/* Right Column (2 cols): Certificate Hex Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-slate-200">Binary FSC Certificate Structure</h3>
            </div>
            {generatedPackage && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBuildUSBInstaller}
                  className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-xs font-mono font-bold transition flex items-center space-x-1"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Build USB FAT32 Bundle</span>
                </button>
                <button
                  onClick={handleCopyPayload}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition flex items-center space-x-1"
                >
                  {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copiedPayload ? 'Copied Hex' : 'Copy Hex Payload'}</span>
                </button>
              </div>
            )}
          </div>

          {builtFiles.length > 0 && (
            <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs font-mono">
                <Archive className="w-4 h-4" />
                <span>Generated USB FAT32 & ENET Runnable Flasher Package (VIN: {vinInput})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {builtFiles.map((bf) => (
                  <div key={bf.name} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-200 text-xs">{bf.name}</p>
                      <p className="text-[10px] text-slate-500">{bf.type}</p>
                    </div>
                    <button
                      onClick={() => handleDownloadSingleFile(bf.name, bf.content)}
                      className="px-2 py-1 bg-blue-600/80 hover:bg-blue-600 text-white rounded text-[10px] transition flex items-center space-x-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {generatedPackage ? (
            <div className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">APP ID</span>
                  <span className="text-amber-300 font-bold">{generatedPackage.appId}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">FEATURE CODE</span>
                  <span className="text-blue-300 font-bold">{generatedPackage.featureCode}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">VIN BOUND</span>
                  <span className="text-emerald-300 font-bold">{generatedPackage.vin}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">KEY SIZE</span>
                  <span className="text-purple-300 font-bold">RSA 2048</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Raw Hexadecimal Payload</label>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-emerald-300 break-all text-[11px] leading-relaxed max-h-24 overflow-y-auto">
                  {generatedPackage.hexPayload}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Base64 Certificate Envelope</label>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-blue-300 break-all text-[11px]">
                  {generatedPackage.base64Cert}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">RSA Cryptographic Digital Signature</label>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-purple-300 break-all text-[11px]">
                  {generatedPackage.signature}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Click "Compile FSC Package" to generate certificate payload.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
