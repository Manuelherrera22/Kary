/**
 * Componente de Sincronización en Tiempo Real
 * Conecta todos los dashboards y sincroniza datos entre roles
 */

import React, { useEffect, useState } from 'react';
import { useMockAuth } from '../contexts/MockAuthContext';
import unifiedDataService from '../services/unifiedDataService';
import activityService from '../services/activityService';
import notificationService from '../services/notificationService';

const RealTimeSync = ({ children }) => {
  const { user } = useMockAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    if (!user) return;

    let unsubscribeFunctions = [];

    // Suscribirse a cambios en actividades
    const unsubscribeActivities = activityService.subscribe((event, data) => {
      console.log('Activity event:', event, data);
      
      // Sincronizar con el servicio unificado
      if (event === 'activity_created') {
        unifiedDataService.publish('activity_created', data);
      } else if (event === 'activity_updated') {
        unifiedDataService.publish('activity_updated', data);
      } else if (event === 'activity_progress_updated') {
        unifiedDataService.publish('activity_progress_updated', data);
      }
    });

    // Suscribirse a cambios en notificaciones
    const unsubscribeNotifications = notificationService.subscribe((event, data) => {
      console.log('Notification event:', event, data);
      
      // Sincronizar con el servicio unificado
      if (event === 'notification_created') {
        unifiedDataService.publish('notification_created', data);
      } else if (event === 'notification_read') {
        unifiedDataService.publish('notification_read', data);
      }
    });

    // Suscribirse a cambios del servicio unificado
    const unsubscribeUnified = unifiedDataService.subscribe('*', (data) => {
      console.log('Unified data event:', data);
      setLastSync(new Date());
    });

    unsubscribeFunctions = [
      unsubscribeActivities,
      unsubscribeNotifications,
      unsubscribeUnified
    ];

    setIsConnected(true);
    setLastSync(new Date());

    return () => {
      unsubscribeFunctions.forEach(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
      setIsConnected(false);
    };
  }, [user]);

  // Sincronizar datos del usuario actual
  useEffect(() => {
    if (!user) return;

    const syncUserData = async () => {
      try {
        const userData = unifiedDataService.syncUserData(user.id, user.role);
        console.log('User data synced:', userData);
      } catch (error) {
        console.error('Error syncing user data:', error);
      }
    };

    syncUserData();
  }, [user]);

  return (
    <div className="relative">
      {children}
      
      {/* Indicador de estado de sincronización - Posición menos intrusiva */}
      <div className="fixed top-4 left-4 z-40">
        <div className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs ${
          isConnected 
            ? 'bg-green-500/10 text-green-300 border border-green-500/20' 
            : 'bg-red-500/10 text-red-300 border border-red-500/20'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${
            isConnected ? 'bg-green-400' : 'bg-red-400'
          }`} />
          <span className="hidden sm:inline">
            {isConnected ? 'Sincronizado' : 'Desconectado'}
          </span>
          {lastSync && (
            <span className="text-xs opacity-60">
              {lastSync.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeSync;
