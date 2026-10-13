import React, { useRef, useEffect } from 'react';
import { Terminal, Copy, Trash2, Check } from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

export const LiveLogTerminal: React.FC = () => {
  const { simulation, clearLogs } = useSecurity();
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  const logs = simulation.logs;

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCopyLogs = () => {
    const text = logs.map(l => `[${l.timeOffset}] [${l.source}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'WAF':
        return 'text-blue-300 bg-blue-500/10 border-blue-500/20';
      case 'AI':
        return 'text-violet-300 bg-violet-500/15 border-violet-500/30';
      case 'LAMBDA':
        return 'text-amber-300 bg-amber-500/10 border-amber-500/20';
      case 'DYNAMODB':
        return 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20';
      case 'CLOUDWATCH':
        return 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20';
      case 'SNS':
        return 'text-rose-300 bg-rose-500/10 border-rose-500/20';
      case 'RESPONSE':
        return 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30';
      default:
        return 'text-[#9CA3B5] bg-[#151B2B] border-[#20283A]';
    }
  };

  return (
    <div className="bg-[#0B1020] border border-[#20283A] rounded-xl overflow-hidden shadow-sm flex flex-col h-full font-mono text-xs">
      {/* Terminal Titlebar */}
      <div className="bg-[#080B14] px-4 py-2.5 border-b border-[#20283A] flex items-center justify-between select-none">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#20283A]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#20283A]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#20283A]" />
          </div>
          <div className="h-3 w-[1px] bg-[#20283A] mx-1" />
          <div className="flex items-center gap-1.5 text-[#F5F5F7] font-medium text-[11px]">
            <Terminal className="w-3.5 h-3.5 text-violet-400" />
            <span>SIMULATION CONSOLE</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {logs.length > 0 && (
            <>
              <button
                onClick={handleCopyLogs}
                className="p-1 rounded bg-[#151B2B] hover:bg-[#1A2236] text-[#9CA3B5] hover:text-[#F5F5F7] border border-[#20283A] flex items-center gap-1 px-2 text-[10px] transition-colors cursor-pointer"
                title="Copy all logs"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={clearLogs}
                className="p-1 rounded bg-[#151B2B] hover:bg-[#1A2236] text-[#9CA3B5] hover:text-red-400 border border-[#20283A] transition-colors cursor-pointer"
                title="Clear console logs"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="p-4 overflow-y-auto max-h-[300px] min-h-[220px] space-y-1.5 bg-[#080B14] text-[11px] leading-relaxed">
        {logs.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-[#6B7280] text-center select-none font-sans">
            <Terminal className="w-7 h-7 text-[#20283A] mb-2" />
            <p className="text-[#9CA3B5] font-medium text-xs">Console buffer idle.</p>
            <p className="text-[11px] text-[#6B7280] mt-0.5">
              Launch an attack simulation to stream AWS service execution events and logs.
            </p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 hover:bg-[#101522] p-0.5 rounded">
              <span className="text-[#6B7280] select-none shrink-0 font-medium">
                [{log.timeOffset}]
              </span>
              <span className={`px-1.5 py-0.2 text-[10px] rounded border uppercase font-medium shrink-0 ${getSourceBadge(log.source)}`}>
                {log.source}
              </span>
              <span className={`break-all ${
                log.level === 'threat' 
                  ? 'text-red-400 font-medium' 
                  : log.level === 'ai'
                  ? 'text-violet-300 font-medium'
                  : log.level === 'success'
                  ? 'text-emerald-400'
                  : 'text-[#9CA3B5]'
              }`}>
                {log.message}
              </span>
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>

      {/* Terminal Footer */}
      <div className="bg-[#080B14] px-3 py-1.5 border-t border-[#20283A] flex items-center justify-between text-[10px] text-[#6B7280] select-none font-mono">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>Stream: /aws/simulation/cloudshield</span>
        </div>
        <span>{logs.length} entries</span>
      </div>
    </div>
  );
};
