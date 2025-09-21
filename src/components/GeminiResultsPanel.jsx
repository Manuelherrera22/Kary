import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { generatePersonalizedRecommendations } from '@/services/geminiActivityService';
import { 
  Trophy, 
  Star, 
  Target, 
  Clock, 
  TrendingUp,
  BookOpen,
  Sparkles,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  Download,
  Share
} from 'lucide-react';

const GeminiResultsPanel = ({ 
  activityResults, 
  isOpen, 
  onClose, 
  onStartNewActivity 
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { userProfile } = useMockAuth();
  
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

  useEffect(() => {
    const generateRecommendations = async () => {
      if (isOpen && activityResults) {
        setIsLoading(true);
        try {
          const response = await generatePersonalizedRecommendations(
            activityResults,
            userProfile
          );
          
          if (response.success) {
            setRecommendations(response.data);
          } else {
            console.error('Error generando recomendaciones:', response.error);
            setRecommendations(generateMockRecommendations());
          }
        } catch (error) {
          console.error('Error generando recomendaciones:', error);
          setRecommendations(generateMockRecommendations());
        } finally {
          setIsLoading(false);
        }
      }
    };

    generateRecommendations();
  }, [isOpen, activityResults, userProfile]);

  const generateMockRecommendations = () => ({
    performanceAnalysis: "Has completado la actividad con éxito. Tu rendimiento muestra dedicación y esfuerzo.",
    strengths: ["Dedicación", "Esfuerzo", "Persistencia"],
    areasForImprovement: ["Velocidad", "Precisión"],
    recommendedActivities: [
      {
        title: "Actividad de Práctica",
        reason: "Para mejorar la velocidad",
        difficulty: "intermediate"
      }
    ],
    studyStrategies: ["Practicar regularmente", "Revisar conceptos básicos"],
    motivationalMessage: "¡Excelente trabajo! Sigue así.",
    nextSteps: "Continúa con las actividades recomendadas"
  });

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getPerformanceLevel = (score) => {
    if (score >= 90) return 'Excelente';
    if (score >= 70) return 'Bueno';
    if (score >= 50) return 'Regular';
    return 'Necesita Mejora';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        <Card className="border-0 bg-slate-900 h-full flex flex-col">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Trophy className="w-8 h-8 text-white mr-3" />
                <div>
                  <CardTitle className="text-2xl text-white">
                    🎉 ¡Actividad Completada!
                  </CardTitle>
                  <p className="text-white/90">
                    Resultados y recomendaciones personalizadas
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/20"
              >
                ✕
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
                  <p className="text-gray-300">
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    Generando análisis personalizado con Gemini AI...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Resultados Principales */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="p-4 text-center">
                      <div className={`text-3xl font-bold ${getPerformanceColor(activityResults.score || 0)}`}>
                        {activityResults.score || 0}
                      </div>
                      <div className="text-sm text-gray-400">Puntuación</div>
                      <Badge className={`mt-2 ${getPerformanceColor(activityResults.score || 0)}`}>
                        {getPerformanceLevel(activityResults.score || 0)}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-blue-400">
                        {Math.floor((activityResults.timeSpent || 0) / 60)}m
                      </div>
                      <div className="text-sm text-gray-400">Tiempo</div>
                      <Badge className="mt-2 bg-blue-600 text-white">
                        <Clock className="w-3 h-3 mr-1" />
                        Eficiente
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-purple-400">
                        {activityResults.accuracy || 0}%
                      </div>
                      <div className="text-sm text-gray-400">Precisión</div>
                      <Progress 
                        value={activityResults.accuracy || 0} 
                        className="mt-2 h-2"
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Análisis de Gemini */}
                {recommendations && (
                  <div className="space-y-4">
                    {/* Mensaje Motivacional */}
                    <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <Sparkles className="w-6 h-6 text-purple-400 mr-3 mt-1" />
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                              Mensaje de Kary (Gemini AI)
                            </h3>
                            <p className="text-gray-300">
                              {recommendations.motivationalMessage}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Análisis de Rendimiento */}
                    <Card className="bg-slate-800 border-slate-700">
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                          Análisis de Rendimiento
                        </h3>
                        <p className="text-gray-300 mb-4">
                          {recommendations.performanceAnalysis}
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Fortalezas */}
                          <div>
                            <h4 className="text-sm font-semibold text-green-400 mb-2">
                              ✅ Fortalezas Identificadas
                            </h4>
                            <ul className="space-y-1">
                              {recommendations.strengths.map((strength, index) => (
                                <li key={index} className="text-sm text-gray-300 flex items-center">
                                  <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Áreas de Mejora */}
                          <div>
                            <h4 className="text-sm font-semibold text-yellow-400 mb-2">
                              🎯 Áreas de Mejora
                            </h4>
                            <ul className="space-y-1">
                              {recommendations.areasForImprovement.map((area, index) => (
                                <li key={index} className="text-sm text-gray-300 flex items-center">
                                  <Target className="w-3 h-3 text-yellow-400 mr-2" />
                                  {area}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recomendaciones de Actividades */}
                    {recommendations.recommendedActivities && recommendations.recommendedActivities.length > 0 && (
                      <Card className="bg-slate-800 border-slate-700">
                        <CardContent className="p-4">
                          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                            <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                            Actividades Recomendadas
                          </h3>
                          <div className="space-y-3">
                            {recommendations.recommendedActivities.map((activity, index) => (
                              <div key={index} className="bg-slate-700 rounded-lg p-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-white">{activity.title}</h4>
                                    <p className="text-sm text-gray-300 mt-1">{activity.reason}</p>
                                  </div>
                                  <Badge 
                                    className={`${
                                      activity.difficulty === 'beginner' ? 'bg-green-600' :
                                      activity.difficulty === 'intermediate' ? 'bg-yellow-600' :
                                      'bg-red-600'
                                    } text-white`}
                                  >
                                    {activity.difficulty}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Estrategias de Estudio */}
                    {recommendations.studyStrategies && recommendations.studyStrategies.length > 0 && (
                      <Card className="bg-slate-800 border-slate-700">
                        <CardContent className="p-4">
                          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                            <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                            Estrategias de Estudio Personalizadas
                          </h3>
                          <ul className="space-y-2">
                            {recommendations.studyStrategies.map((strategy, index) => (
                              <li key={index} className="text-gray-300 flex items-center">
                                <ArrowRight className="w-4 h-4 text-yellow-400 mr-2" />
                                {strategy}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* Próximos Pasos */}
                    <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                          <ArrowRight className="w-5 h-5 mr-2 text-blue-400" />
                          Próximos Pasos
                        </h3>
                        <p className="text-gray-300">
                          {recommendations.nextSteps}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </CardContent>

          {/* Footer con Acciones */}
          <div className="bg-slate-800 p-6 border-t border-slate-700">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="text-gray-300 border-gray-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Reporte
                </Button>
                <Button
                  variant="outline"
                  className="text-gray-300 border-gray-600"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="text-gray-300 border-gray-600"
                >
                  Cerrar
                </Button>
                <Button
                  onClick={onStartNewActivity}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Nueva Actividad
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GeminiResultsPanel;
