import React from 'react';
import { LogOut } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const LogoutSection = ({ onLogout }) => {
  const { t } = useLanguage();

  return (
    <div className="mt-10 pt-6 border-t border-slate-700/50">
      <Button variant="outline" onClick={onLogout} className="w-full text-red-400 border-red-500/50 hover:bg-red-500/20 hover:text-red-300">
        <LogOut size={18} className="mr-2" /> {t('common.logout')}
      </Button>
    </div>
  );
};

export default LogoutSection;