import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import DemoDialog from "@/components/DemoDialog"; 
import HeroContent from "@/components/HeroContent";

const HeroSection = () => {
  const [openDemoDialog, setOpenDemoDialog] = useState(false);
  const [dialogFlow, setDialogFlow] = useState("login");
  const { t, loadingTranslations } = useLanguage();

  const titleKey = "heroSection.title";
  const subtitleKey = "heroSection.subtitle";
  const heroTitle = t(titleKey, "Kary: Inteligencia que cuida, acompaña y transforma");
  const heroSubtitle = t(subtitleKey, "Una IA educativa empática, ética y humana, diseñada para niñas, niños y adolescentes en entornos hospitalarios, domiciliarios o escolares. Kary no reemplaza: acompaña con amor, escucha y adaptabilidad.");

  const handleOpenDialog = (flow) => {
    setDialogFlow(flow);
    setOpenDemoDialog(true);
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center py-20 md:py-32 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="absolute inset-0 animate-pulse-slow">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-400 rounded-full opacity-30 blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-400 rounded-full opacity-30 blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-orange-300 rounded-full opacity-20 blur-xl animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <HeroContent 
          titleText={heroTitle}
          subtitleText={heroSubtitle}
          isLoadingTranslations={loadingTranslations}
          titleKey={titleKey}
          subtitleKey={subtitleKey}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "backOut" }}
          className="space-y-4 sm:space-y-0 sm:space-x-6 flex flex-col sm:flex-row items-center justify-center"
        >
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant="default"
              size="lg"
              className="bg-white/90 text-purple-700 backdrop-blur-sm hover:bg-white w-full sm:w-auto group px-8 py-3 rounded-[12px] shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => handleOpenDialog("signup")}
            >
              <UserPlus size={22} className="mr-2.5 transition-transform duration-300 group-hover:rotate-[-5deg] group-hover:scale-110" />
              {t("heroSection.buttonSignup", "Crear cuenta gratis")}
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant="custom"
              size="lg"
              className="bg-gradient-to-r from-[#a16ae8] to-[#714cdd] text-white hover:shadow-xl shadow-lg transform hover:scale-105 transition-all duration-300 w-full sm:w-auto group px-8 py-3 rounded-[12px]"
              onClick={() => handleOpenDialog("login")}
            >
              <LogIn size={22} className="mr-2.5 transition-transform duration-300 group-hover:rotate-[-10deg]" />
              {t("heroSection.buttonLogin", "Iniciar Sesión")}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <DemoDialog 
        open={openDemoDialog} 
        onOpenChange={setOpenDemoDialog} 
        initialFlow={dialogFlow} 
      />
    </section>
  );
};

export default HeroSection;