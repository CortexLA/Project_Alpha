import React, { useState, useCallback, useMemo } from "react";
import TopNavigation from "components/ui/TopNavigation";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import MetricCard from "./components/MetricCard";
import LoginActivityChart from "./components/LoginActivityChart";
import UserRiskLeaderboard from "./components/UserRiskLeaderboard";
import BehavioralBaselineChart from "./components/BehavioralBaselineChart";
import FilterControls from "./components/FilterControls";
import UserProfileModal from "./components/UserProfileModal";
import AnomalyHeatmap from "./components/AnomalyHeatmap";

const metrics = [
{
  title: "High Risk Users",
  value: "23",
  subtitle: "of 1,247 total",
  change: "+4 this week",
  changeType: "negative",
  icon: "UserX",
  iconColor: "var(--color-error)",
  sparkData: [12, 14, 13, 16, 18, 20, 23],
  sparkColor: "var(--color-error)"
},
{
  title: "Login Deviations",
  value: "147",
  subtitle: "anomalous logins",
  change: "+22 today",
  changeType: "negative",
  icon: "LogIn",
  iconColor: "var(--color-warning)",
  sparkData: [80, 95, 88, 102, 115, 130, 147],
  sparkColor: "var(--color-warning)"
},
{
  title: "File Access Anomalies",
  value: "89",
  subtitle: "unusual accesses",
  change: "-5 from yesterday",
  changeType: "positive",
  icon: "FolderOpen",
  iconColor: "var(--color-accent)",
  sparkData: [110, 105, 98, 95, 92, 91, 89],
  sparkColor: "var(--color-accent)"
},
{
  title: "Behavioral Score Avg",
  value: "72.4",
  subtitle: "risk index",
  change: "+3.2 pts",
  changeType: "negative",
  icon: "Brain",
  iconColor: "var(--color-primary)",
  sparkData: [65, 66, 68, 69, 70, 71, 72.4],
  sparkColor: "var(--color-primary)"
}];


const UserBehavioralAnalytics = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalUser, setModalUser] = useState(null);
  const [lastRefresh, setLastRefresh] = useState("03/03/2026 12:35 PM");
  const [filters, setFilters] = useState({
    search: "",
    department: "All Departments",
    role: "All Roles",
    timePattern: "All Patterns",
    minRisk: 0,
    showBaseline: true
  });

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSelectUser = useCallback((user) => {
    setSelectedUser(user);
    setModalUser(user);
  }, []);

  const handleDrillDown = useCallback((timeLabel) => {
    // Simulate drill-down by opening a generic user
    setModalUser({
      id: 99,
      name: "James Whitfield",
      role: "Senior Engineer",
      dept: "Engineering",
      riskScore: 94,
      trend: [60, 65, 70, 78, 85, 90, 94],
      status: "investigating",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_135832f23-1763294987438.png",
      avatarAlt: "Professional male engineer with short brown hair wearing casual blue shirt in office setting",
      anomalies: 12,
      lastActivity: "2 min ago",
      badge: "critical"
    });
  }, []);

  const handleRefresh = useCallback(() => {
    const now = new Date();
    setLastRefresh(now?.toLocaleString("en-US", { month: "2-digit", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }));
  }, []);

  const handleExport = useCallback(() => {
    const csv = "Name,Department,Risk Score,Anomalies,Status\nJames Whitfield,Engineering,94,12,investigating\nSandra Okonkwo,Finance,87,9,open";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user-behavioral-analytics.csv";
    a?.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <TopNavigation />
      {/* Page content with top padding for fixed nav */}
      <main className="pt-16">
        {/* Page Header */}
        <div className="bg-[var(--color-surface-1)] border-b border-[var(--color-border)] px-4 md:px-6 lg:px-8 py-4">
          <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 flex items-center justify-center flex-shrink-0">
                <Icon name="Activity" size={18} color="var(--color-primary)" />
              </div>
              <div>
                <h1 className="font-heading text-base md:text-lg text-[var(--color-card-foreground)]">User Behavioral Analytics</h1>
                <p className="font-caption text-xs text-[var(--color-muted-foreground)]">AI-powered insider threat detection &amp; behavioral profiling</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] status-connected" />
                <span className="font-caption text-xs text-[var(--color-muted-foreground)]">ML Model Active</span>
                <span className="font-data text-xs text-[var(--color-primary)]">94.2% confidence</span>
              </div>
              <Button variant="outline" size="sm" iconName="Bookmark" iconPosition="left" iconSize={13}>
                Bookmarks
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 space-y-4 md:space-y-6">
          {/* Filter Controls */}
          <FilterControls
            filters={filters}
            onFilterChange={handleFilterChange}
            onExport={handleExport}
            onRefresh={handleRefresh}
            lastRefresh={lastRefresh} />
          

          {/* Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics?.map((m) =>
            <MetricCard key={m?.title} {...m} />
            )}
          </div>

          {/* Main Content: 8+4 grid on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            {/* Login Activity Chart — 8 cols */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <LoginActivityChart onUserDrillDown={handleDrillDown} />
              <AnomalyHeatmap />
            </div>

            {/* User Risk Leaderboard — 4 cols */}
            <div className="lg:col-span-4">
              <UserRiskLeaderboard onSelectUser={handleSelectUser} />
            </div>
          </div>

          {/* Behavioral Baseline Comparison — full width */}
          {filters?.showBaseline &&
          <BehavioralBaselineChart selectedUser={selectedUser} />
          }

          {/* AI Insight Banner */}
          <div className="bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-lg p-4 flex flex-col sm:flex-row sm:items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-center flex-shrink-0">
              <Icon name="Brain" size={16} color="var(--color-primary)" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-heading text-xs text-[var(--color-primary)] uppercase tracking-wider">AI Threat Insight</span>
                <span className="px-1.5 py-0.5 rounded bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 font-caption text-xs text-[var(--color-primary)]">GPT-4 Analysis</span>
              </div>
              <p className="font-caption text-sm text-[var(--color-card-foreground)]">
                <span className="text-[var(--color-error)] font-500">3 users</span> exhibit behavioral patterns consistent with data exfiltration preparation. James Whitfield shows an 890MB download spike (+625% above baseline) combined with off-hours access from a foreign IP — indicative of a <span className="text-[var(--color-warning)] font-500">Stage 3 insider threat</span>. Recommend immediate investigation and temporary access suspension pending review.
              </p>
            </div>
            <Button variant="outline" size="sm" iconName="ArrowRight" iconPosition="right" iconSize={13} className="flex-shrink-0">
              Full Analysis
            </Button>
          </div>
        </div>
      </main>
      {/* User Profile Modal */}
      {modalUser &&
      <UserProfileModal user={modalUser} onClose={() => setModalUser(null)} />
      }
    </div>);

};

export default UserBehavioralAnalytics;