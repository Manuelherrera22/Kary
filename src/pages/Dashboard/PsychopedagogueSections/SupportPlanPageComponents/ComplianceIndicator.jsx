import React from 'react';
import { Loader2, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { format, parseISO } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

const ComplianceIndicator = ({ studentId, complianceData, loadingCompliance }) => {
  const { t, language: currentLanguage } = useLanguage();
  const dateLocale = currentLanguage === 'es' ? es : enUS;

  const formatDateSafely = (dateString) => {
    if (!dateString) return t('common.notAvailableShort');
    try {
      return format(parseISO(dateString), 'P', { locale: dateLocale });
    } catch (e) {
      console.warn(`Invalid date for ComplianceIndicator: ${dateString}`, e);
      return t('common.invalidDate');
    }
  };
  
  if (!studentId || studentId === 'all_students') {
    return <span className="text-xs text-slate-500 flex items-center"><HelpCircle size={14} className="mr-1" />{t('common.notAvailableShort')}</span>;
  }
  
  const isLoadingForStudent = loadingCompliance && typeof loadingCompliance === 'object' && loadingCompliance[studentId];
  const studentComplianceData = complianceData && typeof complianceData === 'object' ? complianceData[studentId] : null;

  if (isLoadingForStudent) {
    return <Loader2 className="h-4 w-4 animate-spin text-slate-400" />;
  }
  
  if (!studentComplianceData || studentComplianceData.status === null || typeof studentComplianceData.status === 'undefined') {
    return <span className="text-xs text-slate-500 flex items-center"><HelpCircle size={14} className="mr-1" />{t('supportPlans.complianceNotAvailable')}</span>;
  }
  
  return (
    <span className={`flex items-center text-xs font-medium ${studentComplianceData.status ? 'text-emerald-400' : 'text-amber-400'}`}>
      {studentComplianceData.status ? <CheckCircle size={14} className="mr-1.5 flex-shrink-0" /> : <XCircle size={14} className="mr-1.5 flex-shrink-0" />}
      {studentComplianceData.status ? t('supportPlans.compliant') : t('supportPlans.notCompliant')}
      {studentComplianceData.date && (
        <span className="text-slate-400 ml-1.5 font-normal">
          ({t('supportPlans.lastReview')}: {formatDateSafely(studentComplianceData.date)})
        </span>
      )}
    </span>
  );
};

export default ComplianceIndicator;