import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Brain, Zap, Leaf, Martini, Film, Globe as GlobeIcon, ExternalLink } from 'lucide-react';

const ilyrAILogoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/41c6e2cc-d964-4a03-87ae-a9b8c21bef72/ddbce9be23e4812e2006a55abdb9b506.jpg";

const IlyrAISection = () => {
  const { t } = useLanguage();

  const initiatives = [
    { nameKey: 'ilyrAISection.karyProjectName', descriptionKey: 'ilyrAISection.karyProjectDesc', icon: <Brain className="h-8 w-8 text-pink-500" />, url: '#inicio' },
    { nameKey: 'ilyrAISection.solaiProjectName', descriptionKey: 'ilyrAISection.solaiProjectDesc', icon: <Zap className="h-8 w-8 text-yellow-500" />, url: 'https://soledu.art' },
    { nameKey: 'ilyrAISection.nuwaverseProjectName', descriptionKey: 'ilyrAISection.nuwaverseProjectDesc', icon: <Leaf className="h-8 w-8 text-green-500" />, url: 'https://nuwaverse.org' },
    { nameKey: 'ilyrAISection.mrMixologyProjectName', descriptionKey: 'ilyrAISection.mrMixologyProjectDesc', icon: <Martini className="h-8 w-8 text-blue-500" />, url: 'http://www.ilyr.ai' },
    { nameKey: 'ilyrAISection.ilyraiCreativeProjectName', descriptionKey: 'ilyrAISection.ilyraiCreativeProjectDesc', icon: <Film className="h-8 w-8 text-purple-500" />, url: 'http://www.ilyr.ai' },
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: custom * 0.1, ease: "easeOut" }
    })
  };

  const InitiativeCard = ({ initiative, index }) => {
    const cardContent = (
      <motion.div
        className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center border border-gray-200 h-full"
        variants={itemVariants}
        custom={3 + index * 0.5}
      >
        <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-5">
          {initiative.icon}
        </div>
        <h4 className="text-xl font-semibold text-gray-800 mb-2">{t(initiative.nameKey)}</h4>
        <p className="text-sm text-gray-600 leading-relaxed flex-grow">{t(initiative.descriptionKey)}</p>
        {initiative.url && (
          <div className="mt-4 text-purple-600 group-hover:text-purple-700 flex items-center text-sm">
            {t(initiative.url === '#inicio' ? 'ilyrAISection.learnMore' : 'ilyrAISection.visitWebsite')} <ExternalLink size={16} className="ml-1.5 opacity-70 group-hover:opacity-100" />
          </div>
        )}
      </motion.div>
    );
  
    if (initiative.url && initiative.url.startsWith('#')) {
      return (
        <a href={initiative.url} className="block h-full group">
          {cardContent}
        </a>
      );
    }
    
    if (initiative.url) {
      return (
        <a href={initiative.url} target="_blank" rel="noopener noreferrer" className="block h-full group">
          {cardContent}
        </a>
      );
    }
    return cardContent;
  };


  return (
    <motion.section
      id="ilyr-ai-projects" 
      className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 via-slate-100 to-gray-100"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-12 sm:mb-16" variants={itemVariants} custom={0}>
          <img src={ilyrAILogoUrl} alt={t('ilyrAISection.logoAlt')} className="h-20 sm:h-24 w-auto mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            {t('ilyrAISection.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('ilyrAISection.subtitle')}
          </p>
        </motion.div>

        <motion.div className="mb-12 sm:mb-16 text-base sm:text-lg text-gray-700 space-y-4 max-w-4xl mx-auto leading-relaxed" variants={itemVariants} custom={1}>
          <p>{t('ilyrAISection.paragraph1')}</p>
          <p>{t('ilyrAISection.paragraph2')}</p>
        </motion.div>

        <motion.h3 
          className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center mb-8 sm:mb-10"
          variants={itemVariants} 
          custom={2}
        >
          {t('ilyrAISection.initiativesTitle')}
        </motion.h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {initiatives.map((initiative, index) => (
            <InitiativeCard initiative={initiative} index={index} key={initiative.nameKey}/>
          ))}
        </div>
        
        <motion.p 
          className="mt-12 sm:mt-16 text-center text-base sm:text-lg text-gray-700"
          variants={itemVariants}
          custom={3 + initiatives.length * 0.5 + 1}
        >
          {t('ilyrAISection.closingParagraph')}
        </motion.p>

        <motion.div 
          className="mt-8 text-center"
          variants={itemVariants}
          custom={3 + initiatives.length * 0.5 + 2}
        >
          <a
            href="http://www.ilyr.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <GlobeIcon className="mr-2 h-5 w-5" />
            {t('ilyrAISection.officialSiteButton')}
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default IlyrAISection;