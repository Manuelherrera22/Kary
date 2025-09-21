import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { useMockAuth } from '@/contexts/MockAuthContext';
import ActivityPlayer from '@/components/ActivityPlayer';
import { 
  BookOpen, 
  Clock, 
  Target, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Star,
  Calendar,
  User,
  Bell,
  Activity,
  Zap
} from 'lucide-react';

const StudentActivitiesReceiver = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useMockAuth();
  
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showActivityPlayer, setShowActivityPlayer] = useState(false);
  const [playerActivity, setPlayerActivity] = useState(null);

  // Mock data - en producción esto vendría de un servicio real
  useEffect(() => {
    const loadStudentActivities = async () => {
      setIsLoading(true);
      
      // Simular carga de actividades
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos mock de actividades asignadas al estudiante
      const mockActivities = [
        {
          id: 'activity-1',
          title: 'Conteo básico - Matemáticas',
          description: 'Actividad de matemáticas básicas adaptada. Enfocada en conteo básico con apoyo visual y manipulativos.',
          subject: 'mathematics',
          difficulty: 'beginner',
          duration: 10,
          status: 'assigned', // assigned, in_progress, completed, paused
          assignedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 días atrás
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 días desde ahora
          teacherName: 'Prof. María González',
          materials: ['Lápiz', 'Papel', 'Calculadora básica', 'Contadores'],
          objectives: [
            'Contar del 1 al 10',
            'Reconocer números básicos',
            'Asociar cantidad con número'
          ],
          adaptations: ['Materiales visuales', 'Diagramas', 'Apoyo individual'],
          progress: 0,
          attempts: 0,
          maxAttempts: 3,
          points: 50
        },
        {
          id: 'activity-2',
          title: 'Lectura de palabras simples',
          description: 'Actividad de lectura adaptada para mejorar la comprensión de palabras básicas.',
          subject: 'reading',
          difficulty: 'beginner',
          duration: 15,
          status: 'in_progress',
          assignedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          teacherName: 'Prof. Carlos Ruiz',
          materials: ['Libro de lectura', 'Tarjetas de palabras', 'Marcador'],
          objectives: [
            'Leer palabras de 2-3 sílabas',
            'Comprender significado básico',
            'Mejorar fluidez lectora'
          ],
          adaptations: ['Letra grande', 'Palabras familiares', 'Tiempo extra'],
          progress: 45,
          attempts: 1,
          maxAttempts: 5,
          points: 75
        },
        {
          id: 'activity-3',
          title: 'Sumas simples - Matemáticas',
          description: 'Actividad de matemáticas para practicar sumas básicas con números del 1 al 10.',
          subject: 'mathematics',
          difficulty: 'intermediate',
          duration: 20,
          status: 'completed',
          assignedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          teacherName: 'Prof. María González',
          materials: ['Lápiz', 'Papel', 'Calculadora básica'],
          objectives: [
            'Sumar números del 1 al 10',
            'Resolver problemas simples',
            'Verificar resultados'
          ],
          adaptations: ['Materiales visuales', 'Diagramas'],
          progress: 100,
          attempts: 2,
          maxAttempts: 3,
          points: 100,
          completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      setActivities(mockActivities);
      setIsLoading(false);
    };

    loadStudentActivities();
  }, [user]);

  const getSubjectIcon = (subject) => {
    switch (subject) {
      case 'mathematics': return '🔢';
      case 'reading': return '📖';
      case 'writing': return '✍️';
      case 'science': return '🔬';
      default: return '📚';
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'bg-blue-600';
      case 'in_progress': return 'bg-yellow-600';
      case 'completed': return 'bg-green-600';
      case 'paused': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'assigned': return 'Asignada';
      case 'in_progress': return 'En Progreso';
      case 'completed': return 'Completada';
      case 'paused': return 'Pausada';
      default: return 'Desconocido';
    }
  };

  const handleStartActivity = (activityId) => {
    setActivities(prev => prev.map(activity => 
      activity.id === activityId 
        ? { ...activity, status: 'in_progress', startedAt: new Date().toISOString() }
        : activity
    ));
    
    toast({
      title: '🎯 Actividad Iniciada',
      description: '¡Buena suerte! Puedes pausar y reanudar cuando quieras.',
      variant: 'default',
    });
  };

  const handlePauseActivity = (activityId) => {
    setActivities(prev => prev.map(activity => 
      activity.id === activityId 
        ? { ...activity, status: 'paused' }
        : activity
    ));
    
    toast({
      title: '⏸️ Actividad Pausada',
      description: 'Puedes reanudar cuando estés listo.',
      variant: 'default',
    });
  };

  const handleCompleteActivity = (activityId) => {
    setActivities(prev => prev.map(activity => 
      activity.id === activityId 
        ? { 
            ...activity, 
            status: 'completed', 
            progress: 100,
            completedAt: new Date().toISOString()
          }
        : activity
    ));
    
    toast({
      title: '🎉 ¡Actividad Completada!',
      description: '¡Excelente trabajo! Has ganado puntos.',
      variant: 'default',
    });
  };

  const handleOpenActivity = (activity) => {
    setPlayerActivity(activity);
    setShowActivityPlayer(true);
  };

  const handleCloseActivityPlayer = () => {
    setShowActivityPlayer(false);
    setPlayerActivity(null);
  };

  const handleActivityCompleted = (results) => {
    // Actualizar la actividad con los resultados
    setActivities(prev => prev.map(activity => 
      activity.id === results.activityId 
        ? { 
            ...activity, 
            status: 'completed', 
            progress: 100,
            completedAt: results.completedAt,
            results: results.results,
            mode: results.mode
          }
        : activity
    ));
    
    // Mostrar mensaje de éxito
    const modeText = results.mode === 'gamified' ? 'gamificada' : 'tradicional';
    toast({
      title: '🎉 ¡Actividad Completada!',
      description: `Has terminado la actividad en modalidad ${modeText}. ¡Excelente trabajo!`,
      variant: 'default',
    });
  };

  const filteredActivities = activities.filter(activity => {
    if (filterStatus === 'all') return true;
    return activity.status === filterStatus;
  });

  const getActivityStats = () => {
    const total = activities.length;
    const completed = activities.filter(a => a.status === 'completed').length;
    const inProgress = activities.filter(a => a.status === 'in_progress').length;
    const assigned = activities.filter(a => a.status === 'assigned').length;
    const totalPoints = activities.reduce((sum, a) => sum + (a.points || 0), 0);
    const earnedPoints = activities
      .filter(a => a.status === 'completed')
      .reduce((sum, a) => sum + (a.points || 0), 0);

    return { total, completed, inProgress, assigned, totalPoints, earnedPoints };
  };

  const stats = getActivityStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        <span className="ml-3 text-gray-400">Cargando actividades...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <Card 
        className="border-blue-500/30"
        style={{
          backgroundColor: '#1e293b',
          opacity: 1,
          background: '#1e293b'
        }}
      >
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="w-6 h-6 mr-3 text-blue-400" />
            Mis Actividades
          </CardTitle>
          <p className="text-gray-400">
            Actividades personalizadas asignadas por tus profesores
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div 
              className="rounded-lg p-3 text-center"
              style={{
                backgroundColor: '#334155',
                opacity: 1,
                background: '#334155'
              }}
            >
              <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
            <div 
              className="rounded-lg p-3 text-center"
              style={{
                backgroundColor: '#334155',
                opacity: 1,
                background: '#334155'
              }}
            >
              <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
              <div className="text-sm text-gray-400">Completadas</div>
            </div>
            <div 
              className="rounded-lg p-3 text-center"
              style={{
                backgroundColor: '#334155',
                opacity: 1,
                background: '#334155'
              }}
            >
              <div className="text-2xl font-bold text-yellow-400">{stats.inProgress}</div>
              <div className="text-sm text-gray-400">En Progreso</div>
            </div>
            <div 
              className="rounded-lg p-3 text-center"
              style={{
                backgroundColor: '#334155',
                opacity: 1,
                background: '#334155'
              }}
            >
              <div className="text-2xl font-bold text-purple-400">{stats.earnedPoints}</div>
              <div className="text-sm text-gray-400">Puntos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'assigned', 'in_progress', 'completed'].map(status => (
          <Button
            key={status}
            variant={filterStatus === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus(status)}
            className={filterStatus === status ? 'text-white' : ''}
            style={filterStatus === status ? {
              backgroundColor: '#3b82f6',
              opacity: 1,
              background: '#3b82f6'
            } : {}}
          >
            {status === 'all' ? 'Todas' : getStatusText(status)}
            {status !== 'all' && (
              <Badge 
                variant="secondary" 
                className="ml-2"
                style={{
                  backgroundColor: '#475569',
                  color: 'white'
                }}
              >
                {activities.filter(a => a.status === status).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Lista de actividades */}
      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <Card 
            className="border-gray-600"
            style={{
              backgroundColor: '#1e293b',
              opacity: 1,
              background: '#1e293b'
            }}
          >
            <CardContent className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No hay actividades
              </h3>
              <p className="text-gray-400">
                {filterStatus === 'all' 
                  ? 'No tienes actividades asignadas aún'
                  : `No hay actividades con estado "${getStatusText(filterStatus)}"`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredActivities.map(activity => (
            <Card 
              key={activity.id}
              className="border-slate-600"
              style={{
                backgroundColor: '#1e293b',
                opacity: 1,
                background: '#1e293b'
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getSubjectIcon(activity.subject)}</span>
                      <h3 className="text-xl font-semibold text-white">{activity.title}</h3>
                      <Badge 
                        className={`${getDifficultyColor(activity.difficulty)} text-white`}
                      >
                        {activity.difficulty}
                      </Badge>
                      <Badge 
                        className={`${getStatusColor(activity.status)} text-white`}
                      >
                        {getStatusText(activity.status)}
                      </Badge>
                    </div>
                    <p className="text-gray-300 mb-3">{activity.description}</p>
                    
                    {/* Información de la actividad */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 text-blue-400 mr-2" />
                        <span className="text-gray-300">{activity.duration} min</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-gray-300">{activity.teacherName}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 text-purple-400 mr-2" />
                        <span className="text-gray-300">
                          {new Date(activity.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 text-yellow-400 mr-2" />
                        <span className="text-gray-300">{activity.points} puntos</span>
                      </div>
                    </div>

                    {/* Progreso */}
                    {activity.status === 'in_progress' && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Progreso</span>
                          <span className="text-blue-400">{activity.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${activity.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Materiales y Objetivos */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-blue-400" />
                      Materiales
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activity.materials.map((material, index) => (
                        <Badge 
                          key={index}
                          variant="outline"
                          className="text-xs border-gray-600 text-gray-300"
                        >
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-green-400" />
                      Objetivos
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {activity.objectives.slice(0, 2).map((objective, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                          {objective}
                        </li>
                      ))}
                      {activity.objectives.length > 2 && (
                        <li className="text-gray-400 text-xs">
                          +{activity.objectives.length - 2} más...
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3">
                  {activity.status === 'assigned' && (
                    <Button
                      onClick={() => handleOpenActivity(activity)}
                      className="text-white"
                      style={{
                        backgroundColor: '#059669',
                        opacity: 1,
                        background: '#059669'
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Realizar Actividad
                    </Button>
                  )}
                  
                  {activity.status === 'in_progress' && (
                    <>
                      <Button
                        onClick={() => handlePauseActivity(activity.id)}
                        variant="outline"
                        className="text-gray-300 border-gray-600"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Pausar
                      </Button>
                      <Button
                        onClick={() => handleOpenActivity(activity)}
                        className="text-white"
                        style={{
                          backgroundColor: '#3b82f6',
                          opacity: 1,
                          background: '#3b82f6'
                        }}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Continuar
                      </Button>
                    </>
                  )}
                  
                  {activity.status === 'paused' && (
                    <Button
                      onClick={() => handleOpenActivity(activity)}
                      className="text-white"
                      style={{
                        backgroundColor: '#3b82f6',
                        opacity: 1,
                        background: '#3b82f6'
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Reanudar
                    </Button>
                  )}
                  
                  {activity.status === 'completed' && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">¡Completada!</span>
                        <span className="text-sm text-gray-400 ml-2">
                          {activity.completedAt && 
                            new Date(activity.completedAt).toLocaleDateString()
                          }
                        </span>
                      </div>
                      <Button
                        onClick={() => handleOpenActivity(activity)}
                        variant="outline"
                        size="sm"
                        className="text-gray-300 border-gray-600"
                      >
                        Ver Resultados
                      </Button>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenActivity(activity)}
                    className="text-gray-300 border-gray-600"
                  >
                    Ver Detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Reproductor de Actividades */}
      <ActivityPlayer
        activity={playerActivity}
        isOpen={showActivityPlayer}
        onClose={handleCloseActivityPlayer}
        onComplete={handleActivityCompleted}
      />
    </div>
  );
};

export default StudentActivitiesReceiver;
