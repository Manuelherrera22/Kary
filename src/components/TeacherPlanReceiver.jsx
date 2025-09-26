import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  User, 
  Target, 
  Brain, 
  Calendar, 
  FileText, 
  Sparkles,
  Rocket,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import TeacherActivityGeneratorService from '@/services/teacherActivityGeneratorService';
import StudentActivityAssignmentService from '@/services/studentActivityAssignmentService';
import ActivityDetailsModal from '@/components/ActivityDetailsModal';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { toast } from '@/components/ui/use-toast';

const TeacherPlanReceiver = () => {
  const { t } = useLanguage();
  const { userProfile } = useMockAuth();
  const [receivedPlans, setReceivedPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showActivityGenerator, setShowActivityGenerator] = useState(false);

  // Simular planes de apoyo recibidos
  useEffect(() => {
    const mockPlans = [
      {
        id: 'plan-001',
        studentName: 'Ana López Martínez',
        studentId: 'student-001',
        grade: '5to Primaria',
        planTitle: 'Plan de Apoyo Educativo Integral',
        generatedBy: 'Psicopedagogo María García',
        receivedAt: '2025-01-25T10:30:00Z',
        status: 'pending',
        priority: 'Alta',
        summary: 'Plan enfocado en mejorar comprensión lectora y razonamiento matemático',
        recommendations: [
          'Usar elementos visuales en todas las actividades',
          'Proporcionar tiempo extra para tareas complejas',
          'Implementar actividades de comprensión lectora',
          'Fortalecer razonamiento matemático con manipulativos'
        ],
        activities: [
          {
            id: 'act-1001',
            title: 'Lectura Visual con Secuencia de Imágenes',
            description: 'Actividad diseñada para mejorar la comprensión lectora y la atención a través de la asociación de imágenes con texto',
            objective: 'Desarrollar habilidades de comprensión lectora mediante la asociación visual-textual',
            duration: 45,
            difficulty: 'Intermedio',
            priority: 'Alta',
            category: 'Comprensión Lectora',
            materials: ['Imágenes secuenciales', 'Textos cortos', 'Fichas de trabajo', 'Lápices de colores'],
            adaptations: 'Proporcionar imágenes más grandes para estudiantes con dificultades visuales',
            instructions: '1. Mostrar secuencia de imágenes. 2. Leer texto relacionado. 3. Asociar imagen con texto. 4. Responder preguntas de comprensión.',
            assessment: 'Evaluación mediante preguntas de comprensión y observación de asociaciones correctas',
            gradeLevel: '5to Primaria',
            subject: 'Lengua y Literatura',
            learningStyle: 'Visual',
            cognitiveDomain: 'Comprensión y Análisis'
          }
        ]
      },
      {
        id: 'plan-002',
        studentName: 'Carlos Rodríguez Silva',
        studentId: 'student-002',
        grade: '4to Primaria',
        planTitle: 'Plan de Apoyo para Dificultades Matemáticas',
        generatedBy: 'Psicopedagogo Juan Pérez',
        receivedAt: '2025-01-24T14:15:00Z',
        status: 'in_progress',
        priority: 'Media',
        summary: 'Plan específico para fortalecer habilidades matemáticas básicas',
        recommendations: [
          'Usar manipulativos matemáticos',
          'Problemas visuales paso a paso',
          'Práctica guiada con apoyo',
          'Evaluación continua del progreso'
        ],
        activities: []
      }
    ];
    setReceivedPlans(mockPlans);
  }, []);

  const handleAcceptPlan = (planId) => {
    setReceivedPlans(prev => 
      prev.map(plan => 
        plan.id === planId 
          ? { ...plan, status: 'accepted' }
          : plan
      )
    );
  };

  const handleGenerateActivities = (plan) => {
    setSelectedPlan(plan);
    setShowActivityGenerator(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-600 text-yellow-100';
      case 'accepted': return 'bg-green-600 text-green-100';
      case 'in_progress': return 'bg-blue-600 text-blue-100';
      case 'completed': return 'bg-purple-600 text-purple-100';
      default: return 'bg-gray-600 text-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta': return 'bg-red-600 text-red-100';
      case 'Media': return 'bg-yellow-600 text-yellow-100';
      case 'Baja': return 'bg-green-600 text-green-100';
      default: return 'bg-gray-600 text-gray-100';
    }
  };

  if (showActivityGenerator && selectedPlan) {
    return (
      <TeacherActivityGenerator 
        plan={selectedPlan}
        onBack={() => setShowActivityGenerator(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
          <FileText className="w-8 h-8 mr-3 text-blue-400" />
          Planes de Apoyo Recibidos
        </h1>
        <p className="text-gray-400">
          Gestiona y implementa los planes de apoyo enviados por el psicopedagogo
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Recibidos</p>
                <p className="text-2xl font-bold text-white">{receivedPlans.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {receivedPlans.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">En Progreso</p>
                <p className="text-2xl font-bold text-blue-400">
                  {receivedPlans.filter(p => p.status === 'in_progress').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Completados</p>
                <p className="text-2xl font-bold text-green-400">
                  {receivedPlans.filter(p => p.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans List */}
      <div className="space-y-4">
        {receivedPlans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-400" />
                      {plan.studentName}
                    </CardTitle>
                    <p className="text-gray-400 text-sm mt-1">
                      {plan.grade} • {plan.planTitle}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Generado por: {plan.generatedBy} • 
                      Recibido: {new Date(plan.receivedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(plan.priority)}>
                      {plan.priority}
                    </Badge>
                    <Badge className={getStatusColor(plan.status)}>
                      {getStatusIcon(plan.status)}
                      <span className="ml-1 capitalize">{plan.status}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Summary */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Resumen del Plan</h4>
                    <p className="text-gray-400 text-sm">{plan.summary}</p>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Recomendaciones Clave</h4>
                    <div className="flex flex-wrap gap-2">
                      {plan.recommendations.map((rec, index) => (
                        <Badge key={index} variant="outline" className="border-purple-600 text-purple-300">
                          {rec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Activities Preview */}
                  {plan.activities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">
                        Actividades Sugeridas ({plan.activities.length})
                      </h4>
                      <div className="space-y-2">
                        {plan.activities.slice(0, 2).map((activity) => (
                          <div key={activity.id} className="bg-slate-700 rounded p-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-white text-sm">
                                {activity.title}
                              </span>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="border-slate-600 text-gray-300 text-xs">
                                  {activity.duration} min
                                </Badge>
                                <Badge variant="outline" className="border-slate-600 text-gray-300 text-xs">
                                  {activity.difficulty}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-gray-400 text-xs mt-1">
                              {activity.description.substring(0, 100)}...
                            </p>
                          </div>
                        ))}
                        {plan.activities.length > 2 && (
                          <p className="text-gray-500 text-xs">
                            +{plan.activities.length - 2} actividades más...
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
                    {plan.status === 'pending' && (
                      <Button 
                        onClick={() => handleAcceptPlan(plan.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aceptar Plan
                      </Button>
                    )}
                    
                    <Button 
                      onClick={() => handleGenerateActivities(plan)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generar Actividades con IA
                    </Button>
                    
                    <Button variant="outline" className="border-slate-600 text-gray-300">
                      <FileText className="w-4 h-4 mr-2" />
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Componente para generar actividades basadas en el plan
const TeacherActivityGenerator = ({ plan, onBack }) => {
  const { userProfile } = useMockAuth();
  const [selectedSubject, setSelectedSubject] = useState('Todas las Materias');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedActivities, setGeneratedActivities] = useState([]);
  const [modifyingActivity, setModifyingActivity] = useState(null);
  const [modificationRequest, setModificationRequest] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [assigningActivity, setAssigningActivity] = useState(null);

  const subjects = [
    'Todas las Materias',
    'Lengua y Literatura',
    'Matemáticas',
    'Ciencias Naturales',
    'Ciencias Sociales',
    'Educación Física',
    'Arte y Música'
  ];

  const handleGenerateActivities = async () => {
    setIsGenerating(true);
    
    try {
      console.log('🎓 Generando actividades con IA para profesor...');
      
      const result = await TeacherActivityGeneratorService.generateActivitiesFromPlan(
        plan, 
        selectedSubject
      );
      
      if (result.success) {
        console.log('✅ Actividades generadas exitosamente');
        setGeneratedActivities(result.activities);
      } else {
        console.log('⚠️ Usando actividades de fallback');
        setGeneratedActivities(result.fallbackActivities || []);
      }
    } catch (error) {
      console.error('❌ Error generando actividades:', error);
      // Usar actividades de fallback en caso de error
      setGeneratedActivities(TeacherActivityGeneratorService.getFallbackActivities(plan, selectedSubject));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleModifyActivity = async (activity) => {
    if (!modificationRequest.trim()) {
      alert('Por favor, describe qué modificaciones deseas hacer a la actividad.');
      return;
    }

    setModifyingActivity(activity.id);
    
    try {
      console.log('🔧 Modificando actividad con IA...');
      
      const result = await TeacherActivityGeneratorService.modifyActivityWithAI(
        activity,
        plan,
        modificationRequest
      );
      
      if (result.success) {
        console.log('✅ Actividad modificada exitosamente');
        setGeneratedActivities(prev => 
          prev.map(act => 
            act.id === activity.id ? result.activity : act
          )
        );
        setModificationRequest('');
      } else {
        console.error('❌ Error modificando actividad:', result.error);
        alert('Error modificando la actividad. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('❌ Error modificando actividad:', error);
      alert('Error modificando la actividad. Inténtalo de nuevo.');
    } finally {
      setModifyingActivity(null);
    }
  };

  const handleViewDetails = (activity) => {
    setSelectedActivity(activity);
    setShowDetailsModal(true);
  };

  const handleAssignToStudent = async (activity, plan) => {
    if (!userProfile?.id) {
      toast({
        title: "Error",
        description: "No se pudo identificar al profesor",
        variant: "destructive"
      });
      return;
    }

    setAssigningActivity(activity.id);
    
    try {
      console.log('📝 Asignando actividad al estudiante...');
      
      const result = await StudentActivityAssignmentService.assignActivityToStudent(
        activity,
        plan,
        userProfile.id
      );
      
      if (result.success) {
        toast({
          title: "✅ Actividad Asignada",
          description: result.message,
          variant: "default"
        });
        
        // Cerrar modal de detalles
        setShowDetailsModal(false);
        setSelectedActivity(null);
        
        // Actualizar estado de la actividad como asignada
        setGeneratedActivities(prev => 
          prev.map(act => 
            act.id === activity.id 
              ? { ...act, status: 'assigned', assignedAt: new Date().toISOString() }
              : act
          )
        );
      } else {
        toast({
          title: "❌ Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Error asignando actividad:', error);
      toast({
        title: "❌ Error",
        description: "Error asignando la actividad. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setAssigningActivity(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Sparkles className="w-8 h-8 mr-3 text-purple-400" />
            Generador de Actividades con IA
          </h1>
          <p className="text-gray-400">
            Crea actividades personalizadas para {plan.studentName} basadas en su plan de apoyo
          </p>
        </div>
        <Button 
          onClick={onBack}
          variant="outline" 
          className="border-slate-600 text-gray-300"
        >
          ← Volver a Planes
        </Button>
      </div>

      {/* Student Info */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-3 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Estudiante</p>
                <p className="text-white font-medium">{plan.studentName}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Target className="w-5 h-5 mr-3 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Necesidades</p>
                <p className="text-white font-medium">{plan.recommendations.length} identificadas</p>
              </div>
            </div>
            <div className="flex items-center">
              <Brain className="w-5 h-5 mr-3 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Perfil</p>
                <p className="text-white font-medium">Visual-Auditivo</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Generator */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Materia para generar actividades:
              </label>
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div className="text-center">
              <Button 
                onClick={handleGenerateActivities}
                disabled={isGenerating}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Generando con IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-3" />
                    <Rocket className="w-5 h-5 mr-3" />
                    Generar Actividades Personalizadas
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Activities */}
      {generatedActivities.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Actividades Generadas</h2>
          {generatedActivities.map((activity) => (
            <Card key={activity.id} className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-semibold text-white">{activity.title}</h3>
                    <Badge className="bg-purple-600 text-purple-100">
                      Generado por IA
                    </Badge>
                  </div>
                  
                  <p className="text-gray-400">{activity.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Duración</p>
                      <p className="text-white font-medium">{activity.duration} minutos</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Dificultad</p>
                      <p className="text-white font-medium">{activity.difficulty}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Prioridad</p>
                      <p className="text-white font-medium">{activity.priority}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Materia</p>
                      <p className="text-white font-medium">{activity.subject}</p>
                    </div>
                  </div>

                  {/* Modification Section */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Modificar actividad con IA:
                      </label>
                      <textarea
                        value={modificationRequest}
                        onChange={(e) => setModificationRequest(e.target.value)}
                        placeholder="Describe qué modificaciones deseas hacer a esta actividad..."
                        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-gray-400 focus:border-purple-500 focus:outline-none"
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button 
                        onClick={() => handleViewDetails(activity)}
                        variant="outline" 
                        className="border-blue-600 text-blue-300 hover:bg-blue-600 hover:text-white"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Ver Detalles
                      </Button>
                      
                      <Button 
                        onClick={() => handleAssignToStudent(activity, plan)}
                        disabled={assigningActivity === activity.id || activity.status === 'assigned'}
                        className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
                      >
                        {assigningActivity === activity.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Asignando...
                          </>
                        ) : activity.status === 'assigned' ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Ya Asignada
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Asignar a {plan.studentName}
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        onClick={() => handleModifyActivity(activity)}
                        disabled={modifyingActivity === activity.id || !modificationRequest.trim()}
                        variant="outline" 
                        className="border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white"
                      >
                        {modifyingActivity === activity.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-300 mr-2"></div>
                            Modificando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Modificar con IA
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Detalles de Actividad */}
      {showDetailsModal && selectedActivity && (
        <ActivityDetailsModal
          activity={selectedActivity}
          plan={plan}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedActivity(null);
          }}
          onAssignToStudent={handleAssignToStudent}
        />
      )}
    </div>
  );
};

export default TeacherPlanReceiver;
