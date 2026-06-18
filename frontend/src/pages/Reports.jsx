import React, { useState, useEffect } from 'react';
import api from '../api';
import { useSeason } from '../context/SeasonContext';
import { Printer } from 'lucide-react';

const Reports = () => {
  const { activeSeason } = useSeason();
  const [reportType, setReportType] = useState('Muster'); // Muster, Settlement, Village
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeSeason) {
      fetchReport();
    }
  }, [reportType, activeSeason]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      if (reportType === 'Muster') {
        const res = await api.get('/musters');
        setData(res.data);
      } else if (reportType === 'Settlement') {
        const res = await api.get('/calculation');
        setData(res.data);
      } else if (reportType === 'Village') {
        const res = await api.get('/koytas');
        const byVillage = {};
        res.data.forEach(k => {
          const v = k.village || 'Unknown';
          if (!byVillage[v]) byVillage[v] = { village: v, count: 0, uchal: 0, dhanda: 0 };
          byVillage[v].count++;
          byVillage[v].uchal += k.totalUchal || 0;
          byVillage[v].dhanda += k.dhanda || 0;
        });
        setData(Object.values(byVillage));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print:bg-white print:p-0 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center mb-6 print:hidden">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">अहवाल (Reports)</h1>
        <button 
          onClick={handlePrint}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center justify-center shadow-sm transition-colors w-full sm:w-auto"
        >
          <Printer className="w-5 h-5 mr-2" />
          अहवाल प्रिंट करा (Print)
        </button>
      </div>

      <div className="mb-6 print:hidden">
        <select 
          value={reportType} 
          onChange={e => setReportType(e.target.value)}
          className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="Muster">मस्टर अहवाल (Muster Report)</option>
          <option value="Settlement">अंतिम हिशोब (Settlement Report)</option>
          <option value="Village">गावानुसार अहवाल (Village Wise Report)</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden print:border-none print:shadow-none transition-colors">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 hidden print:block">
          <h2 className="text-xl font-bold text-center dark:text-white">{reportType} Report - {activeSeason?.name}</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">लोड होत आहे...</div>
        ) : (
          <div className="overflow-x-auto w-full">
            {reportType === 'Muster' && (
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm border-b dark:border-gray-600">
                    <th className="p-3 font-medium">मस्टर नं</th>
                    <th className="p-3 font-medium">सुरुवात</th>
                    <th className="p-3 font-medium">शेवट</th>
                    <th className="p-3 font-medium">स्थिती</th>
                    <th className="p-3 font-medium">खाडा फी</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                  {data.map(m => (
                    <tr key={m._id} className="dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="p-3">Muster {m.musterNo}</td>
                      <td className="p-3">{new Date(m.startDate).toLocaleDateString()}</td>
                      <td className="p-3">{new Date(m.endDate).toLocaleDateString()}</td>
                      <td className="p-3">{m.status}</td>
                      <td className="p-3">₹{m.khadaFee || 400}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {reportType === 'Village' && (
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm border-b dark:border-gray-600">
                    <th className="p-3 font-medium">गाव (Village)</th>
                    <th className="p-3 font-medium">एकूण कोयते</th>
                    <th className="p-3 font-medium">एकूण उचल</th>
                    <th className="p-3 font-medium">एकूण धंदा</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                  {data.map(v => (
                    <tr key={v.village} className="dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="p-3 font-medium text-gray-900 dark:text-white">{v.village}</td>
                      <td className="p-3">{v.count}</td>
                      <td className="p-3 text-red-600 dark:text-red-400">₹{v.uchal.toFixed(2)}</td>
                      <td className="p-3 text-green-600 dark:text-green-400">₹{v.dhanda.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {reportType === 'Settlement' && (
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm border-b dark:border-gray-600">
                    <th className="p-3 font-medium">कोयता</th>
                    <th className="p-3 font-medium">धंदा</th>
                    <th className="p-3 font-medium">उचल</th>
                    <th className="p-3 font-medium">खाडे कपात</th>
                    <th className="p-3 font-medium">बोनस</th>
                    <th className="p-3 font-medium">बाकी</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                  {data.map(s => (
                    <tr key={s._id} className="dark:text-gray-300">
                      <td className="p-3">{s.koytaId?.koytaNo} - {s.koytaId?.husbandName}</td>
                      <td className="p-3 text-green-600">₹{s.totalBusiness?.toFixed(2)}</td>
                      <td className="p-3 text-red-600">₹{s.advance?.toFixed(2)}</td>
                      <td className="p-3 text-red-600">₹{s.khadeDeduction?.toFixed(2)}</td>
                      <td className="p-3 text-green-600">₹{s.bonus?.toFixed(2)}</td>
                      <td className={`p-3 font-bold ${s.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{s.balance?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {data.length === 0 && <div className="p-8 text-center text-gray-500">माहिती उपलब्ध नाही</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
