import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  FileText, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Users,
  BookOpen,
  Heart,
  Settings,
  BarChart3,
  Lightbulb,
  Zap
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import geminiDashboardService from '@/services/geminiDashboardService';

const PiarAnalysisSystem = ({ studentId, studentData, piarData, onAnalysisComplete }) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [extractedInsights, setExtractedInsights] = useState(null);

  // Estados para diferentes tipos de análisis
  const [academicAnalysis, setAcademicAnalysis] = useState(null);
  const [emotionalAnalysis, setEmotionalAnalysis] = useState(null);
  const [behavioralAnalysis, setBehavioralAnalysis] = useState(null);
  const [socialAnalysis, setSocialAnalysis] = useState(null);
  const [supportRecommendations, setSupportRecommendations] = useState(null);

  const analysisSteps = [
    { id: 'extract', name: 'Extracción de Datos', icon: FileText, color: 'blue' },
    { id: 'academic', name: 'Análisis Académico', icon: BookOpen, color: 'green' },
    { id: 'emotional', name: 'Análisis Emocional', icon: Heart, color: 'red' },
    { id: 'behavioral', name: 'Análisis Conductual', icon: Users, color: 'purple' },
    { id: 'social', name: 'Análisis Social', icon: Users, color: 'orange' },
    { id: 'recommendations', name: 'Recomendaciones', icon: Lightbulb, color: 'yellow' }
  ];

  const analyzePiarData = async () => {
    if (!piarData || !studentData) {
      toast({
        title: t('piar.analysis.errorTitle'),
        description: t('piar.analysis.noDataError'),
        variant: 'destructive'
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Paso 1: Extracción de datos del PIAR
      await updateProgress(16, 'Extrayendo datos del PIAR...');
      const extractedData = await extractPiarData(piarData, studentData);
      setExtractedInsights(extractedData);

      // Paso 2: Análisis académico
      await updateProgress(32, 'Analizando aspectos académicos...');
      const academic = await analyzeAcademicAspects(extractedData);
      setAcademicAnalysis(academic);

      // Paso 3: Análisis emocional
      await updateProgress(48, 'Analizando estado emocional...');
      const emotional = await analyzeEmotionalAspects(extractedData);
      setEmotionalAnalysis(emotional);

      // Paso 4: Análisis conductual
      await updateProgress(64, 'Analizando patrones conductuales...');
      const behavioral = await analyzeBehavioralAspects(extractedData);
      setBehavioralAnalysis(behavioral);

      // Paso 5: Análisis social
      await updateProgress(80, 'Analizando habilidades sociales...');
      const social = await analyzeSocialAspects(extractedData);
      setSocialAnalysis(social);

      // Paso 6: Generar recomendaciones
      await updateProgress(96, 'Generando recomendaciones...');
      const recommendations = await generateSupportRecommendations({
        academic: academic,
        emotional: emotional,
        behavioral: behavioral,
        social: social,
        studentData: studentData,
        piarData: piarData
      });
      setSupportRecommendations(recommendations);

      // Resultado final
      setAnalysisProgress(100);
      
      const finalResults = {
        extractedData,
        academicAnalysis: academic,
        emotionalAnalysis: emotional,
        behavioralAnalysis: behavioral,
        socialAnalysis: social,
        supportRecommendations: recommendations,
        generatedAt: new Date().toISOString(),
        studentId: studentId
      };

      setAnalysisResults(finalResults);

      toast({
        title: t('piar.analysis.successTitle'),
        description: t('piar.analysis.successMessage'),
        variant: 'default'
      });

      if (onAnalysisComplete) {
        onAnalysisComplete(finalResults);
      }

    } catch (error) {
      console.error('Error en análisis de PIAR:', error);
      toast({
        title: t('piar.analysis.errorTitle'),
        description: error.message || t('piar.analysis.errorMessage'),
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateProgress = async (progress, message) => {
    setAnalysisProgress(progress);
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const extractPiarData = async (piarData, studentData) => {
    try {
      const prompt = `Eres un especialista en análisis de PIAR (Plan Individual de Apoyo y Refuerzo). Analiza los siguientes datos y extrae información estructurada:

DATOS DEL ESTUDIANTE:
${JSON.stringify(studentData, null, 2)}

DATOS DEL PIAR:
${JSON.stringify(piarData, null, 2)}

Extrae y estructura la información en el siguiente formato JSON:

{
  "diagnostico_principal": "Diagnóstico principal identificado",
  "necesidades_especificas": ["Necesidad 1", "Necesidad 2"],
  "fortalezas_identificadas": ["Fortaleza 1", "Fortaleza 2"],
  "areas_desarrollo": ["Área 1", "Área 2"],
  "objetivos_piar": ["Objetivo 1", "Objetivo 2"],
  "adaptaciones_necesarias": ["Adaptación 1", "Adaptación 2"],
  "recursos_sugeridos": ["Recurso 1", "Recurso 2"],
  "contexto_familiar": "Contexto familiar relevante",
  "historial_academico": "Historial académico relevante",
  "observaciones_conductuales": "Observaciones conductuales importantes",
  "estado_emocional": "Estado emocional actual",
  "estilo_aprendizaje": "Estilo de aprendizaje identificado",
  "intereses_estudiante": ["Interés 1", "Interés 2"],
  "barreras_aprendizaje": ["Barrera 1", "Barrera 2"],
  "potencial_desarrollo": "Potencial de desarrollo identificado"
}`;

      const result = await geminiDashboardService.chatWithContext(
        prompt,
        'psychopedagogue',
        { type: 'piar_analysis', studentId: studentId },
        { full_name: 'Analista PIAR', role: 'psychopedagogue' }
      );

      if (result.success) {
        try {
          const cleanText = result.data.message.replace(/```json\n?|\n?```/g, '').trim();
          return JSON.parse(cleanText);
        } catch (parseError) {
          console.warn('Error parseando JSON, usando texto completo');
          return { rawAnalysis: result.data.message };
        }
      } else {
        throw new Error(result.error || 'Error en extracción de datos');
      }
    } catch (error) {
      console.error('Error extrayendo datos del PIAR:', error);
      throw error;
    }
  };

  const analyzeAcademicAspects = async (extractedData) => {
    try {
      const prompt = `Como especialista en análisis académico, analiza los siguientes datos extraídos del PIAR y proporciona un análisis académico detallado:

DATOS EXTRAÍDOS:
${JSON.stringify(extractedData, null, 2)}

Proporciona análisis en formato JSON:

{
  "nivel_academico_actual": "Nivel académico actual del estudiante",
  "fortalezas_academicas": ["Fortaleza académica 1", "Fortaleza académica 2"],
  "dificultades_academicas": ["Dificultad 1", "Dificultad 2"],
  "materias_fuertes": ["Materia 1", "Materia 2"],
  "materias_desafio": ["Materia 1", "Materia 2"],
  "estilo_aprendizaje_identificado": "Estilo de aprendizaje principal",
  "adaptaciones_academicas_necesarias": ["Adaptación 1", "Adaptación 2"],
  "objetivos_academicos_sugeridos": ["Objetivo 1", "Objetivo 2"],
  "estrategias_ensenanza_recomendadas": ["Estrategia 1", "Estrategia 2"],
  "recursos_academicos_necesarios": ["Recurso 1", "Recurso 2"],
  "evaluacion_academica_sugerida": "Tipo de evaluación recomendada",
  "progreso_academico_esperado": "Progreso académico esperado"
}`;

      const result = await geminiDashboardService.chatWithContext(
        prompt,
        'psychopedagogue',
        { type: 'academic_analysis', studentId: studentId },
        { full_name: 'Analista Académico', role: 'psychopedagogue' }
      );

      if (result.success) {
        try {
          const cleanText = result.data.message.replace(/```json\n?|\n?```/g, '').trim();
          return JSON.parse(cleanText);
        } catch (parseError) {
          return { rawAnalysis: result.data.message };
        }
      } else {
        throw new Error(result.error || 'Error en análisis académico');
      }
    } catch (error) {
      console.error('Error en análisis académico:', error);
      throw error;
    }
  };

  const analyzeEmotionalAspects = async (extractedData) => {
    try {
      const prompt = `Como especialista en análisis emocional, analiza los siguientes datos del PIAR y proporciona un análisis emocional detallado:

DATOS EXTRAÍDOS:
${JSON.stringify(extractedData, null, 2)}

Proporciona análisis en formato JSON:

{
  "estado_emocional_actual": "Estado emocional actual del estudiante",
  "fortalezas_emocionales": ["Fortaleza emocional 1", "Fortaleza emocional 2"],
  "areas_emocionales_desafio": ["Área 1", "Área 2"],
  "factores_estresantes": ["Factor 1", "Factor 2"],
  "estrategias_regulacion_actuales": ["Estrategia 1", "Estrategia 2"],
  "necesidades_apoyo_emocional": ["Necesidad 1", "Necesidad 2"],
  "objetivos_desarrollo_emocional": ["Objetivo 1", "Objetivo 2"],
  "intervenciones_emocionales_sugeridas": ["Intervención 1", "Intervención 2"],
  "recursos_apoyo_emocional": ["Recurso 1", "Recurso 2"],
  "indicadores_progreso_emocional": ["Indicador 1", "Indicador 2"],
  "colaboracion_familia_emocional": "Cómo involucrar a la familia",
  "riesgos_emocionales": ["Riesgo 1", "Riesgo 2"]
}`;

      const result = await geminiDashboardService.chatWithContext(
        prompt,
        'psychopedagogue',
        { type: 'emotional_analysis', studentId: studentId },
        { full_name: 'Analista Emocional', role: 'psychopedagogue' }
      );

      if (result.success) {
        try {
          const cleanText = result.data.message.replace(/```json\n?|\n?```/g, '').trim();
          return JSON.parse(cleanText);
        } catch (parseError) {
          return { rawAnalysis: result.data.message };
        }
      } else {
        throw new Error(result.error || 'Error en análisis emocional');
      }
    } catch (error) {
      console.error('Error en análisis emocional:', error);
      throw error;
    }
  };

  const analyzeBehavioralAspects = async (extractedData) => {
    try {
      const prompt = `Como especialista en análisis conductual, analiza los siguientes datos del PIAR y proporciona un análisis conductual detallado:

DATOS EXTRAÍDOS:
${JSON.stringify(extractedData, null, 2)}

Proporciona análisis en formato JSON:

{
  "patrones_conductuales_identificados": ["Patrón 1", "Patrón 2"],
  "comportamientos_positivos": ["Comportamiento 1", "Comportamiento 2"],
  "comportamientos_desafio": ["Comportamiento 1", "Comportamiento 2"],
  "factores_desencadenantes": ["Factor 1", "Factor 2"],
  "estrategias_manejo_actuales": ["Estrategia 1", "Estrategia 2"],
  "necesidades_apoyo_conductual": ["Necesidad 1", "Necesidad 2"],
  "objetivos_desarrollo_conductual": ["Objetivo 1", "Objetivo 2"],
  "intervenciones_conductuales_sugeridas": ["Intervención 1", "Intervención 2"],
  "sistema_refuerzo_recomendado": "Sistema de refuerzo sugerido",
  "recursos_apoyo_conductual": ["Recurso 1", "Recurso 2"],
  "colaboracion_equipo_conductual": "Cómo coordinar con el equipo",
  "monitoreo_progreso_conductual": "Cómo monitorear el progreso"
}`;

      const result = await geminiDashboardService.chatWithContext(
        prompt,
        'psychopedagogue',
        { type: 'behavioral_analysis', studentId: studentId },
        { full_name: 'Analista Conductual', role: 'psychopedagogue' }
      );

      if (result.success) {
        try {
          const cleanText = result.data.message.replace(/```json\n?|\n?```/g, '').trim();
          return JSON.parse(cleanText);
        } catch (parseError) {
          return { rawAnalysis: result.data.message };
        }
      } else {
        throw new Error(result.error || 'Error en análisis conductual');
      }
    } catch (error) {
      console.error('Error en análisis conductual:', error);
      throw error;
    }
  };

  const analyzeSocialAspects = async (extractedData) => {
    try {
      const prompt = `Como especialista en análisis social, analiza los siguientes datos del PIAR y proporciona un análisis social detallado:

DATOS EXTRAÍDOS:
${JSON.stringify(extractedData, null, 2)}

Proporciona análisis en formato JSON:

{
  "habilidades_sociales_actuales": ["Habilidad 1", "Habilidad 2"],
  "fortalezas_sociales": ["Fortaleza 1", "Fortaleza 2"],
  "areas_desarrollo_social": ["Área 1", "Área 2"],
  "relaciones_interpersonales": "Estado de las relaciones interpersonales",
  "participacion_grupal": "Nivel de participación en grupos",
  "comunicacion_social": "Habilidades de comunicación social",
  "necesidades_apoyo_social": ["Necesidad 1", "Necesidad 2"],
  "objetivos_desarrollo_social": ["Objetivo 1", "Objetivo 2"],
  "estrategias_desarrollo_social": ["Estrategia 1", "Estrategia 2"],
  "actividades_sociales_sugeridas": ["Actividad 1", "Actividad 2"],
  "colaboracion_comunidad": "Cómo involucrar a la comunidad",
  "indicadores_progreso_social": ["Indicador 1", "Indicador 2"]
}`;

      const result = await geminiDashboardService.chatWithContext(
        prompt,
        'psychopedagogue',
        { type: 'social_analysis', studentId: studentId },
        { full_name: 'Analista Social', role: 'psychopedagogue' }
      );

      if (result.success) {
        try {
          const cleanText = result.data.message.replace(/```json\n?|\n?```/g, '').trim();
          return JSON.parse(cleanText);
        } catch (parseError) {
          return { rawAnalysis: result.data.message };
        }
      } else {
        throw new Error(result.error || 'Error en análisis social');
      }
    } catch (error) {
      console.error('Error en análisis social:', error);
      throw error;
    }
  };

  const generateSupportRecommendations = async (analysisData) => {
    try {
      const prompt = `Como especialista en psicopedagogía, analiza todos los datos de análisis y genera recomendaciones específicas para el plan de apoyo:

ANÁLISIS ACADÉMICO:
${JSON.stringify(analysisData.academic, null, 2)}

ANÁLISIS EMOCIONAL:
${JSON.stringify(analysisData.emotional, null, 2)}

ANÁLISIS CONDUCTUAL:
${JSON.stringify(analysisData.behavioral, null, 2)}

ANÁLISIS SOCIAL:
${JSON.stringify(analysisData.social, null, 2)}

DATOS DEL ESTUDIANTE:
${JSON.stringify(analysisData.studentData, null, 2)}

DATOS DEL PIAR:
${JSON.stringify(analysisData.piarData, null, 2)}

Genera recomendaciones específicas en formato JSON:

{
  "prioridades_intervencion": ["Prioridad 1", "Prioridad 2", "Prioridad 3"],
  "objetivos_generales": ["Objetivo general 1", "Objetivo general 2"],
  "estrategias_principales": ["Estrategia 1", "Estrategia 2", "Estrategia 3"],
  "actividades_especificas": ["Actividad 1", "Actividad 2", "Actividad 3"],
  "adaptaciones_necesarias": ["Adaptación 1", "Adaptación 2"],
  "recursos_requeridos": ["Recurso 1", "Recurso 2", "Recurso 3"],
  "colaboracion_equipo": "Cómo coordinar con el equipo",
  "involucramiento_familia": "Cómo involucrar a la familia",
  "evaluacion_progreso": "Cómo evaluar el progreso",
  "cronograma_sugerido": "Cronograma de implementación",
  "indicadores_exito": ["Indicador 1", "Indicador 2", "Indicador 3"],
  "riesgos_potenciales": ["Riesgo 1", "Riesgo 2"],
  "estrategias_mitigacion": ["Estrategia 1", "Estrategia 2"]
}`;

      const result = await geminiDashboardService.chatWithContext(
        prompt,
        'psychopedagogue',
        { type: 'support_recommendations', studentId: studentId },
        { full_name: 'Especialista en Apoyo', role: 'psychopedagogue' }
      );

      if (result.success) {
        try {
          const cleanText = result.data.message.replace(/```json\n?|\n?```/g, '').trim();
          return JSON.parse(cleanText);
        } catch (parseError) {
          return { rawRecommendations: result.data.message };
        }
      } else {
        throw new Error(result.error || 'Error generando recomendaciones');
      }
    } catch (error) {
      console.error('Error generando recomendaciones:', error);
      throw error;
    }
  };

  const renderAnalysisStep = (step, isActive, isCompleted) => {
    const StepIcon = step.icon;
    return (
      <motion.div
        key={step.id}
        className={`flex items-center space-x-2 p-2 rounded-lg ${
          isActive ? 'bg-blue-50 border border-blue-200' :
          isCompleted ? 'bg-green-50 border border-green-200' :
          'bg-gray-50 border border-gray-200'
        }`}
        animate={{ scale: isActive ? 1.02 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className={`p-2 rounded-full ${
          isActive ? 'bg-blue-500 text-white' :
          isCompleted ? 'bg-green-500 text-white' :
          'bg-gray-300 text-gray-600'
        }`}>
          <StepIcon className="h-4 w-4" />
        </div>
        <span className={`text-sm font-medium ${
          isActive ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-gray-600'
        }`}>
          {step.name}
        </span>
      </motion.div>
    );
  };

  const renderAnalysisResults = () => {
    if (!analysisResults) return null;

    return (
      <div className="space-y-6">
        {/* Resumen de Análisis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <span>Resumen del Análisis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <BookOpen className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="font-semibold text-green-700">Análisis Académico</p>
                <p className="text-sm text-green-600">Completado</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="font-semibold text-red-700">Análisis Emocional</p>
                <p className="text-sm text-red-600">Completado</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="font-semibold text-purple-700">Análisis Conductual</p>
                <p className="text-sm text-purple-600">Completado</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Users className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <p className="font-semibold text-orange-700">Análisis Social</p>
                <p className="text-sm text-orange-600">Completado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recomendaciones de Apoyo */}
        {supportRecommendations && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <span>Recomendaciones de Apoyo</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supportRecommendations.prioridades_intervencion && (
                  <div>
                    <h4 className="font-semibold mb-2">Prioridades de Intervención:</h4>
                    <div className="flex flex-wrap gap-2">
                      {supportRecommendations.prioridades_intervencion.map((priority, index) => (
                        <Badge key={index} variant="default" className="bg-blue-500">
                          {priority}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {supportRecommendations.objetivos_generales && (
                  <div>
                    <h4 className="font-semibold mb-2">Objetivos Generales:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {supportRecommendations.objetivos_generales.map((objective, index) => (
                        <li key={index} className="text-sm">{objective}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {supportRecommendations.estrategias_principales && (
                  <div>
                    <h4 className="font-semibold mb-2">Estrategias Principales:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {supportRecommendations.estrategias_principales.map((strategy, index) => (
                        <li key={index} className="text-sm">{strategy}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-500" />
            <span>Sistema de Análisis de PIAR</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Analiza los datos del PIAR para extraer información específica y generar recomendaciones para planes de apoyo.
          </p>
          
          <Button 
            onClick={analyzePiarData} 
            disabled={isAnalyzing || !piarData}
            className="w-full"
          >
            <Brain className="h-4 w-4 mr-2" />
            {isAnalyzing ? 'Analizando...' : 'Iniciar Análisis'}
          </Button>
        </CardContent>
      </Card>

      {/* Progress */}
      {isAnalyzing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progreso del Análisis</span>
                <span>{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} className="w-full" />
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {analysisSteps.map((step, index) => {
                  const isActive = Math.round(analysisProgress / 16.67) === index + 1;
                  const isCompleted = Math.round(analysisProgress / 16.67) > index + 1;
                  return renderAnalysisStep(step, isActive, isCompleted);
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {analysisResults && renderAnalysisResults()}
    </div>
  );
};

export default PiarAnalysisSystem;
