import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Info, ListChecks, Edit3, Send, Trash2, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const TeacherGeneratedActivitiesBlock = ({ activities, isLoading, studentName, planName, onOpenActivityModal, noActivitiesMessage }) => {
  const { t, currentLocale } = useLanguage();

  const formatDate = (dateString) => {
    if (!dateString) return t('common.notAssigned');
    try {
      return format(new Date(dateString), 'PPP', { locale: currentLocale === 'es' ? es : undefined });
    } catch (error) {
      return dateString; 
    }
  };

  if (isLoading && (!activities || activities.length === 0)) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-slate-800/50 rounded-lg border border-slate-700 p-6">
        <Loader2 className="h-12 w-12 animate-spin text-orange-400" />
        <p className="ml-4 mt-4 text-lg text-slate-300">{t('common.loadingText')}</p>
        {studentName && <p className="text-sm text-slate-400">{t('teacherDashboard.generatedActivities.loadingFor', { studentName })}</p>}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-orange-400 flex items-center">
            <Info size={24} className="mr-2" />
            {studentName ? t('teacherDashboard.generatedActivities.titleForStudent', { studentName }) : t('teacherDashboard.generatedActivities.title')}
          </CardTitle>
          {planName && <CardDescription className="text-slate-400">{t('teacherDashboard.generatedActivities.basedOnPlan', { planName })}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-slate-400">{noActivitiesMessage || t('teacherDashboard.generatedActivities.noActivitiesYet')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/80 border-slate-700 shadow-2xl h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-orange-400 flex items-center text-2xl">
          <ListChecks size={28} className="mr-3" />
          {studentName ? t('teacherDashboard.generatedActivities.titleForStudent', { studentName }) : t('teacherDashboard.generatedActivities.title')}
        </CardTitle>
        {planName && <CardDescription className="text-slate-300 pt-1">{t('teacherDashboard.generatedActivities.basedOnPlan', { planName })}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-[calc(100vh-380px)] p-6 pt-0">
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <Card key={activity.tempId || activity.id || index} className="bg-slate-700/40 border-slate-600 hover:shadow-purple-500/10 transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-slate-100">{activity.title || t('common.untitled')}</CardTitle>
                    <Badge variant={activity.type === 'emotional' ? 'secondary' : 'default'} 
                           className={`${activity.type === 'emotional' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-sky-500/20 text-sky-300 border-sky-500/40'}`}>
                      {activity.type === 'emotional' ? t('teacherDashboard.common.emotional') : t('teacherDashboard.common.academic')}
                    </Badge>
                  </div>
                  {activity.due_date && (
                    <p className="text-xs text-slate-400">{t('teacherDashboard.common.dueDate')}: {formatDate(activity.due_date)}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-300 mb-3 line-clamp-3">{activity.description || t('common.noDescription')}</p>
                  <div className="flex justify-end space-x-2">
                     <Button variant="outline" size="sm" onClick={onOpenActivityModal} className="border-sky-500/70 text-sky-400 hover:bg-sky-500/10">
                       <Eye size={16} className="mr-1.5" /> {t('teacherDashboard.generatedActivities.viewEditAll')}
                     </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
       {activities.length > 0 && (
        <div className="p-6 border-t border-slate-700">
          <Button onClick={onOpenActivityModal} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
            <Edit3 size={18} className="mr-2" /> {t('teacherDashboard.generatedActivities.reviewAndEditAll')}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default TeacherGeneratedActivitiesBlock;