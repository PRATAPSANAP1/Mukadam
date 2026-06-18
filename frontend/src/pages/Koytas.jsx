import React, { useState, useEffect } from 'react';
import api from '../api';
import { PlusCircle, Search, Filter } from 'lucide-react';

const Koytas = () => {
  const [koytas, setKoytas] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All'); // All, Full, Half, HighUchal, HighKhade
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    koytaNo: '',
    husbandName: '',
    wifeName: '',
    mobile: '',
    village: '',
    koytaType: 'Full'
  });

  useEffect(() => {
    fetchKoytas();
  }, []);

  const fetchKoytas = async () => {
    try {
      const res = await api.get('/koytas');
      setKoytas(res.data);
    } catch (error) {
      console.error('Failed to fetch Koytas', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await api.put(`/koytas/${formData._id}`, formData);
      } else {
        await api.post('/koytas', formData);
      }
      setShowModal(false);
      setFormData({ koytaNo: '', husbandName: '', wifeName: '', mobile: '', village: '', koytaType: 'Full', status: 'Active' });
      fetchKoytas();
    } catch (error) {
      console.error(error);
      alert('Error saving Koyta');
    }
  };

  const filteredKoytas = koytas.filter(k => {
    const matchesSearch = k.husbandName.toLowerCase().includes(search.toLowerCase()) || 
                          k.wifeName?.toLowerCase().includes(search.toLowerCase()) ||
                          k.koytaNo.toString().includes(search);
    
    if (!matchesSearch) return false;

    if (filter === 'Full') return k.koytaType === 'Full';
    if (filter === 'Half') return k.koytaType === 'Half';
    if (filter === 'HighUchal') return k.totalUchal > 10000;
    if (filter === 'HighKhade') return k.totalKhade >= 5;

    return true;
  });

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">कोयता व्यवस्थापन (All Koyte)</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center justify-center shadow-sm transition-colors w-full sm:w-auto"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          नवीन कोयता (New Koyta)
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="नावाने शोधा..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            />
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-5 h-5 text-gray-400 hidden sm:block" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary transition-colors w-full sm:w-auto"
            >
              <option value="All">सर्व (All)</option>
              <option value="Full">पूर्ण कोयते (Full)</option>
              <option value="Half">अर्धे कोयते (Half)</option>
              <option value="HighUchal">जास्त उचल घेतलेले</option>
              <option value="HighKhade">जास्त खाडे असलेले</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm border-b border-gray-200 dark:border-gray-600">
                <th className="p-4 font-medium">Koyta No.</th>
                <th className="p-4 font-medium">Name (Koyta 1 & Koyta 2)</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Status (स्थिती)</th>
                <th className="p-4 font-medium">धंदा (Dhanda)</th>
                <th className="p-4 font-medium">उचल (Uchal)</th>
                <th className="p-4 font-medium">बाकी (Baki)</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
              {filteredKoytas.map(koyta => (
                <tr key={koyta._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors dark:text-gray-300">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">{koyta.koytaNo}</td>
                  <td className="p-4 font-medium text-gray-900 dark:text-white">
                    {koyta.husbandName}
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-normal">{koyta.wifeName}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${koyta.koytaType === 'Full' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                      {koyta.koytaType === 'Full' ? 'पूर्ण कोयता' : 'अर्धा कोयता'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${koyta.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {koyta.status}
                    </span>
                  </td>
                  <td className="p-4 text-green-600 font-medium">₹{(koyta.dhanda || 0).toFixed(2)}</td>
                  <td className="p-4 text-red-600 font-medium">₹{(koyta.totalUchal || 0).toFixed(2)}</td>
                  <td className={`p-4 font-bold ${koyta.baki >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{(koyta.baki || 0).toFixed(2)}
                  </td>
                  <td className="p-4 flex items-center justify-end space-x-2">
                    <button onClick={() => {
                       setFormData({ ...koyta });
                       setShowModal(true);
                    }} className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded">Edit</button>
                  </td>
                </tr>
              ))}
              {filteredKoytas.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    कोणतेही कोयते सापडले नाहीत (No koytas found)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 dark:text-white">नवीन कोयता जोडा</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Koyta No.</label>
                <input type="number" name="koytaNo" value={formData.koytaNo} onChange={handleInputChange} required className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type (प्रकार)</label>
                <select name="koytaType" value={formData.koytaType} onChange={handleInputChange} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none">
                  <option value="Full">पूर्ण कोयता (Full)</option>
                  <option value="Half">अर्धा कोयता (Half)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Koyta 1</label>
                <input type="text" name="husbandName" value={formData.husbandName} onChange={handleInputChange} required className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Koyta 2</label>
                <input type="text" name="wifeName" value={formData.wifeName} onChange={handleInputChange} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile</label>
                <input type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Village (गाव)</label>
                <input type="text" name="village" value={formData.village} onChange={handleInputChange} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status (स्थिती)</label>
                <select name="status" value={formData.status || 'Active'} onChange={handleInputChange} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none">
                  <option value="Active">Active</option>
                  <option value="गावाला गेला">गावाला गेला (Went to Village)</option>
                  <option value="टोळी सोडली">टोळी सोडली (Left Team)</option>
                  <option value="नवीन आला">नवीन आला (Newly Arrived)</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Koytas;
