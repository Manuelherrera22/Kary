import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { BarChart, PieChart, AlertTriangle, CheckSquare, BookOpen, Users, Loader2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useToast } from '@/components/ui/use-toast';
import edgeFunctionService from '@/services/edgeFunctionService';
import LoadingScreen from '@/pages/Dashboard/components/LoadingScreen';

const COLORS = ['#38bdf8', '#34d399', '#facc15', '#f87171', '#a78bfa', '#fb923c'];

const iconMap = {
  alertas_emocionales: AlertTriangle,
  retroalimentaciones: CheckSquare,
  planes_apoyo_activos: BookOpen,
  recursos_asignados: Users,
  default: BarChart,
};

const StrategicSummaryPage = () => {
  const { t } = useLanguage();
  const { user } = useMockAuth();
  const { toast } = useToast();
  const [summaryData, setSummaryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStrategicSummary = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      setError(t('common.authenticationError'));
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await edgeFunctionService.invokeEdgeFunction("strategic-summary", {
        user_id: user.id
      });
      
      if (fetchError) {
        console.error("Error fetching strategic summary:", fetchError);
        throw new Error(fetchError.message || t('directiveDashboard.strategicSummary.fetchError', { ns: 'directiveDashboard' }));
      }

      if (data && Array.isArray(data)) {
        setSummaryData(data);
      } else if (data && data.error) {
         throw new Error(data.error);
      }
      else {
        setSummaryData([]);
      }

    } catch (err) {
      console.error("Component error fetching strategic summary:", err);
      setError(err.message);
      toast({
        title: t('toast.errorTitle', { ns: 'toasts' }),
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, t, toast]);

  useEffect(() => {
    fetchStrategicSummary();
  }, [fetchStrategicSummary]);

  if (isLoading) {
    return (
      <LoadingScreen text={t('directiveDashboard.strategicSummary.loading', { ns: 'directiveDashboard' })} />
    );
  }
  
  if (error) {
    return (
      <Card className="bg-red-900/30 border-red-700/60 shadow-xl m-4">
        <CardHeader>
          <CardTitle className="text-xl text-red-300 flex items-center">
            <AlertTriangle size={24} className="mr-2" />
            {t('directiveDashboard.strategicSummary.title', { ns: 'directiveDashboard' })}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex flex-col items-center justify-center">
          <p className="text-red-400">{t('directiveDashboard.strategicSummary.error', { ns: 'directiveDashboard' })}</p>
          <p className="text-sm text-red-500">{error}</p>
          <button onClick={fetchStrategicSummary} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm">
            {t('common.retryButton')}
          </button>
        </CardContent>
      </Card>
    );
  }

  if (summaryData.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/60 shadow-xl m-4">
        <CardHeader>
          <CardTitle className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-purple-300 to-pink-300 flex items-center">
            <TrendingUp size={24} className="mr-2" />
            {t('directiveDashboard.strategicSummary.title', { ns: 'directiveDashboard' })}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <p className="text-slate-500">{t('directiveDashboard.strategicSummary.noData', { ns: 'directiveDashboard' })}</p>
        </CardContent>
      </Card>
    );
  }
  
  const chartData = summaryData.map(item => ({
    name: t(`directiveDashboard.strategicSummary.categories.${item.categoria}`, item.categoria , { ns: 'directiveDashboard' }),
    value: item.cantidad,
    icon: iconMap[item.categoria] || iconMap.default,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6"
    >
       <header className="mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-400 to-pink-400">
          {t('dashboards.directiveDashboard.pageTitle', { ns: 'dashboards'})}
        </h1>
        <p className="text-slate-400 mt-1">
          {t('directiveDashboard.strategicSummary.pageDescription', { ns: 'directiveDashboard' })}
        </p>
      </header>

      <Card className="bg-slate-800/50 border-slate-700/60 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-purple-300 to-pink-300 flex items-center">
            <TrendingUp size={24} className="mr-2" />
            {t('directiveDashboard.strategicSummary.title', { ns: 'directiveDashboard' })}
          </CardTitle>
          <CardDescription className="text-slate-400">{t('directiveDashboard.strategicSummary.subtitle', { ns: 'directiveDashboard' })}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={chartData} layout="vertical" margin={{ left: 30, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" width={150} tick={{ fontSize: 12 }} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid #475569', borderRadius: '0.5rem' }}
                    itemStyle={{ color: '#e2e8f0' }}
                    labelStyle={{ color: '#cbd5e1', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" nameKey="name" barSize={20}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
            <div className="md:col-span-1 grid grid-cols-2 gap-4">
              {chartData.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg flex flex-col items-center justify-center text-center`}
                    style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }} 
                  >
                    <IconComponent size={28} className="mb-2" style={{ color: COLORS[index % COLORS.length] }} />
                    <p className="text-2xl font-bold text-white">{item.value}</p>
                    <p className="text-xs text-slate-300" style={{ color: COLORS[index % COLORS.length] }}>{item.name}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StrategicSummaryPage;