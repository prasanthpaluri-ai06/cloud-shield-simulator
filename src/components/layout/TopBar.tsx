import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  RotateCcw, 
  Play, 
  Square, 
  Flame, 
  Menu
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

interface TopBarProps {
  onOpenNotifications: () => void;
  onToggleMobileMenu?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenNotifications, onToggleMobileMenu }) => {
  const { 
    simulation, 
    launchSimulation, 
    stopSimulation, 
    resetSimulator, 
    unreadNotificationCount,
    setActiveTab
  } = useSecurity();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleResetConfirm = () => {
    if (window.confirm('Reset CloudShield simulator to initial session baseline?')) {
      resetSimulator();
    }
  };

  return (
    <header className="h-16 bg-[#0B1020] border-b border-[#20283A] px-4 sm:px-6 flex items-center justify-between z-10 shrink-0 select-none">
      {/* Left: Hamburger & Environment / Live Indicators */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="p-1.5 rounded-lg text-[#9CA3B5] hover:text-[#F5F5F7] hover:bg-[#101522] lg:hidden transition-colors"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#101522] border border-[#20283A] text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          <span className="font-mono text-[#F5F5F7] text-[11px] hidden sm:inline">AWS SOC SIMULATOR</span>
          <span className="text-[10px] text-[#9CA3B5] font-mono px-1 rounded bg-[#151B2B]">US-EAST-1</span>
        </div>

        <div className="hidden xl:flex items-center gap-2 text-xs text-[#6B7280] font-mono">
          <span>TIME:</span>
          <span className="text-[#9CA3B5]">{currentTime || '18:48:46'}</span>
        </div>

        {/* Live Simulation Badge if Running */}
        {simulation.isRunning && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs">
            <Flame className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            <span className="font-medium hidden sm:inline">Simulating: {simulation.currentStageId?.toUpperCase()}</span>
            <span className="font-mono text-[11px]">[{simulation.progress}%]</span>
          </div>
        )}
      </div>

      {/* Right: Quick Controls, System Health & Notification Drawer Trigger */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Launch / Stop Buttons (Primary Violet CTA) */}
        {simulation.isRunning ? (
          <button
            onClick={stopSimulation}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-medium transition-all cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-red-400 text-red-400" />
            <span className="hidden sm:inline">Stop Simulation</span>
            <span className="sm:hidden">Stop</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setActiveTab('simulator');
              launchSimulation();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] hover:from-[#5B21B6] hover:to-[#7C3AED] text-white font-medium text-xs transition-all shadow-sm shadow-violet-900/30 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span className="hidden sm:inline">Launch Attack</span>
            <span className="sm:hidden">Launch</span>
          </button>
        )}

        {/* Reset Simulator Button */}
        <button
          onClick={handleResetConfirm}
          title="Reset simulator session state"
          className="p-2 rounded-lg bg-[#101522] hover:bg-[#151B2B] text-[#9CA3B5] hover:text-[#F5F5F7] border border-[#20283A] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Notifications Icon Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg bg-[#101522] hover:bg-[#151B2B] text-[#9CA3B5] hover:text-[#F5F5F7] border border-[#20283A] transition-colors cursor-pointer"
          title="SNS Security Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white font-mono shadow-sm">
              {unreadNotificationCount}
            </span>
          )}
        </button>

        {/* SOC Security Officer Profile */}
        <div className="hidden lg:flex items-center gap-2.5 pl-2 border-l border-[#20283A]">
          <div className="w-7 h-7 rounded-full bg-[#151B2B] border border-[#20283A] flex items-center justify-center text-violet-300 text-xs font-medium">
            SOC
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-[#F5F5F7] leading-tight">SecOps Analyst</p>
            <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Online
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
