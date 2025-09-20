import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Filter,
  Download,
  Eye,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ProgressTrackingMatrix = ({ students, activities }) => {
  const { t } = useLanguage();
  const [selectedMetric, setSelectedMetric] = useState('completion_rate');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [viewMode, setViewMode] = useState('grid'); // grid, list, chart

  const metrics = [
    { value: 'completion_rate', label: t('teacherDashboard.metrics.completionRate', 'Tasa de Completado'), icon: CheckCircle },
    { value: 'average_score', label: t('teacherDashboard.metrics.averageScore', 'Puntuación Promedio'), icon: Target },
    { value: 'time_spent', label: t('teacherDashboard.metrics.timeSpent', 'Tiempo Invertido'), icon: Clock },
    { value: 'engagement', label: t('teacherDashboard.metrics.engagement', 'Compromiso'), icon: TrendingUp }
  ];

  const periods = [
    { value: 'week', label: t('teacherDashboard.periods.week', 'Esta Semana') },
    { value: 'month', label: t('teacherDashboard.periods.month', 'Este Mes') },
    { value: 'quarter', label: t('teacherDashboard.periods.quarter', 'Este Trimestre') },
    { value: 'all', label: t('teacherDashboard.periods.all', 'Todo el Tiempo') }
  ];

  const progressData = useMemo(() => {
    return students.map(student => {
      const studentActivities = activities.filter(activity => activity.student_id === student.id);
      const completedActivities = studentActivities.filter(activity => activity.status === 'completed');
      
      let metricValue = 0;
      let trend = 'stable';
      let trendValue = 0;
      
      switch (selectedMetric) {
        case 'completion_rate':
          metricValue = studentActivities.length > 0 ? (completedActivities.length / studentActivities.length) * 100 : 0;
          // Simular tendencia
          trendValue = Math.random() > 0.5 ? Math.random() * 10 : -Math.random() * 10;
          break;
        case 'average_score':
          metricValue = Math.random() * 40 + 60; // 60-100
          trendValue = Math.random() > 0.5 ? Math.random() * 5 : -Math.random() * 5;
          break;
        case 'time_spent':
          metricValue = Math.random() * 120 + 30; // 30-150 minutes
          trendValue = Math.random() > 0.5 ? Math.random() * 20 : -Math.random() * 20;
          break;
        case 'engagement':
          metricValue = Math.random() * 30 + 70; // 70-100
          trendValue = Math.random() > 0.5 ? Math.random() * 8 : -Math.random() * 8;
          break;
      }
      
      if (trendValue > 2) trend = 'up';
      else if (trendValue < -2) trend = 'down';
      
      return {
        ...student,
        metricValue: Math.round(metricValue),
        trend,
        trendValue: Math.round(trendValue),
        activitiesCount: studentActivities.length,
        completedCount: completedActivities.length
      };
    });
  }, [students, activities, selectedMetric]);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getMetricColor = (value, metric) => {
    switch (metric) {
      case 'completion_rate':
        if (value >= 80) return 'text-green-400';
        if (value >= 60) return 'text-yellow-400';
        return 'text-red-400';
      case 'average_score':
        if (value >= 85) return 'text-green-400';
        if (value >= 70) return 'text-yellow-400';
        return 'text-red-400';
      case 'time_spent':
        if (value >= 90) return 'text-green-400';
        if (value >= 60) return 'text-yellow-400';
        return 'text-red-400';
      case 'engagement':
        if (value >= 85) return 'text-green-400';
        if (value >= 70) return 'text-yellow-400';
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getMetricSuffix = (metric) => {
    switch (metric) {
      case 'completion_rate': return '%';
      case 'average_score': return '/100';
      case 'time_spent': return ' min';
      case 'engagement': return '%';
      default: return '';
    }
  };

  const sortedData = [...progressData].sort((a, b) => b.metricValue - a.metricValue);

  return (
    <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-green-500 to-blue-500" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      <CardHeader className="relative pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/30">
              <BarChart3 size={24} className="text-green-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-green-300">
                {t('teacherDashboard.progressMatrix.title', 'Matriz de Progreso')}
              </CardTitle>
              <p className="text-sm text-slate-400">
                {t('teacherDashboard.progressMatrix.subtitle', 'Seguimiento detallado del rendimiento de tus estudiantes')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-slate-300 border-slate-600 hover:bg-slate-700"
            >
              <Download size={16} className="mr-1" />
              {t('common.export', 'Exportar')}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <label className="text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2 block">
              {t('teacherDashboard.progressMatrix.metric', 'Métrica')}
            </label>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-200 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <SelectItem key={metric.value} value={metric.value}>
                      <div className="flex items-center gap-2">
                        <Icon size={12} className="sm:hidden" />
                        <Icon size={14} className="hidden sm:block" />
                        <span className="text-xs sm:text-sm">{metric.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-0">
            <label className="text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2 block">
              {t('teacherDashboard.progressMatrix.period', 'Período')}
            </label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-200 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    <span className="text-xs sm:text-sm">{period.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Progress Matrix */}
        <div className="space-y-2 sm:space-y-3">
          {sortedData.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-slate-700/30 rounded-lg p-3 sm:p-4 border border-slate-600/50 hover:bg-slate-700/50 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="text-base sm:text-lg font-bold text-slate-300 w-6 sm:w-8 flex-shrink-0">
                    #{index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-slate-200 text-sm sm:text-base truncate">{student.full_name}</h4>
                    <p className="text-xs sm:text-sm text-slate-400 truncate">{student.grade}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-6">
                  <div className="text-center">
                    <div className={`text-xl sm:text-2xl font-bold ${getMetricColor(student.metricValue, selectedMetric)}`}>
                      {student.metricValue}{getMetricSuffix(selectedMetric)}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {metrics.find(m => m.value === selectedMetric)?.label}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 sm:gap-2">
                    {getTrendIcon(student.trend)}
                    <span className={`text-xs sm:text-sm font-medium ${getTrendColor(student.trend)}`}>
                      {student.trendValue > 0 ? '+' : ''}{student.trendValue}
                    </span>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-semibold text-slate-300">
                      {student.completedCount}/{student.activitiesCount}
                    </div>
                    <div className="text-xs text-slate-400">
                      {t('teacherDashboard.progressMatrix.activities', 'Actividades')}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-slate-200 p-1 sm:p-2 flex-shrink-0"
                  >
                    <Eye size={14} className="sm:hidden" />
                    <Eye size={16} className="hidden sm:block" />
                  </Button>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-2 sm:mt-3">
                <div className="w-full bg-slate-600 rounded-full h-1.5 sm:h-2">
                  <div
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
                      selectedMetric === 'completion_rate' 
                        ? student.metricValue >= 80 ? 'bg-green-500' : student.metricValue >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(student.metricValue, 100)}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-slate-700/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {progressData.length > 0 
                ? Math.round(progressData.reduce((acc, s) => acc + s.metricValue, 0) / progressData.length)
                : 0}
            </div>
            <div className="text-sm text-slate-400">
              {t('teacherDashboard.progressMatrix.average', 'Promedio')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {progressData.filter(s => s.trend === 'up').length}
            </div>
            <div className="text-sm text-slate-400">
              {t('teacherDashboard.progressMatrix.improving', 'Mejorando')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {progressData.filter(s => s.trend === 'down').length}
            </div>
            <div className="text-sm text-slate-400">
              {t('teacherDashboard.progressMatrix.declining', 'Declinando')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {progressData.length}
            </div>
            <div className="text-sm text-slate-400">
              {t('teacherDashboard.progressMatrix.totalStudents', 'Total Estudiantes')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTrackingMatrix;




