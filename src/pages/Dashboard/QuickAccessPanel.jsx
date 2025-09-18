import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { History, Settings, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const QuickAccessButton = ({ icon: Icon, labelKey, onClick, className = "" }) => {
  const { t } = useLanguage();
  return (
    <Button
      variant="outline"
      className={`w-full justify-start text-left py-3 px-4 border-purple-500/30 bg-white/5 hover:bg-white/10 text-purple-200 hover:text-white transition-all duration-200 group ${className}`}
      onClick={onClick}
    >
      <Icon size={20} className="mr-3 text-orange-300 transition-transform duration-300 group-hover:scale-110" />
      <span className="font-medium">{t(labelKey)}</span>
    </Button>
  );
};

const QuickAccessPanel = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  return (
    <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/20">
      <h3 className="text-xl font-semibold text-purple-200 mb-4">{t('dashboard.quickAccessTitle')}</h3>
      <div className="space-y-3">
        <QuickAccessButton icon={History} labelKey="dashboard.viewHistoryButton" onClick={() => toast({ title: t("dashboard.featureComingSoonTitle"), description: t("dashboard.historyFeatureDesc")})} />
        <QuickAccessButton icon={Settings} labelKey="dashboard.changePasswordButton" onClick={() => toast({ title: t("dashboard.featureComingSoonTitle"), description: t("dashboard.passwordFeatureDesc")})} />
        <QuickAccessButton icon={HelpCircle} labelKey="dashboard.helpPanelButton" onClick={() => toast({ title: t("dashboard.featureComingSoonTitle"), description: t("dashboard.helpFeatureDesc")})} />
      </div>
    </div>
  );
};

export default QuickAccessPanel;