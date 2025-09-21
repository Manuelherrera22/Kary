import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { getTeacherCommunications } from '@/services/teacherCommunicationService';
import { 
  Bell, 
  Mail, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Eye,
  X
} from 'lucide-react';

const SupportPlansNotification = ({ teacherId, onViewPlans }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [recentPlans, setRecentPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    loadRecentPlans();
  }, [teacherId]);

  const loadRecentPlans = async () => {
    setIsLoading(true);
    try {
      const result = await getTeacherCommunications(teacherId, 'sent');
      if (result.success) {
        // Mostrar solo los últimos 3 planes pendientes
        setRecentPlans(result.communications.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading recent plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      default: return 'bg-green-600';
    }
  };

  if (!isVisible || recentPlans.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30 mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Bell className="w-5 h-5 mr-2 text-purple-400" />
            Planes de Apoyo Pendientes
          </CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-purple-600 text-white">
              {recentPlans.length} nuevo{recentPlans.length !== 1 ? 's' : ''}
            </Badge>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
            <span className="ml-2 text-gray-400">Cargando planes...</span>
          </div>
        ) : (
          <>
            {recentPlans.map((plan) => (
              <div key={plan.id} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <h4 className="font-semibold text-white text-sm">
                        {plan.subject}
                      </h4>
                      <Badge className={`text-xs ${getPriorityColor(plan.priority)}`}>
                        {plan.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-300 text-xs mb-2">
                      {plan.content.substring(0, 80)}...
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(plan.created_at)}
                      </div>
                      <div className="flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {plan.metadata?.activities_count || 0} actividades
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <Button
                      onClick={() => onViewPlans && onViewPlans()}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {recentPlans.length > 0 && (
              <div className="pt-2 border-t border-slate-600">
                <Button
                  onClick={() => onViewPlans && onViewPlans()}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Ver Todos los Planes de Apoyo
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SupportPlansNotification;
