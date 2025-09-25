import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { toast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet-async';
import { 
  Activity, 
  Users, 
  Server, 
  Database, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  BarChart3,
  Settings,
  Shield,
  Zap,
  Globe,
  Cpu,
  HardDrive,
  Wifi,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RealTimeSync from '@/components/RealTimeSync';
import unifiedDataService from '@/services/unifiedDataService';
import notificationService from '@/services/notificationService';
import activityService from '@/services/activityService';

// Componentes del dashboard
import SystemOverview from './components/SystemOverview';
import UserManagement from './components/UserManagement';
import DataAnalytics from './components/DataAnalytics';
import PerformanceMetrics from './components/PerformanceMetrics';
import AlertCenter from './components/AlertCenter';
import SystemLogs from './components/SystemLogs';

const SuperAdminDashboard = () => {
  const { t } = useLanguage();
  const { userProfile } = useMockAuth();
  const [systemStatus, setSystemStatus] = useState({
    overall: 'healthy',
    services: {
      database: 'online',
      api: 'online',
      notifications: 'online',
      analytics: 'online',
      storage: 'online'
    },
    performance: {
      responseTime: 120,
      uptime: 99.9,
      activeUsers: 0,
      totalRequests: 0
    },
    alerts: {
      critical: 0,
      warning: 0,
      info: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [refreshInterval, setRefreshInterval] = useState(null);

  // Verificar permisos de super admin
  const isSuperAdmin = userProfile?.role === 'super_admin' || userProfile?.email?.includes('admin');

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-slate-900 to-red-900 flex items-center justify-center">
        <Card className="w-96 bg-red-900/20 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Acceso Denegado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300">
              No tienes permisos para acceder al Dashboard de Control Absoluto.
              Solo los Super Administradores pueden acceder a esta sección.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Función para obtener métricas del sistema
  const fetchSystemMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Simular obtención de métricas del sistema
      const metrics = {
        overall: 'healthy',
        services: {
          database: Math.random() > 0.1 ? 'online' : 'offline',
          api: Math.random() > 0.05 ? 'online' : 'offline',
          notifications: Math.random() > 0.15 ? 'online' : 'offline',
          analytics: Math.random() > 0.2 ? 'online' : 'offline',
          storage: Math.random() > 0.1 ? 'online' : 'offline'
        },
        performance: {
          responseTime: Math.floor(Math.random() * 200) + 50,
          uptime: 99.5 + Math.random() * 0.5,
          activeUsers: Math.floor(Math.random() * 1000) + 50,
          totalRequests: Math.floor(Math.random() * 10000) + 1000
        },
        alerts: {
          critical: Math.floor(Math.random() * 3),
          warning: Math.floor(Math.random() * 8) + 1,
          info: Math.floor(Math.random() * 15) + 5
        }
      };

      setSystemStatus(metrics);
      setLastUpdate(new Date());
      
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      toast({
        title: 'Error del Sistema',
        description: 'No se pudieron obtener las métricas del sistema',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Configurar actualización automática
  useEffect(() => {
    fetchSystemMetrics();
    
    const interval = setInterval(fetchSystemMetrics, 30000); // Actualizar cada 30 segundos
    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchSystemMetrics]);

  // Función para refrescar manualmente
  const handleRefresh = () => {
    fetchSystemMetrics();
    toast({
      title: 'Sistema Actualizado',
      description: 'Las métricas del sistema han sido actualizadas',
    });
  };

  // Función para obtener el color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
      case 'healthy':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'offline':
      case 'critical':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  // Función para obtener el icono del estado
  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
      case 'healthy':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'offline':
      case 'critical':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <RealTimeSync>
      <Helmet>
        <title>Dashboard de Control Absoluto - Kary</title>
        <meta name="description" content="Panel de control completo del ecosistema Kary" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Shield className="w-8 h-8 text-purple-400" />
                Dashboard de Control Absoluto
              </h1>
              <p className="text-slate-300 mt-2">
                Supervisión completa del ecosistema Kary en tiempo real
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusColor(systemStatus.overall)}`}>
                {getStatusIcon(systemStatus.overall)}
                <span className="text-sm font-medium">
                  {systemStatus.overall === 'healthy' ? 'Sistema Saludable' : 'Sistema con Problemas'}
                </span>
              </div>
              
              <Button
                onClick={handleRefresh}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </motion.div>

          {/* Métricas Principales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Usuarios Activos</CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{systemStatus.performance.activeUsers}</div>
                <p className="text-xs text-slate-400">En línea ahora</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Tiempo de Respuesta</CardTitle>
                <Zap className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{systemStatus.performance.responseTime}ms</div>
                <p className="text-xs text-slate-400">Promedio</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Uptime</CardTitle>
                <Server className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{systemStatus.performance.uptime.toFixed(2)}%</div>
                <p className="text-xs text-slate-400">Últimos 30 días</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Solicitudes</CardTitle>
                <Activity className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{systemStatus.performance.totalRequests.toLocaleString()}</div>
                <p className="text-xs text-slate-400">Hoy</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Estado de Servicios */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-blue-400" />
                  Estado de Servicios
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Monitoreo en tiempo real de todos los servicios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(systemStatus.services).map(([service, status]) => (
                  <div key={service} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-slate-300 capitalize">{service}</span>
                    </div>
                    <Badge className={getStatusColor(status)}>
                      {status === 'online' ? 'En Línea' : 'Desconectado'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  Centro de Alertas
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Alertas críticas del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <span className="text-slate-300">Críticas</span>
                  </div>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    {systemStatus.alerts.critical}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <span className="text-slate-300">Advertencias</span>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    {systemStatus.alerts.warning}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span className="text-slate-300">Informativas</span>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {systemStatus.alerts.info}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs de Control */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border-slate-700">
                <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
                  <Eye className="w-4 h-4 mr-2" />
                  Resumen
                </TabsTrigger>
                <TabsTrigger value="users" className="data-[state=active]:bg-purple-600">
                  <Users className="w-4 h-4 mr-2" />
                  Usuarios
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="performance" className="data-[state=active]:bg-purple-600">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Rendimiento
                </TabsTrigger>
                <TabsTrigger value="alerts" className="data-[state=active]:bg-purple-600">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Alertas
                </TabsTrigger>
                <TabsTrigger value="logs" className="data-[state=active]:bg-purple-600">
                  <Database className="w-4 h-4 mr-2" />
                  Logs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <SystemOverview systemStatus={systemStatus} />
              </TabsContent>

              <TabsContent value="users" className="mt-6">
                <UserManagement />
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <DataAnalytics />
              </TabsContent>

              <TabsContent value="performance" className="mt-6">
                <PerformanceMetrics systemStatus={systemStatus} />
              </TabsContent>

              <TabsContent value="alerts" className="mt-6">
                <AlertCenter />
              </TabsContent>

              <TabsContent value="logs" className="mt-6">
                <SystemLogs />
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Footer con información de última actualización */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-slate-400 text-sm"
          >
            Última actualización: {lastUpdate.toLocaleString()}
          </motion.div>
        </div>
      </div>
    </RealTimeSync>
  );
};

export default SuperAdminDashboard;


