import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomAuth } from '@/lib/customAuth';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const MockAuthContext = createContext(null);

export const MockAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [associatedStudentIds, setAssociatedStudentIds] = useState([]);
  const [primaryChildId, setPrimaryChildId] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  // Verificar si el usuario está autenticado al cargar la página
  useEffect(() => {
    const checkAuth = () => {
      setLoading(true);
      try {
        const currentUser = CustomAuth.getCurrentUser();
        const currentSession = CustomAuth.getCurrentSession();
        
        if (currentUser && currentSession) {
          setUser(currentUser);
          setUserProfile(currentUser);
          
          // Simular vinculación para Ana Rodríguez
          if (currentUser.email === 'padre@kary.com' || currentUser.full_name === 'Ana Rodríguez Madre') {
            setPrimaryChildId('550e8400-e29b-41d4-a716-446655440002');
            setAssociatedStudentIds(['550e8400-e29b-41d4-a716-446655440002']);
            console.log('✅ Ana Rodríguez vinculada con María García');
          }
          
          setLoading(false);
        } else {
          setUser(null);
          setUserProfile(null);
          setPrimaryChildId(null);
          setAssociatedStudentIds([]);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Escuchar cambios en localStorage para actualizar el estado
  useEffect(() => {
    const handleStorageChange = () => {
      const currentUser = CustomAuth.getCurrentUser();
      const currentSession = CustomAuth.getCurrentSession();
      
      if (currentUser && currentSession) {
        setUser(currentUser);
        setUserProfile(currentUser);
        
        // Simular vinculación para Ana Rodríguez
        if (currentUser.email === 'padre@kary.com' || currentUser.full_name === 'Ana Rodríguez Madre') {
          setPrimaryChildId('550e8400-e29b-41d4-a716-446655440002');
          setAssociatedStudentIds(['550e8400-e29b-41d4-a716-446655440002']);
          console.log('✅ Ana Rodríguez vinculada con María García');
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setPrimaryChildId(null);
        setAssociatedStudentIds([]);
      }
    };

    // Verificar inmediatamente al montar el componente
    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Función para cerrar sesión
  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      const result = await CustomAuth.signOut();
      if (result.success) {
        setUser(null);
        setUserProfile(null);
        setAssociatedStudentIds([]);
        setPrimaryChildId(null);
        toast({
          title: t('toasts.logoutSuccessTitle'),
          description: t('toasts.logoutSuccessDescription'),
          className: "bg-blue-500 text-white dark:bg-blue-600"
        });
        navigate('/');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: t('toasts.logoutErrorTitle'),
        description: error.message || 'Error al cerrar sesión',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [navigate, toast, t]);

  // Función para actualizar el perfil de usuario
  const updateUserRoleInProfile = useCallback(async (role) => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await CustomAuth.updateProfile(user.id, { role });
      if (result.success) {
        setUserProfile(result.data);
        setUser(result.data);
        toast({ 
          title: t("roles.roleSetSuccessTitle"), 
          description: t("roles.roleSetSuccessDescription", {role: t(`roles.${role}`)}), 
          className: "bg-green-500 text-white dark:bg-green-600" 
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error setting role:", error);
      toast({ 
        title: t("roles.roleSetErrorTitle"), 
        description: error.message || 'Error al actualizar el rol', 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast, t]);

  // Función para refrescar el perfil de usuario
  const refreshUserProfile = useCallback(async () => {
    try {
      const currentUser = CustomAuth.getCurrentUser();
      const currentSession = CustomAuth.getCurrentSession();
      
      if (currentUser && currentSession) {
        // Solo actualizar si el usuario ha cambiado
        if (!user || user.id !== currentUser.id) {
          setUser(currentUser);
          setUserProfile(currentUser);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
      toast({
        title: t('dashboard.authErrorTitle'),
        description: 'Error al actualizar el perfil',
        variant: 'destructive',
      });
    }
  }, [user, toast, t]);

  // Función para parsear errores (compatibilidad con el hook original)
  const parseSupabaseError = useCallback((error) => {
    if (!error) return t('toasts.genericError');
    if (error.message.includes("Usuario no encontrado")) return t('loginMessages.errorUserNotFound');
    if (error.message.includes("Contraseña incorrecta")) return t('loginMessages.errorInvalidCredentials');
    if (error.message.includes("already exists") || error.message.includes("duplicate")) return t('loginMessages.errorUserAlreadyRegistered');
    if (error.message.includes("Invalid login credentials")) return t('loginMessages.errorInvalidCredentials');
    if (error.message.includes("Email not confirmed")) return t('loginMessages.errorEmailNotConfirmed');
    if (error.message.includes("User already registered")) return t('loginMessages.errorUserAlreadyRegistered');
    if (error.message.includes("User not found")) return t('loginMessages.errorUserNotFound');
    return error.message || t('toasts.genericError');
  }, [t]);

  const value = {
    user,
    userProfile,
    loading,
    handleLogout,
    updateUserRoleInProfile,
    setLoading,
    parseSupabaseError,
    associatedStudentIds,
    primaryChildId,
    refreshUserProfile
  };

  return <MockAuthContext.Provider value={value}>{children}</MockAuthContext.Provider>;
};

export const useMockAuth = () => {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
};
