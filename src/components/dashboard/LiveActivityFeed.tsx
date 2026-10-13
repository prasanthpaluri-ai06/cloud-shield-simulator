import React from 'react';
import { 
  Radio, 
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

export const LiveActivityFeed: React.FC = () => {
  const { events, setActiveTab, setSelectedIpModal, blockedIps } = useSecurity();

  // Show top 7 latest events
  const recentEvents = events.slice(0, 7);

  return (
    <div className="bg-[#101522] border border-[#20283A] rounded-xl p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[#20283A]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[#151B2B] text-[#9CA3B5] border border-[#20283A]">
              <Radio className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider">
                Live SOC Activity Feed
              </h3>
              <p className="text-[11px] text-[#9CA3B5]">Real-Time Security Event Stream</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('logs')}
            className="text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>All Logs ({events.length})</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-1.5">
          {recentEvents.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-[#20283A] rounded-xl text-[#6B7280] text-xs">
              No security events recorded yet. Launch a simulation to begin monitoring.
            </div>
          ) : (
            recentEvents.map((evt, idx) => {
              const isBlocked = evt.finalAction === 'BLOCK' || evt.finalAction === 'BLOCK_ALERT';
              const isAllowed = evt.finalAction === 'ALLOW';
              const isCritical = evt.severity === 'CRITICAL';
              const isHigh = evt.severity === 'HIGH';

              return (
                <div
                  key={evt.eventId + '-' + idx}
                  className="p-2.5 rounded-lg bg-[#151B2B]/50 hover:bg-[#151B2B] border border-[#20283A]/60 hover:border-[#20283A] transition-all flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isCritical ? 'bg-red-400' : isHigh ? 'bg-amber-400' : isAllowed ? 'bg-emerald-400' : 'bg-violet-400'
                    }`} />

                    <div className="font-mono text-[11px] text-[#6B7280] shrink-0">
                      {evt.timestamp.slice(11, 19)}
                    </div>

                    <div className="font-mono font-medium text-violet-300 text-[11px] shrink-0">
                      {evt.eventId}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-medium text-[#F5F5F7] truncate">
                          {evt.attackType}
                        </span>
                        <span className="text-[#6B7280] text-[10px] font-mono">
                          → {evt.target}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        const matched = blockedIps.find(b => b.ip === evt.sourceIp);
                        if (matched) {
                          setSelectedIpModal(matched);
                        }
                      }}
                      className="font-mono text-[11px] text-[#9CA3B5] hover:text-[#F5F5F7] hover:underline hidden sm:inline"
                    >
                      {evt.sourceIp}
                    </button>

                    <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${
                      isBlocked
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : isAllowed
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {evt.finalAction}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-[#20283A] flex items-center justify-between text-[11px] text-[#6B7280] font-mono">
        <span>Active buffer: {events.length} records</span>
        <button
          onClick={() => setActiveTab('analytics')}
          className="text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1 cursor-pointer font-sans"
        >
          View Threat Analytics <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
