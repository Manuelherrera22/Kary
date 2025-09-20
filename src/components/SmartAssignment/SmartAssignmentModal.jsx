import React, { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, ArrowLeft, CheckCircle, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useMockAuth } from '@/contexts/MockAuthContext';

import AssignmentTypeStep from '@/components/SmartAssignment/steps/AssignmentTypeStep';
import StudentSelectionStep from '@/components/SmartAssignment/steps/StudentSelectionStep';
import AIContentSuggestionStep from '@/components/SmartAssignment/steps/AIContentSuggestionStep';
import AIMultipleAdaptationStep from '@/components/SmartAssignment/steps/AIMultipleAdaptationStep';
import ConfirmationStep from '@/components/SmartAssignment/steps/ConfirmationStep';
import { useToast } from '@/components/ui/use-toast';

const steps = [
  { id: 'type', titleKey: 'smartAssignment.step1Title', component: AssignmentTypeStep },
  { id: 'students', titleKey: 'smartAssignment.step2Title', component: StudentSelectionStep },
  { id: 'aiSuggestion', titleKey: 'smartAssignment.step3Title', component: AIContentSuggestionStep },
  { id: 'aiMultiple', titleKey: 'smartAssignment.step4Title', component: AIMultipleAdaptationStep },
  { id: 'confirmation', titleKey: 'smartAssignment.step5Title', component: ConfirmationStep },
];

const SmartAssignmentModal = ({ isOpen, onOpenChange, triggerButton }) => {
  const { t } = useLanguage();
  const { user: authUser } = useMockAuth();
  const { toast } = useToast();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [assignmentData, setAssignmentData] = useState({
    type: '',
    customTitle: '',
    selectedStudents: [], 
    aiSuggestionUsed: false,
    aiEditedContent: '',
    adaptForEachStudent: false,
    dueDate: null,
  });
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    if (isOpen && currentStepIndex === 1 && students.length === 0) { // StudentSelectionStep
      const fetchStudents = async () => {
        setLoadingStudents(true);
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('id, full_name, grade, diagnostic_summary, role')
            .eq('role', 'student')
            .order('full_name', { ascending: true });
          if (error) throw error;
          setStudents(data || []);
        } catch (err) {
          console.error("Error fetching students:", err);
          toast({ title: t('toast.errorTitle'), description: t('smartAssignment.errorFetchingStudents'), variant: 'destructive' });
        } finally {
          setLoadingStudents(false);
        }
      };
      fetchStudents();
    }
  }, [isOpen, currentStepIndex, students.length, t, toast]);


  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const updateAssignmentData = (newData) => {
    setAssignmentData(prev => ({ ...prev, ...newData }));
  };

  const handleAssign = async () => {
    console.log("Final Assignment Data:", assignmentData);
    // Placeholder for actual assignment logic
    // This would involve inserting into 'recursos_asignados' or a similar table
    
    // Example:
    // const assignmentsToInsert = assignmentData.selectedStudents.map(student => ({
    //   recurso_id: some_resource_id, // This needs to be determined based on assignmentData.type or AI suggestion
    //   estudiante_id: student.id,
    //   asignado_por: authUser.id,
    //   due_date: assignmentData.dueDate,
    //   // ... other fields like plan_title, ia_details
    // }));
    // const { error } = await supabase.from('recursos_asignados').insert(assignmentsToInsert);

    toast({
      title: t('toast.successTitle'),
      description: t('smartAssignment.assignmentSuccessMessage'),
      className: "bg-green-500 dark:bg-green-700 text-white",
    });
    onOpenChange(false); // Close modal
    setCurrentStepIndex(0); // Reset for next time
    setAssignmentData({ // Reset data
      type: '',
      customTitle: '',
      selectedStudents: [],
      aiSuggestionUsed: false,
      aiEditedContent: '',
      adaptForEachStudent: false,
      dueDate: null,
    });
  };

  const CurrentStepComponent = steps[currentStepIndex].component;
  const currentStepTitle = t(steps[currentStepIndex].titleKey);

  const isNextDisabled = () => {
    if (currentStepIndex === 0 && !assignmentData.type) return true; // AssignmentTypeStep
    if (currentStepIndex === 1 && assignmentData.selectedStudents.length === 0) return true; // StudentSelectionStep
    return false;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      <DialogContent className="w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl h-[95vh] sm:h-[90vh] flex flex-col bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-slate-50 p-0 overflow-hidden">
        <DialogHeader className="p-4 sm:p-6 border-b border-purple-800/50">
          <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 flex items-center">
            <Sparkles size={20} className="mr-2 sm:mr-3 text-purple-400 sm:w-7 sm:h-7" />
            {t('smartAssignment.modalTitle')}
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm sm:text-base">
            {t('smartAssignment.modalDescription')}: {currentStepTitle} (Paso {currentStepIndex + 1} de {steps.length})
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-slate-800">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStepComponent
                assignmentData={assignmentData}
                updateAssignmentData={updateAssignmentData}
                students={students}
                loadingStudents={loadingStudents}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <DialogFooter className="p-4 sm:p-6 border-t border-purple-800/50 sm:justify-between gap-3 bg-slate-900/50">
          <DialogClose asChild>
            <Button variant="outline" className="text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-slate-100">
               <X size={18} className="mr-2" /> {t('common.closeButton')}
            </Button>
          </DialogClose>
          <div className="flex gap-3">
            {currentStepIndex > 0 && (
              <Button variant="outline" onClick={handleBack} className="text-purple-300 border-purple-600 hover:bg-purple-700/30 hover:text-purple-200">
                <ArrowLeft size={18} className="mr-2" /> {t('common.backButton')}
              </Button>
            )}
            {currentStepIndex < steps.length - 1 ? (
              <Button onClick={handleNext} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white" disabled={isNextDisabled()}>
                {t('common.nextButton')} <ArrowRight size={18} className="ml-2" />
              </Button>
            ) : (
              <Button onClick={handleAssign} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                <CheckCircle size={18} className="mr-2" /> {t('smartAssignment.confirmAndAssignButton')}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SmartAssignmentModal;