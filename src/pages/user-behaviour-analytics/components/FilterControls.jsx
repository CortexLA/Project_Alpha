import React from "react";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";

const departments = ["All Departments", "Engineering", "Finance", "IT Ops", "Human Resources", "Sales", "Analytics", "Legal"];
const roles = ["All Roles", "Engineer", "Analyst", "Manager", "Director", "Lead", "Executive"];
const timePatterns = ["All Patterns", "Off-Hours Activity", "Weekend Access", "Rapid Succession", "Geo-Anomaly", "Privilege Escalation"];

const FilterControls = ({ filters, onFilterChange, onExport, onRefresh, lastRefresh }) => {
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Icon name="Search" size={14} color="var(--color-muted-foreground)" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search users by name, email, or ID..."
            value={filters?.search}
            onChange={(e) => onFilterChange("search", e?.target?.value)}
            className="w-full pl-9 pr-4 py-2 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-md font-caption text-sm text-[var(--color-card-foreground)] placeholder-[var(--color-muted-foreground)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        {/* Department */}
        <select value={filters?.department} onChange={(e) => onFilterChange("department", e?.target?.value)}
          className="px-3 py-2 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-md font-caption text-sm text-[var(--color-card-foreground)] focus:outline-none focus:border-[var(--color-primary)] transition-colors cursor-pointer">
          {departments?.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        {/* Role */}
        <select value={filters?.role} onChange={(e) => onFilterChange("role", e?.target?.value)}
          className="px-3 py-2 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-md font-caption text-sm text-[var(--color-card-foreground)] focus:outline-none focus:border-[var(--color-primary)] transition-colors cursor-pointer">
          {roles?.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>

        {/* Time Pattern */}
        <select value={filters?.timePattern} onChange={(e) => onFilterChange("timePattern", e?.target?.value)}
          className="px-3 py-2 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-md font-caption text-sm text-[var(--color-card-foreground)] focus:outline-none focus:border-[var(--color-primary)] transition-colors cursor-pointer">
          {timePatterns?.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        {/* Risk Range */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Icon name="Gauge" size={14} color="var(--color-muted-foreground)" />
          <span className="font-caption text-xs text-[var(--color-muted-foreground)] whitespace-nowrap">Risk ≥</span>
          <input type="range" min={0} max={100} value={filters?.minRisk} onChange={(e) => onFilterChange("minRisk", Number(e?.target?.value))}
            className="w-20 accent-[var(--color-primary)] h-1 cursor-pointer" />
          <span className="font-data text-xs text-[var(--color-primary)] w-6 flex-shrink-0">{filters?.minRisk}</span>
        </div>

        {/* Baseline Toggle */}
        <button onClick={() => onFilterChange("showBaseline", !filters?.showBaseline)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md border font-caption text-xs transition-all flex-shrink-0 ${filters?.showBaseline ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)]/40 text-[var(--color-primary)]" : "border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)]/30"}`}>
          <Icon name="GitCompare" size={13} color="currentColor" />
          <span className="hidden sm:inline">Baseline</span>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" iconName="RefreshCw" iconPosition="left" iconSize={13} onClick={onRefresh}>
            Refresh
          </Button>
          <Button variant="secondary" size="sm" iconName="Download" iconPosition="left" iconSize={13} onClick={onExport}>
            Export
          </Button>
        </div>
      </div>
      {/* Last refresh info */}
      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[var(--color-border)]">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] status-connected" />
        <span className="font-caption text-xs text-[var(--color-muted-foreground)]">
          Last updated: {lastRefresh} · Auto-refresh every 10 min · ML Model v3.2.1
        </span>
      </div>
    </div>
  );
};

export default FilterControls;