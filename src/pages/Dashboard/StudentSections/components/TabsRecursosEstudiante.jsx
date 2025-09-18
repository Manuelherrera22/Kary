import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Layers3, Video, FileText as FileTextIcon, Activity as ActivityIcon, BookOpen, Loader2, AlertTriangle, Tag, ArrowLeft, Heart, Star, Eye, BookCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import mockStudentDataService from '@/services/mockStudentDataService';
import SugerenciasDeRecursos from '@/pages/Dashboard/StudentSections/components/SugerenciasDeRecursos';

const ResourceDisplayCard = ({ resource, t, onToggleFavorite, onRateResource }) => {
  const typeIconMapping = {
    video: Video,
    guía: BookCheck,
    actividad: ActivityIcon,
    documento: FileTextIcon,
    interactive: ActivityIcon,
    reading: BookOpen,
    default: BookOpen,
  };

  const IconComponent = typeIconMapping[resource.type] || typeIconMapping.default;
  
  const handleViewResource = () => {
    if (resource.url) {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    onToggleFavorite(resource.id);
  };

  const handleRate = (e, rating) => {
    e.stopPropagation();
    onRateResource(resource.id, rating);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        onClick={(e) => handleRate(e, i + 1)}
        className={`transition-colors ${
          i < (resource.rating || 0) 
            ? 'text-yellow-400 hover:text-yellow-300' 
            : 'text-slate-500 hover:text-yellow-400'
        }`}
      >
        <Star size={14} fill={i < (resource.rating || 0) ? 'currentColor' : 'none'} />
      </button>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full group"
    >
      <Card className="relative h-full flex flex-col bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 bg-amber-500" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
            <CardHeader className="relative pb-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-xl border border-amber-500/30 group-hover:scale-110 transition-transform duration-200">
                  <IconComponent size={24} className="text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-bold text-amber-300 group-hover:text-amber-200 transition-colors duration-200 leading-tight" title={resource.title}>
                      {resource.title}
                    </CardTitle>
                    <button
                      onClick={handleToggleFavorite}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        resource.is_favorite 
                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                          : 'bg-slate-700/50 text-slate-400 hover:bg-red-500/20 hover:text-red-400'
                      }`}
                    >
                      <Heart size={16} fill={resource.is_favorite ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>
          
          <CardDescription className="text-slate-300 leading-relaxed mb-4">
            {resource.description || t('tabsRecursosEstudiante.noDescription')}
          </CardDescription>
          
              {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/30 hover:from-amber-500/30 hover:to-yellow-500/30 transition-all duration-200"
                    >
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Rating and Usage Stats */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars()}
                  </div>
                  <span className="text-sm text-slate-400">
                    ({resource.rating || 0}/5)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Eye size={14} />
                  <span className="text-sm">{resource.usage_count || 0}</span>
                </div>
              </div>
        </CardHeader>
        
        <CardFooter className="relative mt-auto pt-4 border-t border-slate-700/50">
          <Button 
            onClick={handleViewResource} 
            variant="outline" 
            className="w-full bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-amber-300 border-amber-500/50 hover:from-amber-500/20 hover:to-yellow-500/20 hover:text-amber-200 hover:border-amber-400 transition-all duration-200 hover:scale-[1.02] font-semibold"
          >
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
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    const fetchAssignedResources = async () => {
      if (!user || !user.id) {
        setIsLoading(false);
        setAllAssigned([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const { data, error } = await mockStudentDataService.getAssignedResources(user.id);

        if (error) throw error;
        
        if (data) {
          const sortedData = data.sort((a, b) => new Date(b.assigned_at) - new Date(a.assigned_at));
          setAllAssigned(sortedData);
        } else {
          setAllAssigned([]);
        }

      } catch (error) {
        console.error("Error fetching student's assigned resources:", error);
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

  const handleToggleFavorite = async (resourceId) => {
    try {
      const { data, error } = await mockStudentDataService.toggleResourceFavorite(user.id, resourceId);
      if (error) throw error;
      
      // Actualizar el estado local
      setAllAssigned(prev => 
        prev.map(resource => 
          resource.id === resourceId 
            ? { ...resource, is_favorite: data.is_favorite }
            : resource
        )
      );
      
      toast({
        title: data.is_favorite ? t('tabsRecursosEstudiante.addedToFavorites') : t('tabsRecursosEstudiante.removedFromFavorites'),
        className: "bg-green-500 text-white dark:bg-green-700"
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: t('toast.errorTitle'),
        description: error.message || t('tabsRecursosEstudiante.favoriteError'),
        variant: 'destructive',
      });
    }
  };

  const handleRateResource = async (resourceId, rating) => {
    try {
      const { data, error } = await mockStudentDataService.rateResource(user.id, resourceId, rating);
      if (error) throw error;
      
      // Actualizar el estado local
      setAllAssigned(prev => 
        prev.map(resource => 
          resource.id === resourceId 
            ? { ...resource, rating: data.rating }
            : resource
        )
      );
      
      toast({
        title: t('tabsRecursosEstudiante.ratingUpdated'),
        className: "bg-blue-500 text-white dark:bg-blue-700"
      });
    } catch (error) {
      console.error('Error rating resource:', error);
      toast({
        title: t('toast.errorTitle'),
        description: error.message || t('tabsRecursosEstudiante.ratingError'),
        variant: 'destructive',
      });
    }
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
    if (showFavoritesOnly) {
      resources = resources.filter(res => res.is_favorite);
    }
    return resources;
  }, [allAssigned, activeTab, selectedTags, showFavoritesOnly]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-amber-400" />
      </div>
    );
  }

      return (
        <div className="w-full space-y-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-slate-200 transition-colors group">
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              {t('common.backToDashboard')}
            </Link>
          </div>

          {/* Header Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">
              {t('tabsRecursosEstudiante.pageTitle', 'Recursos Asignados')}
            </h2>
            <p className="text-slate-400 text-lg">
              {t('tabsRecursosEstudiante.pageSubtitle', 'Material de apoyo seleccionado especialmente para ti')}
            </p>
          </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Enhanced Tabs */}
        <div className="mb-8">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3 bg-gradient-to-r from-slate-800/80 to-slate-900/80 p-3 rounded-2xl border border-slate-700/50 shadow-xl">
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
                  className={`flex-1 flex items-center justify-center gap-3 px-4 py-4 text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105
                    ${isActive 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-lg shadow-amber-500/25' 
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/70 hover:text-slate-100 border border-slate-600/50'
                    }`}
                >
                  <Icon size={20} />
                  <span className="hidden sm:inline">
                    {t(type.labelKey, type.value.charAt(0).toUpperCase() + type.value.slice(1))}
                  </span>
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-bold">
                    {count}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

            {/* Enhanced Filters */}
            <div className="mb-8 space-y-6">
              {/* Favorites Filter */}
              <div className="p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl border border-slate-700/50 shadow-xl backdrop-blur-sm">
                <h4 className="text-lg font-bold text-slate-200 mb-4 flex items-center">
                  <div className="p-2 bg-red-500/20 rounded-lg mr-3">
                    <Heart size={20} className="text-red-400" />
                  </div>
                  {t('tabsRecursosEstudiante.filters')}
                </h4>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant={showFavoritesOnly ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                      showFavoritesOnly
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-slate-900 border-red-500 shadow-lg shadow-red-500/25'
                        : 'text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-500'
                    }`}
                  >
                    <Heart size={14} className="mr-2" />
                    {t('tabsRecursosEstudiante.favoritesOnly')}
                  </Button>
                </div>
              </div>

              {/* Tags Filter */}
              {allAvailableTags.length > 0 && (
                <div className="p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl border border-slate-700/50 shadow-xl backdrop-blur-sm">
                  <h4 className="text-lg font-bold text-slate-200 mb-4 flex items-center">
                    <div className="p-2 bg-amber-500/20 rounded-lg mr-3">
                      <Tag size={20} className="text-amber-400" />
                    </div>
                    {t('tabsRecursosEstudiante.filterByTags')}
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {allAvailableTags.map(tag => (
                      <Button
                        key={tag}
                        variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleTagToggle(tag)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                          selectedTags.includes(tag)
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 border-amber-500 shadow-lg shadow-amber-500/25'
                            : 'text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-500'
                        }`}
                      >
                        {tag}
                      </Button>
                    ))}
                    {selectedTags.length > 0 && (
                       <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedTags([])}
                          className="text-slate-400 hover:text-slate-200 px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                        >
                         {t('tabsRecursosEstudiante.clearTagsFilter')}
                        </Button>
                    )}
                  </div>
                </div>
              )}
            </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${selectedTags.join('-')}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredResources.map((resource, index) => (
                  <motion.div
                    key={resource.assignment_id || resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                        <ResourceDisplayCard 
                          resource={resource} 
                          t={t} 
                          onToggleFavorite={handleToggleFavorite}
                          onRateResource={handleRateResource}
                        />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-slate-700/50 shadow-2xl">
                <div className="p-6 bg-amber-500/20 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <AlertTriangle size={48} className="text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-200 mb-4">
                  {activeTab === 'todos' && selectedTags.length === 0 ? t('tabsRecursosEstudiante.noResources') : t('tabsRecursosEstudiante.noResourcesFoundTitle')}
                </h3>
                {(activeTab !== 'todos' || selectedTags.length > 0) && (
                  <p className="text-slate-400 text-lg">
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