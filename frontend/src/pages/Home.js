import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, Users, TrendingUp, Star, ArrowRight, ChevronRight } from 'lucide-react';
import { jobsAPI } from '../utils/api';

const CATEGORIES = [
  { name: 'Technology', icon: '💻', count: '1.2k+' },
  { name: 'Design', icon: '🎨', count: '480+' },
  { name: 'Marketing', icon: '📢', count: '320+' },
  { name: 'Finance', icon: '💰', count: '540+' },
  { name: 'Healthcare', icon: '🏥', count: '890+' },
  { name: 'Education', icon: '📚', count: '240+' },
  { name: 'Sales', icon: '📊', count: '610+' },
  { name: 'Operations', icon: '⚙️', count: '380+' },
];

const JOB_TYPE_COLOR = { full_time: 'primary', part_time: 'info', remote: 'success', contract: 'warning', internship: 'accent' };

function JobCard({ job }) {
  const initials = job.company_name ? job.company_name.slice(0, 2).toUpperCase() : 'JP';
  return (
    <Link to={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
      <div className="job-card">
        <div className="job-card-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div className="company-logo">
              {job.company_logo ? <img src={job.company_logo} alt="" /> : initials}
            </div>
            <div>
              <div className="job-title">{job.title}</div>
              <div className="job-company">{job.company_name}</div>
            </div>
          </div>
          {job.is_featured && <span className="badge badge-accent">Featured</span>}
        </div>
        <div className="job-meta">
          <span className="job-meta-item"><MapPin size={12} /> {job.location}</span>
          <span className="job-meta-item"><Briefcase size={12} /> {job.job_type?.replace('_', ' ')}</span>
          {job.salary_min && <span className="job-meta-item">₹{Number(job.salary_min).toLocaleString('en-IN')} – ₹{Number(job.salary_max).toLocaleString('en-IN')}</span>}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {job.skills_list?.slice(0, 3).map(s => (
            <span key={s} className="badge badge-primary">{s}</span>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
            {new Date(job.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
          <span className={`badge badge-${JOB_TYPE_COLOR[job.job_type] || 'primary'}`}>{job.experience_level}</span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [q, setQ] = useState('');
  const [featured, setFeatured] = useState([]);
  const [recent, setRecent] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    jobsAPI.featured().then(r => setFeatured(r.data)).catch(() => {});
    jobsAPI.list({ page_size: 6 }).then(r => setRecent(r.data.results || r.data)).catch(() => {});
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    navigate(`/jobs?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container" style={{ position: 'relative' }}>
          <div className="badge badge-accent" style={{ background: 'rgba(255,107,53,0.2)', color: '#ff8c5a', marginBottom: '1rem', display: 'inline-block' }}>
            🤖 AI-Powered Smart Recruitment
          </div>
          <h1>Find Your <span style={{ color: '#ff8c5a' }}>Dream Job</span><br />with AI Matching</h1>
          <p>Our intelligent engine matches your skills to the perfect role — faster, smarter, fairer.</p>
          <form className="hero-search" onSubmit={handleSearch}>
            <Search size={18} style={{ color: 'var(--text3)', flexShrink: 0, marginTop: 2 }} />
            <input
              placeholder="Job title, skills, company…"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search Jobs</button>
          </form>
          <div style={{ marginTop: '1.2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['React Developer', 'Data Scientist', 'UI/UX Designer', 'Marketing Manager'].map(s => (
              <button key={s} onClick={() => navigate(`/jobs?q=${s}`)}
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 20, padding: '5px 14px', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.25)'; }}
                onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.15)'; }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-bar">
        <div className="container">
          {[{ num: '50K+', label: 'Active Jobs' }, { num: '12K+', label: 'Companies' }, { num: '2M+', label: 'Job Seekers' }, { num: '98%', label: 'Match Accuracy' }].map(s => (
            <div key={s.label} className="stat-item">
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section style={{ padding: '4rem 0 2rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem' }}>Browse by Category</h2>
              <p style={{ color: 'var(--text3)', fontSize: '0.9rem' }}>Explore opportunities across industries</p>
            </div>
            <Link to="/jobs" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={`/jobs?q=${cat.name}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '1.2rem', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                  <div style={{ fontSize: '1.8rem' }}>{cat.icon}</div>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.9rem' }}>{cat.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{cat.count} jobs</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      {featured.length > 0 && (
        <section style={{ padding: '2rem 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem' }}>Featured Jobs</h2>
                <p style={{ color: 'var(--text3)', fontSize: '0.9rem' }}>Hand-picked opportunities</p>
              </div>
              <Link to="/jobs?featured=true" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                See more <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {featured.slice(0, 6).map(j => <JobCard key={j.id} job={j} />)}
            </div>
          </div>
        </section>
      )}

      {/* Recent Jobs */}
      <section style={{ padding: '2rem 0 4rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem' }}>Latest Openings</h2>
              <p style={{ color: 'var(--text3)', fontSize: '0.9rem' }}>Fresh opportunities posted today</p>
            </div>
            <Link to="/jobs" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              View all jobs <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {recent.slice(0, 6).map(j => <JobCard key={j.id} job={j} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #1a3a6b 100%)', padding: '4rem 0', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>Ready to hire the best talent?</h2>
          <p style={{ opacity: 0.8, marginBottom: '2rem', fontSize: '1rem' }}>Post your job and get matched with top candidates using AI.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register?role=employer" className="btn btn-accent btn-lg">Post a Job Free</Link>
            <Link to="/jobs" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>Browse Talent</Link>
          </div>
        </div>
      </section>
    </>
  );
}
