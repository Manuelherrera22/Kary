import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { handleEmailLogin, handleEmailSignup } from '../utils/authHandlers';
import { useToast } from "@/components/ui/use-toast";
import FormErrorDisplay from './FormErrorDisplay';

const EmailAuthForm = ({ isLogin, onOpenChange }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { refreshUserProfile } = useMockAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const parseError = (error) => {
    if (!error) return t('loginMessages.errorDefault');
    if (error.message.includes("Usuario no encontrado")) return t('loginMessages.errorUserNotFound');
    if (error.message.includes("Contraseña incorrecta")) return t('loginMessages.errorInvalidCredentials');
    if (error.message.includes("already exists") || error.message.includes("duplicate")) return t('loginMessages.errorUserAlreadyRegistered');
    if (error.message.includes("Invalid login credentials")) return t('loginMessages.errorInvalidCredentials');
    if (error.message.includes("Email not confirmed")) return t('loginMessages.errorEmailNotConfirmed');
    if (error.message.includes("User already registered")) return t('loginMessages.errorUserAlreadyRegistered');
    if (error.message.includes("User not found")) return t('loginMessages.errorUserNotFound');
    return error.message || t('loginMessages.errorDefault');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await handleEmailLogin(email, password);
        if (result && result.success) {
          // Refrescar el perfil del usuario en el contexto
          await refreshUserProfile();
          
          toast({
            title: t('loginMessages.loginSuccessTitle'),
            description: t('loginMessages.loginSuccessMessage'),
            className: "bg-green-500 text-white dark:bg-green-700"
          });
          // Cerrar el diálogo y navegar al dashboard
          if (onOpenChange) onOpenChange(false);
          // Usar setTimeout para asegurar que la navegación ocurra después del render
          setTimeout(() => {
            navigate('/dashboard');
          }, 100);
        }
      } else {
        const result = await handleEmailSignup(email, password, fullName);
        if (result && result.success) {
          toast({
            title: t('loginMessages.signupSuccessTitle'),
            description: t('loginMessages.signupSuccessMessage'),
            className: "bg-green-500 text-white dark:bg-green-700"
          });
          // Cerrar el diálogo después del registro exitoso
          if (onOpenChange) onOpenChange(false);
        }
      }
    } catch (err) {
      const friendlyError = parseError(err);
      setError(friendlyError);
      toast({
        title: isLogin ? t('loginMessages.errorLoginTitle') : t('loginMessages.errorSignupTitle'),
        description: friendlyError,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium text-slate-300">{t('demoDialog.fullNameLabel')}</Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t('demoDialog.fullNamePlaceholder')}
            required
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-slate-300">{t('demoDialog.emailLabel')}</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('demoDialog.emailPlaceholder')}
          required
          className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-sky-500 focus:border-sky-500"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-slate-300">{t('demoDialog.passwordLabel')}</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isLogin ? t('demoDialog.passwordPlaceholderLogin') : t('demoDialog.passwordPlaceholderSignup')}
          required
          className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-sky-500 focus:border-sky-500"
        />
      </div>
      
      <FormErrorDisplay error={error} />

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold py-3 text-base transition-all duration-300 ease-in-out transform hover:scale-105"
        disabled={isLoading}
      >
        {isLoading ? t('common.loadingText') : (isLogin ? t('demoDialog.loginButton') : t('demoDialog.registerButton'))}
      </Button>
    </motion.form>
  );
};

export default EmailAuthForm;
      </div>
      
      <FormErrorDisplay error={error} />

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold py-3 text-base transition-all duration-300 ease-in-out transform hover:scale-105"
        disabled={isLoading}
      >
        {isLoading ? t('common.loadingText') : (isLogin ? t('demoDialog.loginButton') : t('demoDialog.registerButton'))}
      </Button>
    </motion.form>
  );
};

export default EmailAuthForm;
