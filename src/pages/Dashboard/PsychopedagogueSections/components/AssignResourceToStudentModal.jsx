import React, { useEffect, useState, useMemo } from 'react';
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { Loader2, BookOpen, Layers, Video, FileText as FileTextIcon, Activity as ActivityIcon } from 'lucide-react';

const validResourceTypesForFilter = [
  { value: 'todos', labelKey: 'assignResourceToStudentModal.types.todos', icon: Layers },
  { value: 'guía', labelKey: 'assignResourceToStudentModal.types.guia', icon: FileTextIcon },
  { value: 'actividad', labelKey: 'assignResourceToStudentModal.types.actividad', icon: ActivityIcon },
  { value: 'video', labelKey: 'assignResourceToStudentModal.types.video', icon: Video },
  { value: 'documento', labelKey: 'assignResourceToStudentModal.types.documento', icon: BookOpen },
];

export default function AssignResourceToStudentModal({ studentId, studentName, onAssignmentSuccess }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user: authUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [allResources, setAllResources] = useState([]);
  const [selectedType, setSelectedType] = useState('todos');
  const [selectedResourceId, setSelectedResourceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingResources, setFetchingResources] = useState(true);

  const resourceTypeOptions = useMemo(() => validResourceTypesForFilter.map(rt => ({
    ...rt,
    label: t(rt.labelKey)
  })), [t]);


  useEffect(() => {
    const fetchResources = async () => {
      if (!open || !authUser || !authUser.id) {
        setFetchingResources(false);
        if(open && (!authUser || !authUser.id)){
          toast({
            title: t('toast.warningTitle'),
            description: t('assignResourceToStudentModal.authErrorUserNotLoadedForFetch'),
            variant: 'destructive',
          });
        }
        return;
      }
      setFetchingResources(true);
      setSelectedType('todos'); 
      setSelectedResourceId('');
      try {
        const { data, error } = await supabase
          .from('learning_resources')
          .select('id, title, type, description, url, tags, published')
          .eq('published', true)
          .eq('created_by', authUser.id)
          .order('title', { ascending: true }); 

        if (error) throw error;
        
        const mappedData = data.map(r => ({ id: r.id, titulo: r.title, tipo: r.type })) || [];
        setAllResources(mappedData);
        
      } catch (error) {
        console.error('Error fetching resources (AssignResourceToStudentModal):', error);
        toast({
          title: t('toast.errorTitle'),
          description: t('assignResourceToStudentModal.fetchError'),
          variant: 'destructive',
        });
      } finally {
        setFetchingResources(false);
      }
    };

    if (open) {
      fetchResources();
    }
  }, [open, t, toast, authUser]);

  const filteredResources = useMemo(() => {
    if (selectedType === 'todos') {
      return allResources;
    }
    return allResources.filter(r => r.tipo === selectedType);
  }, [allResources, selectedType]);

  const handleTypeFilter = (type) => {
    setSelectedType(type);
    setSelectedResourceId(''); 
  };
  
  const handleResourceSelectChange = (value) => {
    setSelectedResourceId(value);
  };

  const validateAssignment = async (currentStudentId, resourceId, assignerId) => {
    if (!currentStudentId || typeof currentStudentId !== 'string' || currentStudentId.trim() === '') {
      toast({ title: t('toast.errorTitle'), description: t('assignResourceToStudentModal.validationErrorMissingStudentId'), variant: 'destructive' });
      return false;
    }
    if (!resourceId || typeof resourceId !== 'string' || resourceId.trim() === '') {
      toast({ title: t('toast.errorTitle'), description: t('assignResourceToStudentModal.validationErrorMissingResourceId'), variant: 'destructive' });
      return false;
    }
    if (!assignerId || typeof assignerId !== 'string' || assignerId.trim() === '') {
      toast({ title: t('toast.errorTitle'), description: t('assignResourceToStudentModal.validationErrorMissingAssignerId'), variant: 'destructive' });
      return false;
    }
    
    const { data: studentData, error: studentError } = await supabase
      .from('user_profiles')
      .select('id, role')
      .eq('id', currentStudentId)
      .maybeSingle();

    if (studentError || !studentData) {
      toast({ title: t('toast.errorTitle'), description: t('assignResourceToStudentModal.validationErrorStudentNotFoundDetailed', { studentId: currentStudentId }), variant: 'destructive' });
      return false;
    }
    if (studentData.role !== 'student') {
      toast({ title: t('toast.errorTitle'), description: t('assignResourceToStudentModal.validationErrorStudentNotStudent'), variant: 'destructive' });
      return false;
    }

    const { data: resourceData, error: resourceError } = await supabase
      .from('learning_resources')
      .select('id')
      .eq('id', resourceId)
      .maybeSingle();

    if (resourceError || !resourceData) {
      toast({ title: t('toast.errorTitle'), description: t('assignResourceToStudentModal.validationErrorResourceNotFoundInLearningResources', { resourceId: resourceId }), variant: 'destructive' });
      return false;
    }

    const { data: assignerData, error: assignerError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', assignerId)
        .maybeSingle();

    if (assignerError || !assignerData) {
        toast({ title: t('toast.errorTitle'), description: t('assignResourceToStudentModal.validationErrorAssignerNotFoundDetailed', { assignerId: assignerId }), variant: 'destructive' });
        return false;
    }

    return true;
  };


  const handleAssign = async () => {
    if (!selectedResourceId) {
      toast({
        title: t('toast.warningTitle'),
        description: t('assignResourceToStudentModal.validationErrorResource'),
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    if (!authUser || !authUser.id || typeof authUser.id !== 'string' || authUser.id.trim() === '') {
      toast({
        title: t('toast.errorTitle'),
        description: t('assignResourceToStudentModal.authErrorUserNotLoaded'),
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    const assignerId = authUser.id;

    const isValid = await validateAssignment(studentId, selectedResourceId, assignerId);
    if(!isValid) {
        setLoading(false);
        return;
    }

    const assignmentData = {
      estudiante_id: studentId,
      recurso_id: selectedResourceId,
      asignado_por: assignerId,
      created_at: new Date().toISOString(),
    };
    
    console.log("Attempting to insert into 'recursos_asignados' (AssignResourceToStudentModal):", JSON.stringify(assignmentData, null, 2));

    const { error } = await supabase.from('recursos_asignados').insert([assignmentData]);

    if (error) {
      console.error('Error inserting into "recursos_asignados" (AssignResourceToStudentModal):', error);
      let errorMessage = t('assignResourceToStudentModal.assignError');
      if (error.code === '23503') {
         errorMessage = `${t('assignResourceToStudentModal.foreignKeyViolation')} ${error.details || error.message || ''}`;
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
        description: t('assignResourceToStudentModal.assignSuccess', { studentName: studentName || t('common.theStudent') }),
      });
      setOpen(false);
      if (onAssignmentSuccess) {
        onAssignmentSuccess(studentId, selectedResourceId); 
      }
    }
    setLoading(false);
  };

  const getResourceIcon = (type) => {
    const typeOption = resourceTypeOptions.find(opt => opt.value === type);
    return typeOption ? <typeOption.icon size={16} className="mr-2 text-slate-400" /> : <BookOpen size={16} className="mr-2 text-slate-400" />;
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-sky-500 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300">
          <BookOpen size={16} className="mr-2" />
          {t('assignResourceToStudentModal.triggerButton')}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700 text-slate-50">
        <DialogHeader>
          <DialogTitle className="text-sky-400">
            {t('assignResourceToStudentModal.title', { studentName: studentName || t('common.theStudent') })}
          </DialogTitle>
        </DialogHeader>

        {fetchingResources ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div>
              <Label htmlFor="resourceType" className="text-slate-300 mb-1 block">{t('assignResourceToStudentModal.resourceTypeLabel')}</Label>
              <Select value={selectedType} onValueChange={handleTypeFilter}>
                <SelectTrigger id="resourceType" className="bg-slate-700 border-slate-600 text-slate-50 focus:ring-sky-500">
                  <SelectValue placeholder={t('assignResourceToStudentModal.resourceTypePlaceholder')} />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-slate-50">
                  {resourceTypeOptions.map(typeOpt => {
                    const Icon = typeOpt.icon;
                    return (
                      <SelectItem key={typeOpt.value} value={typeOpt.value} className="hover:bg-slate-600 focus:bg-slate-600">
                        <div className="flex items-center">
                          <Icon size={16} className="mr-2 opacity-70" /> {typeOpt.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="resource" className="text-slate-300 mb-1 block">{t('assignResourceToStudentModal.resourceLabel')}</Label>
              <Select value={selectedResourceId} onValueChange={handleResourceSelectChange} disabled={filteredResources.length === 0}>
                <SelectTrigger id="resource" className="bg-slate-700 border-slate-600 text-slate-50 focus:ring-sky-500">
                  <SelectValue placeholder={t('assignResourceToStudentModal.resourcePlaceholder')} />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-slate-50 max-h-60">
                  {filteredResources.length === 0 ? (
                    <div className="p-4 text-center text-slate-400">
                      {t('assignResourceToStudentModal.noResourcesOfType', { type: resourceTypeOptions.find(rt => rt.value === selectedType)?.label || selectedType })}
                    </div>
                  ) : (
                    filteredResources.map((r) => (
                      <SelectItem key={r.id} value={r.id} className="hover:bg-slate-600 focus:bg-slate-600">
                        <div className="flex items-center">
                           {getResourceIcon(r.tipo)} {r.titulo}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        <DialogFooter className="sm:justify-between mt-2">
           <DialogClose asChild>
            <Button type="button" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100 w-full sm:w-auto">
              {t('common.cancelButton')}
            </Button>
          </DialogClose>
          <Button 
            onClick={handleAssign} 
            disabled={loading || fetchingResources || !selectedResourceId} 
            className="bg-sky-500 hover:bg-sky-600 text-white font-semibold disabled:opacity-70 w-full sm:w-auto"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? t('assignResourceToStudentModal.assigningButton') : t('assignResourceToStudentModal.assignButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}