import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Bot, AlertTriangle } from 'lucide-react';
import * as edgeFunctionService from '@/services/edgeFunctionService';

const iconMapping = {
  planes_de_apoyo: <FileText className="w-6 h-6 text-blue-500" />,
  sugerencias_kary: <Bot className="w-6 h-6 text-purple-500" />,
  casos_escalados: <AlertTriangle className="w-6 h-6 text-red-500" />,
};

const ProgramCoordinatorSummary = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await edgeFunctionService.invokeEdgeFunction('get-dashboard-summary', { role: 'program_coordinator' });

        if (error) {
          throw new Error(error.message);
        }
        
        if (data) {
          setSummaryData(data);
          toast({
            title: t('toasts.successTitle', { ns: 'toasts' }),
            description: t('programCoordinatorDashboard.fetchSuccess', { ns: 'programCoordinatorDashboard' }),
          });
        }
      } catch (error) {
        console.error('Error fetching program coordinator summary:', error);
        toast({
          variant: 'destructive',
          title: t('toasts.errorTitle', { ns: 'toasts' }),
          description: t('programCoordinatorDashboard.fetchError', { ns: 'programCoordinatorDashboard' }),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [user, t, toast, language]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-6 w-3/5" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-1/4 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (!summaryData || summaryData.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
      {summaryData.map((item, index) => (
        <motion.div
          key={item.categoria}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t(`programCoordinatorDashboard.summaryCategories.${item.categoria}`, { ns: 'programCoordinatorDashboard' })}
              </CardTitle>
              {iconMapping[item.categoria] || <FileText className="w-6 h-6 text-gray-500" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.cantidad}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ProgramCoordinatorSummary;