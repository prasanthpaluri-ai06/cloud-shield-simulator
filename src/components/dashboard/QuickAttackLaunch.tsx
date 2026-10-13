import React from 'react';
import { Play, Database, Zap, Code, ShieldCheck, KeyRound, Lock, Radar } from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';
import { AttackTypeId } from '../../types/security';

export const QuickAttackLaunch: React.FC = () => {
  const { selectAttackType, launchSimulation, setActiveTab, simulation, attackConfig } = useSecurity();

  const quickButtons: { id: AttackTypeId; name: string; icon: any }[] = [
    { id: 'sqli', name: 'SQL Injection', icon: Database },
    { id: 'ddos', name: 'DDoS Burst', icon: Zap },
    { id: 'bruteforce', name: 'Brute Force', icon: KeyRound },
    { id: 'xss', name: 'XSS Attack', icon: Code },
    { id: 'unauthorized', name: 'Privilege Probe', icon: Lock },
    { id: 'portscan', name: 'Port Scan', icon: Radar },
    { id: 'normal', name: 'Normal Request', icon: ShieldCheck }
  ];

  const handleQuickTrigger = (id: AttackTypeId) => {
    selectAttackType(id);
    setActiveTab('simulator');
    launchSimulation({ attackType: id });
  };

  return (
    <div className="bg-[#101522] border border-[#20283A] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#20283A]">
        <div>
          <h3 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider">
            Quick Attack Simulator
          </h3>
          <p className="text-[11px] text-[#9CA3B5]">Instant simulated attack test triggers</p>
        </div>
        <button
          onClick={() => setActiveTab('simulator')}
          className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors cursor-pointer"
        >
          Open Configurator →
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {quickButtons.map((btn) => {
          const Icon = btn.icon;
          const isSelected = attackConfig.attackType === btn.id;

          return (
            <button
              key={btn.id}
              disabled={simulation.isRunning}
              onClick={() => handleQuickTrigger(btn.id)}
              className={`p-3 rounded-xl border flex flex-col items-center text-center gap-2 transition-all group ${
                isSelected
                  ? 'bg-[#151B2B] border-violet-500/50 shadow-sm shadow-violet-900/20'
                  : 'bg-[#101522] hover:bg-[#151B2B] border-[#20283A] hover:border-violet-500/30'
              } ${simulation.isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className={`p-2 rounded-lg border transition-colors ${
                isSelected 
                  ? 'bg-violet-500/10 text-violet-300 border-violet-500/30' 
                  : 'bg-[#151B2B] text-[#9CA3B5] border-[#20283A] group-hover:text-violet-300 group-hover:border-violet-500/20'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-[#F5F5F7] line-clamp-1">
                {btn.name}
              </span>
              <span className="text-[10px] font-mono text-[#9CA3B5] group-hover:text-violet-300 font-medium flex items-center gap-1 transition-colors">
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>Simulate</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
