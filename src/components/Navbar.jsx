import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const karyAILogoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/41c6e2cc-d964-4a03-87ae-a9b8c21bef72/587cae66eaa37a38ef294e33ac3506ae.png";

const Navbar = ({ navItems }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { t, language: currentLanguage, changeLanguage, availableLanguages } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const getCurrentLanguageShortName = () => {
    if (!currentLanguage || typeof currentLanguage !== 'string') return 'ES';
    const langData = availableLanguages.find(l => l.code === currentLanguage);
    return langData ? langData.name.split(" ")[0] : currentLanguage.toUpperCase();
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#inicio" className="flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={karyAILogoUrl}
                alt={t("navbar.karyAILogoAlt")}
                className="h-12 w-auto sm:h-14" 
              />
            </motion.div>
          </a>

          <nav className="hidden md:flex items-center space-x-6">
            <ul className="flex space-x-6">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium text-sm"
                  >
                    {t(item.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
            
            {availableLanguages.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-purple-600">
                    <Globe size={18} className="mr-2" />
                    {getCurrentLanguageShortName()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md border">
                  {availableLanguages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`cursor-pointer px-3 py-2 text-sm hover:bg-purple-50 ${currentLanguage === lang.code ? "text-purple-600 font-semibold" : "text-gray-700"}`}
                    >
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          <div className="md:hidden flex items-center">
            {availableLanguages.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-purple-600 hover:text-purple-700 mr-2">
                    <Globe size={22} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md border">
                  {availableLanguages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setIsMenuOpen(false);
                      }}
                      className={`cursor-pointer px-3 py-2 text-sm hover:bg-purple-50 ${currentLanguage === lang.code ? "text-purple-600 font-semibold" : "text-gray-700"}`}
                    >
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label={t('navbar.mainMenuAriaLabel')}
              className="text-purple-600 hover:text-purple-700"
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-gray-200 shadow-md"
        >
          <div className="px-4 pt-3 pb-4 space-y-2 sm:px-5">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t(item.labelKey)}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;