import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Loader2, AlertTriangle, DownloadCloud } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import MagicBackground from '@/pages/Dashboard/StudentDashboard/components/MagicBackground';

const StudentReportsPage = () => {
  const { t, language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const dateLocale = language === 'es' ? es : undefined;

  useEffect(() => {
    const fetchReports = async () => {
      if (authLoading || !user) {
        setIsLoading(true);
        return;
      }
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('student_reports')
          .select('*')
          .order('generation_date', { ascending: false });

        if (error) throw error;
        setReports(data || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast({
          title: t('toast.errorTitle'),
          description: t('studentDashboard.studentReports.errorFetching'),
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, [user, authLoading, t, toast]);

  const formatDateSafe = (dateString) => {
    if (!dateString) return null;
    try {
      return format(parseISO(dateString), 'PPP', { locale: dateLocale });
    } catch (e) {
      console.warn(`Invalid date format for formatDateSafe: ${dateString}`);
      return t('common.invalidDate');
    }
  };

  if (authLoading && isLoading) {
    return (
      <MagicBackground>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-sky-400" />
        </div>
      </MagicBackground>
    );
  }

  return (
    <MagicBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6"
      >
        <div className="container mx-auto max-w-3xl">
          <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-6 transition-colors group">
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            {t('common.backToDashboard')}
          </Link>

          <header className="page-header">
            <h1 className="page-title bg-gradient-to-r from-rose-400 to-pink-300">
              <FileText size={36} className="mr-3" />
              {t('studentDashboard.studentReports.pageTitle')}
            </h1>
            <p className="page-subtitle">{t('studentDashboard.studentReports.pageSubtitle')}</p>
          </header>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
              <p className="ml-2">{t('common.loadingData')}</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="bg-slate-800/50 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-slate-700/50 text-center">
              <AlertTriangle size={48} className="text-rose-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-200 mb-2">{t('studentDashboard.studentReports.noReportsTitle')}</h2>
              <p className="text-slate-400">{t('studentDashboard.studentReports.noReportsSubtitle')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map(report => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-800/50 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-700/50 hover:border-slate-600/70 transition-all flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-slate-100">{report.report_type || t('common.untitledReport')}</h3>
                    <p className="text-sm text-slate-400">
                      {t('studentDashboard.studentReports.generatedOn')}: {formatDateSafe(report.generation_date) || t('common.notAvailable')}
                    </p>
                  </div>
                  {report.file_url && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.open(report.file_url, '_blank')}
                      className="text-sky-300 border-sky-500/70 hover:bg-sky-500/20 hover:text-sky-200"
                    >
                      <DownloadCloud size={16} className="mr-2" />
                      {t('common.downloadButton')}
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </MagicBackground>
  );
};

export default StudentReportsPage;