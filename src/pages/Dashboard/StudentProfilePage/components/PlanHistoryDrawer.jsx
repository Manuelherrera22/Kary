import React, { useEffect, useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { History, FileText, Loader2, AlertTriangle, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import GeneratedPlanViewer from './GeneratedPlanViewer';

const PlanHistoryDrawer = ({ isOpen, onOpenChange, studentId }) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    if (isOpen && studentId) {
      const fetchHistory = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('support_plans')
            .select('id, created_at, plan_json, responsible_person_profile:responsible_person(full_name)')
            .eq('student_id', studentId)
            .not('plan_json', 'is', null)
            .order('created_at', { ascending: false });

          if (error) throw error;
          setHistory(data || []);
        } catch (err) {
          console.error("Error fetching plan history:", err);
          toast({
            variant: 'destructive',
            title: t('toast.errorTitle'),
            description: err.message,
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchHistory();
    }
  }, [isOpen, studentId, t, toast]);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPPp', { locale: language === 'es' ? es : undefined });
    } catch {
      return dateString;
    }
  };

  const viewPlan = (plan) => {
    setSelectedPlan(plan);
    setIsViewerOpen(true);
  };
  
  return (
    <>
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="bg-slate-900 border-slate-700 text-white">
          <div className="mx-auto w-full max-w-3xl">
            <DrawerHeader>
              <DrawerTitle className="flex items-center text-xl text-purple-300">
                <History className="mr-2" />
                {t('supportPlans.aiGenerator.planHistoryTitle', { ns: 'supportPlans' })}
              </DrawerTitle>
              <DrawerDescription className="text-slate-400">
                {t('supportPlans.aiGenerator.planHistoryTitle', { ns: 'supportPlans' })}
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <ScrollArea className="h-96">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                  </div>
                ) : history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <AlertTriangle className="h-12 w-12 mb-4" />
                    <p>{t('supportPlans.aiGenerator.noHistory', { ns: 'supportPlans' })}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-md border border-slate-700">
                        <div className="flex items-center">
                          <FileText className="h-6 w-6 mr-4 text-purple-400" />
                          <div>
                            <p className="font-semibold">{t('supportPlans.aiGenerator.generatedBy', { ns: 'supportPlans' })} {item.responsible_person_profile?.full_name || t('common.unknownUser')}</p>
                            <p className="text-xs text-slate-400">{t('supportPlans.aiGenerator.generatedOn', { ns: 'supportPlans' })} {formatDate(item.created_at)}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => viewPlan(item.plan_json)} className="text-purple-300 border-purple-500 hover:bg-purple-500/20">
                           <Eye className="mr-2 h-4 w-4"/> {t('supportPlans.aiGenerator.viewPlan', { ns: 'supportPlans' })}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline" className="text-slate-300 border-slate-600 hover:bg-slate-700">{t('common.closeButton')}</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {selectedPlan && (
         <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
            <DialogContent className="sm:max-w-2xl bg-slate-800 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle>{t('supportPlans.aiGenerator.planViewerTitle', { ns: 'supportPlans' })}</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        {t('supportPlans.aiGenerator.planViewerDescription', { ns: 'supportPlans' })}
                    </DialogDescription>
                </DialogHeader>
                <GeneratedPlanViewer plan={selectedPlan} />
            </DialogContent>
         </Dialog>
      )}
    </>
  );
};

export default PlanHistoryDrawer;