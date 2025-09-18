import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Layers3, Video, FileText as FileTextIcon, Activity as ActivityIcon, BookOpen, Loader2, AlertTriangle, Tag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient.js';
import { useToast } from '@/components/ui/use-toast';
import SugerenciasDeRecursos from '@/pages/Dashboard/StudentSections/components/SugerenciasDeRecursos';

const ResourceDisplayCard = ({ resource, t }) => {
  const typeIconMapping = {
    video: Video,
    guía: FileTextIcon,
    actividad: ActivityIcon,
    documento: BookOpen,
    default: BookOpen,
  };

  const IconComponent = typeIconMapping[resource.type] || typeIconMapping.default;
  
  const handleViewResource = () => {
    if (resource.url) {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="bg-slate-800 border-slate-700 text-slate-100 h-full flex flex-col hover:shadow-lg hover:border-amber-500/50 transition-all duration-200">
        <CardHeader className="pb-4">
          <div className="flex items-center mb-3">
            <IconComponent size={24} className="mr-3 text-amber-400" />
            <CardTitle className="text-xl text-amber-400 truncate" title={resource.title}>{resource.title}</CardTitle>
          </div>
          <CardDescription className="text-slate-400 line-clamp-3 h-[3.75rem]">
            {resource.description || t('tabsRecursosEstudiante.noDescription')}
          </CardDescription>
          {resource.tags && resource.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {resource.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-slate-700 text-amber-300 border-amber-500/30">
                  <Tag size={12} className="mr-1" />{tag}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
        <CardFooter className="mt-auto pt-4 border-t border-slate-700/50">
          <Button onClick={handleViewResource} variant="outline" className="w-full text-amber-400 border-amber-500/80 hover:bg-amber-500/10 hover:text-amber-300 hover:border-amber-500">
            <ExternalLink size={16} className="mr-2" />
            {t('tabsRecursosEstudiante.viewResourceButton')}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const TabsRecursosEstudiante = ({ user }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [allAssigned, setAllAssigned] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('todos');
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const fetchAssignedResources = async () => {
      if (!user || !user.id) {
        setIsLoading(false);
        setAllAssigned([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('vista_recursos_asignados')
          .select('*')
          .eq('estudiante_id', user.id);

        if (error) throw error;
        
        if (data) {
          const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          const mappedData = sortedData
            .map(item => {
              if (!item.recurso || typeof item.recurso !== 'object' || item.recurso === null) {
                return null;
              }
              if (!item.recurso.type) {
                return null;
              }

              return {
                assignment_id: item.id, 
                assigned_at: item.created_at,
                asignado_por: item.asignado_por,
                id: item.recurso.id,
                title: item.recurso.title,
                description: item.recurso.description,
                type: item.recurso.type,
                url: item.recurso.url,
                published: item.recurso.published, 
                tags: item.recurso.tags || [],
              };
            })
            .filter(resource => resource && resource.id && resource.title); 
          
          setAllAssigned(mappedData);
        } else {
          setAllAssigned([]);
        }

      } catch (error) {
        console.error("Error fetching student's assigned resources from view:", error);
        setAllAssigned([]);
        toast({
          title: t('toast.errorTitle'),
          description: t('tabsRecursosEstudiante.fetchError') + (error.message ? `: ${error.message}` : ''),
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignedResources();
  }, [user, t, toast]);

  const allAvailableTags = useMemo(() => {
    const tagsSet = new Set();
    allAssigned.forEach(resource => {
      if (resource.tags) {
        resource.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet).sort();
  }, [allAssigned]);

  const handleTagToggle = (tagToToggle) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tagToToggle)
        ? prevTags.filter(tag => tag !== tagToToggle)
        : [...prevTags, tagToToggle]
    );
  };

  const resourceTypes = useMemo(() => {
    const baseTypes = [
      { value: 'todos', labelKey: 'tabsRecursosEstudiante.tabAll', icon: Layers3 },
      { value: 'guía', labelKey: 'tabsRecursosEstudiante.tabGuides', icon: FileTextIcon },
      { value: 'actividad', labelKey: 'tabsRecursosEstudiante.tabActivities', icon: ActivityIcon },
      { value: 'video', labelKey: 'tabsRecursosEstudiante.tabVideos', icon: Video },
      { value: 'documento', labelKey: 'tabsRecursosEstudiante.tabDocuments', icon: BookOpen },
    ];
    
    const assignedTypesPresent = new Set(allAssigned.map(res => res.type));
    
    return baseTypes.filter(bt => {
      if (bt.value === 'todos') return true;
      return assignedTypesPresent.has(bt.value);
    });

  }, [allAssigned, t]);

  const filteredResources = useMemo(() => {
    let resources = allAssigned;
    if (activeTab !== 'todos') {
      resources = resources.filter(res => res.type === activeTab);
    }
    if (selectedTags.length > 0) {
      resources = resources.filter(res => 
        selectedTags.every(tag => res.tags && res.tags.includes(tag))
      );
    }
    return resources;
  }, [allAssigned, activeTab, selectedTags]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-2 bg-slate-700/60 p-2 rounded-lg mb-6">
          {resourceTypes.map(type => {
            const count = type.value === 'todos' 
              ? (selectedTags.length > 0 ? filteredResources.length : allAssigned.length)
              : allAssigned.filter(r => r.type === type.value && (selectedTags.length === 0 || selectedTags.every(tag => r.tags && r.tags.includes(tag)))).length;

            if (type.value !== 'todos' && count === 0 && activeTab !== type.value && !(selectedTags.length > 0 && allAssigned.filter(r => r.type === type.value).length > 0) ) return null; 
            
            const Icon = type.icon;
            const isActive = activeTab === type.value;
            return (
              <TabsTrigger
                key={type.value}
                value={type.value}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium rounded-md transition-all
                  ${isActive 
                    ? 'bg-amber-500 text-slate-900 shadow-md' 
                    : 'bg-slate-600/50 text-slate-300 hover:bg-slate-500/70 hover:text-slate-100'
                  }`}
              >
                <Icon size={18} />
                {t(type.labelKey, type.value.charAt(0).toUpperCase() + type.value.slice(1))} ({count})
              </TabsTrigger>
            );
          })}
        </TabsList>

        {allAvailableTags.length > 0 && (
          <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center">
              <Tag size={16} className="mr-2 text-amber-400" />
              {t('tabsRecursosEstudiante.filterByTags')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {allAvailableTags.map(tag => (
                <Button
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTagToggle(tag)}
                  className={
                    selectedTags.includes(tag)
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-900 border-amber-500'
                      : 'text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-slate-100'
                  }
                >
                  {tag}
                </Button>
              ))}
              {selectedTags.length > 0 && (
                 <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTags([])}
                    className="text-slate-400 hover:text-slate-200"
                  >
                   {t('tabsRecursosEstudiante.clearTagsFilter')}
                  </Button>
              )}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${selectedTags.join('-')}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <ResourceDisplayCard key={resource.assignment_id || resource.id} resource={resource} t={t} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-800/50 rounded-lg">
                <AlertTriangle size={48} className="mx-auto text-yellow-400 mb-4" />
                <p className="text-xl text-slate-200 mb-2">
                  {activeTab === 'todos' && selectedTags.length === 0 ? t('tabsRecursosEstudiante.noResources') : t('tabsRecursosEstudiante.noResourcesFoundTitle')}
                </p>
                {(activeTab !== 'todos' || selectedTags.length > 0) && (
                  <p className="text-slate-400">
                    {t('tabsRecursosEstudiante.noResourcesFoundDesc', { type: t(resourceTypes.find(rt => rt.value === activeTab)?.labelKey || activeTab) })}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Tabs>
      
      {user && user.id && (
        <SugerenciasDeRecursos estudianteId={user.id} />
      )}
    </div>
  );
};

export default TabsRecursosEstudiante;