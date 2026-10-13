import React from 'react';
import { X, Ban, ShieldAlert, Clock, AlertTriangle, CheckCircle2, History } from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

export const IpDetailModal: React.FC = () => {
  const { selectedIpModal, setSelectedIpModal, unblockIp, events, setActiveTab } = useSecurity();

  if (!selectedIpModal) return null;

  const ipData = selectedIpModal;
  const relatedEvents = events.filter(e => e.sourceIp === ipData.ip);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#101522] border border-[#20283A] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#20283A] bg-[#0B1020] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[#F5F5F7] font-mono">{ipData.ip}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                  {ipData.status}
                </span>
              </div>
              <p className="text-xs text-[#6B7280]">Simulated Blocked Source Host</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedIpModal(null)}
            className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#F5F5F7] hover:bg-[#151B2B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-[#0B1020] rounded-xl border border-[#20283A]">
            <span className="text-[11px] text-[#6B7280] block mb-1">Block Trigger Reason</span>
            <p className="text-xs font-medium text-[#F5F5F7]">{ipData.reason}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-[#0B1020] rounded-xl border border-[#20283A] text-center">
              <span className="text-[10px] text-[#6B7280] block uppercase font-medium">Threat Score</span>
              <span className="text-base font-mono font-bold text-rose-400">
                {ipData.threatScore} / 100
              </span>
            </div>
            <div className="p-3 bg-[#0B1020] rounded-xl border border-[#20283A] text-center">
              <span className="text-[10px] text-[#6B7280] block uppercase font-medium">Attack Type</span>
              <span className="text-xs font-medium text-[#F5F5F7] block truncate">
                {ipData.attackType}
              </span>
            </div>
            <div className="p-3 bg-[#0B1020] rounded-xl border border-[#20283A] text-center">
              <span className="text-[10px] text-[#6B7280] block uppercase font-medium">Violations</span>
              <span className="text-base font-mono font-bold text-[#F5F5F7]">
                {ipData.eventCount || relatedEvents.length || 1}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#0B1020] rounded-xl border border-[#20283A]">
              <span className="text-[11px] text-[#6B7280] block mb-0.5">First Detected</span>
              <span className="font-mono text-[#9CA3B5] text-[11px]">{ipData.firstDetected}</span>
            </div>
            <div className="p-3 bg-[#0B1020] rounded-xl border border-[#20283A]">
              <span className="text-[11px] text-[#6B7280] block mb-0.5">Last Detected</span>
              <span className="font-mono text-[#9CA3B5] text-[11px]">{ipData.lastDetected}</span>
            </div>
          </div>

          {/* Related Events Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-[#F5F5F7] flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#8B5CF6]" />
                Related DynamoDB Security Records ({relatedEvents.length})
              </h4>
              {relatedEvents.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedIpModal(null);
                    setActiveTab('logs');
                  }}
                  className="text-[11px] text-[#8B5CF6] hover:text-[#A78BFA] hover:underline transition-colors"
                >
                  View in Security Logs
                </button>
              )}
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {relatedEvents.length === 0 ? (
                <p className="text-xs text-[#6B7280] italic p-3 bg-[#0B1020] rounded-xl border border-[#20283A] text-center">
                  No individual event logs found for this host in current session buffer.
                </p>
              ) : (
                relatedEvents.map(evt => (
                  <div key={evt.eventId} className="p-2.5 rounded-xl bg-[#0B1020] border border-[#20283A] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#8B5CF6] font-medium">{evt.eventId}</span>
                      <span className="text-[#9CA3B5]">{evt.target}</span>
                      <span className="text-[10px] text-[#6B7280] font-mono">[{evt.method}]</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                      {evt.wafAction}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0B1020] border-t border-[#20283A] flex items-center justify-between">
          <button
            onClick={() => {
              unblockIp(ipData.ip);
              setSelectedIpModal(null);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Unblock IP (Simulator Only)</span>
          </button>
          <button
            onClick={() => setSelectedIpModal(null)}
            className="px-4 py-1.5 rounded-lg bg-[#151B2B] hover:bg-[#1E2638] text-[#F5F5F7] border border-[#20283A] text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
