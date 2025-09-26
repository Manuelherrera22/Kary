import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  FileText, 
  Target, 
  Users, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Download,
  Save,
  Send,
  BookOpen,
  Heart,
  Settings,
  Zap,
  Lightbulb,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useMockAuth } from '@/contexts/MockAuthContext';
import geminiDashboardService from '@/services/geminiDashboardService';

const AdvancedSupportPlanGenerator = ({ 
  isOpen, 
  onOpenChange, 
  studentId, 
  studentData, 
  piarAnalysisResults,
  onPlanGenerated 
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user: authUser } = useMockAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  // Configuración del plan de apoyo
  const [planConfig, setPlanConfig] = useState({
    planType: 'comprehensive',
    duration: '6 months',
    priorityLevel: 'high',
    focusAreas: [],
    teamMembers: [],
    familyInvolvement: 'high',
    reviewFrequency: 'monthly',
    evaluationMethod: 'mixed'
  });

  // Datos específicos del plan
  const [planData, setPlanData] = useState({
    objectives: [],
    strategies: [],
    activities: [],
    resources: [],
    timeline: [],
    evaluationCriteria: [],
    riskFactors: [],
    mitigationStrategies: []
  });

  const steps = [
    { id: 1, title: 'Configuración del Plan', icon: Settings },
    { id: 2, title: 'Análisis de Datos PIAR', icon: BarChart3 },
    { id: 3, title: 'Generación con IA', icon: Brain },
    { id: 4, title: 'Revisión y Ajustes', icon: CheckCircle },
    { id: 5, title: 'Implementación', icon: Send }
  ];

  useEffect(() => {
    if (isOpen && piarAnalysisResults) {
      setCurrentStep(1);
      setGeneratedPlan(null);
      setProgress(0);
      setActiveTab('overview');
      
      // Inicializar configuración basada en análisis PIAR
      if (piarAnalysisResults.supportRecommendations) {
        const recommendations = piarAnalysisResults.supportRecommendations;
        setPlanConfig(prev => ({
          ...prev,
          focusAreas: recommendations.prioridades_intervencion || [],
          priorityLevel: recommendations.riesgos_potenciales?.length > 2 ? 'high' : 'medium'
        }));
      }
    }
  }, [isOpen, piarAnalysisResults]);

  const generateComprehensivePlan = async () => {
    if (!piarAnalysisResults || !studentData) {
      toast({
        title: t('supportPlan.generator.errorTitle'),
        description: t('supportPlan.generator.noDataError'),
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setCurrentStep(3);

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 800);

      // Preparar datos completos para Gemini
      const comprehensiveData = {
        studentData: studentData,
        piarAnalysis: piarAnalysisResults,
        planConfig: planConfig,
        context: {
          generatedBy: authUser?.full_name || 'Psicopedagogo',
          generatedAt: new Date().toISOString(),
          studentId: studentId,
          planType: 'comprehensive_support_plan'
        }
      };

      // Generar plan completo con Gemini AI
      const result = await geminiDashboardService.generateSupportPlan(
        studentData,
        piarAnalysisResults,
        comprehensiveData
      );

      clearInterval(progressInterval);
      setProgress(100);

      if (result.success) {
        // Procesar el plan generado
        const processedPlan = await processGeneratedPlan(result.data.supportPlan);
        setGeneratedPlan(processedPlan);
        setCurrentStep(4);
        
        toast({
          title: t('supportPlan.generator.successTitle'),
          description: t('supportPlan.generator.successMessage'),
          variant: 'default'
        });
      } else {
        throw new Error(result.error || 'Error generando plan de apoyo');
      }

    } catch (error) {
      console.error('Error generando plan de apoyo:', error);
      toast({
        title: t('supportPlan.generator.errorTitle'),
        description: error.message || t('supportPlan.generator.errorMessage'),
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const processGeneratedPlan = async (rawPlan) => {
    try {
      // Usar Gemini para estructurar el plan generado
      const prompt = `Eres un especialista en psicopedagogía. Estructura el siguiente plan de apoyo en formato JSON organizado:

PLAN GENERADO:
${rawPlan}

Estructura el plan en el siguiente formato JSON:

{
  "resumen_ejecutivo": "Resumen ejecutivo del plan",
  "objetivo_general": "Objetivo general del plan de apoyo",
  "objetivos_especificos": [
    {
      "area": "Área de intervención",
      "objetivo": "Objetivo específico",
      "indicadores": ["Indicador 1", "Indicador 2"],
      "tiempo": "Tiempo estimado"
    }
  ],
  "estrategias_intervencion": [
    {
      "tipo": "Tipo de estrategia",
      "descripcion": "Descripción detallada",
      "responsable": "Responsable de implementación",
      "recursos": ["Recurso 1", "Recurso 2"]
    }
  ],
  "actividades_especificas": [
    {
      "nombre": "Nombre de la actividad",
      "descripcion": "Descripción detallada",
      "objetivo": "Objetivo de la actividad",
      "frecuencia": "Frecuencia de implementación",
      "duracion": "Duración estimada",
      "materiales": ["Material 1", "Material 2"]
    }
  ],
  "cronograma_implementacion": [
    {
      "fase": "Fase del plan",
      "actividades": ["Actividad 1", "Actividad 2"],
      "tiempo": "Tiempo estimado",
      "responsable": "Responsable"
    }
  ],
  "sistema_evaluacion": {
    "metodos": ["Método 1", "Método 2"],
    "frecuencia": "Frecuencia de evaluación",
    "instrumentos": ["Instrumento 1", "Instrumento 2"],
    "criterios_exito": ["Criterio 1", "Criterio 2"]
  },
  "recursos_necesarios": {
    "humanos": ["Recurso humano 1", "Recurso humano 2"],
    "materiales": ["Material 1", "Material 2"],
    "espacios": ["Espacio 1", "Espacio 2"],
    "tecnologicos": ["Tecnología 1", "Tecnología 2"]
  },
  "colaboracion_equipo": {
    "roles": ["Rol 1", "Rol 2"],
    "responsabilidades": ["Responsabilidad 1", "Responsabilidad 2"],
    "comunicacion": "Estrategia de comunicación",
    "coordinacion": "Estrategia de coordinación"
  },
  "involucramiento_familia": {
    "estrategias": ["Estrategia 1", "Estrategia 2"],
    "actividades": ["Actividad 1", "Actividad 2"],
    "comunicacion": "Estrategia de comunicación familiar",
    "seguimiento": "Estrategia de seguimiento familiar"
  },
  "gestion_riesgos": {
    "riesgos_identificados": ["Riesgo 1", "Riesgo 2"],
    "estrategias_mitigacion": ["Estrategia 1", "Estrategia 2"],
    "planes_contingencia": ["Plan 1", "Plan 2"]
  },
  "indicadores_progreso": [
    {
      "indicador": "Indicador de progreso",
      "medicion": "Cómo se mide",
      "frecuencia": "Frecuencia de medición",
      "meta": "Meta esperada"
    }
  ],
  "revision_seguimiento": {
    "frecuencia": "Frecuencia de revisión",
    "participantes": ["Participante 1", "Participante 2"],
    "ajustes": "Proceso de ajustes",
    "documentacion": "Proceso de documentación"
  }
}`;

      const result = await geminiDashboardService.chatWithContext(
        prompt,
        'psychopedagogue',
        { type: 'plan_structure', studentId: studentId },
        { full_name: 'Estructurador de Planes', role: 'psychopedagogue' }
      );

      if (result.success) {
        try {
          const cleanText = result.data.message.replace(/```json\n?|\n?```/g, '').trim();
          const structuredPlan = JSON.parse(cleanText);
          return {
            rawPlan: rawPlan,
            structuredPlan: structuredPlan,
            generatedAt: new Date().toISOString(),
            studentId: studentId,
            generatedBy: authUser?.id
          };
        } catch (parseError) {
          console.warn('Error parseando plan estructurado, usando plan raw');
          return {
            rawPlan: rawPlan,
            structuredPlan: null,
            generatedAt: new Date().toISOString(),
            studentId: studentId,
            generatedBy: authUser?.id
          };
        }
      } else {
        return {
          rawPlan: rawPlan,
          structuredPlan: null,
          generatedAt: new Date().toISOString(),
          studentId: studentId,
          generatedBy: authUser?.id
        };
      }
    } catch (error) {
      console.error('Error procesando plan:', error);
      return {
        rawPlan: rawPlan,
        structuredPlan: null,
        generatedAt: new Date().toISOString(),
        studentId: studentId,
        generatedBy: authUser?.id
      };
    }
  };

  const saveSupportPlan = async () => {
    if (!generatedPlan || !studentId) return;

    try {
      const planData = {
        student_id: studentId,
        plan_content: generatedPlan.rawPlan,
        plan_structure: generatedPlan.structuredPlan,
        plan_type: planConfig.planType,
        status: 'active',
        created_by: authUser.id,
        created_at: new Date().toISOString(),
        metadata: {
          config: planConfig,
          piarAnalysis: piarAnalysisResults,
          generatedBy: 'AI',
          version: '2.0'
        }
      };

      const { error } = await supabase
        .from('support_plans')
        .insert(planData);

      if (error) throw error;

      toast({
        title: t('supportPlan.generator.saveSuccessTitle'),
        description: t('supportPlan.generator.saveSuccessMessage'),
        variant: 'default'
      });

      if (onPlanGenerated) {
        onPlanGenerated(planData);
      }

      onOpenChange(false);

    } catch (error) {
      console.error('Error guardando plan de apoyo:', error);
      toast({
        title: t('supportPlan.generator.saveErrorTitle'),
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const downloadPlan = () => {
    if (!generatedPlan) return;

    const element = document.createElement('a');
    const file = new Blob([generatedPlan.rawPlan], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Plan_Apoyo_${studentData?.full_name}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-blue-500" />
                  <span>Configuración del Plan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Tipo de Plan</label>
                    <Badge variant="outline" className="ml-2">
                      {planConfig.planType === 'comprehensive' ? 'Comprehensivo' : planConfig.planType}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duración</label>
                    <Badge variant="outline" className="ml-2">
                      {planConfig.duration}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nivel de Prioridad</label>
                    <Badge 
                      variant="outline" 
                      className={`ml-2 ${
                        planConfig.priorityLevel === 'high' ? 'border-red-500 text-red-500' :
                        planConfig.priorityLevel === 'medium' ? 'border-yellow-500 text-yellow-500' :
                        'border-green-500 text-green-500'
                      }`}
                    >
                      {planConfig.priorityLevel}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Áreas de Enfoque</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {planConfig.focusAreas.map((area, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  <span>Análisis de Datos PIAR</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {piarAnalysisResults ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <BookOpen className="h-6 w-6 text-green-500 mx-auto mb-1" />
                        <p className="text-xs font-medium text-green-700">Académico</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <Heart className="h-6 w-6 text-red-500 mx-auto mb-1" />
                        <p className="text-xs font-medium text-red-700">Emocional</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <Users className="h-6 w-6 text-purple-500 mx-auto mb-1" />
                        <p className="text-xs font-medium text-purple-700">Conductual</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <Users className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                        <p className="text-xs font-medium text-orange-700">Social</p>
                      </div>
                    </div>
                    
                    {piarAnalysisResults.supportRecommendations && (
                      <div>
                        <h4 className="font-semibold mb-2">Prioridades Identificadas:</h4>
                        <div className="flex flex-wrap gap-2">
                          {piarAnalysisResults.supportRecommendations.prioridades_intervencion?.map((priority, index) => (
                            <Badge key={index} variant="default" className="bg-blue-500">
                              {priority}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No hay datos de análisis PIAR disponibles
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Brain className="h-16 w-16 text-blue-500 animate-pulse" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Generando Plan de Apoyo</h3>
              <p className="text-gray-600">Analizando datos del PIAR y generando plan personalizado...</p>
            </div>
            
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-500">{Math.round(progress)}% completado</p>
            </div>
            
            {isGenerating && (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Procesando con IA...</span>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">Plan Generado Exitosamente</span>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="detailed">Detallado</TabsTrigger>
                <TabsTrigger value="implementation">Implementación</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Resumen del Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {generatedPlan?.structuredPlan?.resumen_ejecutivo ? (
                      <p className="text-sm">{generatedPlan.structuredPlan.resumen_ejecutivo}</p>
                    ) : (
                      <p className="text-sm text-gray-500">Resumen no disponible</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Objetivo General</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {generatedPlan?.structuredPlan?.objetivo_general ? (
                      <p className="text-sm">{generatedPlan.structuredPlan.objetivo_general}</p>
                    ) : (
                      <p className="text-sm text-gray-500">Objetivo general no disponible</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="detailed" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Plan Completo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm">
                        {generatedPlan?.rawPlan || 'Plan no disponible'}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="implementation" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Estrategias de Implementación</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {generatedPlan?.structuredPlan?.estrategias_intervencion ? (
                      <div className="space-y-3">
                        {generatedPlan.structuredPlan.estrategias_intervencion.map((strategy, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <h4 className="font-semibold">{strategy.tipo}</h4>
                            <p className="text-sm text-gray-600">{strategy.descripcion}</p>
                            <div className="mt-2">
                              <span className="text-xs font-medium">Responsable: </span>
                              <span className="text-xs">{strategy.responsable}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Estrategias no disponibles</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="flex space-x-2">
              <Button onClick={downloadPlan} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
              <Button onClick={saveSupportPlan}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Plan
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2 text-green-600">Plan Implementado</h3>
              <p className="text-gray-600">El plan de apoyo ha sido guardado y está listo para implementación.</p>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <p className="font-semibold">Objetivos Definidos</p>
                      <p className="text-sm text-gray-600">Claros y medibles</p>
                    </div>
                    <div>
                      <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="font-semibold">Equipo Asignado</p>
                      <p className="text-sm text-gray-600">Roles definidos</p>
                    </div>
                    <div>
                      <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <p className="font-semibold">Cronograma Establecido</p>
                      <p className="text-sm text-gray-600">Fechas definidas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-500" />
            <span>Generador Avanzado de Planes de Apoyo</span>
          </DialogTitle>
          <DialogDescription>
            Genera planes de apoyo personalizados basados en análisis de PIAR con IA
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive ? 'border-blue-500 bg-blue-500 text-white' :
                  isCompleted ? 'border-green-500 bg-green-500 text-white' :
                  'border-gray-300 bg-white text-gray-500'
                }`}>
                  <StepIcon className="h-5 w-5" />
                </div>
                <div className="ml-2">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="min-h-[500px]">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1 || isGenerating}
          >
            Anterior
          </Button>
          
          <div className="flex space-x-2">
            {currentStep < 3 && (
              <Button onClick={() => setCurrentStep(currentStep + 1)}>
                Siguiente
              </Button>
            )}
            
            {currentStep === 2 && (
              <Button onClick={generateComprehensivePlan} disabled={isGenerating || !piarAnalysisResults}>
                <Brain className="h-4 w-4 mr-2" />
                Generar Plan
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSupportPlanGenerator;
