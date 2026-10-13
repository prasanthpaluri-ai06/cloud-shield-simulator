import React, { useState } from 'react';
import { 
  Ban, 
  Search, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  ShieldAlert, 
  Eye, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

export const BlockedIpsPage: React.FC = () => {
  const { blockedIps, unblockIp, blockIpManual, setSelectedIpModal } = useSecurity();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [manualIp, setManualIp] = useState('');
  const [manualReason, setManualReason] = useState('');

  const filteredIps = blockedIps.filter(b => 
    b.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.attackType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualIp.trim()) {
      blockIpManual(manualIp.trim(), manualReason.trim() || 'Manual SOC operator block rule');
      setManualIp('');
      setManualReason('');
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#101522] border border-[#20283A] rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Ban className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#F5F5F7]">AWS WAF Blocked IP Sets</h2>
            <p className="text-xs text-[#6B7280]">
              Active IP addresses blocked at the edge based on critical threat score threshold evaluations
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom IP Block</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#101522] border border-[#20283A] rounded-xl p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter blocked IP, reason, or attack type..."
            className="w-full bg-[#080B14] border border-[#20283A] focus:border-[#8B5CF6] rounded-lg pl-9 pr-3 py-2 text-xs text-[#F5F5F7] placeholder-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]/30 transition-colors"
          />
        </div>
      </div>

      {/* Blocked IP Table */}
      <div className="bg-[#101522] border border-[#20283A] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0B1020] text-[#6B7280] border-b border-[#20283A] font-mono text-[11px] uppercase tracking-wider select-none">
                <th className="p-3.5 pl-4">Blocked IP Address</th>
                <th className="p-3.5">Attack Scenario</th>
                <th className="p-3.5">Block Trigger Reason</th>
                <th className="p-3.5">First Detected</th>
                <th className="p-3.5">Last Detected</th>
                <th className="p-3.5 text-center">Threat Score</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#20283A]/60">
              {filteredIps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#6B7280]">
                    No blocked IP addresses currently active in simulated AWS WAF IPSet.
                  </td>
                </tr>
              ) : (
                filteredIps.map((item) => (
                  <tr key={item.ip} className="hover:bg-[#151B2B]/60 transition-colors">
                    <td className="p-3.5 pl-4 font-mono font-medium text-rose-400">
                      {item.ip}
                    </td>
                    <td className="p-3.5 font-medium text-[#F5F5F7]">
                      {item.attackType}
                    </td>
                    <td className="p-3.5 text-[#9CA3B5] max-w-xs truncate">
                      {item.reason}
                    </td>
                    <td className="p-3.5 font-mono text-[#6B7280] text-[11px]">
                      {item.firstDetected}
                    </td>
                    <td className="p-3.5 font-mono text-[#6B7280] text-[11px]">
                      {item.lastDetected}
                    </td>
                    <td className="p-3.5 text-center font-mono font-semibold text-rose-400">
                      {item.threatScore} / 100
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 pr-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedIpModal(item)}
                          className="px-2.5 py-1 rounded-lg bg-[#151B2B] hover:bg-[#1E2638] text-[#F5F5F7] border border-[#20283A] text-xs font-medium flex items-center gap-1 transition-colors"
                          title="Inspect IP details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                        <button
                          onClick={() => unblockIp(item.ip)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium flex items-center gap-1 transition-colors"
                          title="Unblock IP from simulator"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Unblock</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#0B1020] border-t border-[#20283A] flex items-center justify-between text-xs text-[#6B7280] font-mono">
          <span>Active IPSet count: {filteredIps.length} entries</span>
          <span className="text-[11px] text-[#6B7280]">Unblocking updates simulator state only</span>
        </div>
      </div>

      {/* Manual Block IP Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#101522] border border-[#20283A] rounded-2xl p-5 shadow-2xl">
            <h3 className="text-sm font-semibold text-[#F5F5F7] mb-1">Add Manual IP to Blocklist</h3>
            <p className="text-xs text-[#6B7280] mb-4">
              Add a synthetic IP address directly to the AWS WAF IPSet rule.
            </p>

            <form onSubmit={handleManualAdd} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#9CA3B5] mb-1">IP Address</label>
                <input
                  type="text"
                  required
                  placeholder="203.0.113.99"
                  value={manualIp}
                  onChange={(e) => setManualIp(e.target.value)}
                  className="w-full bg-[#080B14] border border-[#20283A] focus:border-[#8B5CF6] rounded-lg px-3 py-2 text-xs font-mono text-[#8B5CF6] placeholder-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9CA3B5] mb-1">Reason for Block</label>
                <input
                  type="text"
                  placeholder="Manual SOC operator isolation rule"
                  value={manualReason}
                  onChange={(e) => setManualReason(e.target.value)}
                  className="w-full bg-[#080B14] border border-[#20283A] focus:border-[#8B5CF6] rounded-lg px-3 py-2 text-xs text-[#F5F5F7] placeholder-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]/30 transition-colors"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#151B2B] hover:bg-[#1E2638] text-[#F5F5F7] border border-[#20283A] text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-sm transition-colors"
                >
                  Confirm Block IP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
