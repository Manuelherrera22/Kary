import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Edit } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const EvaluationList = ({ evaluations, onEdit }) => {
  const { t, language } = useLanguage();

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return format(date, 'PPP', { locale: language === 'es' ? es : undefined });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {evaluations.map((evaluation, index) => (
        <motion.div
          key={evaluation.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="bg-slate-800/80 border-slate-700 shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300 h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-purple-300">{evaluation.title}</CardTitle>
              <FileText className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">
                  {t('evaluations.student')}: <span className="font-medium text-slate-200">{evaluation.student_name}</span>
                </p>
                <p className="text-sm text-slate-400 mb-4">
                  {t('evaluations.date')}: <span className="font-medium text-slate-200">{formatDate(evaluation.evaluation_date)}</span>
                </p>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-sm text-slate-400">{t('evaluations.status')}:</span>
                  <Badge variant={getStatusVariant(evaluation.status)}>
                    {t(`evaluations.statuses.${evaluation.status}`)}
                  </Badge>
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-300">{t('evaluations.tests')}: {evaluation.tests?.length || 0}</p>
                    <p className="text-sm font-medium text-slate-300">{t('evaluations.comments')}: {evaluation.comments?.length || 0}</p>
                </div>
              </div>
              <Button onClick={() => onEdit(evaluation)} className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                <Edit size={16} className="mr-2" />
                {t('common.viewOrEdit')}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default EvaluationList;