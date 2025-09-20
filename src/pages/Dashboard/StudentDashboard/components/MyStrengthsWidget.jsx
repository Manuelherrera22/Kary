import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Heart, 
  Brain, 
  Target, 
  Sparkles,
  Trophy,
  Lightbulb,
  Users,
  BookOpen,
  Music,
  Paintbrush
} from 'lucide-react';

const MyStrengthsWidget = ({ t }) => {
  // Datos mock para las fortalezas del estudiante (sin diagnósticos)
  const strengths = [
    {
      id: 1,
      icon: Star,
      title: "Creatividad",
      description: "Tienes ideas muy originales y únicas",
      examples: ["Dibujos increíbles", "Historias fantásticas", "Soluciones creativas"],
      color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
    },
    {
      id: 2,
      icon: Heart,
      title: "Empatía",
      description: "Entiendes muy bien los sentimientos de otros",
      examples: ["Ayudas a tus compañeros", "Eres muy comprensivo", "Tienes un gran corazón"],
      color: "bg-pink-500/20 text-pink-300 border-pink-500/30"
    },
    {
      id: 3,
      icon: Brain,
      title: "Curiosidad",
      description: "Siempre quieres aprender cosas nuevas",
      examples: ["Haces muchas preguntas", "Exploras temas interesantes", "Te gusta investigar"],
      color: "bg-blue-500/20 text-blue-300 border-blue-500/30"
    },
    {
      id: 4,
      icon: Target,
      title: "Persistencia",
      description: "No te rindes fácilmente cuando algo es importante",
      examples: ["Terminas lo que empiezas", "Practicas hasta mejorar", "Eres muy dedicado"],
      color: "bg-green-500/20 text-green-300 border-green-500/30"
    },
    {
      id: 5,
      icon: Users,
      title: "Trabajo en Equipo",
      description: "Trabajas muy bien con otros",
      examples: ["Ayudas en proyectos grupales", "Escuchas a todos", "Eres un gran compañero"],
      color: "bg-purple-500/20 text-purple-300 border-purple-500/30"
    },
    {
      id: 6,
      icon: Lightbulb,
      title: "Resolución de Problemas",
      description: "Encuentras soluciones creativas a los desafíos",
      examples: ["Piensas diferente", "Encuentras alternativas", "Eres muy ingenioso"],
      color: "bg-orange-500/20 text-orange-300 border-orange-500/30"
    }
  ];

  const recentAchievements = [
    {
      id: 1,
      title: "Completaste 5 actividades esta semana",
      icon: Trophy,
      color: "bg-gold-500/20 text-yellow-300 border-yellow-500/30"
    },
    {
      id: 2,
      title: "Ayudaste a un compañero con su tarea",
      icon: Heart,
      color: "bg-pink-500/20 text-pink-300 border-pink-500/30"
    },
    {
      id: 3,
      title: "Hiciste una pregunta muy interesante en clase",
      icon: Lightbulb,
      color: "bg-blue-500/20 text-blue-300 border-blue-500/30"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
            <Sparkles size={28} className="text-yellow-400" />
          </div>
          <h2 className="text-3xl font-bold text-yellow-300">
            {t('studentDashboard.myStrengths.title', 'Lo que haces muy bien')}
          </h2>
        </div>
        <p className="text-slate-400 text-xl">
          {t('studentDashboard.myStrengths.subtitle', 'Kary ha notado estas cosas increíbles sobre ti')}
        </p>
      </div>

      {/* Strengths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {strengths.map((strength, index) => (
          <motion.div
            key={strength.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 hover:shadow-lg transition-all duration-200 h-full">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-5">
                  <div className={`p-4 rounded-xl ${strength.color}`}>
                    <strength.icon size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-200">
                    {strength.title}
                  </h3>
                </div>
                
                <p className="text-slate-300 mb-5 text-base leading-relaxed">
                  {strength.description}
                </p>
                
                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-400">Ejemplos:</p>
                  <div className="flex flex-wrap gap-2">
                    {strength.examples.map((example, idx) => (
                      <Badge 
                        key={idx}
                        className="bg-slate-700/50 text-slate-300 border-slate-600/50 text-sm px-3 py-1"
                      >
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Achievements */}
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-green-300 flex items-center gap-3">
            <Trophy size={24} className="text-green-400" />
            {t('studentDashboard.myStrengths.recentAchievements', 'Logros Recientes')}
          </CardTitle>
          <p className="text-base text-slate-400 mt-2">
            {t('studentDashboard.myStrengths.recentAchievementsDesc', 'Cosas increíbles que has hecho últimamente')}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-5 rounded-xl border ${achievement.color} hover:scale-105 transition-transform duration-200`}
              >
                <div className="flex items-center gap-4">
                  <achievement.icon size={24} />
                  <p className="text-base font-medium text-slate-200">
                    {achievement.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 text-slate-100">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Sparkles size={28} className="text-purple-400" />
            <h3 className="text-2xl font-bold text-purple-300">
              {t('studentDashboard.myStrengths.motivationalTitle', '¡Eres único y especial!')}
            </h3>
          </div>
          <p className="text-slate-300 text-xl leading-relaxed">
            {t('studentDashboard.myStrengths.motivationalMessage', 'Cada día aprendes algo nuevo y creces como persona. Kary está aquí para apoyarte en tu camino de aprendizaje.')}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MyStrengthsWidget;

