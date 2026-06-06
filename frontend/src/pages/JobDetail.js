import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobsAPI, appsAPI } from '../utils/api';
import { MapPin, Briefcase, Users, Calendar, DollarSign, Clock, Bookmark, BookmarkCheck, Send, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({ cover_letter: '', expected_salary: '', notice_period: '' });
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    jobsAPI.detail(id).then(r => {
      setJob(r.data);
      setSaved(r.data.is_saved);
      setLoading(false);
    }).catch(() => { toast.error('Job not found.'); navigate('/jobs'); });
  }, [id]);

  const handleSave = async () => {
    if (!user) { toast.error('Please login.'); return; }
    try {
      const r = await jobsAPI.saveJob(id);
      setSaved(r.data.saved);
      toast.success(r.data.message);
    } catch { toast.error('Error.'); }
  };

  const handleApply = async e => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setApplying(true);
    try {
      await appsAPI.apply({ job: id, ...applyForm });
      toast.success('Application submitted! Good luck 🎉');
      setShowApplyModal(false);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.non_field_errors?.[0] || 'Failed to apply.';
      toast.error(msg);
    } finally { setApplying(false); }
  };

  if (loading) return <div className="spinner"></div>;
  if (!job) return null;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <Link to="/jobs" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text2)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Jobs
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Main content */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: '1rem' }}>
                <div className="company-logo" style={{ width: 64, height: 64, fontSize: '1.4rem' }}>
                  {job.company_logo ? <img src={job.company_logo} alt="" /> : (job.company_name || 'CO').slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>{job.title}</h1>
                  <div style={{ fontSize: '1rem', color: 'var(--text2)', fontWeight: 500 }}>{job.company_name}</div>
                </div>
                {job.is_featured && <span className="badge badge-accent">⭐ Featured</span>}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: '1rem' }}>
                {[
                  { icon: <MapPin size={14} />, val: job.location },
                  { icon: <Briefcase size={14} />, val: job.job_type?.replace('_', ' ') },
                  { icon: <Users size={14} />, val: `${job.vacancies} vacancies` },
                  job.application_deadline && { icon: <Calendar size={14} />, val: `Deadline: ${job.application_deadline}` },
                  job.salary_min && { icon: <DollarSign size={14} />, val: `₹${Number(job.salary_min).toLocaleString('en-IN')} – ₹${Number(job.salary_max).toLocaleString('en-IN')}` },
                ].filter(Boolean).map((item, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.875rem', color: 'var(--text2)' }}>
                    {item.icon} {item.val}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {job.skills_list?.map(s => <span key={s} className="badge badge-primary">{s}</span>)}
              </div>
            </div>
          </div>

          {job.description && (
            <div className="card" style={{ marginBottom: '1rem' }}>
              <div className="card-body">
                <h3 style={{ marginBottom: '1rem' }}>Job Description</h3>
                <div style={{ color: 'var(--text2)', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{job.description}</div>
              </div>
            </div>
          )}

          {job.requirements && (
            <div className="card" style={{ marginBottom: '1rem' }}>
              <div className="card-body">
                <h3 style={{ marginBottom: '1rem' }}>Requirements</h3>
                <div style={{ color: 'var(--text2)', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{job.requirements}</div>
              </div>
            </div>
          )}

          {job.responsibilities && (
            <div className="card">
              <div className="card-body">
                <h3 style={{ marginBottom: '1rem' }}>Responsibilities</h3>
                <div style={{ color: 'var(--text2)', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{job.responsibilities}</div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="card" style={{ marginBottom: '1rem', position: 'sticky', top: 80 }}>
            <div className="card-body">
              <button onClick={() => user ? setShowApplyModal(true) : navigate('/login')}
                className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 10, padding: '12px' }}>
                <Send size={16} /> Apply Now
              </button>
              <button onClick={handleSave} className={`btn ${saved ? 'btn-ghost' : 'btn-outline'}`}
                style={{ width: '100%', justifyContent: 'center' }}>
                {saved ? <><BookmarkCheck size={16} /> Saved</> : <><Bookmark size={16} /> Save Job</>}
              </button>

              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Job Overview</div>
                {[
                  { label: 'Experience', val: job.experience_level },
                  { label: 'Job Type', val: job.job_type?.replace('_', ' ') },
                  { label: 'Location', val: job.location },
                  { label: 'Remote', val: job.is_remote ? 'Yes' : 'No' },
                  { label: 'Vacancies', val: job.vacancies },
                  { label: 'Views', val: job.views_count },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text3)' }}>{item.label}</span>
                    <span style={{ fontWeight: 500 }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Apply for {job.title}</h3>
            <p style={{ color: 'var(--text3)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{job.company_name}</p>
            <form onSubmit={handleApply}>
              <div className="form-group">
                <label className="form-label">Cover Letter</label>
                <textarea rows={5} placeholder="Why are you a great fit for this role?" value={applyForm.cover_letter}
                  onChange={e => setApplyForm(p => ({ ...p, cover_letter: e.target.value }))} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Expected Salary (₹/yr)</label>
                  <input type="number" placeholder="600000" value={applyForm.expected_salary}
                    onChange={e => setApplyForm(p => ({ ...p, expected_salary: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Notice Period</label>
                  <input placeholder="e.g. 30 days" value={applyForm.notice_period}
                    onChange={e => setApplyForm(p => ({ ...p, notice_period: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowApplyModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={applying}>
                  {applying ? 'Submitting…' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
