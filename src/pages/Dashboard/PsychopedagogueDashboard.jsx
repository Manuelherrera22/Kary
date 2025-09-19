import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  AlertTriangle, 
  Shield, 
  CheckSquare,
  FileText, 
  Users, 
  UserPlus,
  Star, 
  Brain,
  Settings,
  MessageSquare,
  ArrowRight,
  Lightbulb,
  Activity,
  BarChart3,
  Calendar,
  Clock,
  Target,
  Heart,
  Zap,
  Bell
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import psychopedagogueService from '@/services/psychopedagogueService';
import activityService from '@/services/activityService';
import notificationService from '@/services/notificationService';
import unifiedDataService from '@/services/unifiedDataService';
import InteractiveCaseManagement from './PsychopedagogueSections/InteractiveCaseManagement';
import RealTimeAlerts from './PsychopedagogueSections/RealTimeAlerts';
import AISuggestionsEngine from './PsychopedagogueSections/AISuggestionsEngine';
import StudentProgressTracking from './PsychopedagogueSections/StudentProgressTracking';
import StudentRegistrationModal from './PsychopedagogueSections/StudentRegistrationModal';
import CaseCreationModal from './PsychopedagogueSections/CaseCreationModal';
import CaseAssignmentModal from './PsychopedagogueSections/CaseAssignmentModal';
import IntelligentAssignmentModal from './PsychopedagogueSections/IntelligentAssignmentModal';
import SupportPlansModal from './PsychopedagogueSections/SupportPlansModal';
import UnifiedStudentView from './PsychopedagogueSections/UnifiedStudentView';
import IntelligentAlertsPanel from './PsychopedagogueSections/IntelligentAlertsPanel';
import InterdisciplinaryCollaborationPanel from './PsychopedagogueSections/InterdisciplinaryCollaborationPanel';
import SharedMetricsDashboard from './PsychopedagogueSections/SharedMetricsDashboard';

const PsychopedagogueDashboard = () => {
  const { t } = useLanguage();
  const { userProfile, logout } = useMockAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeCases: 0,
    emotionalAlerts: 0,
    activeSupportPlans: 0,
    pendingTasks: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [riskAlerts, setRiskAlerts] = useState([]);
  const [showStudentRegistration, setShowStudentRegistration] = useState(false);
  const [showCaseCreation, setShowCaseCreation] = useState(false);
  const [showCaseAssignment, setShowCaseAssignment] = useState(false);
  const [showIntelligentAssignment, setShowIntelligentAssignment] = useState(false);
  const [showSupportPlans, setShowSupportPlans] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'cases', 'analytics', 'tools', 'collaboration'

  useEffect(() => {
    let unsubscribe = null;
    let activityUnsubscribe = null;
    let notificationUnsubscribe = null;

    // Cargar datos reales del servicio
    const loadDashboardData = async () => {
      setLoading(true);
      
      try {
        // Obtener estadísticas del dashboard
        const statsResult = await psychopedagogueService.getDashboardStats();
        if (statsResult.success) {
          setStats(statsResult.data);
        }

        // Cargar actividades recientes
        const activitiesResult = await activityService.getRecentActivities(5);
        if (activitiesResult.success) {
          setRecentActivities(activitiesResult.data);
        }

        // Cargar notificaciones
        const notificationsResult = await notificationService.getUserNotifications(userProfile.id, 'psychopedagogue');
        if (notificationsResult.success) {
          setNotifications(notificationsResult.data);
        }

        // Cargar sugerencias de IA
        const suggestionsResult = await psychopedagogueService.generateAISuggestions();
        if (suggestionsResult.success) {
          setAiSuggestions(suggestionsResult.data);
        }

        // Cargar alertas de riesgo
        const alertsResult = await psychopedagogueService.getEmotionalAlerts({ status: 'active' });
        if (alertsResult.success) {
          setRiskAlerts(alertsResult.data);
        }
        
        // Suscribirse a cambios en tiempo real
        unsubscribe = psychopedagogueService.subscribe((event, data) => {
          if (event === 'case_created' || event === 'case_updated' || 
              event === 'emotional_alert_created' || event === 'support_plan_created') {
            // Recargar estadísticas cuando hay cambios
            psychopedagogueService.getDashboardStats().then(result => {
              if (result.success) {
                setStats(result.data);
              }
            });
          }
        });

        // Suscribirse a cambios de actividades
        activityUnsubscribe = activityService.subscribe((event, data) => {
          if (event === 'activity_created' || event === 'activity_assigned') {
            activityService.getRecentActivities(5).then(result => {
              if (result.success) {
                setRecentActivities(result.data);
              }
            });
          }
        });

        // Suscribirse a notificaciones
        notificationUnsubscribe = notificationService.subscribeToTeacher(userProfile.id, (event, data) => {
          if (event === 'notification_created') {
            notificationService.getUserNotifications(userProfile.id, 'psychopedagogue').then(result => {
              if (result.success) {
                setNotifications(result.data);
              }
            });
          }
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Fallback a datos mock si hay error
        setStats({
          activeCases: 12,
          emotionalAlerts: 3,
          activeSupportPlans: 8,
          pendingTasks: 5
        });
        setAiSuggestions([
          {
            id: 1,
            type: 'evaluation',
            priority: 'high',
            title: 'Revisar casos de estudiantes con TDAH',
            description: '3 estudiantes requieren evaluación de seguimiento'
          },
          {
            id: 2,
            type: 'plan_update',
            priority: 'medium',
            title: 'Actualizar planes de apoyo para dislexia',
            description: 'Nuevas estrategias disponibles para implementar'
          }
        ]);
        setRiskAlerts([
          {
            id: 1,
            student: 'María García',
            grade: '5to Primaria',
            risk: 'Bajo rendimiento académico',
            level: 'medium',
            date: '2024-01-15'
          },
          {
            id: 2,
            student: 'Carlos López',
            grade: '4to Primaria',
            risk: 'Aislamiento social',
            level: 'high',
            date: '2024-01-14'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();

    // Función de limpieza
    return () => {
      if (unsubscribe) unsubscribe();
      if (activityUnsubscribe) activityUnsubscribe();
      if (notificationUnsubscribe) notificationUnsubscribe();
    };
  }, []);

  // Funciones de manejo de herramientas
  const handleStudentRegistration = () => {
    setShowStudentRegistration(true);
  };

  const handleCaseCreation = () => {
    setShowCaseCreation(true);
  };

  const handleCaseAssignment = () => {
    setShowCaseAssignment(true);
  };

  const handleIntelligentAssignment = () => {
    setShowIntelligentAssignment(true);
  };

  const handleSupportPlans = () => {
    setShowSupportPlans(true);
  };

  const closeModal = () => {
    setShowStudentRegistration(false);
    setShowCaseCreation(false);
    setShowCaseAssignment(false);
    setShowIntelligentAssignment(false);
    setShowSupportPlans(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="space-y-8 p-6">
        {/* Welcome Header - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20 backdrop-blur-sm border border-purple-500/30 p-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl backdrop-blur-sm">
                <Brain size={32} className="text-purple-300" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                  ¡Bienvenido de nuevo, {userProfile?.name || 'Dr. Luis Martínez'}!
                </h1>
                <p className="text-slate-300 text-lg mt-2">
                  Centro de Control Psicopedagógico Inteligente
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-lg max-w-3xl">
              Gestiona casos, monitorea tendencias emocionales y optimiza el desarrollo de tus estudiantes con herramientas de IA avanzadas.
            </p>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-2 justify-center mb-8"
        >
          {[
            { id: 'overview', label: 'Resumen', icon: BarChart3, color: 'blue' },
            { id: 'cases', label: 'Casos', icon: Briefcase, color: 'purple' },
            { id: 'analytics', label: 'Analíticas', icon: Activity, color: 'green' },
            { id: 'collaboration', label: 'Colaboración', icon: Users, color: 'cyan' },
            { id: 'tools', label: 'Herramientas', icon: Settings, color: 'orange' }
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? `bg-${tab.color}-500/20 text-${tab.color}-300 border-${tab.color}-500/50 shadow-lg`
                  : 'bg-slate-800/40 text-slate-400 border-slate-600/30 hover:bg-slate-700/40'
              }`}
            >
              <tab.icon size={20} className="mr-2" />
              {tab.label}
            </Button>
          ))}
        </motion.div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="group"
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm border border-blue-500/30 text-slate-100 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent"></div>
              <CardContent className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl backdrop-blur-sm group-hover:bg-blue-500/30 transition-colors">
                    <Briefcase size={28} className="text-blue-300" />
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-blue-300 mb-1">{stats.activeCases}</p>
                    <p className="text-sm text-blue-200/80">Casos Activos</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">Gestión de Casos</h3>
                <p className="text-sm text-slate-400 mb-4">Estudiantes con seguimiento activo</p>
                <Button 
                  variant="ghost" 
                  className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300"
                >
                  Ver Detalles →
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="group"
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-red-600/20 to-red-800/20 backdrop-blur-sm border border-red-500/30 text-slate-100 shadow-2xl hover:shadow-red-500/25 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent"></div>
              <CardContent className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-500/20 rounded-xl backdrop-blur-sm group-hover:bg-red-500/30 transition-colors">
                    <AlertTriangle size={28} className="text-red-300" />
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-red-300 mb-1">{stats.emotionalAlerts}</p>
                    <p className="text-sm text-red-200/80">Alertas</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">Alertas Emocionales</h3>
                <p className="text-sm text-slate-400 mb-4">Riesgo emocional reciente</p>
                <Button 
                  variant="ghost" 
                  className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 hover:border-red-400/50 transition-all duration-300"
                >
                  Ver Alertas →
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="group"
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm border border-green-500/30 text-slate-100 shadow-2xl hover:shadow-green-500/25 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent"></div>
              <CardContent className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/20 rounded-xl backdrop-blur-sm group-hover:bg-green-500/30 transition-colors">
                    <Shield size={28} className="text-green-300" />
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-green-300 mb-1">{stats.activeSupportPlans}</p>
                    <p className="text-sm text-green-200/80">Planes</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">Planes de Apoyo</h3>
                <p className="text-sm text-slate-400 mb-4">Intervenciones en curso</p>
                <Button 
                  variant="ghost" 
                  className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 hover:border-green-400/50 transition-all duration-300"
                >
                  Gestionar →
                </Button>
              </CardContent>
            </Card>
          </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="group"
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-orange-600/20 to-orange-800/20 backdrop-blur-sm border border-orange-500/30 text-slate-100 shadow-2xl hover:shadow-orange-500/25 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-transparent"></div>
              <CardContent className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-500/20 rounded-xl backdrop-blur-sm group-hover:bg-orange-500/30 transition-colors">
                    <CheckSquare size={28} className="text-orange-300" />
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-orange-300 mb-1">{stats.pendingTasks}</p>
                    <p className="text-sm text-orange-200/80">Tareas</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">Tareas Pendientes</h3>
                <p className="text-sm text-slate-400 mb-4">Seguimientos por completar</p>
                <Button 
                  variant="ghost" 
                  className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300"
                >
                  Completar →
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* AI Suggestions and Risk Alerts - Enhanced */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="group"
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-600/20 to-amber-600/20 backdrop-blur-sm border border-yellow-500/30 text-slate-100 shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 to-transparent"></div>
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-500/20 rounded-xl backdrop-blur-sm group-hover:bg-yellow-500/30 transition-colors">
                    <Lightbulb size={28} className="text-yellow-300" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">
                      Sugerencias de Kary IA
                    </CardTitle>
                    <p className="text-sm text-yellow-200/80 mt-1">Inteligencia artificial avanzada</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                {aiSuggestions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="p-4 bg-yellow-500/10 rounded-xl mb-4">
                      <Lightbulb size={48} className="text-yellow-300/50 mx-auto" />
                    </div>
                    <p className="text-slate-400 text-lg">No hay sugerencias disponibles en este momento.</p>
                    <p className="text-slate-500 text-sm mt-2">Kary IA está analizando los datos...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {aiSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/30 hover:border-yellow-500/30 transition-all duration-300 backdrop-blur-sm"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-slate-200 text-lg">{suggestion.title}</h4>
                          <Badge className={
                            suggestion.priority === 'high' || suggestion.priority === 'urgent'
                              ? 'bg-red-500/20 text-red-300 border-red-500/30'
                              : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                          }>
                            {suggestion.priority}
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">{suggestion.description}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="group"
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-red-600/20 to-rose-600/20 backdrop-blur-sm border border-red-500/30 text-slate-100 shadow-2xl hover:shadow-red-500/25 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent"></div>
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/20 rounded-xl backdrop-blur-sm group-hover:bg-red-500/30 transition-colors">
                    <AlertTriangle size={28} className="text-red-300" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-300 to-rose-300 bg-clip-text text-transparent">
                      Alertas de Riesgo
                    </CardTitle>
                    <p className="text-sm text-red-200/80 mt-1">Monitoreo en tiempo real</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                {riskAlerts.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="p-4 bg-red-500/10 rounded-xl mb-4">
                      <AlertTriangle size={48} className="text-red-300/50 mx-auto" />
                    </div>
                    <p className="text-slate-400 text-lg">No hay alertas de riesgo en este momento.</p>
                    <p className="text-slate-500 text-sm mt-2">Sistema de monitoreo activo</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {riskAlerts.map((alert, index) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/30 hover:border-red-500/30 transition-all duration-300 backdrop-blur-sm"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-slate-200 text-lg">{alert.student}</h4>
                            <p className="text-sm text-slate-400 mb-1">{alert.grade} - {alert.risk}</p>
                            <p className="text-xs text-slate-500">{alert.date}</p>
                          </div>
                          <Badge className={
                            alert.level === 'high' || alert.level === 'critical'
                              ? 'bg-red-500/20 text-red-300 border-red-500/30'
                              : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                          }>
                            {alert.level}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Actividades Recientes y Notificaciones - Enhanced */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="group"
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-blue-500/30 text-slate-100 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent"></div>
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl backdrop-blur-sm group-hover:bg-blue-500/30 transition-colors">
                    <Activity size={28} className="text-blue-300" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                      Actividades Recientes
                    </CardTitle>
                    <p className="text-sm text-blue-200/80 mt-1">Seguimiento en tiempo real</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                {recentActivities.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="p-4 bg-blue-500/10 rounded-xl mb-4">
                      <Activity size={48} className="text-blue-300/50 mx-auto" />
                    </div>
                    <p className="text-slate-400 text-lg">No hay actividades recientes.</p>
                    <p className="text-slate-500 text-sm mt-2">Las actividades aparecerán aquí</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/30 hover:border-blue-500/30 transition-all duration-300 backdrop-blur-sm"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-slate-200 text-lg">{activity.title}</h4>
                            <p className="text-sm text-slate-400 mb-1">{activity.subject} • {activity.grade}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(activity.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={
                            activity.status === 'completed'
                              ? 'bg-green-500/20 text-green-300 border-green-500/30'
                              : activity.status === 'in_progress'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                              : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                          }>
                            {activity.status}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="group"
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-600/20 to-violet-600/20 backdrop-blur-sm border border-purple-500/30 text-slate-100 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent"></div>
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl backdrop-blur-sm group-hover:bg-purple-500/30 transition-colors">
                    <Bell size={28} className="text-purple-300" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent">
                      Notificaciones Recientes
                    </CardTitle>
                    <p className="text-sm text-purple-200/80 mt-1">Actualizaciones importantes</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="p-4 bg-purple-500/10 rounded-xl mb-4">
                      <Bell size={48} className="text-purple-300/50 mx-auto" />
                    </div>
                    <p className="text-slate-400 text-lg">No hay notificaciones nuevas.</p>
                    <p className="text-slate-500 text-sm mt-2">Te notificaremos cuando haya novedades</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.slice(0, 5).map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="p-4 bg-slate-800/40 rounded-xl border border-slate-600/30 hover:border-purple-500/30 transition-all duration-300 backdrop-blur-sm"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-slate-200 text-lg">{notification.title}</h4>
                            <p className="text-sm text-slate-400 mb-1">{notification.message}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={
                            notification.priority === 'urgent'
                              ? 'bg-red-500/20 text-red-300 border-red-500/30'
                              : notification.priority === 'high'
                              ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                              : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          }>
                            {notification.priority}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Functional Components - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <InteractiveCaseManagement onViewStudent={setSelectedStudent} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <IntelligentAlertsPanel />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
            >
              <AISuggestionsEngine />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <StudentProgressTracking />
            </motion.div>
        </div>
      </motion.div>
          </>
        )}

        {/* Cases Tab */}
        {activeTab === 'cases' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <Card className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-200 flex items-center gap-3">
                  <Briefcase className="text-purple-400" />
                  Gestión de Casos
                </CardTitle>
                <p className="text-slate-400">Administra y monitorea todos los casos de estudiantes</p>
              </CardHeader>
              <CardContent>
                <InteractiveCaseManagement />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <SharedMetricsDashboard />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-200 flex items-center gap-3">
                    <Activity className="text-green-400" />
                    Progreso de Estudiantes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StudentProgressTracking />
                </CardContent>
              </Card>
              <Card className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-200 flex items-center gap-3">
                    <AlertTriangle className="text-red-400" />
                    Alertas en Tiempo Real
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RealTimeAlerts />
                </CardContent>
              </Card>
            </div>
            <Card className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-200 flex items-center gap-3">
                  <Lightbulb className="text-yellow-400" />
                  Sugerencias de IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AISuggestionsEngine />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Collaboration Tab */}
        {activeTab === 'collaboration' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <InterdisciplinaryCollaborationPanel />
          </motion.div>
        )}

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <Card className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-200 flex items-center gap-3">
                  <Settings className="text-orange-400" />
                  Herramientas de Gestión
                </CardTitle>
                <p className="text-slate-400">Accede a todas las herramientas de administración</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="group"
                  >
                    <Button 
                      onClick={handleStudentRegistration}
                      className="w-full h-32 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-blue-600/20 to-blue-800/20 hover:from-blue-600/30 hover:to-blue-800/30 text-blue-300 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 backdrop-blur-sm"
                    >
                      <UserPlus size={36} className="group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-sm font-semibold text-center">Registrar Estudiante</span>
                      <span className="text-xs text-blue-200/80 text-center">Nuevo registro</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="group"
                  >
                    <Button 
                      onClick={handleCaseCreation}
                      className="w-full h-32 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-green-600/20 to-green-800/20 hover:from-green-600/30 hover:to-green-800/30 text-green-300 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 backdrop-blur-sm"
                    >
                      <FileText size={36} className="group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-sm font-semibold text-center">Crear Caso</span>
                      <span className="text-xs text-green-200/80 text-center">Nuevo caso</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="group"
                  >
                    <Button 
                      onClick={handleCaseAssignment}
                      className="w-full h-32 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-orange-600/20 to-orange-800/20 hover:from-orange-600/30 hover:to-orange-800/30 text-orange-300 border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 backdrop-blur-sm"
                    >
                      <Users size={36} className="group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-sm font-semibold text-center">Asignar Caso</span>
                      <span className="text-xs text-orange-200/80 text-center">Gestión de casos</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="group"
                  >
                    <Button 
                      onClick={handleIntelligentAssignment}
                      className="w-full h-32 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-purple-600/20 to-purple-800/20 hover:from-purple-600/30 hover:to-purple-800/30 text-purple-300 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 backdrop-blur-sm"
                    >
                      <Star size={36} className="group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-sm font-semibold text-center">Asignación Inteligente</span>
                      <span className="text-xs text-purple-200/80 text-center">IA avanzada</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="group"
                  >
                    <Button 
                      onClick={handleSupportPlans}
                      className="w-full h-32 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-indigo-600/20 to-indigo-800/20 hover:from-indigo-600/30 hover:to-indigo-800/30 text-indigo-300 border border-indigo-500/30 hover:border-indigo-400/50 transition-all duration-300 backdrop-blur-sm"
                    >
                      <FileText size={36} className="group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-sm font-semibold text-center">Planes de Apoyo</span>
                      <span className="text-xs text-indigo-200/80 text-center">Intervenciones</span>
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Modales */}
        <StudentRegistrationModal 
          isOpen={showStudentRegistration} 
          onClose={closeModal} 
        />
        <CaseCreationModal 
          isOpen={showCaseCreation} 
          onClose={closeModal} 
        />
        <CaseAssignmentModal 
          isOpen={showCaseAssignment} 
          onClose={closeModal} 
        />
        <IntelligentAssignmentModal 
          isOpen={showIntelligentAssignment} 
          onClose={closeModal} 
        />
        <SupportPlansModal 
          isOpen={showSupportPlans} 
          onClose={closeModal} 
        />
        
        {/* Modal de Vista Unificada del Estudiante */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
              <UnifiedStudentView 
                studentId={selectedStudent} 
                onClose={() => setSelectedStudent(null)} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PsychopedagogueDashboard;