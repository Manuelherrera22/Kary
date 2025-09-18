import React from "react";
import { motion } from "framer-motion";
import { HeartHandshake, BookOpen, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const WhyKarySection = () => {
  const { t } = useLanguage();
  return (
    <section id="porque-kary" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              {t("whyKarySection.title").split(" ")[0]}{" "}
              <span className="text-purple-600">{t("whyKarySection.title").split(" ").slice(1).join(" ")}</span>
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {t("whyKarySection.p1")}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t("whyKarySection.p2")}
            </p>
            <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
              <div className="flex items-center text-purple-600">
                <HeartHandshake size={28} className="mr-3" />
                <span className="font-semibold text-md">{t("whyKarySection.feature1")}</span>
              </div>
              <div className="flex items-center text-pink-500">
                <Users size={28} className="mr-3" />
                <span className="font-semibold text-md">{t("whyKarySection.feature2")}</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-2xl">
              <img  alt={t("whyKarySection.imageAlt")} className="object-cover w-full h-full" src="https://images.unsplash.com/photo-1690191886622-fd8d6cda73bd" />
            </div>
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-50 blur-lg -z-10"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-tl from-sky-200 to-purple-200 rounded-full opacity-50 blur-lg -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyKarySection;