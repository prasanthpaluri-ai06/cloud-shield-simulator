import React from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  Sparkles,
  Zap
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

export const AiThreatCard: React.FC = () => {
  const { simulation } = useSecurity();

  const aiResult = simulation.aiResult;
  const isRunning = simulation.isRunning;
  const isAiActive = simulation.currentStageId === 'ai' && isRunning;

  if (!aiResult && !isAiActive) {
    return (
      <div className="bg-[#101522] border border-[#20283A] rounded-xl p-5 flex flex-col items-center justify-center text-center min-h-[260px]">
        <div className="p-3 rounded-xl bg-[#151B2B] border border-[#20283A] text-violet-400 mb-3">
          <Cpu className="w-6 h-6" />
        </div>
        <h4 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider mb-1">
          AI Threat Analysis Engine
        </h4>
        <span className="text-[10px] font-mono text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20 mb-2 font-medium">
          PROJECT ENHANCEMENT
        </span>
        <p className="text-xs text-[#9CA3B5] max-w-sm">
          Launch a simulation to view real-time AI classification, heuristic risk scoring, confidence metric, and contextual reasoning.
        </p>
      </div>
    );
  }

  if (isAiActive && !aiResult) {
    return (
      <div className="bg-[#121829] border border-violet-500/40 rounded-xl p-5 flex flex-col items-center justify-center text-center min-h-[260px]">
        <div className="p-3 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-300 mb-3">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <h4 className="text-xs font-semibold text-violet-200 uppercase tracking-wider mb-1">
          AI Threat Engine Evaluating Context...
        </h4>
        <p className="text-xs text-[#9CA3B5] max-w-sm">
          Analyzing payload token semantics, endpoint sensitivity, and velocity threshold deviations.
        </p>
      </div>
    );
  }

  if (!aiResult) return null;

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return { bg: 'bg-red-500/10 border-red-500/30 text-red-400', bar: 'bg-red-500' };
      case 'HIGH':
        return { bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400', bar: 'bg-amber-500' };
      case 'MEDIUM':
        return { bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400', bar: 'bg-blue-500' };
      default:
        return { bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', bar: 'bg-emerald-500' };
    }
  };

  const style = getSeverityStyle(aiResult.severity);

  return (
    <div className="bg-[#121829] border border-violet-500/30 rounded-xl p-5 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#20283A] relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-violet-500/15 text-violet-300 border border-violet-500/30">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider">
                AI Threat Intelligence Analysis
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20 font-medium">
                ENHANCEMENT
              </span>
            </div>
            <p className="text-[11px] text-[#9CA3B5]">Contextual Risk Scoring & Reasoning Model</p>
          </div>
        </div>

        <div className={`px-2.5 py-1 rounded-md border font-mono font-medium text-xs ${style.bg}`}>
          {aiResult.severity}
        </div>
      </div>

      {/* Key AI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 relative z-10">
        <div className="p-3 bg-[#101522] rounded-xl border border-[#20283A]">
          <span className="text-[10px] text-[#9CA3B5] uppercase tracking-wider block mb-1">Threat Score</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-mono font-bold text-[#F5F5F7]">{aiResult.threatScore}</span>
            <span className="text-xs text-[#6B7280] font-mono">/ 100</span>
          </div>
          <div className="w-full bg-[#151B2B] rounded-full h-1.5 mt-2 overflow-hidden">
            <div className={`h-full ${style.bar}`} style={{ width: `${aiResult.threatScore}%` }} />
          </div>
        </div>

        <div className="p-3 bg-[#101522] rounded-xl border border-[#20283A]">
          <span className="text-[10px] text-[#9CA3B5] uppercase tracking-wider block mb-1">Confidence</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-mono font-bold text-violet-300">{aiResult.confidence}%</span>
          </div>
          <div className="w-full bg-[#151B2B] rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="h-full bg-violet-400" style={{ width: `${aiResult.confidence}%` }} />
          </div>
        </div>

        <div className="p-3 bg-[#101522] rounded-xl border border-[#20283A] sm:col-span-2">
          <span className="text-[10px] text-[#9CA3B5] uppercase tracking-wider block mb-1">Classification</span>
          <span className="text-xs font-semibold text-[#F5F5F7] block truncate">
            {aiResult.threatCategory}
          </span>
          <span className="text-[10px] text-[#6B7280] font-mono block mt-1">
            Scale: 0–24 LOW | 25–49 MED | 50–74 HIGH | 75–100 CRIT
          </span>
        </div>
      </div>

      {/* Reasoning Checklist ("WHY WAS THIS CLASSIFIED?") */}
      <div className="mb-4 relative z-10">
        <h4 className="text-xs font-medium text-[#9CA3B5] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          Reasoning Rationale ({aiResult.severity})
        </h4>
        <div className="p-3 bg-[#101522] rounded-xl border border-[#20283A] space-y-1.5">
          {aiResult.reasoningChecklist.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-[#9CA3B5]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommended Response */}
      <div className="p-3 bg-[#101522] border border-violet-500/20 rounded-xl text-xs relative z-10 flex items-start gap-2.5">
        <Zap className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-medium text-violet-300 uppercase tracking-wider text-[10px] block mb-0.5">
            Recommended Action
          </span>
          <p className="text-[#F5F5F7] leading-relaxed text-xs">
            {aiResult.recommendedResponse}
          </p>
        </div>
      </div>
    </div>
  );
};
