import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  Users, 
  BookOpen,
  Heart,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Star,
  Zap
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import psychopedagogueService from '@/services/psychopedagogueService';
import activityService from '@/services/activityService';

const AISuggestionsEngine = () => {
  const { t } = useLanguage();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = [
    { id: 'all', label: 'Todas', icon: Brain },
    { id: 'intervention', label: 'Intervenciones', icon: Target },
    { id: 'assessment', label: 'Evaluaciones', icon: BookOpen },
    { id: 'emotional', label: 'Emocional', icon: Heart },
    { id: 'academic', label: 'Académico', icon: TrendingUp },
    { id: 'behavioral', label: 'Comportamental', icon: Users }
  ];

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const result = await psychopedagogueService.generateAISuggestions();
      if (result.success) {
        setSuggestions(result.data);
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
      // Fallback data
      const mockSuggestions = [
        {
          id: 1,
          category: 'intervention',
          title: 'Implementar Técnicas de Mindfulness',
          description: 'Basado en el análisis de casos de ansiedad, se recomienda implementar técnicas de mindfulness para 3 estudiantes que muestran signos de estrés académico.',
          priority: 'high',
          confidence: 0.92,
          impact: 'high',
          effort: 'medium',
          students: ['María García', 'Ana Rodríguez', 'Carlos López'],
          evidence: 'Análisis de patrones emocionales y rendimiento académico',
          action: 'Crear programa de 8 semanas con sesiones de 15 minutos diarios',
          expectedOutcome: 'Reducción del 40% en episodios de ansiedad reportados',
          icon: Brain,
          color: 'purple'
        },
        {
          id: 2,
          category: 'assessment',
          title: 'Evaluación Neuropsicológica Completa',
          description: 'Se detectaron patrones que sugieren la necesidad de una evaluación neuropsicológica más profunda para identificar posibles dificultades de aprendizaje no diagnosticadas.',
          priority: 'high',
          confidence: 0.87,
          impact: 'high',
          effort: 'high',
          students: ['Carlos López'],
          evidence: 'Análisis de rendimiento en diferentes áreas cognitivas',
          action: 'Coordinar con neuropsicólogo especializado en dificultades de aprendizaje',
          expectedOutcome: 'Diagnóstico preciso y plan de intervención personalizado',
          icon: BookOpen,
          color: 'blue'
        },
        {
          id: 3,
          category: 'emotional',
          title: 'Programa de Regulación Emocional',
          description: 'Análisis de datos emocionales revela la necesidad de un programa estructurado de regulación emocional para estudiantes con TDAH.',
          priority: 'medium',
          confidence: 0.78,
          impact: 'medium',
          effort: 'medium',
          students: ['María García', 'Luis Pérez'],
          evidence: 'Patrones de desregulación emocional en situaciones de frustración',
          action: 'Implementar técnicas de respiración y autoinstrucciones positivas',
          expectedOutcome: 'Mejora en la autorregulación emocional del 60%',
          icon: Heart,
          color: 'red'
        },
        {
          id: 4,
          category: 'academic',
          title: 'Adaptación Curricular Multisensorial',
          description: 'Para estudiantes con dislexia, se recomienda implementar adaptaciones curriculares que utilicen múltiples canales sensoriales.',
          priority: 'medium',
          confidence: 0.85,
          impact: 'high',
          effort: 'low',
          students: ['Ana Rodríguez', 'Carlos López'],
          evidence: 'Análisis de estilos de aprendizaje y rendimiento en lectura',
          action: 'Crear materiales visuales, auditivos y kinestésicos para conceptos clave',
          expectedOutcome: 'Mejora del 35% en comprensión lectora',
          icon: TrendingUp,
          color: 'green'
        },
        {
          id: 5,
          category: 'behavioral',
          title: 'Sistema de Refuerzo Positivo',
          description: 'Implementar un sistema de refuerzo positivo basado en el análisis de comportamientos para motivar el aprendizaje.',
          priority: 'low',
          confidence: 0.72,
          impact: 'medium',
          effort: 'low',
          students: ['Todos los estudiantes'],
          evidence: 'Análisis de patrones de motivación y engagement',
          action: 'Crear sistema de puntos y recompensas personalizadas',
          expectedOutcome: 'Aumento del 25% en participación activa',
          icon: Users,
          color: 'yellow'
        }
      ];
      setSuggestions(mockSuggestions);
    } finally {
      setLoading(false);
    }
  };

  const generateNewSuggestions = async () => {
    setIsGenerating(true);
    try {
      // Simular generación de nuevas sugerencias
      await new Promise(resolve => setTimeout(resolve, 2000));
      await loadSuggestions();
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const implementSuggestion = async (suggestionId) => {
    try {
      // Aquí se implementaría la lógica para aplicar la sugerencia
      console.log('Implementing suggestion:', suggestionId);
      // Por ahora, solo marcamos como implementada
      setSuggestions(prev => 
        prev.map(s => 
          s.id === suggestionId 
            ? { ...s, status: 'implemented', implementedAt: new Date().toISOString() }
            : s
        )
      );
    } catch (error) {
      console.error('Error implementing suggestion:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getEffortColor = (effort) => {
    switch (effort) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const filteredSuggestions = selectedCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-200">Motor de Sugerencias IA</h2>
          <p className="text-slate-400">Recomendaciones inteligentes basadas en análisis de datos</p>
        </div>
        <Button 
          onClick={generateNewSuggestions}
          disabled={isGenerating}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isGenerating ? (
            <>
              <RefreshCw size={20} className="mr-2 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Zap size={20} className="mr-2" />
              Generar Nuevas
            </>
          )}
        </Button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={
                selectedCategory === category.id
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "border-slate-600 text-slate-300 hover:bg-slate-700"
              }
            >
              <IconComponent size={16} className="mr-2" />
              {category.label}
            </Button>
          );
        })}
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {filteredSuggestions.length === 0 ? (
          <Card className="bg-slate-800/90 border-slate-700/50">
            <CardContent className="p-8 text-center">
              <Lightbulb size={48} className="mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No hay sugerencias</h3>
              <p className="text-slate-400">No se encontraron sugerencias para la categoría seleccionada.</p>
            </CardContent>
          </Card>
        ) : (
          filteredSuggestions.map((suggestion) => {
            const IconComponent = suggestion.icon;
            return (
              <Card key={suggestion.id} className="bg-slate-800/90 border-slate-700/50 hover:border-slate-600/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${suggestion.color}-500/20`}>
                        <IconComponent size={24} className={`text-${suggestion.color}-400`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-200">{suggestion.title}</h3>
                          <Badge className={getPriorityColor(suggestion.priority)}>
                            {suggestion.priority}
                          </Badge>
                          {suggestion.status === 'implemented' && (
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                              <CheckCircle size={14} className="mr-1" />
                              Implementada
                            </Badge>
                          )}
                        </div>
                        <p className="text-slate-300 mb-3">{suggestion.description}</p>
                        
                        {/* Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-sm text-slate-400">Confianza</p>
                            <p className={`text-lg font-semibold ${getConfidenceColor(suggestion.confidence)}`}>
                              {Math.round(suggestion.confidence * 100)}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-slate-400">Impacto</p>
                            <p className={`text-lg font-semibold ${getImpactColor(suggestion.impact)}`}>
                              {suggestion.impact}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-slate-400">Esfuerzo</p>
                            <p className={`text-lg font-semibold ${getEffortColor(suggestion.effort)}`}>
                              {suggestion.effort}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-slate-400">Estudiantes</p>
                            <p className="text-lg font-semibold text-slate-200">
                              {suggestion.students.length}
                            </p>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-slate-400 font-medium">Evidencia: </span>
                            <span className="text-slate-300">{suggestion.evidence}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">Acción: </span>
                            <span className="text-slate-300">{suggestion.action}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">Resultado Esperado: </span>
                            <span className="text-slate-300">{suggestion.expectedOutcome}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">Estudiantes: </span>
                            <span className="text-slate-300">{suggestion.students.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {suggestion.status !== 'implemented' && (
                        <Button
                          onClick={() => implementSuggestion(suggestion.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle size={16} className="mr-2" />
                          Implementar
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Brain size={20} className="text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-200">{suggestions.length}</p>
                <p className="text-sm text-slate-400">Sugerencias Generadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-200">
                  {suggestions.filter(s => s.status === 'implemented').length}
                </p>
                <p className="text-sm text-slate-400">Implementadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Star size={20} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-200">
                  {Math.round(suggestions.reduce((acc, s) => acc + s.confidence, 0) / suggestions.length * 100)}%
                </p>
                <p className="text-sm text-slate-400">Confianza Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AISuggestionsEngine;


