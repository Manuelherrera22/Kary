import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare as MessageSquareText, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { format, parseISO } from 'date-fns'; 
import { es } from 'date-fns/locale';
import LoadingScreen from '@/pages/Dashboard/components/LoadingScreen';

const ChildInteractionsSummaryPage = () => {
  const { t, currentLanguage } = useLanguage();
  const { userProfile, primaryChildId, loading: authLoading } = useMockAuth();
  const { toast } = useToast();
  const [interactions, setInteractions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const dateLocale = currentLanguage === 'es' ? es : undefined;

  useEffect(() => {
    const fetchInteractions = async () => {
      if (authLoading) {
        setIsLoading(true);
        return;
      }
      if (!userProfile || userProfile.role !== 'parent') {
        setIsLoading(false);
        return;
      }
      
      if (!primaryChildId) {
        setIsLoading(false);
        if (userProfile.role === 'parent') {
            toast({
                title: t('toast.infoTitle'),
                description: t('parentDashboard.noChildLinked'),
                variant: "default",
            });
        }
        return;
      }
      
      setIsLoading(true);
      try {
        const { data: interactionsData, error: interactionsError } = await supabase
          .from('interacciones_hijos')
          .select('*')
          .eq('estudiante_id', primaryChildId)
          .order('fecha', { ascending: false });

        if (interactionsError) throw interactionsError;
        setInteractions(interactionsData || []);
      } catch (error) {
        console.error('Error fetching child interactions:', error);
        toast({
          title: t('toast.errorTitle'),
          description: t('parentDashboard.childInteractions.errorFetching') + (error.message ? `: ${error.message}` : ''),
          variant: "destructive",
        });
        setInteractions([]); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchInteractions();
  }, [userProfile, primaryChildId, authLoading, t, toast, currentLanguage]);
  
  const formatDateSafe = (dateString) => {
    if (!dateString) return t('common.notSpecified');
    try {
      const dateObj = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
      return format(dateObj, 'Pp', { locale: dateLocale });
    } catch (e) {
      console.warn(`Invalid date format for formatDateSafe: ${dateString}`);
      return t('common.invalidDate');
    }
  };

  if (authLoading || isLoading) {
    return <LoadingScreen text={t('common.loadingText')} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-gradient-to-br from-gray-800 via-slate-800 to-neutral-900 min-h-screen text-white"
    >
      <div className="container mx-auto max-w-3xl">
        <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          {t('common.backToDashboard')}
        </Link>

        <div className="bg-slate-700/30 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-600">
          <div className="flex items-center mb-8">
            <MessageSquareText size={36} className="mr-4 text-sky-400" />
            <div>
              <h1 className="text-3xl font-bold">{t('parentDashboard.childInteractions.title')}</h1>
              <p className="text-slate-400">{t('parentDashboard.childInteractions.pageSubtitle')}</p>
            </div>
          </div>
          
          {!primaryChildId && userProfile?.role === 'parent' ? (
            <div className="text-center py-12">
              <p className="text-xl text-slate-300">{t('parentDashboard.noChildLinked')}</p>
               <p className="text-slate-400 mt-2">{t('parentDashboard.contactInstitution')}</p>
            </div>
          ) : interactions.length === 0 && primaryChildId ? (
            <div className="text-center py-12">
              <p className="text-xl text-slate-300">{t('parentDashboard.childInteractions.noInteractionsFound')}</p>
            </div>
          ) : (
            primaryChildId && interactions.length > 0 && (
              <div className="space-y-4">
                {interactions.map((interaction) => (
                  <div key={interaction.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-sky-300">{interaction.tipo || t('common.notSpecified')}</h3>
                      <p className="text-xs text-slate-400 flex items-center">
                        <Calendar size={12} className="mr-1" /> 
                        {formatDateSafe(interaction.fecha)}
                      </p>
                    </div>
                    <p className="text-sm text-slate-300">{interaction.descripcion || t('common.notSpecified')}</p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChildInteractionsSummaryPage;