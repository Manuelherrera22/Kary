import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import edgeFunctionService from '@/services/edgeFunctionService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Sparkles, AlertTriangle, CheckCircle, ShieldAlert, ShieldCheck, ShieldQuestion, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const EmotionalSupportPlanSection = ({ studentId, studentName }) => {
  const { t } = useLanguage();
  const { user } = useMockAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [planData, setPlanData] = useState(null);
  const [error, setError] = useState(null);

  const handleGeneratePlan = useCallback(async () => {
    if (!studentId) {
      toast({
        title: t('toast.errorTitle'),
        description: t('studentProfilePage.emotionalSupportPlan.studentIdMissing'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setPlanData(null);

    try {
      const { data, error: functionError } = await edgeFunctionService.generateEmotionalSupportPlan({ student_id: studentId });

      if (functionError) {
        throw new Error(functionError.message || t('studentProfilePage.emotionalSupportPlan.errorGeneratingPlan'));
      }

      if (data) {
        setPlanData(data);
        if (data.status === "plan_generado") {
          toast({
            title: t('toast.successTitle'),
            description: t('studentProfilePage.emotionalSupportPlan.planGeneratedSuccess'),
            variant: 'success',
          });
        } else {
           toast({
            title: t('toast.infoTitle'),
            description: data.message || t(`studentProfilePage.emotionalSupportPlan.statusMessages.${data.status}`, { studentName }),
            variant: 'default',
          });
        }
      } else {
        throw new Error(t('studentProfilePage.emotionalSupportPlan.errorNoData'));
      }
    } catch (err) {
      console.error("Error generating emotional support plan:", err);
      setError(err.message);
      toast({
        title: t('toast.errorTitle'),
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [studentId, studentName, t, toast]);

  const getRiskLevelStyles = (riskLevel) => {
    if (!riskLevel) return { Icon: ShieldQuestion, color: 'text-slate-400', bgColor: 'bg-slate-700/30' };
    switch (riskLevel.toLowerCase()) {
      case 'bajo':
        return { Icon: ShieldCheck, color: 'text-green-400', bgColor: 'bg-green-700/30' };
      case 'medio':
        return { Icon: ShieldAlert, color: 'text-yellow-400', bgColor: 'bg-yellow-700/30' };
      case 'alto':
        return { Icon: ShieldAlert, color: 'text-red-400', bgColor: 'bg-red-700/30' };
      default:
        return { Icon: ShieldQuestion, color: 'text-slate-400', bgColor: 'bg-slate-700/30' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-slate-800/70 backdrop-blur-md border-slate-700/50 shadow-xl text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-400 to-pink-400 flex items-center">
            <Sparkles size={24} className="mr-3 text-purple-400" />
            {t('studentProfilePage.emotionalSupportPlan.title')}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {t('studentProfilePage.emotionalSupportPlan.description', { studentName: studentName || t('common.theStudent') })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={handleGeneratePlan}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-base transition-all duration-300 ease-in-out transform hover:scale-105 focus:ring-4 focus:ring-pink-400/50 disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Sparkles size={18} className="mr-2" />
            )}
            {isLoading ? t('common.generating') : t('studentProfilePage.emotionalSupportPlan.generateButton')}
          </Button>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300 flex items-start space-x-3"
            >
              <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{t('toast.errorTitle')}</p>
                <p className="text-sm">{error}</p>
              </div>
            </motion.div>
          )}

          {planData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 p-6 bg-slate-700/40 backdrop-blur-sm rounded-xl border border-slate-600/50 space-y-4"
            >
              {planData.status === "plan_generado" && planData.nivel_riesgo && planData.sugerencia && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-sky-300 mb-1">{t('studentProfilePage.emotionalSupportPlan.riskLevelTitle')}</h3>
                    {(() => {
                      const { Icon, color, bgColor } = getRiskLevelStyles(planData.nivel_riesgo);
                      return (
                        <div className={`flex items-center p-3 rounded-md ${bgColor} border ${color.replace('text-', 'border-')}`}>
                          <Icon size={20} className={`mr-2 ${color}`} />
                          <span className={`font-medium ${color}`}>{planData.nivel_riesgo.charAt(0).toUpperCase() + planData.nivel_riesgo.slice(1)}</span>
                        </div>
                      );
                    })()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-sky-300 mb-1">{t('studentProfilePage.emotionalSupportPlan.suggestionTitle')}</h3>
                    <p className="text-slate-300 whitespace-pre-line bg-slate-600/30 p-3 rounded-md">{planData.sugerencia}</p>
                  </div>
                </>
              )}
              {(planData.status === "sin_alerta" || planData.status === "sin_registros") && (
                 <div className="flex items-center p-4 bg-sky-800/30 border border-sky-700 rounded-lg text-sky-300 space-x-3">
                    <Info size={20} className="flex-shrink-0" />
                    <p>{planData.message || t(`studentProfilePage.emotionalSupportPlan.statusMessages.${planData.status}`, { studentName })}</p>
                 </div>
              )}
               {planData.status && !["plan_generado", "sin_alerta", "sin_registros"].includes(planData.status) && (
                 <div className="flex items-center p-4 bg-yellow-800/30 border border-yellow-700 rounded-lg text-yellow-300 space-x-3">
                    <AlertTriangle size={20} className="flex-shrink-0" />
                    <p>{planData.message || t('studentProfilePage.emotionalSupportPlan.unknownStatus')}</p>
                 </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmotionalSupportPlanSection;