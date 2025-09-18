import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CaseRecordForm from './CaseRecordForm';

const initialFormData = {
  student_name: '',
  case_summary: '',
  emotional_trend: '',
  support_plan: '',
  last_access: '',
  progress_summary: '',
};

const CaseRecordModal = ({ isOpen, onOpenChange, editingItem, onSubmit, isSubmitting, t }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>{editingItem ? t('common.editButton') : t('common.createNewButton')} {t('dashboards.psychopedagogue.caseRecord')}</DialogTitle>
          <DialogDescription className="text-slate-400">
            {editingItem ? t('dashboards.psychopedagogue.editCaseRecordDesc') : t('dashboards.psychopedagogue.createCaseRecordDesc')}
          </DialogDescription>
        </DialogHeader>
        <CaseRecordForm 
          initialData={editingItem ? {
            student_name: editingItem.student_name || '',
            case_summary: editingItem.case_summary || '',
            emotional_trend: editingItem.emotional_trend || '',
            support_plan: editingItem.support_plan || '',
            last_access: editingItem.last_access || '',
            progress_summary: editingItem.progress_summary || '',
          } : initialFormData}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          t={t}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CaseRecordModal;