import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, User, Briefcase } from 'lucide-react';

const InitialSelector = ({ role, students, onStudentSelect, onGroupSelect, currentSelection }) => {
  const { t } = useLanguage();

  const handleSelectionChange = (value) => {
    const [type, id] = value.split(':');
    if (type === 'student') {
      const student = students.find(s => s.id === id);
      if (student) onStudentSelect(student);
    } else if (type === 'group') {
      onGroupSelect({ id, name: id }); // Placeholder for group object
    }
  };
  
  const getSelectionValue = () => {
    if (currentSelection) {
      return currentSelection.grade ? `group:${currentSelection.grade}` : `student:${currentSelection.id}`;
    }
    return "";
  };


  // This is a simplified version. Real implementation would fetch and structure groups.
  const studentOptions = students.map(student => ({
    value: `student:${student.id}`,
    label: student.full_name || t('common.unknownStudent'),
    icon: <User className="mr-2 h-4 w-4" />
  }));
  
  const groupOptions = role === 'directive' || role === 'program_coordinator' 
    ? [...new Set(students.map(s => s.grade).filter(Boolean))].map(grade => ({
        value: `group:${grade}`,
        label: `${t('roleBasedDataPanel.selector.courseLabel')} ${grade}`,
        icon: <Briefcase className="mr-2 h-4 w-4" />
      }))
    : [];

  const placeholderText = () => {
    switch (role) {
      case 'teacher': return t('roleBasedDataPanel.selector.selectStudentTeacher');
      case 'psychopedagogue': return t('roleBasedDataPanel.selector.selectStudentPsycho');
      case 'directive':
      case 'program_coordinator': return t('roleBasedDataPanel.selector.selectStudentOrGroup');
      case 'parent': return students.length > 0 ? students[0].full_name : t('roleBasedDataPanel.selector.noChildLinked');
      case 'student': return students.length > 0 ? students[0].full_name : t('roleBasedDataPanel.selector.yourData');
      default: return t('roleBasedDataPanel.selector.selectItem');
    }
  };

  if (role === 'parent' || role === 'student') {
    // For parent and student, selection is usually fixed.
    // If there's data, select it automatically; otherwise, show a message or limited selector.
    if (students.length === 1 && !currentSelection) {
        onStudentSelect(students[0]); // Auto-select if only one option
    }
    return (
      <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700/60 rounded-lg">
        <h2 className="text-lg font-semibold text-sky-300 flex items-center">
          {role === 'parent' ? <Users className="mr-2" /> : <User className="mr-2" />}
          {placeholderText()}
        </h2>
      </div>
    );
  }
  

  return (
    <div className="mb-6">
      <Select onValueChange={handleSelectionChange} value={getSelectionValue()}>
        <SelectTrigger className="w-full sm:w-[300px] bg-slate-700 border-slate-600 text-white focus:ring-sky-500">
          <SelectValue placeholder={placeholderText()} />
        </SelectTrigger>
        <SelectContent className="bg-slate-700 border-slate-600 text-white">
          {groupOptions.length > 0 && (
            <>
              <SelectItem value="placeholder-group" disabled className="font-semibold text-sky-300">{t('roleBasedDataPanel.selector.groupsLabel')}</SelectItem>
              {groupOptions.map(option => (
                <SelectItem key={option.value} value={option.value} className="hover:bg-slate-600 focus:bg-slate-600">
                  <div className="flex items-center">{option.icon}{option.label}</div>
                </SelectItem>
              ))}
            </>
          )}
          {studentOptions.length > 0 && (
             <>
              <SelectItem value="placeholder-student" disabled className="font-semibold text-sky-300">{t('roleBasedDataPanel.selector.studentsLabel')}</SelectItem>
              {studentOptions.map(option => (
                <SelectItem key={option.value} value={option.value} className="hover:bg-slate-600 focus:bg-slate-600">
                  <div className="flex items-center">{option.icon}{option.label}</div>
                </SelectItem>
              ))}
            </>
          )}
          {studentOptions.length === 0 && groupOptions.length === 0 && (
            <SelectItem value="no-data" disabled>{t('roleBasedDataPanel.selector.noData')}</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default InitialSelector;