import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit3, PlusCircle, Trash2, Save, XCircle, Eye, Edit3 as EditIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const AIAssistedObservationField = ({ label, name, value, onChange, placeholder, t, fieldType = "textarea" }) => {
  const handleAIAssist = () => {
    const currentVal = value || "";
    const aiSuggestion = t('common.aiGeneratedTextPlaceholder', ' (Sugerencia IA: El estudiante mostró mayor participación...)');
    onChange({ target: { name, value: currentVal + aiSuggestion } });
  };

  const InputComponent = fieldType === "textarea" ? Textarea : Input;

  return (
    <div className="relative">
      <Label htmlFor={name} className="text-slate-300">{label} {name === "situation" && <span className="text-red-400">*</span>}</Label>
      <InputComponent 
        id={name} 
        name={name} 
        value={value} 
        onChange={onChange} 
        required={name === "situation"}
        placeholder={placeholder}
        className="bg-slate-600 border-slate-500 min-h-[60px] pr-10" 
      />
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-7 h-7 w-7 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
              onClick={handleAIAssist}
            >
              <EditIcon size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-900 text-white border-slate-700 shadow-xl">
            <p>{t('common.generateWithAITooltip')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};


const TeacherObservationItem = ({ observation, onEdit, onDelete, canEdit }) => {
  const { t } = useLanguage();
  const formattedDate = observation.observation_date 
    ? format(parseISO(observation.observation_date), "dd MMM yyyy, HH:mm", { locale: es })
    : t('common.notAvailable');

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/70 mb-3"
    >
      <div className="flex justify-between items-start mb-2">
        <p className="text-xs text-sky-300 font-medium">{formattedDate}</p>
        {canEdit && (
          <div className="space-x-2">
            <Button variant="ghost" size="icon" className="text-amber-400 hover:text-amber-300 h-7 w-7" onClick={() => onEdit(observation)}>
              <Edit3 size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 h-7 w-7" onClick={() => onDelete(observation.id)}>
              <Trash2 size={16} />
            </Button>
          </div>
        )}
      </div>
      <div className="space-y-2 text-sm">
        <div>
          <strong className="text-slate-300">{t('studentProfilePage.teacherObservations.situation')}:</strong>
          <p className="text-slate-400 whitespace-pre-wrap">{observation.situation || t('common.notProvided')}</p>
        </div>
        {observation.strategy_applied && (
          <div>
            <strong className="text-slate-300">{t('studentProfilePage.teacherObservations.strategyApplied')}:</strong>
            <p className="text-slate-400 whitespace-pre-wrap">{observation.strategy_applied}</p>
          </div>
        )}
        {observation.evolution_observed && (
          <div>
            <strong className="text-slate-300">{t('studentProfilePage.teacherObservations.evolutionObserved')}:</strong>
            <p className="text-slate-400 whitespace-pre-wrap">{observation.evolution_observed}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const TeacherObservationForm = ({ studentId, existingObservation, onSave, onCancel }) => {
  const { t } = useLanguage();
  const { userProfile } = useMockAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    situation: '',
    strategy_applied: '',
    evolution_observed: '',
    observation_date: new Date().toISOString().slice(0, 16) 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingObservation) {
      setFormData({
        situation: existingObservation.situation || '',
        strategy_applied: existingObservation.strategy_applied || '',
        evolution_observed: existingObservation.evolution_observed || '',
        observation_date: existingObservation.observation_date 
          ? format(parseISO(existingObservation.observation_date), "yyyy-MM-dd'T'HH:mm")
          : new Date().toISOString().slice(0, 16)
      });
    } else {
       setFormData({
        situation: '',
        strategy_applied: '',
        evolution_observed: '',
        observation_date: new Date().toISOString().slice(0, 16)
      });
    }
  }, [existingObservation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.situation.trim()) {
      toast({ title: t('common.error'), description: t('studentProfilePage.teacherObservations.situationRequired'), variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    
    const observationData = {
      student_id: studentId,
      teacher_id: userProfile.id,
      observation_date: new Date(formData.observation_date).toISOString(),
      situation: formData.situation,
      strategy_applied: formData.strategy_applied || null,
      evolution_observed: formData.evolution_observed || null,
    };

    try {
      let error;
      if (existingObservation?.id) {
        const { error: updateError } = await supabase
          .from('teacher_observations')
          .update(observationData)
          .eq('id', existingObservation.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('teacher_observations')
          .insert(observationData);
        error = insertError;
      }

      if (error) throw error;
      toast({ title: t('common.success'), description: existingObservation?.id ? t('studentProfilePage.teacherObservations.updateSuccess') : t('studentProfilePage.teacherObservations.createSuccess') });
      onSave();
    } catch (error) {
      console.error("Error saving observation:", error);
      toast({ title: t('common.error'), description: t('studentProfilePage.teacherObservations.saveError'), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600 mt-4"
    >
      <div>
        <Label htmlFor="observation_date" className="text-slate-300">{t('studentProfilePage.teacherObservations.date')}</Label>
        <Input type="datetime-local" id="observation_date" name="observation_date" value={formData.observation_date} onChange={handleChange} className="bg-slate-600 border-slate-500" />
      </div>
      
      <AIAssistedObservationField
        label={t('studentProfilePage.teacherObservations.situation')}
        name="situation"
        value={formData.situation}
        onChange={handleChange}
        placeholder={t('studentProfilePage.teacherObservations.situationPlaceholder')}
        t={t}
      />
      <AIAssistedObservationField
        label={t('studentProfilePage.teacherObservations.strategyApplied')}
        name="strategy_applied"
        value={formData.strategy_applied}
        onChange={handleChange}
        placeholder={t('studentProfilePage.teacherObservations.strategyPlaceholder')}
        t={t}
      />
      <AIAssistedObservationField
        label={t('studentProfilePage.teacherObservations.evolutionObserved')}
        name="evolution_observed"
        value={formData.evolution_observed}
        onChange={handleChange}
        placeholder={t('studentProfilePage.teacherObservations.evolutionPlaceholder')}
        t={t}
      />

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel} className="text-slate-300 border-slate-500 hover:bg-slate-600 hover:text-white">
          <XCircle size={18} className="mr-2" />{t('common.cancelButton')}
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-sky-500 hover:bg-sky-600 text-white">
          <Save size={18} className="mr-2" />{isSubmitting ? t('common.saving') : t('common.saveChangesButton')}
        </Button>
      </div>
    </motion.form>
  );
};


const TeacherObservationsSection = ({ studentId, canAddObservations }) => {
  const { t } = useLanguage();
  const { userProfile } = useMockAuth();
  const { toast } = useToast();
  const [observations, setObservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingObservation, setEditingObservation] = useState(null);

  const fetchObservations = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('teacher_observations')
        .select('*')
        .eq('student_id', studentId)
        .order('observation_date', { ascending: false });

      if (error) throw error;
      setObservations(data || []);
    } catch (error) {
      console.error("Error fetching observations:", error);
      toast({ title: t('common.error'), description: t('studentProfilePage.teacherObservations.fetchError'), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [studentId, toast, t]);

  useEffect(() => {
    if (studentId) {
      fetchObservations();
    }
  }, [studentId, fetchObservations]);

  const handleAddObservation = () => {
    setEditingObservation(null);
    setShowForm(true);
  };

  const handleEditObservation = (observation) => {
    setEditingObservation(observation);
    setShowForm(true);
  };

  const handleDeleteObservation = async (observationId) => {
    if (!window.confirm(t('studentProfilePage.teacherObservations.confirmDelete'))) return;
    try {
      const { error } = await supabase
        .from('teacher_observations')
        .delete()
        .eq('id', observationId);
      
      if (error) throw error;
      toast({ title: t('common.success'), description: t('studentProfilePage.teacherObservations.deleteSuccess') });
      fetchObservations();
    } catch (error) {
      console.error("Error deleting observation:", error);
      toast({ title: t('common.error'), description: t('studentProfilePage.teacherObservations.deleteError'), variant: "destructive" });
    }
  };

  const handleSaveObservation = () => {
    setShowForm(false);
    setEditingObservation(null);
    fetchObservations();
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingObservation(null);
  };
  
  return (
    <Card className="bg-slate-800 border-slate-700 text-white shadow-xl">
      <CardHeader className="border-b border-slate-700">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-sky-300">{t('studentProfilePage.teacherObservations.title')}</CardTitle>
            <CardDescription className="text-slate-400">{t('studentProfilePage.teacherObservations.description')}</CardDescription>
          </div>
          {canAddObservations && (
            <Button onClick={handleAddObservation} className="bg-sky-500 hover:bg-sky-600">
              <PlusCircle size={18} className="mr-2" /> {t('studentProfilePage.teacherObservations.addObservation')}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <AnimatePresence>
          {showForm && (
            <TeacherObservationForm
              studentId={studentId}
              existingObservation={editingObservation}
              onSave={handleSaveObservation}
              onCancel={handleCancelForm}
            />
          )}
        </AnimatePresence>

        {isLoading && (
          <div className="space-y-3 mt-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/70">
                <div className="h-4 bg-slate-600 rounded w-1/4 mb-3"></div>
                <div className="h-3 bg-slate-600 rounded w-full mb-2"></div>
                <div className="h-3 bg-slate-600 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && observations.length === 0 && !showForm && (
          <div className="text-center py-8 text-slate-400">
            <Eye size={48} className="mx-auto mb-3 text-slate-500" />
            <p>{t('studentProfilePage.teacherObservations.noObservations')}</p>
          </div>
        )}

        {!isLoading && observations.length > 0 && (
          <div className="mt-6 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50">
            {observations.map(obs => (
              <TeacherObservationItem 
                key={obs.id} 
                observation={obs} 
                onEdit={handleEditObservation}
                onDelete={handleDeleteObservation}
                canEdit={userProfile?.id === obs.teacher_id || userProfile?.role === 'admin'}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeacherObservationsSection;