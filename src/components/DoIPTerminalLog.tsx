import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Trash2, 
  Copy, 
  Check, 
  Pause, 
  Play, 
  Download, 
  X,
  Radio,
  Wifi
} from 'lucide-react';
import { DoIPPacket } from '../types';

interface DoIPTerminalLogProps {
  show: boolean;
  onClose: () => void;
}

export const DoIPTerminalLog: React.FC<DoIPTerminalLogProps> = ({ show, onClose }) => {
  const [logs, setLogs] = useState<DoIPPacket[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'TX' | 'RX' | 'FSC'>('ALL');
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!show || isPaused) return;

    // Generate periodic realistic DoIP packets
    const interval = setInterval(() => {
      const isTx = Math.random() > 0.5;
      const now = new Date().toLocaleTimeString() + '.' + Math.floor(Math.random() * 900 + 100);

      const samplePackets: Omit<DoIPPacket, 'id' | 'timestamp'>[] = [
        {
          direction: 'TX',
          channel: 'Port 13400',
          headerHex: '02 FD 80 01 00 00 00 08',
          payloadHex: '0x63 0x01 0x10 0x03 (UDS Extended Session)',
          decodedMsg: 'TX -> HU_NBT2: Request Extended Diagnostic Session 0x03',
        },
        {
          direction: 'RX',
          channel: 'Port 13400',
          headerHex: '02 FD 80 02 00 00 00 0A',
          payloadHex: '0x01 0x63 0x50 0x03 0x00 0x32 0x01 0xF4',
          decodedMsg: 'RX <- HU_NBT2: Session Extended 0x03 Granted (ACK 0x50)',
        },
        {
          direction: 'TX',
          channel: 'Port 13400',
          headerHex: '02 FD 80 01 00 00 00 06',
          payloadHex: '0x63 0x01 0x22 0x00 0x9C (Read FSC 009C)',
          decodedMsg: 'TX -> HU_NBT2: Read FSC Store AppID 0x009C (BMW Apps)',
        },
        {
          direction: 'RX',
          channel: 'Port 13400',
          headerHex: '02 FD 80 02 00 00 00 12',
          payloadHex: '0x01 0x63 0x62 0x00 0x9C 0x02 0x01 (Approved)',
          decodedMsg: 'RX <- HU_NBT2: FSC 0x009C Status = 0x02 Approved (RSA Valid)',
        },
      ];

      const chosen = samplePackets[Math.floor(Math.random() * samplePackets.length)];
      const newPacket: DoIPPacket = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: now,
        ...chosen,
      };

      setLogs((prev) => [newPacket, ...prev.slice(0, 49)]);
    }, 1800);

    return () => clearInterval(interval);
  }, [show, isPaused]);

  if (!show) return null;

  const filteredLogs = logs.filter((l) => {
    if (filter === 'ALL') return true;
    if (filter === 'TX') return l.direction === 'TX';
    if (filter === 'RX') return l.direction === 'RX';
    if (filter === 'FSC') return l.decodedMsg.includes('FSC');
    return true;
  });

  const handleCopyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] [${l.direction}] ${l.payloadHex} - ${l.decodedMsg}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 shadow-2xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto p-4 space-y-3 font-mono text-xs">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-3">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200">OBD-II DoIP Port 13400 ISO 13400 Packet Terminal</span>
            <span className="text-[10px] bg-slate-800 text-cyan-300 px-2 py-0.5 rounded border border-slate-700">
              ECU 0x63 HU_NBT2
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Filter Buttons */}
            <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              {['ALL', 'TX', 'RX', 'FSC'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    filter === f
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
              title={isPaused ? 'Resume Streaming' : 'Pause Trace'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            <button
              onClick={() => setLogs([])}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
              title="Clear Terminal Log"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={handleCopyLogs}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
              title="Copy Trace to Clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Log Output List */}
        <div className="h-32 overflow-y-auto space-y-1 text-[11px] leading-snug pr-2">
          {filteredLogs.map((log) => (
            <div key={log.id} className="flex items-center space-x-3 text-slate-300 hover:bg-slate-900/60 p-0.5 rounded">
              <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
              <span
                className={`font-bold text-[10px] px-1.5 py-0.2 rounded ${
                  log.direction === 'TX'
                    ? 'bg-blue-950 text-blue-300 border border-blue-500/30'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {log.direction}
              </span>
              <span className="text-cyan-400/90">{log.payloadHex}</span>
              <span className="text-slate-400">→</span>
              <span className="text-slate-200">{log.decodedMsg}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
