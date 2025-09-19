import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Minus, Users, GraduationCap, 
  Heart, Target, Zap, RefreshCw, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

const MetricCard = ({ title, value, change, changeType, icon: Icon, color, description, trend }) => {
  const getChangeIcon = () => {
    if (changeType === 'increase') return <TrendingUp className="w-4 h-4" />;
    if (changeType === 'decrease') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getChangeColor = () => {
    if (changeType === 'increase') return 'text-green-400';
    if (changeType === 'decrease') return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg ${color.replace('text-', 'bg-')}/20`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <Badge 
              variant="outline" 
              className={`${getChangeColor()} border-current text-xs`}
            >
              {getChangeIcon()}
              <span className="ml-1">{change}%</span>
            </Badge>
          </div>
          <CardTitle className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="text-3xl font-bold text-white">
              {value}
            </div>
            <p className="text-sm text-slate-400">
              {description}
            </p>
            {trend && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Progreso</span>
                  <span>{trend.current}%</span>
                </div>
                <Progress 
                  value={trend.current} 
                  className="h-2 bg-slate-700"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const RealTimeMetrics = ({ data }) => {
  const [isLive, setIsLive] = useState(true);

  const metrics = [
    {
      title: "Estudiantes Activos",
      value: data?.totalStudents || 0,
      change: 5.2,
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-400',
      description: 'Estudiantes matriculados actualmente',
      trend: { current: 94, target: 100 }
    },
    {
      title: "Progreso Académico",
      value: `${data?.institutionalMetrics?.studentProgress || 0}%`,
      change: 2.1,
      changeType: 'increase',
      icon: GraduationCap,
      color: 'text-green-400',
      description: 'Promedio de rendimiento general',
      trend: { current: data?.institutionalMetrics?.studentProgress || 0, target: 100 }
    },
    {
      title: "Bienestar Emocional",
      value: `${data?.institutionalMetrics?.parentEngagement || 0}%`,
      change: 1.8,
      changeType: 'increase',
      icon: Heart,
      color: 'text-pink-400',
      description: 'Nivel de satisfacción emocional',
      trend: { current: data?.institutionalMetrics?.parentEngagement || 0, target: 100 }
    },
    {
      title: "Asistencia",
      value: `${data?.institutionalMetrics?.attendanceRate || 0}%`,
      change: -0.5,
      changeType: 'decrease',
      icon: Target,
      color: 'text-orange-400',
      description: 'Tasa de asistencia promedio',
      trend: { current: data?.institutionalMetrics?.attendanceRate || 0, target: 100 }
    },
    {
      title: "Planes Activos",
      value: data?.activeSupportPlans || 0,
      change: 12.3,
      changeType: 'increase',
      icon: Zap,
      color: 'text-purple-400',
      description: 'Planes de apoyo en ejecución',
      trend: { current: 75, target: 100 }
    },
    {
      title: "Satisfacción Docente",
      value: `${data?.institutionalMetrics?.teacherSatisfaction || 0}%`,
      change: 3.2,
      changeType: 'increase',
      icon: Activity,
      color: 'text-cyan-400',
      description: 'Nivel de satisfacción del personal',
      trend: { current: data?.institutionalMetrics?.teacherSatisfaction || 0, target: 100 }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Métricas Institucionales en Tiempo Real
          </h2>
          <p className="text-slate-400 mt-1">
            Indicadores clave de rendimiento actualizados automáticamente
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            isLive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            <span>{isLive ? 'En Vivo' : 'Pausado'}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="border-slate-600 hover:bg-slate-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLive ? 'animate-spin' : ''}`} />
            {isLive ? 'Pausar' : 'Reanudar'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <MetricCard {...metric} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RealTimeMetrics;
