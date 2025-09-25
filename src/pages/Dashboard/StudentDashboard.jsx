import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { toast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet-async';
import mockEdgeFunctionService from '@/services/mockEdgeFunctionService';
import unifiedDataService from '@/services/unifiedDataService';
import LoadingScreen from './components/LoadingScreen';
import { Button } from '@/components/ui/button';
import { MessageSquare, BookOpen, ShieldCheck, Gem, Compass, Tally5, HeartHandshake } from 'lucide-react';
import MagicBackground from './StudentDashboard/components/MagicBackground';
import WelcomeHeader from './StudentDashboard/components/WelcomeHeader';
import EmotionalAuraCard from './StudentDashboard/components/EmotionalAuraCard';
import MagicPortalCard from './StudentDashboard/components/MagicPortalCard';
import KarySuggestionCard from './StudentDashboard/components/KarySuggestionCard';
import WeeklyProgressWidget from './StudentDashboard/components/WeeklyProgressWidget';
import SmartNotificationsWidget from './StudentDashboard/components/SmartNotificationsWidget';
import MyStrengthsWidget from './StudentDashboard/components/MyStrengthsWidget';
import AdaptiveActivitiesWidget from './StudentDashboard/components/AdaptiveActivitiesWidget';
import ComfortZoneWidget from './StudentDashboard/components/ComfortZoneWidget';
import RealTimeNotifications from './StudentDashboard/components/RealTimeNotifications';
import GamifiedProgress from './StudentDashboard/components/GamifiedProgress';
import SmartKaryChat from './StudentDashboard/components/SmartKaryChat';
import EmotionalAnalytics from './StudentDashboard/components/EmotionalAnalytics';
import MicroInteractions from './StudentDashboard/components/MicroInteractions';
import AccessibilityFeatures from './StudentDashboard/components/AccessibilityFeatures';
import StudentActivities from './StudentDashboard/components/StudentActivities';
import RealTimeNotificationsPanel from './StudentDashboard/components/RealTimeNotificationsPanel';
import StudentActivityNotifications from '@/components/StudentActivityNotifications';
import UniversalGeminiChat from '@/components/UniversalGeminiChat';
import UserHeader from '@/components/UserHeader';
import StudentSidebar from '@/components/StudentSidebar';

const StudentDashboard = () => {
  const { t } = useLanguage();
  const { userProfile, user } = useMockAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [showGeminiChat, setShowGeminiChat] = useState(false);
  const [geminiChatMinimized, setGeminiChatMinimized] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  const fetchStudentData = useCallback(async (retryCount = 0) => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    
    const maxRetries = 2;
    
    try {
      const payload = { role: 'student', user_id: user.id };
      const { data, error: fetchError } = await mockEdgeFunctionService.getDashboardSummary(payload);
      
      if (fetchError) {
        // Si es un error de conexión temporal y aún tenemos reintentos, intentar de nuevo
        if (fetchError.message.includes('Error temporal de conexión') && retryCount < maxRetries) {
          console.log(`[StudentDashboard] Retry attempt ${retryCount + 1}/${maxRetries} for connection error`);
          setRetrying(true);
          setTimeout(() => {
            setRetrying(false);
            fetchStudentData(retryCount + 1);
          }, 1000 * (retryCount + 1)); // Delay incremental
          return;
        }
        throw new Error(fetchError.message || t('studentDashboard.dataLoadedError'));
      }
      
      setDashboardData(data);
      setError(null); // Limpiar errores previos en caso de éxito
    } catch (err) {
      console.error("Error fetching student dashboard data:", err);
      setError(err.message);
      
      // Solo mostrar toast en el último intento
      if (retryCount >= maxRetries) {
        toast({
          title: t('toasts.error'),
          description: err.message,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [user, t]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const magicPortals = useMemo(() => [
    { key: 'myTasks', Icon: Tally5, link: '/dashboard/my-tasks', auraColor: '#f97316' }, // orange
    { key: 'assignedResources', Icon: BookOpen, link: '/dashboard/assigned-resources', auraColor: '#eab308' }, // yellow
    { key: 'personalTracking', Icon: Gem, link: '/dashboard/personal-tracking', auraColor: '#22c55e' }, // green
    { key: 'supportPlans', Icon: ShieldCheck, link: '/dashboard/student-support-plans', auraColor: '#ef4444' }, // red
    { key: 'emotionalAttendance', Icon: HeartHandshake, link: '/dashboard/emotional-attendance', auraColor: '#38bdf8' }, // sky
    { key: 'karyChat', Icon: MessageSquare, link: '/dashboard/kary-chat', auraColor: '#ec4899' }, // pink
  ], []);

  if (loading) {
    return <LoadingScreen />;
  }
  
  const karySuggestion = dashboardData?.kary_suggestion || t('studentDashboard.karySuggestion.defaultSuggestion');
  const emotionalState = dashboardData?.emotional_state || { status: 'neutral' };

  return (
    <MagicBackground>
      <Helmet>
        <title>{t('studentDashboard.pageTitle')}</title>
        <meta name="description" content={t('studentDashboard.welcomeMessage', '', { userName: userProfile?.full_name || '' })} />
      </Helmet>
      
      {/* Sidebar de Navegación */}
      <StudentSidebar />
      
      {/* Header de Usuario */}
      <UserHeader position="top-right" />
      
      <div className="lg:ml-64 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
        {error ? (
          <div className="text-center p-4 sm:p-6 md:p-8 bg-red-500/10 rounded-2xl border border-red-400/30">
            <h2 className="text-xl sm:text-2xl font-bold text-red-300">{t('common.errorTitle')}</h2>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">{error}</p>
            <Button onClick={() => fetchStudentData()} className="mt-4 sm:mt-6 bg-purple-600 hover:bg-purple-700 text-sm sm:text-base">
              {t('common.retryButton')}
            </Button>
          </div>
        ) : retrying ? (
          <div className="text-center p-4 sm:p-6 md:p-8 bg-blue-500/10 rounded-2xl border border-blue-400/30">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <h2 className="text-xl sm:text-2xl font-bold text-blue-300">{t('common.retrying', 'Reintentando...')}</h2>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">{t('common.retryingDescription', 'Intentando reconectar con el servidor...')}</p>
          </div>
        ) : (
          <>
            {/* Header simplificado */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                ¡Hola, {userProfile?.full_name?.split(' ')[0] || 'Estudiante'}! 👋
              </h1>
              <p className="text-slate-300 text-lg">
                Tu espacio de aprendizaje personalizado
              </p>
            </div>
            
            {/* Estado emocional simplificado */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
              <div className="flex items-center justify-center space-x-4">
                <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-white text-lg font-medium">
                  Estado: {emotionalState?.status === 'positive' ? '😊 Muy bien' : 
                          emotionalState?.status === 'negative' ? '😔 Podemos mejorar' : '😐 Neutral'}
                </span>
              </div>
            </div>
            
            {/* Acciones principales - Solo las más importantes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {magicPortals.slice(0, 3).map((card, index) => (
                <MagicPortalCard
                  key={card.key}
                  title={t(`studentDashboard.cards.${card.key}`)}
                  description={t(`studentDashboard.cards.${card.key}Desc`)}
                  Icon={card.Icon}
                  link={card.link}
                  auraColor={card.auraColor}
                  custom={index}
                />
              ))}
            </div>
            
            {/* Progreso semanal simplificado */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 text-center">Tu Progreso Esta Semana</h3>
              <WeeklyProgressWidget t={t} />
            </div>
            
            {/* Sugerencia de Kary */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
              <h3 className="text-xl font-semibold text-white mb-3 text-center">💡 Sugerencia de Kary</h3>
              <p className="text-slate-200 text-center leading-relaxed">
                {karySuggestion}
              </p>
            </div>
            
            {/* Botón de chat flotante */}
            <div className="fixed bottom-6 right-6 z-50">
              <Button
                onClick={() => setShowGeminiChat(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300"
                size="icon"
              >
                💬
              </Button>
            </div>
          </>
        )}

        {/* Chat Universal con IA Avanzada */}
        <UniversalGeminiChat
          userRole="student"
          context={{
            emotionalState: emotionalState?.status || 'neutral',
            dashboardData: dashboardData,
            activities: dashboardData?.activities || [],
            progress: dashboardData?.progress || {}
          }}
          isOpen={showGeminiChat}
          onClose={() => setShowGeminiChat(false)}
          onMinimize={setGeminiChatMinimized}
          isMinimized={geminiChatMinimized}
          position="bottom-right"
        />
      </div>
    </MagicBackground>
  );
};

export default StudentDashboard;