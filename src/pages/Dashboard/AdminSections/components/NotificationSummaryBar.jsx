import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from "@/components/ui/card";
import { ListChecks, CheckCircle, AlertCircle, Clock4 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <Card className={`bg-slate-800/70 border-slate-700/80 shadow-lg ${colorClass}`}>
    <CardContent className="p-4 flex items-center space-x-3">
      <div className={`p-2 rounded-full bg-black/20`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const NotificationSummaryBar = ({ stats }) => {
  const { t } = useLanguage();

  const percentageRead = stats.total > 0 ? ((stats.read / stats.total) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title={t('notificationAuditPage.summaryTotal')} 
        value={stats.total} 
        icon={ListChecks}
        colorClass="text-sky-400"
      />
      <StatCard 
        title={t('notificationAuditPage.summaryRead')} 
        value={`${stats.read} (${percentageRead}%)`}
        icon={CheckCircle}
        colorClass="text-green-400"
      />
      <StatCard 
        title={t('notificationAuditPage.summaryUnread')} 
        value={stats.unread} 
        icon={AlertCircle}
        colorClass="text-red-400"
      />
      <StatCard 
        title={t('notificationAuditPage.summaryAvgReadTime')} 
        value={stats.avgReadTime || t('common.notAvailableShort')} 
        icon={Clock4}
        colorClass="text-yellow-400"
      />
    </div>
  );
};

export default NotificationSummaryBar;