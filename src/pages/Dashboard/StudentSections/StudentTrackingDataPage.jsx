import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "@/lib/supabaseClient.js";
import { useAuth } from "@/pages/Dashboard/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/pages/Dashboard/components/DashboardLayout";
import LoadingScreen from "@/pages/Dashboard/components/LoadingScreen";
import { AlertCircle, TrendingUp, Smile, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const ChartPlaceholder = () => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
      <TrendingUp className="w-16 h-16 mb-4 opacity-50" />
      <p className="text-lg">{t('common.loadingData')}</p>
    </div>
  );
};

const NoDataPlaceholder = ({ messageKey }) => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
      <AlertCircle className="w-16 h-16 mb-4 opacity-50" />
      <p className="text-lg">{t(messageKey)}</p>
    </div>
  );
};

export default function StudentTrackingDataPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const [emotionalData, setEmotionalData] = useState([]);
  const [academicData, setAcademicData] = useState([]);
  const [loadingEmotional, setLoadingEmotional] = useState(true);
  const [loadingAcademic, setLoadingAcademic] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;

    setLoadingEmotional(true);
    setLoadingAcademic(true);

    const dateLocale = language || 'default';

    try {
      const { data: emociones, error: emotionalError } = await supabase
        .from("tracking_data")
        .select("created_at, energy_level, mood_score")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (emotionalError) throw emotionalError;

      setEmotionalData(
        (emociones || []).map((e) => ({
          date: new Date(e.created_at).toLocaleDateString(dateLocale, { year: 'numeric', month: 'short', day: 'numeric' }),
          energy: e.energy_level,
          mood: e.mood_score,
        }))
      );
    } catch (error) {
      console.error("Error fetching emotional data:", error);
      toast({
        title: t("studentDashboard.studentTrackingDataPage.toastErrorTitle"),
        description: t("studentDashboard.studentTrackingDataPage.errorFetchingEmotional"),
        variant: "destructive",
      });
    } finally {
      setLoadingEmotional(false);
    }

    try {
      const { data: rendimiento, error: academicError } = await supabase
        .from("rendimiento_academico")
        .select("fecha_registro, promedio")
        .eq("user_id", user.id)
        .order("fecha_registro", { ascending: true });
      
      if (academicError) throw academicError;

      setAcademicData(
        (rendimiento || []).map((r) => ({
          date: new Date(r.fecha_registro).toLocaleDateString(dateLocale, { year: 'numeric', month: 'short', day: 'numeric' }),
          score: r.promedio,
        }))
      );
    } catch (error) {
      console.error("Error fetching academic data:", error);
      toast({
        title: t("studentDashboard.studentTrackingDataPage.toastErrorTitle"),
        description: t("studentDashboard.studentTrackingDataPage.errorFetchingAcademic"),
        variant: "destructive",
      });
    } finally {
      setLoadingAcademic(false);
    }
  }, [user, t, toast, language]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  if (authLoading && !user) {
    return <LoadingScreen />;
  }

  const pageTitle = t("studentDashboard.studentTrackingDataPage.title");
  const theme = localStorage.getItem('theme') || 'light';

  return (
    <DashboardLayout
      userRole="student"
      pageTitle={pageTitle}
      isLoading={authLoading && !user}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
      >
        <Tabs defaultValue="emotional" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-200 dark:bg-slate-700 p-1 rounded-lg shadow-inner">
            <TabsTrigger value="emotional" className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 data-[state=active]:dark:text-white transition-all duration-150 ease-in-out hover:bg-slate-300 dark:hover:bg-slate-600 data-[state=active]:hover:bg-purple-600">
              <Smile size={18} />
              {t("studentDashboard.studentTrackingDataPage.emotionalTab")}
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 data-[state=active]:dark:text-white transition-all duration-150 ease-in-out hover:bg-slate-300 dark:hover:bg-slate-600 data-[state=active]:hover:bg-teal-600">
              <BookOpen size={18} />
              {t("studentDashboard.studentTrackingDataPage.academicTab")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emotional" className="mt-6">
            <Card className="shadow-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">{t("studentDashboard.studentTrackingDataPage.emotionalChartTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="h-96 p-4 md:p-6">
                {loadingEmotional ? (
                  <ChartPlaceholder />
                ) : emotionalData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={emotionalData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "rgba(100, 116, 139, 0.3)" : "rgba(203, 213, 225, 0.5)"} />
                      <XAxis dataKey="date" tick={{ fontSize: 12, fill: theme === 'dark' ? '#94a3b8' : '#475569' }} />
                      <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: theme === 'dark' ? '#94a3b8' : '#475569' }} />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
                          borderColor: theme === 'dark' ? '#475569' : '#e2e8f0',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                          backdropFilter: 'blur(5px)'
                        }}
                        labelStyle={{ color: theme === 'dark' ? '#e2e8f0' : '#1e293b', fontWeight: 'bold' }}
                        itemStyle={{ color: theme === 'dark' ? '#cbd5e1' : '#334155' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Line type="monotone" dataKey="energy" stroke="#82ca9d" strokeWidth={2} name={t("studentDashboard.studentTrackingDataPage.energyLevel")} dot={{ r: 4, fill: "#82ca9d" }} activeDot={{ r: 6, strokeWidth: 2, stroke: theme === 'dark' ? '#fff' : '#333' }} />
                      <Line type="monotone" dataKey="mood" stroke="#8884d8" strokeWidth={2} name={t("studentDashboard.studentTrackingDataPage.moodScore")} dot={{ r: 4, fill: "#8884d8" }} activeDot={{ r: 6, strokeWidth: 2, stroke: theme === 'dark' ? '#fff' : '#333' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <NoDataPlaceholder messageKey="studentDashboard.studentTrackingDataPage.noEmotionalData" />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic" className="mt-6">
            <Card className="shadow-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">{t("studentDashboard.studentTrackingDataPage.academicChartTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="h-96 p-4 md:p-6">
                {loadingAcademic ? (
                  <ChartPlaceholder />
                ) : academicData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={academicData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "rgba(100, 116, 139, 0.3)" : "rgba(203, 213, 225, 0.5)"} />
                      <XAxis dataKey="date" tick={{ fontSize: 12, fill: theme === 'dark' ? '#94a3b8' : '#475569' }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: theme === 'dark' ? '#94a3b8' : '#475569' }} />
                       <Tooltip
                        contentStyle={{ 
                          backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
                          borderColor: theme === 'dark' ? '#475569' : '#e2e8f0',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                          backdropFilter: 'blur(5px)'
                        }}
                        labelStyle={{ color: theme === 'dark' ? '#e2e8f0' : '#1e293b', fontWeight: 'bold' }}
                        itemStyle={{ color: theme === 'dark' ? '#cbd5e1' : '#334155' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Line type="monotone" dataKey="score" stroke="#ff7300" strokeWidth={2} name={t("studentDashboard.studentTrackingDataPage.academicScore")} dot={{ r: 4, fill: "#ff7300" }} activeDot={{ r: 6, strokeWidth: 2, stroke: theme === 'dark' ? '#fff' : '#333' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <NoDataPlaceholder messageKey="studentDashboard.studentTrackingDataPage.noAcademicData" />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}