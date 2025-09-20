import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useMockAuth } from '@/contexts/MockAuthContext';

export const useHybridAuth = () => {
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(false);
  const [supabaseUser, setSupabaseUser] = useState(null);
  const [supabaseProfile, setSupabaseProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Hook mock como fallback
  const mockAuth = useMockAuth();

  // Verificar si Supabase está disponible
  const checkSupabaseAvailability = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        if (error.message.includes('Auth session missing') || error.message.includes('AuthSessionMissingError')) {
          console.log('No Supabase session found, using mock auth');
          setIsSupabaseAvailable(false);
          return false;
        }
        throw error;
      }
      
      if (session && session.user) {
        setIsSupabaseAvailable(true);
        setSupabaseUser(session.user);
        
        // Obtener perfil del usuario
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (!profileError && profile) {
          setSupabaseProfile(profile);
        }
        return true;
      } else {
        setIsSupabaseAvailable(false);
        return false;
      }
    } catch (error) {
      console.log('Supabase not available, using mock auth:', error.message);
      setIsSupabaseAvailable(false);
      return false;
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await checkSupabaseAvailability();
      setLoading(false);
    };
    
    loadData();
  }, [checkSupabaseAvailability]);

  // Escuchar cambios de autenticación de Supabase
  useEffect(() => {
    if (!isSupabaseAvailable) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setSupabaseUser(session.user);
          setIsSupabaseAvailable(true);
          
          // Obtener perfil
          const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (!error && profile) {
            setSupabaseProfile(profile);
          }
        } else if (event === 'SIGNED_OUT') {
          setSupabaseUser(null);
          setSupabaseProfile(null);
          setIsSupabaseAvailable(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [isSupabaseAvailable]);

  // Función de logout híbrida
  const handleLogout = useCallback(async () => {
    try {
      if (isSupabaseAvailable && supabaseUser) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setSupabaseUser(null);
        setSupabaseProfile(null);
        setIsSupabaseAvailable(false);
      } else {
        // Usar logout mock
        await mockAuth.handleLogout();
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback a mock logout
      await mockAuth.handleLogout();
    }
  }, [isSupabaseAvailable, supabaseUser, mockAuth]);

  // Función para actualizar perfil
  const updateProfile = useCallback(async (updates) => {
    try {
      if (isSupabaseAvailable && supabaseUser) {
        const { data, error } = await supabase
          .from('user_profiles')
          .update(updates)
          .eq('id', supabaseUser.id)
          .select()
          .single();

        if (error) throw error;
        setSupabaseProfile(data);
        return data;
      } else {
        // Usar update mock
        return await mockAuth.updateUserRoleInProfile(updates.role);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }, [isSupabaseAvailable, supabaseUser, mockAuth]);

  // Retornar datos híbridos
  return {
    // Usar datos de Supabase si están disponibles, sino usar mock
    user: supabaseUser || mockAuth.user,
    userProfile: supabaseProfile || mockAuth.userProfile,
    loading: loading || mockAuth.loading,
    error: mockAuth.error,
    
    // Funciones
    handleLogout,
    updateProfile,
    refreshUserProfile: mockAuth.refreshUserProfile,
    parseSupabaseError: mockAuth.parseSupabaseError,
    
    // Estados específicos
    isSupabaseAvailable,
    isMockAuth: !isSupabaseAvailable,
    
    // Datos adicionales del mock
    associatedStudentIds: mockAuth.associatedStudentIds,
    primaryChildId: mockAuth.primaryChildId
  };
};

export default useHybridAuth;
