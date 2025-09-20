import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, GraduationCap, Heart, Brain, MessageSquare, 
  BarChart3, Activity, Shield, Target, Zap, 
  ArrowRight, RefreshCw, Eye, Settings, 
  TrendingUp, AlertTriangle, CheckCircle, Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const RoleCard = ({ role, data, index }) => {
  const getRoleIcon = (roleType) => {
    switch (roleType) {
      case 'student': return <GraduationCap className="w-6 h-6" />;
      case 'teacher': return <Users className="w-6 h-6" />;
      case 'psychopedagogue': return <Heart className="w-6 h-6" />;
      case 'parent': return <Brain className="w-6 h-6" />;
      case 'directive': return <Target className="w-6 h-6" />;
      default: return <Activity className="w-6 h-6" />;
    }
  };

  const getRoleColor = (roleType) => {
    switch (roleType) {
      case 'student': return 'text-blue-400 bg-blue-500/20';
      case 'teacher': return 'text-green-400 bg-green-500/20';
      case 'psychopedagogue': return 'text-pink-400 bg-pink-500/20';
      case 'parent': return 'text-purple-400 bg-purple-500/20';
      case 'directive': return 'text-orange-400 bg-orange-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/60 hover:border-slate-600/80 transition-all duration-300 group-hover:shadow-xl">
        <CardHeader className="pb-3 p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${getRoleColor(role.type).split(' ')[1]}`}>
                {React.cloneElement(getRoleIcon(role.type), { className: "w-4 h-4 sm:w-6 sm:h-6" })}
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base sm:text-lg font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                  {role.name}
                </CardTitle>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {role.description}
                </p>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`${getRoleColor(role.type)} border-current text-xs flex-shrink-0`}
            >
              {data.activeUsers} activos
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 p-3 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-white">{data.totalUsers}</div>
                <div className="text-xs text-slate-500">Total Usuarios</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-green-400">{data.engagement}%</div>
                <div className="text-xs text-slate-500">Compromiso</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Actividad Reciente</span>
                <span>{data.recentActivity} acciones</span>
              </div>
              <Progress 
                value={data.engagement} 
                className="h-1.5 sm:h-2 bg-slate-700"
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-medium text-slate-200">Métricas Clave</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Progreso:</span>
                  <span className="text-green-400">{data.progress}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Alertas:</span>
                  <span className="text-orange-400">{data.alerts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tareas:</span>
                  <span className="text-blue-400">{data.tasks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Completadas:</span>
                  <span className="text-purple-400">{data.completed}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
              <div className="flex items-center space-x-2">
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${data.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`} />
                <span className="text-xs text-slate-500">
                  {data.status === 'online' ? 'En línea' : 'Desconectado'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 hover:text-blue-300 text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Ver Dashboard</span>
                <span className="sm:hidden">Ver</span>
                <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'login': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'activity': return <Activity className="w-4 h-4 text-blue-400" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-purple-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Hace un momento';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      <h3 className="text-base sm:text-lg font-semibold text-slate-200 mb-3 sm:mb-4">Actividad del Ecosistema</h3>
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex-shrink-0 mt-0.5 sm:mt-1">
            {React.cloneElement(getActivityIcon(activity.type), { className: "w-3 h-3 sm:w-4 sm:h-4" })}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <span className="font-medium text-slate-200">{activity.user}</span>
              {' '}{activity.action}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {formatTime(activity.timestamp)} • {activity.role}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const EcosystemIntegration = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const roles = [
    {
      type: 'student',
      name: 'Estudiantes',
      description: 'Panel de estudiantes con progreso académico y emocional',
      data: {
        totalUsers: 150,
        activeUsers: 142,
        engagement: 89,
        recentActivity: 45,
        progress: 85,
        alerts: 3,
        tasks: 12,
        completed: 8,
        status: 'online'
      }
    },
    {
      type: 'teacher',
      name: 'Docentes',
      description: 'Dashboard de docentes con gestión de clases y estudiantes',
      data: {
        totalUsers: 25,
        activeUsers: 23,
        engagement: 92,
        recentActivity: 38,
        progress: 78,
        alerts: 1,
        tasks: 15,
        completed: 12,
        status: 'online'
      }
    },
    {
      type: 'psychopedagogue',
      name: 'Psicopedagogos',
      description: 'Centro de apoyo psicopedagógico y planes de intervención',
      data: {
        totalUsers: 8,
        activeUsers: 7,
        engagement: 95,
        recentActivity: 28,
        progress: 92,
        alerts: 2,
        tasks: 6,
        completed: 5,
        status: 'online'
      }
    },
    {
      type: 'parent',
      name: 'Acudientes',
      description: 'Panel de padres con seguimiento del progreso de sus hijos',
      data: {
        totalUsers: 120,
        activeUsers: 98,
        engagement: 76,
        recentActivity: 52,
        progress: 68,
        alerts: 5,
        tasks: 8,
        completed: 6,
        status: 'online'
      }
    }
  ];

  const activities = [
    {
      id: 1,
      user: 'María García',
      action: 'completó una actividad de matemáticas',
      type: 'activity',
      role: 'Estudiante',
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      user: 'Prof. Carlos López',
      action: 'registró una observación en el sistema',
      type: 'activity',
      role: 'Docente',
      timestamp: new Date(Date.now() - 300000).toISOString()
    },
    {
      id: 3,
      user: 'Ana Rodríguez',
      action: 'revisó el progreso de su hija',
      type: 'activity',
      role: 'Acudiente',
      timestamp: new Date(Date.now() - 600000).toISOString()
    },
    {
      id: 4,
      user: 'Psic. María González',
      action: 'creó un nuevo plan de apoyo',
      type: 'activity',
      role: 'Psicopedagoga',
      timestamp: new Date(Date.now() - 900000).toISOString()
    },
    {
      id: 5,
      user: 'Sistema',
      action: 'generó una alerta de riesgo académico',
      type: 'alert',
      role: 'IA',
      timestamp: new Date(Date.now() - 1200000).toISOString()
    }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Integración del Ecosistema
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-1 leading-relaxed">
            Vista unificada de todos los roles y su interacción en la plataforma
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="border-slate-600 hover:bg-slate-700 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
          >
            <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Actualizando...' : 'Actualizar'}</span>
            <span className="sm:hidden">{isRefreshing ? '...' : '↻'}</span>
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
            <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Configurar</span>
            <span className="sm:hidden">Config</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {roles.map((role, index) => (
              <RoleCard key={role.type} role={role} data={role.data} index={index} />
            ))}
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/60">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-base sm:text-lg text-slate-200 flex items-center">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-400" />
                Resumen del Ecosistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-blue-400">323</div>
                  <div className="text-xs text-slate-500">Total Usuarios</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-green-400">270</div>
                  <div className="text-xs text-slate-500">Activos Ahora</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Compromiso General</span>
                  <span>88%</span>
                </div>
                <Progress value={88} className="h-1.5 sm:h-2 bg-slate-700" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Alertas Activas</span>
                  <span>11</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Tareas Pendientes</span>
                  <span>41</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Completadas Hoy</span>
                  <span>31</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/60">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-base sm:text-lg text-slate-200 flex items-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-400" />
                Tendencias
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-slate-300 truncate">Progreso Académico</span>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-green-400">+12%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-slate-300 truncate">Bienestar Emocional</span>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-green-400">+8%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-slate-300 truncate">Participación Familiar</span>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-green-400">+15%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-slate-300 truncate">Eficiencia Docente</span>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-green-400">+6%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/60">
        <CardContent className="p-3 sm:p-6">
          <ActivityFeed activities={activities} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EcosystemIntegration;

