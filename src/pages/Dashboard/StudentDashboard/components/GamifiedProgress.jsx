import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Target, Award, Flame, Crown, Gem } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const GamifiedProgress = () => {
  const { t } = useLanguage();
  const [currentLevel, setCurrentLevel] = useState(5);
  const [currentXP, setCurrentXP] = useState(750);
  const [nextLevelXP, setNextLevelXP] = useState(1000);
  const [streak, setStreak] = useState(7);
  const [achievements, setAchievements] = useState([]);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Simular datos de progreso gamificado
  useEffect(() => {
    const mockAchievements = [
      { id: 1, name: 'Primer Paso', description: 'Completa tu primera tarea', icon: Star, earned: true, rarity: 'common' },
      { id: 2, name: 'Estudiante Consistente', description: '7 días consecutivos de actividad', icon: Flame, earned: true, rarity: 'rare' },
      { id: 3, name: 'Explorador de Conocimiento', description: 'Completa 10 recursos', icon: Gem, earned: true, rarity: 'epic' },
      { id: 4, name: 'Maestro de las Emociones', description: 'Registra tu estado emocional 5 días seguidos', icon: Zap, earned: false, rarity: 'legendary' },
      { id: 5, name: 'Campeón de Kary', description: 'Alcanza el nivel 10', icon: Crown, earned: false, rarity: 'legendary' }
    ];

    setAchievements(mockAchievements);

    // Simular ganancia de XP
    const interval = setInterval(() => {
      setCurrentXP(prev => {
        const newXP = prev + Math.floor(Math.random() * 20) + 5;
        if (newXP >= nextLevelXP) {
          setCurrentLevel(prev => prev + 1);
          setNextLevelXP(prev => prev + 200);
          setShowLevelUp(true);
          setTimeout(() => setShowLevelUp(false), 3000);
          return newXP - nextLevelXP;
        }
        return newXP;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [nextLevelXP]);

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
    if (level < 3) return 'Aprendiz';
    if (level < 6) return 'Estudiante';
    if (level < 9) return 'Sabio';
    if (level < 12) return 'Maestro';
    return 'Leyenda';
  };

  const progressPercentage = (currentXP / nextLevelXP) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl overflow-hidden relative">
        {/* Efecto de partículas de fondo */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <CardHeader className="relative pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                <Trophy size={24} className="text-yellow-400" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-yellow-300">
                  {t('studentDashboard.gamifiedProgress.title', 'Progreso Gamificado')}
                </CardTitle>
                <p className="text-sm text-slate-400">
                  {t('studentDashboard.gamifiedProgress.subtitle', '¡Conviértete en un maestro del aprendizaje!')}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              Nivel {currentLevel}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-6">
          {/* Barra de progreso de nivel */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown size={16} className="text-yellow-400" />
                <span className="text-sm font-medium text-slate-300">
                  {getLevelTitle(currentLevel)} - Nivel {currentLevel}
                </span>
              </div>
              <span className="text-sm text-slate-400">
                {currentXP} / {nextLevelXP} XP
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-3 bg-slate-700" 
              indicatorClassName="bg-gradient-to-r from-yellow-500 to-orange-500"
            />
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
              <div className="flex items-center gap-2 mb-2">
                <Flame size={16} className="text-orange-400" />
                <span className="text-xs font-medium text-slate-300">
                  {t('studentDashboard.gamifiedProgress.streak', 'Racha')}
                </span>
              </div>
              <div className="text-2xl font-bold text-orange-300">
                {streak} {t('common.days', 'días')}
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-green-400" />
                <span className="text-xs font-medium text-slate-300">
                  {t('studentDashboard.gamifiedProgress.achievements', 'Logros')}
                </span>
              </div>
              <div className="text-2xl font-bold text-green-300">
                {achievements.filter(a => a.earned).length}/{achievements.length}
              </div>
            </div>
          </div>

          {/* Logros recientes */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Award size={16} className="text-purple-400" />
              {t('studentDashboard.gamifiedProgress.recentAchievements', 'Logros Recientes')}
            </h4>
            <div className="space-y-2">
              {achievements.slice(0, 3).map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-3 p-2 rounded-lg border transition-all duration-200 ${
                      achievement.earned 
                        ? getRarityColor(achievement.rarity)
                        : 'bg-slate-700/20 border-slate-600/30 opacity-60'
                    }`}
                  >
                    <Icon size={16} className={achievement.earned ? 'text-current' : 'text-slate-500'} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-200">
                        {achievement.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {achievement.description}
                      </div>
                    </div>
                    {achievement.earned && (
                      <Badge 
                        variant="secondary" 
                        className="bg-green-500/20 text-green-300 border-green-500/30 text-xs"
                      >
                        ¡Completado!
                      </Badge>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Próximo logro */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Star size={16} className="text-purple-400" />
              <span className="text-sm font-semibold text-purple-300">
                {t('studentDashboard.gamifiedProgress.nextAchievement', 'Próximo Logro')}
              </span>
            </div>
            <div className="text-sm text-slate-300">
              {achievements.find(a => !a.earned)?.name || '¡Todos los logros completados!'}
            </div>
          </div>
        </CardContent>

        {/* Animación de subida de nivel */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center z-20"
            >
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [-20, 0, -20] }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="text-center"
              >
                <Trophy size={48} className="text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-300">
                  ¡Nivel {currentLevel}!
                </div>
                <div className="text-sm text-slate-300">
                  ¡Sigue así, campeón!
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default GamifiedProgress;



