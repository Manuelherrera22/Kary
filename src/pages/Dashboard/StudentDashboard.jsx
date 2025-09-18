import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet';
import edgeFunctionService from '@/services/edgeFunctionService';
import LoadingScreen from './components/LoadingScreen';
import { Button } from '@/components/ui/button';
import { MessageSquare, BookOpen, ShieldCheck, Gem, Compass, Tally5, HeartHandshake } from 'lucide-react';
import MagicBackground from './StudentDashboard/components/MagicBackground';
import WelcomeHeader from './StudentDashboard/components/WelcomeHeader';
import EmotionalAuraCard from './StudentDashboard/components/EmotionalAuraCard';
import MagicPortalCard from './StudentDashboard/components/MagicPortalCard';
import KarySuggestionCard from './StudentDashboard/components/KarySuggestionCard';

const StudentDashboard = () => {
  const { t } = useLanguage();
  const { userProfile, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  const fetchStudentData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const payload = { role: 'student', user_id: user.id };
      const { data, error: fetchError } = await edgeFunctionService.getDashboardSummary(payload);
      
      if (fetchError) throw new Error(fetchError.message || t('studentDashboard.dataLoadedError'));
      setDashboardData(data);
    } catch (err) {
      console.error("Error fetching student dashboard data:", err);
      setError(err.message);
      toast({
        title: t('toasts.error'),
        description: err.message,
        variant: 'destructive',
      });
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
        <meta name="description" content={t('studentDashboard.welcomeMessage', { userName: userProfile?.full_name || '' })} />
      </Helmet>
      
      <div className="p-4 sm:p-6 lg:p-8 space-y-10">
        {error ? (
          <div className="text-center p-8 bg-red-500/10 rounded-2xl border border-red-400/30">
            <h2 className="text-2xl font-bold text-red-300">{t('common.errorTitle')}</h2>
            <p className="text-slate-400 mt-2">{error}</p>
            <Button onClick={fetchStudentData} className="mt-6 bg-purple-600 hover:bg-purple-700">
              {t('common.retryButton')}
            </Button>
          </div>
        ) : (
          <>
            <WelcomeHeader userName={userProfile?.full_name} />
            <EmotionalAuraCard emotionalState={emotionalState} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {magicPortals.map((card, index) => (
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
            <KarySuggestionCard suggestion={karySuggestion} />
          </>
        )}
      </div>
    </MagicBackground>
  );
};

export default StudentDashboard;