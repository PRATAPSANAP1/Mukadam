import React, { useState, useEffect } from 'react';
import api from '../api';
import { Calculator } from 'lucide-react';

const Settlement = () => {
  const [settlements, setSettlements] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettlements();
  }, []);

  const fetchSettlements = async () => {
    try {
      const res = await api.get('/calculation');
      // If there are existing settlements
      setSettlements(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await api.post('/calculation/settle');
      setSummary(res.data.summary);
      setSettlements(res.data.settlements);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error generating settlement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Final Settlement / अंतिम हिशोब</h1>
        <button 
          onClick={handleCalculate}
          disabled={loading}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg flex items-center justify-center shadow-md transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          <Calculator className="w-5 h-5 mr-2" />
          {loading ? 'Calculating...' : 'हिशोब करा (Calculate Settlement)'}
        </button>
      </div>

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-center transition-colors">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Earnings</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{summary.totalEarnings.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-center transition-colors">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Koytas</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{summary.totalKoytas}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-center transition-colors">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Base Share</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">₹{summary.baseShare.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-center transition-colors">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Fine Collected</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">₹{summary.totalFineCollected.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-center transition-colors">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Bonus Per Koyta</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">+₹{summary.bonusPerKoyta.toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm border-b border-gray-200 dark:border-gray-600">
                <th className="p-4 font-medium">Koyta No.</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Base Share</th>
                <th className="p-4 font-medium">Khade Fine (-)</th>
                <th className="p-4 font-medium">Advance (-)</th>
                <th className="p-4 font-medium">Bonus (+)</th>
                <th className="p-4 font-bold text-right text-lg">Final Balance</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
              {settlements.map((set, index) => {
                const isPositive = set.balance >= 0;
                // Support both objects depending on API structure
                const name = set.name || set.koytaId?.husbandName;
                const koytaNo = set.koytaNo || set.koytaId?.koytaNo;
                const baseShare = set.baseShare || set.totalBusiness || 0;
                const totalAdvance = set.totalAdvance || set.advance || 0;
                const khadeDeduction = set.khadeDeduction || 0;
                const bonus = set.bonus || 0;
                const balance = set.balance || 0;

                return (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors dark:text-gray-300">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{koytaNo}</td>
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{name}</td>
                    <td className="p-4">₹{baseShare.toFixed(2)}</td>
                    <td className="p-4 text-red-600 dark:text-red-400">₹{khadeDeduction.toFixed(2)}</td>
                    <td className="p-4 text-red-600 dark:text-red-400">₹{totalAdvance.toFixed(2)}</td>
                    <td className="p-4 text-green-600 dark:text-green-400">₹{bonus.toFixed(2)}</td>
                    <td className={`p-4 font-bold text-right text-lg ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      ₹{balance.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              {settlements.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500 dark:text-gray-400">
                    हिशोब पाहण्यासाठी 'हिशोब करा' बटणावर क्लिक करा. (Click Calculate to generate settlement)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Settlement;
