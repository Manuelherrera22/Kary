import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, User, Calendar, Target, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import psychopedagogueService from '@/services/psychopedagogueService';

const SupportPlansModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    planType: '',
    title: '',
    description: '',
    objectives: [],
    interventions: [],
    duration: '',
    frequency: '',
    priority: 'medium',
    notes: ''
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newIntervention, setNewIntervention] = useState('');

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

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (index) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const addIntervention = () => {
    if (newIntervention.trim()) {
      setFormData(prev => ({
        ...prev,
        interventions: [...prev.interventions, newIntervention.trim()]
      }));
      setNewIntervention('');
    }
  };

  const removeIntervention = (index) => {
    setFormData(prev => ({
      ...prev,
      interventions: prev.interventions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await psychopedagogueService.createSupportPlan(formData);
      if (result.success) {
        alert('Plan de apoyo creado exitosamente');
        onClose();
        setFormData({
          studentId: '',
          planType: '',
          title: '',
          description: '',
          objectives: [],
          interventions: [],
          duration: '',
          frequency: '',
          priority: 'medium',
          notes: ''
        });
      } else {
        setError(result.error || 'Error al crear plan de apoyo');
      }
    } catch (err) {
      setError('Error al crear plan de apoyo');
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
          className="bg-slate-800 rounded-2xl border border-slate-600 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="border-0 bg-slate-800">
            <CardHeader className="relative">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/20 rounded-xl">
                  <FileText size={24} className="text-indigo-300" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-200">
                    Crear Plan de Apoyo
                  </CardTitle>
                  <p className="text-slate-400 mt-1">
                    Desarrolle un plan de intervención personalizado
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

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información Básica */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <User size={20} className="text-indigo-300" />
                    Información Básica
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
                      <Label htmlFor="planType" className="text-slate-300">Tipo de Plan *</Label>
                      <Select value={formData.planType} onValueChange={(value) => handleInputChange('planType', value)}>
                        <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-slate-200">
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="academic">Apoyo Académico</SelectItem>
                          <SelectItem value="behavioral">Intervención Conductual</SelectItem>
                          <SelectItem value="emotional">Apoyo Emocional</SelectItem>
                          <SelectItem value="social">Habilidades Sociales</SelectItem>
                          <SelectItem value="attention">Atención y Concentración</SelectItem>
                          <SelectItem value="comprehensive">Plan Integral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-slate-300">Título del Plan *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Título descriptivo del plan"
                        className="bg-slate-700 border-slate-500 text-slate-100"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-slate-300">Prioridad</Label>
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
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-300">Descripción del Plan *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describa detalladamente el plan de apoyo..."
                      className="bg-slate-800/50 border-slate-600/50 text-slate-200 min-h-[100px]"
                      required
                    />
                  </div>
                </div>

                {/* Objetivos */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <Target size={20} className="text-green-300" />
                    Objetivos del Plan
                  </h3>
                  
                  <div className="space-y-3">
                    {formData.objectives.map((objective, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                        <CheckCircle size={16} className="text-green-300 flex-shrink-0" />
                        <span className="text-slate-200 flex-1">{objective}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeObjective(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                    
                    <div className="flex gap-2">
                      <Input
                        value={newObjective}
                        onChange={(e) => setNewObjective(e.target.value)}
                        placeholder="Agregar nuevo objetivo..."
                        className="bg-slate-700 border-slate-500 text-slate-100"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                      />
                      <Button
                        type="button"
                        onClick={addObjective}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Intervenciones */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <Calendar size={20} className="text-blue-300" />
                    Intervenciones
                  </h3>
                  
                  <div className="space-y-3">
                    {formData.interventions.map((intervention, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                        <div className="w-2 h-2 bg-blue-300 rounded-full flex-shrink-0"></div>
                        <span className="text-slate-200 flex-1">{intervention}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIntervention(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                    
                    <div className="flex gap-2">
                      <Input
                        value={newIntervention}
                        onChange={(e) => setNewIntervention(e.target.value)}
                        placeholder="Agregar nueva intervención..."
                        className="bg-slate-700 border-slate-500 text-slate-100"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIntervention())}
                      />
                      <Button
                        type="button"
                        onClick={addIntervention}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Duración y Frecuencia */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <Calendar size={20} className="text-purple-300" />
                    Duración y Frecuencia
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-slate-300">Duración del Plan</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => handleInputChange('duration', e.target.value)}
                        placeholder="Ej: 3 meses, 6 semanas, etc."
                        className="bg-slate-700 border-slate-500 text-slate-100"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="frequency" className="text-slate-300">Frecuencia</Label>
                      <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
                        <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-slate-200">
                          <SelectValue placeholder="Seleccionar frecuencia" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="daily">Diario</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="biweekly">Quincenal</SelectItem>
                          <SelectItem value="monthly">Mensual</SelectItem>
                          <SelectItem value="as_needed">Según necesidad</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Notas Adicionales */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <FileText size={20} className="text-orange-300" />
                    Notas Adicionales
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-slate-300">Notas y Consideraciones</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Notas adicionales sobre el plan, consideraciones especiales, etc."
                      className="bg-slate-800/50 border-slate-600/50 text-slate-200 min-h-[80px]"
                    />
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
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {loading ? 'Creando...' : 'Crear Plan de Apoyo'}
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

export default SupportPlansModal;
