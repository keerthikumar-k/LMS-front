import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeave } from '../context/LeaveContext';

const STATUS_STYLES = {
  Approved:  { pill: 'bg-emerald-100 text-emerald-700', icon: '✅' },
  Pending:   { pill: 'bg-amber-100 text-amber-700',     icon: '⏳' },
  Rejected:  { pill: 'bg-red-100 text-red-700',         icon: '❌' },
  Cancelled: { pill: 'bg-slate-100 text-slate-500',     icon: '🚫' },
};

const TABS = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'];

const LeaveHistory = () => {
  const { history, cancelLeave } = useLeave();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [cancelId, setCancelId] = useState(null);

  const filtered = history.filter(l => {
    const matchTab = activeTab === 'All' || l.status === activeTab;
    const matchSearch = l.type.toLowerCase().includes(search.toLowerCase()) ||
                        l.reason?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const tabCount = (tab) => tab === 'All' ? history.length : history.filter(l => l.status === tab).length;

  const handleCancel = (id) => {
    cancelLeave(id);
    setCancelId(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 fade-in">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leave History</h1>
          <p className="text-slate-500 mt-1">{history.length} total applications</p>
        </div>
        <button
          onClick={() => navigate('/apply')}
          className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold shadow-md hover:shadow-indigo-200 hover:scale-105 active:scale-95"
        >
          + New Application
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 fade-in-1">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input
          type="text"
          placeholder="Search by type or reason..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg">×</button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 fade-in-1">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {tabCount(tab)}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100 fade-in">
          <div className="text-4xl mb-3">📭</div>
          <div className="text-slate-600 font-medium">No records found</div>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((leave, i) => {
            const s = STATUS_STYLES[leave.status] || STATUS_STYLES.Cancelled;
            return (
              <div key={leave.id} className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md fade-in-${(i % 4) + 1}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-xl shrink-0">
                      {s.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-800">{leave.type}</span>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${s.pill}`}>
                          {leave.status}
                        </span>
                        {leave.days && (
                          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {leave.days} day{leave.days !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-500 mt-1">
                        📅 {leave.startDate} → {leave.endDate}
                      </div>
                      {leave.reason && (
                        <div className="text-sm text-slate-400 mt-1 truncate">💬 {leave.reason}</div>
                      )}
                      <div className="text-xs text-slate-400 mt-1.5">Applied: {leave.appliedDate}</div>
                    </div>
                  </div>

                  {leave.status === 'Pending' && (
                    <div className="shrink-0">
                      {cancelId === leave.id ? (
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-slate-500">Cancel this request?</span>
                          <div className="flex gap-2">
                            <button onClick={() => setCancelId(null)} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">No</button>
                            <button onClick={() => handleCancel(leave.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600">Yes, Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setCancelId(leave.id)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeaveHistory;
