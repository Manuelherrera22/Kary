import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, Info, Target, UserCheck, BookOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Section = ({ title, icon: Icon, children }) => (
  <div className="mb-4">
    <h4 className="flex items-center text-lg font-semibold text-purple-300 mb-2">
      <Icon className="mr-2 h-5 w-5" />
      {title}
    </h4>
    <div className="pl-7 text-slate-300 text-sm">{children}</div>
  </div>
);

const GeneratedPlanViewer = ({ plan }) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  if (!plan) return null;

  const handleActionClick = (action) => {
    toast({
      title: t('common.featureInProgress'),
      description: action + " " + t('common.comingSoon').toLowerCase(),
    });
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700 text-white mt-4">
      <CardHeader>
        <CardTitle>{t('supportPlans.aiGenerator.generatedPlanTitle', { ns: 'supportPlans' })}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full p-4 border border-slate-700 rounded-md">
          <Accordion type="multiple" defaultValue={['diagnosis', 'objectives', 'actions']} className="w-full">
            <AccordionItem value="diagnosis">
              <AccordionTrigger>{t('supportPlans.aiGenerator.planViewerDiagnosis', { ns: 'supportPlans' })}</AccordionTrigger>
              <AccordionContent>{plan.diagnosis || t('common.notAvailable')}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="objectives">
              <AccordionTrigger>{t('supportPlans.aiGenerator.planViewerObjectives', { ns: 'supportPlans' })}</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-1">
                  {plan.objectives?.map((obj, i) => <li key={i}>{obj}</li>) ?? <li>{t('common.notAvailable')}</li>}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="actions">
              <AccordionTrigger>{t('supportPlans.aiGenerator.planViewerActions', { ns: 'supportPlans' })}</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {plan.actions?.map((act, i) => (
                    <li key={i} className="p-2 bg-slate-800 rounded-md">
                      <strong>{act.action}:</strong> {act.responsible || ''}
                    </li>
                  )) ?? <li>{t('common.notAvailable')}</li>}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="tracking">
              <AccordionTrigger>{t('supportPlans.aiGenerator.planViewerTracking', { ns: 'supportPlans' })}</AccordionTrigger>
              <AccordionContent>{plan.tracking || t('common.notAvailable')}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="resources">
              <AccordionTrigger>{t('supportPlans.aiGenerator.planViewerResources', { ns: 'supportPlans' })}</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-1">
                  {plan.resources?.map((res, i) => <li key={i}>{res}</li>) ?? <li>{t('common.notAvailable')}</li>}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => handleActionClick(t('supportPlans.aiGenerator.saveCommentButton', { ns: 'supportPlans' }))}>{t('supportPlans.aiGenerator.saveCommentButton', { ns: 'supportPlans' })}</Button>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => handleActionClick(t('supportPlans.aiGenerator.approveButton', { ns: 'supportPlans' }))}>{t('supportPlans.aiGenerator.approveButton', { ns: 'supportPlans' })}</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneratedPlanViewer;