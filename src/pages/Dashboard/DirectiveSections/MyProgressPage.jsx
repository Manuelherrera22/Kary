import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Activity, TrendingUp, BarChart, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const MyProgressPage = () => {
  const { t } = useLanguage();

  const progressData = [
    { id: 1, labelKey: "dashboards.directive.progress.reportsGenerated", value: "42", icon: BarChart },
    { id: 2, labelKey: "dashboards.directive.progress.iaInteractions", value: "120+", icon: Activity },
    { id: 3, labelKey: "dashboards.directive.progress.lastConnection", value: t('common.today'), icon: Clock },
    { id: 4, labelKey: "dashboards.directive.progress.institutionalImprovement", value: "+15%", icon: TrendingUp },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-gradient-to-br from-purple-700 via-pink-700 to-orange-600 min-h-screen text-white"
    >
      <div className="container mx-auto">
        <Link to="/dashboard" className="inline-flex items-center text-purple-300 hover:text-purple-100 mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          {t('common.backToDashboard')}
        </Link>

        <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl">
          <div className="flex items-center mb-8">
            <Activity size={36} className="mr-4 text-orange-300" />
            <div>
              <h1 className="text-3xl font-bold">{t('dashboards.common.myProgressTitle')}</h1>
              <p className="text-purple-200">{t('dashboards.directive.myProgressPageSubtitle')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {progressData.map(item => (
              <div key={item.id} className="bg-white/10 p-6 rounded-lg shadow-md hover:bg-white/20 transition-colors">
                <div className="flex items-center text-purple-300 mb-2">
                  <item.icon size={22} className="mr-3" />
                  <h3 className="text-lg font-semibold">{t(item.labelKey)}</h3>
                </div>
                <p className="text-4xl font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-orange-300">{t('dashboards.directive.progress.periodComparisonTitle')}</h2>
            <div className="bg-white/5 p-6 rounded-lg min-h-[200px] flex items-center justify-center">
              <p className="text-purple-300">{t('dashboards.directive.progress.comparisonChartPlaceholder')}</p>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default MyProgressPage;