import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const JOB_TYPES = ['full_time', 'part_time', 'contract', 'internship', 'remote', 'freelance'];
const EXP_LEVELS = ['fresher', 'junior', 'mid', 'senior', 'lead'];

export default function PostJob() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '', description: '', requirements: '', responsibilities: '',
    skills_required: '', job_type: 'full_time', experience_level: 'junior',
    location: '', is_remote: false, salary_min: '', salary_max: '',
    salary_currency: 'INR', application_deadline: '', vacancies: 1,
    status: 'active', is_featured: false, category: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    jobsAPI.categories().then(r => setCategories(r.data.results || r.data)).catch(() => {});
    if (isEdit) {
      jobsAPI.detail(id).then(r => {
        const j = r.data;
        setForm({
          title: j.title, description: j.description, requirements: j.requirements || '',
          responsibilities: j.responsibilities || '', skills_required: j.skills_required || '',
          job_type: j.job_type, experience_level: j.experience_level, location: j.location,
          is_remote: j.is_remote, salary_min: j.salary_min || '', salary_max: j.salary_max || '',
          salary_currency: j.salary_currency, application_deadline: j.application_deadline || '',
          vacancies: j.vacancies, status: j.status, is_featured: j.is_featured,
          category: j.category || ''
        });
      }).catch(() => toast.error('Failed to load job.'));
    }
  }, [id]);

  const handle = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async e => {
    e.preventDefault();
    if (user?.role !== 'employer') { toast.error('Only employers can post jobs.'); return; }
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.salary_min) delete payload.salary_min;
      if (!payload.salary_max) delete payload.salary_max;
      if (!payload.application_deadline) delete payload.application_deadline;
      if (!payload.category) delete payload.category;

      if (isEdit) {
        await jobsAPI.update(id, payload);
        toast.success('Job updated successfully!');
      } else {
        await jobsAPI.create(payload);
        toast.success('Job posted successfully! 🎉');
      }
      navigate('/dashboard');
    } catch (err) {
      const errs = err.response?.data;
      if (errs) Object.entries(errs).forEach(([k, v]) => toast.error(`${k}: ${Array.isArray(v) ? v[0] : v}`));
      else toast.error('Failed to save job.');
    } finally { setLoading(false); }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 800 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">{isEdit ? 'Edit Job' : 'Post a New Job'}</h1>
        <p className="text-muted">Fill in the details to {isEdit ? 'update' : 'attract'} the best candidates.</p>
      </div>

      <form onSubmit={submit}>
        {/* Basic Info */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-body">
            <h3 style={{ marginBottom: '1.2rem', fontSize: '1rem' }}>Basic Information</h3>
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input name="title" placeholder="e.g. Senior React Developer" value={form.title} onChange={handle} required />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Job Type *</label>
                <select name="job_type" value={form.job_type} onChange={handle}>
                  {JOB_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Experience Level *</label>
                <select name="experience_level" value={form.experience_level} onChange={handle}>
                  {EXP_LEVELS.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Location *</label>
                <input name="location" placeholder="e.g. Hyderabad, India" value={form.location} onChange={handle} required />
              </div>
              <div className="form-group">
                <label className="form-label">Vacancies</label>
                <input name="vacancies" type="number" min="1" value={form.vacancies} onChange={handle} />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select name="category" value={form.category} onChange={handle}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Application Deadline</label>
                <input name="application_deadline" type="date" value={form.application_deadline} onChange={handle} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem' }}>
                <input type="checkbox" name="is_remote" checked={form.is_remote} onChange={handle} style={{ width: 'auto' }} />
                Remote Position
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem' }}>
                <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handle} style={{ width: 'auto' }} />
                Featured Listing
              </label>
            </div>
          </div>
        </div>

        {/* Salary */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-body">
            <h3 style={{ marginBottom: '1.2rem', fontSize: '1rem' }}>Compensation</h3>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Minimum Salary (₹/year)</label>
                <input name="salary_min" type="number" placeholder="e.g. 500000" value={form.salary_min} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="form-label">Maximum Salary (₹/year)</label>
                <input name="salary_max" type="number" placeholder="e.g. 1200000" value={form.salary_max} onChange={handle} />
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-body">
            <h3 style={{ marginBottom: '1.2rem', fontSize: '1rem' }}>Skills & Description</h3>
            <div className="form-group">
              <label className="form-label">Required Skills</label>
              <input name="skills_required" placeholder="e.g. React, Node.js, Python (comma-separated)" value={form.skills_required} onChange={handle} />
            </div>
            <div className="form-group">
              <label className="form-label">Job Description *</label>
              <textarea name="description" rows={6} placeholder="Describe the role, team, company culture..." value={form.description} onChange={handle} required />
            </div>
            <div className="form-group">
              <label className="form-label">Requirements</label>
              <textarea name="requirements" rows={4} placeholder="List candidate requirements..." value={form.requirements} onChange={handle} />
            </div>
            <div className="form-group">
              <label className="form-label">Responsibilities</label>
              <textarea name="responsibilities" rows={4} placeholder="Describe key responsibilities..." value={form.responsibilities} onChange={handle} />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-body">
            <h3 style={{ marginBottom: '1.2rem', fontSize: '1rem' }}>Status</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {['active', 'draft', 'closed'].map(s => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input type="radio" name="status" value={s} checked={form.status === s} onChange={handle} style={{ width: 'auto' }} />
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving…' : isEdit ? <><Save size={16} /> Update Job</> : <><PlusCircle size={16} /> Post Job</>}
          </button>
        </div>
      </form>
    </div>
  );
}
