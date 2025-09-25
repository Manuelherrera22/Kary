import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Eye, 
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Server,
  User,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('1h');
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    generateMockLogs();
    let interval;
    if (isLive) {
      interval = setInterval(generateMockLogs, 2000); // Generar logs cada 2 segundos
    }
    return () => clearInterval(interval);
  }, [isLive]);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, levelFilter, serviceFilter]);

  const generateMockLogs = () => {
    const logLevels = ['info', 'warn', 'error', 'debug'];
    const services = ['API Gateway', 'Auth Service', 'Database', 'File Storage', 'Notification Service', 'Analytics Engine'];
    const actions = [
      'User login successful',
      'Database query executed',
      'File uploaded successfully',
      'Notification sent',
      'Cache updated',
      'Authentication failed',
      'Rate limit exceeded',
      'System maintenance started',
      'Backup completed',
      'Error in data processing',
      'User session expired',
      'API request processed',
      'Database connection established',
      'File deleted',
      'System health check passed'
    ];

    const newLogs = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
      const level = logLevels[Math.floor(Math.random() * logLevels.length)];
      const service = services[Math.floor(Math.random() * services.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      
      return {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        level,
        service,
        message: action,
        userId: Math.random() > 0.5 ? `user-${Math.floor(Math.random() * 1000)}` : null,
        requestId: `req-${Math.random().toString(36).substr(2, 8)}`,
        duration: level === 'error' ? null : Math.floor(Math.random() * 500) + 10,
        statusCode: level === 'error' ? Math.floor(Math.random() * 3) + 400 : Math.floor(Math.random() * 2) + 200
      };
    });

    setLogs(prev => [...newLogs, ...prev].slice(0, 1000)); // Mantener máximo 1000 logs
  };

  const filterLogs = () => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.userId && log.userId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    if (serviceFilter !== 'all') {
      filtered = filtered.filter(log => log.service === serviceFilter);
    }

    setFilteredLogs(filtered);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'error':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'warn':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'info':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'debug':
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      case 'warn':
        return <AlertTriangle className="w-4 h-4" />;
      case 'info':
        return <Info className="w-4 h-4" />;
      case 'debug':
        return <Activity className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const getStatusCodeColor = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) return 'text-green-400';
    if (statusCode >= 300 && statusCode < 400) return 'text-blue-400';
    if (statusCode >= 400 && statusCode < 500) return 'text-yellow-400';
    if (statusCode >= 500) return 'text-red-400';
    return 'text-slate-400';
  };

  const logStats = {
    total: logs.length,
    errors: logs.filter(l => l.level === 'error').length,
    warnings: logs.filter(l => l.level === 'warn').length,
    info: logs.filter(l => l.level === 'info').length,
    debug: logs.filter(l => l.level === 'debug').length
  };

  const exportLogs = () => {
    const csvContent = [
      'Timestamp,Level,Service,Message,User ID,Request ID,Duration,Status Code',
      ...filteredLogs.map(log => 
        `${log.timestamp},${log.level},${log.service},"${log.message}",${log.userId || ''},${log.requestId},${log.duration || ''},${log.statusCode}`
      ).join('\n')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kary-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas de Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-300">Total Logs</CardTitle>
              <Database className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{logStats.total}</div>
              <p className="text-xs text-blue-400">
                En memoria
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-300">Errores</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{logStats.errors}</div>
              <p className="text-xs text-red-400">
                Requieren atención
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-300">Advertencias</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{logStats.warnings}</div>
              <p className="text-xs text-yellow-400">
                Monitorear
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-300">Info</CardTitle>
              <Info className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{logStats.info}</div>
              <p className="text-xs text-green-400">
                Operaciones normales
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-slate-900/20 to-slate-800/20 border-slate-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Debug</CardTitle>
              <Activity className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{logStats.debug}</div>
              <p className="text-xs text-slate-400">
                Información detallada
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Controles de Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-purple-400" />
              Controles de Logs
            </CardTitle>
            <CardDescription className="text-slate-400">
              Filtrar y configurar la visualización de logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar en logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los niveles</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warn">Advertencia</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Servicio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los servicios</SelectItem>
                  <SelectItem value="API Gateway">API Gateway</SelectItem>
                  <SelectItem value="Auth Service">Auth Service</SelectItem>
                  <SelectItem value="Database">Database</SelectItem>
                  <SelectItem value="File Storage">File Storage</SelectItem>
                  <SelectItem value="Notification Service">Notification Service</SelectItem>
                  <SelectItem value="Analytics Engine">Analytics Engine</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Rango de tiempo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Última hora</SelectItem>
                  <SelectItem value="6h">Últimas 6 horas</SelectItem>
                  <SelectItem value="24h">Últimas 24 horas</SelectItem>
                  <SelectItem value="7d">Últimos 7 días</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsLive(!isLive)}
                  variant={isLive ? "default" : "outline"}
                  className={isLive ? "bg-green-600 hover:bg-green-700" : "bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLive ? 'animate-spin' : ''}`} />
                  {isLive ? 'En Vivo' : 'Pausar'}
                </Button>
                <Button
                  onClick={exportLogs}
                  variant="outline"
                  className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Visualizador de Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-400" />
              Logs del Sistema ({filteredLogs.length})
            </CardTitle>
            <CardDescription className="text-slate-400">
              Monitoreo en tiempo real de logs del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 w-full">
              <div className="space-y-2">
                {filteredLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <Database className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">No hay logs que coincidan con los filtros</p>
                  </div>
                ) : (
                  filteredLogs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:bg-slate-700/50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${getLevelColor(log.level)}`}>
                        {getLevelIcon(log.level)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium truncate">{log.message}</span>
                          <Badge variant="secondary" className="bg-slate-600/50 text-slate-300 text-xs">
                            {log.service}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(log.timestamp)}
                          </span>
                          {log.userId && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {log.userId}
                              </span>
                            </>
                          )}
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Server className="w-3 h-3" />
                            {log.requestId}
                          </span>
                          {log.duration && (
                            <>
                              <span>•</span>
                              <span>{log.duration}ms</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getStatusCodeColor(log.statusCode)}`}>
                          {log.statusCode}
                        </Badge>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SystemLogs;


