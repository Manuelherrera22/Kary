import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Save, AlertTriangle, Loader2, Rocket } from 'lucide-react';

const ProyectoVidaEditor = ({ notificacionId }) => {
  const { t } = useLanguage();
  const { userProfile } = useMockAuth();
  const { toast } = useToast();

  const [cortoPlazo, setCortoPlazo] = useState('');
  const [medianoPlazo, setMedianoPlazo] = useState('');
  const [largoPlazo, setLargoPlazo] = useState('');
  const [initialData, setInitialData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchProyectoVida = useCallback(async () => {
    if (!notificacionId) {
      setError(t('proyectoVidaEditor.errorNoNotificationId'));
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('contenido_coordinador_programa')
        .eq('id', notificacionId)
        .single();

      if (fetchError) throw fetchError;

      if (data && data.contenido_coordinador_programa && data.contenido_coordinador_programa.proyecto_vida) {
        const proyectoVida = data.contenido_coordinador_programa.proyecto_vida;
        setCortoPlazo(proyectoVida.corto_plazo || '');
        setMedianoPlazo(proyectoVida.mediano_plazo || '');
        setLargoPlazo(proyectoVida.largo_plazo || '');
        setInitialData(proyectoVida);
      } else {
        setInitialData({}); 
      }
    } catch (err) {
      console.error('Error fetching proyecto de vida:', err);
      setError(t('proyectoVidaEditor.errorFetching'));
      toast({
        title: t('toast.errorTitle'),
        description: `${t('proyectoVidaEditor.errorFetching')}: ${err.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [notificacionId, t, toast]);

  useEffect(() => {
    if (userProfile?.role === 'program_coordinator') {
      fetchProyectoVida();
    } else {
      setLoading(false);
      setError(t('common.accessDenied'));
    }
  }, [fetchProyectoVida, userProfile]);

  const handleGuardar = async () => {
    if (!notificacionId) {
      toast({ title: t('toast.errorTitle'), description: t('proyectoVidaEditor.errorNoNotificationId'), variant: 'destructive' });
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      p_notificacion_id: notificacionId,
      p_corto_plazo: cortoPlazo !== (initialData?.corto_plazo || '') ? cortoPlazo : null,
      p_mediano_plazo: medianoPlazo !== (initialData?.mediano_plazo || '') ? medianoPlazo : null,
      p_largo_plazo: largoPlazo !== (initialData?.largo_plazo || '') ? largoPlazo : null,
    };
    
    if (payload.p_corto_plazo === null && payload.p_mediano_plazo === null && payload.p_largo_plazo === null) {
        toast({ title: t('toast.infoTitle'), description: t('proyectoVidaEditor.noChanges') });
        setSaving(false);
        return;
    }

    try {
      const { error: rpcError } = await supabase.rpc('actualizar_proyecto_vida', payload);

      if (rpcError) throw rpcError;

      toast({
        title: t('toast.successTitle'),
        description: t('proyectoVidaEditor.saveSuccess'),
        className: 'bg-green-500 text-white dark:bg-green-600',
      });
      fetchProyectoVida(); 
    } catch (err) {
      console.error('Error saving proyecto de vida:', err);
      setError(t('proyectoVidaEditor.errorSaving'));
      toast({
        title: t('toast.errorTitle'),
        description: `${t('proyectoVidaEditor.errorSaving')}: ${err.message}`,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (userProfile?.role !== 'program_coordinator' && !loading) {
    return (
      <Card className="bg-slate-800/60 border-slate-700/70 shadow-xl mt-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-amber-400 flex items-center">
            <AlertTriangle size={22} className="mr-2" />
            {t('common.accessDeniedTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-slate-400">
          {t('common.accessDeniedMessage')}
        </CardContent>
      </Card>
    );
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
        <p className="ml-3 text-slate-400">{t('common.loadingText')}</p>
      </div>
    );
  }

  if (error && error !== t('common.accessDenied')) {
    return (
      <div className="p-6 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-center">
        <AlertTriangle size={24} className="mx-auto mb-2" />
        {error}
      </div>
    );
  }
  
  if (error === t('common.accessDenied')) {
     return null; 
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4 sm:p-6 bg-slate-800/70 rounded-xl shadow-2xl border border-slate-700/80"
    >
      <div className="flex items-center space-x-3">
        <Rocket className="h-8 w-8 text-purple-400" />
        <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          {t('proyectoVidaEditor.title')}
        </h2>
      </div>
      <CardDescription className="text-slate-400 -mt-4 ml-11">
        {t('proyectoVidaEditor.description')}
      </CardDescription>

      <div className="space-y-6">
        <div>
          <Label htmlFor="cortoPlazo" className="block text-sm font-medium text-slate-300 mb-1.5">
            {t('proyectoVidaEditor.shortTermLabel')}
          </Label>
          <Textarea
            id="cortoPlazo"
            className="w-full border-slate-600 bg-slate-700/50 text-slate-200 rounded-md p-3 focus:ring-purple-500 focus:border-purple-500 min-h-[100px] placeholder:text-slate-500"
            value={cortoPlazo}
            onChange={(e) => setCortoPlazo(e.target.value)}
            placeholder={t('proyectoVidaEditor.shortTermPlaceholder')}
            disabled={saving}
          />
        </div>

        <div>
          <Label htmlFor="medianoPlazo" className="block text-sm font-medium text-slate-300 mb-1.5">
            {t('proyectoVidaEditor.mediumTermLabel')}
          </Label>
          <Textarea
            id="medianoPlazo"
            className="w-full border-slate-600 bg-slate-700/50 text-slate-200 rounded-md p-3 focus:ring-purple-500 focus:border-purple-500 min-h-[100px] placeholder:text-slate-500"
            value={medianoPlazo}
            onChange={(e) => setMedianoPlazo(e.target.value)}
            placeholder={t('proyectoVidaEditor.mediumTermPlaceholder')}
            disabled={saving}
          />
        </div>

        <div>
          <Label htmlFor="largoPlazo" className="block text-sm font-medium text-slate-300 mb-1.5">
            {t('proyectoVidaEditor.longTermLabel')}
          </Label>
          <Textarea
            id="largoPlazo"
            className="w-full border-slate-600 bg-slate-700/50 text-slate-200 rounded-md p-3 focus:ring-purple-500 focus:border-purple-500 min-h-[100px] placeholder:text-slate-500"
            value={largoPlazo}
            onChange={(e) => setLargoPlazo(e.target.value)}
            placeholder={t('proyectoVidaEditor.longTermPlaceholder')}
            disabled={saving}
          />
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-slate-800"
          onClick={handleGuardar}
          disabled={saving || loading}
        >
          {saving ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Save className="h-5 w-5 mr-2" />
          )}
          {saving ? t('common.savingButton') : t('common.saveChangesButton')}
        </Button>
      </div>
    </motion.div>
  );
};

export default ProyectoVidaEditor;