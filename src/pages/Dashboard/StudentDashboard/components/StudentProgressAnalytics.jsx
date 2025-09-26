import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  Calendar,
  BookOpen,
  CheckCircle,
  Clock,
  Star,
  AlertCircle,
  TrendingDown
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import studentProgressService from '@/services/studentProgressService';

const StudentProgressAnalytics = () => {
  const { t } = useLanguage();
  const { user } = useMockAuth();
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // week, month, semester

  useEffect(() => {
    const fetchProgressData = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const result = await studentProgressService.getStudentProgress(user.id, timeRange);
        if (result.success) {
          setProgressData(result.data);
        }
      } catch (error) {
        console.error('Error fetching progress data:', error);
        // Datos mock para desarrollo
        setProgressData({
          overallProgress: 75,
          weeklyProgress: [
            { day: 'Lunes', progress: 80, activities: 4 },
            { day: 'Martes', progress: 70, activities: 3 },
            { day: 'Miércoles', progress: 90, activities: 5 },
            { day: 'Jueves', progress: 65, activities: 2 },
            { day: 'Viernes', progress: 85, activities: 4 }
          ],
          subjectProgress: [
            { subject: 'Matemáticas', progress: 85, trend: 'up' },
            { subject: 'Lenguaje', progress: 70, trend: 'up' },
            { subject: 'Ciencias', progress: 90, trend: 'stable' },
            { subject: 'Historia', progress: 60, trend: 'down' }
          ],
          achievements: [
            { title: 'Estudiante Constante', description: 'Completaste 5 actividades seguidas', icon: '🏆', earned: true },
            { title: 'Rayo de Velocidad', description: 'Completaste una actividad en tiempo récord', icon: '⚡', earned: true },
            { title: 'Maestro de Matemáticas', description: 'Obtuviste 90% en matemáticas', icon: '🧮', earned: false }
          ],
          recommendations: [
            'Continúa con el excelente trabajo en matemáticas',
            'Considera dedicar más tiempo a historia',
            'Tu progreso semanal está mejorando'
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [user?.id, timeRange]);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <BarChart3 className="w-4 h-4 text-blue-400" />;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/60">
        <CardHeader>
          <CardTitle className="text-xl text-green-300">📊 Mi Progreso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/60">
      <CardHeader>
        <CardTitle className="text-xl text-green-300 flex items-center gap-2">
          📊 Mi Progreso
          <Badge variant="outline" className="text-xs">
            {timeRange === 'week' ? 'Esta semana' : 
             timeRange === 'month' ? 'Este mes' : 'Este semestre'}
          </Badge>
        </CardTitle>
        
        {/* Selector de tiempo */}
        <div className="flex gap-2 mt-4">
          {['week', 'month', 'semester'].map(range => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="text-xs"
            >
              {range === 'week' ? 'Semana' : 
               range === 'month' ? 'Mes' : 'Semestre'}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progreso general */}
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-2">
            {progressData?.overallProgress || 0}%
          </div>
          <p className="text-slate-300 mb-4">Progreso General</p>
          <Progress 
            value={progressData?.overallProgress || 0} 
            className="h-3 bg-slate-700"
          />
        </div>

        {/* Progreso por día de la semana */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Progreso Diario
          </h4>
          <div className="space-y-3">
            {progressData?.weeklyProgress?.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-semibold">
                    {day.day.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{day.day}</p>
                    <p className="text-slate-400 text-sm">{day.activities} actividades</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={day.progress} className="w-20 h-2 bg-slate-600" />
                  <span className="text-white font-semibold text-sm">{day.progress}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progreso por materia */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Por Materia
          </h4>
          <div className="space-y-3">
            {progressData?.subjectProgress?.map((subject, index) => (
              <motion.div
                key={subject.subject}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getTrendIcon(subject.trend)}
                  <div>
                    <p className="text-white font-medium">{subject.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={subject.progress} className="w-20 h-2 bg-slate-600" />
                  <span className="text-white font-semibold text-sm">{subject.progress}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Logros */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Logros
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {progressData?.achievements?.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border-2 ${
                  achievement.earned 
                    ? 'bg-green-500/20 border-green-500/50' 
                    : 'bg-slate-700/50 border-slate-600/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <p className={`font-medium ${achievement.earned ? 'text-green-300' : 'text-slate-400'}`}>
                      {achievement.title}
                    </p>
                    <p className="text-slate-400 text-sm">{achievement.description}</p>
                  </div>
                  {achievement.earned && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recomendaciones */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Recomendaciones
          </h4>
          <div className="space-y-2">
            {progressData?.recommendations?.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg"
              >
                <p className="text-blue-200 text-sm">{recommendation}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentProgressAnalytics;
