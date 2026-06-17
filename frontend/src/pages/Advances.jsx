import React, { useState, useEffect } from 'react';
import api from '../api';
import { PlusCircle, Search } from 'lucide-react';
import { format } from 'date-fns';

const Advances = () => {
  const [advances, setAdvances] = useState([]);
  const [koytas, setKoytas] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    koytaId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    remark: ''
  });

  useEffect(() => {
    fetchAdvances();
    fetchKoytas();
  }, []);

  const fetchAdvances = async () => {
    try {
      const res = await api.get('/advances');
      setAdvances(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchKoytas = async () => {
    try {
      const res = await api.get('/koytas');
      setKoytas(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/advances', formData);
      setShowModal(false);
      setFormData({ koytaId: '', amount: '', date: new Date().toISOString().split('T')[0], remark: '' });
      fetchAdvances();
    } catch (error) {
      console.error(error);
      alert('Error adding Advance');
    }
  };

  const filteredAdvances = advances.filter(a => 
    a.koytaId?.husbandName?.toLowerCase().includes(search.toLowerCase()) || 
    a.koytaId?.koytaNo?.toString().includes(search)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Advances / उचल</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          नवीन उचल (New Advance)
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="कोयता शोधा..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Koyta No & Name</th>
                <th className="p-4 font-medium">Amount (₹)</th>
                <th className="p-4 font-medium">Remark</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {filteredAdvances.map(advance => (
                <tr key={advance._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-500">{format(new Date(advance.date), 'dd MMM yyyy')}</td>
                  <td className="p-4 font-medium text-gray-900">{advance.koytaId?.koytaNo} - {advance.koytaId?.husbandName}</td>
                  <td className="p-4 font-bold text-red-600">₹{advance.amount}</td>
                  <td className="p-4 text-gray-500">{advance.remark || '-'}</td>
                </tr>
              ))}
              {filteredAdvances.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    कोणतीही उचल सापडली नाही (No advances found)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">नवीन उचल नोंदवा</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Koyta</label>
                <select name="koytaId" value={formData.koytaId} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                  <option value="">Select Koyta...</option>
                  {koytas.map(k => (
                    <option key={k._id} value={k._id}>{k.koytaNo} - {k.husbandName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remark / कारण</label>
                <input type="text" name="remark" value={formData.remark} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Advances;
