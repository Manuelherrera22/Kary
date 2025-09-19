import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Bell, 
  Clock, 
  User, 
  Heart, 
  Brain, 
  Target,
  CheckCircle,
  X,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import psychopedagogueService from '@/services/psychopedagogueService';
import notificationService from '@/services/notificationService';

const RealTimeAlerts = () => {
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadAlerts();
    setupRealTimeUpdates();
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [searchTerm, priorityFilter, typeFilter, alerts]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      // Cargar alertas emocionales
      const emotionalResult = await psychopedagogueService.getAllEmotionalAlerts();
      if (emotionalResult.success) {
        const emotionalAlerts = emotionalResult.data.map(alert => ({
          ...alert,
          type: 'emotional',
          icon: Heart,
          color: 'red'
        }));
        setAlerts(emotionalAlerts);
      }

      // Cargar notificaciones del sistema
      const notificationResult = await notificationService.getUserNotifications('psychopedagogue', 'psychopedagogue');
      if (notificationResult.success) {
        const systemAlerts = notificationResult.data
          .filter(notif => notif.priority === 'urgent' || notif.priority === 'high')
          .map(notif => ({
            ...notif,
            type: 'system',
            icon: Bell,
            color: 'orange',
            studentName: notif.title,
            description: notif.message
          }));
        setAlerts(prev => [...prev, ...systemAlerts]);
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
      // Fallback data
      const mockAlerts = [
        {
          id: 1,
          type: 'emotional',
          studentName: 'María García',
          grade: '5to Primaria',
          priority: 'high',
          description: 'Aumento significativo en episodios de ansiedad durante las clases',
          icon: Heart,
          color: 'red',
          createdAt: new Date().toISOString(),
          status: 'active'
        },
        {
          id: 2,
          type: 'behavioral',
          studentName: 'Carlos López',
          grade: '4to Primaria',
          priority: 'medium',
          description: 'Comportamiento disruptivo en el aula - requiere intervención',
          icon: AlertTriangle,
          color: 'yellow',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          status: 'active'
        },
        {
          id: 3,
          type: 'academic',
          studentName: 'Ana Rodríguez',
          grade: '6to Primaria',
          priority: 'high',
          description: 'Bajo rendimiento académico persistente - necesita evaluación',
          icon: Target,
          color: 'red',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          status: 'active'
        },
        {
          id: 4,
          type: 'system',
          studentName: 'Sistema Kary',
          grade: '',
          priority: 'urgent',
          description: 'Nueva actualización disponible con mejoras en el seguimiento emocional',
          icon: Bell,
          color: 'blue',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          status: 'active'
        }
      ];
      setAlerts(mockAlerts);
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    // Suscribirse a alertas emocionales
    const emotionalUnsubscribe = psychopedagogueService.subscribe((event, data) => {
      if (event === 'emotional_alert_created') {
        const newAlert = {
          ...data,
          type: 'emotional',
          icon: Heart,
          color: 'red'
        };
        setAlerts(prev => [newAlert, ...prev]);
      }
    });

    // Suscribirse a notificaciones del sistema
    const notificationUnsubscribe = notificationService.subscribeToTeacher('psychopedagogue', (event, data) => {
      if (event === 'notification_created' && (data.priority === 'urgent' || data.priority === 'high')) {
        const newAlert = {
          ...data,
          type: 'system',
          icon: Bell,
          color: 'orange',
          studentName: data.title,
          description: data.message
        };
        setAlerts(prev => [newAlert, ...prev]);
      }
    });

    return () => {
      if (emotionalUnsubscribe) emotionalUnsubscribe();
      if (notificationUnsubscribe) notificationUnsubscribe();
    };
  };

  const filterAlerts = () => {
    let filtered = alerts;

    if (searchTerm) {
      filtered = filtered.filter(alert => 
        alert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(alert => alert.priority === priorityFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(alert => alert.type === typeFilter);
    }

    setFilteredAlerts(filtered);
  };

  const handleDismissAlert = async (alertId) => {
    try {
      // Marcar como leída en el servicio
      await notificationService.markNotificationAsRead(alertId);
      
      // Actualizar estado local
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Error dismissing alert:', error);
      // Fallback: solo actualizar estado local
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    }
  };

  const handleRefresh = () => {
    loadAlerts();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'emotional': return 'text-red-400';
      case 'behavioral': return 'text-yellow-400';
      case 'academic': return 'text-blue-400';
      case 'system': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const alertDate = new Date(date);
    const diffInMinutes = Math.floor((now - alertDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} h`;
    return `Hace ${Math.floor(diffInMinutes / 1440)} días`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-200">Alertas en Tiempo Real</h2>
          <p className="text-slate-400">Monitorea alertas críticas y notificaciones del sistema</p>
        </div>
        <Button 
          onClick={handleRefresh}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <RefreshCw size={20} className="mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/90 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar alertas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todas las prioridades</option>
              <option value="urgent">Urgente</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos los tipos</option>
              <option value="emotional">Emocional</option>
              <option value="behavioral">Comportamental</option>
              <option value="academic">Académico</option>
              <option value="system">Sistema</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Card className="bg-slate-800/90 border-slate-700/50">
            <CardContent className="p-8 text-center">
              <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No hay alertas</h3>
              <p className="text-slate-400">No se encontraron alertas que coincidan con los filtros aplicados.</p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => {
            const IconComponent = alert.icon;
            return (
              <Card key={alert.id} className="bg-slate-800/90 border-slate-700/50 hover:border-slate-600/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-2 rounded-lg ${getTypeColor(alert.type)} bg-slate-700/50`}>
                        <IconComponent size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-200">{alert.studentName}</h3>
                          {alert.grade && (
                            <span className="text-sm text-slate-400">{alert.grade}</span>
                          )}
                          <Badge className={getPriorityColor(alert.priority)}>
                            {alert.priority}
                          </Badge>
                          <Badge className="bg-slate-600/20 text-slate-300 border-slate-500/30">
                            {alert.type}
                          </Badge>
                        </div>
                        <p className="text-slate-300 mb-3">{alert.description}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{getTimeAgo(alert.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User size={16} />
                            <span>Estudiante</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDismissAlert(alert.id)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle size={20} className="text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-200">
                  {alerts.filter(a => a.priority === 'urgent' || a.priority === 'high').length}
                </p>
                <p className="text-sm text-slate-400">Alertas Críticas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock size={20} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-200">
                  {alerts.filter(a => a.priority === 'medium').length}
                </p>
                <p className="text-sm text-slate-400">Alertas Medias</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Heart size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-200">
                  {alerts.filter(a => a.type === 'emotional').length}
                </p>
                <p className="text-sm text-slate-400">Emocionales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Bell size={20} className="text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-200">
                  {alerts.filter(a => a.type === 'system').length}
                </p>
                <p className="text-sm text-slate-400">Sistema</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeAlerts;


