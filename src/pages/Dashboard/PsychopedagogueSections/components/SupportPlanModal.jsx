import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar as CalendarIcon, Loader2, FileText, BrainCircuit, Save, AlertCircle, Activity, CalendarDays, Clock, UserCheck, Users, Lightbulb, Heart, Flag, ClipboardCheck, MessageSquare, Edit3 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, parseISO, isValid } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import PlanEditor from './CreateSupportPlanCanvas/PlanEditor'; 
import { useToast } from '@/components/ui/use-toast';

const blockIcons = {
  diagnosis: ClipboardCheck,
  recommendations: Lightbulb,
  emotionalSupport: Heart,
  familyTips: Users,
  trackingIndicators: Flag,
  custom: MessageSquare,
  default: FileText,
};


const SupportPlanModal = ({ isOpen, onOpenChange, editingPlan, onSubmit, isSubmitting, students, selectedStudentId: preselectedStudentIdForModal }) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const dateLocale = language === 'es' ? es : enUS;
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editablePlanBlocks, setEditablePlanBlocks] = useState([]);

  const schema = z.object({
    student_id: z.string().min(1, t('supportPlans.errorNoStudentId')),
    support_goal: z.string().min(5, t('common.minLength', { length: 5 })).max(255, t('common.maxLength', { length: 255 })),
    support_strategy: z.string().min(5, t('common.minLength', { length: 5 })).max(1000, t('common.maxLength', { length: 1000 })),
    start_date: z.date().optional().nullable(),
    end_date: z.date().optional().nullable(),
    status: z.string().min(1, t('common.requiredField')),
    plan_json: z.any().optional(),
  }).refine(data => !data.end_date || !data.start_date || data.end_date >= data.start_date, {
    message: t('common.endDateAfterStartDate'),
    path: ["end_date"],
  });

  const { control, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      student_id: '',
      support_goal: '',
      support_strategy: '',
      start_date: null,
      end_date: null,
      status: 'draft',
      plan_json: null,
    }
  });
  
  const currentStudentId = watch('student_id');

  useEffect(() => {
    if (isOpen) {
      if (editingPlan) {
        const planData = {
          ...editingPlan,
          student_id: editingPlan.student_id || preselectedStudentIdForModal || '',
          start_date: editingPlan.start_date && isValid(parseISO(editingPlan.start_date)) ? parseISO(editingPlan.start_date) : null,
          end_date: editingPlan.end_date && isValid(parseISO(editingPlan.end_date)) ? parseISO(editingPlan.end_date) : null,
          plan_json: editingPlan.plan_json || null,
        };
        reset(planData);
        setEditablePlanBlocks(Array.isArray(editingPlan.plan_json) ? editingPlan.plan_json : []);
        setIsEditingMode(false); // Default to view mode when opening
      } else {
        reset({
          student_id: preselectedStudentIdForModal || '',
          support_goal: '',
          support_strategy: '',
          start_date: new Date(),
          end_date: null,
          status: 'draft',
          plan_json: [],
        });
        setEditablePlanBlocks([]);
        setIsEditingMode(true); // Default to edit mode for new plans
      }
    }
  }, [isOpen, editingPlan, reset, preselectedStudentIdForModal]);

  const statusOptions = [
    { value: 'draft', label: t('supportPlans.statusValues.draft') },
    { value: 'active', label: t('supportPlans.statusValues.active') },
    { value: 'inprogress', label: t('supportPlans.statusValues.inprogress') },
    { value: 'completed', label: t('supportPlans.statusValues.completed') },
    { value: 'paused', label: t('supportPlans.statusValues.paused') },
    { value: 'cancelled', label: t('supportPlans.statusValues.cancelled') },
  ];

  const handleFormSubmit = (data) => {
    const submissionData = {
      ...data,
      start_date: data.start_date && isValid(data.start_date) ? format(data.start_date, 'yyyy-MM-dd') : null,
      end_date: data.end_date && isValid(data.end_date) ? format(data.end_date, 'yyyy-MM-dd') : null,
      plan_json: editablePlanBlocks, // Use the state for plan_json
    };
    onSubmit(submissionData);
    setIsEditingMode(false); // Revert to view mode after submit
  };
  
  const handleSavePlanBlocks = (blocks, assign = false) => {
     setEditablePlanBlocks(blocks);
     toast({ title: t('toast.successTitle'), description: t('supportPlans.aiCanvas.planBlocksUpdated') });
     // The actual save to DB will happen on main form submit
  };


  const formatDateForDisplay = (date) => {
    if (!date || !isValid(date)) return t('common.notSpecified');
    try {
      return format(date, 'PPP', { locale: dateLocale });
    } catch (error) {
      return t('common.invalidDate');
    }
  };

  const getStatusDisplay = (statusValue) => {
    const statusKey = statusValue ? statusValue.toLowerCase().replace(/\s+/g, '') : 'notavailable';
    return t(`supportPlans.statusValues.${statusKey}`, statusValue || t('common.notAvailable'));
  };

  const getStatusBadgeVariant = (statusValue) => {
    const statusKey = statusValue ? statusValue.toLowerCase().replace(/\s+/g, '') : 'notavailable';
    switch (statusKey) {
      case 'active': return 'success';
      case 'completed': return 'info';
      case 'inprogress': return 'warning';
      case 'paused': return 'attention';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const planJsonToDisplay = watch('plan_json');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { reset(); setIsEditingMode(false); } onOpenChange(open); }}>
      <DialogContent className="max-w-2xl md:max-w-3xl lg:max-w-4xl bg-slate-900/90 backdrop-blur-lg border-slate-700/80 text-white p-0 shadow-2xl rounded-2xl">
        <DialogHeader className="p-6 border-b border-slate-700/60 flex flex-row justify-between items-center">
          <div>
            <DialogTitle className="text-3xl font-bold flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              {editingPlan ? <FileText size={28} /> : <BrainCircuit size={28} />}
              {editingPlan ? t('supportPlans.editPlanTitle') : t('supportPlans.createPlanTitle')}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {editingPlan ? t('supportPlans.editPlanSubtitle') : t('supportPlans.createPlanSubtitle')}
            </DialogDescription>
          </div>
          {editingPlan && !isEditingMode && (
            <Button variant="outline" onClick={() => setIsEditingMode(true)} className="border-sky-500 text-sky-400 hover:bg-sky-500/10">
              <Edit3 size={16} className="mr-2"/> {t('common.editButton')}
            </Button>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <ScrollArea className="h-[calc(85vh-180px)] p-6 custom-scrollbar">
            <div className="space-y-6">
              <div>
                <Label htmlFor="student_id" className="text-slate-300">{t('supportPlans.studentLabel')}</Label>
                <Controller
                  name="student_id"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={!!preselectedStudentIdForModal || !!editingPlan?.student_id || !isEditingMode}
                    >
                      <SelectTrigger id="student_id" className={cn("bg-slate-800 border-slate-700 focus:ring-purple-500", !isEditingMode && "bg-slate-800/50 cursor-default")}>
                        <SelectValue placeholder={t('supportPlans.selectStudentModalPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        {students.map(student => (
                          <SelectItem key={student.id} value={student.id}>{student.full_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.student_id && <p className="text-red-400 text-sm mt-1">{errors.student_id.message}</p>}
              </div>

              <div>
                <Label htmlFor="support_goal" className="text-slate-300">{t('supportPlans.goalLabel')}</Label>
                <Controller
                  name="support_goal"
                  control={control}
                  render={({ field }) => <Input id="support_goal" {...field} placeholder={t('supportPlans.goalPlaceholder')} className={cn("bg-slate-800 border-slate-700 focus:ring-purple-500", !isEditingMode && "bg-slate-800/50 cursor-default")} readOnly={!isEditingMode} />}
                />
                {errors.support_goal && <p className="text-red-400 text-sm mt-1">{errors.support_goal.message}</p>}
              </div>

              <div>
                <Label htmlFor="support_strategy" className="text-slate-300">{t('supportPlans.strategyLabel')}</Label>
                <Controller
                  name="support_strategy"
                  control={control}
                  render={({ field }) => <Textarea id="support_strategy" {...field} placeholder={t('supportPlans.strategyPlaceholder')} className={cn("bg-slate-800 border-slate-700 focus:ring-purple-500 min-h-[100px]", !isEditingMode && "bg-slate-800/50 cursor-default")} readOnly={!isEditingMode} />}
                />
                {errors.support_strategy && <p className="text-red-400 text-sm mt-1">{errors.support_strategy.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="start_date" className="text-slate-300">{t('supportPlans.startDateLabel')}</Label>
                  <Controller
                    name="start_date"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild disabled={!isEditingMode}>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal bg-slate-800 border-slate-700 hover:bg-slate-700",
                              !field.value && "text-slate-400",
                              !isEditingMode && "bg-slate-800/50 cursor-default text-slate-300 hover:bg-slate-800/50"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? formatDateForDisplay(field.value) : <span>{t('common.pickDate')}</span>}
                          </Button>
                        </PopoverTrigger>
                        {isEditingMode && (
                          <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700 text-white" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              locale={dateLocale}
                            />
                          </PopoverContent>
                        )}
                      </Popover>
                    )}
                  />
                  {errors.start_date && <p className="text-red-400 text-sm mt-1">{errors.start_date.message}</p>}
                </div>

                <div>
                  <Label htmlFor="end_date" className="text-slate-300">{t('supportPlans.endDateLabel')}</Label>
                  <Controller
                    name="end_date"
                    control={control}
                    render={({ field }) => (
                       <Popover>
                        <PopoverTrigger asChild disabled={!isEditingMode}>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal bg-slate-800 border-slate-700 hover:bg-slate-700",
                              !field.value && "text-slate-400",
                              !isEditingMode && "bg-slate-800/50 cursor-default text-slate-300 hover:bg-slate-800/50"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? formatDateForDisplay(field.value) : <span>{t('common.pickDate')}</span>}
                          </Button>
                        </PopoverTrigger>
                        {isEditingMode && (
                          <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700 text-white" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                watch('start_date') && isValid(watch('start_date')) && date < watch('start_date')
                              }
                              initialFocus
                              locale={dateLocale}
                            />
                          </PopoverContent>
                        )}
                      </Popover>
                    )}
                  />
                  {errors.end_date && <p className="text-red-400 text-sm mt-1">{errors.end_date.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="status" className="text-slate-300">{t('supportPlans.statusLabel')}</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    isEditingMode ? (
                      <Select onValueChange={field.onChange} value={field.value} disabled={!isEditingMode}>
                        <SelectTrigger id="status" className="bg-slate-800 border-slate-700 focus:ring-purple-500">
                          <SelectValue placeholder={t('supportPlans.selectStatusPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                          {statusOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={getStatusBadgeVariant(field.value)} className="text-sm py-1 px-3 mt-2 block w-fit">
                        {getStatusDisplay(field.value)}
                      </Badge>
                    )
                  )}
                />
                {errors.status && <p className="text-red-400 text-sm mt-1">{errors.status.message}</p>}
              </div>
              
              {isEditingMode && (
                <div>
                  <Label className="text-slate-300 mb-2 block">{t('supportPlans.detailModal.detailedPlanTitle')}</Label>
                  <PlanEditor
                    initialPlanBlocks={editablePlanBlocks}
                    onSave={handleSavePlanBlocks} 
                    isLoading={isSubmitting}
                    studentName={students.find(s => s.id === currentStudentId)?.full_name || ''}
                  />
                </div>
              )}

              {!isEditingMode && planJsonToDisplay && Array.isArray(planJsonToDisplay) && planJsonToDisplay.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-700/60">
                  <h3 className="text-xl font-semibold text-purple-300 mb-4">{t('supportPlans.detailModal.detailedPlanTitle')}</h3>
                  <div className="space-y-5">
                    {planJsonToDisplay.map((step, index) => {
                      const IconComponent = blockIcons[step.key] || blockIcons.default;
                      return (
                        <div key={step.id || index} className="p-4 bg-slate-800/70 rounded-lg border border-slate-700 shadow-md">
                          <h4 className="text-md font-semibold text-sky-300 mb-2 flex items-center">
                            <IconComponent size={18} className="mr-2 text-sky-400" />
                            {step.title || t('supportPlans.pdf.unnamedStep')}
                          </h4>
                          <p className="text-slate-300 whitespace-pre-wrap text-sm">{typeof step.content === 'string' ? step.content : JSON.stringify(step.content, null, 2)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {!isEditingMode && planJsonToDisplay && typeof planJsonToDisplay === 'object' && !Array.isArray(planJsonToDisplay) && Object.keys(planJsonToDisplay).length > 0 && (
                 <div className="mt-6 pt-6 border-t border-slate-700/60">
                    <h3 className="text-xl font-semibold text-purple-300 mb-4">{t('supportPlans.detailModal.detailedPlanTitle')}</h3>
                    <div className="p-4 bg-slate-800/70 rounded-lg border border-slate-700 shadow-md">
                        <pre className="text-slate-300 whitespace-pre-wrap text-sm">{JSON.stringify(planJsonToDisplay, null, 2)}</pre>
                    </div>
                </div>
              )}


            </div>
          </ScrollArea>
          <DialogFooter className="p-6 border-t border-slate-700/60 gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => { onOpenChange(false); setIsEditingMode(false); }} className="border-slate-600 hover:bg-slate-700 transition-colors">
              {isEditingMode ? t('common.cancelButton') : t('common.closeButton')}
            </Button>
            {isEditingMode && (
              <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {editingPlan ? t('common.saveChangesButton') : t('common.createButton')}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SupportPlanModal;