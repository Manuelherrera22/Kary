import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users2, Sparkles, Filter, CheckSquare, PlusCircle, Edit3, Trash2, Search, Users, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

// Placeholder student data
const mockStudents = Array.from({ length: 20 }, (_, i) => ({
  id: `student-${i + 1}`,
  name: `Estudiante ${String.fromCharCode(65 + i)}`,
  grade: `Grado ${Math.floor(i / 5) + 6}`,
  cognitiveProfile: ['Visual', 'Auditivo', 'Kinestésico'][i % 3],
  emotionalState: ['Estable', 'Ansioso', 'Motivado'][i % 3],
  academicLevel: ['Alto', 'Medio', 'Bajo'][i % 3],
}));


const SmartGroupsModal = ({ isOpen, onOpenChange }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedGroups, setSuggestedGroups] = useState([]);
  const [manualGroupName, setManualGroupName] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  
  const filteredStudents = useMemo(() => 
    mockStudents.filter(s => s.name.toLowerCase().includes(studentSearchTerm.toLowerCase())),
    [studentSearchTerm]
  );

  const handleGenerateSuggestions = async () => {
    setIsLoading(true);
    setSuggestedGroups([]);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI call
    setSuggestedGroups([
      { id: 'group-1', name: t('psychopedagogueDashboard.smartGroupsModal.sampleGroup1Name'), criteria: t('psychopedagogueDashboard.smartGroupsModal.sampleGroup1Criteria'), students: mockStudents.slice(0, 3).map(s=>s.id) },
      { id: 'group-2', name: t('psychopedagogueDashboard.smartGroupsModal.sampleGroup2Name'), criteria: t('psychopedagogueDashboard.smartGroupsModal.sampleGroup2Criteria'), students: mockStudents.slice(3, 7).map(s=>s.id) },
    ]);
    setIsLoading(false);
  };
  
  const handleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const handleCreateManualGroup = () => {
    if (!manualGroupName || selectedStudents.length === 0) {
      // Add toast notification for error
      return;
    }
    // Logic to save manual group
    console.log("Crear grupo manual:", manualGroupName, selectedStudents);
    setManualGroupName('');
    setSelectedStudents([]);
    // Potentially add to a list of user-created groups
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl h-[90vh] flex flex-col bg-slate-800 border-slate-700 text-slate-50 p-0">
        <DialogHeader className="p-6 border-b border-slate-700">
          <DialogTitle className="text-cyan-400 text-2xl flex items-center">
            <Users2 size={28} className="mr-3 text-cyan-400" />
            {t('psychopedagogueDashboard.smartGroupsModal.title')}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {t('psychopedagogueDashboard.smartGroupsModal.description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {/* AI Suggestions Section */}
          <section>
            <h2 className="text-xl font-semibold text-slate-100 mb-3 flex items-center">
              <Sparkles size={22} className="mr-2 text-yellow-400" />
              {t('psychopedagogueDashboard.smartGroupsModal.aiSuggestionsTitle')}
            </h2>
            {!isLoading && suggestedGroups.length === 0 && (
              <Button onClick={handleGenerateSuggestions} className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold">
                <Sparkles size={18} className="mr-2" />
                {t('psychopedagogueDashboard.smartGroupsModal.generateSuggestionsButton')}
              </Button>
            )}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-cyan-400 mb-3" />
                <p className="text-slate-300">{t('psychopedagogueDashboard.smartGroupsModal.loadingSuggestions')}</p>
              </div>
            )}
            {suggestedGroups.length > 0 && !isLoading && (
              <div className="space-y-4">
                {suggestedGroups.map(group => (
                  <div key={group.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                    <h3 className="font-semibold text-cyan-300 text-lg">{group.name}</h3>
                    <p className="text-sm text-slate-400 mb-2">{t('psychopedagogueDashboard.smartGroupsModal.criteriaLabel')}: {group.criteria}</p>
                    <p className="text-sm text-slate-300 mb-2">{t('psychopedagogueDashboard.smartGroupsModal.studentsInGroupLabel', {count: group.students.length})}</p>
                    {/* Add actions like 'Use this group' or 'Edit' */}
                     <Button size="sm" variant="outline" className="text-cyan-300 border-cyan-500 hover:bg-cyan-500/20 mt-1">
                      <Edit3 size={14} className="mr-1" /> {t('psychopedagogueDashboard.smartGroupsModal.useGroupButton')}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Manual Group Creation Section */}
          <section className="pt-6 border-t border-slate-700/50">
            <h2 className="text-xl font-semibold text-slate-100 mb-3 flex items-center">
              <PlusCircle size={22} className="mr-2 text-green-400" />
              {t('psychopedagogueDashboard.smartGroupsModal.manualCreationTitle')}
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="manual-group-name" className="text-slate-300">{t('psychopedagogueDashboard.smartGroupsModal.groupNameLabel')}</Label>
                <Input 
                  id="manual-group-name"
                  value={manualGroupName}
                  onChange={(e) => setManualGroupName(e.target.value)}
                  placeholder={t('psychopedagogueDashboard.smartGroupsModal.groupNamePlaceholder')}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300 block mb-1">{t('psychopedagogueDashboard.smartGroupsModal.selectStudentsLabel')}</Label>
                <div className="relative mb-2">
                    <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="text"
                      placeholder={t('psychopedagogueDashboard.smartGroupsModal.searchStudentPlaceholder')}
                      value={studentSearchTerm}
                      onChange={(e) => setStudentSearchTerm(e.target.value)}
                      className="pl-8 bg-slate-600/80 border-slate-500 text-slate-100 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                <ScrollArea className="h-48 border border-slate-600 rounded-md p-3 bg-slate-700/30">
                  {filteredStudents.map(student => (
                    <div key={student.id} className="flex items-center space-x-2 py-1.5 hover:bg-slate-600/50 rounded px-1">
                      <Checkbox 
                        id={`manual-${student.id}`} 
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={() => handleStudentSelection(student.id)}
                        className="border-slate-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-600"
                      />
                      <Label htmlFor={`manual-${student.id}`} className="text-sm text-slate-200 cursor-pointer">{student.name} <span className="text-xs text-slate-400">({student.grade})</span></Label>
                    </div>
                  ))}
                </ScrollArea>
                <p className="text-xs text-slate-400 mt-1">{t('psychopedagogueDashboard.smartGroupsModal.selectedStudentsCount', { count: selectedStudents.length })}</p>
              </div>
              <Button onClick={handleCreateManualGroup} className="bg-green-500 hover:bg-green-600 text-slate-900 font-semibold w-full sm:w-auto">
                <CheckSquare size={18} className="mr-2" />
                {t('psychopedagogueDashboard.smartGroupsModal.createManualGroupButton')}
              </Button>
            </div>
          </section>
        </div>

        <DialogFooter className="p-6 border-t border-slate-700 sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100">
              {t('common.closeButton')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SmartGroupsModal;