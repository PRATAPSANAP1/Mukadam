import React, { useState, useEffect } from 'react';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';
import { format } from 'date-fns';

const Ledger = () => {
  const { t } = useLanguage();
  const [koytas, setKoytas] = useState([]);
  const [selectedKoyta, setSelectedKoyta] = useState('');
  const [ledgerData, setLedgerData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchKoytas();
  }, []);

  useEffect(() => {
    if (selectedKoyta) fetchLedger(selectedKoyta);
  }, [selectedKoyta]);

  const fetchKoytas = async () => {
    try {
      const res = await api.get('/koytas');
      setKoytas(res.data);
      if (res.data.length > 0) setSelectedKoyta(res.data[0]._id);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLedger = async (koytaId) => {
    setLoading(true);
    try {
      const res = await api.get(`/ledger/${koytaId}`);
      setLedgerData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t('ledger')}</h1>
        <div className="w-full sm:w-64">
          <select 
            value={selectedKoyta} 
            onChange={(e) => setSelectedKoyta(e.target.value)} 
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none shadow-sm transition-colors"
          >
            <option value="">{t('select_koyta')}</option>
            {koytas.map(k => (
              <option key={k._id} value={k._id}>{k.koytaNo} - {k.husbandName}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12 text-gray-500 dark:text-gray-400">Loading...</div>
      ) : ledgerData ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{ledgerData.koyta.husbandName} ({t('koyta_no')} {ledgerData.koyta.koytaNo})</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{ledgerData.koyta.village || 'N/A'}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('final_balance')}</p>
              <p className={`text-2xl font-bold ${ledgerData.finalBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                ₹{ledgerData.finalBalance.toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm border-b border-gray-200 dark:border-gray-600">
                  <th className="p-4 font-medium">{t('date')}</th>
                  <th className="p-4 font-medium">{t('description')}</th>
                  <th className="p-4 font-medium text-right">{t('debit')}</th>
                  <th className="p-4 font-medium text-right">{t('credit')}</th>
                  <th className="p-4 font-bold text-right">{t('balance')}</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                {ledgerData.ledger.map((entry, index) => {
                  const isCredit = entry.amount >= 0;
                  return (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors dark:text-gray-300">
                      <td className="p-4 text-gray-600 dark:text-gray-400">{format(new Date(entry.date), 'dd/MM/yyyy')}</td>
                      <td className="p-4 font-medium text-gray-800 dark:text-white">{entry.description}</td>
                      <td className="p-4 text-right text-red-600 dark:text-red-400">{!isCredit ? `₹${Math.abs(entry.amount).toFixed(2)}` : '-'}</td>
                      <td className="p-4 text-right text-green-600 dark:text-green-400">{isCredit ? `₹${entry.amount.toFixed(2)}` : '-'}</td>
                      <td className={`p-4 text-right font-bold ${entry.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        ₹{entry.balance.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
                {ledgerData.ledger.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500 dark:text-gray-400">
                      कोणतीही नोंद नाही (No entries found)
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center p-12 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          कृपया कोयता निवडा (Please select a Koyta to view ledger)
        </div>
      )}
    </div>
  );
};

export default Ledger;
