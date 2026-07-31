import React, { useState } from 'react';
import { Header } from './components/Header';
import { ENETConnectPanel } from './components/ENETConnectPanel';
import { FeatureInstallerPanel } from './components/FeatureInstallerPanel';
import { FlashingProgressModal } from './components/FlashingProgressModal';
import { IDriveSimulator } from './components/IDriveSimulator';
import { FSCGeneratorPanel } from './components/FSCGeneratorPanel';
import { FDLParametersEditor } from './components/FDLParametersEditor';
import { AIAssistantModal } from './components/AIAssistantModal';
import { DoIPTerminalLog } from './components/DoIPTerminalLog';

import { VehicleData, ConnectionStatus, FSCFeature, FSCStatusItem, DiagnosticDTC, IDriveScreenState } from './types';
import { SAMPLE_VEHICLES } from './data/sampleVehicles';
import { INITIAL_BMW_FEATURES } from './data/featuresData';

export default function App() {
  const [vehicle, setVehicle] = useState<VehicleData>(SAMPLE_VEHICLES[0]);
  const [features, setFeatures] = useState<FSCFeature[]>(INITIAL_BMW_FEATURES);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');
  const [activeTab, setActiveTab] = useState<string>('features');

  const [fscStoreList, setFscStoreList] = useState<FSCStatusItem[]>([
    { appId: '009C', name: 'BMW Apps & ConnectedDrive', status: 'Approved (02)', valid: true, featureCode: '009C' },
    { appId: '009E', name: 'iDrive Voice Control', status: 'Approved (02)', valid: true, featureCode: '009E' },
    { appId: '00A0', name: 'Siri Eyes Free & Speech', status: 'Approved (02)', valid: true, featureCode: '00A0' },
    { appId: '00E5', name: 'Apple CarPlay Enabler', status: 'Loaded (01)', valid: false, featureCode: '00E5' },
    { appId: '00F0', name: 'ID6 Navigation Map North America', status: 'Approved (02)', valid: true, featureCode: '00F0' },
    { appId: '0143', name: 'Apple CarPlay Fullscreen Patch', status: 'Not Loaded (00)', valid: false, featureCode: '0143' },
    { appId: '006F', name: 'SiriusXM Satellite Radio', status: 'Loaded (01)', valid: false, featureCode: '006F' },
    { appId: '0063', name: 'M Laptimer & Telemetry', status: 'Not Loaded (00)', valid: false, featureCode: '0063' },
  ]);

  const [dtcList, setDtcList] = useState<DiagnosticDTC[]>([
    { code: 'B7F8C0', ecu: 'HU_NBT2', description: 'HU_NBT2: Microphone line 2 open circuit', severity: 'low', status: 'Passive' },
    { code: 'B7F805', ecu: 'HU_NBT2', description: 'HU_NBT2: WLAN antenna missing or reduced range', severity: 'medium', status: 'Stored' },
  ]);

  const [screenState, setScreenState] = useState<IDriveScreenState>({
    activeView: 'home',
    carPlayMode: 'fullscreen',
    isCarPlayUnlocked: false,
    isVimUnlocked: false,
    isAndroidAutoUnlocked: false,
    isMLaptimerUnlocked: false,
    isMap3DUnlocked: false,
    isSliUnlocked: false,
    vehicleSpeed: 0,
  });

  const [showFlashingModal, setShowFlashingModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [flashingFeatures, setFlashingFeatures] = useState<FSCFeature[]>([]);

  // Scan ECU over DoIP Port 13400
  const handleAutoScan = () => {
    setConnectionStatus('connecting');
    setTimeout(() => {
      setConnectionStatus('connected');
      // Randomize voltage slightly
      setVehicle((prev) => ({ ...prev, voltage: 13.8 + Math.random() * 0.4 }));
    }, 1200);
  };

  // Start FSC Injection & Coding
  const handleStartFlashing = (selected: FSCFeature[]) => {
    setFlashingFeatures(selected);
    setShowFlashingModal(true);
  };

  // Complete Flashing callback
  const handleCompleteFlashing = (unlockedIds: string[]) => {
    setFeatures((prev) =>
      prev.map((f) => (unlockedIds.includes(f.id) ? { ...f, isUnlocked: true } : f))
    );

    // Update FSC store list items to Approved
    setFscStoreList((prev) =>
      prev.map((item) => {
        const feat = features.find((f) => f.featureCode === item.featureCode);
        if (feat && unlockedIds.includes(feat.id)) {
          return { ...item, status: 'Approved (02)', valid: true };
        }
        return item;
      })
    );
  };

  // Export OEM Backup
  const handleDownloadOEMBackup = () => {
    const backupData = `[BMW_OEM_FSC_BACKUP_ARCHIVE]\nVIN=${vehicle.vin}\nHEADUNIT=${vehicle.headunitName}\nISTEP=${vehicle.iStepCurrent}\nDATE=${new Date().toISOString()}\n\n[STORE_CERTIFICATES]\n${fscStoreList.map((f) => `${f.appId}=${f.status}`).join('\n')}`;
    const blob = new Blob([backupData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OEM_FSC_BACKUP_${vehicle.vin}.fscpack`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Restore Factory OEM State
  const handleRestoreFactoryOEM = () => {
    if (window.confirm('Are you sure you want to restore factory OEM FSC state? Custom injected FSCs will be removed.')) {
      setFeatures((prev) => prev.map((f) => ({ ...f, isUnlocked: false })));
      setFscStoreList((prev) =>
        prev.map((f) =>
          f.featureCode === '00E5' || f.featureCode === '0143'
            ? { ...f, status: 'Loaded (01)', valid: false }
            : f
        )
      );
    }
  };

  const unlockedCount = features.filter((f) => f.isUnlocked).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white pb-24">
      {/* Header Navigation */}
      <Header
        vehicle={vehicle}
        connectionStatus={connectionStatus}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAutoScan={handleAutoScan}
        onOpenAIAssistant={() => setShowAIAssistant(true)}
        onToggleTerminal={() => setShowTerminal(!showTerminal)}
        showTerminal={showTerminal}
        unlockedCount={unlockedCount}
        totalFeaturesCount={features.length}
      />

      {/* Main Content View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'features' && (
          <FeatureInstallerPanel
            features={features}
            setFeatures={setFeatures}
            vehicle={vehicle}
            onStartFlashing={handleStartFlashing}
            onDownloadOEMBackup={handleDownloadOEMBackup}
            onRestoreFactoryOEM={handleRestoreFactoryOEM}
          />
        )}

        {activeTab === 'connection' && (
          <ENETConnectPanel
            vehicle={vehicle}
            setVehicle={setVehicle}
            connectionStatus={connectionStatus}
            setConnectionStatus={setConnectionStatus}
            onConnectScan={handleAutoScan}
            fscStoreList={fscStoreList}
            dtcList={dtcList}
            onClearDTCs={() => setDtcList([])}
            onOpenAIAssistant={() => setShowAIAssistant(true)}
          />
        )}

        {activeTab === 'simulator' && (
          <IDriveSimulator
            screenState={screenState}
            setScreenState={setScreenState}
            features={features}
          />
        )}

        {activeTab === 'fsc_manager' && (
          <FSCGeneratorPanel vehicle={vehicle} />
        )}

        {activeTab === 'fdl_editor' && (
          <FDLParametersEditor vehicle={vehicle} />
        )}
      </main>

      {/* Flashing Progress Execution Modal */}
      <FlashingProgressModal
        isOpen={showFlashingModal}
        onClose={() => setShowFlashingModal(false)}
        selectedFeatures={flashingFeatures}
        vehicle={vehicle}
        onCompleteFlashing={handleCompleteFlashing}
      />

      {/* Gemini AI BMW Diagnostics Advisor Modal */}
      <AIAssistantModal
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        vehicle={vehicle}
      />

      {/* OBD-II DoIP Port 13400 Terminal Log Console */}
      <DoIPTerminalLog
        show={showTerminal}
        onClose={() => setShowTerminal(false)}
      />
    </div>
  );
}
