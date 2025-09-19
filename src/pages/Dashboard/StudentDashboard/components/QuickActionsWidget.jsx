import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  CheckSquare, 
  HeartHandshake, 
  MessageSquare, 
  BarChart3, 
  Plus,
  Star,
  Calendar,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const QuickActionsWidget = ({ t }) => {
  const quickActions = [
    {
      id: 'resources',
      title: t('studentDashboard.quickActions.resources', 'Recursos'),
      description: t('studentDashboard.quickActions.resourcesDesc', 'Ver recursos asignados'),
      icon: BookOpen,
      href: '/dashboard/student/resources',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'from-amber-500/20 to-orange-500/20',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400'
    },
    {
      id: 'tasks',
      title: t('studentDashboard.quickActions.tasks', 'Mis Tareas'),
      description: t('studentDashboard.quickActions.tasksDesc', 'Gestionar tareas pendientes'),
      icon: CheckSquare,
      href: '/dashboard/student/tasks',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30',
      iconColor: 'text-green-400'
    },
    {
      id: 'emotional',
      title: t('studentDashboard.quickActions.emotional', 'Estado Emocional'),
      description: t('studentDashboard.quickActions.emotionalDesc', 'Registrar cómo te sientes'),
      icon: HeartHandshake,
      href: '/dashboard/student/emotional-attendance',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'from-pink-500/20 to-rose-500/20',
      borderColor: 'border-pink-500/30',
      iconColor: 'text-pink-400'
    },
    {
      id: 'chat',
      title: t('studentDashboard.quickActions.chat', 'Chat con Kary'),
      description: t('studentDashboard.quickActions.chatDesc', 'Hablar con tu asistente IA'),
      icon: MessageSquare,
      href: '/dashboard/student/chat',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400'
    },
    {
      id: 'tracking',
      title: t('studentDashboard.quickActions.tracking', 'Seguimiento'),
      description: t('studentDashboard.quickActions.trackingDesc', 'Ver tu progreso personal'),
      icon: BarChart3,
      href: '/dashboard/student/tracking',
      color: 'from-purple-500 to-violet-500',
      bgColor: 'from-purple-500/20 to-violet-500/20',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-400'
    },
    {
      id: 'support',
      title: t('studentDashboard.quickActions.support', 'Planes de Apoyo'),
      description: t('studentDashboard.quickActions.supportDesc', 'Ver planes de apoyo activos'),
      icon: Target,
      href: '/dashboard/student/support-plans',
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'from-teal-500/20 to-cyan-500/20',
      borderColor: 'border-teal-500/30',
      iconColor: 'text-teal-400'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-indigo-500 to-purple-500" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <CardHeader className="relative pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg border border-indigo-500/30">
              <Plus size={24} className="text-indigo-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-indigo-300">
                {t('studentDashboard.quickActions.title', 'Acciones Rápidas')}
              </CardTitle>
              <p className="text-sm text-slate-400">
                {t('studentDashboard.quickActions.subtitle', 'Accede rápidamente a las funciones más usadas')}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to={action.href}>
                    <Button
                      variant="ghost"
                      className={`w-full h-auto p-4 bg-gradient-to-br ${action.bgColor} border ${action.borderColor} hover:${action.bgColor.replace('/20', '/30')} transition-all duration-200 group`}
                    >
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${action.bgColor} border ${action.borderColor} group-hover:scale-110 transition-transform duration-200`}>
                          {React.createElement(action.icon, { size: 24, className: action.iconColor })}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Additional Quick Actions */}
          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-slate-100"
              >
                <Calendar size={14} className="mr-2" />
                {t('studentDashboard.quickActions.schedule', 'Programar')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-slate-100"
              >
                <Star size={14} className="mr-2" />
                {t('studentDashboard.quickActions.favorites', 'Favoritos')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-slate-100"
              >
                <Target size={14} className="mr-2" />
                {t('studentDashboard.quickActions.goals', 'Metas')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuickActionsWidget;
