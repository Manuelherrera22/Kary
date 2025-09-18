import React, { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Users, Filter, Search, ChevronDown, ChevronUp } from 'lucide-react';

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

export default AssignmentSection;