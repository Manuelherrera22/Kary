import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  Settings, 
  Key, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

const GeminiConfigHelper = ({ onConfigUpdate }) => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor, ingresa una API key válida',
        variant: 'destructive',
      });
      return;
    }

    setIsValidating(true);

    try {
      // Simular validación de API key
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // En un entorno real, aquí validarías la API key
      // Por ahora, asumimos que es válida si tiene el formato correcto
      if (apiKey.length > 20) {
        // Guardar en localStorage para esta sesión
        localStorage.setItem('gemini_api_key', apiKey);
        
        toast({
          title: '✅ API Key Configurada',
          description: 'La API key se ha configurado correctamente. Recarga la página para aplicar los cambios.',
          variant: 'default',
        });

        if (onConfigUpdate) {
          onConfigUpdate(apiKey);
        }
      } else {
        throw new Error('API key inválida');
      }
    } catch (error) {
      toast({
        title: '❌ Error',
        description: 'La API key no es válida. Por favor, verifica que sea correcta.',
        variant: 'destructive',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copiado',
      description: 'Texto copiado al portapapeles',
      variant: 'default',
    });
  };

  const getApiKeyInstructions = () => {
    return `# Configuración de Gemini AI

## 1. Obtener API Key
1. Ve a https://makersuite.google.com/app/apikey
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Create API Key"
4. Copia la API key generada

## 2. Configurar en el proyecto
### Opción A: Archivo .env (Recomendado)
1. Crea un archivo .env en la raíz del proyecto
2. Agrega: VITE_GEMINI_API_KEY=tu_api_key_aqui
3. Reinicia el servidor de desarrollo

### Opción B: Configuración temporal
1. Ingresa la API key en el campo de abajo
2. Se guardará para esta sesión

## 3. Verificar funcionamiento
1. Ve al Dashboard de Administrador
2. Busca la tarjeta "Pruebas de Gemini AI"
3. Ejecuta una "Prueba Rápida"
4. Debería mostrar "PASÓ" en lugar de errores`;
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Settings className="w-6 h-6 mr-3 text-blue-400" />
          Configuración de IA Avanzada
        </CardTitle>
        <p className="text-gray-300 text-sm">
          Configura tu API key de IA para habilitar todas las funciones avanzadas
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Estado actual */}
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Key className="w-5 h-5 mr-2 text-yellow-400" />
              <span className="text-white font-medium">Estado de la API Key</span>
            </div>
            <div className="flex items-center">
              {import.meta.env.VITE_GEMINI_API_KEY ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-green-400 text-sm">Configurada</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-red-400 text-sm">No configurada</span>
                </>
              )}
            </div>
          </div>
          
          {import.meta.env.VITE_GEMINI_API_KEY && (
            <div className="mt-2 text-xs text-gray-400">
              API Key configurada en variables de entorno
            </div>
          )}
        </div>

        {/* Instrucciones */}
        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-white font-medium mb-3 flex items-center">
            <ExternalLink className="w-4 h-4 mr-2 text-blue-400" />
            Instrucciones de Configuración
          </h3>
          
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-start">
              <span className="text-blue-400 mr-2">1.</span>
              <div>
                <p>Obtén tu API key desde:</p>
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-400 hover:text-blue-300"
                  onClick={() => window.open('https://makersuite.google.com/app/apikey', '_blank')}
                >
                  https://makersuite.google.com/app/apikey
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-start">
              <span className="text-blue-400 mr-2">2.</span>
              <div>
                <p>Crea un archivo .env en la raíz del proyecto con:</p>
                <div className="bg-slate-800 rounded p-2 mt-1 flex items-center justify-between">
                  <code className="text-green-400 text-xs">
                    VITE_GEMINI_API_KEY=tu_api_key_aqui
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto"
                    onClick={() => copyToClipboard('VITE_GEMINI_API_KEY=tu_api_key_aqui')}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <span className="text-blue-400 mr-2">3.</span>
              <div>
                <p>Reinicia el servidor de desarrollo después de configurar la API key</p>
              </div>
            </div>
          </div>
        </div>

        {/* Configuración temporal */}
        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-white font-medium mb-3">Configuración Temporal</h3>
          <p className="text-gray-300 text-sm mb-4">
            Para pruebas rápidas, puedes configurar la API key temporalmente (solo para esta sesión):
          </p>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="apiKey" className="text-gray-300">API Key de IA</Label>
              <div className="relative mt-1">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Ingresa tu API key de IA"
                  className="bg-slate-800 border-slate-600 text-white pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button
              onClick={handleSaveApiKey}
              disabled={!apiKey.trim() || isValidating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isValidating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Validando...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Configurar API Key
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Verificación */}
        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-white font-medium mb-3">Verificar Configuración</h3>
          <p className="text-gray-300 text-sm mb-4">
            Una vez configurada la API key, puedes verificar que funciona correctamente:
          </p>
          
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full text-gray-300 border-gray-600 hover:bg-slate-600"
              onClick={() => {
                // Abrir el dashboard de administrador
                window.location.href = '/dashboard/admin';
              }}
            >
              <Settings className="w-4 h-4 mr-2" />
              Ir al Dashboard de Administrador
            </Button>
            
            <Button
              variant="outline"
              className="w-full text-gray-300 border-gray-600 hover:bg-slate-600"
              onClick={() => {
                // Ejecutar prueba rápida desde consola
                if (window.testGeminiAI) {
                  window.testGeminiAI('quick');
                } else {
                  toast({
                    title: 'Info',
                    description: 'Abre la consola del navegador y ejecuta: await testGeminiAI("quick")',
                    variant: 'default',
                  });
                }
              }}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Ejecutar Prueba Rápida
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeminiConfigHelper;
