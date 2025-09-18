import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardCopy, ShieldAlert, ShieldCheck, ShieldQuestion, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const GeneratedContextDisplay = ({ context, plan, riskLevel, detectedEmotions, criticalEmotions, isPreExisting, setGeneratedContext, t }) => {
  const { toast } = useToast();

  const handleCopyToClipboard = () => {
    const textToCopy = context || JSON.stringify(plan, null, 2);
    navigator.clipboard.writeText(textToCopy)
      .then(() => toast({ title: t('common.copiedToClipboard') }))
      .catch(err => toast({ title: t('common.copyError'), description: err.message, variant: 'destructive' }));
  };

  const getRiskLevelBadge = (level) => {
    if (!level) return null;
    let IconComponent = ShieldQuestion;
    let colorClasses = "bg-slate-500 border-slate-700 text-white";

    switch (level.toLowerCase()) {
      case 'alto':
        IconComponent = ShieldAlert;
        colorClasses = "bg-red-500 border-red-700 text-white";
        break;
      case 'moderado':
      case 'medio':
        IconComponent = ShieldAlert;
        colorClasses = "bg-orange-500 border-orange-700 text-white";
        break;
      case 'bajo':
        IconComponent = ShieldCheck;
        colorClasses = "bg-green-500 border-green-700 text-white";
        break;
      default:
        IconComponent = Info;
        colorClasses = "bg-sky-500 border-sky-700 text-white";
    }
    return (
      <Badge className={`mt-1 text-sm px-3 py-1.5 flex items-center w-fit ${colorClasses}`}>
        <IconComponent size={16} className="mr-1.5" />
        {t(`aiContext.riskLevels.${level.toLowerCase()}`, level)}
      </Badge>
    );
  };

  return (
    <div className="mt-6 p-4 bg-slate-800/70 border border-slate-700 rounded-lg space-y-3 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-cyan-400">{isPreExisting ? t('aiContext.preExistingContextTitle') : t('supportPlans.generateContextModal.generatedContextTitle')}</h4>
        <Button variant="ghost" size="sm" onClick={handleCopyToClipboard} className="text-slate-400 hover:text-cyan-400">
          <ClipboardCopy size={16} className="mr-1.5" /> {t('common.copyButton')}
        </Button>
      </div>
      {riskLevel && (
        <div>
          <Label className="text-slate-300 text-sm mb-1 block">{t('aiContext.riskLevelLabel')}</Label>
          {getRiskLevelBadge(riskLevel)}
        </div>
      )}
      <Textarea
        value={context || plan?.contexto || ''}
        readOnly={isPreExisting}
        onChange={(e) => !isPreExisting && setGeneratedContext(e.target.value)}
        className="min-h-[120px] bg-slate-900 border-slate-600 focus:ring-cyan-500 text-slate-200"
        placeholder={t('supportPlans.generateContextModal.editContextPlaceholder')}
      />
      {detectedEmotions && detectedEmotions.length > 0 && (
        <div className="pt-2">
          <Label className="text-slate-300 text-sm mb-1 block">{t('aiContext.detectedEmotionsLabel')}</Label>
          <div className="flex flex-wrap gap-2">
            {detectedEmotions.map((tag, index) => (
              <Badge key={index} variant={criticalEmotions.includes(tag) ? "destructive" : "secondary"} className={`${criticalEmotions.includes(tag) ? "bg-red-700 text-white" : "bg-slate-700 text-slate-300"}`}>{tag}</Badge>
            ))}
          </div>
        </div>
      )}
      {plan?.steps && plan.steps.length > 0 && (
        <div className="pt-2">
          <Label className="text-slate-300 text-sm mb-1 block">{t('aiContext.suggestedPlanStepsLabel')}</Label>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 bg-slate-900 p-3 rounded-md">
            {plan.steps.map((step, index) => (
              <li key={index}>{step.title || step.description}</li>
            ))}
          </ul>
        </div>
      )}
       {plan?.actions && plan.actions.length > 0 && (
        <div className="pt-2">
          <Label className="text-slate-300 text-sm mb-1 block">{t('aiContext.suggestedActionsLabel')}</Label>
          <ul className="space-y-2 text-sm text-slate-300">
            {plan.actions.map((action, index) => (
              <li key={index} className="p-2 bg-slate-900 rounded-md border border-slate-700">
                <p><strong className="text-slate-200">{t('psychopedagoguePlans.actor')}:</strong> {action.actor}</p>
                <p><strong className="text-slate-200">{t('psychopedagoguePlans.description')}:</strong> {action.description}</p>
                {action.timeline && <p><strong className="text-slate-200">{t('psychopedagoguePlans.timeline')}:</strong> {action.timeline}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GeneratedContextDisplay;