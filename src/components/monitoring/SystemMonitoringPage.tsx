import React, { useMemo } from 'react';
import { 
  Server, 
  ShieldAlert, 
  Cpu, 
  Zap, 
  Database, 
  LineChart, 
  Bell, 
  CheckCircle2, 
  Activity, 
  Radio, 
  HardDrive, 
  Layers, 
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';

export const SystemMonitoringPage: React.FC = () => {
  const { services, metrics, events, setSelectedServiceModal } = useSecurity();

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'waf': return ShieldAlert;
      case 'ai': return Cpu;
      case 'lambda': return Zap;
      case 'dynamodb': return Database;
      case 'cloudwatch': return LineChart;
      case 'sns': return Bell;
      default: return Activity;
    }
  };

  const serviceList = Object.values(services);

  // Derive dynamic CloudWatch telemetry from actual session events
  const avgLambdaDuration = useMemo(() => {
    const malicious = events.filter(e => e.lambdaStatus === 'SUCCESS');
    return malicious.length > 0 ? 32 : 0;
  }, [events]);

  const recentDdosOrCritical = useMemo(() => {
    return events.slice(0, 5).some(e => e.severity === 'CRITICAL' && e.attackTypeId === 'ddos');
  }, [events]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#101522] border border-[#20283A] rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#F5F5F7]">AWS Cloud Services & Telemetry Monitoring</h2>
            <p className="text-xs text-[#6B7280]">
              Simulated Amazon CloudWatch observability metrics across all architecture subsystems
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ALL 6 SERVICES ONLINE
          </span>
        </div>
      </div>

      {/* CloudWatch Key Telemetry Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 bg-[#101522] border border-[#20283A] rounded-xl">
          <span className="text-[11px] text-[#6B7280] font-medium uppercase block mb-1">Request Ingestion Rate</span>
          <div className="text-xl font-mono font-bold text-[#8B5CF6] mb-1">
            {metrics.requestsPerMinute} req/min
          </div>
          <span className="text-[10px] text-[#6B7280] font-mono">AWS/WAF Metric Namespace</span>
        </div>

        <div className="p-4 bg-[#101522] border border-[#20283A] rounded-xl">
          <span className="text-[11px] text-[#6B7280] font-medium uppercase block mb-1">Avg Lambda Execution</span>
          <div className="text-xl font-mono font-bold text-emerald-400 mb-1">
            {avgLambdaDuration > 0 ? `${avgLambdaDuration} ms` : 'Bypassed (Benign)'}
          </div>
          <span className="text-[10px] text-[#6B7280] font-mono">AWS/Lambda Duration</span>
        </div>

        <div className="p-4 bg-[#101522] border border-[#20283A] rounded-xl">
          <span className="text-[11px] text-[#6B7280] font-medium uppercase block mb-1">DynamoDB Consumed Capacity</span>
          <div className="text-xl font-mono font-bold text-[#8B5CF6] mb-1">
            {events.length} WCU Total
          </div>
          <span className="text-[10px] text-[#6B7280] font-mono">AWS/DynamoDB (1 WCU/item)</span>
        </div>

        <div className="p-4 bg-[#101522] border border-[#20283A] rounded-xl">
          <span className="text-[11px] text-[#6B7280] font-medium uppercase block mb-1">CloudWatch Active Alarms</span>
          <div className={`text-xl font-mono font-bold mb-1 ${recentDdosOrCritical ? 'text-rose-400' : 'text-emerald-400'}`}>
            {recentDdosOrCritical ? '1 IN ALARM' : '0 IN ALARM (2 OK)'}
          </div>
          <span className="text-[10px] text-[#6B7280] font-mono">
            {recentDdosOrCritical ? 'HighVolumeFloodAlarm (Triggered)' : 'HighVolumeFloodAlarm (OK)'}
          </span>
        </div>
      </div>

      {/* Services Detailed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {serviceList.map((srv) => {
          const Icon = getServiceIcon(srv.id);

          return (
            <div
              key={srv.id}
              className="p-5 rounded-xl bg-[#101522] border border-[#20283A] hover:border-[#8B5CF6]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#0B1020] border border-[#20283A] text-[#8B5CF6]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-[#F5F5F7]">{srv.serviceName}</h3>
                      <span className="text-[10px] text-[#6B7280] font-mono block">
                        {srv.awsEquivalent}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ● {srv.status}
                  </span>
                </div>

                <p className="text-xs text-[#9CA3B5] leading-relaxed mb-4 p-3 bg-[#0B1020] rounded-xl border border-[#20283A]">
                  {srv.description}
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-[#0B1020] rounded-lg border border-[#20283A]/40">
                    <span className="text-[#6B7280]">Current Operation</span>
                    <span className="font-mono text-[#F5F5F7] text-[11px] font-medium truncate max-w-[180px]">
                      {srv.currentOperation}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#0B1020] rounded-lg border border-[#20283A]/40">
                    <span className="text-[#6B7280]">{srv.metricsLabel}</span>
                    <span className="font-mono text-[#F5F5F7] font-semibold">
                      {srv.metricsValue}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#0B1020] rounded-lg border border-[#20283A]/40">
                    <span className="text-[#6B7280]">Total Lifecycle Events</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      {srv.eventCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#20283A] flex items-center justify-between">
                <span className="text-[10px] text-[#6B7280] font-mono">Last activity: {srv.lastActivity}</span>
                <button
                  onClick={() => setSelectedServiceModal(srv)}
                  className="text-xs text-[#8B5CF6] hover:text-[#A78BFA] font-medium flex items-center gap-1 transition-colors"
                >
                  <span>Architecture Docs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CloudWatch Log Group Stream */}
      <div className="bg-[#101522] border border-[#20283A] rounded-xl p-5">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#20283A]">
          <div className="flex items-center gap-2">
            <LineChart className="w-4 h-4 text-[#8B5CF6]" />
            <h3 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider">
              Amazon CloudWatch Log Stream: <code className="text-[#8B5CF6] font-mono">/aws/cloudshield/security-audit</code>
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#6B7280]">Live Ingest ({events.length} records)</span>
        </div>

        <div className="p-3 bg-[#080B14] rounded-xl border border-[#20283A] font-mono text-[11px] text-[#9CA3B5] space-y-1.5 max-h-48 overflow-y-auto">
          {events.slice(0, 8).map(e => {
            const isCrit = e.severity === 'CRITICAL';
            const isHigh = e.severity === 'HIGH';

            return (
              <div key={e.eventId} className="flex items-start gap-2">
                <span className="text-[#6B7280] shrink-0">[{e.timestamp.slice(11, 19)}]</span>
                <span className={`shrink-0 font-medium ${
                  isCrit ? 'text-rose-400' : isHigh ? 'text-amber-400' : 'text-sky-400'
                }`}>
                  [{isCrit ? 'CRITICAL' : isHigh ? 'WARN' : 'INFO'}]
                </span>
                <span className="break-all">
                  CloudShield.Audit: id={e.eventId} ip={e.sourceIp} type="{e.attackType}" action={e.finalAction} score={e.threatScore} status={e.finalStatus}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
