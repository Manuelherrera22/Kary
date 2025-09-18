import React from 'react';
import { motion } from 'framer-motion';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import { format, parseISO } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, TimeScale);

const cardItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const SupportPlanCharts = ({ supportPlans }) => {
  const { t, language: currentLanguage } = useLanguage();
  const dateLocale = currentLanguage === 'es' ? es : enUS;

  const processDataForCharts = () => {
    if (!supportPlans || supportPlans.length === 0) {
      return { plansByGoalData: null, plansByStatusData: null, plansTimelineData: null };
    }

    const plansByGoal = supportPlans.reduce((acc, plan) => {
      const goal = plan.support_goal || t('common.notSpecified');
      acc[goal] = (acc[goal] || 0) + 1;
      return acc;
    }, {});

    const plansByStatus = supportPlans.reduce((acc, plan) => {
      const statusKey = plan.status ? plan.status.toLowerCase().replace(/\s+/g, '') : 'notAvailable';
      const statusDisplay = t(`supportPlans.statusValues.${statusKey}`, plan.status || t('common.notAvailable'));
      acc[statusDisplay] = (acc[statusDisplay] || 0) + 1;
      return acc;
    }, {});
    
    const plansByMonth = supportPlans.reduce((acc, plan) => {
      if (plan.start_date) {
        try {
          const dateObj = parseISO(plan.start_date);
          const monthYear = format(dateObj, 'yyyy-MM');
          acc[monthYear] = (acc[monthYear] || 0) + 1;
        } catch (e) {
          console.warn(`Invalid start_date format for plan ID ${plan.id}: ${plan.start_date}`);
        }
      }
      return acc;
    }, {});
    
    const sortedMonths = Object.keys(plansByMonth).sort();

    const plansByGoalData = Object.keys(plansByGoal).length > 0 ? {
      labels: Object.keys(plansByGoal),
      datasets: [{
        label: t('supportPlans.plansByGoalChartLabel'),
        data: Object.values(plansByGoal),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }],
    } : null;

    const plansByStatusData = Object.keys(plansByStatus).length > 0 ? {
      labels: Object.keys(plansByStatus),
      datasets: [{
        label: t('supportPlans.plansByStatusChartLabel'),
        data: Object.values(plansByStatus),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)', 
          'rgba(255, 206, 86, 0.6)', 
          'rgba(75, 192, 192, 0.6)', 
          'rgba(153, 102, 255, 0.6)', 
          'rgba(255, 99, 132, 0.6)',  
          'rgba(201, 203, 207, 0.6)' 
        ],
      }],
    } : null;
    
    const plansTimelineData = sortedMonths.length > 0 ? {
      labels: sortedMonths.map(month => parseISO(month + '-01')), 
      datasets: [{
        label: t('supportPlans.plansTimelineChartLabel'),
        data: sortedMonths.map(month => plansByMonth[month]),
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        tension: 0.1,
      }],
    } : null;

    return { plansByGoalData, plansByStatusData, plansTimelineData };
  };

  const { plansByGoalData, plansByStatusData, plansTimelineData } = processDataForCharts();
  
  const commonChartOptions = (titleText) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top', labels: { color: '#e2e8f0'} },
      title: { display: true, text: titleText, color: '#cbd5e1', font: {size: 16} }
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.2)'}},
      y: { ticks: { color: '#94a3b8', stepSize: 1 }, grid: { color: 'rgba(148, 163, 184, 0.2)'}}
    }
  });
  
  const timelineChartOptions = {
    ...commonChartOptions(t('supportPlans.plansTimelineChartTitle')),
    scales: {
      x: {
        type: 'time',
        time: { unit: 'month', tooltipFormat: 'MMM yyyy', displayFormats: { month: 'MMM yyyy' }},
        adapters: { date: { locale: dateLocale } },
        title: { display: true, text: t('common.date'), color: '#94a3b8' },
        ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.2)'}
      },
      y: { 
        title: { display: true, text: t('supportPlans.numberOfPlans'), color: '#94a3b8' },
        ticks: { color: '#94a3b8', stepSize: 1 }, grid: { color: 'rgba(148, 163, 184, 0.2)'}
      }
    }
  };

  if (!supportPlans || supportPlans.length === 0) return null;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 pt-8 border-t border-slate-700/50"
      >
        {plansByGoalData && (
          <motion.div variants={cardItemVariants} className="bg-slate-800/50 p-4 sm:p-6 rounded-lg shadow-md border border-slate-700">
            <h2 className="text-xl font-semibold text-sky-300 mb-4">{t('supportPlans.plansByGoalChartTitle')}</h2>
            <div className="h-80">
              <Bar data={plansByGoalData} options={commonChartOptions(t('supportPlans.plansByGoalChartTitle'))} />
            </div>
          </motion.div>
        )}
        {plansByStatusData && (
            <motion.div variants={cardItemVariants} className="bg-slate-800/50 p-4 sm:p-6 rounded-lg shadow-md border border-slate-700">
            <h2 className="text-xl font-semibold text-sky-300 mb-4">{t('supportPlans.plansByStatusChartTitle')}</h2>
            <div className="h-80 flex justify-center items-center">
                <Pie data={plansByStatusData} options={{...commonChartOptions(t('supportPlans.plansByStatusChartTitle')), maintainAspectRatio: false}} />
            </div>
          </motion.div>
        )}
      </motion.div>
      {plansTimelineData && (
          <motion.div 
            variants={cardItemVariants} 
            initial="hidden" animate="visible"
            className="bg-slate-800/50 p-4 sm:p-6 rounded-lg shadow-md border border-slate-700 mt-8"
          >
            <h2 className="text-xl font-semibold text-sky-300 mb-4">{t('supportPlans.plansTimelineChartTitle')}</h2>
            <div className="h-80">
              <Line data={plansTimelineData} options={timelineChartOptions} />
            </div>
          </motion.div>
        )}
    </>
  );
};

export default SupportPlanCharts;