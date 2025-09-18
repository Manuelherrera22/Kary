import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Send, Info, Brain } from 'lucide-react';
import StudentSearchSelect from './StudentSearchSelect';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

const PlanGeneratorForm = ({ onSubmit, preselectedStudentId, initialObservations, localInitialContext, isLoading, onStudentSelected }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [students, setStudents] = useState([]);
  const [isFetchingStudents, setIsFetchingStudents] = useState(false);

  const schema = z.object({
    studentId: z.string().min(1, { message: t('common.requiredField') }),
    planType: z.string().min(1, { message: t('common.requiredField') }),
    keyObservations: z.string().min(1, { message: t('supportPlans.aiCanvas.keyObservationsRequiredError') }), 
    contextForAI: z.string().min(1, { message: t('supportPlans.aiCanvas.contextRequiredError') }),
    focusArea: z.string().optional(), 
    specificNeeds: z.string().optional(),
  });

  const { control, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { 
      studentId: preselectedStudentId || '', 
      planType: 'emotional', 
      keyObservations: '',
      contextForAI: initialObservations || '', 
      focusArea: '',
      specificNeeds: '' 
    },
  });

  useEffect(() => {
    const fetchStudents = async () => {
      setIsFetchingStudents(true);
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, full_name')
          .eq('role', 'student')
          .order('full_name', { ascending: true });
        if (error) throw error;
        setStudents(data || []);
      } catch (error) {
        console.error("Error fetching students for PlanGeneratorForm:", error);
        toast({ title: t('toast.errorTitle'), description: t('supportPlans.errorFetchingStudents'), variant: 'destructive' });
      } finally {
        setIsFetchingStudents(false);
      }
    };

    if (!preselectedStudentId) {
      fetchStudents();
    } else {
      const fetchPreselectedStudent = async () => {
        setIsFetchingStudents(true);
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('id, full_name')
            .eq('id', preselectedStudentId)
            .single();
          if (error) throw error;
          if (data) {
            setStudents([data]); 
            if (onStudentSelected) onStudentSelected(data);
          }
        } catch (error) {
          console.error("Error fetching preselected student:", error);
        } finally {
          setIsFetchingStudents(false);
        }
      };
      fetchPreselectedStudent();
    }
  }, [preselectedStudentId, toast, t, onStudentSelected]);


  useEffect(() => {
    reset({ 
      studentId: preselectedStudentId || '', 
      planType: 'emotional', 
      keyObservations: '',
      contextForAI: initialObservations || '',
      focusArea: '',
      specificNeeds: ''
    });
  }, [preselectedStudentId, initialObservations, reset]);

  const handleFormSubmit = (data) => {
    const selectedStudent = (students || []).find(s => s.id === data.studentId);
    if (onStudentSelected && selectedStudent) {
      onStudentSelected(selectedStudent);
    }
    onSubmit(data);
  };
  
  const planTypes = [
    { value: 'emotional', label: t('supportPlans.aiCanvas.planTypeEmotional') },
    { value: 'academic', label: t('supportPlans.aiCanvas.planTypeAcademic') },
  ];
  
  const studentIdValue = watch('studentId');

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-200">{t('supportPlans.aiCanvas.step1TitleForm')}</h3>
      
      <div>
        <Label htmlFor="studentId" className="text-slate-300">{t('supportPlans.aiCanvas.studentLabel')}</Label>
        <Controller
          name="studentId"
          control={control}
          render={({ field }) => (
            preselectedStudentId ? (
                <div className="p-3 bg-slate-800 rounded-md border border-slate-700 text-slate-300">
                    {(students || []).find(s => s.id === preselectedStudentId)?.full_name || preselectedStudentId}
                </div>
            ) : (
                <StudentSearchSelect 
                  students={students || []} 
                  value={field.value} 
                  onChange={(value) => {
                    field.onChange(value);
                    const selected = (students || []).find(s => s.id === value);
                    if (onStudentSelected && selected) {
                      onStudentSelected(selected);
                    }
                  }} 
                  isLoading={isFetchingStudents}
                />
            )
          )}
        />
        {errors.studentId && <p className="text-red-400 text-sm mt-1">{errors.studentId.message}</p>}
      </div>

      <div>
        <Label htmlFor="planType" className="text-slate-300">{t('supportPlans.aiCanvas.planTypeLabel')}</Label>
        <Controller
          name="planType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="planType" className="bg-slate-800 border-slate-700 text-slate-100">
                <SelectValue placeholder={t('supportPlans.aiCanvas.selectPlanTypePlaceholder')} />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                {planTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.planType && <p className="text-red-400 text-sm mt-1">{errors.planType.message}</p>}
      </div>
      
      <div className="p-4 bg-slate-800/70 border border-slate-700 rounded-lg">
        <Label htmlFor="contextForAI" className="text-sky-400 font-semibold flex items-center">
          <Brain size={18} className="mr-2" />
          {t('supportPlans.aiCanvas.contextForAILabelMandatory')}
        </Label>
        <p className="text-xs text-slate-400 mb-2">{t('supportPlans.aiCanvas.contextForAIDescription')}</p>
        <Controller
          name="contextForAI"
          control={control}
          render={({ field }) => (
            <Textarea
              id="contextForAI"
              placeholder={t('supportPlans.aiCanvas.contextForAIPlaceholder')}
              className="min-h-[150px] bg-slate-900 border-slate-600 text-slate-100"
              {...field}
              value={initialObservations || field.value} 
              readOnly={!!initialObservations && localInitialContext === initialObservations} 
            />
          )}
        />
        {errors.contextForAI && <p className="text-red-400 text-sm mt-1">{errors.contextForAI.message}</p>}
      </div>

      <div className="p-4 bg-slate-800/70 border border-slate-700 rounded-lg">
        <Label htmlFor="keyObservations" className="text-amber-400 font-semibold flex items-center">
           <Info size={18} className="mr-2" />
          {t('supportPlans.aiCanvas.keyObservationsLabelMandatory')}
        </Label>
         <p className="text-xs text-slate-400 mb-2">{t('supportPlans.aiCanvas.keyObservationsDescription')}</p>
        <Controller
          name="keyObservations"
          control={control}
          render={({ field }) => (
            <Textarea
              id="keyObservations"
              placeholder={t('supportPlans.aiCanvas.keyObservationsPlaceholder')}
              className="min-h-[100px] bg-slate-900 border-slate-600 text-slate-100"
              {...field}
            />
          )}
        />
        {errors.keyObservations && <p className="text-red-400 text-sm mt-1">{errors.keyObservations.message}</p>}
      </div>


      <div>
        <Label htmlFor="focusArea" className="text-slate-300">{t('supportPlans.aiCanvas.focusAreaLabel')}</Label>
        <Controller
          name="focusArea"
          control={control}
          render={({ field }) => (
            <Textarea
              id="focusArea"
              placeholder={t('supportPlans.aiCanvas.focusAreaPlaceholder')}
              className="min-h-[80px] bg-slate-800 border-slate-700 text-slate-100"
              {...field}
            />
          )}
        />
        {errors.focusArea && <p className="text-red-400 text-sm mt-1">{errors.focusArea.message}</p>}
      </div>

      <div>
        <Label htmlFor="specificNeeds" className="text-slate-300">{t('supportPlans.aiCanvas.specificNeedsLabel')}</Label>
        <Controller
          name="specificNeeds"
          control={control}
          render={({ field }) => (
            <Textarea
              id="specificNeeds"
              placeholder={t('supportPlans.aiCanvas.specificNeedsPlaceholder')}
              className="min-h-[80px] bg-slate-800 border-slate-700 text-slate-100"
              {...field}
            />
          )}
        />
        {errors.specificNeeds && <p className="text-red-400 text-sm mt-1">{errors.specificNeeds.message}</p>}
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading || isFetchingStudents} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-base font-semibold shadow-lg hover:shadow-purple-500/40 transition-all transform hover:scale-105">
          {isLoading || isFetchingStudents ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
          {t('supportPlans.aiCanvas.generateButton')}
        </Button>
      </div>
    </form>
  );
};

export default PlanGeneratorForm;