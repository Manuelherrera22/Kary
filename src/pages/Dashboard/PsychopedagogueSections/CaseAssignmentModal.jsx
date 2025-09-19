import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, User, Briefcase, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import psychopedagogueService from '@/services/psychopedagogueService';

const CaseAssignmentModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    caseId: '',
    assignedTo: '',
    assignmentType: 'psychopedagogue',
    priority: 'medium',
    notes: '',
    dueDate: '',
    objectives: ''
  });
  const [cases, setCases] = useState([]);
  const [psychopedagogues, setPsychopedagogues] = useState([]);
  const [loading, setLoading] = useState(false);
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
        setCases(casesResult.data);
      }
      if (psychopedagoguesResult.success) {
        setPsychopedagogues(psychopedagoguesResult.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await psychopedagogueService.assignCase(formData);
      if (result.success) {
        alert('Caso asignado exitosamente');
        onClose();
        setFormData({
          caseId: '',
          assignedTo: '',
          assignmentType: 'psychopedagogue',
          priority: 'medium',
          notes: '',
          dueDate: '',
          objectives: ''
        });
      } else {
        setError(result.error || 'Error al asignar caso');
      }
    } catch (err) {
      setError('Error al asignar caso');
    } finally {
      setLoading(false);
    }
  };

  const selectedCase = cases.find(case_ => case_.id === formData.caseId);

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
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <Users size={24} className="text-orange-300" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-200">
                    Asignar Caso
                  </CardTitle>
                  <p className="text-slate-400 mt-1">
                    Asigne un caso a un psicopedagogo o especialista
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
                {/* Selección de Caso */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <Briefcase size={20} className="text-orange-300" />
                    Selección de Caso
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="caseId" className="text-slate-300">Caso a Asignar *</Label>
                    <Select value={formData.caseId} onValueChange={(value) => handleInputChange('caseId', value)}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-slate-200">
                        <SelectValue placeholder="Seleccionar caso" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {cases.map((case_) => (
                          <SelectItem key={case_.id} value={case_.id}>
                            <div className="flex flex-col">
                              <span className="font-semibold">{case_.title}</span>
                              <span className="text-sm text-slate-400">
                                {case_.studentName} - {case_.category}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Información del Caso Seleccionado */}
                  {selectedCase && (
                    <div className="p-4 bg-slate-700 rounded-lg border border-slate-500">
                      <h4 className="font-semibold text-slate-200 mb-2">Información del Caso</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Estudiante:</span>
                          <p className="text-slate-200">{selectedCase.studentName}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Prioridad:</span>
                          <Badge className={
                            selectedCase.priority === 'urgent' ? 'bg-red-500/20 text-red-300' :
                            selectedCase.priority === 'high' ? 'bg-orange-500/20 text-orange-300' :
                            selectedCase.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-green-500/20 text-green-300'
                          }>
                            {selectedCase.priority}
                          </Badge>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-slate-400">Descripción:</span>
                          <p className="text-slate-200 mt-1">{selectedCase.description}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Asignación */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <User size={20} className="text-blue-300" />
                    Asignación
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assignmentType" className="text-slate-300">Tipo de Asignación *</Label>
                      <Select value={formData.assignmentType} onValueChange={(value) => handleInputChange('assignmentType', value)}>
                        <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-slate-200">
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="psychopedagogue">Psicopedagogo</SelectItem>
                          <SelectItem value="psychologist">Psicólogo</SelectItem>
                          <SelectItem value="specialist">Especialista</SelectItem>
                          <SelectItem value="teacher">Profesor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="assignedTo" className="text-slate-300">Asignar a *</Label>
                      <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange('assignedTo', value)}>
                        <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-slate-200">
                          <SelectValue placeholder="Seleccionar profesional" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          {psychopedagogues.map((psychopedagogue) => (
                            <SelectItem key={psychopedagogue.id} value={psychopedagogue.id}>
                              {psychopedagogue.name} - {psychopedagogue.specialization}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-slate-300">Prioridad de Asignación</Label>
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
                      <Label htmlFor="dueDate" className="text-slate-300">Fecha Límite</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        className="bg-slate-700 border-slate-500 text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Objetivos y Notas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <Calendar size={20} className="text-purple-300" />
                    Objetivos y Notas
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="objectives" className="text-slate-300">Objetivos de la Asignación</Label>
                      <Textarea
                        id="objectives"
                        value={formData.objectives}
                        onChange={(e) => handleInputChange('objectives', e.target.value)}
                        placeholder="Objetivos específicos para esta asignación..."
                        className="bg-slate-800/50 border-slate-600/50 text-slate-200 min-h-[80px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-slate-300">Notas Adicionales</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Notas adicionales sobre la asignación..."
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
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    {loading ? 'Asignando...' : 'Asignar Caso'}
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

export default CaseAssignmentModal;
