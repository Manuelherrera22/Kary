import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, TrendingUp, Lightbulb, Lock, Settings2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AIInsightCard = ({ titleKey, descriptionKey, icon: Icon, comingSoon = true, onToggle, isEnabled, toggleId }) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleToggle = () => {
    if (comingSoon) {
      toast({
        title: t('common.comingSoon'),
        description: t(titleKey) + " - " + t('studentProfilePage.futureAI.toggleComingSoon'),
      });
    } else if (onToggle) {
      onToggle(!isEnabled);
    }
  };

  return (
    <div className="bg-slate-700/40 p-4 rounded-lg border border-slate-600/50 hover:shadow-lg transition-shadow relative overflow-hidden">
      {comingSoon && (
        <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
          {t('common.comingSoon')}
        </div>
      )}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          <Icon size={22} className="mr-3 text-purple-400" />
          <h3 className="text-md font-semibold text-slate-100">{t(titleKey)}</h3>
        </div>
        {!comingSoon && onToggle && (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Switch
                  id={toggleId}
                  checked={isEnabled}
                  onCheckedChange={handleToggle}
                  className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-slate-600"
                  aria-label={t('studentProfilePage.futureAI.toggleSuggestion')}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-slate-800 text-white border-slate-700">
                <p>{isEnabled ? t('studentProfilePage.futureAI.disableSuggestion') : t('studentProfilePage.futureAI.enableSuggestion')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <p className="text-sm text-slate-400 mb-3">{t(descriptionKey)}</p>
      {comingSoon && (
        <div className="flex items-center text-xs text-purple-300">
          <Lock size={12} className="mr-1" />
          <span>{t('studentProfilePage.futureAI.featureLocked')}</span>
        </div>
      )}
    </div>
  );
};

const StudentFutureAISection = ({ studentId, currentUserRole }) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  // Placeholder states for toggles if they were functional
  const [piarSuggestionsEnabled, setPiarSuggestionsEnabled] = React.useState(false);
  const [riskPredictionEnabled, setRiskPredictionEnabled] = React.useState(false);
  const [blockSuggestionsEnabled, setBlockSuggestionsEnabled] = React.useState(false);

  const aiInsights = [
    { id: "piarSuggestions", titleKey: "studentProfilePage.futureAI.piarSuggestions", descriptionKey: "studentProfilePage.futureAI.piarSuggestionsDesc", icon: Lightbulb, onToggle: setPiarSuggestionsEnabled, isEnabled: piarSuggestionsEnabled, comingSoon: true },
    { id: "riskPrediction", titleKey: "studentProfilePage.futureAI.riskPrediction", descriptionKey: "studentProfilePage.futureAI.riskPredictionDesc", icon: Zap, onToggle: setRiskPredictionEnabled, isEnabled: riskPredictionEnabled, comingSoon: true },
    { id: "blockSuggestions", titleKey: "studentProfilePage.futureAI.blockSuggestions", descriptionKey: "studentProfilePage.futureAI.blockSuggestionsDesc", icon: Settings2, onToggle: setBlockSuggestionsEnabled, isEnabled: blockSuggestionsEnabled, comingSoon: true },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="bg-slate-800/60 border-slate-700/70 text-white shadow-xl hover:shadow-indigo-500/10 transition-shadow duration-300">
        <CardHeader className="border-b border-slate-700/50 pb-4">
          <div className="flex items-center">
            <Brain size={28} className="mr-3 text-indigo-400" />
            <div>
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">
                {t('studentProfilePage.futureAI.title')} ({t('common.comingSoon')})
              </CardTitle>
              <CardDescription className="text-slate-400">{t('studentProfilePage.futureAI.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiInsights.map((insight) => (
              <AIInsightCard 
                key={insight.id}
                titleKey={insight.titleKey}
                descriptionKey={insight.descriptionKey}
                icon={insight.icon}
                comingSoon={insight.comingSoon}
                onToggle={insight.onToggle}
                isEnabled={insight.isEnabled}
                toggleId={`ai-toggle-${insight.id}`}
              />
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              {t('studentProfilePage.futureAI.developmentNote')}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentFutureAISection;