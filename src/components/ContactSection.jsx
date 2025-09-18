import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, Globe, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactSection = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleContactSubmit = (e) => {
    e.preventDefault();
    toast({
      title: t("toast.contactFormSuccessTitle"),
      description: t("toast.contactFormSuccessDescription"),
      duration: 5000,
      className: "bg-green-500 text-white",
    });
    e.target.reset();
  };

  return (
    <section id="contacto" className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              {t("contactSection.title").split(" ")[0]} {" "}
              <span className="text-purple-600">{t("contactSection.title").split(" ").slice(1).join(" ")}</span>
            </motion.h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              {t("contactSection.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-shadow"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">{t("contactSection.formTitle")}</h3>
              <form onSubmit={handleContactSubmit}>
                <div className="mb-5">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t("contactSection.formNameLabel")}</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder={t("contactSection.formNamePlaceholder")}
                    required
                  />
                </div>
                <div className="mb-5">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t("contactSection.formEmailLabel")}</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder={t("contactSection.formEmailPlaceholder")}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">{t("contactSection.formInstitutionLabel")}</label>
                  <textarea
                    id="message"
                    rows="4"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder={t("contactSection.formInstitutionPlaceholder")}
                  ></textarea>
                </div>
                <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 font-semibold">
                  {t("contactSection.formSubmitButton")} <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-xl shadow-xl p-8 text-white h-full flex flex-col"
            >
              <h3 className="text-2xl font-semibold mb-6">{t("contactSection.contactInfoTitle")}</h3>
              <div className="space-y-5 text-lg">
                <div className="flex items-center">
                  <Mail className="h-6 w-6 mr-3 flex-shrink-0" />
                  <a href={`mailto:${t('contactSection.contactEmail')}`} className="hover:underline">{t("contactSection.contactEmail")}</a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-6 w-6 mr-3 flex-shrink-0" />
                  <a href={`tel:${t('contactSection.contactPhone').replace(/\s/g, '')}`} className="hover:underline">{t("contactSection.contactPhone")}</a>
                </div>
                <div className="flex items-center">
                  <Globe className="h-6 w-6 mr-3 flex-shrink-0" />
                  <a href={`https://${t('contactSection.contactWebsite')}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{t("contactSection.contactWebsite")}</a>
                </div>
              </div>
              <div className="mt-auto pt-8">
                <p className="text-sm text-center text-purple-100">
                  {t("contactSection.closingMessage")}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;