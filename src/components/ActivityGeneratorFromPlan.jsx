import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { generateStudentActivities, assignActivitiesToStudent } from '@/services/studentActivityGeneratorService';
import { 
  Sparkles, 
  Brain, 
  Target, 
  Clock, 
  BookOpen,
  CheckCircle,
  AlertCircle,
  Send,
  Activity,
  User,
  Zap
} from 'lucide-react';

const ActivityGeneratorFromPlan = ({ supportPlan, studentData, teacherId, onActivitiesAssigned, onCancel }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [generatedActivities, setGeneratedActivities] = useState([]);
  const [generationStep, setGenerationStep] = useState('');

  const subjects = [
    { value: 'all', label: 'Todas las Materias', icon: '📚' },
    { value: 'mathematics', label: 'Matemáticas', icon: '🔢' },
    { value: 'reading', label: 'Lectura', icon: '📖' },
    { value: 'writing', label: 'Escritura', icon: '✍️' },
    { value: 'science', label: 'Ciencias', icon: '🔬' }
  ];

  const handleGenerateActivities = async () => {
    if (!supportPlan || !studentData) {
      toast({
        title: 'Error',
        description: 'No hay datos suficientes para generar actividades',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setGenerationStep('🎯 IA: Analizando plan de apoyo...');

    try {
      // Paso 1: Análisis del plan
      setGenerationStep('🧠 IA: Procesando necesidades del estudiante...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Paso 2: Generación de actividades
      setGenerationStep('✨ IA: Generando actividades personalizadas...');
      
      const activities = await generateStudentActivities(
        studentData, 
        supportPlan, 
        selectedSubject
      );
      
      setGeneratedActivities(activities);
      
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
      setGenerationStep('');
    }
  };

  const handleAssignActivities = async () => {
    if (generatedActivities.length === 0) {
      toast({
        title: 'Error',
        description: 'No hay actividades para asignar',
        variant: 'destructive',
      });
      return;
    }

    setIsAssigning(true);

    try {
      const result = await assignActivitiesToStudent(generatedActivities, studentData.id, teacherId);
      
      if (result.success) {
        toast({
          title: '✅ Actividades Asignadas',
          description: result.message,
          variant: 'default',
        });

        if (onActivitiesAssigned) {
          onActivitiesAssigned(result.assignedActivities);
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error asignando actividades:', error);
      toast({
        title: 'Error',
        description: 'Hubo un problema asignando las actividades. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-600';
      case 'intermediate': return 'bg-yellow-600';
      case 'advanced': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getSubjectIcon = (subject) => {
    switch (subject) {
      case 'mathematics': return '🔢';
      case 'reading': return '📖';
      case 'writing': return '✍️';
      case 'science': return '🔬';
      default: return '📚';
    }
  };

  return (
    <div className="space-y-6 activity-generator-container">
      {/* Header */}
      <Card 
        className="border-blue-500/30 activity-generator-card"
        style={{
          backgroundColor: '#1e293b',
          opacity: 1,
          background: '#1e293b'
        }}
      >
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Sparkles className="w-6 h-6 mr-3 text-blue-400" />
            Generador de Actividades desde Plan de Apoyo
          </CardTitle>
          <p className="text-gray-400">
            Crea actividades personalizadas para {studentData?.full_name} basadas en su plan de apoyo aceptado
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Información del Estudiante y Plan */}
          <div 
            className="rounded-lg p-4 activity-generator-info-panel"
            style={{
              backgroundColor: '#334155',
              opacity: 1,
              background: '#334155'
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <User className="w-5 h-5 text-blue-400 mr-2" />
                <div>
                  <span className="text-gray-400 text-sm">Estudiante:</span>
                  <p className="text-white font-medium">{studentData?.full_name}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Target className="w-5 h-5 text-purple-400 mr-2" />
                <div>
                  <span className="text-gray-400 text-sm">Necesidades:</span>
                  <p className="text-white font-medium">
                    {supportPlan?.aiAnalysis?.priorityNeeds?.length || 0} identificadas
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Brain className="w-5 h-5 text-green-400 mr-2" />
                <div>
                  <span className="text-gray-400 text-sm">Perfil:</span>
                  <p className="text-white font-medium">
                    {supportPlan?.aiAnalysis?.learningProfile?.style || 'No especificado'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Selector de Materia */}
          <div className="space-y-2">
            <label className="text-white font-medium">Materia para generar actividades:</label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Seleccionar materia..." />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject.value} value={subject.value}>
                    <div className="flex items-center">
                      <span className="mr-2">{subject.icon}</span>
                      {subject.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Botón de Generación */}
          <Button
            onClick={handleGenerateActivities}
            disabled={isGenerating}
            className="w-full text-white py-4 text-lg font-semibold"
            style={{
              backgroundColor: '#3b82f6',
              opacity: 1,
              background: '#3b82f6'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2563eb';
              e.target.style.background = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#3b82f6';
              e.target.style.background = '#3b82f6';
            }}
          >
            {isGenerating ? (
              <>
                <Zap className="w-5 h-5 mr-3 animate-pulse" />
                Generando Actividades...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-3" />
                🚀 Generar Actividades Personalizadas
              </>
            )}
          </Button>

          {/* Progreso de Generación */}
          {isGenerating && generationStep && (
            <div 
              className="rounded-lg p-3 activity-generator-info-panel"
              style={{
                backgroundColor: '#334155',
                opacity: 1,
                background: '#334155'
              }}
            >
              <div className="flex items-center text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-3"></div>
                <span className="text-gray-300">{generationStep}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actividades Generadas */}
      {generatedActivities.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
              Actividades Generadas ({generatedActivities.length})
            </CardTitle>
            <p className="text-gray-400">
              Actividades personalizadas basadas en el análisis de IA del plan de apoyo
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Lista de Actividades */}
            <div className="space-y-3">
              {generatedActivities.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className="rounded-lg p-4 border border-slate-600 activity-generator-activity-card"
                  style={{
                    backgroundColor: '#334155',
                    opacity: 1,
                    background: '#334155'
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getSubjectIcon(activity.subject)}</span>
                        <h4 className="font-semibold text-white">{activity.title}</h4>
                        <Badge className={`text-xs ${getDifficultyColor(activity.difficulty)}`}>
                          {activity.difficulty}
                        </Badge>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{activity.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-blue-400" />
                          <span className="text-gray-400">Duración:</span>
                          <span className="text-white ml-1">{activity.duration} min</span>
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1 text-green-400" />
                          <span className="text-gray-400">Materia:</span>
                          <span className="text-white ml-1 capitalize">{activity.subject}</span>
                        </div>
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-1 text-purple-400" />
                          <span className="text-gray-400">Objetivos:</span>
                          <span className="text-white ml-1">{activity.objectives.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Materiales y Adaptaciones */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <h5 className="text-gray-400 text-xs font-medium mb-1">Materiales:</h5>
                      <div className="flex flex-wrap gap-1">
                        {activity.materials.slice(0, 3).map((material, idx) => (
                          <Badge key={idx} variant="outline" className="border-slate-500 text-gray-300 text-xs">
                            {material}
                          </Badge>
                        ))}
                        {activity.materials.length > 3 && (
                          <Badge variant="outline" className="border-slate-500 text-gray-300 text-xs">
                            +{activity.materials.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-gray-400 text-xs font-medium mb-1">Adaptaciones:</h5>
                      <div className="flex flex-wrap gap-1">
                        {activity.adaptations.slice(0, 2).map((adaptation, idx) => (
                          <Badge key={idx} variant="outline" className="border-blue-500 text-blue-300 text-xs">
                            {adaptation}
                          </Badge>
                        ))}
                        {activity.adaptations.length > 2 && (
                          <Badge variant="outline" className="border-blue-500 text-blue-300 text-xs">
                            +{activity.adaptations.length - 2} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <Button
                onClick={handleAssignActivities}
                disabled={isAssigning}
                className="flex-1 text-white"
                style={{
                  backgroundColor: '#059669',
                  opacity: 1,
                  background: '#059669'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#047857';
                  e.target.style.background = '#047857';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#059669';
                  e.target.style.background = '#059669';
                }}
              >
                {isAssigning ? (
                  <>
                    <Send className="w-4 h-4 mr-2 animate-pulse" />
                    Asignando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    📤 Asignar Actividades al Estudiante
                  </>
                )}
              </Button>
              
              <Button
                onClick={onCancel}
                variant="outline"
                className="border-slate-500 text-gray-300 hover:bg-slate-700"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActivityGeneratorFromPlan;
