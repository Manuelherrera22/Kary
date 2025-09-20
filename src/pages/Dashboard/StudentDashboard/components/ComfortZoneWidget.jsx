import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Heart, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw,
  Sun,
  Moon,
  Cloud,
  Sparkles,
  BookOpen,
  Music,
  Paintbrush,
  Gamepad2,
  MessageCircle
} from 'lucide-react';

const ComfortZoneWidget = ({ t }) => {
  const [currentMood, setCurrentMood] = useState('good');
  const [energyLevel, setEnergyLevel] = useState('medium');

  // Datos mock para el ambiente de confort
  const comfortActivities = [
    {
      id: 1,
      title: "Lectura Relajante",
      description: "Cuentos cortos y divertidos para leer",
      duration: "10-15 min",
      energy: "low",
      icon: BookOpen,
      color: "bg-blue-500/20 text-blue-300 border-blue-500/30"
    },
    {
      id: 2,
      title: "Música Tranquila",
      description: "Canciones suaves para relajarse",
      duration: "5-10 min",
      energy: "low",
      icon: Music,
      color: "bg-purple-500/20 text-purple-300 border-purple-500/30"
    },
    {
      id: 3,
      title: "Dibujo Libre",
      description: "Pinta y dibuja lo que quieras",
      duration: "15-20 min",
      energy: "medium",
      icon: Paintbrush,
      color: "bg-pink-500/20 text-pink-300 border-pink-500/30"
    },
    {
      id: 4,
      title: "Juegos Suaves",
      description: "Juegos tranquilos y divertidos",
      duration: "10-15 min",
      energy: "medium",
      icon: Gamepad2,
      color: "bg-green-500/20 text-green-300 border-green-500/30"
    },
    {
      id: 5,
      title: "Hablar con Kary",
      description: "Cuéntale a Kary cómo te sientes",
      duration: "5-10 min",
      energy: "low",
      icon: MessageCircle,
      color: "bg-orange-500/20 text-orange-300 border-orange-500/30"
    }
  ];

  const moodOptions = [
    { value: 'excellent', label: 'Excelente', icon: Sun, color: 'text-yellow-400' },
    { value: 'good', label: 'Bien', icon: Sun, color: 'text-green-400' },
    { value: 'okay', label: 'Regular', icon: Cloud, color: 'text-blue-400' },
    { value: 'tired', label: 'Cansado', icon: Moon, color: 'text-purple-400' }
  ];

  const energyOptions = [
    { value: 'high', label: 'Mucha energía', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
    { value: 'medium', label: 'Energía normal', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
    { value: 'low', label: 'Poca energía', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' }
  ];

  const getFilteredActivities = () => {
    return comfortActivities.filter(activity => {
      if (energyLevel === 'low') {
        return activity.energy === 'low';
      } else if (energyLevel === 'medium') {
        return activity.energy === 'low' || activity.energy === 'medium';
      } else {
        return true;
      }
    });
  };

  const getMoodMessage = () => {
    switch (currentMood) {
      case 'excellent':
        return "¡Qué genial que te sientas tan bien! Kary está aquí para acompañarte.";
      case 'good':
        return "Me alegra que te sientas bien. ¿En qué te gustaría que te ayude hoy?";
      case 'okay':
        return "Entiendo que no es tu mejor día. Kary está aquí para apoyarte.";
      case 'tired':
        return "Es normal sentirse cansado. Te sugiero actividades muy suaves.";
      default:
        return "Kary está aquí para ti, sin importar cómo te sientas.";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="p-4 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl border border-pink-500/30">
            <Home size={28} className="text-pink-400" />
          </div>
          <h2 className="text-3xl font-bold text-pink-300">
            {t('studentDashboard.comfortZone.title', 'Mi Zona de Confort')}
          </h2>
        </div>
        <p className="text-slate-400 text-xl">
          {t('studentDashboard.comfortZone.subtitle', 'Un espacio seguro donde puedes aprender a tu ritmo')}
        </p>
      </div>

      {/* Mood Check */}
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100">
        <CardHeader className="p-6 sm:p-8">
          <CardTitle className="text-xl sm:text-2xl font-bold text-slate-200 flex items-center gap-3">
            <Heart size={24} className="text-pink-400" />
            {t('studentDashboard.comfortZone.howAreYou', '¿Cómo te sientes hoy?')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 pt-0">
          <div className="flex flex-wrap gap-4 mb-6">
            {moodOptions.map((mood) => (
              <Button
                key={mood.value}
                variant={currentMood === mood.value ? "default" : "outline"}
                onClick={() => setCurrentMood(mood.value)}
                className={`px-6 py-3 rounded-xl transition-all duration-200 text-base ${
                  currentMood === mood.value
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                    : 'text-slate-300 border-slate-600 hover:bg-slate-700'
                }`}
              >
                <mood.icon size={20} className={`mr-3 ${mood.color}`} />
                {mood.label}
              </Button>
            ))}
          </div>
          <div className="bg-slate-700/30 rounded-xl p-6">
            <p className="text-slate-300 text-center text-base">
              {getMoodMessage()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Energy Level */}
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100">
        <CardHeader className="p-6 sm:p-8">
          <CardTitle className="text-xl sm:text-2xl font-bold text-slate-200 flex items-center gap-3">
            <Clock size={24} className="text-blue-400" />
            {t('studentDashboard.comfortZone.energyLevel', '¿Cuánta energía tienes?')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 pt-0">
          <div className="flex flex-wrap gap-4">
            {energyOptions.map((energy) => (
              <Button
                key={energy.value}
                variant={energyLevel === energy.value ? "default" : "outline"}
                onClick={() => setEnergyLevel(energy.value)}
                className={`px-6 py-3 rounded-xl transition-all duration-200 text-base ${
                  energyLevel === energy.value
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'text-slate-300 border-slate-600 hover:bg-slate-700'
                }`}
              >
                {energy.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Activities */}
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100">
        <CardHeader className="p-6 sm:p-8">
          <CardTitle className="text-xl sm:text-2xl font-bold text-slate-200 flex items-center gap-3">
            <Sparkles size={24} className="text-emerald-400" />
            {t('studentDashboard.comfortZone.recommendedActivities', 'Actividades recomendadas para ti')}
          </CardTitle>
          <p className="text-base text-slate-400 mt-2">
            {t('studentDashboard.comfortZone.recommendedDesc', 'Basado en cómo te sientes hoy')}
          </p>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredActivities().map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-6 rounded-xl border ${activity.color} hover:scale-105 transition-transform duration-200 cursor-pointer`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <activity.icon size={24} />
                  <h4 className="text-lg font-semibold text-slate-200">
                    {activity.title}
                  </h4>
                </div>
                
                <p className="text-base text-slate-300 mb-4 leading-relaxed">
                  {activity.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge className="bg-slate-600/20 text-slate-300 border-slate-600/30 text-sm px-3 py-1">
                    <Clock size={14} className="mr-1" />
                    {activity.duration}
                  </Badge>
                  
                  <Button
                    size="sm"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm"
                  >
                    <Play size={16} className="mr-2" />
                    Empezar
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Break Reminder */}
      <Card className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-orange-500/30 text-slate-100">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Pause size={28} className="text-orange-400" />
            <h3 className="text-2xl font-bold text-orange-300">
              {t('studentDashboard.comfortZone.breakReminder', 'Recuerda tomar descansos')}
            </h3>
          </div>
          <p className="text-slate-300 text-xl mb-6 leading-relaxed">
            {t('studentDashboard.comfortZone.breakMessage', 'Es importante descansar cuando te sientas cansado. Kary te recordará cuando sea momento de tomar una pausa.')}
          </p>
          <Button
            variant="outline"
            className="text-orange-300 border-orange-500/30 hover:bg-orange-500/20 text-base px-6 py-3"
          >
            <RotateCcw size={18} className="mr-2" />
            {t('studentDashboard.comfortZone.takeBreak', 'Tomar un descanso ahora')}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ComfortZoneWidget;

