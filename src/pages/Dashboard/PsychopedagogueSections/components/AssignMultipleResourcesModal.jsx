import React, { useState, useEffect, useMemo } from 'react';
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
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { Loader2, PlusCircle, BookOpen, User, Search, CheckSquare, Filter, X, Layers, Video, FileText as FileTextIcon, Zap, HelpCircle as HelpCircleIcon, Palette } from 'lucide-react';

const ResourceItem = ({ resource, isSelected, onToggleSelect, t }) => {
  const typeIconMapping = {
    guia: FileTextIcon,
    video: Video,
    ejercicio: Zap,
    articulo: FileTextIcon,
    material: BookOpen, 
    otro: HelpCircleIcon,
    default: BookOpen,
  };
  const Icon = typeIconMapping[resource.type] || typeIconMapping.default;

  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer
        ${isSelected ? 'bg-sky-500/20 border-sky-500 shadow-md' : 'bg-slate-700/50 border-slate-600 hover:bg-slate-600/70'}`}
      onClick={() => onToggleSelect(resource.id)}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={isSelected ? "text-sky-300" : "text-slate-400"} />
        <div>
          <p className={`font-medium ${isSelected ? "text-sky-100" : "text-slate-200"}`}>{resource.title}</p>
          <p className={`text-xs ${isSelected ? "text-sky-300" : "text-slate-400"}`}>
            {t(`learningResourcesPage.type${resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}`, resource.type)}
          </p>
        </div>
      </div>
      <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect(resource.id)} className="border-slate-500 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-600" />
    </div>
  );
};

export default function AssignMultipleResourcesModal({ onAssignmentSuccess, children }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user: authUser } = useAuth();
  const [open, setOpen] = useState(false);
  
  const [estudiantes, setEstudiantes] = useState([]);
  const [allResources, setAllResources] = useState([]);
  
  const [selectedEstudiante, setSelectedEstudiante] = useState('');
  const [selectedResourceIds, setSelectedResourceIds] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');

  const [loading, setLoading] = useState(false);
  const [fetchingInitialData, setFetchingInitialData] = useState(true);

  const resourceTypes = useMemo(() => [
    { value: 'todos', labelKey: 'assignMultipleResourcesModal.filterAllTypes', icon: Layers },
    { value: 'guia', labelKey: 'learningResourcesPage.typeGuiaNoAccent', icon: FileTextIcon },
    { value: 'video', labelKey: 'learningResourcesPage.typeVideo', icon: Video },
    { value: 'ejercicio', labelKey: 'learningResourcesPage.typeEjercicio', icon: Zap },
  ], [t]);

  useEffect(() => {
    const fetchData = async () => {
      if (!open) return;
      setFetchingInitialData(true);
      setSelectedEstudiante('');
      setSelectedResourceIds([]);
      setSearchTerm('');
      setTypeFilter('todos');

      try {
        const [estudiantesRes, recursosRes] = await Promise.all([
          supabase.from('user_profiles').select('id, full_name').eq('role', 'student').order('full_name', { ascending: true }),
          supabase.from('learning_resources').select('id, title, type').eq('published', true).order('title', { ascending: true })
        ]);

        if (estudiantesRes.error) throw estudiantesRes.error;
        setEstudiantes(estudiantesRes.data || []);

        if (recursosRes.error) throw recursosRes.error;
        setAllResources(recursosRes.data || []);

      } catch (error) {
        console.error('Error fetching data for multi-assign modal:', error);
        toast({
          title: t('toast.errorTitle'),
          description: t('assignMultipleResourcesModal.fetchError'),
          variant: 'destructive',
        });
      } finally {
        setFetchingInitialData(false);
      }
    };
    if (open) {
      fetchData();
    }
  }, [open, t, toast]);

  const filteredResources = useMemo(() => {
    return allResources
      .filter(resource => typeFilter === 'todos' || resource.type === typeFilter)
      .filter(resource => resource.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [allResources, typeFilter, searchTerm]);

  const handleToggleResourceSelect = (resourceId) => {
    setSelectedResourceIds(prev =>
      prev.includes(resourceId)
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const handleSelectAllFiltered = () => {
    const filteredIds = filteredResources.map(r => r.id);
    const allSelected = filteredIds.every(id => selectedResourceIds.includes(id));
    if (allSelected) {
      setSelectedResourceIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setSelectedResourceIds(prev => [...new Set([...prev, ...filteredIds])]);
    }
  };

  const validateAssignment = async (studentId, resourceIds, assignerId) => {
    const { data: studentData, error: studentError } = await supabase
      .from('user_profiles')
      .select('id, role')
      .eq('id', studentId)
      .maybeSingle();

    if (studentError || !studentData) {
      toast({ title: t('toast.errorTitle'), description: t('assignMultipleResourcesModal.validationErrorStudentNotFound'), variant: 'destructive' });
      return false;
    }
    if (studentData.role !== 'student') {
      toast({ title: t('toast.errorTitle'), description: t('assignMultipleResourcesModal.validationErrorStudentNotStudent'), variant: 'destructive' });
      return false;
    }

    if (resourceIds.length === 0) {
       toast({ title: t('toast.warningTitle'), description: t('assignMultipleResourcesModal.validationErrorNoResourceSelected'), variant: 'destructive' });
       return false;
    }

    const { data: resourcesData, error: resourcesError } = await supabase
      .from('learning_resources')
      .select('id')
      .in('id', resourceIds);

    if (resourcesError || !resourcesData || resourcesData.length !== resourceIds.length) {
      toast({ title: t('toast.errorTitle'), description: t('assignMultipleResourcesModal.validationErrorSomeResourcesNotFound'), variant: 'destructive' });
      return false;
    }
    
    const { data: assignerData, error: assignerError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', assignerId)
        .maybeSingle();

    if (assignerError || !assignerData) {
        toast({ title: t('toast.errorTitle'), description: t('assignMultipleResourcesModal.validationErrorAssignerNotFound'), variant: 'destructive' });
        return false;
    }
    return true;
  };

  const handleAssign = async () => {
    if (!selectedEstudiante || selectedResourceIds.length === 0) {
      toast({
        title: t('toast.warningTitle'),
        description: t('assignMultipleResourcesModal.validationError'),
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    if (!authUser) {
      toast({
        title: t('toast.errorTitle'),
        description: t('assignMultipleResourcesModal.authErrorUserNotLoaded'),
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    const isValid = await validateAssignment(selectedEstudiante, selectedResourceIds, authUser.id);
    if (!isValid) {
      setLoading(false);
      return;
    }

    const assignments = selectedResourceIds.map(resourceId => ({
      recurso_id: resourceId,
      estudiante_id: selectedEstudiante,
      asignado_por: authUser.id,
      created_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('recursos_asignados').insert(assignments);

    if (error) {
      console.error('Error assigning multiple resources:', error);
      let errorMessage = t('assignMultipleResourcesModal.assignError');
      if (error.code === '23503') { 
        if (error.details && error.details.includes('fk_recurso') && error.details.includes('recursos_aprendizaje')) {
          errorMessage = t('assignMultipleResourcesModal.errorFKRecursoAprendizaje');
        } else if (error.details && error.details.includes('fk_recurso')) {
          errorMessage = t('assignMultipleResourcesModal.validationErrorSomeResourcesNotFound');
        } else if (error.details && error.details.includes('fk_estudiante')) {
          errorMessage = t('assignMultipleResourcesModal.validationErrorStudentNotFound');
        } else if (error.details && error.details.includes('fk_asignado_por')) {
          errorMessage = t('assignMultipleResourcesModal.validationErrorAssignerNotFound');
        } else {
           errorMessage = `${t('assignMultipleResourcesModal.foreignKeyViolation')} ${error.details || ''}`;
        }
      }
      toast({
        title: t('toast.errorTitle'),
        description: errorMessage,
        variant: 'destructive',
      });
    } else {
      toast({
        title: t('toast.successTitle'),
        description: t('assignMultipleResourcesModal.assignSuccess', { count: selectedResourceIds.length }),
      });
      setOpen(false);
      if (onAssignmentSuccess) onAssignmentSuccess();
    }
    setLoading(false);
  };
  
  const numSelectedInFiltered = useMemo(() => {
    return filteredResources.filter(r => selectedResourceIds.includes(r.id)).length;
  }, [filteredResources, selectedResourceIds]);
  
  const triggerContent = children || (
    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
      <Palette size={20} className="mr-2" />
      {t('assignMultipleResourcesModal.triggerButton')}
    </Button>
  );


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerContent}
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col bg-slate-800 border-slate-700 text-slate-50 p-0">
        <DialogHeader className="p-6 border-b border-slate-700">
          <DialogTitle className="text-purple-400 text-2xl flex items-center">
            <Palette size={28} className="mr-3 text-purple-400" />
            {t('assignMultipleResourcesModal.title')}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {t('assignMultipleResourcesModal.description')}
          </DialogDescription>
        </DialogHeader>

        {fetchingInitialData ? (
          <div className="flex-grow flex justify-center items-center">
            <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div>
                <Label htmlFor="estudiante-multi" className="text-slate-300 flex items-center mb-1">
                  <User size={16} className="mr-2 text-sky-400" />
                  {t('assignMultipleResourcesModal.studentLabel')}
                </Label>
                <Select value={selectedEstudiante} onValueChange={setSelectedEstudiante}>
                  <SelectTrigger id="estudiante-multi" className="w-full bg-slate-700 border-slate-600 text-slate-50 focus:ring-purple-500">
                    <SelectValue placeholder={t('assignMultipleResourcesModal.studentPlaceholder')} />
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
              <div>
                <Label htmlFor="type-filter-multi" className="text-slate-300 flex items-center mb-1">
                  <Filter size={16} className="mr-2 text-green-400" />
                  {t('assignMultipleResourcesModal.filterByTypeLabel')}
                </Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger id="type-filter-multi" className="w-full bg-slate-700 border-slate-600 text-slate-50 focus:ring-purple-500">
                    <SelectValue placeholder={t('assignMultipleResourcesModal.filterPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-slate-50">
                    {resourceTypes.map(rt => {
                      const Icon = rt.icon;
                      return (
                        <SelectItem key={rt.value} value={rt.value} className="hover:bg-slate-600 focus:bg-slate-600 flex items-center">
                          <Icon size={16} className="mr-2 opacity-70" /> {t(rt.labelKey, rt.value.charAt(0).toUpperCase() + rt.value.slice(1))}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="px-6 mb-3">
              <Label htmlFor="search-resource-multi" className="text-slate-300 flex items-center mb-1">
                <Search size={16} className="mr-2 text-amber-400" />
                {t('assignMultipleResourcesModal.searchLabel')}
              </Label>
              <Input
                id="search-resource-multi"
                type="text"
                placeholder={t('assignMultipleResourcesModal.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-700 border-slate-600 text-slate-50 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex justify-between items-center px-6 mb-3">
                <p className="text-sm text-slate-400">
                  {t('assignMultipleResourcesModal.showingResourcesCount', { count: filteredResources.length, total: allResources.length })}
                </p>
                {filteredResources.length > 0 && (
                  <Button variant="link" onClick={handleSelectAllFiltered} className="text-purple-400 hover:text-purple-300 p-0 h-auto">
                    <CheckSquare size={16} className="mr-1" />
                    {numSelectedInFiltered === filteredResources.length 
                      ? t('assignMultipleResourcesModal.deselectAllFiltered') 
                      : t('assignMultipleResourcesModal.selectAllFiltered')} ({numSelectedInFiltered}/{filteredResources.length})
                  </Button>
                )}
            </div>

            <ScrollArea className="flex-grow px-6 pb-1">
              <div className="space-y-2">
                {filteredResources.length > 0 ? (
                  filteredResources.map(resource => (
                    <ResourceItem
                      key={resource.id}
                      resource={resource}
                      isSelected={selectedResourceIds.includes(resource.id)}
                      onToggleSelect={handleToggleResourceSelect}
                      t={t}
                    />
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-500">
                    {searchTerm ? t('assignMultipleResourcesModal.noResultsForSearch') : t('assignMultipleResourcesModal.noResultsForFilter')}
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="px-6 py-3 text-sm text-slate-400">
              {t('assignMultipleResourcesModal.selectedCount', { count: selectedResourceIds.length })}
            </div>
          </>
        )}

        <DialogFooter className="p-6 border-t border-slate-700 sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100 w-full sm:w-auto">
               <X size={18} className="mr-2" />{t('common.cancelButton')}
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleAssign}
            disabled={loading || fetchingInitialData || !selectedEstudiante || selectedResourceIds.length === 0}
            className="w-full sm:w-auto bg-purple-500 hover:bg-purple-600 text-white font-semibold disabled:opacity-60"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? t('assignMultipleResourcesModal.assigningButton') : t('assignMultipleResourcesModal.assignButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}