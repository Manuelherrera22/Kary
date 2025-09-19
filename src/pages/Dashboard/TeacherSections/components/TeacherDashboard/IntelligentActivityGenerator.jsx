import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  BookOpen, 
  Target, 
  Users, 
  Clock, 
  Brain, 
  Zap, 
  CheckCircle,
  Plus,
  Edit,
  Save,
  Send,
  Download,
  Eye,
  Star,
  Lightbulb
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import activityService from '@/services/activityService';
import notificationService from '@/services/notificationService';

const IntelligentActivityGenerator = () => {
  const { t } = useLanguage();
  const { userProfile } = useMockAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedActivities, setGeneratedActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [customization, setCustomization] = useState({
    subject: '',
    grade: '',
    difficulty: 'medium',
    duration: 30,
    type: 'interactive',
    objectives: '',
    specialNeeds: false
  });

  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Cargar estudiantes disponibles
  useEffect(() => {
    const loadStudents = async () => {
      try {
        // Simular carga de estudiantes (en una app real vendría de la API)
        const mockStudents = [
          { id: '1', name: 'María García', grade: '5to Primaria' },
          { id: '2', name: 'Carlos Rodríguez', grade: '4to Primaria' },
          { id: '3', name: 'Ana López', grade: '6to Primaria' },
          { id: '4', name: 'Luis Martínez', grade: '5to Primaria' },
          { id: '5', name: 'Sofia Pérez', grade: '4to Primaria' }
        ];
        setAvailableStudents(mockStudents);
      } catch (error) {
        console.error('Error loading students:', error);
      }
    };

    loadStudents();
  }, []);

  // Sugerencias de IA basadas en el contexto
  useEffect(() => {
    const suggestions = [
      {
        id: 1,
        title: 'Actividad de Matemáticas Interactiva',
        description: 'Juego de resolución de problemas con elementos visuales',
        subject: 'Matemáticas',
        grade: '5to Primaria',
        difficulty: 'medium',
        duration: 45,
        type: 'interactive',
        aiScore: 95
      },
      {
        id: 2,
        title: 'Experimento de Ciencias Práctico',
        description: 'Laboratorio virtual sobre el ciclo del agua',
        subject: 'Ciencias',
        grade: '4to Primaria',
        difficulty: 'easy',
        duration: 60,
        type: 'experiment',
        aiScore: 88
      },
      {
        id: 3,
        title: 'Proyecto de Lenguaje Creativo',
        description: 'Creación de cuentos colaborativos con IA',
        subject: 'Lenguaje',
        grade: '6to Primaria',
        difficulty: 'hard',
        duration: 90,
        type: 'creative',
        aiScore: 92
      }
    ];
    setAiSuggestions(suggestions);
  }, []);

  const handleGenerateActivity = async () => {
    if (!customization.subject || !customization.grade) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    // Simular progreso de generación
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      // Simular generación de actividad
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newActivity = generateActivityBasedOnContext(customization);
      setGeneratedActivities(prev => [newActivity, ...prev]);
      setSelectedActivity(newActivity);
      
      toast({
        title: "¡Actividad Generada!",
        description: `Se ha generado la actividad "${newActivity.title}" exitosamente`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al generar la actividad",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const generateActivityBasedOnContext = (context) => {
    const activityTemplates = {
      'Matemáticas': {
        interactive: {
          title: 'Aventura Matemática Interactiva',
          description: 'Explora un mundo virtual resolviendo problemas matemáticos adaptados a tu nivel',
          steps: [
            'Selecciona tu nivel de dificultad',
            'Explora diferentes escenarios matemáticos',
            'Resuelve problemas paso a paso',
            'Gana recompensas por cada acierto'
          ],
          materials: ['Tablet o computadora', 'Calculadora', 'Papel y lápiz'],
          assessment: 'Evaluación automática con feedback inmediato'
        },
        experiment: {
          title: 'Laboratorio de Geometría',
          description: 'Construye figuras geométricas usando materiales manipulables',
          steps: [
            'Identifica las formas básicas',
            'Construye figuras complejas',
            'Calcula perímetros y áreas',
            'Presenta tus hallazgos'
          ],
          materials: ['Palillos', 'Plastilina', 'Regla', 'Calculadora'],
          assessment: 'Presentación oral y trabajo escrito'
        }
      },
      'Ciencias': {
        interactive: {
          title: 'Simulador del Sistema Solar',
          description: 'Explora los planetas y sus características en un entorno virtual',
          steps: [
            'Navega por el sistema solar',
            'Descubre datos de cada planeta',
            'Completa misiones espaciales',
            'Crea tu propio sistema planetario'
          ],
          materials: ['Computadora', 'Gafas VR (opcional)', 'Cuaderno de observaciones'],
          assessment: 'Cuestionario interactivo y proyecto final'
        }
      },
      'Lenguaje': {
        creative: {
          title: 'Taller de Escritura Creativa con IA',
          description: 'Colabora con la IA para crear historias únicas y originales',
          steps: [
            'Elige un tema o personaje',
            'La IA sugiere ideas y estructura',
            'Escribe tu historia colaborativamente',
            'Ilustra y presenta tu obra'
          ],
          materials: ['Computadora', 'Diccionario', 'Materiales de arte'],
          assessment: 'Presentación de la historia y reflexión escrita'
        }
      }
    };

    const subjectTemplates = activityTemplates[context.subject] || activityTemplates['Matemáticas'];
    const activityType = context.type === 'interactive' ? 'interactive' : 
                       context.type === 'experiment' ? 'experiment' : 'creative';
    
    const template = subjectTemplates[activityType] || subjectTemplates.interactive;

    return {
      id: Date.now(),
      title: template.title,
      description: template.description,
      subject: context.subject,
      grade: context.grade,
      difficulty: context.difficulty,
      duration: context.duration,
      type: context.type,
      steps: template.steps,
      materials: template.materials,
      assessment: template.assessment,
      aiScore: Math.floor(Math.random() * 20) + 80,
      createdAt: new Date(),
      status: 'draft'
    };
  };

  const handleSuggestionClick = (suggestion) => {
    setCustomization({
      subject: suggestion.subject,
      grade: suggestion.grade,
      difficulty: suggestion.difficulty,
      duration: suggestion.duration,
      type: suggestion.type,
      objectives: '',
      specialNeeds: false
    });
  };

  const handleSaveActivity = async (activity) => {
    try {
      const activityData = {
        title: activity.title,
        description: activity.description,
        subject: activity.subject,
        grade: activity.grade,
        difficulty: activity.difficulty,
        duration: activity.duration,
        type: activity.type,
        objectives: activity.objectives,
        materials: activity.materials,
        steps: activity.steps,
        assessment: activity.assessment,
        createdBy: userProfile.id,
        dueDate: activity.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 días por defecto
      };

      const result = await activityService.createActivity(activityData);
      
      if (result.success) {
        setGeneratedActivities(prev => 
          prev.map(a => a.id === activity.id ? { ...a, status: 'saved', savedId: result.data.id } : a)
        );
        
        toast({
          title: "Actividad Guardada",
          description: "La actividad se ha guardado exitosamente",
          variant: "default"
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al guardar la actividad",
        variant: "destructive"
      });
    }
  };

  const handleSendToStudents = async (activity) => {
    if (selectedStudents.length === 0) {
      toast({
        title: "Error",
        description: "Selecciona al menos un estudiante",
        variant: "destructive"
      });
      return;
    }

    try {
      const activityData = {
        title: activity.title,
        description: activity.description,
        subject: activity.subject,
        grade: activity.grade,
        difficulty: activity.difficulty,
        duration: activity.duration,
        type: activity.type,
        objectives: activity.objectives,
        materials: activity.materials,
        steps: activity.steps,
        assessment: activity.assessment,
        createdBy: userProfile.id,
        dueDate: activity.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      // Crear la actividad maestra
      const result = await activityService.createActivity(activityData);
      
      if (result.success) {
        // Asignar a estudiantes
        const assignmentResult = await activityService.assignActivityToStudents(
          result.data.id, 
          selectedStudents
        );

        if (assignmentResult.success) {
          // Crear notificaciones
          await notificationService.createActivityNotifications(
            result.data, 
            assignmentResult.data
          );

          setGeneratedActivities(prev => 
            prev.map(a => a.id === activity.id ? { ...a, status: 'sent', savedId: result.data.id } : a)
          );
          
          toast({
            title: "Actividad Enviada",
            description: `La actividad se ha enviado a ${selectedStudents.length} estudiantes`,
            variant: "default"
          });

          // Limpiar selección
          setSelectedStudents([]);
        } else {
          throw new Error(assignmentResult.error);
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al enviar la actividad",
        variant: "destructive"
      });
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'hard': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'interactive': return <Zap size={16} />;
      case 'experiment': return <Target size={16} />;
      case 'creative': return <Lightbulb size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  const handleStudentToggle = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAllStudents = () => {
    setSelectedStudents(availableStudents.map(s => s.id));
  };

  const handleClearStudentSelection = () => {
    setSelectedStudents([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="w-full space-y-6"
    >
      {/* Header */}
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
              <Sparkles size={24} className="text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-purple-300">
                {t('teacherDashboard.activityGenerator.title', 'Generador Inteligente de Actividades')}
              </CardTitle>
              <p className="text-sm text-slate-400">
                {t('teacherDashboard.activityGenerator.subtitle', 'Crea actividades personalizadas con IA')}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de configuración */}
        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-200 flex items-center gap-2">
              <Brain size={20} className="text-blue-400" />
              {t('teacherDashboard.activityGenerator.configuration', 'Configuración')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  {t('teacherDashboard.activityGenerator.subject', 'Materia')}
                </label>
                <Select value={customization.subject} onValueChange={(value) => setCustomization(prev => ({ ...prev, subject: value }))}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-200">
                    <SelectValue placeholder="Selecciona materia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Matemáticas">Matemáticas</SelectItem>
                    <SelectItem value="Ciencias">Ciencias</SelectItem>
                    <SelectItem value="Lenguaje">Lenguaje</SelectItem>
                    <SelectItem value="Historia">Historia</SelectItem>
                    <SelectItem value="Arte">Arte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  {t('teacherDashboard.activityGenerator.grade', 'Grado')}
                </label>
                <Select value={customization.grade} onValueChange={(value) => setCustomization(prev => ({ ...prev, grade: value }))}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-200">
                    <SelectValue placeholder="Selecciona grado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1ro Primaria">1ro Primaria</SelectItem>
                    <SelectItem value="2do Primaria">2do Primaria</SelectItem>
                    <SelectItem value="3ro Primaria">3ro Primaria</SelectItem>
                    <SelectItem value="4to Primaria">4to Primaria</SelectItem>
                    <SelectItem value="5to Primaria">5to Primaria</SelectItem>
                    <SelectItem value="6to Primaria">6to Primaria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  {t('teacherDashboard.activityGenerator.difficulty', 'Dificultad')}
                </label>
                <Select value={customization.difficulty} onValueChange={(value) => setCustomization(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Fácil</SelectItem>
                    <SelectItem value="medium">Medio</SelectItem>
                    <SelectItem value="hard">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  {t('teacherDashboard.activityGenerator.duration', 'Duración (min)')}
                </label>
                <Input
                  type="number"
                  value={customization.duration}
                  onChange={(e) => setCustomization(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                  className="bg-slate-800 border-slate-600 text-slate-200"
                  min="15"
                  max="120"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                {t('teacherDashboard.activityGenerator.type', 'Tipo de Actividad')}
              </label>
              <Select value={customization.type} onValueChange={(value) => setCustomization(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interactive">Interactiva</SelectItem>
                  <SelectItem value="experiment">Experimento</SelectItem>
                  <SelectItem value="creative">Creativa</SelectItem>
                  <SelectItem value="collaborative">Colaborativa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                {t('teacherDashboard.activityGenerator.objectives', 'Objetivos de Aprendizaje')}
              </label>
              <Textarea
                value={customization.objectives}
                onChange={(e) => setCustomization(prev => ({ ...prev, objectives: e.target.value }))}
                placeholder="Describe los objetivos específicos de esta actividad..."
                className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-400"
                rows={3}
              />
            </div>

            {/* Selección de estudiantes */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Seleccionar Estudiantes
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAllStudents}
                    className="text-xs"
                  >
                    Seleccionar Todos
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearStudentSelection}
                    className="text-xs"
                  >
                    Limpiar
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {availableStudents.map((student) => (
                    <label
                      key={student.id}
                      className="flex items-center space-x-2 p-2 rounded border cursor-pointer hover:bg-slate-700/50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleStudentToggle(student.id)}
                        className="rounded"
                      />
                      <span className="text-sm text-slate-300">{student.name}</span>
                    </label>
                  ))}
                </div>
                {selectedStudents.length > 0 && (
                  <p className="text-xs text-slate-400">
                    {selectedStudents.length} estudiante(s) seleccionado(s)
                  </p>
                )}
              </div>
            </div>

            <Button
              onClick={handleGenerateActivity}
              disabled={!customization.subject || !customization.grade || isGenerating}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Sparkles size={16} className="mr-2 animate-spin" />
                  {t('teacherDashboard.activityGenerator.generating', 'Generando...')}
                </>
              ) : (
                <>
                  <Sparkles size={16} className="mr-2" />
                  {t('teacherDashboard.activityGenerator.generate', 'Generar Actividad')}
                </>
              )}
            </Button>

            {isGenerating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-300">
                  <span>{t('teacherDashboard.activityGenerator.progress', 'Progreso')}</span>
                  <span>{Math.round(generationProgress)}%</span>
                </div>
                <Progress value={generationProgress} className="h-2 bg-slate-700" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sugerencias de IA */}
        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-200 flex items-center gap-2">
              <Lightbulb size={20} className="text-yellow-400" />
              {t('teacherDashboard.activityGenerator.aiSuggestions', 'Sugerencias de IA')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiSuggestions.map((suggestion) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-slate-700/30 border border-slate-600/50 cursor-pointer hover:bg-slate-700/50 transition-all duration-200"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(suggestion.type)}
                      <h4 className="font-semibold text-slate-200">{suggestion.title}</h4>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      {suggestion.aiScore}% IA
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{suggestion.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{suggestion.subject}</span>
                    <span>{suggestion.grade}</span>
                    <span>{suggestion.duration} min</span>
                    <Badge className={getDifficultyColor(suggestion.difficulty)}>
                      {suggestion.difficulty}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actividades generadas */}
      {generatedActivities.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-200 flex items-center gap-2">
              <BookOpen size={20} className="text-green-400" />
              {t('teacherDashboard.activityGenerator.generatedActivities', 'Actividades Generadas')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-slate-200">{activity.title}</h4>
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          {activity.aiScore}% IA
                        </Badge>
                        <Badge className={getDifficultyColor(activity.difficulty)}>
                          {activity.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 mb-3">{activity.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
                        <div>
                          <strong>Materia:</strong> {activity.subject}
                        </div>
                        <div>
                          <strong>Grado:</strong> {activity.grade}
                        </div>
                        <div>
                          <strong>Duración:</strong> {activity.duration} min
                        </div>
                        <div>
                          <strong>Tipo:</strong> {activity.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedActivity(activity)}
                        className="text-xs"
                      >
                        <Eye size={14} className="mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveActivity(activity)}
                        className="text-xs"
                      >
                        <Save size={14} className="mr-1" />
                        Guardar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendToStudents(activity)}
                        className="text-xs"
                      >
                        <Send size={14} className="mr-1" />
                        Enviar
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default IntelligentActivityGenerator;
