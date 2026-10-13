import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Ban, 
  ExternalLink, 
  Database, 
  LineChart, 
  Bell, 
  ArrowRight
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

export const ResultSummaryCard: React.FC = () => {
  const { simulation, setActiveTab, setSelectedIpModal, blockedIps } = useSecurity();

  const finalEvent = simulation.finalEvent;

  if (!finalEvent) return null;

  const isBlocked = finalEvent.finalAction === 'BLOCK' || finalEvent.finalAction === 'BLOCK_ALERT';
  const isAllowed = finalEvent.finalAction === 'ALLOW';

  return (
    <div className={`p-5 rounded-xl border shadow-sm transition-all ${
      isBlocked 
        ? 'bg-[#101522] border-red-500/30' 
        : isAllowed 
        ? 'bg-[#101522] border-emerald-500/30'
        : 'bg-[#101522] border-amber-500/30'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#20283A]">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border ${
            isBlocked
              ? 'bg-red-500/10 text-red-400 border-red-500/20'
              : isAllowed
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            {isBlocked ? <Ban className="w-5 h-5" /> : isAllowed ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider">
                Response: {finalEvent.finalAction}
              </h3>
              <span className={`text-[10px] font-mono px-2 py-0.2 rounded font-medium border ${
                isBlocked
                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                  : isAllowed
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {finalEvent.finalStatus}
              </span>
            </div>
            <p className="text-xs text-[#9CA3B5] font-mono">Event ID: {finalEvent.eventId} • Time: {finalEvent.timestamp}</p>
          </div>
        </div>

        {/* Quick Nav */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('logs')}
            className="px-3 py-1.5 rounded-lg bg-[#151B2B] hover:bg-[#1A2236] text-[#F5F5F7] border border-[#20283A] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View in Logs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          {isBlocked && (
            <button
              onClick={() => setActiveTab('blocked')}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Blocked IPs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-[#151B2B] rounded-xl border border-[#20283A]">
          <span className="text-[10px] text-[#9CA3B5] uppercase tracking-wider block mb-1">Source IP</span>
          <button
            onClick={() => {
              const matched = blockedIps.find(b => b.ip === finalEvent.sourceIp);
              if (matched) setSelectedIpModal(matched);
            }}
            className="font-mono font-medium text-violet-300 hover:underline"
          >
            {finalEvent.sourceIp}
          </button>
        </div>

        <div className="p-3 bg-[#151B2B] rounded-xl border border-[#20283A]">
          <span className="text-[10px] text-[#9CA3B5] uppercase tracking-wider block mb-1">Target Endpoint</span>
          <span className="font-mono text-[#F5F5F7] block truncate">{finalEvent.target}</span>
        </div>

        <div className="p-3 bg-[#151B2B] rounded-xl border border-[#20283A]">
          <span className="text-[10px] text-[#9CA3B5] uppercase tracking-wider block mb-1">WAF Rule</span>
          <span className="font-mono text-[#F5F5F7] block truncate">{finalEvent.wafRule}</span>
        </div>

        <div className="p-3 bg-[#151B2B] rounded-xl border border-[#20283A]">
          <span className="text-[10px] text-[#9CA3B5] uppercase tracking-wider block mb-1">AI Threat Score</span>
          <span className="font-mono font-bold text-[#F5F5F7]">
            {finalEvent.threatScore} / 100 ({finalEvent.severity})
          </span>
        </div>
      </div>

      {/* Downstream AWS Services Confirmation Badges */}
      <div className="mt-3 pt-3 border-t border-[#20283A] flex flex-wrap items-center gap-2 text-[11px] font-mono">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#151B2B] text-[#9CA3B5] border border-[#20283A]">
          <Database className="w-3 h-3 text-[#9CA3B5]" />
          <span>DynamoDB: <strong className="text-emerald-400 font-medium">PERSISTED</strong></span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#151B2B] text-[#9CA3B5] border border-[#20283A]">
          <LineChart className="w-3 h-3 text-[#9CA3B5]" />
          <span>CloudWatch: <strong className="text-emerald-400 font-medium">RECORDED</strong></span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#151B2B] text-[#9CA3B5] border border-[#20283A]">
          <Bell className="w-3 h-3 text-[#9CA3B5]" />
          <span>SNS Alert: <strong className={finalEvent.notificationStatus === 'SENT' ? 'text-red-400 font-medium' : 'text-[#6B7280]'}>{finalEvent.notificationStatus}</strong></span>
        </div>
      </div>
    </div>
  );
};
