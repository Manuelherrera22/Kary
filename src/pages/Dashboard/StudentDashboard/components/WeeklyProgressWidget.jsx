import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Target, Award, CheckCircle, Clock, Star, BookOpen, HeartHandshake } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const WeeklyProgressWidget = ({ t }) => {
  // Datos mock para el progreso semanal
  const weeklyData = {
    tasksCompleted: 8,
    totalTasks: 12,
    resourcesUsed: 5,
    emotionalChecks: 7,
    studyHours: 15,
    achievements: 3,
    streak: 5,
    weeklyGoal: 10
  };

  const progressPercentage = Math.round((weeklyData.tasksCompleted / weeklyData.totalTasks) * 100);
  const goalProgress = Math.round((weeklyData.tasksCompleted / weeklyData.weeklyGoal) * 100);

  const achievements = [
    { id: 1, name: 'Estudiante Consistente', icon: CheckCircle, color: 'text-green-400' },
    { id: 2, name: 'Explorador de Recursos', icon: Star, color: 'text-yellow-400' },
    { id: 3, name: 'Mente Equilibrada', icon: Award, color: 'text-purple-400' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-blue-500 to-purple-500" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <CardHeader className="relative pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
                <TrendingUp size={24} className="text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-blue-300">
                  {t('studentDashboard.weeklyProgress.title', 'Progreso Semanal')}
                </CardTitle>
                <p className="text-sm text-slate-400">
                  {t('studentDashboard.weeklyProgress.subtitle', 'Tu rendimiento esta semana')}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              {weeklyData.streak} días seguidos
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-6">
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-300">
                {t('studentDashboard.weeklyProgress.tasksCompleted', 'Tareas Completadas')}
              </span>
              <span className="text-sm font-bold text-blue-300">
                {weeklyData.tasksCompleted}/{weeklyData.totalTasks}
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-3 bg-slate-700/50"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>0%</span>
              <span className="font-medium text-blue-300">{progressPercentage}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={16} className="text-green-400" />
                <span className="text-xs font-medium text-slate-300">
                  {t('studentDashboard.weeklyProgress.resourcesUsed', 'Recursos')}
                </span>
              </div>
              <div className="text-2xl font-bold text-green-300">
                {weeklyData.resourcesUsed}
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
              <div className="flex items-center gap-2 mb-2">
                <HeartHandshake size={16} className="text-pink-400" />
                <span className="text-xs font-medium text-slate-300">
                  {t('studentDashboard.weeklyProgress.emotionalChecks', 'Chequeos')}
                </span>
              </div>
              <div className="text-2xl font-bold text-pink-300">
                {weeklyData.emotionalChecks}
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-orange-400" />
                <span className="text-xs font-medium text-slate-300">
                  {t('studentDashboard.weeklyProgress.studyHours', 'Horas')}
                </span>
              </div>
              <div className="text-2xl font-bold text-orange-300">
                {weeklyData.studyHours}h
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-purple-400" />
                <span className="text-xs font-medium text-slate-300">
                  {t('studentDashboard.weeklyProgress.goalProgress', 'Meta')}
                </span>
              </div>
              <div className="text-2xl font-bold text-purple-300">
                {goalProgress}%
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Award size={16} className="text-yellow-400" />
              {t('studentDashboard.weeklyProgress.achievements', 'Logros Esta Semana')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <Badge 
                    key={achievement.id}
                    variant="secondary" 
                    className={`${achievement.color} bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 transition-colors`}
                  >
                    <Icon size={12} className="mr-1" />
                    {achievement.name}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Weekly Goal Progress */}
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-200">
                {t('studentDashboard.weeklyProgress.weeklyGoal', 'Meta Semanal')}
              </span>
              <span className="text-sm font-bold text-purple-300">
                {weeklyData.tasksCompleted}/{weeklyData.weeklyGoal} tareas
              </span>
            </div>
            <Progress 
              value={goalProgress} 
              className="h-2 bg-slate-700/50"
            />
            <p className="text-xs text-slate-400 mt-2">
              {goalProgress >= 100 
                ? t('studentDashboard.weeklyProgress.goalAchieved', '¡Meta alcanzada! ¡Excelente trabajo!')
                : t('studentDashboard.weeklyProgress.goalRemaining', `${weeklyData.weeklyGoal - weeklyData.tasksCompleted} tareas restantes para alcanzar tu meta`)
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeeklyProgressWidget;
