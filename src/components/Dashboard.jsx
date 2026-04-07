import { useNavigate } from 'react-router-dom';
import { useLeave } from '../context/LeaveContext';

const COLOR_MAP = {
  indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-500', bar: 'bg-indigo-500', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-700' },
  rose:   { bg: 'bg-rose-50',   icon: 'bg-rose-500',   bar: 'bg-rose-500',   text: 'text-rose-700',   badge: 'bg-rose-100 text-rose-700'   },
  amber:  { bg: 'bg-amber-50',  icon: 'bg-amber-500',  bar: 'bg-amber-500',  text: 'text-amber-700',  badge: 'bg-amber-100 text-amber-700'  },
};

const STATUS_STYLES = {
  Approved:  'bg-emerald-100 text-emerald-700',
  Pending:   'bg-amber-100 text-amber-700',
  Rejected:  'bg-red-100 text-red-700',
  Cancelled: 'bg-slate-100 text-slate-500',
};

const STATUS_ICONS = {
  Approved: '✅', Pending: '⏳', Rejected: '❌', Cancelled: '🚫',
};

const Dashboard = () => {
  const { balances, history } = useLeave();
  const navigate = useNavigate();

  const totalUsed = balances.reduce((s, b) => s + b.used, 0);
  const totalDays = balances.reduce((s, b) => s + b.days, 0);
  const pending   = history.filter(h => h.status === 'Pending').length;
  const recent    = history.slice(0, 5);

  const stats = [
    { label: 'Total Leave Days',  value: totalDays,  sub: 'across all types',    icon: '📅', color: 'bg-indigo-500' },
    { label: 'Days Used',         value: totalUsed,  sub: 'this year',            icon: '📤', color: 'bg-rose-500'   },
    { label: 'Days Remaining',    value: totalDays - totalUsed, sub: 'available', icon: '✨', color: 'bg-emerald-500'},
    { label: 'Pending Requests',  value: pending,    sub: 'awaiting approval',    icon: '⏳', color: 'bg-amber-500'  },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Page header */}
      <div className="mb-8 fade-in">
        <h1 className="text-2xl font-bold text-slate-900">Good morning, Keerthikumar 👋</h1>
        <p className="text-slate-500 mt-1">Here's an overview of your leave status.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={s.label} className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-100 fade-in-${i + 1}`}>
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-lg mb-3`}>
              {s.icon}
            </div>
            <div className="text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="text-sm font-medium text-slate-700 mt-0.5">{s.label}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Leave Balance Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-semibold text-slate-800 fade-in">Leave Balances</h2>
          {balances.map((leave, i) => {
            const c = COLOR_MAP[leave.color];
            const pct = Math.round((leave.used / leave.days) * 100);
            const remaining = leave.days - leave.used;
            return (
              <div key={leave.id} className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-100 fade-in-${i + 1}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${c.icon} rounded-xl flex items-center justify-center text-lg`}>
                      {leave.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{leave.type}</div>
                      <div className="text-xs text-slate-400">{leave.days} days total</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${c.text}`}>{remaining}</span>
                    <div className="text-xs text-slate-400">remaining</div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Used: {leave.used} days</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${c.bar} rounded-full animate-fill`}
                      style={{ '--target-width': `${pct}%`, width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-5 text-white fade-in">
            <h3 className="font-semibold mb-1">Need time off?</h3>
            <p className="text-indigo-100 text-sm mb-4">Submit a leave request in just a few steps.</p>
            <button
              onClick={() => navigate('/apply')}
              className="bg-white text-indigo-600 font-semibold text-sm px-5 py-2 rounded-xl hover:bg-indigo-50 hover:scale-105 active:scale-95 shadow"
            >
              Apply for Leave →
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="fade-in-2">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {recent.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No activity yet.</div>
            ) : (
              <ul className="divide-y divide-slate-50">
                {recent.map(leave => (
                  <li key={leave.id} className="px-4 py-3.5 hover:bg-slate-50">
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">{STATUS_ICONS[leave.status]}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-800 truncate">{leave.type}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {leave.startDate} → {leave.endDate}
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLES[leave.status]}`}>
                        {leave.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="px-4 py-3 border-t border-slate-100">
              <button
                onClick={() => navigate('/history')}
                className="text-sm text-indigo-600 font-medium hover:text-indigo-800"
              >
                View all history →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
