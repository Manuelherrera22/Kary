import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Brain, Users, Zap, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import psychopedagogueService from '@/services/psychopedagogueService';

const IntelligentAssignmentModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    criteria: 'balanced',
    priority: 'medium',
    workload: 'normal',
    specialization: '',
    maxAssignments: 5,
    notes: ''
  });
  const [availableCases, setAvailableCases] = useState([]);
  const [availablePsychopedagogues, setAvailablePsychopedagogues] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [casesResult, psychopedagoguesResult] = await Promise.all([
        psychopedagogueService.getAllCases(),
        psychopedagogueService.getAllPsychopedagogues()
      ]);

      if (casesResult.success) {
        setAvailableCases(casesResult.data);
      }
      if (psychopedagoguesResult.success) {
        setAvailablePsychopedagogues(psychopedagoguesResult.data);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateIntelligentAssignments = async () => {
    setAnalyzing(true);
    setError('');

    try {
      // Simular análisis de IA
      await new Promise(resolve => setTimeout(resolve, 2000));

      const suggestions = await psychopedagogueService.generateIntelligentAssignments({
        cases: availableCases,
        psychopedagogues: availablePsychopedagogues,
        criteria: formData.criteria,
        priority: formData.priority,
        workload: formData.workload,
        specialization: formData.specialization,
        maxAssignments: formData.maxAssignments
      });

      if (suggestions.success) {
        setAiSuggestions(suggestions.data);
      } else {
        setError(suggestions.error || 'Error al generar asignaciones inteligentes');
      }
    } catch (err) {
      setError('Error al generar asignaciones inteligentes');
    } finally {
      setAnalyzing(false);
    }
  };

  const applyAssignments = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await psychopedagogueService.applyIntelligentAssignments(aiSuggestions);
      if (result.success) {
        alert('Asignaciones aplicadas exitosamente');
        onClose();
        setAiSuggestions([]);
      } else {
        setError(result.error || 'Error al aplicar asignaciones');
      }
    } catch (err) {
      setError('Error al aplicar asignaciones');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-800 rounded-2xl border border-slate-600 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="border-0 bg-slate-800">
            <CardHeader className="relative">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Star size={24} className="text-purple-300" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-200">
                    Asignación Inteligente
                  </CardTitle>
                  <p className="text-slate-400 mt-1">
                    Utilice IA avanzada para optimizar la asignación de casos
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
              >
                <X size={20} />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              {/* Configuración de IA */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                  <Brain size={20} className="text-purple-300" />
                  Configuración de IA
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="criteria" className="text-slate-300">Criterio de Asignación</Label>
                    <Select value={formData.criteria} onValueChange={(value) => handleInputChange('criteria', value)}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-slate-200">
                        <SelectValue placeholder="Seleccionar criterio" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="balanced">Equilibrado</SelectItem>
                        <SelectItem value="specialization">Por Especialización</SelectItem>
                        <SelectItem value="workload">Por Carga de Trabajo</SelectItem>
                        <SelectItem value="experience">Por Experiencia</SelectItem>
                        <SelectItem value="priority">Por Prioridad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-slate-300">Prioridad Mínima</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-slate-200">
                        <SelectValue placeholder="Seleccionar prioridad" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="workload" className="text-slate-300">Carga de Trabajo</Label>
                    <Select value={formData.workload} onValueChange={(value) => handleInputChange('workload', value)}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-slate-200">
                        <SelectValue placeholder="Seleccionar carga" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="light">Ligera</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="heavy">Pesada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxAssignments" className="text-slate-300">Máximo de Asignaciones</Label>
                    <Input
                      id="maxAssignments"
                      type="number"
                      min="1"
                      max="20"
                      value={formData.maxAssignments}
                      onChange={(e) => handleInputChange('maxAssignments', parseInt(e.target.value))}
                        className="bg-slate-700 border-slate-500 text-slate-100"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialization" className="text-slate-300">Especialización Requerida</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    placeholder="TDAH, dislexia, autismo, etc. (opcional)"
                        className="bg-slate-700 border-slate-500 text-slate-100"
                  />
                </div>
              </div>

              {/* Botón de Generación */}
              <div className="flex justify-center">
                <Button
                  onClick={generateIntelligentAssignments}
                  disabled={analyzing}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
                >
                  {analyzing ? (
                    <>
                      <Loader className="animate-spin mr-2" size={20} />
                      Analizando con IA...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2" size={20} />
                      Generar Asignaciones Inteligentes
                    </>
                  )}
                </Button>
              </div>

              {/* Progreso de Análisis */}
              {analyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Analizando casos y profesionales...</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              )}

              {/* Sugerencias de IA */}
              {aiSuggestions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-300" />
                    Sugerencias de IA
                  </h3>
                  
                  <div className="space-y-3">
                    {aiSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-slate-700 rounded-lg border border-slate-500"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-slate-200">{suggestion.caseTitle}</h4>
                            <p className="text-sm text-slate-400">{suggestion.studentName}</p>
                          </div>
                          <Badge className={
                            suggestion.confidence > 0.8 ? 'bg-green-500/20 text-green-300' :
                            suggestion.confidence > 0.6 ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-orange-500/20 text-orange-300'
                          }>
                            {Math.round(suggestion.confidence * 100)}% confianza
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Asignado a:</span>
                            <p className="text-slate-200">{suggestion.assignedTo}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Razón:</span>
                            <p className="text-slate-200">{suggestion.reason}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
                    <Button
                      variant="ghost"
                      onClick={() => setAiSuggestions([])}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      Descartar
                    </Button>
                    <Button
                      onClick={applyAssignments}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {loading ? 'Aplicando...' : 'Aplicar Asignaciones'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Botones de Acción */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-700/50">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-200"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IntelligentAssignmentModal;
