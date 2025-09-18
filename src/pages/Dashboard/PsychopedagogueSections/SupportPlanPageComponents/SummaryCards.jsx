import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, BarChart2, Users, Download, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import DownloadablePlansModal from './DownloadablePlansModal';
import { useToast } from "@/components/ui/use-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

const SummaryCards = ({ selectedStudentId, studentName, summaryData, isLoadingSummary, allPlansForStudent }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const handleOpenDownloadModal = () => {
    if (allPlansForStudent && allPlansForStudent.length > 0) {
      setIsDownloadModalOpen(true);
    } else {
      toast({
        title: t('supportPlans.noPlansToDownloadTitle'),
        description: t('supportPlans.noPlansToDownloadMessage'),
        variant: "default",
        action: <AlertTriangle className="text-yellow-400" />,
      });
      console.log("No plans to download for this student.");
    }
  };

  if (!selectedStudentId || selectedStudentId === 'all_students') return null;
  
  if (isLoadingSummary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
           <Card key={i} className="bg-slate-800/50 border-slate-700 animate-pulse rounded-xl shadow-lg"><CardHeader className="flex flex-row items-center justify-between pb-2"><div className="h-5 bg-slate-700 rounded w-3/5"></div><div className="h-5 w-5 bg-slate-700 rounded-full"></div></CardHeader><CardContent><div className="h-8 bg-slate-700 rounded w-1/2 mb-1"></div><div className="h-4 bg-slate-700 rounded w-full"></div></CardContent></Card>
        ))}
      </div>
    );
  }

  if (!summaryData) return null;

  const summaryItems = [
    { 
      titleKey: 'supportPlans.summary.total', 
      value: summaryData.total, 
      icon: FileText, 
      color: "text-sky-400",
      isClickable: true,
      onClick: handleOpenDownloadModal,
      actionIcon: Download
    },
    { titleKey: 'supportPlans.summary.active', value: summaryData.active_count, icon: CheckCircle, color: "text-green-400" },
    { titleKey: 'supportPlans.summary.byType', value: summaryData.by_type, icon: BarChart2, color: "text-purple-400", isObject: true },
    { titleKey: 'supportPlans.summary.lastCreated', value: summaryData.last_created ? new Date(summaryData.last_created).toLocaleDateString() : t('common.notAvailable'), icon: Users, color: "text-amber-400" },
  ];

  return (
    <>
      <motion.div 
         variants={containerVariants}
         initial="hidden"
         animate="visible"
         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {summaryItems.map((item, index) => (
          <motion.div variants={itemVariants} key={index}>
            <Card 
              className={`bg-gradient-to-br from-slate-800/70 to-slate-900/50 border-slate-700 text-white rounded-xl shadow-2xl hover:shadow-purple-500/30 transition-shadow duration-300 ${item.isClickable ? 'cursor-pointer hover:ring-2 hover:ring-purple-500' : ''}`}
              onClick={item.isClickable && item.onClick ? item.onClick : undefined}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">{t(item.titleKey)}</CardTitle>
                {item.isClickable && item.actionIcon ? 
                  <item.actionIcon className={`h-5 w-5 ${item.color} group-hover:animate-pulse`} /> : 
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                }
              </CardHeader>
              <CardContent>
                {item.isObject ? (
                  <div className="text-xs space-y-0.5">
                    {Object.entries(item.value).map(([key, val]) => (
                      <p key={key} className="capitalize">{t(`supportPlans.aiCanvas.planTypeValues.${key}`, key)}: <span className="font-bold text-slate-200">{val}</span></p>
                    ))}
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-slate-100">{item.value}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      <DownloadablePlansModal 
        isOpen={isDownloadModalOpen}
        onOpenChange={setIsDownloadModalOpen}
        plans={allPlansForStudent}
        studentName={studentName}
      />
    </>
  );
};

export default SummaryCards;