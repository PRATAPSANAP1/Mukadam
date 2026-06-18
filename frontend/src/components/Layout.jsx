import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Users, FileText, Banknote, CalendarMinus, Settings, BookOpen, Globe, Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { useLanguage } from '../context/LanguageContext';
import { useSeason } from '../context/SeasonContext';

const Sidebar = ({ auth, isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { t } = useLanguage();

  let links = [];
  if (auth?.role === 'Koytawala') {
    links = [
      { name: 'माझा हिशोब (My Hishob)', path: '/koytawala-dashboard', icon: <Home className="w-5 h-5" /> }
    ];
  } else {
    links = [
      { name: t('dashboard'), path: '/', icon: <Home className="w-5 h-5" /> },
      { name: t('koytas'), path: '/koytas', icon: <Users className="w-5 h-5" /> },
      { name: t('musters'), path: '/musters', icon: <FileText className="w-5 h-5" /> },
      { name: t('advances'), path: '/advances', icon: <Banknote className="w-5 h-5" /> },
      { name: 'रोजची हजेरी (Attendance)', path: '/attendance', icon: <CalendarMinus className="w-5 h-5" /> },
      { name: t('settlement'), path: '/settlement', icon: <Settings className="w-5 h-5" /> },
      { name: t('ledger'), path: '/ledger', icon: <BookOpen className="w-5 h-5" /> },
      { name: 'अहवाल (Reports)', path: '/reports', icon: <FileText className="w-5 h-5" /> },
    ];
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={clsx(
        "w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed top-0 left-0 flex flex-col shadow-sm z-30 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 bg-primary/10 dark:bg-primary/20">
          <h1 className="text-xl font-bold text-primary-dark dark:text-primary">हिशोब प्रणाली</h1>
          <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-gray-900 dark:text-gray-300">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {links.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => {
                      if (window.innerWidth < 768) toggleSidebar();
                    }}
                    className={clsx(
                      'flex items-center px-3 py-2.5 rounded-lg font-medium transition-colors duration-200',
                      isActive
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 text-center">
          {auth?.role === 'Koytawala' ? 'Koytawala Portal' : 'Admin Portal'}
        </div>
      </div>
    </>
  );
};

const Topbar = ({ auth, setAuth, toggleSidebar }) => {
  const { lang, toggleLanguage } = useLanguage();
  const { seasons, activeSeason, changeSeason, addSeason } = useSeason();
  const [showAddSeasonModal, setShowAddSeasonModal] = useState(false);
  const [newSeasonData, setNewSeasonData] = useState({ name: '', startDate: '', endDate: '', isActive: true });
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(null);
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shadow-sm transition-colors">
      <div className="flex items-center space-x-3">
        <button onClick={toggleSidebar} className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">
          <Menu className="w-6 h-6" />
        </button>
        <div className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <span className="hidden sm:inline">Us Todni Toli</span>
          {auth?.role === 'Mukadam' && seasons.length > 0 && (
            <select 
              value={activeSeason?._id || ''}
              onChange={(e) => {
                if (e.target.value === 'add_new') {
                  setShowAddSeasonModal(true);
                } else {
                  changeSeason(e.target.value);
                }
              }}
              className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 dark:text-white border-none rounded-lg px-2 py-1 sm:px-3 font-medium focus:ring-0 mt-1 sm:mt-0 max-w-[120px] sm:max-w-none"
            >
              {seasons.map(s => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
              <option value="add_new">+ नवीन हंगाम (Add New)</option>
            </select>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button onClick={toggleTheme} className="p-1 sm:p-2 text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
          {isDark ? '☀️' : '🌙'}
        </button>
        <button 
          onClick={toggleLanguage}
          className="hidden sm:flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium transition-colors dark:text-white"
        >
          <Globe className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-300" />
          {lang === 'mr' ? 'EN' : 'MR'}
        </button>
        <button onClick={handleLogout} className="text-xs sm:text-sm font-medium text-red-600 hover:text-red-800">
          लॉगआउट
        </button>
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
          {auth?.name?.charAt(0) || 'U'}
        </div>
      </div>

      {showAddSeasonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">नवीन हंगाम जोडा (Add New Season)</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await addSeason(newSeasonData);
                setShowAddSeasonModal(false);
                setNewSeasonData({ name: '', startDate: '', endDate: '' });
              } catch (error) {
                alert('Error adding season');
              }
            }} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">हंगाम नाव (Season Name, e.g. 2027-28)</label>
                <input type="text" value={newSeasonData.name} onChange={e => setNewSeasonData({...newSeasonData, name: e.target.value})} required className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">सुरुवात तारीख (Start Date)</label>
                <input type="date" value={newSeasonData.startDate} onChange={e => setNewSeasonData({...newSeasonData, startDate: e.target.value})} required className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-primary" />
              </div>
              {!newSeasonData.isActive && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">शेवट तारीख (End Date)</label>
                  <input type="date" value={newSeasonData.endDate} onChange={e => setNewSeasonData({...newSeasonData, endDate: e.target.value})} required={!newSeasonData.isActive} className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-primary" />
                </div>
              )}
              <div className="flex items-center">
                <input type="checkbox" id="isActiveSeason" checked={newSeasonData.isActive} onChange={e => setNewSeasonData({...newSeasonData, isActive: e.target.checked})} className="mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                <label htmlFor="isActiveSeason" className="text-sm font-medium text-gray-700 dark:text-gray-300">हा चालू हंगाम आहे का? (Set as Active Season)</label>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowAddSeasonModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

const Layout = ({ auth, setAuth, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex transition-colors">
      <Sidebar auth={auth} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 md:ml-64 flex flex-col w-full min-w-0 transition-all duration-300">
        <Topbar auth={auth} setAuth={setAuth} toggleSidebar={toggleSidebar} />
        <main className="p-4 sm:p-6 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
