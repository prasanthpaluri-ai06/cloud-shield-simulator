import React, { useState } from 'react';
import { SecurityProvider, useSecurity } from './context/SecurityContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { ServiceModal } from './components/layout/ServiceModal';
import { IpDetailModal } from './components/layout/IpDetailModal';

// Pages
import { DashboardPage } from './components/dashboard/DashboardPage';
import { AttackSimulatorPage } from './components/simulator/AttackSimulatorPage';
import { SecurityLogsPage } from './components/logs/SecurityLogsPage';
import { ThreatAnalyticsPage } from './components/analytics/ThreatAnalyticsPage';
import { BlockedIpsPage } from './components/blocked-ips/BlockedIpsPage';
import { SystemMonitoringPage } from './components/monitoring/SystemMonitoringPage';

const MainContent: React.FC = () => {
  const { activeTab } = useSecurity();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'simulator':
        return <AttackSimulatorPage />;
      case 'logs':
        return <SecurityLogsPage />;
      case 'analytics':
        return <ThreatAnalyticsPage />;
      case 'blocked':
        return <BlockedIpsPage />;
      case 'monitoring':
        return <SystemMonitoringPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#090d16] text-[#f8fafc] overflow-hidden">
      {/* Persistent SOC Sidebar with Mobile Drawer */}
      <Sidebar 
        isOpenMobile={isMobileMenuOpen} 
        onCloseMobile={() => setIsMobileMenuOpen(false)} 
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Persistent Top Navigation & Status Bar */}
        <TopBar 
          onOpenNotifications={() => setIsNotificationsOpen(true)} 
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Scrollable Page Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 lg:p-7 relative min-w-0">
          <div className="max-w-[1600px] mx-auto">
            {renderActivePage()}
          </div>
        </main>
      </div>

      {/* Slide-in Notifications Drawer */}
      <NotificationDrawer 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />

      {/* Global Interactive Modals */}
      <ServiceModal />
      <IpDetailModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SecurityProvider>
      <MainContent />
    </SecurityProvider>
  );
};

export default App;
