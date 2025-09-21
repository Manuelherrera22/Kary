import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  analyzeDiagnosis, 
  generatePersonalizedActivities, 
  generateAutoSupportPlan 
} from '@/services/aiActivityGeneratorService';
import TeacherPlanSender from './TeacherPlanSender';
import { 
  Sparkles, 
  Brain, 
  Target, 
  Clock, 
  Users, 
  BookOpen,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Activity,
  Wand2,
  Zap,
  Send,
  Mail
} from 'lucide-react';

const AIActivityGenerator = ({ studentData, piarData, onActivitiesGenerated, onPlanGenerated }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showTeacherSender, setShowTeacherSender] = useState(false);

  const handleGenerateActivities = async () => {
    if (!piarData || !studentData) {
      toast({
        title: 'Error',
        description: 'No hay datos suficientes para generar actividades',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setGenerationStep('Analizando diagnóstico...');

    try {
      // Paso 1: Análisis de diagnóstico
      setIsAnalyzing(true);
      setGenerationStep('🤖 IA: Analizando perfil de aprendizaje...');
      
      const analysis = await analyzeDiagnosis(piarData.diagnostic_info);
      
      // Paso 2: Generación de actividades
      setGenerationStep('🎯 IA: Generando actividades personalizadas...');
      
      const activities = await generatePersonalizedActivities(piarData, analysis);
      
      // Paso 3: Crear plan completo
      setGenerationStep('📋 IA: Creando plan de implementación...');
      
      const plan = await generateAutoSupportPlan(studentData, piarData);
      
      setGeneratedPlan(plan);
      
      // Notificar componentes padre
      if (onActivitiesGenerated) {
        onActivitiesGenerated(activities);
      }
      
      if (onPlanGenerated) {
        onPlanGenerated(plan);
      }
      
      toast({
        title: '✅ Actividades Generadas',
        description: `IA ha generado ${activities.length} actividades personalizadas para ${studentData.full_name}`,
        variant: 'default',
      });
      
    } catch (error) {
      console.error('Error generando actividades:', error);
      toast({
        title: 'Error',
        description: 'Hubo un problema generando las actividades. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
      setIsAnalyzing(false);
      setGenerationStep('');
    }
  };

  const getStepIcon = (step) => {
    if (step.includes('Analizando')) return <Brain className="w-4 h-4" />;
    if (step.includes('Generando')) return <Wand2 className="w-4 h-4" />;
    if (step.includes('Creando')) return <Target className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const getStepColor = (step) => {
    if (step.includes('Analizando')) return 'text-blue-400';
    if (step.includes('Generando')) return 'text-purple-400';
    if (step.includes('Creando')) return 'text-green-400';
    return 'text-gray-400';
  };

  if (!piarData) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            PIAR Requerido
          </h3>
          <p className="text-gray-400">
            Se necesita un Plan Individual de Ajustes Razonables para generar actividades automáticamente.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Botón Principal de Generación */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Sparkles className="w-6 h-6 mr-3 text-purple-400" />
            Generador de Actividades con IA
          </CardTitle>
          <p className="text-gray-400">
            La IA analizará el diagnóstico y generará actividades personalizadas automáticamente
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Información del Estudiante */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-400 mr-2" />
                <span className="font-medium text-white">
                  {studentData?.full_name || 'Estudiante'}
                </span>
              </div>
              <Badge className="bg-purple-600 text-white">
                PIAR Activo
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Estilo de Aprendizaje:</span>
                <p className="text-white font-medium">
                  {piarData.diagnostic_info?.learning_style || 'No especificado'}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Atención:</span>
                <p className="text-white font-medium">
                  {piarData.diagnostic_info?.attention_span || 'No especificado'}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Necesidades:</span>
                <p className="text-white font-medium">
                  {piarData.specific_needs?.length || 0} identificadas
                </p>
              </div>
              <div>
                <span className="text-gray-400">Objetivos:</span>
                <p className="text-white font-medium">
                  {piarData.goals?.length || 0} establecidos
                </p>
              </div>
            </div>
          </div>

          {/* Botón de Generación */}
          <Button
            onClick={handleGenerateActivities}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg font-semibold"
          >
            {isGenerating ? (
              <>
                <Zap className="w-6 h-6 mr-3 animate-pulse" />
                Generando Actividades...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 mr-3" />
                🚀 Generar Actividades con IA
              </>
            )}
          </Button>

          {/* Progreso de Generación */}
          {isGenerating && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Progreso de IA:</span>
                <span className="text-purple-400">En proceso...</span>
              </div>
              <Progress value={isAnalyzing ? 33 : 66} className="h-2" />
              
              {generationStep && (
                <div className="flex items-center text-sm">
                  <div className={`mr-2 ${getStepColor(generationStep)}`}>
                    {getStepIcon(generationStep)}
                  </div>
                  <span className="text-gray-300">{generationStep}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resultados Generados */}
      {generatedPlan && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
              Plan Generado por IA
            </CardTitle>
            <p className="text-gray-400">
              {generatedPlan.title} - Generado el {new Date(generatedPlan.generatedAt).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Análisis de IA */}
            {generatedPlan.aiAnalysis && (
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-400" />
                  Análisis de IA
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400">Perfil de Aprendizaje:</span>
                    <p className="text-white">{generatedPlan.aiAnalysis.learningProfile.style}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Necesidades Prioritarias:</span>
                    <p className="text-white">{generatedPlan.aiAnalysis.priorityNeeds.length} identificadas</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Fortalezas Identificadas:</span>
                    <p className="text-white">{generatedPlan.aiAnalysis.strengths.length} detectadas</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actividades Generadas */}
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                Actividades Generadas ({generatedPlan.activities.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {generatedPlan.activities.slice(0, 4).map((activity, index) => (
                  <div key={activity.id} className="bg-slate-600/50 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white text-sm">
                        {activity.title}
                      </span>
                      <Badge className="bg-purple-600 text-white text-xs">
                        IA
                      </Badge>
                    </div>
                    <p className="text-gray-300 text-xs mb-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {activity.duration} min
                      <span className="mx-2">•</span>
                      <Target className="w-3 h-3 mr-1" />
                      {activity.difficulty}
                    </div>
                  </div>
                ))}
                {generatedPlan.activities.length > 4 && (
                  <div className="bg-slate-600/50 rounded p-3 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">
                      +{generatedPlan.activities.length - 4} actividades más...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Plan de Implementación */}
            {generatedPlan.implementation && (
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-green-400" />
                  Plan de Implementación
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400 text-sm">Prioridad:</span>
                    <p className="text-white font-medium">
                      {generatedPlan.implementation.priority}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Timeline:</span>
                    <p className="text-white font-medium">
                      {generatedPlan.implementation.timeline.shortTerm}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Monitoreo:</span>
                    <p className="text-white font-medium">
                      {generatedPlan.implementation.monitoring.frequency}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Recursos:</span>
                    <p className="text-white font-medium">
                      {generatedPlan.implementation.resources.materials.length} materiales
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Próximos Pasos */}
            {generatedPlan.nextSteps && (
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-400" />
                  Próximos Pasos
                </h4>
                <ul className="space-y-1">
                  {generatedPlan.nextSteps.slice(0, 3).map((step, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Botón para Enviar al Docente */}
            {generatedPlan && !showTeacherSender && (
              <div className="mt-6 pt-4 border-t border-slate-700">
                <Button
                  onClick={() => setShowTeacherSender(true)}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 text-lg font-semibold"
                >
                  <Send className="w-5 h-5 mr-3" />
                  📤 Enviar Plan al Docente
                </Button>
                <p className="text-center text-gray-400 text-sm mt-2">
                  Comunica este plan al docente para que implemente las actividades
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Componente de Envío al Docente */}
      {showTeacherSender && (
        <TeacherPlanSender
          generatedPlan={generatedPlan}
          onPlanSent={(communication) => {
            console.log('Plan enviado al docente:', communication);
            setShowTeacherSender(false);
            toast({
              title: 'Plan Enviado',
              description: 'El plan de apoyo ha sido enviado exitosamente al docente',
              variant: 'default',
            });
          }}
          onCancel={() => setShowTeacherSender(false)}
        />
      )}
    </div>
  );
};

export default AIActivityGenerator;
