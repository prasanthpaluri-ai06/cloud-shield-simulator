import React from 'react';
import { 
  Send, 
  ShieldAlert, 
  Cpu, 
  Zap, 
  Database, 
  LineChart, 
  Bell, 
  ShieldCheck, 
  Loader2, 
  Radio, 
  Check
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';
import { PipelineStageId, StageState } from '../../types/security';

export const PipelineVisualization: React.FC = () => {
  const { simulation } = useSecurity();

  const stagesOrder: { id: PipelineStageId; label: string; awsSub: string; icon: any; stageNum: number }[] = [
    { id: 'attack', label: 'Request Generator', awsSub: 'Simulated Client', icon: Send, stageNum: 1 },
    { id: 'waf', label: 'AWS WAF', awsSub: 'L7 ACL Inspection', icon: ShieldAlert, stageNum: 2 },
    { id: 'ai', label: 'AI Threat Engine', awsSub: 'Heuristic Synthesis', icon: Cpu, stageNum: 3 },
    { id: 'lambda', label: 'AWS Lambda', awsSub: 'processSecurityEvent', icon: Zap, stageNum: 4 },
    { id: 'dynamodb', label: 'Amazon DynamoDB', awsSub: 'NoSQL Event Store', icon: Database, stageNum: 5 },
    { id: 'cloudwatch', label: 'Amazon CloudWatch', awsSub: 'Metrics & Telemetry', icon: LineChart, stageNum: 6 },
    { id: 'sns', label: 'Amazon SNS', awsSub: 'Incident Alert Topic', icon: Bell, stageNum: 7 },
    { id: 'response', label: 'Security Mitigation', awsSub: 'Enforcement State', icon: ShieldCheck, stageNum: 8 }
  ];

  const getStageVisuals = (state: StageState, isCurrentActive: boolean) => {
    if (isCurrentActive) {
      return {
        cardBg: 'bg-[#151B2B] border-violet-500/70 shadow-sm shadow-violet-900/20',
        iconColor: 'text-violet-300 bg-violet-500/15 border-violet-500/30',
        badge: 'PROCESSING',
        badgeColor: 'bg-violet-500/20 text-violet-200 border-violet-500/40 font-semibold',
        statusColor: 'text-violet-300 font-medium',
        stepColor: 'bg-violet-600 text-white font-semibold'
      };
    }

    switch (state) {
      case 'processing':
        return {
          cardBg: 'bg-[#151B2B] border-violet-500/50',
          iconColor: 'text-violet-300 bg-violet-500/10 border-violet-500/30',
          badge: 'PROCESSING',
          badgeColor: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
          statusColor: 'text-violet-300',
          stepColor: 'bg-violet-600 text-white'
        };
      case 'completed':
        return {
          cardBg: 'bg-[#101522] border-emerald-500/30',
          iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          badge: 'PASSED',
          badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-medium',
          statusColor: 'text-emerald-400',
          stepColor: 'bg-emerald-600 text-white font-medium'
        };
      case 'threat':
        return {
          cardBg: 'bg-[#101522] border-red-500/40',
          iconColor: 'text-red-400 bg-red-500/10 border-red-500/20',
          badge: 'THREAT',
          badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20 font-medium',
          statusColor: 'text-red-400 font-medium',
          stepColor: 'bg-red-600 text-white font-medium'
        };
      default:
        return {
          cardBg: 'bg-[#101522] border-[#20283A] opacity-60',
          iconColor: 'text-[#6B7280] bg-[#151B2B] border-[#20283A]',
          badge: 'WAITING',
          badgeColor: 'bg-[#151B2B] text-[#6B7280] border-[#20283A]',
          statusColor: 'text-[#6B7280]',
          stepColor: 'bg-[#151B2B] text-[#6B7280]'
        };
    }
  };

  const currentStageIndex = stagesOrder.findIndex(s => s.id === simulation.currentStageId);

  return (
    <div className="bg-[#101522] border border-[#20283A] rounded-xl p-5 relative shadow-sm">
      {/* Top Banner with Active Stage Live Status Narrative */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#20283A] relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#151B2B] text-[#9CA3B5] border border-[#20283A]">
            <Radio className={`w-4 h-4 ${simulation.isRunning ? 'text-violet-400 animate-pulse' : 'text-[#6B7280]'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider">
                Cloud Security Pipeline Lifecycle
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#151B2B] text-[#9CA3B5] border border-[#20283A]">
                8 STAGES
              </span>
            </div>
            <p className="text-[11px] text-[#9CA3B5] mt-0.5">
              {simulation.isRunning && simulation.currentStageId ? (
                <span className="text-violet-300 font-medium">
                  Currently executing Stage {currentStageIndex + 1}/8: {stagesOrder[currentStageIndex]?.label}...
                </span>
              ) : simulation.finalEvent ? (
                <span className="text-emerald-400 font-medium">
                  Pipeline completed. Action: {simulation.finalEvent.finalAction} ({simulation.finalEvent.finalStatus})
                </span>
              ) : (
                <span>Standing by. Ready to launch controlled security simulation.</span>
              )}
            </p>
          </div>
        </div>

        {/* Progress Gauge */}
        <div className="flex items-center gap-3">
          <div className="w-32 bg-[#151B2B] rounded-full h-2 border border-[#20283A] overflow-hidden hidden sm:block">
            <div 
              className="bg-gradient-to-r from-violet-600 to-indigo-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${simulation.progress}%` }}
            />
          </div>
          <span className="text-xs font-mono font-medium text-[#F5F5F7] bg-[#151B2B] px-2.5 py-1 rounded-md border border-[#20283A]">
            {simulation.progress}%
          </span>
        </div>
      </div>

      {/* Sequential Pipeline Nodes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5 relative z-10">
        {stagesOrder.map((stageItem) => {
          const stageState = simulation.stages[stageItem.id]?.state || 'waiting';
          const stageOutput = simulation.stages[stageItem.id]?.outputSummary;
          const isCurrentActive = simulation.currentStageId === stageItem.id && simulation.isRunning;
          const visuals = getStageVisuals(stageState, isCurrentActive);
          const Icon = stageItem.icon;
          const isPassed = stageState === 'completed' || stageState === 'threat';

          return (
            <div
              key={stageItem.id}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all duration-200 relative group min-h-[150px] ${visuals.cardBg}`}
            >
              {/* Stage Number & Badge */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono ${visuals.stepColor}`}>
                      {isPassed ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : stageItem.stageNum}
                    </span>
                    <div className={`p-1.5 rounded-md border ${visuals.iconColor} transition-colors`}>
                      {isCurrentActive ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-300" />
                      ) : (
                        <Icon className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </div>

                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-wider ${visuals.badgeColor}`}>
                    {visuals.badge}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-[#F5F5F7] line-clamp-1 group-hover:text-white mt-1">
                  {stageItem.label}
                </h4>
                <p className="text-[10px] text-[#9CA3B5] font-mono line-clamp-1">
                  {stageItem.awsSub}
                </p>
              </div>

              {/* Dynamic Sub-text / Output */}
              <div className="mt-2.5 pt-2 border-t border-[#20283A]">
                <p className={`text-[10px] font-mono leading-tight line-clamp-2 ${visuals.statusColor}`}>
                  {stageOutput || (stageState === 'waiting' ? 'Queued' : 'Standby')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
