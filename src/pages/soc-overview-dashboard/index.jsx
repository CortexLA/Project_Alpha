import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

import TopNavigation from "components/ui/TopNavigation";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";

import KPICard from "./components/KPICard";
import ThreatHeatmap from "./components/ThreatHeatmap";
import LiveAlertFeed from "./components/LiveAlertFeed";
import AnomalyTimeline from "./components/AnomalyTimeline"; 
import RiskDistributionChart from "./components/RiskDistributionChart";
import SystemHealthPanel from "./components/SystemHealthPanel";
import ControlBar from "./components/ControlBar";
import WeeklyAnomalyChart from "./components/WeeklyAnomalyChart";

const KPI_DATA = [
  {
    icon: "Users",
    label: "Active Users",
    value: "1,247",
    subValue: "↑ 23 in last hour",
    status: "blue",
    trend: "up",
    trendValue: "+1.9%",
    pulse: true,
  },
  {
    icon: "ShieldAlert",
    label: "Threat Level",
    value: "HIGH",
    subValue: "Elevated since 14:00",
    status: "red",
    trend: "up",
    trendValue: "+2 lvl",
    pulse: true,
  },
  {
    icon: "AlertTriangle",
    label: "Weekly Anomalies",
    value: "387",
    subValue: "↑ 22.4% vs last week",
    status: "amber",
    trend: "up",
    trendValue: "+22.4%",
    pulse: false,
  },
  {
    icon: "XCircle",
    label: "Failed Logins",
    value: "142",
    subValue: "Last 24 hours",
    status: "red",
    trend: "up",
    trendValue: "+8.3%",
    pulse: false,
  },
  {
    icon: "Gauge",
    label: "Avg Risk Score",
    value: "26.4",
    subValue: "Across all users",
    status: "amber",
    trend: "up",
    trendValue: "+3.1",
    pulse: false,
  },
  {
    icon: "HeartPulse",
    label: "System Health",
    value: "94.2%",
    subValue: "1 service degraded",
    status: "green",
    trend: "down",
    trendValue: "-0.8%",
    pulse: false,
  },
];

export default function SOCOverviewDashboard() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("24hr");
  const [environment, setEnvironment] = useState("All Environments");
  const [refreshInterval, setRefreshInterval] = useState(15000);
  const [lastRefresh, setLastRefresh] = useState("just now");
  const [isLive, setIsLive] = useState(true);
  const [investigateAlert, setInvestigateAlert] = useState(null);
  const [showInvestigateModal, setShowInvestigateModal] = useState(false);
  const [kpiData, setKpiData] = useState(KPI_DATA);
  const refreshTimerRef = useRef(null);
  const secondsRef = useRef(0);

  const formatLastRefresh = useCallback((seconds) => {
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  }, []);

  const doRefresh = useCallback(() => {
    secondsRef.current = 0;
    setLastRefresh("just now");
    // Simulate slight data variation
    setKpiData(prev =>
      prev?.map(k => ({
        ...k,
        value: k?.label === "Active Users"
          ? (1200 + Math.floor(Math.random() * 100))?.toLocaleString()
          : k?.value,
      }))
    );
  }, []);

  useEffect(() => {
    if (refreshInterval === 0) {
      setIsLive(false);
      if (refreshTimerRef?.current) clearInterval(refreshTimerRef?.current);
      return;
    }
    setIsLive(true);
    refreshTimerRef.current = setInterval(() => {
      secondsRef.current += 1;
      setLastRefresh(formatLastRefresh(secondsRef?.current));
    }, 1000);
    const refreshTimer = setInterval(doRefresh, refreshInterval);
    return () => {
      clearInterval(refreshTimerRef?.current);
      clearInterval(refreshTimer);
    };
  }, [refreshInterval, doRefresh, formatLastRefresh]);

  const handleInvestigate = useCallback((alert) => {
    if (!alert) {
      navigate("/incident-management-center");
      return;
    }
    setInvestigateAlert(alert);
    setShowInvestigateModal(true);
  }, [navigate]);

  const handleRegionClick = useCallback((region) => {
    setInvestigateAlert({
      id: `GEO-${region?.id}`,
      title: `Geographic Threat: ${region?.name}`,
      source: region?.name,
      severity: region?.severity,
      category: "Geographic",
      user: "Multiple users",
      time: "Active now",
      timestamp: new Date()?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    });
    setShowInvestigateModal(true);
  }, []);

  const handleExport = useCallback(() => {
    alert("PDF export initiated. Report will be generated and downloaded shortly.");
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <TopNavigation />
      {/* Page content offset for fixed nav */}
      <div className="pt-16">
        {/* Control Bar */}
        <ControlBar
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          environment={environment}
          setEnvironment={setEnvironment}
          refreshInterval={refreshInterval}
          setRefreshInterval={setRefreshInterval}
          lastRefresh={lastRefresh}
          isLive={isLive}
          onExport={handleExport}
        />

        {/* Main content */}
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 space-y-4 md:space-y-6">

          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="font-heading text-xl md:text-2xl text-[var(--color-card-foreground)]">
                SOC Overview Dashboard
              </h1>
              <p className="font-caption text-sm text-[var(--color-muted-foreground)] mt-0.5">
                Security Operations Command Center — {new Date()?.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--color-surface-1)] border border-[var(--color-border)]">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="font-data text-xs text-[var(--color-muted-foreground)]">LIVE</span>
                <span className="font-data text-xs text-[var(--color-card-foreground)] ml-1">
                  {new Date()?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="RefreshCw"
                iconPosition="left"
                iconSize={13}
                onClick={doRefresh}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {kpiData?.map((kpi, i) => (
              <KPICard key={i} {...kpi} />
            ))}
          </div>

          {/* Main visualization area + Alert sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Threat Heatmap — 2/3 width on desktop */}
            <div className="lg:col-span-2">
              <div className="bg-[var(--color-card)] rounded-lg border border-[var(--color-border)] p-4 h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon name="Globe" size={16} color="var(--color-primary)" />
                    <span className="font-heading text-sm text-[var(--color-card-foreground)]">
                      Global Threat Activity Heatmap
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-caption text-xs text-[var(--color-muted-foreground)]">
                      {environment}
                    </span>
                    <button
                      onClick={() => navigate("/user-behavioral-analytics")}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 font-caption text-xs text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 transition-colors duration-200"
                    >
                      <Icon name="ExternalLink" size={11} color="var(--color-primary)" />
                      Drill Down
                    </button>
                  </div>
                </div>
                <div className="h-64 md:h-80 lg:h-96">
                  <ThreatHeatmap onRegionClick={handleRegionClick} />
                </div>
              </div>
            </div>

            {/* Live Alert Feed — 1/3 width on desktop */}
            <div className="lg:col-span-1 h-80 md:h-96 lg:h-auto lg:min-h-[500px]">
              <LiveAlertFeed onInvestigate={handleInvestigate} />
            </div>
          </div>

          {/* Bottom charts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Anomaly Timeline — spans 2 cols on lg */}
            <div className="md:col-span-2 lg:col-span-2">
              <AnomalyTimeline />
            </div>
            {/* Weekly Anomaly Chart */}
            <div className="md:col-span-1 lg:col-span-1">
              <WeeklyAnomalyChart />
            </div>
          </div>

          {/* Third row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <RiskDistributionChart />
            <SystemHealthPanel />
          </div>

          {/* Quick navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                path: "/user-behavioral-analytics",
                icon: "Activity",
                title: "User Behavioral Analytics",
                desc: "Deep-dive into user behavior patterns and anomaly detection",
                color: "#3B82F6",
              },
              {
                path: "/incident-management-center",
                icon: "AlertTriangle",
                title: "Incident Management",
                desc: "Manage and respond to active security incidents",
                color: "#EF4444",
              },
              {
                path: "/soc-overview-dashboard",
                icon: "Shield",
                title: "SOC Overview",
                desc: "Return to the main security operations command center",
                color: "#00D4AA",
              },
            ]?.map(nav => (
              <button
                key={nav?.path}
                onClick={() => navigate(nav?.path)}
                className="flex items-start gap-3 p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-muted)] hover:-translate-y-0.5 transition-all duration-200 text-left group"
              >
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-md flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${nav?.color}15`, border: `1px solid ${nav?.color}30` }}
                >
                  <Icon name={nav?.icon} size={18} color={nav?.color} />
                </div>
                <div className="min-w-0">
                  <p className="font-heading text-sm text-[var(--color-card-foreground)] group-hover:text-[var(--color-primary)] transition-colors duration-200">
                    {nav?.title}
                  </p>
                  <p className="font-caption text-xs text-[var(--color-muted-foreground)] mt-0.5 line-clamp-2">
                    {nav?.desc}
                  </p>
                </div>
                <Icon name="ArrowRight" size={14} color="var(--color-muted-foreground)" className="flex-shrink-0 mt-1 group-hover:text-[var(--color-primary)] transition-colors duration-200" />
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-[var(--color-border)]">
            <p className="font-caption text-xs text-[var(--color-muted-foreground)]">
              TacticalSOC Platform &copy; {new Date()?.getFullYear()} — SOC 2 Type II Certified | ISO 27001
            </p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-data text-xs text-[var(--color-muted-foreground)]">
                <Icon name="Shield" size={11} color="var(--color-success)" />
                SSL Secured
              </span>
              <span className="flex items-center gap-1 font-data text-xs text-[var(--color-muted-foreground)]">
                <Icon name="Lock" size={11} color="var(--color-success)" />
                Encrypted
              </span>
              <span className="flex items-center gap-1 font-data text-xs text-[var(--color-muted-foreground)]">
                <Icon name="Eye" size={11} color="var(--color-muted-foreground)" />
                Audit Logged
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Investigate Modal */}
      {showInvestigateModal && investigateAlert && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[var(--color-background)]/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-2xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface-1)]">
              <div className="flex items-center gap-2">
                <Icon name="Search" size={16} color="var(--color-primary)" />
                <span className="font-heading text-sm text-[var(--color-card-foreground)]">Incident Investigation</span>
                <span className="font-data text-xs text-[var(--color-muted-foreground)]">{investigateAlert?.id}</span>
              </div>
              <button
                onClick={() => setShowInvestigateModal(false)}
                className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-[var(--color-muted)] transition-colors duration-200"
              >
                <Icon name="X" size={14} color="var(--color-muted-foreground)" />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-5 space-y-4">
              <div>
                <p className="font-heading text-base text-[var(--color-card-foreground)]">{investigateAlert?.title}</p>
                <p className="font-caption text-xs text-[var(--color-muted-foreground)] mt-1">
                  Detected at {investigateAlert?.timestamp} — {investigateAlert?.time}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Severity", value: investigateAlert?.severity?.toUpperCase(), icon: "AlertTriangle" },
                  { label: "Category", value: investigateAlert?.category, icon: "Tag" },
                  { label: "User", value: investigateAlert?.user, icon: "User" },
                  { label: "Source", value: investigateAlert?.source, icon: "Server" },
                ]?.map(item => (
                  <div key={item?.label} className="flex items-start gap-2 p-3 rounded-md bg-[var(--color-surface-0)] border border-[var(--color-border)]">
                    <Icon name={item?.icon} size={13} color="var(--color-muted-foreground)" className="mt-0.5" />
                    <div>
                      <p className="font-caption text-xs text-[var(--color-muted-foreground)]">{item?.label}</p>
                      <p className="font-data text-xs text-[var(--color-card-foreground)] mt-0.5">{item?.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-md bg-[#3B82F6]/10 border border-[#3B82F6]/30">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Cpu" size={13} color="var(--color-accent)" />
                  <span className="font-caption text-xs text-[#3B82F6] font-500">AI Threat Analysis</span>
                </div>
                <p className="font-caption text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                  Behavioral pattern analysis indicates this activity deviates significantly from the established baseline.
                  Risk score elevated by 34 points. Recommend immediate investigation and potential account suspension pending review.
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[var(--color-border)] bg-[var(--color-surface-1)]">
              <Button variant="ghost" size="sm" onClick={() => setShowInvestigateModal(false)}>
                Dismiss
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="UserPlus"
                iconPosition="left"
                iconSize={13}
                onClick={() => setShowInvestigateModal(false)}
              >
                Assign to Me
              </Button>
              <Button
                variant="default"
                size="sm"
                iconName="ExternalLink"
                iconPosition="left"
                iconSize={13}
                onClick={() => {
                  setShowInvestigateModal(false);
                  navigate("/incident-management-center");
                }}
              >
                Open in Incident Center
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}