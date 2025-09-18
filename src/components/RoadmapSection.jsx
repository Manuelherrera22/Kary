import React from "react";
import { motion } from "framer-motion";
import { CheckSquare, Milestone, Flag, Lightbulb, Users, Target as TargetIcon, Eye, Zap, Gamepad2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const RoadmapYear = ({ year, objectiveKey, milestoneKeys, icon, delay }) => {
  const { t } = useLanguage();
  const IconComponent = icon;
  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="mb-8 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
  >
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center mr-3">
        <IconComponent size={20} />
      </div>
      <span className="text-2xl font-semibold text-purple-600">{year}</span>
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex-grow">{t(objectiveKey)}</h3>
    <ul className="list-none pl-0 space-y-1.5">
      {milestoneKeys.map((milestoneKey, index) => (
        <li key={index} className="flex items-start text-sm text-gray-600">
          <CheckSquare size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
          {t(milestoneKey)}
        </li>
      ))}
    </ul>
  </motion.div>
  );
};

const RoadmapSection = () => {
  const { t } = useLanguage();
  const roadmapData = [
    { year: "2025", objectiveKey: "roadmapSection.q1_2025_objective", milestoneKeys: ["roadmapSection.q1_2025_m1", "roadmapSection.q1_2025_m2", "roadmapSection.q1_2025_m3"], icon: Lightbulb, delay: 0.1 },
    { year: "2026", objectiveKey: "roadmapSection.q2_2025_objective", milestoneKeys: ["roadmapSection.q2_2025_m1", "roadmapSection.q2_2025_m2", "roadmapSection.q2_2025_m3"], icon: Eye, delay: 0.2 },
    { year: "2027", objectiveKey: "roadmapSection.q3_2025_objective", milestoneKeys: ["roadmapSection.q3_2025_m1", "roadmapSection.q3_2025_m2"], icon: Flag, delay: 0.3 },
  ];

  return (
    <section id="roadmap" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            {t("roadmapSection.title").split(" ").slice(0,2).join(" ")} {" "}
            <span className="text-purple-600">{t("roadmapSection.title").split(" ").slice(2).join(" ")}</span>
          </motion.h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            {t("roadmapSection.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roadmapData.map((item) => (
            <RoadmapYear key={item.year} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;