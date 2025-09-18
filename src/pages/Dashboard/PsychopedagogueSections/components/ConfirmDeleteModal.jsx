import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ConfirmDeleteModal = ({ 
  isOpen, 
  onOpenChange, 
  itemToDelete, 
  onDelete, 
  isSubmitting, 
  itemName,
  confirmationMessageKey = "dashboards.directive.confirmActionDesc"
}) => {
  const { t } = useLanguage();
  
  const handleDelete = () => {
    if (itemToDelete && itemToDelete.id) {
      onDelete(itemToDelete.id);
    } else if (itemToDelete) { 
      onDelete(itemToDelete);
    }
  };
  
  const effectiveItemName = itemName || itemToDelete?.name || itemToDelete?.student_name || t('common.thisItem', 'este ítem');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mx-auto h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
          </div>
          <DialogTitle className="text-center text-2xl font-semibold">
            {t('common.confirmButton')} {t('common.deleteButton')}
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-center mt-2">
            {t(confirmationMessageKey, { action: t('common.deleteButton').toLowerCase(), item: effectiveItemName })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center gap-3 pt-6">
          <DialogClose asChild>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="w-full sm:w-auto text-slate-300 border-slate-600 hover:bg-slate-700"
              disabled={isSubmitting}
            >
              {t('common.cancelButton')}
            </Button>
          </DialogClose>
          <Button 
            type="button" 
            onClick={handleDelete} 
            disabled={isSubmitting} 
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('common.deleteButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteModal;