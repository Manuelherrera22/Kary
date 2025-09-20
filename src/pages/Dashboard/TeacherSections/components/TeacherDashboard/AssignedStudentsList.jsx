import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  User, 
  BookOpen, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  MessageSquare, 
  Eye,
  Plus,
  Calendar,
  Target,
  Heart
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AssignedStudentsList = ({ teacherId }) => {
  const { t } = useLanguage();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, [teacherId]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      // Simular carga de estudiantes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStudents = [
        {
          id: 1,
          full_name: 'María García',
          grade: '5to Primaria',
          progress: 85,
          completed_activities: 12,
          pending_tasks: 3,
          last_activity: '2024-01-15',
          emotional_alert: false,
          general_status: 'excellent'
        },
        {
          id: 2,
          full_name: 'Carlos López',
          grade: '4to Primaria',
          progress: 72,
          completed_activities: 8,
          pending_tasks: 5,
          last_activity: '2024-01-14',
          emotional_alert: true,
          general_status: 'needs_attention'
        },
        {
          id: 3,
          full_name: 'Ana Rodríguez',
          grade: '6to Primaria',
          progress: 90,
          completed_activities: 15,
          pending_tasks: 1,
          last_activity: '2024-01-15',
          emotional_alert: false,
          general_status: 'excellent'
        }
      ];
      
      setStudents(mockStudents);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
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

  const formatDate = (dateString) => {
    if (!dateString) return t('common.notAvailableShort');
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/90 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-center sm:text-left">
            {t('teacherDashboard.assignedStudents', 'Estudiantes Asignados')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/90 border-slate-700/50">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-xl sm:text-2xl text-center sm:text-left">
          {t('teacherDashboard.assignedStudents', 'Estudiantes Asignados')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] pr-2 sm:pr-4">
          <div className="space-y-3 sm:space-y-4 p-4 sm:p-6">
            {students.map((student) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-700/50 rounded-lg p-3 sm:p-4 border border-slate-600/50 hover:border-slate-500/50 transition-all duration-200"
              >
                <div className="flex flex-col gap-3 sm:gap-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg">
                        <User size={16} className="sm:hidden text-blue-400" />
                        <User size={20} className="hidden sm:block text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-200 text-base sm:text-lg truncate">
                          {student.full_name}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-400 truncate">
                          {student.grade}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(student.general_status)} text-xs`}>
                      {t(`teacherDashboard.studentStatus.${student.general_status}`, student.general_status)}
                    </Badge>
                  </div>

                  {/* Activity Details */}
                  <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen size={12} className="sm:hidden text-green-400" />
                      <BookOpen size={14} className="hidden sm:block text-green-400" />
                      <span className="text-slate-300 truncate">
                        {student.completed_activities} {t('teacherDashboard.activitiesCompleted', 'actividades completadas')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="sm:hidden text-orange-400" />
                      <Clock size={14} className="hidden sm:block text-orange-400" />
                      <span className="text-slate-300 truncate">
                        {student.pending_tasks} {t('teacherDashboard.pendingTasks', 'tareas pendientes')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="sm:hidden text-purple-400" />
                      <Calendar size={14} className="hidden sm:block text-purple-400" />
                      <span className="text-slate-300 truncate">
                        {t('teacherDashboard.lastActivity', 'Última actividad')}: {formatDate(student.last_activity)}
                      </span>
                    </div>
                  </div>

                  {/* Emotional Alert */}
                  {student.emotional_alert && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center gap-2">
                        <Heart size={12} className="text-red-400" />
                        <span className="text-xs sm:text-sm text-red-300">
                          {t('teacherDashboard.emotionalAlert', 'Atención Emocional Requerida')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs sm:text-sm py-2 px-3 border-slate-500 text-slate-300 hover:bg-slate-600 hover:text-white"
                    >
                      <Eye size={14} className="sm:hidden mr-1" />
                      <Eye size={16} className="hidden sm:block mr-1" />
                      <span className="truncate">{t('common.view', 'Ver')}</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs sm:text-sm py-2 px-3 border-blue-500 text-blue-300 hover:bg-blue-500 hover:text-white"
                    >
                      <Plus size={14} className="sm:hidden mr-1" />
                      <Plus size={16} className="hidden sm:block mr-1" />
                      <span className="truncate">{t('teacherDashboard.addActivity', 'Agregar')}</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AssignedStudentsList;
