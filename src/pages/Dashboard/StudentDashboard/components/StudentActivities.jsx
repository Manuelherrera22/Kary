import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Send,
  Calendar,
  Target,
  Brain,
  Zap
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import activityService from '@/services/activityService';
import notificationService from '@/services/notificationService';

const StudentActivities = () => {
  const { t } = useLanguage();
  const { userProfile } = useMockAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [submission, setSubmission] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadActivities();
    
    // Suscribirse a cambios en actividades
    const unsubscribe = activityService.subscribeToStudent(userProfile.id, (event, data) => {
      if (event === 'activity_assigned' || event === 'activity_progress_updated') {
        loadActivities();
      }
    });

    return unsubscribe;
  }, [userProfile.id]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const result = await activityService.getStudentActivities(userProfile.id);
      if (result.success) {
        setActivities(result.data);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      toast({
        title: "Error",
        description: "Error al cargar las actividades",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartActivity = (activity) => {
    setSelectedActivity(activity);
    setSubmission('');
  };

  const handleSubmitActivity = async () => {
    if (!selectedActivity || !submission.trim()) {
      toast({
        title: "Error",
        description: "Por favor escribe tu respuesta",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      const result = await activityService.submitActivity(
        selectedActivity.id, 
        submission, 
        userProfile.id
      );

      if (result.success) {
        toast({
          title: "¡Actividad Entregada!",
          description: "Tu actividad se ha enviado correctamente",
          variant: "default"
        });
        
        // Actualizar la actividad local
        setActivities(prev => 
          prev.map(a => a.id === selectedActivity.id ? result.data.activity : a)
        );
        
        setSelectedActivity(null);
        setSubmission('');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al enviar la actividad",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProgress = async (activity, progress) => {
    try {
      const result = await activityService.updateActivityProgress(
        activity.id, 
        progress, 
        userProfile.id
      );

      if (result.success) {
        setActivities(prev => 
          prev.map(a => a.id === activity.id ? result.data : a)
        );
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'assigned': return <Clock size={16} className="text-yellow-400" />;
      case 'in_progress': return <Play size={16} className="text-blue-400" />;
      case 'completed': return <CheckCircle size={16} className="text-green-400" />;
      case 'overdue': return <AlertCircle size={16} className="text-red-400" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'in_progress': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'completed': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'overdue': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'interactive': return <Zap size={16} />;
      case 'experiment': return <Target size={16} />;
      case 'creative': return <Brain size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && selectedActivity?.status !== 'completed';
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando actividades...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full space-y-6"
    >
      {/* Header */}
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
              <BookOpen size={24} className="text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-blue-300">
                Mis Actividades
              </CardTitle>
              <p className="text-sm text-slate-400">
                {activities.length} actividades asignadas
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Lista de actividades */}
      <div className="space-y-4">
        {activities.length === 0 ? (
          <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl">
            <CardContent className="p-8 text-center">
              <BookOpen size={48} className="text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">
                No hay actividades asignadas
              </h3>
              <p className="text-slate-400">
                Cuando tu profesor te asigne actividades, aparecerán aquí
              </p>
            </CardContent>
          </Card>
        ) : (
          activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                        {getTypeIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-slate-200 mb-2">
                          {activity.title}
                        </CardTitle>
                        <p className="text-sm text-slate-400 mb-3">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(activity.dueDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {activity.duration} min
                          </span>
                          <span>{activity.subject}</span>
                          <span>{activity.grade}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(activity.status)}>
                        {getStatusIcon(activity.status)}
                        <span className="ml-1">
                          {activity.status === 'assigned' ? 'Asignada' :
                           activity.status === 'in_progress' ? 'En Progreso' :
                           activity.status === 'completed' ? 'Completada' : 'Vencida'}
                        </span>
                      </Badge>
                      {isOverdue(activity.dueDate) && (
                        <Badge className="text-red-400 bg-red-500/20 border-red-500/30">
                          <AlertCircle size={14} className="mr-1" />
                          Vencida
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Progreso */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-slate-300 mb-2">
                      <span>Progreso</span>
                      <span>{activity.progress}%</span>
                    </div>
                    <Progress 
                      value={activity.progress} 
                      className="h-2 bg-slate-700" 
                      indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500"
                    />
                  </div>

                  {/* Materiales y pasos */}
                  {activity.materials && activity.materials.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-300 mb-2">Materiales necesarios:</h4>
                      <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                        {activity.materials.map((material, index) => (
                          <li key={index}>{material}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activity.steps && activity.steps.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-300 mb-2">Pasos a seguir:</h4>
                      <ol className="list-decimal list-inside text-sm text-slate-400 space-y-1">
                        {activity.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Feedback del profesor */}
                  {activity.feedback && (
                    <div className="mb-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                      <h4 className="text-sm font-semibold text-slate-300 mb-2">Feedback del profesor:</h4>
                      <p className="text-sm text-slate-400">{activity.feedback.content}</p>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    {activity.status === 'assigned' && (
                      <Button
                        onClick={() => handleStartActivity(activity)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Play size={16} className="mr-2" />
                        Comenzar
                      </Button>
                    )}
                    
                    {activity.status === 'in_progress' && (
                      <Button
                        onClick={() => handleStartActivity(activity)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Play size={16} className="mr-2" />
                        Continuar
                      </Button>
                    )}

                    {activity.status === 'completed' && (
                      <Button
                        variant="outline"
                        className="text-green-400 border-green-500/30"
                        disabled
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Completada
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal de actividad */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedActivity(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="border-0 bg-slate-900">
                <CardHeader className="border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                        {getTypeIcon(selectedActivity.type)}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-purple-300">
                          {selectedActivity.title}
                        </CardTitle>
                        <p className="text-sm text-slate-400">
                          {selectedActivity.subject} • {selectedActivity.grade}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedActivity(null)}
                      className="text-slate-400 hover:text-slate-100"
                    >
                      <X size={20} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 overflow-y-auto">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-200 mb-2">Descripción</h3>
                      <p className="text-slate-300">{selectedActivity.description}</p>
                    </div>

                    {selectedActivity.steps && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-200 mb-2">Pasos a seguir</h3>
                        <ol className="list-decimal list-inside text-slate-300 space-y-2">
                          {selectedActivity.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {selectedActivity.materials && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-200 mb-2">Materiales necesarios</h3>
                        <ul className="list-disc list-inside text-slate-300 space-y-1">
                          {selectedActivity.materials.map((material, index) => (
                            <li key={index}>{material}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold text-slate-200 mb-2">Tu respuesta</h3>
                      <Textarea
                        value={submission}
                        onChange={(e) => setSubmission(e.target.value)}
                        placeholder="Escribe tu respuesta aquí..."
                        className="bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-400"
                        rows={6}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end p-6 border-t border-slate-700 bg-slate-800">
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedActivity(null)} 
                    className="text-slate-300 hover:bg-slate-700 hover:text-slate-100 mr-2"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSubmitActivity}
                    disabled={!submission.trim() || submitting}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send size={16} className="mr-2" />
                        Enviar Actividad
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StudentActivities;





