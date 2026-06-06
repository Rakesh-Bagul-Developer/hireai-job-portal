import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { User, Save, Briefcase, MapPin, Phone, Globe, Github, Linkedin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [userForm, setUserForm] = useState({
    first_name: '', last_name: '', bio: '', location: '', phone: ''
  });
  const [seekerForm, setSeekerForm] = useState({
    skills: '', experience_years: 0, education: '', expected_salary: '',
    linkedin_url: '', github_url: '', portfolio_url: '', is_open_to_work: true
  });
  const [employerForm, setEmployerForm] = useState({
    company_name: '', company_website: '', company_size: '', industry: '',
    founded_year: '', company_description: '', headquarters: ''
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    if (user) {
      setUserForm({
        first_name: user.first_name || '', last_name: user.last_name || '',
        bio: user.bio || '', location: user.location || '', phone: user.phone || ''
      });
      if (user.role === 'jobseeker') {
        authAPI.getSeekerProfile().then(r => {
          const p = r.data;
          setSeekerForm({
            skills: p.skills || '', experience_years: p.experience_years || 0,
            education: p.education || '', expected_salary: p.expected_salary || '',
            linkedin_url: p.linkedin_url || '', github_url: p.github_url || '',
            portfolio_url: p.portfolio_url || '', is_open_to_work: p.is_open_to_work ?? true
          });
        }).catch(() => {});
      }
      if (user.role === 'employer') {
        authAPI.getEmployerProfile().then(r => {
          const p = r.data;
          setEmployerForm({
            company_name: p.company_name || '', company_website: p.company_website || '',
            company_size: p.company_size || '', industry: p.industry || '',
            founded_year: p.founded_year || '', company_description: p.company_description || '',
            headquarters: p.headquarters || ''
          });
        }).catch(() => {});
      }
    }
  }, [user]);

  const savePersonal = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await authAPI.updateProfile(userForm);
      await refreshUser();
      toast.success('Personal info updated!');
    } catch { toast.error('Failed to update.'); }
    finally { setSaving(false); }
  };

  const saveSeeker = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...seekerForm };
      if (!payload.expected_salary) delete payload.expected_salary;
      await authAPI.updateSeekerProfile(payload);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update.'); }
    finally { setSaving(false); }
  };

  const saveEmployer = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...employerForm };
      if (!payload.founded_year) delete payload.founded_year;
      await authAPI.updateEmployerProfile(payload);
      toast.success('Company profile updated!');
    } catch { toast.error('Failed to update.'); }
    finally { setSaving(false); }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    ...(user?.role === 'jobseeker' ? [{ id: 'professional', label: 'Professional' }] : []),
    ...(user?.role === 'employer' ? [{ id: 'company', label: 'Company' }] : []),
  ];

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 760 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">My Profile</h1>
        <p className="text-muted">Keep your information up to date.</p>
      </div>

      {/* Avatar card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 800, fontSize: '1.8rem', flexShrink: 0 }}>
            {user?.first_name?.[0] || user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 2 }}>{user?.first_name} {user?.last_name}</h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>{user?.email}</div>
            <span className={`badge ${user?.role === 'employer' ? 'badge-accent' : 'badge-primary'}`} style={{ marginTop: 6 }}>
              {user?.role === 'employer' ? '🏢 Employer' : '🔍 Job Seeker'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', background: 'var(--surface2)', borderRadius: 10, padding: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s',
              background: activeTab === t.id ? 'white' : 'transparent',
              color: activeTab === t.id ? 'var(--primary)' : 'var(--text2)',
              boxShadow: activeTab === t.id ? 'var(--shadow)' : 'none' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Personal */}
      {activeTab === 'personal' && (
        <div className="card">
          <div className="card-body">
            <form onSubmit={savePersonal}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input value={userForm.first_name} onChange={e => setUserForm(p => ({ ...p, first_name: e.target.value }))} placeholder="John" />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input value={userForm.last_name} onChange={e => setUserForm(p => ({ ...p, last_name: e.target.value }))} placeholder="Doe" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea rows={3} value={userForm.bio} onChange={e => setUserForm(p => ({ ...p, bio: e.target.value }))} placeholder="Tell employers about yourself..." />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input value={userForm.location} onChange={e => setUserForm(p => ({ ...p, location: e.target.value }))} placeholder="Hyderabad, India" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input value={userForm.phone} onChange={e => setUserForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 9876543210" />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={15} /> {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Professional (Seeker) */}
      {activeTab === 'professional' && (
        <div className="card">
          <div className="card-body">
            <form onSubmit={saveSeeker}>
              <div className="form-group">
                <label className="form-label">Skills (comma-separated)</label>
                <input value={seekerForm.skills} onChange={e => setSeekerForm(p => ({ ...p, skills: e.target.value }))} placeholder="React, Node.js, Python, MySQL..." />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Experience (years)</label>
                  <input type="number" min="0" value={seekerForm.experience_years} onChange={e => setSeekerForm(p => ({ ...p, experience_years: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Salary (₹/yr)</label>
                  <input type="number" value={seekerForm.expected_salary} onChange={e => setSeekerForm(p => ({ ...p, expected_salary: e.target.value }))} placeholder="800000" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Education</label>
                <input value={seekerForm.education} onChange={e => setSeekerForm(p => ({ ...p, education: e.target.value }))} placeholder="B.Tech Computer Science, JNTU 2022" />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <input type="url" value={seekerForm.linkedin_url} onChange={e => setSeekerForm(p => ({ ...p, linkedin_url: e.target.value }))} placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">GitHub URL</label>
                  <input type="url" value={seekerForm.github_url} onChange={e => setSeekerForm(p => ({ ...p, github_url: e.target.value }))} placeholder="https://github.com/..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Portfolio URL</label>
                  <input type="url" value={seekerForm.portfolio_url} onChange={e => setSeekerForm(p => ({ ...p, portfolio_url: e.target.value }))} placeholder="https://yourportfolio.com" />
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.2rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input type="checkbox" checked={seekerForm.is_open_to_work} onChange={e => setSeekerForm(p => ({ ...p, is_open_to_work: e.target.checked }))} style={{ width: 'auto' }} />
                I'm open to new opportunities
              </label>
              <div style={{ textAlign: 'right' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={15} /> {saving ? 'Saving…' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Company (Employer) */}
      {activeTab === 'company' && (
        <div className="card">
          <div className="card-body">
            <form onSubmit={saveEmployer}>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input value={employerForm.company_name} onChange={e => setEmployerForm(p => ({ ...p, company_name: e.target.value }))} placeholder="Acme Corp" required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Industry</label>
                  <input value={employerForm.industry} onChange={e => setEmployerForm(p => ({ ...p, industry: e.target.value }))} placeholder="Information Technology" />
                </div>
                <div className="form-group">
                  <label className="form-label">Company Size</label>
                  <select value={employerForm.company_size} onChange={e => setEmployerForm(p => ({ ...p, company_size: e.target.value }))}>
                    <option value="">Select size</option>
                    {['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'].map(s => <option key={s} value={s}>{s} employees</option>)}
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Founded Year</label>
                  <input type="number" value={employerForm.founded_year} onChange={e => setEmployerForm(p => ({ ...p, founded_year: e.target.value }))} placeholder="2015" />
                </div>
                <div className="form-group">
                  <label className="form-label">Headquarters</label>
                  <input value={employerForm.headquarters} onChange={e => setEmployerForm(p => ({ ...p, headquarters: e.target.value }))} placeholder="Bengaluru, India" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Website</label>
                <input type="url" value={employerForm.company_website} onChange={e => setEmployerForm(p => ({ ...p, company_website: e.target.value }))} placeholder="https://yourcompany.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Company Description</label>
                <textarea rows={4} value={employerForm.company_description} onChange={e => setEmployerForm(p => ({ ...p, company_description: e.target.value }))} placeholder="Tell candidates about your company..." />
              </div>
              <div style={{ textAlign: 'right' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={15} /> {saving ? 'Saving…' : 'Save Company Info'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
