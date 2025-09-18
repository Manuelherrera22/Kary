import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ConfirmForceCompleteModal = ({ isOpen, onOpenChange, planToComplete, onConfirm, isSubmitting }) => {
  const { t } = useLanguage();

  const planName = planToComplete?.support_goal || t('supportPlans.thisPlan');
  const studentName = planToComplete?.student?.full_name || planToComplete?.student_name || t('common.theStudent');


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-white shadow-2xl rounded-xl">
        <DialogHeader className="p-6 border-b border-slate-700/60">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">
            <AlertTriangle size={26} className="text-emerald-400" />
            {t('supportPlans.confirmForceCompleteTitle')}
          </DialogTitle>
          <DialogDescription className="text-slate-400 mt-2">
            {t('supportPlans.confirmForceCompleteMessage', { planName: <strong className="text-emerald-300">{planName}</strong>, studentName: <strong className="text-sky-300">{studentName}</strong> })}
            <br />
            {t('supportPlans.confirmForceCompleteWarning')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="p-6 flex flex-col sm:flex-row gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="w-full sm:w-auto border-slate-600 hover:bg-slate-700 transition-colors"
            disabled={isSubmitting}
          >
            <XCircle size={18} className="mr-2" />
            {t('common.cancelButton')}
          </Button>
          <Button 
            type="button" 
            onClick={onConfirm} 
            disabled={isSubmitting} 
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-emerald-500/50 transition-all transform hover:scale-105"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <CheckCircle size={18} className="mr-2" />
            )}
            {isSubmitting ? t('common.completingButton') :t('supportPlans.forceCompleteButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmForceCompleteModal;