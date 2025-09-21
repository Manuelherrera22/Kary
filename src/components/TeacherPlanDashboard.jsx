import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { getTeacherCommunications, acknowledgeCommunication } from '@/services/teacherCommunicationService';
import ActivityGeneratorFromPlan from './ActivityGeneratorFromPlan';
import { 
  Mail, 
  Clock, 
  User, 
  Target, 
  Activity,
  CheckCircle,
  AlertCircle,
  FileText,
  Eye,
  Check,
  Calendar,
  TrendingUp
} from 'lucide-react';

const TeacherPlanDashboard = ({ teacherId = 'teacher-1' }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [communications, setCommunications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showActivityGenerator, setShowActivityGenerator] = useState(false);
  const [selectedPlanForActivities, setSelectedPlanForActivities] = useState(null);

  useEffect(() => {
    loadCommunications();
  }, [teacherId, filterStatus]);

  const loadCommunications = async () => {
    setIsLoading(true);
    try {
      const result = await getTeacherCommunications(teacherId, filterStatus === 'all' ? null : filterStatus);
      if (result.success) {
        setCommunications(result.communications);
      }
    } catch (error) {
      console.error('Error cargando comunicaciones:', error);
      toast({
        title: 'Error',
        description: 'Error cargando planes de apoyo',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcknowledgePlan = async (communicationId) => {
    try {
      const result = await acknowledgeCommunication(communicationId, teacherId);
      if (result.success) {
        toast({
          title: 'Plan Aceptado',
          description: 'Has aceptado el plan de apoyo',
          variant: 'default',
        });
        loadCommunications(); // Recargar lista
      }
    } catch (error) {
      console.error('Error aceptando plan:', error);
      toast({
        title: 'Error',
        description: 'Error aceptando el plan',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateActivitiesFromPlan = (plan) => {
    setSelectedPlanForActivities(plan);
    setShowActivityGenerator(true);
  };

  const handleActivitiesAssigned = (assignedActivities) => {
    console.log('Actividades asignadas:', assignedActivities);
    setShowActivityGenerator(false);
    setSelectedPlanForActivities(null);
    toast({
      title: 'Actividades Asignadas',
      description: `Se han asignado ${assignedActivities.length} actividades al estudiante`,
      variant: 'default',
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      default: return 'bg-green-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'bg-blue-600';
      case 'acknowledged': return 'bg-green-600';
      case 'implemented': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'sent': return 'Enviado';
      case 'acknowledged': return 'Aceptado';
      case 'implemented': return 'Implementado';
      default: return 'Desconocido';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Clock className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-400">Cargando planes de apoyo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Planes de Apoyo Recibidos</h2>
          <p className="text-gray-400">Planes generados por IA desde el psicopedagogo</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-blue-600 text-white">
            {communications.length} planes
          </Badge>
        </div>
      </div>

      {/* Filtros */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Button
              onClick={() => setFilterStatus('all')}
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              className={filterStatus === 'all' ? 'bg-blue-600' : 'border-slate-500 text-gray-300'}
            >
              Todos
            </Button>
            <Button
              onClick={() => setFilterStatus('sent')}
              variant={filterStatus === 'sent' ? 'default' : 'outline'}
              size="sm"
              className={filterStatus === 'sent' ? 'bg-blue-600' : 'border-slate-500 text-gray-300'}
            >
              Pendientes
            </Button>
            <Button
              onClick={() => setFilterStatus('acknowledged')}
              variant={filterStatus === 'acknowledged' ? 'default' : 'outline'}
              size="sm"
              className={filterStatus === 'acknowledged' ? 'bg-blue-600' : 'border-slate-500 text-gray-300'}
            >
              Aceptados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Planes */}
      {communications.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 text-center">
            <Mail className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No hay planes de apoyo
            </h3>
            <p className="text-gray-400">
              {filterStatus === 'all' 
                ? 'No has recibido planes de apoyo aún.'
                : `No hay planes con estado "${getStatusText(filterStatus)}".`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {communications.map((comm) => (
            <Card key={comm.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-blue-400" />
                      {comm.subject}
                    </CardTitle>
                    <p className="text-gray-400 text-sm mt-1">
                      {comm.content.substring(0, 100)}...
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getPriorityColor(comm.priority)}>
                      {comm.priority}
                    </Badge>
                    <Badge className={getStatusColor(comm.status)}>
                      {getStatusText(comm.status)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-blue-400 mr-2" />
                    <div>
                      <span className="text-gray-400 text-xs">Estudiante:</span>
                      <p className="text-white text-sm font-medium">
                        {comm.metadata?.ai_analysis?.learningProfile?.style || 'No especificado'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 text-green-400 mr-2" />
                    <div>
                      <span className="text-gray-400 text-xs">Actividades:</span>
                      <p className="text-white text-sm font-medium">
                        {comm.metadata?.activities_count || 0} generadas
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-purple-400 mr-2" />
                    <div>
                      <span className="text-gray-400 text-xs">Timeline:</span>
                      <p className="text-white text-sm font-medium">
                        {comm.metadata?.implementation_timeline || 'No especificado'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-orange-400 mr-2" />
                    <div>
                      <span className="text-gray-400 text-xs">Recibido:</span>
                      <p className="text-white text-sm font-medium">
                        {formatDate(comm.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Necesidades Principales */}
                {comm.metadata?.ai_analysis?.priorityNeeds && (
                  <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
                    <h4 className="font-semibold text-white text-sm mb-2">Necesidades Principales:</h4>
                    <div className="flex flex-wrap gap-2">
                      {comm.metadata.ai_analysis.priorityNeeds.slice(0, 3).map((need, index) => (
                        <Badge key={index} variant="outline" className="border-slate-500 text-gray-300 text-xs">
                          {need.category}: {need.priority}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => setSelectedPlan(comm)}
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Plan Completo
                  </Button>
                  
                  {comm.status === 'sent' && (
                    <div className="flex gap-1">
                      <Button
                        onClick={() => handleAcknowledgePlan(comm.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Aceptar
                      </Button>
                      <Button
                        onClick={() => handleGenerateActivitiesFromPlan(comm)}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Activity className="w-4 h-4 mr-1" />
                        Crear Actividades
                      </Button>
                    </div>
                  )}
                  
                  {comm.status === 'acknowledged' && (
                    <div className="flex gap-1">
                      <Badge className="bg-green-600 text-white px-2 py-1 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Aceptado
                      </Badge>
                      <Button
                        onClick={() => handleGenerateActivitiesFromPlan(comm)}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Activity className="w-4 h-4 mr-1" />
                        Crear Actividades
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Plan Completo */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-slate-800 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white">{selectedPlan.subject}</CardTitle>
                  <p className="text-gray-400 text-sm">
                    Recibido: {formatDate(selectedPlan.created_at)}
                  </p>
                </div>
                <Button
                  onClick={() => setSelectedPlan(null)}
                  variant="outline"
                  size="sm"
                  className="border-slate-500 text-gray-300"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-gray-300 text-sm font-mono">
                  {selectedPlan.content}
                </pre>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-700">
                <div className="flex gap-2">
                  {selectedPlan.status === 'sent' && (
                    <Button
                      onClick={() => {
                        handleAcknowledgePlan(selectedPlan.id);
                        setSelectedPlan(null);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Aceptar y Cerrar
                    </Button>
                  )}
                  <Button
                    onClick={() => setSelectedPlan(null)}
                    variant="outline"
                    className="border-slate-500 text-gray-300"
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Generador de Actividades desde Plan */}
      {showActivityGenerator && selectedPlanForActivities && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Crear Actividades desde Plan de Apoyo
                </h2>
                <Button
                  onClick={() => {
                    setShowActivityGenerator(false);
                    setSelectedPlanForActivities(null);
                  }}
                  variant="outline"
                  size="sm"
                  className="border-slate-500 text-gray-300"
                >
                  ✕
                </Button>
              </div>
              
              <ActivityGeneratorFromPlan
                supportPlan={selectedPlanForActivities}
                studentData={{
                  id: selectedPlanForActivities.student_id,
                  full_name: selectedPlanForActivities.subject.split(' - ')[1] || 'Estudiante'
                }}
                teacherId={teacherId}
                onActivitiesAssigned={handleActivitiesAssigned}
                onCancel={() => {
                  setShowActivityGenerator(false);
                  setSelectedPlanForActivities(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherPlanDashboard;
