import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from 'components/AppIcon';

const NAV_ITEMS = [
  {
    label: 'SOC Overview',
    path: '/soc-overview-dashboard',
    icon: 'Shield',
    tooltip: 'Security Operations Command Center',
  },
  {
    label: 'User Analytics',
    path: '/user-behavioral-analytics',
    icon: 'Activity',
    tooltip: 'User Behavioral Analytics & Threat Hunting',
  },
  {
    label: 'Incident Management',
    path: '/incident-management-center',
    icon: 'AlertTriangle',
    tooltip: 'Incident Response & Coordination Center',
  },
];

export default function TopNavigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [wsStatus, setWsStatus] = useState('connected'); // 'connected' | 'disconnected' | 'warning'
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [notifications, setNotifications] = useState([
    { id: 1, severity: 'critical', title: 'Brute Force Attack Detected', source: '192.168.1.45', time: '2 min ago', read: false },
    { id: 2, severity: 'high', title: 'Privilege Escalation Attempt', source: 'user: jsmith', time: '8 min ago', read: false },
    { id: 3, severity: 'medium', title: 'Unusual Login Location', source: 'user: mwilson', time: '15 min ago', read: true },
    { id: 4, severity: 'low', title: 'Policy Violation - USB Device', source: 'WKSTN-042', time: '32 min ago', read: true },
  ]);

  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  // Simulate real-time timestamp updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef?.current && !notificationRef?.current?.contains(e?.target)) {
        setNotificationOpen(false);
      }
      if (userMenuRef?.current && !userMenuRef?.current?.contains(e?.target)) {
        setUserMenuOpen(false);
      }
      if (mobileMenuRef?.current && !mobileMenuRef?.current?.contains(e?.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location?.pathname]);

  const handleKeyDown = (e, action) => {
    if (e?.key === 'Enter' || e?.key === ' ') {
      e?.preventDefault();
      action();
    }
    if (e?.key === 'Escape') {
      setNotificationOpen(false);
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev?.map(n => ({ ...n, read: true })));
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev?.map(n => n?.id === id ? { ...n, read: true } : n));
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-accent';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-error/10 border-error/30';
      case 'high': return 'bg-warning/10 border-warning/30';
      case 'medium': return 'bg-accent/10 border-accent/30';
      case 'low': return 'bg-muted/50 border-border';
      default: return 'bg-muted/50 border-border';
    }
  };

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const isActive = (path) => location?.pathname === path;

  return (
    <>
      <header className="nav-header flex items-center justify-between px-4 lg:px-6">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary/10 border border-primary/30 transition-all duration-250">
            <Icon name="Shield" size={20} color="var(--color-primary)" strokeWidth={2} />
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-heading font-700 text-sm text-card-foreground tracking-wider uppercase">
              TacticalSOC
            </span>
            <span className="font-caption text-xs text-muted-foreground tracking-widest uppercase">
              Security Operations
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2" aria-label="Primary navigation">
          {NAV_ITEMS?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              title={item?.tooltip}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md font-caption font-500 text-sm
                transition-all duration-250 ease-tactical relative group min-h-touch
                hover:bg-muted hover:text-card-foreground hover:-translate-y-px
                focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2
                ${isActive(item?.path)
                  ? 'text-primary bg-primary/10 border border-primary/20 shadow-glow-primary'
                  : 'text-muted-foreground border border-transparent'
                }
              `}
              aria-current={isActive(item?.path) ? 'page' : undefined}
            >
              <Icon
                name={item?.icon}
                size={16}
                color={isActive(item?.path) ? 'var(--color-primary)' : 'currentColor'}
                strokeWidth={isActive(item?.path) ? 2.5 : 2}
              />
              <span>{item?.label}</span>
              {isActive(item?.path) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          {/* Global Status Bar - WebSocket & Data Freshness */}
          <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-md bg-muted/50 border border-border">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  wsStatus === 'connected' ? 'status-connected' :
                  wsStatus === 'warning' ? 'status-warning' : 'status-disconnected'
                }`}
              />
              <span className="font-caption text-xs text-muted-foreground">
                {wsStatus === 'connected' ? 'LIVE' : wsStatus === 'warning' ? 'DEGRADED' : 'OFFLINE'}
              </span>
            </div>
            <div className="w-px h-3 bg-border" />
            <div className="flex items-center gap-1">
              <Icon name="Clock" size={11} color="var(--color-muted-foreground)" />
              <span className="font-data text-xs text-muted-foreground">{formatTime(lastUpdated)}</span>
            </div>
          </div>

          {/* Quick Actions - Incident context */}
          {isActive('/incident-management-center') && (
            <div className="hidden lg:flex items-center gap-1">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-error/10 border border-error/30 text-error font-caption text-xs font-500 transition-all duration-250 hover:bg-error/20 active:scale-97 min-h-touch"
                title="Emergency Escalation (Ctrl+E)"
                onClick={() => {}}
              >
                <Icon name="Zap" size={13} color="var(--color-error)" />
                <span>Escalate</span>
              </button>
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted/50 border border-border text-muted-foreground font-caption text-xs font-500 transition-all duration-250 hover:bg-muted hover:text-card-foreground active:scale-97 min-h-touch"
                title="Export Report (Ctrl+X)"
                onClick={() => {}}
              >
                <Icon name="Download" size={13} color="currentColor" />
                <span>Export</span>
              </button>
            </div>
          )}

          {/* Notification Hub */}
          <div className="relative" ref={notificationRef}>
            <button
              className={`
                relative flex items-center justify-center w-10 h-10 rounded-md border transition-all duration-250
                hover:bg-muted active:scale-97 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2
                ${notificationOpen ? 'bg-muted border-border' : 'bg-transparent border-transparent'}
                ${unreadCount > 0 ? 'text-warning' : 'text-muted-foreground'}
              `}
              onClick={() => {
                setNotificationOpen(prev => !prev);
                setUserMenuOpen(false);
              }}
              onKeyDown={(e) => handleKeyDown(e, () => setNotificationOpen(prev => !prev))}
              aria-label={`Notifications - ${unreadCount} unread`}
              aria-expanded={notificationOpen}
              aria-haspopup="true"
            >
              <Icon name="Bell" size={18} color="currentColor" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-error text-error-foreground font-caption text-xs font-700 leading-none pulse-threat">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-card border border-border rounded-lg shadow-elevation-4 z-50 animate-slide-down overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Icon name="Bell" size={15} color="var(--color-primary)" />
                    <span className="font-heading font-600 text-sm text-card-foreground">Alerts</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-error/20 text-error font-caption text-xs font-600">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        className="font-caption text-xs text-primary hover:text-primary/80 transition-colors duration-250"
                        onClick={markAllRead}
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      className="text-muted-foreground hover:text-card-foreground transition-colors duration-250"
                      onClick={() => setNotificationOpen(false)}
                      aria-label="Close notifications"
                    >
                      <Icon name="X" size={14} color="currentColor" />
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <Icon name="CheckCircle" size={32} color="var(--color-success)" />
                      <p className="font-caption text-sm mt-2">No active alerts</p>
                    </div>
                  ) : (
                    notifications?.map((notif) => (
                      <button
                        key={notif?.id}
                        className={`
                          w-full text-left px-4 py-3 border-b border-border/50 last:border-0
                          transition-all duration-250 hover:bg-muted/50
                          ${!notif?.read ? 'bg-muted/20' : ''}
                        `}
                        onClick={() => markNotificationRead(notif?.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 px-1.5 py-0.5 rounded border font-caption text-xs font-600 uppercase flex-shrink-0 ${getSeverityBg(notif?.severity)} ${getSeverityColor(notif?.severity)}`}>
                            {notif?.severity}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-caption text-sm font-500 truncate ${!notif?.read ? 'text-card-foreground' : 'text-muted-foreground'}`}>
                              {notif?.title}
                            </p>
                            <p className="font-data text-xs text-muted-foreground mt-0.5 truncate">{notif?.source}</p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="font-caption text-xs text-muted-foreground">{notif?.time}</span>
                            {!notif?.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <div className="px-4 py-2.5 border-t border-border bg-muted/20">
                  <Link
                    to="/incident-management-center"
                    className="flex items-center justify-center gap-1.5 font-caption text-xs text-primary hover:text-primary/80 transition-colors duration-250"
                    onClick={() => setNotificationOpen(false)}
                  >
                    <span>View all in Incident Management</span>
                    <Icon name="ArrowRight" size={12} color="currentColor" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Context Panel */}
          <div className="relative" ref={userMenuRef}>
            <button
              className={`
                flex items-center gap-2 px-2 py-1.5 rounded-md border transition-all duration-250
                hover:bg-muted active:scale-97 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2
                ${userMenuOpen ? 'bg-muted border-border' : 'bg-transparent border-transparent'}
              `}
              onClick={() => {
                setUserMenuOpen(prev => !prev);
                setNotificationOpen(false);
              }}
              onKeyDown={(e) => handleKeyDown(e, () => setUserMenuOpen(prev => !prev))}
              aria-label="User menu"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex-shrink-0">
                <span className="font-heading font-600 text-xs text-primary">AK</span>
              </div>
              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="font-caption text-xs font-500 text-card-foreground">A. Kumar</span>
                <span className="font-caption text-xs text-primary mt-0.5">SOC Analyst L2</span>
              </div>
              <Icon name="ChevronDown" size={14} color="var(--color-muted-foreground)" className={`transition-transform duration-250 ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-elevation-4 z-50 animate-slide-down overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 border border-primary/40">
                      <span className="font-heading font-600 text-sm text-primary">AK</span>
                    </div>
                    <div>
                      <p className="font-caption text-sm font-500 text-card-foreground">Arjun Kumar</p>
                      <p className="font-caption text-xs text-muted-foreground">arjun.kumar@soc.internal</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 font-caption text-xs text-primary font-500">
                          SOC Analyst L2
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-success/10 border border-success/20 font-caption text-xs text-success font-500">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="py-1">
                  {[
                    { icon: 'User', label: 'Profile Settings', shortcut: null },
                    { icon: 'Key', label: 'Access & Permissions', shortcut: null },
                    { icon: 'FileText', label: 'Audit Log', shortcut: null },
                    { icon: 'Settings', label: 'Preferences', shortcut: null },
                  ]?.map((item) => (
                    <button
                      key={item?.label}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-250 hover:bg-muted group"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Icon name={item?.icon} size={15} color="var(--color-muted-foreground)" />
                      <span className="font-caption text-sm text-muted-foreground group-hover:text-card-foreground transition-colors duration-250">
                        {item?.label}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-border py-1">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-250 hover:bg-error/10 group"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Icon name="LogOut" size={15} color="var(--color-error)" />
                    <span className="font-caption text-sm text-error">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-md border border-transparent hover:bg-muted hover:border-border transition-all duration-250 text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            onKeyDown={(e) => handleKeyDown(e, () => setMobileMenuOpen(prev => !prev))}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={20} color="currentColor" />
          </button>
        </div>
      </header>
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          ref={mobileMenuRef}
          className="lg:hidden fixed top-16 left-0 right-0 bg-card border-b border-border z-navigation shadow-elevation-4 animate-slide-down"
        >
          {/* Mobile Status Bar */}
          <div className="flex items-center gap-4 px-4 py-3 border-b border-border bg-muted/20">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${wsStatus === 'connected' ? 'status-connected' : 'status-disconnected'}`} />
              <span className="font-caption text-xs text-muted-foreground uppercase tracking-wider">
                {wsStatus === 'connected' ? 'Live Feed Active' : 'Connection Lost'}
              </span>
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <Icon name="Clock" size={11} color="var(--color-muted-foreground)" />
              <span className="font-data text-xs text-muted-foreground">{formatTime(lastUpdated)}</span>
            </div>
          </div>

          {/* Mobile Nav Items */}
          <nav className="py-2" aria-label="Mobile navigation">
            {NAV_ITEMS?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`
                  flex items-center gap-3 px-4 py-3.5 transition-all duration-250
                  ${isActive(item?.path)
                    ? 'bg-primary/10 border-l-2 border-primary text-primary' :'text-muted-foreground hover:bg-muted hover:text-card-foreground border-l-2 border-transparent'
                  }
                `}
                aria-current={isActive(item?.path) ? 'page' : undefined}
              >
                <Icon
                  name={item?.icon}
                  size={18}
                  color={isActive(item?.path) ? 'var(--color-primary)' : 'currentColor'}
                  strokeWidth={isActive(item?.path) ? 2.5 : 2}
                />
                <div className="flex-1">
                  <p className="font-caption text-sm font-500">{item?.label}</p>
                  <p className="font-caption text-xs text-muted-foreground mt-0.5">{item?.tooltip}</p>
                </div>
                {isActive(item?.path) && (
                  <Icon name="ChevronRight" size={14} color="var(--color-primary)" />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Quick Actions for Incident Management */}
          {isActive('/incident-management-center') && (
            <div className="px-4 py-3 border-t border-border bg-muted/10">
              <p className="font-caption text-xs text-muted-foreground uppercase tracking-wider mb-2">Quick Actions</p>
              <div className="flex gap-2">
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-md bg-error/10 border border-error/30 text-error font-caption text-xs font-500 transition-all duration-250 hover:bg-error/20 active:scale-97"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon name="Zap" size={13} color="var(--color-error)" />
                  <span>Escalate</span>
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-md bg-muted/50 border border-border text-muted-foreground font-caption text-xs font-500 transition-all duration-250 hover:bg-muted hover:text-card-foreground active:scale-97"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon name="Download" size={13} color="currentColor" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 z-50 top-16"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}