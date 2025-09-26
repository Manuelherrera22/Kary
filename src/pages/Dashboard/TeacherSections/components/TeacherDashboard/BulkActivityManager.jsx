import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Users, 
  Calendar, 
  BookOpen, 
  Target,
  Send,
  X,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const BulkActivityManager = ({ students, onActivitiesCreated }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [activityData, setActivityData] = useState({
    title: '',
    description: '',
    type: 'reading',
    dueDate: '',
    priority: 'medium',
    estimatedTime: '30'
  });
  const [isCreating, setIsCreating] = useState(false);

  const activityTypes = [
    { value: 'reading', label: t('teacherDashboard.activityTypes.reading', 'Lectura'), icon: BookOpen },
    { value: 'writing', label: t('teacherDashboard.activityTypes.writing', 'Escritura'), icon: BookOpen },
    { value: 'math', label: t('teacherDashboard.activityTypes.math', 'Matemáticas'), icon: Target },
    { value: 'science', label: t('teacherDashboard.activityTypes.science', 'Ciencias'), icon: BookOpen },
    { value: 'art', label: t('teacherDashboard.activityTypes.art', 'Arte'), icon: BookOpen },
    { value: 'physical', label: t('teacherDashboard.activityTypes.physical', 'Educación Física'), icon: Target }
  ];

  const priorityLevels = [
    { value: 'low', label: t('common.lowPriority', 'Baja'), color: 'text-blue-400' },
    { value: 'medium', label: t('common.mediumPriority', 'Media'), color: 'text-yellow-400' },
    { value: 'high', label: t('common.highPriority', 'Alta'), color: 'text-red-400' }
  ];

  const handleStudentToggle = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id));
    }
  };

  const handleCreateActivities = async () => {
    if (selectedStudents.length === 0 || !activityData.title) return;
    
    setIsCreating(true);
    
    // Simular creación de actividades
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const activities = selectedStudents.map(studentId => ({
      id: `bulk-${Date.now()}-${studentId}`,
      student_id: studentId,
      title: activityData.title,
      description: activityData.description,
      type: activityData.type,
      due_date: activityData.dueDate,
      priority: activityData.priority,
      estimated_time: parseInt(activityData.estimatedTime),
      status: 'draft',
      created_at: new Date().toISOString()
    }));
    
    if (onActivitiesCreated) {
      onActivitiesCreated(activities);
    }
    
    // Reset form
    setSelectedStudents([]);
    setActivityData({
      title: '',
      description: '',
      type: 'reading',
      dueDate: '',
      priority: 'medium',
      estimatedTime: '30'
    });
    setIsOpen(false);
    setIsCreating(false);
  };

  const getPriorityColor = (priority) => {
    const level = priorityLevels.find(p => p.value === priority);
    return level ? level.color : 'text-gray-400';
  };

  const getTypeIcon = (type) => {
    const activityType = activityTypes.find(t => t.value === type);
    return activityType ? activityType.icon : BookOpen;
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
      >
        <Plus size={16} className="mr-2" />
        {t('teacherDashboard.bulkActivities.create', 'Crear Actividades Masivas')}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-lg border border-slate-600 w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="border-0 bg-slate-800">
                <CardHeader className="border-b border-slate-600 bg-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                        <Users size={20} className="text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-white">
                          {t('teacherDashboard.bulkActivities.title', 'Crear Actividades Masivas')}
                        </CardTitle>
                        <p className="text-sm text-slate-300">
                          {t('teacherDashboard.bulkActivities.subtitle', 'Asigna la misma actividad a múltiples estudiantes')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-slate-300 hover:text-white hover:bg-slate-600"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6 max-h-[60vh] overflow-y-auto bg-slate-800">
                  {/* Student Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">
                        {t('teacherDashboard.bulkActivities.selectStudents', 'Seleccionar Estudiantes')}
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        className="text-white border-purple-500 hover:bg-purple-500 hover:text-white"
                      >
                        {selectedStudents.length === students.length 
                          ? t('teacherDashboard.bulkActivities.deselectAll', 'Deseleccionar Todos')
                          : t('teacherDashboard.bulkActivities.selectAll', 'Seleccionar Todos')
                        }
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {students.map((student) => (
                        <div
                          key={student.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                            selectedStudents.includes(student.id)
                              ? 'bg-blue-500 border-blue-400'
                              : 'bg-slate-700 border-slate-500 hover:bg-slate-600'
                          }`}
                          onClick={() => handleStudentToggle(student.id)}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedStudents.includes(student.id)}
                              onChange={() => handleStudentToggle(student.id)}
                              className="border-slate-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-400"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-white">{student.full_name}</p>
                              <p className="text-sm text-slate-300">{student.grade}</p>
                            </div>
                            {selectedStudents.includes(student.id) && (
                              <CheckCircle size={16} className="text-blue-300" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      {t('teacherDashboard.bulkActivities.activityDetails', 'Detalles de la Actividad')}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">
                          {t('teacherDashboard.bulkActivities.title', 'Título')} *
                        </label>
                        <Input
                          value={activityData.title}
                          onChange={(e) => setActivityData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder={t('teacherDashboard.bulkActivities.titlePlaceholder', 'Ej: Lectura de comprensión')}
                          className="bg-slate-700 border-slate-500 text-white placeholder:text-slate-300 focus:border-blue-400 focus:ring-blue-400"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">
                          {t('teacherDashboard.bulkActivities.type', 'Tipo')}
                        </label>
                        <Select
                          value={activityData.type}
                          onValueChange={(value) => setActivityData(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-500 text-white focus:border-blue-400 focus:ring-blue-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-500 text-white">
                            {activityTypes.map((type) => {
                              const Icon = type.icon;
                              return (
                                <SelectItem key={type.value} value={type.value} className="hover:bg-slate-600 focus:bg-slate-600">
                                  <div className="flex items-center gap-2">
                                    <Icon size={14} />
                                    {type.label}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-200">
                        {t('teacherDashboard.bulkActivities.description', 'Descripción')}
                      </label>
                      <Textarea
                        value={activityData.description}
                        onChange={(e) => setActivityData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder={t('teacherDashboard.bulkActivities.descriptionPlaceholder', 'Describe la actividad en detalle...')}
                        className="bg-slate-700 border-slate-500 text-white placeholder:text-slate-300 focus:border-blue-400 focus:ring-blue-400"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">
                          {t('teacherDashboard.bulkActivities.dueDate', 'Fecha de Vencimiento')}
                        </label>
                        <Input
                          type="date"
                          value={activityData.dueDate}
                          onChange={(e) => setActivityData(prev => ({ ...prev, dueDate: e.target.value }))}
                          className="bg-slate-700 border-slate-500 text-white focus:border-blue-400 focus:ring-blue-400"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">
                          {t('teacherDashboard.bulkActivities.priority', 'Prioridad')}
                        </label>
                        <Select
                          value={activityData.priority}
                          onValueChange={(value) => setActivityData(prev => ({ ...prev, priority: value }))}
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-500 text-white focus:border-blue-400 focus:ring-blue-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-500 text-white">
                            {priorityLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value} className="hover:bg-slate-600 focus:bg-slate-600">
                                <span className={level.color}>{level.label}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">
                          {t('teacherDashboard.bulkActivities.estimatedTime', 'Tiempo Estimado (min)')}
                        </label>
                        <Input
                          type="number"
                          value={activityData.estimatedTime}
                          onChange={(e) => setActivityData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                          className="bg-slate-700 border-slate-500 text-white focus:border-blue-400 focus:ring-blue-400"
                          min="5"
                          max="180"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  {selectedStudents.length > 0 && (
                    <div className="bg-slate-600 rounded-lg p-4 border border-slate-500">
                      <h4 className="font-semibold text-white mb-2">
                        {t('teacherDashboard.bulkActivities.summary', 'Resumen')}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-slate-200">
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          {selectedStudents.length} {t('teacherDashboard.bulkActivities.students', 'estudiantes')}
                        </div>
                        <div className="flex items-center gap-1">
                          {React.createElement(getTypeIcon(activityData.type), { size: 14 })}
                          {activityTypes.find(t => t.value === activityData.type)?.label}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {activityData.estimatedTime} min
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertCircle size={14} className={getPriorityColor(activityData.priority)} />
                          {priorityLevels.find(p => p.value === activityData.priority)?.label}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>

                <div className="border-t border-slate-600 p-6 bg-slate-700/50">
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      className="text-white border-slate-400 hover:bg-slate-600 hover:text-white"
                    >
                      {t('common.cancel', 'Cancelar')}
                    </Button>
                    <Button
                      onClick={handleCreateActivities}
                      disabled={selectedStudents.length === 0 || !activityData.title || isCreating}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreating ? (
                        <>
                          <Clock size={16} className="mr-2 animate-spin" />
                          {t('teacherDashboard.bulkActivities.creating', 'Creando...')}
                        </>
                      ) : (
                        <>
                          <Send size={16} className="mr-2" />
                          {t('teacherDashboard.bulkActivities.createActivities', 'Crear Actividades')}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BulkActivityManager;
