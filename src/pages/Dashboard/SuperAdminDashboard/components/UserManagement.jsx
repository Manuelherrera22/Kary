import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Shield, 
  Search, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Ban,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import unifiedDataService from '@/services/unifiedDataService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Obtener usuarios de todos los roles
      const students = unifiedDataService.getStudents().data || [];
      const teachers = unifiedDataService.getTeachers().data || [];
      const psychopedagogues = unifiedDataService.getPsychopedagogues().data || [];
      
      // Simular usuarios adicionales para el demo
      const allUsers = [
        ...students.map(user => ({ ...user, role: 'student' })),
        ...teachers.map(user => ({ ...user, role: 'teacher' })),
        ...psychopedagogues.map(user => ({ ...user, role: 'psychopedagogue' })),
        // Usuarios simulados adicionales
        {
          id: 'parent-1',
          name: 'María García',
          email: 'maria.garcia@parent.com',
          role: 'parent',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'directive-1',
          name: 'Dr. Carlos López',
          email: 'carlos.lopez@directive.com',
          role: 'directive',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: 'admin-1',
          name: 'Admin Sistema',
          email: 'admin@kary.com',
          role: 'super_admin',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date(Date.now() - 300000).toISOString()
        }
      ];

      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por rol
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'student':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'teacher':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'psychopedagogue':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'parent':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'directive':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'super_admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'student':
        return 'Estudiante';
      case 'teacher':
        return 'Profesor';
      case 'psychopedagogue':
        return 'Psicopedagogo';
      case 'parent':
        return 'Padre/Madre';
      case 'directive':
        return 'Directivo';
      case 'super_admin':
        return 'Super Admin';
      default:
        return role;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleUserAction = (action, userId) => {
    console.log(`Action: ${action} for user: ${userId}`);
    // Implementar acciones de usuario aquí
  };

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    pending: users.filter(u => u.status === 'pending').length,
    byRole: {
      students: users.filter(u => u.role === 'student').length,
      teachers: users.filter(u => u.role === 'teacher').length,
      psychopedagogues: users.filter(u => u.role === 'psychopedagogue').length,
      parents: users.filter(u => u.role === 'parent').length,
      directives: users.filter(u => u.role === 'directive').length,
      admins: users.filter(u => u.role === 'super_admin').length
    }
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas de Usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-300">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userStats.total}</div>
              <p className="text-xs text-blue-400">
                Registrados en el sistema
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-300">Usuarios Activos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userStats.active}</div>
              <p className="text-xs text-green-400">
                {Math.round((userStats.active / userStats.total) * 100)}% del total
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
              <CardTitle className="text-sm font-medium text-yellow-300">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userStats.pending}</div>
              <p className="text-xs text-yellow-400">
                Requieren aprobación
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-300">Inactivos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userStats.inactive}</div>
              <p className="text-xs text-red-400">
                Cuentas suspendidas
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filtros y Búsqueda */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-purple-400" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="student">Estudiantes</SelectItem>
                  <SelectItem value="teacher">Profesores</SelectItem>
                  <SelectItem value="psychopedagogue">Psicopedagogos</SelectItem>
                  <SelectItem value="parent">Padres</SelectItem>
                  <SelectItem value="directive">Directivos</SelectItem>
                  <SelectItem value="super_admin">Super Admins</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                </SelectContent>
              </Select>
              
              <Button className="bg-purple-600 hover:bg-purple-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Nuevo Usuario
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabla de Usuarios */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Lista de Usuarios ({filteredUsers.length})
            </CardTitle>
            <CardDescription className="text-slate-400">
              Gestión completa de usuarios del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Usuario</TableHead>
                    <TableHead className="text-slate-300">Rol</TableHead>
                    <TableHead className="text-slate-300">Estado</TableHead>
                    <TableHead className="text-slate-300">Último Acceso</TableHead>
                    <TableHead className="text-slate-300">Registro</TableHead>
                    <TableHead className="text-slate-300">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="border-slate-700 hover:bg-slate-700/30"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium">{user.name}</div>
                            <div className="text-slate-400 text-sm">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {getStatusLabel(user.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {user.lastLogin ? formatDate(user.lastLogin) : 'Nunca'}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-slate-800 border-slate-700">
                            <DropdownMenuItem 
                              onClick={() => handleUserAction('view', user.id)}
                              className="text-slate-300 hover:bg-slate-700"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleUserAction('edit', user.id)}
                              className="text-slate-300 hover:bg-slate-700"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleUserAction('toggle_status', user.id)}
                              className="text-slate-300 hover:bg-slate-700"
                            >
                              <Ban className="w-4 h-4 mr-2" />
                              {user.status === 'active' ? 'Desactivar' : 'Activar'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleUserAction('delete', user.id)}
                              className="text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserManagement;


