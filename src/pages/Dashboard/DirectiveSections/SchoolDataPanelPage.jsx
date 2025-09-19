import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, Activity, TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import AcademicAverageChart from './charts/AcademicAverageChart';
import AttendanceChart from './charts/AttendanceChart';
import MonthlyComparisonChart from './charts/MonthlyComparisonChart';
import ChartCard from './charts/ChartCard';
import { supabase } from '@/lib/supabaseClient'; 
import { useToast } from "@/components/ui/use-toast";

const SchoolDataPanelPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [academicData, setAcademicData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simular carga de datos para San Luis Gonzaga
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Datos académicos realistas para San Luis Gonzaga
        const academicData = [
          { grado: '1°', materia: 'Matemáticas', promedio: 85.2 },
          { grado: '1°', materia: 'Español', promedio: 88.7 },
          { grado: '1°', materia: 'Ciencias', promedio: 82.1 },
          { grado: '2°', materia: 'Matemáticas', promedio: 87.5 },
          { grado: '2°', materia: 'Español', promedio: 89.3 },
          { grado: '2°', materia: 'Ciencias', promedio: 84.8 },
          { grado: '3°', materia: 'Matemáticas', promedio: 86.9 },
          { grado: '3°', materia: 'Español', promedio: 91.2 },
          { grado: '3°', materia: 'Ciencias', promedio: 88.4 },
          { grado: '4°', materia: 'Matemáticas', promedio: 89.1 },
          { grado: '4°', materia: 'Español', promedio: 92.5 },
          { grado: '4°', materia: 'Ciencias', promedio: 87.8 },
          { grado: '5°', materia: 'Matemáticas', promedio: 90.3 },
          { grado: '5°', materia: 'Español', promedio: 93.1 },
          { grado: '5°', materia: 'Ciencias', promedio: 89.7 }
        ];

        // Datos de asistencia realistas para San Luis Gonzaga
        const attendanceData = [
          { grado: '1°', estudiantes_presentes: 28, estudiantes_totales: 30 },
          { grado: '2°', estudiantes_presentes: 25, estudiantes_totales: 28 },
          { grado: '3°', estudiantes_presentes: 32, estudiantes_totales: 35 },
          { grado: '4°', estudiantes_presentes: 29, estudiantes_totales: 31 },
          { grado: '5°', estudiantes_presentes: 26, estudiantes_totales: 29 }
        ];

        // Datos comparativos mensuales para San Luis Gonzaga
        const comparisonData = [
          { grupo: '1° A', valor: 85, fecha: '2025-01' },
          { grupo: '1° B', valor: 88, fecha: '2025-01' },
          { grupo: '2° A', valor: 87, fecha: '2025-01' },
          { grupo: '2° B', valor: 89, fecha: '2025-01' },
          { grupo: '3° A', valor: 91, fecha: '2025-01' },
          { grupo: '3° B', valor: 88, fecha: '2025-01' },
          { grupo: '4° A', valor: 90, fecha: '2025-01' },
          { grupo: '4° B', valor: 92, fecha: '2025-01' },
          { grupo: '5° A', valor: 93, fecha: '2025-01' },
          { grupo: '5° B', valor: 89, fecha: '2025-01' }
        ];

        setAcademicData(academicData);
        setAttendanceData(attendanceData);
        setComparisonData(comparisonData);

        console.log("Datos de San Luis Gonzaga cargados exitosamente");

      } catch (error) {
        console.error("Error loading San Luis Gonzaga data:", error);
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
      {/* Botón de regreso */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-slate-300 hover:text-white transition-colors duration-200 group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">{t('common.backToDashboard')}</span>
        </button>
      </motion.div>

      <motion.div 
        variants={cardVariants} initial="hidden" animate="visible" custom={0}
        className="text-center bg-gradient-to-r from-sky-600/10 via-indigo-600/10 to-purple-600/10 p-6 rounded-xl shadow-lg border border-slate-700/50"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-300 to-purple-300">
          {t('dashboards.directive.schoolData.pageTitle')} - San Luis Gonzaga
        </h1>
        <p className="text-slate-300 mt-2 text-md sm:text-lg">
          {t('dashboards.directive.schoolData.pageSubtitle')} de la Institución Educativa San Luis Gonzaga
        </p>
        
        {/* Información institucional */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-slate-600/30">
            <div className="text-sky-300 font-semibold">📚 Estudiantes</div>
            <div className="text-white text-lg font-bold">153</div>
            <div className="text-slate-400">Total matriculados</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-slate-600/30">
            <div className="text-emerald-300 font-semibold">🎯 Promedio General</div>
            <div className="text-white text-lg font-bold">88.4%</div>
            <div className="text-slate-400">Rendimiento académico</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-slate-600/30">
            <div className="text-purple-300 font-semibold">✅ Asistencia</div>
            <div className="text-white text-lg font-bold">93.2%</div>
            <div className="text-slate-400">Promedio de asistencia</div>
          </div>
        </div>
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
              title={t('dashboards.directive.schoolData.academicAverages')} 
              description={t('dashboards.directive.schoolData.averagesDesc')}
                Icon={BarChart3}
                iconColor="text-sky-400"
              >
                <AcademicAverageChart data={academicData} />
              </ChartCard>
            </motion.div>
            
            <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
              <ChartCard 
              title={t('dashboards.directive.schoolData.attendanceLevels')} 
              description={t('dashboards.directive.schoolData.attendanceDesc')}
                Icon={Users}
                iconColor="text-emerald-400"
                footerText={t('dashboards.directive.schoolData.overallAttendance', {percentage: overallAttendance})}
              >
                <AttendanceChart data={attendanceData} />
              </ChartCard>
            </motion.div>

            <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
              <ChartCard 
              title={t('dashboards.directive.schoolData.monthlyComparison')} 
              description={t('dashboards.directive.schoolData.comparisonDesc')}
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