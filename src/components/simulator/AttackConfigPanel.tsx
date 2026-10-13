import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  Sliders, 
  Clock, 
  AlertCircle
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';
import { SimulationSpeed } from '../../types/security';

export const AttackConfigPanel: React.FC = () => {
  const { 
    attackConfig, 
    setAttackConfig, 
    launchSimulation, 
    stopSimulation, 
    simulation 
  } = useSecurity();

  const [validationError, setValidationError] = useState<string | null>(null);

  const isRunning = simulation.isRunning;

  const handleSpeedChange = (speed: SimulationSpeed) => {
    setAttackConfig(prev => ({ ...prev, speed }));
  };

  const validateConfig = (): boolean => {
    // Validate IPv4
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(attackConfig.sourceIp.trim())) {
      setValidationError('Invalid IPv4 address format (e.g. 198.51.100.42)');
      return false;
    }

    // Validate Endpoint
    if (!attackConfig.targetEndpoint.trim().startsWith('/')) {
      setValidationError('Target endpoint must start with a forward slash (e.g. /login)');
      return false;
    }

    // Validate Request Count
    if (attackConfig.requestCount < 1 || attackConfig.requestCount > 5000) {
      setValidationError('Request volume must be between 1 and 5,000');
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRunning) return;

    if (validateConfig()) {
      launchSimulation();
    }
  };

  return (
    <div className="bg-[#101522] border border-[#20283A] rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2.5 border-b border-[#20283A]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[#151B2B] text-[#9CA3B5] border border-[#20283A]">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider">
              2. Simulation Parameters & Controls
            </h3>
            <p className="text-[11px] text-[#9CA3B5]">Configure synthetic request headers, velocity, and timing</p>
          </div>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1.5 bg-[#151B2B] border border-[#20283A] p-1 rounded-lg text-xs self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-[#6B7280] ml-1.5 mr-0.5" />
          <span className="text-[11px] text-[#9CA3B5] mr-1 font-medium">Speed:</span>
          {(['fast', 'normal', 'demo'] as SimulationSpeed[]).map((spd) => (
            <button
              key={spd}
              type="button"
              disabled={isRunning}
              onClick={() => handleSpeedChange(spd)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium capitalize transition-all cursor-pointer ${
                attackConfig.speed === spd
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-[#9CA3B5] hover:text-[#F5F5F7]'
              }`}
            >
              {spd === 'demo' ? 'Demo (~12s)' : spd === 'fast' ? 'Fast (~3s)' : 'Normal (~7s)'}
            </button>
          ))}
        </div>
      </div>

      {validationError && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleLaunch} className="space-y-4">
        {/* Row 1: Source IP, Endpoint, Method */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Source IP */}
          <div>
            <label className="block text-xs font-medium text-[#9CA3B5] mb-1.5 flex items-center justify-between">
              <span>Simulated Source IP</span>
              <span className="text-[10px] text-[#6B7280] font-mono">IPv4 Client</span>
            </label>
            <input
              type="text"
              disabled={isRunning}
              value={attackConfig.sourceIp}
              onChange={(e) => {
                setValidationError(null);
                setAttackConfig(prev => ({ ...prev, sourceIp: e.target.value }));
              }}
              placeholder="198.51.100.42"
              required
              className="w-full bg-[#151B2B] border border-[#20283A] focus:border-violet-500 rounded-lg px-3 py-2 text-xs font-mono text-violet-300 placeholder-[#6B7280] focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-all"
            />
          </div>

          {/* Target Endpoint */}
          <div>
            <label className="block text-xs font-medium text-[#9CA3B5] mb-1.5 flex items-center justify-between">
              <span>Target Application Endpoint</span>
              <span className="text-[10px] text-[#6B7280] font-mono">Simulated URI</span>
            </label>
            <input
              type="text"
              disabled={isRunning}
              value={attackConfig.targetEndpoint}
              onChange={(e) => {
                setValidationError(null);
                setAttackConfig(prev => ({ ...prev, targetEndpoint: e.target.value }));
              }}
              placeholder="/login"
              required
              className="w-full bg-[#151B2B] border border-[#20283A] focus:border-violet-500 rounded-lg px-3 py-2 text-xs font-mono text-[#F5F5F7] placeholder-[#6B7280] focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-all"
            />
          </div>

          {/* HTTP Method */}
          <div>
            <label className="block text-xs font-medium text-[#9CA3B5] mb-1.5">
              HTTP Method
            </label>
            <select
              disabled={isRunning}
              value={attackConfig.method}
              onChange={(e: any) => setAttackConfig(prev => ({ ...prev, method: e.target.value }))}
              className="w-full bg-[#151B2B] border border-[#20283A] focus:border-violet-500 rounded-lg px-3 py-2 text-xs font-mono text-[#F5F5F7] focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-all"
            >
              <option value="GET">GET (Read / Query)</option>
              <option value="POST">POST (Submission / Auth)</option>
              <option value="PUT">PUT (Update)</option>
              <option value="DELETE">DELETE (Removal)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Intensity, Request Count, Payload */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          {/* Intensity */}
          <div>
            <label className="block text-xs font-medium text-[#9CA3B5] mb-1.5">
              Attack Intensity
            </label>
            <select
              disabled={isRunning}
              value={attackConfig.intensity}
              onChange={(e: any) => setAttackConfig(prev => ({ ...prev, intensity: e.target.value }))}
              className="w-full bg-[#151B2B] border border-[#20283A] focus:border-violet-500 rounded-lg px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-all"
            >
              <option value="Low">Low (Stealthy / Probing)</option>
              <option value="Medium">Medium (Active Exploit)</option>
              <option value="High">High (Aggressive Burst)</option>
            </select>
          </div>

          {/* Request Count */}
          <div>
            <label className="block text-xs font-medium text-[#9CA3B5] mb-1.5 flex items-center justify-between">
              <span>Request Volume</span>
              <span className="text-[10px] text-[#6B7280] font-mono">Count</span>
            </label>
            <input
              type="number"
              min="1"
              max="5000"
              disabled={isRunning}
              value={attackConfig.requestCount}
              onChange={(e) => {
                setValidationError(null);
                setAttackConfig(prev => ({ ...prev, requestCount: Math.max(1, parseInt(e.target.value) || 1) }));
              }}
              className="w-full bg-[#151B2B] border border-[#20283A] focus:border-violet-500 rounded-lg px-3 py-2 text-xs font-mono text-[#F5F5F7] focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-all"
            />
          </div>

          {/* Payload Pattern String */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-[#9CA3B5] mb-1.5 flex items-center justify-between">
              <span>Simulated Synthetic Payload</span>
              <span className="text-[10px] text-violet-400 font-mono">Test String</span>
            </label>
            <input
              type="text"
              disabled={isRunning}
              value={attackConfig.payload}
              onChange={(e) => setAttackConfig(prev => ({ ...prev, payload: e.target.value }))}
              className="w-full bg-[#151B2B] border border-[#20283A] focus:border-violet-500 rounded-lg px-3 py-2 text-xs font-mono text-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-all truncate"
            />
          </div>
        </div>

        {/* Action Controls & Primary Button */}
        <div className="pt-2 flex items-center gap-3">
          {isRunning ? (
            <button
              type="button"
              onClick={stopSimulation}
              className="flex-1 py-2.5 px-6 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Square className="w-4 h-4 fill-red-400 text-red-400" />
              <span>Stop Simulation</span>
            </button>
          ) : (
            <button
              type="submit"
              className="flex-1 py-2.5 px-6 rounded-lg bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] hover:from-[#5B21B6] hover:to-[#7C3AED] text-white font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-sm shadow-violet-900/30 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white text-white" />
              <span>Launch Attack Simulation</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
