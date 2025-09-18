import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen } from 'lucide-react';
import ChartCard from './ChartCard';

const AcademicAverageChart = () => {
  const { t } = useLanguage();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAcademicData = async () => {
      setLoading(true);
      setError(null);
      setChartData(null); 
      try {
        const { data: academicRaw, error: academicError } = await supabase
          .from('rendimiento_academico')
          .select('grado, materia, promedio, fecha_registro');

        if (academicError) throw academicError;

        if (!academicRaw || academicRaw.length === 0) {
          setLoading(false);
          return;
        }

        const groupedData = academicRaw.reduce((acc, record) => {
          const key = `${record.grado || t('common.notSpecified')} - ${record.materia || t('common.notSpecified')}`;
          if (!acc[key]) {
            acc[key] = { sum: 0, count: 0, grado: record.grado || t('common.notSpecified'), materia: record.materia || t('common.notSpecified') };
          }
          acc[key].sum += record.promedio || 0;
          acc[key].count += 1;
          return acc;
        }, {});

        const labels = Object.keys(groupedData);
        const data = labels.map(key => (groupedData[key].sum / groupedData[key].count).toFixed(2));
        
        if (labels.length > 0) {
          setChartData({
            labels: labels.map(key => `${groupedData[key].grado} - ${t(groupedData[key].materia, {}, groupedData[key].materia)}`),
            datasets: [{
              label: t('dashboards.directive.schoolData.academicAverages'),
              data,
              backgroundColor: 'rgba(138, 92, 245, 0.7)',
              borderColor: 'rgba(138, 92, 245, 1)',
              borderWidth: 1,
              borderRadius: 5,
            }]
          });
        }
      } catch (err) {
        console.error("Error fetching academic data:", err);
        setError(err.message || t('common.errorOccurred'));
      } finally {
        setLoading(false);
      }
    };
    fetchAcademicData();
  }, [t]);

  const chartOptionsConfig = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#e5e7eb'} },
      title: { display: true, text: t('dashboards.directive.schoolData.academicAverages'), color: '#f3f4f6', font: { size: 16 } }
    },
    scales: {
      x: { 
        ticks: { color: '#d1d5db', autoSkip: false, maxRotation: 45, minRotation: 45 }, 
        grid: { color: 'rgba(209, 213, 219, 0.1)' } 
      },
      y: { 
        ticks: { color: '#d1d5db', callback: value => `${value}` }, 
        grid: { color: 'rgba(209, 213, 219, 0.1)' },
        title: { display: true, text: t('dashboards.directive.schoolData.averageScore'), color: '#d1d5db' },
        min: 0,
        max: 100 
      }
    }
  };

  return (
    <ChartCard
      titleKey="dashboards.directive.schoolData.academicAverages"
      descriptionKey="dashboards.directive.schoolData.averagesDesc"
      icon={<BookOpen size={20} className="mr-2 text-sky-300" />}
      chartData={chartData}
      ChartComponent={Bar}
      options={chartOptionsConfig}
      loading={loading}
      error={error}
    />
  );
};

export default AcademicAverageChart;