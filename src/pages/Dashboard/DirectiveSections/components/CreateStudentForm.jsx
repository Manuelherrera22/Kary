import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createOrUpdateStudent, linkParentToStudent, unlinkParentFromStudent } from '@/pages/Dashboard/DirectiveSections/utils/studentFormUtils';

const CreateStudentForm = ({ onStudentCreated, onStudentUpdated, existingStudentData, setIsOpen }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      grade: '',
      status: 'active',
      admissionDate: new Date().toISOString().split('T')[0],
      parentId: 'none', 
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [parents, setParents] = useState([]);

  useEffect(() => {
    const fetchParents = async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name')
        .eq('role', 'parent')
        .eq('status', 'active'); 
      if (error) {
        console.error('Error fetching parents:', error);
        toast({ title: t('toast.errorTitle'), description: t('dashboards.directive.userManagement.fetchParentsError'), variant: 'destructive' });
      } else {
        setParents(data || []);
      }
    };
    fetchParents();

    if (existingStudentData) {
      setValue('fullName', existingStudentData.full_name || '');
      setValue('email', existingStudentData.email || '');
      setValue('grade', existingStudentData.grade || '');
      setValue('status', existingStudentData.status || 'active');
      setValue('admissionDate', existingStudentData.admission_date ? new Date(existingStudentData.admission_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
      
      if (existingStudentData.id) {
        const fetchParentLink = async () => {
          const { data: linkData, error: linkError } = await supabase
            .from('parent_child_mapping')
            .select('parent_user_id')
            .eq('child_user_id', existingStudentData.id)
            .single();
          if (linkData) {
            setValue('parentId', linkData.parent_user_id);
          } else {
            setValue('parentId', 'none');
            if (linkError && linkError.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine
              console.error('Error fetching parent link:', linkError);
            }
          }
        };
        fetchParentLink();
      } else {
        setValue('parentId', 'none');
      }
    } else {
      reset({
        fullName: '',
        email: '',
        grade: '',
        status: 'active',
        admissionDate: new Date().toISOString().split('T')[0],
        parentId: 'none',
      });
    }

  }, [existingStudentData, setValue, toast, t, reset]);

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const studentUserId = await createOrUpdateStudent(formData, existingStudentData);

      if (formData.parentId && formData.parentId !== 'none' && studentUserId) {
        await linkParentToStudent(formData.parentId, studentUserId);
      } else if (studentUserId) { 
        await unlinkParentFromStudent(studentUserId);
      }

      toast({
        title: t('toast.successTitle'),
        description: existingStudentData ? t('dashboards.directive.userManagement.studentUpdatedSuccess') : t('dashboards.directive.userManagement.studentCreatedSuccess'),
        className: "bg-green-500 text-white dark:bg-green-700"
      });
      
      if (existingStudentData) {
        onStudentUpdated();
      } else {
        onStudentCreated();
      }
      setIsOpen(false);
      reset();

    } catch (error) {
      console.error('Error processing student:', error);
      toast({
        title: t('toast.errorTitle'),
        description: error.message || (existingStudentData ? t('dashboards.directive.userManagement.studentUpdateError') : t('dashboards.directive.userManagement.studentCreateError')),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentParentId = watch('parentId');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <div>
        <Label htmlFor="fullName">{t('dashboards.directive.userManagement.form.fullName')}</Label>
        <Input id="fullName" {...register('fullName', { required: t('common.requiredField') })} className="bg-slate-700 border-slate-600"/>
        {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>}
      </div>

      <div>
        <Label htmlFor="email">{t('dashboards.directive.userManagement.form.email')} ({t('common.optional')})</Label>
        <Input id="email" type="email" {...register('email')} className="bg-slate-700 border-slate-600"/>
        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
      </div>
      
      {!existingStudentData && !watch('email') && (
        <div>
          <Label htmlFor="password">{t('dashboards.directive.userManagement.form.password')} ({t('common.optional')})</Label>
          <Input id="password" type="password" {...register('password')} className="bg-slate-700 border-slate-600" placeholder={t('dashboards.directive.userManagement.form.passwordPlaceholderOptional')}/>
           <p className="text-xs text-slate-400 mt-1">{t('dashboards.directive.userManagement.form.passwordHelpNoEmail')}</p>
        </div>
      )}
      
      {!existingStudentData && watch('email') && (
         <div>
          <Label htmlFor="password">{t('dashboards.directive.userManagement.form.password')} ({t('common.optional')})</Label>
          <Input id="password" type="password" {...register('password')} className="bg-slate-700 border-slate-600" placeholder={t('dashboards.directive.userManagement.form.passwordPlaceholder')}/>
          <p className="text-xs text-slate-400 mt-1">{t('dashboards.directive.userManagement.form.passwordHelp')}</p>
        </div>
      )}


      <div>
        <Label htmlFor="grade">{t('dashboards.directive.userManagement.form.grade')}</Label>
        <Input id="grade" {...register('grade', { required: t('common.requiredField') })} className="bg-slate-700 border-slate-600"/>
        {errors.grade && <p className="text-red-400 text-sm mt-1">{errors.grade.message}</p>}
      </div>

      <div>
        <Label htmlFor="status">{t('dashboards.directive.userManagement.form.status')}</Label>
        <Select onValueChange={(value) => setValue('status', value)} defaultValue={watch('status')}>
          <SelectTrigger className="w-full bg-slate-700 border-slate-600">
            <SelectValue placeholder={t('dashboards.directive.userManagement.form.selectStatus')} />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            <SelectItem value="active">{t('common.statusActive')}</SelectItem>
            <SelectItem value="suspended">{t('common.statusSuspended')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="admissionDate">{t('dashboards.directive.userManagement.form.admissionDate')}</Label>
        <Input id="admissionDate" type="date" {...register('admissionDate', { required: t('common.requiredField') })} className="bg-slate-700 border-slate-600"/>
        {errors.admissionDate && <p className="text-red-400 text-sm mt-1">{errors.admissionDate.message}</p>}
      </div>

      <div>
        <Label htmlFor="parentId">{t('dashboards.directive.userManagement.form.assignParent')}</Label>
        <Select onValueChange={(value) => setValue('parentId', value)} value={currentParentId || 'none'}>
          <SelectTrigger className="w-full bg-slate-700 border-slate-600">
            <SelectValue placeholder={t('dashboards.directive.userManagement.form.selectParent')} />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            <SelectItem value="none">{t('dashboards.directive.userManagement.form.noParentAssigned')}</SelectItem>
            {parents.map(parent => (
              <SelectItem key={parent.id} value={parent.id}>{parent.full_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={() => { setIsOpen(false); reset(); }} className="border-slate-600 hover:bg-slate-700">
          {t('common.cancelButton')}
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-orange-500 hover:bg-orange-600">
          {isLoading ? t('common.loadingText') : (existingStudentData ? t('common.saveChangesButton') : t('dashboards.directive.userManagement.form.createButton'))}
        </Button>
      </div>
    </form>
  );
};

export default CreateStudentForm;