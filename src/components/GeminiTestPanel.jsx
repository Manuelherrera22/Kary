import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import GeminiTestSuite from '@/utils/geminiTestSuite';
import GeminiConfigHelper from '@/components/GeminiConfigHelper';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Brain,
  Users,
  BookOpen,
  Shield,
  MessageCircle,
  Activity,
  BarChart3,
  Loader2,
  RefreshCw,
  Zap,
  Settings
} from 'lucide-react';

const GeminiTestPanel = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [isQuickTest, setIsQuickTest] = useState(false);
  const [showConfigHelper, setShowConfigHelper] = useState(false);

  const testSuite = new GeminiTestSuite();

  const runFullTest = async () => {
    setIsRunning(true);
    setIsQuickTest(false);
    setTestResults(null);

    try {
      toast({
        title: '🧪 Iniciando Pruebas',
        description: 'Ejecutando suite completa de pruebas de Gemini AI...',
      });

      const results = await testSuite.runAllTests();
      setTestResults(results);

      toast({
        title: '✅ Pruebas Completadas',
        description: `Tasa de éxito: ${results.summary?.successRate || 0}%`,
        variant: results.summary?.successRate >= 80 ? 'default' : 'destructive',
      });

    } catch (error) {
      console.error('Error ejecutando pruebas:', error);
      toast({
        title: '❌ Error en Pruebas',
        description: 'Hubo un problema ejecutando las pruebas',
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runQuickTest = async () => {
    setIsRunning(true);
    setIsQuickTest(true);
    setTestResults(null);

    try {
      toast({
        title: '⚡ Prueba Rápida',
        description: 'Verificando conectividad con Gemini AI...',
      });

      const result = await testSuite.quickTest();
      
      setTestResults({
        summary: {
          totalTests: 1,
          passedTests: result.status === 'passed' ? 1 : 0,
          failedTests: result.status === 'passed' ? 0 : 1,
          successRate: result.status === 'passed' ? 100 : 0,
          overallStatus: result.status === 'passed' ? 'excellent' : 'needs_attention'
        },
        quickTest: result
      });

      toast({
        title: result.status === 'passed' ? '✅ Conexión Exitosa' : '❌ Problema de Conexión',
        description: result.status === 'passed' ? 'Gemini AI está funcionando correctamente' : 'No se pudo conectar con Gemini AI',
        variant: result.status === 'passed' ? 'default' : 'destructive',
      });

    } catch (error) {
      console.error('Error en prueba rápida:', error);
      toast({
        title: '❌ Error en Prueba Rápida',
        description: 'Hubo un problema ejecutando la prueba',
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed':
        return 'bg-green-600';
      case 'failed':
        return 'bg-red-600';
      default:
        return 'bg-yellow-600';
    }
  };

  const getOverallStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'from-green-600 to-emerald-600';
      case 'good':
        return 'from-yellow-600 to-orange-600';
      default:
        return 'from-red-600 to-rose-600';
    }
  };

  const getOverallStatusText = (status) => {
    switch (status) {
      case 'excellent':
        return '¡Excelente!';
      case 'good':
        return 'Bueno';
      default:
        return 'Necesita Atención';
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Brain className="w-6 h-6 mr-3 text-purple-400" />
          Panel de Pruebas de Gemini AI
        </CardTitle>
        <p className="text-gray-300 text-sm">
          Verifica que todos los ciclos y herramientas estén funcionando correctamente con IA real
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Botones de Acción */}
        <div className="flex gap-4">
          <Button
            onClick={runQuickTest}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isRunning && isQuickTest ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            Prueba Rápida
          </Button>
          
          <Button
            onClick={runFullTest}
            disabled={isRunning}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isRunning && !isQuickTest ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Suite Completa
          </Button>
          
          {testResults && (
            <>
              <Button
                onClick={() => setTestResults(null)}
                variant="outline"
                className="text-gray-300 border-gray-600"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
              
              <Button
                onClick={() => setShowConfigHelper(!showConfigHelper)}
                variant="outline"
                className="text-gray-300 border-gray-600"
              >
                <Settings className="w-4 h-4 mr-2" />
                {showConfigHelper ? 'Ocultar' : 'Configurar'} API Key
              </Button>
            </>
          )}
        </div>

        {/* Resultados */}
        {testResults && (
          <div className="space-y-4">
            {/* Resumen General */}
            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Resumen de Pruebas</h3>
                  <Badge className={`${getStatusColor(testResults.summary.overallStatus)} text-white`}>
                    {getOverallStatusText(testResults.summary.overallStatus)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{testResults.summary.totalTests}</div>
                    <div className="text-sm text-gray-400">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{testResults.summary.passedTests}</div>
                    <div className="text-sm text-gray-400">Pasaron</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{testResults.summary.failedTests}</div>
                    <div className="text-sm text-gray-400">Fallaron</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{testResults.summary.successRate}%</div>
                    <div className="text-sm text-gray-400">Éxito</div>
                  </div>
                </div>

                <Progress 
                  value={testResults.summary.successRate} 
                  className="h-2"
                />
              </CardContent>
            </Card>

            {/* Prueba Rápida */}
            {testResults.quickTest && (
              <Card className="bg-slate-700 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">Prueba Rápida</h3>
                    </div>
                    {getStatusIcon(testResults.quickTest.status)}
                  </div>
                  <p className="text-gray-300 mt-2">
                    {testResults.quickTest.status === 'passed' 
                      ? 'Conexión con Gemini AI establecida correctamente'
                      : `Error: ${testResults.quickTest.error}`
                    }
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Mensaje Final */}
            <Card className={`bg-gradient-to-r ${getOverallStatusColor(testResults.summary.overallStatus)} border-transparent`}>
              <CardContent className="p-4 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {testResults.summary.overallStatus === 'excellent' && '🎉 ¡Sistema Funcionando Perfectamente!'}
                  {testResults.summary.overallStatus === 'good' && '⚠️ Sistema Funcionando con Algunas Fallas'}
                  {testResults.summary.overallStatus === 'needs_attention' && '🚨 Sistema Necesita Atención'}
                </h3>
                <p className="text-white/90 text-sm">
                  {testResults.summary.overallStatus === 'excellent' && 'Todas las herramientas están operativas con Gemini AI'}
                  {testResults.summary.overallStatus === 'good' && 'La mayoría de funciones están operativas, revisar fallas menores'}
                  {testResults.summary.overallStatus === 'needs_attention' && 'Hay problemas significativos que requieren revisión inmediata'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Estado de Carga */}
        {isRunning && (
          <Card className="bg-slate-700 border-slate-600">
            <CardContent className="p-6 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {isQuickTest ? 'Ejecutando Prueba Rápida...' : 'Ejecutando Suite Completa...'}
              </h3>
              <p className="text-gray-300">
                {isQuickTest 
                  ? 'Verificando conectividad con Gemini AI'
                  : 'Probando todos los dashboards y herramientas'
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* Helper de Configuración */}
        {showConfigHelper && (
          <div className="mt-6">
            <GeminiConfigHelper 
              onConfigUpdate={(apiKey) => {
                toast({
                  title: '✅ API Key Configurada',
                  description: 'La API key se ha configurado correctamente. Recarga la página para aplicar los cambios.',
                  variant: 'default',
                });
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeminiTestPanel;