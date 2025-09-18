import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { Loader2, PlusCircle, BookPlus, Tag, Link as LinkIcon, Type, FileText as FileTextIcon, Users, Filter, Search, ChevronDown, ChevronUp, Video as VideoIcon, Activity } from 'lucide-react';

const validResourceTypes = [
  { value: 'guía', labelKey: 'createResourceModal.types.guide', icon: FileTextIcon },
  { value: 'actividad', labelKey: 'createResourceModal.types.activity', icon: Activity },
  { value: 'video', labelKey: 'createResourceModal.types.video', icon: VideoIcon },
  { value: 'documento', labelKey: 'createResourceModal.types.document', icon: FileTextIcon },
];

const AssignmentSection = ({
  assignNow,
  onAssignNowChange,
  fetchingAssignmentData,
  grades,
  selectedGrades,
  onGradeSelectionChange,
  students,
  selectedStudentIds,
  onStudentSelectionChange,
  studentSearchTerm,
  onStudentSearchTermChange,
  showStudentList,
  onToggleStudentList,
  t
}) => {
  const filteredStudents = useMemo(() => {
    return students.filter(student => 
      student.full_name.toLowerCase().includes(studentSearchTerm.toLowerCase())
    );
  }, [students, studentSearchTerm]);

  const handleStudentSelection = (studentId) => {
    onStudentSelectionChange(prev => 
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const handleGradeSelection = (grade) => {
    onGradeSelectionChange(prev => 
      prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]
    );
  };


  return (
    <div className="pt-4 border-t border-slate-700/50">
      <div className="flex items-center space-x-2 mb-3">
        <Switch 
          id="assign-now" 
          checked={assignNow} 
          onCheckedChange={onAssignNowChange}
          className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-slate-600"
        />
        <Label htmlFor="assign-now" className="text-slate-300 text-lg font-medium text-purple-400">
          {t('createResourceModal.assignNowLabel')}
        </Label>
      </div>

      {assignNow && (
        fetchingAssignmentData ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          </div>
        ) : (
          <div className="space-y-4 p-4 bg-slate-700/30 rounded-md">
            <div>
              <h3 className="text-md font-semibold text-slate-200 mb-2 flex items-center">
                <Filter size={18} className="mr-2 text-purple-400" />
                {t('createResourceModal.assignToGradesLabel')}
              </h3>
              {grades.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {grades.map(grade => (
                    <div key={grade} className="flex items-center space-x-2 p-2 bg-slate-600/50 rounded-md hover:bg-slate-600 transition-colors">
                      <Checkbox
                        id={`grade-${grade}`}
                        checked={selectedGrades.includes(grade)}
                        onCheckedChange={() => handleGradeSelection(grade)}
                        className="border-slate-500 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-600"
                      />
                      <Label htmlFor={`grade-${grade}`} className="text-sm text-slate-300 cursor-pointer flex-grow">{grade}</Label>
                    </div>
                  ))}
                </div>
              ) : (
                  <p className="text-sm text-slate-400">{t('createResourceModal.noGradesAvailable')}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-semibold text-slate-200 flex items-center">
                  <Users size={18} className="mr-2 text-purple-400" />
                  {t('createResourceModal.assignToStudentsLabel')}
                </h3>
                <Button variant="ghost" size="sm" onClick={onToggleStudentList} className="text-purple-400 hover:text-purple-300 px-2">
                  {showStudentList ? t('createResourceModal.hideList') : t('createResourceModal.showList')}
                  {showStudentList ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                </Button>
              </div>
              {showStudentList && (
                <>
                  <div className="relative mb-2">
                      <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input
                      type="text"
                      placeholder={t('createResourceModal.searchStudentPlaceholder')}
                      value={studentSearchTerm}
                      onChange={(e) => onStudentSearchTermChange(e.target.value)}
                      className="pl-8 bg-slate-600/80 border-slate-500 text-slate-100 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <ScrollArea className="h-48 border border-slate-600 rounded-md p-2 bg-slate-700/50">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map(student => (
                        <div key={student.id} className="flex items-center space-x-2 p-1.5 hover:bg-slate-600 rounded transition-colors">
                          <Checkbox
                            id={`student-${student.id}`}
                            checked={selectedStudentIds.includes(student.id)}
                            onCheckedChange={() => handleStudentSelection(student.id)}
                            className="border-slate-500 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-600"
                          />
                          <Label htmlFor={`student-${student.id}`} className="text-sm text-slate-300 cursor-pointer">
                            {student.full_name} <span className="text-xs text-slate-400">({student.grade || t('createResourceModal.noGrade')})</span>
                          </Label>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-center text-slate-400 py-4">{t('createResourceModal.noStudentsMatchSearch')}</p>
                    )}
                  </ScrollArea>
                </>
              )}
                {!students.length && !fetchingAssignmentData && <p className="text-sm text-slate-400">{t('createResourceModal.noStudentsAvailable')}</p>}
            </div>
          </div>
        )
      )}
    </div>
  );
};


export default function CreateResourceModal({ onResourceCreatedAndAssigned, children }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user: authUser } = useMockAuth();
  const [open, setOpen] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [fetchingAssignmentData, setFetchingAssignmentData] = useState(false);

  const [assignNow, setAssignNow] = useState(false);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [showStudentList, setShowStudentList] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('');
    setUrl('');
    setTags('');
    setPublished(true);
    setAssignNow(false);
    setSelectedStudentIds([]);
    setSelectedGrades([]);
    setStudentSearchTerm('');
    setShowStudentList(false);
  };

  useEffect(() => {
    const fetchAssignmentData = async () => {
      if (!open || !assignNow || !authUser) return;
      setFetchingAssignmentData(true);
      try {
        const { data: studentsData, error: studentsError } = await supabase
          .from('user_profiles')
          .select('id, full_name, grade')
          .eq('role', 'student')
          .order('full_name', { ascending: true });

        if (studentsError) throw studentsError;
        setStudents(studentsData || []);

        const uniqueGrades = [...new Set(studentsData.map(s => s.grade).filter(Boolean).sort())];
        setGrades(uniqueGrades);

      } catch (error) {
        console.error('Error fetching assignment data:', error);
        toast({
          title: t('toast.errorTitle'),
          description: t('createResourceModal.fetchAssignmentDataError'),
          variant: 'destructive',
        });
      } finally {
        setFetchingAssignmentData(false);
      }
    };

    fetchAssignmentData();
  }, [open, assignNow, authUser, toast, t]);

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  const handleSubmit = async () => {
    if (!title || !type) {
      toast({
        title: t('toast.warningTitle'),
        description: t('createResourceModal.validationErrorRequiredFields'),
        variant: 'destructive',
      });
      return;
    }

    if (!validResourceTypes.find(rt => rt.value === type)) {
      toast({
        title: t('toast.warningTitle'),
        description: t('createResourceModal.validationErrorInvalidType'),
        variant: 'destructive',
      });
      return;
    }

    if (url && !/^https?:\/\/.+/.test(url)) {
      toast({
        title: t('toast.warningTitle'),
        description: t('createResourceModal.validationErrorInvalidUrl'),
        variant: 'destructive',
      });
      return;
    }

    if (assignNow && selectedStudentIds.length === 0 && selectedGrades.length === 0) {
      toast({
        title: t('toast.warningTitle'),
        description: t('createResourceModal.validationErrorNoStudentsOrGradesSelected'),
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    if (!authUser || !authUser.id) {
      toast({
        title: t('toast.errorTitle'),
        description: t('createResourceModal.authErrorUserNotLoaded'),
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    const resourceData = {
      title,
      description,
      type,
      url: url || null, 
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      published,
      created_by: authUser.id, 
    };

    const { data: newResource, error: resourceError } = await supabase
      .from('learning_resources')
      .insert([resourceData])
      .select()
      .single();

    if (resourceError) {
      console.error('Error creating learning resource:', resourceError);
      toast({
        title: t('toast.errorTitle'),
        description: t('createResourceModal.createError') + (resourceError.message ? `: ${resourceError.message}` : ''),
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    toast({
      title: t('toast.successTitle'),
      description: t('createResourceModal.createSuccess'),
    });

    let assignedStudentCount = 0;
    if (assignNow && newResource) {
      let studentIdsToAssign = [...selectedStudentIds];

      if (selectedGrades.length > 0) {
        const { data: studentsInGrades, error: gradeStudentsError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('role', 'student')
          .in('grade', selectedGrades);

        if (gradeStudentsError) {
          toast({
            title: t('toast.errorTitle'),
            description: t('createResourceModal.fetchStudentsInGradeError'),
            variant: 'destructive',
          });
        } else if (studentsInGrades) {
          studentIdsToAssign = [...new Set([...studentIdsToAssign, ...studentsInGrades.map(s => s.id)])];
        }
      }
      
      if (studentIdsToAssign.length > 0) {
        const assignments = studentIdsToAssign.map(studentId => ({
          recurso_id: newResource.id,
          estudiante_id: studentId,
          asignado_por: authUser.id,
          created_at: new Date().toISOString(),
        }));

        const { error: assignmentError } = await supabase.from('recursos_asignados').insert(assignments);

        if (assignmentError) {
          console.error('Error assigning resource:', assignmentError);
          toast({
            title: t('toast.errorTitle'),
            description: t('createResourceModal.assignError') + (assignmentError.message ? `: ${assignmentError.message}` : ''),
            variant: 'destructive',
          });
        } else {
          assignedStudentCount = studentIdsToAssign.length;
          toast({
            title: t('toast.successTitle'),
            description: t('createResourceModal.assignSuccess', { count: assignedStudentCount }),
          });
        }
      }
    }

    resetForm();
    setOpen(false);
    if (onResourceCreatedAndAssigned) {
      onResourceCreatedAndAssigned(newResource, assignedStudentCount > 0);
    }
    setLoading(false);
  };
  
  const triggerContent = children || (
    <Button className="bg-sky-500 hover:bg-sky-600 text-white">
      <BookPlus size={20} className="mr-2" />
      {t('createResourceModal.triggerButtonUnified')}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {triggerContent}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-slate-800 border-slate-700 text-slate-50">
        <DialogHeader>
          <DialogTitle className="text-sky-400 text-2xl flex items-center">
            <BookPlus size={28} className="mr-3 text-sky-400" />
            {t('createResourceModal.titleUnified')}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {t('createResourceModal.descriptionUnified')}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] p-1">
          <div className="grid gap-4 py-4 pr-3">
            <div className="space-y-1">
              <Label htmlFor="resource-title" className="text-slate-300 flex items-center">
                <FileTextIcon size={16} className="mr-2 text-sky-400" />
                {t('createResourceModal.resourceTitleLabel')} <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input 
                id="resource-title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder={t('createResourceModal.resourceTitlePlaceholder')}
                className="bg-slate-700 border-slate-600 text-slate-50 focus:ring-sky-500" 
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="resource-type" className="text-slate-300 flex items-center">
                <Type size={16} className="mr-2 text-sky-400" />
                {t('createResourceModal.resourceTypeLabel')} <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="resource-type" className="w-full bg-slate-700 border-slate-600 text-slate-50 focus:ring-sky-500">
                  <SelectValue placeholder={t('createResourceModal.resourceTypePlaceholder')} />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-slate-50">
                  {validResourceTypes.map((rt) => {
                    const Icon = rt.icon;
                    return (
                      <SelectItem key={rt.value} value={rt.value} className="hover:bg-slate-600 focus:bg-slate-600">
                        <div className="flex items-center">
                          <Icon size={16} className="mr-2 opacity-70" /> {t(rt.labelKey, rt.value)}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="resource-description" className="text-slate-300 flex items-center">
                <FileTextIcon size={16} className="mr-2 text-sky-400" />
                {t('createResourceModal.resourceDescriptionLabel')}
              </Label>
              <Textarea 
                id="resource-description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder={t('createResourceModal.resourceDescriptionPlaceholder')}
                className="bg-slate-700 border-slate-600 text-slate-50 focus:ring-sky-500 min-h-[80px]"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="resource-url" className="text-slate-300 flex items-center">
                <LinkIcon size={16} className="mr-2 text-sky-400" />
                {t('createResourceModal.resourceUrlLabel')}
              </Label>
              <Input 
                id="resource-url" 
                type="url"
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                placeholder={t('createResourceModal.resourceUrlPlaceholder')}
                className="bg-slate-700 border-slate-600 text-slate-50 focus:ring-sky-500" 
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="resource-tags" className="text-slate-300 flex items-center">
                <Tag size={16} className="mr-2 text-sky-400" />
                {t('createResourceModal.resourceTagsLabel')}
              </Label>
              <Input 
                id="resource-tags" 
                value={tags} 
                onChange={(e) => setTags(e.target.value)} 
                placeholder={t('createResourceModal.resourceTagsPlaceholder')}
                className="bg-slate-700 border-slate-600 text-slate-50 focus:ring-sky-500" 
              />
              <p className="text-xs text-slate-400">{t('createResourceModal.resourceTagsHint')}</p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="resource-published" 
                checked={published} 
                onCheckedChange={setPublished}
                className="data-[state=checked]:bg-sky-500 data-[state=unchecked]:bg-slate-600"
              />
              <Label htmlFor="resource-published" className="text-slate-300">
                {t('createResourceModal.publishResourceLabel')}
              </Label>
            </div>
            
            <AssignmentSection
              assignNow={assignNow}
              onAssignNowChange={setAssignNow}
              fetchingAssignmentData={fetchingAssignmentData}
              grades={grades}
              selectedGrades={selectedGrades}
              onGradeSelectionChange={setSelectedGrades}
              students={students}
              selectedStudentIds={selectedStudentIds}
              onStudentSelectionChange={setSelectedStudentIds}
              studentSearchTerm={studentSearchTerm}
              onStudentSearchTermChange={setStudentSearchTerm}
              showStudentList={showStudentList}
              onToggleStudentList={() => setShowStudentList(!showStudentList)}
              t={t}
            />

          </div>
        </ScrollArea>
        
        <DialogFooter className="sm:justify-between pt-4 border-t border-slate-700">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100 w-full sm:w-auto">
              {t('common.cancelButton')}
            </Button>
          </DialogClose>
          <Button 
            type="button" 
            onClick={handleSubmit} 
            disabled={loading || !title || !type || (assignNow && fetchingAssignmentData)} 
            className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-semibold disabled:opacity-60"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
            {loading ? t('createResourceModal.processingButton') : (assignNow && (selectedStudentIds.length > 0 || selectedGrades.length > 0)) ? t('createResourceModal.createAndAssignButton') : t('createResourceModal.createButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}