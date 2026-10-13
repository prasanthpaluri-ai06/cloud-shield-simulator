import React from 'react';
import { 
  Shield, 
  PlaySquare, 
  ListFilter, 
  BarChart3, 
  Ban, 
  Activity, 
  Server,
  X,
  Play
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { activeTab, setActiveTab, blockedIps, events, simulation } = useSecurity();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Activity,
      badge: null
    },
    {
      id: 'simulator',
      label: 'Attack Simulator',
      icon: PlaySquare,
      badge: simulation.isRunning ? 'RUNNING' : null,
      badgeColor: 'bg-violet-500/10 text-violet-300 border-violet-500/30'
    },
    {
      id: 'logs',
      label: 'Security Logs',
      icon: ListFilter,
      badge: events.length.toString(),
      badgeColor: 'bg-[#151B2B] text-[#9CA3B5] border-[#20283A]'
    },
    {
      id: 'analytics',
      label: 'Threat Analytics',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'blocked',
      label: 'Blocked IPs',
      icon: Ban,
      badge: blockedIps.length.toString(),
      badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20'
    },
    {
      id: 'monitoring',
      label: 'System Monitoring',
      icon: Server,
      badge: '6/6 OK',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#0B1020] border-r border-[#20283A] flex flex-col justify-between shrink-0 select-none transition-transform duration-200 ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Brand & Logo */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-[#20283A]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-sm shadow-violet-500/20">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm tracking-tight text-[#F5F5F7]">CloudShield</span>
                  <span className="text-[10px] uppercase font-mono font-medium px-1.5 py-0.2 rounded bg-[#151B2B] text-violet-300 border border-[#20283A]">SOC</span>
                </div>
                <p className="text-[11px] text-[#6B7280]">Security Architecture</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-md text-[#9CA3B5] hover:text-white lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-[#151B2B] text-violet-300 border border-violet-500/30 shadow-sm'
                      : 'text-[#9CA3B5] hover:text-[#F5F5F7] hover:bg-[#101522]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-violet-400' : 'text-[#6B7280] group-hover:text-[#9CA3B5]'
                    }`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Simulator Status Card at Sidebar Bottom */}
        <div className="p-3 border-t border-[#20283A]">
          <div className="p-3 rounded-lg bg-[#101522] border border-[#20283A] text-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-medium text-[#F5F5F7] text-xs">Simulator Engine</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#151B2B] text-emerald-400 font-medium">READY</span>
            </div>
            <p className="text-[11px] text-[#9CA3B5] leading-relaxed mb-2.5">
              AWS security pipeline with AI Threat Engine active.
            </p>
            <button
              onClick={() => handleNavClick('simulator')}
              className="w-full py-1.5 px-2 bg-violet-600/10 hover:bg-violet-600/20 text-violet-300 border border-violet-500/20 hover:border-violet-500/40 rounded-md text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Play className="w-3 h-3 fill-violet-400 text-violet-400" />
              <span>Open Simulator</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
