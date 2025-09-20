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
      className="p-3 sm:p-4 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-black border border-slate-700 shadow-2xl w-full"
    >
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-3 sm:gap-4 md:gap-6">
        <div className="flex-1 min-w-0 w-full">
          <motion.h1 variants={itemVariants} className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-100 leading-tight">
            👨‍🏫 {t('teacherDashboard.welcome', { name: teacherName })}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-slate-400 mt-2 text-sm sm:text-base md:text-lg leading-relaxed">
            {t('teacherDashboard.subtitle')}
          </motion.p>
        </div>
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 md:gap-4 w-full xl:w-auto mt-4 xl:mt-0">
          <div className="flex items-center justify-center text-slate-300 bg-slate-700/50 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 rounded-lg">
            <Users size={16} className="sm:hidden mr-2 text-purple-400" />
            <Users size={18} className="hidden sm:block mr-3 text-purple-400" />
            <span className="font-medium text-sm sm:text-base md:text-lg">{assignedStudentsCount}</span>
            <span className="ml-2 text-slate-400 text-sm sm:text-base">{t('teacherDashboard.assignedStudents')}</span>
          </div>
          <Button 
            variant="outline" 
            className="border-purple-500/70 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200 text-sm sm:text-base md:text-lg py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6"
            onClick={() => toast({ title: "🚧 Característica no implementada", description: "¡La guía rápida estará disponible pronto!" })}
          >
            <HelpCircle size={14} className="sm:hidden mr-2" />
            <HelpCircle size={16} className="hidden sm:block mr-3" />
            <span className="hidden sm:inline">{t('teacherDashboard.quickGuide')}</span>
            <span className="sm:hidden">Ayuda</span>
          </Button>
        </motion.div>
      </div>
      <motion.p variants={itemVariants} className="text-sm sm:text-base text-slate-500 italic mt-4 sm:mt-6 text-center xl:text-left">
        "{t('teacherDashboard.motivationalPhrase')}"
      </motion.p>
    </motion.div>
  );
};

export default TeacherWelcomeHeader;