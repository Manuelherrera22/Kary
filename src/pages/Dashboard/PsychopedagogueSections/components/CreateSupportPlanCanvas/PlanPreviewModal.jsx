import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, Edit3, Loader2, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const PlanPreviewModal = ({ isOpen, onOpenChange, planData, onAssign, onEdit, isLoading }) => {
  const { t } = useLanguage();

  if (!planData) return null;

  const { status, preview } = planData;

  const handleAssign = () => {
    if (onAssign) onAssign();
  };
  
  const handleEdit = () => {
    if (onEdit) onEdit();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-green-400 text-2xl">
            <CheckCircle className="mr-3" />
            {t('supportPlans.preview.title')}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {status || t('supportPlans.preview.subtitle')}
          </DialogDescription>
        </DialogHeader>

        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="my-4"
        >
            <h3 className="font-semibold text-lg mb-2 text-purple-300">{t('supportPlans.preview.diagnosisTitle')}</h3>
            <ScrollArea className="h-60 rounded-md border border-slate-700 bg-slate-900/50 p-4">
                 <p className="text-slate-300 whitespace-pre-wrap">{preview || t('common.noDataAvailable')}</p>
            </ScrollArea>
        </motion.div>
        
        <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleEdit} className="border-slate-600 hover:bg-slate-700">
                <Edit3 className="mr-2 h-4 w-4" />
                {t('supportPlans.preview.editButton')}
            </Button>
            <Button onClick={handleAssign} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                {t('supportPlans.preview.assignButton')}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlanPreviewModal;