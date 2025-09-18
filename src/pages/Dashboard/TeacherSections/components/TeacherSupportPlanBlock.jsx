import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Info, FileText, Brain, Users, Target, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TeacherSupportPlanBlock = ({ plans, isLoading, onGenerateActivities, selectedStudentId, onSelectStudent }) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
        <p className="ml-4 text-lg text-slate-300">{t('common.loadingText')}</p>
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-sky-400 flex items-center">
            <Info size={24} className="mr-2" />
            {t('teacherDashboard.supportPlan.noPlansAvailable')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400">{t('teacherDashboard.supportPlan.noPlansMessage')}</p>
        </CardContent>
      </Card>
    );
  }

  const renderPlanSection = (title, content, icon) => (
    <div className="mb-3">
      <h4 className="text-md font-semibold text-sky-300 flex items-center mb-1">
        {icon}
        {title}
      </h4>
      {typeof content === 'string' ? (
        <p className="text-sm text-slate-300 whitespace-pre-wrap">{content}</p>
      ) : Array.isArray(content) && content.length > 0 ? (
        <ul className="list-disc list-inside pl-4 text-sm text-slate-300">
          {content.map((item, idx) => <li key={idx}>{typeof item === 'object' ? item.descripcion || JSON.stringify(item) : item}</li>)}
        </ul>
      ) : (
        <p className="text-sm text-slate-400 italic">{t('common.notAvailable')}</p>
      )}
    </div>
  );
  
  const renderStrategiesAndActions = (data) => {
    if (!data || (data.estrategias?.length === 0 && data.acciones?.length === 0)) {
      return <p className="text-sm text-slate-400 italic">{t('common.notAvailable')}</p>;
    }
    return (
      <>
        {data.estrategias && data.estrategias.length > 0 && (
          <div className="ml-4 mt-1">
            <h5 className="text-sm font-medium text-purple-300">{t('teacherDashboard.supportPlan.strategies')}</h5>
            <ul className="list-disc list-inside pl-4 text-sm text-slate-300">
              {data.estrategias.map((estrategia, i) => <li key={`estrategia-${i}`}>{typeof estrategia === 'object' ? estrategia.descripcion : estrategia}</li>)}
            </ul>
          </div>
        )}
        {data.acciones && data.acciones.length > 0 && (
          <div className="ml-4 mt-1">
            <h5 className="text-sm font-medium text-purple-300">{t('teacherDashboard.supportPlan.actions')}</h5>
            <ul className="list-disc list-inside pl-4 text-sm text-slate-300">
              {data.acciones.map((accion, i) => <li key={`accion-${i}`}>{typeof accion === 'object' ? accion.descripcion : accion}</li>)}
            </ul>
          </div>
        )}
      </>
    );
  };


  return (
    <ScrollArea className="h-[calc(100vh-280px)] pr-4">
      <Accordion type="single" collapsible className="w-full space-y-3">
        {plans.map((plan) => (
          <AccordionItem value={`plan-${plan.id}`} key={plan.id} className="bg-slate-800 border-slate-700 rounded-lg shadow-lg overflow-hidden">
            <AccordionTrigger 
              className="px-6 py-4 text-left hover:bg-slate-700/50 transition-colors"
              onClick={() => onSelectStudent(plan.student_id === selectedStudentId ? null : plan.student_id)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <FileText size={20} className="mr-3 text-purple-400" />
                  <span className="font-semibold text-lg text-slate-100">{plan.student?.full_name || t('common.unknownStudent')}</span>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  plan.status === 'active' || plan.status === 'en_progreso' ? 'bg-green-500/20 text-green-300 border border-green-500/40' : 
                  plan.status === 'completed' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 
                  'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                }`}>
                  {t(`supportPlans.status.${plan.status}`, plan.status)}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 border-t border-slate-700 bg-slate-800/50">
              {renderPlanSection(t('teacherDashboard.common.summary'), plan.plan_preview, <Info size={18} className="mr-2 text-sky-400" />)}
              
              <Card className="my-4 bg-slate-700/30 border-slate-600">
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-lg text-purple-300 flex items-center">
                    <Brain size={20} className="mr-2"/>
                    {t('teacherDashboard.supportPlan.emotionalSupport')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-300 pt-0">
                  {renderPlanSection(t('teacherDashboard.supportPlan.objective'), plan.emotional_support?.objetivo, <Target size={16} className="mr-2 text-purple-400" />)}
                  {renderStrategiesAndActions(plan.emotional_support)}
                </CardContent>
              </Card>

              <Card className="my-4 bg-slate-700/30 border-slate-600">
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-lg text-green-300 flex items-center">
                    <Users size={20} className="mr-2"/>
                    {t('teacherDashboard.supportPlan.academicSupport')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-300 pt-0">
                  {renderPlanSection(t('teacherDashboard.common.area'), plan.academic_support?.area, <Zap size={16} className="mr-2 text-green-400" />)}
                  {renderPlanSection(t('teacherDashboard.supportPlan.objective'), plan.academic_support?.objetivo, <Target size={16} className="mr-2 text-green-400" />)}
                  {renderStrategiesAndActions(plan.academic_support)}
                </CardContent>
              </Card>
              
              {renderPlanSection(t('teacherDashboard.supportPlan.recommendations'), plan.recommendations, <Info size={18} className="mr-2 text-yellow-400" />)}
              
              <Button 
                onClick={() => onGenerateActivities(plan)} 
                className="mt-4 w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap size={18} className="mr-2" />}
                {t('teacherDashboard.supportPlan.generateActivities')}
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  );
};

export default TeacherSupportPlanBlock;