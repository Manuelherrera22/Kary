import React from "react";
import { motion } from "framer-motion";
import { User, Users, Building, CheckCircle } from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";

const BenefitCategory = ({ icon, titleKey, benefitKeys }) => {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col"
    >
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white mr-4">
          {icon}
        </div>
        <h3 className="text-2xl font-semibold text-gray-900">{t(titleKey)}</h3>
      </div>
      <ul className="space-y-3 text-gray-700 flex-grow">
        {benefitKeys.map((benefitKey, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle size={20} className="text-green-500 mr-3 mt-1 flex-shrink-0" />
            <span>{t(benefitKey)}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const BenefitsSection = () => {
  const { t } = useLanguage();
  const studentBenefitsKeys = [
    "benefitsSection.forStudentsItem1",
    "benefitsSection.forStudentsItem2",
    "benefitsSection.forStudentsItem3",
  ];
  const teacherBenefitsKeys = [
    "benefitsSection.forTeachersItem1",
    "benefitsSection.forTeachersItem2",
    "benefitsSection.forTeachersItem3",
  ];
  const institutionBenefitsKeys = [
    "benefitsSection.forInstitutionsItem1",
    "benefitsSection.forInstitutionsItem2",
    "benefitsSection.forInstitutionsItem3",
  ];

  return (
    <section id="beneficios" className="py-20 bg-sky-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            {t("benefitsSection.title").split(" ")[0]} {" "}
            <span className="text-purple-600">{t("benefitsSection.title").split(" ").slice(1).join(" ")}</span>
          </motion.h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            {t("benefitsSection.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <BenefitCategory icon={<User size={28} />} titleKey="benefitsSection.forStudentsTitle" benefitKeys={studentBenefitsKeys} />
          <BenefitCategory icon={<Users size={28} />} titleKey="benefitsSection.forTeachersTitle" benefitKeys={teacherBenefitsKeys} />
          <BenefitCategory icon={<Building size={28} />} titleKey="benefitsSection.forInstitutionsTitle" benefitKeys={institutionBenefitsKeys} />
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;