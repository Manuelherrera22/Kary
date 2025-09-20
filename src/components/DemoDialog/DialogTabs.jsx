import React from "react";
import { LogIn, UserPlus, CalendarDays } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Estilos para ocultar el scrollbar
const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

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
    <>
      <style>{scrollbarHideStyles}</style>
      <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-2 sm:space-x-4 md:space-x-6 overflow-x-auto scrollbar-hide" aria-label="Tabs">
        {availableTabs.map(tabKey => {
          const config = tabConfig[tabKey];
          if (!config) return null;
          return (
            <button
              key={tabKey}
              onClick={() => handleTabChange(tabKey)}
              className={`whitespace-nowrap pb-2 sm:pb-3 md:pb-4 px-1 sm:px-2 border-b-2 font-semibold text-xs sm:text-sm md:text-base transition-colors duration-200 ease-in-out flex-shrink-0
                ${activeTab === tabKey
                  ? "border-purple-600 text-purple-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              <span className="hidden sm:inline">{config.icon}</span>
              <span className="sm:hidden">{config.icon}</span>
              <span className="ml-1 sm:ml-2">{t(config.labelKey, config.labelKey.split('.')[1])}</span>
            </button>
          );
        })}
        </nav>
      </div>
    </>
  );
};

export default DialogTabs;