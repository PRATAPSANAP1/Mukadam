import React, { useState, useEffect } from 'react';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

const Dashboard = () => {
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState({
    totalKoytas: 0,
    openMusters: 0,
    totalAdvances: 0,
    totalBalance: 0
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await api.get('/dashboard/metrics');
      setMetrics(res.data);
    } catch (error) {
      console.error('Failed to fetch metrics', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{t('dashboard')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow cursor-default group">
          <div className="w-14 h-14 bg-blue-50 group-hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{t('total_koytas')}</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.totalKoytas}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow cursor-default group">
          <div className="w-14 h-14 bg-purple-50 group-hover:bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xl font-bold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{t('active_musters')}</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.openMusters}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow cursor-default group">
          <div className="w-14 h-14 bg-red-50 group-hover:bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xl font-bold transition-colors">
            ₹
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{t('total_advances')}</p>
            <p className="text-2xl font-bold text-gray-900">₹{metrics.totalAdvances}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow cursor-default group">
          <div className="w-14 h-14 bg-green-50 group-hover:bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl font-bold transition-colors">
            ₹
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{t('total_balance')}</p>
            <p className="text-2xl font-bold text-gray-900">₹{metrics.totalBalance}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
