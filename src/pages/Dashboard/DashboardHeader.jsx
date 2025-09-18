import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Settings, UserCircle, LogOut, Menu, X, Sun, Moon, Search, ChevronDown, Brain } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NotificationsPanel from '@/components/NotificationsPanel';

const DashboardHeader = ({ pageTitle, onToggleSidebar, isSidebarOpen }) => {
  const { t, language, changeLanguage, availableLanguages } = useLanguage();
  const { user, userProfile, handleLogout } = useMockAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const languageMenuRef = useRef(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLanguageSelect = (langCode) => {
    changeLanguage(langCode);
    setIsLanguageMenuOpen(false);
  };

  const getAccountSettingsPath = () => {
    if (!userProfile || !userProfile.role) return '/dashboard/directive-settings'; // Default or fallback

    switch (userProfile.role) {
      case 'student':
        return '/dashboard/student-settings';
      case 'parent':
        return '/dashboard/parent-settings';
      case 'psychopedagogue':
        return '/dashboard/psychopedagogue-settings';
      case 'admin':
        return '/dashboard/admin/account-settings';
      case 'directive':
      case 'teacher':
      case 'program_coordinator':
      default:
        return '/dashboard/directive-settings'; // Generic settings page
    }
  };
  
  const settingsPath = getAccountSettingsPath();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <header className="bg-slate-800/70 backdrop-blur-md shadow-lg sticky top-0 z-20 border-b border-slate-700/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="lg:hidden mr-3 text-slate-300 hover:text-white hover:bg-slate-700"
              aria-label={isSidebarOpen ? t('dashboard.header.closeSidebar') : t('dashboard.header.openSidebar')}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
            <Link to="/dashboard" className="flex items-center space-x-2 lg:hidden">
              <Brain size={28} className="text-purple-400"/>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Kary</span>
            </Link>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-100 hidden lg:block">{pageTitle}</h1>
          </div>

          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Search Bar - Hidden for now, can be enabled later */}
            {/* <div className="relative hidden md:block">
              <Input
                type="search"
                placeholder={t('dashboard.header.searchPlaceholder')}
                className="bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400 rounded-lg pl-10 w-64 focus:ring-sky-500 focus:border-sky-500"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            </div> */}
            
            <div ref={languageMenuRef} className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="text-slate-300 hover:text-white hover:bg-slate-700"
                aria-label={t('dashboard.header.changeLanguage')}
              >
                <ChevronDown size={20} />
                 <span className="ml-1 text-sm font-medium">{language.toUpperCase()}</span>
              </Button>
              <AnimatePresence>
                {isLanguageMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-40 bg-slate-700 border border-slate-600 rounded-lg shadow-xl py-1 z-30"
                  >
                    {availableLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageSelect(lang.code)}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          language === lang.code ? 'bg-sky-600 text-white' : 'text-slate-200 hover:bg-slate-600'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-slate-300 hover:text-white hover:bg-slate-700"
              aria-label={theme === 'dark' ? t('dashboard.header.switchToLightMode') : t('dashboard.header.switchToDarkMode')}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>

            <div ref={notificationsRef} className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="text-slate-300 hover:text-white hover:bg-slate-700 relative"
                aria-label={t('dashboard.header.notifications')}
              >
                <Bell size={20} />
                {/* Placeholder for notification count badge */}
                {/* <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-800" /> */}
              </Button>
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-700/90 backdrop-blur-md border border-slate-600 rounded-lg shadow-xl z-30 overflow-hidden"
                  >
                    <NotificationsPanel onClose={() => setIsNotificationsOpen(false)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div ref={userMenuRef} className="relative">
              <Button
                variant="ghost"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-slate-300 hover:text-white hover:bg-slate-700 p-1.5 rounded-lg"
                aria-label={t('dashboard.header.userMenu')}
              >
                <UserCircle size={28} />
                <span className="hidden md:inline text-sm font-medium">{userProfile?.full_name || user?.email}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </Button>
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-slate-700 border border-slate-600 rounded-lg shadow-xl py-1 z-30"
                  >
                    <div className="px-4 py-3 border-b border-slate-600">
                      <p className="text-sm font-semibold text-white">{userProfile?.full_name || t('common.user')}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      {userProfile?.role && <p className="text-xs text-sky-400 mt-1">{t(`roles.${userProfile.role}`)}</p>}
                    </div>
                    <Link
                      to={settingsPath}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-600 transition-colors"
                    >
                      <Settings size={16} className="mr-2.5" />
                      {t('dashboard.header.settings')}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                    >
                      <LogOut size={16} className="mr-2.5" />
                      {t('dashboard.header.logout')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;