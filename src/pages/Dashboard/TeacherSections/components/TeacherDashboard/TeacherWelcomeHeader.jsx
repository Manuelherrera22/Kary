import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Users, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';

const TeacherWelcomeHeader = ({ teacherName, assignedStudentsCount }) => {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-black border border-slate-700 shadow-2xl w-full"
    >
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 sm:gap-8 md:gap-10">
        <div className="flex-1 min-w-0 w-full">
          <motion.h1 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-100 leading-tight">
            👨‍🏫 {t('teacherDashboard.welcome', { name: teacherName })}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-slate-400 mt-3 text-base sm:text-lg md:text-xl leading-relaxed">
            {t('teacherDashboard.subtitle')}
          </motion.p>
        </div>
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 md:gap-8 w-full xl:w-auto mt-6 xl:mt-0">
          <div className="flex items-center justify-center text-slate-300 bg-slate-700/50 px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-xl">
            <Users size={20} className="sm:hidden mr-3 text-purple-400" />
            <Users size={24} className="hidden sm:block mr-4 text-purple-400" />
            <span className="font-medium text-base sm:text-lg md:text-xl">{assignedStudentsCount}</span>
            <span className="ml-3 text-slate-400 text-base sm:text-lg">{t('teacherDashboard.assignedStudents')}</span>
          </div>
          <Button 
            variant="outline" 
            className="border-purple-500/70 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200 text-base sm:text-lg md:text-xl py-3 sm:py-4 md:py-5 px-4 sm:px-6 md:px-8"
            onClick={() => toast({ title: "🚧 Característica no implementada", description: "¡La guía rápida estará disponible pronto!" })}
          >
            <HelpCircle size={20} className="sm:hidden mr-3" />
            <HelpCircle size={24} className="hidden sm:block mr-4" />
            <span className="hidden sm:inline">{t('teacherDashboard.quickGuide')}</span>
            <span className="sm:hidden">Ayuda</span>
          </Button>
        </motion.div>
      </div>
      <motion.p variants={itemVariants} className="text-base sm:text-lg text-slate-500 italic mt-6 sm:mt-8 text-center xl:text-left">
        "{t('teacherDashboard.motivationalPhrase')}"
      </motion.p>
    </motion.div>
  );
};

export default TeacherWelcomeHeader;