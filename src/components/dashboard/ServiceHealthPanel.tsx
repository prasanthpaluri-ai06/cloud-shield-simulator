import React from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Zap, 
  Database, 
  LineChart, 
  Bell, 
  ChevronRight,
  Activity
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

export const ServiceHealthPanel: React.FC = () => {
  const { services, setSelectedServiceModal } = useSecurity();

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'waf': return ShieldAlert;
      case 'ai': return Cpu;
      case 'lambda': return Zap;
      case 'dynamodb': return Database;
      case 'cloudwatch': return LineChart;
      case 'sns': return Bell;
      default: return Activity;
    }
  };

  const serviceList = Object.values(services);

  return (
    <div className="bg-[#101522] border border-[#20283A] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[#20283A]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[#151B2B] text-[#9CA3B5] border border-[#20283A]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider">
              Simulated AWS Cloud Services
            </h3>
            <p className="text-[11px] text-[#9CA3B5]">Architecture Components & Telemetry</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          ALL OPERATIONAL
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {serviceList.map((srv) => {
          const Icon = getServiceIcon(srv.id);
          const isProcessing = srv.status === 'PROCESSING';
          const isAi = srv.id === 'ai';

          return (
            <div
              key={srv.id}
              onClick={() => setSelectedServiceModal(srv)}
              className={`p-3.5 rounded-xl border transition-all group relative cursor-pointer ${
                isAi 
                  ? 'bg-[#121829] border-violet-500/30 hover:border-violet-500/50 hover:bg-[#151D33]' 
                  : 'bg-[#101522] border-[#20283A] hover:border-[#2D374D] hover:bg-[#131A2A]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg border transition-colors ${
                    isAi
                      ? 'bg-violet-500/15 text-violet-300 border-violet-500/30'
                      : isProcessing
                      ? 'bg-violet-500/10 text-violet-300 border-violet-500/30'
                      : 'bg-[#151B2B] text-[#9CA3B5] border-[#20283A] group-hover:text-[#F5F5F7]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[#F5F5F7] group-hover:text-violet-300 transition-colors">
                        {srv.serviceName}
                      </span>
                      {isAi && (
                        <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                          AI
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#6B7280] font-mono block">
                      {srv.awsEquivalent.split(' (')[0]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border ${
                    isProcessing
                      ? 'bg-violet-500/10 text-violet-300 border-violet-500/30'
                      : 'bg-[#151B2B] text-emerald-400 border-[#20283A]'
                  }`}>
                    {srv.status}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#9CA3B5] line-clamp-1 mb-2">
                {srv.currentOperation}
              </p>

              <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#20283A] font-mono">
                <span className="text-[#6B7280]">Events: <strong className="text-[#9CA3B5] font-normal">{srv.eventCount.toLocaleString()}</strong></span>
                <span className="text-violet-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 font-medium">
                  Inspect <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
