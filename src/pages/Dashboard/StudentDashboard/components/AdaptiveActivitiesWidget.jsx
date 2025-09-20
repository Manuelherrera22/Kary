import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Star, 
  Heart,
  Brain,
  Target,
  Sparkles,
  ArrowRight,
  Pause,
  PlayCircle
} from 'lucide-react';

const AdaptiveActivitiesWidget = ({ t }) => {
  const [selectedSubject, setSelectedSubject] = useState('matematicas');

  // Datos mock para actividades adaptativas
  const subjects = {
    matematicas: {
      name: "Matemáticas",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-300"
    },
    ciencias: {
      name: "Ciencias",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/30",
      textColor: "text-green-300"
    },
    lenguaje: {
      name: "Lenguaje",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-300"
    }
  };

  const adaptiveActivities = {
    matematicas: [
      {
        id: 1,
        title: "Sumas con Ayuda Visual",
        description: "Aprende a sumar usando objetos que puedes ver y tocar",
        difficulty: "Fácil",
        duration: "15 min",
        type: "visual",
        status: "available",
        adaptation: "Incluye imágenes y objetos virtuales para contar",
        icon: BookOpen,
        color: "bg-blue-500/20 text-blue-300 border-blue-500/30"
      },
      {
        id: 2,
        title: "Problemas de la Vida Real",
        description: "Resuelve problemas matemáticos usando situaciones cotidianas",
        difficulty: "Medio",
        duration: "25 min",
        type: "practical",
        status: "in_progress",
        adaptation: "Adaptado a tus intereses personales",
        icon: Target,
        color: "bg-green-500/20 text-green-300 border-green-500/30"
      },
      {
        id: 3,
        title: "Juego de Multiplicación",
        description: "Aprende las tablas de multiplicar jugando",
        difficulty: "Fácil",
        duration: "20 min",
        type: "game",
        status: "completed",
        adaptation: "Con pausas automáticas y refuerzo positivo",
        icon: PlayCircle,
        color: "bg-purple-500/20 text-purple-300 border-purple-500/30"
      }
    ],
    ciencias: [
      {
        id: 4,
        title: "El Sistema Solar Interactivo",
        description: "Explora los planetas con videos y animaciones",
        difficulty: "Fácil",
        duration: "30 min",
        type: "visual",
        status: "available",
        adaptation: "Con narración y subtítulos",
        icon: Star,
        color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      },
      {
        id: 5,
        title: "Experimentos Seguros en Casa",
        description: "Realiza experimentos simples con materiales caseros",
        difficulty: "Medio",
        duration: "40 min",
        type: "practical",
        status: "available",
        adaptation: "Con instrucciones paso a paso y supervisión virtual",
        icon: Brain,
        color: "bg-orange-500/20 text-orange-300 border-orange-500/30"
      }
    ],
    lenguaje: [
      {
        id: 6,
        title: "Cuentos con Imágenes",
        description: "Lee historias con apoyo visual y auditivo",
        difficulty: "Fácil",
        duration: "20 min",
        type: "reading",
        status: "available",
        adaptation: "Con audio y texto grande",
        icon: BookOpen,
        color: "bg-pink-500/20 text-pink-300 border-pink-500/30"
      },
      {
        id: 7,
        title: "Escribir Mi Historia",
        description: "Crea tu propio cuento con ayuda de Kary",
        difficulty: "Medio",
        duration: "35 min",
        type: "creative",
        status: "in_progress",
        adaptation: "Con plantillas y sugerencias personalizadas",
        icon: Heart,
        color: "bg-red-500/20 text-red-300 border-red-500/30"
      }
    ]
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'in_progress':
        return <Play size={16} className="text-blue-400" />;
      default:
        return <PlayCircle size={16} className="text-slate-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completada';
      case 'in_progress':
        return 'En Progreso';
      default:
        return 'Disponible';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Fácil':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Medio':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Difícil':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30">
            <Sparkles size={20} className="sm:hidden text-emerald-400" />
            <Sparkles size={24} className="hidden sm:block text-emerald-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-300">
            {t('studentDashboard.adaptiveActivities.title', 'Mis Actividades Personalizadas')}
          </h2>
        </div>
        <p className="text-slate-400 text-sm sm:text-base lg:text-lg px-2">
          {t('studentDashboard.adaptiveActivities.subtitle', 'Actividades divertidas y personalizadas para ti')}
        </p>
      </div>

      {/* Subject Selector */}
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg font-bold text-slate-200">
            {t('studentDashboard.adaptiveActivities.chooseSubject', 'Elige una materia')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {Object.entries(subjects).map(([key, subject]) => (
              <Button
                key={key}
                variant={selectedSubject === key ? "default" : "outline"}
                onClick={() => setSelectedSubject(key)}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base ${
                  selectedSubject === key
                    ? `bg-gradient-to-r ${subject.color} text-white shadow-lg`
                    : 'text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-slate-100'
                }`}
              >
                {subject.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activities List */}
      <div className="space-y-3 sm:space-y-4">
        <AnimatePresence mode="wait">
          {adaptiveActivities[selectedSubject]?.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={`bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 hover:shadow-lg transition-all duration-200 ${
                activity.status === 'completed' ? 'opacity-75' : ''
              }`}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1">
                      <div className={`p-2 sm:p-3 rounded-lg ${activity.color} flex-shrink-0`}>
                        <activity.icon size={20} className="sm:hidden" />
                        <activity.icon size={24} className="hidden sm:block" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-slate-200 leading-tight">
                            {activity.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(activity.status)}
                            <span className="text-xs sm:text-sm text-slate-400">
                              {getStatusText(activity.status)}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm sm:text-base text-slate-300 mb-3 leading-relaxed">
                          {activity.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                          <Badge className={`text-xs ${getDifficultyColor(activity.difficulty)}`}>
                            {activity.difficulty}
                          </Badge>
                          <Badge className="bg-slate-600/20 text-slate-300 border-slate-600/30 text-xs">
                            <Clock size={10} className="mr-1" />
                            {activity.duration}
                          </Badge>
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                            <Sparkles size={10} className="mr-1" />
                            Adaptada
                          </Badge>
                        </div>
                        
                        <div className="bg-slate-700/30 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            <strong>Lo especial de esta actividad:</strong> {activity.adaptation}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end sm:justify-start sm:ml-4">
                      <Button
                        variant={activity.status === 'completed' ? 'outline' : 'default'}
                        size="sm"
                        className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-xs sm:text-sm ${
                          activity.status === 'completed'
                            ? 'text-green-400 border-green-500/30 hover:bg-green-500/20'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                        }`}
                      >
                        {activity.status === 'completed' ? (
                          <>
                            <CheckCircle size={14} className="sm:hidden mr-1" />
                            <CheckCircle size={16} className="hidden sm:block mr-2" />
                            <span className="hidden sm:inline">Completada</span>
                            <span className="sm:hidden">✓</span>
                          </>
                        ) : activity.status === 'in_progress' ? (
                          <>
                            <Pause size={14} className="sm:hidden mr-1" />
                            <Pause size={16} className="hidden sm:block mr-2" />
                            <span className="hidden sm:inline">Continuar</span>
                            <span className="sm:hidden">▶</span>
                          </>
                        ) : (
                          <>
                            <Play size={14} className="sm:hidden mr-1" />
                            <Play size={16} className="hidden sm:block mr-2" />
                            <span className="hidden sm:inline">Empezar</span>
                            <span className="sm:hidden">▶</span>
                            <ArrowRight size={14} className="sm:hidden ml-1" />
                            <ArrowRight size={16} className="hidden sm:block ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AdaptiveActivitiesWidget;
