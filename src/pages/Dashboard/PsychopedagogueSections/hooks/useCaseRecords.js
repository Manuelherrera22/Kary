import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

const useCaseRecords = (authUser, t, toast) => {
  const [dashboardData, setDashboardData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (!authUser) return;
    setIsLoadingData(true);
    try {
      const { data, error } = await supabase
        .from('psicopedagogo_dashboard_data')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42703') {
          console.warn("Column 'created_at' not found for ordering, fetching without order.");
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('psicopedagogo_dashboard_data')
            .select('*')
            .eq('user_id', authUser.id);
          if (fallbackError) throw fallbackError;
          setDashboardData(fallbackData || []);
        } else {
          throw error;
        }
      } else {
        setDashboardData(data || []);
      }
    } catch (error) {
      console.error('Error fetching psychopedagogue dashboard data:', error);
      toast({
        title: t('toasts.errorTitle'),
        description: t('common.errorLoadingData') + (error.message ? `: ${error.message}` : ''),
        variant: 'destructive',
      });
    } finally {
      setIsLoadingData(false);
    }
  }, [authUser, t, toast]);

  const handleSubmit = async (formData) => {
    if (!authUser) return;
    setIsSubmitting(true);

    const payload = {
      ...formData,
      user_id: authUser.id,
    };
    
    if (editingItem && editingItem.id) {
      payload.id = editingItem.id; 
    }

    try {
      let response;
      if (editingItem && editingItem.id) {
        response = await supabase
          .from('psicopedagogo_dashboard_data')
          .update(payload)
          .eq('id', editingItem.id)
          .eq('user_id', authUser.id)
          .select()
          .single();
      } else {
        response = await supabase
          .from('psicopedagogo_dashboard_data')
          .insert(payload)
          .select()
          .single();
      }

      const { data: responseData, error } = response;

      if (error) throw error;

      toast({
        title: editingItem ? t('toasts.dataUpdatedSuccess') : t('toasts.dataCreatedSuccess'),
        description: t('toasts.recordForStudentSuccess', { studentName: responseData.student_name, action: editingItem ? t('common.updated').toLowerCase() : t('common.created').toLowerCase() }),
        className: "bg-green-500 text-white dark:bg-green-600"
      });
      fetchDashboardData();
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error submitting data:', error);
      toast({
        title: t('toasts.errorTitle'),
        description: error.message || t('toasts.errorSubmittingData', { action: editingItem ? t('common.updating').toLowerCase() : t('common.creating').toLowerCase() }),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete || !authUser) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('psicopedagogo_dashboard_data')
        .delete()
        .eq('id', itemToDelete.id)
        .eq('user_id', authUser.id); 

      if (error) throw error;

      toast({
        title: t('toasts.dataDeletedSuccess'),
        description: t('toasts.recordForStudentDeletedSuccess', { studentName: itemToDelete.student_name }),
        className: "bg-orange-500 text-white dark:bg-orange-600"
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting data:', error);
      toast({
        title: t('toasts.errorTitle'),
        description: error.message || t('toasts.errorDeletingData'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setIsConfirmDeleteOpen(false);
      setItemToDelete(null);
    }
  };

  return {
    dashboardData,
    isLoadingData,
    isModalOpen,
    setIsModalOpen,
    editingItem,
    setEditingItem,
    isSubmitting,
    setIsSubmitting,
    itemToDelete,
    setItemToDelete,
    isConfirmDeleteOpen,
    setIsConfirmDeleteOpen,
    fetchDashboardData,
    handleSubmit,
    handleDelete,
  };
};

export default useCaseRecords;