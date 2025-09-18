import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, FilePlus, CalendarPlus, LifeBuoy, Languages, MessageSquare as MessageSquareHeart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const QuickAccessPage = () => {
  const { t, changeLanguage, language, availableLanguages } = useLanguage();

  const quickActions = [
    { id: 1, labelKey: "dashboards.directive.quickAccess.newReport", icon: FilePlus, action: () => console.log("New Report") },
    { id: 2, labelKey: "dashboards.directive.quickAccess.scheduleMeeting", icon: CalendarPlus, action: () => console.log("Schedule Meeting") },
    { id: 3, labelKey: "dashboards.directive.quickAccess.supportCenter", icon: LifeBuoy, action: () => console.log("Support Center") },
    { id: 4, labelKey: "dashboards.directive.quickAccess.sendFeedback", icon: MessageSquareHeart, action: () => console.log("Send Feedback") },
  ];

  const languageNames = {
    es: "Español",
    en: "English",
    pt: "Português",
    fr: "Français",
    ru: "Русский",
    kz: "Қазақ",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-gradient-to-br from-purple-700 via-pink-700 to-orange-600 min-h-screen text-white"
    >
      <div className="container mx-auto">
        <Link to="/dashboard" className="inline-flex items-center text-purple-300 hover:text-purple-100 mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          {t('common.backToDashboard')}
        </Link>

        <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl">
          <div className="flex items-center mb-8">
            <Briefcase size={36} className="mr-4 text-orange-300" />
            <div>
              <h1 className="text-3xl font-bold">{t('dashboards.common.quickAccessTitle')}</h1>
              <p className="text-purple-200">{t('dashboards.directive.quickAccessPageSubtitle')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map(action => (
              <Button
                key={action.id}
                onClick={action.action}
                variant="outline"
                className="h-auto text-left flex flex-col items-start p-6 bg-white/5 hover:bg-white/10 border-purple-500/50 text-white space-y-2 transition-all duration-300 transform hover:scale-105"
              >
                <action.icon size={28} className="mb-2 text-orange-300" />
                <span className="text-lg font-semibold">{t(action.labelKey)}</span>
                <span className="text-xs text-purple-300">{t(action.labelKey + "Desc")}</span>
              </Button>
            ))}
            <div className="bg-white/5 p-6 rounded-lg border border-purple-500/50 flex flex-col justify-between space-y-2 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center">
                <Languages size={28} className="mr-3 text-orange-300" />
                <span className="text-lg font-semibold">{t('dashboards.directive.quickAccess.changeLanguage')}</span>
              </div>
              <p className="text-xs text-purple-300">{t('dashboards.directive.quickAccess.changeLanguageDesc')}</p>
              <div className="flex flex-wrap gap-2 mt-auto pt-2">
                {availableLanguages.map(lang => (
                  <Button
                    key={lang}
                    size="sm"
                    variant={language === lang ? "default" : "outline"}
                    onClick={() => changeLanguage(lang)}
                    className={`${language === lang ? 'bg-orange-500 hover:bg-orange-600' : 'text-purple-200 border-purple-400 hover:bg-purple-500/30'}`}
                  >
                    {languageNames[lang] || lang.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickAccessPage;