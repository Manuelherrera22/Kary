import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, TrendingUp, TrendingDown, Target, Zap, 
  AlertTriangle, CheckCircle, Calendar, BarChart3,
  PieChart, LineChart, Activity, Users, BookOpen,
  Lightbulb, ArrowRight, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const PredictionCard = ({ prediction, index }) => {
  const getPredictionIcon = (type) => {
    switch (type) {
      case 'academic_trend': return <BookOpen className="w-5 h-5" />;
      case 'emotional_wellbeing': return <Activity className="w-5 h-5" />;
      case 'attendance_pattern': return <Users className="w-5 h-5" />;
      case 'resource_optimization': return <Target className="w-5 h-5" />;
      case 'risk_assessment': return <AlertTriangle className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-400 bg-green-500/20';
    if (confidence >= 60) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'negative': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Target className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/60 hover:border-slate-600/80 transition-all duration-300 group-hover:shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${prediction.color.replace('text-', 'bg-')}/20`}>
                {getPredictionIcon(prediction.type)}
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {prediction.title}
                </CardTitle>
                <p className="text-sm text-slate-400">
                  {prediction.category}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getTrendIcon(prediction.trend)}
              <Badge 
                variant="outline" 
                className={`${getConfidenceColor(prediction.confidence)} border-current`}
              >
                {prediction.confidence}% confianza
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <p className="text-slate-300 text-sm leading-relaxed">
              {prediction.description}
            </p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Probabilidad de ocurrencia</span>
                <span>{prediction.probability}%</span>
              </div>
              <Progress 
                value={prediction.probability} 
                className="h-2 bg-slate-700"
              />
            </div>

            {prediction.impact && (
              <div className="p-3 rounded-lg bg-slate-700/30">
                <h4 className="text-sm font-medium text-slate-200 mb-2 flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" />
                  Impacto Esperado
                </h4>
                <p className="text-xs text-slate-400">
                  {prediction.impact}
                </p>
              </div>
            )}

            {prediction.recommendations && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-200">
                  Recomendaciones
                </h4>
                <ul className="space-y-1">
                  {prediction.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-xs text-slate-400 flex items-start">
                      <span className="w-1 h-1 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Predicción para: {prediction.timeframe}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 hover:text-blue-300"
              >
                Ver detalles
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const PredictiveAnalytics = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const predictions = [
    {
      id: 1,
      type: 'academic_trend',
      title: 'Mejora en Rendimiento Matemático',
      category: 'Tendencia Académica',
      description: 'El análisis de datos indica una tendencia positiva en el rendimiento de matemáticas en 5to grado. Se espera un aumento del 15% en las calificaciones promedio en los próximos 2 meses.',
      confidence: 87,
      probability: 78,
      trend: 'positive',
      color: 'text-green-400',
      timeframe: 'Próximos 2 meses',
      impact: 'Aumento estimado del 15% en calificaciones promedio de matemáticas en 5to grado.',
      recommendations: [
        'Mantener las estrategias pedagógicas actuales',
        'Considerar replicar el modelo en otros grados',
        'Monitorear el progreso semanalmente'
      ]
    },
    {
      id: 2,
      type: 'emotional_wellbeing',
      title: 'Riesgo de Ansiedad en 3er Grado',
      category: 'Bienestar Emocional',
      description: 'Los patrones de comportamiento y las métricas emocionales sugieren un posible aumento en los niveles de ansiedad en estudiantes de 3er grado durante el próximo mes.',
      confidence: 72,
      probability: 65,
      trend: 'negative',
      color: 'text-orange-400',
      timeframe: 'Próximo mes',
      impact: 'Posible aumento del 20% en reportes de ansiedad estudiantil.',
      recommendations: [
        'Implementar sesiones de relajación semanales',
        'Capacitar a docentes en técnicas de manejo de ansiedad',
        'Establecer protocolo de seguimiento emocional'
      ]
    },
    {
      id: 3,
      type: 'attendance_pattern',
      title: 'Optimización de Horarios',
      category: 'Eficiencia Operativa',
      description: 'El análisis de patrones de asistencia sugiere que ajustar los horarios de inicio en 30 minutos podría mejorar la asistencia en un 8%.',
      confidence: 91,
      probability: 85,
      trend: 'positive',
      color: 'text-blue-400',
      timeframe: 'Próximo trimestre',
      impact: 'Mejora del 8% en tasa de asistencia general.',
      recommendations: [
        'Realizar encuesta a padres sobre horarios preferidos',
        'Implementar período de prueba de 1 mes',
        'Evaluar impacto en transporte escolar'
      ]
    },
    {
      id: 4,
      type: 'resource_optimization',
      title: 'Necesidad de Recursos Adicionales',
      category: 'Gestión de Recursos',
      description: 'Basado en el crecimiento de la población estudiantil y las necesidades identificadas, se recomienda contratar 2 psicopedagogos adicionales para el próximo año escolar.',
      confidence: 84,
      probability: 70,
      trend: 'positive',
      color: 'text-purple-400',
      timeframe: 'Próximo año escolar',
      impact: 'Mejora del 40% en la capacidad de atención psicopedagógica.',
      recommendations: [
        'Iniciar proceso de selección en 3 meses',
        'Presupuestar recursos para nuevas contrataciones',
        'Planificar distribución de cargas de trabajo'
      ]
    }
  ];

  const handleRefreshAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
            Análisis Predictivo con IA
          </h2>
          <p className="text-slate-400 mt-1">
            Predicciones inteligentes basadas en análisis de datos y patrones históricos
          </p>
        </div>
        <Button
          onClick={handleRefreshAnalysis}
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Analizando...' : 'Actualizar Análisis'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {predictions.map((prediction, index) => (
          <PredictionCard key={prediction.id} prediction={prediction} index={index} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-lg p-6 border border-slate-700/60"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <Brain className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-200">
              Motor de IA KARY CORE
            </h3>
            <p className="text-sm text-slate-400">
              Procesando 15,000+ puntos de datos en tiempo real
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">94.2%</div>
            <div className="text-xs text-slate-500">Precisión Predictiva</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">2.3s</div>
            <div className="text-xs text-slate-500">Tiempo de Análisis</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">24/7</div>
            <div className="text-xs text-slate-500">Monitoreo Continuo</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PredictiveAnalytics;

