import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, User, AlertTriangle, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import psychopedagogueService from '@/services/psychopedagogueService';

const CaseCreationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    initialAssessment: '',
    objectives: '',
    expectedOutcome: ''
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadStudents();
    }
  }, [isOpen]);

  const loadStudents = async () => {
    try {
      const result = await psychopedagogueService.getAllStudents();
      if (result.success) {
        setStudents(result.data);
      }
    } catch (err) {
      console.error('Error loading students:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await psychopedagogueService.createCase(formData);
      if (result.success) {
        alert('Caso creado exitosamente');
        onClose();
        setFormData({
          studentId: '',
          title: '',
          description: '',
          priority: 'medium',
          category: '',
          initialAssessment: '',
          objectives: '',
          expectedOutcome: ''
        });
      } else {
        setError(result.error || 'Error al crear caso');
      }
    } catch (err) {
      setError('Error al crear caso');
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
          className="bg-slate-800 rounded-2xl border border-slate-600 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="border-0 bg-slate-800">
            <CardHeader className="relative">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <Briefcase size={24} className="text-green-300" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-200">
                    Crear Nuevo Caso
                  </CardTitle>
                  <p className="text-slate-400 mt-1">
                    Registre un nuevo caso psicopedagógico
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
                  <AlertTriangle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información del Caso */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <Briefcase size={20} className="text-green-300" />
                    Información del Caso
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentId" className="text-slate-300">Estudiante *</Label>
                      <Select value={formData.studentId} onValueChange={(value) => handleInputChange('studentId', value)}>
                        <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-slate-200">
                          <SelectValue placeholder="Seleccionar estudiante" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name} - {student.grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-slate-300">Prioridad *</Label>
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
                      <Label htmlFor="title" className="text-slate-300">Título del Caso *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Título descriptivo del caso"
                        className="bg-slate-700 border-slate-500 text-slate-100"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-slate-300">Categoría</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-slate-200">
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="learning">Dificultades de Aprendizaje</SelectItem>
                          <SelectItem value="behavioral">Problemas Conductuales</SelectItem>
                          <SelectItem value="emotional">Problemas Emocionales</SelectItem>
                          <SelectItem value="social">Problemas Sociales</SelectItem>
                          <SelectItem value="attention">Problemas de Atención</SelectItem>
                          <SelectItem value="other">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-300">Descripción del Caso *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describa detalladamente la situación del estudiante..."
                      className="bg-slate-800/50 border-slate-600/50 text-slate-200 min-h-[100px]"
                      required
                    />
                  </div>
                </div>

                {/* Evaluación Inicial */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <FileText size={20} className="text-blue-300" />
                    Evaluación Inicial
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="initialAssessment" className="text-slate-300">Evaluación Inicial</Label>
                    <Textarea
                      id="initialAssessment"
                      value={formData.initialAssessment}
                      onChange={(e) => handleInputChange('initialAssessment', e.target.value)}
                      placeholder="Resultados de la evaluación inicial, observaciones, pruebas aplicadas..."
                      className="bg-slate-800/50 border-slate-600/50 text-slate-200 min-h-[100px]"
                    />
                  </div>
                </div>

                {/* Objetivos y Resultados Esperados */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <Calendar size={20} className="text-purple-300" />
                    Objetivos y Resultados
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="objectives" className="text-slate-300">Objetivos del Caso</Label>
                      <Textarea
                        id="objectives"
                        value={formData.objectives}
                        onChange={(e) => handleInputChange('objectives', e.target.value)}
                        placeholder="Objetivos específicos a alcanzar con este caso..."
                        className="bg-slate-800/50 border-slate-600/50 text-slate-200 min-h-[80px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="expectedOutcome" className="text-slate-300">Resultado Esperado</Label>
                      <Textarea
                        id="expectedOutcome"
                        value={formData.expectedOutcome}
                        onChange={(e) => handleInputChange('expectedOutcome', e.target.value)}
                        placeholder="Resultado esperado al finalizar el caso..."
                        className="bg-slate-800/50 border-slate-600/50 text-slate-200 min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-700/50">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {loading ? 'Creando...' : 'Crear Caso'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CaseCreationModal;
