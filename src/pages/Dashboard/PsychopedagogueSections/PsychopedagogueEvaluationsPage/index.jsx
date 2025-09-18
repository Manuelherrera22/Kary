import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { PlusCircle, Loader2, AlertTriangle } from 'lucide-react';
import EvaluationList from './components/EvaluationList';
import EvaluationModal from './components/EvaluationModal';

const PsychopedagogueEvaluationsPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { userProfile } = useAuth();

  const [evaluations, setEvaluations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [error, setError] = useState(null);

  const fetchEvaluations = useCallback(async () => {
    if (!userProfile?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: rpcError } = await supabase.rpc('obtener_evaluaciones', {
        p_psychopedagogue_id: userProfile.id,
      });

      if (rpcError) throw rpcError;
      
      setEvaluations(data || []);
    } catch (err) {
      console.error('Error fetching evaluations:', err);
      setError(t('evaluations.fetchError'));
      toast({
        title: t('toasts.errorTitle'),
        description: t('evaluations.fetchError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [userProfile?.id, t, toast]);

  useEffect(() => {
    fetchEvaluations();
  }, [fetchEvaluations]);

  const handleNewEvaluation = () => {
    setSelectedEvaluation(null);
    setIsModalOpen(true);
  };

  const handleEditEvaluation = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setIsModalOpen(false);
    fetchEvaluations();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-900 min-h-screen text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-purple-400">{t('evaluations.pageTitle')}</h1>
          <p className="text-slate-400 mt-1">{t('evaluations.pageSubtitle')}</p>
        </div>
        <Button onClick={handleNewEvaluation} className="bg-purple-600 hover:bg-purple-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('evaluations.newEvaluation')}
        </Button>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-800/50 rounded-lg">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-xl text-red-400">{error}</p>
          <Button onClick={fetchEvaluations} className="mt-4">
            {t('common.retry')}
          </Button>
        </div>
      ) : evaluations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-slate-800/50 rounded-lg"
        >
          <h2 className="text-2xl font-semibold text-slate-300">{t('evaluations.noEvaluationsFound')}</h2>
          <p className="text-slate-400 mt-2">{t('evaluations.noEvaluationsDescription')}</p>
          <Button onClick={handleNewEvaluation} className="mt-6 bg-purple-600 hover:bg-purple-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('evaluations.newEvaluation')}
          </Button>
        </motion.div>
      ) : (
        <EvaluationList evaluations={evaluations} onEdit={handleEditEvaluation} />
      )}

      <EvaluationModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        evaluation={selectedEvaluation}
        onSave={handleSave}
      />
    </div>
  );
};

export default PsychopedagogueEvaluationsPage;