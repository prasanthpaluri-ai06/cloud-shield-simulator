import React from 'react';
import { 
  X, 
  Bell, 
  Check, 
  Trash2, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  ExternalLink 
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    dismissNotification, 
    markAllNotificationsRead, 
    setActiveTab, 
    setSelectedIpModal, 
    blockedIps 
  } = useSecurity();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-[#101522] border-l border-[#20283A] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#20283A] bg-[#0B1020] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#F5F5F7] flex items-center gap-2">
                SNS Security Alerts
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#151B2B] text-[#9CA3B5] border border-[#20283A] font-normal">
                  {notifications.length}
                </span>
              </h2>
              <p className="text-[11px] text-[#6B7280]">Simulated Amazon SNS Incident Feed</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-[#8B5CF6] hover:text-[#A78BFA] flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-[#151B2B] transition-colors"
                title="Mark all as read"
              >
                <Check className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">Read All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#F5F5F7] hover:bg-[#151B2B] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#20283A] rounded-xl">
              <Bell className="w-9 h-9 text-[#6B7280] mb-3" />
              <p className="text-sm font-medium text-[#9CA3B5]">No Security Alerts</p>
              <p className="text-xs text-[#6B7280] mt-1">
                SNS alerts will be fanned out here in real-time when critical threats are detected.
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isCritical = notif.severity === 'CRITICAL';
              const isHigh = notif.severity === 'HIGH';

              return (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    !notif.read
                      ? 'bg-[#151B2B] border-rose-500/40 shadow-sm shadow-rose-500/5'
                      : 'bg-[#0B1020]/60 border-[#20283A] opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {isCritical ? (
                        <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                      ) : isHigh ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <Info className="w-4 h-4 text-sky-400 shrink-0" />
                      )}
                      <span className="text-xs font-semibold text-[#F5F5F7] line-clamp-1">
                        {notif.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#6B7280] shrink-0">
                      {notif.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-[#9CA3B5] mb-3 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#20283A]">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[#6B7280]">IP:</span>
                      <button
                        onClick={() => {
                          const matched = blockedIps.find(b => b.ip === notif.sourceIp);
                          if (matched) {
                            setSelectedIpModal(matched);
                          }
                        }}
                        className="text-[#8B5CF6] hover:text-[#A78BFA] hover:underline font-medium"
                      >
                        {notif.sourceIp}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                        {notif.actionTaken}
                      </span>
                      <button
                        onClick={() => dismissNotification(notif.id)}
                        className="text-[#6B7280] hover:text-[#9CA3B5] p-1 rounded hover:bg-[#20283A] transition-colors"
                        title="Dismiss notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#0B1020] border-t border-[#20283A] flex items-center justify-between text-xs">
          <span className="text-[#6B7280]">SNS Topic: <code className="text-[#9CA3B5] font-mono text-[11px]">cloudshield-soc-critical-alerts</code></span>
          <button
            onClick={() => {
              setActiveTab('logs');
              onClose();
            }}
            className="text-[#8B5CF6] hover:text-[#A78BFA] font-medium flex items-center gap-1 transition-colors"
          >
            <span>View All Logs</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
