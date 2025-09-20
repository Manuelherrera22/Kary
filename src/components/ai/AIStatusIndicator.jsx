import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, XCircle, AlertTriangle, Loader2, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import aiIntegration from '@/services/ai/aiIntegration';

const AIStatusIndicator = ({ className = "" }) => {
  const { t } = useLanguage();
  const [status, setStatus] = useState('checking');
  const [providers, setProviders] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    setStatus('checking');
    try {
      const availability = await aiIntegration.checkProviderAvailability();
      setProviders(availability);
      
      const hasAvailableProvider = Object.values(availability).some(provider => provider.available);
      setStatus(hasAvailableProvider ? 'available' : 'unavailable');
    } catch (error) {
      console.error('Error checking AI status:', error);
      setStatus('error');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'unavailable':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'checking':
      default:
        return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'available':
        return 'bg-green-600 border-green-500 text-green-100';
      case 'unavailable':
        return 'bg-red-600 border-red-500 text-red-100';
      case 'error':
        return 'bg-yellow-600 border-yellow-500 text-yellow-100';
      case 'checking':
      default:
        return 'bg-blue-600 border-blue-500 text-blue-100';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'available':
        return t('ai.status.available');
      case 'unavailable':
        return t('ai.status.unavailable');
      case 'error':
        return t('ai.status.error');
      case 'checking':
      default:
        return t('ai.status.checking');
    }
  };

  const getAvailableProvidersCount = () => {
    return Object.values(providers).filter(provider => provider.available).length;
  };

  const getTotalProvidersCount = () => {
    return Object.keys(providers).length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={className}
    >
      <Card className={`transition-all duration-300 hover:shadow-lg ${getStatusColor()}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {t('ai.status.title')}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon()}
                  <span className="text-xs">
                    {getStatusText()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {status === 'available' && (
                <Badge variant="outline" className="text-xs">
                  {getAvailableProvidersCount()}/{getTotalProvidersCount()} {t('ai.status.providers')}
                </Badge>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-400 hover:text-white"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-slate-600"
              >
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-300">
                    {t('ai.status.providers')}
                  </h4>
                  
                  <div className="space-y-2">
                    {Object.entries(providers).map(([provider, info]) => (
                      <div key={provider} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            info.available ? 'bg-green-400' : 'bg-red-400'
                          }`} />
                          <span className="text-xs text-slate-300 capitalize">
                            {provider}
                          </span>
                        </div>
                        
                        {info.available ? (
                          <Badge variant="outline" className="text-xs text-green-400">
                            {t('ai.status.connected')}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-red-400">
                            {t('ai.status.disconnected')}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={checkAIStatus}
                      className="flex-1 text-xs"
                    >
                      {t('ai.status.refresh')}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AIStatusIndicator;

