import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ClipboardCheck, Users, Flag, MessageSquare, Edit, Calendar, User, Target, Zap, ListChecks, BookOpen, CheckCircle2, Loader2 } from 'lucide-react';

const blockConfig = {
  diagnosis: { icon: ClipboardCheck, color: 'text-blue-400', titleKey: 'supportPlans.aiCanvas.blockTypes.diagnosis' },
  recommendations: { icon: Users, color: 'text-yellow-400', titleKey: 'supportPlans.aiCanvas.blockTypes.recommendations' },
  emotionalSupport: { icon: Users, color: 'text-pink-400', titleKey: 'supportPlans.aiCanvas.blockTypes.emotionalSupport' },
  familyTips: { icon: Users, color: 'text-green-400', titleKey: 'supportPlans.aiCanvas.blockTypes.familyTips' },
  trackingIndicators: { icon: Flag, color: 'text-red-400', titleKey: 'supportPlans.aiCanvas.blockTypes.trackingIndicators' },
  custom: { icon: MessageSquare, color: 'text-purple-400', titleKey: 'supportPlans.aiCanvas.blockTypes.custom' },
  default: { icon: Edit, color: 'text-slate-400', titleKey: 'supportPlans.aiCanvas.blockTypes.default' },
  support_goal: { icon: Target, color: 'text-indigo-400', titleKey: 'supportPlans.goalLabel' },
  support_strategy: { icon: Zap, color: 'text-teal-400', titleKey: 'supportPlans.strategyLabel' },
  activities: { icon: ListChecks, color: 'text-orange-400', titleKey: 'supportPlans.aiGenerator.activitiesLabel' },
  resources: { icon: BookOpen, color: 'text-lime-400', titleKey: 'supportPlans.aiGenerator.resourcesLabel' },
};


const DetailedPlanModal = ({ isOpen, onOpenChange, plan, onForceCompletePlan, currentUserRole }) => {
  const { t, language } = useLanguage();

  if (!plan) return null;

  const formatDate = (dateString) => {
    if (!dateString) return t('common.notAvailableShort');
    try {
      const date = parseISO(dateString);
      return format(date, 'PPP', { locale: language === 'es' ? es : undefined });
    } catch (error) {
      return dateString;
    }
  };

  const planJson = plan.plan_json || {};
  let blocksToDisplay = [];

  if (Array.isArray(planJson)) {
    blocksToDisplay = planJson;
  } else if (typeof planJson === 'object' && planJson !== null) {
    // Attempt to convert object structure to block array if possible
    Object.keys(planJson).forEach(key => {
      const config = blockConfig[key] || blockConfig.default;
      blocksToDisplay.push({
        key: key,
        title: planJson[key]?.title || t(config.titleKey, key.replace(/_/g, ' ')),
        content: planJson[key]?.content || planJson[key],
      });
    });
  }
  
  const isPlanActive = plan.status === 'active' || plan.status === 'inprogress' || plan.status === 'en_progreso' || plan.status === 'pendiente';
  const canForceComplete = ['psychopedagogue', 'admin', 'program_coordinator'].includes(currentUserRole);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl md:max-w-3xl bg-slate-800 border-slate-700 text-slate-100 shadow-2xl rounded-xl">
        <DialogHeader className="pb-4 border-b border-slate-700">
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-500">
            {t('supportPlans.detailModal.detailedPlanTitle')}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {plan.student?.full_name || plan.student_name || t('common.student')} - {t(`supportPlans.statusValues.${plan.status?.toLowerCase() || 'notavailable'}`, plan.status)}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] p-1 custom-scrollbar">
          <div className="space-y-6 p-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-700/40 p-3 rounded-lg">
                <p className="text-slate-400 font-medium flex items-center"><Calendar size={14} className="mr-2 text-sky-400" />{t('supportPlans.startDateLabel')}:</p>
                <p className="text-slate-200">{formatDate(plan.start_date)}</p>
              </div>
              <div className="bg-slate-700/40 p-3 rounded-lg">
                <p className="text-slate-400 font-medium flex items-center"><Calendar size={14} className="mr-2 text-sky-400" />{t('supportPlans.endDateLabel')}:</p>
                <p className="text-slate-200">{formatDate(plan.end_date)}</p>
              </div>
              <div className="bg-slate-700/40 p-3 rounded-lg">
                <p className="text-slate-400 font-medium flex items-center"><User size={14} className="mr-2 text-sky-400" />{t('supportPlans.responsiblePersonLabel')}:</p>
                <p className="text-slate-200">{plan.responsible_person_profile?.full_name || t('common.notAssigned')}</p>
              </div>
               <div className="bg-slate-700/40 p-3 rounded-lg">
                <p className="text-slate-400 font-medium flex items-center"><User size={14} className="mr-2 text-sky-400" />{t('supportPlans.statusLabel')}:</p>
                <p className="text-slate-200">{t(`supportPlans.statusValues.${plan.status?.toLowerCase() || 'notavailable'}`, plan.status)}</p>
              </div>
            </div>

            {plan.support_goal && (
              <div className="bg-slate-700/40 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-indigo-400 flex items-center mb-2"><Target size={18} className="mr-2" />{t('supportPlans.goalLabel')}</h4>
                <p className="text-slate-300 whitespace-pre-line">{plan.support_goal}</p>
              </div>
            )}
            {plan.support_strategy && (
              <div className="bg-slate-700/40 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-teal-400 flex items-center mb-2"><Zap size={18} className="mr-2" />{t('supportPlans.strategyLabel')}</h4>
                <p className="text-slate-300 whitespace-pre-line">{plan.support_strategy}</p>
              </div>
            )}

            {blocksToDisplay.map((block, index) => {
                const config = blockConfig[block.key] || blockConfig.default;
                const Icon = config.icon;
                return (
                    <div key={block.id || `block-${index}`} className="bg-slate-700/40 p-4 rounded-lg">
                        <h4 className={`text-lg font-semibold ${config.color} flex items-center mb-2`}>
                            <Icon size={18} className="mr-2" />
                            {block.title || t(config.titleKey, block.key)}
                        </h4>
                        {typeof block.content === 'string' ? (
                            <p className="text-slate-300 whitespace-pre-line">{block.content}</p>
                        ) : (
                            <pre className="text-sm whitespace-pre-wrap p-3 bg-slate-800/50 rounded-md border border-slate-700 text-slate-300">{JSON.stringify(block.content, null, 2)}</pre>
                        )}
                    </div>
                );
            })}

            {plan.acciones_realizadas && (
              <div className="bg-slate-700/40 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-orange-400 flex items-center mb-2"><ListChecks size={18} className="mr-2" />{t('psychopedagoguePlans.actionsTaken')}</h4>
                <pre className="text-sm whitespace-pre-wrap p-3 bg-slate-800/50 rounded-md border border-slate-700 text-slate-300">
                  {typeof plan.acciones_realizadas === 'string' ? plan.acciones_realizadas : JSON.stringify(plan.acciones_realizadas, null, 2)}
                </pre>
              </div>
            )}

            {plan.fecha_ultimo_seguimiento && (
               <div className="bg-slate-700/40 p-3 rounded-lg">
                <p className="text-slate-400 font-medium flex items-center"><Calendar size={14} className="mr-2 text-sky-400" />{t('psychopedagoguePlans.lastFollowUp')}:</p>
                <p className="text-slate-200">{formatDate(plan.fecha_ultimo_seguimiento)}</p>
              </div>
            )}


          </div>
        </ScrollArea>
        <DialogFooter className="pt-4 border-t border-slate-700 flex justify-between">
           {isPlanActive && canForceComplete && (
             <Button
                onClick={() => onForceCompletePlan(plan)}
                variant="outline"
                className="border-green-500 text-green-400 hover:bg-green-500/10 hover:text-green-300"
             >
                <CheckCircle2 size={16} className="mr-2" />
                {t('supportPlans.forceCompleteButton')}
             </Button>
            )}
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-300 hover:bg-slate-700">
              {t('common.closeButton')}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailedPlanModal;