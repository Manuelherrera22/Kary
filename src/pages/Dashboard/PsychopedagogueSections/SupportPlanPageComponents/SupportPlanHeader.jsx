import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, PlusCircle, Edit3 as EditIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SupportPlanHeader = ({ onOpenModal }) => {
  const { t } = useLanguage();

  return (
    <>
      <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-6 transition-colors">
        <ArrowLeft size={20} className="mr-2" />
        {t('common.backToDashboard')}
      </Link>
      <div className="bg-slate-700/30 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-600">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <ShieldCheck size={36} className="mr-4 text-sky-400" />
            <div>
              <h1 className="text-3xl font-bold">{t('supportPlans.pageTitle')}</h1>
              <p className="text-slate-400">{t('supportPlans.pageSubtitle')}</p>
            </div>
          </div>
          <Button onClick={() => onOpenModal()} className="bg-sky-500 hover:bg-sky-600 w-full sm:w-auto">
            <PlusCircle size={20} className="mr-2" />
            {t('supportPlans.createNewPlanButton')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default SupportPlanHeader;