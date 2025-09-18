import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';

export default function RegisterStudentModal({ open, onClose, onStudentCreated }) {
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setGrade('');
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !email || !grade) {
      toast({ 
        title: t('toast.errorTitle'), 
        description: t('registerStudentModal.errorAllFieldsRequired'), 
        variant: 'destructive' 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('user_profiles').insert({
        full_name: fullName,
        email,
        grade,
        role: 'student',
        status: 'active', 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({ 
        title: t('toast.successTitle'),
        description: t('registerStudentModal.studentCreatedSuccess'),
        className: "bg-green-500 text-white dark:bg-green-600",
      });
      resetForm();
      onClose();
      if (onStudentCreated) {
        onStudentCreated();
      }
    } catch (error) {
      console.error("Error creating student:", error);
      toast({ 
        title: t('toast.errorTitle'), 
        description: `${t('registerStudentModal.errorCreatingStudent')}: ${error.message}`, 
        variant: 'destructive' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-sky-400">{t('registerStudentModal.title')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="register-fullName" className="text-slate-300">{t('registerStudentModal.fullNameLabel')}</Label>
            <Input 
              id="register-fullName" 
              name="full_name"
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              placeholder={t('registerStudentModal.fullNamePlaceholder')}
              className="bg-slate-700 border-slate-600 text-white focus:ring-sky-500"
            />
          </div>
          <div>
            <Label htmlFor="register-email" className="text-slate-300">{t('registerStudentModal.emailLabel')}</Label>
            <Input 
              id="register-email" 
              name="email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder={t('registerStudentModal.emailPlaceholder')}
              className="bg-slate-700 border-slate-600 text-white focus:ring-sky-500"
            />
          </div>
          <div>
            <Label htmlFor="register-grade" className="text-slate-300">{t('registerStudentModal.gradeLabel')}</Label>
            <Input 
              id="register-grade" 
              name="grade"
              value={grade} 
              onChange={(e) => setGrade(e.target.value)} 
              placeholder={t('registerStudentModal.gradePlaceholder')}
              className="bg-slate-700 border-slate-600 text-white focus:ring-sky-500"
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting} className="text-slate-300 border-slate-600 hover:bg-slate-700 disabled:opacity-50">
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-sky-500 hover:bg-sky-600 disabled:opacity-50">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? t('registerStudentModal.submittingButton') : t('registerStudentModal.submitButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}