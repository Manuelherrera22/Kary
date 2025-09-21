import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStudentsData } from '@/hooks/useStudentsData';
import { usePIARData } from '@/hooks/usePIARData';
import { Plus, Trash2, Save, X, Target, Users, BookOpen, Activity } from 'lucide-react';

const PIARModal = ({ isOpen, onOpenChange, editingPIAR = null, studentId = null }) => {
  const { t } = useLanguage();
  const { students } = useStudentsData();
  const { createPIAR, updatePIAR } = usePIARData(students);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    student_id: studentId || '',
    diagnostic_info: {
      learning_style: 'visual',
      attention_span: 'medium',
      reading_level: 'intermediate',
      math_level: 'intermediate',
      social_skills: 'developing',
      emotional_regulation: 'developing',
      physical_needs: 'none',
      communication_style: 'verbal_preferred'
    },
    specific_needs: [],
    reasonable_adjustments: [],
    goals: [],
    teaching_strategies: [],
    recommended_activities: []
  });

  useEffect(() => {
    if (editingPIAR) {
      setFormData(editingPIAR);
    } else if (studentId) {
      setFormData(prev => ({ ...prev, student_id: studentId }));
    }
  }, [editingPIAR, studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingPIAR) {
        await updatePIAR(editingPIAR.id, formData);
      } else {
        await createPIAR(formData);
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving PIAR:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSpecificNeed = () => {
    setFormData(prev => ({
      ...prev,
      specific_needs: [...prev.specific_needs, {
        category: 'academic',
        need: '',
        description: '',
        priority: 'medium',
        strategies: []
      }]
    }));
  };

  const updateSpecificNeed = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      specific_needs: prev.specific_needs.map((need, i) => 
        i === index ? { ...need, [field]: value } : need
      )
    }));
  };

  const addStrategyToNeed = (needIndex) => {
    setFormData(prev => ({
      ...prev,
      specific_needs: prev.specific_needs.map((need, i) => 
        i === needIndex 
          ? { ...need, strategies: [...need.strategies, ''] }
          : need
      )
    }));
  };

  const updateStrategyInNeed = (needIndex, strategyIndex, value) => {
    setFormData(prev => ({
      ...prev,
      specific_needs: prev.specific_needs.map((need, i) => 
        i === needIndex 
          ? { ...need, strategies: need.strategies.map((strategy, j) => 
              j === strategyIndex ? value : strategy
            )}
          : need
      )
    }));
  };

  const removeSpecificNeed = (index) => {
    setFormData(prev => ({
      ...prev,
      specific_needs: prev.specific_needs.filter((_, i) => i !== index)
    }));
  };

  const addReasonableAdjustment = () => {
    setFormData(prev => ({
      ...prev,
      reasonable_adjustments: [...prev.reasonable_adjustments, {
        type: 'instructional',
        adjustment: '',
        description: '',
        implementation: ''
      }]
    }));
  };

  const updateReasonableAdjustment = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      reasonable_adjustments: prev.reasonable_adjustments.map((adjustment, i) => 
        i === index ? { ...adjustment, [field]: value } : adjustment
      )
    }));
  };

  const removeReasonableAdjustment = (index) => {
    setFormData(prev => ({
      ...prev,
      reasonable_adjustments: prev.reasonable_adjustments.filter((_, i) => i !== index)
    }));
  };

  const addGoal = () => {
    setFormData(prev => ({
      ...prev,
      goals: [...prev.goals, {
        id: `goal-${Date.now()}`,
        description: '',
        target_date: '',
        progress: 0,
        strategies: []
      }]
    }));
  };

  const updateGoal = (goalId, field, value) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.map(goal => 
        goal.id === goalId ? { ...goal, [field]: value } : goal
      )
    }));
  };

  const removeGoal = (goalId) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== goalId)
    }));
  };

  const selectedStudent = students.find(s => s.id === formData.student_id);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 text-white"
        forceSolidBackground={true}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {editingPIAR ? t('piar.editPIAR') : t('piar.createNew')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800 border-slate-700">
              <TabsTrigger value="basic" className="data-[state=active]:bg-purple-600">
                <BookOpen className="w-4 h-4 mr-2" />
                Básico
              </TabsTrigger>
              <TabsTrigger value="diagnostic" className="data-[state=active]:bg-purple-600">
                <Activity className="w-4 h-4 mr-2" />
                Diagnóstico
              </TabsTrigger>
              <TabsTrigger value="needs" className="data-[state=active]:bg-purple-600">
                <Users className="w-4 h-4 mr-2" />
                Necesidades
              </TabsTrigger>
              <TabsTrigger value="adjustments" className="data-[state=active]:bg-purple-600">
                <Target className="w-4 h-4 mr-2" />
                Ajustes
              </TabsTrigger>
              <TabsTrigger value="goals" className="data-[state=active]:bg-purple-600">
                <Target className="w-4 h-4 mr-2" />
                Objetivos
              </TabsTrigger>
            </TabsList>

            {/* Tab de Información Básica */}
            <TabsContent value="basic" className="space-y-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">{t('piar.basicInformation.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('piar.basicInformation.student')} *
                    </label>
                    <Select 
                      value={formData.student_id} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, student_id: value }))}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder={t('piar.basicInformation.selectStudent')} />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600 text-white">
                        {students.map(student => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.full_name || student.name || student.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedStudent && (
                    <div className="p-4 bg-slate-700 rounded-lg">
                      <h4 className="font-medium text-white mb-2">Información del Estudiante</h4>
                      <p className="text-gray-300">
                        <strong>Nombre:</strong> {selectedStudent.full_name || selectedStudent.name || selectedStudent.email}
                      </p>
                      <p className="text-gray-300">
                        <strong>Grado:</strong> {selectedStudent.grade || 'No especificado'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab de Información Diagnóstica */}
            <TabsContent value="diagnostic" className="space-y-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">{t('piar.diagnosticInfo.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('piar.diagnosticInfo.learningStyle')}
                      </label>
                      <Select 
                        value={formData.diagnostic_info.learning_style}
                        onValueChange={(value) => setFormData(prev => ({
                          ...prev,
                          diagnostic_info: { ...prev.diagnostic_info, learning_style: value }
                        }))}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600 text-white">
                          <SelectItem value="visual">{t('piar.diagnosticInfo.visual')}</SelectItem>
                          <SelectItem value="auditory">{t('piar.diagnosticInfo.auditory')}</SelectItem>
                          <SelectItem value="kinesthetic">{t('piar.diagnosticInfo.kinesthetic')}</SelectItem>
                          <SelectItem value="mixed">{t('piar.diagnosticInfo.mixed')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('piar.diagnosticInfo.attentionSpan')}
                      </label>
                      <Select 
                        value={formData.diagnostic_info.attention_span}
                        onValueChange={(value) => setFormData(prev => ({
                          ...prev,
                          diagnostic_info: { ...prev.diagnostic_info, attention_span: value }
                        }))}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600 text-white">
                          <SelectItem value="short">{t('piar.diagnosticInfo.short')}</SelectItem>
                          <SelectItem value="medium">{t('piar.diagnosticInfo.medium')}</SelectItem>
                          <SelectItem value="long">{t('piar.diagnosticInfo.long')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('piar.diagnosticInfo.readingLevel')}
                      </label>
                      <Select 
                        value={formData.diagnostic_info.reading_level}
                        onValueChange={(value) => setFormData(prev => ({
                          ...prev,
                          diagnostic_info: { ...prev.diagnostic_info, reading_level: value }
                        }))}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600 text-white">
                          <SelectItem value="basic">{t('piar.diagnosticInfo.basic')}</SelectItem>
                          <SelectItem value="intermediate">{t('piar.diagnosticInfo.intermediate')}</SelectItem>
                          <SelectItem value="advanced">{t('piar.diagnosticInfo.advanced')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('piar.diagnosticInfo.mathLevel')}
                      </label>
                      <Select 
                        value={formData.diagnostic_info.math_level}
                        onValueChange={(value) => setFormData(prev => ({
                          ...prev,
                          diagnostic_info: { ...prev.diagnostic_info, math_level: value }
                        }))}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600 text-white">
                          <SelectItem value="basic">{t('piar.diagnosticInfo.basic')}</SelectItem>
                          <SelectItem value="intermediate">{t('piar.diagnosticInfo.intermediate')}</SelectItem>
                          <SelectItem value="advanced">{t('piar.diagnosticInfo.advanced')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab de Necesidades Específicas */}
            <TabsContent value="needs" className="space-y-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">{t('piar.specificNeeds.title')}</CardTitle>
                  <Button 
                    type="button" 
                    onClick={addSpecificNeed}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('piar.specificNeeds.addNeed')}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.specific_needs.map((need, index) => (
                    <Card key={index} className="bg-slate-700 border-slate-600">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-white">Necesidad {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSpecificNeed(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              {t('piar.specificNeeds.category')}
                            </label>
                            <Select 
                              value={need.category}
                              onValueChange={(value) => updateSpecificNeed(index, 'category', value)}
                            >
                              <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-700 border-slate-600 text-white">
                                <SelectItem value="academic">{t('piar.specificNeeds.academic')}</SelectItem>
                                <SelectItem value="behavioral">{t('piar.specificNeeds.behavioral')}</SelectItem>
                                <SelectItem value="social">{t('piar.specificNeeds.social')}</SelectItem>
                                <SelectItem value="emotional">{t('piar.specificNeeds.emotional')}</SelectItem>
                                <SelectItem value="physical">{t('piar.specificNeeds.physical')}</SelectItem>
                                <SelectItem value="communication">{t('piar.specificNeeds.communication')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              {t('piar.specificNeeds.priority')}
                            </label>
                            <Select 
                              value={need.priority}
                              onValueChange={(value) => updateSpecificNeed(index, 'priority', value)}
                            >
                              <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-700 border-slate-600 text-white">
                                <SelectItem value="high">{t('piar.specificNeeds.high')}</SelectItem>
                                <SelectItem value="medium">{t('piar.specificNeeds.medium')}</SelectItem>
                                <SelectItem value="low">{t('piar.specificNeeds.low')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            {t('piar.specificNeeds.description')}
                          </label>
                          <Textarea
                            value={need.description}
                            onChange={(e) => updateSpecificNeed(index, 'description', e.target.value)}
                            placeholder={t('piar.placeholders.describeNeed')}
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            {t('piar.specificNeeds.strategies')}
                          </label>
                          {need.strategies.map((strategy, strategyIndex) => (
                            <div key={strategyIndex} className="flex gap-2 mb-2">
                              <Input
                                value={strategy}
                                onChange={(e) => updateStrategyInNeed(index, strategyIndex, e.target.value)}
                                placeholder={`Estrategia ${strategyIndex + 1}`}
                                className="bg-slate-600 border-slate-500 text-white"
                              />
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addStrategyToNeed(index)}
                            className="border-slate-500 text-gray-300 hover:bg-slate-600"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            {t('piar.specificNeeds.addStrategy')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {formData.specific_needs.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <p>No hay necesidades específicas agregadas</p>
                      <p className="text-sm">Haz clic en "Agregar Necesidad" para comenzar</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab de Ajustes Razonables */}
            <TabsContent value="adjustments" className="space-y-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">{t('piar.reasonableAdjustments.title')}</CardTitle>
                  <Button 
                    type="button" 
                    onClick={addReasonableAdjustment}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('piar.reasonableAdjustments.addAdjustment')}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.reasonable_adjustments.map((adjustment, index) => (
                    <Card key={index} className="bg-slate-700 border-slate-600">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-white">Ajuste {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeReasonableAdjustment(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              {t('piar.reasonableAdjustments.type')}
                            </label>
                            <Select 
                              value={adjustment.type}
                              onValueChange={(value) => updateReasonableAdjustment(index, 'type', value)}
                            >
                              <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-700 border-slate-600 text-white">
                                <SelectItem value="instructional">{t('piar.reasonableAdjustments.instructional')}</SelectItem>
                                <SelectItem value="environmental">{t('piar.reasonableAdjustments.environmental')}</SelectItem>
                                <SelectItem value="assessment">{t('piar.reasonableAdjustments.assessment')}</SelectItem>
                                <SelectItem value="behavioral">{t('piar.reasonableAdjustments.behavioral')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              {t('piar.reasonableAdjustments.adjustment')}
                            </label>
                            <Input
                              value={adjustment.adjustment}
                              onChange={(e) => updateReasonableAdjustment(index, 'adjustment', e.target.value)}
                              placeholder="Tipo de ajuste"
                              className="bg-slate-600 border-slate-500 text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            {t('piar.reasonableAdjustments.description')}
                          </label>
                          <Textarea
                            value={adjustment.description}
                            onChange={(e) => updateReasonableAdjustment(index, 'description', e.target.value)}
                            placeholder={t('piar.placeholders.describeAdjustment')}
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            {t('piar.reasonableAdjustments.implementation')}
                          </label>
                          <Textarea
                            value={adjustment.implementation}
                            onChange={(e) => updateReasonableAdjustment(index, 'implementation', e.target.value)}
                            placeholder="Cómo implementar este ajuste..."
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {formData.reasonable_adjustments.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <p>No hay ajustes razonables agregados</p>
                      <p className="text-sm">Haz clic en "Agregar Ajuste" para comenzar</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab de Objetivos */}
            <TabsContent value="goals" className="space-y-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">{t('piar.goals.title')}</CardTitle>
                  <Button 
                    type="button" 
                    onClick={addGoal}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('piar.goals.addGoal')}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.goals.map((goal) => (
                    <Card key={goal.id} className="bg-slate-700 border-slate-600">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-white">Objetivo {goal.id}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeGoal(goal.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            {t('piar.goals.description')}
                          </label>
                          <Textarea
                            value={goal.description}
                            onChange={(e) => updateGoal(goal.id, 'description', e.target.value)}
                            placeholder={t('piar.placeholders.describeGoal')}
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              {t('piar.goals.targetDate')}
                            </label>
                            <Input
                              type="date"
                              value={goal.target_date}
                              onChange={(e) => updateGoal(goal.id, 'target_date', e.target.value)}
                              className="bg-slate-600 border-slate-500 text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              {t('piar.goals.progress')} ({goal.progress}%)
                            </label>
                            <Input
                              type="range"
                              min="0"
                              max="100"
                              value={goal.progress}
                              onChange={(e) => updateGoal(goal.id, 'progress', parseInt(e.target.value))}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {formData.goals.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <p>No hay objetivos agregados</p>
                      <p className="text-sm">Haz clic en "Agregar Objetivo" para comenzar</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-500 text-gray-300 hover:bg-slate-700"
            >
              <X className="w-4 h-4 mr-2" />
              {t('piar.actions.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.student_id}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Guardando...' : (editingPIAR ? t('piar.actions.save') : 'Crear PIAR')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PIARModal;
