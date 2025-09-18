import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Search, Download, Share2, Tag, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AggregatedReportsPage = () => {
  const { t } = useLanguage();

  const reports = [
    { id: 1, nameKey: "directive.reports.report1Name", date: "2025-05-20", categoryKey: "directive.reports.categoryPerformance" },
    { id: 2, nameKey: "directive.reports.report2Name", date: "2025-05-15", categoryKey: "directive.reports.categoryAttendance" },
    { id: 3, nameKey: "directive.reports.report3Name", date: "2025-05-10", categoryKey: "directive.reports.categoryParticipation" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-gradient-to-br from-purple-700 via-pink-700 to-orange-600 min-h-screen text-white"
    >
      <div className="container mx-auto">
        <Link to="/dashboard" className="inline-flex items-center text-purple-300 hover:text-purple-100 mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          {t('common.backToDashboard')}
        </Link>

        <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div className="flex items-center mb-4 sm:mb-0">
              <FileText size={36} className="mr-4 text-orange-300" />
              <div>
                <h1 className="text-3xl font-bold">{t('directive.reports.pageTitle')}</h1>
                <p className="text-purple-200">{t('directive.reports.pageSubtitle')}</p>
              </div>
            </div>
             <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Edit3 size={18} className="mr-2" /> {t('common.createNewButton')}
              </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" size={20} />
              <Input 
                type="text" 
                placeholder={t('common.searchPlaceholder')} 
                className="w-full bg-white/5 border-purple-500/50 placeholder-purple-300 text-white pl-10 focus:ring-orange-400 focus:border-orange-400" 
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-500/50">
                  <th className="p-3 font-semibold text-orange-300">{t('directive.reports.tableName')}</th>
                  <th className="p-3 font-semibold text-orange-300">{t('directive.reports.tableDate')}</th>
                  <th className="p-3 font-semibold text-orange-300">{t('directive.reports.tableCategory')}</th>
                  <th className="p-3 font-semibold text-orange-300 text-right">{t('directive.reports.tableActions')}</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report.id} className="border-b border-purple-500/30 hover:bg-white/5 transition-colors">
                    <td className="p-3">{t(report.nameKey)}</td>
                    <td className="p-3">{report.date}</td>
                    <td className="p-3">
                      <span className="bg-purple-500/30 text-purple-200 px-2 py-1 text-xs rounded-full inline-flex items-center">
                        <Tag size={12} className="mr-1.5" />{t(report.categoryKey)}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white mr-2">
                        <Download size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white">
                        <Share2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {reports.length === 0 && (
            <p className="text-center text-purple-300 py-8">{t('common.noDataAvailable')}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AggregatedReportsPage;