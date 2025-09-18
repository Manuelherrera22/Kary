import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Search, ExternalLink, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

async function fetchSuggestedResources(estudianteId) {
  const { data, error } = await supabase
    .rpc('obtener_recursos_sugeridos', { est_id: estudianteId });

  if (error) {
    console.error('Error fetching suggested resources:', error);
    
    return { data: [], error };
  }
  return { data, error: null };
}

export default function SugerenciasDeRecursos({ estudianteId }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSugerencias = async () => {
    if (!estudianteId) {
      toast({
        title: t('toast.errorTitle'),
        description: t('sugerenciasDeRecursos.errorEstudianteId'),
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    setHasSearched(true);
    const { data, error } = await fetchSuggestedResources(estudianteId);
    
    if (error) {
      toast({
        title: t('toast.errorTitle'),
        description: t('sugerenciasDeRecursos.errorFetching') + (error.message ? `: ${error.message}` : ''),
        variant: 'destructive',
      });
      setRecursos([]);
    } else {
      setRecursos(data || []);
      if (!data || data.length === 0) {
        toast({
          title: t('toast.infoTitle'),
          description: t('sugerenciasDeRecursos.noSuggestionsFound'),
          variant: 'default',
        });
      }
    }
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 p-6 bg-slate-800 rounded-xl shadow-2xl border border-slate-700"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <Lightbulb size={28} className="mr-3 text-yellow-400" />
          <h2 className="text-2xl font-bold text-yellow-400">{t('sugerenciasDeRecursos.title')}</h2>
        </div>
        <Button
          onClick={handleSugerencias}
          disabled={loading}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2 w-full sm:w-auto"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Search size={20} />
          )}
          {loading ? t('sugerenciasDeRecursos.loadingButton') : t('sugerenciasDeRecursos.buttonText')}
        </Button>
      </div>

      <AnimatePresence>
        {hasSearched && !loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {recursos.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recursos.map((r) => (
                  <motion.div
                    key={r.recurso_id || r.id} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-slate-700/70 border-slate-600 text-slate-100 hover:shadow-md hover:border-purple-500/70 transition-all duration-200 h-full flex flex-col">
                      <CardHeader>
                        <CardTitle className="text-purple-300 text-lg truncate" title={r.title}>{r.title}</CardTitle>
                        <CardDescription className="text-slate-400 text-sm line-clamp-2 h-[2.5rem]">
                          {r.description || t('sugerenciasDeRecursos.noDescription')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-xs text-slate-500 mb-1">{t('sugerenciasDeRecursos.typeLabel')}: <span className="font-semibold text-slate-400">{r.type || t('sugerenciasDeRecursos.unknownType')}</span></p>
                        {r.tags && r.tags.length > 0 && (
                           <p className="text-xs text-slate-500">{t('sugerenciasDeRecursos.tagsLabel')}: <span className="font-semibold text-slate-400">{r.tags.join(', ')}</span></p>
                        )}
                      </CardContent>
                      <div className="p-4 mt-auto border-t border-slate-600/50">
                        <Button
                          asChild
                          variant="outline"
                          className="w-full text-purple-300 border-purple-500/80 hover:bg-purple-500/10 hover:text-purple-200 hover:border-purple-400"
                          disabled={!r.url}
                        >
                          <a href={r.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={16} className="mr-2" />
                            {t('sugerenciasDeRecursos.viewResourceButton')}
                          </a>
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10 text-slate-400"
              >
                <p>{t('sugerenciasDeRecursos.noSuggestionsFoundAfterSearch')}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}