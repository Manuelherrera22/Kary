import React from "react";
import { motion } from "framer-motion";
import { Hotel as Hospital, Home, Globe, Users2, HeartPulse } from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";

const UseCaseCard = ({ icon, titleKey, descriptionKey, delay }) => {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
    >
      <div className="flex justify-center mb-6">
        <div className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{t(titleKey)}</h3>
      <p className="text-gray-700 text-sm">{t(descriptionKey)}</p>
    </motion.div>
  );
};

const UseCasesSection = () => {
  const { t } = useLanguage();
  const useCases = [
    { icon: <Hospital size={32} />, titleKey: "useCasesSection.caseHospital", descriptionKey: "useCasesSection.caseHospitalDesc", delay: 0 },
    { icon: <Home size={32} />, titleKey: "useCasesSection.caseHome", descriptionKey: "useCasesSection.caseHomeDesc", delay: 0.1 },
    { icon: <Globe size={32} />, titleKey: "useCasesSection.caseRural", descriptionKey: "useCasesSection.caseRuralDesc", delay: 0.2 },
    { icon: <Users2 size={32} />, titleKey: "useCasesSection.caseUrban", descriptionKey: "useCasesSection.caseUrbanDesc", delay: 0.3 },
    { icon: <HeartPulse size={32} />, titleKey: "useCasesSection.caseClinics", descriptionKey: "useCasesSection.caseClinicsDesc", delay: 0.4 },
  ];

  return (
    <section id="casos-de-uso" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            {t("useCasesSection.title").split(" ").slice(0,3).join(" ")}{" "} 
            <span className="text-purple-600">{t("useCasesSection.title").split(" ").slice(3).join(" ")}</span>
          </motion.h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            {t("useCasesSection.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {useCases.map((useCase) => (
            <UseCaseCard key={useCase.titleKey} {...useCase} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;