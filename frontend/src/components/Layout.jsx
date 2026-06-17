import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Users, FileText, Banknote, CalendarMinus, Settings, BookOpen, Globe } from 'lucide-react';
import clsx from 'clsx';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = ({ auth }) => {
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
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed top-0 left-0 flex flex-col shadow-sm z-10 transition-colors">
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700 bg-primary/10 dark:bg-primary/20">
        <h1 className="text-xl font-bold text-primary-dark dark:text-primary">हिशोब प्रणाली</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {links.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <li key={link.path}>
                <Link
                  to={link.path}
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
  );
};

import { useSeason } from '../context/SeasonContext';

const Topbar = ({ auth, setAuth }) => {
  const { lang, toggleLanguage } = useLanguage();
  const { seasons, activeSeason, changeSeason } = useSeason();
  const [isDark, setIsDark] = React.useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  React.useEffect(() => {
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
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm transition-colors">
      <div className="text-xl font-semibold text-gray-800 dark:text-white flex items-center space-x-4">
        <span>Us Todni Toli</span>
        {auth?.role === 'Mukadam' && seasons.length > 0 && (
          <select 
            value={activeSeason?._id || ''}
            onChange={(e) => changeSeason(e.target.value)}
            className="text-sm bg-gray-100 dark:bg-gray-700 dark:text-white border-none rounded-lg px-3 py-1 font-medium focus:ring-0"
          >
            {seasons.map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
          {isDark ? '☀️' : '🌙'}
        </button>
        <button 
          onClick={toggleLanguage}
          className="flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium transition-colors dark:text-white"
        >
          <Globe className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-300" />
          {lang === 'mr' ? 'English' : 'मराठी'}
        </button>
        <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:text-red-800">
          लॉगआउट (Logout)
        </button>
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
          {auth?.name?.charAt(0) || 'U'}
        </div>
      </div>
    </header>
  );
};

const Layout = ({ auth, setAuth, children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex transition-colors">
      <Sidebar auth={auth} />
      <div className="flex-1 ml-64 flex flex-col">
        <Topbar auth={auth} setAuth={setAuth} />
        <main className="p-6 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
