import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import IncidentManagementCenter from './pages/incident-management-center';
import SOCOverviewDashboard from './pages/soc-overview-dashboard';
import UserBehavioralAnalytics from './pages/user-behavioral-analytics';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<IncidentManagementCenter />} />
        <Route path="/incident-management-center" element={<IncidentManagementCenter />} />
        <Route path="/soc-overview-dashboard" element={<SOCOverviewDashboard />} />
        <Route path="/user-behavioral-analytics" element={<UserBehavioralAnalytics />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
