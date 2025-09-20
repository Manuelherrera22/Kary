import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ai-assistant-solid.css';
import { Brain, Sparkles, X, MessageSquare, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import AIAssistant from './AIAssistant';

const AIFloatingButton = () => {
  const { t } = useLanguage();
  const { user } = useMockAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasNewSuggestions, setHasNewSuggestions] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simular sugerencias nuevas cada cierto tiempo
    const interval = setInterval(() => {
      setHasNewSuggestions(Math.random() > 0.7);
    }, 30000); // Cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const handleOpenAssistant = () => {
    setIsOpen(true);
    setIsExpanded(false);
    setHasNewSuggestions(false);
  };

  const handleCloseAssistant = () => {
    setIsOpen(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (!user || !isVisible) return null;

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="mb-4 space-y-2"
            >
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenAssistant}
                  className="ai-floating-button w-full justify-start bg-slate-700 border-slate-500 text-slate-100 hover:bg-slate-600"
                  style={{ backgroundColor: '#334155', opacity: 1 }}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {t('dashboards.ai.quickActions.assistant')}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="ai-floating-button w-full justify-start bg-slate-700 border-slate-500 text-slate-100 hover:bg-slate-600"
                  style={{ backgroundColor: '#334155', opacity: 1 }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t('dashboards.ai.quickActions.suggestions')}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="ai-floating-button w-full justify-start bg-slate-700 border-slate-500 text-slate-100 hover:bg-slate-600"
                  style={{ backgroundColor: '#334155', opacity: 1 }}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {t('dashboards.ai.quickActions.help')}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Button
            onClick={isExpanded ? handleOpenAssistant : toggleExpanded}
            className={`w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0 ${
              hasNewSuggestions ? 'animate-pulse' : ''
            }`}
            size="lg"
          >
            <Brain className="w-6 h-6 text-white" />
          </Button>

          {/* Notification Badge */}
          {hasNewSuggestions && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1"
            >
              <Badge 
                variant="destructive" 
                className="w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                !
              </Badge>
            </motion.div>
          )}

          {/* AI Status Indicator */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"
            title={t('dashboards.ai.status.ready')}
          />
        </motion.div>
      </motion.div>

      {/* AI Assistant Modal */}
      <AIAssistant
        isOpen={isOpen}
        onClose={handleCloseAssistant}
        initialContext={{
          role: user.role,
          user: user
        }}
        studentId={user.role === 'student' ? user.id : null}
        role={user.role}
      />

      {/* Quick Help Tooltip */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="fixed bottom-6 right-24 z-30"
          >
            <div className="ai-tooltip bg-slate-700 text-slate-100 px-3 py-2 rounded-lg shadow-lg border border-slate-500" style={{ backgroundColor: '#334155', opacity: 1 }}>
              <p className="text-sm font-medium">{t('dashboards.ai.tooltip.title')}</p>
              <p className="text-xs text-slate-400">{t('dashboards.ai.tooltip.description')}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIFloatingButton;

