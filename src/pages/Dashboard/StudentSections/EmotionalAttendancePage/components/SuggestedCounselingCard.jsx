import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const SuggestedCounselingCard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md border-purple-600 shadow-2xl mt-8">
        <CardHeader>
          <CardTitle className="text-xl text-purple-300 flex items-center">
            <Info size={22} className="mr-2" />
            {t('emotionalAttendance.counseling.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-300">
            {t('emotionalAttendance.counseling.message')}
          </p>
          <Button
            onClick={() => navigate('/dashboard/kary-chat')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
          >
            <MessageSquare size={18} className="mr-2" />
            {t('emotionalAttendance.counseling.actionButton')}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SuggestedCounselingCard;