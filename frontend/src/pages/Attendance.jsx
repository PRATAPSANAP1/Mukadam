import React, { useState, useEffect } from 'react';
import api from '../api';
import { useSeason } from '../context/SeasonContext';

const Attendance = () => {
  const { activeSeason } = useSeason();
  const [musters, setMusters] = useState([]);
  const [selectedMusterId, setSelectedMusterId] = useState('');
  const [koytas, setKoytas] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [attendance, setAttendance] = useState({}); // { koytaId: 'P' | 'A' | 'H' }
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMusters();
    fetchKoytas();
  }, []);

  const fetchMusters = async () => {
    try {
      const res = await api.get('/musters');
      // Only show open musters or all? For daily attendance, probably open musters
      const openMusters = res.data.filter(m => m.status === 'Open');
      setMusters(openMusters);
      if (openMusters.length > 0) {
        setSelectedMusterId(openMusters[0]._id);
        setSelectedDate(new Date().toISOString().split('T')[0]); // Default to today
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchKoytas = async () => {
    try {
      const res = await api.get('/koytas');
      setKoytas(res.data.filter(k => k.isActive && k.status === 'Active'));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedMusterId && selectedDate) {
      fetchDailyAttendance();
    }
  }, [selectedMusterId, selectedDate]);

  const fetchDailyAttendance = async () => {
    try {
      const res = await api.get(`/attendance?musterId=${selectedMusterId}&date=${selectedDate}`);
      const attendanceMap = {};
      res.data.forEach(record => {
        attendanceMap[record.koytaId] = record.status;
      });
      // Set defaults for missing records
      koytas.forEach(k => {
        if (!attendanceMap[k._id]) {
          attendanceMap[k._id] = 'P'; // Default present
        }
      });
      setAttendance(attendanceMap);
    } catch (error) {
      console.error('Error fetching attendance', error);
    }
  };

  const handleStatusChange = (koytaId, status) => {
    setAttendance(prev => ({ ...prev, [koytaId]: status }));
  };

  const handleSave = async () => {
    if (!activeSeason) return alert('No active season selected!');
    setLoading(true);
    try {
      const records = Object.keys(attendance).map(koytaId => ({
        koytaId,
        status: attendance[koytaId]
      }));
      
      await api.post('/attendance/bulk', {
        musterId: selectedMusterId,
        seasonId: activeSeason._id,
        date: selectedDate,
        records
      });
      
      alert('Attendance saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">रोजची हजेरी (Daily Attendance)</h1>
        <button 
          onClick={handleSave}
          disabled={loading || koytas.length === 0}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'सेव्ह करा (Save)'}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6 flex flex-wrap gap-4 items-end transition-colors">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Muster (मस्टर)</label>
          <select 
            value={selectedMusterId}
            onChange={(e) => setSelectedMusterId(e.target.value)}
            className="w-full sm:w-64 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary transition-colors"
          >
            {musters.map(m => (
              <option key={m._id} value={m._id}>Muster {m.musterNo}</option>
            ))}
            {musters.length === 0 && <option value="">No Open Musters</option>}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date (तारीख)</label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full sm:w-48 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary transition-colors"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm border-b border-gray-200 dark:border-gray-600">
                <th className="p-4 font-medium w-24">Koyta No.</th>
                <th className="p-4 font-medium">Name (Husband & Wife)</th>
                <th className="p-4 font-medium text-center">Present (P)</th>
                <th className="p-4 font-medium text-center">Half (H)</th>
                <th className="p-4 font-medium text-center">Absent (A)</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
              {koytas.map(koyta => (
                <tr key={koyta._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors dark:text-gray-300">
                  <td className="p-4 font-bold text-gray-900 dark:text-white">{koyta.koytaNo}</td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900 dark:text-white">{koyta.husbandName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{koyta.wifeName}</div>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleStatusChange(koyta._id, 'P')}
                      className={`w-10 h-10 rounded-full font-bold transition-colors ${attendance[koyta._id] === 'P' ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'}`}
                    >
                      P
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleStatusChange(koyta._id, 'H')}
                      className={`w-10 h-10 rounded-full font-bold transition-colors ${attendance[koyta._id] === 'H' ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'}`}
                    >
                      H
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleStatusChange(koyta._id, 'A')}
                      className={`w-10 h-10 rounded-full font-bold transition-colors ${attendance[koyta._id] === 'A' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'}`}
                    >
                      A
                    </button>
                  </td>
                </tr>
              ))}
              {koytas.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    कोणतेही सक्रिय कोयते सापडले नाहीत (No active koytas found)
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

export default Attendance;
