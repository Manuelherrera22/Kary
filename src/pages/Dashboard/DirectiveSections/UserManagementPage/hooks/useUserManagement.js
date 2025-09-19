import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import unifiedUserService from '@/services/unifiedUserService';

export const useUserManagement = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState({});

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simular delay de carga
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Obtener usuarios de la plataforma San Luis Gonzaga
      const platformUsers = unifiedUserService.getAllUsers();
      const stats = unifiedUserService.getUserStatsByRole();
      
      setUsers(platformUsers);
      setUserStats(stats);
      
      console.log('✅ Usuarios de San Luis Gonzaga cargados:', {
        total: platformUsers.length,
        porRol: stats
      });
      
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: t('toast.errorTitle'),
        description: t('dashboards.directive.userManagement.fetchError'),
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
    try {
      await unifiedUserService.toggleUserStatus(user.id);
      const newStatus = user.status === 'active' ? 'suspended' : 'active';
      return t(newStatus === 'active' ? 'dashboards.directive.userManagement.activateUser' : 'dashboards.directive.userManagement.suspendUser');
    } catch (error) {
      throw new Error(`Error al cambiar estado del usuario: ${error.message}`);
    }
  };

  const deleteUser = async (user) => {
    try {
      await unifiedUserService.deleteUser(user.id);
      return t('common.deleteButton');
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  };
  
  const handleActionConfirmed = async (userToConfirm, actionToPerform, setConfirmModalOpen, setUserToConfirm, setActionToPerform) => {
    if (!userToConfirm || !actionToPerform) return;
    try {
      const actionName = await actionToPerform(userToConfirm);
      fetchUsers(); 
      toast({
        title: t('toast.successTitle'),
        description: t('dashboards.directive.userManagement.actionSuccess'),
        className: "bg-green-500 text-white dark:bg-green-700"
      });
    } catch (error) {
      console.error('Error performing action:', error);
      toast({
        title: t('toast.errorTitle'),
        description: error.message || t('dashboards.directive.userManagement.actionError'),
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
    userStats,
    isLoading,
    fetchUsers,
    toggleUserStatus,
    deleteUser,
    handleActionConfirmed
  };
};