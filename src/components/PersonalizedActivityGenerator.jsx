import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePIARData } from '@/hooks/usePIARData';
import { 
  Lightbulb, 
  Target, 
  Clock, 
  Users, 
  BookOpen, 
  Activity,
  Wand2,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

const PersonalizedActivityGenerator = ({ studentId, onActivityGenerated }) => {
  const { t } = useLanguage();
  const { students } = useStudentsData();
  const { getPIARByStudentId, generatePersonalizedActivities } = usePIARData(students);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [generatedActivities, setGeneratedActivities] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const piar = getPIARByStudentId(studentId);

  const subjects = [
    { value: 'mathematics', label: 'Matemáticas', icon: '🔢' },
    { value: 'language', label: 'Lenguaje', icon: '📚' },
    { value: 'science', label: 'Ciencias', icon: '🔬' },
    { value: 'social_studies', label: 'Estudios Sociales', icon: '🌍' },
    { value: 'art', label: 'Arte', icon: '🎨' },
    { value: 'physical_education', label: 'Educación Física', icon: '⚽' },
    { value: 'social_skills', label: 'Habilidades Sociales', icon: '🤝' },
    { value: 'attention_training', label: 'Entrenamiento de Atención', icon: '🎯' }
  ];

  const difficulties = [
    { value: 'beginner', label: 'Principiante', color: 'bg-green-500' },
    { value: 'intermediate', label: 'Intermedio', color: 'bg-yellow-500' },
    { value: 'advanced', label: 'Avanzado', color: 'bg-red-500' },
    { value: 'adaptive', label: 'Adaptativo', color: 'bg-blue-500' }
  ];

  const durations = [
    { value: '5', label: '5 minutos' },
    { value: '10', label: '10 minutos' },
    { value: '15', label: '15 minutos' },
    { value: '20', label: '20 minutos' },
    { value: '25', label: '25 minutos' },
    { value: '30', label: '30 minutos' },
    { value: 'flexible', label: 'Flexible' }
  ];

  const generateActivities = async () => {
    if (!piar) {
      alert('No se encontró PIAR para este estudiante');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simular generación de actividades (en producción, esto sería una llamada a IA)
      const activities = generatePersonalizedActivities(piar);
      
      // Filtrar por criterios seleccionados
      let filteredActivities = activities;
      
      if (selectedSubject) {
        filteredActivities = filteredActivities.filter(activity => 
          activity.type === selectedSubject || 
          activity.based_on_need === selectedSubject
        );
      }
      
      if (selectedDifficulty) {
        filteredActivities = filteredActivities.filter(activity => 
          activity.difficulty === selectedDifficulty || 
          activity.difficulty === 'adaptive'
        );
      }
      
      if (selectedDuration) {
        filteredActivities = filteredActivities.filter(activity => 
          activity.duration <= parseInt(selectedDuration) || 
          selectedDuration === 'flexible'
        );
      }

      // Si hay un prompt personalizado, agregar actividad basada en él
      if (customPrompt.trim()) {
        const customActivity = generateCustomActivity(customPrompt);
        filteredActivities.push(customActivity);
      }

      setGeneratedActivities(filteredActivities);
      
      if (onActivityGenerated) {
        onActivityGenerated(filteredActivities);
      }
    } catch (error) {
      console.error('Error generating activities:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCustomActivity = (prompt) => {
    return {
      id: `custom-${Date.now()}`,
      type: 'custom',
      title: 'Actividad Personalizada',
      description: `Actividad basada en: "${prompt}"`,
      duration: selectedDuration ? parseInt(selectedDuration) : 15,
      difficulty: selectedDifficulty || 'intermediate',
      materials: ['Materiales según necesidad'],
      adaptations: ['Adaptaciones personalizadas'],
      based_on_need: 'custom_prompt',
      custom_prompt: prompt,
      isCustom: true
    };
  };

  const getActivityIcon = (type) => {
    const subject = subjects.find(s => s.value === type);
    return subject ? subject.icon : '📝';
  };

  const getDifficultyColor = (difficulty) => {
    const diff = difficulties.find(d => d.value === difficulty);
    return diff ? diff.color : 'bg-gray-500';
  };

  const implementActivity = (activity) => {
    // Aquí se implementaría la lógica para asignar la actividad al estudiante
    alert(`Implementando actividad: ${activity.title}`);
  };

  useEffect(() => {
    if (piar) {
      // Generar actividades automáticamente cuando se carga el PIAR
      generateActivities();
    }
  }, [piar, studentId]);

  if (!piar) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            No se encontró PIAR
          </h3>
          <p className="text-gray-400">
            Este estudiante no tiene un Plan Individual de Ajustes Razonables.
            Crea un PIAR primero para generar actividades personalizadas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Información del PIAR */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            PIAR - {piar.student_name || 'Estudiante'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {piar.specific_needs?.length || 0}
              </div>
              <div className="text-sm text-gray-400">Necesidades</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {piar.reasonable_adjustments?.length || 0}
              </div>
              <div className="text-sm text-gray-400">Ajustes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {piar.goals?.length || 0}
              </div>
              <div className="text-sm text-gray-400">Objetivos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {Math.round(piar.progress_tracking?.overall_progress || 0)}%
              </div>
              <div className="text-sm text-gray-400">Progreso</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros de generación */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Wand2 className="w-5 h-5 mr-2" />
            Generar Actividades Personalizadas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Materia/Área
              </label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Todas las materias" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-white">
                  <SelectItem value="">Todas las materias</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject.value} value={subject.value}>
                      {subject.icon} {subject.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dificultad
              </label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Cualquier dificultad" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-white">
                  <SelectItem value="">Cualquier dificultad</SelectItem>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty.value} value={difficulty.value}>
                      <span className="flex items-center">
                        <span className={`w-3 h-3 rounded-full ${difficulty.color} mr-2`}></span>
                        {difficulty.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duración
              </label>
              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Cualquier duración" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-white">
                  <SelectItem value="">Cualquier duración</SelectItem>
                  {durations.map(duration => (
                    <SelectItem key={duration.value} value={duration.value}>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {duration.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Solicitud Personalizada (Opcional)
            </label>
            <Textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe una actividad específica que te gustaría crear..."
              className="bg-slate-700 border-slate-600 text-white"
              rows={2}
            />
          </div>

          <Button
            onClick={generateActivities}
            disabled={isGenerating}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isGenerating ? (
              <>
                <Activity className="w-4 h-4 mr-2 animate-spin" />
                Generando actividades...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generar Actividades Personalizadas
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Actividades generadas */}
      {generatedActivities.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" />
              Actividades Generadas ({generatedActivities.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedActivities.map((activity, index) => (
              <Card key={activity.id || index} className="bg-slate-700 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">
                        {getActivityIcon(activity.type)}
                      </span>
                      <div>
                        <h4 className="font-semibold text-white">
                          {activity.title}
                          {activity.isCustom && (
                            <Badge className="ml-2 bg-blue-600 text-white">Personalizada</Badge>
                          )}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => implementActivity(activity)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Implementar
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="flex items-center text-sm text-gray-300">
                      <Clock className="w-4 h-4 mr-2" />
                      {activity.duration} min
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <Badge className={`${getDifficultyColor(activity.difficulty)} text-white`}>
                        {activity.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <Target className="w-4 h-4 mr-2" />
                      {activity.type}
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <Users className="w-4 h-4 mr-2" />
                      Individual
                    </div>
                  </div>

                  {activity.materials && activity.materials.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-300 mb-1">Materiales:</h5>
                      <div className="flex flex-wrap gap-1">
                        {activity.materials.map((material, idx) => (
                          <Badge key={idx} variant="outline" className="text-gray-400 border-gray-600">
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {activity.adaptations && activity.adaptations.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-300 mb-1">Adaptaciones:</h5>
                      <div className="flex flex-wrap gap-1">
                        {activity.adaptations.map((adaptation, idx) => (
                          <Badge key={idx} className="bg-purple-600 text-white">
                            {adaptation}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {activity.based_on_need && (
                    <div className="text-xs text-gray-500 italic">
                      Basado en: {activity.based_on_need}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {generatedActivities.length === 0 && !isGenerating && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6 text-center">
            <Info className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No se generaron actividades
            </h3>
            <p className="text-gray-400">
              Ajusta los filtros o agrega una solicitud personalizada para generar actividades.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonalizedActivityGenerator;
