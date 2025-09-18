import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ImpactSection = () => {
  const { t } = useLanguage();
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-pink-500 via-red-400 to-orange-400 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          <Heart className="mx-auto mb-6 text-white fill-current w-16 h-16 opacity-80" />
          <blockquote className="text-2xl md:text-3xl font-semibold mb-6 italic leading-relaxed">
            {t("impactSection.quote")}
          </blockquote>
          <p className="text-lg md:text-xl font-medium">
            {t("impactSection.author")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactSection;