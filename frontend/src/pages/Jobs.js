import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { jobsAPI } from '../utils/api';
import { Search, MapPin, Briefcase, Filter, Bookmark, BookmarkCheck, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const JOB_TYPES = ['full_time', 'part_time', 'remote', 'contract', 'internship'];
const EXP_LEVELS = ['fresher', 'junior', 'mid', 'senior', 'lead'];
const STATUS_COLOR = { full_time: 'primary', part_time: 'info', remote: 'success', contract: 'warning', internship: 'accent' };

function JobCard({ job, onSave }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(job.is_saved);
  const initials = job.company_name ? job.company_name.slice(0, 2).toUpperCase() : 'CO';

  const handleSave = async e => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { toast.error('Please login to save jobs.'); return; }
    try {
      const r = await jobsAPI.saveJob(job.id);
      setSaved(r.data.saved);
      toast.success(r.data.message);
    } catch { toast.error('Failed to save job.'); }
  };

  return (
    <div className="job-card" style={{ cursor: 'pointer' }}>
      <div className="job-card-header">
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="company-logo">
            {job.company_logo ? <img src={job.company_logo} alt="" /> : initials}
          </div>
          <div>
            <Link to={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
              <div className="job-title" style={{ marginBottom: 2 }}>{job.title}</div>
            </Link>
            <div className="job-company">{job.company_name}</div>
          </div>
        </div>
        <button onClick={handleSave} style={{ background: 'none', border: 'none', cursor: 'pointer', color: saved ? 'var(--primary)' : 'var(--text3)', padding: 4 }}>
          {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>
      <div className="job-meta">
        <span className="job-meta-item"><MapPin size={12} /> {job.location}</span>
        <span className="job-meta-item"><Briefcase size={12} /> {job.job_type?.replace('_', ' ')}</span>
        {job.is_remote && <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>Remote</span>}
      </div>
      {job.salary_min && (
        <div style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600, margin: '6px 0' }}>
          ₹{Number(job.salary_min).toLocaleString('en-IN')} – ₹{Number(job.salary_max).toLocaleString('en-IN')} / yr
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
        {job.skills_list?.slice(0, 4).map(s => (
          <span key={s} className="badge badge-primary" style={{ fontSize: '0.72rem' }}>{s}</span>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
          {new Date(job.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className={`badge badge-${STATUS_COLOR[job.job_type] || 'primary'}`}>{job.job_type?.replace('_', ' ')}</span>
          <span className="badge badge-info">{job.experience_level}</span>
        </div>
      </div>
    </div>
  );
}

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    job_type: searchParams.get('job_type') || '',
    experience: searchParams.get('experience') || '',
    location: searchParams.get('location') || '',
    is_remote: searchParams.get('is_remote') || '',
  });
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, q, page };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const r = await jobsAPI.list(params);
      const data = r.data;
      setJobs(Array.isArray(data) ? data : (data.results || []));
      setCount(data.count || (Array.isArray(data) ? data.length : 0));
    } catch { setJobs([]); }
    finally { setLoading(false); }
  }, [q, filters, page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleFilter = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: prev[key] === val ? '' : val }));
    setPage(1);
  };

  const FilterPanel = () => (
    <div>
      <h3 style={{ fontFamily: 'Syne', fontSize: '1rem', marginBottom: '1.2rem' }}>Filters</h3>

      <div style={{ marginBottom: '1.5rem' }}>
        <div className="filter-title">Job Type</div>
        {JOB_TYPES.map(t => (
          <label key={t} className="filter-option">
            <input type="checkbox" checked={filters.job_type === t} onChange={() => handleFilter('job_type', t)} />
            {t.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </label>
        ))}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div className="filter-title">Experience Level</div>
        {EXP_LEVELS.map(e => (
          <label key={e} className="filter-option">
            <input type="checkbox" checked={filters.experience === e} onChange={() => handleFilter('experience', e)} />
            {e.charAt(0).toUpperCase() + e.slice(1)}
          </label>
        ))}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div className="filter-title">Location</div>
        <input placeholder="e.g. Hyderabad" value={filters.location}
          onChange={e => { setFilters(p => ({ ...p, location: e.target.value })); setPage(1); }} />
      </div>

      <label className="filter-option" style={{ marginBottom: '1rem' }}>
        <input type="checkbox" checked={filters.is_remote === 'true'} onChange={() => handleFilter('is_remote', filters.is_remote === 'true' ? '' : 'true')} />
        Remote Only
      </label>

      {Object.values(filters).some(Boolean) && (
        <button className="btn btn-ghost btn-sm w-full" onClick={() => { setFilters({ job_type: '', experience: '', location: '', is_remote: '' }); setQ(''); setPage(1); }}>
          Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      {/* Search bar */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem 1.2rem', display: 'flex', gap: 10, alignItems: 'center', marginBottom: '1.5rem', boxShadow: 'var(--shadow)' }}>
        <Search size={18} style={{ color: 'var(--text3)', flexShrink: 0 }} />
        <input placeholder="Search jobs, skills, companies…" value={q} onChange={e => { setQ(e.target.value); setPage(1); }}
          style={{ border: 'none', flex: 1, padding: '4px 0', fontSize: '0.95rem' }} />
        <button className="btn btn-ghost btn-sm" onClick={() => setShowMobileFilters(!showMobileFilters)} style={{ display: 'none' }}>
          <SlidersHorizontal size={16} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.5rem' }}>
        {/* Sidebar */}
        <div>
          <div className="filter-sidebar"><FilterPanel /></div>
        </div>

        {/* Results */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text2)' }}>
              <strong>{count}</strong> jobs found
            </div>
          </div>

          {loading ? (
            <div className="spinner"></div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <Briefcase size={48} />
              <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>No jobs found</p>
              <p style={{ fontSize: '0.875rem' }}>Try different keywords or filters</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {jobs.map(j => <JobCard key={j.id} job={j} />)}
            </div>
          )}

          {/* Pagination */}
          {count > 10 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '2rem' }}>
              <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span style={{ padding: '6px 14px', fontSize: '0.875rem', color: 'var(--text2)' }}>Page {page}</span>
              <button className="btn btn-ghost btn-sm" disabled={jobs.length < 10} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
