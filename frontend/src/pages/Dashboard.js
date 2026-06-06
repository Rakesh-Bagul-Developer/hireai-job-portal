import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appsAPI, jobsAPI } from '../utils/api';
import {
  LayoutDashboard, Briefcase, FileText, Bookmark, Bell, User,
  PlusCircle, ChevronRight, CheckCircle, Clock, XCircle, TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_COLOR = {
  applied: 'primary', reviewing: 'info', shortlisted: 'warning',
  interview: 'accent', offered: 'success', rejected: 'danger', withdrawn: 'danger'
};

function StatCard({ num, label, color = 'primary' }) {
  return (
    <div className="stat-card">
      <div className="stat-card-num" style={{ color: `var(--${color})` }}>{num}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [applications, setApplications] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    appsAPI.dashboard().then(r => setStats(r.data)).catch(() => {});
    appsAPI.notifications().then(r => setNotifications(r.data.results || r.data)).catch(() => {});
    if (user?.role === 'employer') {
      jobsAPI.myJobs().then(r => setMyJobs(r.data.results || r.data)).catch(() => {});
    } else {
      appsAPI.myApplications().then(r => setApplications(r.data.results || r.data)).catch(() => {});
    }
  }, [user]);

  const markAllRead = async () => {
    await appsAPI.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    toast.success('All notifications marked as read.');
  };

  const isEmployer = user?.role === 'employer';

  const sidebarLinks = [
    { icon: <LayoutDashboard size={16} />, label: 'Overview', tab: 'overview' },
    isEmployer
      ? { icon: <Briefcase size={16} />, label: 'My Jobs', tab: 'jobs' }
      : { icon: <FileText size={16} />, label: 'Applications', tab: 'applications' },
    { icon: <Bell size={16} />, label: 'Notifications', tab: 'notifications', badge: notifications.filter(n => !n.is_read).length },
    { icon: <User size={16} />, label: 'Profile', tab: 'profile' },
    ...(!isEmployer ? [{ icon: <Bookmark size={16} />, label: 'Saved Jobs', tab: 'saved' }] : []),
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div style={{ padding: '0 1.5rem 1.2rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
          <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {isEmployer ? 'Employer' : 'Job Seeker'}
          </div>
          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user?.first_name} {user?.last_name}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{user?.email}</div>
        </div>
        {sidebarLinks.map(link => (
          <button key={link.tab}
            onClick={() => link.tab === 'profile' ? navigate('/profile') : setActiveTab(link.tab)}
            className={`sidebar-link ${activeTab === link.tab ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', position: 'relative' }}>
            {link.icon} {link.label}
            {link.badge > 0 && (
              <span style={{ position: 'absolute', right: 16, background: 'var(--danger)', color: 'white', borderRadius: 10, fontSize: '0.7rem', padding: '1px 6px', fontWeight: 700 }}>
                {link.badge}
              </span>
            )}
          </button>
        ))}
        {isEmployer && (
          <div style={{ padding: '1rem 1.5rem' }}>
            <Link to="/post-job" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              <PlusCircle size={14} /> Post New Job
            </Link>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {/* Overview */}
        {activeTab === 'overview' && (
          <>
            <h2 className="page-title">Welcome back, {user?.first_name || user?.username}! 👋</h2>
            <p className="text-muted mb-4">Here's what's happening with your account.</p>
            <div className="stat-cards">
              {isEmployer ? (
                <>
                  <StatCard num={stats.total_jobs || 0} label="Total Jobs Posted" />
                  <StatCard num={stats.active_jobs || 0} label="Active Jobs" color="success" />
                  <StatCard num={stats.total_applications || 0} label="Total Applications" color="info" />
                  <StatCard num={stats.shortlisted || 0} label="Shortlisted" color="warning" />
                  <StatCard num={stats.interviews || 0} label="Interviews" color="accent" />
                  <StatCard num={stats.offers || 0} label="Offers Extended" color="success" />
                </>
              ) : (
                <>
                  <StatCard num={stats.total_applied || 0} label="Jobs Applied" />
                  <StatCard num={stats.under_review || 0} label="Under Review" color="info" />
                  <StatCard num={stats.shortlisted || 0} label="Shortlisted" color="warning" />
                  <StatCard num={stats.interviews || 0} label="Interviews" color="accent" />
                  <StatCard num={stats.offers || 0} label="Offers Received" color="success" />
                  <StatCard num={stats.rejected || 0} label="Rejected" color="danger" />
                </>
              )}
            </div>

            {/* Recent activity */}
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Recent Activity</h3>
            <div className="table-wrap">
              {isEmployer ? (
                <table>
                  <thead><tr><th>Job Title</th><th>Status</th><th>Applications</th><th>Posted</th></tr></thead>
                  <tbody>
                    {myJobs.slice(0, 5).map(j => (
                      <tr key={j.id}>
                        <td><Link to={`/jobs/${j.id}`} style={{ fontWeight: 500 }}>{j.title}</Link></td>
                        <td><span className={`badge badge-${j.status === 'active' ? 'success' : 'danger'}`}>{j.status}</span></td>
                        <td>{j.views_count} views</td>
                        <td style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>{new Date(j.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {myJobs.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text3)', padding: '2rem' }}>No jobs posted yet.</td></tr>}
                  </tbody>
                </table>
              ) : (
                <table>
                  <thead><tr><th>Job Title</th><th>Company</th><th>Status</th><th>Applied</th></tr></thead>
                  <tbody>
                    {applications.slice(0, 5).map(a => (
                      <tr key={a.id}>
                        <td><span style={{ fontWeight: 500 }}>{a.job_title}</span></td>
                        <td style={{ color: 'var(--text2)' }}>{a.company_name}</td>
                        <td><span className={`badge badge-${STATUS_COLOR[a.status] || 'primary'}`}>{a.status}</span></td>
                        <td style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>{new Date(a.applied_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {applications.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text3)', padding: '2rem' }}>No applications yet. <Link to="/jobs">Browse jobs →</Link></td></tr>}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* Applications tab */}
        {activeTab === 'applications' && (
          <>
            <h2 className="page-title">My Applications</h2>
            <p className="text-muted mb-4">Track all your job applications.</p>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Job</th><th>Company</th><th>Status</th><th>Applied Date</th></tr></thead>
                <tbody>
                  {applications.map(a => (
                    <tr key={a.id}>
                      <td><span style={{ fontWeight: 500 }}>{a.job_title}</span></td>
                      <td>{a.company_name}</td>
                      <td><span className={`badge badge-${STATUS_COLOR[a.status] || 'primary'}`}>{a.status.replace('_', ' ')}</span></td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>{new Date(a.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr><td colSpan={4}>
                      <div className="empty-state">
                        <Briefcase size={40} />
                        <p>No applications yet.</p>
                        <Link to="/jobs" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Browse Jobs</Link>
                      </div>
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Employer Jobs tab */}
        {activeTab === 'jobs' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 className="page-title">My Job Posts</h2>
                <p className="text-muted">Manage your active listings.</p>
              </div>
              <Link to="/post-job" className="btn btn-primary"><PlusCircle size={16} /> Post Job</Link>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Views</th><th>Deadline</th><th>Actions</th></tr></thead>
                <tbody>
                  {myJobs.map(j => (
                    <tr key={j.id}>
                      <td><Link to={`/jobs/${j.id}`} style={{ fontWeight: 500 }}>{j.title}</Link></td>
                      <td><span className="badge badge-info">{j.job_type?.replace('_', ' ')}</span></td>
                      <td><span className={`badge badge-${j.status === 'active' ? 'success' : 'danger'}`}>{j.status}</span></td>
                      <td>{j.views_count}</td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>{j.application_deadline || '—'}</td>
                      <td><Link to={`/jobs/${j.id}/edit`} className="btn btn-ghost btn-sm">Edit</Link></td>
                    </tr>
                  ))}
                  {myJobs.length === 0 && <tr><td colSpan={6}><div className="empty-state"><Briefcase size={40} /><p>No jobs posted.</p></div></td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="page-title">Notifications</h2>
              {notifications.some(n => !n.is_read) && (
                <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Mark all read</button>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {notifications.length === 0 && (
                <div className="empty-state"><Bell size={40} /><p>No notifications yet.</p></div>
              )}
              {notifications.map(n => (
                <div key={n.id} style={{ background: n.is_read ? 'var(--surface)' : 'rgba(15,76,129,0.04)', border: `1px solid ${n.is_read ? 'var(--border)' : 'rgba(15,76,129,0.2)'}`, borderRadius: 'var(--radius-sm)', padding: '1rem 1.2rem', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.is_read ? 'var(--border)' : 'var(--primary)', marginTop: 6, flexShrink: 0 }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 2 }}>{n.title}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>{n.message}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 4 }}>{new Date(n.created_at).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
