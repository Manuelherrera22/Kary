import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Play,
  Download,
  Star,
  Clock,
  Users,
  Heart,
  Brain,
  Target,
  Lightbulb,
  FileText,
  Video,
  Headphones,
  Book,
  ExternalLink,
  Search,
  Filter,
  ChevronRight,
  CheckCircle,
  Bookmark,
  Share2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ParentResourcesPanel = () => {
  const { t } = useLanguage();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedResources, setBookmarkedResources] = useState([]);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    try {
      // Simular carga de recursos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResources = [
        {
          id: 'resource-1',
          title: 'Guía para Apoyar a Niños con TDAH en Casa',
          type: 'guide',
          category: 'academic',
          description: 'Estrategias prácticas para ayudar a tu hijo/a con TDAH a concentrarse y organizarse mejor en casa.',
          author: 'Dr. María González',
          duration: '15 min lectura',
          rating: 4.8,
          downloads: 1250,
          tags: ['TDAH', 'Concentración', 'Organización', 'Casa'],
          content: 'PDF',
          url: '#',
          isBookmarked: false,
          difficulty: 'intermediate'
        },
        {
          id: 'resource-2',
          title: 'Técnicas de Relajación para Niños Ansiosos',
          type: 'video',
          category: 'emotional',
          description: 'Video tutorial con ejercicios de respiración y relajación para ayudar a tu hijo/a a manejar la ansiedad.',
          author: 'Psicóloga Ana Martínez',
          duration: '12 min',
          rating: 4.9,
          downloads: 890,
          tags: ['Ansiedad', 'Relajación', 'Respiración', 'Emociones'],
          content: 'Video',
          url: '#',
          isBookmarked: true,
          difficulty: 'beginner'
        },
        {
          id: 'resource-3',
          title: 'Cómo Fomentar la Lectura en Casa',
          type: 'article',
          category: 'academic',
          description: 'Consejos prácticos para crear un ambiente propicio para la lectura y el amor por los libros.',
          author: 'Prof. Carlos Ruiz',
          duration: '8 min lectura',
          rating: 4.7,
          downloads: 2100,
          tags: ['Lectura', 'Hábitos', 'Casa', 'Aprendizaje'],
          content: 'Artículo',
          url: '#',
          isBookmarked: false,
          difficulty: 'beginner'
        },
        {
          id: 'resource-4',
          title: 'Podcast: Comunicación Efectiva con Adolescentes',
          type: 'podcast',
          category: 'emotional',
          description: 'Episodio especial sobre cómo mantener una comunicación abierta y efectiva con tu hijo/a adolescente.',
          author: 'Dr. Luis Fernández',
          duration: '25 min',
          rating: 4.6,
          downloads: 650,
          tags: ['Comunicación', 'Adolescencia', 'Familia', 'Relaciones'],
          content: 'Audio',
          url: '#',
          isBookmarked: true,
          difficulty: 'intermediate'
        },
        {
          id: 'resource-5',
          title: 'Actividades de Matemáticas Divertidas',
          type: 'activity',
          category: 'academic',
          description: 'Colección de juegos y actividades para hacer las matemáticas más divertidas y atractivas.',
          author: 'Prof. Elena Vargas',
          duration: '20 min',
          rating: 4.8,
          downloads: 1800,
          tags: ['Matemáticas', 'Juegos', 'Aprendizaje', 'Diversión'],
          content: 'PDF + Actividades',
          url: '#',
          isBookmarked: false,
          difficulty: 'beginner'
        },
        {
          id: 'resource-6',
          title: 'Webinar: Gestión del Tiempo de Estudio',
          type: 'webinar',
          category: 'academic',
          description: 'Sesión en vivo sobre cómo ayudar a tu hijo/a a organizar mejor su tiempo de estudio y tareas.',
          author: 'Coach Educativo Miguel Torres',
          duration: '45 min',
          rating: 4.9,
          downloads: 3200,
          tags: ['Tiempo', 'Estudio', 'Organización', 'Productividad'],
          content: 'Video + Materiales',
          url: '#',
          isBookmarked: true,
          difficulty: 'intermediate'
        },
        {
          id: 'resource-7',
          title: 'Manual de Apoyo Emocional para Padres',
          type: 'manual',
          category: 'emotional',
          description: 'Guía completa para entender y apoyar el desarrollo emocional de tu hijo/a en diferentes etapas.',
          author: 'Equipo de Psicólogos Kary',
          duration: '30 min lectura',
          rating: 4.9,
          downloads: 4500,
          tags: ['Emociones', 'Desarrollo', 'Apoyo', 'Padres'],
          content: 'PDF Completo',
          url: '#',
          isBookmarked: false,
          difficulty: 'advanced'
        },
        {
          id: 'resource-8',
          title: 'Juegos para Desarrollar la Inteligencia Emocional',
          type: 'activity',
          category: 'emotional',
          description: 'Actividades prácticas para desarrollar la inteligencia emocional y las habilidades sociales.',
          author: 'Psicóloga Carmen López',
          duration: '15 min',
          rating: 4.7,
          downloads: 1200,
          tags: ['Inteligencia Emocional', 'Juegos', 'Habilidades Sociales'],
          content: 'PDF + Juegos',
          url: '#',
          isBookmarked: true,
          difficulty: 'beginner'
        }
      ];

      setResources(mockResources);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'guide': return <BookOpen size={20} className="text-blue-400" />;
      case 'video': return <Play size={20} className="text-red-400" />;
      case 'article': return <FileText size={20} className="text-green-400" />;
      case 'podcast': return <Headphones size={20} className="text-purple-400" />;
      case 'activity': return <Target size={20} className="text-orange-400" />;
      case 'webinar': return <Video size={20} className="text-cyan-400" />;
      case 'manual': return <Book size={20} className="text-indigo-400" />;
      default: return <FileText size={20} className="text-gray-400" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'academic': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'emotional': return 'text-pink-400 bg-pink-500/20 border-pink-500/30';
      case 'behavioral': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'family': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'advanced': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const handleBookmark = (resourceId) => {
    setResources(prev => 
      prev.map(resource => 
        resource.id === resourceId 
          ? { ...resource, isBookmarked: !resource.isBookmarked }
          : resource
      )
    );
  };

  const filteredResources = resources.filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'Todos', icon: '📚' },
    { id: 'academic', label: 'Académico', icon: '📖' },
    { id: 'emotional', label: 'Emocional', icon: '❤️' },
    { id: 'behavioral', label: 'Comportamental', icon: '🎯' },
    { id: 'family', label: 'Familiar', icon: '👨‍👩‍👧‍👦' }
  ];

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando recursos educativos...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/30">
              <BookOpen size={24} className="text-green-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-green-300">
                Recursos Educativos
              </CardTitle>
              <p className="text-sm text-slate-400">
                Herramientas y materiales para apoyar el aprendizaje en casa
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar recursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-700 border-slate-600 text-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Categorías */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <span>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* Lista de recursos */}
        <div className="space-y-4">
          {filteredResources.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen size={48} className="text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">
                No se encontraron recursos
              </h3>
              <p className="text-slate-400">
                Intenta con otros términos de búsqueda o cambia la categoría
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg border bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50 transition-all duration-200"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-slate-600/30 rounded-lg">
                      {getTypeIcon(resource.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-200 text-sm mb-1 line-clamp-2">
                        {resource.title}
                      </h4>
                      <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                        {resource.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {resource.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star size={12} />
                          {resource.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download size={12} />
                          {resource.downloads}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge className={getCategoryColor(resource.category)}>
                      {resource.category}
                    </Badge>
                    <Badge className={getDifficultyColor(resource.difficulty)}>
                      {resource.difficulty}
                    </Badge>
                    <Badge className="text-blue-400 bg-blue-500/20 border-blue-500/30">
                      {resource.content}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-slate-300 border-slate-600 hover:bg-slate-600"
                      >
                        <ExternalLink size={14} className="mr-1" />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-slate-300 border-slate-600 hover:bg-slate-600"
                      >
                        <Download size={14} />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleBookmark(resource.id)}
                        className={`text-slate-400 hover:text-slate-200 ${
                          resource.isBookmarked ? 'text-yellow-400' : ''
                        }`}
                      >
                        <Bookmark size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-slate-200"
                      >
                        <Share2 size={14} />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ParentResourcesPanel;

