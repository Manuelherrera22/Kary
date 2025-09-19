import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { BarChart, PieChart, AlertTriangle, CheckSquare, BookOpen, Users, Loader2, TrendingUp, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useToast } from '@/components/ui/use-toast';
import edgeFunctionService from '@/services/edgeFunctionService';
import LoadingScreen from '@/pages/Dashboard/components/LoadingScreen';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#38bdf8', '#34d399', '#facc15', '#f87171', '#a78bfa', '#fb923c'];

const iconMap = {
  alertas_emocionales: AlertTriangle,
  retroalimentaciones: CheckSquare,
  planes_apoyo_activos: BookOpen,
  recursos_asignados: Users,
  satisfaccion_docente: Users,
  progreso_academico: TrendingUp,
  default: BarChart,
};

const StrategicSummaryPage = () => {
  const { t } = useLanguage();
  const { user } = useMockAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStrategicSummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simular carga de datos para San Luis Gonzaga
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Datos mock realistas para San Luis Gonzaga
      const mockStrategicData = [
        {
          categoria: 'alertas_emocionales',
          cantidad: 12,
          meta: 15,
          porcentaje: 80,
          tendencia: 'decreasing',
          descripcion: 'Reducción del 15% en alertas emocionales este mes'
        },
        {
          categoria: 'retroalimentaciones',
          cantidad: 45,
          meta: 50,
          porcentaje: 90,
          tendencia: 'increasing',
          descripcion: 'Aumento del 20% en retroalimentaciones positivas'
        },
        {
          categoria: 'planes_apoyo_activos',
          cantidad: 28,
          meta: 30,
          porcentaje: 93,
          tendencia: 'stable',
          descripcion: 'Mantenimiento de planes de apoyo efectivos'
        },
        {
          categoria: 'recursos_asignados',
          cantidad: 85,
          meta: 100,
          porcentaje: 85,
          tendencia: 'increasing',
          descripcion: 'Optimización del 85% de recursos disponibles'
        },
        {
          categoria: 'satisfaccion_docente',
          cantidad: 92,
          meta: 95,
          porcentaje: 97,
          tendencia: 'increasing',
          descripcion: 'Alto nivel de satisfacción del personal docente'
        },
        {
          categoria: 'progreso_academico',
          cantidad: 78,
          meta: 80,
          porcentaje: 98,
          tendencia: 'stable',
          descripcion: 'Progreso académico estable y consistente'
        }
      ];

      setSummaryData(mockStrategicData);
      
      console.log("✅ Resumen estratégico de San Luis Gonzaga cargado:", {
        total: mockStrategicData.length,
        categorias: mockStrategicData.map(item => item.categoria)
      });

    } catch (err) {
      console.error("Component error fetching strategic summary:", err);
      setError(err.message);
      toast({
        title: t('common.errorTitle'),
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    fetchStrategicSummary();
  }, [fetchStrategicSummary]);

  if (isLoading) {
    return (
      <LoadingScreen text={t('dashboards.directive.strategicSummary.loading')} />
    );
  }
  
  if (error) {
    return (
      <Card className="bg-red-900/30 border-red-700/60 shadow-xl m-4">
        <CardHeader>
          <CardTitle className="text-xl text-red-300 flex items-center">
            <AlertTriangle size={24} className="mr-2" />
            {t('dashboards.directive.strategicSummary.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex flex-col items-center justify-center">
          <p className="text-red-400">{t('dashboards.directive.strategicSummary.error')}</p>
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
            {t('dashboards.directive.strategicSummary.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <p className="text-slate-500">{t('dashboards.directive.strategicSummary.noData')}</p>
        </CardContent>
      </Card>
    );
  }
  
  const chartData = summaryData.map(item => ({
    name: t(`dashboards.directive.strategicSummary.categories.${item.categoria}`, item.categoria),
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
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-sky-300 hover:text-sky-100 transition-colors duration-200 group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">{t('common.backToDashboard')}</span>
        </button>
      </motion.div>
      
       <header className="mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-400 to-pink-400">
          {t('dashboards.directive.strategicSummary.pageTitle')}
        </h1>
        <p className="text-slate-400 mt-1">
          {t('dashboards.directive.strategicSummary.pageDescription')}
        </p>
      </header>

      <Card className="bg-slate-800/50 border-slate-700/60 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-purple-300 to-pink-300 flex items-center">
            <TrendingUp size={24} className="mr-2" />
            {t('dashboards.directive.strategicSummary.title')}
          </CardTitle>
          <CardDescription className="text-slate-400">{t('dashboards.directive.strategicSummary.subtitle')}</CardDescription>
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