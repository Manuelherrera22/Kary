import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, User, Moon, Sun, Menu as MenuIcon, X as XIcon, Bell, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationsPanel from '@/components/NotificationsPanel';

const ThemeToggle = () => {
  const { t } = useLanguage();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    if (theme === 'dark' || (theme === 'system' && systemTheme === 'dark')) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-purple-300 hover:text-white hover:bg-purple-500/20">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t('dashboard.header.theme')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-white shadow-xl">
        <DropdownMenuItem onClick={() => setTheme('light')} className="hover:!bg-slate-700/80 focus:!bg-slate-700/90 cursor-pointer">
          {t('dashboard.header.lightMode')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className="hover:!bg-slate-700/80 focus:!bg-slate-700/90 cursor-pointer">
          {t('dashboard.header.darkMode')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} className="hover:!bg-slate-700/80 focus:!bg-slate-700/90 cursor-pointer">
          {t('dashboard.header.systemMode')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


const DashboardHeader = ({ user, userProfile, onLogout, pageTitle, onToggleSidebar, isSidebarOpen }) => {
  const { t } = useLanguage();

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  };

  const settingsLinkMap = {
    admin: '/dashboard/admin/account-settings',
    directive: '/dashboard/directive-settings',
    psychopedagogue: '/dashboard/psychopedagogue-settings',
    parent: '/dashboard/parent-settings',
    student: '/dashboard/student-settings',
    program_coordinator: '/dashboard/directive-settings', // Using directive settings for now
    teacher: '/dashboard/directive-settings', // Using directive settings for now
  };
  
  const userSettingsLink = userProfile?.role ? settingsLinkMap[userProfile.role] : '/dashboard';


  return (
    <header className="sticky top-0 z-20 bg-slate-800/50 backdrop-blur-md border-b border-slate-700/60 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="mr-2 text-purple-300 hover:text-white hover:bg-purple-500/20 lg:hidden"
              aria-label={isSidebarOpen ? "Cerrar menú lateral" : "Abrir menú lateral"}
            >
              {isSidebarOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </Button>
            <h1 className="text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400 truncate max-w-xs sm:max-w-md md:max-w-lg">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {userProfile?.role && (
              <div className="hidden sm:flex items-center px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium border border-purple-500/40">
                <Shield size={14} className="mr-1.5" />
                {t('common.roleActive')}: {t(`roles.${userProfile.role}`, userProfile.role)}
              </div>
            )}
            
            <NotificationsPanel />
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-purple-500/20 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-800">
                  <Avatar className="h-9 w-9 border-2 border-purple-400/70">
                    <AvatarImage src={userProfile?.avatar_url || `https://avatar.vercel.sh/${user?.email}.png?size=100`} alt={userProfile?.full_name || user?.email} />
                    <AvatarFallback className="bg-purple-500 text-white font-semibold">
                      {getInitials(userProfile?.full_name || user?.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-white shadow-xl" align="end" forceMount>
                <DropdownMenuLabel className="font-normal px-3 py-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userProfile?.full_name || t('common.user')}</p>
                    <p className="text-xs leading-none text-slate-400">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem asChild className="hover:!bg-slate-700/80 focus:!bg-slate-700/90 cursor-pointer">
                  <Link to={userSettingsLink} className="flex items-center p-2.5">
                    <Settings className="mr-2 h-4 w-4 text-sky-400" />
                    <span>{t('dashboard.header.settings')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem onClick={onLogout} className="text-red-400 hover:!bg-red-500/20 focus:!bg-red-500/30 cursor-pointer p-2.5">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('dashboard.header.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;