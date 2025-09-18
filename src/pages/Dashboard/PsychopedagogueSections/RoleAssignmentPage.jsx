import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import AssignmentForm from '@/pages/Dashboard/PsychopedagogueSections/components/RoleAssignmentPage/AssignmentForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const RoleAssignmentPage = () => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 min-h-screen text-white"
    >
      <div className="container mx-auto max-w-4xl">
        <Link to="/dashboard" className="inline-flex items-center text-purple-300 hover:text-purple-100 mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          {t('common.backToDashboard')}
        </Link>

        <Card className="bg-slate-800/70 backdrop-blur-md border-slate-700 shadow-2xl">
          <CardHeader className="border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <Users size={32} className="text-pink-400" />
              <div>
                <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                  {t('assignments.title')}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {t('assignments.subtitle')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <AssignmentForm />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default RoleAssignmentPage;