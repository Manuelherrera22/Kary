import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Award, 
  Target, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Crown,
  Gem,
  Zap,
  Heart,
  Brain,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const TeacherGamification = () => {
  const { t } = useLanguage();
  const [teacherStats, setTeacherStats] = useState({
    level: 8,
    xp: 2450,
    nextLevelXP: 3000,
    totalXP: 12450,
    streak: 12,
    achievements: [],
    weeklyGoals: [],
    leaderboard: [],
    badges: []
  });

  const [showCelebration, setShowCelebration] = useState(false);
  const [recentAchievement, setRecentAchievement] = useState(null);

  // Simular datos de gamificación
  useEffect(() => {
    const mockStats = {
      level: 8,
      xp: 2450,
      nextLevelXP: 3000,
      totalXP: 12450,
      streak: 12,
      achievements: [
        { id: 1, name: 'Primer Día', description: 'Completaste tu primer día de enseñanza', icon: Star, earned: true, rarity: 'common', xp: 50 },
        { id: 2, name: 'Mentor Experto', description: 'Ayudaste a 10 estudiantes a mejorar', icon: Users, earned: true, rarity: 'rare', xp: 200 },
        { id: 3, name: 'Creador de Contenido', description: 'Creaste 50 actividades personalizadas', icon: BookOpen, earned: true, rarity: 'epic', xp: 500 },
        { id: 4, name: 'Analista de Datos', description: 'Generaste 25 reportes de analytics', icon: TrendingUp, earned: true, rarity: 'rare', xp: 300 },
        { id: 5, name: 'Maestro Consistente', description: '20 días consecutivos de actividad', icon: Clock, earned: true, rarity: 'epic', xp: 400 },
        { id: 6, name: 'Innovador', description: 'Implementaste 5 nuevas estrategias de enseñanza', icon: Brain, earned: false, rarity: 'legendary', xp: 1000 },
        { id: 7, name: 'Líder de Clase', description: 'Alcanza el nivel 10', icon: Crown, earned: false, rarity: 'legendary', xp: 800 }
      ],
      weeklyGoals: [
        { id: 1, title: 'Crear 5 actividades nuevas', progress: 3, target: 5, xp: 100, icon: BookOpen },
        { id: 2, title: 'Ayudar a 3 estudiantes con dificultades', progress: 2, target: 3, xp: 150, icon: Users },
        { id: 3, title: 'Generar 2 reportes de analytics', progress: 1, target: 2, xp: 75, icon: TrendingUp },
        { id: 4, title: 'Mantener streak de 7 días', progress: 5, target: 7, xp: 200, icon: Clock }
      ],
      leaderboard: [
        { position: 1, name: 'Prof. García', xp: 18500, level: 12, badge: 'Crown' },
        { position: 2, name: 'Prof. Martínez', xp: 16200, level: 11, badge: 'Star' },
        { position: 3, name: 'Prof. López', xp: 15800, level: 11, badge: 'Award' },
        { position: 4, name: 'Tú', xp: 12450, level: 8, badge: 'Trophy' },
        { position: 5, name: 'Prof. Rodríguez', xp: 11200, level: 8, badge: 'Gem' }
      ],
      badges: [
        { id: 1, name: 'Educador Dedicado', description: 'Por tu compromiso con la enseñanza', icon: Heart, earned: true, rarity: 'common' },
        { id: 2, name: 'Analista Experto', description: 'Por tu uso avanzado de analytics', icon: Brain, earned: true, rarity: 'rare' },
        { id: 3, name: 'Creador Prolífico', description: 'Por crear contenido de calidad', icon: BookOpen, earned: true, rarity: 'epic' },
        { id: 4, name: 'Mentor Inspirador', description: 'Por inspirar a tus estudiantes', icon: Sparkles, earned: false, rarity: 'legendary' }
      ]
    };

    setTeacherStats(mockStats);

    // Simular ganancia de XP
    const interval = setInterval(() => {
      setTeacherStats(prev => {
        const newXP = prev.xp + Math.floor(Math.random() * 10) + 5;
        if (newXP >= prev.nextLevelXP) {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
          return {
            ...prev,
            level: prev.level + 1,
            xp: newXP - prev.nextLevelXP,
            nextLevelXP: prev.nextLevelXP + 500
          };
        }
        return { ...prev, xp: newXP };
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-500/30 bg-gray-500/20';
      case 'rare': return 'text-blue-400 border-blue-500/30 bg-blue-500/20';
      case 'epic': return 'text-purple-400 border-purple-500/30 bg-purple-500/20';
      case 'legendary': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/20';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/20';
    }
  };

  const getLevelTitle = (level) => {
    if (level < 3) return 'Educador Novato';
    if (level < 6) return 'Profesor Experto';
    if (level < 9) return 'Maestro Consagrado';
    if (level < 12) return 'Líder Educativo';
    return 'Leyenda de la Enseñanza';
  };

  const progressPercentage = (teacherStats.xp / teacherStats.nextLevelXP) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full space-y-6"
    >
      {/* Header con nivel y progreso */}
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                <Trophy size={24} className="text-yellow-400" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-yellow-300">
                  {t('teacherDashboard.gamification.title', 'Tu Progreso Docente')}
                </CardTitle>
                <p className="text-sm text-slate-400">
                  {getLevelTitle(teacherStats.level)} - Nivel {teacherStats.level}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              {teacherStats.streak} {t('common.days', 'días')} {t('teacherDashboard.gamification.streak', 'de racha')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Barra de progreso de nivel */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">
                  {t('teacherDashboard.gamification.progressToNextLevel', 'Progreso al siguiente nivel')}
                </span>
                <span className="text-sm text-slate-400">
                  {teacherStats.xp} / {teacherStats.nextLevelXP} XP
                </span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-3 bg-slate-700" 
                indicatorClassName="bg-gradient-to-r from-yellow-500 to-orange-500"
              />
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{teacherStats.level}</div>
                <div className="text-xs text-slate-400">{t('teacherDashboard.gamification.level', 'Nivel')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{teacherStats.totalXP}</div>
                <div className="text-xs text-slate-400">{t('teacherDashboard.gamification.totalXP', 'XP Total')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{teacherStats.streak}</div>
                <div className="text-xs text-slate-400">{t('teacherDashboard.gamification.streakDays', 'Días Racha')}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logros recientes */}
        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-200 flex items-center gap-2">
              <Award size={20} className="text-purple-400" />
              {t('teacherDashboard.gamification.achievements', 'Logros Recientes')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teacherStats.achievements.slice(0, 4).map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                      achievement.earned 
                        ? getRarityColor(achievement.rarity)
                        : 'bg-slate-700/20 border-slate-600/30 opacity-60'
                    }`}
                  >
                    <Icon size={20} className={achievement.earned ? 'text-current' : 'text-slate-500'} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-200">
                        {achievement.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {achievement.description}
                      </div>
                    </div>
                    {achievement.earned && (
                      <div className="text-xs text-slate-300">
                        +{achievement.xp} XP
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Objetivos semanales */}
        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-200 flex items-center gap-2">
              <Target size={20} className="text-green-400" />
              {t('teacherDashboard.gamification.weeklyGoals', 'Objetivos Semanales')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teacherStats.weeklyGoals.map((goal) => {
                const Icon = goal.icon;
                const progressPercentage = (goal.progress / goal.target) * 100;
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-slate-700/30 border border-slate-600/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className="text-green-400" />
                        <span className="text-sm font-medium text-slate-200">
                          {goal.title}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        +{goal.xp} XP
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>{goal.progress} / {goal.target}</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>
                      <Progress 
                        value={progressPercentage} 
                        className="h-2 bg-slate-600" 
                        indicatorClassName="bg-green-500"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de clasificación */}
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-200 flex items-center gap-2">
            <Crown size={20} className="text-yellow-400" />
            {t('teacherDashboard.gamification.leaderboard', 'Clasificación de Profesores')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teacherStats.leaderboard.map((teacher, index) => {
              const BadgeIcon = teacher.badge === 'Crown' ? Crown : 
                               teacher.badge === 'Star' ? Star : 
                               teacher.badge === 'Award' ? Award : 
                               teacher.badge === 'Trophy' ? Trophy : Gem;
              return (
                <motion.div
                  key={teacher.position}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-200 ${
                    teacher.name === 'Tú' 
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30' 
                      : 'bg-slate-700/30 border-slate-600/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      teacher.position <= 3 ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20' : 'bg-slate-600/50'
                    }`}>
                      <span className="text-sm font-bold text-slate-200">
                        {teacher.position}
                      </span>
                    </div>
                    <BadgeIcon size={16} className={
                      teacher.position <= 3 ? 'text-yellow-400' : 'text-slate-400'
                    } />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-200">
                      {teacher.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      Nivel {teacher.level} • {teacher.xp.toLocaleString()} XP
                    </div>
                  </div>
                  {teacher.name === 'Tú' && (
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                      {t('teacherDashboard.gamification.you', 'Tú')}
                    </Badge>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Celebración de nivel */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 0.8, 
                  repeat: 3, 
                  ease: "easeInOut" 
                }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-yellow-300"
              >
                ¡Nivel {teacherStats.level}!
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-slate-300"
              >
                ¡Sigue inspirando a tus estudiantes!
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TeacherGamification;



