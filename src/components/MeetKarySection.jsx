import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const MeetKarySection = () => {
  const { t } = useLanguage();

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.section
      id="conoce-a-kary"
      className="py-16 md:py-24 bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-12 md:mb-16"
          variants={itemVariants}
        >
          <Heart className="mx-auto mb-6 text-pink-500 w-16 h-16 animate-pulse" />
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('meetKarySection.title')}
          </h2>
          <blockquote className="text-xl md:text-2xl font-medium text-gray-700 italic leading-relaxed border-l-4 border-pink-400 pl-6 py-2">
            {t('meetKarySection.quote')}
          </blockquote>
          <p className="text-md text-gray-600 mt-2">
            {t('meetKarySection.quoteAuthor')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div variants={itemVariants}>
            <img 
              alt={t('meetKarySection.imageAlt')}
              className="rounded-xl shadow-2xl object-cover w-full h-auto md:h-[450px]"
             src="https://images.unsplash.com/photo-1599666505327-7758b44a9985" />
          </motion.div>
          
          <motion.div className="space-y-6" variants={itemVariants}>
            <h3 className="text-2xl sm:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              {t('meetKarySection.greetingTitle')}
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('meetKarySection.greetingP1')}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('meetKarySection.greetingP2')}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-4">
              <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
                <MessageSquare size={24} className="text-purple-500 mr-3" />
                <span className="text-gray-700">{t('meetKarySection.featureListen')}</span>
              </div>
              <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
                <BookOpen size={24} className="text-pink-500 mr-3" />
                <span className="text-gray-700">{t('meetKarySection.featureExplain')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default MeetKarySection;