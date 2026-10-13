import React from 'react';
import { MetricCards } from './MetricCards';
import { ServiceHealthPanel } from './ServiceHealthPanel';
import { LiveActivityFeed } from './LiveActivityFeed';
import { QuickAttackLaunch } from './QuickAttackLaunch';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Metric Summary Cards */}
      <MetricCards />

      {/* Quick Attack Simulator Trigger Bar */}
      <QuickAttackLaunch />

      {/* Main 2-Column Section: Service Health + Live SOC Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ServiceHealthPanel />
        <LiveActivityFeed />
      </div>
    </div>
  );
};
