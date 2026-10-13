import React from 'react';
import { 
  Database, 
  Code, 
  KeyRound, 
  Zap, 
  Lock, 
  Radar, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';
import { ATTACK_DEFINITIONS } from '../../simulation/attackDefinitions';
import { AttackTypeId } from '../../types/security';

export const AttackSelector: React.FC = () => {
  const { attackConfig, selectAttackType, simulation } = useSecurity();

  const getIcon = (id: AttackTypeId) => {
    switch (id) {
      case 'normal': return ShieldCheck;
      case 'sqli': return Database;
      case 'xss': return Code;
      case 'bruteforce': return KeyRound;
      case 'ddos': return Zap;
      case 'unauthorized': return Lock;
      case 'portscan': return Radar;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'MEDIUM':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  return (
    <div className="bg-[#101522] border border-[#20283A] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#20283A]">
        <div>
          <h3 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider">
            1. Select Simulated Attack Scenario
          </h3>
          <p className="text-[11px] text-[#9CA3B5]">Choose a predefined scenario pattern to simulate against the cloud security architecture</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2.5">
        {(Object.keys(ATTACK_DEFINITIONS) as AttackTypeId[]).map((typeId) => {
          const def = ATTACK_DEFINITIONS[typeId];
          const isSelected = attackConfig.attackType === typeId;
          const Icon = getIcon(typeId);

          return (
            <button
              key={typeId}
              disabled={simulation.isRunning}
              onClick={() => selectAttackType(typeId)}
              className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between group ${
                isSelected
                  ? 'bg-[#151B2B] border-violet-500/60 shadow-sm shadow-violet-900/20'
                  : 'bg-[#101522] hover:bg-[#131A2A] border-[#20283A] hover:border-[#2D374D]'
              } ${simulation.isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-violet-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg border transition-colors ${
                    isSelected
                      ? 'bg-violet-500/15 text-violet-300 border-violet-500/30'
                      : 'bg-[#151B2B] text-[#9CA3B5] border-[#20283A] group-hover:text-[#F5F5F7]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] font-mono font-medium px-1.5 py-0.5 rounded border ${getSeverityBadge(def.defaultSeverity)}`}>
                    {def.defaultSeverity}
                  </span>
                </div>

                <h4 className={`text-xs font-semibold mb-1 transition-colors ${
                  isSelected ? 'text-[#F5F5F7]' : 'text-[#F5F5F7] group-hover:text-white'
                }`}>
                  {def.name}
                </h4>
                <p className="text-[11px] text-[#9CA3B5] line-clamp-2 leading-relaxed">
                  {def.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#20283A] flex items-center justify-between text-[10px] font-mono text-[#6B7280]">
                <span>{def.ruleCode}</span>
                <span className="text-[#9CA3B5]">{def.primaryService.split(' ')[0]}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
