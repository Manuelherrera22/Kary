import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const ilyrAILogoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/41c6e2cc-d964-4a03-87ae-a9b8c21bef72/ddbce9be23e4812e2006a55abdb9b506.jpg";

const AboutIlyrAISection = () => {
  const { t } = useLanguage();

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: custom * 0.15, ease: "easeOut" }
    })
  };

  return (
    <motion.section
      id="about-ilyr-ai"
      className="py-16 sm:py-24 bg-white"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-10 sm:mb-14" variants={itemVariants} custom={0}>
          <img src={ilyrAILogoUrl} alt={t('aboutIlyrAISection.logoAlt')} className="h-16 sm:h-20 w-auto mx-auto mb-5" />
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            {t('aboutIlyrAISection.title')}
          </h2>
        </motion.div>

        <motion.div 
          className="max-w-3xl mx-auto text-center text-gray-700 space-y-5 leading-relaxed text-base sm:text-lg"
          variants={itemVariants}
          custom={1}
        >
          <p>{t('aboutIlyrAISection.paragraph1')}</p>
          <p>{t('aboutIlyrAISection.paragraph2')}</p>
        </motion.div>

        <motion.div 
          className="mt-10 text-center"
          variants={itemVariants}
          custom={2}
        >
          <a
            href="http://www.ilyr.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-7 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <Globe className="mr-2.5 h-5 w-5" />
            {t('aboutIlyrAISection.buttonText')}
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutIlyrAISection;