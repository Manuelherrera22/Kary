import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Sparkles, 
  Brain, 
  Target, 
  Rocket, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Star,
  Zap,
  Crown,
  Gem
} from 'lucide-react';
import { generateSupportPlan } from '../services/geminiDashboardService';
import { piarService } from '../services/piarService';
import SpectacularSupportPlanDisplay from './SpectacularSupportPlanDisplay';
import PiarBasedPlanDisplay from './PiarBasedPlanDisplay';

const SpectacularSupportPlanGenerator = ({ studentId, onPlanGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const [formData, setFormData] = useState({
    studentName: '',
    grade: '',
    planType: '',
    context: '',
    specificNeeds: '',
    strengths: '',
    challenges: '',
    goals: ''
  });

  const planTypes = [
    { value: 'academic', label: '🎓 Académico/Cognitivo', description: 'Enfoque en habilidades académicas y cognitivas' },
    { value: 'emotional', label: '💝 Emocional/Conductual', description: 'Desarrollo emocional y manejo conductual' },
    { value: 'social', label: '🤝 Social/Comunicativo', description: 'Habilidades sociales y comunicación' },
    { value: 'comprehensive', label: '🌟 Integral/Completo', description: 'Plan integral que abarca todas las áreas' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const simulateProgress = () => {
    const steps = [
      '🔍 Analizando perfil del estudiante...',
      '📋 Procesando datos del PIAR...',
      '🧠 Generando análisis psicopedagógico...',
      '🎯 Definiendo objetivos estratégicos...',
      '🚀 Creando estrategias innovadoras...',
      '🛠️ Seleccionando recursos especializados...',
      '📊 Diseñando sistema de evaluación...',
      '🤝 Planificando colaboración...',
      '✨ Agregando elementos creativos...',
      '🎉 Finalizando plan espectacular...'
    ];

    let currentStepIndex = 0;
    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        setCurrentStep(steps[currentStepIndex]);
        setProgress((currentStepIndex + 1) * 10);
        currentStepIndex++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return interval;
  };

  const handleGeneratePlan = async () => {
    if (!formData.studentName || !formData.planType || !formData.context) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedPlan(null);
    setProgress(0);

    // Simular progreso
    const progressInterval = simulateProgress();

    try {
      // Obtener datos del PIAR del estudiante
      const piarData = piarService.getPiarByStudentId(studentId);
      
      if (!piarData) {
        throw new Error('No se encontró PIAR para este estudiante. Es necesario tener un PIAR registrado para generar el plan de apoyo.');
      }

      // Preparar datos del estudiante basados en PIAR
      const studentData = {
        full_name: formData.studentName,
        grade: formData.grade,
        plan_type: formData.planType,
        // Datos del PIAR
        diagnostic: piarData.diagnostic,
        piar_strengths: piarData.strengths,
        piar_needs: piarData.needs,
        piar_objectives: piarData.objectives,
        piar_adaptations: piarData.adaptations,
        piar_resources: piarData.resources,
        piar_evaluation: piarData.evaluation,
        piar_collaboration: piarData.collaboration,
        // Información adicional del formulario
        specific_needs: formData.specificNeeds,
        strengths: formData.strengths,
        challenges: formData.challenges,
        goals: formData.goals
      };

      // Preparar contexto basado en PIAR
      const context = {
        context: formData.context,
        plan_type: formData.planType,
        piar_based: true,
        piar_diagnostic: piarData.diagnostic,
        piar_strengths: piarData.strengths,
        piar_needs: piarData.needs,
        piar_objectives: piarData.objectives,
        additional_info: {
          specific_needs: formData.specificNeeds,
          strengths: formData.strengths,
          challenges: formData.challenges,
          goals: formData.goals
        }
      };

      // Generar plan con IA basado en PIAR
      const result = await generateSupportPlan(studentData, piarData, context);

      if (result.success) {
        setGeneratedPlan(result);
        if (onPlanGenerated) {
          onPlanGenerated(result);
        }
      } else {
        throw new Error(result.error || 'Error generando el plan');
      }

    } catch (err) {
      console.error('Error generando plan:', err);
      setError(err.message || 'Error generando el plan de apoyo');
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
      setProgress(100);
      setCurrentStep('✅ Plan generado exitosamente');
    }
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      grade: '',
      planType: '',
      context: '',
      specificNeeds: '',
      strengths: '',
      challenges: '',
      goals: ''
    });
    setGeneratedPlan(null);
    setError(null);
    setProgress(0);
    setCurrentStep('');
  };

  if (generatedPlan) {
    const piarData = piarService.getPiarByStudentId(studentId);
    return (
      <div className="space-y-6">
        <PiarBasedPlanDisplay 
          supportPlan={generatedPlan}
          piarData={piarData}
          studentData={formData}
        />
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={resetForm}
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            Generar Nuevo Plan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header Espectacular */}
      <Card className="mb-6 border-2 border-gradient-to-r from-purple-500 to-pink-500 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Crown className="w-8 h-8 text-purple-600" />
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Generador de Planes de Apoyo Espectacular
            </CardTitle>
            <Crown className="w-8 h-8 text-pink-600" />
          </div>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
              <Gem className="w-4 h-4 mr-1" />
              Powered by KARY AI
            </Badge>
            <Badge variant="outline" className="bg-pink-100 text-pink-800 border-pink-300">
              <Zap className="w-4 h-4 mr-1" />
              Versión 2.0 Espectacular
            </Badge>
          </div>
          <p className="text-gray-600 mt-2">
            Crea planes de apoyo revolucionarios basados en IA y evidencia científica
          </p>
        </CardHeader>
      </Card>

      {/* Información del PIAR */}
      {studentId && (() => {
        const piarData = piarService.getPiarByStudentId(studentId);
        if (piarData) {
          return (
            <Card className="mb-6 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                  PIAR del Estudiante Encontrado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">📋 Diagnóstico:</h4>
                    <p className="text-green-600">{piarData.diagnostic}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">⭐ Fortalezas:</h4>
                    <p className="text-green-600">{piarData.strengths.slice(0, 2).join(', ')}...</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">🎯 Necesidades:</h4>
                    <p className="text-green-600">{piarData.needs.slice(0, 2).join(', ')}...</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">🛠️ Adaptaciones:</h4>
                    <p className="text-green-600">{piarData.adaptations.slice(0, 2).join(', ')}...</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>✅ El plan de apoyo se generará basado en estos datos específicos del PIAR.</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        } else {
          return (
            <Card className="mb-6 border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center text-red-800">
                  <AlertCircle className="w-6 h-6 mr-2 text-red-600" />
                  PIAR No Encontrado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600 mb-4">
                  No se encontró un PIAR registrado para este estudiante. Es necesario tener un PIAR para generar un plan de apoyo personalizado.
                </p>
                <div className="bg-red-100 p-3 rounded-lg">
                  <p className="text-sm text-red-700">
                    <strong>⚠️ Sin PIAR, el plan generado será genérico y no estará personalizado según las necesidades específicas del estudiante.</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        }
      })()}

      {/* Formulario */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-600" />
            Información del Estudiante
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Estudiante *
              </label>
              <Input
                value={formData.studentName}
                onChange={(e) => handleInputChange('studentName', e.target.value)}
                placeholder="Ej: María González"
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grado/Nivel
              </label>
              <Input
                value={formData.grade}
                onChange={(e) => handleInputChange('grade', e.target.value)}
                placeholder="Ej: 3ro Primaria"
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Plan *
            </label>
            <Select value={formData.planType} onValueChange={(value) => handleInputChange('planType', value)}>
              <SelectTrigger className="border-purple-200 focus:border-purple-500">
                <SelectValue placeholder="Selecciona el tipo de plan" />
              </SelectTrigger>
              <SelectContent>
                {planTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-gray-500">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contexto y Situación Actual *
            </label>
            <Textarea
              value={formData.context}
              onChange={(e) => handleInputChange('context', e.target.value)}
              placeholder="Describe la situación actual del estudiante, sus necesidades, comportamientos observados, fortalezas y desafíos..."
              rows={4}
              className="border-purple-200 focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Necesidades Específicas
              </label>
              <Textarea
                value={formData.specificNeeds}
                onChange={(e) => handleInputChange('specificNeeds', e.target.value)}
                placeholder="Ej: Dislexia, TDAH, ansiedad social..."
                rows={3}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fortalezas Identificadas
              </label>
              <Textarea
                value={formData.strengths}
                onChange={(e) => handleInputChange('strengths', e.target.value)}
                placeholder="Ej: Creatividad, memoria visual, trabajo en equipo..."
                rows={3}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Desafíos Principales
              </label>
              <Textarea
                value={formData.challenges}
                onChange={(e) => handleInputChange('challenges', e.target.value)}
                placeholder="Ej: Dificultad de atención, problemas de organización..."
                rows={3}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivos Deseados
              </label>
              <Textarea
                value={formData.goals}
                onChange={(e) => handleInputChange('goals', e.target.value)}
                placeholder="Ej: Mejorar rendimiento en matemáticas, desarrollar habilidades sociales..."
                rows={3}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Display */}
      {isGenerating && (
        <Card className="mb-6 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-800">
                  Generando Plan Espectacular...
                </h3>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-purple-600 font-medium">
                {currentStep}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Button */}
      <div className="text-center">
        <Button
          onClick={handleGeneratePlan}
          disabled={isGenerating || !formData.studentName || !formData.planType || !formData.context}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generar Plan Espectacular
            </>
          )}
        </Button>
      </div>

      {/* Features */}
      <Card className="mt-6 border-gray-200 bg-gray-50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-center mb-4 flex items-center justify-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Características del Plan Generado
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-medium text-purple-800">Análisis Profundo</h4>
              <p className="text-sm text-gray-600">Basado en evidencia científica</p>
            </div>
            <div className="text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-medium text-blue-800">Objetivos Estratégicos</h4>
              <p className="text-sm text-gray-600">Multidimensionales y medibles</p>
            </div>
            <div className="text-center">
              <Rocket className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-medium text-green-800">Estrategias Innovadoras</h4>
              <p className="text-sm text-gray-600">Adaptadas al perfil único</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpectacularSupportPlanGenerator;
