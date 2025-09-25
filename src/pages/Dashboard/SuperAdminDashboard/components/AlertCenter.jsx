import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Clock, 
  X, 
  RefreshCw,
  Filter,
  Search,
  Bell,
  BellOff,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const AlertCenter = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [alertSettings, setAlertSettings] = useState({
    notificationsEnabled: true,
    emailAlerts: true,
    criticalOnly: false,
    autoResolve: false
  });

  useEffect(() => {
    generateMockAlerts();
    const interval = setInterval(generateMockAlerts, 30000); // Generar nuevas alertas cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [alerts, searchTerm, severityFilter, statusFilter]);

  const generateMockAlerts = () => {
    const alertTypes = [
      { type: 'system_error', severity: 'critical', message: 'Error crítico en el sistema de base de datos' },
      { type: 'performance', severity: 'warning', message: 'Tiempo de respuesta elevado en API' },
      { type: 'security', severity: 'critical', message: 'Intento de acceso no autorizado detectado' },
      { type: 'user_activity', severity: 'info', message: 'Nuevo usuario registrado' },
      { type: 'resource', severity: 'warning', message: 'Uso de CPU elevado en servidor principal' },
      { type: 'network', severity: 'info', message: 'Conexión de red establecida' },
      { type: 'backup', severity: 'warning', message: 'Respaldo programado falló' },
      { type: 'maintenance', severity: 'info', message: 'Mantenimiento programado completado' }
    ];

    const newAlerts = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
      const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      return {
        id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: alertType.type,
        severity: alertType.severity,
        message: alertType.message,
        timestamp: new Date().toISOString(),
        status: Math.random() > 0.7 ? 'resolved' : 'active',
        source: ['API Gateway', 'Database', 'Auth Service', 'File Storage', 'Notification Service'][Math.floor(Math.random() * 5)],
        count: Math.floor(Math.random() * 10) + 1
      };
    });

    setAlerts(prev => [...newAlerts, ...prev].slice(0, 50)); // Mantener máximo 50 alertas
  };

  const filterAlerts = () => {
    let filtered = alerts;

    if (searchTerm) {
      filtered = filtered.filter(alert => 
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter(alert => alert.severity === severityFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(alert => alert.status === statusFilter);
    }

    setFilteredAlerts(filtered);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'info':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4" />;
      case 'info':
        return <Info className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'resolved':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'acknowledged':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <AlertTriangle className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'acknowledged':
        return <Clock className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    return `Hace ${diffDays} días`;
  };

  const handleAlertAction = (action, alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: action === 'resolve' ? 'resolved' : 'acknowledged' }
        : alert
    ));
  };

  const alertStats = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    warning: alerts.filter(a => a.severity === 'warning').length,
    info: alerts.filter(a => a.severity === 'info').length
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas de Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-300">Alertas Activas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{alertStats.active}</div>
              <p className="text-xs text-red-400">
                Requieren atención
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-300">Críticas</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{alertStats.critical}</div>
              <p className="text-xs text-yellow-400">
                Máxima prioridad
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-300">Resueltas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{alertStats.resolved}</div>
              <p className="text-xs text-green-400">
                Últimas 24h
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-300">Total Alertas</CardTitle>
              <Bell className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{alertStats.total}</div>
              <p className="text-xs text-blue-400">
                En el sistema
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Configuración de Alertas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-400" />
              Configuración de Alertas
            </CardTitle>
            <CardDescription className="text-slate-400">
              Configurar notificaciones y comportamiento de alertas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-slate-300 font-medium">Notificaciones Habilitadas</label>
                    <p className="text-slate-400 text-sm">Recibir notificaciones en tiempo real</p>
                  </div>
                  <Switch
                    checked={alertSettings.notificationsEnabled}
                    onCheckedChange={(checked) => setAlertSettings(prev => ({ ...prev, notificationsEnabled: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-slate-300 font-medium">Alertas por Email</label>
                    <p className="text-slate-400 text-sm">Enviar alertas críticas por correo</p>
                  </div>
                  <Switch
                    checked={alertSettings.emailAlerts}
                    onCheckedChange={(checked) => setAlertSettings(prev => ({ ...prev, emailAlerts: checked }))}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-slate-300 font-medium">Solo Críticas</label>
                    <p className="text-slate-400 text-sm">Mostrar únicamente alertas críticas</p>
                  </div>
                  <Switch
                    checked={alertSettings.criticalOnly}
                    onCheckedChange={(checked) => setAlertSettings(prev => ({ ...prev, criticalOnly: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-slate-300 font-medium">Auto-resolución</label>
                    <p className="text-slate-400 text-sm">Resolver alertas automáticamente</p>
                  </div>
                  <Switch
                    checked={alertSettings.autoResolve}
                    onCheckedChange={(checked) => setAlertSettings(prev => ({ ...prev, autoResolve: checked }))}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-purple-400" />
              Filtros de Alertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar alertas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Filtrar por severidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las severidades</SelectItem>
                  <SelectItem value="critical">Críticas</SelectItem>
                  <SelectItem value="warning">Advertencias</SelectItem>
                  <SelectItem value="info">Informativas</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activas</SelectItem>
                  <SelectItem value="resolved">Resueltas</SelectItem>
                  <SelectItem value="acknowledged">Reconocidas</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={() => setAlerts([])} 
                variant="outline" 
                className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
              >
                <X className="w-4 h-4 mr-2" />
                Limpiar Todo
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lista de Alertas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-400" />
              Alertas del Sistema ({filteredAlerts.length})
            </CardTitle>
            <CardDescription className="text-slate-400">
              Monitoreo en tiempo real de alertas del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <BellOff className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400">No hay alertas que coincidan con los filtros</p>
                </div>
              ) : (
                filteredAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                        {getSeverityIcon(alert.severity)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium">{alert.message}</span>
                          {alert.count > 1 && (
                            <Badge variant="secondary" className="bg-slate-600/50 text-slate-300">
                              {alert.count}x
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>Fuente: {alert.source}</span>
                          <span>•</span>
                          <span>{formatTimestamp(alert.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(alert.status)}>
                        {alert.status === 'active' ? 'Activa' : 
                         alert.status === 'resolved' ? 'Resuelta' : 'Reconocida'}
                      </Badge>
                      
                      {alert.status === 'active' && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAlertAction('acknowledge', alert.id)}
                            className="bg-slate-600/50 border-slate-500 text-slate-300 hover:bg-slate-500"
                          >
                            Reconocer
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAlertAction('resolve', alert.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Resolver
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AlertCenter;


