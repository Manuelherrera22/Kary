import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, UserPlus, Filter, BarChart3, UserCheck, UserX, GraduationCap, Shield, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import CreateStudentForm from '../components/CreateStudentForm'; 
import UserTable from './components/UserTable';
import ConfirmActionModal from './components/ConfirmActionModal';
import { useUserManagement } from './hooks/useUserManagement';
import LoadingScreen from '@/pages/Dashboard/components/LoadingScreen';

const UserManagementPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { users, userStats, isLoading, fetchUsers, toggleUserStatus, deleteUser, handleActionConfirmed } = useUserManagement();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isCreateStudentModalOpen, setIsCreateStudentModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionToPerform, setActionToPerform] = useState(null);
  const [userToConfirm, setUserToConfirm] = useState(null);
  const [currentActionName, setCurrentActionName] = useState('');


  const handleStudentCreatedOrUpdated = () => {
    fetchUsers(); 
    setIsCreateStudentModalOpen(false);
    setEditingUser(null);
  };
  
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchTerm || 
        (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.department?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesRole = selectedRole === 'all' || user.role === selectedRole;
      const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, selectedRole, selectedStatus]);

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsCreateStudentModalOpen(true); 
  };
  
  const openConfirmModal = (user, actionCallback) => {
    setUserToConfirm(user);
    setActionToPerform(() => actionCallback); 
    
    if (actionCallback.name === 'toggleUserStatus') {
      setCurrentActionName(user.status === 'active' ? t('dashboards.directive.userManagement.suspendUser') : t('dashboards.directive.userManagement.activateUser'));
    } else if (actionCallback.name === 'deleteUser') {
      setCurrentActionName(t('common.deleteButton'));
    } else {
      setCurrentActionName(t('common.genericAction')); 
    }
    setIsConfirmModalOpen(true);
  };

  if (isLoading) {
    return <LoadingScreen text={t('common.loadingText')} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-gradient-to-br from-purple-700 via-pink-700 to-orange-600 min-h-screen text-white"
    >
      <div className="container mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center text-purple-300 hover:text-purple-100 mb-6 transition-colors group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          {t('common.backToDashboard')}
        </button>

        <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div className="flex items-center mb-4 sm:mb-0">
              <Users size={36} className="mr-4 text-orange-300" />
              <div>
                <h1 className="text-3xl font-bold">{t('dashboards.directive.userManagement.pageTitle')}</h1>
                <p className="text-purple-200">{t('dashboards.directive.userManagement.pageSubtitle')}</p>
              </div>
            </div>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => { setEditingUser(null); setIsCreateStudentModalOpen(true); }}
            >
              <UserPlus size={18} className="mr-2" /> {t('dashboards.directive.userManagement.createButton')}
            </Button>
          </div>

          {/* Información Institucional */}
          <div className="mb-6">
            <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-500/20 p-3 rounded-lg mr-4">
                      <Shield className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-blue-200">Institución Educativa San Luis Gonzaga</h3>
                      <p className="text-blue-300 text-sm">Calle 123 #45-67, Bogotá, Colombia</p>
                      <p className="text-blue-300 text-sm">Tel: +57 (1) 234-5678 | Email: info@sanluisgonzaga.edu.co</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-100">{users.length}</p>
                    <p className="text-blue-300 text-sm">Usuarios Totales</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estadísticas por Roles */}
          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-200 text-sm font-medium">Directivos</p>
                        <p className="text-2xl font-bold text-blue-100">{userStats.directive?.total || 0}</p>
                        <p className="text-blue-300 text-xs">{userStats.directive?.active || 0} activos</p>
                      </div>
                      <Shield className="h-8 w-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-200 text-sm font-medium">Docentes</p>
                        <p className="text-2xl font-bold text-green-100">{userStats.teacher?.total || 0}</p>
                        <p className="text-green-300 text-xs">{userStats.teacher?.active || 0} activos</p>
                      </div>
                      <GraduationCap className="h-8 w-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-200 text-sm font-medium">Estudiantes</p>
                        <p className="text-2xl font-bold text-purple-100">{userStats.student?.total || 0}</p>
                        <p className="text-purple-300 text-xs">{userStats.student?.active || 0} activos</p>
                      </div>
                      <Users className="h-8 w-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-200 text-sm font-medium">Acudientes</p>
                        <p className="text-2xl font-bold text-orange-100">{userStats.parent?.total || 0}</p>
                        <p className="text-orange-300 text-xs">{userStats.parent?.active || 0} activos</p>
                      </div>
                      <Heart className="h-8 w-8 text-orange-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-gradient-to-br from-teal-500/20 to-teal-600/20 border-teal-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-teal-200 text-sm font-medium">Psicopedagogos</p>
                        <p className="text-2xl font-bold text-teal-100">{userStats.psychopedagogue?.total || 0}</p>
                        <p className="text-teal-300 text-xs">{userStats.psychopedagogue?.active || 0} activos</p>
                      </div>
                      <UserCheck className="h-8 w-8 text-teal-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Filtros */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="text"
              placeholder={t('dashboards.directive.userManagement.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/20 placeholder-purple-300 border-purple-500/50 focus:border-orange-400 focus:ring-orange-400"
            />
            
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="bg-white/20 border-purple-500/50 focus:border-orange-400 focus:ring-orange-400 text-white">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600 text-white">
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="directive">Directivos</SelectItem>
                <SelectItem value="teacher">Docentes</SelectItem>
                <SelectItem value="student">Estudiantes</SelectItem>
                <SelectItem value="parent">Acudientes</SelectItem>
                <SelectItem value="psychopedagogue">Psicopedagogos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-white/20 border-purple-500/50 focus:border-orange-400 focus:ring-orange-400 text-white">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600 text-white">
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="suspended">Suspendidos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <UserTable 
            users={filteredUsers} 
            onEditUser={openEditModal}
            onConfirmAction={openConfirmModal}
            onToggleUserStatus={toggleUserStatus}
            onDeleteUser={deleteUser}
          />
        </div>
      </div>

      <Dialog open={isCreateStudentModalOpen} onOpenChange={(isOpen) => {
        setIsCreateStudentModalOpen(isOpen);
        if (!isOpen) setEditingUser(null);
      }}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>{editingUser ? t('dashboards.directive.userManagement.editTitle') : t('dashboards.directive.userManagement.createTitle')}</DialogTitle>
            <DialogDescription>
              {editingUser ? t('dashboards.directive.userManagement.editDesc') : t('dashboards.directive.userManagement.createDesc')}
            </DialogDescription>
          </DialogHeader>
          <CreateStudentForm 
            onStudentCreated={handleStudentCreatedOrUpdated} 
            onStudentUpdated={handleStudentCreatedOrUpdated}
            existingStudentData={editingUser}
            setIsOpen={setIsCreateStudentModalOpen}
          />
        </DialogContent>
      </Dialog>

      <ConfirmActionModal 
        isOpen={isConfirmModalOpen}
        onOpenChange={setIsConfirmModalOpen}
        onConfirm={() => handleActionConfirmed(userToConfirm, actionToPerform, setIsConfirmModalOpen, setUserToConfirm, setActionToPerform)}
        userName={userToConfirm?.full_name}
        actionName={currentActionName}
      />

    </motion.div>
  );
};

export default UserManagementPage;