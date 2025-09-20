import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  Home, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Bell,
  User,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const DashboardLayout = ({ children, user, onLogout }) => {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'overview', label: t('common.overview', 'Resumen'), icon: Home },
    { id: 'students', label: t('common.students', 'Estudiantes'), icon: Users },
    { id: 'activities', label: t('common.activities', 'Actividades'), icon: BookOpen },
    { id: 'analytics', label: t('common.analytics', 'Analíticas'), icon: BarChart3 },
    { id: 'notifications', label: t('common.notifications', 'Notificaciones'), icon: Bell },
    { id: 'settings', label: t('common.settings', 'Configuración'), icon: Settings }
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Mobile Header */}
      <header className="lg:hidden bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-slate-800 border-slate-700">
                <div className="flex flex-col h-full">
                  {/* User Info */}
                  <div className="p-4 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{user?.name || 'Usuario'}</h3>
                        <p className="text-sm text-slate-400 capitalize">{user?.role || 'usuario'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                      {navigationItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.id}>
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <Icon size={18} className="mr-3" />
                              {item.label}
                            </Button>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>

                  {/* Logout */}
                  <div className="p-4 border-t border-slate-700">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={handleLogout}
                    >
                      <LogOut size={18} className="mr-3" />
                      {t('common.logout', 'Cerrar Sesión')}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold text-white">
              {t('common.dashboard', 'Panel de Control')}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <Bell size={18} />
            </Button>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full h-full">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
