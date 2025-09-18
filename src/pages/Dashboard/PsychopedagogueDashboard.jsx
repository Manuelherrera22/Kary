import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import LoadingScreen from '@/pages/Dashboard/components/LoadingScreen';
import { Helmet } from 'react-helmet';
import StatCards from './PsychopedagogueSections/components/PsychopedagogueDashboard/StatCards';
import ActionButtons from './PsychopedagogueSections/components/PsychopedagogueDashboard/ActionButtons';
import AISuggestionSection from './PsychopedagogueSections/components/PsychopedagogueDashboard/AISuggestionSection';
import RiskAlertsSection from './PsychopedagogueSections/components/PsychopedagogueDashboard/RiskAlertsSection';
import QuickAccess from './PsychopedagogueSections/components/PsychopedagogueDashboard/QuickAccess';
import { supabase } from '@/lib/supabaseClient';

const PsychopedagogueDashboard = () => {
  const { t } = useLanguage();
  const { userProfile, loading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [riskAlerts, setRiskAlerts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (userProfile?.id) {
      try {
        setLoadingData(true);
        const { data, error } = await supabase.rpc('get_dashboard_summary_psicopedagogo');
        if (error) throw error;
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching psychopedagogue dashboard data:', error);
      } finally {
        setLoadingData(false);
      }
    }
  }, [userProfile]);

  const fetchRiskAlerts = useCallback(async () => {
    if (userProfile?.id) {
      try {
        setLoadingAlerts(true);
        const { data, error } = await supabase
          .from('alerts_predictive')
          .select('id, student_id, categoria, nivel, descripcion, created_at, user_profiles(full_name)')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;

        const formattedAlerts = data.map(alert => ({
          id: alert.id,
          student_id: alert.student_id,
          student_name: alert.user_profiles?.full_name || 'Estudiante Desconocido',
          risk_level: alert.nivel,
          description: alert.descripcion,
          category: alert.categoria,
          created_at: alert.created_at,
        }));
        setRiskAlerts(formattedAlerts);
      } catch (error) {
        console.error('Error fetching risk alerts:', error);
        setRiskAlerts([]);
      } finally {
        setLoadingAlerts(false);
      }
    }
  }, [userProfile]);

  useEffect(() => {
    fetchDashboardData();
    fetchRiskAlerts();
  }, [fetchDashboardData, fetchRiskAlerts]);

  const handleRefreshAlerts = () => {
    fetchRiskAlerts();
  };

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900/50 min-h-screen">
      <Helmet>
        <title>{t('dashboards.psychopedagogue')}</title>
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {t('psychopedagogueDashboard.welcome', { name: userProfile?.full_name || 'Psicopedagogo(a)' })}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t('psychopedagogueDashboard.subtitle')}
          </p>
        </header>

        <div className="space-y-8">
          <StatCards data={dashboardData} loading={loadingData} />
          <AISuggestionSection />
          <RiskAlertsSection alerts={riskAlerts} loading={loadingAlerts} onRefresh={handleRefreshAlerts} />
          <ActionButtons />
          <QuickAccess />
        </div>
      </motion.div>
    </div>
  );
};

export default PsychopedagogueDashboard;