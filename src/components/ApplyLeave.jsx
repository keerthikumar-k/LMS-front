import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeave } from '../context/LeaveContext';

const LEAVE_TYPES = [
  { value: 'Annual Leave',   label: 'Annual Leave',   icon: '🌴', desc: 'Planned vacation or personal time' },
  { value: 'Sick Leave',     label: 'Sick Leave',     icon: '🏥', desc: 'Medical illness or health issues' },
  { value: 'Personal Leave', label: 'Personal Leave', icon: '⭐', desc: 'Personal matters or appointments' },
  { value: 'Maternity Leave',label: 'Maternity Leave',icon: '👶', desc: 'Maternity care and bonding' },
  { value: 'Paternity Leave',label: 'Paternity Leave',icon: '👨‍👧', desc: 'Paternity care and bonding' },
];

const Toast = ({ message, type, onClose }) => (
  <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white text-sm font-medium toast-enter ${type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
    <span className="text-lg">{type === 'success' ? '✅' : '❌'}</span>
    {message}
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 text-lg leading-none">×</button>
  </div>
);

const calcDays = (start, end) => {
  if (!start || !end) return 0;
  const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24);
  return diff >= 0 ? diff + 1 : 0;
};

const ApplyLeave = () => {
  const { submitLeave } = useLeave();
  const navigate = useNavigate();
  const [form, setForm] = useState({ leaveType: '', startDate: '', endDate: '', reason: '' });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const days = calcDays(form.startDate, form.endDate);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const validate = () => {
    const e = {};
    if (!form.leaveType) e.leaveType = 'Please select a leave type.';
    if (!form.startDate) e.startDate = 'Start date is required.';
    if (!form.endDate)   e.endDate   = 'End date is required.';
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      e.endDate = 'End date must be after start date.';
    if (!form.reason.trim()) e.reason = 'Please provide a reason.';
    if (form.reason.trim().length < 10) e.reason = 'Reason must be at least 10 characters.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSubmitting(true);
    setTimeout(() => {
      submitLeave({ ...form, days });
      setToast({ message: 'Leave application submitted successfully!', type: 'success' });
      setForm({ leaveType: '', startDate: '', endDate: '', reason: '' });
      setErrors({});
      setSubmitting(false);
      setTimeout(() => navigate('/history'), 1800);
    }, 600);
  };

  const selectedType = LEAVE_TYPES.find(t => t.value === form.leaveType);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="mb-8 fade-in">
        <h1 className="text-2xl font-bold text-slate-900">Apply for Leave</h1>
        <p className="text-slate-500 mt-1">Fill in the details below to submit your leave request.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6">

          {/* Leave Type */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 fade-in-1">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Leave Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LEAVE_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => { setForm(f => ({ ...f, leaveType: t.value })); setErrors(er => ({ ...er, leaveType: '' })); }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                    form.leaveType === t.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-2xl">{t.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{t.label}</div>
                    <div className="text-xs text-slate-400">{t.desc}</div>
                  </div>
                  {form.leaveType === t.value && (
                    <span className="ml-auto text-indigo-500 text-lg">✓</span>
                  )}
                </button>
              ))}
            </div>
            {errors.leaveType && <p className="mt-2 text-xs text-red-500">{errors.leaveType}</p>}
          </div>

          {/* Dates */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 fade-in-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  min={today}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.startDate ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                />
                {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  min={form.startDate || today}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.endDate ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                />
                {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
              </div>
            </div>

            {/* Day counter */}
            {days > 0 && (
              <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
                <span className="text-indigo-500 text-lg">📅</span>
                <span className="text-sm text-indigo-700 font-medium">
                  {days} working day{days !== 1 ? 's' : ''} selected
                  {selectedType ? ` · ${selectedType.icon} ${selectedType.label}` : ''}
                </span>
              </div>
            )}
          </div>

          {/* Reason */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 fade-in-3">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Reason for Leave <span className="text-red-500">*</span>
            </label>
            <textarea
              name="reason"
              rows={4}
              value={form.reason}
              onChange={handleChange}
              placeholder="Describe the reason for your leave request..."
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none ${errors.reason ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
            />
            <div className="flex justify-between mt-1">
              {errors.reason
                ? <p className="text-xs text-red-500">{errors.reason}</p>
                : <span />
              }
              <span className="text-xs text-slate-400">{form.reason.length} chars</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between fade-in-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold shadow-md hover:shadow-indigo-200 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>Submit Application →</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ApplyLeave;
