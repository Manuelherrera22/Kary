import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bot, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  RefreshCw,
  Sparkles,
  Brain,
  Zap
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import GeminiService from '@/services/ai/geminiService';

const GeminiStatusCard = () => {
  const { t } = useLanguage();
  const [status, setStatus] = useState('checking');
  const [isTesting, setIsTesting] = useState(false);
  const [modelInfo, setModelInfo] = useState(null);
  const [lastTest, setLastTest] = useState(null);

  const geminiService = new GeminiService();

  useEffect(() => {
    testGeminiConnection();
    setModelInfo(geminiService.getModelInfo());
  }, []);

  const testGeminiConnection = async () => {
    setIsTesting(true);
    setStatus('checking');
    
    try {
      const isConnected = await geminiService.testConnection();
      setStatus(isConnected ? 'connected' : 'error');
      setLastTest(new Date());
    } catch (error) {
      console.error('Error testing Gemini connection:', error);
      setStatus('error');
      setLastTest(new Date());
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'checking':
        return <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />;
      default:
        return <Bot className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-500/20 border-green-500/30 text-green-300';
      case 'error':
        return 'bg-red-500/20 border-red-500/30 text-red-300';
      case 'checking':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
      default:
        return 'bg-gray-500/20 border-gray-500/30 text-gray-300';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return t('ai.status.geminiStatus', 'Gemini AI activo');
      case 'error':
        return t('ai.status.unavailable', 'No disponible');
      case 'checking':
        return t('ai.status.checking', 'Verificando...');
      default:
        return t('ai.status.unavailable', 'No disponible');
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-purple-500 to-blue-500" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      <CardHeader className="relative pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
              <Bot size={24} className="text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-purple-300">
                {t('ai.status.gemini', 'Google Gemini')}
              </CardTitle>
              <p className="text-sm text-slate-400">
                {t('ai.status.primaryProvider', 'Proveedor principal de IA')}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={testGeminiConnection}
            disabled={isTesting}
            className="text-slate-300 border-slate-600 hover:bg-slate-700"
          >
            {isTesting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium text-slate-300">
              {getStatusText()}
            </span>
          </div>
          <Badge className={getStatusColor()}>
            {status === 'connected' ? 'Activo' : status === 'error' ? 'Error' : 'Verificando'}
          </Badge>
        </div>

        {/* Model Information */}
        {modelInfo && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-blue-400" />
              <span className="text-sm font-medium text-slate-300">
                Modelo: {modelInfo.name}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-yellow-400" />
              <span className="text-sm text-slate-400">
                Tokens máximos: {modelInfo.maxTokens.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Capabilities */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-green-400" />
            <span className="text-sm font-medium text-slate-300">
              Capacidades principales:
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {modelInfo?.capabilities?.slice(0, 4).map((capability, index) => (
              <div key={index} className="text-xs text-slate-400 bg-slate-700/30 rounded px-2 py-1">
                {capability}
              </div>
            ))}
          </div>
        </div>

        {/* Last Test */}
        {lastTest && (
          <div className="text-xs text-slate-500 pt-2 border-t border-slate-700/50">
            Última verificación: {lastTest.toLocaleTimeString()}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
            onClick={() => {
              // Abrir modal de configuración de Gemini
              console.log('Configurar Gemini');
            }}
          >
            Configurar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
            onClick={() => {
              // Abrir documentación de Gemini
              window.open('https://ai.google.dev/', '_blank');
            }}
          >
            Documentación
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeminiStatusCard;
