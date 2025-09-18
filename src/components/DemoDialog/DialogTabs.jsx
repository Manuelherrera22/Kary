import React from "react";
import { LogIn, UserPlus, CalendarDays } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const DialogTabs = ({ activeTab, setActiveTab, setLoginError, availableTabs = ["acceder", "registrarse", "agendar"] }) => {
  const { t } = useLanguage();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if(setLoginError) setLoginError(null); 
  };

  const tabConfig = {
    acceder: {
      labelKey: "demoDialog.tabAcceder",
      icon: <LogIn size={18} className="inline mr-2" />
    },
    registrarse: {
      labelKey: "demoDialog.tabRegistrarse",
      icon: <UserPlus size={18} className="inline mr-2" />
    },
    agendar: {
      labelKey: "demoDialog.tabAgendarDemo",
      icon: <CalendarDays size={18} className="inline mr-2" />
    }
  };

  return (
    <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {availableTabs.map(tabKey => {
          const config = tabConfig[tabKey];
          if (!config) return null;
          return (
            <button
              key={tabKey}
              onClick={() => handleTabChange(tabKey)}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-semibold text-base transition-colors duration-200 ease-in-out
                ${activeTab === tabKey
                  ? "border-purple-600 text-purple-700 dark:border-purple-400 dark:text-purple-300"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500"}`}
            >
              {config.icon} {t(config.labelKey, config.labelKey.split('.')[1])}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default DialogTabs;