import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, BookPlus, Users2, Sparkles, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ActionButton = ({ label, icon: Icon, onClick, color }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col h-28 items-center justify-center text-center p-3 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
      style={{ background: `linear-gradient(145deg, ${color}99, ${color}FF)` }}
    >
      <Icon size={32} className="mb-2" />
      <span className="text-xs font-semibold leading-tight">{label}</span>
    </motion.button>
  );
};

const ActionButtons = ({ onRegisterStudent, onCreateResource, onAssignMultiple, onSmartAssignment, onCreatePlan }) => {
  const { t } = useLanguage();

  const buttons = [
    {
      label: t('psychopedagogueDashboard.buttons.registerStudent'),
      icon: UserPlus,
      onClick: onRegisterStudent,
      color: '#0ea5e9', // sky-500
    },
    {
      label: t('psychopedagogueDashboard.buttons.createCase'),
      icon: BookPlus,
      onClick: onCreateResource,
      color: '#10b981', // teal-500
    },
    {
      label: t('psychopedagogueDashboard.buttons.assignCase'),
      icon: Users2,
      onClick: onAssignMultiple,
      color: '#f97316', // orange-500
    },
    {
      label: t('psychopedagogueDashboard.buttons.smartAssignment'),
      icon: Sparkles,
      onClick: onSmartAssignment,
      color: '#8b5cf6', // violet-500
    },
    {
      label: t('psychopedagogueDashboard.buttons.supportPlans'),
      icon: FileText,
      onClick: onCreatePlan,
      color: '#6366f1', // indigo-500
    }
  ];

  return (
    <motion.div 
      className="p-6 bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700/70"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-sky-300 mb-6 pb-3 border-b border-slate-700/50">
        {t('psychopedagogueDashboard.managementTools.title')}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {buttons.map((button, index) => (
          <ActionButton
            key={index}
            label={button.label}
            icon={button.icon}
            onClick={button.onClick}
            color={button.color}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ActionButtons;