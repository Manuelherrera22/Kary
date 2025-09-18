import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';

const StudentSelector = ({ t, students, selectedStudentId, onStudentChange }) => {
  return (
    <div className="mb-8 p-6 bg-slate-700/30 rounded-xl border border-slate-600/70 shadow-inner">
      <Label htmlFor="student-select-support" className="text-slate-300 mb-2 block font-semibold text-lg">
        {t('supportPlans.filterByStudent')}
      </Label>
      <Select 
        value={selectedStudentId || 'all_students'} 
        onValueChange={onStudentChange}
      >
        <SelectTrigger id="student-select-support" className="w-full sm:w-auto min-w-[280px] bg-slate-700 border-slate-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-md transition-all">
          <SelectValue placeholder={t('supportPlans.selectStudentPlaceholder')} />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-700 text-white shadow-xl">
          <SelectItem value="all_students" className="hover:bg-slate-700 focus:bg-slate-600">{t('supportPlans.allStudents')}</SelectItem>
          {students.map(student => (
            <SelectItem key={student.id} value={student.id} className="hover:bg-slate-700 focus:bg-slate-600">
              {student.full_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StudentSelector;