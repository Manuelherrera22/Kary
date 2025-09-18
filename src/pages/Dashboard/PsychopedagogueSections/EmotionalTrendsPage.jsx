import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, LineChart as LineChartIcon, BarChart2, Users, AlertTriangle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { es, enUS } from 'date-fns/locale';
import edgeFunctionService from '@/services/edgeFunctionService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale);

const EmotionalTrendsPage = () => {
  const { t, language: currentLanguage } = useLanguage();
  const { user: authUser } = useMockAuth();
  const { toast } = useToast();

  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [emotionalData, setEmotionalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  
  const dateLocale = currentLanguage === 'es' ? es : enUS;

  const fetchStudents = useCallback(async () => {
    if (!authUser) return;
    setIsLoadingStudents(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name')
        .eq('role', 'student')
        .order('full_name', { ascending: true });
      if (error) throw error;
      setStudents(data || []);
      if (data && data.length > 0) {
        setSelectedStudentId(data[0].id); 
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({ title: t('toast.errorTitle'), description: t('common.errorFetchingStudents'), variant: 'destructive' });
    } finally {
      setIsLoadingStudents(false);
    }
  }, [authUser, t, toast]);

  const fetchEmotionalData = useCallback(async () => {
    if (!selectedStudentId) {
      setEmotionalData([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await edgeFunctionService.getEmotionalTrendSummary({ student_id: selectedStudentId });
      if (error) throw error;
      setEmotionalData(data?.trend_data || data || []); 
    } catch (error) {
      console.error('Error fetching emotional trend data:', error);
      toast({
        title: t('toast.errorTitle'),
        description: error.message || t('common.errorLoadingData'),
        variant: 'destructive',
      });
      setEmotionalData([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStudentId, t, toast]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    if (selectedStudentId) {
      fetchEmotionalData();
    } else {
      setEmotionalData([]); 
    }
  }, [selectedStudentId, fetchEmotionalData]);

  const processDataForCharts = () => {
    if (!emotionalData || emotionalData.length === 0) {
      return { lineChartData: null, barChartData: null };
    }
    
    const validData = emotionalData.filter(d => d.date && d.emotion_score != null);

    const lineChartData = validData.length > 0 ? {
      labels: validData.map(d => new Date(d.date)),
      datasets: [{
        label: t('psychopedagogueDashboard.emotionalTrend'),
        data: validData.map(d => d.emotion_score), 
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        tension: 0.1,
      }],
    } : null;

    const emotionCounts = validData.reduce((acc, d) => {
      const emotionKey = d.emotion_label || t('common.notSpecified');
      acc[emotionKey] = (acc[emotionKey] || 0) + 1;
      return acc;
    }, {});

    const barChartData = Object.keys(emotionCounts).length > 0 ? {
      labels: Object.keys(emotionCounts),
      datasets: [{
        label: t('psychopedagogueDashboard.emotionalDistribution'),
        data: Object.values(emotionCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'
        ],
      }],
    } : null;

    return { lineChartData, barChartData };
  };

  const { lineChartData, barChartData } = processDataForCharts();

  const chartOptionsBase = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, labels: { color: '#e2e8f0' } } },
    scales: { 
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.2)'}},
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.2)'}}
    }
  };
  
  const lineChartOptions = {
    ...chartOptionsBase,
    scales: {
      ...chartOptionsBase.scales,
      x: {
        ...chartOptionsBase.scales.x,
        type: 'time',
        time: { unit: 'day', tooltipFormat: 'PP', displayFormats: { day: 'MMM d' }},
        adapters: { date: { locale: dateLocale } },
        title: { display: true, text: t('common.date'), color: '#94a3b8' },
      },
      y: { ...chartOptionsBase.scales.y, title: { display: true, text: t('psychopedagogueDashboard.emotionalScore'), color: '#94a3b8' } }
    },
  };

  const barChartOptions = { ...chartOptionsBase, plugins: { legend: { display: false } } };

  const renderContent = () => {
    if (isLoading) return <div className="flex justify-center items-center h-96"><Loader2 className="h-12 w-12 animate-spin text-sky-400" /></div>;
    if (!selectedStudentId) return <div className="text-center py-12 bg-slate-800/40 rounded-lg"><Users size={48} className="mx-auto text-slate-500 mb-4" /><p className="text-xl text-slate-300">{t('common.selectStudentPrompt')}</p></div>;
    if (!emotionalData || emotionalData.length === 0) return <div className="text-center py-12 bg-slate-800/40 rounded-lg"><AlertTriangle size={48} className="mx-auto text-yellow-400 mb-4" /><p className="text-xl text-slate-300">{t('common.noDataAvailable')}</p><p className="text-slate-400 mt-2">{t('psychopedagogueDashboard.noEmotionalDataForStudent')}</p></div>;

    return (
      <>
        {lineChartData && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-slate-800/50 p-4 sm:p-6 rounded-lg shadow-md border border-slate-700 mb-8">
            <h2 className="text-xl font-semibold text-sky-300 mb-4">{t('psychopedagogueDashboard.emotionalTrendTimeline')}</h2>
            <div className="h-80 md:h-96"><Line data={lineChartData} options={lineChartOptions} /></div>
          </motion.div>
        )}
        {barChartData && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-slate-800/50 p-4 sm:p-6 rounded-lg shadow-md border border-slate-700">
            <h2 className="text-xl font-semibold text-sky-300 mb-4">{t('psychopedagogueDashboard.emotionalDistribution')}</h2>
            <div className="h-80 md:h-96"><Bar data={barChartData} options={barChartOptions} /></div>
          </motion.div>
        )}
      </>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-4 sm:p-6 bg-gradient-to-br from-gray-800 via-slate-800 to-neutral-900 min-h-screen text-white">
      <div className="container mx-auto">
        <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-6 transition-colors group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          {t('common.backToDashboard')}
        </Link>

        <div className="bg-slate-700/30 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-600">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center">
              <LineChartIcon size={36} className="mr-4 text-sky-400" />
              <div>
                <h1 className="text-3xl font-bold">{t('psychopedagogueDashboard.emotionalTrendsTitle')}</h1>
                <p className="text-slate-400">{t('psychopedagogueDashboard.emotionalTrendsPageSubtitle')}</p>
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId} disabled={isLoadingStudents || students.length === 0}>
                <SelectTrigger className="w-full sm:w-[280px] bg-slate-700 border-slate-600 text-white focus:ring-sky-500">
                  <SelectValue placeholder={isLoadingStudents ? t('common.loadingStudents') : t('common.selectStudentPrompt')} />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-white">
                  {isLoadingStudents ? (
                    <div className="p-2 text-center text-slate-400">{t('common.loadingStudents')}...</div>
                  ) : students.length === 0 ? (
                    <div className="p-2 text-center text-slate-400">{t('common.noStudentsAvailable')}</div>
                  ) : (
                    students.map(student => (
                      <SelectItem key={student.id} value={student.id} className="hover:bg-slate-600 focus:bg-slate-600">
                        {student.full_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          {renderContent()}
        </div>
      </div>
    </motion.div>
  );
};

export default EmotionalTrendsPage;