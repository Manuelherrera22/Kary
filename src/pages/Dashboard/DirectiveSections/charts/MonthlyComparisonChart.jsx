import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { TrendingUp } from 'lucide-react';
import ChartCard from './ChartCard';
import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

const MonthlyComparisonChart = () => {
  const { t, currentLanguage } = useLanguage();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [availableGroups, setAvailableGroups] = useState([]);

  const dateLocale = currentLanguage === 'es' ? es : undefined;

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      setChartData(null); 
      try {
        const { data: groupsData, error: groupsError } = await supabase
          .from('comparativo_mensual')
          .select('grupo');

        if (groupsError) throw groupsError;
        
        const uniqueGroups = [...new Set(groupsData.map(item => item.grupo).filter(Boolean))];
        setAvailableGroups(uniqueGroups);
        
        if (uniqueGroups.length > 0) {
          setActiveGroup(uniqueGroups[0]);
        } else {
          setLoading(false); 
        }

      } catch (err) {
        console.error("Error fetching groups data:", err);
        setError(err.message || t('common.errorOccurred'));
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [t]);

  useEffect(() => {
    if (!activeGroup) {
      if (availableGroups.length === 0 && !loading && !error) {
         setChartData(null); 
         setLoading(false);
      }
      return;
    }

    const fetchChartDataForGroup = async () => {
      setLoading(true);
      setError(null);
      setChartData(null); 
      try {
        const { data: comparisonRaw, error: comparisonError } = await supabase
          .from('comparativo_mensual')
          .select('fecha, valor')
          .eq('grupo', activeGroup)
          .order('fecha', { ascending: true });

        if (comparisonError) throw comparisonError;
        
        if (!comparisonRaw || comparisonRaw.length === 0) {
          setLoading(false);
          return;
        }
        
        const labels = comparisonRaw.map(d => {
          const dateObj = parseISO(d.fecha);
          return isValid(dateObj) ? format(dateObj, 'MMM yyyy', { locale: dateLocale }) : t('common.invalidDate');
        });
        const dataValues = comparisonRaw.map(d => d.valor);

        if (labels.length > 0) {
          setChartData({
            labels,
            datasets: [
              {
                label: t('dashboards.directive.schoolData.valueOverTime', { group: activeGroup }),
                data: dataValues,
                borderColor: 'rgb(236, 72, 153)',
                backgroundColor: 'rgba(236, 72, 153, 0.2)',
                fill: true,
                tension: 0.3,
                yAxisID: 'yValue',
              }
            ]
          });
        }
      } catch (err) {
        console.error(`Error fetching comparison data for group ${activeGroup}:`, err);
        setError(err.message || t('common.errorOccurred'));
      } finally {
        setLoading(false);
      }
    };
    fetchChartDataForGroup();
  }, [t, activeGroup, dateLocale]);

  const chartOptionsConfig = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { position: 'top', labels: { color: '#e5e7eb'} },
      title: { display: true, text: `${t('dashboards.directive.schoolData.monthlyComparison')} - ${t('dashboards.directive.schoolData.group')} ${activeGroup || ''}`, color: '#f3f4f6', font: { size: 16 } },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label = label.split(" - ")[0]; 
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2); 
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: { ticks: { color: '#d1d5db' }, grid: { color: 'rgba(209, 213, 219, 0.1)' } },
      yValue: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: t('dashboards.directive.schoolData.valueAxisLabel'), color: '#d1d5db' },
        ticks: { color: '#d1d5db', callback: value => `${value}` }, 
        grid: { drawOnChartArea: true, color: 'rgba(236, 72, 153, 0.1)' },
      }
    }
  };
  
  return (
    <>
      {availableGroups.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2 justify-center">
          {availableGroups.map(group => (
            <button
              key={group}
              onClick={() => setActiveGroup(group)}
              className={`px-3 py-1 text-sm rounded-md transition-colors
                ${activeGroup === group 
                  ? 'bg-pink-500 text-white font-semibold shadow-lg' 
                  : 'bg-white/20 text-purple-200 hover:bg-white/30'
                }`}
            >
              {t('dashboards.directive.schoolData.group')} {group}
            </button>
          ))}
        </div>
      )}
      <ChartCard
        titleKey="dashboards.directive.schoolData.monthlyComparison"
        descriptionKey="dashboards.directive.schoolData.comparisonDesc"
        icon={<TrendingUp size={20} className="mr-2 text-pink-300" />}
        chartData={chartData}
        ChartComponent={Line}
        options={chartOptionsConfig}
        loading={loading}
        error={error}
      />
    </>
  );
};

export default MonthlyComparisonChart;