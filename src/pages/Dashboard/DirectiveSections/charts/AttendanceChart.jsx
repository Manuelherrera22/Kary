import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users } from 'lucide-react';
import ChartCard from './ChartCard';

const AttendanceChart = () => {
  const { t } = useLanguage();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState('');

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);
      setError(null);
      setChartData(null); 
      setAdditionalInfo('');
      try {
        const { data: attendanceRaw, error: attendanceError } = await supabase
          .from('asistencia_escolar')
          .select('grado, estudiantes_presentes, estudiantes_totales, fecha_registro');

        if (attendanceError) throw attendanceError;

        if (!attendanceRaw || attendanceRaw.length === 0) {
          setLoading(false);
          return;
        }
        
        const gradeAttendance = attendanceRaw.reduce((acc, record) => {
          const gradoKey = record.grado || t('common.notSpecified');
          if (!acc[gradoKey]) {
            acc[gradoKey] = { presentes: 0, totales: 0 };
          }
          acc[gradoKey].presentes += (record.estudiantes_presentes || 0);
          acc[gradoKey].totales += (record.estudiantes_totales || 0);
          return acc;
        }, {});

        const labels = Object.keys(gradeAttendance);
        const data = labels.map(gradoKey => {
          const { presentes, totales } = gradeAttendance[gradoKey];
          return totales > 0 ? ((presentes / totales) * 100).toFixed(2) : 0;
        });

        const overallPresentes = attendanceRaw.reduce((sum, r) => sum + (r.estudiantes_presentes || 0), 0);
        const overallTotales = attendanceRaw.reduce((sum, r) => sum + (r.estudiantes_totales || 0), 0);
        const overallPercentage = overallTotales > 0 ? ((overallPresentes / overallTotales) * 100).toFixed(2) : 0;
        
        if (labels.length > 0) {
          setChartData({
            labels: labels.map(gradoKey => `${t('dashboards.directive.schoolData.gradeLabel', {grade: gradoKey})}`),
            datasets: [{
              label: t('dashboards.directive.schoolData.attendancePercentage'),
              data,
              backgroundColor: 'rgba(52, 211, 153, 0.7)',
              borderColor: 'rgba(52, 211, 153, 1)',
              borderWidth: 1,
              borderRadius: 5,
            }]
          });
          setAdditionalInfo(`${t('dashboards.directive.schoolData.overallAttendance')}: ${overallPercentage}%`);
        }

      } catch (err) {
        console.error("Error fetching attendance data:", err);
        setError(err.message || t('common.errorOccurred'));
      } finally {
        setLoading(false);
      }
    };
    fetchAttendanceData();
  }, [t]);

  const chartOptionsConfig = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#e5e7eb'} },
      title: { display: true, text: t('dashboards.directive.schoolData.attendanceLevels'), color: '#f3f4f6', font: { size: 16 } },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + '%';
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: { ticks: { color: '#d1d5db' }, grid: { color: 'rgba(209, 213, 219, 0.1)' } },
      y: { 
        ticks: { color: '#d1d5db', callback: value => `${value}%` }, 
        grid: { color: 'rgba(209, 213, 219, 0.1)' },
        title: { display: true, text: t('dashboards.directive.schoolData.attendancePercentageAxis'), color: '#d1d5db' },
        min: 0,
        max: 100 
      }
    }
  };

  return (
    <ChartCard
      titleKey="dashboards.directive.schoolData.attendanceLevels"
      descriptionKey="dashboards.directive.schoolData.attendanceDesc"
      icon={<Users size={20} className="mr-2 text-green-300" />}
      chartData={chartData}
      ChartComponent={Bar}
      options={chartOptionsConfig}
      additionalInfo={additionalInfo}
      loading={loading}
      error={error}
    />
  );
};

export default AttendanceChart;