import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { Loader2, PlusCircle, BookPlus } from 'lucide-react';
import ResourceForm from './ResourceForm';
import AssignmentSection from './AssignmentSection';
import useResourceAssignmentData from './useResourceAssignmentData';

const initialResourceFormData = {
  title: '',
  description: '',
  type: '',
  url: '',
  tags: '',
  published: true,
};

export default function CreateResourceModal({ open: externalOpen, onOpenChange: externalOnOpenChange, onResourceCreatedAndAssigned, children }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user: authUser } = useMockAuth();
  
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange !== undefined ? externalOnOpenChange : setInternalOpen;

  const [resourceFormData, setResourceFormData] = useState(initialResourceFormData);
  const [loading, setLoading] = useState(false);
  
  const [assignNow, setAssignNow] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [showStudentList, setShowStudentList] = useState(false);

  const { 
    estudiantes, 
    grades, 
    fetchingInitialData: fetchingAssignmentData, 
    fetchData: refetchAssignmentData 
  } = useResourceAssignmentData(open && assignNow);


  const resetForm = () => {
    setResourceFormData(initialResourceFormData);
    setAssignNow(false);
    setSelectedStudentIds([]);
    setSelectedGrades([]);
    setStudentSearchTerm('');
    setShowStudentList(false);
  };

  useEffect(() => {
    if (open && assignNow) {
      refetchAssignmentData();
    }
  }, [open, assignNow, refetchAssignmentData]);


  const handleOpenChangeInternal = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  const handleSubmit = async () => {
    if (!resourceFormData.title || !resourceFormData.type) {
      toast({
        title: t('toast.warningTitle'),
        description: t('createResourceModal.validationErrorRequiredFields'),
        variant: 'destructive',
      });
      return;
    }

    if (resourceFormData.url && !/^https?:\/\/.+/.test(resourceFormData.url)) {
      toast({
        title: t('toast.warningTitle'),
        description: t('createResourceModal.validationErrorInvalidUrl'),
        variant: 'destructive',
      });
      return;
    }

    if (assignNow && selectedStudentIds.length === 0 && selectedGrades.length === 0) {
      toast({
        title: t('toast.warningTitle'),
        description: t('createResourceModal.validationErrorNoStudentsOrGradesSelected'),
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    if (!authUser || !authUser.id) {
      toast({
        title: t('toast.errorTitle'),
        description: t('createResourceModal.authErrorUserNotLoaded'),
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    const dbResourceData = {
      ...resourceFormData,
      url: resourceFormData.url || null, 
      tags: resourceFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      created_by: authUser.id, 
    };

    const { data: newResource, error: resourceError } = await supabase
      .from('learning_resources')
      .insert([dbResourceData])
      .select()
      .single();

    if (resourceError) {
      console.error('Error creating learning resource:', resourceError);
      toast({
        title: t('toast.errorTitle'),
        description: t('createResourceModal.createError') + (resourceError.message ? `: ${resourceError.message}` : ''),
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    toast({
      title: t('toast.successTitle'),
      description: t('createResourceModal.createSuccess'),
    });

    let assignedStudentCount = 0;
    if (assignNow && newResource) {
      let studentIdsToAssign = [...selectedStudentIds];

      if (selectedGrades.length > 0) {
        const { data: studentsInGrades, error: gradeStudentsError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('role', 'student')
          .in('grade', selectedGrades);

        if (gradeStudentsError) {
          toast({
            title: t('toast.errorTitle'),
            description: t('createResourceModal.fetchStudentsInGradeError'),
            variant: 'destructive',
          });
        } else if (studentsInGrades) {
          studentIdsToAssign = [...new Set([...studentIdsToAssign, ...studentsInGrades.map(s => s.id)])];
        }
      }
      
      if (studentIdsToAssign.length > 0) {
        const assignments = studentIdsToAssign.map(studentId => ({
          recurso_id: newResource.id,
          estudiante_id: studentId,
          asignado_por: authUser.id,
          created_at: new Date().toISOString(),
        }));

        const { error: assignmentError } = await supabase.from('recursos_asignados').insert(assignments);

        if (assignmentError) {
          console.error('Error assigning resource:', assignmentError);
          toast({
            title: t('toast.errorTitle'),
            description: t('createResourceModal.assignError') + (assignmentError.message ? `: ${assignmentError.message}` : ''),
            variant: 'destructive',
          });
        } else {
          assignedStudentCount = studentIdsToAssign.length;
          toast({
            title: t('toast.successTitle'),
            description: t('createResourceModal.assignSuccess', { count: assignedStudentCount }),
          });
        }
      }
    }

    resetForm();
    setOpen(false);
    if (onResourceCreatedAndAssigned) {
      onResourceCreatedAndAssigned(newResource, assignedStudentCount > 0);
    }
    setLoading(false);
  };
  
  const triggerContent = children || (
    <Button className="bg-sky-500 hover:bg-sky-600 text-white">
      <BookPlus size={20} className="mr-2" />
      {t('createResourceModal.triggerButtonUnified')}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChangeInternal}>
      <DialogTrigger asChild>
        {triggerContent}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-slate-800 border-slate-700 text-slate-50">
        <DialogHeader>
          <DialogTitle className="text-sky-400 text-2xl flex items-center">
            <BookPlus size={28} className="mr-3 text-sky-400" />
            {t('createResourceModal.titleUnified')}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {t('createResourceModal.descriptionUnified')}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] p-1">
          <ResourceForm formData={resourceFormData} onFormChange={setResourceFormData} t={t} />
          <AssignmentSection
            assignNow={assignNow}
            onAssignNowChange={setAssignNow}
            fetchingAssignmentData={fetchingAssignmentData}
            grades={grades}
            selectedGrades={selectedGrades}
            onGradeSelectionChange={setSelectedGrades}
            students={estudiantes}
            selectedStudentIds={selectedStudentIds}
            onStudentSelectionChange={setSelectedStudentIds}
            studentSearchTerm={studentSearchTerm}
            onStudentSearchTermChange={setStudentSearchTerm}
            showStudentList={showStudentList}
            onToggleStudentList={() => setShowStudentList(!showStudentList)}
            t={t}
          />
        </ScrollArea>
        
        <DialogFooter className="sm:justify-between pt-4 border-t border-slate-700">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100 w-full sm:w-auto">
              {t('common.cancelButton')}
            </Button>
          </DialogClose>
          <Button 
            type="button" 
            onClick={handleSubmit} 
            disabled={loading || !resourceFormData.title || !resourceFormData.type || (assignNow && fetchingAssignmentData)} 
            className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-semibold disabled:opacity-60"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
            {loading ? t('createResourceModal.processingButton') : (assignNow && (selectedStudentIds.length > 0 || selectedGrades.length > 0)) ? t('createResourceModal.createAndAssignButton') : t('createResourceModal.createButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}