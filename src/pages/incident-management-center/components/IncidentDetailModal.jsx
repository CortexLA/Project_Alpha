import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import SeverityBadge from './SeverityBadge';

const PLAYBOOKS = [
  { id: 1, name: 'Isolate Endpoint', icon: 'Shield', time: '~2 min', risk: 'Low' },
  { id: 2, name: 'Disable User Account', icon: 'UserX', time: '~1 min', risk: 'Medium' },
  { id: 3, name: 'Force Password Reset', icon: 'Key', time: '~1 min', risk: 'Low' },
  { id: 4, name: 'Capture Memory Dump', icon: 'Database', time: '~5 min', risk: 'Low' },
  { id: 5, name: 'Notify HR & Legal', icon: 'Mail', time: '~3 min', risk: 'Low' },
];

const TABS = ['Overview', 'AI Analysis', 'Evidence', 'Timeline', 'Playbooks'];

export default function IncidentDetailModal({ incident, onClose }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [executedPlaybooks, setExecutedPlaybooks] = useState([]);
  const [assignTo, setAssignTo] = useState(incident?.analyst);

  const analysts = ['A. Kumar', 'S. Patel', 'M. Chen', 'R. Williams', 'J. Torres'];

  const executePlaybook = (id) => {
    setExecutedPlaybooks(prev => [...prev, id]);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-[var(--color-background)]/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-[0_24px_48px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface-0)] flex-shrink-0">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex-shrink-0 mt-0.5">
              <SeverityBadge severity={incident?.severity} />
            </div>
            <div className="min-w-0">
              <h2 className="font-heading text-base text-[var(--color-foreground)] font-600 truncate">{incident?.title}</h2>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="font-data text-xs text-[var(--color-muted-foreground)]">#{incident?.id}</span>
                <span className="font-caption text-xs text-[var(--color-muted-foreground)]">{incident?.user} · {incident?.userId}</span>
                <span className="font-data text-xs text-[var(--color-muted-foreground)]">{incident?.timestampLabel}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md hover:bg-[var(--color-muted)]/50 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors ml-2">
            <Icon name="X" size={18} color="currentColor" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-5 py-2 border-b border-[var(--color-border)] bg-[var(--color-surface-0)] overflow-x-auto flex-shrink-0">
          {TABS?.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md font-caption text-sm font-500 whitespace-nowrap transition-all duration-200 flex-shrink-0 ${activeTab === tab ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30' : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)]/50'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-[var(--color-surface-0)] rounded-lg p-4 border border-[var(--color-border)]">
                  <h3 className="font-heading text-sm text-[var(--color-foreground)] mb-3">Incident Details</h3>
                  <dl className="space-y-2">
                    {[
                      { label: 'Threat Type', value: incident?.type },
                      { label: 'Affected System', value: incident?.system },
                      { label: 'Source IP', value: incident?.sourceIp },
                      { label: 'Department', value: incident?.department },
                      { label: 'Risk Score', value: incident?.riskScore + '/100' },
                    ]?.map(item => (
                      <div key={item?.label} className="flex items-center justify-between gap-2">
                        <dt className="font-caption text-xs text-[var(--color-muted-foreground)]">{item?.label}</dt>
                        <dd className="font-data text-xs text-[var(--color-foreground)] font-500">{item?.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="bg-[var(--color-surface-0)] rounded-lg p-4 border border-[var(--color-border)]">
                  <h3 className="font-heading text-sm text-[var(--color-foreground)] mb-3">Assignment</h3>
                  <select value={assignTo} onChange={e => setAssignTo(e?.target?.value)}
                    className="w-full px-3 py-2 bg-[var(--color-surface-1)] border border-[var(--color-border)] rounded-md font-caption text-sm text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-ring)] transition-colors">
                    {analysts?.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <div className="flex gap-2 mt-3">
                    <Button variant="default" size="sm" fullWidth iconName="UserCheck" iconPosition="left">Reassign</Button>
                    <Button variant="destructive" size="sm" fullWidth iconName="Zap" iconPosition="left">Escalate</Button>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-[var(--color-surface-0)] rounded-lg p-4 border border-[var(--color-border)]">
                  <h3 className="font-heading text-sm text-[var(--color-foreground)] mb-3">Affected Systems</h3>
                  <div className="space-y-2">
                    {incident?.affectedSystems?.map((sys, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-[var(--color-surface-1)] border border-[var(--color-border)]">
                        <Icon name="Server" size={14} color="var(--color-accent)" />
                        <span className="font-data text-xs text-[var(--color-foreground)]">{sys}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[var(--color-surface-0)] rounded-lg p-4 border border-[var(--color-border)]">
                  <h3 className="font-heading text-sm text-[var(--color-foreground)] mb-2">Description</h3>
                  <p className="font-caption text-sm text-[var(--color-muted-foreground)] leading-relaxed">{incident?.description}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'AI Analysis' && (
            <div className="space-y-4">
              <div className="bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-md bg-[var(--color-primary)]/20 flex items-center justify-center">
                    <Icon name="Brain" size={15} color="var(--color-primary)" />
                  </div>
                  <h3 className="font-heading text-sm text-[var(--color-primary)]">AI Threat Assessment</h3>
                  <span className="ml-auto px-2 py-0.5 rounded bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 font-caption text-xs text-[var(--color-primary)]">Confidence: {incident?.aiConfidence}%</span>
                </div>
                <p className="font-caption text-sm text-[var(--color-foreground)] leading-relaxed">{incident?.aiExplanation}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { label: 'Threat Probability', value: incident?.threatProbability + '%', icon: 'TrendingUp', color: 'text-error' },
                  { label: 'Data Exfil Risk', value: incident?.exfilRisk, icon: 'Database', color: 'text-warning' },
                  { label: 'Lateral Movement', value: incident?.lateralMovement, icon: 'GitBranch', color: 'text-accent' },
                ]?.map(m => (
                  <div key={m?.label} className="bg-[var(--color-surface-0)] rounded-lg p-3 border border-[var(--color-border)] text-center">
                    <Icon name={m?.icon} size={20} color={`var(--color-${m?.color?.replace('text-', '')})`} className="mx-auto mb-2" />
                    <p className={`font-heading text-lg font-700 ${m?.color}`}>{m?.value}</p>
                    <p className="font-caption text-xs text-[var(--color-muted-foreground)] mt-0.5">{m?.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[var(--color-surface-0)] rounded-lg p-4 border border-[var(--color-border)]">
                <h3 className="font-heading text-sm text-[var(--color-foreground)] mb-3">Behavioral Anomalies Detected</h3>
                <div className="space-y-2">
                  {incident?.anomalies?.map((a, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Icon name="AlertCircle" size={14} color="var(--color-warning)" className="mt-0.5 flex-shrink-0" />
                      <span className="font-caption text-sm text-[var(--color-muted-foreground)]">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Evidence' && (
            <div className="space-y-3">
              {incident?.evidence?.map((ev, i) => (
                <div key={i} className="bg-[var(--color-surface-0)] rounded-lg p-4 border border-[var(--color-border)]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon name={ev?.icon} size={15} color="var(--color-accent)" />
                      <span className="font-caption text-sm text-[var(--color-foreground)] font-500">{ev?.type}</span>
                    </div>
                    <span className="font-data text-xs text-[var(--color-muted-foreground)]">{ev?.timestamp}</span>
                  </div>
                  <p className="font-caption text-sm text-[var(--color-muted-foreground)]">{ev?.description}</p>
                  {ev?.data && <pre className="mt-2 p-2 bg-[var(--color-surface-1)] rounded text-xs font-data text-[var(--color-foreground)] overflow-x-auto">{ev?.data}</pre>}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Timeline' && (
            <div className="relative pl-6">
              <div className="absolute left-2 top-0 bottom-0 w-px bg-[var(--color-border)]" />
              {incident?.timeline?.map((event, i) => (
                <div key={i} className="relative mb-4 last:mb-0">
                  <div className={`absolute -left-4 w-3 h-3 rounded-full border-2 border-[var(--color-card)] ${event?.severity === 'critical' ? 'bg-error' : event?.severity === 'high' ? 'bg-warning' : 'bg-accent'}`} />
                  <div className="bg-[var(--color-surface-0)] rounded-lg p-3 border border-[var(--color-border)]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-caption text-sm text-[var(--color-foreground)] font-500">{event?.action}</span>
                      <span className="font-data text-xs text-[var(--color-muted-foreground)] flex-shrink-0 ml-2">{event?.time}</span>
                    </div>
                    <p className="font-caption text-xs text-[var(--color-muted-foreground)]">{event?.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Playbooks' && (
            <div className="space-y-3">
              <div className="bg-[var(--color-warning)]/5 border border-[var(--color-warning)]/20 rounded-lg p-3 flex items-start gap-2">
                <Icon name="AlertTriangle" size={15} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
                <p className="font-caption text-sm text-[var(--color-warning)]">Executing playbooks will trigger automated response actions. Verify before proceeding.</p>
              </div>
              {PLAYBOOKS?.map(pb => (
                <div key={pb?.id} className="bg-[var(--color-surface-0)] rounded-lg p-4 border border-[var(--color-border)] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                    <Icon name={pb?.icon} size={18} color="var(--color-accent)" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-caption text-sm text-[var(--color-foreground)] font-500">{pb?.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="font-data text-xs text-[var(--color-muted-foreground)]">{pb?.time}</span>
                      <span className={`font-caption text-xs ${pb?.risk === 'Low' ? 'text-success' : 'text-warning'}`}>Risk: {pb?.risk}</span>
                    </div>
                  </div>
                  {executedPlaybooks?.includes(pb?.id) ? (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-success/10 border border-success/30 font-caption text-xs text-success font-600">
                      <Icon name="CheckCircle" size={13} color="var(--color-success)" /> Executed
                    </span>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => executePlaybook(pb?.id)} iconName="Play" iconPosition="left">
                      Execute
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--color-border)] bg-[var(--color-surface-0)] flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" iconName="FileText" iconPosition="left">Export Report</Button>
            <Button variant="outline" size="sm" iconName="Package" iconPosition="left">Evidence Package</Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>Close</Button>
            <Button variant="success" size="sm" iconName="CheckCircle" iconPosition="left">Mark Resolved</Button>
          </div>
        </div>
      </div>
    </div>
  );
}