import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { useStudentsData } from '@/hooks/useStudentsData';
import geminiDashboardService from '@/services/geminiDashboardService';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Target,
  Sparkles,
  RefreshCw,
  Lightbulb,
  BookOpen,
  Award,
  MessageCircle
} from 'lucide-react';

const TeacherGeminiInsights = ({ 
  showChat, 
  onToggleChat 
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { students, isLoading } = useStudentsData();
  
  const [insights, setInsights] = useState(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Generar insights cuando se cargan los estudiantes
  useEffect(() => {
    if (students.length > 0 && !isLoading) {
      generateInsights();
    }
  }, [students, isLoading]);

  const generateInsights = async () => {
    setIsLoadingInsights(true);
    try {
      // Preparar datos para Gemini
      const studentData = students.map(student => ({
        name: student.displayName || student.full_name,
        performance: Math.floor(Math.random() * 40) + 60, // Mock performance
        subjects: ['Matemáticas', 'Lectura', 'Escritura'],
        attendance: Math.floor(Math.random() * 20) + 80,
        behavior: Math.floor(Math.random() * 30) + 70
      }));

      const classPerformance = {
        averageScore: Math.floor(studentData.reduce((acc, s) => acc + s.performance, 0) / studentData.length),
        attendance: Math.floor(studentData.reduce((acc, s) => acc + s.attendance, 0) / studentData.length),
        behavior: Math.floor(studentData.reduce((acc, s) => acc + s.behavior, 0) / studentData.length)
      };

      const recentActivities = [
        { title: 'Matemáticas Básicas', completed: 15, total: 20 },
        { title: 'Lectura Comprensiva', completed: 12, total: 15 },
        { title: 'Escritura Creativa', completed: 8, total: 10 }
      ];

      const response = await geminiDashboardService.generateTeacherInsights(
        studentData,
        classPerformance,
        recentActivities
      );

      if (response.success) {
        setInsights(response.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error generando insights:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron generar los insights. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      default:
        return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  if (isLoadingInsights || (!insights && !isLoading)) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
            Insights Inteligentes con Gemini AI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
              <p className="text-gray-300">
                {isLoadingInsights ? 'Generando insights...' : 'Preparando análisis...'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
            Insights Inteligentes con Gemini AI
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={generateInsights}
              disabled={isLoadingInsights}
              className="text-gray-300 border-gray-600 hover:bg-slate-700"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingInsights ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleChat}
              className="text-blue-400 border-blue-600 hover:bg-blue-600/20"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat con Kary
            </Button>
          </div>
        </div>
        {lastUpdated && (
          <p className="text-sm text-gray-400">
            Última actualización: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {insights && (
          <>
            {/* Análisis de Rendimiento */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                Análisis de Rendimiento
              </h3>
              <p className="text-gray-300 bg-slate-700 p-4 rounded-lg">
                {insights.performanceAnalysis}
              </p>
            </div>

            {/* Top Performers */}
            {insights.topPerformers && insights.topPerformers.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-400" />
                  Estudiantes Destacados
                </h3>
                <div className="flex flex-wrap gap-2">
                  {insights.topPerformers.map((student, index) => (
                    <Badge key={index} className="bg-green-600 text-white">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {student}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Necesitan Atención */}
            {insights.needsAttention && insights.needsAttention.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-orange-400" />
                  Necesitan Atención
                </h3>
                <div className="flex flex-wrap gap-2">
                  {insights.needsAttention.map((student, index) => (
                    <Badge key={index} className="bg-orange-600 text-white">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {student}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Recomendaciones */}
            {insights.recommendations && insights.recommendations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-blue-400" />
                  Recomendaciones de Gemini
                </h3>
                <div className="space-y-3">
                  {insights.recommendations.map((rec, index) => (
                    <div key={index} className="bg-slate-700 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{rec.title}</h4>
                          <p className="text-sm text-gray-300 mt-1">{rec.description}</p>
                        </div>
                        <Badge 
                          className={`${
                            rec.priority === 'high' ? 'bg-red-600' :
                            rec.priority === 'medium' ? 'bg-yellow-600' :
                            'bg-green-600'
                          } text-white`}
                        >
                          {rec.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alertas */}
            {insights.alerts && insights.alerts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-purple-400" />
                  Alertas Inteligentes
                </h3>
                <div className="space-y-3">
                  {insights.alerts.map((alert, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}
                    >
                      <div className="flex items-start">
                        {getAlertIcon(alert.type)}
                        <div className="ml-3 flex-1">
                          <p className="text-sm text-gray-300">{alert.message}</p>
                          {alert.action && (
                            <p className="text-xs text-gray-400 mt-1">
                              <strong>Acción:</strong> {alert.action}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Próximos Pasos */}
            {insights.nextSteps && insights.nextSteps.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-indigo-400" />
                  Próximos Pasos Sugeridos
                </h3>
                <div className="space-y-2">
                  {insights.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-center text-gray-300">
                      <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center mr-3 text-xs font-bold text-white">
                        {index + 1}
                      </div>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TeacherGeminiInsights;
