import { supabase } from '@/lib/supabaseClient';

export const handleEmailAuthentication = async ({
  email,
  password,
  fullName,
  role,
  isSignUp,
  t,
  toast,
  navigate,
  onOpenChange,
  onSuccess, 
  onError
}) => {
  try {
    if (isSignUp) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (signUpError) throw signUpError;
      if (signUpData.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({ id: signUpData.user.id, full_name: fullName, role: role, updated_at: new Date().toISOString() });
        if (profileError) throw profileError;
        toast({
          title: t("toasts.signupSuccessTitle"),
          description: t("toasts.signupSuccessDescription"),
          className: "bg-green-500 text-white dark:bg-green-600",
        });
        if (onSuccess) onSuccess();
      } else {
        throw new Error(t("toasts.signupErrorUnknown"));
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        toast({
          title: t("toasts.loginSuccessTitle"),
          description: t("toasts.loginSuccessDescription", { userIdentifier: data.user.user_metadata?.full_name || data.user.email }),
          className: "bg-green-500 text-white dark:bg-green-600",
        });
        if (onOpenChange) onOpenChange(false);
        navigate('/dashboard');
        if (onSuccess) onSuccess();
      } else {
        throw new Error(t("toasts.loginErrorUnknown"));
      }
    }
  } catch (error) {
    console.error(`Error during email ${isSignUp ? 'sign up' : 'login'}:`, error);
    let errorMessage = t("loginMessages.errorDefault");
    if (error.message.includes("Invalid login credentials")) errorMessage = t("loginMessages.errorInvalidCredentials");
    else if (error.message.includes("Email not confirmed")) errorMessage = t("loginMessages.errorEmailNotConfirmed");
    else if (error.message.includes("User already registered")) errorMessage = t("loginMessages.errorUserAlreadyRegistered");
    else if (error.message.includes("User not found")) errorMessage = t("loginMessages.errorUserNotFound");
    
    if (onError) onError(errorMessage);
    toast({ title: t(isSignUp ? "toasts.signupErrorTitle" : "toasts.loginErrorTitle"), description: errorMessage, variant: "destructive" });
  }
};

export const handleGoogleAuth = async ({ t, toast, onError }) => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) throw error;
  } catch (error) {
    console.error('Error with Google login:', error);
    const gError = t("loginMessages.errorGoogleLogin") + (error.message ? `: ${error.message}` : '');
    if (onError) onError(gError);
    toast({ title: t("toasts.loginErrorTitle"), description: gError, variant: "destructive" });
  }
};