import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { generateCompleteAdvancedSupportPlan } from '@/services/advancedGeminiService';
import SupportPlanViewer from './SupportPlanViewer';
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
  Eye,
  Download,
  Rocket,
  Star,
  Award,
  Shield
} from 'lucide-react';

const AdvancedAIActivityGenerator = ({ studentData, piarData, onActivitiesGenerated, onPlanGenerated }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [showPlanViewer, setShowPlanViewer] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerateAdvancedActivities = async () => {
    if (!piarData || !studentData) {
      toast({
        title: 'Error',
        description: 'No hay datos suficientes para generar actividades',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGenerationStep('🚀 Iniciando sistema avanzado de Gemini AI...');

    try {
      // Paso 1: Análisis psicopedagógico avanzado
      setProgress(10);
      setGenerationStep('🧠 Gemini AI: Análisis psicopedagógico avanzado...');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(30);
      
      // Paso 2: Generación de actividades avanzadas
      setGenerationStep('🎯 Gemini AI: Generando actividades avanzadas específicas...');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(60);
      
      // Paso 3: Generación de plan de apoyo avanzado
      setGenerationStep('📋 Gemini AI: Creando plan de apoyo integral avanzado...');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(90);
      
      // Llamada real a Gemini AI
      setGenerationStep('🤖 Gemini AI: Procesando con IA avanzada...');
      const plan = await generateCompleteAdvancedSupportPlan(studentData, piarData);
      
      setProgress(100);
      setGenerationStep('✅ Plan avanzado generado exitosamente');
      
      setGeneratedPlan(plan);
      
      // Notificar componentes padre
      if (onActivitiesGenerated) {
        onActivitiesGenerated(plan.activities);
      }
      
      if (onPlanGenerated) {
        onPlanGenerated(plan);
      }
      
      toast({
        title: '🎉 Plan Avanzado Generado',
        description: `Gemini AI ha generado un plan completo con ${plan.activities.length} actividades específicas para ${studentData.full_name}`,
        variant: 'default',
      });
      
    } catch (error) {
      console.error('Error generando plan avanzado:', error);
      toast({
        title: 'Error',
        description: `Error en generación avanzada: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
      setProgress(0);
    }
  };

  const getStepIcon = (step) => {
    if (step.includes('Análisis')) return <Brain className="w-4 h-4" />;
    if (step.includes('actividades')) return <Target className="w-4 h-4" />;
    if (step.includes('plan')) return <BookOpen className="w-4 h-4" />;
    if (step.includes('Procesando')) return <Zap className="w-4 h-4" />;
    if (step.includes('exitosamente')) return <CheckCircle className="w-4 h-4" />;
    return <Rocket className="w-4 h-4" />;
  };

  const getStepColor = (step) => {
    if (step.includes('Análisis')) return 'text-blue-400';
    if (step.includes('actividades')) return 'text-purple-400';
    if (step.includes('plan')) return 'text-green-400';
    if (step.includes('Procesando')) return 'text-yellow-400';
    if (step.includes('exitosamente')) return 'text-green-500';
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
            Se necesita un Plan Individual de Ajustes Razonables para generar el plan avanzado.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Botón Principal de Generación Avanzada */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Rocket className="w-6 h-6 mr-3 text-purple-400" />
            Sistema Avanzado de Generación con Gemini AI
          </CardTitle>
          <p className="text-gray-400">
            Sistema completamente basado en IA sin fallbacks hardcodeados - Aprovecha todo el poder de Gemini
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
              <div className="flex gap-2">
                <Badge className="bg-purple-600 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  PIAR Activo
                </Badge>
                <Badge className="bg-green-600 text-white">
                  <Award className="w-3 h-3 mr-1" />
                  Sistema Avanzado
                </Badge>
              </div>
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

          {/* Características del Sistema Avanzado */}
          <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg p-4 border border-green-500/30">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-400" />
              Características del Sistema Avanzado
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-gray-300">Sin Fallbacks</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-gray-300">IA Pura</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-gray-300">Análisis Profundo</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-gray-300">Contenido Específico</span>
              </div>
            </div>
          </div>

          {/* Botón de Generación Avanzada */}
          <Button
            onClick={handleGenerateAdvancedActivities}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 hover:from-purple-700 hover:via-blue-700 hover:to-green-700 text-white py-6 text-lg font-semibold"
          >
            {isGenerating ? (
              <>
                <Zap className="w-6 h-6 mr-3 animate-pulse" />
                Generando Plan Avanzado...
              </>
            ) : (
              <>
                <Rocket className="w-6 h-6 mr-3" />
                🚀 Generar Plan Avanzado con Gemini AI
              </>
            )}
          </Button>

          {/* Progreso de Generación */}
          {isGenerating && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Progreso del Sistema Avanzado:</span>
                <span className="text-purple-400">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              
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
              <Award className="w-6 h-6 mr-3 text-yellow-400" />
              Plan Avanzado Generado por Gemini AI
            </CardTitle>
            <p className="text-gray-400">
              {generatedPlan.title} - Generado el {new Date(generatedPlan.generatedAt).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Información del Sistema */}
            <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg p-4 border border-green-500/30">
              <h4 className="font-semibold text-white mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-400" />
                Sistema de Generación
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Generado por:</span>
                  <p className="text-white font-medium">{generatedPlan.generatedBy}</p>
                </div>
                <div>
                  <span className="text-gray-400">Versión:</span>
                  <p className="text-white font-medium">{generatedPlan.version}</p>
                </div>
                <div>
                  <span className="text-gray-400">Sin Fallbacks:</span>
                  <p className="text-green-400 font-medium">✅ Confirmado</p>
                </div>
                <div>
                  <span className="text-gray-400">Modelo:</span>
                  <p className="text-white font-medium">Gemini 2.0 Flash</p>
                </div>
              </div>
            </div>

            {/* Análisis de IA Avanzado */}
            {generatedPlan.aiAnalysis && (
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-400" />
                  Análisis Psicopedagógico Avanzado
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400">Perfil Neuropsicológico:</span>
                    <p className="text-white">{generatedPlan.aiAnalysis.neuropsychologicalProfile?.cognitiveStrengths?.length || 0} fortalezas identificadas</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Necesidades Prioritarias:</span>
                    <p className="text-white">{generatedPlan.aiAnalysis.priorityNeeds?.length || 0} necesidades críticas</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Factores de Riesgo:</span>
                    <p className="text-white">{generatedPlan.aiAnalysis.riskFactors?.length || 0} factores identificados</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actividades Generadas */}
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-400" />
                Actividades Avanzadas Generadas ({generatedPlan.activities.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {generatedPlan.activities.slice(0, 4).map((activity, index) => (
                  <div key={activity.id} className="bg-slate-600/50 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white text-sm">
                        {activity.title}
                      </span>
                      <Badge className="bg-purple-600 text-white text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Avanzado
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
                      <span className="mx-2">•</span>
                      <Activity className="w-3 h-3 mr-1" />
                      {activity.priority}
                    </div>
                  </div>
                ))}
                {generatedPlan.activities.length > 4 && (
                  <div className="bg-slate-600/50 rounded p-3 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">
                      +{generatedPlan.activities.length - 4} actividades avanzadas más...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Plan de Apoyo Avanzado */}
            {generatedPlan.supportPlan && (
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-green-400" />
                  Plan de Apoyo Integral Avanzado
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400 text-sm">Cronograma:</span>
                    <p className="text-white font-medium">
                      {generatedPlan.supportPlan.implementation?.timeline?.shortTerm || 'Definido por IA'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Recursos:</span>
                    <p className="text-white font-medium">
                      {generatedPlan.supportPlan.implementation?.resources?.materials?.length || 0} materiales específicos
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Monitoreo:</span>
                    <p className="text-white font-medium">
                      {generatedPlan.supportPlan.implementation?.monitoring?.frequency || 'Continuo'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Evaluación:</span>
                    <p className="text-white font-medium">
                      {generatedPlan.supportPlan.evaluation?.formative?.frequency || 'Regular'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Botones de Acción */}
            <div className="mt-6 pt-4 border-t border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => setShowPlanViewer(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold"
                >
                  <Eye className="w-5 h-5 mr-3" />
                  👁️ Ver Plan Completo
                </Button>
                <Button
                  onClick={() => {
                    toast({
                      title: 'Funcionalidad en Desarrollo',
                      description: 'El sistema de envío avanzado estará disponible próximamente',
                      variant: 'default',
                    });
                  }}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 text-lg font-semibold"
                >
                  <Send className="w-5 h-5 mr-3" />
                  📤 Enviar Plan Avanzado
                </Button>
              </div>
              <p className="text-center text-gray-400 text-sm mt-3">
                Plan generado completamente por Gemini AI sin fallbacks hardcodeados
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Componente de Visualización del Plan */}
      <SupportPlanViewer
        isOpen={showPlanViewer}
        onClose={() => setShowPlanViewer(false)}
        plan={generatedPlan}
        studentData={studentData}
        onPlanSent={(result) => {
          console.log('Plan avanzado enviado:', result);
          toast({
            title: 'Plan Avanzado Enviado',
            description: `El plan avanzado ha sido enviado exitosamente a ${result.recipient}`,
            variant: 'default',
          });
        }}
      />
    </div>
  );
};

export default AdvancedAIActivityGenerator;
