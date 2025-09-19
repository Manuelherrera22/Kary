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
  Brain, 
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
  Zap
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import unifiedDataService from '@/services/unifiedDataService';
import activityService from '@/services/activityService';
import realTimeNotificationService from '@/services/realTimeNotificationService';

const UnifiedStudentView = ({ studentId, onClose }) => {
  const { t } = useLanguage();
  const [student, setStudent] = useState(null);
  const [activities, setActivities] = useState([]);
  const [cases, setCases] = useState([]);
  const [supportPlans, setSupportPlans] = useState([]);
  const [notifications, setNotifications] = useState([]);
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
      // Cargar datos del estudiante
      const studentResult = await unifiedDataService.getStudentById(studentId);
      if (studentResult.success) {
        setStudent(studentResult.data);
      }

      // Cargar actividades del estudiante
      const activitiesResult = await activityService.getStudentActivities(studentId);
      if (activitiesResult.success) {
        setActivities(activitiesResult.data);
      }

      // Cargar casos del estudiante
      const casesResult = await unifiedDataService.getCases({ studentId });
      if (casesResult.success) {
        setCases(casesResult.data);
      }

      // Cargar planes de apoyo
      const plansResult = await unifiedDataService.getSupportPlans({ studentId });
      if (plansResult.success) {
        setSupportPlans(plansResult.data);
      }

      // Cargar notificaciones relacionadas
      const notificationsResult = await realTimeNotificationService.getNotifications(studentId);
      if (notificationsResult.success) {
        setNotifications(notificationsResult.data);
      }

    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityStatus = (activity) => {
    if (activity.status === 'completed') return 'Completada';
    if (activity.status === 'in_progress') return 'En Progreso';
    if (new Date(activity.dueDate) < new Date()) return 'Vencida';
    return 'Asignada';
  };

  const getActivityStatusColor = (activity) => {
    if (activity.status === 'completed') return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (activity.status === 'in_progress') return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    if (new Date(activity.dueDate) < new Date()) return 'text-red-400 bg-red-500/20 border-red-500/30';
    return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
  };

  const getCaseStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'in_progress': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'completed': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'paused': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
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
          <TabsTrigger value="activities" className="data-[state=active]:bg-purple-600">
            <BookOpen size={16} className="mr-2" />
            Actividades
          </TabsTrigger>
          <TabsTrigger value="cases" className="data-[state=active]:bg-purple-600">
            <FileText size={16} className="mr-2" />
            Casos
          </TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-purple-600">
            <TrendingUp size={16} className="mr-2" />
            Progreso
          </TabsTrigger>
        </TabsList>

        {/* Tab: Resumen */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Estadísticas Rápidas */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                  <Activity size={20} className="text-blue-400" />
                  Actividades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total:</span>
                    <span className="text-slate-200">{activities.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Completadas:</span>
                    <span className="text-green-400">
                      {activities.filter(a => a.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">En Progreso:</span>
                    <span className="text-blue-400">
                      {activities.filter(a => a.status === 'in_progress').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                  <FileText size={20} className="text-purple-400" />
                  Casos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total:</span>
                    <span className="text-slate-200">{cases.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Activos:</span>
                    <span className="text-blue-400">
                      {cases.filter(c => c.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Completados:</span>
                    <span className="text-green-400">
                      {cases.filter(c => c.status === 'completed').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                  <Target size={20} className="text-green-400" />
                  Planes de Apoyo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total:</span>
                    <span className="text-slate-200">{supportPlans.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Activos:</span>
                    <span className="text-green-400">
                      {supportPlans.filter(p => p.status === 'active').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información del Estudiante */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                <User size={20} className="text-purple-400" />
                Información del Estudiante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-2">Necesidades de Aprendizaje</h4>
                  <div className="flex flex-wrap gap-1">
                    {student.learningNeeds?.map((need, index) => (
                      <Badge key={index} className="text-xs text-blue-300 bg-blue-500/20 border-blue-500/30">
                        {need}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-2">Información Médica</h4>
                  <p className="text-sm text-slate-400">{student.medicalInfo || 'Ninguna'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-2">Contacto de Emergencia</h4>
                  <p className="text-sm text-slate-400">
                    {student.emergencyContact?.name} - {student.emergencyContact?.phone}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-2">Fecha de Registro</h4>
                  <p className="text-sm text-slate-400">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </p>
                </div>
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
                      <Badge className={getActivityStatusColor(activity)}>
                        {getActivityStatus(activity)}
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm text-slate-300">{activity.progress}%</div>
                        <Progress value={activity.progress} className="w-20 h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Tab: Casos */}
        <TabsContent value="cases" className="space-y-4">
          {cases.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-8 text-center">
                <FileText size={48} className="text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-300 mb-2">No hay casos</h3>
                <p className="text-slate-400">Este estudiante no tiene casos registrados.</p>
              </CardContent>
            </Card>
          ) : (
            cases.map((case_) => (
              <Card key={case_.id} className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-200 mb-2">{case_.title}</h4>
                      <p className="text-sm text-slate-400 mb-3">{case_.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>{case_.category}</span>
                        <span>{case_.priority}</span>
                        <span>{new Date(case_.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge className={getCaseStatusColor(case_.status)}>
                      {case_.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Tab: Progreso */}
        <TabsContent value="progress" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                <TrendingUp size={20} className="text-green-400" />
                Progreso General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Progreso Académico</span>
                    <span className="text-slate-200">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Progreso Emocional</span>
                    <span className="text-slate-200">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Progreso Social</span>
                    <span className="text-slate-200">80%</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default UnifiedStudentView;

