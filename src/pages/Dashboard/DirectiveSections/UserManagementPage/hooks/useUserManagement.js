import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export const useUserManagement = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, role, status, grade, admission_date')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: t('toast.errorTitle'),
        description: t('directive.userManagement.fetchError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleUserStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    const { error } = await supabase
      .from('user_profiles')
      .update({ status: newStatus })
      .eq('id', user.id);
    if (error) throw error;
    return t(newStatus === 'active' ? 'directive.userManagement.activateUser' : 'directive.userManagement.suspendUser');
  };

  const deleteUser = async (user) => {
    if (user.email) {
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      if (authError && authError.message !== 'User not found') {
        console.warn('Error deleting user from auth.users:', authError.message);
      }
    }
    const { error: profileError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', user.id);
    if (profileError) throw profileError;
    return t('common.deleteButton');
  };
  
  const handleActionConfirmed = async (userToConfirm, actionToPerform, setConfirmModalOpen, setUserToConfirm, setActionToPerform) => {
    if (!userToConfirm || !actionToPerform) return;
    try {
      const actionName = await actionToPerform(userToConfirm);
      fetchUsers(); 
      toast({
        title: t('toast.successTitle'),
        description: t('directive.userManagement.actionSuccess'),
        className: "bg-green-500 text-white dark:bg-green-700"
      });
    } catch (error) {
      console.error('Error performing action:', error);
      toast({
        title: t('toast.errorTitle'),
        description: error.message || t('directive.userManagement.actionError'),
        variant: 'destructive',
      });
    } finally {
      setConfirmModalOpen(false);
      setUserToConfirm(null);
      setActionToPerform(null);
    }
  };


  return {
    users,
    isLoading,
    fetchUsers,
    toggleUserStatus,
    deleteUser,
    handleActionConfirmed
  };
};