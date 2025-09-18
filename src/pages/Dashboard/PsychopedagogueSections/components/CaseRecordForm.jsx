import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';

const initialFormData = {
  student_name: '',
  case_summary: '',
  emotional_trend: '',
  support_plan: '',
  last_access: '',
  progress_summary: '',
};

const CaseRecordForm = ({ initialData, onSubmit, onCancel, isSubmitting, t }) => {
  const [formData, setFormData] = useState(initialData || initialFormData);

  useEffect(() => {
    setFormData(initialData || initialFormData);
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmitForm} className="space-y-4 py-4">
      <div>
        <Label htmlFor="student_name" className="text-slate-300">{t('dashboards.psychopedagogue.studentName')}</Label>
        <Input id="student_name" name="student_name" value={formData.student_name} onChange={handleInputChange} required className="bg-slate-700 border-slate-600 text-white" />
      </div>
      <div>
        <Label htmlFor="case_summary" className="text-slate-300">{t('dashboards.psychopedagogue.caseSummary')}</Label>
        <Textarea id="case_summary" name="case_summary" value={formData.case_summary} onChange={handleInputChange} className="bg-slate-700 border-slate-600 text-white" />
      </div>
      <div>
        <Label htmlFor="emotional_trend" className="text-slate-300">{t('dashboards.psychopedagogue.emotionalTrend')}</Label>
        <Input id="emotional_trend" name="emotional_trend" value={formData.emotional_trend} onChange={handleInputChange} className="bg-slate-700 border-slate-600 text-white" />
      </div>
      <div>
        <Label htmlFor="support_plan" className="text-slate-300">{t('dashboards.psychopedagogue.supportPlanShort')}</Label>
        <Textarea id="support_plan" name="support_plan" value={formData.support_plan} onChange={handleInputChange} className="bg-slate-700 border-slate-600 text-white" />
      </div>
      <div>
        <Label htmlFor="last_access" className="text-slate-300">{t('dashboards.psychopedagogue.lastAccess')}</Label>
        <Input id="last_access" name="last_access" type="date" value={formData.last_access} onChange={handleInputChange} className="bg-slate-700 border-slate-600 text-white" />
      </div>
      <div>
        <Label htmlFor="progress_summary" className="text-slate-300">{t('dashboards.psychopedagogue.progressSummary')}</Label>
        <Textarea id="progress_summary" name="progress_summary" value={formData.progress_summary} onChange={handleInputChange} className="bg-slate-700 border-slate-600 text-white" />
      </div>
      <DialogFooter className="sm:justify-end gap-2 pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel} className="text-slate-300 border-slate-600 hover:bg-slate-700">
            {t('common.cancelButton')}
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSubmitting} className="bg-sky-500 hover:bg-sky-600">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? t('common.saveChangesButton') : t('common.createButton')}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CaseRecordForm;