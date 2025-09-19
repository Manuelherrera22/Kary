import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Calendar, GraduationCap, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import psychopedagogueService from '@/services/psychopedagogueService';

const StudentRegistrationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    grade: '',
    school: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalInfo: '',
    learningNeeds: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const result = await psychopedagogueService.registerStudent(formData);
      if (result.success) {
        // Mostrar mensaje de éxito
        alert('Estudiante registrado exitosamente');
        onClose();
        // Limpiar formulario
        setFormData({
          name: '',
          email: '',
          phone: '',
          birthDate: '',
          grade: '',
          school: '',
          address: '',
          emergencyContact: '',
          emergencyPhone: '',
          medicalInfo: '',
          learningNeeds: '',
          notes: ''
        });
      } else {
        setError(result.error || 'Error al registrar estudiante');
      }
    } catch (err) {
      setError('Error al registrar estudiante');
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
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <User size={24} className="text-blue-300" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-200">
                    Registrar Nuevo Estudiante
                  </CardTitle>
                  <p className="text-slate-400 mt-1">
                    Complete la información del estudiante para el registro
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
                {/* Información Personal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <User size={20} className="text-blue-300" />
                    Información Personal
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-300">Nombre Completo *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Nombre y apellidos"
                        className="bg-slate-700 border-slate-500 text-slate-100"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="correo@ejemplo.com"
                        className="bg-slate-700 border-slate-500 text-slate-100"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-slate-300">Teléfono</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="bg-slate-700 border-slate-500 text-slate-100"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="birthDate" className="text-slate-300">Fecha de Nacimiento</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        className="bg-slate-700 border-slate-500 text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Información Académica */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <GraduationCap size={20} className="text-green-300" />
                    Información Académica
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="grade" className="text-slate-300">Grado *</Label>
                      <Select value={formData.grade} onValueChange={(value) => handleInputChange('grade', value)}>
                        <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-slate-200">
                          <SelectValue placeholder="Seleccionar grado" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="pre-k">Pre-Kínder</SelectItem>
                          <SelectItem value="k">Kínder</SelectItem>
                          <SelectItem value="1">1er Grado</SelectItem>
                          <SelectItem value="2">2do Grado</SelectItem>
                          <SelectItem value="3">3er Grado</SelectItem>
                          <SelectItem value="4">4to Grado</SelectItem>
                          <SelectItem value="5">5to Grado</SelectItem>
                          <SelectItem value="6">6to Grado</SelectItem>
                          <SelectItem value="7">7mo Grado</SelectItem>
                          <SelectItem value="8">8vo Grado</SelectItem>
                          <SelectItem value="9">9no Grado</SelectItem>
                          <SelectItem value="10">10mo Grado</SelectItem>
                          <SelectItem value="11">11mo Grado</SelectItem>
                          <SelectItem value="12">12mo Grado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="school" className="text-slate-300">Institución Educativa</Label>
                      <Input
                        id="school"
                        value={formData.school}
                        onChange={(e) => handleInputChange('school', e.target.value)}
                        placeholder="Nombre de la escuela"
                        className="bg-slate-700 border-slate-500 text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Información de Contacto de Emergencia */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <Phone size={20} className="text-orange-300" />
                    Contacto de Emergencia
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact" className="text-slate-300">Nombre del Contacto</Label>
                      <Input
                        id="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        placeholder="Nombre completo"
                        className="bg-slate-700 border-slate-500 text-slate-100"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone" className="text-slate-300">Teléfono de Emergencia</Label>
                      <Input
                        id="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="bg-slate-700 border-slate-500 text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Información Adicional */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <AlertCircle size={20} className="text-purple-300" />
                    Información Adicional
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="medicalInfo" className="text-slate-300">Información Médica</Label>
                      <Textarea
                        id="medicalInfo"
                        value={formData.medicalInfo}
                        onChange={(e) => handleInputChange('medicalInfo', e.target.value)}
                        placeholder="Alergias, medicamentos, condiciones especiales..."
                        className="bg-slate-800/50 border-slate-600/50 text-slate-200 min-h-[80px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="learningNeeds" className="text-slate-300">Necesidades de Aprendizaje</Label>
                      <Textarea
                        id="learningNeeds"
                        value={formData.learningNeeds}
                        onChange={(e) => handleInputChange('learningNeeds', e.target.value)}
                        placeholder="TDAH, dislexia, dificultades de aprendizaje..."
                        className="bg-slate-800/50 border-slate-600/50 text-slate-200 min-h-[80px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-slate-300">Notas Adicionales</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Información adicional relevante..."
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
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? 'Registrando...' : 'Registrar Estudiante'}
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

export default StudentRegistrationModal;
