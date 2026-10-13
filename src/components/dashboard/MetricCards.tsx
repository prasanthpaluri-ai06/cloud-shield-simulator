import React from 'react';
import { 
  Globe, 
  ShieldAlert, 
  AlertTriangle, 
  Flame, 
  Ban, 
  HeartPulse,
  TrendingUp
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

export const MetricCards: React.FC = () => {
  const { metrics, blockedIps } = useSecurity();

  const cards = [
    {
      id: 'total',
      label: 'Total Requests',
      value: metrics.totalRequests.toLocaleString(),
      subtext: `${metrics.requestsPerMinute} req/min avg`,
      icon: Globe,
      color: 'text-[#9CA3B5]',
      bgColor: 'bg-[#151B2B] border-[#20283A]',
      delta: 'Active traffic baseline'
    },
    {
      id: 'blocked',
      label: 'Blocked by WAF',
      value: metrics.blockedRequests.toLocaleString(),
      subtext: `${((metrics.blockedRequests / Math.max(1, metrics.totalRequests)) * 100).toFixed(1)}% drop rate`,
      icon: ShieldAlert,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10 border-red-500/20',
      delta: 'Drop rule enforced'
    },
    {
      id: 'threats',
      label: 'Threats Detected',
      value: metrics.threatsDetected.toLocaleString(),
      subtext: 'Flagged by AI Engine',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      delta: 'Heuristic anomaly'
    },
    {
      id: 'critical',
      label: 'Critical Threats',
      value: metrics.criticalThreats.toLocaleString(),
      subtext: 'Auto SNS alert fired',
      icon: Flame,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10 border-red-500/20',
      delta: 'Immediate isolation'
    },
    {
      id: 'blockedIps',
      label: 'Blocked IPs',
      value: blockedIps.length.toString(),
      subtext: 'Active WAF IPSet',
      icon: Ban,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10 border-violet-500/20',
      delta: 'Synchronized set'
    },
    {
      id: 'health',
      label: 'System Health',
      value: metrics.systemHealth,
      subtext: '6/6 Services Online',
      icon: HeartPulse,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      delta: 'Zero latency degradation'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="p-4 rounded-xl bg-[#101522] border border-[#20283A] hover:border-[#2D374D] hover:bg-[#131A2A] transition-all shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-medium text-[#9CA3B5] line-clamp-1">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-lg border ${card.bgColor} ${card.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="text-xl font-bold font-mono tracking-tight text-[#F5F5F7] mb-1">
                {card.value}
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#6B7280]">{card.subtext}</span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-[#20283A] text-[10px] text-[#6B7280] flex items-center gap-1 font-mono">
              <TrendingUp className="w-3 h-3 text-[#9CA3B5] shrink-0" />
              <span className="truncate">{card.delta}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
