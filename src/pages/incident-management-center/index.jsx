import React, { useState, useMemo, useCallback } from 'react';
import TopNavigation from 'components/ui/TopNavigation';
import Icon from 'components/AppIcon';
import IncidentStatusBar from './components/IncidentStatusBar';
import IncidentQueue from './components/IncidentQueue';
import IncidentStatsPanel from './components/IncidentStatsPanel';
import IncidentDetailModal from './components/IncidentDetailModal';
import LiveAlertBanner from './components/LiveAlertBanner';

const NOW = Date.now();
const H = 3600000;

const MOCK_INCIDENTS = [
  {
    id: 'INC-2026-0847',
    title: 'Brute Force Attack — Repeated Authentication Failures',
    severity: 'critical',
    status: 'open',
    type: 'Brute Force',
    user: 'James Whitfield',
    userId: 'jwhitfield@corp.com',
    analyst: 'A. Kumar',
    timestamp: NOW - 8 * 60000,
    timestampLabel: '03/03/2026 12:30',
    slaDeadline: NOW + 1.2 * H,
    escalated: true,
    system: 'WKSTN-042',
    sourceIp: '192.168.1.45',
    department: 'Finance',
    riskScore: 94,
    description: 'User account jwhitfield has triggered 847 failed authentication attempts within a 3-minute window from workstation WKSTN-042. Pattern consistent with automated credential stuffing attack. Account has been temporarily locked pending investigation.',
    affectedSystems: ['WKSTN-042', 'AD-SERVER-01', 'FINANCE-DB-03'],
    aiConfidence: 97,
    aiExplanation: 'This incident exhibits strong indicators of an automated brute force attack. The velocity of 847 failed attempts in 180 seconds far exceeds normal human interaction patterns. The source IP 192.168.1.45 has been flagged in 3 previous low-severity incidents over the past 30 days. Behavioral baseline deviation score is 9.4/10. Recommend immediate account suspension and endpoint forensic analysis.',
    threatProbability: 97,
    exfilRisk: 'High',
    lateralMovement: 'Detected',
    anomalies: [
      'Authentication velocity 284x above user baseline (avg 3 logins/day)',
      'Login attempts originating from unregistered device fingerprint',
      'Attempts targeting 12 different service accounts sequentially',
      'Activity occurring outside normal working hours (02:30 AM local time)',
    ],
    evidence: [
      { type: 'Authentication Log', icon: 'FileText', timestamp: '03/03/2026 02:30:14', description: 'First failed authentication attempt recorded from 192.168.1.45', data: 'AUTH_FAIL user=jwhitfield src=192.168.1.45 dst=AD-SERVER-01 attempts=1' },
      { type: 'Network Capture', icon: 'Wifi', timestamp: '03/03/2026 02:33:02', description: 'Packet capture showing automated request pattern with 213ms intervals', data: null },
      { type: 'Endpoint Alert', icon: 'Monitor', timestamp: '03/03/2026 02:33:18', description: 'EDR agent on WKSTN-042 flagged suspicious process spawning lsass.exe access', data: null },
    ],
    timeline: [
      { time: '02:30:14', action: 'First Failed Login', detail: 'Initial authentication failure from 192.168.1.45', severity: 'medium' },
      { time: '02:30:15', action: 'Rapid Succession Begins', detail: 'Automated pattern detected — 50 attempts in 10 seconds', severity: 'high' },
      { time: '02:33:02', action: 'Account Lockout Triggered', detail: 'AD policy locked account after 10 consecutive failures', severity: 'high' },
      { time: '02:33:18', action: 'EDR Alert Generated', detail: 'Endpoint detection flagged lsass memory access attempt', severity: 'critical' },
      { time: '02:34:00', action: 'SOC Alert Created', detail: 'Automated SIEM rule triggered INC-2026-0847', severity: 'critical' },
    ],
  },
  {
    id: 'INC-2026-0846',
    title: 'Privilege Escalation — Unauthorized Admin Access Attempt',
    severity: 'high',
    status: 'in_progress',
    type: 'Privilege Escalation',
    user: 'Sarah Mitchell',
    userId: 'smitchell@corp.com',
    analyst: 'S. Patel',
    timestamp: NOW - 22 * 60000,
    timestampLabel: '03/03/2026 12:16',
    slaDeadline: NOW + 3.5 * H,
    escalated: false,
    system: 'APP-SERVER-07',
    sourceIp: '10.0.2.88',
    department: 'Engineering',
    riskScore: 78,
    description: 'User smitchell attempted to access restricted admin API endpoints 14 times in 20 minutes. User role is Senior Developer with no admin privileges. Attempts targeted user management and configuration endpoints.',
    affectedSystems: ['APP-SERVER-07', 'API-GATEWAY-01'],
    aiConfidence: 88,
    aiExplanation: 'Behavioral analysis indicates deliberate probing of administrative endpoints. The pattern of sequential endpoint testing suggests reconnaissance activity. User has no prior history of accessing these endpoints. Risk score elevated due to sensitive data exposure potential.',
    threatProbability: 78,
    exfilRisk: 'Medium',
    lateralMovement: 'Possible',
    anomalies: [
      'Sequential access to 14 admin endpoints not in user role permissions',
      'Access pattern matches known privilege escalation reconnaissance technique',
      'Activity initiated 45 minutes after normal work hours ended',
    ],
    evidence: [
      { type: 'API Access Log', icon: 'Globe', timestamp: '03/03/2026 11:54:22', description: 'First unauthorized API endpoint access attempt recorded', data: 'GET /api/admin/users 403 Forbidden user=smitchell' },
      { type: 'WAF Alert', icon: 'Shield', timestamp: '03/03/2026 12:10:05', description: 'Web Application Firewall flagged repeated 403 pattern', data: null },
    ],
    timeline: [
      { time: '11:54:22', action: 'First Unauthorized Access', detail: 'GET /api/admin/users returned 403', severity: 'medium' },
      { time: '11:58:44', action: 'Pattern Escalation', detail: '5 additional admin endpoints probed', severity: 'high' },
      { time: '12:10:05', action: 'WAF Alert', detail: 'Automated WAF rule triggered on repeated 403 pattern', severity: 'high' },
      { time: '12:16:00', action: 'Incident Created', detail: 'SIEM correlation rule generated INC-2026-0846', severity: 'high' },
    ],
  },
  {
    id: 'INC-2026-0845',
    title: 'Data Exfiltration — Large Volume Transfer to External IP',
    severity: 'critical',
    status: 'open',
    type: 'Data Exfiltration',
    user: 'Robert Chen',
    userId: 'rchen@corp.com',
    analyst: 'M. Chen',
    timestamp: NOW - 45 * 60000,
    timestampLabel: '03/03/2026 11:53',
    slaDeadline: NOW + 0.5 * H,
    escalated: true,
    system: 'FILE-SERVER-02',
    sourceIp: '10.0.1.112',
    department: 'R&D',
    riskScore: 96,
    description: 'User rchen transferred 2.3GB of files from FILE-SERVER-02 to external IP 185.220.101.45 over HTTPS. Files included proprietary research documents and source code repositories. Transfer occurred during off-hours.',
    affectedSystems: ['FILE-SERVER-02', 'FIREWALL-01', 'DLP-SENSOR-03'],
    aiConfidence: 99,
    aiExplanation: 'This incident represents a high-confidence data exfiltration event. The destination IP 185.220.101.45 is associated with known data broker infrastructure. The 2.3GB transfer volume is 460x above this user\'s 30-day average. File types transferred include .pptx, .docx, and .zip archives consistent with IP theft patterns. Immediate containment recommended.',
    threatProbability: 99,
    exfilRisk: 'Critical',
    lateralMovement: 'Confirmed',
    anomalies: [
      'Transfer volume 460x above 30-day user baseline (avg 5MB/day)',
      'Destination IP flagged in threat intelligence feeds as data broker',
      'Files accessed from 3 different departments outside user\'s normal scope',
      'Transfer initiated at 11:53 PM — outside normal working hours',
    ],
    evidence: [
      { type: 'DLP Alert', icon: 'AlertTriangle', timestamp: '03/03/2026 11:53:07', description: 'DLP sensor detected large outbound transfer exceeding policy threshold', data: 'DLP_ALERT: outbound_transfer size=2.3GB dst=185.220.101.45 user=rchen' },
      { type: 'Firewall Log', icon: 'Shield', timestamp: '03/03/2026 11:53:12', description: 'Firewall allowed HTTPS connection to external IP (policy gap identified)', data: null },
      { type: 'File Access Log', icon: 'FolderOpen', timestamp: '03/03/2026 11:50:33', description: 'Mass file access across R&D, Finance, and Legal shares', data: null },
    ],
    timeline: [
      { time: '11:50:33', action: 'Mass File Access', detail: 'User accessed 847 files across 3 departments in 2 minutes', severity: 'high' },
      { time: '11:53:07', action: 'Transfer Initiated', detail: 'HTTPS connection established to 185.220.101.45', severity: 'critical' },
      { time: '11:53:12', action: 'DLP Alert', detail: 'Data Loss Prevention sensor triggered on volume threshold', severity: 'critical' },
      { time: '12:01:44', action: 'Transfer Complete', detail: '2.3GB successfully transferred — connection closed', severity: 'critical' },
    ],
  },
  {
    id: 'INC-2026-0844',
    title: 'Unusual Login Location — VPN Bypass Detected',
    severity: 'medium',
    status: 'in_progress',
    type: 'Geo-Anomaly',
    user: 'Maria Wilson',
    userId: 'mwilson@corp.com',
    analyst: 'R. Williams',
    timestamp: NOW - 90 * 60000,
    timestampLabel: '03/03/2026 11:08',
    slaDeadline: NOW + 6 * H,
    escalated: false,
    system: 'VPN-GATEWAY-01',
    sourceIp: '91.108.4.200',
    department: 'Marketing',
    riskScore: 52,
    description: 'User mwilson logged in from IP 91.108.4.200 geolocated to Moscow, Russia. User\'s registered location is New York, USA. No travel notice filed. VPN was not used for this session.',
    affectedSystems: ['VPN-GATEWAY-01', 'MAIL-SERVER-01'],
    aiConfidence: 74,
    aiExplanation: 'Geographic anomaly detected with moderate confidence. The login location represents a 9,200km deviation from user\'s established baseline. However, the login was successful with correct credentials suggesting possible account compromise rather than brute force. Recommend immediate user verification.',
    threatProbability: 62,
    exfilRisk: 'Low',
    lateralMovement: 'Unlikely',
    anomalies: [
      'Login from Russia — 9,200km from established user baseline (New York)',
      'No VPN usage detected for this session',
      'No travel notice filed in HR system',
    ],
    evidence: [
      { type: 'Authentication Log', icon: 'FileText', timestamp: '03/03/2026 11:08:33', description: 'Successful login from unusual geographic location', data: 'AUTH_SUCCESS user=mwilson src=91.108.4.200 geo=Moscow,RU' },
    ],
    timeline: [
      { time: '11:08:33', action: 'Anomalous Login', detail: 'Successful auth from 91.108.4.200 (Moscow, RU)', severity: 'medium' },
      { time: '11:09:01', action: 'Geo-Anomaly Alert', detail: 'SIEM geo-correlation rule triggered', severity: 'medium' },
      { time: '11:15:00', action: 'Analyst Assigned', detail: 'R. Williams assigned for investigation', severity: 'medium' },
    ],
  },
  {
    id: 'INC-2026-0843',
    title: 'Policy Violation — Unauthorized USB Device Connected',
    severity: 'low',
    status: 'resolved',
    type: 'Policy Violation',
    user: 'David Park',
    userId: 'dpark@corp.com',
    analyst: 'J. Torres',
    timestamp: NOW - 3 * H,
    timestampLabel: '03/03/2026 09:38',
    slaDeadline: NOW + 12 * H,
    escalated: false,
    system: 'WKSTN-019',
    sourceIp: '10.0.3.19',
    department: 'Operations',
    riskScore: 28,
    description: 'Unauthorized USB storage device connected to WKSTN-019. Device was blocked by endpoint policy. No data transfer occurred. User was notified of policy violation.',
    affectedSystems: ['WKSTN-019'],
    aiConfidence: 95,
    aiExplanation: 'Low-risk policy violation with no data transfer confirmed. Endpoint DLP successfully blocked the device. Pattern is consistent with accidental policy violation rather than malicious intent. User has clean behavioral history over 18 months.',
    threatProbability: 15,
    exfilRisk: 'None',
    lateralMovement: 'None',
    anomalies: ['USB device not in approved hardware inventory', 'Device connected during lunch break'],
    evidence: [
      { type: 'Endpoint Alert', icon: 'Monitor', timestamp: '03/03/2026 09:38:11', description: 'EDR agent blocked USB device — no data transfer occurred', data: 'USB_BLOCKED device=SanDisk_16GB user=dpark policy=USB_RESTRICTION' },
    ],
    timeline: [
      { time: '09:38:11', action: 'USB Connected', detail: 'Unauthorized USB device detected and blocked', severity: 'low' },
      { time: '09:38:12', action: 'Policy Enforced', detail: 'Endpoint agent blocked device access', severity: 'low' },
      { time: '10:15:00', action: 'User Notified', detail: 'Automated policy violation notification sent', severity: 'low' },
      { time: '11:30:00', action: 'Resolved', detail: 'J. Torres confirmed no data transfer, closed incident', severity: 'low' },
    ],
  },
  {
    id: 'INC-2026-0842',
    title: 'Insider Threat — Anomalous File Access Pattern',
    severity: 'high',
    status: 'open',
    type: 'Insider Threat',
    user: 'Kevin Larson',
    userId: 'klarson@corp.com',
    analyst: 'A. Kumar',
    timestamp: NOW - 4 * H,
    timestampLabel: '03/03/2026 08:38',
    slaDeadline: NOW + 2 * H,
    escalated: false,
    system: 'FILE-SERVER-01',
    sourceIp: '10.0.1.87',
    department: 'Legal',
    riskScore: 81,
    description: 'User klarson accessed 312 sensitive legal documents outside their normal access scope. User is scheduled for termination next week. Access pattern suggests pre-departure data collection.',
    affectedSystems: ['FILE-SERVER-01', 'LEGAL-SHARE-01'],
    aiConfidence: 91,
    aiExplanation: 'High-confidence insider threat indicator. User is flagged in HR system for upcoming termination (effective 03/10/2026). The access pattern of 312 documents in 2 hours is 78x above baseline. Documents accessed span multiple case files outside user\'s assigned matters. This pattern is consistent with pre-departure intellectual property collection.',
    threatProbability: 88,
    exfilRisk: 'High',
    lateralMovement: 'Possible',
    anomalies: [
      'Document access volume 78x above 30-day baseline',
      'Accessing case files outside assigned legal matters',
      'User flagged in HR for termination in 7 days',
      'Bulk download of PDF documents to local workstation',
    ],
    evidence: [
      { type: 'File Access Log', icon: 'FolderOpen', timestamp: '03/03/2026 08:38:00', description: 'Mass file access initiated across LEGAL-SHARE-01', data: 'FILE_ACCESS user=klarson files=312 share=LEGAL-SHARE-01 duration=120min' },
      { type: 'HR System Flag', icon: 'User', timestamp: '03/03/2026 08:00:00', description: 'HR system flagged user for scheduled termination', data: null },
    ],
    timeline: [
      { time: '08:38:00', action: 'Anomalous Access Begins', detail: 'User starts accessing files outside normal scope', severity: 'high' },
      { time: '09:15:00', action: 'Volume Threshold Exceeded', detail: 'SIEM rule triggered on 100+ file access in 30 min', severity: 'high' },
      { time: '10:38:00', action: 'Incident Created', detail: 'INC-2026-0842 generated with high severity', severity: 'high' },
    ],
  },
  {
    id: 'INC-2026-0841',
    title: 'Malware Detection — Ransomware Signature Identified',
    severity: 'critical',
    status: 'in_progress',
    type: 'Malware',
    user: 'Patricia Nguyen',
    userId: 'pnguyen@corp.com',
    analyst: 'M. Chen',
    timestamp: NOW - 5 * H,
    timestampLabel: '03/03/2026 07:38',
    slaDeadline: NOW - 0.5 * H,
    escalated: true,
    system: 'WKSTN-033',
    sourceIp: '10.0.2.33',
    department: 'HR',
    riskScore: 99,
    description: 'EDR agent detected ransomware signature on WKSTN-033. Endpoint has been automatically isolated. 47 files have been encrypted. Network spread prevention measures activated.',
    affectedSystems: ['WKSTN-033', 'HR-SHARE-01', 'BACKUP-SERVER-02'],
    aiConfidence: 99,
    aiExplanation: 'Confirmed ransomware infection with LockBit 3.0 signature match (confidence: 99%). Endpoint isolation was triggered automatically. 47 files encrypted before containment. Backup integrity check initiated. Recommend full forensic imaging before remediation.',
    threatProbability: 99,
    exfilRisk: 'Critical',
    lateralMovement: 'Blocked',
    anomalies: [
      'LockBit 3.0 ransomware signature detected by EDR',
      '47 files encrypted with .lockbit extension',
      'Attempted lateral movement to 3 network shares blocked',
      'C2 communication attempt to 185.220.101.88 blocked by firewall',
    ],
    evidence: [
      { type: 'EDR Alert', icon: 'AlertTriangle', timestamp: '03/03/2026 07:38:44', description: 'Endpoint Detection & Response agent identified ransomware process', data: 'MALWARE_DETECTED sig=LockBit3.0 host=WKSTN-033 action=ISOLATE' },
      { type: 'Network Block', icon: 'Shield', timestamp: '03/03/2026 07:38:46', description: 'Firewall blocked C2 communication attempt', data: null },
    ],
    timeline: [
      { time: '07:38:44', action: 'Ransomware Detected', detail: 'EDR identified LockBit 3.0 signature', severity: 'critical' },
      { time: '07:38:46', action: 'Auto-Isolation', detail: 'Endpoint automatically isolated from network', severity: 'critical' },
      { time: '07:39:00', action: 'C2 Blocked', detail: 'Firewall blocked command & control communication', severity: 'critical' },
      { time: '07:45:00', action: 'Analyst Engaged', detail: 'M. Chen assigned — investigation in progress', severity: 'critical' },
    ],
  },
  {
    id: 'INC-2026-0840',
    title: 'Credential Sharing — Multiple Concurrent Sessions',
    severity: 'medium',
    status: 'open',
    type: 'Credential Sharing',
    user: 'Thomas Bradley',
    userId: 'tbradley@corp.com',
    analyst: 'R. Williams',
    timestamp: NOW - 6 * H,
    timestampLabel: '03/03/2026 06:38',
    slaDeadline: NOW + 8 * H,
    escalated: false,
    system: 'SSO-SERVER-01',
    sourceIp: '10.0.4.55',
    department: 'Sales',
    riskScore: 61,
    description: 'User tbradley has 4 concurrent active sessions from different geographic locations simultaneously. Sessions active in New York, Chicago, London, and Singapore — physically impossible for single user.',
    affectedSystems: ['SSO-SERVER-01', 'CRM-SERVER-01'],
    aiConfidence: 82,
    aiExplanation: 'Concurrent session analysis indicates credential sharing or account compromise. Four simultaneous sessions from geographically impossible locations (New York, Chicago, London, Singapore) cannot represent a single user. Credential sharing policy violation or account takeover scenario.',
    threatProbability: 72,
    exfilRisk: 'Medium',
    lateralMovement: 'Possible',
    anomalies: [
      '4 concurrent sessions from 4 different countries simultaneously',
      'Geographic impossibility — locations require 18+ hours of travel',
      'CRM data accessed from all 4 sessions concurrently',
    ],
    evidence: [
      { type: 'Session Log', icon: 'Globe', timestamp: '03/03/2026 06:38:00', description: 'Multiple concurrent sessions detected from impossible locations', data: 'SESSION user=tbradley sessions=4 locations=[NY,CHI,LON,SIN]' },
    ],
    timeline: [
      { time: '06:38:00', action: 'Concurrent Sessions Detected', detail: '4 simultaneous sessions from 4 countries', severity: 'medium' },
      { time: '06:40:00', action: 'Geo-Impossibility Alert', detail: 'SIEM impossible travel rule triggered', severity: 'medium' },
    ],
  },
];

export default function IncidentManagementCenter() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('All Analysts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);

  const filteredIncidents = useMemo(() => {
    return MOCK_INCIDENTS?.filter(inc => {
      if (statusFilter !== 'all' && inc?.status !== statusFilter) return false;
      if (severityFilter !== 'all' && inc?.severity !== severityFilter) return false;
      if (assigneeFilter !== 'All Analysts' && inc?.analyst !== assigneeFilter) return false;
      if (searchQuery) {
        const q = searchQuery?.toLowerCase();
        return (inc?.title?.toLowerCase()?.includes(q) ||
        inc?.user?.toLowerCase()?.includes(q) ||
        inc?.userId?.toLowerCase()?.includes(q) ||
        inc?.type?.toLowerCase()?.includes(q) ||
        inc?.id?.toLowerCase()?.includes(q) || inc?.sourceIp?.includes(q));
      }
      return true;
    });
  }, [statusFilter, severityFilter, assigneeFilter, searchQuery]);

  const handleSelectIncident = useCallback((inc) => {
    setSelectedIncident(inc);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedIncident(null);
  }, []);

  const handleExport = () => {
    const csv = [
      ['ID', 'Severity', 'Status', 'User', 'Type', 'Analyst', 'Timestamp', 'Risk Score'],
      ...filteredIncidents?.map(i => [i?.id, i?.severity, i?.status, i?.user, i?.type, i?.analyst, i?.timestampLabel, i?.riskScore]),
    ]?.map(row => row?.join(','))?.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incidents_${new Date()?.toISOString()?.slice(0, 10)}.csv`;
    a?.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <TopNavigation />
      <main className="pt-16">
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 max-w-[1920px] mx-auto">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
                <h1 className="font-heading text-xl md:text-2xl text-[var(--color-foreground)] font-700">Incident Management Center</h1>
              </div>
              <p className="font-caption text-sm text-[var(--color-muted-foreground)]">
                Real-time alert orchestration and threat response coordination
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--color-success)]/10 border border-[var(--color-success)]/30">
                <span className="w-2 h-2 rounded-full bg-[var(--color-success)] status-connected" />
                <span className="font-caption text-xs text-[var(--color-success)] font-600">LIVE FEED</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--color-muted)]/50 border border-[var(--color-border)]">
                <Icon name="RefreshCw" size={12} color="var(--color-muted-foreground)" />
                <span className="font-data text-xs text-[var(--color-muted-foreground)]">Auto-refresh: 30s</span>
              </div>
            </div>
          </div>

          {/* Live alert banner */}
          <div className="mb-4">
            <LiveAlertBanner />
          </div>

          {/* Filters */}
          <div className="mb-4">
            <IncidentStatusBar
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              severityFilter={severityFilter}
              setSeverityFilter={setSeverityFilter}
              assigneeFilter={assigneeFilter}
              setAssigneeFilter={setAssigneeFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onExport={handleExport}
            />
          </div>

          {/* Main content: queue + stats panel */}
          <div className="flex flex-col xl:flex-row gap-4 md:gap-6">
            {/* Incident queue — takes most space */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-heading text-sm text-[var(--color-foreground)] flex items-center gap-2">
                  <Icon name="List" size={15} color="var(--color-primary)" />
                  Incident Queue
                  <span className="px-2 py-0.5 rounded bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 font-data text-xs text-[var(--color-primary)]">
                    {filteredIncidents?.length}
                  </span>
                </h2>
                <span className="font-caption text-xs text-[var(--color-muted-foreground)]">
                  Click any row to view details
                </span>
              </div>
              <IncidentQueue
                incidents={filteredIncidents}
                onSelect={handleSelectIncident}
                selectedId={selectedIncident?.id}
              />
            </div>

            {/* Stats panel */}
            <div className="w-full xl:w-72 2xl:w-80 flex-shrink-0">
              <h2 className="font-heading text-sm text-[var(--color-foreground)] flex items-center gap-2 mb-3">
                <Icon name="BarChart2" size={15} color="var(--color-primary)" />
                Live Statistics
              </h2>
              <IncidentStatsPanel />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="font-caption text-xs text-[var(--color-muted-foreground)]">
              TacticalSOC Incident Management &copy; {new Date()?.getFullYear()} — SOC 2 Type II Certified
            </p>
            <div className="flex items-center gap-3">
              <span className="font-data text-xs text-[var(--color-muted-foreground)]">Last sync: {new Date()?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
              <span className="font-caption text-xs text-[var(--color-muted-foreground)]">v2.4.1</span>
            </div>
          </div>
        </div>
      </main>
      {/* Incident detail modal */}
      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}