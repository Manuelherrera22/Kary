import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChartBig, BookOpen, Smile, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import LoadingScreen from '@/pages/Dashboard/components/LoadingScreen';

const StudentProgressPage = () => {
  const { t } = useLanguage();
  const { userProfile, primaryChildId, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [progressEntries, setProgressEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (authLoading) {
        setIsLoading(true);
        return;
      }
      if (!userProfile || userProfile.role !== 'parent') {
        setIsLoading(false);
        return;
      }
      
      if (!primaryChildId) {
        setIsLoading(false);
        if (userProfile.role === 'parent') {
            toast({
                title: t('toast.infoTitle'),
                description: t('parentDashboard.noChildLinked'),
                variant: "default",
            });
        }
        return;
      }
      
      setIsLoading(true);
      try {
        const { data: progressData, error: progressError } = await supabase
          .from('progreso_estudiante_resumen')
          .select('*')
          .eq('estudiante_id', primaryChildId)
          .order('periodo', { ascending: false }); 

        if (progressError) throw progressError;
        setProgressEntries(progressData || []);
      } catch (error) {
        console.error('Error fetching student progress:', error);
        toast({
          title: t('toast.errorTitle'),
          description: t('parentDashboard.studentProgress.errorFetching') + (error.message ? `: ${error.message}` : ''),
          variant: "destructive",
        });
        setProgressEntries([]); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [userProfile, primaryChildId, authLoading, t, toast]);

  if (authLoading || isLoading) {
    return <LoadingScreen text={t('common.loadingText')} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-gradient-to-br from-gray-800 via-slate-800 to-neutral-900 min-h-screen text-white"
    >
      <div className="container mx-auto max-w-3xl">
        <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          {t('common.backToDashboard')}
        </Link>

        <div className="bg-slate-700/30 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-600">
          <div className="flex items-center mb-8">
            <BarChartBig size={36} className="mr-4 text-sky-400" />
            <div>
              <h1 className="text-3xl font-bold">{t('parentDashboard.studentProgress.title')}</h1>
              <p className="text-slate-400">{t('parentDashboard.studentProgress.pageSubtitle')}</p>
            </div>
          </div>
          
          {!primaryChildId && userProfile?.role === 'parent' ? (
            <div className="text-center py-12">
              <p className="text-xl text-slate-300">{t('parentDashboard.noChildLinked')}</p>
              <p className="text-slate-400 mt-2">{t('parentDashboard.contactInstitution')}</p>
            </div>
          ) : progressEntries.length === 0 && primaryChildId ? (
            <div className="text-center py-12">
              <p className="text-xl text-slate-300">{t('parentDashboard.studentProgress.noProgressFound')}</p>
            </div>
          ) : (
             primaryChildId && progressEntries.length > 0 && (
                <div className="space-y-6">
                {progressEntries.map((entry) => (
                  <div key={entry.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 shadow-md">
                    <h3 className="text-lg font-semibold text-sky-300 flex items-center">
                      <Calendar size={18} className="mr-2" /> {t('common.period')}: {entry.periodo || t('common.notSpecified')}
                    </h3>
                    <div className="mt-3">
                      <h4 className="text-md font-medium text-slate-300 flex items-center mb-1">
                        <BookOpen size={16} className="mr-2 text-emerald-400" /> {t('common.academicSummary')}
                      </h4>
                      <p className="text-sm text-slate-400 whitespace-pre-wrap">{entry.resumen_academico || t('common.notSpecified')}</p>
                    </div>
                    <div className="mt-3">
                      <h4 className="text-md font-medium text-slate-300 flex items-center mb-1">
                        <Smile size={16} className="mr-2 text-yellow-400" /> {t('common.emotionalSummary')}
                      </h4>
                      <p className="text-sm text-slate-400 whitespace-pre-wrap">{entry.resumen_emocional || t('common.notSpecified')}</p>
                    </div>
                  </div>
                ))}
              </div>
             )
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StudentProgressPage;