import { useState, useEffect } from 'react';

const INITIAL = {
  name: 'KEERTHIKUMAR K',
  email: 'keerthikumar.doe@company.com',
  employeeId: 'EMP001',
  department: 'Engineering',
  position: 'Software Developer',
  joinDate: '2022-01-15',
  phone: '9443697784',
};

const Toast = ({ message, onClose }) => (
  <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl bg-emerald-500 text-white text-sm font-medium toast-enter">
    <span className="text-lg">✅</span>
    {message}
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 text-lg leading-none">×</button>
  </div>
);

const Field = ({ label, name, type = 'text', value, editing, onChange, readOnly, error }) => (
  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-slate-500 flex items-center">{label}</dt>
    <dd className="mt-1 sm:mt-0 sm:col-span-2">
      {editing && !readOnly ? (
        <div>
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${error ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      ) : (
        <span className="text-sm text-slate-800 font-medium">{value}</span>
      )}
    </dd>
  </div>
);

const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const Profile = () => {
  const [profile, setProfile] = useState(INITIAL);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...INITIAL });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(false), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const validate = () => {
    const e = {};
    if (!draft.name.trim()) e.name = 'Name is required.';
    if (!draft.email.trim() || !/\S+@\S+\.\S+/.test(draft.email)) e.email = 'Valid email is required.';
    if (!draft.phone.trim()) e.phone = 'Phone is required.';
    if (!draft.department.trim()) e.department = 'Department is required.';
    if (!draft.position.trim()) e.position = 'Position is required.';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setProfile({ ...draft });
    setEditing(false);
    setErrors({});
    setToast(true);
  };

  const handleCancel = () => {
    setDraft({ ...profile });
    setEditing(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraft(d => ({ ...d, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const yearsAtCompany = new Date().getFullYear() - new Date(profile.joinDate).getFullYear();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {toast && <Toast message="Profile updated successfully!" onClose={() => setToast(false)} />}

      {/* Profile Hero Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-6 mb-6 text-white fade-in">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold text-white shadow-lg shrink-0">
            {getInitials(profile.name)}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-indigo-100 mt-0.5">{profile.position} · {profile.department}</p>
            <p className="text-indigo-200 text-sm mt-1">{profile.email}</p>
          </div>
          {!editing && (
            <button
              onClick={() => { setDraft({ ...profile }); setEditing(true); }}
              className="shrink-0 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl backdrop-blur border border-white/30"
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-white/20">
          {[
            { label: 'Employee ID', value: profile.employeeId },
            { label: 'Joined',      value: new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) },
            { label: 'Years Here',  value: `${yearsAtCompany}+ yrs` },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-lg font-bold">{s.value}</div>
              <div className="text-indigo-200 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden fade-in-2">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Personal Information</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {editing ? 'Make your changes below and save.' : 'Your personal details and contact information.'}
            </p>
          </div>
          {editing && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">Editing</span>
          )}
        </div>

        <dl className="divide-y divide-slate-50 px-6">
          <Field label="Full Name"     name="name"       value={editing ? draft.name       : profile.name}       editing={editing} onChange={handleChange} error={errors.name} />
          <Field label="Email Address" name="email"      type="email" value={editing ? draft.email : profile.email} editing={editing} onChange={handleChange} error={errors.email} />
          <Field label="Employee ID"   name="employeeId" value={profile.employeeId} editing={editing} onChange={handleChange} readOnly />
          <Field label="Department"    name="department" value={editing ? draft.department  : profile.department}  editing={editing} onChange={handleChange} error={errors.department} />
          <Field label="Position"      name="position"   value={editing ? draft.position    : profile.position}    editing={editing} onChange={handleChange} error={errors.position} />
          <Field label="Join Date"     name="joinDate"   value={profile.joinDate} editing={editing} onChange={handleChange} readOnly />
          <Field label="Phone Number"  name="phone"      type="tel" value={editing ? draft.phone : profile.phone} editing={editing} onChange={handleChange} error={errors.phone} />
        </dl>

        {editing && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold shadow-md hover:shadow-indigo-200 hover:scale-105 active:scale-95"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
