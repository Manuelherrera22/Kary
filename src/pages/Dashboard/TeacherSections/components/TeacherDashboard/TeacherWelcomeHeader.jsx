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
      className="p-6 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-black border border-slate-700 shadow-2xl"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <motion.h1 variants={itemVariants} className="text-3xl font-bold text-slate-100">
            👨‍🏫 {t('teacherDashboard.welcome', { name: teacherName })}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-slate-400 mt-1">
            {t('teacherDashboard.subtitle')}
          </motion.p>
        </div>
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <div className="flex items-center text-slate-300 bg-slate-700/50 px-4 py-2 rounded-lg">
            <Users size={18} className="mr-2 text-purple-400" />
            <span className="font-medium">{assignedStudentsCount}</span>
            <span className="ml-1.5 text-slate-400">{t('teacherDashboard.assignedStudents')}</span>
          </div>
          <Button 
            variant="outline" 
            className="border-purple-500/70 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
            onClick={() => toast({ title: "🚧 Característica no implementada", description: "¡La guía rápida estará disponible pronto!" })}
          >
            <HelpCircle size={16} className="mr-2" />
            {t('teacherDashboard.quickGuide')}
          </Button>
        </motion.div>
      </div>
      <motion.p variants={itemVariants} className="text-sm text-slate-500 italic mt-4">
        "{t('teacherDashboard.motivationalPhrase')}"
      </motion.p>
    </motion.div>
  );
};

export default TeacherWelcomeHeader;