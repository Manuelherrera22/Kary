import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Mail, KeyRound, AlertCircle, Loader2, Eye, EyeOff, LogIn, Users, Briefcase, Brain, Shield, BookUser } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabaseClient";
import AuthFormHeader from "./LoginForm/components/AuthFormHeader";
import GoogleAuthButton from "./LoginForm/components/GoogleAuthButton";
import FormSeparator from "./LoginForm/components/FormSeparator";
import FormErrorDisplay from "./LoginForm/components/FormErrorDisplay";
import { useAuth } from "@/pages/Dashboard/hooks/useAuth"; // Import useAuth to use parseSupabaseError

const UserRoleSelector = ({ t, userRoles }) => (
  <div>
    <Label htmlFor="role-signup" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
      <Shield size={14} className="mr-1.5 text-purple-500 dark:text-purple-400"/>{t("demoDialog.formRole")}
    </Label>
    <select 
      name="role" 
      id="role-signup" 
      className="mt-1 block w-full py-2.5 px-3 border border-gray-300 bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
      required
    >
      <option value="">{t("demoDialog.formRolePlaceholder")}</option>
      {userRoles.map(role => (
        <option key={role.value} value={role.value}>
          {t(role.labelKey)}
        </option>
      ))}
    </select>
  </div>
);

const EmailAuthFormFields = ({ t, isSignUpFlow, showPassword, setShowPassword, userRoles }) => (
  <>
    {isSignUpFlow && (
      <>
        <div>
          <Label htmlFor="fullName-signup" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <Users size={14} className="mr-1.5 text-purple-500 dark:text-purple-400"/>{t("demoDialog.formFullName")}
          </Label>
          <Input name="fullName" id="fullName-signup" type="text" placeholder={t("demoDialog.formFullNamePlaceholder")} className="mt-1 py-2.5 bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600" required />
        </div>
        <UserRoleSelector t={t} userRoles={userRoles} />
      </>
    )}
    <div>
      <Label htmlFor="email-auth" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
        <Mail size={14} className="mr-1.5 text-purple-500 dark:text-purple-400"/>{t("demoDialog.formEmail")}
      </Label>
      <Input name="email" id="email-auth" type="email" placeholder={t("demoDialog.formEmailPlaceholder")} className="mt-1 py-2.5 bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600" required />
    </div>
    <div>
      <Label htmlFor="password-auth" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
        <KeyRound size={14} className="mr-1.5 text-purple-500 dark:text-purple-400"/>{t("demoDialog.formPassword")}
      </Label>
      <div className="relative">
        <Input name="password" id="password-auth" type={showPassword ? "text" : "password"} placeholder={t("demoDialog.formPasswordPlaceholder")} className="mt-1 py-2.5 pr-10 bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600" required />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  </>
);


const LoginForm = ({ setLoginErrorExt, loginErrorExt, onOpenChange, isSignUpFlow = false, onSignUpSuccess }) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { parseSupabaseError } = useAuth(); 
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoadingEmail(true);
    setLoginErrorExt(null);
    const formData = new FormData(e.target);
    const { email, password, fullName, role } = Object.fromEntries(formData.entries());

    if (!email || !password) {
      setLoginErrorExt(t("loginMessages.errorEmailPasswordRequired"));
      setLoadingEmail(false);
      return;
    }

    if (isSignUpFlow && (!fullName || !role)) {
      setLoginErrorExt(t("loginMessages.errorFullNameRoleRequired"));
      setLoadingEmail(false);
      return;
    }

    try {
      if (isSignUpFlow) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              full_name: fullName,
            }
          }
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
            className: "bg-green-500 text-white dark:bg-green-600"
          });
          if(onSignUpSuccess) onSignUpSuccess();
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
            className: "bg-green-500 text-white dark:bg-green-600"
          });
          onOpenChange(false);
          navigate('/dashboard');
        } else {
          throw new Error(t("toasts.loginErrorUnknown"));
        }
      }
    } catch (error) {
      console.error(`Error during email ${isSignUpFlow ? 'sign up' : 'login'}:`, error);
      const errorMessage = parseSupabaseError(error);
      setLoginErrorExt(errorMessage);
      toast({ title: t(isSignUpFlow ? "toasts.signupErrorTitle" : "toasts.loginErrorTitle"), description: errorMessage, variant: "destructive" });
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    setLoginErrorExt(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error with Google login:', error);
      const errorMessage = parseSupabaseError(error);
      setLoginErrorExt(errorMessage);
      toast({ title: t("toasts.loginErrorTitle"), description: errorMessage, variant: "destructive" });
      setLoadingGoogle(false);
    }
  };
  
  const userRoles = [
    { value: "parent", labelKey: "roles.parent", icon: Users },
    { value: "directive", labelKey: "roles.directive", icon: Briefcase },
    { value: "psychopedagogue", labelKey: "roles.psychopedagogue", icon: Brain },
    { value: "student", labelKey: "roles.student", icon: BookUser }
  ];

  return (
    <>
      <AuthFormHeader isSignUpFlow={isSignUpFlow} t={t} />
      
      {!isSignUpFlow && (
        <>
          <GoogleAuthButton onClick={handleGoogleLogin} loading={loadingGoogle} t={t} />
          <FormSeparator t={t} />
        </>
      )}

      <form onSubmit={handleEmailAuth} className="space-y-5">
        <EmailAuthFormFields t={t} isSignUpFlow={isSignUpFlow} showPassword={showPassword} setShowPassword={setShowPassword} userRoles={userRoles} />
        
        <FormErrorDisplay errorText={loginErrorExt} />
        
        {!isSignUpFlow && (
          <div className="flex items-center justify-between text-sm">
            <a href="#" className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 hover:underline">{t("demoDialog.forgotPasswordLink")}</a>
          </div>
        )}

        <div className="pt-4">
          <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-3 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5" disabled={loadingEmail}>
            {loadingEmail ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
               <><LogIn size={18} className="mr-2" /> {t(isSignUpFlow ? "demoDialog.buttonRegister" : "demoDialog.buttonLogin")}</>
            )}
          </Button>
        </div>
        {!isSignUpFlow && (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {t("demoDialog.accederRedirectText")} <a href="https://demo.karyeduca.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">https://demo.karyeduca.com</a>.
          </p>
        )}
      </form>
    </>
  );
};

export default LoginForm;