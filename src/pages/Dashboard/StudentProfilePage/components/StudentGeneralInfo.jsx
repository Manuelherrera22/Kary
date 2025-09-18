import React from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Briefcase, ShieldCheck, AlertOctagon, BarChart, CalendarDays, Mail, Landmark, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const InfoItem = ({ icon: Icon, label, value, valueColorClass, children, fullWidth = false }) => (
  <div className={`flex flex-col justify-between space-y-2 p-4 bg-slate-700/40 rounded-xl border border-slate-600/50 hover:bg-slate-700/60 transition-colors duration-200 shadow-md ${fullWidth ? 'md:col-span-2 lg:col-span-3' : ''}`}>
    <div className="flex items-center space-x-3">
      <Icon size={24} className="text-sky-400 flex-shrink-0" />
      <p className="text-sm font-medium text-slate-400">{label}</p>
    </div>
    {value && <p className={`text-lg font-semibold ${valueColorClass || 'text-slate-100'} truncate`}>{value}</p>}
    {children && <div className="mt-1">{children}</div>}
  </div>
);

const RiskBadge = ({ riskLevel, t }) => {
  let riskKey = 'studentProfilePage.generalInfo.riskNotAssessed';
  let variant = 'outline';
  let className = 'bg-slate-600 text-slate-300 border-slate-500';

  if (riskLevel) {
    const lowerRisk = riskLevel.toLowerCase();
    if (lowerRisk === 'bajo' || lowerRisk === 'low') {
      riskKey = 'studentProfilePage.generalInfo.riskLow';
      className = 'bg-green-700/30 text-green-300 border-green-500/60';
    } else if (lowerRisk === 'medio' || lowerRisk === 'medium') {
      riskKey = 'studentProfilePage.generalInfo.riskMedium';
      className = 'bg-yellow-600/30 text-yellow-300 border-yellow-500/60';
    } else if (lowerRisk === 'alto' || lowerRisk === 'high') {
      riskKey = 'studentProfilePage.generalInfo.riskHigh';
      className = 'bg-red-700/30 text-red-300 border-red-500/60';
    } else if (lowerRisk !== t('studentProfilePage.generalInfo.riskNotAssessed').toLowerCase()) {
       riskKey = riskLevel; 
       className = 'bg-sky-700/30 text-sky-300 border-sky-500/60';
    }
  }
  
  return <Badge variant={variant} className={`px-3 py-1 text-sm font-semibold ${className}`}>{t(riskKey, riskLevel)}</Badge>;
};

const StudentGeneralInfo = ({ studentData, currentUserRole }) => {
  const { t, language } = useLanguage();

  const formatDate = (dateString) => {
    if (!dateString) return t('common.notAvailable');
    try {
      return format(new Date(dateString), 'PPP', { locale: language === 'es' ? es : undefined });
    } catch {
      return dateString; 
    }
  };

  const isParent = currentUserRole === 'parent';

  const getPiarStatusText = (status) => {
    if (!status || typeof status !== 'string') return t('studentProfilePage.generalInfo.piarInactive');
    const statusKey = `studentProfilePage.generalInfo.piar${status.charAt(0).toUpperCase() + status.slice(1)}`;
    return t(statusKey, status); 
  };
  
  const piarStatusDisplay = getPiarStatusText(studentData.piar_status);
  const piarStatusColorClass = studentData.piar_status === 'Activo' || studentData.piar_status === 'Active' ? 'text-green-400' : 'text-slate-300';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-slate-800/70 border-slate-700/80 shadow-2xl backdrop-blur-lg">
        <CardHeader className="border-b border-slate-700/60 pb-5">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-tr from-sky-500 to-purple-600 rounded-lg shadow-lg">
              <UserCircle size={36} className="text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-300 to-purple-400">
                {t('studentProfilePage.generalInfo.title')}
              </CardTitle>
              <CardDescription className="text-slate-400 mt-1">{t('studentProfilePage.generalInfo.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <InfoItem icon={UserCircle} label={t('studentProfilePage.generalInfo.fullName')} value={studentData.full_name} />
            <InfoItem icon={Mail} label={t('studentProfilePage.generalInfo.email')} value={studentData.email} />
            <InfoItem icon={Briefcase} label={t('studentProfilePage.generalInfo.grade')} value={studentData.grade || t('common.notAssigned')} />
            <InfoItem icon={Landmark} label={t('studentProfilePage.generalInfo.institution')} value={studentData.institution_name || t('studentProfilePage.generalInfo.noInstitution')} />
            <InfoItem icon={CalendarDays} label={t('studentProfilePage.generalInfo.admissionDate')} value={formatDate(studentData.admission_date)} />
            
            {!isParent && (
              <>
                <InfoItem 
                  icon={ShieldCheck} 
                  label={t('studentProfilePage.generalInfo.piarStatus')} 
                  value={piarStatusDisplay}
                  valueColorClass={piarStatusColorClass}
                />
                <InfoItem icon={AlertOctagon} label={t('studentProfilePage.generalInfo.academicRisk')}>
                  <RiskBadge riskLevel={studentData.academic_risk} t={t} />
                </InfoItem>
                <InfoItem icon={BarChart} label={t('studentProfilePage.generalInfo.emotionalRisk')}>
                  <RiskBadge riskLevel={studentData.emotional_risk} t={t} />
                </InfoItem>
              </>
            )}
          </div>

          {isParent && (
             <div className="mt-6 md:col-span-2 lg:col-span-3">
                <InfoItem icon={Info} label={t('studentProfilePage.generalInfo.simplifiedRiskForParent')} fullWidth={true}>
                    <p className="text-sm text-slate-300">{t('studentProfilePage.generalInfo.simplifiedRiskContent')}</p>
                </InfoItem>
             </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentGeneralInfo;