import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { Loader2, Palette, User, Search, CheckSquare, Filter, X, Layers, Video, FileText as FileTextIcon, Activity as ActivityIcon, BookOpen } from 'lucide-react';
import ResourceItem from './ResourceItem';
import useResourceAssignmentData from './useResourceAssignmentData';
import edgeFunctionService from '@/services/edgeFunctionService';

const validResourceTypesForFilter = [
  { value: 'todos', labelKey: 'assignMultipleResourcesModal.filterAllTypes', icon: Layers },
  { value: 'guia', labelKey: 'learningResourcesPage.typeGuia', icon: FileTextIcon },
  { value: 'actividad', labelKey: 'learningResourcesPage.typeActividad', icon: ActivityIcon },
  { value: 'video', labelKey: 'learningResourcesPage.typeVideo', icon: Video },
  { value: 'documento', labelKey: 'learningResourcesPage.typeDocumento', icon: BookOpen },
];


export default function AssignMultipleResourcesModal({ onAssignmentSuccess, children, isOpen: externalOpen, onOpenChange: externalOnOpenChange }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user: authUser } = useAuth();
  
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange !== undefined ? externalOnOpenChange : setInternalOpen;
  
  const { 
    estudiantes, 
    allResources, 
    fetchingInitialData, 
    fetchData: refetchData 
  } = useResourceAssignmentData(open);
  
  const [selectedEstudiante, setSelectedEstudiante] = useState('');
  const [selectedResourceIds, setSelectedResourceIds] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');

  const [loading, setLoading] = useState(false);

  const resourceTypesForSelect = useMemo(() => validResourceTypesForFilter.map(rt => ({
    ...rt,
    label: t(rt.labelKey, rt.value.charAt(0).toUpperCase() + rt.value.slice(1))
  })), [t]);


  const handleOpenChange = useCallback((isOpen) => {
    setOpen(isOpen);
    if (isOpen) {
      setSelectedEstudiante('');
      setSelectedResourceIds([]);
      setSearchTerm('');
      setTypeFilter('todos');
      if (authUser?.id) {
         refetchData();
      }
    }
  }, [setOpen, authUser, refetchData]);
  
  useEffect(() => {
    if (open && authUser?.id && fetchingInitialData) {
        refetchData();
    }
  }, [open, authUser, fetchingInitialData, refetchData]);


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
    
    try {
      const { data, error } = await edgeFunctionService.assignMultipleResources({
        student_id: selectedEstudiante,
        resource_ids: selectedResourceIds,
      });

      if (error) throw error;

      toast({
        title: t('toast.successTitle'),
        description: t('assignMultipleResourcesModal.assignSuccess', { count: data?.assigned_count || selectedResourceIds.length }),
      });
      handleOpenChange(false);
      if (onAssignmentSuccess) {
        onAssignmentSuccess(selectedEstudiante, selectedResourceIds);
      }

    } catch (error) {
      console.error('Error assigning multiple resources:', error);
      toast({
        title: t('toast.errorTitle'),
        description: error.message || t('assignMultipleResourcesModal.assignError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children ? <DialogTrigger asChild>{triggerContent}</DialogTrigger> : triggerContent}
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
                    {resourceTypesForSelect.map(rt => {
                      const Icon = rt.icon;
                      return (
                        <SelectItem key={rt.value} value={rt.value} className="hover:bg-slate-600 focus:bg-slate-600 flex items-center">
                          <Icon size={16} className="mr-2 opacity-70" /> {rt.label}
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