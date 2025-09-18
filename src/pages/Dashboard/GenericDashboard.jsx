import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import WelcomeUser from '@/pages/Dashboard/WelcomeUser';
import ConvaiConnectCard from '@/pages/Dashboard/ConvaiConnectCard';
import DashboardCard from '@/pages/Dashboard/components/DashboardCard';
import { AlertTriangle, Info, Settings, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const GenericDashboard = ({ user, userProfile }) => {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const displayName = userProfile?.full_name || user?.email || t('common.guest');
  
  const genericFeatures = [
    {
      titleKey: 'dashboards.generic.roleNotSetTitle',
      descriptionKey: 'dashboards.generic.roleNotSetDesc',
      icon: AlertTriangle,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      hoverBgColor: 'hover:bg-yellow-500/20',
      colSpan: "sm:col-span-full",
      children: <p className="text-sm text-yellow-200 mt-2">{t('roles.roleNotSetDescription')}</p>
    },
    {
      titleKey: 'dashboards.common.generalInfoTitle',
      descriptionKey: 'dashboards.common.generalInfoDesc',
      icon: Info,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
      hoverBgColor: 'hover:bg-sky-500/20'
    },
    {
      titleKey: 'dashboards.common.settingsTitle',
      descriptionKey: 'dashboards.common.settingsDesc',
      icon: Settings,
      link: '#', // Placeholder link
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      hoverBgColor: 'hover:bg-purple-500/20'
    }
  ];

  return (
    <motion.div 
      className="p-4 sm:p-6 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <WelcomeUser userName={displayName} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {genericFeatures.map((feature, index) => (
          <motion.div
            key={feature.titleKey + index}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
            className={feature.colSpan || "sm:col-span-1"}
          >
            <DashboardCard 
              title={t(feature.titleKey)}
              description={t(feature.descriptionKey)}
              icon={feature.icon}
              link={feature.link === '#' ? undefined : feature.link}
              color={feature.color}
              bgColor={feature.bgColor}
              hoverBgColor={feature.hoverBgColor}
              colSpan="sm:col-span-full" // Ensure card itself takes full span if defined in feature
            >
              {feature.children ? feature.children : (
                feature.link && feature.link !== '#' && (
                  <div className="mt-auto pt-3 border-t border-slate-700/50">
                    <Link to={feature.link} className={`inline-flex items-center text-sm font-medium ${feature.color.replace('text-','text-')} group-hover:underline`}>
                      {t('common.accessNowButton')}
                      <ArrowRight size={16} className="ml-1.5 transform transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                )
              )}
            </DashboardCard>
          </motion.div>
        ))}
      </div>
      
      <ConvaiConnectCard userName={displayName} />
    </motion.div>
  );
};

export default GenericDashboard;