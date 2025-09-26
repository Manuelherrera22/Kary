import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  ExternalLink,
  Key,
  Zap
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const GeminiStatusIndicator = ({ onConfigureClick }) => {
  const [status, setStatus] = useState('checking');
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    checkGeminiStatus();
  }, []);

  const checkGeminiStatus = async () => {
    setStatus('checking');
    
    try {
      // Verificar si la API key está configurada
      const currentApiKey = import.meta.env.VITE_GEMINI_API_KEY;
      setApiKey(currentApiKey || '');
      
      if (!currentApiKey || currentApiKey === 'undefined' || currentApiKey === '') {
        setStatus('not_configured');
        return;
      }

      // Probar la conexión con Gemini
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(currentApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

      const result = await model.generateContent("Responde solo: OK");
      const response = await result.response;
      const text = response.text();
      
      if (text && text.trim().toLowerCase().includes('ok')) {
        setStatus('working');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error checking Gemini status:', error);
      
      if (error.message?.includes('quota') || error.message?.includes('Quota exceeded')) {
        setStatus('quota_exceeded');
      } else if (error.message?.includes('API key')) {
        setStatus('invalid_key');
      } else if (error.message?.includes('429')) {
        setStatus('rate_limit');
      } else {
        setStatus('error');
      }
    }
  };

  const getStatusInfo = () => {
    switch (status) {
      case 'working':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          badge: <Badge variant="default" className="bg-green-500">Funcionando</Badge>,
          title: 'Gemini AI Activo',
          description: 'La IA está funcionando correctamente y puede generar planes de apoyo y actividades.',
          color: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200'
        };
      case 'quota_exceeded':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
          badge: <Badge variant="destructive" className="bg-orange-500">Cuota Excedida</Badge>,
          title: 'Cuota de Gemini Excedida',
          description: 'La API key ha excedido su cuota gratuita. Configura una nueva API key para activar la IA.',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50 border-orange-200'
        };
      case 'invalid_key':
        return {
          icon: <Key className="h-5 w-5 text-red-500" />,
          badge: <Badge variant="destructive" className="bg-red-500">API Key Inválida</Badge>,
          title: 'API Key Inválida',
          description: 'La API key configurada no es válida. Configura una nueva API key.',
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200'
        };
      case 'rate_limit':
        return {
          icon: <RefreshCw className="h-5 w-5 text-yellow-500" />,
          badge: <Badge variant="secondary" className="bg-yellow-500">Límite de Velocidad</Badge>,
          title: 'Demasiadas Solicitudes',
          description: 'Se han realizado demasiadas solicitudes. Espera unos minutos e intenta de nuevo.',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50 border-yellow-200'
        };
      case 'not_configured':
        return {
          icon: <Settings className="h-5 w-5 text-gray-500" />,
          badge: <Badge variant="outline">No Configurado</Badge>,
          title: 'Gemini AI No Configurado',
          description: 'No se ha configurado una API key de Gemini. Configura una para activar la IA.',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 border-gray-200'
        };
      case 'checking':
        return {
          icon: <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />,
          badge: <Badge variant="secondary">Verificando...</Badge>,
          title: 'Verificando Estado',
          description: 'Verificando el estado de la conexión con Gemini AI...',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 border-blue-200'
        };
      default:
        return {
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
          badge: <Badge variant="destructive">Error</Badge>,
          title: 'Error de Conexión',
          description: 'Error al conectar con Gemini AI. Verifica la configuración.',
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200'
        };
    }
  };

  const statusInfo = getStatusInfo();

  const handleConfigure = () => {
    if (onConfigureClick) {
      onConfigureClick();
    } else {
      // Abrir configuración por defecto
      window.open('https://makersuite.google.com/app/apikey', '_blank');
    }
  };

  const handleRefresh = () => {
    checkGeminiStatus();
    toast({
      title: "Verificando estado de Gemini AI",
      description: "Revisando la conexión y configuración...",
    });
  };

  return (
    <Card className={`${statusInfo.bgColor} transition-all duration-200`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className={`h-6 w-6 ${statusInfo.color}`} />
            <div>
              <CardTitle className={`text-lg ${statusInfo.color}`}>
                {statusInfo.title}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                {statusInfo.icon}
                {statusInfo.badge}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={status === 'checking'}
            >
              <RefreshCw className={`h-4 w-4 ${status === 'checking' ? 'animate-spin' : ''}`} />
            </Button>
            {(status !== 'working') && (
              <Button
                variant="default"
                size="sm"
                onClick={handleConfigure}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Settings className="h-4 w-4 mr-1" />
                Configurar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Alert className="mb-4">
          <AlertDescription className="text-sm">
            {statusInfo.description}
          </AlertDescription>
        </Alert>

        {status === 'working' && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <Zap className="h-4 w-4" />
              <span>Funcionalidades activas:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Generación de planes de apoyo</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Generación de actividades</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Chat inteligente con Kary</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Insights educativos</span>
              </div>
            </div>
          </div>
        )}

        {(status === 'quota_exceeded' || status === 'invalid_key' || status === 'not_configured') && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-orange-600">
              <ExternalLink className="h-4 w-4" />
              <span>Pasos para configurar:</span>
            </div>
            <ol className="text-xs space-y-1 ml-4">
              <li>1. Ve a Google AI Studio</li>
              <li>2. Crea una nueva API key</li>
              <li>3. Configura la API key en el sistema</li>
              <li>4. Reinicia el servidor</li>
            </ol>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://makersuite.google.com/app/apikey', '_blank')}
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Obtener API Key
            </Button>
          </div>
        )}

        {status === 'rate_limit' && (
          <div className="text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Intentar de Nuevo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeminiStatusIndicator;
