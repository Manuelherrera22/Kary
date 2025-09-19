import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Target, 
  Award, 
  Clock, 
  Brain,
  Activity,
  CheckCircle,
  AlertTriangle,
  Star
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AdvancedAnalytics = () => {
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState({
    overview: {
      totalStudents: 24,
      activeStudents: 22,
      completedActivities: 156,
      pendingActivities: 8,
      averageEngagement: 87,
      classPerformance: 92
    },
    studentProgress: [
      { name: 'María García', progress: 95, engagement: 92, activities: 12, status: 'excellent' },
      { name: 'Carlos Rodríguez', progress: 78, engagement: 85, activities: 10, status: 'good' },
      { name: 'Ana López', progress: 88, engagement: 90, activities: 11, status: 'excellent' },
      { name: 'Luis Martínez', progress: 65, engagement: 70, activities: 8, status: 'needs_attention' },
      { name: 'Sofia Pérez', progress: 82, engagement: 88, activities: 9, status: 'good' }
    ],
    subjectPerformance: [
      { subject: 'Matemáticas', average: 85, trend: 'up', students: 20 },
      { subject: 'Ciencias', average: 78, trend: 'down', students: 18 },
      { subject: 'Lenguaje', average: 92, trend: 'up', students: 22 },
      { subject: 'Historia', average: 88, trend: 'stable', students: 15 }
    ],
    emotionalInsights: {
      positive: 68,
      neutral: 25,
      negative: 7,
      trends: [
        { day: 'Lun', positive: 70, neutral: 20, negative: 10 },
        { day: 'Mar', positive: 65, neutral: 25, negative: 10 },
        { day: 'Mié', positive: 72, neutral: 22, negative: 6 },
        { day: 'Jue', positive: 68, neutral: 28, negative: 4 },
        { day: 'Vie', positive: 75, neutral: 20, negative: 5 }
      ]
    },
    aiRecommendations: [
      {
        type: 'student',
        priority: 'high',
        title: 'Luis Martínez necesita apoyo adicional',
        description: 'Su rendimiento ha bajado 15% esta semana. Considera actividades más interactivas.',
        action: 'Ver perfil del estudiante'
      },
      {
        type: 'subject',
        priority: 'medium',
        title: 'Ciencias requiere atención',
        description: 'El promedio de la clase ha bajado. Revisa los recursos asignados.',
        action: 'Revisar materiales'
      },
      {
        type: 'engagement',
        priority: 'low',
        title: 'Excelente participación en Lenguaje',
        description: 'Los estudiantes están muy motivados. Considera expandir el contenido.',
        action: 'Añadir más actividades'
      }
    ]
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedView, setSelectedView] = useState('overview');

  // Simular actualizaciones en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(prev => ({
        ...prev,
        overview: {
          ...prev.overview,
          averageEngagement: Math.min(100, prev.overview.averageEngagement + (Math.random() - 0.5) * 2),
          classPerformance: Math.min(100, prev.overview.classPerformance + (Math.random() - 0.5) * 1)
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'good': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'needs_attention': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 
      <TrendingUp className="text-green-400" size={16} /> : 
      trend === 'down' ? 
      <TrendingUp className="text-red-400" size={16} style={{ transform: 'rotate(180deg)' }} /> :
      <Activity className="text-gray-400" size={16} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full space-y-6"
    >
      {/* Header con controles */}
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
                <BarChart3 size={24} className="text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-blue-300">
                  {t('teacherDashboard.analytics.title', 'Analytics Avanzados')}
                </CardTitle>
                <p className="text-sm text-slate-400">
                  {t('teacherDashboard.analytics.subtitle', 'Insights y métricas en tiempo real')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={selectedTimeframe === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeframe('week')}
                className="text-xs"
              >
                {t('common.week', 'Semana')}
              </Button>
              <Button
                variant={selectedTimeframe === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeframe('month')}
                className="text-xs"
              >
                {t('common.month', 'Mes')}
              </Button>
              <Button
                variant={selectedTimeframe === 'year' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeframe('year')}
                className="text-xs"
              >
                {t('common.year', 'Año')}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 text-slate-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-300 font-medium">
                  {t('teacherDashboard.analytics.totalStudents', 'Total Estudiantes')}
                </p>
                <p className="text-2xl font-bold text-green-400">
                  {analytics.overview.totalStudents}
                </p>
              </div>
              <Users size={24} className="text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30 text-slate-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300 font-medium">
                  {t('teacherDashboard.analytics.engagement', 'Engagement')}
                </p>
                <p className="text-2xl font-bold text-blue-400">
                  {Math.round(analytics.overview.averageEngagement)}%
                </p>
              </div>
              <Target size={24} className="text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30 text-slate-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300 font-medium">
                  {t('teacherDashboard.analytics.performance', 'Rendimiento')}
                </p>
                <p className="text-2xl font-bold text-purple-400">
                  {Math.round(analytics.overview.classPerformance)}%
                </p>
              </div>
              <Award size={24} className="text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30 text-slate-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-300 font-medium">
                  {t('teacherDashboard.analytics.activities', 'Actividades')}
                </p>
                <p className="text-2xl font-bold text-orange-400">
                  {analytics.overview.completedActivities}
                </p>
              </div>
              <BookOpen size={24} className="text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progreso de estudiantes */}
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-200 flex items-center gap-2">
            <Users size={20} className="text-blue-400" />
            {t('teacherDashboard.analytics.studentProgress', 'Progreso de Estudiantes')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.studentProgress.map((student, index) => (
              <motion.div
                key={student.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-400">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">{student.name}</h4>
                      <p className="text-sm text-slate-400">
                        {student.activities} {t('teacherDashboard.analytics.activitiesCompleted', 'actividades completadas')}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(student.status)}>
                    {t(`teacherDashboard.analytics.status.${student.status}`, student.status)}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-sm text-slate-300 mb-1">
                      <span>{t('teacherDashboard.analytics.progress', 'Progreso')}</span>
                      <span>{student.progress}%</span>
                    </div>
                    <Progress value={student.progress} className="h-2 bg-slate-600" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-slate-300 mb-1">
                      <span>{t('teacherDashboard.analytics.engagement', 'Engagement')}</span>
                      <span>{student.engagement}%</span>
                    </div>
                    <Progress value={student.engagement} className="h-2 bg-slate-600" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rendimiento por materias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-200 flex items-center gap-2">
              <BookOpen size={20} className="text-green-400" />
              {t('teacherDashboard.analytics.subjectPerformance', 'Rendimiento por Materias')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.subjectPerformance.map((subject, index) => (
                <motion.div
                  key={subject.subject}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-slate-700/30 border border-slate-600/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-200">{subject.subject}</h4>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(subject.trend)}
                      <span className="text-sm font-bold text-slate-300">{subject.average}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>{subject.students} {t('teacherDashboard.analytics.students', 'estudiantes')}</span>
                    <span>{subject.average}% {t('teacherDashboard.analytics.average', 'promedio')}</span>
                  </div>
                  <Progress value={subject.average} className="h-2 bg-slate-600" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights emocionales */}
        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-200 flex items-center gap-2">
              <Brain size={20} className="text-pink-400" />
              {t('teacherDashboard.analytics.emotionalInsights', 'Insights Emocionales')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400 mb-2">
                  {analytics.emotionalInsights.positive}%
                </div>
                <p className="text-sm text-slate-400">
                  {t('teacherDashboard.analytics.positiveEmotions', 'Emociones Positivas')}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">Positivas</span>
                  <span className="text-slate-300">{analytics.emotionalInsights.positive}%</span>
                </div>
                <Progress value={analytics.emotionalInsights.positive} className="h-2 bg-slate-600" />
                
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-400">Neutrales</span>
                  <span className="text-slate-300">{analytics.emotionalInsights.neutral}%</span>
                </div>
                <Progress value={analytics.emotionalInsights.neutral} className="h-2 bg-slate-600" />
                
                <div className="flex justify-between text-sm">
                  <span className="text-red-400">Negativas</span>
                  <span className="text-slate-300">{analytics.emotionalInsights.negative}%</span>
                </div>
                <Progress value={analytics.emotionalInsights.negative} className="h-2 bg-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendaciones de IA */}
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-200 flex items-center gap-2">
            <Star size={20} className="text-yellow-400" />
            {t('teacherDashboard.analytics.aiRecommendations', 'Recomendaciones de IA')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.aiRecommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-slate-200">{recommendation.title}</h4>
                      <Badge className={getPriorityColor(recommendation.priority)}>
                        {t(`teacherDashboard.analytics.priority.${recommendation.priority}`, recommendation.priority)}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">{recommendation.description}</p>
                    <Button size="sm" variant="outline" className="text-xs">
                      {recommendation.action}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdvancedAnalytics;


