import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';
import { useSeason } from '../context/SeasonContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { activeSeason } = useSeason();
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
    <div className="space-y-8 animate-fade-in-up">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 dark:from-orange-600 dark:to-orange-500 rounded-3xl p-8 shadow-lg text-white flex flex-col md:flex-row justify-between items-center transition-colors relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-orange-200 opacity-20 rounded-full blur-xl"></div>
        
        <div className="relative z-10 space-y-2 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            स्वागत आहे, मुकादम!
          </h1>
          <p className="text-orange-50 font-medium text-lg">
            ऊस तोडणी कामगारांचे व्यवस्थापन आता झाले अधिक सोपे.
          </p>
        </div>
        <div className="relative z-10 mt-6 md:mt-0 bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl border border-white/30 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-50">सध्याचा हंगाम</p>
          <p className="text-2xl font-bold">{activeSeason?.name || 'Loading...'}</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => navigate('/koytas')} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-b-4 border-orange-500 group cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-orange-50 dark:bg-gray-700 group-hover:bg-orange-500 group-hover:text-white text-orange-600 rounded-2xl flex items-center justify-center text-2xl font-bold transition-all duration-300 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">एकूण कोयते (Koytas)</p>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{metrics.totalKoytas}</p>
            </div>
          </div>
        </div>
        
        <div onClick={() => navigate('/musters')} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-b-4 border-orange-400 group cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-orange-50 dark:bg-gray-700 group-hover:bg-orange-400 group-hover:text-white text-orange-500 rounded-2xl flex items-center justify-center text-2xl font-bold transition-all duration-300 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">चालू मस्टर (Musters)</p>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{metrics.openMusters}</p>
            </div>
          </div>
        </div>

        <div onClick={() => navigate('/advances')} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-b-4 border-red-500 group cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-red-50 dark:bg-gray-700 group-hover:bg-red-500 group-hover:text-white text-red-600 rounded-2xl flex items-center justify-center text-2xl font-bold transition-all duration-300 shadow-sm">
              ₹
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">एकूण उचल (Advance)</p>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">₹{metrics.totalAdvances}</p>
            </div>
          </div>
        </div>

        <div onClick={() => navigate('/ledger')} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-b-4 border-green-500 group cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-green-50 dark:bg-gray-700 group-hover:bg-green-500 group-hover:text-white text-green-600 rounded-2xl flex items-center justify-center text-2xl font-bold transition-all duration-300 shadow-sm">
              ₹
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">एकूण बाकी (Balance)</p>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">₹{metrics.totalBalance}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
