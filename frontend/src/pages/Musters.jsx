import React, { useState, useEffect } from 'react';
import api from '../api';
import { PlusCircle, Search, Edit2, Lock } from 'lucide-react';
import { format } from 'date-fns';

const Musters = () => {
  const [musters, setMusters] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    musterNo: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchMusters();
  }, []);

  const fetchMusters = async () => {
    try {
      const res = await api.get('/musters');
      setMusters(res.data);
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
      await api.post('/musters', formData);
      setShowModal(false);
      setFormData({ musterNo: '', startDate: '', endDate: '' });
      fetchMusters();
    } catch (error) {
      console.error(error);
      alert('Error adding Muster');
    }
  };

  const handleCloseMuster = async (id) => {
    if (window.confirm('Are you sure you want to close this muster?')) {
      try {
        await api.put(`/musters/${id}/close`);
        fetchMusters();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const filteredMusters = musters.filter(m => 
    m.musterNo.toString().includes(search)
  );

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Musters Management / मस्टर व्यवस्थापन</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center justify-center shadow-sm transition-colors w-full sm:w-auto"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          नवीन मस्टर (New Muster)
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="मस्टर नं. शोधा..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm border-b border-gray-200 dark:border-gray-600">
                <th className="p-4 font-medium">Muster No.</th>
                <th className="p-4 font-medium">Start Date</th>
                <th className="p-4 font-medium">End Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
              {filteredMusters.map(muster => (
                <tr key={muster._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors dark:text-gray-300">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">Muster {muster.musterNo}</td>
                  <td className="p-4">{format(new Date(muster.startDate), 'dd MMM yyyy')}</td>
                  <td className="p-4">{format(new Date(muster.endDate), 'dd MMM yyyy')}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${muster.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {muster.status}
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-end space-x-3">
                    {muster.status === 'Open' && (
                      <button onClick={() => handleCloseMuster(muster._id)} className="text-orange-600 hover:text-orange-800 flex items-center" title="Close Muster">
                        <Lock className="w-4 h-4 mr-1" /> Close
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredMusters.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    कोणताही मस्टर सापडला नाही (No Musters found)
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
            <h2 className="text-xl font-bold mb-4">नवीन मस्टर जोडा</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Muster Number</label>
                <input type="number" name="musterNo" value={formData.musterNo} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (सुरुवात)</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date (शेवट)</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
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

export default Musters;
