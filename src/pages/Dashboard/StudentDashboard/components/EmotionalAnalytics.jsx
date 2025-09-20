import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Heart, Brain, Smile, Frown, Meh, Activity, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const EmotionalAnalytics = () => {
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState({
    currentMood: 'positive',
    moodTrend: 'up',
    weeklyAverage: 7.2,
    emotionalStability: 85,
    stressLevel: 25,
    energyLevel: 78,
    recentPatterns: [],
    recommendations: []
  });

  // Simular datos de análisis emocional
  useEffect(() => {
    const mockAnalytics = {
      currentMood: 'positive',
      moodTrend: 'up',
      weeklyAverage: 7.2,
      emotionalStability: 85,
      stressLevel: 25,
      energyLevel: 78,
      recentPatterns: [
        { day: 'Lun', mood: 8, color: 'bg-green-500' },
        { day: 'Mar', mood: 7, color: 'bg-green-400' },
        { day: 'Mié', mood: 6, color: 'bg-yellow-500' },
        { day: 'Jue', mood: 8, color: 'bg-green-500' },
        { day: 'Vie', mood: 9, color: 'bg-green-600' },
        { day: 'Sáb', mood: 7, color: 'bg-green-400' },
        { day: 'Dom', mood: 8, color: 'bg-green-500' }
      ],
      recommendations: [
        'Continúa con tus rutinas matutinas, te están funcionando muy bien',
        'Considera hacer más ejercicio los fines de semana',
        'Tu nivel de estrés está bajo control, ¡excelente trabajo!'
      ]
    };

    setAnalytics(mockAnalytics);

    // Simular actualizaciones en tiempo real
    const interval = setInterval(() => {
      setAnalytics(prev => ({
        ...prev,
        emotionalStability: Math.min(100, prev.emotionalStability + Math.random() * 2 - 1),
        stressLevel: Math.max(0, prev.stressLevel + Math.random() * 4 - 2),
        energyLevel: Math.min(100, prev.energyLevel + Math.random() * 3 - 1.5)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'positive': return <Smile className="text-green-400" size={20} />;
      case 'negative': return <Frown className="text-red-400" size={20} />;
      case 'neutral': return <Meh className="text-yellow-400" size={20} />;
      default: return <Heart className="text-pink-400" size={20} />;
    }
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'positive': return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'negative': return 'from-red-500/20 to-rose-500/20 border-red-500/30';
      case 'neutral': return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      default: return 'from-pink-500/20 to-rose-500/20 border-pink-500/30';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 
      <TrendingUp className="text-green-400" size={16} /> : 
      <TrendingUp className="text-red-400" size={16} style={{ transform: 'rotate(180deg)' }} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-lg border border-pink-500/30">
              <Brain size={24} className="text-pink-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-pink-300">
                {t('studentDashboard.emotionalAnalytics.title', 'Análisis Emocional')}
              </CardTitle>
              <p className="text-sm text-slate-400">
                {t('studentDashboard.emotionalAnalytics.subtitle', 'Tu bienestar emocional en tiempo real')}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Estado actual del ánimo */}
          <div className={`p-4 rounded-lg bg-gradient-to-r ${getMoodColor(analytics.currentMood)} border`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getMoodIcon(analytics.currentMood)}
                <span className="font-semibold text-slate-200">
                  {t('studentDashboard.emotionalAnalytics.currentMood', 'Estado Actual')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(analytics.moodTrend)}
                <span className="text-sm text-slate-300">
                  {t('studentDashboard.emotionalAnalytics.trending', 'Tendencia')}
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-100">
              {analytics.weeklyAverage}/10
            </div>
            <div className="text-sm text-slate-300">
              {t('studentDashboard.emotionalAnalytics.weeklyAverage', 'Promedio semanal')}
            </div>
          </div>

          {/* Métricas clave */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
              <div className="flex items-center gap-2 mb-2">
                <Heart size={16} className="text-green-400" />
                <span className="text-sm font-medium text-slate-300">
                  {t('studentDashboard.emotionalAnalytics.stability', 'Estabilidad')}
                </span>
              </div>
              <div className="text-2xl font-bold text-green-300 mb-2">
                {Math.round(analytics.emotionalStability)}%
              </div>
              <Progress 
                value={analytics.emotionalStability} 
                className="h-2 bg-slate-600" 
                indicatorClassName="bg-green-500"
              />
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={16} className="text-orange-400" />
                <span className="text-sm font-medium text-slate-300">
                  {t('studentDashboard.emotionalAnalytics.stress', 'Estrés')}
                </span>
              </div>
              <div className="text-2xl font-bold text-orange-300 mb-2">
                {Math.round(analytics.stressLevel)}%
              </div>
              <Progress 
                value={analytics.stressLevel} 
                className="h-2 bg-slate-600" 
                indicatorClassName="bg-orange-500"
              />
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-blue-400" />
                <span className="text-sm font-medium text-slate-300">
                  {t('studentDashboard.emotionalAnalytics.energy', 'Energía')}
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-300 mb-2">
                {Math.round(analytics.energyLevel)}%
              </div>
              <Progress 
                value={analytics.energyLevel} 
                className="h-2 bg-slate-600" 
                indicatorClassName="bg-blue-500"
              />
            </div>
          </div>

          {/* Patrón semanal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Calendar size={16} className="text-purple-400" />
              {t('studentDashboard.emotionalAnalytics.weeklyPattern', 'Patrón Semanal')}
            </h4>
            <div className="flex items-end justify-between gap-2 h-20">
              {analytics.recentPatterns.map((pattern, index) => (
                <div key={index} className="flex flex-col items-center gap-1 flex-1">
                  <div 
                    className={`w-full rounded-t ${pattern.color} transition-all duration-300`}
                    style={{ height: `${pattern.mood * 8}px` }}
                  />
                  <span className="text-xs text-slate-400">{pattern.day}</span>
                  <span className="text-xs text-slate-300">{pattern.mood}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recomendaciones */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Brain size={16} className="text-cyan-400" />
              {t('studentDashboard.emotionalAnalytics.recommendations', 'Recomendaciones de Kary')}
            </h4>
            <div className="space-y-2">
              {analytics.recommendations.map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50"
                >
                  <p className="text-sm text-slate-300">{recommendation}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmotionalAnalytics;



