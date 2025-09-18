import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const RiskAlertCard = ({ alert }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const getRiskLevelBadge = (level) => {
    level = level ? level.toLowerCase() : 'unknown';
    switch (level) {
      case 'alto': case 'high': return 'destructive';
      case 'medio': case 'medium': return 'warning';
      case 'bajo': case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const handleViewStudent = (studentId) => {
    if (studentId) {
      navigate(`/dashboard/student/${studentId}/profile`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-slate-700/40 border border-red-500/30 rounded-lg shadow-md hover:shadow-red-500/20 transition-shadow"
    >
      <div className="flex items-start space-x-3">
        <AlertTriangle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-semibold text-red-300">
              {alert.student_name || t('psychopedagogueDashboard.riskAlerts.unknownStudent')}
            </h4>
            {alert.risk_level && (
              <Badge variant={getRiskLevelBadge(alert.risk_level)} className="text-xs">
                {t(`psychopedagogueDashboard.riskAlerts.levels.${alert.risk_level.toLowerCase()}`, alert.risk_level)}
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-300 mb-2">{alert.description || alert.message || JSON.stringify(alert.details) || t('psychopedagogueDashboard.riskAlerts.noDetails')}</p>
          {alert.student_id && (
            <Button size="sm" variant="link" onClick={() => handleViewStudent(alert.student_id)} className="text-red-300 hover:text-red-200 p-0 h-auto">
              {t('psychopedagogueDashboard.riskAlerts.viewStudentButton')} <ArrowRight size={14} className="ml-1" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};


const RiskAlertsSection = ({ alerts, loading, onRefresh }) => {
  const { t } = useLanguage();

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-700/40 rounded-lg animate-pulse"></div>
          ))}
        </div>
      );
    }
    if (!alerts || alerts.length === 0) {
      return <p className="text-slate-400 text-center py-4">{t('psychopedagogueDashboard.riskAlerts.noAlerts')}</p>;
    }
    return (
      <ul className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar pr-2">
        {alerts.map((alert, index) => (
          <li key={alert.id || index}>
            <RiskAlertCard alert={alert} />
          </li>
        ))}
      </ul>
    );
  };
  
  return (
    <motion.div
      className="mb-8 p-6 bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700/70"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-700/50">
        <h2 className="text-xl sm:text-2xl font-semibold text-red-400 flex items-center">
          <AlertTriangle size={26} className="mr-2.5" />
          {t('psychopedagogueDashboard.riskAlerts.title')}
        </h2>
        <Button variant="ghost" size="icon" onClick={onRefresh} disabled={loading} className="text-red-400 hover:text-red-200 hover:bg-red-500/20 rounded-full transition-colors">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw size={20} />}
        </Button>
      </div>
      {renderContent()}
    </motion.div>
  );
};

export default RiskAlertsSection;