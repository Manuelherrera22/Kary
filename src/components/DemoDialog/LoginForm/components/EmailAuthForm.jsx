import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { handleEmailLogin, handleEmailSignup } from '../utils/authHandlers';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { useToast } from "@/components/ui/use-toast";
import FormErrorDisplay from './FormErrorDisplay';

const EmailAuthForm = ({ isLogin }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { parseSupabaseError } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        await handleEmailLogin(email, password);
        toast({
          title: t('loginMessages.loginSuccessTitle'),
          description: t('loginMessages.loginSuccessMessage'),
          className: "bg-green-500 text-white dark:bg-green-700"
        });
      } else {
        await handleEmailSignup(email, password, fullName);
         toast({
          title: t('loginMessages.signupSuccessTitle'),
          description: t('loginMessages.signupSuccessMessage'),
          className: "bg-green-500 text-white dark:bg-green-700"
        });
      }
      // Dialog will be closed by parent component on successful auth state change
    } catch (err) {
      const friendlyError = parseSupabaseError(err);
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