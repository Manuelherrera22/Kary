import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Loader2, AlertTriangle, CheckCircle, HelpCircle, Info, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AnalysisDisplay = ({ analysisResult, isAnalyzing }) => {
  const { t } = useLanguage();

  const getRiskLevelStyles = (level) => {
    if (!level) return "bg-slate-600 text-slate-100";
    const normalizedLevel = level.toLowerCase();
    switch (normalizedLevel) {
      case 'alto':
        return "bg-red-500 border-red-700 text-white";
      case 'moderado':
        return "bg-orange-500 border-orange-700 text-white";
      case 'bajo':
        return "bg-green-500 border-green-700 text-white";
      case 'sin datos':
      default:
        return "bg-slate-500 border-slate-700 text-white";
    }
  };

  const getRiskLevelIcon = (level) => {
    if (!level) return <HelpCircle size={18} className="mr-1.5" />;
    const normalizedLevel = level.toLowerCase();
    switch (normalizedLevel) {
      case 'alto':
        return <AlertTriangle size={18} className="mr-1.5" />;
      case 'moderado':
        return <Info size={18} className="mr-1.5" />;
      case 'bajo':
        return <CheckCircle size={18} className="mr-1.5" />;
      case 'sin datos':
      default:
        return <HelpCircle size={18} className="mr-1.5" />;
    }
  };

  if (isAnalyzing) {
    return (
      <Card className="bg-slate-800/60 backdrop-blur-md border-slate-700 shadow-xl mt-6">
        <CardHeader>
          <CardTitle className="text-xl text-slate-200 flex items-center">
            <Loader2 size={22} className="mr-2 animate-spin text-sky-400" />
            {t('studentDashboard.personalTrackingPage.analysisInProgressTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400">{t('studentDashboard.personalTrackingPage.analysisInProgressMessage')}</p>
        </CardContent>
      </Card>
    );
  }

  if (!analysisResult) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-slate-800/60 backdrop-blur-md border-slate-700 shadow-xl mt-6">
        <CardHeader>
          <CardTitle className="text-xl text-slate-200 flex items-center">
            <BarChart3 size={22} className="mr-2 text-sky-400" />
            {t('studentDashboard.personalTrackingPage.analysisResultTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-slate-400 text-sm font-medium">{t('studentDashboard.personalTrackingPage.riskLevelLabel')}</Label>
            <Badge className={`mt-1 text-base px-3 py-1 flex items-center w-fit ${getRiskLevelStyles(analysisResult.nivel_riesgo)}`}>
              {getRiskLevelIcon(analysisResult.nivel_riesgo)}
              {analysisResult.nivel_riesgo ? t(`studentDashboard.personalTrackingPage.riskLevels.${analysisResult.nivel_riesgo.toLowerCase().replace(' ', '_')}`, analysisResult.nivel_riesgo) : t('studentDashboard.personalTrackingPage.riskLevels.unknown')}
            </Badge>
          </div>
          <div>
            <Label className="text-slate-400 text-sm font-medium">{t('studentDashboard.personalTrackingPage.suggestionLabel')}</Label>
            <p className="text-slate-200 bg-slate-700/50 p-3 rounded-md mt-1">{analysisResult.sugerencia || t('studentDashboard.personalTrackingPage.noSuggestion')}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnalysisDisplay;