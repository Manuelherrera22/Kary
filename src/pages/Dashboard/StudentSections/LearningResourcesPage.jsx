import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Filter, Loader2, ExternalLink, AlertTriangle, Video, FileText, PlusCircle, Search, Library, Layers, Activity as ActivityIcon, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { supabase } from '@/lib/supabaseClient.js';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import DashboardLayout from "@/pages/Dashboard/components/DashboardLayout";
import LoadingScreen from "@/pages/Dashboard/components/LoadingScreen";
import UploadRecursoModal from '@/pages/Dashboard/StudentSections/components/UploadRecursoModal';
import { Input } from '@/components/ui/input';

const typeIconMapping = {
  guía: FileText,
  video: Video,
  actividad: ActivityIcon,
  documento: BookOpen,
  default: BookOpen,
};

const typeColorMapping = {
  guía: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  video: "bg-red-500/20 text-red-300 border-red-500/30",
  actividad: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  documento: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  default: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

const ResourceCard = ({ resource, onAccessResource }) => {
  const { t } = useLanguage();
  const IconComponent = typeIconMapping[resource.tipo] || typeIconMapping.default;
  const typeStyles = typeColorMapping[resource.tipo] || typeColorMapping.default;

  const typeLabelKeys = {
    guía: 'studentDashboard.learningResourcesPage.typeGuia',
    video: 'studentDashboard.learningResourcesPage.typeVideo',
    actividad: 'studentDashboard.learningResourcesPage.typeActividad',
    documento: 'studentDashboard.learningResourcesPage.typeDocumento',
  };
  const labelKey = typeLabelKeys[resource.tipo] || 'studentDashboard.learningResourcesPage.typeUnknown';


  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "circOut" }}
      className="bg-slate-800/70 backdrop-blur-md p-6 rounded-xl shadow-xl border border-slate-700/50 flex flex-col justify-between transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-amber-500/10 hover:border-amber-500/50 transform hover:-translate-y-1 group"
    >
      <div className="flex-grow">
        <div className={`flex items-center justify-between mb-4`}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${typeStyles.split(' ')[0]} shadow-md group-hover:shadow-lg transition-shadow`}>
            <IconComponent size={20} className={`${typeStyles.split(' ')[1]}`} />
          </div>
          <Badge variant="outline" className={`text-xs ${typeStyles} px-2 py-1 group-hover:opacity-90 transition-opacity`}>
            {t(labelKey, resource.tipo)}
          </Badge>
        </div>
        <h3 className="text-xl font-bold text-amber-400 dark:text-amber-300 mb-2 truncate group-hover:text-amber-200 transition-colors" title={resource.titulo}>
          {resource.titulo}
        </h3>
        <p className="text-sm text-slate-400 dark:text-slate-300 mb-4 line-clamp-3 h-[3.75rem] overflow-hidden" title={resource.descripcion}>
          {resource.descripcion || t('studentDashboard.learningResourcesPage.noDescription')}
        </p>
        {resource.tags && resource.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {resource.tags.map(tag => (
              <Badge key={tag} variant="outline" className={`text-xs bg-slate-700 text-slate-300 border-slate-600 px-2 py-1 group-hover:opacity-90 transition-opacity`}>
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onAccessResource(resource.url)}
        className={`w-full justify-center ${typeStyles.split(' ')[1]} hover:bg-opacity-30 ${typeStyles.split(' ')[0]} mt-auto group-hover:shadow-inner transition-all`}
      >
        <ExternalLink size={16} className="mr-2 group-hover:rotate-3 transition-transform" /> 
        {t('studentDashboard.learningResourcesPage.accessResource')}
      </Button>
    </motion.div>
  );
};

export default function LearningResourcesPage() {
  const { t } = useLanguage();
  const { userProfile, loading: authLoading } = useMockAuth();
  const { toast } = useToast();

  const [allResources, setAllResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("todos");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const resourceTabTypes = useMemo(() => [
    { value: 'todos', labelKey: 'studentDashboard.learningResourcesPage.tabTodos', icon: Layers },
    { value: 'guía', labelKey: 'studentDashboard.learningResourcesPage.tabGuia', icon: FileText },
    { value: 'actividad', labelKey: 'studentDashboard.learningResourcesPage.tabActividad', icon: ActivityIcon },
    { value: 'video', labelKey: 'studentDashboard.learningResourcesPage.tabVideo', icon: Video },
    { value: 'documento', labelKey: 'studentDashboard.learningResourcesPage.tabDocumento', icon: BookOpen },
  ], []);

  const allowedUploadRoles = ['admin', 'psychopedagogue', 'directive'];

  const fetchResources = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("learning_resources")
        .select("id, title, description, type, url, tags, created_at")
        .eq('published', true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const mappedData = (data || []).map(r => ({
        id: r.id,
        titulo: r.title,
        descripcion: r.description,
        tipo: r.type,
        url: r.url,
        tags: r.tags,
        created_at: r.created_at
      }));
      setAllResources(mappedData);

    } catch (error) {
      console.error("Error fetching learning resources:", error);
      toast({
        title: t("toast.errorTitle"),
        description: t("studentDashboard.learningResourcesPage.errorFetching"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    if (!authLoading) {
      fetchResources();
    }
  }, [authLoading, fetchResources]);

  const filteredResources = useMemo(() => allResources
    .filter(r => activeTab === 'todos' || r.tipo === activeTab)
    .filter(r => 
      (r.titulo?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (r.descripcion?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (r.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    ), [allResources, activeTab, searchTerm]);
  
  const handleAccessResource = (url) => {
    if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
    } else {
        toast({
            title: t("toast.infoTitle"),
            description: t("studentDashboard.learningResourcesPage.noUrlProvided"),
            variant: "default",
        });
    }
  };

  const handleUploadSuccess = () => {
    fetchResources(); 
    setIsUploadModalOpen(false);
  };

  if (authLoading && isLoading && !userProfile) {
    return <LoadingScreen />;
  }
  
  const pageTitle = t("studentDashboard.learningResourcesPage.pageTitle");
  const canUpload = userProfile && allowedUploadRoles.includes(userProfile.role);

  return (
    <DashboardLayout
      userRole={userProfile?.role || 'student'} 
      pageTitle={pageTitle}
      isLoading={authLoading && !userProfile}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="max-w-full mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-slate-800 to-neutral-900 min-h-[calc(100vh-var(--header-height,4rem))]"
      >
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-slate-200 transition-colors group">
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            {t('common.backToDashboard')}
          </Link>
        </div>

        <header className="mb-12 text-center relative overflow-hidden py-8">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/10 via-transparent to-sky-600/10 opacity-50 -z-10 blur-3xl"></div>
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "backOut" }}
            className="inline-block p-4 bg-slate-700/50 rounded-full shadow-xl border border-slate-600/50 mb-6"
          >
            <Library size={56} className="text-amber-400" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 mb-4">
            {pageTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="text-slate-400 dark:text-slate-300 text-xl max-w-3xl mx-auto">{t('studentDashboard.learningResourcesPage.subtitle')}</motion.p>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 p-6 bg-slate-800/60 rounded-2xl shadow-2xl border border-slate-700/40 backdrop-blur-md"
        >
          <div className="relative w-full md:flex-grow">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <Input
              type="text"
              placeholder={t('studentDashboard.learningResourcesPage.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 w-full bg-slate-700/70 dark:bg-slate-700 border-slate-600/70 dark:border-slate-600 text-slate-100 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 rounded-xl text-base shadow-sm"
            />
          </div>
          {canUpload && (
            <Button onClick={() => setIsUploadModalOpen(true)} className="w-full md:w-auto bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-6 rounded-xl shadow-lg hover:shadow-green-500/30 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2">
              <PlusCircle size={22} />
              <span className="font-semibold">{t('studentDashboard.learningResourcesPage.uploadResourceButton')}</span>
            </Button>
          )}
        </motion.div>

        {isUploadModalOpen && (
          <UploadRecursoModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            onUploadSuccess={handleUploadSuccess}
          />
        )}

        <Tabs defaultValue="todos" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3 bg-slate-700/60 dark:bg-slate-800/70 p-3 rounded-xl shadow-xl mb-10 backdrop-blur-sm border border-slate-700/30">
            {resourceTabTypes.map(type => {
              const Icon = type.icon;
              const isActive = activeTab === type.value;
              return (
                <TabsTrigger
                  key={type.value}
                  value={type.value}
                  className={`flex items-center justify-center gap-2.5 rounded-lg px-3 py-3 text-sm font-semibold transition-all duration-250 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-amber-500
                    ${isActive 
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg scale-105' 
                      : 'bg-slate-600/50 hover:bg-slate-500/70 text-slate-300 hover:text-slate-100 dark:bg-slate-700/80 dark:hover:bg-slate-600/90 dark:text-slate-200 dark:hover:text-white'
                    }`}
                >
                  <Icon size={20} />
                  {t(type.labelKey, type.value.charAt(0).toUpperCase() + type.value.slice(1))}
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          {isLoading && !authLoading ? ( 
            <div className="flex flex-col items-center justify-center h-96">
              <Loader2 className="h-20 w-20 animate-spin text-amber-400 mb-4" />
              <p className="text-slate-300 text-lg">{t('common.loadingData')}</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <TabsContent key={activeTab} value={activeTab} className="mt-0 min-h-[400px]">
                {filteredResources.length > 0 ? (
                  <motion.div 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredResources.map(res => (
                      <ResourceCard key={res.id} resource={res} onAccessResource={handleAccessResource} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center py-20 text-center bg-slate-800/70 rounded-2xl shadow-xl border border-slate-700/50 backdrop-blur-md"
                  >
                    <AlertTriangle size={64} className="text-amber-400 mb-8" />
                    <h2 className="text-3xl font-semibold text-slate-200 dark:text-slate-100 mb-3">{t('studentDashboard.learningResourcesPage.noResourcesFound')}</h2>
                    <p className="text-slate-400 dark:text-slate-300 max-w-lg text-lg">
                      {searchTerm ? t('studentDashboard.learningResourcesPage.noSearchResults', { searchTerm }) : t('studentDashboard.learningResourcesPage.tryDifferentFilters')}
                    </p>
                  </motion.div>
                )}
              </TabsContent>
            </AnimatePresence>
          )}
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}