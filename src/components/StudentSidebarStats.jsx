import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle, Clock, Star } from 'lucide-react';

const StudentSidebarStats = ({ isCollapsed }) => {
  const stats = [
    {
      icon: CheckCircle,
      label: 'Tareas Completadas',
      value: '12',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      icon: Clock,
      label: 'Tiempo de Estudio',
      value: '2.5h',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      icon: Star,
      label: 'Puntos Ganados',
      value: '150',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20'
    },
    {
      icon: TrendingUp,
      label: 'Progreso Semanal',
      value: '+15%',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    }
  ];

  if (isCollapsed) {
    return (
      <div className="px-2 py-4 space-y-2">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`w-12 h-12 ${stat.bgColor} ${stat.borderColor} border rounded-lg flex items-center justify-center`}
            >
              <IconComponent className={`w-5 h-5 ${stat.color}`} />
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <motion.div 
      className="px-4 py-4 border-t border-slate-700/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Estadísticas Rápidas
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-3`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <IconComponent className={`w-4 h-4 ${stat.color}`} />
                <span className={`text-sm font-semibold ${stat.color}`}>
                  {stat.value}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default StudentSidebarStats;


