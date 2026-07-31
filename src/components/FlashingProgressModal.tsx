import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  Cpu, 
  RotateCcw,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { FSCFeature, VehicleData, FlashingProgressStep } from '../types';

interface FlashingProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFeatures: FSCFeature[];
  vehicle: VehicleData;
  onCompleteFlashing: (unlockedIds: string[]) => void;
}

export const FlashingProgressModal: React.FC<FlashingProgressModalProps> = ({
  isOpen,
  onClose,
  selectedFeatures,
  vehicle,
  onCompleteFlashing,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [hexLogs, setHexLogs] = useState<string[]>([]);

  const [steps, setSteps] = useState<FlashingProgressStep[]>([
    {
      stepNumber: 1,
      title: 'DoIP ISO 13400 Handshake & UDS Extended Session',
      status: 'pending',
      details: 'Sending UDS Diagnostic Session Control (0x10 0x03) to ECU 0x63 (HU_NBT2)...',
      progressPercent: 12,
    },
    {
      stepNumber: 2,
      title: 'Security Access Seed & Key Challenge',
      status: 'pending',
      details: 'Requesting Seed (0x27 0x01) -> Computing RSA-2048 Seed-Key Response (0x27 0x02)...',
      progressPercent: 28,
    },
    {
      stepNumber: 3,
      title: 'Export OEM FSC Backup Archive',
      status: 'pending',
      details: 'Creating restore point and backing up OEM 009C, 009E, 00A0 certificate store to local flash memory...',
      progressPercent: 42,
    },
    {
      stepNumber: 4,
      title: 'Patch Memory Buffer & SWFL Security Bypass',
      status: 'pending',
      details: 'Patching NBTevo ID6 memory kernel buffer for custom FSC acceptance (RoutineControl 0x31 0x01)...',
      progressPercent: 58,
    },
    {
      stepNumber: 5,
      title: 'Inject FSC Feature Activation Certificates',
      status: 'pending',
      details: `Injecting FSC payload certificates for: ${selectedFeatures.map(f => f.featureCode).join(', ')}...`,
      progressPercent: 74,
    },
    {
      stepNumber: 6,
      title: 'Write FDL NCD Coding Parameters',
      status: 'pending',
      details: 'Writing NCD parameters (CARPLAY_MODE=aktiv, CARPLAY_FULLSCREEN=aktiv, SPEEDLOCK=FF)...',
      progressPercent: 88,
    },
    {
      stepNumber: 7,
      title: 'Reboot iDrive Headunit & Re-verify FSC Store',
      status: 'pending',
      details: 'Sending ECU Reset Command (0x11 0x01 Hard Reset). Re-reading FSC Store Status (Approved 02)...',
      progressPercent: 100,
    },
  ]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setOverallProgress(0);
      setIsCompleted(false);
      setIsFailed(false);
      setHexLogs([]);
      return;
    }

    let interval: NodeJS.Timeout;
    let localStep = 0;

    const runStepAnimation = () => {
      interval = setInterval(() => {
        if (localStep < steps.length) {
          // Update steps status
          setSteps((prev) =>
            prev.map((s, idx) => {
              if (idx === localStep) return { ...s, status: 'active' };
              if (idx < localStep) return { ...s, status: 'completed' };
              return s;
            })
          );

          setCurrentStepIndex(localStep);
          setOverallProgress(steps[localStep].progressPercent);

          // Append simulated hex transaction logs
          const hexLogLine = `[TX DoIP 13400] 02 FD 80 01 00 00 00 08 0x63 0x0${localStep + 1} 0x10 0x03 [ACK 0x50 0x03 OK]`;
          setHexLogs((prev) => [...prev, hexLogLine]);

          localStep++;
        } else {
          clearInterval(interval);
          setSteps((prev) => prev.map((s) => ({ ...s, status: 'completed' })));
          setOverallProgress(100);
          setIsCompleted(true);
          onCompleteFlashing(selectedFeatures.map((f) => f.id));
        }
      }, 1200);
    };

    runStepAnimation();

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600/20 border border-blue-500/40 rounded-xl text-blue-400">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                {isCompleted ? 'FSC Injection & Coding Completed!' : 'Injecting FSC Certificates & Coding ECU...'}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Target: {vehicle.headunitName} (VIN: {vehicle.vin})
              </p>
            </div>
          </div>

          <span className="font-mono text-sm font-extrabold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-xl border border-blue-500/20">
            {overallProgress}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-md shadow-blue-500/50"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>Features: {selectedFeatures.map((f) => f.featureCode).join(', ')}</span>
            <span>Step {Math.min(currentStepIndex + 1, steps.length)} / {steps.length}</span>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs font-mono">
          {steps.map((step, idx) => (
            <div
              key={step.stepNumber}
              className={`p-3 rounded-xl border transition flex items-center justify-between ${
                step.status === 'completed'
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                  : step.status === 'active'
                  ? 'bg-blue-900/40 border-blue-500/60 text-blue-100 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center space-x-3">
                {step.status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : step.status === 'active' ? (
                  <RefreshCw className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] text-slate-500 flex-shrink-0">
                    {step.stepNumber}
                  </span>
                )}
                <div>
                  <p className="font-bold">{step.title}</p>
                  <p className="text-[11px] opacity-80 font-sans mt-0.5">{step.details}</p>
                </div>
              </div>

              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800">
                {step.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        {/* Real-time Hex Terminal Trace */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1">
          <div className="flex items-center justify-between text-slate-500 border-b border-slate-900 pb-1 text-[10px]">
            <span className="flex items-center space-x-1">
              <Terminal className="w-3 h-3 text-cyan-400" />
              <span>DOIP ISO 13400 HEX TRANSMISSION TRACE</span>
            </span>
            <span>PORT 13400</span>
          </div>
          <div className="max-h-20 overflow-y-auto space-y-0.5 text-cyan-300/80">
            {hexLogs.map((log, i) => (
              <p key={i}>{log}</p>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <p className="text-xs text-slate-400">
            {isCompleted ? 'iDrive Headunit reset complete. FSC features activated!' : 'Do NOT disconnect ENET interface cable while flashing.'}
          </p>

          <button
            onClick={onClose}
            disabled={!isCompleted && !isFailed}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition ${
              isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-900/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {isCompleted ? 'Done & Verify Features' : 'Flashing in Progress...'}
          </button>
        </div>
      </div>
    </div>
  );
};
