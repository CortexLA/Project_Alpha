import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import SeverityBadge from './SeverityBadge';
import SLAIndicator from './SLAIndicator';

const SORT_FIELDS = ['severity', 'timestamp', 'user', 'type', 'analyst'];

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

export default function IncidentQueue({ incidents, onSelect, selectedId }) {
  const [sortField, setSortField] = useState('severity');
  const [sortDir, setSortDir] = useState('asc');
  const [selected, setSelected] = useState([]);

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const sorted = [...incidents]?.sort((a, b) => {
    let av, bv;
    if (sortField === 'severity') { av = SEVERITY_ORDER?.[a?.severity]; bv = SEVERITY_ORDER?.[b?.severity]; }
    else if (sortField === 'timestamp') { av = a?.timestamp; bv = b?.timestamp; }
    else if (sortField === 'user') { av = a?.user; bv = b?.user; }
    else if (sortField === 'type') { av = a?.type; bv = b?.type; }
    else { av = a?.analyst; bv = b?.analyst; }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSelect = (id, e) => {
    e?.stopPropagation();
    setSelected(prev => prev?.includes(id) ? prev?.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelected(prev => prev?.length === sorted?.length ? [] : sorted?.map(i => i?.id));
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <Icon name="ChevronsUpDown" size={13} color="var(--color-muted-foreground)" />;
    return <Icon name={sortDir === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={13} color="var(--color-primary)" />;
  };

  const statusColor = (s) => {
    if (s === 'open') return 'text-error bg-error/10 border-error/30';
    if (s === 'in_progress') return 'text-warning bg-warning/10 border-warning/30';
    return 'text-success bg-success/10 border-success/30';
  };

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg overflow-hidden">
      {/* Bulk actions bar */}
      {selected?.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-[var(--color-primary)]/5 border-b border-[var(--color-primary)]/20">
          <span className="font-caption text-sm text-[var(--color-primary)] font-600">{selected?.length} selected</span>
          <button className="font-caption text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors px-2 py-1 rounded border border-[var(--color-border)] hover:bg-[var(--color-muted)]/50">Assign</button>
          <button className="font-caption text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors px-2 py-1 rounded border border-[var(--color-border)] hover:bg-[var(--color-muted)]/50">Bulk Close</button>
          <button className="font-caption text-xs text-error hover:text-error/80 transition-colors px-2 py-1 rounded border border-error/30 hover:bg-error/10">Escalate All</button>
          <button onClick={() => setSelected([])} className="ml-auto text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]">
            <Icon name="X" size={14} color="currentColor" />
          </button>
        </div>
      )}
      {/* Table header */}
      <div className="hidden lg:grid grid-cols-[24px_1fr_140px_160px_140px_130px_120px_100px] gap-3 px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-0)]">
        <input type="checkbox" checked={selected?.length === sorted?.length && sorted?.length > 0} onChange={toggleAll}
          className="w-4 h-4 rounded border-[var(--color-border)] bg-[var(--color-surface-1)] accent-[var(--color-primary)] cursor-pointer" />
        {[
          { field: 'severity', label: 'Severity' },
          { field: 'timestamp', label: 'Timestamp' },
          { field: 'user', label: 'Affected User' },
          { field: 'type', label: 'Threat Type' },
          { field: 'analyst', label: 'Analyst' },
          { field: 'status', label: 'Status' },
          { field: 'sla', label: 'SLA' },
        ]?.map(col => (
          <button key={col?.field} onClick={() => col?.field !== 'sla' && handleSort(col?.field)}
            className="flex items-center gap-1 font-caption text-xs text-[var(--color-muted-foreground)] uppercase tracking-wider hover:text-[var(--color-foreground)] transition-colors text-left">
            {col?.label}
            {col?.field !== 'sla' && <SortIcon field={col?.field} />}
          </button>
        ))}
      </div>
      {/* Rows */}
      <div className="divide-y divide-[var(--color-border)]">
        {sorted?.map(inc => (
          <div
            key={inc?.id}
            onClick={() => onSelect(inc)}
            className={`group cursor-pointer transition-all duration-200 hover:bg-[var(--color-muted)]/30 ${selectedId === inc?.id ? 'bg-[var(--color-primary)]/5 border-l-2 border-[var(--color-primary)]' : 'border-l-2 border-transparent'}`}
          >
            {/* Desktop row */}
            <div className="hidden lg:grid grid-cols-[24px_1fr_140px_160px_140px_130px_120px_100px] gap-3 px-4 py-3.5 items-center">
              <input type="checkbox" checked={selected?.includes(inc?.id)} onChange={e => toggleSelect(inc?.id, e)}
                className="w-4 h-4 rounded border-[var(--color-border)] bg-[var(--color-surface-1)] accent-[var(--color-primary)] cursor-pointer" />
              <div className="flex items-center gap-2 min-w-0">
                <SeverityBadge severity={inc?.severity} />
                {inc?.escalated && (
                  <span className="px-1.5 py-0.5 rounded bg-error/10 border border-error/30 font-caption text-xs text-error font-600 flex-shrink-0">ESC</span>
                )}
              </div>
              <span className="font-data text-xs text-[var(--color-muted-foreground)] whitespace-nowrap">{inc?.timestampLabel}</span>
              <div className="min-w-0">
                <p className="font-caption text-sm text-[var(--color-foreground)] font-500 truncate">{inc?.user}</p>
                <p className="font-data text-xs text-[var(--color-muted-foreground)] truncate">{inc?.userId}</p>
              </div>
              <span className="font-caption text-xs text-[var(--color-foreground)] truncate">{inc?.type}</span>
              <span className="font-caption text-xs text-[var(--color-muted-foreground)] truncate">{inc?.analyst}</span>
              <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded border font-caption text-xs font-600 capitalize ${statusColor(inc?.status)}`}>
                {inc?.status?.replace('_', ' ')}
              </span>
              <SLAIndicator deadlineMs={inc?.slaDeadline} />
            </div>

            {/* Mobile/Tablet card */}
            <div className="lg:hidden px-4 py-3.5 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <SeverityBadge severity={inc?.severity} />
                  {inc?.escalated && <span className="px-1.5 py-0.5 rounded bg-error/10 border border-error/30 font-caption text-xs text-error font-600">ESC</span>}
                  <span className={`px-2 py-0.5 rounded border font-caption text-xs font-600 capitalize ${statusColor(inc?.status)}`}>{inc?.status?.replace('_', ' ')}</span>
                </div>
                <SLAIndicator deadlineMs={inc?.slaDeadline} />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-caption text-sm text-[var(--color-foreground)] font-500">{inc?.user}</p>
                  <p className="font-caption text-xs text-[var(--color-muted-foreground)]">{inc?.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-data text-xs text-[var(--color-muted-foreground)]">{inc?.timestampLabel}</p>
                  <p className="font-caption text-xs text-[var(--color-muted-foreground)]">{inc?.analyst}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {sorted?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-[var(--color-muted-foreground)]">
          <Icon name="ShieldCheck" size={40} color="var(--color-success)" />
          <p className="font-caption text-sm mt-3">No incidents match your filters</p>
        </div>
      )}
    </div>
  );
}