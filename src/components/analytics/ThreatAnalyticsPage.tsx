import React, { useMemo } from 'react';
import { 
  BarChart3, 
  PieChart, 
  Flame, 
  ShieldAlert, 
  Target, 
  Globe, 
  Cpu, 
  TrendingUp,
  Ban,
  AlertOctagon,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

export const ThreatAnalyticsPage: React.FC = () => {
  const { events, metrics, blockedIps, setSelectedIpModal, setActiveTab } = useSecurity();

  // Compute Attack Scenario Breakdown
  const scenarioCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'SQL Injection': 0,
      'Cross-Site Scripting': 0,
      'Brute Force': 0,
      'DDoS / Traffic Spike': 0,
      'Unauthorized Access': 0,
      'Port Scan': 0,
      'Normal Request': 0
    };

    events.forEach(e => {
      const type = e.attackType;
      if (type.includes('SQL')) counts['SQL Injection']++;
      else if (type.includes('XSS') || type.includes('Cross')) counts['Cross-Site Scripting']++;
      else if (type.includes('Brute') || type.includes('Authentication')) counts['Brute Force']++;
      else if (type.includes('DDoS') || type.includes('Volumetric')) counts['DDoS / Traffic Spike']++;
      else if (type.includes('Unauthorized') || type.includes('Access')) counts['Unauthorized Access']++;
      else if (type.includes('Scan') || type.includes('Reconnaissance')) counts['Port Scan']++;
      else counts['Normal Request']++;
    });

    return counts;
  }, [events]);

  // Compute Severity Distribution
  const severityCounts = useMemo(() => {
    const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    events.forEach(e => {
      if (counts[e.severity] !== undefined) {
        counts[e.severity]++;
      }
    });
    return counts;
  }, [events]);

  // Compute Top Target Endpoints
  const endpointCounts = useMemo(() => {
    const map: Record<string, { count: number; threats: number }> = {};
    events.forEach(e => {
      if (!map[e.target]) {
        map[e.target] = { count: 0, threats: 0 };
      }
      map[e.target].count++;
      if (e.threatScore > 24) {
        map[e.target].threats++;
      }
    });
    return Object.entries(map).sort((a, b) => b[1].count - a[1].count).slice(0, 6);
  }, [events]);

  // Compute Top Source IPs
  const topIps = useMemo(() => {
    const map: Record<string, { count: number; maxScore: number; attackTypes: Set<string> }> = {};
    events.forEach(e => {
      if (!map[e.sourceIp]) {
        map[e.sourceIp] = { count: 0, maxScore: 0, attackTypes: new Set() };
      }
      map[e.sourceIp].count++;
      map[e.sourceIp].maxScore = Math.max(map[e.sourceIp].maxScore, e.threatScore);
      map[e.sourceIp].attackTypes.add(e.attackType);
    });
    return Object.entries(map)
      .map(([ip, data]) => ({ ip, count: data.count, maxScore: data.maxScore, attackType: Array.from(data.attackTypes).join(', ') }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [events]);

  // Recent Critical / High Threats
  const recentCriticalThreats = useMemo(() => {
    return events.filter(e => e.severity === 'CRITICAL' || e.severity === 'HIGH').slice(0, 4);
  }, [events]);

  const maxScenarioCount = Math.max(...Object.values(scenarioCounts), 1);
  const totalSeverities = Math.max(events.length, 1);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#101522] border border-[#20283A] rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#F5F5F7]">Threat Analytics & Heuristic Insights</h2>
            <p className="text-xs text-[#6B7280]">
              Aggregated attack patterns derived directly from the simulation event dataset
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-[#8B5CF6] bg-[#0B1020] px-3 py-1.5 rounded-lg border border-[#20283A] font-medium">
          Total Sampled Events: {events.length}
        </span>
      </div>

      {/* Row 1: Key Distribution Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card 1: Attack Type Distribution */}
        <div className="bg-[#101522] border border-[#20283A] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider mb-1 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#8B5CF6]" />
              Attack Scenarios Breakdown
            </h3>
            <p className="text-[11px] text-[#6B7280] mb-4">Volume per attack category in current dataset</p>

            <div className="space-y-3">
              {Object.entries(scenarioCounts).map(([cat, count]) => {
                const pct = ((count / Math.max(1, events.length)) * 100).toFixed(0);
                const barWidth = (count / maxScenarioCount) * 100;
                const isNormal = cat === 'Normal Request';

                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-medium ${isNormal ? 'text-emerald-400' : 'text-[#F5F5F7]'}`}>
                        {cat}
                      </span>
                      <span className="font-mono text-[#6B7280] text-[11px]">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#080B14] rounded-full h-2 overflow-hidden border border-[#20283A]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isNormal 
                            ? 'bg-emerald-500' 
                            : cat.includes('SQL') || cat.includes('DDoS')
                            ? 'bg-rose-500' 
                            : 'bg-[#8B5CF6]'
                        }`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card 2: Severity Distribution */}
        <div className="bg-[#101522] border border-[#20283A] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider mb-1 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              AI Severity Score Distribution
            </h3>
            <p className="text-[11px] text-[#6B7280] mb-4">Proportion of events classified by AI Threat Engine</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-center">
                <span className="text-[10px] text-rose-400 uppercase font-semibold block">CRITICAL (75-100)</span>
                <span className="text-xl font-mono font-bold text-[#F5F5F7]">{severityCounts.CRITICAL}</span>
                <span className="text-[10px] text-[#6B7280] block font-mono">
                  {((severityCounts.CRITICAL / totalSeverities) * 100).toFixed(1)}%
                </span>
              </div>

              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-center">
                <span className="text-[10px] text-amber-400 uppercase font-semibold block">HIGH (50-74)</span>
                <span className="text-xl font-mono font-bold text-[#F5F5F7]">{severityCounts.HIGH}</span>
                <span className="text-[10px] text-[#6B7280] block font-mono">
                  {((severityCounts.HIGH / totalSeverities) * 100).toFixed(1)}%
                </span>
              </div>

              <div className="p-3 bg-sky-500/10 rounded-xl border border-sky-500/20 text-center">
                <span className="text-[10px] text-sky-400 uppercase font-semibold block">MEDIUM (25-49)</span>
                <span className="text-xl font-mono font-bold text-[#F5F5F7]">{severityCounts.MEDIUM}</span>
                <span className="text-[10px] text-[#6B7280] block font-mono">
                  {((severityCounts.MEDIUM / totalSeverities) * 100).toFixed(1)}%
                </span>
              </div>

              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-center">
                <span className="text-[10px] text-emerald-400 uppercase font-semibold block">LOW (0-24)</span>
                <span className="text-xl font-mono font-bold text-[#F5F5F7]">{severityCounts.LOW}</span>
                <span className="text-[10px] text-[#6B7280] block font-mono">
                  {((severityCounts.LOW / totalSeverities) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#0B1020] rounded-xl border border-[#20283A] text-xs text-[#9CA3B5]">
              <span className="text-[#8B5CF6] font-medium block mb-0.5">SOC Enforcement Policy:</span>
              <span>Critical events automatically trigger SNS alerts and AWS WAF IPSet isolation blocks.</span>
            </div>
          </div>
        </div>

        {/* Card 3: Blocked vs Allowed Ratio */}
        <div className="bg-[#101522] border border-[#20283A] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider mb-1 flex items-center gap-2">
              <Ban className="w-4 h-4 text-[#8B5CF6]" />
              Mitigation vs Passage Ratio
            </h3>
            <p className="text-[11px] text-[#6B7280] mb-4">Traffic disposition across AWS WAF perimeter</p>

            <div className="space-y-4">
              <div className="p-4 bg-[#0B1020] rounded-xl border border-[#20283A] flex items-center justify-around text-center">
                <div>
                  <span className="text-[10px] text-[#6B7280] uppercase block font-medium">Blocked Traffic</span>
                  <span className="text-2xl font-mono font-bold text-rose-400">
                    {metrics.blockedRequests.toLocaleString()}
                  </span>
                </div>
                <div className="h-10 w-[1px] bg-[#20283A]" />
                <div>
                  <span className="text-[10px] text-[#6B7280] uppercase block font-medium">Allowed Traffic</span>
                  <span className="text-2xl font-mono font-bold text-emerald-400">
                    {metrics.allowedRequests.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-rose-400 font-medium">Blocked: {((metrics.blockedRequests / Math.max(1, metrics.totalRequests)) * 100).toFixed(1)}%</span>
                  <span className="text-emerald-400 font-medium">Allowed: {((metrics.allowedRequests / Math.max(1, metrics.totalRequests)) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-[#080B14] rounded-full h-3 overflow-hidden border border-[#20283A] flex">
                  <div
                    className="bg-rose-500 h-full transition-all"
                    style={{ width: `${(metrics.blockedRequests / Math.max(1, metrics.totalRequests)) * 100}%` }}
                  />
                  <div
                    className="bg-emerald-500 h-full transition-all"
                    style={{ width: `${(metrics.allowedRequests / Math.max(1, metrics.totalRequests)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#20283A] text-[11px] text-[#6B7280] font-mono">
            Active Blocklist Size: <strong className="text-[#F5F5F7] font-semibold">{blockedIps.length} hosts</strong>
          </div>
        </div>
      </div>

      {/* Row 2: Target Endpoints, Top Attack Sources & Recent Critical Threats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Most Targeted Endpoints */}
        <div className="bg-[#101522] border border-[#20283A] rounded-xl p-5">
          <h3 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider mb-1 flex items-center gap-2">
            <Target className="w-4 h-4 text-[#8B5CF6]" />
            Most Targeted Endpoints
          </h3>
          <p className="text-[11px] text-[#6B7280] mb-4">Simulated API routes receiving probes</p>

          <div className="space-y-2.5">
            {endpointCounts.map(([target, data]) => (
              <div key={target} className="p-3 bg-[#0B1020] rounded-xl border border-[#20283A] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-[#F5F5F7]">{target}</span>
                  {data.threats > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                      {data.threats} Threats
                    </span>
                  )}
                </div>
                <span className="font-mono text-[#6B7280] text-xs">
                  {data.count} Hits
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Malicious Source IPs */}
        <div className="bg-[#101522] border border-[#20283A] rounded-xl p-5">
          <h3 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider mb-1 flex items-center gap-2">
            <Globe className="w-4 h-4 text-rose-400" />
            Top Malicious Source IPs
          </h3>
          <p className="text-[11px] text-[#6B7280] mb-4">Frequent host addresses generating violations</p>

          <div className="space-y-2.5">
            {topIps.map((item) => (
              <div
                key={item.ip}
                onClick={() => {
                  const matched = blockedIps.find(b => b.ip === item.ip);
                  if (matched) setSelectedIpModal(matched);
                }}
                className="p-3 bg-[#0B1020] hover:bg-[#151B2B] rounded-xl border border-[#20283A] hover:border-[#8B5CF6]/40 flex items-center justify-between text-xs cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-[#8B5CF6]">{item.ip}</span>
                  </div>
                  <span className="text-[10px] text-[#6B7280] truncate block max-w-[160px]">
                    {item.attackType}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                    {item.maxScore}/100
                  </span>
                  <span className="font-mono text-[#9CA3B5] font-medium">
                    {item.count} evts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Critical Threats */}
        <div className="bg-[#101522] border border-[#20283A] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider mb-1 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              Recent Critical Threat Events
            </h3>
            <p className="text-[11px] text-[#6B7280] mb-4">Latest high-risk incidents analyzed by AI</p>

            <div className="space-y-2.5">
              {recentCriticalThreats.map((evt) => (
                <div key={evt.eventId} className="p-3 bg-[#0B1020] rounded-xl border border-[#20283A] text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-medium text-[#8B5CF6]">{evt.eventId}</span>
                      <span className="font-medium text-[#F5F5F7]">{evt.attackType}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                      {evt.severity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#6B7280] font-mono">
                    <span>IP: {evt.sourceIp}</span>
                    <span className="text-[#8B5CF6]">{evt.finalAction}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#20283A] flex justify-between items-center text-xs">
            <span className="text-[#6B7280] font-mono">{recentCriticalThreats.length} Critical Flagged</span>
            <button
              onClick={() => setActiveTab('logs')}
              className="text-[#8B5CF6] hover:text-[#A78BFA] font-medium flex items-center gap-1 transition-colors"
            >
              <span>Full Audit Logs</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
