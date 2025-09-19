import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star,
  Target,
  Zap,
  Heart,
  BookOpen,
  Users,
  Calendar,
  Award,
  Crown,
  Flame,
  Shield,
  Sword,
  Gem,
  Medal,
  CheckCircle,
  Clock,
  TrendingUp,
  Gift,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const FamilyGamification = () => {
  const { t } = useLanguage();
  const [familyStats, setFamilyStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    setLoading(true);
    try {
      // Simular carga de datos de gamificación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockFamilyStats = {
        totalPoints: 2450,
        currentLevel: 8,
        levelProgress: 75,
        nextLevelPoints: 3000,
        weeklyStreak: 12,
        monthlyGoals: 8,
        completedGoals: 6,
        familyRank: 3,
        totalFamilies: 150
      };

      const mockAchievements = [
        {
          id: 'ach-1',
          title: 'Estudiante Constante',
          description: 'Completar tareas por 7 días consecutivos',
          icon: '📚',
          points: 100,
          unlocked: true,
          unlockedAt: '2024-01-15',
          rarity: 'common'
        },
        {
          id: 'ach-2',
          title: 'Comunicación Familiar',
          description: 'Participar en 5 reuniones familiares',
          icon: '👨‍👩‍👧‍👦',
          points: 150,
          unlocked: true,
          unlockedAt: '2024-01-20',
          rarity: 'common'
        },
        {
          id: 'ach-3',
          title: 'Apoyo Emocional',
          description: 'Ayudar en 10 actividades emocionales',
          icon: '❤️',
          points: 200,
          unlocked: true,
          unlockedAt: '2024-01-25',
          rarity: 'rare'
        },
        {
          id: 'ach-4',
          title: 'Maestro de la Organización',
          description: 'Completar 20 actividades de organización',
          icon: '🎯',
          points: 300,
          unlocked: false,
          progress: 15,
          maxProgress: 20,
          rarity: 'rare'
        },
        {
          id: 'ach-5',
          title: 'Líder Familiar',
          description: 'Ser el #1 en el ranking familiar por 1 mes',
          icon: '👑',
          points: 500,
          unlocked: false,
          progress: 0,
          maxProgress: 1,
          rarity: 'epic'
        }
      ];

      const mockChallenges = [
        {
          id: 'challenge-1',
          title: 'Semana de Lectura',
          description: 'Leer 30 minutos cada día esta semana',
          type: 'weekly',
          points: 200,
          progress: 4,
          maxProgress: 7,
          status: 'active',
          endDate: '2024-01-28',
          difficulty: 'medium'
        },
        {
          id: 'challenge-2',
          title: 'Desafío Matemático',
          description: 'Completar 10 ejercicios de matemáticas',
          type: 'daily',
          points: 100,
          progress: 7,
          maxProgress: 10,
          status: 'active',
          endDate: '2024-01-22',
          difficulty: 'easy'
        },
        {
          id: 'challenge-3',
          title: 'Momento Familiar',
          description: 'Pasar 2 horas de calidad en familia',
          type: 'daily',
          points: 150,
          progress: 0,
          maxProgress: 1,
          status: 'pending',
          endDate: '2024-01-22',
          difficulty: 'easy'
        }
      ];

      const mockLeaderboard = [
        {
          id: 'family-1',
          name: 'Familia García',
          points: 3200,
          level: 10,
          avatar: '👨‍👩‍👧‍👦',
          rank: 1
        },
        {
          id: 'family-2',
          name: 'Familia López',
          points: 2800,
          level: 9,
          avatar: '👨‍👩‍👧',
          rank: 2
        },
        {
          id: 'family-3',
          name: 'Tu Familia',
          points: 2450,
          level: 8,
          avatar: '👨‍👩‍👧‍👦',
          rank: 3
        },
        {
          id: 'family-4',
          name: 'Familia Martínez',
          points: 2100,
          level: 7,
          avatar: '👨‍👩‍👦',
          rank: 4
        },
        {
          id: 'family-5',
          name: 'Familia Rodríguez',
          points: 1800,
          level: 6,
          avatar: '👨‍👩‍👧‍👦',
          rank: 5
        }
      ];

      setFamilyStats(mockFamilyStats);
      setAchievements(mockAchievements);
      setChallenges(mockChallenges);
      setLeaderboard(mockLeaderboard);
    } catch (error) {
      console.error('Error loading gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      case 'rare': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'epic': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'legendary': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'hard': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'completed': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando gamificación familiar...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
              <Trophy size={24} className="text-yellow-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-yellow-300">
                Gamificación Familiar
              </CardTitle>
              <p className="text-sm text-slate-400">
                Convierte el aprendizaje en una aventura divertida
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="text-yellow-400 bg-yellow-500/20 border-yellow-500/30">
              Nivel {familyStats.currentLevel}
            </Badge>
            <Badge className="text-blue-400 bg-blue-500/20 border-blue-500/30">
              #{familyStats.familyRank} de {familyStats.totalFamilies}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tabs de navegación */}
        <div className="flex space-x-1 bg-slate-700/30 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Resumen', icon: '📊' },
            { id: 'achievements', label: 'Logros', icon: '🏆' },
            { id: 'challenges', label: 'Desafíos', icon: '🎯' },
            { id: 'leaderboard', label: 'Ranking', icon: '👑' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-yellow-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Resumen */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Star size={24} className="text-yellow-400" />
                    <div>
                      <h4 className="font-semibold text-slate-200">Puntos Totales</h4>
                      <p className="text-2xl font-bold text-yellow-400">{familyStats.totalPoints}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Crown size={24} className="text-purple-400" />
                    <div>
                      <h4 className="font-semibold text-slate-200">Nivel Actual</h4>
                      <p className="text-2xl font-bold text-purple-400">{familyStats.currentLevel}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Flame size={24} className="text-orange-400" />
                    <div>
                      <h4 className="font-semibold text-slate-200">Racha Semanal</h4>
                      <p className="text-2xl font-bold text-orange-400">{familyStats.weeklyStreak} días</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Target size={24} className="text-green-400" />
                    <div>
                      <h4 className="font-semibold text-slate-200">Metas Completadas</h4>
                      <p className="text-2xl font-bold text-green-400">{familyStats.completedGoals}/{familyStats.monthlyGoals}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progreso del nivel */}
            <Card className="bg-slate-700/30 border-slate-600/30">
              <CardHeader>
                <CardTitle className="text-lg text-slate-200">Progreso del Nivel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Progreso hacia el siguiente nivel</span>
                      <span className="text-slate-200">{familyStats.levelProgress}%</span>
                    </div>
                    <Progress value={familyStats.levelProgress} className="h-3" />
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Puntos actuales: {familyStats.totalPoints}</span>
                    <span>Próximo nivel: {familyStats.nextLevelPoints}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab: Logros */}
        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    achievement.unlocked 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-slate-700/30 border-slate-600/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.unlocked ? 'bg-green-500/20' : 'bg-slate-600/30'
                    }`}>
                      <span className="text-2xl">{achievement.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-200 text-sm mb-1">
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-slate-400 mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getRarityColor(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                        <Badge className="text-yellow-400 bg-yellow-500/20 border-yellow-500/30">
                          {achievement.points} pts
                        </Badge>
                      </div>
                      {achievement.unlocked ? (
                        <div className="flex items-center gap-1 text-xs text-green-400">
                          <CheckCircle size={12} />
                          Desbloqueado
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Progreso</span>
                            <span>{achievement.progress || 0}/{achievement.maxProgress}</span>
                          </div>
                          <Progress 
                            value={((achievement.progress || 0) / achievement.maxProgress) * 100} 
                            className="h-2" 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Desafíos */}
        {activeTab === 'challenges' && (
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg border bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-600/30 rounded-lg">
                    <Target size={20} className="text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-200 text-sm">
                          {challenge.title}
                        </h4>
                        <p className="text-xs text-slate-400 mb-2">
                          {challenge.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge className={getDifficultyColor(challenge.difficulty)}>
                            {challenge.difficulty}
                          </Badge>
                          <Badge className={getStatusColor(challenge.status)}>
                            {challenge.status}
                          </Badge>
                          <Badge className="text-yellow-400 bg-yellow-500/20 border-yellow-500/30">
                            {challenge.points} pts
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Progreso</span>
                        <span>{challenge.progress}/{challenge.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(challenge.progress / challenge.maxProgress) * 100} 
                        className="h-2" 
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Termina: {new Date(challenge.endDate).toLocaleDateString()}</span>
                        <span>{challenge.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tab: Ranking */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <div className="space-y-2">
              {leaderboard.map((family, index) => (
                <motion.div
                  key={family.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    family.rank <= 3 
                      ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30' 
                      : 'bg-slate-700/30 border-slate-600/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-600/30">
                      {family.rank <= 3 ? (
                        <span className="text-2xl">
                          {family.rank === 1 ? '🥇' : family.rank === 2 ? '🥈' : '🥉'}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-bold">#{family.rank}</span>
                      )}
                    </div>
                    <div className="text-2xl">{family.avatar}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-200">
                        {family.name}
                      </h4>
                      <p className="text-sm text-slate-400">
                        Nivel {family.level} • {family.points} puntos
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-200">
                        {family.points}
                      </div>
                      <div className="text-xs text-slate-400">puntos</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FamilyGamification;

