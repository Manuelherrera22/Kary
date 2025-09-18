import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, HeartPulse, HeartHandshake as Handshake, Home, Stethoscope, MessageSquare, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useMockAuth } from '@/contexts/MockAuthContext';


const TrackingTabContent = ({ title, children, canEdit, onEdit, canComment, studentId, trackingType }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { userProfile } = useMockAuth();
  const [comment, setComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleAddComment = async () => {
    if (!comment.trim()) {
      toast({ title: t('toast.errorTitle'), description: t('studentProfilePage.tracking.commentEmptyError'), variant: 'destructive' });
      return;
    }
    setIsSubmittingComment(true);
    try {
      // Placeholder: This would ideally save to a specific table like 'tracking_comments'
      // For now, we'll just log it and simulate success
      console.log('Adding comment:', { studentId, trackingType, userId: userProfile?.id, comment });
      // const { error } = await supabase.from('tracking_comments').insert({ student_id: studentId, tracking_type: trackingType, user_id: userProfile?.id, comment_text: comment });
      // if (error) throw error;
      
      toast({ title: t('toast.successTitle'), description: t('studentProfilePage.tracking.commentAddedSuccess') });
      setComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({ title: t('toast.errorTitle'), description: t('studentProfilePage.tracking.commentAddedError'), variant: 'destructive' });
    } finally {
      setIsSubmittingComment(false);
    }
  };


  return (
    <div className="p-4 bg-slate-700/30 rounded-lg min-h-[200px]">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-semibold text-slate-100">{title}</h4>
        {canEdit && (
          <Button onClick={onEdit} variant="outline" size="sm" className="text-amber-300 border-amber-500 hover:bg-amber-500/20">
            {t('common.editButton')}
          </Button>
        )}
      </div>
      <div className="text-slate-300 space-y-3">
        {children || <p className="italic">{t('studentProfilePage.tracking.noData')}</p>}
      </div>
      {canComment && (
        <div className="mt-6 pt-4 border-t border-slate-600/50">
          <h5 className="text-md font-semibold text-slate-200 mb-2 flex items-center">
            <MessageSquare size={18} className="mr-2 text-sky-400" />
            {t('studentProfilePage.tracking.addComment')}
          </h5>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('studentProfilePage.tracking.commentPlaceholder')}
            className="bg-slate-600/50 border-slate-500 text-white placeholder-slate-400 min-h-[80px]"
            disabled={isSubmittingComment}
          />
          <Button 
            onClick={handleAddComment} 
            size="sm" 
            className="mt-2 bg-sky-500 hover:bg-sky-600 text-white"
            disabled={isSubmittingComment || !comment.trim()}
          >
            <Send size={14} className="mr-2" />
            {isSubmittingComment ? t('common.submitting') : t('studentProfilePage.tracking.submitComment')}
          </Button>
        </div>
      )}
    </div>
  );
};

const StudentMultidisciplinaryTracking = ({ studentId, currentUserRole }) => {
  const { t } = useLanguage();

  const canView = (allowedRoles) => currentUserRole && allowedRoles.includes(currentUserRole);
  const canEdit = (allowedRolesForEdit) => currentUserRole && allowedRolesForEdit.includes(currentUserRole);
  const canComment = (allowedRolesForComment) => currentUserRole && allowedRolesForComment.includes(currentUserRole);


  const tabsConfig = [
    { 
      value: "teacher", 
      labelKey: "studentProfilePage.tracking.teacherTracking", 
      icon: BookOpen,
      rolesWithViewAccess: ['teacher', 'directive', 'psychopedagogue', 'admin', 'program_coordinator'],
      rolesWithEditAccess: ['teacher', 'admin'],
      rolesWithCommentAccess: [],
      content: <p>{t('studentProfilePage.tracking.teacherContentPlaceholder')}</p> 
    },
    { 
      value: "psychopedagogue", 
      labelKey: "studentProfilePage.tracking.psychopedagogueTracking", 
      icon: Users,
      rolesWithViewAccess: ['psychopedagogue', 'directive', 'admin', 'program_coordinator'],
      rolesWithEditAccess: ['psychopedagogue', 'admin'],
      rolesWithCommentAccess: [],
      content: <p>{t('studentProfilePage.tracking.psychopedagogueContentPlaceholder')}</p>
    },
    { 
      value: "medical", 
      labelKey: "studentProfilePage.tracking.medicalTracking", 
      icon: Stethoscope,
      rolesWithViewAccess: ['psychopedagogue', 'directive', 'admin', 'program_coordinator'],
      rolesWithEditAccess: ['admin'], 
      rolesWithCommentAccess: [],
      content: <p>{t('studentProfilePage.tracking.medicalContentPlaceholder')}</p>
    },
    { 
      value: "therapeutic", 
      labelKey: "studentProfilePage.tracking.therapeuticTracking", 
      icon: HeartPulse,
      rolesWithViewAccess: ['psychopedagogue', 'directive', 'parent', 'admin', 'program_coordinator'],
      rolesWithEditAccess: ['psychopedagogue', 'admin'], 
      rolesWithCommentAccess: [],
      content: currentUserRole === 'parent' ? <p>{t('studentProfilePage.tracking.therapeuticContentSummaryParent')}</p> : <p>{t('studentProfilePage.tracking.therapeuticContentPlaceholder')}</p>
    },
    { 
      value: "family", 
      labelKey: "studentProfilePage.tracking.familyTracking", 
      icon: Home,
      rolesWithViewAccess: ['psychopedagogue', 'directive', 'parent', 'admin', 'program_coordinator'],
      rolesWithEditAccess: ['psychopedagogue', 'admin'], 
      rolesWithCommentAccess: ['parent', 'program_coordinator', 'admin'],
      content: <p>{t('studentProfilePage.tracking.familyContentPlaceholder')}</p>
    },
  ];

  const visibleTabs = tabsConfig.filter(tab => canView(tab.rolesWithViewAccess));

  if (visibleTabs.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-8"
    >
      <Card className="bg-slate-800/60 border-slate-700/70 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 flex items-center">
            <Handshake size={28} className="mr-3 text-purple-400" />
            {t('studentProfilePage.tracking.title')}
          </CardTitle>
          <CardDescription className="text-slate-400 mt-1">
            {t('studentProfilePage.tracking.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <Tabs defaultValue={visibleTabs[0]?.value} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 bg-slate-700/50 p-2 rounded-lg mb-4">
              {visibleTabs.map((tab) => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="flex-1 py-2.5 px-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-md text-slate-300 hover:text-pink-300 transition-colors items-center justify-center"
                >
                  <tab.icon size={16} className="mr-1.5 hidden sm:inline-block" /> {t(tab.labelKey)}
                </TabsTrigger>
              ))}
            </TabsList>
            {visibleTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <TrackingTabContent 
                  title={t(tab.labelKey)}
                  canEdit={canEdit(tab.rolesWithEditAccess)}
                  canComment={canComment(tab.rolesWithCommentAccess)}
                  onEdit={() => console.log(`Edit ${tab.labelKey} for student ${studentId}`)}
                  studentId={studentId}
                  trackingType={tab.value}
                >
                  {tab.content}
                </TrackingTabContent>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentMultidisciplinaryTracking;