import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [associatedStudentIds, setAssociatedStudentIds] = useState([]);
  const [primaryChildId, setPrimaryChildId] = useState(null); 
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const parseSupabaseError = (error) => {
    if (!error) return t('toasts.genericError');
    if (error.message.includes("Invalid login credentials")) return t('loginMessages.errorInvalidCredentials');
    if (error.message.includes("Email not confirmed")) return t('loginMessages.errorEmailNotConfirmed');
    if (error.message.includes("User already registered")) return t('loginMessages.errorUserAlreadyRegistered');
    if (error.message.includes("password should be at least 6 characters")) return t('loginMessages.errorPasswordLength');
    if (error.message.includes("Unable to validate email address")) return t('loginMessages.errorInvalidEmail');
    if (error.message.includes("updated_at")) return t('toasts.columnMissingError', { column: 'updated_at'});
    
    console.error("Supabase error details:", error);
    return error.message || t('toasts.genericError');
  };

  const fetchUserMappings = useCallback(async (userId, role) => {
    let studentIds = [];
    let firstChildId = null;

    if (role === 'parent') {
      const { data, error } = await supabase
        .from('parent_student_links')
        .select('student_user_id')
        .eq('parent_user_id', userId);
      if (error) {
        console.error('Error fetching parent-student links:', error);
      } else if (data) {
        studentIds = data.map(m => m.student_user_id);
        if (data.length > 0) {
          firstChildId = data[0].student_user_id;
        }
      }
    } else if (role === 'psychopedagogue') {
      const { data, error } = await supabase
        .from('psychopedagogue_student_mapping')
        .select('student_user_id')
        .eq('psychopedagogue_user_id', userId);
      if (error) console.error('Error fetching psychopedagogue-student mappings:', error);
      else if (data) {
        studentIds = data.map(m => m.student_user_id);
      }
    }
    
    setAssociatedStudentIds(studentIds);
    setPrimaryChildId(firstChildId); 
  }, []);

  const fetchUserProfile = useCallback(async (userId) => {
    // setLoading(true); // Potential issue: setLoading(true) here can cause issues if called multiple times. Moved to specific handlers.
    try {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('id, role, full_name, status, grade, admission_date, email, created_at, updated_at, language, timezone, notifications_enabled') 
          .eq('id', userId)
          .single(); 

        if (profileError) { 
          if (profileError.code === 'PGRST116') { 
            console.warn(`No profile found for user ${userId}, or multiple profiles returned. This might be expected for a new user.`);
            return null; 
          }
          console.error('Error fetching user profile:', profileError);
          throw profileError;
        }
        return profile;
    } finally {
        // setLoading(false); // Ensure loading is set to false in the calling function after all operations
    }
  }, []);

  const refreshUserProfile = useCallback(async () => {
    if (user?.id) {
      setLoading(true);
      try {
        const profile = await fetchUserProfile(user.id);
        setUserProfile(profile);
        if (profile?.id && profile?.role) {
          await fetchUserMappings(profile.id, profile.role);
        } else {
          setAssociatedStudentIds([]);
          setPrimaryChildId(null);
        }
      } catch (error) {
        toast({
          title: t('dashboard.authErrorTitle'),
          description: parseSupabaseError(error),
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
  }, [user, fetchUserProfile, fetchUserMappings, t, toast]);


  const createOrUpdateGoogleUserProfile = useCallback(async (googleUser) => {
    const profilePayload = { 
      id: googleUser.id, 
      full_name: googleUser.user_metadata?.full_name || googleUser.email?.split('@')[0],
      email: googleUser.email,
      updated_at: new Date().toISOString(),
      status: 'active' 
    };
    
    const { data: existingProfile, error: existingProfileError } = await supabase
        .from('user_profiles')
        .select('created_at')
        .eq('id', googleUser.id)
        .maybeSingle();

    if (existingProfileError) {
        console.error('Error checking existing profile:', existingProfileError);
        throw existingProfileError;
    }
    
    if (!existingProfile) {
        profilePayload.created_at = new Date().toISOString();
    }
    
    const { data: newProfile, error: upsertError } = await supabase
      .from('user_profiles')
      .upsert(profilePayload, { onConflict: 'id', ignoreDuplicates: false })
      .select('id, role, full_name, status, grade, admission_date, email, created_at, updated_at, language, timezone, notifications_enabled')
      .single(); 
    
    if (upsertError) {
      console.error('Error creating/updating profile for Google user:', upsertError);
      throw upsertError;
    }
    return newProfile;
  }, []);
  
  const handleAuthStateChange = useCallback(async (event, session) => {
    setLoading(true); // Start loading on auth state change
    if (session?.user) {
      setUser(session.user);
      let profile = null;
      try {
        profile = await fetchUserProfile(session.user.id);
        if (!profile && (session.user.app_metadata?.provider === 'google' || session.user.user_metadata?.iss?.includes('google.com'))) {
          profile = await createOrUpdateGoogleUserProfile(session.user);
        }
        setUserProfile(profile);
        if (profile?.id && profile?.role) {
          await fetchUserMappings(profile.id, profile.role);
        } else {
          setAssociatedStudentIds([]);
          setPrimaryChildId(null);
        }
      } catch (error) {
         toast({
          title: t('dashboard.authErrorTitle'),
          description: parseSupabaseError(error),
          variant: 'destructive',
        });
        setUserProfile(null); 
        setAssociatedStudentIds([]);
        setPrimaryChildId(null);
      }
    } else {
      setUser(null);
      setUserProfile(null);
      setAssociatedStudentIds([]);
      setPrimaryChildId(null);
      if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    }
    setLoading(false); // Always set loading to false after processing
  }, [fetchUserProfile, createOrUpdateGoogleUserProfile, fetchUserMappings, navigate, t, toast]);

  useEffect(() => {
    setLoading(true); // Set loading true when component mounts
    const fetchInitialSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        await handleAuthStateChange(session ? 'SIGNED_IN' : 'NO_SESSION', session);
        // setLoading(false) is handled in handleAuthStateChange
      } catch (error) {
        console.error('Error fetching initial session or profile:', error);
        setUser(null);
        setUserProfile(null);
        setAssociatedStudentIds([]);
        setPrimaryChildId(null);
        if (window.location.pathname.startsWith('/dashboard')) {
          navigate('/'); 
        }
        setLoading(false); // Ensure loading is false on error
      }
    };

    fetchInitialSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      handleAuthStateChange(event, session);
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };

  }, [handleAuthStateChange, navigate]); // handleAuthStateChange is stable due to useCallback

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: t('toasts.logoutSuccessTitle'),
        description: t('toasts.logoutSuccessDescription'),
        className: "bg-blue-500 text-white dark:bg-blue-600"
      });
      // setUser, setUserProfile, etc., will be handled by onAuthStateChange
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: t('toasts.logoutErrorTitle'),
        description: parseSupabaseError(error),
        variant: 'destructive',
      });
    } finally {
      setLoading(false); // Ensure loading is false after logout attempt
    }
  };
  
  const updateUserRoleInProfile = async (role) => {
    if (!user) return;
    setLoading(true);
    try {
      const profilePayload = { 
        id: user.id, 
        role: role, 
        full_name: userProfile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0],
        email: user.email, 
        updated_at: new Date().toISOString(),
        status: userProfile?.status || 'active'
      };

      const { data: existingProfile, error: existingProfileError } = await supabase
        .from('user_profiles')
        .select('created_at')
        .eq('id', user.id)
        .maybeSingle();
      
      if (existingProfileError) {
        throw existingProfileError;
      }

      if (!existingProfile) {
        profilePayload.created_at = new Date().toISOString();
      }
      
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profilePayload, { onConflict: 'id', ignoreDuplicates: false })
        .select('id, role, full_name, status, grade, admission_date, email, created_at, updated_at, language, timezone, notifications_enabled')
        .single(); 

      if (error) throw error;
      setUserProfile(data);
      if (data?.id && data?.role) {
        await fetchUserMappings(data.id, data.role);
      }
      toast({ title: t("roles.roleSetSuccessTitle"), description: t("roles.roleSetSuccessDescription", {role: t(`roles.${role}`)}), className: "bg-green-500 text-white dark:bg-green-600" });
    } catch (error) {
      console.error("Error setting role:", error);
      toast({ title: t("roles.roleSetErrorTitle"), description: parseSupabaseError(error), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    handleLogout,
    updateUserRoleInProfile,
    setLoading, // Export setLoading for external control if needed, though generally not recommended
    parseSupabaseError,
    associatedStudentIds,
    primaryChildId,
    refreshUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};