import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Edit3 as EditIcon, Save, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '@/contexts/LanguageContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from 'framer-motion';

const initialFormData = {
  student_id: '',
  student_name: '',
  support_goal: '',
  support_strategy: '',
  responsible_person: '',
  start_date: '',
  end_date: '',
  status: '',
};

const statusOptions = ["active", "inprogress", "completed", "paused", "cancelled"];

const formItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const AIAssistedField = ({ label, name, value, onChange, placeholder, t, fieldType = "textarea" }) => {
  const handleAIAssist = () => {
    const currentVal = value || "";
    // This is just a placeholder, actual AI suggestion logic would be more complex
    const aiSuggestion = t('common.aiGeneratedTextPlaceholder', ` (Sugerencia IA para ${label.toLowerCase()}: Detallar un objetivo SMART...)`);
    onChange({ target: { name, value: currentVal + aiSuggestion } });
  };

  const InputComponent = fieldType === "textarea" ? Textarea : Input;

  return (
    <motion.div variants={formItemVariants} className="relative">
      <Label htmlFor={name} className="text-slate-300 font-medium mb-1.5 block">{label}</Label>
      <InputComponent 
        id={name} 
        name={name} 
        value={value || ''} 
        onChange={onChange} 
        required={name === "support_goal"}
        placeholder={placeholder}
        className="bg-slate-700/70 border-slate-600 text-white pr-10 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-md shadow-sm"
        rows={fieldType === "textarea" ? 4 : undefined}
      />
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-[calc(50%+4px)] -translate-y-1/2 h-8 w-8 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 rounded-full transition-colors"
              onClick={handleAIAssist}
            >
              <EditIcon size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-900 text-white border-slate-700 shadow-xl rounded-md">
            <p>{t('common.generateWithAITooltip')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
};


const SupportPlanForm = ({ initialData, onSubmit, onCancel, isSubmitting, students, selectedStudentId: propSelectedStudentId }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState(initialData || initialFormData);

  useEffect(() => {
    let dataToSet = initialData || initialFormData;
    if (!initialData?.student_id && propSelectedStudentId) {
       dataToSet = { ...dataToSet, student_id: propSelectedStudentId };
    }
    setFormData(dataToSet);
  }, [initialData, propSelectedStudentId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form 
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmitForm} 
      className="space-y-5 py-4 max-h-[75vh] overflow-y-auto pr-3 custom-scrollbar"
    >
      <motion.div variants={formItemVariants}>
        <Label htmlFor="student_id" className="text-slate-300 font-medium mb-1.5 block">{t('supportPlans.studentNameLabel')}</Label>
        <Select 
          name="student_id" 
          value={formData.student_id || ''} 
          onValueChange={(value) => handleSelectChange('student_id', value)} 
          required
          disabled={!!propSelectedStudentId && !initialData?.id} 
        >
          <SelectTrigger className="bg-slate-700/70 border-slate-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-md shadow-sm">
            <SelectValue placeholder={t('supportPlans.selectStudentPlaceholder')} />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white shadow-xl">
            {students && students.map(student => (
              <SelectItem key={student.id} value={student.id} className="hover:bg-slate-700 focus:bg-slate-600/80">
                {student.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>
      
      <AIAssistedField
        label={t('supportPlans.goalLabel')}
        name="support_goal"
        value={formData.support_goal}
        onChange={handleInputChange}
        placeholder={t('supportPlans.goalPlaceholder', 'Ej: Mejorar la concentración en clase')}
        t={t}
        fieldType="textarea"
      />
      
      <AIAssistedField
        label={t('supportPlans.strategyLabel')}
        name="support_strategy"
        value={formData.support_strategy}
        onChange={handleInputChange}
        placeholder={t('supportPlans.strategyPlaceholder', 'Ej: Implementar técnicas de pomodoro y descansos activos')}
        t={t}
        fieldType="textarea"
      />
      
      <motion.div variants={formItemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="start_date" className="text-slate-300 font-medium mb-1.5 block">{t('supportPlans.startDateLabel')}</Label>
          <Input id="start_date" name="start_date" type="date" value={formData.start_date || ''} onChange={handleInputChange} className="bg-slate-700/70 border-slate-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-md shadow-sm" />
        </div>
        <div>
          <Label htmlFor="end_date" className="text-slate-300 font-medium mb-1.5 block">{t('supportPlans.endDateLabel')}</Label>
          <Input id="end_date" name="end_date" type="date" value={formData.end_date || ''} onChange={handleInputChange} className="bg-slate-700/70 border-slate-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-md shadow-sm" />
        </div>
      </motion.div>
      <motion.div variants={formItemVariants}>
        <Label htmlFor="status" className="text-slate-300 font-medium mb-1.5 block">{t('supportPlans.statusLabel')}</Label>
        <Select name="status" value={formData.status || ''} onValueChange={(value) => handleSelectChange('status', value)}>
          <SelectTrigger className="bg-slate-700/70 border-slate-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-md shadow-sm">
            <SelectValue placeholder={t('supportPlans.selectStatusPlaceholder')} />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white shadow-xl">
            {statusOptions.map(option => (
              <SelectItem key={option} value={option} className="hover:bg-slate-700 focus:bg-slate-600/80">
                {t(`supportPlans.statusValues.${option}`, option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>
      <DialogFooter className="sm:justify-end gap-3 pt-8">
        <DialogClose asChild>
          <Button type="button" variant="outline" className="text-slate-300 border-slate-600 hover:bg-slate-700/80 hover:text-white transition-colors rounded-md shadow-sm">
            <X size={18} className="mr-2"/>
            {t('common.cancelButton')}
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-md shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105">
          {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save size={18} className="mr-2"/>}
          {initialData?.id ? t('common.saveChangesButton') : t('common.createButton')}
        </Button>
      </DialogFooter>
    </motion.form>
  );
};

export default SupportPlanForm;