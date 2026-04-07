import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LeaveProvider } from './context/LeaveContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ApplyLeave from './components/ApplyLeave';
import LeaveHistory from './components/LeaveHistory';
import Profile from './components/Profile';
import Login from './components/Login';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const AppShell = () => {
  const { isLoggedIn } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {isLoggedIn && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/apply" element={<ProtectedRoute><ApplyLeave /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><LeaveHistory /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <LeaveProvider>
        <Router>
          <AppShell />
        </Router>
      </LeaveProvider>
    </AuthProvider>
  );
}

export default App;
