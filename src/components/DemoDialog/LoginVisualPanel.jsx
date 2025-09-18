import React from "react";
import { motion } from "framer-motion";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { ShieldCheck } from "lucide-react";

const LoginVisualPanel = () => {
  const { t } = useLanguage();
  const karyAILogoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/41c6e2cc-d964-4a03-87ae-a9b8c21bef72/587cae66eaa37a38ef294e33ac3506ae.png";

  return (
    <div className="w-full md:w-2/5 bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500 p-8 text-white flex flex-col justify-between rounded-t-xl md:rounded-l-xl md:rounded-r-none">
      <div className="flex-grow flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 100 }}
        >
          <img
            src={karyAILogoUrl}
            alt={t("demoDialog.karyLogoAlt")}
            className="h-20 sm:h-24 md:h-28 w-auto mb-6 mx-auto filter drop-shadow-lg"
          />
          <DialogTitle className="text-3xl md:text-4xl font-bold mb-3 text-shadow-sm">
            {t("demoDialog.title")}
          </DialogTitle>
          <DialogDescription className="text-purple-100 text-lg md:text-xl mt-2 max-w-xs mx-auto text-shadow-xs">
            {t("demoDialog.description")}
          </DialogDescription>
        </motion.div>
      </div>
      <div className="mt-auto pt-6 text-center">
        <p className="text-xs text-purple-200 flex items-center justify-center">
          <ShieldCheck size={14} className="mr-1.5 text-green-300" /> {t("demoDialog.securityNote")}
        </p>
        <p className="text-xs text-purple-200 mt-2">{t("demoDialog.copyright", { year: "2025" })}</p>
      </div>
    </div>
  );
};

export default LoginVisualPanel;