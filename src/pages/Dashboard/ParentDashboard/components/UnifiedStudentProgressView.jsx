import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  BookOpen, 
  Heart, 
  MessageSquare, 
  Calendar,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  BarChart3,
  Users,
  FileText,
  Lightbulb,
  Zap,
  Brain,
  Star,
  Award,
  Shield,
  Trophy,
  Flame,
  Crown,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import parentStudentSyncService from '@/services/parentStudentSyncService';

const UnifiedStudentProgressView = ({ studentId, onClose }) => {
  const { t } = useLanguage();
  const [student, setStudent] = useState(null);
  const [activities, setActivities] = useState([]);
  const [progress, setProgress] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (studentId) {
      loadStudentData();
    }
  }, [studentId]);

  const loadStudentData = async () => {
    setLoading(true);
    try {
      // Usar el servicio de sincronización
      const result = await parentStudentSyncService.syncParentWithStudent('parent-1', studentId);
      
      if (result.success) {
        setStudent(result.data.student);
        setActivities(result.data.activities);
        setProgress(result.data.progress);
        setNotifications(result.data.notifications);
        setMetrics(result.data.metrics);
        setAlerts(result.data.alerts);
      }
    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (value) => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressBarColor = (value) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center p-8">
        <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-300 mb-2">Estudiante no encontrado</h3>
        <p className="text-slate-400">No se pudo cargar la información del estudiante.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header del Estudiante */}
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                <User size={32} className="text-purple-300" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-200">
                  {student.name}
                </CardTitle>
                <p className="text-slate-400">
                  {student.grade} • {student.school}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="text-blue-300 bg-blue-500/20 border-blue-500/30">
                    {student.role}
                  </Badge>
                  <Badge className="text-green-300 bg-green-500/20 border-green-500/30">
                    {student.status}
                  </Badge>
                  {progress.weeklyStreak > 0 && (
                    <Badge className="text-orange-300 bg-orange-500/20 border-orange-500/30">
                      <Flame size={12} className="mr-1" />
                      {progress.weeklyStreak} días
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cerrar
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs de Navegación */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
            <BarChart3 size={16} className="mr-2" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="academic" className="data-[state=active]:bg-purple-600">
            <BookOpen size={16} className="mr-2" />
            Académico
          </TabsTrigger>
          <TabsTrigger value="emotional" className="data-[state=active]:bg-purple-600">
            <Heart size={16} className="mr-2" />
            Emocional
          </TabsTrigger>
          <TabsTrigger value="activities" className="data-[state=active]:bg-purple-600">
            <Activity size={16} className="mr-2" />
            Actividades
          </TabsTrigger>
        </TabsList>

        {/* Tab: Resumen */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Progreso General */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp size={24} className="text-green-400" />
                  <div>
                    <h4 className="font-semibold text-slate-200">Progreso General</h4>
                    <p className="text-2xl font-bold text-green-400">{progress.overall}%</p>
                  </div>
                </div>
                <Progress value={progress.overall} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BookOpen size={24} className="text-blue-400" />
                  <div>
                    <h4 className="font-semibold text-slate-200">Académico</h4>
                    <p className="text-2xl font-bold text-blue-400">{progress.academic}%</p>
                  </div>
                </div>
                <Progress value={progress.academic} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Heart size={24} className="text-pink-400" />
                  <div>
                    <h4 className="font-semibold text-slate-200">Emocional</h4>
                    <p className="text-2xl font-bold text-pink-400">{progress.emotional}%</p>
                  </div>
                </div>
                <Progress value={progress.emotional} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users size={24} className="text-purple-400" />
                  <div>
                    <h4 className="font-semibold text-slate-200">Social</h4>
                    <p className="text-2xl font-bold text-purple-400">{progress.social}%</p>
                  </div>
                </div>
                <Progress value={progress.social} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Estadísticas de Actividades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                  <Activity size={20} className="text-blue-400" />
                  Actividades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total de Actividades</span>
                    <Badge className="text-blue-400 bg-blue-500/20 border-blue-500/30">
                      {progress.totalActivities}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Completadas</span>
                    <Badge className="text-green-400 bg-green-500/20 border-green-500/30">
                      {progress.completedActivities}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Pendientes</span>
                    <Badge className="text-yellow-400 bg-yellow-500/20 border-yellow-500/30">
                      {progress.totalActivities - progress.completedActivities}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Racha Semanal</span>
                    <Badge className="text-orange-400 bg-orange-500/20 border-orange-500/30">
                      <Flame size={12} className="mr-1" />
                      {progress.weeklyStreak} días
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                  <Trophy size={20} className="text-yellow-400" />
                  Logros Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {progress.weeklyStreak >= 5 && (
                    <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <Flame size={20} className="text-green-400" />
                      <div>
                        <h4 className="font-semibold text-slate-200">Racha Semanal</h4>
                        <p className="text-sm text-slate-400">{progress.weeklyStreak} días consecutivos</p>
                      </div>
                    </div>
                  )}
                  {progress.completedActivities > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <CheckCircle size={20} className="text-blue-400" />
                      <div>
                        <h4 className="font-semibold text-slate-200">Actividades Completadas</h4>
                        <p className="text-sm text-slate-400">{progress.completedActivities} esta semana</p>
                      </div>
                    </div>
                  )}
                  {progress.overall >= 80 && (
                    <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <Star size={20} className="text-purple-400" />
                      <div>
                        <h4 className="font-semibold text-slate-200">Excelente Progreso</h4>
                        <p className="text-sm text-slate-400">Manteniendo un buen rendimiento</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alertas Inteligentes */}
          {alerts.length > 0 && (
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                  <Brain size={20} className="text-orange-400" />
                  Alertas Inteligentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-orange-500/20 rounded">
                          <Brain size={16} className="text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-200 text-sm">{alert.title}</h4>
                          <p className="text-xs text-slate-400 mt-1">{alert.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className="text-orange-400 bg-orange-500/20 border-orange-500/30">
                              {alert.priority}
                            </Badge>
                            <Badge className="text-blue-400 bg-blue-500/20 border-blue-500/30">
                              {alert.confidence}% confianza
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Académico */}
        <TabsContent value="academic" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                <BookOpen size={20} className="text-blue-400" />
                Progreso Académico
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Progreso General</span>
                  <span className={`font-semibold ${getProgressColor(progress.academic)}`}>
                    {progress.academic}%
                  </span>
                </div>
                <Progress value={progress.academic} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                  <h4 className="font-semibold text-slate-200">Actividades Completadas</h4>
                  <p className="text-2xl font-bold text-green-400">{progress.completedActivities}</p>
                </div>
                <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                  <h4 className="font-semibold text-slate-200">Total de Actividades</h4>
                  <p className="text-2xl font-bold text-blue-400">{progress.totalActivities}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Emocional */}
        <TabsContent value="emotional" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                <Heart size={20} className="text-pink-400" />
                Bienestar Emocional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Estabilidad Emocional</span>
                  <span className={`font-semibold ${getProgressColor(progress.emotional)}`}>
                    {progress.emotional}%
                  </span>
                </div>
                <Progress value={progress.emotional} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Desarrollo Social</span>
                  <span className={`font-semibold ${getProgressColor(progress.social)}`}>
                    {progress.social}%
                  </span>
                </div>
                <Progress value={progress.social} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Actividades */}
        <TabsContent value="activities" className="space-y-4">
          {activities.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-8 text-center">
                <BookOpen size={48} className="text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-300 mb-2">No hay actividades</h3>
                <p className="text-slate-400">Este estudiante no tiene actividades asignadas.</p>
              </CardContent>
            </Card>
          ) : (
            activities.map((activity) => (
              <Card key={activity.id} className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-200 mb-2">{activity.title}</h4>
                      <p className="text-sm text-slate-400 mb-3">{activity.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(activity.dueDate).toLocaleDateString()}
                        </span>
                        <span>{activity.subject}</span>
                        <span>{activity.grade}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        activity.status === 'completed' 
                          ? 'text-green-400 bg-green-500/20 border-green-500/30'
                          : activity.status === 'in_progress'
                          ? 'text-blue-400 bg-blue-500/20 border-blue-500/30'
                          : 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
                      }>
                        {activity.status === 'completed' ? 'Completada' : 
                         activity.status === 'in_progress' ? 'En Progreso' : 'Pendiente'}
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm text-slate-300">{activity.progress || 0}%</div>
                        <Progress value={activity.progress || 0} className="w-20 h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default UnifiedStudentProgressView;