import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ConfirmActionModal = ({ 
  isOpen, 
  onOpenChange, 
  onConfirm, 
  title, 
  description, 
  confirmText, 
  cancelText,
  variant = 'default' // 'default', 'destructive'
}) => {
  const { t } = useLanguage();

  const confirmButtonClass = variant === 'destructive' 
    ? "bg-red-600 hover:bg-red-700 text-white" 
    : "bg-sky-600 hover:bg-sky-700 text-white";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center space-x-3">
          {variant === 'destructive' ? 
            <AlertTriangle className="h-6 w-6 text-red-400" /> : 
            <CheckCircle className="h-6 w-6 text-sky-400" />
          }
          <DialogTitle className="text-lg font-semibold text-slate-100">{title || t('common.areYouSure')}</DialogTitle>
        </DialogHeader>
        {description && (
          <DialogDescription className="py-4 text-sm text-slate-300">
            {description}
          </DialogDescription>
        )}
        <DialogFooter className="sm:justify-end space-x-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline" className="border-slate-600 hover:bg-slate-700 text-slate-300">
              {cancelText || t('common.cancelButton')}
            </Button>
          </DialogClose>
          <Button 
            onClick={() => {
              onConfirm();
              onOpenChange(false); // Close modal after confirm
            }} 
            className={confirmButtonClass}
          >
            {confirmText || t('common.confirmButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmActionModal;