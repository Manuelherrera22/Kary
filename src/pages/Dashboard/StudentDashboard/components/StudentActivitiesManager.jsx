import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Star, 
  Target, 
  TrendingUp,
  Calendar,
  MessageSquare,
  AlertCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import studentActivityService from '@/services/studentActivityService';

const StudentActivitiesManager = () => {
  const { t } = useLanguage();
  const { user } = useMockAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, completed, overdue

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const result = await studentActivityService.getStudentActivities(user.id);
        if (result.success) {
          setActivities(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching student activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user?.id]);

  const filteredActivities = activities.filter(activity => {
    switch (filter) {
      case 'pending':
        return activity.status === 'assigned' || activity.status === 'in_progress';
      case 'completed':
        return activity.status === 'completed';
      case 'overdue':
        return new Date(activity.due_date) < new Date() && activity.status !== 'completed';
      default:
        return true;
    }
  });

  const handleStartActivity = async (activityId) => {
    try {
      const result = await studentActivityService.updateActivityStatus(activityId, 'in_progress');
      if (result.success) {
        setActivities(prev => prev.map(activity => 
          activity.id === activityId 
            ? { ...activity, status: 'in_progress', started_at: new Date().toISOString() }
            : activity
        ));
      }
    } catch (error) {
      console.error('Error starting activity:', error);
    }
  };

  const handleCompleteActivity = async (activityId) => {
    try {
      const result = await studentActivityService.updateActivityStatus(activityId, 'completed');
      if (result.success) {
        setActivities(prev => prev.map(activity => 
          activity.id === activityId 
            ? { ...activity, status: 'completed', completed_at: new Date().toISOString() }
            : activity
        ));
      }
    } catch (error) {
      console.error('Error completing activity:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'assigned': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completada';
      case 'in_progress': return 'En progreso';
      case 'assigned': return 'Asignada';
      case 'overdue': return 'Vencida';
      default: return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/60">
        <CardHeader>
          <CardTitle className="text-xl text-blue-300">📚 Mis Actividades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/60">
      <CardHeader>
        <CardTitle className="text-xl text-blue-300 flex items-center gap-2">
          📚 Mis Actividades
          <Badge variant="outline" className="text-xs">
            {filteredActivities.length} actividades
          </Badge>
        </CardTitle>
        
        {/* Filtros */}
        <div className="flex gap-2 mt-4">
          {['all', 'pending', 'completed', 'overdue'].map(filterType => (
            <Button
              key={filterType}
              variant={filter === filterType ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterType)}
              className="text-xs"
            >
              {filterType === 'all' ? 'Todas' : 
               filterType === 'pending' ? 'Pendientes' :
               filterType === 'completed' ? 'Completadas' : 'Vencidas'}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay actividades {filter === 'all' ? '' : filter}</p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{activity.title}</h4>
                    <p className="text-slate-300 text-sm mb-2">{activity.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.duration} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {activity.difficulty}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(activity.due_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <Badge className={`${getStatusColor(activity.status)} text-white`}>
                    {getStatusText(activity.status)}
                  </Badge>
                </div>
                
                {/* Objetivo */}
                <div className="mb-3">
                  <p className="text-sm text-slate-300">
                    <strong>Objetivo:</strong> {activity.objective}
                  </p>
                </div>
                
                {/* Materiales */}
                {activity.materials && activity.materials.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-slate-300">
                      <strong>Materiales:</strong> {Array.isArray(activity.materials) ? activity.materials.join(', ') : activity.materials}
                    </p>
                  </div>
                )}
                
                {/* Instrucciones */}
                <div className="mb-4">
                  <p className="text-sm text-slate-300">
                    <strong>Instrucciones:</strong> {activity.instructions}
                  </p>
                </div>
                
                {/* Botones de acción */}
                <div className="flex gap-2">
                  {activity.status === 'assigned' && (
                    <Button
                      size="sm"
                      onClick={() => handleStartActivity(activity.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Comenzar
                    </Button>
                  )}
                  
                  {activity.status === 'in_progress' && (
                    <Button
                      size="sm"
                      onClick={() => handleCompleteActivity(activity.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Completar
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {/* Ver detalles */}}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Ver detalles
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentActivitiesManager;
