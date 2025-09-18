import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, CheckCircle, Users, Briefcase, Brain, Shield, BookUser, UserCog } from 'lucide-react';

const RoleSelectionScreen = ({ onSelectRole, loading: authLoading, userName }) => {
  const { t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    { value: 'parent', labelKey: 'roles.parent', icon: Users },
    { value: 'directive', labelKey: 'roles.directive', icon: Briefcase },
    { value: 'psychopedagogue', labelKey: 'roles.psychopedagogue', icon: Brain },
    { value: 'student', labelKey: 'roles.student', icon: BookUser },
    { value: 'teacher', labelKey: 'roles.teacher', icon: UserCog }, // Assuming UserCog or similar for teacher
    { value: 'program_coordinator', labelKey: 'roles.program_coordinator', icon: Shield } // Assuming Shield or similar for program_coordinator
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;
    setIsSubmitting(true);
    await onSelectRole(selectedRole);
    setIsSubmitting(false);
  };
  
  const nameToDisplay = userName || t('dashboard.defaultUserName');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500 p-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20"
      >
        <div className="text-center mb-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-300 mb-4" />
          <h1 className="text-3xl font-bold mb-2">{t('roles.selectRoleTitle')}</h1>
          <p className="text-purple-200">
            {t('roles.selectRoleSubtitleForUser', { userName: nameToDisplay })}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-purple-100 mb-1">
              {t('demoDialog.roleLabel')}
            </label>
            <select
              id="role"
              name="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg shadow-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-colors placeholder-purple-300 text-white"
            >
              <option value="" disabled className="text-gray-500 bg-purple-900">
                {t('demoDialog.rolePlaceholder')}
              </option>
              {roles.map((role) => (
                <option key={role.value} value={role.value} className="text-gray-800 bg-white">
                  {t(role.labelKey)}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            disabled={authLoading || isSubmitting || !selectedRole}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {(authLoading || isSubmitting) && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {t('buttons.saveButton')} 
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default RoleSelectionScreen;