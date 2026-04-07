import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';

const LeaveContext = createContext(null);

export const LeaveProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [balances, setBalances] = useState([]);
  const [history, setHistory]   = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(false);

  const fetchData = useCallback(async () => {
    if (!isLoggedIn) return;
    setLoadingLeaves(true);
    try {
      const [bal, hist] = await Promise.all([
        api.get('/leaves/balances'),
        api.get('/leaves'),
      ]);
      setBalances(bal);
      // Normalize _id → id for frontend compatibility
      setHistory(hist.map(l => ({ ...l, id: l._id, type: l.leaveType })));
    } catch (err) {
      console.error('Failed to load leave data:', err.message);
    } finally {
      setLoadingLeaves(false);
    }
  }, [isLoggedIn]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const submitLeave = async (application) => {
    const leave = await api.post('/leaves', application);
    const normalized = { ...leave, id: leave._id, type: leave.leaveType };
    setHistory(prev => [normalized, ...prev]);
    return normalized;
  };

  const cancelLeave = async (id) => {
    const updated = await api.patch(`/leaves/${id}/cancel`);
    setHistory(prev =>
      prev.map(l => l.id === id ? { ...updated, id: updated._id, type: updated.leaveType } : l)
    );
  };

  return (
    <LeaveContext.Provider value={{ balances, history, submitLeave, cancelLeave, loadingLeaves, refetch: fetchData }}>
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => useContext(LeaveContext);
