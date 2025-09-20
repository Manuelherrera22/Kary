import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  MessageSquare, 
  Eye,
  MoreVertical,
  Star,
  Heart,
  Target,
  Calendar
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const StudentOverviewCard = ({ student, onViewDetails, onAddActivity, onViewProgress }) => {
  const { t, language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return t('common.notAvailableShort');
    try {
      const date = parseISO(dateString);
      return format(date, 'PPP', { locale: language === 'es' ? es : undefined });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'good': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'needs_attention': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'needs_follow_up': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return <Star className="w-4 h-4" />;
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'needs_attention': return <Clock className="w-4 h-4" />;
      case 'needs_follow_up': return <AlertTriangle className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 overflow-hidden relative group hover:border-slate-600/70 transition-all duration-300">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-blue-500 to-purple-500" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <CardHeader className="relative pb-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
                <User size={16} className="sm:hidden text-blue-400" />
                <User size={20} className="hidden sm:block text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-200 text-base sm:text-lg truncate">{student.full_name}</h3>
                <p className="text-xs sm:text-sm text-slate-400 truncate">{student.grade || 'Nivel no especificado'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Badge className={`${getStatusColor(student.general_status)} flex items-center gap-1 text-xs`}>
                <span className="hidden sm:inline">{getStatusIcon(student.general_status)}</span>
                <span className="truncate">{t(`teacherDashboard.studentStatus.${student.general_status}`, student.general_status)}</span>
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-400 hover:text-slate-200 p-1 flex-shrink-0"
              >
                <MoreVertical size={14} className="sm:hidden" />
                <MoreVertical size={16} className="hidden sm:block" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-4">
          {/* Progress Overview */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-300">
              <span>{t('teacherDashboard.overallProgress', 'Progreso General')}</span>
              <span className="font-medium text-blue-300">{student.progress || 0}%</span>
            </div>
            <Progress 
              value={student.progress || 0} 
              className="h-2 bg-slate-700" 
              indicatorClassName={getProgressColor(student.progress || 0)}
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="bg-slate-700/30 rounded-lg p-2 sm:p-3 border border-slate-600/50">
              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                <BookOpen size={12} className="sm:hidden text-green-400" />
                <BookOpen size={14} className="hidden sm:block text-green-400" />
                <span className="text-xs font-medium text-slate-300 truncate">
                  {t('teacherDashboard.activitiesCompleted', 'Actividades')}
                </span>
              </div>
              <div className="text-base sm:text-lg font-bold text-green-300">
                {student.completed_activities || 0}
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-2 sm:p-3 border border-slate-600/50">
              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                <Clock size={12} className="sm:hidden text-orange-400" />
                <Clock size={14} className="hidden sm:block text-orange-400" />
                <span className="text-xs font-medium text-slate-300 truncate">
                  {t('teacherDashboard.pendingTasks', 'Pendientes')}
                </span>
              </div>
              <div className="text-base sm:text-lg font-bold text-orange-300">
                {student.pending_tasks || 0}
              </div>
            </div>
          </div>

          {/* Last Activity */}
          <div className="bg-slate-700/30 rounded-lg p-2 sm:p-3 border border-slate-600/50">
            <div className="flex items-center gap-1 sm:gap-2 mb-2">
              <Calendar size={12} className="sm:hidden text-purple-400" />
              <Calendar size={14} className="hidden sm:block text-purple-400" />
              <span className="text-xs font-medium text-slate-300">
                {t('teacherDashboard.lastActivity', 'Última Actividad')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 truncate">
              {student.last_activity ? formatDate(student.last_activity) : t('teacherDashboard.noRecentActivity', 'Sin actividad reciente')}
            </p>
          </div>

          {/* Emotional Alert */}
          {student.emotional_alert && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Heart size={14} className="text-red-400" />
                <span className="text-sm font-medium text-red-300">
                  {t('teacherDashboard.emotionalAlert', 'Atención Emocional')}
                </span>
              </div>
              <p className="text-xs text-red-400 mt-1">
                {t('teacherDashboard.emotionalAlertMessage', 'El estudiante muestra señales que requieren atención especial')}
              </p>
            </div>
          )}

          {/* Expanded Content */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 pt-3 border-t border-slate-700/50"
            >
              {/* Detailed Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-300">{student.total_activities || 0}</div>
                  <div className="text-xs text-slate-400">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-300">{student.completed_activities || 0}</div>
                  <div className="text-xs text-slate-400">Completadas</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-300">{student.average_score || 0}</div>
                  <div className="text-xs text-slate-400">Promedio</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onViewDetails(student)}
                  className="flex-1 bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30"
                >
                  <Eye size={14} className="mr-1" />
                  {t('common.view', 'Ver')}
                </Button>
                <Button
                  size="sm"
                  onClick={() => onAddActivity(student)}
                  className="flex-1 bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30"
                >
                  <Target size={14} className="mr-1" />
                  {t('teacherDashboard.addActivity', 'Agregar')}
                </Button>
                <Button
                  size="sm"
                  onClick={() => onViewProgress(student)}
                  className="flex-1 bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30"
                >
                  <TrendingUp size={14} className="mr-1" />
                  {t('teacherDashboard.progress', 'Progreso')}
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentOverviewCard;