import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, FileText, Brain, Users, AlertTriangle, Zap, UserCog as UsersCog, Activity, BarChart2 } from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";

const ModuleCard = ({ icon, titleKey, descriptionKey, isRecent = false }) => {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col ${
        isRecent ? "bg-sky-50 border-dashed border-sky-300" : "bg-white"
      }`}
    >
      <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-4 ${isRecent ? "bg-sky-200 text-sky-700" : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"}`}>
        {icon}
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${isRecent ? "text-sky-800" : "text-gray-900"}`}>{t(titleKey)}</h3>
      <p className={`text-sm flex-grow ${isRecent ? "text-sky-700" : "text-gray-600"}`}>{t(descriptionKey)}</p>
      {isRecent && <span className="mt-3 inline-block text-xs font-medium text-sky-700 bg-sky-100 px-2 py-1 rounded-full self-start">{t("howKaryWorksSection.proximamente")}</span>}
    </motion.div>
  );
};

const HowKaryWorksSection = () => {
  const { t } = useLanguage();

  const activeModules = [
    { icon: <MessageCircle size={24} />, titleKey: "howKaryWorksSection.moduleConversacion", descriptionKey: "howKaryWorksSection.moduleConversacionDesc" },
    { icon: <FileText size={24} />, titleKey: "howKaryWorksSection.moduleReportes", descriptionKey: "howKaryWorksSection.moduleReportesDesc" },
    { icon: <Brain size={24} />, titleKey: "howKaryWorksSection.moduleAprendizaje", descriptionKey: "howKaryWorksSection.moduleAprendizajeDesc" },
    { icon: <Users size={24} />, titleKey: "howKaryWorksSection.moduleColaboracion", descriptionKey: "howKaryWorksSection.moduleColaboracionDesc" },
    { icon: <BarChart2 size={24} />, titleKey: "howKaryWorksSection.moduleIACentral", descriptionKey: "howKaryWorksSection.moduleIACentralDesc" },
  ];

  const recentFeatures = [
    { icon: <AlertTriangle size={24} />, titleKey: "howKaryWorksSection.moduleAlertas", descriptionKey: "howKaryWorksSection.moduleAlertasDesc", isRecent: true },
    { icon: <Zap size={24} />, titleKey: "howKaryWorksSection.moduleSugerencias", descriptionKey: "howKaryWorksSection.moduleSugerenciasDesc", isRecent: true },
    { icon: <UsersCog size={24} />, titleKey: "howKaryWorksSection.modulePaneles", descriptionKey: "howKaryWorksSection.modulePanelesDesc", isRecent: true },
    { icon: <Activity size={24} />, titleKey: "howKaryWorksSection.moduleSeguimiento", descriptionKey: "howKaryWorksSection.moduleSeguimientoDesc", isRecent: true },
    { icon: <BarChart2 size={24} />, titleKey: "howKaryWorksSection.moduleDecision", descriptionKey: "howKaryWorksSection.moduleDecisionDesc", isRecent: true },
  ];

  return (
    <section id="como-funciona" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            {t("howKaryWorksSection.title").split(" ").slice(0,2).join(" ")}{" "} 
            <span className="text-purple-600">{t("howKaryWorksSection.title").split(" ").slice(2).join(" ")}</span>
          </motion.h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            {t("howKaryWorksSection.subtitle")}
          </p>
        </div>

        <div className="mb-16">
            <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center md:text-left">{t("howKaryWorksSection.activeModulesTitle")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeModules.map((module, index) => (
                <ModuleCard key={index} {...module} />
              ))}
            </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center md:text-left">{t("howKaryWorksSection.futureModulesTitle")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentFeatures.map((module, index) => (
              <ModuleCard key={index} {...module} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowKaryWorksSection;