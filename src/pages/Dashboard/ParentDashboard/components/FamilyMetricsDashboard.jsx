import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Heart,
  Brain,
  BookOpen,
  Activity,
  Zap,
  Shield,
  Star,
  Calendar,
  MessageSquare,
  Award,
  Home,
  School
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import unifiedDataService from '@/services/unifiedDataService';

const FamilyMetricsDashboard = () => {
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y

  useEffect(() => {
    loadMetrics();
  }, [timeRange]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      // Simular carga de métricas familiares
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMetrics = {
        overview: {
          totalChildren: 2,
          activeSupportPlans: 1,
          completedActivities: 24,
          averageProgress: 78,
          familyEngagement: 85,
          communicationFrequency: 'Diaria'
        },
        academic: {
          averageGrade: 8.2,
          completionRate: 88,
          improvementRate: 15,
          strugglingSubjects: ['Matemáticas'],
          excellingSubjects: ['Historia', 'Ciencias'],
          homeworkCompletion: 92
        },
        emotional: {
          emotionalStability: 82,
          socialIntegration: 76,
          selfConfidence: 71,
          familySupport: 90,
          stressLevel: 'Bajo',
          emotionalAlerts: 3
        },
        behavioral: {
          positiveBehaviors: 18,
          behavioralIncidents: 2,
          improvementAreas: ['Concentración', 'Organización'],
          strengths: ['Creatividad', 'Empatía'],
          disciplineActions: 1,
          rewardsEarned: 12
        },
        communication: {
          teacherMessages: 15,
          psychopedagogueMessages: 8,
          responseRate: 95,
          averageResponseTime: '2 horas',
          meetingsAttended: 4,
          upcomingMeetings: 1
        },
        support: {
          activeInterventions: 3,
          completedInterventions: 7,
          successRate: 78,
          familyInvolvement: 92,
          homeSupportTips: 12,
          resourcesAccessed: 8
        },
        trends: {
          weeklyProgress: [
            { week: 'Sem 1', progress: 65 },
            { week: 'Sem 2', progress: 68 },
            { week: 'Sem 3', progress: 72 },
            { week: 'Sem 4', progress: 78 }
          ],
          monthlyEngagement: [
            { month: 'Ene', engagement: 75 },
            { month: 'Feb', engagement: 80 },
            { month: 'Mar', engagement: 85 },
            { month: 'Abr', engagement: 90 }
          ],
          emotionalTrends: [
            { period: 'Q1', stability: 75 },
            { period: 'Q2', stability: 78 },
            { period: 'Q3', stability: 82 },
            { period: 'Q4', stability: 85 }
          ]
        }
      };

      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error loading metrics:', error);
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
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando métricas familiares...</p>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-8 text-center">
          <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">Error al cargar métricas</h3>
          <p className="text-slate-400">No se pudieron cargar las métricas familiares.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/30 flex-shrink-0">
              <Home size={20} className="sm:hidden text-green-400" />
              <Home size={24} className="hidden sm:block text-green-400" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-green-300 leading-tight">
                Métricas Familiares
              </CardTitle>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-1">
                Indicadores del progreso familiar y educativo
              </p>
            </div>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-700 border-slate-600 text-slate-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm w-full sm:w-auto"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="1y">Último año</option>
          </select>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
        {/* Tabs de navegación */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 bg-slate-700/30 h-auto">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-600 text-xs sm:text-sm py-2 px-1 sm:px-2">
              <BarChart3 size={14} className="sm:hidden mr-1" />
              <BarChart3 size={16} className="hidden sm:block mr-2" />
              <span className="sm:hidden">Res</span>
              <span className="hidden sm:inline">Resumen</span>
            </TabsTrigger>
            <TabsTrigger value="academic" className="data-[state=active]:bg-green-600 text-xs sm:text-sm py-2 px-1 sm:px-2">
              <BookOpen size={14} className="sm:hidden mr-1" />
              <BookOpen size={16} className="hidden sm:block mr-2" />
              <span className="sm:hidden">Acad</span>
              <span className="hidden sm:inline">Académico</span>
            </TabsTrigger>
            <TabsTrigger value="emotional" className="data-[state=active]:bg-green-600 text-xs sm:text-sm py-2 px-1 sm:px-2">
              <Heart size={14} className="sm:hidden mr-1" />
              <Heart size={16} className="hidden sm:block mr-2" />
              <span className="sm:hidden">Emoc</span>
              <span className="hidden sm:inline">Emocional</span>
            </TabsTrigger>
            <TabsTrigger value="behavioral" className="data-[state=active]:bg-green-600 text-xs sm:text-sm py-2 px-1 sm:px-2">
              <Target size={14} className="sm:hidden mr-1" />
              <Target size={16} className="hidden sm:block mr-2" />
              <span className="sm:hidden">Comp</span>
              <span className="hidden sm:inline">Comportamental</span>
            </TabsTrigger>
            <TabsTrigger value="communication" className="data-[state=active]:bg-green-600 text-xs sm:text-sm py-2 px-1 sm:px-2 col-span-2 sm:col-span-1">
              <MessageSquare size={14} className="sm:hidden mr-1" />
              <MessageSquare size={16} className="hidden sm:block mr-2" />
              <span className="sm:hidden">Comun</span>
              <span className="hidden sm:inline">Comunicación</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Resumen */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Users size={20} className="sm:hidden text-blue-400 flex-shrink-0" />
                    <Users size={24} className="hidden sm:block text-blue-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-slate-200 text-sm sm:text-base truncate">Total Hijos</h4>
                      <p className="text-xl sm:text-2xl font-bold text-blue-400">{metrics.overview.totalChildren}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Target size={20} className="sm:hidden text-green-400 flex-shrink-0" />
                    <Target size={24} className="hidden sm:block text-green-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-slate-200 text-sm sm:text-base truncate">Planes de Apoyo</h4>
                      <p className="text-xl sm:text-2xl font-bold text-green-400">{metrics.overview.activeSupportPlans}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle size={20} className="sm:hidden text-purple-400 flex-shrink-0" />
                    <CheckCircle size={24} className="hidden sm:block text-purple-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-slate-200 text-sm sm:text-base truncate">Actividades Completadas</h4>
                      <p className="text-xl sm:text-2xl font-bold text-purple-400">{metrics.overview.completedActivities}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <TrendingUp size={20} className="sm:hidden text-yellow-400 flex-shrink-0" />
                    <TrendingUp size={24} className="hidden sm:block text-yellow-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-slate-200 text-sm sm:text-base truncate">Progreso Promedio</h4>
                      <p className="text-xl sm:text-2xl font-bold text-yellow-400">{metrics.overview.averageProgress}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Heart size={20} className="sm:hidden text-pink-400 flex-shrink-0" />
                    <Heart size={24} className="hidden sm:block text-pink-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-slate-200 text-sm sm:text-base truncate">Compromiso Familiar</h4>
                      <p className="text-xl sm:text-2xl font-bold text-pink-400">{metrics.overview.familyEngagement}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <MessageSquare size={20} className="sm:hidden text-cyan-400 flex-shrink-0" />
                    <MessageSquare size={24} className="hidden sm:block text-cyan-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-slate-200 text-sm sm:text-base truncate">Comunicación</h4>
                      <p className="text-xl sm:text-2xl font-bold text-cyan-400">{metrics.overview.communicationFrequency}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Académico */}
          <TabsContent value="academic" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="text-base sm:text-lg text-slate-200">Rendimiento Académico</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 pt-0">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Calificación Promedio</span>
                      <span className={`font-semibold ${getProgressColor(metrics.academic.averageGrade * 10)}`}>
                        {metrics.academic.averageGrade}/10
                      </span>
                    </div>
                    <Progress value={metrics.academic.averageGrade * 10} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Tasa de Finalización</span>
                      <span className={`font-semibold ${getProgressColor(metrics.academic.completionRate)}`}>
                        {metrics.academic.completionRate}%
                      </span>
                    </div>
                    <Progress value={metrics.academic.completionRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Tareas Completadas</span>
                      <span className={`font-semibold ${getProgressColor(metrics.academic.homeworkCompletion)}`}>
                        {metrics.academic.homeworkCompletion}%
                      </span>
                    </div>
                    <Progress value={metrics.academic.homeworkCompletion} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-200">Análisis por Materias</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h5 className="text-sm font-semibold text-slate-300 mb-2">Materias con Dificultades</h5>
                    <div className="space-y-1">
                      {metrics.academic.strugglingSubjects.map((subject, index) => (
                        <Badge key={index} className="text-red-400 bg-red-500/20 border-red-500/30 mr-2">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-300 mb-2">Materias Destacadas</h5>
                    <div className="space-y-1">
                      {metrics.academic.excellingSubjects.map((subject, index) => (
                        <Badge key={index} className="text-green-400 bg-green-500/20 border-green-500/30 mr-2">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-300 mb-2">Mejora General</h5>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-green-400" />
                      <span className="text-green-400 font-semibold">+{metrics.academic.improvementRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Emocional */}
          <TabsContent value="emotional" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="text-base sm:text-lg text-slate-200">Bienestar Emocional</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 pt-0">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Estabilidad Emocional</span>
                      <span className={`font-semibold ${getProgressColor(metrics.emotional.emotionalStability)}`}>
                        {metrics.emotional.emotionalStability}%
                      </span>
                    </div>
                    <Progress value={metrics.emotional.emotionalStability} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Integración Social</span>
                      <span className={`font-semibold ${getProgressColor(metrics.emotional.socialIntegration)}`}>
                        {metrics.emotional.socialIntegration}%
                      </span>
                    </div>
                    <Progress value={metrics.emotional.socialIntegration} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Autoestima</span>
                      <span className={`font-semibold ${getProgressColor(metrics.emotional.selfConfidence)}`}>
                        {metrics.emotional.selfConfidence}%
                      </span>
                    </div>
                    <Progress value={metrics.emotional.selfConfidence} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-200">Apoyo Familiar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Nivel de Apoyo</span>
                      <span className={`font-semibold ${getProgressColor(metrics.emotional.familySupport)}`}>
                        {metrics.emotional.familySupport}%
                      </span>
                    </div>
                    <Progress value={metrics.emotional.familySupport} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Nivel de Estrés</span>
                    <Badge className="text-green-400 bg-green-500/20 border-green-500/30">
                      {metrics.emotional.stressLevel}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Alertas Emocionales</span>
                    <Badge className="text-yellow-400 bg-yellow-500/20 border-yellow-500/30">
                      {metrics.emotional.emotionalAlerts}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Comportamental */}
          <TabsContent value="behavioral" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="text-base sm:text-lg text-slate-200">Comportamiento Positivo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Comportamientos Positivos</span>
                    <Badge className="text-green-400 bg-green-500/20 border-green-500/30">
                      {metrics.behavioral.positiveBehaviors}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Incidentes</span>
                    <Badge className="text-red-400 bg-red-500/20 border-red-500/30">
                      {metrics.behavioral.behavioralIncidents}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Recompensas Ganadas</span>
                    <Badge className="text-yellow-400 bg-yellow-500/20 border-yellow-500/30">
                      {metrics.behavioral.rewardsEarned}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-200">Fortalezas y Áreas de Mejora</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h5 className="text-sm font-semibold text-slate-300 mb-2">Fortalezas</h5>
                    <div className="space-y-1">
                      {metrics.behavioral.strengths.map((strength, index) => (
                        <Badge key={index} className="text-green-400 bg-green-500/20 border-green-500/30 mr-2">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-300 mb-2">Áreas de Mejora</h5>
                    <div className="space-y-1">
                      {metrics.behavioral.improvementAreas.map((area, index) => (
                        <Badge key={index} className="text-yellow-400 bg-yellow-500/20 border-yellow-500/30 mr-2">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Comunicación */}
          <TabsContent value="communication" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="text-base sm:text-lg text-slate-200">Actividad de Comunicación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Mensajes con Profesores</span>
                    <Badge className="text-blue-400 bg-blue-500/20 border-blue-500/30">
                      {metrics.communication.teacherMessages}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Mensajes con Psicopedagogos</span>
                    <Badge className="text-purple-400 bg-purple-500/20 border-purple-500/30">
                      {metrics.communication.psychopedagogueMessages}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Tasa de Respuesta</span>
                    <Badge className="text-green-400 bg-green-500/20 border-green-500/30">
                      {metrics.communication.responseRate}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-200">Reuniones y Citas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Reuniones Asistidas</span>
                    <Badge className="text-green-400 bg-green-500/20 border-green-500/30">
                      {metrics.communication.meetingsAttended}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Próximas Reuniones</span>
                    <Badge className="text-yellow-400 bg-yellow-500/20 border-yellow-500/30">
                      {metrics.communication.upcomingMeetings}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Tiempo Promedio de Respuesta</span>
                    <Badge className="text-blue-400 bg-blue-500/20 border-blue-500/30">
                      {metrics.communication.averageResponseTime}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FamilyMetricsDashboard;

