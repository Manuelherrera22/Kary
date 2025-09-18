import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Calendar, Tag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import LoadingScreen from '@/pages/Dashboard/components/LoadingScreen';

const AccessReportsPage = () => {
  const { t, currentLanguage } = useLanguage();
  const { userProfile, primaryChildId, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const dateLocale = currentLanguage === 'es' ? es : undefined;

  useEffect(() => {
    const fetchReports = async () => {
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
        const { data: reportsData, error: reportsError } = await supabase
          .from('reportes_estudiante')
          .select('*')
          .eq('estudiante_id', primaryChildId)
          .order('fecha', { ascending: false });

        if (reportsError) throw reportsError;
        setReports(reportsData || []);
      } catch (error) {
        console.error('Error fetching student reports:', error);
        toast({
          title: t('toast.errorTitle'),
          description: t('parentDashboard.accessReports.errorFetching'),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [userProfile, primaryChildId, authLoading, t, toast, currentLanguage]);

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
            <FileText size={36} className="mr-4 text-sky-400" />
            <div>
              <h1 className="text-3xl font-bold">{t('parentDashboard.accessReports.title')}</h1>
              <p className="text-slate-400">{t('parentDashboard.accessReports.pageSubtitle')}</p>
            </div>
          </div>
          
          {!primaryChildId && userProfile?.role === 'parent' ? (
             <div className="text-center py-12">
              <p className="text-xl text-slate-300">{t('parentDashboard.noChildLinked')}</p>
               <p className="text-slate-400 mt-2">{t('parentDashboard.contactInstitution')}</p>
            </div>
          ) : reports.length === 0 && primaryChildId ? (
            <div className="text-center py-12">
              <p className="text-xl text-slate-300">{t('parentDashboard.accessReports.noReportsFound')}</p>
            </div>
          ) : (
            primaryChildId && reports.length > 0 && (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 shadow-md">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-sky-300">{report.titulo || t('common.notSpecified')}</h3>
                      {report.url_reporte && (
                        <a 
                          href={report.url_reporte} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded-md transition-colors"
                        >
                          <Download size={14} className="mr-1.5" /> {t('common.exportButton')}
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 flex items-center mt-1">
                      <Calendar size={14} className="mr-1.5" /> 
                      {report.fecha ? format(new Date(report.fecha), 'P', { locale: dateLocale }) : t('common.notSpecified')}
                    </p>
                    <p className="text-sm text-slate-400 flex items-center mt-1">
                      <Tag size={14} className="mr-1.5" /> {t('common.category')}: {report.categoria || t('common.notSpecified')}
                    </p>
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

export default AccessReportsPage;