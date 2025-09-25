import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Shield,
  Activity,
  Calendar,
  Target,
  PieChart,
  LineChart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import unifiedDataService from '@/services/unifiedDataService';

const DataAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: {
      current: 0,
      previous: 0,
      growth: 0
    },
    activityMetrics: {
      totalActivities: 0,
      completedActivities: 0,
      completionRate: 0
    },
    engagementMetrics: {
      dailyActiveUsers: 0,
      weeklyActiveUsers: 0,
      monthlyActiveUsers: 0
    },
    supportMetrics: {
      totalPlans: 0,
      activePlans: 0,
      successRate: 0
    },
    timeRange: '7d'
  });

  const [chartData, setChartData] = useState({
    userActivity: [],
    activityCompletion: [],
    roleDistribution: [],
    engagementTrend: []
  });

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(fetchAnalyticsData, 60000); // Actualizar cada minuto
    return () => clearInterval(interval);
  }, [analyticsData.timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      // Obtener datos del servicio unificado
      const students = unifiedDataService.getStudents().data || [];
      const teachers = unifiedDataService.getTeachers().data || [];
      const psychopedagogues = unifiedDataService.getPsychopedagogues().data || [];
      const activities = unifiedDataService.getActivities().data || [];
      const supportPlans = unifiedDataService.getSupportPlans().data || [];

      const totalUsers = students.length + teachers.length + psychopedagogues.length;
      const completedActivities = activities.filter(a => a.status === 'completed').length;
      const activeSupportPlans = supportPlans.filter(p => p.status === 'active').length;

      // Simular datos de crecimiento
      const previousUsers = Math.floor(totalUsers * 0.85);
      const userGrowth = totalUsers - previousUsers;

      // Simular métricas de engagement
      const dailyActiveUsers = Math.floor(totalUsers * 0.6);
      const weeklyActiveUsers = Math.floor(totalUsers * 0.8);
      const monthlyActiveUsers = Math.floor(totalUsers * 0.95);

      setAnalyticsData({
        userGrowth: {
          current: totalUsers,
          previous: previousUsers,
          growth: userGrowth
        },
        activityMetrics: {
          totalActivities: activities.length,
          completedActivities,
          completionRate: activities.length > 0 ? (completedActivities / activities.length) * 100 : 0
        },
        engagementMetrics: {
          dailyActiveUsers,
          weeklyActiveUsers,
          monthlyActiveUsers
        },
        supportMetrics: {
          totalPlans: supportPlans.length,
          activePlans: activeSupportPlans,
          successRate: supportPlans.length > 0 ? (activeSupportPlans / supportPlans.length) * 100 : 0
        },
        timeRange: analyticsData.timeRange
      });

      // Generar datos de gráficos simulados
      generateChartData(totalUsers, activities.length, completedActivities);

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const generateChartData = (totalUsers, totalActivities, completedActivities) => {
    // Simular datos de actividad de usuarios por día
    const userActivity = Array.from({ length: 7 }, (_, i) => ({
      day: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { weekday: 'short' }),
      users: Math.floor(Math.random() * 50) + 20,
      activities: Math.floor(Math.random() * 30) + 10
    }));

    // Simular datos de finalización de actividades
    const activityCompletion = [
      { subject: 'Matemáticas', completed: Math.floor(Math.random() * 50) + 30, total: Math.floor(Math.random() * 20) + 50 },
      { subject: 'Lengua', completed: Math.floor(Math.random() * 40) + 25, total: Math.floor(Math.random() * 15) + 45 },
      { subject: 'Ciencias', completed: Math.floor(Math.random() * 35) + 20, total: Math.floor(Math.random() * 10) + 40 },
      { subject: 'Historia', completed: Math.floor(Math.random() * 30) + 15, total: Math.floor(Math.random() * 8) + 35 }
    ];

    // Distribución por roles
    const roleDistribution = [
      { role: 'Estudiantes', count: Math.floor(totalUsers * 0.6), color: 'bg-blue-500' },
      { role: 'Profesores', count: Math.floor(totalUsers * 0.2), color: 'bg-green-500' },
      { role: 'Psicopedagogos', count: Math.floor(totalUsers * 0.1), color: 'bg-purple-500' },
      { role: 'Padres', count: Math.floor(totalUsers * 0.08), color: 'bg-orange-500' },
      { role: 'Directivos', count: Math.floor(totalUsers * 0.02), color: 'bg-cyan-500' }
    ];

    // Tendencia de engagement
    const engagementTrend = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      engagement: Math.floor(Math.random() * 20) + 70
    }));

    setChartData({
      userActivity,
      activityCompletion,
      roleDistribution,
      engagementTrend
    });
  };

  const getGrowthColor = (growth) => {
    return growth >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-300">Crecimiento de Usuarios</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analyticsData.userGrowth.current}</div>
              <div className={`flex items-center gap-1 text-xs ${getGrowthColor(analyticsData.userGrowth.growth)}`}>
                {getGrowthIcon(analyticsData.userGrowth.growth)}
                <span>{Math.abs(analyticsData.userGrowth.growth)} usuarios</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-300">Tasa de Finalización</CardTitle>
              <Target className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analyticsData.activityMetrics.completionRate.toFixed(1)}%</div>
              <p className="text-xs text-green-400">
                {analyticsData.activityMetrics.completedActivities} de {analyticsData.activityMetrics.totalActivities} actividades
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">Usuarios Activos (DAU)</CardTitle>
              <Activity className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analyticsData.engagementMetrics.dailyActiveUsers}</div>
              <p className="text-xs text-purple-400">
                Hoy
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-orange-900/20 to-orange-800/20 border-orange-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-300">Tasa de Éxito</CardTitle>
              <Shield className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analyticsData.supportMetrics.successRate.toFixed(1)}%</div>
              <p className="text-xs text-orange-400">
                Planes de apoyo activos
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Selector de Rango de Tiempo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Rango de Tiempo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={analyticsData.timeRange} onValueChange={(value) => setAnalyticsData(prev => ({ ...prev, timeRange: value }))}>
              <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder="Seleccionar rango" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Últimas 24 horas</SelectItem>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
                <SelectItem value="90d">Últimos 90 días</SelectItem>
                <SelectItem value="1y">Último año</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </motion.div>

      {/* Gráficos de Análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad de Usuarios */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <LineChart className="w-5 h-5 text-blue-400" />
                Actividad de Usuarios (7 días)
              </CardTitle>
              <CardDescription className="text-slate-400">
                Usuarios activos y actividades por día
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chartData.userActivity.map((day, index) => (
                  <div key={day.day} className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">{day.day}</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <span className="text-slate-300 text-sm">{day.users} usuarios</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-slate-300 text-sm">{day.activities} actividades</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Finalización por Materia */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-400" />
                Finalización por Materia
              </CardTitle>
              <CardDescription className="text-slate-400">
                Actividades completadas por materia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chartData.activityCompletion.map((subject, index) => {
                  const percentage = (subject.completed / subject.total) * 100;
                  return (
                    <div key={subject.subject} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300 text-sm">{subject.subject}</span>
                        <span className="text-slate-400 text-sm">{subject.completed}/{subject.total}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="text-right">
                        <span className="text-slate-400 text-xs">{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Distribución por Roles y Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por Roles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-400" />
                Distribución por Roles
              </CardTitle>
              <CardDescription className="text-slate-400">
                Usuarios por tipo de rol
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chartData.roleDistribution.map((role, index) => {
                  const total = chartData.roleDistribution.reduce((sum, r) => sum + r.count, 0);
                  const percentage = (role.count / total) * 100;
                  return (
                    <div key={role.role} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${role.color}`}></div>
                        <span className="text-slate-300 text-sm">{role.role}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300 text-sm">{role.count}</span>
                        <Badge variant="secondary" className="bg-slate-700/50 text-slate-300">
                          {percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Métricas de Engagement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                Métricas de Engagement
              </CardTitle>
              <CardDescription className="text-slate-400">
                Usuarios activos por período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-slate-300">Diario (DAU)</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">{analyticsData.engagementMetrics.dailyActiveUsers}</div>
                    <div className="text-xs text-slate-400">usuarios</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300">Semanal (WAU)</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">{analyticsData.engagementMetrics.weeklyActiveUsers}</div>
                    <div className="text-xs text-slate-400">usuarios</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <span className="text-slate-300">Mensual (MAU)</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">{analyticsData.engagementMetrics.monthlyActiveUsers}</div>
                    <div className="text-xs text-slate-400">usuarios</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DataAnalytics;


