import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';

const useResourceAssignmentData = (open) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user: authUser } = useMockAuth();
  
  const [estudiantes, setEstudiantes] = useState([]);
  const [allResources, setAllResources] = useState([]);
  const [fetchingInitialData, setFetchingInitialData] = useState(true);

  const resourceTypes = useMemo(() => [
    { value: 'todos', labelKey: 'assignMultipleResourcesModal.filterAllTypes' },
    { value: 'guia', labelKey: 'learningResourcesPage.typeGuiaNoAccent' },
    { value: 'video', labelKey: 'learningResourcesPage.typeVideo' },
    { value: 'ejercicio', labelKey: 'learningResourcesPage.typeEjercicio' },
  ], [t]);

  const fetchData = useCallback(async () => {
    if (!authUser || !authUser.id) {
      setFetchingInitialData(false);
      if(open){
         toast({
          title: t('toast.warningTitle'),
          description: t('assignMultipleResourcesModal.authErrorUserNotLoadedForFetch'),
          variant: 'destructive',
        });
      }
      return;
    }

    setFetchingInitialData(true);
    try {
      const [estudiantesRes, recursosRes] = await Promise.all([
        supabase.from('user_profiles').select('id, full_name').eq('role', 'student').order('full_name', { ascending: true }),
        supabase.from('learning_resources')
          .select('id, title, type, description, url, tags, published')
          .eq('published', true)
          .eq('created_by', authUser.id)
          .order('title', { ascending: true })
      ]);

      if (estudiantesRes.error) throw estudiantesRes.error;
      setEstudiantes(estudiantesRes.data || []);

      if (recursosRes.error) throw recursosRes.error;
      setAllResources(recursosRes.data || []);

    } catch (error) {
      console.error('Error fetching data for multi-assign modal hook:', error);
      toast({
        title: t('toast.errorTitle'),
        description: t('assignMultipleResourcesModal.fetchError'),
        variant: 'destructive',
      });
    } finally {
      setFetchingInitialData(false);
    }
  }, [t, toast, authUser, open]);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, fetchData]);

  return {
    estudiantes,
    allResources,
    fetchingInitialData,
    resourceTypes,
    fetchData, 
  };
};

export default useResourceAssignmentData;