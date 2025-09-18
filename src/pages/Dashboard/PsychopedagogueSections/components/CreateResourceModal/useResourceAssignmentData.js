import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';

const useResourceAssignmentData = (open) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user: authUser } = useMockAuth();
  
  const [estudiantes, setEstudiantes] = useState([]);
  const [grades, setGrades] = useState([]);
  const [fetchingInitialData, setFetchingInitialData] = useState(true);

  const fetchData = useCallback(async () => {
    if (!authUser || !authUser.id) {
      setFetchingInitialData(false);
      if(open){
         toast({
          title: t('toast.warningTitle'),
          description: t('createResourceModal.fetchAssignmentDataError'),
          variant: 'destructive',
        });
      }
      return;
    }

    setFetchingInitialData(true);
    try {
      const { data: studentsData, error: studentsError } = await supabase
        .from('user_profiles')
        .select('id, full_name, grade')
        .eq('role', 'student')
        .order('full_name', { ascending: true });

      if (studentsError) throw studentsError;
      setEstudiantes(studentsData || []);

      const uniqueGrades = [...new Set(studentsData.map(s => s.grade).filter(Boolean).sort())];
      setGrades(uniqueGrades);

    } catch (error) {
      console.error('Error fetching assignment data for create resource modal hook:', error);
      toast({
        title: t('toast.errorTitle'),
        description: t('createResourceModal.fetchAssignmentDataError'),
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
    grades,
    fetchingInitialData,
    fetchData, 
  };
};

export default useResourceAssignmentData;