import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, CheckCircle, Clock, Zap, Shield, 
  TrendingUp, Users, BookOpen, Heart, Target,
  ArrowRight, Filter, Search, Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AlertCard = ({ alert, index }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <Zap className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (type) => {
    switch (type) {
      case 'academic_risk': return <BookOpen className="w-4 h-4" />;
      case 'emotional_concern': return <Heart className="w-4 h-4" />;
      case 'attendance_issue': return <Users className="w-4 h-4" />;
      case 'system_alert': return <Shield className="w-4 h-4" />;
      case 'performance_trend': return <TrendingUp className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Hace un momento';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group"
    >
      <Card className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-slate-700/60 hover:border-slate-600/80 transition-all duration-300 group-hover:shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className={`p-2 rounded-lg ${getPriorityColor(alert.priority).split(' ')[1]}`}>
                {getPriorityIcon(alert.priority)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`p-1 rounded ${getPriorityColor(alert.priority).split(' ')[1]}`}>
                    {getCategoryIcon(alert.type)}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${getPriorityColor(alert.priority)} text-xs`}
                  >
                    {alert.priority.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    {formatTime(alert.timestamp)}
                  </span>
                </div>
                <h4 className="font-medium text-slate-200 group-hover:text-white transition-colors">
                  {alert.message}
                </h4>
                {alert.details && (
                  <p className="text-sm text-slate-400 mt-1">
                    {alert.details}
                  </p>
                )}
                {alert.affected && (
                  <div className="flex items-center space-x-1 mt-2">
                    <Users className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-500">
                      Afecta a {alert.affected} estudiantes
                    </span>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const IntelligentAlerts = ({ alerts = [] }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === 'all' || alert.priority === filter;
    const matchesSearch = alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const priorityCounts = {
    critical: alerts.filter(a => a.priority === 'critical').length,
    high: alerts.filter(a => a.priority === 'high').length,
    medium: alerts.filter(a => a.priority === 'medium').length,
    low: alerts.filter(a => a.priority === 'low').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400">
            Alertas Inteligentes
          </h2>
          <p className="text-slate-400 mt-1">
            Sistema de alertas con priorización automática y análisis predictivo
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {Object.entries(priorityCounts).map(([priority, count]) => (
              <Badge
                key={priority}
                variant={filter === priority ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  filter === priority 
                    ? 'bg-red-500 text-white' 
                    : 'hover:bg-slate-700'
                }`}
                onClick={() => setFilter(filter === priority ? 'all' : priority)}
              >
                {priority.toUpperCase()} ({count})
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Buscar alertas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-slate-600 hover:bg-slate-700"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert, index) => (
              <AlertCard key={alert.id} alert={alert} index={index} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">
                ¡Excelente! No hay alertas pendientes
              </h3>
              <p className="text-slate-500">
                El sistema está funcionando de manera óptima
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IntelligentAlerts;

