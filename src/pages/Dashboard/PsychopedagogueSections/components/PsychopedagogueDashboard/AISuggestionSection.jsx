import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, RefreshCw, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const AISuggestionCard = ({ suggestion, onAction }) => {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-slate-700/50 via-slate-800/60 to-slate-700/50 p-5 rounded-xl border border-purple-500/30 shadow-lg hover:shadow-purple-500/20 transition-shadow"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 mt-1">
          <Lightbulb size={28} className="text-yellow-400 animate-pulse" />
        </div>
        <div className="flex-grow">
          <h4 className="font-semibold text-lg text-purple-300 mb-1.5">{suggestion.title || t('psychopedagogueDashboard.aiSuggestion.defaultTitle')}</h4>
          <p className="text-sm text-slate-300 mb-3 leading-relaxed">{suggestion.description}</p>
          {suggestion.action_label && suggestion.action_type && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => onAction(suggestion.action_type, suggestion.action_payload)} 
              className="text-yellow-300 hover:bg-yellow-400/10 hover:text-yellow-200 px-3 py-1.5 rounded-md transition-all group"
            >
              {suggestion.action_label}
              <ArrowRight size={16} className="ml-1.5 transform group-hover:translate-x-0.5 transition-transform" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const AISuggestionSection = ({ suggestions, loading, onRefresh, onAction }) => {
  const { t } = useLanguage();

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-700/40 rounded-xl animate-pulse"></div>
          ))}
        </div>
      );
    }
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      return <p className="text-slate-400 text-center py-4">{t('psychopedagogueDashboard.aiSuggestion.noSuggestions')}</p>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((sugg, index) => <AISuggestionCard key={sugg.id || index} suggestion={sugg} onAction={onAction} />)}
      </div>
    );
  };

  return (
    <motion.div
      className="mb-8 p-6 bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700/70"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-700/50">
        <h2 className="text-xl sm:text-2xl font-semibold text-purple-300 flex items-center">
          <Lightbulb size={26} className="mr-2.5 text-yellow-400" />
          {t('psychopedagogueDashboard.aiSuggestion.title')}
        </h2>
        <Button variant="ghost" size="icon" onClick={onRefresh} disabled={loading} className="text-purple-300 hover:text-purple-100 hover:bg-purple-500/20 rounded-full transition-colors">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw size={20} />}
        </Button>
      </div>
      {renderContent()}
    </motion.div>
  );
};

export default AISuggestionSection;