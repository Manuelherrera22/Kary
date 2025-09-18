import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, MailOpen, Users2, Briefcase, Phone, AtSign } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

const DirectCommunicationPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [professionals, setProfessionals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfessionals = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('comunicacion_profesionales_contactos')
          .select('*')
          .order('profesional_nombre', { ascending: true });

        if (error) {
          console.error('Error fetching professionals:', error.message);
          throw error;
        }
        setProfessionals(data || []);
      } catch (error) {
        toast({
          title: t('toast.errorTitle'),
          description: t('parentDashboard.directCommunication.errorFetching') + (error.message ? `: ${error.message}` : ''),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessionals();
  }, [t, toast]);

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
            <Users2 size={36} className="mr-4 text-sky-400" />
            <div>
              <h1 className="text-3xl font-bold">{t('parentDashboard.directCommunication.title')}</h1>
              <p className="text-slate-400">{t('parentDashboard.directCommunication.pageSubtitle')}</p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-xl text-slate-300">{t('common.loadingText')}</p>
            </div>
          ) : professionals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-slate-300">{t('parentDashboard.directCommunication.noProfessionalsFound')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {professionals.map((prof) => (
                <div key={prof.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 shadow-md">
                  <h3 className="text-lg font-semibold text-sky-300">{prof.profesional_nombre || t('common.notSpecified')}</h3>
                  <p className="text-sm text-slate-400 flex items-center mt-1">
                    <Briefcase size={14} className="mr-1.5" /> {prof.cargo || t('common.notSpecified')}
                  </p>
                  {prof.area_especialidad && (
                    <p className="text-sm text-slate-400 flex items-center mt-1">
                      <MailOpen size={14} className="mr-1.5" /> {t('common.area')}: {prof.area_especialidad}
                    </p>
                  )}
                  <div className="mt-2 pt-2 border-t border-slate-700 space-y-1">
                    {prof.email_contacto && (
                      <a href={`mailto:${prof.email_contacto}`} className="text-sm text-pink-400 hover:text-pink-300 flex items-center">
                        <AtSign size={14} className="mr-1.5" /> {prof.email_contacto}
                      </a>
                    )}
                    {prof.telefono_contacto && (
                       <a href={`tel:${prof.telefono_contacto}`} className="text-sm text-pink-400 hover:text-pink-300 flex items-center">
                        <Phone size={14} className="mr-1.5" /> {prof.telefono_contacto}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DirectCommunicationPage;