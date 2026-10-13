import React from 'react';
import { AttackSelector } from './AttackSelector';
import { AttackConfigPanel } from './AttackConfigPanel';
import { PipelineVisualization } from './PipelineVisualization';
import { AiThreatCard } from './AiThreatCard';
import { ResultSummaryCard } from './ResultSummaryCard';
import { SimulationTimeline } from './SimulationTimeline';
import { LiveLogTerminal } from './LiveLogTerminal';

export const AttackSimulatorPage: React.FC = () => {
  return (
    <div className="space-y-5 pb-8">
      {/* 1. Attack Scenario Selector */}
      <AttackSelector />

      {/* 2. Simulation Parameters & Launch Controls */}
      <AttackConfigPanel />

      {/* 3. Real-Time Pipeline Lifecycle Visualization */}
      <PipelineVisualization />

      {/* 4. Results Section: AI Threat Card + Result Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AiThreatCard />
        <ResultSummaryCard />
      </div>

      {/* 5. Live Telemetry & Console: Timeline + Log Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <SimulationTimeline />
        </div>
        <div className="lg:col-span-2">
          <LiveLogTerminal />
        </div>
      </div>
    </div>
  );
};
