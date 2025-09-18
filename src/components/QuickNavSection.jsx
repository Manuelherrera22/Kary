import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Users, TrendingUp, ArrowRight, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const QuickNavLink = ({ href, icon, titleKey, descriptionKey }) => {
  const IconComponent = icon;
  const { t } = useLanguage();
  return (
    <motion.a
      href={href}
      className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-3">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg mr-4 group-hover:scale-110 transition-transform">
          <IconComponent size={24} />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">{t(titleKey)}</h3>
      </div>
      <p className="text-gray-600 text-sm mb-4">{t(descriptionKey)}</p>
      <div className="flex items-center text-purple-600 font-medium group-hover:underline">
        {t("quickNavSection.explore")} <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
      </div>
    </motion.a>
  );
};

const QuickNavSection = () => {
  const { t } = useLanguage();
  const links = [
    {
      href: "#beneficios",
      icon: ShieldCheck,
      titleKey: "quickNavSection.linkBenefitsTitle",
      descriptionKey: "quickNavSection.linkBenefitsDescription",
    },
    {
      href: "#casos-de-uso",
      icon: Users,
      titleKey: "quickNavSection.linkUseCasesTitle",
      descriptionKey: "quickNavSection.linkUseCasesDescription",
    },
    {
      href: "#roadmap",
      icon: TrendingUp,
      titleKey: "quickNavSection.linkRoadmapTitle",
      descriptionKey: "quickNavSection.linkRoadmapDescription",
    },
    {
      href: "#contacto",
      icon: MessageSquare,
      titleKey: "quickNavSection.linkContactTitle",
      descriptionKey: "quickNavSection.linkContactDescription",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-gray-900 mb-4"
        >
          {t("quickNavSection.title")}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-gray-700 text-center mb-12 max-w-xl mx-auto"
        >
          {t("quickNavSection.subtitle")}
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {links.map((link, index) => (
            <QuickNavLink key={index} {...link} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickNavSection;