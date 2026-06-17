import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Koytas from './pages/Koytas';
import Musters from './pages/Musters';
import Advances from './pages/Advances';
import Attendance from './pages/Attendance';
import Settlement from './pages/Settlement';
import Ledger from './pages/Ledger';
import Reports from './pages/Reports';
import KoytawalaDashboard from './pages/KoytawalaDashboard';

const App = () => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setAuth(JSON.parse(user));
    }
  }, []);

  return (
    <>
      {auth ? (
        <Layout auth={auth} setAuth={setAuth}>
          <Routes>
            {auth.role === 'Koytawala' ? (
              <>
                <Route path="/koytawala-dashboard" element={<KoytawalaDashboard />} />
                <Route path="*" element={<Navigate to="/koytawala-dashboard" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/koytas" element={<Koytas />} />
                <Route path="/musters" element={<Musters />} />
                <Route path="/advances" element={<Advances />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/settlement" element={<Settlement />} />
                <Route path="/ledger" element={<Ledger />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </>
  );
};

export default App;
