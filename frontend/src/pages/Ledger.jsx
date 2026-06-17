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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('ledger')}</h1>
        <div className="w-64">
          <select 
            value={selectedKoyta} 
            onChange={(e) => setSelectedKoyta(e.target.value)} 
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none shadow-sm"
          >
            <option value="">{t('select_koyta')}</option>
            {koytas.map(k => (
              <option key={k._id} value={k._id}>{k.koytaNo} - {k.husbandName}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12 text-gray-500">Loading...</div>
      ) : ledgerData ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{ledgerData.koyta.husbandName} ({t('koyta_no')} {ledgerData.koyta.koytaNo})</h2>
              <p className="text-gray-500 text-sm mt-1">{ledgerData.koyta.village || 'N/A'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 font-medium">{t('final_balance')}</p>
              <p className={`text-2xl font-bold ${ledgerData.finalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{ledgerData.finalBalance.toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm border-b border-gray-200">
                  <th className="p-4 font-medium">{t('date')}</th>
                  <th className="p-4 font-medium">{t('description')}</th>
                  <th className="p-4 font-medium text-right">{t('debit')}</th>
                  <th className="p-4 font-medium text-right">{t('credit')}</th>
                  <th className="p-4 font-bold text-right">{t('balance')}</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {ledgerData.ledger.map((entry, index) => {
                  const isCredit = entry.amount >= 0;
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-gray-600">{format(new Date(entry.date), 'dd/MM/yyyy')}</td>
                      <td className="p-4 font-medium text-gray-800">{entry.description}</td>
                      <td className="p-4 text-right text-red-600">{!isCredit ? `₹${Math.abs(entry.amount).toFixed(2)}` : '-'}</td>
                      <td className="p-4 text-right text-green-600">{isCredit ? `₹${entry.amount.toFixed(2)}` : '-'}</td>
                      <td className={`p-4 text-right font-bold ${entry.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{entry.balance.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
                {ledgerData.ledger.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      कोणतीही नोंद नाही (No entries found)
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center p-12 text-gray-500 border border-dashed border-gray-300 rounded-xl bg-gray-50">
          कृपया कोयता निवडा (Please select a Koyta to view ledger)
        </div>
      )}
    </div>
  );
};

export default Ledger;
