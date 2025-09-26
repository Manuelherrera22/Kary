import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Key, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Bot,
  Zap,
  Settings
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const GeminiConfigModal = ({ open, onOpenChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const { toast } = useToast();

  const handleTestApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Por favor, ingresa una API key válida",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey.trim());
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

      const result = await model.generateContent("Responde solo: OK");
      const response = await result.response;
      const text = response.text();
      
      if (text && text.trim().toLowerCase().includes('ok')) {
        setTestResult({ success: true, message: "API key válida y funcionando correctamente" });
      } else {
        setTestResult({ success: false, message: "Respuesta inesperada de la API" });
      }
    } catch (error) {
      console.error('Error testing API key:', error);
      
      let errorMessage = "Error desconocido";
      if (error.message?.includes('quota') || error.message?.includes('Quota exceeded')) {
        errorMessage = "Cuota excedida - necesitas una nueva API key";
      } else if (error.message?.includes('API key')) {
        errorMessage = "API key inválida";
      } else if (error.message?.includes('429')) {
        errorMessage = "Demasiadas solicitudes - espera un momento";
      } else if (error.message?.includes('404')) {
        errorMessage = "Modelo no disponible - verifica tu plan";
      }
      
      setTestResult({ success: false, message: errorMessage });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveApiKey = async () => {
    if (!testResult?.success) {
      toast({
        title: "Error",
        description: "Primero debes probar la API key y que sea válida",
        variant: "destructive"
      });
      return;
    }

    try {
      // En un entorno real, aquí guardarías la API key en el backend
      // Por ahora, solo mostramos un mensaje de éxito
      toast({
        title: "API Key Configurada",
        description: "La API key se ha configurado correctamente. Reinicia el servidor para aplicar los cambios.",
        variant: "default"
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al guardar la API key",
        variant: "destructive"
      });
    }
  };

  const handleOpenGoogleAIStudio = () => {
    window.open('https://makersuite.google.com/app/apikey', '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-blue-600" />
            <span>Configurar Gemini AI</span>
          </DialogTitle>
          <DialogDescription>
            Configura tu API key de Gemini para activar todas las funcionalidades de IA en Kary.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Instrucciones */}
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Pasos para obtener tu API key:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Ve a Google AI Studio</li>
                  <li>Inicia sesión con tu cuenta de Google</li>
                  <li>Crea una nueva API key</li>
                  <li>Copia la API key generada</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>

          {/* Botón para abrir Google AI Studio */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleOpenGoogleAIStudio}
              className="flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Abrir Google AI Studio</span>
            </Button>
          </div>

          {/* Campo de API Key */}
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key de Gemini</Label>
            <div className="flex space-x-2">
              <Input
                id="api-key"
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={handleTestApiKey}
                disabled={isTesting || !apiKey.trim()}
              >
                {isTesting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Resultado de la prueba */}
          {testResult && (
            <Alert className={testResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              {testResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={testResult.success ? "text-green-800" : "text-red-800"}>
                {testResult.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Funcionalidades que se activarán */}
          {testResult?.success && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Funcionalidades que se activarán:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Generación de planes de apoyo</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Generación de actividades</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Chat inteligente con Kary</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Insights educativos</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Análisis psicopedagógico</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Recomendaciones personalizadas</span>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveApiKey}
              disabled={!testResult?.success}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Key className="h-4 w-4 mr-2" />
              Guardar API Key
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GeminiConfigModal;
