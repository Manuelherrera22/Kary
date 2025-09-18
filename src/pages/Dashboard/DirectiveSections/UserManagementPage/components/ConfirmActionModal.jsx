import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLanguage } from '@/contexts/LanguageContext';

const ConfirmActionModal = ({ isOpen, onOpenChange, onConfirm, userName, actionName }) => {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>{t('directive.userManagement.confirmActionTitle')}</DialogTitle>
          <DialogDescription>
            {t('directive.userManagement.confirmActionDesc', { action: actionName, userName: userName })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-600 hover:bg-slate-700">
            {t('common.cancelButton')}
          </Button>
          <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            {t('common.confirmButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmActionModal;