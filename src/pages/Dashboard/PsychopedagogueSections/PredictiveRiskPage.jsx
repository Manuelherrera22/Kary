import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart2, AlertTriangle, Filter, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Placeholder data - replace with actual data fetching and chart implementation
const placeholderRiskData = {
  overallRisk: 'medium', // 'low', 'medium', 'high'
  academicRisk: 75, // percentage
  emotionalRisk: 40, // percentage
  riskFactors: [
    { factor: 'Bajo rendimiento en Matemáticas', level: 'high' },
    { factor: 'Faltas de asistencia recurrentes', level: 'medium' },
    { factor: 'Aislamiento social reportado', level: 'medium' },
    { factor: 'Poca participación en clase', level: 'low' },
  ],
  trend: [
    { month: 'Ene', riskLevel: 20 },
    { month: 'Feb', riskLevel: 30 },
    { month: 'Mar', riskLevel: 25 },
    { month: 'Abr', riskLevel: 45 },
    { month: 'May', riskLevel: 60 },
  ]
};

const PredictiveRiskPage = () => {
  const { t } = useLanguage();

  // TODO: Implement actual chart logic with a library like Chart.js or Recharts
  const RiskChartPlaceholder = ({ data }) => (
    <div className="h-64 bg-slate-700/50 rounded-lg flex items-center justify-center text-slate-400">
      {t('psychopedagogueDashboard.predictiveRisk.chartPlaceholder')}
    </div>
  );

  const getRiskColor = (level) => {
    if (level === 'high') return 'bg-red-500/30 text-red-300 border-red-500/50';
    if (level === 'medium') return 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50';
    return 'bg-green-500/30 text-green-300 border-green-500/50';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen text-white"
    >
      <div className="container mx-auto">
        <Link to="/dashboard" className="inline-flex items-center text-slate-300 hover:text-sky-400 mb-8 group transition-colors">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          {t('common.backToDashboard')}
        </Link>

        <header className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-slate-800/70 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700/60">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400">
                {t('psychopedagogueDashboard.predictiveRisk.pageTitle')}
              </h1>
              <p className="text-slate-400">{t('psychopedagogueDashboard.predictiveRisk.pageSubtitle')}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className={`md:col-span-1 ${getRiskColor(placeholderRiskData.overallRisk)}`}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle size={24} className="mr-2" />
                {t('psychopedagogueDashboard.predictiveRisk.overallRiskTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold capitalize">{t(`psychopedagogueDashboard.predictiveRisk.riskLevels.${placeholderRiskData.overallRisk}`)}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/60">
            <CardHeader>
              <CardTitle>{t('psychopedagogueDashboard.predictiveRisk.academicRiskTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-sky-300">{placeholderRiskData.academicRisk}%</p>
              {/* Placeholder for a small progress bar or gauge */}
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/60">
            <CardHeader>
              <CardTitle>{t('psychopedagogueDashboard.predictiveRisk.emotionalRiskTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-300">{placeholderRiskData.emotionalRisk}%</p>
              {/* Placeholder for a small progress bar or gauge */}
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8 bg-slate-800/50 border-slate-700/60">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <CardTitle className="text-xl text-slate-100">{t('psychopedagogueDashboard.predictiveRisk.trendChartTitle')}</CardTitle>
                <CardDescription className="text-slate-400">{t('psychopedagogueDashboard.predictiveRisk.trendChartDesc')}</CardDescription>
              </div>
              <div className="flex items-center gap-2 mt-3 sm:mt-0">
                <Select defaultValue="monthly">
                  <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600 text-slate-200">
                    <SelectValue placeholder={t('psychopedagogueDashboard.predictiveRisk.selectPeriodPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-slate-200">
                    <SelectItem value="weekly">{t('psychopedagogueDashboard.predictiveRisk.weekly')}</SelectItem>
                    <SelectItem value="monthly">{t('psychopedagogueDashboard.predictiveRisk.monthly')}</SelectItem>
                    <SelectItem value="quarterly">{t('psychopedagogueDashboard.predictiveRisk.quarterly')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <RiskChartPlaceholder data={placeholderRiskData.trend} />
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/60">
          <CardHeader>
            <CardTitle className="text-xl text-slate-100">{t('psychopedagogueDashboard.predictiveRisk.riskFactorsTitle')}</CardTitle>
            <CardDescription className="text-slate-400">{t('psychopedagogueDashboard.predictiveRisk.riskFactorsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {placeholderRiskData.riskFactors.map((item, index) => (
                <li key={index} className={`flex items-center justify-between p-3 rounded-md border ${getRiskColor(item.level)}`}>
                  <span className="text-sm">{item.factor}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getRiskColor(item.level).replace('bg-', 'text-').replace('/30', '')}`}>
                    {t(`psychopedagogueDashboard.predictiveRisk.riskLevels.${item.level}`)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

      </div>
    </motion.div>
  );
};

export default PredictiveRiskPage;