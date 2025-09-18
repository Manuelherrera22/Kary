import React, { useState, useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';
import { User, Users, Search, Info, Loader2 } from 'lucide-react';

const StudentSelectionStep = ({ assignmentData, updateAssignmentData, students, loadingStudents }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.grade && student.grade.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [students, searchTerm]);

  const handleStudentSelection = (studentId) => {
    const isSelected = assignmentData.selectedStudents.some(s => s.id === studentId);
    if (isSelected) {
      updateAssignmentData({ selectedStudents: assignmentData.selectedStudents.filter(s => s.id !== studentId) });
    } else {
      const studentToAdd = students.find(s => s.id === studentId);
      if (studentToAdd) {
        updateAssignmentData({ selectedStudents: [...assignmentData.selectedStudents, studentToAdd] });
      }
    }
  };
  
  const handleSelectAllFiltered = () => {
    const allFilteredSelected = filteredStudents.every(fs => assignmentData.selectedStudents.some(ss => ss.id === fs.id));
    if (allFilteredSelected) {
      // Deselect all filtered
      const remainingSelected = assignmentData.selectedStudents.filter(ss => !filteredStudents.some(fs => fs.id === ss.id));
      updateAssignmentData({ selectedStudents: remainingSelected });
    } else {
      // Select all filtered that are not already selected
      const newSelectedStudents = [...assignmentData.selectedStudents];
      filteredStudents.forEach(fs => {
        if (!assignmentData.selectedStudents.some(ss => ss.id === fs.id)) {
          newSelectedStudents.push(fs);
        }
      });
      updateAssignmentData({ selectedStudents: newSelectedStudents });
    }
  };


  if (loadingStudents) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
        <p className="mt-4 text-slate-400">{t('common.loadingStudents')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="student-search" className="text-lg font-semibold text-purple-300 mb-2 block flex items-center">
          <Search size={20} className="mr-2 text-purple-400" /> {t('smartAssignment.searchStudentLabel')}
        </Label>
        <Input
          id="student-search"
          type="text"
          placeholder={t('smartAssignment.searchStudentPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-800 border-slate-700 hover:border-purple-500 focus:ring-purple-500"
        />
      </div>
      
      {filteredStudents.length > 0 && (
        <div className="flex justify-between items-center">
            <Label className="text-sm text-slate-400">
                {t('smartAssignment.showingStudentsCount', { count: filteredStudents.length, total: students.length })}
            </Label>
            <button 
                onClick={handleSelectAllFiltered}
                className="text-sm text-purple-400 hover:text-purple-300 underline"
            >
                {filteredStudents.every(fs => assignmentData.selectedStudents.some(ss => ss.id === fs.id)) 
                    ? t('smartAssignment.deselectAllFiltered') 
                    : t('smartAssignment.selectAllFiltered')}
            </button>
        </div>
      )}

      <ScrollArea className="h-72 border border-slate-700 rounded-md p-4 bg-slate-800/50">
        {filteredStudents.length > 0 ? (
          <div className="space-y-3">
            {filteredStudents.map(student => (
              <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700/80 transition-colors border border-slate-600">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`student-${student.id}`}
                    checked={assignmentData.selectedStudents.some(s => s.id === student.id)}
                    onCheckedChange={() => handleStudentSelection(student.id)}
                    className="border-slate-500 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-600"
                  />
                  <Label htmlFor={`student-${student.id}`} className="text-sm text-slate-200 cursor-pointer">
                    {student.full_name} ({student.grade || t('common.noGrade')})
                  </Label>
                </div>
                {student.diagnostic_summary && (
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={16} className="text-slate-400 hover:text-purple-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-800 text-white border-slate-700 max-w-xs">
                        <p className="font-semibold text-purple-300 mb-1">{t('smartAssignment.diagnosticSummaryTooltipTitle')}</p>
                        <p className="text-xs">{student.diagnostic_summary}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-10">{t('smartAssignment.noStudentsMatch')}</p>
        )}
      </ScrollArea>
       <p className="text-sm text-slate-400 mt-2">
          {t('smartAssignment.selectedStudentsCount', { count: assignmentData.selectedStudents.length })}
        </p>
    </div>
  );
};

export default StudentSelectionStep;