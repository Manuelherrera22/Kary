import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import realDataService from '@/services/realDataService';

export const useRealData = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener usuario autenticado
  const getCurrentUser = useCallback(async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        // Si no hay sesión de Supabase, retornar null sin error
        if (error.message.includes('Auth session missing') || error.message.includes('AuthSessionMissingError')) {
          console.log('No Supabase session found, using mock auth');
          return null;
        }
        throw error;
      }
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }, []);

  // Obtener perfil del usuario
  const getUserProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }, []);

  // Obtener datos del dashboard
  const getDashboardData = useCallback(async (role, userId) => {
    try {
      const data = await realDataService.getDashboardData(role, userId);
      return data;
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      return null;
    }
  }, []);

  // Cargar datos iniciales
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        setUser(null);
        setUserProfile(null);
        setDashboardData(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      // Obtener perfil del usuario
      const profile = await getUserProfile(currentUser.id);
      setUserProfile(profile);

      // Obtener datos del dashboard si hay perfil
      if (profile && profile.role) {
        const dashboard = await getDashboardData(profile.role, currentUser.id);
        setDashboardData(dashboard);
      }

    } catch (error) {
      console.error('Error loading data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [getCurrentUser, getUserProfile, getDashboardData]);

  // Cerrar sesión
  const handleLogout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setUserProfile(null);
      setDashboardData(null);
      realDataService.clearCache();
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }, []);

  // Actualizar perfil
  const updateProfile = useCallback(async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setUserProfile(data);
      realDataService.clearUserCache(user.id);
      
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }, [user]);

  // Refrescar datos
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // Escuchar cambios de autenticación
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await loadData();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserProfile(null);
          setDashboardData(null);
          realDataService.clearCache();
        }
      }
    );

    // Cargar datos iniciales
    loadData();

    return () => subscription.unsubscribe();
  }, [loadData]);

  return {
    user,
    userProfile,
    dashboardData,
    loading,
    error,
    handleLogout,
    updateProfile,
    refreshData,
    loadData
  };
};

export default useRealData;
