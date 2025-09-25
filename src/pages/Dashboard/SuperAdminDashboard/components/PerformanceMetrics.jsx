import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Server, 
  Database, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Clock, 
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const PerformanceMetrics = ({ systemStatus }) => {
  const [performanceData, setPerformanceData] = useState({
    responseTime: {
      current: 120,
      average: 115,
      peak: 250,
      trend: 'stable'
    },
    throughput: {
      requestsPerSecond: 45,
      peakRequests: 120,
      averageRequests: 38
    },
    resourceUsage: {
      cpu: 45,
      memory: 62,
      disk: 38,
      network: 25
    },
    errorRates: {
      http4xx: 2.1,
      http5xx: 0.3,
      database: 0.1,
      api: 0.8
    },
    uptime: {
      current: 99.9,
      last30Days: 99.8,
      lastIncident: '2024-01-15'
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simular cambios en las métricas de rendimiento
      setPerformanceData(prev => ({
        ...prev,
        responseTime: {
          ...prev.responseTime,
          current: Math.floor(Math.random() * 100) + 80,
          average: Math.floor(Math.random() * 50) + 100
        },
        throughput: {
          ...prev.throughput,
          requestsPerSecond: Math.floor(Math.random() * 30) + 30
        },
        resourceUsage: {
          cpu: Math.floor(Math.random() * 30) + 30,
          memory: Math.floor(Math.random() * 20) + 50,
          disk: Math.floor(Math.random() * 15) + 30,
          network: Math.floor(Math.random() * 20) + 15
        }
      }));
    }, 5000); // Actualizar cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const getPerformanceColor = (value, thresholds) => {
    if (value <= thresholds.good) return 'text-green-400';
    if (value <= thresholds.warning) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPerformanceBgColor = (value, thresholds) => {
    if (value <= thresholds.good) return 'bg-green-500/10 border-green-500/20';
    if (value <= thresholds.warning) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default:
        return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Métricas de Rendimiento Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-300">Tiempo de Respuesta</CardTitle>
              <Zap className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{performanceData.responseTime.current}ms</div>
              <p className="text-xs text-blue-400">
                Promedio: {performanceData.responseTime.average}ms
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
              <CardTitle className="text-sm font-medium text-green-300">Throughput</CardTitle>
              <Server className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{performanceData.throughput.requestsPerSecond}</div>
              <p className="text-xs text-green-400">
                req/s actuales
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
              <CardTitle className="text-sm font-medium text-purple-300">Uptime</CardTitle>
              <Clock className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{performanceData.uptime.current}%</div>
              <p className="text-xs text-purple-400">
                Últimos 30 días
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
              <CardTitle className="text-sm font-medium text-orange-300">Errores 5xx</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{performanceData.errorRates.http5xx}%</div>
              <p className="text-xs text-orange-400">
                Tasa de error
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Uso de Recursos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Uso de Recursos del Sistema
            </CardTitle>
            <CardDescription className="text-slate-400">
              Monitoreo en tiempo real del uso de recursos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CPU */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-300">CPU</span>
                  </div>
                  <Badge className={getPerformanceBgColor(performanceData.resourceUsage.cpu, { good: 60, warning: 80 })}>
                    {performanceData.resourceUsage.cpu}%
                  </Badge>
                </div>
                <Progress value={performanceData.resourceUsage.cpu} className="h-2" />
              </div>

              {/* Memoria */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300">Memoria</span>
                  </div>
                  <Badge className={getPerformanceBgColor(performanceData.resourceUsage.memory, { good: 70, warning: 85 })}>
                    {performanceData.resourceUsage.memory}%
                  </Badge>
                </div>
                <Progress value={performanceData.resourceUsage.memory} className="h-2" />
              </div>

              {/* Disco */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-purple-400" />
                    <span className="text-slate-300">Disco</span>
                  </div>
                  <Badge className={getPerformanceBgColor(performanceData.resourceUsage.disk, { good: 70, warning: 85 })}>
                    {performanceData.resourceUsage.disk}%
                  </Badge>
                </div>
                <Progress value={performanceData.resourceUsage.disk} className="h-2" />
              </div>

              {/* Red */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-orange-400" />
                    <span className="text-slate-300">Red</span>
                  </div>
                  <Badge className={getPerformanceBgColor(performanceData.resourceUsage.network, { good: 50, warning: 75 })}>
                    {performanceData.resourceUsage.network}%
                  </Badge>
                </div>
                <Progress value={performanceData.resourceUsage.network} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Métricas Detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tiempo de Respuesta Detallado */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Análisis de Tiempo de Respuesta
              </CardTitle>
              <CardDescription className="text-slate-400">
                Métricas detalladas de rendimiento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Tiempo Actual</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{performanceData.responseTime.current}ms</span>
                  {getTrendIcon(performanceData.responseTime.trend)}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Promedio (24h)</span>
                <span className="text-slate-300">{performanceData.responseTime.average}ms</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Pico Máximo</span>
                <span className="text-red-400">{performanceData.responseTime.peak}ms</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Percentil 95</span>
                <span className="text-yellow-400">{Math.floor(performanceData.responseTime.average * 1.5)}ms</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tasas de Error */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Tasas de Error
              </CardTitle>
              <CardDescription className="text-slate-400">
                Monitoreo de errores del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Errores HTTP 4xx</span>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  {performanceData.errorRates.http4xx}%
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Errores HTTP 5xx</span>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  {performanceData.errorRates.http5xx}%
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Errores de Base de Datos</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  {performanceData.errorRates.database}%
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Errores de API</span>
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  {performanceData.errorRates.api}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Estado de Servicios */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-green-400" />
              Estado de Servicios Críticos
            </CardTitle>
            <CardDescription className="text-slate-400">
              Monitoreo de servicios principales del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(systemStatus.services).map(([service, status]) => (
                <div key={service} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
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
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PerformanceMetrics;


