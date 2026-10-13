import React from 'react';
import { X, ShieldAlert, Cpu, Zap, Database, LineChart, Bell, CheckCircle2, Activity } from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

export const ServiceModal: React.FC = () => {
  const { selectedServiceModal, setSelectedServiceModal, setActiveTab } = useSecurity();

  if (!selectedServiceModal) return null;

  const service = selectedServiceModal;

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

  const Icon = getServiceIcon(service.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#101522] border border-[#20283A] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#20283A] bg-[#0B1020] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6]">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[#F5F5F7]">{service.serviceName}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  {service.status}
                </span>
              </div>
              <p className="text-xs text-[#6B7280] font-mono">{service.awsEquivalent}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedServiceModal(null)}
            className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#F5F5F7] hover:bg-[#151B2B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280] mb-1.5">
              Service Role in Cloud Architecture
            </h4>
            <p className="text-xs text-[#9CA3B5] leading-relaxed bg-[#0B1020] p-3.5 rounded-xl border border-[#20283A]">
              {service.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#0B1020] rounded-xl border border-[#20283A]">
              <span className="text-[11px] text-[#6B7280] block mb-1">Current Operation</span>
              <span className="text-xs font-mono font-medium text-[#F5F5F7] line-clamp-2">
                {service.currentOperation}
              </span>
            </div>
            <div className="p-3 bg-[#0B1020] rounded-xl border border-[#20283A]">
              <span className="text-[11px] text-[#6B7280] block mb-1">{service.metricsLabel}</span>
              <span className="text-xs font-mono font-semibold text-[#F5F5F7]">
                {service.metricsValue}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-[#0B1020] rounded-xl border border-[#20283A] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#9CA3B5]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Simulated AWS Lifecycle Events Processed</span>
            </div>
            <span className="font-mono font-semibold text-[#8B5CF6] text-sm">
              {service.eventCount.toLocaleString()}
            </span>
          </div>

          <div className="text-[11px] text-[#9CA3B5] bg-[#8B5CF6]/5 border border-[#8B5CF6]/20 p-3 rounded-xl flex items-center gap-2">
            <span className="text-[#8B5CF6] font-semibold">Assignment Note:</span>
            <span>Simulated service demonstrating authentic AWS event lifecycle interactions.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0B1020] border-t border-[#20283A] flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedServiceModal(null);
              setActiveTab('monitoring');
            }}
            className="text-xs text-[#8B5CF6] hover:text-[#A78BFA] font-medium transition-colors"
          >
            Open in System Monitoring →
          </button>
          <button
            onClick={() => setSelectedServiceModal(null)}
            className="px-4 py-1.5 rounded-lg bg-[#151B2B] hover:bg-[#1E2638] text-[#F5F5F7] border border-[#20283A] text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
