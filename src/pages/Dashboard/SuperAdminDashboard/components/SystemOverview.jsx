import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  Shield, 
  TrendingUp, 
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Database,
  Server,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import unifiedDataService from '@/services/unifiedDataService';

const SystemOverview = ({ systemStatus }) => {
  const [ecosystemData, setEcosystemData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalActivities: 0,
    completedActivities: 0,
    totalSupportPlans: 0,
    activeSupportPlans: 0,
    totalNotifications: 0,
    unreadNotifications: 0,
    systemHealth: 95,
    dataIntegrity: 98,
    performanceScore: 92
  });

  useEffect(() => {
    const fetchEcosystemData = async () => {
      try {
        // Obtener datos del servicio unificado
        const students = unifiedDataService.getStudents().data || [];
        const teachers = unifiedDataService.getTeachers().data || [];
        const psychopedagogues = unifiedDataService.getPsychopedagogues().data || [];
        const activities = unifiedDataService.getActivities().data || [];
        const supportPlans = unifiedDataService.getSupportPlans().data || [];
        const notifications = unifiedDataService.getNotifications('all').data || [];

        const totalUsers = students.length + teachers.length + psychopedagogues.length;
        const activeUsers = Math.floor(totalUsers * 0.75); // Simular usuarios activos
        const completedActivities = activities.filter(a => a.status === 'completed').length;
        const activeSupportPlans = supportPlans.filter(p => p.status === 'active').length;
        const unreadNotifications = notifications.filter(n => !n.read).length;

        setEcosystemData({
          totalUsers,
          activeUsers,
          totalActivities: activities.length,
          completedActivities,
          totalSupportPlans: supportPlans.length,
          activeSupportPlans,
          totalNotifications: notifications.length,
          unreadNotifications,
          systemHealth: Math.floor(Math.random() * 10) + 90,
          dataIntegrity: Math.floor(Math.random() * 5) + 95,
          performanceScore: Math.floor(Math.random() * 8) + 90
        });
      } catch (error) {
        console.error('Error fetching ecosystem data:', error);
      }
    };

    fetchEcosystemData();
    const interval = setInterval(fetchEcosystemData, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (score) => {
    if (score >= 95) return 'text-green-400';
    if (score >= 85) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getHealthBgColor = (score) => {
    if (score >= 95) return 'bg-green-500/10 border-green-500/20';
    if (score >= 85) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Métricas del Ecosistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-300">Usuarios Totales</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{ecosystemData.totalUsers}</div>
              <p className="text-xs text-blue-400">
                {ecosystemData.activeUsers} activos
              </p>
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
              <CardTitle className="text-sm font-medium text-green-300">Actividades</CardTitle>
              <BookOpen className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{ecosystemData.totalActivities}</div>
              <p className="text-xs text-green-400">
                {ecosystemData.completedActivities} completadas
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
              <CardTitle className="text-sm font-medium text-purple-300">Planes de Apoyo</CardTitle>
              <Shield className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{ecosystemData.totalSupportPlans}</div>
              <p className="text-xs text-purple-400">
                {ecosystemData.activeSupportPlans} activos
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
              <CardTitle className="text-sm font-medium text-orange-300">Notificaciones</CardTitle>
              <MessageSquare className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{ecosystemData.totalNotifications}</div>
              <p className="text-xs text-orange-400">
                {ecosystemData.unreadNotifications} sin leer
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Estado de Salud del Sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                Salud del Sistema
              </CardTitle>
              <CardDescription className="text-slate-400">
                Estado general del ecosistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Salud General</span>
                <Badge className={`${getHealthBgColor(ecosystemData.systemHealth)} ${getHealthColor(ecosystemData.systemHealth)}`}>
                  {ecosystemData.systemHealth}%
                </Badge>
              </div>
              <Progress value={ecosystemData.systemHealth} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Integridad de Datos</span>
                <Badge className={`${getHealthBgColor(ecosystemData.dataIntegrity)} ${getHealthColor(ecosystemData.dataIntegrity)}`}>
                  {ecosystemData.dataIntegrity}%
                </Badge>
              </div>
              <Progress value={ecosystemData.dataIntegrity} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Rendimiento</span>
                <Badge className={`${getHealthBgColor(ecosystemData.performanceScore)} ${getHealthColor(ecosystemData.performanceScore)}`}>
                  {ecosystemData.performanceScore}%
                </Badge>
              </div>
              <Progress value={ecosystemData.performanceScore} className="h-2" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-400" />
                Servicios Críticos
              </CardTitle>
              <CardDescription className="text-slate-400">
                Estado de servicios principales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(systemStatus.services).map(([service, status]) => (
                <div key={service} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      status === 'online' ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <span className="text-slate-300 capitalize">{service}</span>
                  </div>
                  <Badge className={
                    status === 'online' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }>
                    {status === 'online' ? 'En Línea' : 'Desconectado'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Actividad Reciente
              </CardTitle>
              <CardDescription className="text-slate-400">
                Últimas actividades del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <div className="flex-1">
                  <p className="text-sm text-slate-300">Sistema sincronizado</p>
                  <p className="text-xs text-slate-400">Hace 2 minutos</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-blue-400" />
                <div className="flex-1">
                  <p className="text-sm text-slate-300">Nuevo usuario registrado</p>
                  <p className="text-xs text-slate-400">Hace 5 minutos</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-green-400" />
                <div className="flex-1">
                  <p className="text-sm text-slate-300">Actividad completada</p>
                  <p className="text-xs text-slate-400">Hace 8 minutos</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-orange-400" />
                <div className="flex-1">
                  <p className="text-sm text-slate-300">Notificación enviada</p>
                  <p className="text-xs text-slate-400">Hace 12 minutos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Resumen de Roles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              Distribución de Usuarios por Rol
            </CardTitle>
            <CardDescription className="text-slate-400">
              Análisis de la distribución de usuarios en el ecosistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">Estudiantes</div>
                <div className="text-sm text-blue-400">Usuarios principales</div>
              </div>
              
              <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-500/30">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">Profesores</div>
                <div className="text-sm text-green-400">Educadores</div>
              </div>
              
              <div className="text-center p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                <Activity className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">Psicopedagogos</div>
                <div className="text-sm text-purple-400">Especialistas</div>
              </div>
              
              <div className="text-center p-4 bg-orange-900/20 rounded-lg border border-orange-500/30">
                <Clock className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">Padres</div>
                <div className="text-sm text-orange-400">Familiares</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SystemOverview;


