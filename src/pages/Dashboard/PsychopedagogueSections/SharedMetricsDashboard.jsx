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
  MessageSquare
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import unifiedDataService from '@/services/unifiedDataService';
import realTimeNotificationService from '@/services/realTimeNotificationService';

const SharedMetricsDashboard = () => {
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
      // Simular carga de métricas
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMetrics = {
        overview: {
          totalStudents: 45,
          activeCases: 23,
          completedInterventions: 18,
          averageResponseTime: '2.5 horas',
          satisfactionScore: 4.7,
          collaborationScore: 4.2
        },
        academic: {
          averageProgress: 78,
          completionRate: 85,
          improvementRate: 12,
          strugglingStudents: 8,
          excellingStudents: 15,
          averageGrade: 8.2
        },
        emotional: {
          emotionalAlerts: 12,
          resolvedAlerts: 9,
          averageRecoveryTime: '5 días',
          emotionalStability: 82,
          socialIntegration: 76,
          selfConfidence: 71
        },
        collaboration: {
          totalMessages: 156,
          responseRate: 94,
          averageResponseTime: '1.2 horas',
          activeCollaborations: 18,
          completedMeetings: 24,
          pendingActions: 7
        },
        interventions: {
          totalInterventions: 67,
          successfulInterventions: 52,
          successRate: 78,
          averageDuration: '3.2 semanas',
          mostEffectiveType: 'Técnicas de Mindfulness',
          leastEffectiveType: 'Terapia Grupal'
        },
        trends: {
          weeklyProgress: [
            { week: 'Sem 1', progress: 65 },
            { week: 'Sem 2', progress: 68 },
            { week: 'Sem 3', progress: 72 },
            { week: 'Sem 4', progress: 78 }
          ],
          monthlyInterventions: [
            { month: 'Ene', count: 12 },
            { month: 'Feb', count: 15 },
            { month: 'Mar', count: 18 },
            { month: 'Abr', count: 22 }
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
          <p className="text-slate-400">Cargando métricas compartidas...</p>
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
          <p className="text-slate-400">No se pudieron cargar las métricas compartidas.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
              <BarChart3 size={24} className="text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-purple-300">
                Métricas Compartidas
              </CardTitle>
              <p className="text-sm text-slate-400">
                Indicadores de rendimiento del ecosistema educativo
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
            <TabsTrigger value="collaboration" className="data-[state=active]:bg-purple-600">
              <Users size={16} className="mr-2" />
              Colaboración
            </TabsTrigger>
            <TabsTrigger value="interventions" className="data-[state=active]:bg-purple-600">
              <Target size={16} className="mr-2" />
              Intervenciones
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
                      <h4 className="font-semibold text-slate-200">Total Estudiantes</h4>
                      <p className="text-2xl font-bold text-blue-400">{metrics.overview.totalStudents}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Target size={24} className="text-green-400" />
                    <div>
                      <h4 className="font-semibold text-slate-200">Casos Activos</h4>
                      <p className="text-2xl font-bold text-green-400">{metrics.overview.activeCases}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={24} className="text-purple-400" />
                    <div>
                      <h4 className="font-semibold text-slate-200">Intervenciones Completadas</h4>
                      <p className="text-2xl font-bold text-purple-400">{metrics.overview.completedInterventions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock size={24} className="text-orange-400" />
                    <div>
                      <h4 className="font-semibold text-slate-200">Tiempo de Respuesta</h4>
                      <p className="text-2xl font-bold text-orange-400">{metrics.overview.averageResponseTime}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Star size={24} className="text-yellow-400" />
                    <div>
                      <h4 className="font-semibold text-slate-200">Satisfacción</h4>
                      <p className="text-2xl font-bold text-yellow-400">{metrics.overview.satisfactionScore}/5</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={24} className="text-cyan-400" />
                    <div>
                      <h4 className="font-semibold text-slate-200">Colaboración</h4>
                      <p className="text-2xl font-bold text-cyan-400">{metrics.overview.collaborationScore}/5</p>
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
                  <CardTitle className="text-lg text-slate-200">Progreso Académico</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Progreso Promedio</span>
                      <span className={`font-semibold ${getProgressColor(metrics.academic.averageProgress)}`}>
                        {metrics.academic.averageProgress}%
                      </span>
                    </div>
                    <Progress 
                      value={metrics.academic.averageProgress} 
                      className="h-2"
                      indicatorClassName={getProgressBarColor(metrics.academic.averageProgress)}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Tasa de Finalización</span>
                      <span className={`font-semibold ${getProgressColor(metrics.academic.completionRate)}`}>
                        {metrics.academic.completionRate}%
                      </span>
                    </div>
                    <Progress 
                      value={metrics.academic.completionRate} 
                      className="h-2"
                      indicatorClassName={getProgressBarColor(metrics.academic.completionRate)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-200">Distribución de Estudiantes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Estudiantes con Dificultades</span>
                    <Badge className="text-red-400 bg-red-500/20 border-red-500/30">
                      {metrics.academic.strugglingStudents}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Estudiantes Destacados</span>
                    <Badge className="text-green-400 bg-green-500/20 border-green-500/30">
                      {metrics.academic.excellingStudents}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Calificación Promedio</span>
                    <Badge className="text-blue-400 bg-blue-500/20 border-blue-500/30">
                      {metrics.academic.averageGrade}/10
                    </Badge>
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
                  <CardTitle className="text-lg text-slate-200">Alertas Emocionales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total de Alertas</span>
                    <Badge className="text-red-400 bg-red-500/20 border-red-500/30">
                      {metrics.emotional.emotionalAlerts}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Alertas Resueltas</span>
                    <Badge className="text-green-400 bg-green-500/20 border-green-500/30">
                      {metrics.emotional.resolvedAlerts}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Tiempo Promedio de Recuperación</span>
                    <Badge className="text-blue-400 bg-blue-500/20 border-blue-500/30">
                      {metrics.emotional.averageRecoveryTime}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

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
                    <Progress 
                      value={metrics.emotional.emotionalStability} 
                      className="h-2"
                      indicatorClassName={getProgressBarColor(metrics.emotional.emotionalStability)}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Integración Social</span>
                      <span className={`font-semibold ${getProgressColor(metrics.emotional.socialIntegration)}`}>
                        {metrics.emotional.socialIntegration}%
                      </span>
                    </div>
                    <Progress 
                      value={metrics.emotional.socialIntegration} 
                      className="h-2"
                      indicatorClassName={getProgressBarColor(metrics.emotional.socialIntegration)}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Autoestima</span>
                      <span className={`font-semibold ${getProgressColor(metrics.emotional.selfConfidence)}`}>
                        {metrics.emotional.selfConfidence}%
                      </span>
                    </div>
                    <Progress 
                      value={metrics.emotional.selfConfidence} 
                      className="h-2"
                      indicatorClassName={getProgressBarColor(metrics.emotional.selfConfidence)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Colaboración */}
          <TabsContent value="collaboration" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-200">Comunicación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total de Mensajes</span>
                    <Badge className="text-blue-400 bg-blue-500/20 border-blue-500/30">
                      {metrics.collaboration.totalMessages}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Tasa de Respuesta</span>
                    <Badge className="text-green-400 bg-green-500/20 border-green-500/30">
                      {metrics.collaboration.responseRate}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Tiempo Promedio de Respuesta</span>
                    <Badge className="text-orange-400 bg-orange-500/20 border-orange-500/30">
                      {metrics.collaboration.averageResponseTime}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-200">Actividad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Colaboraciones Activas</span>
                    <Badge className="text-purple-400 bg-purple-500/20 border-purple-500/30">
                      {metrics.collaboration.activeCollaborations}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Reuniones Completadas</span>
                    <Badge className="text-green-400 bg-green-500/20 border-green-500/30">
                      {metrics.collaboration.completedMeetings}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Acciones Pendientes</span>
                    <Badge className="text-yellow-400 bg-yellow-500/20 border-yellow-500/30">
                      {metrics.collaboration.pendingActions}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Intervenciones */}
          <TabsContent value="interventions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-200">Efectividad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total de Intervenciones</span>
                    <Badge className="text-blue-400 bg-blue-500/20 border-blue-500/30">
                      {metrics.interventions.totalInterventions}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Intervenciones Exitosas</span>
                    <Badge className="text-green-400 bg-green-500/20 border-green-500/30">
                      {metrics.interventions.successfulInterventions}
                    </Badge>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Tasa de Éxito</span>
                      <span className={`font-semibold ${getProgressColor(metrics.interventions.successRate)}`}>
                        {metrics.interventions.successRate}%
                      </span>
                    </div>
                    <Progress 
                      value={metrics.interventions.successRate} 
                      className="h-2"
                      indicatorClassName={getProgressBarColor(metrics.interventions.successRate)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-200">Análisis de Efectividad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Duración Promedio</span>
                    <Badge className="text-orange-400 bg-orange-500/20 border-orange-500/30">
                      {metrics.interventions.averageDuration}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Más Efectiva</span>
                      <Badge className="text-green-400 bg-green-500/20 border-green-500/30 text-xs">
                        {metrics.interventions.mostEffectiveType}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Menos Efectiva</span>
                      <Badge className="text-red-400 bg-red-500/20 border-red-500/30 text-xs">
                        {metrics.interventions.leastEffectiveType}
                      </Badge>
                    </div>
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

export default SharedMetricsDashboard;

