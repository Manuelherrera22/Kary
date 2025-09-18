import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, PlusCircle, Trash2, Save } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const EvaluationModal = ({ isOpen, onOpenChange, evaluation, onSave }) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { userProfile } = useAuth();

  const [formData, setFormData] = useState({
    student_id: '',
    title: '',
    evaluation_date: new Date().toISOString().split('T')[0],
    status: 'in_progress',
  });
  const [tests, setTests] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isEditMode = !!evaluation;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return format(date, 'PPP', { locale: language === 'es' ? es : undefined });
  };

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name')
        .eq('role', 'student');
      if (error) throw error;
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({ title: t('toasts.errorTitle'), description: t('evaluations.fetchStudentsError'), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    if (evaluation) {
      setFormData({
        student_id: evaluation.student_id,
        title: evaluation.title,
        evaluation_date: evaluation.evaluation_date,
        status: evaluation.status,
      });
      setTests(evaluation.tests || []);
      setComments(evaluation.comments || []);
    } else {
      setFormData({
        student_id: '',
        title: '',
        evaluation_date: new Date().toISOString().split('T')[0],
        status: 'in_progress',
      });
      setTests([]);
      setComments([]);
    }
  }, [evaluation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestChange = (index, field, value) => {
    const newTests = [...tests];
    if (field === 'results') {
      try {
        newTests[index][field] = JSON.parse(value);
      } catch (e) {
        // Handle JSON parse error if needed, for now, just keep it as a string
        // Or maybe we should have key-value inputs for results
        newTests[index][field] = value;
      }
    } else {
      newTests[index][field] = value;
    }
    setTests(newTests);
  };

  const addTest = () => {
    setTests([...tests, { test_name: '', results: {} }]);
  };

  const removeTest = (index) => {
    setTests(tests.filter((_, i) => i !== index));
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !isEditMode) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.rpc('agregar_comentario', {
        p_evaluation_id: evaluation.id,
        p_author_id: userProfile.id,
        p_comment_text: newComment,
      });
      if (error) throw error;
      setComments([...comments, { author_name: userProfile.full_name, comment_text: newComment, created_at: new Date().toISOString() }]);
      setNewComment('');
      toast({ title: t('toasts.successTitle'), description: t('evaluations.commentAddedSuccess') });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({ title: t('toasts.errorTitle'), description: t('evaluations.commentAddedError'), variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let evaluationId = evaluation?.id;
      if (!isEditMode) {
        const { data, error } = await supabase.rpc('crear_evaluacion', {
          p_student_id: formData.student_id,
          p_psychopedagogue_id: userProfile.id,
          p_evaluation_date: formData.evaluation_date,
          p_title: formData.title,
        });
        if (error) throw error;
        evaluationId = data;
      } else {
        const { error } = await supabase
          .from('evaluations')
          .update({
            title: formData.title,
            evaluation_date: formData.evaluation_date,
            status: formData.status,
          })
          .eq('id', evaluationId);
        if (error) throw error;
      }

      for (const test of tests) {
        if (test.id) {
          // Update existing test
        } else {
          const { error: testError } = await supabase.rpc('agregar_prueba', {
            p_evaluation_id: evaluationId,
            p_test_name: test.test_name,
            p_results: test.results,
          });
          if (testError) throw testError;
        }
      }

      toast({ title: t('toasts.successTitle'), description: t('evaluations.saveSuccess') });
      onSave();
    } catch (error) {
      console.error('Error saving evaluation:', error);
      toast({ title: t('toasts.errorTitle'), description: `${t('evaluations.saveError')}: ${error.message}`, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[60%] bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-purple-400 text-2xl">{isEditMode ? t('evaluations.editEvaluation') : t('evaluations.newEvaluation')}</DialogTitle>
          <DialogDescription className="text-slate-400">{t('evaluations.modalDescription')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="student_id" className="text-slate-300">{t('evaluations.student')}</Label>
              <Select name="student_id" value={formData.student_id} onValueChange={(value) => handleSelectChange('student_id', value)} disabled={isEditMode}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder={t('evaluations.selectStudent')} />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                  {isLoading ? <SelectItem value="loading" disabled>Loading...</SelectItem> :
                    students.map(s => <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>)
                  }
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="title" className="text-slate-300">{t('evaluations.title')}</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleInputChange} className="bg-slate-800 border-slate-600" />
            </div>
            <div>
              <Label htmlFor="evaluation_date" className="text-slate-300">{t('evaluations.date')}</Label>
              <Input id="evaluation_date" name="evaluation_date" type="date" value={formData.evaluation_date} onChange={handleInputChange} className="bg-slate-800 border-slate-600" />
            </div>
            <div>
              <Label htmlFor="status" className="text-slate-300">{t('evaluations.status')}</Label>
              <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                  <SelectItem value="in_progress">{t('evaluations.statuses.in_progress')}</SelectItem>
                  <SelectItem value="completed">{t('evaluations.statuses.completed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-2">{t('evaluations.tests')}</h3>
            <div className="space-y-4">
              {tests.map((test, index) => (
                <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 flex items-end gap-4">
                  <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">{t('evaluations.testName')}</Label>
                      <Input value={test.test_name} onChange={(e) => handleTestChange(index, 'test_name', e.target.value)} className="bg-slate-700 border-slate-600" />
                    </div>
                    <div>
                      <Label className="text-slate-300">{t('evaluations.resultsJson')}</Label>
                      <Textarea value={typeof test.results === 'string' ? test.results : JSON.stringify(test.results, null, 2)} onChange={(e) => handleTestChange(index, 'results', e.target.value)} className="bg-slate-700 border-slate-600" rows={3} />
                    </div>
                  </div>
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeTest(index)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={addTest} className="mt-4 border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300">
              <PlusCircle size={16} className="mr-2" />
              {t('evaluations.addTest')}
            </Button>
          </div>

          {isEditMode && (
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">{t('evaluations.comments')}</h3>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {comments.map((comment, index) => (
                  <div key={index} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <p className="text-slate-300">{comment.comment_text}</p>
                    <p className="text-xs text-slate-500 mt-1 text-right">
                      - {comment.author_name} @ {formatDate(comment.created_at)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder={t('evaluations.newCommentPlaceholder')} className="bg-slate-800 border-slate-600" />
                <Button type="button" onClick={handleAddComment} disabled={isSaving}>
                  {isSaving ? <Loader2 className="animate-spin" /> : t('evaluations.addComment')}
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>{t('common.cancel')}</Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isSaving}>
              {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
              {t('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EvaluationModal;