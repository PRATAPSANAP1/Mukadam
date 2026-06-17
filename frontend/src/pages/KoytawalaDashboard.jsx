import React, { useState, useEffect } from 'react';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';
import { Printer } from 'lucide-react';
import { format } from 'date-fns';

const KoytawalaDashboard = () => {
  const { t, lang } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
          const res = await api.get(`/koytawala/dashboard/${user.id}`);
          setData(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch koytawala dashboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Failed to load data</div>;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print:bg-white print:p-0">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">माझा हिशोब</h1>
        <button 
          onClick={handlePrint}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors"
        >
          <Printer className="w-5 h-5 mr-2" />
          हिशोब प्रिंट करा (Print)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 print:border-none print:shadow-none">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b pb-2">Profile / माहिती</h2>
          <div className="space-y-3">
            <p className="text-sm"><span className="text-gray-500 dark:text-gray-400">कोयता नं:</span> <span className="font-semibold dark:text-white">{data.profile.koytaNo}</span></p>
            <p className="text-sm"><span className="text-gray-500 dark:text-gray-400">नाव:</span> <span className="font-semibold dark:text-white">{data.profile.husbandName} & {data.profile.wifeName || ''}</span></p>
            <p className="text-sm"><span className="text-gray-500 dark:text-gray-400">प्रकार:</span> <span className="font-semibold dark:text-white">{data.profile.koytaType === 'Full' ? 'पूर्ण कोयता' : 'अर्धा कोयता'}</span></p>
            <p className="text-sm"><span className="text-gray-500 dark:text-gray-400">गाव:</span> <span className="font-semibold dark:text-white">{data.profile.village || 'N/A'}</span></p>
          </div>
        </div>

        {/* Current Muster & Attendance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2 print:border-none print:shadow-none">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b pb-2">Current Muster / चालू मस्टर</h2>
          {data.currentMuster ? (
            <div>
              <div className="flex justify-between mb-4">
                <p className="text-sm font-semibold dark:text-white">मस्टर नं: {data.currentMuster.musterNo}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(data.currentMuster.startDate), 'dd-MM-yyyy')} ते {format(new Date(data.currentMuster.endDate), 'dd-MM-yyyy')}
                </p>
              </div>
              <div className="flex space-x-6 mb-4">
                <p className="text-sm"><span className="text-gray-500 dark:text-gray-400">एकूण दिवस:</span> <span className="font-semibold dark:text-white">{data.currentMuster.totalDays}</span></p>
                <p className="text-sm"><span className="text-gray-500 dark:text-gray-400">उपस्थित:</span> <span className="font-semibold text-green-600">{data.currentMuster.present}</span></p>
                <p className="text-sm"><span className="text-gray-500 dark:text-gray-400">खाडे:</span> <span className="font-semibold text-red-600">{data.currentMuster.absent}</span></p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Calendar View:</p>
                <div className="flex flex-wrap gap-2">
                  {data.currentMuster.calendar.map((day, i) => (
                    <div key={i} className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold ${day.status === 'P' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {day.day} <br/> {day.status}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">कोणताही चालू मस्टर नाही (No active muster)</p>
          )}
        </div>

        {/* Settlement Summary */}
        <div className="bg-primary/5 dark:bg-primary/10 rounded-xl shadow-sm border border-primary/20 p-6 lg:col-span-3 print:border-none print:shadow-none">
          <h2 className="text-xl font-bold text-primary-dark dark:text-primary mb-4 border-b border-primary/20 pb-2">Settlement Summary / अंतिम हिशोब</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">एकूण धंदा (+)</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">₹{data.settlementSummary.dhanda.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">एकूण उचल (-)</p>
              <p className="text-2xl font-bold text-red-600">₹{data.settlementSummary.uchal.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">खाडे कपात (-)</p>
              <p className="text-2xl font-bold text-red-600">₹{data.settlementSummary.khade.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">अंतिम बाकी (Balance)</p>
              <p className={`text-3xl font-bold ${data.settlementSummary.baki >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{data.settlementSummary.baki.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Muster-wise History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-3 print:border-none print:shadow-none">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b pb-2">Muster-wise History / मस्टर इतिहास</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm border-b border-gray-200 dark:border-gray-600">
                  <th className="p-3 font-medium">मस्टर नं</th>
                  <th className="p-3 font-medium">धंदा</th>
                  <th className="p-3 font-medium">उचल</th>
                  <th className="p-3 font-medium">खाडे</th>
                  <th className="p-3 font-medium">बाकी</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                {data.musterHistory.map((m, i) => (
                  <tr key={i} className="dark:text-gray-300">
                    <td className="p-3">{m.musterNo}</td>
                    <td className="p-3 text-green-600">₹{m.dhanda.toFixed(2)}</td>
                    <td className="p-3 text-red-600">₹{m.uchal.toFixed(2)}</td>
                    <td className="p-3">{m.khadeCount}</td>
                    <td className={`p-3 font-bold ${m.baki >= 0 ? 'text-green-600' : 'text-red-600'}`}>₹{m.baki.toFixed(2)}</td>
                  </tr>
                ))}
                {data.musterHistory.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">कोणताही इतिहास नाही</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Uchal History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2 print:border-none print:shadow-none">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b pb-2">Uchal History / उचल इतिहास</h2>
          <ul className="space-y-2">
            {data.uchal.history.map((u, i) => (
              <li key={i} className="flex justify-between text-sm dark:text-gray-300 border-b border-gray-50 dark:border-gray-700 pb-2">
                <span>{format(new Date(u.date), 'dd MMM yyyy')} {u.remark ? `(${u.remark})` : ''}</span>
                <span className="font-bold text-red-600">₹{u.amount}</span>
              </li>
            ))}
            {data.uchal.history.length === 0 && <li className="text-gray-500 text-sm">कोणतीही उचल नाही</li>}
          </ul>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 print:hidden">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b pb-2">Notifications / सूचना</h2>
          <ul className="space-y-3">
            {data.notifications.map((n) => (
              <li key={n.id} className={`p-3 rounded-lg text-sm border ${n.type === 'success' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' : 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'}`}>
                {n.text}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default KoytawalaDashboard;
