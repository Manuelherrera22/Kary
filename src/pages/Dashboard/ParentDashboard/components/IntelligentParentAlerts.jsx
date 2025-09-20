import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Brain, 
  Heart, 
  TrendingDown, 
  Users, 
  Clock,
  CheckCircle,
  X,
  RefreshCw,
  Eye,
  MessageSquare,
  Target,
  Zap,
  Shield,
  Activity,
  BookOpen,
  Calendar,
  Star,
  Bell,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import realTimeNotificationService from '@/services/realTimeNotificationService';
import unifiedDataService from '@/services/unifiedDataService';

const IntelligentParentAlerts = () => {
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [filter, setFilter] = useState('all'); // all, urgent, high, medium, low, academic, emotional, behavioral

  useEffect(() => {
    loadAlerts();
    
    // Suscribirse a nuevas alertas
    const unsubscribe = realTimeNotificationService.subscribe('parent', (alert) => {
      if (alert.type === 'intelligent_alert' || alert.type === 'parent_alert') {
        setAlerts(prev => [alert, ...prev]);
      }
    });

    return unsubscribe;
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const result = await realTimeNotificationService.getNotifications('parent', {
        type: 'intelligent_alert'
      });
      
      if (result.success) {
        setAlerts(result.data);
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockAlerts = () => {
    const mockAlerts = [
      {
        id: 'alert-1',
        type: 'intelligent_alert',
        alertType: 'academic_concern',
        priority: 'high',
        title: 'Preocupación Académica Detectada',
        description: 'María ha mostrado una disminución del 25% en su rendimiento en matemáticas durante la última semana',
        studentId: 'student-1',
        studentName: 'María García',
        confidence: 87,
        recommendations: [
          'Revisar las tareas de matemáticas en casa',
          'Coordinar una reunión con el profesor de matemáticas',
          'Implementar sesiones de estudio adicionales'
        ],
        actions: [
          { id: '1', label: 'Contactar Profesor', type: 'immediate' },
          { id: '2', label: 'Programar Reunión', type: 'urgent' },
          { id: '3', label: 'Ver Plan de Estudio', type: 'follow_up' }
        ],
        createdAt: new Date().toISOString(),
        read: false,
        category: 'academic'
      },
      {
        id: 'alert-2',
        type: 'intelligent_alert',
        alertType: 'emotional_support',
        priority: 'medium',
        title: 'Oportunidad de Apoyo Emocional',
        description: 'Carlos ha mostrado signos de estrés durante las actividades grupales. Es un buen momento para brindar apoyo emocional.',
        studentId: 'student-2',
        studentName: 'Carlos López',
        confidence: 72,
        recommendations: [
          'Hablar con Carlos sobre sus sentimientos',
          'Implementar técnicas de relajación en casa',
          'Coordinar con el psicopedagogo si persiste'
        ],
        actions: [
          { id: '1', label: 'Iniciar Conversación', type: 'immediate' },
          { id: '2', label: 'Aplicar Técnicas de Relajación', type: 'follow_up' }
        ],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        category: 'emotional'
      },
      {
        id: 'alert-3',
        type: 'intelligent_alert',
        alertType: 'positive_reinforcement',
        priority: 'low',
        title: 'Momento de Reconocimiento',
        description: 'Ana ha completado todas sus tareas esta semana. Es un excelente momento para reconocer su esfuerzo.',
        studentId: 'student-3',
        studentName: 'Ana Rodríguez',
        confidence: 95,
        recommendations: [
          'Reconocer el esfuerzo de Ana',
          'Celebrar el logro en familia',
          'Mantener la motivación positiva'
        ],
        actions: [
          { id: '1', label: 'Reconocer Logro', type: 'immediate' },
          { id: '2', label: 'Programar Celebración', type: 'follow_up' }
        ],
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        read: true,
        category: 'positive'
      },
      {
        id: 'alert-4',
        type: 'intelligent_alert',
        alertType: 'behavioral_pattern',
        priority: 'medium',
        title: 'Patrón Comportamental Detectado',
        description: 'Se ha observado un patrón de aislamiento social durante los recreos. Podría necesitar apoyo social.',
        studentId: 'student-1',
        studentName: 'María García',
        confidence: 68,
        recommendations: [
          'Observar interacciones sociales en casa',
          'Fomentar actividades sociales',
          'Consultar con el psicopedagogo'
        ],
        actions: [
          { id: '1', label: 'Observar Comportamiento', type: 'immediate' },
          { id: '2', label: 'Fomentar Socialización', type: 'follow_up' }
        ],
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        read: false,
        category: 'behavioral'
      }
    ];

    setAlerts(mockAlerts);
    setLoading(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getAlertIcon = (alertType) => {
    switch (alertType) {
      case 'academic_concern': return <BookOpen size={20} className="text-orange-400" />;
      case 'emotional_support': return <Heart size={20} className="text-pink-400" />;
      case 'positive_reinforcement': return <Star size={20} className="text-green-400" />;
      case 'behavioral_pattern': return <Users size={20} className="text-blue-400" />;
      case 'attendance_issue': return <Calendar size={20} className="text-red-400" />;
      case 'homework_reminder': return <Target size={20} className="text-purple-400" />;
      default: return <AlertTriangle size={20} className="text-gray-400" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'academic': return 'text-blue-400 bg-blue-500/10';
      case 'emotional': return 'text-pink-400 bg-pink-500/10';
      case 'behavioral': return 'text-purple-400 bg-purple-500/10';
      case 'positive': return 'text-green-400 bg-green-500/10';
      case 'attendance': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getActionColor = (type) => {
    switch (type) {
      case 'immediate': return 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30';
      case 'urgent': return 'bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30';
      case 'follow_up': return 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30 hover:bg-gray-500/30';
    }
  };

  const handleAction = async (alert, action) => {
    console.log('Executing action:', action, 'for alert:', alert.id);
    
    if (action.type === 'immediate') {
      await realTimeNotificationService.markAsRead(alert.id);
      setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, read: true } : a));
    }
  };

  const handleDismissAlert = async (alertId) => {
    await realTimeNotificationService.markAsRead(alertId);
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !alert.read;
    if (filter === 'urgent') return alert.priority === 'urgent';
    if (filter === 'high') return alert.priority === 'high';
    if (filter === 'medium') return alert.priority === 'medium';
    if (filter === 'low') return alert.priority === 'low';
    if (filter === 'academic') return alert.category === 'academic';
    if (filter === 'emotional') return alert.category === 'emotional';
    if (filter === 'behavioral') return alert.category === 'behavioral';
    return true;
  });

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando alertas inteligentes...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/30 flex-shrink-0">
                <Brain size={24} className="sm:hidden text-orange-400" />
                <Brain size={28} className="hidden sm:block text-orange-400" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-300 leading-tight">
                  Alertas Inteligentes para Padres
                </CardTitle>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed mt-2">
                  Recomendaciones personalizadas basadas en el comportamiento de tu hijo/a
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-slate-700 border-slate-600 text-slate-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto font-medium"
              >
                <option value="all">Todas</option>
                <option value="unread">No leídas</option>
                <option value="urgent">Urgentes</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
                <option value="academic">Académicas</option>
                <option value="emotional">Emocionales</option>
                <option value="behavioral">Comportamentales</option>
              </select>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadAlerts}
                className="text-slate-400 hover:text-slate-200 text-sm sm:text-base py-2 sm:py-3 px-3 sm:px-4"
              >
                <RefreshCw size={18} className="sm:hidden" />
                <RefreshCw size={20} className="hidden sm:block" />
              </Button>
            </div>
          </div>
        </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Shield size={48} className="sm:hidden text-slate-500 mx-auto mb-6" />
            <Shield size={56} className="hidden sm:block text-slate-500 mx-auto mb-6" />
            <h3 className="text-lg sm:text-xl font-semibold text-slate-300 mb-3">
              No hay alertas activas
            </h3>
            <p className="text-sm sm:text-base text-slate-400">
              El sistema está monitoreando el progreso de tu hijo/a
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredAlerts.map((alert) => {
              const isExpanded = expandedAlert === alert.id;
              const Icon = getAlertIcon(alert.alertType);
              
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 sm:p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                    alert.read 
                      ? 'bg-slate-700/30 border-slate-600/30' 
                      : 'bg-orange-500/10 border-orange-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${
                      alert.read ? 'bg-slate-600/30' : 'bg-orange-500/20'
                    }`}>
                      {React.cloneElement(Icon, { 
                        size: window.innerWidth < 640 ? 20 : 24 
                      })}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                            <h4 className="font-semibold text-slate-200 text-sm sm:text-base truncate">
                              {alert.title}
                            </h4>
                            <Badge className={`${getPriorityColor(alert.priority)} text-sm font-medium px-2 py-1`}>
                              {alert.priority}
                            </Badge>
                            <Badge className={`${getCategoryColor(alert.category)} text-sm font-medium px-2 py-1`}>
                              {alert.category}
                            </Badge>
                            {!alert.read && (
                              <Badge className="text-orange-300 bg-orange-500/20 border-orange-500/30 text-sm font-medium px-2 py-1">
                                Nuevo
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed mb-3">
                            {alert.description}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-2">
                              <Users size={14} />
                              {alert.studentName}
                            </span>
                            <span className="flex items-center gap-2">
                              <Target size={14} />
                              {alert.confidence}% confianza
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock size={14} />
                              {new Date(alert.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                            className="text-slate-400 hover:text-slate-200 text-sm px-3 py-2"
                          >
                            {isExpanded ? <X size={16} className="sm:hidden" /> : <Eye size={16} className="sm:hidden" />}
                            {isExpanded ? <X size={18} className="hidden sm:block" /> : <Eye size={18} className="hidden sm:block" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDismissAlert(alert.id)}
                            className="text-slate-400 hover:text-red-400 text-sm px-3 py-2"
                          >
                            <X size={16} className="sm:hidden" />
                            <X size={18} className="hidden sm:block" />
                          </Button>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-slate-600/50"
                        >
                          <div className="space-y-6">
                            {/* Recomendaciones */}
                            <div>
                              <h5 className="text-base font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                <Lightbulb size={18} className="text-yellow-400" />
                                Recomendaciones de IA:
                              </h5>
                              <ul className="list-disc list-inside text-sm text-slate-400 space-y-2">
                                {alert.recommendations.map((rec, index) => (
                                  <li key={index}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                            
                            {/* Acciones */}
                            <div>
                              <h5 className="text-base font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                <Zap size={18} className="text-blue-400" />
                                Acciones Sugeridas:
                              </h5>
                              <div className="flex flex-wrap gap-3">
                                {alert.actions.map((action) => (
                                  <Button
                                    key={action.id}
                                    size="sm"
                                    onClick={() => handleAction(alert, action)}
                                    className={`text-sm font-medium px-4 py-2 ${getActionColor(action.type)}`}
                                  >
                                    {action.type === 'immediate' && <Zap size={14} className="mr-2" />}
                                    {action.type === 'urgent' && <AlertTriangle size={14} className="mr-2" />}
                                    {action.type === 'follow_up' && <Clock size={14} className="mr-2" />}
                                    {action.label}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntelligentParentAlerts;

