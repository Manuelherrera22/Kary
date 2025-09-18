import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3, Users, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import AcademicAverageChart from './charts/AcademicAverageChart';
import AttendanceChart from './charts/AttendanceChart';
import MonthlyComparisonChart from './charts/MonthlyComparisonChart';
import ChartCard from './charts/ChartCard';
import { supabase } from '@/lib/supabaseClient'; 
import { useToast } from "@/components/ui/use-toast";

const SchoolDataPanelPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [academicData, setAcademicData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: academic, error: academicError } = await supabase.from('rendimiento_academico').select('grado, materia, promedio');
        if (academicError) throw academicError;
        setAcademicData(academic || []);

        const { data: attendance, error: attendanceError } = await supabase.from('asistencia_escolar').select('grado, estudiantes_presentes, estudiantes_totales');
        if (attendanceError) throw attendanceError;
        setAttendanceData(attendance || []);
        
        const { data: comparison, error: comparisonError } = await supabase.from('comparativo_mensual').select('grupo, valor, fecha');
        if (comparisonError) throw comparisonError;
        setComparisonData(comparison || []);

      } catch (error) {
        console.error("Error fetching school data:", error);
        toast({
          title: t('toast.errorTitle'),
          description: t('common.errorFetchingData') + (error.message ? `: ${error.message}` : ''),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t, toast]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const getOverallAttendancePercentage = () => {
    if (!attendanceData || attendanceData.length === 0) return 0;
    const totalPresent = attendanceData.reduce((sum, item) => sum + (item.estudiantes_presentes || 0), 0);
    const totalStudents = attendanceData.reduce((sum, item) => sum + (item.estudiantes_totales || 0), 0);
    return totalStudents > 0 ? ((totalPresent / totalStudents) * 100).toFixed(1) : 0;
  };
  
  const overallAttendance = getOverallAttendancePercentage();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-8"
    >
      <motion.div 
        variants={cardVariants} initial="hidden" animate="visible" custom={0}
        className="text-center bg-gradient-to-r from-sky-600/10 via-indigo-600/10 to-purple-600/10 p-6 rounded-xl shadow-lg border border-slate-700/50"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-300 to-purple-300">
          {t('directive.schoolData.pageTitle')}
        </h1>
        <p className="text-slate-300 mt-2 text-md sm:text-lg">
          {t('directive.schoolData.pageSubtitle')}
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <motion.div key={index} custom={index + 1} variants={cardVariants} initial="hidden" animate="visible" className="bg-slate-800/60 p-6 rounded-xl shadow-lg h-64 animate-pulse border border-slate-700"></motion.div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
              <ChartCard 
                title={t('directive.schoolData.averagesTitle')} 
                description={t('directive.schoolData.averagesDesc')}
                Icon={BarChart3}
                iconColor="text-sky-400"
              >
                <AcademicAverageChart data={academicData} />
              </ChartCard>
            </motion.div>
            
            <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
              <ChartCard 
                title={t('directive.schoolData.attendanceTitle')} 
                description={t('directive.schoolData.attendanceDesc')}
                Icon={Users}
                iconColor="text-emerald-400"
                footerText={t('directive.schoolData.overallAttendance', {percentage: overallAttendance})}
              >
                <AttendanceChart data={attendanceData} />
              </ChartCard>
            </motion.div>

            <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
              <ChartCard 
                title={t('directive.schoolData.comparisonTitle')} 
                description={t('directive.schoolData.comparisonDesc')}
                Icon={Activity}
                iconColor="text-rose-400"
              >
                <MonthlyComparisonChart data={comparisonData} />
              </ChartCard>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default SchoolDataPanelPage;