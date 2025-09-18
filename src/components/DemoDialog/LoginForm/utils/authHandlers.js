import { supabase } from '@/lib/supabaseClient';
import { CustomAuth } from '@/lib/customAuth';

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
      // Usar sistema de autenticación personalizado para registro
      const result = await CustomAuth.signUp({
        email,
        password,
        full_name: fullName,
        role: role || 'student',
        status: 'active'
      });
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast({
        title: t("toasts.signupSuccessTitle"),
        description: t("toasts.signupSuccessDescription"),
        className: "bg-green-500 text-white dark:bg-green-600",
      });
      if (onSuccess) onSuccess();
    } else {
      // Usar sistema de autenticación personalizado para login
      const result = await CustomAuth.signIn(email, password);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast({
        title: t("toasts.loginSuccessTitle"),
        description: t("toasts.loginSuccessDescription", { userIdentifier: result.data.user.full_name || result.data.user.email }),
        className: "bg-green-500 text-white dark:bg-green-600",
      });
      
      if (onOpenChange) onOpenChange(false);
      navigate('/dashboard');
      if (onSuccess) onSuccess();
    }
  } catch (error) {
    console.error(`Error during email ${isSignUp ? 'sign up' : 'login'}:`, error);
    let errorMessage = t("loginMessages.errorDefault");
    
    if (error.message.includes("Usuario no encontrado")) errorMessage = t("loginMessages.errorUserNotFound");
    else if (error.message.includes("Contraseña incorrecta")) errorMessage = t("loginMessages.errorInvalidCredentials");
    else if (error.message.includes("already exists") || error.message.includes("duplicate")) errorMessage = t("loginMessages.errorUserAlreadyRegistered");
    else if (error.message.includes("Invalid login credentials")) errorMessage = t("loginMessages.errorInvalidCredentials");
    else if (error.message.includes("Email not confirmed")) errorMessage = t("loginMessages.errorEmailNotConfirmed");
    else if (error.message.includes("User already registered")) errorMessage = t("loginMessages.errorUserAlreadyRegistered");
    else if (error.message.includes("User not found")) errorMessage = t("loginMessages.errorUserNotFound");
    
    if (onError) onError(errorMessage);
    toast({ title: t(isSignUp ? "toasts.signupErrorTitle" : "toasts.loginErrorTitle"), description: errorMessage, variant: "destructive" });
  }
};

// Funciones simplificadas para usar en EmailAuthForm
export const handleEmailLogin = async (email, password) => {
  const result = await CustomAuth.signIn(email, password);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result;
};

export const handleEmailSignup = async (email, password, fullName) => {
  const result = await CustomAuth.signUp({
    email,
    password,
    full_name: fullName,
    role: 'student',
    status: 'active'
  });
  if (!result.success) {
    throw new Error(result.error);
  }
  return result;
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