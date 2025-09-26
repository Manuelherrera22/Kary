import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, FileText, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import jsPDF from 'jspdf';
import { format, parseISO } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

const DownloadablePlansModal = ({ isOpen, onOpenChange, plans, studentName }) => {
  const { t, language: currentLanguage } = useLanguage();
  const dateLocale = currentLanguage === 'es' ? es : enUS;

  const formatDate = (dateString) => {
    if (!dateString) return t('common.notSpecified');
    try {
      return format(parseISO(dateString), 'PP', { locale: dateLocale });
    } catch (e) {
      return dateString;
    }
  };

  const generatePdf = (plan) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(t('supportPlans.pdf.title', { studentName: plan.student?.full_name || studentName || t('common.student') }), 14, 22);
    
    doc.setFontSize(12);
    doc.text(t('supportPlans.pdf.goal', { goal: plan.support_goal || t('common.notSpecified') }), 14, 32);
    doc.text(t('supportPlans.pdf.strategy', { strategy: plan.support_strategy || t('common.notSpecified') }), 14, 42);
    doc.text(t('supportPlans.pdf.startDate', { date: formatDate(plan.start_date) }), 14, 52);
    doc.text(t('supportPlans.pdf.endDate', { date: formatDate(plan.end_date) }), 14, 62);
    doc.text(t('supportPlans.pdf.status', { status: t(`supportPlans.statusValues.${plan.status?.toLowerCase() || 'notAvailable'}`) }), 14, 72);
    doc.text(t('supportPlans.pdf.responsible', { name: plan.creator?.full_name || t('common.notSpecified') }), 14, 82);

    if (plan.plan_json && plan.plan_json.steps) {
      doc.addPage();
      doc.setFontSize(16);
      doc.text(t('supportPlans.pdf.planDetails'), 14, 22);
      let yPos = 32;
      plan.plan_json.steps.forEach((step, index) => {
        if (yPos > 270) { 
          doc.addPage();
          yPos = 22;
        }
        doc.setFontSize(12);
        doc.setTextColor(60, 100, 150); // Purple-ish color
        doc.text(`${step.title || t('supportPlans.pdf.unnamedStep')} (${step.key || 'custom'})`, 14, yPos);
        yPos += 7;
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50); 
        const splitContent = doc.splitTextToSize(step.content || t('common.noContent'), 180);
        doc.text(splitContent, 14, yPos);
        yPos += (splitContent.length * 4) + 5; 
      });
    }
    
    doc.save(`Plan_Apoyo_${plan.student?.full_name || studentName || 'Estudiante'}_${plan.id.substring(0,8)}.pdf`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white sm:max-w-2xl shadow-xl rounded-lg">
        <DialogHeader className="pb-4 border-b border-slate-700/70">
          <DialogTitle className="text-2xl font-semibold flex items-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400">
            <FileText size={24} className="mr-3" />
            {t('supportPlans.downloadModal.title', { studentName: studentName || t('common.student') })}
          </DialogTitle>
          <DialogDescription className="text-slate-400 pt-1">
            {t('supportPlans.downloadModal.description')}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] my-4 pr-2 custom-scrollbar">
          {plans && plans.length > 0 ? (
            <ul className="space-y-3">
              {plans.map((plan) => (
                <li key={plan.id} className="flex justify-between items-center p-4 bg-slate-700/50 rounded-lg border border-slate-600/80 hover:bg-slate-700/80 transition-colors">
                  <div>
                    <p className="font-medium text-slate-200">{plan.support_goal || t('supportPlans.unnamedPlan')}</p>
                    <p className="text-xs text-slate-400">{t('supportPlans.createdDate')}: {formatDate(plan.created_at)}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generatePdf(plan)}
                    className="text-purple-300 border-purple-500 hover:bg-purple-500/20 hover:text-purple-200 transition-colors group"
                  >
                    <Download size={16} className="mr-2 group-hover:animate-bounce-sm" />
                    {t('common.downloadButton')}
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-slate-400 py-8">{t('supportPlans.noPlansToDownload')}</p>
          )}
        </ScrollArea>

        <div className="flex justify-end pt-4 border-t border-slate-700/70">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-300 hover:bg-slate-700/80 hover:text-white">
            <X size={18} className="mr-2" />
            {t('common.closeButton')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadablePlansModal;