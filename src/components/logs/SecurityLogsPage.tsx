import React, { useState, useMemo } from 'react';
import { 
  ListFilter, 
  Search, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Ban, 
  ShieldCheck, 
  ShieldAlert, 
  Cpu, 
  ExternalLink,
  Filter,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';
import { SecurityEvent } from '../../types/security';

export const SecurityLogsPage: React.FC = () => {
  const { events, setSelectedIpModal, blockedIps } = useSecurity();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAttackFilter, setSelectedAttackFilter] = useState('ALL');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState('ALL');
  const [selectedActionFilter, setSelectedActionFilter] = useState('ALL');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQuery = 
          evt.eventId.toLowerCase().includes(query) ||
          evt.sourceIp.toLowerCase().includes(query) ||
          evt.target.toLowerCase().includes(query) ||
          evt.attackType.toLowerCase().includes(query) ||
          evt.wafRule.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // Attack Filter
      if (selectedAttackFilter !== 'ALL' && evt.attackTypeId !== selectedAttackFilter) {
        return false;
      }

      // Severity Filter
      if (selectedSeverityFilter !== 'ALL' && evt.severity !== selectedSeverityFilter) {
        return false;
      }

      // Action Filter
      if (selectedActionFilter !== 'ALL' && evt.finalAction !== selectedActionFilter) {
        return false;
      }

      return true;
    });
  }, [events, searchQuery, selectedAttackFilter, selectedSeverityFilter, selectedActionFilter]);

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(events, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cloudshield_security_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCsv = () => {
    const headers = ['Event ID', 'Timestamp', 'Source IP', 'Attack Type', 'Target', 'Method', 'Severity', 'Threat Score', 'WAF Action', 'Final Action', 'Status'];
    const rows = filteredEvents.map(e => [
      e.eventId,
      e.timestamp,
      e.sourceIp,
      `"${e.attackType}"`,
      `"${e.target}"`,
      e.method,
      e.severity,
      e.threatScore,
      e.wafAction,
      e.finalAction,
      e.finalStatus
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cloudshield_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20 font-medium';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20 font-medium';
      case 'MEDIUM':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20 font-medium';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-medium';
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'BLOCK':
      case 'BLOCK_ALERT':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20 font-medium';
      case 'RATE_LIMIT':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20 font-medium';
      case 'FLAG':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20 font-medium';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-medium';
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#101522] border border-[#20283A] rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20">
            <ListFilter className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#F5F5F7]">Security Event Logs</h2>
            <p className="text-xs text-[#6B7280]">
              Audit log of all evaluated requests stored in simulated DynamoDB table (<code className="text-[#9CA3B5] font-mono">CloudShield_SecurityEvents</code>)
            </p>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-lg bg-[#151B2B] hover:bg-[#1E2638] text-[#F5F5F7] border border-[#20283A] text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 rounded-lg bg-[#151B2B] hover:bg-[#1E2638] text-[#8B5CF6] border border-[#20283A] text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#101522] border border-[#20283A] rounded-xl p-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search IP, Event ID, Target..."
            className="w-full bg-[#080B14] border border-[#20283A] focus:border-[#8B5CF6] rounded-lg pl-9 pr-3 py-2 text-xs text-[#F5F5F7] placeholder-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]/30 transition-colors"
          />
        </div>

        {/* Attack Type Filter */}
        <select
          value={selectedAttackFilter}
          onChange={(e) => setSelectedAttackFilter(e.target.value)}
          className="bg-[#080B14] border border-[#20283A] rounded-lg px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none focus:border-[#8B5CF6] transition-colors cursor-pointer"
        >
          <option value="ALL">All Attack Scenarios</option>
          <option value="sqli">SQL Injection</option>
          <option value="xss">Cross-Site Scripting</option>
          <option value="bruteforce">Brute Force</option>
          <option value="ddos">DDoS / Traffic Spike</option>
          <option value="unauthorized">Unauthorized Access</option>
          <option value="portscan">Port Scan</option>
          <option value="normal">Normal Request</option>
        </select>

        {/* Severity Filter */}
        <select
          value={selectedSeverityFilter}
          onChange={(e) => setSelectedSeverityFilter(e.target.value)}
          className="bg-[#080B14] border border-[#20283A] rounded-lg px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none focus:border-[#8B5CF6] transition-colors cursor-pointer"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        {/* Action Filter */}
        <select
          value={selectedActionFilter}
          onChange={(e) => setSelectedActionFilter(e.target.value)}
          className="bg-[#080B14] border border-[#20283A] rounded-lg px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none focus:border-[#8B5CF6] transition-colors cursor-pointer"
        >
          <option value="ALL">All Final Actions</option>
          <option value="BLOCK_ALERT">BLOCK_ALERT</option>
          <option value="BLOCK">BLOCK</option>
          <option value="RATE_LIMIT">RATE_LIMIT</option>
          <option value="FLAG">FLAG</option>
          <option value="ALLOW">ALLOW</option>
        </select>
      </div>

      {/* Main Table */}
      <div className="bg-[#101522] border border-[#20283A] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0B1020] text-[#6B7280] border-b border-[#20283A] font-mono text-[11px] uppercase tracking-wider select-none">
                <th className="p-3.5 pl-4">Event ID</th>
                <th className="p-3.5">Time (UTC)</th>
                <th className="p-3.5">Source IP</th>
                <th className="p-3.5">Attack Scenario</th>
                <th className="p-3.5">Target Endpoint</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5 text-center">Threat Score</th>
                <th className="p-3.5">WAF Action</th>
                <th className="p-3.5">Final Action</th>
                <th className="p-3.5 pr-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#20283A]/60">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-[#6B7280]">
                    No security events found matching current search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => {
                  const isExpanded = expandedEventId === evt.eventId;

                  return (
                    <React.Fragment key={evt.eventId}>
                      <tr 
                        className={`hover:bg-[#151B2B]/60 transition-colors ${
                          isExpanded ? 'bg-[#151B2B]/40' : ''
                        }`}
                      >
                        <td className="p-3.5 pl-4 font-mono font-medium text-[#8B5CF6]">
                          {evt.eventId}
                        </td>
                        <td className="p-3.5 font-mono text-[#6B7280] text-[11px] whitespace-nowrap">
                          {evt.timestamp}
                        </td>
                        <td className="p-3.5 font-mono">
                          <button
                            onClick={() => {
                              const matched = blockedIps.find(b => b.ip === evt.sourceIp);
                              if (matched) setSelectedIpModal(matched);
                            }}
                            className="text-[#F5F5F7] hover:text-[#8B5CF6] hover:underline transition-colors"
                          >
                            {evt.sourceIp}
                          </button>
                        </td>
                        <td className="p-3.5 font-medium text-[#F5F5F7]">
                          {evt.attackType}
                        </td>
                        <td className="p-3.5 font-mono text-[#9CA3B5]">
                          <span className="text-[#6B7280] mr-1">[{evt.method}]</span>
                          {evt.target}
                        </td>
                        <td className="p-3.5">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getSeverityBadge(evt.severity)}`}>
                            {evt.severity}
                          </span>
                        </td>
                        <td className="p-3.5 text-center font-mono font-semibold text-[#F5F5F7]">
                          {evt.threatScore} / 100
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-[#9CA3B5]">
                          {evt.wafAction}
                        </td>
                        <td className="p-3.5">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getActionBadge(evt.finalAction)}`}>
                            {evt.finalAction}
                          </span>
                        </td>
                        <td className="p-3.5 pr-4 text-right">
                          <button
                            onClick={() => setExpandedEventId(isExpanded ? null : evt.eventId)}
                            className="p-1 rounded bg-[#151B2B] hover:bg-[#1E2638] text-[#9CA3B5] hover:text-[#F5F5F7] transition-colors"
                            title="Expand DynamoDB item details"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Row: Full DynamoDB JSON + AI Reason Checklist */}
                      {isExpanded && (
                        <tr className="bg-[#0B1020]">
                          <td colSpan={10} className="p-4 border-t border-[#20283A]">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              {/* Left: AI Reasoning Breakdown */}
                              <div className="bg-[#101522] p-4 rounded-xl border border-[#20283A]">
                                <h4 className="text-xs font-semibold text-[#8B5CF6] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                  <Cpu className="w-4 h-4 text-[#8B5CF6]" />
                                  AI Heuristic Reasoning Analysis
                                </h4>
                                <div className="space-y-1.5 mb-3">
                                  {evt.aiReason.map((r, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs text-[#9CA3B5]">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                      <span>{r}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="pt-2 border-t border-[#20283A] text-xs">
                                  <span className="text-[#6B7280] block mb-1">Recommended Action:</span>
                                  <span className="text-[#8B5CF6] font-medium">{evt.recommendedAction}</span>
                                </div>
                              </div>

                              {/* Right: Full JSON Payload */}
                              <div className="bg-[#101522] p-4 rounded-xl border border-[#20283A] font-mono text-[11px]">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[#6B7280] uppercase font-medium">DynamoDB Record Payload</span>
                                  <span className="text-[#6B7280]">Table: CloudShield_SecurityEvents</span>
                                </div>
                                <pre className="text-[#9CA3B5] max-h-48 overflow-y-auto p-2.5 bg-[#080B14] rounded-lg border border-[#20283A]">
                                  {JSON.stringify(evt, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#0B1020] border-t border-[#20283A] flex items-center justify-between text-xs text-[#6B7280] font-mono">
          <span>Showing {filteredEvents.length} of {events.length} security events</span>
          <span>Amazon DynamoDB Query Status: 200 OK</span>
        </div>
      </div>
    </div>
  );
};
