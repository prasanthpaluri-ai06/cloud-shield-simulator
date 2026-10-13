import React from 'react';
import { Clock, CheckCircle2, AlertOctagon, Loader2, Circle } from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

export const SimulationTimeline: React.FC = () => {
  const { simulation } = useSecurity();

  const milestones = simulation.timeline;

  return (
    <div className="bg-[#101522] border border-[#20283A] rounded-xl p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#20283A]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[#151B2B] text-[#9CA3B5] border border-[#20283A]">
              <Clock className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider">
                Execution Timeline
              </h3>
              <p className="text-[11px] text-[#9CA3B5]">Sequential Milestones & Offsets</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#6B7280]">
            {milestones.length} milestones
          </span>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {milestones.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-[#20283A] rounded-xl text-[#6B7280] text-xs">
              Timeline milestones will stream here in real-time during simulation.
            </div>
          ) : (
            milestones.map((m, idx) => {
              const isThreat = m.status === 'threat';
              const isCompleted = m.status === 'completed';
              const isActive = m.status === 'active';

              return (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs group"
                >
                  <span className="font-mono text-[10px] font-medium text-violet-300 bg-[#151B2B] px-1.5 py-0.5 rounded border border-[#20283A] shrink-0 mt-0.5">
                    {m.timeOffset}
                  </span>

                  <div className="mt-1 shrink-0">
                    {isThreat ? (
                      <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isActive ? (
                      <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-[#6B7280]" />
                    )}
                  </div>

                  <p className={`leading-tight text-xs ${
                    isThreat ? 'text-red-300 font-medium' : isCompleted ? 'text-[#F5F5F7]' : 'text-violet-300'
                  }`}>
                    {m.label}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-[#20283A] text-[10px] font-mono text-[#6B7280] text-right">
        Local Simulation Engine
      </div>
    </div>
  );
};
