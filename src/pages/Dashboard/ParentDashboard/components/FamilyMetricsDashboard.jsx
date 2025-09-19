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
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/30">
              <Home size={24} className="text-green-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-green-300">
                Métricas Familiares
              </CardTitle>
              <p className="text-sm text-slate-400">
                Indicadores del progreso familiar y educativo
              </p>
            </div>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-700 border-slate-600 text-slate-200 rounded-lg px-3 py-1 text-sm"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="1y">Último año</option>
          </select>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tabs de navegación */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-700/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-600">
              <BarChart3 size={16} className="mr-2" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="academic" className="data-[state=active]:bg-green-600">
              <BookOpen size={16} className="mr-2" />
              Académico
            </TabsTrigger>
            <TabsTrigger value="emotional" className="data-[state=active]:bg-green-600">
              <Heart size={16} className="mr-2" />
              Emocional
            </TabsTrigger>
            <TabsTrigger value="behavioral" className="data-[state=active]:bg-green-600">
              <Target size={16} className="mr-2" />
              Comportamental
            </TabsTrigger>
            <TabsTrigger value="communication" className="data-[state=active]:bg-green-600">
              <MessageSquare size={16} className="mr-2" />
              Comunicación
            </TabsTrigger>
          </TabsList>

          {/* Tab: Resumen */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Users size={24} className="text-blue-400" />
                    <div>
                      <h4 className="font-semibold text-slate-200">Total Hijos</h4>
                      <p className="text-2xl font-bold text-blue-400">{metrics.overview.totalChildren}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Target size={24} className="text-green-400" />
                    <div>
                      <h4 className="font-semibold text-slate-200">Planes de Apoyo</h4>
                      <p className="text-2xl font-bold text-green-400">{metrics.overview.activeSupportPlans}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={24} className="text-purple-400" />
                    <div>
                      <h4 className="font-semibold text-slate-200">Actividades Completadas</h4>
                      <p className="text-2xl font-bold text-purple-400">{metrics.overview.completedActivities}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={24} className="text-yellow-400" />
                    <div>
                      <h4 className="font-semibold text-slate-200">Progreso Promedio</h4>
                      <p className="text-2xl font-bold text-yellow-400">{metrics.overview.averageProgress}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Heart size={24} className="text-pink-400" />
                    <div>
                      <h4 className="font-semibold text-slate-200">Compromiso Familiar</h4>
                      <p className="text-2xl font-bold text-pink-400">{metrics.overview.familyEngagement}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={24} className="text-cyan-400" />
                    <div>
                      <h4 className="font-semibold text-slate-200">Comunicación</h4>
                      <p className="text-2xl font-bold text-cyan-400">{metrics.overview.communicationFrequency}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Académico */}
          <TabsContent value="academic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-200">Rendimiento Académico</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
          <TabsContent value="emotional" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-200">Bienestar Emocional</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
          <TabsContent value="behavioral" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-200">Comportamiento Positivo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
          <TabsContent value="communication" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-200">Actividad de Comunicación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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

