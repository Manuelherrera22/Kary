import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Edit3, PlusCircle, CheckCircle, XCircle, Clock, Users, Briefcase } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';

const GoalCard = ({ titleKey, content, onEdit, editing, setContent, fieldName, placeholderKey, canEditLifeProject }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-slate-700/40 p-4 rounded-lg border border-slate-600/50 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-semibold text-sky-300 flex items-center">
          <Target size={18} className="mr-2 text-orange-400" /> {t(titleKey)}
        </h3>
        {canEditLifeProject && !editing && (
          <Button variant="ghost" size="icon" onClick={onEdit} className="text-sky-400 hover:text-sky-300 h-7 w-7">
            <Edit3 size={14} />
          </Button>
        )}
      </div>
      {editing && canEditLifeProject ? (
        <Textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          placeholder={t(placeholderKey)}
          className="bg-slate-600 border-slate-500 text-white focus:ring-sky-500 min-h-[80px]"
        />
      ) : (
        <p className="text-slate-300 text-sm min-h-[60px] whitespace-pre-wrap">
          {content || t(placeholderKey)}
        </p>
      )}
    </div>
  );
};

const StudentLifeProjectSection = ({ studentData, studentId, canEditLifeProject, currentUserRole }) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [shortTermGoal, setShortTermGoal] = useState(studentData?.life_project_short_term || '');
  const [mediumTermGoal, setMediumTermGoal] = useState(studentData?.life_project_medium_term || '');
  const [longTermGoal, setLongTermGoal] = useState(studentData?.life_project_long_term || '');
  const [alliedPrograms, setAlliedPrograms] = useState(studentData?.life_project_allied_programs || ''); 
  // life_project_history is more complex, for now just display if exists
  const lifeProjectHistory = studentData?.life_project_history || []; // Assuming it's an array of objects {date, change}

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSaveLifeProject = async () => {
    try {
      const updateData = {
        life_project_short_term: shortTermGoal,
        life_project_medium_term: mediumTermGoal,
        life_project_long_term: longTermGoal,
        life_project_allied_programs: alliedPrograms,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', studentId);

      if (error) throw error;

      setIsEditing(false);
      // Optionally update studentData in parent or refetch
      toast({ title: t('toast.successTitle'), description: t('studentProfilePage.lifeProject.updateSuccess'), className: "bg-green-500 dark:bg-green-700 text-white" });
    } catch (error) {
      console.error("Error saving life project:", error);
      toast({ title: t('toast.errorTitle'), description: t('studentProfilePage.lifeProject.updateError'), variant: 'destructive' });
    }
  };
  
  const handleCancelEdit = () => {
    setShortTermGoal(studentData?.life_project_short_term || '');
    setMediumTermGoal(studentData?.life_project_medium_term || '');
    setLongTermGoal(studentData?.life_project_long_term || '');
    setAlliedPrograms(studentData?.life_project_allied_programs || '');
    setIsEditing(false);
  }


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="bg-slate-800/60 border-slate-700/70 text-white shadow-xl hover:shadow-purple-500/10 transition-shadow duration-300">
        <CardHeader className="border-b border-slate-700/50 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Briefcase size={28} className="mr-3 text-purple-400" />
              <div>
                <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {t('studentProfilePage.lifeProject.title')}
                </CardTitle>
                <CardDescription className="text-slate-400">{t('studentProfilePage.lifeProject.description')}</CardDescription>
              </div>
            </div>
            {canEditLifeProject && !isEditing && (
              <Button variant="outline" onClick={handleEditToggle} className="text-purple-300 border-purple-500 hover:bg-purple-500/20">
                <Edit3 size={16} className="mr-2" /> {t('common.editButton')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-purple-300 mb-4">{t('studentProfilePage.lifeProject.goalsTitle')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GoalCard 
                titleKey="studentProfilePage.lifeProject.shortTermGoal" 
                content={shortTermGoal} 
                onEdit={handleEditToggle} 
                editing={isEditing} 
                setContent={setShortTermGoal}
                fieldName="life_project_short_term"
                placeholderKey="studentProfilePage.lifeProject.shortTermPlaceholder"
                canEditLifeProject={canEditLifeProject}
              />
              <GoalCard 
                titleKey="studentProfilePage.lifeProject.mediumTermGoal" 
                content={mediumTermGoal} 
                onEdit={handleEditToggle} 
                editing={isEditing} 
                setContent={setMediumTermGoal}
                fieldName="life_project_medium_term"
                placeholderKey="studentProfilePage.lifeProject.mediumTermPlaceholder"
                canEditLifeProject={canEditLifeProject}
              />
              <GoalCard 
                titleKey="studentProfilePage.lifeProject.longTermGoal" 
                content={longTermGoal} 
                onEdit={handleEditToggle} 
                editing={isEditing} 
                setContent={setLongTermGoal}
                fieldName="life_project_long_term"
                placeholderKey="studentProfilePage.lifeProject.longTermPlaceholder"
                canEditLifeProject={canEditLifeProject}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold text-purple-300 flex items-center">
                <Users size={20} className="mr-2 text-teal-400" /> {t('studentProfilePage.lifeProject.alliedProgramsTitle')}
              </h3>
            </div>
            {isEditing && canEditLifeProject ? (
              <Textarea 
                value={alliedPrograms} 
                onChange={(e) => setAlliedPrograms(e.target.value)} 
                placeholder={t('studentProfilePage.lifeProject.alliedProgramsPlaceholder')}
                className="bg-slate-600 border-slate-500 text-white focus:ring-teal-500 min-h-[100px]"
              />
            ) : (
              <p className="text-slate-300 p-3 bg-slate-700/50 rounded-md min-h-[40px] whitespace-pre-wrap">
                {alliedPrograms || t('studentProfilePage.lifeProject.alliedProgramsPlaceholder')}
              </p>
            )}
             {canEditLifeProject && isEditing && (
                <Button variant="outline" size="sm" className="mt-2 text-teal-300 border-teal-500 hover:bg-teal-500/20" onClick={() => toast({ title: t('common.comingSoon'), description: t('studentProfilePage.lifeProject.addAlliedProgram') + ' ' + t('common.comingSoon').toLowerCase()})}>
                    <PlusCircle size={14} className="mr-1" /> {t('studentProfilePage.lifeProject.addAlliedProgram')}
                </Button>
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-purple-300 flex items-center mb-3">
              <Clock size={20} className="mr-2 text-indigo-400" /> {t('studentProfilePage.lifeProject.historyTitle')}
            </h3>
            {lifeProjectHistory && lifeProjectHistory.length > 0 ? (
              <ul className="space-y-2">
                {lifeProjectHistory.map((entry, index) => (
                  <li key={index} className="text-sm text-slate-400 p-2 bg-slate-700/30 rounded-md border-l-2 border-indigo-500">
                    <span className="font-medium text-indigo-300">{entry.date}:</span> {entry.change}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 p-3 bg-slate-700/50 rounded-md min-h-[40px]">
                {t('studentProfilePage.lifeProject.historyPlaceholder')}
              </p>
            )}
          </div>

          {isEditing && canEditLifeProject && (
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700/50">
              <Button variant="outline" onClick={handleCancelEdit} className="text-slate-300 border-slate-500 hover:bg-slate-600">
                <XCircle size={18} className="mr-2" /> {t('common.cancelButton')}
              </Button>
              <Button onClick={handleSaveLifeProject} className="bg-purple-600 hover:bg-purple-700">
                <CheckCircle size={18} className="mr-2" /> {t('common.saveChangesButton')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentLifeProjectSection;