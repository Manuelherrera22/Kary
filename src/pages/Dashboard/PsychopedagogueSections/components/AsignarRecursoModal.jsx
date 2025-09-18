import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, PlusCircle, BookOpen, User } from 'lucide-react';
import { useMockAuth } from '@/contexts/MockAuthContext';

export default function AsignarRecursoModal({ onAssignmentSuccess, children }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user: authUser } = useMockAuth();
  const [open, setOpen] = useState(false);
  const [selectedEstudiante, setSelectedEstudiante] = useState('');
  const [selectedRecurso, setSelectedRecurso] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!open || !authUser || !authUser.id) {
        setFetchingData(false);
        if (open && (!authUser || !authUser.id)) {
           toast({
            title: t('toast.warningTitle'),
            description: t('assignResourceModal.authErrorUserNotLoadedForFetch'),
            variant: 'destructive',
          });
        }
        return;
      }

      setFetchingData(true);
      setSelectedEstudiante('');
      setSelectedRecurso('');
      try {
        const { data: estudiantesData, error: estudiantesError } = await supabase
          .from('user_profiles')
          .select('id, full_name')
          .eq('role', 'student')
          .order('full_name', { ascending: true });

        if (estudiantesError) throw estudiantesError;
        setEstudiantes(estudiantesData || []);
        
        const { data: recursosData, error: recursosError } = await supabase
          .from('learning_resources')
          .select('id, title, type, description, url, tags, published')
          .eq('published', true)
          .eq('created_by', authUser.id) 
          .order('title', { ascending: true });
        
        if (recursosError) throw recursosError;
        setRecursos(recursosData || []);

      } catch (error) {
        console.error('Error fetching data for assignment modal (AsignarRecursoModal):', error);
        toast({
          title: t('toast.errorTitle'),
          description: t('assignResourceModal.fetchError'),
          variant: 'destructive',
        });
      } finally {
        setFetchingData(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, t, toast, authUser]);

  const validateAssignment = async (studentId, resourceId, assignerId) => {
    if (!studentId || typeof studentId !== 'string' || studentId.trim() === '') {
      toast({ title: t('toast.errorTitle'), description: t('assignResourceModal.validationErrorMissingStudentId'), variant: 'destructive' });
      return false;
    }
    if (!resourceId || typeof resourceId !== 'string' || resourceId.trim() === '') {
      toast({ title: t('toast.errorTitle'), description: t('assignResourceModal.validationErrorMissingResourceId'), variant: 'destructive' });
      return false;
    }
    if (!assignerId || typeof assignerId !== 'string' || assignerId.trim() === '') {
      toast({ title: t('toast.errorTitle'), description: t('assignResourceModal.validationErrorMissingAssignerId'), variant: 'destructive' });
      return false;
    }

    const { data: studentData, error: studentError } = await supabase
      .from('user_profiles')
      .select('id, role')
      .eq('id', studentId)
      .maybeSingle();

    if (studentError || !studentData) {
      toast({ title: t('toast.errorTitle'), description: t('assignResourceModal.validationErrorStudentNotFoundDetailed', { studentId: studentId }), variant: 'destructive' });
      return false;
    }
    if (studentData.role !== 'student') {
      toast({ title: t('toast.errorTitle'), description: t('assignResourceModal.validationErrorStudentNotStudent'), variant: 'destructive' });
      return false;
    }

    const { data: resourceData, error: resourceError } = await supabase
      .from('learning_resources')
      .select('id')
      .eq('id', resourceId)
      .maybeSingle();

    if (resourceError || !resourceData) {
      toast({ title: t('toast.errorTitle'), description: t('assignResourceModal.validationErrorResourceNotFoundInLearningResources', { resourceId: resourceId }), variant: 'destructive' });
      return false;
    }
    
    const { data: assignerData, error: assignerError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', assignerId)
        .maybeSingle();

    if (assignerError || !assignerData) {
        toast({ title: t('toast.errorTitle'), description: t('assignResourceModal.validationErrorAssignerNotFoundDetailed', { assignerId: assignerId }), variant: 'destructive' });
        return false;
    }

    return true;
  };


  const handleAsignar = async () => {
    if (!selectedRecurso || !selectedEstudiante) {
      toast({
        title: t('toast.warningTitle'),
        description: t('assignResourceModal.validationError'),
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    if (!authUser || !authUser.id || typeof authUser.id !== 'string' || authUser.id.trim() === '') {
      toast({
        title: t('toast.errorTitle'),
        description: t('assignResourceModal.authErrorUserNotLoaded'),
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }
    
    const assignerId = authUser.id;

    const isValid = await validateAssignment(selectedEstudiante, selectedRecurso, assignerId);
    if (!isValid) {
      setLoading(false);
      return;
    }

    const assignmentData = {
      recurso_id: selectedRecurso,
      estudiante_id: selectedEstudiante,
      asignado_por: assignerId,
      created_at: new Date().toISOString(),
    };
    
    console.log("Attempting to insert into 'recursos_asignados' (AsignarRecursoModal):", JSON.stringify(assignmentData, null, 2));

    const { error } = await supabase.from('recursos_asignados').insert([assignmentData]);

    if (error) {
      console.error('Error inserting into "recursos_asignados" (AsignarRecursoModal):', error);
      let errorMessage = t('assignResourceModal.assignError');
      if (error.code === '23503') {
         errorMessage = `${t('assignResourceModal.foreignKeyViolation')} ${error.details || error.message || ''}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: t('toast.errorTitle'),
        description: errorMessage,
        variant: 'destructive',
        duration: 10000, 
      });
    } else {
      toast({
        title: t('toast.successTitle'),
        description: t('assignResourceModal.assignSuccess'),
      });
      setOpen(false);
      if (onAssignmentSuccess) {
        onAssignmentSuccess(selectedEstudiante, selectedRecurso);
      }
    }
    setLoading(false);
  };
  
  const handleStudentSelectChange = (value) => {
    setSelectedEstudiante(value);
  };

  const handleResourceSelectChange = (value) => {
    setSelectedRecurso(value);
  };

  const triggerContent = children || (
    <Button className="bg-green-500 hover:bg-green-600 text-white">
      <PlusCircle size={20} className="mr-2" />
      {t('assignResourceModal.triggerButton')}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerContent}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700 text-slate-50">
        <DialogHeader>
          <DialogTitle className="text-amber-400 text-2xl flex items-center">
            <BookOpen size={24} className="mr-3 text-amber-400" />
            {t('assignResourceModal.title')}
          </DialogTitle>
        </DialogHeader>
        {fetchingData ? (
          <div className="flex justify-center items-center h-56">
            <Loader2 className="h-10 w-10 animate-spin text-amber-400" />
          </div>
        ) : (
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="estudiante" className="text-slate-300 flex items-center">
                <User size={16} className="mr-2 text-sky-400" />
                {t('assignResourceModal.studentLabel')}
              </Label>
              <Select value={selectedEstudiante} onValueChange={handleStudentSelectChange}>
                <SelectTrigger 
                  id="estudiante" 
                  className="w-full bg-slate-700 border-slate-600 text-slate-50 focus:ring-amber-500"
                >
                  <SelectValue placeholder={t('assignResourceModal.studentPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-slate-50">
                  {estudiantes.map((e) => (
                    <SelectItem key={e.id} value={e.id} className="hover:bg-slate-600 focus:bg-slate-600">
                      {e.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recurso" className="text-slate-300 flex items-center">
                <BookOpen size={16} className="mr-2 text-green-400" />
                {t('assignResourceModal.resourceLabel')}
              </Label>
              <Select value={selectedRecurso} onValueChange={handleResourceSelectChange}>
                <SelectTrigger 
                  id="recurso" 
                  className="w-full bg-slate-700 border-slate-600 text-slate-50 focus:ring-amber-500"
                >
                  <SelectValue placeholder={t('assignResourceModal.resourcePlaceholder')} />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-slate-50">
                  {recursos.map((r) => (
                    <SelectItem key={r.id} value={r.id} className="hover:bg-slate-600 focus:bg-slate-600">
                      {r.title} ({t(`assignResourceModal.types.${r.type}`, r.type)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        <DialogFooter className="sm:justify-start pt-4 border-t border-slate-700">
          <Button 
            type="button" 
            onClick={handleAsignar} 
            disabled={loading || fetchingData || !selectedEstudiante || !selectedRecurso} 
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {loading ? t('assignResourceModal.assigningButton') : t('assignResourceModal.assignButton')}
          </Button>
           <DialogClose asChild>
            <Button type="button" variant="outline" className="w-full mt-2 sm:mt-0 sm:ml-auto border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100">
              {t('common.cancelButton')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}