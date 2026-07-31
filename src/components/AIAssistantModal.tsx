import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  RefreshCw, 
  HelpCircle, 
  ShieldAlert, 
  Cpu, 
  CheckCircle2,
  Terminal
} from 'lucide-react';
import { VehicleData } from '../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleData;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose, vehicle }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const PRESETS = [
    'Explain how 00E5 Apple CarPlay & 0143 Fullscreen FSC codes work on NBTevo.',
    'Why is my FSC Store Status showing 0x03 Cancelled and how to fix it?',
    'Can I flash NBTevo ID4 to ID6 software version for full wireless CarPlay?',
    'How do I troubleshoot DoIP ISO 13400 ENET IP 169.254.199.100 socket errors?',
  ];

  const handleQuery = async (queryText?: string) => {
    const textToSubmit = queryText || prompt;
    if (!textToSubmit.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/gemini/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vin: vehicle.vin,
          headunit: vehicle.headunitName,
          istep: vehicle.iStepCurrent,
          fscStatus: vehicle.fscStoreStatusCount,
          userPrompt: textToSubmit,
        }),
      });

      const data = await res.json();
      if (res.ok && data.answer) {
        setResponse(data.answer);
      } else {
        setError(data.error || 'Failed to get response from Gemini AI advisor.');
      }
    } catch (err: any) {
      setError('Network request error calling AI server endpoint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 relative overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-600/20 border border-indigo-500/40 rounded-xl text-indigo-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">AI BMW Headunit Diagnostics Advisor</h2>
              <p className="text-xs text-slate-400 font-mono">
                Powered by Gemini 3.6 Flash • VIN: {vehicle.vin}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Questions */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
            Suggested Diagnostic Topics
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setPrompt(p);
                  handleQuery(p);
                }}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left text-xs text-slate-300 transition flex items-center justify-between group"
              >
                <span className="line-clamp-1">{p}</span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 opacity-60 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>

        {/* Output Box */}
        <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 p-4 overflow-y-auto text-xs text-slate-200 font-sans leading-relaxed space-y-3 min-h-[180px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-10 space-y-3">
              <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
              <p className="text-xs text-indigo-300 font-mono">Analyzing BMW headunit architecture & FSC store...</p>
            </div>
          ) : error ? (
            <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs">
              {error}
            </div>
          ) : response ? (
            <div className="whitespace-pre-wrap font-sans space-y-2">
              {response}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 space-y-2 py-8">
              <Bot className="w-8 h-8 text-slate-600" />
              <p>Ask any technical question about BMW NBTevo/MGU FSC codes, CarPlay unlocks, or ENET DoIP flashing.</p>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
            placeholder="Type your technical question about BMW FSC coding..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-indigo-500 outline-none"
          />
          <button
            onClick={() => handleQuery()}
            disabled={loading || !prompt.trim()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Ask</span>
          </button>
        </div>

      </div>
    </div>
  );
};
