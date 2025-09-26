import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Users, 
  MessageSquare, 
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Sync
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import studentSyncService from '@/services/studentSyncService';

const StudentDashboardSync = () => {
  const { t } = useLanguage();
  const { user } = useMockAuth();
  const [syncData, setSyncData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    const fetchSyncData = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const result = await studentSyncService.getStudentSyncData(user.id);
        if (result.success) {
          setSyncData(result.data);
          setLastSync(new Date().toISOString());
        }
      } catch (error) {
        console.error('Error fetching sync data:', error);
        // Datos mock para desarrollo
        setSyncData({
          teacherUpdates: [
            {
              id: 1,
              teacher: 'Prof. María González',
              type: 'new_activity',
              message: 'Nueva actividad de matemáticas asignada',
              timestamp: new Date(Date.now() - 1800000).toISOString(),
              priority: 'medium'
            },
            {
              id: 2,
              teacher: 'Prof. Carlos Ruiz',
              type: 'feedback',
              message: 'Retroalimentación enviada para actividad de ciencias',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              priority: 'high'
            }
          ],
          parentUpdates: [
            {
              id: 1,
              parent: 'Mamá',
              type: 'encouragement',
              message: '¡Muy bien! Veo tu progreso esta semana',
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              priority: 'low'
            }
          ],
          psychopedagogueUpdates: [
            {
              id: 1,
              psychopedagogue: 'Psicopedagoga Ana',
              type: 'support_plan',
              message: 'Plan de apoyo actualizado',
              timestamp: new Date(Date.now() - 10800000).toISOString(),
              priority: 'high'
            }
          ],
          systemUpdates: [
            {
              id: 1,
              type: 'achievement',
              message: 'Nuevo logro desbloqueado: Estudiante Constante',
              timestamp: new Date(Date.now() - 14400000).toISOString(),
              priority: 'medium'
            }
          ],
          syncStatus: {
            lastFullSync: new Date(Date.now() - 1800000).toISOString(),
            pendingUpdates: 4,
            syncErrors: 0,
            connectionStatus: 'connected'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSyncData();
  }, [user?.id]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await studentSyncService.syncStudentData(user.id);
      if (result.success) {
        setSyncData(result.data);
        setLastSync(new Date().toISOString());
      }
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      setSyncing(false);
    }
  };

  const getUpdateIcon = (type) => {
    switch (type) {
      case 'new_activity': return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'feedback': return <MessageSquare className="w-4 h-4 text-green-400" />;
      case 'encouragement': return <Target className="w-4 h-4 text-pink-400" />;
      case 'support_plan': return <Users className="w-4 h-4 text-purple-400" />;
      case 'achievement': return <TrendingUp className="w-4 h-4 text-yellow-400" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const updateTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - updateTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/60">
        <CardHeader>
          <CardTitle className="text-xl text-cyan-300">🔄 Sincronización</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalUpdates = (syncData?.teacherUpdates?.length || 0) + 
                      (syncData?.parentUpdates?.length || 0) + 
                      (syncData?.psychopedagogueUpdates?.length || 0) + 
                      (syncData?.systemUpdates?.length || 0);

  return (
    <Card className="bg-slate-800/50 border-slate-700/60">
      <CardHeader>
        <CardTitle className="text-xl text-cyan-300 flex items-center gap-2">
          🔄 Sincronización con Otros Dashboards
          {totalUpdates > 0 && (
            <Badge variant="destructive" className="text-xs">
              {totalUpdates} actualizaciones
            </Badge>
          )}
        </CardTitle>
        
        <div className="flex items-center gap-4 mt-4">
          <Button
            onClick={handleSync}
            disabled={syncing}
            className="bg-cyan-600 hover:bg-cyan-700"
            size="sm"
          >
            {syncing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                <Sync className="w-4 h-4 mr-2" />
                Sincronizar Ahora
              </>
            )}
          </Button>
          
          {lastSync && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              Última sincronización: {getTimeAgo(lastSync)}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Estado de conexión */}
        <div className="flex items-center gap-2 p-3 bg-slate-700/50 rounded-lg">
          <div className={`w-3 h-3 rounded-full ${
            syncData?.syncStatus?.connectionStatus === 'connected' 
              ? 'bg-green-400' 
              : 'bg-red-400'
          }`}></div>
          <span className="text-sm text-slate-300">
            Estado: {syncData?.syncStatus?.connectionStatus === 'connected' ? 'Conectado' : 'Desconectado'}
          </span>
          {syncData?.syncStatus?.syncErrors > 0 && (
            <Badge variant="destructive" className="text-xs">
              {syncData.syncStatus.syncErrors} errores
            </Badge>
          )}
        </div>

        {/* Actualizaciones de profesores */}
        {syncData?.teacherUpdates?.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Actualizaciones de Profesores
            </h4>
            <div className="space-y-2">
              {syncData.teacherUpdates.map((update) => (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg"
                >
                  {getUpdateIcon(update.type)}
                  <div className="flex-1">
                    <p className="text-sm text-blue-200 font-medium">{update.teacher}</p>
                    <p className="text-xs text-blue-300">{update.message}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${getPriorityColor(update.priority)}`}>
                      {update.priority}
                    </span>
                    <span className="text-xs text-slate-400">
                      {getTimeAgo(update.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Actualizaciones de padres */}
        {syncData?.parentUpdates?.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-400" />
              Actualizaciones de Familia
            </h4>
            <div className="space-y-2">
              {syncData.parentUpdates.map((update) => (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 bg-pink-500/20 border border-pink-500/30 rounded-lg"
                >
                  {getUpdateIcon(update.type)}
                  <div className="flex-1">
                    <p className="text-sm text-pink-200 font-medium">{update.parent}</p>
                    <p className="text-xs text-pink-300">{update.message}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${getPriorityColor(update.priority)}`}>
                      {update.priority}
                    </span>
                    <span className="text-xs text-slate-400">
                      {getTimeAgo(update.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Actualizaciones de psicopedagogos */}
        {syncData?.psychopedagogueUpdates?.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Actualizaciones de Apoyo
            </h4>
            <div className="space-y-2">
              {syncData.psychopedagogueUpdates.map((update) => (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg"
                >
                  {getUpdateIcon(update.type)}
                  <div className="flex-1">
                    <p className="text-sm text-purple-200 font-medium">{update.psychopedagogue}</p>
                    <p className="text-xs text-purple-300">{update.message}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${getPriorityColor(update.priority)}`}>
                      {update.priority}
                    </span>
                    <span className="text-xs text-slate-400">
                      {getTimeAgo(update.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Actualizaciones del sistema */}
        {syncData?.systemUpdates?.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              Actualizaciones del Sistema
            </h4>
            <div className="space-y-2">
              {syncData.systemUpdates.map((update) => (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg"
                >
                  {getUpdateIcon(update.type)}
                  <div className="flex-1">
                    <p className="text-sm text-yellow-200 font-medium">Sistema Kary</p>
                    <p className="text-xs text-yellow-300">{update.message}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${getPriorityColor(update.priority)}`}>
                      {update.priority}
                    </span>
                    <span className="text-xs text-slate-400">
                      {getTimeAgo(update.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {totalUpdates === 0 && (
          <div className="text-center py-8 text-slate-400">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Todo está sincronizado</p>
            <p className="text-sm">No hay actualizaciones pendientes</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentDashboardSync;
